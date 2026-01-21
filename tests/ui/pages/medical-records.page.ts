/**
 * Medical Records Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../fixtures/test-data';

export class MedicalRecordsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get recordsContainer(): Locator {
    return this.page.locator('[data-testid="medical-records"], .medical-records-container');
  }

  get recordsNav(): Locator {
    return this.page.locator('[data-testid="records-nav"], .records-navigation');
  }

  // Sections
  get labResultsSection(): Locator {
    return this.page.locator('[data-testid="lab-results"], .lab-results-section');
  }

  get prescriptionsSection(): Locator {
    return this.page.locator('[data-testid="prescriptions"], .prescriptions-section');
  }

  get immunizationsSection(): Locator {
    return this.page.locator('[data-testid="immunizations"], .immunizations-section');
  }

  get allergiesSection(): Locator {
    return this.page.locator('[data-testid="allergies"], .allergies-section');
  }

  get conditionsSection(): Locator {
    return this.page.locator('[data-testid="conditions"], .conditions-section');
  }

  get visitHistorySection(): Locator {
    return this.page.locator('[data-testid="visit-history"], .visit-history-section');
  }

  // Lab results
  get labResultCards(): Locator {
    return this.page.locator('[data-testid="lab-result-card"], .lab-result-card');
  }

  // Prescriptions
  get prescriptionCards(): Locator {
    return this.page.locator('[data-testid="prescription-card"], .prescription-card');
  }

  get requestRefillButton(): Locator {
    return this.page.locator('[data-testid="request-refill"], button:has-text("Request Refill")');
  }

  // Immunizations
  get immunizationRows(): Locator {
    return this.page.locator('[data-testid="immunization-row"], .immunization-row');
  }

  // Allergies
  get allergyTags(): Locator {
    return this.page.locator('[data-testid="allergy-tag"], .allergy-tag');
  }

  get addAllergyButton(): Locator {
    return this.page.locator('[data-testid="add-allergy"], button:has-text("Add Allergy")');
  }

  // Conditions
  get conditionRows(): Locator {
    return this.page.locator('[data-testid="condition-row"], .condition-row');
  }

  // Visit history
  get visitHistoryRows(): Locator {
    return this.page.locator('[data-testid="visit-row"], .visit-row');
  }

  // Search and filter
  get searchInput(): Locator {
    return this.page.locator('input[placeholder*="search" i], [data-testid="records-search"]');
  }

  get dateRangeFilter(): Locator {
    return this.page.locator('[data-testid="date-range-filter"]');
  }

  get categoryFilter(): Locator {
    return this.page.locator('[data-testid="category-filter"], select[name="category"]');
  }

  // Actions
  get downloadButton(): Locator {
    return this.page.locator('[data-testid="download-records"], button:has-text("Download")');
  }

  get printButton(): Locator {
    return this.page.locator('[data-testid="print-records"], button:has-text("Print")');
  }

  get shareButton(): Locator {
    return this.page.locator('[data-testid="share-records"], button:has-text("Share")');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.goto(routes.web.medicalRecords || '/records');
    await this.waitForLoadingToComplete();
  }

  // Section navigation
  async navigateToSection(section: 'lab-results' | 'prescriptions' | 'immunizations' | 'allergies' | 'conditions' | 'visits'): Promise<void> {
    const sectionLink = this.page.locator(`[data-testid="nav-${section}"], a:has-text("${section.replace('-', ' ')}")`);
    await sectionLink.click();
    await this.waitForLoadingToComplete();
  }

  // Lab results actions
  async viewLabResult(index: number = 0): Promise<void> {
    const card = this.labResultCards.nth(index);
    await card.click();
    await this.waitForLoadingToComplete();
  }

  async getLabResultCount(): Promise<number> {
    return await this.labResultCards.count();
  }

  async getLabResultDetails(index: number = 0): Promise<{
    name?: string;
    date?: string;
    status?: string;
  }> {
    const card = this.labResultCards.nth(index);

    return {
      name: await card.locator('[data-testid="lab-name"]').textContent() || undefined,
      date: await card.locator('[data-testid="lab-date"]').textContent() || undefined,
      status: await card.locator('[data-testid="lab-status"]').textContent() || undefined,
    };
  }

  // Prescription actions
  async viewPrescription(index: number = 0): Promise<void> {
    const card = this.prescriptionCards.nth(index);
    await card.click();
    await this.waitForLoadingToComplete();
  }

  async requestRefill(index: number = 0): Promise<void> {
    const card = this.prescriptionCards.nth(index);
    const refillButton = card.locator('[data-testid="request-refill"], button:has-text("Refill")');

    await refillButton.click();

    // Confirm refill if dialog appears
    const confirmButton = this.page.locator('[role="dialog"] button:has-text("Confirm")');
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }

    await this.waitForLoadingToComplete();
  }

  async getPrescriptionCount(): Promise<number> {
    return await this.prescriptionCards.count();
  }

  async getPrescriptionDetails(index: number = 0): Promise<{
    medication?: string;
    dosage?: string;
    prescriber?: string;
    refillsRemaining?: string;
  }> {
    const card = this.prescriptionCards.nth(index);

    return {
      medication: await card.locator('[data-testid="medication-name"]').textContent() || undefined,
      dosage: await card.locator('[data-testid="dosage"]').textContent() || undefined,
      prescriber: await card.locator('[data-testid="prescriber"]').textContent() || undefined,
      refillsRemaining: await card.locator('[data-testid="refills-remaining"]').textContent() || undefined,
    };
  }

  // Allergy actions
  async addAllergy(allergyName: string, severity: string): Promise<void> {
    await this.addAllergyButton.click();

    const nameInput = this.page.locator('input[name="allergyName"]');
    const severitySelect = this.page.locator('select[name="severity"]');

    await nameInput.fill(allergyName);
    await severitySelect.selectOption(severity);

    const submitButton = this.page.locator('[role="dialog"] button[type="submit"]');
    await submitButton.click();

    await this.waitForLoadingToComplete();
  }

  async getAllergyCount(): Promise<number> {
    return await this.allergyTags.count();
  }

  // Search and filter actions
  async searchRecords(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
    await this.waitForLoadingToComplete();
  }

  async filterByDateRange(startDate: string, endDate: string): Promise<void> {
    await this.dateRangeFilter.click();

    const startInput = this.page.locator('input[name="startDate"]');
    const endInput = this.page.locator('input[name="endDate"]');

    await startInput.fill(startDate);
    await endInput.fill(endDate);

    const applyButton = this.page.locator('button:has-text("Apply")');
    await applyButton.click();

    await this.waitForLoadingToComplete();
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category);
    await this.waitForLoadingToComplete();
  }

  // Download/Export actions
  async downloadRecords(): Promise<void> {
    await this.downloadButton.click();
    await this.waitForLoadingToComplete();
  }

  async printRecords(): Promise<void> {
    await this.printButton.click();
  }

  async shareRecords(email: string): Promise<void> {
    await this.shareButton.click();

    const emailInput = this.page.locator('input[name="shareEmail"]');
    await emailInput.fill(email);

    const sendButton = this.page.locator('button:has-text("Send")');
    await sendButton.click();

    await this.waitForLoadingToComplete();
  }

  // Assertions
  async expectRecordsLoaded(): Promise<void> {
    await expect(this.recordsContainer).toBeVisible();
  }

  async expectLabResultsVisible(): Promise<void> {
    await expect(this.labResultsSection).toBeVisible();
  }

  async expectPrescriptionsVisible(): Promise<void> {
    await expect(this.prescriptionsSection).toBeVisible();
  }

  async expectNoRecords(): Promise<void> {
    const noRecords = this.page.locator('[data-testid="no-records"], .no-records');
    await expect(noRecords).toBeVisible();
  }

  async expectRefillSuccess(): Promise<void> {
    await this.waitForToast('success');
  }

  async expectAllergyAdded(allergyName: string): Promise<void> {
    await expect(this.page.locator(`[data-testid="allergy-tag"]:has-text("${allergyName}")`)).toBeVisible();
  }
}
