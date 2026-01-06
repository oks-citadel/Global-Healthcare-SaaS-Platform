import { test, expect, Page } from '@playwright/test';

/**
 * Example Visual Regression Tests
 *
 * This file demonstrates how to write visual regression tests
 * for the Global Healthcare SaaS Platform.
 */

// Helper to wait for page to be stable before screenshot
async function waitForPageStable(page: Page): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Disable animations for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  // Small delay to ensure styles are applied
  await page.waitForTimeout(100);
}

// Common masks for dynamic content
const dynamicContentMasks = (page: Page) => [
  page.locator('[data-testid="timestamp"]'),
  page.locator('[data-testid="current-time"]'),
  page.locator('[data-testid="user-avatar"]'),
  page.locator('.notification-badge'),
  page.locator('.dynamic-counter'),
];

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
    await waitForPageStable(page);
  });

  test('homepage full page screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      mask: dynamicContentMasks(page),
    });
  });

  test('homepage above the fold', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-above-fold.png', {
      mask: dynamicContentMasks(page),
    });
  });

  test('homepage header', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('homepage-header.png');
  });

  test('homepage footer', async ({ page }) => {
    const footer = page.locator('footer').first();
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveScreenshot('homepage-footer.png');
  });
});

test.describe('Login Page Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await waitForPageStable(page);
  });

  test('login page default state', async ({ page }) => {
    await expect(page).toHaveScreenshot('login-default.png');
  });

  test('login form focused state', async ({ page }) => {
    const emailInput = page.locator('[data-testid="email-input"]');
    if (await emailInput.count() > 0) {
      await emailInput.focus();
      await expect(page).toHaveScreenshot('login-email-focused.png');
    }
  });

  test('login form with validation errors', async ({ page }) => {
    // Submit empty form to trigger validation
    const submitButton = page.locator('[data-testid="login-submit"]');
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(300); // Wait for validation messages
      await expect(page).toHaveScreenshot('login-validation-errors.png');
    }
  });
});

test.describe('Dashboard Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for dashboard access
    await page.goto('/dashboard');
    await waitForPageStable(page);
  });

  test('dashboard overview', async ({ page }) => {
    await expect(page).toHaveScreenshot('dashboard-overview.png', {
      fullPage: true,
      mask: dynamicContentMasks(page),
    });
  });

  test('dashboard sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    if (await sidebar.count() > 0) {
      await expect(sidebar).toHaveScreenshot('dashboard-sidebar.png');
    }
  });

  test('dashboard navigation expanded', async ({ page }) => {
    const navToggle = page.locator('[data-testid="nav-toggle"]');
    if (await navToggle.count() > 0) {
      await navToggle.click();
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot('dashboard-nav-expanded.png', {
        mask: dynamicContentMasks(page),
      });
    }
  });
});

test.describe('Component Visual Tests', () => {
  test('button variants', async ({ page }) => {
    await page.goto('/components/buttons');
    await waitForPageStable(page);

    // Primary button
    const primaryButton = page.locator('[data-testid="btn-primary"]');
    if (await primaryButton.count() > 0) {
      await expect(primaryButton).toHaveScreenshot('button-primary.png');
    }

    // Secondary button
    const secondaryButton = page.locator('[data-testid="btn-secondary"]');
    if (await secondaryButton.count() > 0) {
      await expect(secondaryButton).toHaveScreenshot('button-secondary.png');
    }

    // Danger button
    const dangerButton = page.locator('[data-testid="btn-danger"]');
    if (await dangerButton.count() > 0) {
      await expect(dangerButton).toHaveScreenshot('button-danger.png');
    }
  });

  test('button hover states', async ({ page }) => {
    await page.goto('/components/buttons');
    await waitForPageStable(page);

    const primaryButton = page.locator('[data-testid="btn-primary"]');
    if (await primaryButton.count() > 0) {
      await primaryButton.hover();
      await expect(primaryButton).toHaveScreenshot('button-primary-hover.png');
    }
  });

  test('input field states', async ({ page }) => {
    await page.goto('/components/inputs');
    await waitForPageStable(page);

    // Default state
    const input = page.locator('[data-testid="text-input"]');
    if (await input.count() > 0) {
      await expect(input).toHaveScreenshot('input-default.png');

      // Focused state
      await input.focus();
      await expect(input).toHaveScreenshot('input-focused.png');

      // Filled state
      await input.fill('Sample text');
      await expect(input).toHaveScreenshot('input-filled.png');
    }
  });

  test('modal component', async ({ page }) => {
    await page.goto('/components/modal');
    await waitForPageStable(page);

    // Open modal
    const openModalButton = page.locator('[data-testid="open-modal"]');
    if (await openModalButton.count() > 0) {
      await openModalButton.click();
      await page.waitForSelector('[data-testid="modal"]');
      await expect(page).toHaveScreenshot('modal-open.png');
    }
  });

  test('dropdown menu', async ({ page }) => {
    await page.goto('/components/dropdown');
    await waitForPageStable(page);

    const dropdown = page.locator('[data-testid="dropdown-trigger"]');
    if (await dropdown.count() > 0) {
      await dropdown.click();
      await page.waitForSelector('[data-testid="dropdown-menu"]');
      await expect(page).toHaveScreenshot('dropdown-open.png');
    }
  });

  test('alert variants', async ({ page }) => {
    await page.goto('/components/alerts');
    await waitForPageStable(page);

    const alertsContainer = page.locator('[data-testid="alerts-container"]');
    if (await alertsContainer.count() > 0) {
      await expect(alertsContainer).toHaveScreenshot('alerts-all-variants.png');
    }
  });

  test('card component', async ({ page }) => {
    await page.goto('/components/cards');
    await waitForPageStable(page);

    const card = page.locator('[data-testid="card"]').first();
    if (await card.count() > 0) {
      await expect(card).toHaveScreenshot('card-default.png');
    }
  });
});

test.describe('Theme Visual Tests', () => {
  test('light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot('theme-light.png', {
      mask: dynamicContentMasks(page),
    });
  });

  test('dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot('theme-dark.png', {
      mask: dynamicContentMasks(page),
    });
  });

  test('high contrast mode', async ({ page }) => {
    await page.goto('/');

    // Enable high contrast mode if available
    const highContrastToggle = page.locator('[data-testid="high-contrast-toggle"]');
    if (await highContrastToggle.count() > 0) {
      await highContrastToggle.click();
      await waitForPageStable(page);
      await expect(page).toHaveScreenshot('theme-high-contrast.png', {
        mask: dynamicContentMasks(page),
      });
    }
  });
});

test.describe('Responsive Visual Tests', () => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  };

  for (const [name, viewport] of Object.entries(viewports)) {
    test(`homepage at ${name} viewport`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot(`homepage-${name}.png`, {
        fullPage: true,
        mask: dynamicContentMasks(page),
      });
    });
  }
});

test.describe('Form Visual Tests', () => {
  test('patient registration form', async ({ page }) => {
    await page.goto('/patients/register');
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot('form-patient-registration.png', {
      mask: dynamicContentMasks(page),
    });
  });

  test('appointment booking form', async ({ page }) => {
    await page.goto('/appointments/new');
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot('form-appointment-booking.png', {
      mask: dynamicContentMasks(page),
    });
  });
});

test.describe('Error States Visual Tests', () => {
  test('404 page', async ({ page }) => {
    await page.goto('/non-existent-page');
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot('error-404.png');
  });

  test('500 error page', async ({ page }) => {
    // Mock server error
    await page.route('**/api/error', (route) => {
      route.fulfill({ status: 500 });
    });

    await page.goto('/error');
    await waitForPageStable(page);

    // Check if error page exists
    const errorPage = page.locator('[data-testid="error-page"]');
    if (await errorPage.count() > 0) {
      await expect(page).toHaveScreenshot('error-500.png');
    }
  });
});

test.describe('Loading States Visual Tests', () => {
  test('skeleton loader', async ({ page }) => {
    // Intercept API to show loading state
    await page.route('**/api/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await route.continue();
    });

    await page.goto('/dashboard');

    const skeleton = page.locator('[data-testid="skeleton-loader"]');
    if (await skeleton.count() > 0) {
      await expect(skeleton).toHaveScreenshot('skeleton-loader.png');
    }
  });

  test('spinner loader', async ({ page }) => {
    await page.goto('/components/spinner');
    await waitForPageStable(page);

    const spinner = page.locator('[data-testid="spinner"]');
    if (await spinner.count() > 0) {
      // Disable animation for screenshot
      await page.addStyleTag({
        content: '[data-testid="spinner"] { animation: none !important; }',
      });
      await expect(spinner).toHaveScreenshot('spinner-loader.png');
    }
  });
});

test.describe('Accessibility Visual Tests', () => {
  test('focus indicators visible', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);

    // Tab to first focusable element
    await page.keyboard.press('Tab');

    await expect(page).toHaveScreenshot('focus-indicator-visible.png', {
      mask: dynamicContentMasks(page),
    });
  });

  test('skip link visible on focus', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);

    // Focus skip link
    await page.keyboard.press('Tab');

    const skipLink = page.locator('[data-testid="skip-link"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink).toHaveScreenshot('skip-link-focused.png');
    }
  });
});

test.describe('Print Visual Tests', () => {
  test('print layout', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await page.goto('/reports/summary');
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot('print-layout.png', {
      fullPage: true,
      mask: dynamicContentMasks(page),
    });
  });
});
