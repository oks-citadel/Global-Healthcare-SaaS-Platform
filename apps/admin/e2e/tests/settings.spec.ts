import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DashboardPage } from "../pages/dashboard.page";
import { SettingsPage } from "../pages/settings.page";
import { testAdmins, testSystemSettings } from "../fixtures/test-data";

/**
 * Admin Dashboard System Settings E2E Tests
 *
 * Tests for system settings configuration and management
 */

test.describe("System Settings", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    settingsPage = new SettingsPage(page);

    // Login as super admin before each test (needs full permissions)
    await loginPage.goto();
    await loginPage.login(
      testAdmins.superAdmin.email,
      testAdmins.superAdmin.password,
    );
    await loginPage.waitForLoginSuccess();
  });

  test.describe("Settings Page Display", () => {
    test("should display settings page with tabs", async ({ page }) => {
      await settingsPage.goto();

      await settingsPage.assertSettingsPageDisplayed();
      await expect(settingsPage.saveAllButton).toBeVisible();
    });

    test("should navigate to settings page from dashboard", async ({
      page,
    }) => {
      await dashboardPage.gotoSettings();

      await settingsPage.assertSettingsPageDisplayed();
      expect(page.url()).toContain("settings");
    });

    test("should display general settings tab by default", async ({ page }) => {
      await settingsPage.goto();

      await expect(settingsPage.systemNameInput).toBeVisible();
    });

    test("should switch between settings tabs", async ({ page }) => {
      await settingsPage.goto();

      // Switch to security tab
      await settingsPage.switchToSecurityTab();
      await expect(settingsPage.sessionTimeoutInput).toBeVisible();

      // Switch to notifications tab
      await settingsPage.switchToNotificationsTab();
      await expect(settingsPage.emailNotificationsToggle).toBeVisible();

      // Switch back to general tab
      await settingsPage.switchToGeneralTab();
      await expect(settingsPage.systemNameInput).toBeVisible();
    });
  });

  test.describe("General Settings", () => {
    test("should update system name", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToGeneralTab();

      const newName = "Updated Health Platform";
      await settingsPage.updateSystemName(newName);
      await settingsPage.saveSettings();

      await settingsPage.assertSuccessMessageDisplayed();
    });

    test("should toggle maintenance mode", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToGeneralTab();

      const initialState = await settingsPage.isMaintenanceModeEnabled();

      await settingsPage.toggleMaintenanceMode();
      await settingsPage.saveSettings();

      const newState = await settingsPage.isMaintenanceModeEnabled();
      expect(newState).not.toBe(initialState);

      // Toggle back to original state
      await settingsPage.toggleMaintenanceMode();
      await settingsPage.saveSettings();
    });

    test("should update data retention period", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToGeneralTab();

      if (await settingsPage.dataRetentionInput.isVisible()) {
        await settingsPage.dataRetentionInput.clear();
        await settingsPage.dataRetentionInput.fill("365");
        await settingsPage.saveSettings();

        await settingsPage.assertSuccessMessageDisplayed();
      }
    });
  });

  test.describe("Security Settings", () => {
    test("should update session timeout", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToSecurityTab();

      const newTimeout = 60;
      await settingsPage.updateSessionTimeout(newTimeout);
      await settingsPage.saveSettings();

      await settingsPage.assertSuccessMessageDisplayed();

      // Verify the value was saved
      const savedTimeout = await settingsPage.getSessionTimeout();
      expect(savedTimeout).toBe(newTimeout.toString());
    });

    test("should update max login attempts", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToSecurityTab();

      const newAttempts = 5;
      await settingsPage.updateMaxLoginAttempts(newAttempts);
      await settingsPage.saveSettings();

      await settingsPage.assertSuccessMessageDisplayed();

      // Verify the value was saved
      const savedAttempts = await settingsPage.getMaxLoginAttempts();
      expect(savedAttempts).toBe(newAttempts.toString());
    });

    test("should toggle two-factor authentication requirement", async ({
      page,
    }) => {
      await settingsPage.goto();
      await settingsPage.switchToSecurityTab();

      const initialState = await settingsPage.isTwoFactorRequired();

      await settingsPage.toggleRequireTwoFactor();
      await settingsPage.saveSettings();

      const newState = await settingsPage.isTwoFactorRequired();
      expect(newState).not.toBe(initialState);

      // Toggle back to original state
      await settingsPage.toggleRequireTwoFactor();
      await settingsPage.saveSettings();
    });

    test("should validate session timeout minimum value", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToSecurityTab();

      // Try to set an invalid value
      await settingsPage.updateSessionTimeout(0);
      await settingsPage.saveSettings();

      // Should show validation error
      await settingsPage.assertErrorMessageDisplayed();
    });
  });

  test.describe("Notification Settings", () => {
    test("should toggle email notifications", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToNotificationsTab();

      const initialState = await settingsPage.isEmailNotificationsEnabled();

      await settingsPage.toggleEmailNotifications();
      await settingsPage.saveSettings();

      await settingsPage.assertSuccessMessageDisplayed();

      // Toggle back
      await settingsPage.toggleEmailNotifications();
      await settingsPage.saveSettings();
    });

    test("should update notification email address", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToNotificationsTab();

      const newEmail = "notifications@test.com";
      await settingsPage.updateNotificationEmail(newEmail);
      await settingsPage.saveSettings();

      await settingsPage.assertSuccessMessageDisplayed();
    });

    test("should validate email format for notification email", async ({
      page,
    }) => {
      await settingsPage.goto();
      await settingsPage.switchToNotificationsTab();

      await settingsPage.updateNotificationEmail("invalid-email");
      await settingsPage.saveSettings();

      // Should show validation error
      await settingsPage.assertErrorMessageDisplayed();
    });
  });

  test.describe("Integration Settings", () => {
    test("should display API key", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToIntegrationsTab();

      const apiKey = await settingsPage.getApiKey();
      expect(apiKey).toBeTruthy();
    });

    test("should regenerate API key", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToIntegrationsTab();

      const originalKey = await settingsPage.getApiKey();

      await settingsPage.regenerateApiKey();

      const newKey = await settingsPage.getApiKey();
      expect(newKey).not.toBe(originalKey);
    });

    test("should update webhook URL", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToIntegrationsTab();

      const webhookUrl = "https://example.com/webhook";
      await settingsPage.updateWebhookUrl(webhookUrl);
      await settingsPage.saveSettings();

      await settingsPage.assertSuccessMessageDisplayed();
    });
  });

  test.describe("Appearance Settings", () => {
    test("should change theme", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToAppearanceTab();

      if (await settingsPage.themeSelect.isVisible()) {
        await settingsPage.changeTheme("dark");
        await settingsPage.saveSettings();

        await settingsPage.assertSuccessMessageDisplayed();

        // Change back to light theme
        await settingsPage.changeTheme("light");
        await settingsPage.saveSettings();
      }
    });
  });

  test.describe("Reset Settings", () => {
    test("should reset settings to defaults", async ({ page }) => {
      await settingsPage.goto();

      // Make some changes first
      await settingsPage.switchToSecurityTab();
      await settingsPage.updateSessionTimeout(120);
      await settingsPage.saveSettings();

      // Reset to defaults
      await settingsPage.resetSettings();

      await settingsPage.assertSuccessMessageDisplayed();
    });

    test("should show confirmation dialog before resetting", async ({
      page,
    }) => {
      await settingsPage.goto();

      await settingsPage.resetButton.click();

      // Should show confirmation dialog
      await expect(settingsPage.confirmDialog).toBeVisible();

      // Cancel the reset
      await settingsPage.cancelButton.click();
    });
  });

  test.describe("Settings Validation", () => {
    test("should prevent saving invalid settings", async ({ page }) => {
      await settingsPage.goto();
      await settingsPage.switchToSecurityTab();

      // Try to set negative session timeout
      await settingsPage.sessionTimeoutInput.clear();
      await settingsPage.sessionTimeoutInput.fill("-10");
      await settingsPage.saveSettings();

      // Should show validation error
      await settingsPage.assertErrorMessageDisplayed();
    });

    test("should show error for invalid webhook URL format", async ({
      page,
    }) => {
      await settingsPage.goto();
      await settingsPage.switchToIntegrationsTab();

      await settingsPage.updateWebhookUrl("not-a-valid-url");
      await settingsPage.saveSettings();

      // Should show validation error
      await settingsPage.assertErrorMessageDisplayed();
    });
  });

  test.describe("Permission-Based Access", () => {
    test("moderator should not be able to access settings", async ({
      page,
    }) => {
      // Logout and login as moderator
      await dashboardPage.logout();
      await loginPage.login(
        testAdmins.moderator1.email,
        testAdmins.moderator1.password,
      );
      await loginPage.waitForLoginSuccess();

      // Try to access settings
      await page.goto("/settings");

      // Should be redirected or show access denied
      const url = page.url();
      const accessDenied = page.locator(
        ':text("Access Denied"), :text("Unauthorized"), :text("403")',
      );

      const isDenied =
        !url.includes("settings") ||
        (await accessDenied.isVisible().catch(() => false));
      expect(isDenied).toBe(true);
    });
  });
});
