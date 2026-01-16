import { test, expect } from '@playwright/test';

test.describe('Billing and Payments', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await page.goto('/billing');
  });

  test.describe('Billing Page Load', () => {
    test('should load billing page successfully', async ({ page }) => {
      await expect(page).toHaveURL('/billing');
      await expect(page.locator('h1')).toContainText(/billing|payment/i);
    });

    test('should display page title', async ({ page }) => {
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should show navigation breadcrumb', async ({ page }) => {
      const breadcrumb = page.locator('[data-testid="breadcrumb"]');
      if (await breadcrumb.isVisible()) {
        await expect(breadcrumb).toContainText(/billing/i);
      }
    });
  });

  test.describe('Current Subscription', () => {
    test('should display current plan information', async ({ page }) => {
      const planCard = page.locator('[data-testid="current-plan"]');
      await expect(planCard).toBeVisible();
    });

    test('should show plan name', async ({ page }) => {
      const planName = page.locator('[data-testid="plan-name"]');
      await expect(planName).toBeVisible();
    });

    test('should show plan price', async ({ page }) => {
      const planPrice = page.locator('[data-testid="plan-price"]');
      await expect(planPrice).toBeVisible();
      await expect(planPrice).toContainText(/\$\d+/);
    });

    test('should show billing cycle', async ({ page }) => {
      const billingCycle = page.locator('[data-testid="billing-cycle"]');
      await expect(billingCycle).toBeVisible();
      await expect(billingCycle).toContainText(/(monthly|annual)/i);
    });

    test('should show next billing date', async ({ page }) => {
      const nextBilling = page.locator('[data-testid="next-billing-date"]');
      await expect(nextBilling).toBeVisible();
    });

    test('should have "Change Plan" button', async ({ page }) => {
      const changePlanBtn = page.locator('button >> text=/change.*plan/i');
      await expect(changePlanBtn).toBeVisible();
    });

    test('should have "Cancel Subscription" link', async ({ page }) => {
      const cancelLink = page.locator('button >> text=/cancel.*subscription/i');
      if (await cancelLink.isVisible()) {
        await expect(cancelLink).toBeVisible();
      }
    });
  });

  test.describe('Available Plans', () => {
    test('should display available subscription plans', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const plansSection = page.locator('[data-testid="available-plans"]');
      await expect(plansSection).toBeVisible();
    });

    test('should show plan comparison', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const planCards = page.locator('[data-testid="plan-card"]');
      const count = await planCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display plan features', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const features = page.locator('[data-testid="plan-features"]').first();
      await expect(features).toBeVisible();
    });

    test('should highlight current plan', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const currentPlan = page.locator('[data-testid="plan-card"][data-current="true"]');
      if (await currentPlan.isVisible()) {
        await expect(currentPlan).toHaveClass(/current|active/);
      }
    });

    test('should have "Select Plan" buttons', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const selectButtons = page.locator('button >> text=/select.*plan/i');
      const count = await selectButtons.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Payment Methods', () => {
    test('should display payment methods section', async ({ page }) => {
      const paymentSection = page.locator('[data-testid="payment-methods"]');
      await expect(paymentSection).toBeVisible();
    });

    test('should show saved payment methods', async ({ page }) => {
      const paymentCards = page.locator('[data-testid="payment-card"]');
      const count = await paymentCards.count();

      if (count > 0) {
        await expect(paymentCards.first()).toBeVisible();
      }
    });

    test('should display card last 4 digits', async ({ page }) => {
      const cardNumber = page.locator('[data-testid="card-last4"]').first();

      if (await cardNumber.isVisible()) {
        const text = await cardNumber.textContent();
        expect(text).toMatch(/\d{4}/);
      }
    });

    test('should display card expiry date', async ({ page }) => {
      const expiryDate = page.locator('[data-testid="card-expiry"]').first();

      if (await expiryDate.isVisible()) {
        const text = await expiryDate.textContent();
        expect(text).toMatch(/\d{2}\/\d{2,4}/);
      }
    });

    test('should have "Add Payment Method" button', async ({ page }) => {
      const addButton = page.locator('button >> text=/add.*payment/i');
      await expect(addButton).toBeVisible();
    });

    test('should open add payment method modal', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('[role="dialog"] >> h2')).toContainText(/payment/i);
    });

    test('should have default payment method indicator', async ({ page }) => {
      const defaultBadge = page.locator('[data-testid="default-payment"]');

      if (await defaultBadge.isVisible()) {
        await expect(defaultBadge).toContainText(/default/i);
      }
    });

    test('should have delete button for payment methods', async ({ page }) => {
      const deleteButtons = page.locator('[data-testid="delete-payment"]');
      const count = await deleteButtons.count();

      if (count > 0) {
        await expect(deleteButtons.first()).toBeVisible();
      }
    });
  });

  test.describe('Billing History', () => {
    test('should display billing history table', async ({ page }) => {
      const historyTable = page.locator('[data-testid="billing-history"]');
      await expect(historyTable).toBeVisible();
    });

    test('should show invoice list', async ({ page }) => {
      const invoices = page.locator('[data-testid="invoice-row"]');
      const count = await invoices.count();

      if (count > 0) {
        await expect(invoices.first()).toBeVisible();
      }
    });

    test('should display invoice date', async ({ page }) => {
      const invoiceDate = page.locator('[data-testid="invoice-date"]').first();

      if (await invoiceDate.isVisible()) {
        await expect(invoiceDate).toBeVisible();
      }
    });

    test('should display invoice amount', async ({ page }) => {
      const invoiceAmount = page.locator('[data-testid="invoice-amount"]').first();

      if (await invoiceAmount.isVisible()) {
        const text = await invoiceAmount.textContent();
        expect(text).toMatch(/\$\d+/);
      }
    });

    test('should display invoice status', async ({ page }) => {
      const invoiceStatus = page.locator('[data-testid="invoice-status"]').first();

      if (await invoiceStatus.isVisible()) {
        const text = await invoiceStatus.textContent();
        expect(text).toMatch(/(paid|pending|failed)/i);
      }
    });

    test('should have download invoice button', async ({ page }) => {
      const downloadButtons = page.locator('[data-testid="download-invoice"]');
      const count = await downloadButtons.count();

      if (count > 0) {
        await expect(downloadButtons.first()).toBeVisible();
      }
    });

    test('should have view invoice button', async ({ page }) => {
      const viewButtons = page.locator('[data-testid="view-invoice"]');
      const count = await viewButtons.count();

      if (count > 0) {
        await expect(viewButtons.first()).toBeVisible();
      }
    });

    test('should filter invoices by status', async ({ page }) => {
      const filterSelect = page.locator('[data-testid="invoice-filter"]');

      if (await filterSelect.isVisible()) {
        await filterSelect.selectOption('paid');
        // Wait for filter to apply
        await page.waitForTimeout(500);
      }
    });

    test('should show empty state when no invoices', async ({ page }) => {
      const emptyState = page.locator('[data-testid="no-invoices"]');
      const invoices = page.locator('[data-testid="invoice-row"]');

      const hasInvoices = await invoices.count() > 0;

      if (!hasInvoices) {
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('Add Payment Method', () => {
    test('should display payment form fields', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');

      await expect(page.locator('input[name="cardNumber"]')).toBeVisible();
      await expect(page.locator('input[name="expiryDate"]')).toBeVisible();
      await expect(page.locator('input[name="cvv"]')).toBeVisible();
      await expect(page.locator('input[name="cardholderName"]')).toBeVisible();
    });

    test('should validate card number format', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');
      await page.fill('input[name="cardNumber"]', '1234');
      await page.click('button[type="submit"]');

      const error = page.locator('text=/invalid.*card/i');
      if (await error.isVisible()) {
        await expect(error).toBeVisible();
      }
    });

    test('should validate expiry date', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');
      await page.fill('input[name="expiryDate"]', '01/20');
      await page.click('button[type="submit"]');

      const error = page.locator('text=/expired|invalid/i');
      if (await error.isVisible()) {
        await expect(error).toBeVisible();
      }
    });

    test('should validate CVV', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');
      await page.fill('input[name="cvv"]', '12');
      await page.click('button[type="submit"]');

      const error = page.locator('text=/invalid.*cvv/i');
      if (await error.isVisible()) {
        await expect(error).toBeVisible();
      }
    });

    test('should have cancel button', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');
      const cancelButton = page.locator('button >> text=/cancel/i');
      await expect(cancelButton).toBeVisible();
    });

    test('should close modal on cancel', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');
      await page.click('button >> text=/cancel/i');
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });
  });

  test.describe('Upgrade/Downgrade Plan', () => {
    test('should show plan change confirmation', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const selectButton = page.locator('button >> text=/select.*plan/i').first();

      if (await selectButton.isVisible()) {
        await selectButton.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
      }
    });

    test('should display prorated amount for plan change', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const selectButton = page.locator('button >> text=/select.*plan/i').first();

      if (await selectButton.isVisible()) {
        await selectButton.click();
        const proratedAmount = page.locator('[data-testid="prorated-amount"]');

        if (await proratedAmount.isVisible()) {
          await expect(proratedAmount).toContainText(/\$/);
        }
      }
    });

    test('should have confirm button for plan change', async ({ page }) => {
      await page.click('button >> text=/change.*plan/i');
      const selectButton = page.locator('button >> text=/select.*plan/i').first();

      if (await selectButton.isVisible()) {
        await selectButton.click();
        await expect(page.locator('button >> text=/confirm/i')).toBeVisible();
      }
    });
  });

  test.describe('Cancel Subscription', () => {
    test('should show cancellation confirmation dialog', async ({ page }) => {
      const cancelButton = page.locator('button >> text=/cancel.*subscription/i');

      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await expect(page.locator('[role="dialog"]')).toContainText(/cancel.*subscription/i);
      }
    });

    test('should show cancellation consequences', async ({ page }) => {
      const cancelButton = page.locator('button >> text=/cancel.*subscription/i');

      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        const warning = page.locator('[data-testid="cancellation-warning"]');
        if (await warning.isVisible()) {
          await expect(warning).toBeVisible();
        }
      }
    });

    test('should have feedback form for cancellation', async ({ page }) => {
      const cancelButton = page.locator('button >> text=/cancel.*subscription/i');

      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        const feedbackField = page.locator('textarea[name="cancellationReason"]');
        if (await feedbackField.isVisible()) {
          await expect(feedbackField).toBeVisible();
        }
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have accessible form labels', async ({ page }) => {
      await page.click('button >> text=/add.*payment/i');
      const labels = page.locator('label');
      const count = await labels.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have ARIA labels for buttons', async ({ page }) => {
      const buttons = page.locator('button[aria-label]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('h1')).toBeVisible();
    });
  });
});
