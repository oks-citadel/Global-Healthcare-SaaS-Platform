import { Page, Locator, expect } from "@playwright/test";

/**
 * Admin Dashboard Settings Page Object Model
 *
 * Encapsulates the system settings page elements and actions for reusable test code.
 */
export class SettingsPage {
  readonly page: Page;

  // Page header elements
  readonly pageTitle: Locator;
  readonly saveAllButton: Locator;
  readonly resetButton: Locator;

  // Settings tabs/sections
  readonly generalTab: Locator;
  readonly securityTab: Locator;
  readonly notificationsTab: Locator;
  readonly integrationsTab: Locator;
  readonly appearanceTab: Locator;

  // General settings
  readonly systemNameInput: Locator;
  readonly maintenanceModeToggle: Locator;
  readonly dataRetentionInput: Locator;
  readonly timezoneSelect: Locator;
  readonly languageSelect: Locator;

  // Security settings
  readonly sessionTimeoutInput: Locator;
  readonly maxLoginAttemptsInput: Locator;
  readonly requireTwoFactorToggle: Locator;
  readonly passwordPolicySelect: Locator;
  readonly ipWhitelistInput: Locator;
  readonly forcePasswordChangeToggle: Locator;

  // Notification settings
  readonly emailNotificationsToggle: Locator;
  readonly smsNotificationsToggle: Locator;
  readonly notificationEmailInput: Locator;
  readonly alertThresholdInput: Locator;

  // Integration settings
  readonly apiKeyDisplay: Locator;
  readonly regenerateApiKeyButton: Locator;
  readonly webhookUrlInput: Locator;
  readonly externalServicesToggle: Locator;

  // Appearance settings
  readonly themeSelect: Locator;
  readonly logoUploadInput: Locator;
  readonly primaryColorInput: Locator;
  readonly customCssInput: Locator;

  // Confirmation dialog
  readonly confirmDialog: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  // Success/Error messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.pageTitle = page.locator(
      'h1:has-text("Settings"), [data-testid="page-title"]',
    );
    this.saveAllButton = page.locator(
      'button:has-text("Save All"), button:has-text("Save Changes"), [data-testid="save-settings"]',
    );
    this.resetButton = page.locator(
      'button:has-text("Reset"), [data-testid="reset-settings"]',
    );

    // Tabs
    this.generalTab = page.locator(
      'button:has-text("General"), [data-testid="tab-general"], [role="tab"]:has-text("General")',
    );
    this.securityTab = page.locator(
      'button:has-text("Security"), [data-testid="tab-security"], [role="tab"]:has-text("Security")',
    );
    this.notificationsTab = page.locator(
      'button:has-text("Notifications"), [data-testid="tab-notifications"], [role="tab"]:has-text("Notifications")',
    );
    this.integrationsTab = page.locator(
      'button:has-text("Integrations"), [data-testid="tab-integrations"], [role="tab"]:has-text("Integrations")',
    );
    this.appearanceTab = page.locator(
      'button:has-text("Appearance"), [data-testid="tab-appearance"], [role="tab"]:has-text("Appearance")',
    );

    // General settings
    this.systemNameInput = page.locator(
      'input[name="system_name"], input[name="systemName"], [data-testid="system-name"]',
    );
    this.maintenanceModeToggle = page.locator(
      'input[name="maintenance_mode"], [data-testid="maintenance-mode"]',
    );
    this.dataRetentionInput = page.locator(
      'input[name="data_retention_days"], [data-testid="data-retention"]',
    );
    this.timezoneSelect = page.locator(
      'select[name="timezone"], [data-testid="timezone"]',
    );
    this.languageSelect = page.locator(
      'select[name="language"], [data-testid="language"]',
    );

    // Security settings
    this.sessionTimeoutInput = page.locator(
      'input[name="session_timeout"], [data-testid="session-timeout"]',
    );
    this.maxLoginAttemptsInput = page.locator(
      'input[name="max_login_attempts"], [data-testid="max-login-attempts"]',
    );
    this.requireTwoFactorToggle = page.locator(
      'input[name="require_2fa"], [data-testid="require-2fa"]',
    );
    this.passwordPolicySelect = page.locator(
      'select[name="password_policy"], [data-testid="password-policy"]',
    );
    this.ipWhitelistInput = page.locator(
      'textarea[name="ip_whitelist"], [data-testid="ip-whitelist"]',
    );
    this.forcePasswordChangeToggle = page.locator(
      'input[name="force_password_change"], [data-testid="force-password-change"]',
    );

    // Notification settings
    this.emailNotificationsToggle = page.locator(
      'input[name="email_notifications"], [data-testid="email-notifications"]',
    );
    this.smsNotificationsToggle = page.locator(
      'input[name="sms_notifications"], [data-testid="sms-notifications"]',
    );
    this.notificationEmailInput = page.locator(
      'input[name="notification_email"], [data-testid="notification-email"]',
    );
    this.alertThresholdInput = page.locator(
      'input[name="alert_threshold"], [data-testid="alert-threshold"]',
    );

    // Integration settings
    this.apiKeyDisplay = page.locator(
      '[data-testid="api-key"], .api-key-display',
    );
    this.regenerateApiKeyButton = page.locator(
      'button:has-text("Regenerate"), [data-testid="regenerate-api-key"]',
    );
    this.webhookUrlInput = page.locator(
      'input[name="webhook_url"], [data-testid="webhook-url"]',
    );
    this.externalServicesToggle = page.locator(
      'input[name="external_services"], [data-testid="external-services"]',
    );

    // Appearance settings
    this.themeSelect = page.locator(
      'select[name="theme"], [data-testid="theme"]',
    );
    this.logoUploadInput = page.locator(
      'input[type="file"][name="logo"], [data-testid="logo-upload"]',
    );
    this.primaryColorInput = page.locator(
      'input[name="primary_color"], input[type="color"], [data-testid="primary-color"]',
    );
    this.customCssInput = page.locator(
      'textarea[name="custom_css"], [data-testid="custom-css"]',
    );

    // Confirmation dialog
    this.confirmDialog = page.locator(
      '[role="alertdialog"], .confirm-dialog, [data-testid="confirm-dialog"]',
    );
    this.confirmButton = page.locator(
      '[role="alertdialog"] button:has-text("Confirm"), [role="alertdialog"] button:has-text("Yes")',
    );
    this.cancelButton = page.locator(
      '[role="alertdialog"] button:has-text("Cancel"), [role="alertdialog"] button:has-text("No")',
    );

    // Messages
    this.successMessage = page.locator(
      '[role="status"], .success-message, .toast-success, [data-testid="success-message"]',
    );
    this.errorMessage = page.locator(
      '[role="alert"], .error-message, .toast-error, [data-testid="error-message"]',
    );
  }

  /**
   * Navigate to settings page
   */
  async goto() {
    await this.page.goto("/settings");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Switch to general settings tab
   */
  async switchToGeneralTab() {
    await this.generalTab.click();
  }

  /**
   * Switch to security settings tab
   */
  async switchToSecurityTab() {
    await this.securityTab.click();
  }

  /**
   * Switch to notifications settings tab
   */
  async switchToNotificationsTab() {
    await this.notificationsTab.click();
  }

  /**
   * Switch to integrations settings tab
   */
  async switchToIntegrationsTab() {
    await this.integrationsTab.click();
  }

  /**
   * Switch to appearance settings tab
   */
  async switchToAppearanceTab() {
    await this.appearanceTab.click();
  }

  /**
   * Update system name
   */
  async updateSystemName(name: string) {
    await this.systemNameInput.clear();
    await this.systemNameInput.fill(name);
  }

  /**
   * Toggle maintenance mode
   */
  async toggleMaintenanceMode() {
    await this.maintenanceModeToggle.click();
  }

  /**
   * Update session timeout
   */
  async updateSessionTimeout(minutes: number) {
    await this.sessionTimeoutInput.clear();
    await this.sessionTimeoutInput.fill(minutes.toString());
  }

  /**
   * Update max login attempts
   */
  async updateMaxLoginAttempts(attempts: number) {
    await this.maxLoginAttemptsInput.clear();
    await this.maxLoginAttemptsInput.fill(attempts.toString());
  }

  /**
   * Toggle two-factor authentication requirement
   */
  async toggleRequireTwoFactor() {
    await this.requireTwoFactorToggle.click();
  }

  /**
   * Toggle email notifications
   */
  async toggleEmailNotifications() {
    await this.emailNotificationsToggle.click();
  }

  /**
   * Update notification email
   */
  async updateNotificationEmail(email: string) {
    await this.notificationEmailInput.clear();
    await this.notificationEmailInput.fill(email);
  }

  /**
   * Get API key
   */
  async getApiKey(): Promise<string> {
    return (await this.apiKeyDisplay.textContent()) || "";
  }

  /**
   * Regenerate API key
   */
  async regenerateApiKey() {
    await this.regenerateApiKeyButton.click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Update webhook URL
   */
  async updateWebhookUrl(url: string) {
    await this.webhookUrlInput.clear();
    await this.webhookUrlInput.fill(url);
  }

  /**
   * Change theme
   */
  async changeTheme(theme: string) {
    await this.themeSelect.selectOption(theme);
  }

  /**
   * Save all settings
   */
  async saveSettings() {
    await this.saveAllButton.click();
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings() {
    await this.resetButton.click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Assert settings page is displayed
   */
  async assertSettingsPageDisplayed() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.saveAllButton).toBeVisible();
  }

  /**
   * Assert success message is displayed
   */
  async assertSuccessMessageDisplayed() {
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Assert error message is displayed
   */
  async assertErrorMessageDisplayed() {
    await expect(this.errorMessage).toBeVisible();
  }

  /**
   * Wait for settings to load
   */
  async waitForSettingsLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get current session timeout value
   */
  async getSessionTimeout(): Promise<string> {
    return await this.sessionTimeoutInput.inputValue();
  }

  /**
   * Get current max login attempts value
   */
  async getMaxLoginAttempts(): Promise<string> {
    return await this.maxLoginAttemptsInput.inputValue();
  }

  /**
   * Check if maintenance mode is enabled
   */
  async isMaintenanceModeEnabled(): Promise<boolean> {
    return await this.maintenanceModeToggle.isChecked();
  }

  /**
   * Check if two-factor is required
   */
  async isTwoFactorRequired(): Promise<boolean> {
    return await this.requireTwoFactorToggle.isChecked();
  }

  /**
   * Check if email notifications are enabled
   */
  async isEmailNotificationsEnabled(): Promise<boolean> {
    return await this.emailNotificationsToggle.isChecked();
  }
}
