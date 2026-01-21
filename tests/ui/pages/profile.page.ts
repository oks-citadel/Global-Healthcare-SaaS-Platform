/**
 * Profile Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../fixtures/test-data';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get profileForm(): Locator {
    return this.page.locator('[data-testid="profile-form"], form.profile-form');
  }

  get avatarUpload(): Locator {
    return this.page.locator('[data-testid="avatar-upload"], input[type="file"][name="avatar"]');
  }

  get avatarImage(): Locator {
    return this.page.locator('[data-testid="avatar-image"], .avatar-image');
  }

  // Personal information
  get firstNameInput(): Locator {
    return this.page.locator('input[name="firstName"]');
  }

  get lastNameInput(): Locator {
    return this.page.locator('input[name="lastName"]');
  }

  get emailDisplay(): Locator {
    return this.page.locator('[data-testid="email-display"], .email-display');
  }

  get phoneInput(): Locator {
    return this.page.locator('input[name="phone"], input[type="tel"]');
  }

  get dateOfBirthInput(): Locator {
    return this.page.locator('input[name="dateOfBirth"], input[type="date"]');
  }

  get genderSelect(): Locator {
    return this.page.locator('select[name="gender"], [data-testid="gender-select"]');
  }

  // Address fields
  get addressLine1Input(): Locator {
    return this.page.locator('input[name="addressLine1"], input[name="address1"]');
  }

  get addressLine2Input(): Locator {
    return this.page.locator('input[name="addressLine2"], input[name="address2"]');
  }

  get cityInput(): Locator {
    return this.page.locator('input[name="city"]');
  }

  get stateSelect(): Locator {
    return this.page.locator('select[name="state"], [data-testid="state-select"]');
  }

  get zipCodeInput(): Locator {
    return this.page.locator('input[name="zipCode"], input[name="postalCode"]');
  }

  get countrySelect(): Locator {
    return this.page.locator('select[name="country"], [data-testid="country-select"]');
  }

  // Emergency contact
  get emergencyContactName(): Locator {
    return this.page.locator('input[name="emergencyContactName"]');
  }

  get emergencyContactPhone(): Locator {
    return this.page.locator('input[name="emergencyContactPhone"]');
  }

  get emergencyContactRelation(): Locator {
    return this.page.locator('select[name="emergencyContactRelation"], input[name="emergencyContactRelation"]');
  }

  // Insurance information
  get insuranceProvider(): Locator {
    return this.page.locator('input[name="insuranceProvider"]');
  }

  get insurancePolicyNumber(): Locator {
    return this.page.locator('input[name="policyNumber"]');
  }

  get insuranceGroupNumber(): Locator {
    return this.page.locator('input[name="groupNumber"]');
  }

  // Actions
  get saveButton(): Locator {
    return this.page.locator('button[type="submit"], [data-testid="save-profile"]');
  }

  get cancelButton(): Locator {
    return this.page.locator('[data-testid="cancel-changes"], button:has-text("Cancel")');
  }

  get editButton(): Locator {
    return this.page.locator('[data-testid="edit-profile"], button:has-text("Edit")');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.goto(routes.web.profile);
    await this.waitForLoadingToComplete();
  }

  // Tab navigation
  async navigateToTab(tabName: string): Promise<void> {
    const tab = this.page.locator(`[role="tab"]:has-text("${tabName}"), a:has-text("${tabName}")`);
    await tab.click();
    await this.waitForLoadingToComplete();
  }

  // Profile actions
  async updatePersonalInfo(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  }): Promise<void> {
    if (data.firstName) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName) {
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.dateOfBirth) {
      await this.dateOfBirthInput.fill(data.dateOfBirth);
    }
    if (data.gender) {
      await this.genderSelect.selectOption(data.gender);
    }
  }

  async updateAddress(data: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }): Promise<void> {
    if (data.line1) {
      await this.addressLine1Input.fill(data.line1);
    }
    if (data.line2) {
      await this.addressLine2Input.fill(data.line2);
    }
    if (data.city) {
      await this.cityInput.fill(data.city);
    }
    if (data.state) {
      await this.stateSelect.selectOption(data.state);
    }
    if (data.zipCode) {
      await this.zipCodeInput.fill(data.zipCode);
    }
    if (data.country) {
      await this.countrySelect.selectOption(data.country);
    }
  }

  async updateEmergencyContact(data: {
    name: string;
    phone: string;
    relation: string;
  }): Promise<void> {
    await this.emergencyContactName.fill(data.name);
    await this.emergencyContactPhone.fill(data.phone);
    await this.emergencyContactRelation.fill(data.relation);
  }

  async updateInsurance(data: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  }): Promise<void> {
    await this.insuranceProvider.fill(data.provider);
    await this.insurancePolicyNumber.fill(data.policyNumber);
    if (data.groupNumber) {
      await this.insuranceGroupNumber.fill(data.groupNumber);
    }
  }

  async uploadAvatar(filePath: string): Promise<void> {
    await this.avatarUpload.setInputFiles(filePath);
    await this.waitForLoadingToComplete();
  }

  async saveProfile(): Promise<void> {
    await this.saveButton.click();
    await this.waitForLoadingToComplete();
  }

  async cancelChanges(): Promise<void> {
    await this.cancelButton.click();
  }

  // Assertions
  async expectProfileLoaded(): Promise<void> {
    await expect(this.profileForm).toBeVisible();
  }

  async expectSaveSuccess(): Promise<void> {
    await this.waitForToast('success');
  }

  async expectSaveError(): Promise<void> {
    await this.waitForToast('error');
  }

  async expectValidationError(field: string): Promise<void> {
    const errorMessage = this.page.locator(`[data-testid="${field}-error"], .${field}-error`);
    await expect(errorMessage).toBeVisible();
  }

  async expectFieldValue(field: string, value: string): Promise<void> {
    const input = this.page.locator(`input[name="${field}"], select[name="${field}"]`);
    await expect(input).toHaveValue(value);
  }

  // Get current values
  async getFirstName(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  async getLastName(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  async getPhone(): Promise<string> {
    return await this.phoneInput.inputValue();
  }

  async getEmail(): Promise<string | null> {
    return await this.emailDisplay.textContent();
  }
}
