/**
 * Base Page Object Model
 * Common functionality shared across all page objects
 */

import { Page, Locator, expect } from '@playwright/test';
import { selectors } from '../fixtures/test-data';

export abstract class BasePage {
  protected readonly _page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this._page = page;
    this.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  }

  // Public getter for the underlying page (for advanced test scenarios)
  get page(): Page {
    return this._page;
  }

  // Common element getters
  get loadingSpinner(): Locator {
    return this._page.locator(selectors.loadingSpinner);
  }

  get errorMessage(): Locator {
    return this._page.locator(selectors.errorMessage);
  }

  get successMessage(): Locator {
    return this._page.locator(selectors.successMessage);
  }

  get sidebar(): Locator {
    return this._page.locator(selectors.sidebar);
  }

  get userMenu(): Locator {
    return this._page.locator(selectors.userMenu);
  }

  // Navigation helpers
  async goto(path: string = '/'): Promise<void> {
    await this._page.goto(path, { waitUntil: 'networkidle' });
  }

  async waitForPageLoad(): Promise<void> {
    await this._page.waitForLoadState('networkidle');
  }

  async waitForLoadingToComplete(): Promise<void> {
    // Wait for any loading spinners to disappear
    const spinner = this.loadingSpinner;
    if (await spinner.isVisible({ timeout: 1000 }).catch(() => false)) {
      await spinner.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  // Common actions
  async click(selector: string): Promise<void> {
    await this._page.click(selector);
  }

  async fill(selector: string, value: string): Promise<void> {
    await this._page.fill(selector, value);
  }

  async selectOption(selector: string, value: string): Promise<void> {
    await this._page.selectOption(selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await this._page.textContent(selector) || '';
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this._page.isVisible(selector);
  }

  async waitForSelector(selector: string, options: { timeout?: number; state?: 'attached' | 'detached' | 'visible' | 'hidden' } = {}): Promise<void> {
    await this._page.waitForSelector(selector, options);
  }

  // Screenshot helpers
  async takeScreenshot(name: string): Promise<void> {
    await this._page.screenshot({
      path: `./reports/ui/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  // Assertion helpers
  async expectToBeVisible(selector: string): Promise<void> {
    await expect(this._page.locator(selector)).toBeVisible();
  }

  async expectToHaveText(selector: string, text: string): Promise<void> {
    await expect(this._page.locator(selector)).toHaveText(text);
  }

  async expectToHaveValue(selector: string, value: string): Promise<void> {
    await expect(this._page.locator(selector)).toHaveValue(value);
  }

  async expectUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  // Toast/notification helpers
  async waitForToast(type: 'success' | 'error' = 'success'): Promise<string> {
    const selector = type === 'success' ? selectors.successMessage : selectors.errorMessage;
    await this.waitForSelector(selector, { state: 'visible', timeout: 10000 });
    return await this.getText(selector);
  }

  async dismissToast(): Promise<void> {
    const toastCloseButton = this._page.locator('[data-testid="toast-close"], .toast-close');
    if (await toastCloseButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await toastCloseButton.click();
    }
  }

  // Form helpers
  async submitForm(): Promise<void> {
    await this._page.click(selectors.submitButton);
  }

  async cancelForm(): Promise<void> {
    await this._page.click(selectors.cancelButton);
  }

  // Accessibility helpers
  async checkAccessibility(): Promise<void> {
    // This requires axe-playwright to be imported in the test
    // Use in tests: await new AxeBuilder({ page }).analyze()
  }

  // Keyboard navigation helpers
  async pressKey(key: string): Promise<void> {
    await this._page.keyboard.press(key);
  }

  async tabToElement(selector: string): Promise<void> {
    while (!(await this._page.locator(selector).evaluate(el => el === document.activeElement))) {
      await this.pressKey('Tab');
    }
  }

  // User menu actions
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this._page.click(selectors.logoutButton);
  }

  // Wait for API response
  async waitForApiResponse(urlPattern: string | RegExp): Promise<void> {
    await this._page.waitForResponse(urlPattern);
  }

  // Network interception
  async interceptRequest(urlPattern: string | RegExp, handler: (route: any) => void): Promise<void> {
    await this._page.route(urlPattern, handler);
  }

  // Storage helpers
  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this._page.evaluate((k) => localStorage.getItem(k), key);
  }

  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this._page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
  }
}
