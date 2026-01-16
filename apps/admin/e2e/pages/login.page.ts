import { Page, Locator, expect } from "@playwright/test";

/**
 * Admin Dashboard Login Page Object Model
 *
 * Encapsulates the login page elements and actions for reusable test code.
 */
export class LoginPage {
  readonly page: Page;

  // Selectors
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly showPasswordToggle: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly logo: Locator;
  readonly pageTitle: Locator;
  readonly twoFactorInput: Locator;
  readonly submitTwoFactorButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form elements
    this.emailInput = page.locator(
      'input[name="email"], input[type="email"], #email',
    );
    this.passwordInput = page.locator(
      'input[name="password"], input[type="password"], #password',
    );
    this.loginButton = page.locator(
      'button[type="submit"]:has-text("Login"), button[type="submit"]:has-text("Sign In"), button:has-text("Login")',
    );
    this.forgotPasswordLink = page.locator(
      'a:has-text("Forgot Password"), a:has-text("Reset Password")',
    );
    this.errorMessage = page.locator(
      '[role="alert"], .error-message, .alert-error, [data-testid="error"]',
    );
    this.successMessage = page.locator(
      '.success-message, .alert-success, [data-testid="success"]',
    );
    this.showPasswordToggle = page.locator(
      'button[aria-label="Toggle password visibility"], .password-toggle, [data-testid="toggle-password"]',
    );
    this.rememberMeCheckbox = page.locator(
      'input[name="remember"], input[type="checkbox"][name*="remember"]',
    );
    this.logo = page.locator('[data-testid="logo"], .logo, img[alt*="logo" i]');
    this.pageTitle = page.locator('h1, h2, [data-testid="page-title"]');

    // Two-factor authentication
    this.twoFactorInput = page.locator(
      'input[name="code"], input[name="otp"], [data-testid="2fa-input"]',
    );
    this.submitTwoFactorButton = page.locator(
      'button:has-text("Verify"), button:has-text("Submit")',
    );
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto("/login");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Perform login action
   */
  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (rememberMe && (await this.rememberMeCheckbox.isVisible())) {
      await this.rememberMeCheckbox.check();
    }

    await this.loginButton.click();
  }

  /**
   * Submit two-factor authentication code
   */
  async submitTwoFactorCode(code: string) {
    await this.twoFactorInput.fill(code);
    await this.submitTwoFactorButton.click();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
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
    await this.page.waitForURL(/\/(dashboard|home|admin)/, { timeout: 10000 });
  }

  /**
   * Wait for 2FA prompt
   */
  async waitForTwoFactorPrompt() {
    await this.twoFactorInput.waitFor({ state: "visible", timeout: 10000 });
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: "visible", timeout: 5000 });
    return (await this.errorMessage.textContent()) || "";
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: "visible", timeout: 5000 });
    return (await this.successMessage.textContent()) || "";
  }

  /**
   * Check if logged in (by checking for redirect or token)
   */
  async isLoggedIn(): Promise<boolean> {
    const currentUrl = this.page.url();
    return !currentUrl.includes("/login");
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
    const validationError = this.page.locator(
      `[name="${fieldName}"] ~ .error, ` +
        `[name="${fieldName}"] + .error, ` +
        `[data-testid="${fieldName}-error"], ` +
        `.field-error[data-field="${fieldName}"]`,
    );
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
    const type = await this.passwordInput.getAttribute("type");
    return type === "text";
  }

  /**
   * Get stored authentication token from localStorage
   */
  async getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => {
      return (
        localStorage.getItem("admin_access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token")
      );
    });
  }

  /**
   * Get stored user data from localStorage
   */
  async getStoredUser(): Promise<any> {
    return await this.page.evaluate(() => {
      const user =
        localStorage.getItem("admin_user") || localStorage.getItem("user");
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
      localStorage.setItem("admin_access_token", token);
    }, token);
  }

  /**
   * Check if the login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Wait for login button to be enabled
   */
  async waitForLoginButtonEnabled() {
    await expect(this.loginButton).toBeEnabled();
  }

  /**
   * Check if 2FA is required
   */
  async isTwoFactorRequired(): Promise<boolean> {
    return await this.twoFactorInput.isVisible().catch(() => false);
  }
}
