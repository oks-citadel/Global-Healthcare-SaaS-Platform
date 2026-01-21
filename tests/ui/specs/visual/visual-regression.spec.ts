/**
 * Visual Regression Tests
 * Captures and compares screenshots for visual changes
 */

import { test, expect } from '@playwright/test';
import { routes } from '../../fixtures/test-data';

// Configure visual comparison options
const snapshotOptions = {
  maxDiffPixels: 100,
  threshold: 0.2,
};

test.describe('Visual Regression - Authentication Pages', () => {
  test('login page visual snapshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Wait for any animations to complete
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('login-page.png', snapshotOptions);
  });

  test('registration page visual snapshot', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('register-page.png', snapshotOptions);
  });

  test('forgot password page visual snapshot', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('forgot-password-page.png', snapshotOptions);
  });
});

test.describe('Visual Regression - Dashboard', () => {
  test('dashboard main view', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for dynamic content

    await expect(page).toHaveScreenshot('dashboard-main.png', {
      ...snapshotOptions,
      mask: [
        page.locator('[data-testid="current-time"]'),
        page.locator('[data-testid="notification-badge"]'),
      ],
    });
  });

  test('dashboard sidebar collapsed', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    // Collapse sidebar if toggle exists
    const sidebarToggle = page.locator('[data-testid="sidebar-toggle"]');
    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click();
      await page.waitForTimeout(500);
    }

    await expect(page).toHaveScreenshot('dashboard-sidebar-collapsed.png', snapshotOptions);
  });

  test('dashboard user menu open', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    const userMenu = page.locator('[data-testid="user-menu"]');
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot('dashboard-user-menu-open.png', snapshotOptions);
    }
  });
});

test.describe('Visual Regression - Appointments', () => {
  test('appointments list page', async ({ page }) => {
    await page.goto(routes.web.appointments);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('appointments-list.png', {
      ...snapshotOptions,
      mask: [
        page.locator('[data-testid="appointment-date"]'),
        page.locator('[data-testid="appointment-time"]'),
      ],
    });
  });

  test('book appointment form', async ({ page }) => {
    await page.goto(routes.web.bookAppointment);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('book-appointment-form.png', snapshotOptions);
  });
});

test.describe('Visual Regression - Profile & Settings', () => {
  test('profile page', async ({ page }) => {
    await page.goto(routes.web.profile);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('profile-page.png', snapshotOptions);
  });

  test('settings page', async ({ page }) => {
    await page.goto(routes.web.settings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('settings-page.png', snapshotOptions);
  });

  test('billing page', async ({ page }) => {
    await page.goto(routes.web.billing);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('billing-page.png', {
      ...snapshotOptions,
      mask: [
        page.locator('[data-testid="next-billing-date"]'),
        page.locator('[data-testid="payment-amount"]'),
      ],
    });
  });
});

test.describe('Visual Regression - Responsive Views', () => {
  test('dashboard mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('dashboard-mobile.png', snapshotOptions);
  });

  test('dashboard tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('dashboard-tablet.png', snapshotOptions);
  });

  test('login mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('login-mobile.png', snapshotOptions);
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test('dashboard dark mode', async ({ page }) => {
    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('dashboard-dark-mode.png', snapshotOptions);
  });

  test('login dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('login-dark-mode.png', snapshotOptions);
  });
});

test.describe('Visual Regression - Components', () => {
  test('modal dialog', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    // Try to open a modal
    const bookButton = page.locator('[data-testid="book-appointment-button"]');
    if (await bookButton.isVisible()) {
      await bookButton.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible()) {
        await expect(page).toHaveScreenshot('modal-dialog.png', snapshotOptions);
      }
    }
  });

  test('dropdown menu', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    // Open a dropdown
    const dropdown = page.locator('[data-testid="user-menu"]');
    if (await dropdown.isVisible()) {
      await dropdown.click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot('dropdown-menu.png', snapshotOptions);
    }
  });

  test('form validation errors', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('form-validation-errors.png', snapshotOptions);
  });
});
