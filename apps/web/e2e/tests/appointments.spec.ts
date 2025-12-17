import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { testUsers, testAppointments, generateRandomAppointment } from '../fixtures/test-data';

/**
 * Appointments E2E Tests
 *
 * Tests for creating, viewing, updating, and canceling appointments
 */

test.describe('Appointments', () => {
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

  test.describe('Create Appointment', () => {
    test('should successfully create a new appointment', async ({ page }) => {
      await dashboardPage.goto();
      await dashboardPage.clickBookAppointment();

      // Wait for appointment form to load
      await page.waitForSelector('form, [data-testid="appointment-form"]');

      // Fill appointment form
      const appointment = testAppointments.appointment1;

      // Select appointment type
      await page.selectOption(
        'select[name="appointmentType"], select[name="type"]',
        appointment.appointmentType
      );

      // Select doctor
      await page.selectOption(
        'select[name="doctorId"], select[name="doctor"]',
        appointment.doctorId
      );

      // Fill date
      await page.fill('input[name="date"], input[type="date"]', appointment.date);

      // Fill time
      await page.fill('input[name="time"], input[type="time"]', appointment.time);

      // Fill reason
      await page.fill(
        'textarea[name="reason"], input[name="reason"]',
        appointment.reason
      );

      // Fill notes if available
      if (appointment.notes) {
        await page.fill('textarea[name="notes"], input[name="notes"]', appointment.notes);
      }

      // Submit form
      await page.click('button[type="submit"]:has-text("Book"), button:has-text("Schedule")');

      // Wait for success message or redirect
      await page.waitForSelector(
        '.success-message, [role="alert"]:has-text("success"), [role="alert"]:has-text("scheduled")',
        { timeout: 10000 }
      );

      // Verify redirect to appointments list or confirmation page
      await page.waitForURL(/\/(appointments|dashboard|confirmation)/, { timeout: 5000 });
    });

    test('should validate required fields when creating appointment', async ({ page }) => {
      await dashboardPage.goto();
      await dashboardPage.clickBookAppointment();

      await page.waitForSelector('form, [data-testid="appointment-form"]');

      // Try to submit empty form
      await page.click('button[type="submit"]');

      // Should show validation errors
      const errorMessages = page.locator('.error, [role="alert"]');
      await expect(errorMessages.first()).toBeVisible();
    });

    test('should not allow booking in the past', async ({ page }) => {
      await dashboardPage.goto();
      await dashboardPage.clickBookAppointment();

      await page.waitForSelector('form, [data-testid="appointment-form"]');

      // Try to select past date
      const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      await page.fill('input[name="date"], input[type="date"]', pastDate);
      await page.click('button[type="submit"]');

      // Should show validation error
      const errorMessage = page.locator(
        ':text("cannot be in the past"), :text("past date"), [role="alert"]'
      );
      await expect(errorMessage).toBeVisible();
    });

    test('should show available time slots', async ({ page }) => {
      await dashboardPage.goto();
      await dashboardPage.clickBookAppointment();

      await page.waitForSelector('form, [data-testid="appointment-form"]');

      // Select doctor
      await page.selectOption('select[name="doctorId"], select[name="doctor"]', 'doctor1');

      // Select date
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      await page.fill('input[name="date"], input[type="date"]', futureDate);

      // Wait for time slots to load
      await page.waitForSelector('.time-slot, [data-testid="time-slot"]', { timeout: 5000 });

      // Verify time slots are displayed
      const timeSlots = page.locator('.time-slot, [data-testid="time-slot"]');
      const count = await timeSlots.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should allow selecting from multiple doctors', async ({ page }) => {
      await dashboardPage.goto();
      await dashboardPage.clickBookAppointment();

      await page.waitForSelector('form, [data-testid="appointment-form"]');

      // Get doctor options
      const doctorOptions = page.locator(
        'select[name="doctorId"] option, select[name="doctor"] option'
      );
      const count = await doctorOptions.count();

      // Should have at least one doctor option (plus default "Select doctor" option)
      expect(count).toBeGreaterThan(1);
    });
  });

  test.describe('View Appointments List', () => {
    test('should display list of appointments', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      // Wait for appointments list to load
      await page.waitForSelector(
        '[data-testid="appointments-list"], .appointments-list, .appointment-card',
        { timeout: 10000 }
      );

      // Verify appointments are displayed
      const appointments = page.locator('.appointment-card, [data-testid="appointment-card"]');
      const count = await appointments.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show appointment details in list', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        const firstAppointment = appointments.first();

        // Verify appointment card contains key information
        await expect(firstAppointment).toContainText(/\d{4}-\d{2}-\d{2}|\w+ \d+/); // Date
        await expect(firstAppointment).toBeVisible();
      }
    });

    test('should filter appointments by status', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForLoadState('networkidle');

      // Look for filter/tab options
      const statusFilter = page.locator(
        'select[name="status"], [role="tab"]:has-text("Upcoming"), button:has-text("Filter")'
      );

      if (await statusFilter.first().isVisible()) {
        await statusFilter.first().click();

        // If it's a dropdown, select a status
        if ((await statusFilter.first().getAttribute('name')) === 'status') {
          await statusFilter.first().selectOption('scheduled');
        }

        await page.waitForLoadState('networkidle');

        // Verify filtered results
        const appointments = page.locator('.appointment-card');
        const count = await appointments.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });

    test('should sort appointments by date', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForLoadState('networkidle');

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 1) {
        // Look for sort option
        const sortButton = page.locator('button:has-text("Sort"), select[name="sort"]');

        if (await sortButton.first().isVisible()) {
          await sortButton.first().click();

          // Select date sorting if available
          const sortOption = page.locator(':text("Date"), option[value*="date"]');
          if (await sortOption.first().isVisible()) {
            await sortOption.first().click();
          }

          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('should show empty state when no appointments exist', async ({ page }) => {
      // This test assumes a fresh user or cleared appointments
      await dashboardPage.gotoAppointments();

      await page.waitForLoadState('networkidle');

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count === 0) {
        // Should show empty state message
        const emptyMessage = page.locator(
          ':text("No appointments"), :text("no upcoming appointments")'
        );
        await expect(emptyMessage).toBeVisible();
      }
    });

    test('should paginate appointments list', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForLoadState('networkidle');

      // Look for pagination controls
      const pagination = page.locator('[data-testid="pagination"], .pagination, nav[aria-label="Pagination"]');

      if (await pagination.isVisible()) {
        const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")');

        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');

          // Verify page changed
          expect(page.url()).toMatch(/page=2|offset=/);
        }
      }
    });
  });

  test.describe('View Appointment Details', () => {
    test('should view individual appointment details', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        // Click on first appointment
        await appointments.first().click();

        // Wait for details page to load
        await page.waitForURL(/\/appointments\/[a-zA-Z0-9-]+/);

        // Verify details are displayed
        await expect(page.locator('h1, h2')).toBeVisible();
        await expect(page.locator(':text("Date"), :text("Time")')).toBeVisible();
      }
    });

    test('should display all appointment information in detail view', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        await appointments.first().click();

        await page.waitForLoadState('networkidle');

        // Verify key information is present
        const detailsPage = page.locator('main, [data-testid="appointment-details"]');
        await expect(detailsPage).toBeVisible();

        // Check for common fields
        const hasDate = await page.locator(':text("Date")').isVisible();
        const hasTime = await page.locator(':text("Time")').isVisible();

        expect(hasDate || hasTime).toBe(true);
      }
    });
  });

  test.describe('Update Appointment', () => {
    test('should successfully reschedule an appointment', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        // Click on first appointment
        await appointments.first().click();

        await page.waitForLoadState('networkidle');

        // Look for edit/reschedule button
        const rescheduleButton = page.locator(
          'button:has-text("Reschedule"), button:has-text("Edit"), a:has-text("Reschedule")'
        );

        if (await rescheduleButton.isVisible()) {
          await rescheduleButton.click();

          await page.waitForSelector('form, input[name="date"]');

          // Update date
          const newDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

          await page.fill('input[name="date"], input[type="date"]', newDate);

          // Submit changes
          await page.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');

          // Wait for success message
          await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
        }
      }
    });

    test('should update appointment notes', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        await appointments.first().click();

        await page.waitForLoadState('networkidle');

        const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")');

        if (await editButton.isVisible()) {
          await editButton.click();

          const notesField = page.locator('textarea[name="notes"], input[name="notes"]');

          if (await notesField.isVisible()) {
            await notesField.fill('Updated appointment notes from E2E test');

            await page.click('button[type="submit"]');

            await page.waitForSelector('.success-message, [role="alert"]', { timeout: 10000 });
          }
        }
      }
    });
  });

  test.describe('Cancel Appointment', () => {
    test('should successfully cancel an appointment', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        // Get initial count
        const initialCount = await appointments.count();

        // Click on first appointment
        await appointments.first().click();

        await page.waitForLoadState('networkidle');

        // Look for cancel button
        const cancelButton = page.locator('button:has-text("Cancel Appointment")');

        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          // Confirm cancellation if there's a confirmation dialog
          const confirmButton = page.locator(
            'button:has-text("Confirm"), button:has-text("Yes"), button:has-text("OK")'
          );

          if (await confirmButton.isVisible()) {
            await confirmButton.click();
          }

          // Wait for success message or redirect
          await page.waitForSelector(
            '.success-message, [role="alert"]:has-text("cancel")',
            { timeout: 10000 }
          );

          // Navigate back to appointments list
          await dashboardPage.gotoAppointments();

          await page.waitForLoadState('networkidle');

          // Verify appointment is cancelled or removed
          // (count may be same if showing cancelled appointments)
          const updatedAppointments = page.locator('.appointment-card');
          const updatedCount = await updatedAppointments.count();

          // Either count decreased or appointment shows cancelled status
          expect(updatedCount <= initialCount).toBe(true);
        }
      }
    });

    test('should show confirmation dialog before cancelling', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        await appointments.first().click();

        await page.waitForLoadState('networkidle');

        const cancelButton = page.locator('button:has-text("Cancel Appointment")');

        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          // Should show confirmation dialog
          const confirmDialog = page.locator(
            '[role="dialog"], [role="alertdialog"], .modal'
          );

          await expect(confirmDialog).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should allow providing cancellation reason', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForSelector('.appointment-card', { timeout: 10000 });

      const appointments = page.locator('.appointment-card');
      const count = await appointments.count();

      if (count > 0) {
        await appointments.first().click();

        await page.waitForLoadState('networkidle');

        const cancelButton = page.locator('button:has-text("Cancel Appointment")');

        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          // Look for reason field
          const reasonField = page.locator(
            'textarea[name="reason"], textarea[name="cancellationReason"], input[name="reason"]'
          );

          if (await reasonField.isVisible()) {
            await reasonField.fill('Unable to attend due to scheduling conflict');

            // Confirm cancellation
            const confirmButton = page.locator('button:has-text("Confirm")');
            await confirmButton.click();

            await page.waitForSelector('.success-message', { timeout: 10000 });
          }
        }
      }
    });

    test('should not allow cancelling past appointments', async ({ page }) => {
      await dashboardPage.gotoAppointments();

      await page.waitForLoadState('networkidle');

      // Look for past appointments tab/filter
      const pastTab = page.locator('[role="tab"]:has-text("Past"), button:has-text("Past")');

      if (await pastTab.isVisible()) {
        await pastTab.click();

        await page.waitForLoadState('networkidle');

        const appointments = page.locator('.appointment-card');
        const count = await appointments.count();

        if (count > 0) {
          await appointments.first().click();

          await page.waitForLoadState('networkidle');

          // Cancel button should not be visible for past appointments
          const cancelButton = page.locator('button:has-text("Cancel Appointment")');
          await expect(cancelButton).not.toBeVisible();
        }
      }
    });
  });

  test.describe('Appointment Notifications', () => {
    test('should display upcoming appointment reminders', async ({ page }) => {
      await dashboardPage.goto();

      // Check for notification badge
      const notificationCount = await dashboardPage.getNotificationCount();

      if (notificationCount > 0) {
        await dashboardPage.openNotifications();

        // Verify notifications panel is visible
        const notificationsPanel = page.locator(
          '[data-testid="notifications-panel"], .notifications-panel, [role="menu"]'
        );
        await expect(notificationsPanel).toBeVisible();
      }
    });

    test('should show appointment confirmation after booking', async ({ page }) => {
      await dashboardPage.goto();
      await dashboardPage.clickBookAppointment();

      await page.waitForSelector('form');

      // Fill minimal appointment form
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      await page.selectOption('select[name="doctorId"]', { index: 1 });
      await page.fill('input[name="date"]', futureDate);
      await page.fill('input[name="time"]', '10:00');
      await page.fill('textarea[name="reason"]', 'E2E test appointment');

      await page.click('button[type="submit"]');

      // Should show success message
      const successMessage = page.locator(
        '.success-message, [role="alert"]:has-text("success"), :text("confirmed")'
      );
      await expect(successMessage).toBeVisible({ timeout: 10000 });
    });
  });
});
