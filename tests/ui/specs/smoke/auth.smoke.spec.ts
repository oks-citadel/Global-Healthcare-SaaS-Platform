/**
 * Smoke Tests - Authentication
 * Quick verification that auth flows are working
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';
import { testUsers, routes } from '../../fixtures/test-data';

test.describe('Authentication Smoke Tests', () => {
  test.describe('Login Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.expectLoginFormVisible();
      await expect(page).toHaveTitle(/login|sign in/i);
    });

    test('should login with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.login(testUsers.patient.email, testUsers.patient.password);

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/(dashboard|home|appointments)/);
    });

    test('should show error for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.login(testUsers.patient.email, 'WrongPassword123!');

      // Should show error message
      await loginPage.expectErrorMessage();

      // Should stay on login page
      await expect(page).toHaveURL(/login/);
    });

    test('should validate required fields', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Try to submit empty form
      await loginPage.clickLogin();

      // Should show validation errors
      const emailInput = loginPage.emailInput;
      const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
      expect(isEmailInvalid).toBe(true);
    });
  });

  test.describe('Logout Flow', () => {
    test('should logout successfully', async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      // Navigate to dashboard (uses authenticated state from setup)
      await dashboardPage.navigate();
      await dashboardPage.expectDashboardLoaded();

      // Logout
      await dashboardPage.logout();

      // Should redirect to login page
      await expect(page).toHaveURL(/login/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to login', async ({ browser }) => {
      // Create new context without stored auth
      const context = await browser.newContext();
      const page = await context.newPage();

      // Try to access protected route
      await page.goto(routes.web.dashboard);

      // Should redirect to login
      await expect(page).toHaveURL(/login/);

      await context.close();
    });
  });
});
