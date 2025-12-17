import { Page, Locator, expect } from '@playwright/test';

/**
 * Appointments Page Object Model
 *
 * Encapsulates the appointments page elements and actions
 */
export class AppointmentsPage {
  readonly page: Page;

  // List view elements
  readonly appointmentsList: Locator;
  readonly appointmentCards: Locator;
  readonly emptyStateMessage: Locator;
  readonly createAppointmentButton: Locator;

  // Filter and search elements
  readonly statusFilter: Locator;
  readonly searchInput: Locator;
  readonly sortButton: Locator;
  readonly dateFilter: Locator;

  // Appointment form elements
  readonly appointmentTypeSelect: Locator;
  readonly doctorSelect: Locator;
  readonly dateInput: Locator;
  readonly timeInput: Locator;
  readonly reasonInput: Locator;
  readonly notesInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  // Appointment details elements
  readonly appointmentDate: Locator;
  readonly appointmentTime: Locator;
  readonly appointmentDoctor: Locator;
  readonly appointmentType: Locator;
  readonly appointmentStatus: Locator;
  readonly appointmentReason: Locator;
  readonly appointmentNotes: Locator;

  // Action buttons
  readonly editButton: Locator;
  readonly rescheduleButton: Locator;
  readonly cancelAppointmentButton: Locator;
  readonly confirmCancelButton: Locator;
  readonly backButton: Locator;

  // Time slots
  readonly timeSlots: Locator;
  readonly availableTimeSlot: Locator;

  // Messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // List view
    this.appointmentsList = page.locator('[data-testid="appointments-list"], .appointments-list');
    this.appointmentCards = page.locator('[data-testid="appointment-card"], .appointment-card');
    this.emptyStateMessage = page.locator(':text("No appointments"), :text("no upcoming appointments")');
    this.createAppointmentButton = page.locator('button:has-text("Book Appointment"), a:has-text("Book Appointment")');

    // Filters
    this.statusFilter = page.locator('select[name="status"], [role="tab"]');
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]');
    this.sortButton = page.locator('button:has-text("Sort"), select[name="sort"]');
    this.dateFilter = page.locator('input[type="date"][name*="filter"], select[name="dateFilter"]');

    // Form fields
    this.appointmentTypeSelect = page.locator('select[name="appointmentType"], select[name="type"]');
    this.doctorSelect = page.locator('select[name="doctorId"], select[name="doctor"]');
    this.dateInput = page.locator('input[name="date"], input[type="date"]');
    this.timeInput = page.locator('input[name="time"], input[type="time"]');
    this.reasonInput = page.locator('textarea[name="reason"], input[name="reason"]');
    this.notesInput = page.locator('textarea[name="notes"], input[name="notes"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("Book"), button:has-text("Schedule"), button:has-text("Save")');
    this.cancelButton = page.locator('button:has-text("Cancel"):not(:has-text("Cancel Appointment"))');

    // Details view
    this.appointmentDate = page.locator('[data-testid="appointment-date"], .appointment-date');
    this.appointmentTime = page.locator('[data-testid="appointment-time"], .appointment-time');
    this.appointmentDoctor = page.locator('[data-testid="doctor-name"], .doctor-name');
    this.appointmentType = page.locator('[data-testid="appointment-type"], .appointment-type');
    this.appointmentStatus = page.locator('[data-testid="appointment-status"], .appointment-status');
    this.appointmentReason = page.locator('[data-testid="appointment-reason"], .appointment-reason');
    this.appointmentNotes = page.locator('[data-testid="appointment-notes"], .appointment-notes');

    // Actions
    this.editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")');
    this.rescheduleButton = page.locator('button:has-text("Reschedule"), a:has-text("Reschedule")');
    this.cancelAppointmentButton = page.locator('button:has-text("Cancel Appointment")');
    this.confirmCancelButton = page.locator('[role="dialog"] button:has-text("Confirm"), [role="dialog"] button:has-text("Yes")');
    this.backButton = page.locator('button:has-text("Back"), a:has-text("Back")');

    // Time slots
    this.timeSlots = page.locator('.time-slot, [data-testid="time-slot"]');
    this.availableTimeSlot = page.locator('.time-slot:not(.disabled), [data-testid="time-slot"]:not([disabled])');

    // Messages
    this.successMessage = page.locator('.success-message, [role="alert"]:has-text("success")');
    this.errorMessage = page.locator('.error-message, [role="alert"]:has-text("error")');
  }

  /**
   * Navigate to appointments page
   */
  async goto() {
    await this.page.goto('/appointments');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Create a new appointment
   */
  async createAppointment(data: {
    type: string;
    doctorId: string;
    date: string;
    time: string;
    reason: string;
    notes?: string;
  }) {
    await this.createAppointmentButton.click();
    await this.page.waitForSelector('form, [data-testid="appointment-form"]');

    await this.appointmentTypeSelect.selectOption(data.type);
    await this.doctorSelect.selectOption(data.doctorId);
    await this.dateInput.fill(data.date);
    await this.timeInput.fill(data.time);
    await this.reasonInput.fill(data.reason);

    if (data.notes) {
      await this.notesInput.fill(data.notes);
    }

    await this.submitButton.click();
  }

  /**
   * Get all appointments count
   */
  async getAppointmentsCount(): Promise<number> {
    return await this.appointmentCards.count();
  }

  /**
   * Click on appointment by index
   */
  async clickAppointment(index: number = 0) {
    await this.appointmentCards.nth(index).click();
  }

  /**
   * Filter appointments by status
   */
  async filterByStatus(status: string) {
    const firstFilter = this.statusFilter.first();

    if ((await firstFilter.getAttribute('role')) === 'tab') {
      // It's a tab, click it
      const tab = this.page.locator(`[role="tab"]:has-text("${status}")`);
      await tab.click();
    } else {
      // It's a select, choose option
      await firstFilter.selectOption(status);
    }

    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search appointments
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select time slot
   */
  async selectTimeSlot(index: number = 0) {
    const slots = this.availableTimeSlot;
    await slots.nth(index).click();
  }

  /**
   * Reschedule appointment
   */
  async reschedule(newDate: string, newTime: string) {
    await this.rescheduleButton.click();
    await this.page.waitForSelector('form, input[name="date"]');

    await this.dateInput.fill(newDate);
    await this.timeInput.fill(newTime);

    await this.submitButton.click();
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(reason?: string) {
    await this.cancelAppointmentButton.click();

    // Wait for confirmation dialog
    await this.page.waitForSelector('[role="dialog"], [role="alertdialog"]', { timeout: 5000 });

    // Fill reason if provided and field exists
    if (reason) {
      const reasonField = this.page.locator('textarea[name="reason"], input[name="reason"]');
      if (await reasonField.isVisible().catch(() => false)) {
        await reasonField.fill(reason);
      }
    }

    // Confirm cancellation
    await this.confirmCancelButton.click();
  }

  /**
   * Update appointment notes
   */
  async updateNotes(notes: string) {
    await this.editButton.click();
    await this.page.waitForSelector('form');

    await this.notesInput.clear();
    await this.notesInput.fill(notes);

    await this.submitButton.click();
  }

  /**
   * Get appointment details
   */
  async getAppointmentDetails() {
    return {
      date: await this.appointmentDate.textContent(),
      time: await this.appointmentTime.textContent(),
      doctor: await this.appointmentDoctor.textContent(),
      type: await this.appointmentType.textContent(),
      status: await this.appointmentStatus.textContent().catch(() => null),
      reason: await this.appointmentReason.textContent().catch(() => null),
      notes: await this.appointmentNotes.textContent().catch(() => null),
    };
  }

  /**
   * Assert appointments list is displayed
   */
  async assertAppointmentsListDisplayed() {
    await expect(this.appointmentsList).toBeVisible();
  }

  /**
   * Assert appointment card exists
   */
  async assertAppointmentCardExists(index: number = 0) {
    await expect(this.appointmentCards.nth(index)).toBeVisible();
  }

  /**
   * Assert empty state is displayed
   */
  async assertEmptyStateDisplayed() {
    await expect(this.emptyStateMessage).toBeVisible();
  }

  /**
   * Assert success message
   */
  async assertSuccessMessage(message?: string) {
    await expect(this.successMessage).toBeVisible();
    if (message) {
      await expect(this.successMessage).toContainText(message);
    }
  }

  /**
   * Assert error message
   */
  async assertErrorMessage(message?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  /**
   * Wait for appointment to load
   */
  async waitForAppointmentLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.appointmentDate.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Assert form validation error
   */
  async assertFormValidationError(field: string) {
    const error = this.page.locator(`[name="${field}"] ~ .error, [name="${field}"] + .error, .error:has-text("${field}")`);
    await expect(error).toBeVisible();
  }

  /**
   * Get available doctors count
   */
  async getAvailableDoctorsCount(): Promise<number> {
    const options = this.doctorSelect.locator('option');
    const count = await options.count();
    // Subtract 1 for the default "Select doctor" option
    return Math.max(0, count - 1);
  }

  /**
   * Get available time slots count
   */
  async getAvailableTimeSlotsCount(): Promise<number> {
    return await this.availableTimeSlot.count();
  }

  /**
   * Navigate back
   */
  async goBack() {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if appointment can be cancelled
   */
  async canCancelAppointment(): Promise<boolean> {
    return await this.cancelAppointmentButton.isVisible();
  }

  /**
   * Check if appointment can be rescheduled
   */
  async canRescheduleAppointment(): Promise<boolean> {
    return await this.rescheduleButton.isVisible();
  }
}
