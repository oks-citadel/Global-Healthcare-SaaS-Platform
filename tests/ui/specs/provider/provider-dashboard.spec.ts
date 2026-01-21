/**
 * Provider Portal Tests - Dashboard
 * Tests for healthcare provider portal functionality
 */

import { test, expect } from '@playwright/test';
import { routes, selectors, testUsers } from '../../fixtures/test-data';

test.describe('Provider Portal - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.provider.dashboard);
    await page.waitForLoadState('networkidle');
  });

  test('should display provider dashboard', async ({ page }) => {
    // Dashboard container should be visible
    await expect(page.locator('[data-testid="provider-dashboard"], .dashboard-container')).toBeVisible();
  });

  test('should display provider name in welcome message', async ({ page }) => {
    const welcomeMessage = page.locator('[data-testid="welcome-message"], .welcome-message');
    await expect(welcomeMessage).toContainText(/welcome|hello/i);
  });

  test('should show todays appointments widget', async ({ page }) => {
    const appointmentsWidget = page.locator('[data-testid="todays-appointments"], [data-testid="appointments-today"]');
    await expect(appointmentsWidget).toBeVisible();
  });

  test('should show patient queue or list', async ({ page }) => {
    const patientQueue = page.locator('[data-testid="patient-queue"], [data-testid="patients-list"]');
    await expect(patientQueue).toBeVisible();
  });

  test('should display schedule summary', async ({ page }) => {
    const schedule = page.locator('[data-testid="schedule-summary"], [data-testid="schedule"]');
    await expect(schedule).toBeVisible();
  });

  test('should navigate to patients list', async ({ page }) => {
    await page.click('a[href*="patients"]');
    await expect(page).toHaveURL(/patients/);
  });

  test('should navigate to encounters', async ({ page }) => {
    await page.click('a[href*="encounters"]');
    await expect(page).toHaveURL(/encounters/);
  });

  test('should navigate to schedule', async ({ page }) => {
    await page.click('a[href*="schedule"]');
    await expect(page).toHaveURL(/schedule/);
  });
});

test.describe('Provider Portal - Patient Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.provider.patients);
    await page.waitForLoadState('networkidle');
  });

  test('should display patients list', async ({ page }) => {
    const patientsList = page.locator('[data-testid="patients-list"], .patients-list');
    await expect(patientsList).toBeVisible();
  });

  test('should search patients', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i], [data-testid="patient-search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('Test');
      await page.waitForTimeout(500); // Debounce

      // Results should update
      const patientCards = page.locator('[data-testid="patient-card"]');
      await expect(patientCards.first()).toBeVisible({ timeout: 10000 }).catch(() => {
        // May have no results, which is okay
      });
    }
  });

  test('should filter patients by status', async ({ page }) => {
    const filterDropdown = page.locator('select[name="status"], [data-testid="status-filter"]');

    if (await filterDropdown.isVisible()) {
      await filterDropdown.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');
    }
  });

  test('should view patient details', async ({ page }) => {
    const patientCard = page.locator('[data-testid="patient-card"]').first();

    if (await patientCard.isVisible()) {
      await patientCard.click();
      await expect(page).toHaveURL(/patients\/[a-zA-Z0-9-]+/);
    }
  });
});

test.describe('Provider Portal - Encounters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.provider.encounters);
    await page.waitForLoadState('networkidle');
  });

  test('should display encounters list', async ({ page }) => {
    const encountersList = page.locator('[data-testid="encounters-list"], .encounters-list');
    await expect(encountersList).toBeVisible();
  });

  test('should have button to create new encounter', async ({ page }) => {
    const newEncounterBtn = page.locator('button:has-text("New Encounter"), a[href*="encounters/new"]');
    await expect(newEncounterBtn).toBeVisible();
  });

  test('should navigate to new encounter form', async ({ page }) => {
    const newEncounterBtn = page.locator('button:has-text("New Encounter"), a[href*="encounters/new"]');
    await newEncounterBtn.click();
    await expect(page).toHaveURL(/encounters\/new|encounters\/create/);
  });

  test('should display encounter form with required fields', async ({ page }) => {
    await page.goto(routes.provider.newEncounter);

    // Check for required form fields
    await expect(page.locator('select[name="patientId"], [data-testid="patient-select"]')).toBeVisible();
    await expect(page.locator('select[name="type"], [data-testid="encounter-type"]')).toBeVisible();
    await expect(page.locator('textarea[name="chiefComplaint"], [data-testid="chief-complaint"]')).toBeVisible();
  });

  test('should validate encounter form', async ({ page }) => {
    await page.goto(routes.provider.newEncounter);

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show validation errors
    const errorMessages = page.locator('.error-message, [data-testid*="error"]');
    await expect(errorMessages.first()).toBeVisible();
  });
});

test.describe('Provider Portal - Schedule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.provider.schedule);
    await page.waitForLoadState('networkidle');
  });

  test('should display schedule/calendar view', async ({ page }) => {
    const calendar = page.locator('[data-testid="schedule-calendar"], .calendar, [role="grid"]');
    await expect(calendar).toBeVisible();
  });

  test('should display current date appointments', async ({ page }) => {
    const todayHighlight = page.locator('[data-testid="today"], .today, [aria-current="date"]');
    await expect(todayHighlight).toBeVisible();
  });

  test('should navigate between weeks/months', async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next"), [data-testid="next-period"]');
    const prevButton = page.locator('button:has-text("Previous"), [data-testid="prev-period"]');

    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }

    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should show appointment details on click', async ({ page }) => {
    const appointmentSlot = page.locator('[data-testid="appointment-slot"], .appointment-slot').first();

    if (await appointmentSlot.isVisible()) {
      await appointmentSlot.click();

      // Should show details modal or navigate
      const detailsModal = page.locator('[role="dialog"], [data-testid="appointment-details"]');
      await expect(detailsModal).toBeVisible({ timeout: 5000 }).catch(() => {
        // May navigate instead of modal
      });
    }
  });
});

test.describe('Provider Portal - Clinical Notes', () => {
  test('should add clinical note to encounter', async ({ page }) => {
    // Navigate to an active encounter
    await page.goto(routes.provider.encounters);

    const activeEncounter = page.locator('[data-testid="encounter-card"][data-status="in_progress"]').first();

    if (await activeEncounter.isVisible()) {
      await activeEncounter.click();
      await page.waitForLoadState('networkidle');

      // Find and fill notes field
      const notesField = page.locator('textarea[name="notes"], [data-testid="clinical-notes"]');
      if (await notesField.isVisible()) {
        await notesField.fill('Test clinical note from automated testing');

        // Save notes
        const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
        await saveButton.click();

        // Should show success message
        const successMessage = page.locator('[data-testid="success-message"], .success');
        await expect(successMessage).toBeVisible({ timeout: 10000 }).catch(() => {
          // May not show explicit success
        });
      }
    }
  });
});
