/**
 * Login Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { selectors, routes } from '../fixtures/test-data';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get loginForm(): Locator {
    return this.page.locator(selectors.loginForm);
  }

  get emailInput(): Locator {
    return this.page.locator(selectors.emailInput);
  }

  get passwordInput(): Locator {
    return this.page.locator(selectors.passwordInput);
  }

  get submitButton(): Locator {
    return this.page.locator(selectors.submitButton);
  }

  get forgotPasswordLink(): Locator {
    return this.page.locator(selectors.forgotPasswordLink);
  }

  get registerLink(): Locator {
    return this.page.locator('a[href*="register"]');
  }

  get passwordVisibilityToggle(): Locator {
    return this.page.locator('[data-testid="password-toggle"], [aria-label*="password visibility"]');
  }

  get rememberMeCheckbox(): Locator {
    return this.page.locator('input[name="rememberMe"], input[type="checkbox"]');
  }

  // Actions
  async navigate(): Promise<void> {
    await this.goto(routes.web.login);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordVisibilityToggle.click();
  }

  async checkRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }

  async uncheckRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.uncheck();
  }

  async clickLogin(): Promise<void> {
    await this.submitButton.click();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }

  /**
   * Complete login flow
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.waitForLoadingToComplete();
  }

  /**
   * Login and wait for dashboard
   */
  async loginAndWaitForDashboard(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.page.waitForURL(/\/(dashboard|home)/, { timeout: 30000 });
  }

  // Assertions
  async expectLoginFormVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectErrorMessage(message?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async expectPasswordToBeHidden(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  async expectPasswordToBeVisible(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'text');
  }

  async expectEmailValidationError(): Promise<void> {
    // Check for validation error near email field
    const emailError = this.page.locator('[data-testid="email-error"], .email-error, input[name="email"]:invalid');
    await expect(emailError).toBeVisible();
  }

  async expectPasswordValidationError(): Promise<void> {
    const passwordError = this.page.locator('[data-testid="password-error"], .password-error, input[name="password"]:invalid');
    await expect(passwordError).toBeVisible();
  }

  // Keyboard navigation
  async loginWithKeyboard(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.pressKey('Tab');
    await this.passwordInput.fill(password);
    await this.pressKey('Enter');
  }

  // Form validation helpers
  async getEmailValidationMessage(): Promise<string> {
    return await this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  }

  async getPasswordValidationMessage(): Promise<string> {
    return await this.passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
