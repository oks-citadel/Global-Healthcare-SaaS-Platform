/**
 * Billing Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../fixtures/test-data';

export class BillingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get billingOverview(): Locator {
    return this.page.locator('[data-testid="billing-overview"], .billing-overview');
  }

  get currentPlan(): Locator {
    return this.page.locator('[data-testid="current-plan"], .current-plan');
  }

  get planName(): Locator {
    return this.page.locator('[data-testid="plan-name"]');
  }

  get planPrice(): Locator {
    return this.page.locator('[data-testid="plan-price"]');
  }

  get nextBillingDate(): Locator {
    return this.page.locator('[data-testid="next-billing-date"]');
  }

  // Payment methods
  get paymentMethodsList(): Locator {
    return this.page.locator('[data-testid="payment-methods"], .payment-methods-list');
  }

  get paymentMethodCards(): Locator {
    return this.page.locator('[data-testid="payment-method-card"], .payment-method-card');
  }

  get addPaymentMethodButton(): Locator {
    return this.page.locator('[data-testid="add-payment-method"], button:has-text("Add Payment Method")');
  }

  // Invoice/Billing history
  get invoicesList(): Locator {
    return this.page.locator('[data-testid="invoices-list"], .invoices-list');
  }

  get invoiceRows(): Locator {
    return this.page.locator('[data-testid="invoice-row"], .invoice-row');
  }

  // Subscription
  get upgradePlanButton(): Locator {
    return this.page.locator('[data-testid="upgrade-plan"], button:has-text("Upgrade")');
  }

  get cancelSubscriptionButton(): Locator {
    return this.page.locator('[data-testid="cancel-subscription"], button:has-text("Cancel Subscription")');
  }

  // Payment form (modal)
  get paymentModal(): Locator {
    return this.page.locator('[data-testid="payment-modal"], [role="dialog"]');
  }

  get cardNumberInput(): Locator {
    return this.page.locator('input[name="cardNumber"], [data-testid="card-number"]');
  }

  get cardExpiryInput(): Locator {
    return this.page.locator('input[name="expiry"], [data-testid="card-expiry"]');
  }

  get cardCvcInput(): Locator {
    return this.page.locator('input[name="cvc"], [data-testid="card-cvc"]');
  }

  get cardNameInput(): Locator {
    return this.page.locator('input[name="cardName"], [data-testid="card-name"]');
  }

  get billingAddressCheckbox(): Locator {
    return this.page.locator('input[name="sameAsProfile"], [data-testid="same-address-checkbox"]');
  }

  get submitPaymentButton(): Locator {
    return this.page.locator('[data-testid="submit-payment"], button[type="submit"]');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.goto(routes.web.billing);
    await this.waitForLoadingToComplete();
  }

  // Payment method actions
  async addPaymentMethod(cardDetails: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  }): Promise<void> {
    await this.addPaymentMethodButton.click();
    await expect(this.paymentModal).toBeVisible();

    // Handle Stripe iframe if present
    const stripeFrame = this.page.frameLocator('iframe[name*="stripe"]');
    const hasStripe = await stripeFrame.locator('input').first().isVisible().catch(() => false);

    if (hasStripe) {
      // Stripe Elements
      await stripeFrame.locator('input[name="cardnumber"]').fill(cardDetails.number);
      await stripeFrame.locator('input[name="exp-date"]').fill(cardDetails.expiry);
      await stripeFrame.locator('input[name="cvc"]').fill(cardDetails.cvc);
    } else {
      // Regular form
      await this.cardNumberInput.fill(cardDetails.number);
      await this.cardExpiryInput.fill(cardDetails.expiry);
      await this.cardCvcInput.fill(cardDetails.cvc);
      await this.cardNameInput.fill(cardDetails.name);
    }

    await this.submitPaymentButton.click();
    await this.waitForLoadingToComplete();
  }

  async removePaymentMethod(index: number = 0): Promise<void> {
    const card = this.paymentMethodCards.nth(index);
    const removeButton = card.locator('button:has-text("Remove"), [data-testid="remove-payment"]');

    await removeButton.click();

    // Confirm removal
    const confirmButton = this.page.locator('[role="dialog"] button:has-text("Confirm"), [data-testid="confirm-remove"]');
    await confirmButton.click();

    await this.waitForLoadingToComplete();
  }

  async setDefaultPaymentMethod(index: number): Promise<void> {
    const card = this.paymentMethodCards.nth(index);
    const setDefaultButton = card.locator('button:has-text("Set as Default"), [data-testid="set-default"]');

    await setDefaultButton.click();
    await this.waitForLoadingToComplete();
  }

  // Invoice actions
  async downloadInvoice(index: number = 0): Promise<void> {
    const row = this.invoiceRows.nth(index);
    const downloadButton = row.locator('button:has-text("Download"), [data-testid="download-invoice"]');

    await downloadButton.click();
  }

  async viewInvoice(index: number = 0): Promise<void> {
    const row = this.invoiceRows.nth(index);
    const viewButton = row.locator('button:has-text("View"), [data-testid="view-invoice"]');

    await viewButton.click();
    await this.waitForLoadingToComplete();
  }

  async getInvoiceCount(): Promise<number> {
    return await this.invoiceRows.count();
  }

  async getInvoiceDetails(index: number = 0): Promise<{
    date?: string;
    amount?: string;
    status?: string;
  }> {
    const row = this.invoiceRows.nth(index);

    return {
      date: await row.locator('[data-testid="invoice-date"]').textContent() || undefined,
      amount: await row.locator('[data-testid="invoice-amount"]').textContent() || undefined,
      status: await row.locator('[data-testid="invoice-status"]').textContent() || undefined,
    };
  }

  // Subscription actions
  async upgradePlan(): Promise<void> {
    await this.upgradePlanButton.click();
    await this.waitForLoadingToComplete();
  }

  async cancelSubscription(): Promise<void> {
    await this.cancelSubscriptionButton.click();

    // Confirm cancellation
    const confirmButton = this.page.locator('[role="dialog"] button:has-text("Confirm"), [data-testid="confirm-cancel"]');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    await this.waitForLoadingToComplete();
  }

  // Assertions
  async expectBillingLoaded(): Promise<void> {
    await expect(this.billingOverview).toBeVisible();
  }

  async expectPlanName(name: string): Promise<void> {
    await expect(this.planName).toContainText(name);
  }

  async expectPaymentMethodCount(count: number): Promise<void> {
    await expect(this.paymentMethodCards).toHaveCount(count);
  }

  async expectPaymentSuccess(): Promise<void> {
    await this.waitForToast('success');
  }

  async expectPaymentError(): Promise<void> {
    await this.waitForToast('error');
  }

  async expectNoInvoices(): Promise<void> {
    const noInvoices = this.page.locator('[data-testid="no-invoices"], .no-invoices');
    await expect(noInvoices).toBeVisible();
  }

  // Get current values
  async getCurrentPlanName(): Promise<string | null> {
    return await this.planName.textContent();
  }

  async getCurrentPlanPrice(): Promise<string | null> {
    return await this.planPrice.textContent();
  }

  async getNextBillingDate(): Promise<string | null> {
    return await this.nextBillingDate.textContent();
  }

  async getPaymentMethodCount(): Promise<number> {
    return await this.paymentMethodCards.count();
  }
}
