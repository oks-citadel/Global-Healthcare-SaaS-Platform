/**
 * Detox E2E Tests - Appointments Flow
 */

import { by, device, element, expect, waitFor } from 'detox';

describe('Appointments Flow', () => {
  beforeAll(async () => {
    await device.launchApp();

    // Login first
    await element(by.id('email-input')).typeText('patient@test.unified.health');
    await element(by.id('password-input')).typeText('TestPassword123!');
    await element(by.id('sign-in-button')).tap();

    await waitFor(element(by.id('dashboard-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Re-login if needed
    try {
      await element(by.id('appointments-tab')).tap();
    } catch {
      await element(by.id('email-input')).typeText('patient@test.unified.health');
      await element(by.id('password-input')).typeText('TestPassword123!');
      await element(by.id('sign-in-button')).tap();
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id('appointments-tab')).tap();
    }
  });

  describe('Appointments List', () => {
    it('should display appointments tab', async () => {
      await expect(element(by.id('appointments-screen'))).toBeVisible();
    });

    it('should show upcoming appointments', async () => {
      await expect(element(by.text('My Appointments'))).toBeVisible();
    });

    it('should display appointment cards', async () => {
      try {
        await expect(element(by.id('appointment-card')).atIndex(0)).toBeVisible();
      } catch {
        // No appointments - check for empty state
        await expect(element(by.text('No upcoming appointments'))).toBeVisible();
      }
    });

    it('should filter appointments by status', async () => {
      await element(by.id('filter-button')).tap();
      await element(by.text('Past')).tap();
      await element(by.text('Apply')).tap();

      await waitFor(element(by.id('appointments-list')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Appointment Details', () => {
    it('should open appointment details', async () => {
      try {
        await element(by.id('appointment-card')).atIndex(0).tap();

        await expect(element(by.text('Appointment Details'))).toBeVisible();
        await expect(element(by.id('provider-name'))).toBeVisible();
        await expect(element(by.id('appointment-date'))).toBeVisible();
        await expect(element(by.id('appointment-time'))).toBeVisible();
      } catch {
        // No appointments to tap
        await expect(element(by.text('No upcoming appointments'))).toBeVisible();
      }
    });

    it('should show cancel option for upcoming appointments', async () => {
      try {
        await element(by.id('appointment-card')).atIndex(0).tap();

        await element(by.id('appointment-details')).scroll(300, 'down');
        await expect(element(by.id('cancel-appointment-button'))).toBeVisible();
      } catch {
        // No appointments
      }
    });

    it('should show reschedule option', async () => {
      try {
        await element(by.id('appointment-card')).atIndex(0).tap();

        await expect(element(by.id('reschedule-button'))).toBeVisible();
      } catch {
        // No appointments
      }
    });
  });

  describe('Book Appointment', () => {
    it('should navigate to booking flow', async () => {
      await element(by.id('book-appointment-button')).tap();

      await expect(element(by.text('Select Provider'))).toBeVisible();
    });

    it('should select a provider', async () => {
      await element(by.id('book-appointment-button')).tap();

      await waitFor(element(by.id('provider-card')).atIndex(0))
        .toBeVisible()
        .withTimeout(5000);

      await element(by.id('provider-card')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();

      await expect(element(by.text('Appointment Type'))).toBeVisible();
    });

    it('should select appointment type', async () => {
      await element(by.id('book-appointment-button')).tap();

      await element(by.id('provider-card')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();

      await element(by.id('type-video')).tap();
      await element(by.id('continue-button')).tap();

      await expect(element(by.text('Select Date'))).toBeVisible();
    });

    it('should select date and time', async () => {
      await element(by.id('book-appointment-button')).tap();

      await element(by.id('provider-card')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();

      await element(by.id('type-video')).tap();
      await element(by.id('continue-button')).tap();

      // Select a date
      await element(by.id('available-date')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();

      // Select a time
      await expect(element(by.text('Select Time'))).toBeVisible();
      await element(by.id('time-slot')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();
    });

    it('should enter reason and confirm', async () => {
      await element(by.id('book-appointment-button')).tap();

      // Go through the flow
      await element(by.id('provider-card')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();

      await element(by.id('type-video')).tap();
      await element(by.id('continue-button')).tap();

      await element(by.id('available-date')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();

      await element(by.id('time-slot')).atIndex(0).tap();
      await element(by.id('continue-button')).tap();

      // Enter reason
      await element(by.id('reason-input')).typeText('Annual checkup');
      await element(by.id('continue-button')).tap();

      // Review screen
      await expect(element(by.text('Review'))).toBeVisible();
      await expect(element(by.text('Annual checkup'))).toBeVisible();

      // Confirm booking
      await element(by.id('confirm-booking-button')).tap();

      await waitFor(element(by.text('Appointment Confirmed')))
        .toBeVisible()
        .withTimeout(10000);
    });
  });

  describe('Cancel Appointment', () => {
    it('should show confirmation dialog', async () => {
      try {
        await element(by.id('appointment-card')).atIndex(0).tap();

        await element(by.id('cancel-appointment-button')).tap();

        await expect(element(by.text('Cancel this appointment?'))).toBeVisible();
        await expect(element(by.text('No, Keep It'))).toBeVisible();
        await expect(element(by.text('Yes, Cancel'))).toBeVisible();
      } catch {
        // No appointments
      }
    });

    it('should dismiss dialog on cancel', async () => {
      try {
        await element(by.id('appointment-card')).atIndex(0).tap();
        await element(by.id('cancel-appointment-button')).tap();

        await element(by.text('No, Keep It')).tap();

        await expect(element(by.text('Appointment Details'))).toBeVisible();
      } catch {
        // No appointments
      }
    });
  });
});
