/**
 * Provider Dashboard Page Object Model
 * For Healthcare Provider Portal
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProviderDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Dashboard overview
  get dashboardContainer(): Locator {
    return this.page.locator('[data-testid="provider-dashboard"], .provider-dashboard');
  }

  get welcomeMessage(): Locator {
    return this.page.locator('[data-testid="welcome-message"], .welcome-message');
  }

  get statsCards(): Locator {
    return this.page.locator('[data-testid="stats-card"], .stats-card');
  }

  // Schedule section
  get scheduleSection(): Locator {
    return this.page.locator('[data-testid="schedule-section"], .schedule-section');
  }

  get todayAppointments(): Locator {
    return this.page.locator('[data-testid="today-appointments"], .today-appointments');
  }

  get appointmentSlots(): Locator {
    return this.page.locator('[data-testid="appointment-slot"], .appointment-slot');
  }

  get calendarView(): Locator {
    return this.page.locator('[data-testid="calendar-view"], .calendar');
  }

  // Patients section
  get patientsSection(): Locator {
    return this.page.locator('[data-testid="patients-section"], .patients-section');
  }

  get patientsList(): Locator {
    return this.page.locator('[data-testid="patients-list"], .patients-list');
  }

  get patientRows(): Locator {
    return this.page.locator('[data-testid="patient-row"], .patient-row');
  }

  get patientSearch(): Locator {
    return this.page.locator('[data-testid="patient-search"], input[placeholder*="patient" i]');
  }

  // Encounters section
  get encountersSection(): Locator {
    return this.page.locator('[data-testid="encounters-section"], .encounters-section');
  }

  get recentEncounters(): Locator {
    return this.page.locator('[data-testid="recent-encounters"], .recent-encounters');
  }

  get encounterRows(): Locator {
    return this.page.locator('[data-testid="encounter-row"], .encounter-row');
  }

  // Clinical notes
  get notesSection(): Locator {
    return this.page.locator('[data-testid="notes-section"], .clinical-notes');
  }

  get noteEditor(): Locator {
    return this.page.locator('[data-testid="note-editor"], .note-editor');
  }

  get noteTemplateSelect(): Locator {
    return this.page.locator('[data-testid="note-template"], select[name="template"]');
  }

  // Tasks/To-dos
  get tasksSection(): Locator {
    return this.page.locator('[data-testid="tasks-section"], .tasks-section');
  }

  get taskItems(): Locator {
    return this.page.locator('[data-testid="task-item"], .task-item');
  }

  get addTaskButton(): Locator {
    return this.page.locator('[data-testid="add-task"], button:has-text("Add Task")');
  }

  // Messages
  get messagesWidget(): Locator {
    return this.page.locator('[data-testid="messages-widget"], .messages-widget');
  }

  get unreadMessagesCount(): Locator {
    return this.page.locator('[data-testid="unread-count"]');
  }

  // Quick actions
  get startVisitButton(): Locator {
    return this.page.locator('[data-testid="start-visit"], button:has-text("Start Visit")');
  }

  get viewScheduleButton(): Locator {
    return this.page.locator('[data-testid="view-schedule"], button:has-text("View Schedule")');
  }

  get viewPatientsButton(): Locator {
    return this.page.locator('[data-testid="view-patients"], button:has-text("View Patients")');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.goto('/provider/dashboard');
    await this.waitForLoadingToComplete();
  }

  async navigateToSchedule(): Promise<void> {
    await this.viewScheduleButton.click();
    await this.waitForLoadingToComplete();
  }

  async navigateToPatients(): Promise<void> {
    await this.viewPatientsButton.click();
    await this.waitForLoadingToComplete();
  }

  // Schedule actions
  async getAppointmentCount(): Promise<number> {
    return await this.appointmentSlots.count();
  }

  async selectAppointment(index: number = 0): Promise<void> {
    await this.appointmentSlots.nth(index).click();
    await this.waitForLoadingToComplete();
  }

  async getAppointmentDetails(index: number = 0): Promise<{
    patientName?: string;
    time?: string;
    type?: string;
    status?: string;
  }> {
    const slot = this.appointmentSlots.nth(index);

    return {
      patientName: await slot.locator('[data-testid="patient-name"]').textContent() || undefined,
      time: await slot.locator('[data-testid="appointment-time"]').textContent() || undefined,
      type: await slot.locator('[data-testid="appointment-type"]').textContent() || undefined,
      status: await slot.locator('[data-testid="appointment-status"]').textContent() || undefined,
    };
  }

  async startVisit(appointmentIndex: number = 0): Promise<void> {
    const slot = this.appointmentSlots.nth(appointmentIndex);
    const startButton = slot.locator('[data-testid="start-visit"], button:has-text("Start")');

    await startButton.click();
    await this.waitForLoadingToComplete();
  }

  // Patient actions
  async searchPatient(query: string): Promise<void> {
    await this.patientSearch.fill(query);
    await this.page.waitForTimeout(500); // Debounce
    await this.waitForLoadingToComplete();
  }

  async selectPatient(index: number = 0): Promise<void> {
    await this.patientRows.nth(index).click();
    await this.waitForLoadingToComplete();
  }

  async getPatientCount(): Promise<number> {
    return await this.patientRows.count();
  }

  // Encounter actions
  async viewEncounter(index: number = 0): Promise<void> {
    await this.encounterRows.nth(index).click();
    await this.waitForLoadingToComplete();
  }

  async createEncounter(patientId: string): Promise<void> {
    const newEncounterButton = this.page.locator('[data-testid="new-encounter"], button:has-text("New Encounter")');
    await newEncounterButton.click();

    const patientSelect = this.page.locator('[data-testid="patient-select"]');
    await patientSelect.selectOption(patientId);

    const createButton = this.page.locator('[role="dialog"] button:has-text("Create")');
    await createButton.click();

    await this.waitForLoadingToComplete();
  }

  // Clinical notes actions
  async createNote(template: string, content: string): Promise<void> {
    await this.noteTemplateSelect.selectOption(template);
    await this.noteEditor.fill(content);

    const saveButton = this.page.locator('[data-testid="save-note"], button:has-text("Save")');
    await saveButton.click();

    await this.waitForLoadingToComplete();
  }

  // Task actions
  async addTask(description: string, priority: string = 'medium'): Promise<void> {
    await this.addTaskButton.click();

    const taskInput = this.page.locator('input[name="taskDescription"]');
    const prioritySelect = this.page.locator('select[name="priority"]');

    await taskInput.fill(description);
    await prioritySelect.selectOption(priority);

    const submitButton = this.page.locator('[role="dialog"] button[type="submit"]');
    await submitButton.click();

    await this.waitForLoadingToComplete();
  }

  async completeTask(index: number = 0): Promise<void> {
    const task = this.taskItems.nth(index);
    const checkbox = task.locator('input[type="checkbox"]');

    await checkbox.check();
    await this.waitForLoadingToComplete();
  }

  async getTaskCount(): Promise<number> {
    return await this.taskItems.count();
  }

  // Stats
  async getStatsValue(statName: string): Promise<string | null> {
    const statCard = this.statsCards.filter({ hasText: statName });
    const value = statCard.locator('[data-testid="stat-value"]');
    return await value.textContent();
  }

  // Assertions
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.dashboardContainer).toBeVisible();
  }

  async expectWelcomeMessage(name: string): Promise<void> {
    await expect(this.welcomeMessage).toContainText(name);
  }

  async expectTodayAppointmentsVisible(): Promise<void> {
    await expect(this.todayAppointments).toBeVisible();
  }

  async expectPatientListVisible(): Promise<void> {
    await expect(this.patientsList).toBeVisible();
  }

  async expectEncountersVisible(): Promise<void> {
    await expect(this.recentEncounters).toBeVisible();
  }

  async expectTaskAdded(description: string): Promise<void> {
    const task = this.taskItems.filter({ hasText: description });
    await expect(task).toBeVisible();
  }

  async expectVisitStarted(): Promise<void> {
    await this.waitForToast('success');
  }

  async expectNoteSaved(): Promise<void> {
    await this.waitForToast('success');
  }
}
