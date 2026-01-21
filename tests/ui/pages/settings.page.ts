/**
 * Settings Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { selectors, routes } from '../fixtures/test-data';

export class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get settingsForm(): Locator {
    return this.page.locator(selectors.settingsForm);
  }

  // Account section
  get emailInput(): Locator {
    return this.page.locator('input[name="email"]');
  }

  get currentPasswordInput(): Locator {
    return this.page.locator('input[name="currentPassword"]');
  }

  get newPasswordInput(): Locator {
    return this.page.locator('input[name="newPassword"]');
  }

  get confirmPasswordInput(): Locator {
    return this.page.locator('input[name="confirmPassword"]');
  }

  get changePasswordButton(): Locator {
    return this.page.locator(selectors.changePasswordButton);
  }

  // Notification preferences
  get emailNotificationsToggle(): Locator {
    return this.page.locator('[data-testid="email-notifications-toggle"], input[name="emailNotifications"]');
  }

  get smsNotificationsToggle(): Locator {
    return this.page.locator('[data-testid="sms-notifications-toggle"], input[name="smsNotifications"]');
  }

  get pushNotificationsToggle(): Locator {
    return this.page.locator('[data-testid="push-notifications-toggle"], input[name="pushNotifications"]');
  }

  get appointmentRemindersToggle(): Locator {
    return this.page.locator('[data-testid="appointment-reminders-toggle"], input[name="appointmentReminders"]');
  }

  // Privacy settings
  get dataSharingToggle(): Locator {
    return this.page.locator('[data-testid="data-sharing-toggle"], input[name="dataSharing"]');
  }

  get marketingToggle(): Locator {
    return this.page.locator('[data-testid="marketing-toggle"], input[name="marketing"]');
  }

  // Language and accessibility
  get languageSelect(): Locator {
    return this.page.locator('select[name="language"], [data-testid="language-select"]');
  }

  get timezoneSelect(): Locator {
    return this.page.locator('select[name="timezone"], [data-testid="timezone-select"]');
  }

  // Actions
  get saveButton(): Locator {
    return this.page.locator('button[type="submit"], [data-testid="save-settings"]');
  }

  get cancelButton(): Locator {
    return this.page.locator('[data-testid="cancel-changes"]');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.goto(routes.web.settings);
    await this.waitForLoadingToComplete();
  }

  // Tab navigation (if settings has tabs)
  async navigateToTab(tabName: string): Promise<void> {
    const tab = this.page.locator(`[role="tab"]:has-text("${tabName}"), a:has-text("${tabName}")`);
    await tab.click();
    await this.waitForLoadingToComplete();
  }

  // Email change
  async changeEmail(newEmail: string, currentPassword: string): Promise<void> {
    await this.emailInput.fill(newEmail);

    // May need current password for email change
    const passwordPrompt = this.currentPasswordInput;
    if (await passwordPrompt.isVisible()) {
      await passwordPrompt.fill(currentPassword);
    }

    await this.saveButton.click();
    await this.waitForLoadingToComplete();
  }

  // Password change
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Click change password button if it opens a form
    if (await this.changePasswordButton.isVisible()) {
      await this.changePasswordButton.click();
      await this.page.waitForTimeout(300);
    }

    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);

    await this.saveButton.click();
    await this.waitForLoadingToComplete();
  }

  // Notification toggles
  async toggleEmailNotifications(): Promise<void> {
    await this.emailNotificationsToggle.click();
  }

  async toggleSmsNotifications(): Promise<void> {
    await this.smsNotificationsToggle.click();
  }

  async togglePushNotifications(): Promise<void> {
    await this.pushNotificationsToggle.click();
  }

  async toggleAppointmentReminders(): Promise<void> {
    await this.appointmentRemindersToggle.click();
  }

  // Privacy toggles
  async toggleDataSharing(): Promise<void> {
    await this.dataSharingToggle.click();
  }

  async toggleMarketing(): Promise<void> {
    await this.marketingToggle.click();
  }

  // Language and timezone
  async setLanguage(language: string): Promise<void> {
    await this.languageSelect.selectOption(language);
  }

  async setTimezone(timezone: string): Promise<void> {
    await this.timezoneSelect.selectOption(timezone);
  }

  // Save changes
  async saveSettings(): Promise<void> {
    await this.saveButton.click();
    await this.waitForLoadingToComplete();
  }

  async cancelChanges(): Promise<void> {
    await this.cancelButton.click();
  }

  // Account deletion
  async deleteAccount(): Promise<void> {
    const deleteButton = this.page.locator('button:has-text("Delete Account"), [data-testid="delete-account"]');
    await deleteButton.click();

    // Confirm deletion
    const confirmInput = this.page.locator('input[placeholder*="DELETE"], input[name="confirmDelete"]');
    if (await confirmInput.isVisible()) {
      await confirmInput.fill('DELETE');
    }

    const confirmButton = this.page.locator('[role="dialog"] button:has-text("Delete"), [data-testid="confirm-delete"]');
    await confirmButton.click();
  }

  // Export data (GDPR)
  async exportData(): Promise<void> {
    const exportButton = this.page.locator('button:has-text("Export"), [data-testid="export-data"]');
    await exportButton.click();
    await this.waitForLoadingToComplete();
  }

  // Assertions
  async expectSettingsLoaded(): Promise<void> {
    await expect(this.settingsForm).toBeVisible();
  }

  async expectSaveSuccess(): Promise<void> {
    await this.waitForToast('success');
  }

  async expectSaveError(): Promise<void> {
    await this.waitForToast('error');
  }

  async expectPasswordChangeSuccess(): Promise<void> {
    const successMessage = this.page.locator('[data-testid="password-success"], .password-success');
    await expect(successMessage).toBeVisible();
  }

  async expectPasswordMismatchError(): Promise<void> {
    const errorMessage = this.page.locator('[data-testid="password-mismatch"], .password-mismatch');
    await expect(errorMessage).toBeVisible();
  }

  async expectCurrentPasswordError(): Promise<void> {
    const errorMessage = this.page.locator('[data-testid="current-password-error"]');
    await expect(errorMessage).toBeVisible();
  }

  async expectToggleState(toggleName: string, expected: boolean): Promise<void> {
    const toggle = this.page.locator(`[data-testid="${toggleName}-toggle"], input[name="${toggleName}"]`);
    if (expected) {
      await expect(toggle).toBeChecked();
    } else {
      await expect(toggle).not.toBeChecked();
    }
  }

  // Get current settings values
  async getCurrentEmail(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getCurrentLanguage(): Promise<string> {
    return await this.languageSelect.inputValue();
  }

  async getCurrentTimezone(): Promise<string> {
    return await this.timezoneSelect.inputValue();
  }

  async isEmailNotificationsEnabled(): Promise<boolean> {
    return await this.emailNotificationsToggle.isChecked();
  }

  async isSmsNotificationsEnabled(): Promise<boolean> {
    return await this.smsNotificationsToggle.isChecked();
  }

  async isPushNotificationsEnabled(): Promise<boolean> {
    return await this.pushNotificationsToggle.isChecked();
  }
}
