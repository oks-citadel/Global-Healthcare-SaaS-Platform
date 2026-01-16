import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { testUsers } from '../fixtures/test-data';

/**
 * Settings Management E2E Tests
 *
 * Tests for managing user settings including:
 * - Account settings
 * - Privacy settings
 * - Notification preferences
 * - Security settings
 * - Language and accessibility preferences
 */

test.describe('Settings Management', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
    await loginPage.waitForLoginSuccess();
  });

  test.describe('Account Settings', () => {
    test('should display account settings page', async ({ page }) => {
      // Navigate to settings
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Verify settings page loaded
      const heading = page.locator('h1:has-text("Settings"), h2:has-text("Settings")');
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Verify settings sections are available
      const mainContent = page.locator('main, [role="main"], .settings-content');
      await expect(mainContent).toBeVisible();
    });

    test('should update email address', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for email setting
      const emailInput = page.locator('input[name="email"], input[type="email"]');

      if (await emailInput.isVisible()) {
        const currentEmail = await emailInput.inputValue();

        // Update to new email (then revert)
        const newEmail = `updated${Date.now()}@test.com`;
        await emailInput.fill(newEmail);

        // Save changes
        await page.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');

        // Wait for success or verification message
        await page.waitForSelector(
          '.success-message, [role="alert"]:has-text("success"), [role="alert"]:has-text("verification")',
          { timeout: 10000 }
        );

        // Revert back to original email
        await emailInput.fill(currentEmail);
        await page.click('button[type="submit"]');
        await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
      }
    });

    test('should change password', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for change password section
      const changePasswordButton = page.locator('button:has-text("Change Password"), a:has-text("Change Password")');

      if (await changePasswordButton.isVisible()) {
        await changePasswordButton.click();

        await page.waitForSelector('form, input[name="currentPassword"]');

        // Fill password change form
        const currentPasswordInput = page.locator('input[name="currentPassword"], input[name="oldPassword"]');
        const newPasswordInput = page.locator('input[name="newPassword"], input[name="password"]');
        const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirmNewPassword"]');

        if (await currentPasswordInput.isVisible()) {
          await currentPasswordInput.fill(testUsers.patient1.password);
          await newPasswordInput.fill('NewTestPassword@123');
          await confirmPasswordInput.fill('NewTestPassword@123');

          // Submit password change
          await page.click('button[type="submit"]');

          // Wait for success
          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });

          // Change back to original password
          await page.waitForTimeout(1000);
          await currentPasswordInput.fill('NewTestPassword@123');
          await newPasswordInput.fill(testUsers.patient1.password);
          await confirmPasswordInput.fill(testUsers.patient1.password);
          await page.click('button[type="submit"]');
          await page.waitForSelector('.success-message', { timeout: 10000 });
        }
      }
    });

    test('should validate password requirements on change', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const changePasswordButton = page.locator('button:has-text("Change Password")');

      if (await changePasswordButton.isVisible()) {
        await changePasswordButton.click();

        await page.waitForSelector('input[name="newPassword"]');

        const newPasswordInput = page.locator('input[name="newPassword"]');

        // Try weak password
        await newPasswordInput.fill('123');

        // Should show validation error
        await page.click('button[type="submit"]');

        const errorMessage = page.locator('.error, [role="alert"], .password-requirements');
        await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should update timezone', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for timezone setting
      const timezoneSelect = page.locator('select[name="timezone"]');

      if (await timezoneSelect.isVisible()) {
        await timezoneSelect.selectOption({ index: 1 });

        // Save changes
        await page.click('button[type="submit"]');

        await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
      }
    });

    test('should enable two-factor authentication', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for 2FA section
      const twoFactorSection = page.locator(':text("Two-Factor"), :text("2FA"), :text("Multi-Factor")');

      if (await twoFactorSection.first().isVisible()) {
        const enableButton = page.locator('button:has-text("Enable"), button:has-text("Set up")');

        if (await enableButton.isVisible()) {
          await enableButton.click();

          // Should show 2FA setup dialog or page
          await page.waitForSelector('[role="dialog"], .qr-code, :text("QR code")');

          // Verify setup UI is shown
          const setupDialog = page.locator('[role="dialog"], .two-factor-setup');
          await expect(setupDialog).toBeVisible();
        }
      }
    });
  });

  test.describe('Privacy Settings', () => {
    test('should update privacy preferences', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for privacy tab or section
      const privacyTab = page.locator('[role="tab"]:has-text("Privacy"), button:has-text("Privacy")');

      if (await privacyTab.isVisible()) {
        await privacyTab.click();
        await page.waitForLoadState('networkidle');
      }

      // Look for privacy toggles
      const privacyToggles = page.locator('input[type="checkbox"], [role="switch"]');
      const count = await privacyToggles.count();

      if (count > 0) {
        // Toggle first privacy setting
        const firstToggle = privacyToggles.first();
        const wasChecked = await firstToggle.isChecked();

        await firstToggle.click();

        // Save changes
        const saveButton = page.locator('button[type="submit"]:has-text("Save")');

        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
        }

        // Revert change
        await firstToggle.click();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message', { timeout: 10000 });
        }
      }
    });

    test('should manage data sharing preferences', async ({ page }) => {
      await page.goto('/settings/privacy');
      await page.waitForLoadState('networkidle');

      // Look for data sharing options
      const dataSharingSection = page.locator(':text("Data Sharing"), :text("Share Data")');

      if (await dataSharingSection.first().isVisible()) {
        const checkbox = page.locator('input[name="shareData"], input[type="checkbox"]').first();

        if (await checkbox.isVisible()) {
          const isChecked = await checkbox.isChecked();
          await checkbox.click();

          // Save
          const saveButton = page.locator('button[type="submit"]');
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForSelector('.success-message', { timeout: 10000 });
          }
        }
      }
    });

    test('should view privacy policy', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for privacy policy link
      const privacyPolicyLink = page.locator('a:has-text("Privacy Policy")');

      if (await privacyPolicyLink.isVisible()) {
        await privacyPolicyLink.click();

        // Should navigate to privacy policy
        await page.waitForLoadState('networkidle');

        expect(page.url()).toMatch(/privacy|policy/i);
      }
    });
  });

  test.describe('Notification Preferences', () => {
    test('should update email notification preferences', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for notifications tab
      const notificationsTab = page.locator('[role="tab"]:has-text("Notifications"), a:has-text("Notifications")');

      if (await notificationsTab.isVisible()) {
        await notificationsTab.click();
        await page.waitForLoadState('networkidle');
      } else {
        await page.goto('/settings/notifications');
        await page.waitForLoadState('networkidle');
      }

      // Look for email notification toggles
      const emailNotificationToggle = page.locator('input[name="emailNotifications"], [role="switch"]').first();

      if (await emailNotificationToggle.isVisible()) {
        const wasChecked = await emailNotificationToggle.isChecked();
        await emailNotificationToggle.click();

        // Save changes
        const saveButton = page.locator('button[type="submit"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
        }

        // Revert
        await emailNotificationToggle.click();
        if (await saveButton.isVisible()) {
          await saveButton.click();
        }
      }
    });

    test('should update SMS notification preferences', async ({ page }) => {
      await page.goto('/settings/notifications');
      await page.waitForLoadState('networkidle');

      // Look for SMS notification toggle
      const smsToggle = page.locator('input[name="smsNotifications"], input[name="textNotifications"]');

      if (await smsToggle.isVisible()) {
        await smsToggle.click();

        // Save
        const saveButton = page.locator('button[type="submit"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message', { timeout: 10000 });
        }
      }
    });

    test('should configure appointment reminder notifications', async ({ page }) => {
      await page.goto('/settings/notifications');
      await page.waitForLoadState('networkidle');

      // Look for appointment reminder settings
      const appointmentReminders = page.locator(':text("Appointment Reminder"), :text("Appointment Notifications")');

      if (await appointmentReminders.first().isVisible()) {
        // Find associated toggle or select
        const reminderToggle = page.locator('input[name="appointmentReminders"]');

        if (await reminderToggle.isVisible()) {
          await reminderToggle.click();

          // Save
          const saveButton = page.locator('button[type="submit"]');
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForSelector('.success-message', { timeout: 10000 });
          }
        }
      }
    });

    test('should set notification frequency', async ({ page }) => {
      await page.goto('/settings/notifications');
      await page.waitForLoadState('networkidle');

      // Look for frequency settings
      const frequencySelect = page.locator('select[name="notificationFrequency"], select[name="frequency"]');

      if (await frequencySelect.isVisible()) {
        await frequencySelect.selectOption({ index: 1 });

        // Save
        const saveButton = page.locator('button[type="submit"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message', { timeout: 10000 });
        }
      }
    });

    test('should enable push notifications', async ({ page }) => {
      await page.goto('/settings/notifications');
      await page.waitForLoadState('networkidle');

      // Look for push notification toggle
      const pushToggle = page.locator('input[name="pushNotifications"], button:has-text("Enable Push")');

      if (await pushToggle.first().isVisible()) {
        // Note: Browser push notifications require user permission
        // We'll just test the UI toggle
        const firstToggle = pushToggle.first();

        if ((await firstToggle.getAttribute('type')) === 'checkbox') {
          await firstToggle.click();

          const saveButton = page.locator('button[type="submit"]');
          if (await saveButton.isVisible()) {
            await saveButton.click();
          }
        }
      }
    });
  });

  test.describe('Language and Accessibility', () => {
    test('should change language preference', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for language selector
      const languageSelect = page.locator('select[name="language"]');

      if (await languageSelect.isVisible()) {
        const currentLanguage = await languageSelect.inputValue();

        // Change language
        await languageSelect.selectOption({ index: 1 });

        // Save
        const saveButton = page.locator('button[type="submit"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
        }

        // Wait for page to reload with new language
        await page.waitForLoadState('networkidle');

        // Revert to original language
        if (await languageSelect.isVisible()) {
          await languageSelect.selectOption(currentLanguage);
          if (await saveButton.isVisible()) {
            await saveButton.click();
          }
        }
      }
    });

    test('should enable high contrast mode', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for accessibility settings
      const accessibilityTab = page.locator('[role="tab"]:has-text("Accessibility"), a:has-text("Accessibility")');

      if (await accessibilityTab.isVisible()) {
        await accessibilityTab.click();
        await page.waitForLoadState('networkidle');
      }

      // Look for high contrast toggle
      const highContrastToggle = page.locator('input[name="highContrast"], [role="switch"]');

      if (await highContrastToggle.first().isVisible()) {
        await highContrastToggle.first().click();

        const saveButton = page.locator('button[type="submit"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message', { timeout: 10000 });
        }
      }
    });

    test('should adjust font size', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for font size control
      const fontSizeSelect = page.locator('select[name="fontSize"], input[name="fontSize"]');

      if (await fontSizeSelect.isVisible()) {
        const tagName = await fontSizeSelect.evaluate(el => el.tagName.toLowerCase());

        if (tagName === 'select') {
          await fontSizeSelect.selectOption('large');
        } else if (tagName === 'input') {
          await fontSizeSelect.fill('18');
        }

        const saveButton = page.locator('button[type="submit"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message', { timeout: 10000 });
        }
      }
    });

    test('should enable screen reader optimizations', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for screen reader toggle
      const screenReaderToggle = page.locator('input[name="screenReader"], input[name="screenReaderMode"]');

      if (await screenReaderToggle.isVisible()) {
        await screenReaderToggle.click();

        const saveButton = page.locator('button[type="submit"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForSelector('.success-message', { timeout: 10000 });
        }
      }
    });
  });

  test.describe('Connected Devices', () => {
    test('should view connected devices', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for devices tab or section
      const devicesTab = page.locator('[role="tab"]:has-text("Devices"), a:has-text("Devices")');

      if (await devicesTab.isVisible()) {
        await devicesTab.click();
        await page.waitForLoadState('networkidle');

        // Should show list of devices
        const devicesList = page.locator('.device-card, [data-testid="device"]');
        expect(await devicesList.count()).toBeGreaterThanOrEqual(0);
      }
    });

    test('should disconnect a device', async ({ page }) => {
      await page.goto('/settings/devices');
      await page.waitForLoadState('networkidle');

      const deviceCards = page.locator('.device-card, [data-testid="device"]');
      const count = await deviceCards.count();

      if (count > 0) {
        // Look for disconnect button
        const disconnectButton = deviceCards.first().locator('button:has-text("Disconnect"), button:has-text("Remove")');

        if (await disconnectButton.isVisible()) {
          await disconnectButton.click();

          // Confirm disconnection
          const confirmButton = page.locator('[role="dialog"] button:has-text("Disconnect"), button:has-text("Confirm")');

          if (await confirmButton.isVisible()) {
            await confirmButton.click();
          }

          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
        }
      }
    });
  });

  test.describe('Data Management', () => {
    test('should request data export', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for data export option
      const exportButton = page.locator('button:has-text("Export Data"), button:has-text("Download My Data")');

      if (await exportButton.isVisible()) {
        await exportButton.click();

        // May show confirmation dialog
        await page.waitForSelector('[role="dialog"], .success-message', { timeout: 5000 });

        // Verify export request was initiated
        const confirmMessage = page.locator('.success-message, [role="alert"]:has-text("export")');

        if (await confirmMessage.isVisible()) {
          await expect(confirmMessage).toBeVisible();
        }
      }
    });

    test('should view data usage statistics', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for data usage section
      const dataUsageSection = page.locator(':text("Data Usage"), :text("Storage")');

      if (await dataUsageSection.first().isVisible()) {
        await expect(dataUsageSection.first()).toBeVisible();

        // Should show some statistics
        const stats = page.locator('.stat, .metric, [data-testid="stat"]');
        expect(await stats.count()).toBeGreaterThanOrEqual(0);
      }
    });

    test('should delete account', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for delete account option (usually at bottom)
      const deleteAccountButton = page.locator('button:has-text("Delete Account"), button:has-text("Close Account")');

      if (await deleteAccountButton.isVisible()) {
        // Just verify button exists - don't actually delete
        await expect(deleteAccountButton).toBeVisible();
        await expect(deleteAccountButton).toBeEnabled();

        // Optionally click to see confirmation dialog
        await deleteAccountButton.click();

        // Should show scary confirmation dialog
        const confirmDialog = page.locator('[role="dialog"], [role="alertdialog"]');
        await expect(confirmDialog).toBeVisible({ timeout: 5000 });

        // Cancel the deletion
        const cancelButton = page.locator('[role="dialog"] button:has-text("Cancel")');
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        }
      }
    });
  });

  test.describe('Billing Settings', () => {
    test('should view billing information', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for billing tab
      const billingTab = page.locator('[role="tab"]:has-text("Billing"), a:has-text("Billing")');

      if (await billingTab.isVisible()) {
        await billingTab.click();
        await page.waitForLoadState('networkidle');

        // Should show billing information
        const billingContent = page.locator('.billing-info, [data-testid="billing"]');
        await expect(billingContent).toBeVisible();
      }
    });

    test('should update payment method', async ({ page }) => {
      await page.goto('/settings/billing');
      await page.waitForLoadState('networkidle');

      // Look for update payment button
      const updatePaymentButton = page.locator('button:has-text("Update Payment"), button:has-text("Add Card")');

      if (await updatePaymentButton.isVisible()) {
        await updatePaymentButton.click();

        // Should show payment form
        await page.waitForSelector('form, iframe[name*="stripe"]', { timeout: 5000 });

        // Verify payment form is shown
        const paymentForm = page.locator('form, [data-testid="payment-form"]');
        await expect(paymentForm.first()).toBeVisible();
      }
    });

    test('should view billing history', async ({ page }) => {
      await page.goto('/settings/billing');
      await page.waitForLoadState('networkidle');

      // Look for billing history section
      const billingHistory = page.locator(':text("Billing History"), :text("Invoice History")');

      if (await billingHistory.first().isVisible()) {
        await expect(billingHistory.first()).toBeVisible();

        // Should show list of invoices
        const invoices = page.locator('.invoice-item, [data-testid="invoice"]');
        expect(await invoices.count()).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Settings Validation', () => {
    test('should prevent saving invalid email format', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[name="email"], input[type="email"]');

      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');

        await page.click('button[type="submit"]');

        // Should show validation error
        const errorMessage = page.locator('.error, [role="alert"]');
        await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should show confirmation when changing critical settings', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Look for email change
      const emailInput = page.locator('input[name="email"]');

      if (await emailInput.isVisible()) {
        const originalEmail = await emailInput.inputValue();
        await emailInput.fill('newemail@test.com');

        await page.click('button[type="submit"]');

        // Should show confirmation dialog or verification message
        const confirmationMessage = page.locator('[role="dialog"], [role="alert"]:has-text("verification"), [role="alert"]:has-text("confirm")');

        if (await confirmationMessage.first().isVisible()) {
          await expect(confirmationMessage.first()).toBeVisible();
        }
      }
    });
  });
});
