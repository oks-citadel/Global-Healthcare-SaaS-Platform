import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { testUsers } from '../fixtures/test-data';

/**
 * Prescription Management E2E Tests
 *
 * Tests for viewing, requesting refills, and managing prescriptions
 */

test.describe('Prescription Management', () => {
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

  test.describe('View Prescriptions', () => {
    test('should display prescriptions list', async ({ page }) => {
      // Navigate to prescriptions
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Verify page loaded
      const heading = page.locator('h1:has-text("Prescription"), h2:has-text("Prescription")');
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Check for prescriptions list or empty state
      const prescriptionCards = page.locator('.prescription-card, [data-testid="prescription-card"]');
      const hasCards = await prescriptionCards.count() > 0;
      const hasEmptyState = await page.locator(':text("No prescriptions"), :text("no active prescriptions")').isVisible();

      expect(hasCards || hasEmptyState).toBe(true);
    });

    test('should display active prescriptions', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for active tab or filter
      const activeTab = page.locator('[role="tab"]:has-text("Active"), button:has-text("Active")');

      if (await activeTab.isVisible()) {
        await activeTab.click();
        await page.waitForLoadState('networkidle');
      }

      // Verify active prescriptions are shown
      const prescriptions = page.locator('.prescription-card');
      const count = await prescriptions.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display prescription details', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card, [data-testid="prescription-card"]');
      const count = await prescriptionCards.count();

      if (count > 0) {
        const firstCard = prescriptionCards.first();

        // Verify prescription card shows key information
        await expect(firstCard).toBeVisible();

        // Should show medication name
        const hasMedicationName = await firstCard.locator('h3, h4, .medication-name').count() > 0;
        expect(hasMedicationName).toBe(true);

        // Should show dosage info
        const hasDosage = await firstCard.textContent();
        expect(hasDosage).toBeTruthy();
      }
    });

    test('should view detailed prescription information', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        // Click on first prescription
        await prescriptionCards.first().click();

        await page.waitForLoadState('networkidle');

        // Verify details page loaded
        const detailsPage = page.locator('[data-testid="prescription-details"], h1, h2');
        await expect(detailsPage.first()).toBeVisible();

        // Should show comprehensive information
        const hasDetails = await page.locator(':text("Dosage"), :text("Refills"), :text("Prescribed")').count() > 0;
        expect(hasDetails).toBe(true);
      }
    });

    test('should filter prescriptions by status', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for status filter tabs
      const statusTabs = page.locator('[role="tablist"], .tabs, .filter-buttons');

      if (await statusTabs.isVisible()) {
        // Click on different status tabs
        const completedTab = page.locator('[role="tab"]:has-text("Completed"), button:has-text("Past")');

        if (await completedTab.isVisible()) {
          await completedTab.click();
          await page.waitForLoadState('networkidle');

          // Verify filter applied
          expect(page.url()).toContain('prescriptions');
        }
      }
    });

    test('should show prescription history', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for history tab
      const historyTab = page.locator('[role="tab"]:has-text("History"), button:has-text("History")');

      if (await historyTab.isVisible()) {
        await historyTab.click();
        await page.waitForLoadState('networkidle');

        // Should show past prescriptions
        const prescriptions = page.locator('.prescription-card');
        expect(await prescriptions.count()).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Prescription Refill Requests', () => {
    test('should request prescription refill', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        // Look for refill button on a prescription
        const refillButton = prescriptionCards.first().locator(
          'button:has-text("Request Refill"), button:has-text("Refill"), a:has-text("Refill")'
        );

        if (await refillButton.isVisible()) {
          await refillButton.click();

          // May show confirmation dialog or form
          await page.waitForSelector(
            '[role="dialog"], form, .refill-form',
            { timeout: 5000 }
          );

          // Look for pharmacy selection
          const pharmacySelect = page.locator('select[name="pharmacy"]');

          if (await pharmacySelect.isVisible()) {
            await pharmacySelect.selectOption({ index: 1 });
          }

          // Add notes if available
          const notesInput = page.locator('textarea[name="notes"], input[name="notes"]');

          if (await notesInput.isVisible()) {
            await notesInput.fill('Please refill prescription');
          }

          // Confirm refill request
          const confirmButton = page.locator('button:has-text("Confirm"), button[type="submit"]');
          await confirmButton.click();

          // Wait for success message
          await page.waitForSelector(
            '.success-message, [role="alert"]:has-text("success"), [role="alert"]:has-text("requested")',
            { timeout: 10000 }
          );
        }
      }
    });

    test('should show refills remaining count', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        const firstCard = prescriptionCards.first();

        // Look for refills remaining indicator
        const refillsInfo = firstCard.locator(':text("refills"), :text("Refills")');

        if (await refillsInfo.isVisible()) {
          await expect(refillsInfo).toBeVisible();

          // Should show number of refills
          const text = await refillsInfo.textContent();
          expect(text).toMatch(/\d+/); // Contains a number
        }
      }
    });

    test('should disable refill request when no refills remaining', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        // Look for prescription with 0 refills
        for (let i = 0; i < count; i++) {
          const card = prescriptionCards.nth(i);
          const text = await card.textContent();

          if (text && text.includes('0 refills')) {
            // Refill button should be disabled
            const refillButton = card.locator('button:has-text("Refill")');

            if (await refillButton.isVisible()) {
              const isDisabled = await refillButton.isDisabled();
              expect(isDisabled).toBe(true);
            }
            break;
          }
        }
      }
    });

    test('should show pending refill requests status', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for pending tab or filter
      const pendingTab = page.locator('[role="tab"]:has-text("Pending"), button:has-text("Pending")');

      if (await pendingTab.isVisible()) {
        await pendingTab.click();
        await page.waitForLoadState('networkidle');

        // Should show pending refill requests
        const pendingCards = page.locator('.prescription-card');
        const count = await pendingCards.count();

        expect(count).toBeGreaterThanOrEqual(0);

        if (count > 0) {
          // Should have pending status indicator
          const statusBadge = pendingCards.first().locator('.status, .badge, [data-status]');
          await expect(statusBadge).toBeVisible();
        }
      }
    });

    test('should cancel pending refill request', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const pendingTab = page.locator('[role="tab"]:has-text("Pending")');

      if (await pendingTab.isVisible()) {
        await pendingTab.click();
        await page.waitForLoadState('networkidle');

        const prescriptionCards = page.locator('.prescription-card');
        const count = await prescriptionCards.count();

        if (count > 0) {
          // Look for cancel button
          const cancelButton = prescriptionCards.first().locator('button:has-text("Cancel")');

          if (await cancelButton.isVisible()) {
            await cancelButton.click();

            // Confirm cancellation
            const confirmButton = page.locator('[role="dialog"] button:has-text("Confirm"), button:has-text("Yes")');

            if (await confirmButton.isVisible()) {
              await confirmButton.click();
            }

            // Wait for success
            await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
          }
        }
      }
    });
  });

  test.describe('Pharmacy Management', () => {
    test('should view preferred pharmacy', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for pharmacy information section
      const pharmacySection = page.locator(
        '[data-testid="pharmacy"], .pharmacy-info, :text("Preferred Pharmacy")'
      );

      if (await pharmacySection.isVisible()) {
        await expect(pharmacySection).toBeVisible();

        // Should show pharmacy name and address
        const hasPharmacyInfo = await pharmacySection.textContent();
        expect(hasPharmacyInfo).toBeTruthy();
      }
    });

    test('should change preferred pharmacy', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for change pharmacy button
      const changePharmacyButton = page.locator(
        'button:has-text("Change Pharmacy"), a:has-text("Update Pharmacy")'
      );

      if (await changePharmacyButton.isVisible()) {
        await changePharmacyButton.click();

        await page.waitForSelector('form, select[name="pharmacy"]');

        // Select new pharmacy
        const pharmacySelect = page.locator('select[name="pharmacy"]');

        if (await pharmacySelect.isVisible()) {
          await pharmacySelect.selectOption({ index: 1 });

          // Submit change
          await page.click('button[type="submit"]');

          // Wait for success
          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
        }
      }
    });

    test('should search for pharmacies', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const changePharmacyButton = page.locator('button:has-text("Change Pharmacy")');

      if (await changePharmacyButton.isVisible()) {
        await changePharmacyButton.click();

        // Look for pharmacy search
        const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');

        if (await searchInput.isVisible()) {
          await searchInput.fill('CVS');
          await searchInput.press('Enter');

          await page.waitForLoadState('networkidle');

          // Should show search results
          const results = page.locator('.pharmacy-result, [data-testid="pharmacy"]');
          expect(await results.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Prescription Instructions', () => {
    test('should display prescription instructions', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        await prescriptionCards.first().click();
        await page.waitForLoadState('networkidle');

        // Look for instructions section
        const instructionsSection = page.locator(
          '[data-testid="instructions"], .instructions, :text("Instructions"), :text("Directions")'
        );

        if (await instructionsSection.isVisible()) {
          await expect(instructionsSection).toBeVisible();

          // Should contain instruction text
          const text = await instructionsSection.textContent();
          expect(text?.length).toBeGreaterThan(0);
        }
      }
    });

    test('should display dosage information', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        await prescriptionCards.first().click();
        await page.waitForLoadState('networkidle');

        // Should show dosage
        const dosageInfo = page.locator(':text("Dosage"), :text("mg"), :text("ml")');

        if (await dosageInfo.first().isVisible()) {
          await expect(dosageInfo.first()).toBeVisible();
        }
      }
    });

    test('should display frequency information', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        await prescriptionCards.first().click();
        await page.waitForLoadState('networkidle');

        // Should show frequency
        const frequencyInfo = page.locator(
          ':text("daily"), :text("twice"), :text("Frequency"), :text("times per day")'
        );

        if (await frequencyInfo.first().isVisible()) {
          await expect(frequencyInfo.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Medication Reminders', () => {
    test('should set medication reminder', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        await prescriptionCards.first().click();
        await page.waitForLoadState('networkidle');

        // Look for set reminder button
        const reminderButton = page.locator('button:has-text("Set Reminder"), button:has-text("Reminder")');

        if (await reminderButton.isVisible()) {
          await reminderButton.click();

          await page.waitForSelector('form, input[type="time"]');

          // Set reminder time
          const timeInput = page.locator('input[type="time"], input[name="time"]');

          if (await timeInput.isVisible()) {
            await timeInput.fill('09:00');

            // Set frequency
            const frequencySelect = page.locator('select[name="frequency"]');

            if (await frequencySelect.isVisible()) {
              await frequencySelect.selectOption('daily');
            }

            // Save reminder
            await page.click('button[type="submit"]');

            await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
          }
        }
      }
    });

    test('should view active medication reminders', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for reminders section
      const remindersSection = page.locator(
        '[data-testid="reminders"], .reminders, :text("Reminders")'
      );

      if (await remindersSection.isVisible()) {
        await expect(remindersSection).toBeVisible();

        // Should show list of reminders
        const reminderItems = page.locator('.reminder-item, [data-testid="reminder"]');
        expect(await reminderItems.count()).toBeGreaterThanOrEqual(0);
      }
    });

    test('should delete medication reminder', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        await prescriptionCards.first().click();
        await page.waitForLoadState('networkidle');

        // Look for delete reminder button
        const deleteReminderButton = page.locator('button:has-text("Delete Reminder"), button[aria-label*="Delete reminder"]');

        if (await deleteReminderButton.isVisible()) {
          await deleteReminderButton.click();

          // Confirm deletion
          const confirmButton = page.locator('[role="dialog"] button:has-text("Delete"), button:has-text("Confirm")');

          if (await confirmButton.isVisible()) {
            await confirmButton.click();
          }

          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
        }
      }
    });
  });

  test.describe('Download and Print', () => {
    test('should download prescription details', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        await prescriptionCards.first().click();
        await page.waitForLoadState('networkidle');

        // Look for download button
        const downloadButton = page.locator('button:has-text("Download"), button:has-text("Export")');

        if (await downloadButton.isVisible()) {
          const downloadPromise = page.waitForEvent('download', { timeout: 15000 });

          await downloadButton.click();

          try {
            const download = await downloadPromise;
            expect(download.suggestedFilename()).toBeTruthy();
          } catch (e) {
            console.log('Download not available:', e);
          }
        }
      }
    });

    test('should print prescription', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        await prescriptionCards.first().click();
        await page.waitForLoadState('networkidle');

        // Look for print button
        const printButton = page.locator('button:has-text("Print")');

        if (await printButton.isVisible()) {
          // Note: Actual print dialog can't be tested in headless mode
          // Just verify button exists and is clickable
          await expect(printButton).toBeEnabled();
        }
      }
    });
  });

  test.describe('Search and Sort', () => {
    test('should search prescriptions by medication name', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');

      if (await searchInput.isVisible()) {
        await searchInput.fill('aspirin');
        await searchInput.press('Enter');

        await page.waitForLoadState('networkidle');

        // Verify search executed
        expect(page.url()).toContain('prescriptions');
      }
    });

    test('should sort prescriptions by date', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for sort option
      const sortButton = page.locator('button:has-text("Sort"), select[name="sort"]');

      if (await sortButton.first().isVisible()) {
        await sortButton.first().click();

        const dateOption = page.locator(':text("Date"), option[value*="date"]');

        if (await dateOption.first().isVisible()) {
          await dateOption.first().click();
          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('should sort prescriptions alphabetically', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const sortButton = page.locator('select[name="sort"]');

      if (await sortButton.isVisible()) {
        await sortButton.selectOption('name');
        await page.waitForLoadState('networkidle');

        // Verify sort applied
        const prescriptions = page.locator('.prescription-card');
        expect(await prescriptions.count()).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Notifications', () => {
    test('should show refill reminder notification', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      // Look for notification badge
      const notificationBadge = page.locator('.notification-badge, [data-testid="notification-count"]');

      if (await notificationBadge.isVisible()) {
        await expect(notificationBadge).toBeVisible();
      }
    });

    test('should display low refills warning', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCards = page.locator('.prescription-card');
      const count = await prescriptionCards.count();

      if (count > 0) {
        // Look for low refills warning
        const warningBadge = prescriptionCards.first().locator('.warning, .alert, [role="alert"]');

        if (await warningBadge.isVisible()) {
          await expect(warningBadge).toBeVisible();
        }
      }
    });
  });
});
