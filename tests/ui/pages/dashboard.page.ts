/**
 * Dashboard Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { selectors, routes } from '../fixtures/test-data';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get dashboardContainer(): Locator {
    return this.page.locator(selectors.dashboardContainer);
  }

  get welcomeMessage(): Locator {
    return this.page.locator(selectors.welcomeMessage);
  }

  get quickActions(): Locator {
    return this.page.locator(selectors.quickActions);
  }

  get upcomingAppointments(): Locator {
    return this.page.locator(selectors.upcomingAppointments);
  }

  get statsCards(): Locator {
    return this.page.locator(selectors.statsCards);
  }

  get bookAppointmentButton(): Locator {
    return this.page.locator(selectors.bookAppointmentButton);
  }

  get appointmentCards(): Locator {
    return this.page.locator(selectors.appointmentCard);
  }

  // Navigation items
  get navAppointments(): Locator {
    return this.page.locator('a[href*="appointments"]').first();
  }

  get navPrescriptions(): Locator {
    return this.page.locator('a[href*="prescriptions"]').first();
  }

  get navRecords(): Locator {
    return this.page.locator('a[href*="records"]').first();
  }

  get navProfile(): Locator {
    return this.page.locator('a[href*="profile"]').first();
  }

  get navSettings(): Locator {
    return this.page.locator('a[href*="settings"]').first();
  }

  get navBilling(): Locator {
    return this.page.locator('a[href*="billing"]').first();
  }

  // Actions
  async navigate(): Promise<void> {
    await this.goto(routes.web.dashboard);
    await this.waitForLoadingToComplete();
  }

  async clickBookAppointment(): Promise<void> {
    await this.bookAppointmentButton.click();
  }

  async clickAppointmentCard(index: number = 0): Promise<void> {
    await this.appointmentCards.nth(index).click();
  }

  async navigateToAppointments(): Promise<void> {
    await this.navAppointments.click();
    await this.waitForPageLoad();
  }

  async navigateToPrescriptions(): Promise<void> {
    await this.navPrescriptions.click();
    await this.waitForPageLoad();
  }

  async navigateToRecords(): Promise<void> {
    await this.navRecords.click();
    await this.waitForPageLoad();
  }

  async navigateToProfile(): Promise<void> {
    await this.navProfile.click();
    await this.waitForPageLoad();
  }

  async navigateToSettings(): Promise<void> {
    await this.navSettings.click();
    await this.waitForPageLoad();
  }

  async navigateToBilling(): Promise<void> {
    await this.navBilling.click();
    await this.waitForPageLoad();
  }

  // Data getters
  async getWelcomeText(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }

  async getAppointmentCount(): Promise<number> {
    return await this.appointmentCards.count();
  }

  async getStatsCardValues(): Promise<Map<string, string>> {
    const stats = new Map<string, string>();
    const cards = await this.statsCards.locator('.stat-card, [data-testid*="stat"]').all();

    for (const card of cards) {
      const label = await card.locator('.stat-label, [data-testid*="label"]').textContent();
      const value = await card.locator('.stat-value, [data-testid*="value"]').textContent();
      if (label && value) {
        stats.set(label.trim(), value.trim());
      }
    }

    return stats;
  }

  // Assertions
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.dashboardContainer).toBeVisible();
    await this.waitForLoadingToComplete();
  }

  async expectWelcomeMessageVisible(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible();
  }

  async expectWelcomeMessageContains(name: string): Promise<void> {
    await expect(this.welcomeMessage).toContainText(name);
  }

  async expectQuickActionsVisible(): Promise<void> {
    await expect(this.quickActions).toBeVisible();
  }

  async expectUpcomingAppointmentsVisible(): Promise<void> {
    await expect(this.upcomingAppointments).toBeVisible();
  }

  async expectNoAppointments(): Promise<void> {
    const noAppointmentsMessage = this.page.locator('[data-testid="no-appointments"], .no-appointments');
    await expect(noAppointmentsMessage).toBeVisible();
  }

  async expectAppointmentsCount(count: number): Promise<void> {
    await expect(this.appointmentCards).toHaveCount(count);
  }

  async expectSidebarVisible(): Promise<void> {
    await expect(this.sidebar).toBeVisible();
  }

  async expectUserMenuVisible(): Promise<void> {
    await expect(this.userMenu).toBeVisible();
  }

  // Quick action helpers
  async getQuickActionButtons(): Promise<Locator> {
    return this.quickActions.locator('button, a');
  }

  async clickQuickAction(actionName: string): Promise<void> {
    await this.quickActions.locator(`button:has-text("${actionName}"), a:has-text("${actionName}")`).click();
  }

  // Notification helpers
  get notificationBell(): Locator {
    return this.page.locator('[data-testid="notifications"], [aria-label*="notification"]');
  }

  get notificationBadge(): Locator {
    return this.page.locator('[data-testid="notification-badge"]');
  }

  async getNotificationCount(): Promise<number> {
    const badgeText = await this.notificationBadge.textContent();
    return badgeText ? parseInt(badgeText, 10) : 0;
  }

  async openNotifications(): Promise<void> {
    await this.notificationBell.click();
  }
}
