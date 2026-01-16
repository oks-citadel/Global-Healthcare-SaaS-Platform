import { Page, Locator, expect } from '@playwright/test';

/**
 * Login Page Object Model
 *
 * Encapsulates the login page elements and actions for reusable test code.
 */
export class LoginPage {
  readonly page: Page;

  // Selectors
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly showPasswordToggle: Locator;
  readonly rememberMeCheckbox: Locator;

  // Registration form selectors
  readonly registerEmailInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly registerConfirmPasswordInput: Locator;
  readonly registerFirstNameInput: Locator;
  readonly registerLastNameInput: Locator;
  readonly registerPhoneInput: Locator;
  readonly registerButton: Locator;
  readonly termsCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form elements
    this.emailInput = page.locator('input[name="email"], input[type="email"], #email');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login"), button:has-text("Sign In")');
    this.registerLink = page.locator('a:has-text("Register"), a:has-text("Sign Up")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password")');
    this.errorMessage = page.locator('[role="alert"], .error-message, .alert-error');
    this.successMessage = page.locator('.success-message, .alert-success');
    this.showPasswordToggle = page.locator('button[aria-label="Toggle password visibility"], .password-toggle');
    this.rememberMeCheckbox = page.locator('input[name="remember"], input[type="checkbox"]:has-text("Remember")');

    // Registration form elements
    this.registerEmailInput = page.locator('input[name="email"][placeholder*="email" i]');
    this.registerPasswordInput = page.locator('input[name="password"][placeholder*="password" i]');
    this.registerConfirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="password_confirmation"]');
    this.registerFirstNameInput = page.locator('input[name="firstName"], input[name="first_name"]');
    this.registerLastNameInput = page.locator('input[name="lastName"], input[name="last_name"]');
    this.registerPhoneInput = page.locator('input[name="phone"], input[name="phoneNumber"]');
    this.registerButton = page.locator('button[type="submit"]:has-text("Register"), button:has-text("Sign Up")');
    this.termsCheckbox = page.locator('input[type="checkbox"][name*="terms"]');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to registration page
   */
  async gotoRegister() {
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform login action
   */
  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }

    await this.loginButton.click();
  }

  /**
   * Perform registration action
   */
  async register(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    acceptTerms?: boolean;
  }) {
    await this.registerFirstNameInput.fill(userData.firstName);
    await this.registerLastNameInput.fill(userData.lastName);
    await this.registerEmailInput.fill(userData.email);

    if (userData.phone) {
      await this.registerPhoneInput.fill(userData.phone);
    }

    await this.registerPasswordInput.fill(userData.password);
    await this.registerConfirmPasswordInput.fill(userData.confirmPassword);

    if (userData.acceptTerms !== false) {
      await this.termsCheckbox.check();
    }

    await this.registerButton.click();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click register link from login page
   */
  async clickRegisterLink() {
    await this.registerLink.click();
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility() {
    await this.showPasswordToggle.click();
  }

  /**
   * Wait for login to complete and redirect
   */
  async waitForLoginSuccess() {
    // Wait for navigation to dashboard or home page
    await this.page.waitForURL(/\/(dashboard|home)/, { timeout: 10000 });
  }

  /**
   * Wait for registration to complete
   */
  async waitForRegistrationSuccess() {
    // Wait for navigation to login page or dashboard
    await this.page.waitForURL(/\/(login|dashboard|verify-email)/, { timeout: 10000 });
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.successMessage.textContent() || '';
  }

  /**
   * Check if logged in (by checking for redirect or token)
   */
  async isLoggedIn(): Promise<boolean> {
    // Check if redirected away from login page
    const currentUrl = this.page.url();
    return !currentUrl.includes('/login');
  }

  /**
   * Assert login page is displayed
   */
  async assertLoginPageDisplayed() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert registration page is displayed
   */
  async assertRegisterPageDisplayed() {
    await expect(this.registerEmailInput).toBeVisible();
    await expect(this.registerPasswordInput).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }

  /**
   * Assert error is displayed
   */
  async assertErrorDisplayed(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  /**
   * Assert validation error on field
   */
  async assertFieldValidationError(fieldName: string) {
    const validationError = this.page.locator(`[name="${fieldName}"] ~ .error, [name="${fieldName}"] + .error`);
    await expect(validationError).toBeVisible();
  }

  /**
   * Fill login form without submitting
   */
  async fillLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Clear login form
   */
  async clearLoginForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if password is visible (not masked)
   */
  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }

  /**
   * Get stored authentication token from localStorage
   */
  async getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => {
      return localStorage.getItem('accessToken') || localStorage.getItem('token');
    });
  }

  /**
   * Get stored user data from localStorage
   */
  async getStoredUser(): Promise<any> {
    return await this.page.evaluate(() => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    });
  }

  /**
   * Clear all stored authentication data
   */
  async clearAuthData() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Set authentication token (for testing authenticated states)
   */
  async setAuthToken(token: string) {
    await this.page.evaluate((token) => {
      localStorage.setItem('accessToken', token);
    }, token);
  }
}
