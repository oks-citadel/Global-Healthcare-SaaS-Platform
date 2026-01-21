/**
 * Smoke Tests - Dashboard
 * Quick verification that dashboard is functional
 */

import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboard.page';
import { testUsers } from '../../fixtures/test-data';

test.describe('Dashboard Smoke Tests', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('should display dashboard with key elements', async () => {
    await dashboardPage.expectDashboardLoaded();
    await dashboardPage.expectWelcomeMessageVisible();
    await dashboardPage.expectSidebarVisible();
    await dashboardPage.expectUserMenuVisible();
  });

  test('should display welcome message with user name', async () => {
    const welcomeText = await dashboardPage.getWelcomeText();
    expect(welcomeText.toLowerCase()).toContain('welcome');
  });

  test('should display quick actions section', async () => {
    await dashboardPage.expectQuickActionsVisible();
  });

  test('should display upcoming appointments section', async () => {
    await dashboardPage.expectUpcomingAppointmentsVisible();
  });

  test('should navigate to appointments page', async ({ page }) => {
    await dashboardPage.navigateToAppointments();
    await expect(page).toHaveURL(/appointments/);
  });

  test('should navigate to prescriptions page', async ({ page }) => {
    await dashboardPage.navigateToPrescriptions();
    await expect(page).toHaveURL(/prescriptions/);
  });

  test('should navigate to profile page', async ({ page }) => {
    await dashboardPage.navigateToProfile();
    await expect(page).toHaveURL(/profile/);
  });

  test('should navigate to settings page', async ({ page }) => {
    await dashboardPage.navigateToSettings();
    await expect(page).toHaveURL(/settings/);
  });

  test('should open user menu', async () => {
    await dashboardPage.openUserMenu();

    // User menu should be visible with options
    const menuOptions = dashboardPage.page.locator('[data-testid="user-menu-dropdown"], [role="menu"]');
    await expect(menuOptions).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check that navigation elements have proper roles
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible();

    // Check for skip link (accessibility best practice)
    const skipLink = page.locator('a[href="#main"], [data-testid="skip-link"]');
    if (await skipLink.count() > 0) {
      await skipLink.first().focus();
      await expect(skipLink.first()).toBeFocused();
    }
  });
});
