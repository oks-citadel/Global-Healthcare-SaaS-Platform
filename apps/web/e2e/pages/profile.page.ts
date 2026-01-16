import { Page, Locator, expect } from '@playwright/test';

/**
 * Profile Page Object Model
 *
 * Encapsulates the profile page elements and actions
 */
export class ProfilePage {
  readonly page: Page;

  // View mode elements
  readonly profileContainer: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly dateOfBirth: Locator;
  readonly gender: Locator;

  // Address elements
  readonly addressSection: Locator;
  readonly street: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly zipCode: Locator;
  readonly country: Locator;

  // Emergency contact elements
  readonly emergencyContactSection: Locator;
  readonly emergencyContactName: Locator;
  readonly emergencyContactPhone: Locator;
  readonly emergencyContactRelationship: Locator;

  // Medical history elements
  readonly medicalHistorySection: Locator;
  readonly allergies: Locator;
  readonly medications: Locator;
  readonly conditions: Locator;

  // Edit mode form elements
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly genderSelect: Locator;

  // Address form elements
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly countryInput: Locator;

  // Emergency contact form elements
  readonly emergencyNameInput: Locator;
  readonly emergencyPhoneInput: Locator;
  readonly emergencyRelationshipInput: Locator;

  // Action buttons
  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  // Messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // View mode
    this.profileContainer = page.locator('[data-testid="profile"], .profile-container, main');
    this.firstName = page.locator('[data-testid="first-name"], .first-name');
    this.lastName = page.locator('[data-testid="last-name"], .last-name');
    this.email = page.locator('[data-testid="email"], .email');
    this.phone = page.locator('[data-testid="phone"], .phone');
    this.dateOfBirth = page.locator('[data-testid="date-of-birth"], .date-of-birth');
    this.gender = page.locator('[data-testid="gender"], .gender');

    // Address
    this.addressSection = page.locator('[data-testid="address"], .address-section');
    this.street = page.locator('[data-testid="street"], .street');
    this.city = page.locator('[data-testid="city"], .city');
    this.state = page.locator('[data-testid="state"], .state');
    this.zipCode = page.locator('[data-testid="zip-code"], .zip-code');
    this.country = page.locator('[data-testid="country"], .country');

    // Emergency contact
    this.emergencyContactSection = page.locator('[data-testid="emergency-contact"], .emergency-contact');
    this.emergencyContactName = page.locator('[data-testid="emergency-contact-name"], .emergency-contact-name');
    this.emergencyContactPhone = page.locator('[data-testid="emergency-contact-phone"], .emergency-contact-phone');
    this.emergencyContactRelationship = page.locator('[data-testid="emergency-contact-relationship"], .emergency-contact-relationship');

    // Medical history
    this.medicalHistorySection = page.locator('[data-testid="medical-history"], .medical-history');
    this.allergies = page.locator('[data-testid="allergies"], .allergies');
    this.medications = page.locator('[data-testid="medications"], .medications');
    this.conditions = page.locator('[data-testid="conditions"], .conditions');

    // Form elements
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"], input[name="phoneNumber"]');
    this.dateOfBirthInput = page.locator('input[name="dateOfBirth"], input[name="dob"]');
    this.genderSelect = page.locator('select[name="gender"]');

    // Address form
    this.streetInput = page.locator('input[name="street"], input[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateInput = page.locator('input[name="state"]');
    this.zipCodeInput = page.locator('input[name="zip"], input[name="zipCode"]');
    this.countryInput = page.locator('input[name="country"], select[name="country"]');

    // Emergency contact form
    this.emergencyNameInput = page.locator('input[name="emergencyContactName"], input[name="emergency_contact_name"]');
    this.emergencyPhoneInput = page.locator('input[name="emergencyContactPhone"], input[name="emergency_contact_phone"]');
    this.emergencyRelationshipInput = page.locator('input[name="emergencyContactRelationship"], select[name="emergency_contact_relationship"]');

    // Buttons
    this.editButton = page.locator('button:has-text("Edit"), a:has-text("Edit Profile")');
    this.saveButton = page.locator('button[type="submit"]:has-text("Save"), button:has-text("Update")');
    this.cancelButton = page.locator('button:has-text("Cancel"):not(:has-text("Cancel Appointment"))');

    // Messages
    this.successMessage = page.locator('.success-message, [role="alert"]:has-text("success"), [role="alert"]:has-text("updated")');
    this.errorMessage = page.locator('.error-message, [role="alert"]:has-text("error")');
  }

  /**
   * Navigate to profile page
   */
  async goto() {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click edit button
   */
  async clickEdit() {
    await this.editButton.click();
    await this.page.waitForSelector('form, input[name="firstName"]');
  }

  /**
   * Update personal information
   */
  async updatePersonalInfo(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  }) {
    if (data.firstName) {
      await this.firstNameInput.fill(data.firstName);
    }

    if (data.lastName) {
      await this.lastNameInput.fill(data.lastName);
    }

    if (data.email) {
      await this.emailInput.fill(data.email);
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

  /**
   * Update address
   */
  async updateAddress(data: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }) {
    if (data.street) {
      await this.streetInput.fill(data.street);
    }

    if (data.city) {
      await this.cityInput.fill(data.city);
    }

    if (data.state) {
      await this.stateInput.fill(data.state);
    }

    if (data.zipCode) {
      await this.zipCodeInput.fill(data.zipCode);
    }

    if (data.country) {
      const countryField = this.countryInput;
      const tagName = await countryField.evaluate((el) => el.tagName.toLowerCase());

      if (tagName === 'select') {
        await countryField.selectOption(data.country);
      } else {
        await countryField.fill(data.country);
      }
    }
  }

  /**
   * Update emergency contact
   */
  async updateEmergencyContact(data: {
    name?: string;
    phone?: string;
    relationship?: string;
  }) {
    if (data.name) {
      await this.emergencyNameInput.fill(data.name);
    }

    if (data.phone) {
      await this.emergencyPhoneInput.fill(data.phone);
    }

    if (data.relationship) {
      const relationshipField = this.emergencyRelationshipInput;
      const tagName = await relationshipField.evaluate((el) => el.tagName.toLowerCase());

      if (tagName === 'select') {
        await relationshipField.selectOption(data.relationship);
      } else {
        await relationshipField.fill(data.relationship);
      }
    }
  }

  /**
   * Save changes
   */
  async save() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Cancel editing
   */
  async cancel() {
    await this.cancelButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get profile data
   */
  async getProfileData() {
    return {
      firstName: await this.firstName.textContent().catch(() => null),
      lastName: await this.lastName.textContent().catch(() => null),
      email: await this.email.textContent().catch(() => null),
      phone: await this.phone.textContent().catch(() => null),
      dateOfBirth: await this.dateOfBirth.textContent().catch(() => null),
      gender: await this.gender.textContent().catch(() => null),
    };
  }

  /**
   * Get address data
   */
  async getAddressData() {
    if (!(await this.addressSection.isVisible().catch(() => false))) {
      return null;
    }

    return {
      street: await this.street.textContent().catch(() => null),
      city: await this.city.textContent().catch(() => null),
      state: await this.state.textContent().catch(() => null),
      zipCode: await this.zipCode.textContent().catch(() => null),
      country: await this.country.textContent().catch(() => null),
    };
  }

  /**
   * Get emergency contact data
   */
  async getEmergencyContactData() {
    if (!(await this.emergencyContactSection.isVisible().catch(() => false))) {
      return null;
    }

    return {
      name: await this.emergencyContactName.textContent().catch(() => null),
      phone: await this.emergencyContactPhone.textContent().catch(() => null),
      relationship: await this.emergencyContactRelationship.textContent().catch(() => null),
    };
  }

  /**
   * Assert profile is displayed
   */
  async assertProfileDisplayed() {
    await expect(this.profileContainer).toBeVisible();
  }

  /**
   * Assert personal information contains text
   */
  async assertPersonalInfoContains(text: string) {
    await expect(this.profileContainer).toContainText(text);
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
   * Assert field validation error
   */
  async assertFieldValidationError(field: string) {
    const error = this.page.locator(`[name="${field}"] ~ .error, [name="${field}"] + .error, .error:has-text("${field}")`);
    await expect(error).toBeVisible();
  }

  /**
   * Check if in edit mode
   */
  async isInEditMode(): Promise<boolean> {
    return await this.firstNameInput.isVisible();
  }

  /**
   * Wait for profile to load
   */
  async waitForProfileLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.profileContainer.waitFor({ state: 'visible', timeout: 10000 });
  }
}
