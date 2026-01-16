import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { testUsers } from '../fixtures/test-data';

/**
 * Visual Regression Testing
 *
 * Captures and compares screenshots to detect unintended visual changes
 * Uses Playwright's built-in screenshot comparison
 */

test.describe('Visual Regression Tests', () => {
  // Configure visual comparison options
  test.use({
    viewport: { width: 1280, height: 720 },
  });

  test.describe('Public Pages', () => {
    test('should match login page screenshot', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Wait for any animations to complete
      await page.waitForTimeout(500);

      // Take screenshot and compare
      await expect(page).toHaveScreenshot('login-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 100,
      });
    });

    test('should match registration page screenshot', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('register-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 100,
      });
    });

    test('should match landing page screenshot', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('landing-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 150,
      });
    });
  });

  test.describe('Dashboard Views', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();
    });

    test('should match dashboard overview screenshot', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('dashboard-overview.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp, .relative-time, [data-testid="timestamp"]'),
          page.locator('.notification-badge'),
        ],
        maxDiffPixels: 200,
      });
    });

    test('should match appointments page screenshot', async ({ page }) => {
      await page.goto('/appointments');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('appointments-page.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp, .date, [data-testid="appointment-date"]'),
        ],
        maxDiffPixels: 200,
      });
    });

    test('should match prescriptions page screenshot', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('prescriptions-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    });

    test('should match medical records page screenshot', async ({ page }) => {
      await page.goto('/medical-records');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('medical-records-page.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp, .date'),
        ],
        maxDiffPixels: 200,
      });
    });

    test('should match profile page screenshot', async ({ page }) => {
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('profile-page.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('[data-testid="profile-picture"], .avatar'),
        ],
        maxDiffPixels: 150,
      });
    });

    test('should match settings page screenshot', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 150,
      });
    });
  });

  test.describe('Component Snapshots', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();
    });

    test('should match navigation component', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const navigation = page.locator('nav, [role="navigation"]').first();
      await expect(navigation).toHaveScreenshot('navigation-component.png', {
        animations: 'disabled',
        maxDiffPixels: 50,
      });
    });

    test('should match header component', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const header = page.locator('header, [role="banner"]').first();
      await expect(header).toHaveScreenshot('header-component.png', {
        animations: 'disabled',
        mask: [
          page.locator('.notification-badge, .avatar'),
        ],
        maxDiffPixels: 50,
      });
    });

    test('should match appointment card component', async ({ page }) => {
      await page.goto('/appointments');
      await page.waitForLoadState('networkidle');

      const appointmentCard = page.locator('.appointment-card, [data-testid="appointment-card"]').first();

      if (await appointmentCard.isVisible()) {
        await expect(appointmentCard).toHaveScreenshot('appointment-card.png', {
          animations: 'disabled',
          mask: [
            page.locator('.timestamp, .date'),
          ],
          maxDiffPixels: 30,
        });
      }
    });

    test('should match prescription card component', async ({ page }) => {
      await page.goto('/prescriptions');
      await page.waitForLoadState('networkidle');

      const prescriptionCard = page.locator('.prescription-card, [data-testid="prescription-card"]').first();

      if (await prescriptionCard.isVisible()) {
        await expect(prescriptionCard).toHaveScreenshot('prescription-card.png', {
          animations: 'disabled',
          maxDiffPixels: 30,
        });
      }
    });

    test('should match form components', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const loginForm = page.locator('form').first();
      await expect(loginForm).toHaveScreenshot('login-form.png', {
        animations: 'disabled',
        maxDiffPixels: 50,
      });
    });
  });

  test.describe('Modal and Dialog Snapshots', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();
    });

    test('should match appointment booking modal', async ({ page }) => {
      await page.goto('/appointments');
      await page.waitForLoadState('networkidle');

      const bookButton = page.locator('button:has-text("Book"), button:has-text("New")').first();

      if (await bookButton.isVisible()) {
        await bookButton.click();

        const modal = page.locator('[role="dialog"], .modal');
        await expect(modal).toBeVisible({ timeout: 5000 });
        await page.waitForTimeout(300);

        await expect(modal).toHaveScreenshot('appointment-booking-modal.png', {
          animations: 'disabled',
          maxDiffPixels: 100,
        });
      }
    });

    test('should match confirmation dialog', async ({ page }) => {
      await page.goto('/appointments');
      await page.waitForLoadState('networkidle');

      // Try to trigger a confirmation dialog
      const appointmentCard = page.locator('.appointment-card').first();

      if (await appointmentCard.isVisible()) {
        const cancelButton = appointmentCard.locator('button:has-text("Cancel")');

        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          const dialog = page.locator('[role="dialog"], [role="alertdialog"]');

          if (await dialog.isVisible({ timeout: 2000 })) {
            await expect(dialog).toHaveScreenshot('confirmation-dialog.png', {
              animations: 'disabled',
              maxDiffPixels: 50,
            });
          }
        }
      }
    });
  });

  test.describe('Responsive Design Snapshots', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();
    });

    test('should match mobile view (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('dashboard-mobile-375.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp, .notification-badge'),
        ],
        maxDiffPixels: 200,
      });
    });

    test('should match tablet view (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('dashboard-tablet-768.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp, .notification-badge'),
        ],
        maxDiffPixels: 200,
      });
    });

    test('should match desktop view (1920px)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('dashboard-desktop-1920.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp, .notification-badge'),
        ],
        maxDiffPixels: 250,
      });
    });
  });

  test.describe('Theme Snapshots', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();
    });

    test('should match light theme', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Ensure light theme is active
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      });

      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot('dashboard-light-theme.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp'),
        ],
        maxDiffPixels: 200,
      });
    });

    test('should match dark theme', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Enable dark theme
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot('dashboard-dark-theme.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          page.locator('.timestamp'),
        ],
        maxDiffPixels: 200,
      });
    });
  });

  test.describe('State Variations', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();
    });

    test('should match empty state', async ({ page }) => {
      // This would need a fresh account with no data
      await page.goto('/appointments');
      await page.waitForLoadState('networkidle');

      const emptyState = page.locator(':text("No appointments"), :text("no upcoming")');

      if (await emptyState.isVisible()) {
        await expect(page).toHaveScreenshot('appointments-empty-state.png', {
          fullPage: true,
          animations: 'disabled',
          maxDiffPixels: 100,
        });
      }
    });

    test('should match loading state', async ({ page }) => {
      // Intercept API to delay response
      await page.route('**/api/**', route => {
        setTimeout(() => route.continue(), 2000);
      });

      const navigationPromise = page.goto('/appointments');

      // Capture loading state
      await page.waitForTimeout(500);

      const loader = page.locator('[role="status"], .loading, .spinner');

      if (await loader.isVisible({ timeout: 1000 })) {
        await expect(loader).toHaveScreenshot('loading-state.png', {
          animations: 'disabled',
          maxDiffPixels: 50,
        });
      }

      await navigationPromise;
    });

    test('should match error state', async ({ page }) => {
      await page.goto('/login');

      // Submit invalid credentials
      await page.fill('input[name="email"]', 'invalid@test.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Wait for error
      await page.waitForSelector('.error, [role="alert"]', { timeout: 5000 });

      await expect(page).toHaveScreenshot('login-error-state.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Interaction States', () => {
    test('should match button hover state', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const button = page.locator('button[type="submit"]');
      await button.hover();
      await page.waitForTimeout(200);

      await expect(button).toHaveScreenshot('button-hover.png', {
        animations: 'disabled',
        maxDiffPixels: 20,
      });
    });

    test('should match button focus state', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const button = page.locator('button[type="submit"]');
      await button.focus();
      await page.waitForTimeout(200);

      await expect(button).toHaveScreenshot('button-focus.png', {
        animations: 'disabled',
        maxDiffPixels: 20,
      });
    });

    test('should match input focus state', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const input = page.locator('input[name="email"]');
      await input.focus();
      await page.waitForTimeout(200);

      await expect(input).toHaveScreenshot('input-focus.png', {
        animations: 'disabled',
        maxDiffPixels: 20,
      });
    });
  });
});
