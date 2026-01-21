/**
 * Appointments Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { selectors, routes } from '../fixtures/test-data';

export class AppointmentsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get appointmentsList(): Locator {
    return this.page.locator(selectors.appointmentsList);
  }

  get appointmentCards(): Locator {
    return this.page.locator(selectors.appointmentCard);
  }

  get bookAppointmentButton(): Locator {
    return this.page.locator(selectors.bookAppointmentButton);
  }

  get appointmentForm(): Locator {
    return this.page.locator(selectors.appointmentForm);
  }

  get appointmentTypeSelect(): Locator {
    return this.page.locator(selectors.appointmentTypeSelect);
  }

  get appointmentDateInput(): Locator {
    return this.page.locator(selectors.appointmentDateInput);
  }

  get appointmentTimeInput(): Locator {
    return this.page.locator(selectors.appointmentTimeInput);
  }

  get appointmentReasonInput(): Locator {
    return this.page.locator(selectors.appointmentReasonInput);
  }

  get submitButton(): Locator {
    return this.page.locator(selectors.submitButton);
  }

  get cancelButton(): Locator {
    return this.page.locator(selectors.cancelButton);
  }

  // Filter elements
  get statusFilter(): Locator {
    return this.page.locator('select[name="status"], [data-testid="status-filter"]');
  }

  get searchInput(): Locator {
    return this.page.locator('input[placeholder*="search" i], [data-testid="appointment-search"]');
  }

  get dateRangeFilter(): Locator {
    return this.page.locator('[data-testid="date-range-filter"]');
  }

  // Actions
  async navigate(): Promise<void> {
    await this.goto(routes.web.appointments);
    await this.waitForLoadingToComplete();
  }

  async navigateToBooking(): Promise<void> {
    await this.goto(routes.web.bookAppointment);
    await this.waitForLoadingToComplete();
  }

  async clickBookAppointment(): Promise<void> {
    await this.bookAppointmentButton.click();
  }

  async selectAppointmentType(type: string): Promise<void> {
    await this.appointmentTypeSelect.selectOption(type);
  }

  async setAppointmentDate(date: string): Promise<void> {
    await this.appointmentDateInput.fill(date);
  }

  async setAppointmentTime(time: string): Promise<void> {
    await this.appointmentTimeInput.fill(time);
  }

  async setAppointmentReason(reason: string): Promise<void> {
    await this.appointmentReasonInput.fill(reason);
  }

  async selectProvider(providerName: string): Promise<void> {
    const providerSelect = this.page.locator('select[name="providerId"], [data-testid="provider-select"]');
    await providerSelect.selectOption({ label: providerName });
  }

  async submitBooking(): Promise<void> {
    await this.submitButton.click();
    await this.waitForLoadingToComplete();
  }

  async cancelBooking(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Complete appointment booking flow
   */
  async bookAppointment(options: {
    type: string;
    date: string;
    time: string;
    reason: string;
    provider?: string;
  }): Promise<void> {
    await this.navigateToBooking();

    if (options.provider) {
      await this.selectProvider(options.provider);
    }

    await this.selectAppointmentType(options.type);
    await this.setAppointmentDate(options.date);
    await this.setAppointmentTime(options.time);
    await this.setAppointmentReason(options.reason);

    await this.submitBooking();
  }

  // Filter actions
  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption(status);
    await this.waitForLoadingToComplete();
  }

  async searchAppointments(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
    await this.waitForLoadingToComplete();
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.waitForLoadingToComplete();
  }

  // Appointment card actions
  async clickAppointment(index: number = 0): Promise<void> {
    await this.appointmentCards.nth(index).click();
  }

  async getAppointmentCount(): Promise<number> {
    return await this.appointmentCards.count();
  }

  async getAppointmentDetails(index: number = 0): Promise<{
    date?: string;
    time?: string;
    provider?: string;
    type?: string;
    status?: string;
    reason?: string;
  }> {
    const card = this.appointmentCards.nth(index);

    return {
      date: await card.locator('[data-testid="appointment-date"]').textContent() || undefined,
      time: await card.locator('[data-testid="appointment-time"]').textContent() || undefined,
      provider: await card.locator('[data-testid="doctor-name"]').textContent() || undefined,
      type: await card.locator('[data-testid="appointment-type"]').textContent() || undefined,
      status: await card.locator('[data-testid="appointment-status"]').textContent() || undefined,
      reason: await card.locator('[data-testid="appointment-reason"]').textContent() || undefined,
    };
  }

  async cancelAppointment(index: number = 0): Promise<void> {
    const card = this.appointmentCards.nth(index);
    const cancelButton = card.locator('button:has-text("Cancel"), [data-testid="cancel-appointment"]');

    await cancelButton.click();

    // Confirm cancellation if dialog appears
    const confirmButton = this.page.locator('[role="dialog"] button:has-text("Confirm"), [data-testid="confirm-cancel"]');
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }

    await this.waitForLoadingToComplete();
  }

  async rescheduleAppointment(index: number = 0): Promise<void> {
    const card = this.appointmentCards.nth(index);
    const rescheduleButton = card.locator('button:has-text("Reschedule"), [data-testid="reschedule-appointment"]');

    await rescheduleButton.click();
    await this.waitForLoadingToComplete();
  }

  // Assertions
  async expectAppointmentsListVisible(): Promise<void> {
    await expect(this.appointmentsList).toBeVisible();
  }

  async expectNoAppointments(): Promise<void> {
    const noAppointments = this.page.locator('[data-testid="no-appointments"], .no-appointments');
    await expect(noAppointments).toBeVisible();
  }

  async expectAppointmentCount(count: number): Promise<void> {
    await expect(this.appointmentCards).toHaveCount(count);
  }

  async expectBookingFormVisible(): Promise<void> {
    await expect(this.appointmentForm).toBeVisible();
  }

  async expectBookingSuccess(): Promise<void> {
    await this.waitForToast('success');
  }

  async expectBookingError(): Promise<void> {
    await this.waitForToast('error');
  }

  async expectValidationError(field: string): Promise<void> {
    const errorMessage = this.page.locator(`[data-testid="${field}-error"], .${field}-error`);
    await expect(errorMessage).toBeVisible();
  }

  // Time slot selection
  get timeSlots(): Locator {
    return this.page.locator('[data-testid="time-slot"]');
  }

  async selectTimeSlot(index: number = 0): Promise<void> {
    await this.timeSlots.nth(index).click();
  }

  async getAvailableTimeSlotsCount(): Promise<number> {
    return await this.timeSlots.count();
  }

  async selectFirstAvailableTimeSlot(): Promise<void> {
    const availableSlot = this.timeSlots.filter({ hasNot: this.page.locator('.disabled, [disabled]') }).first();
    await availableSlot.click();
  }
}
