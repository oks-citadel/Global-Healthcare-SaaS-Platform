/**
 * Admin Dashboard Page Object Model
 * For Admin Portal
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Dashboard overview
  get dashboardContainer(): Locator {
    return this.page.locator('[data-testid="admin-dashboard"], .admin-dashboard');
  }

  get statsOverview(): Locator {
    return this.page.locator('[data-testid="stats-overview"], .stats-overview');
  }

  get statCards(): Locator {
    return this.page.locator('[data-testid="stat-card"], .stat-card');
  }

  // Users management
  get usersSection(): Locator {
    return this.page.locator('[data-testid="users-section"], .users-section');
  }

  get usersTable(): Locator {
    return this.page.locator('[data-testid="users-table"], .users-table');
  }

  get userRows(): Locator {
    return this.page.locator('[data-testid="user-row"], tbody tr');
  }

  get addUserButton(): Locator {
    return this.page.locator('[data-testid="add-user"], button:has-text("Add User")');
  }

  get userSearch(): Locator {
    return this.page.locator('[data-testid="user-search"], input[placeholder*="search" i]');
  }

  get roleFilter(): Locator {
    return this.page.locator('[data-testid="role-filter"], select[name="role"]');
  }

  // Organizations/Tenants management
  get organizationsSection(): Locator {
    return this.page.locator('[data-testid="organizations-section"], .organizations-section');
  }

  get organizationsList(): Locator {
    return this.page.locator('[data-testid="organizations-list"]');
  }

  get organizationRows(): Locator {
    return this.page.locator('[data-testid="organization-row"]');
  }

  get addOrganizationButton(): Locator {
    return this.page.locator('[data-testid="add-organization"], button:has-text("Add Organization")');
  }

  // Providers management
  get providersSection(): Locator {
    return this.page.locator('[data-testid="providers-section"], .providers-section');
  }

  get providersTable(): Locator {
    return this.page.locator('[data-testid="providers-table"]');
  }

  get providerRows(): Locator {
    return this.page.locator('[data-testid="provider-row"]');
  }

  // Analytics
  get analyticsSection(): Locator {
    return this.page.locator('[data-testid="analytics-section"], .analytics-section');
  }

  get appointmentsChart(): Locator {
    return this.page.locator('[data-testid="appointments-chart"]');
  }

  get revenueChart(): Locator {
    return this.page.locator('[data-testid="revenue-chart"]');
  }

  get usageChart(): Locator {
    return this.page.locator('[data-testid="usage-chart"]');
  }

  // Settings
  get settingsSection(): Locator {
    return this.page.locator('[data-testid="admin-settings"], .admin-settings');
  }

  // Audit logs
  get auditLogsSection(): Locator {
    return this.page.locator('[data-testid="audit-logs"], .audit-logs');
  }

  get auditLogRows(): Locator {
    return this.page.locator('[data-testid="audit-log-row"]');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.goto('/admin/dashboard');
    await this.waitForLoadingToComplete();
  }

  async navigateToUsers(): Promise<void> {
    await this.goto('/admin/users');
    await this.waitForLoadingToComplete();
  }

  async navigateToOrganizations(): Promise<void> {
    await this.goto('/admin/organizations');
    await this.waitForLoadingToComplete();
  }

  async navigateToProviders(): Promise<void> {
    await this.goto('/admin/providers');
    await this.waitForLoadingToComplete();
  }

  async navigateToAnalytics(): Promise<void> {
    await this.goto('/admin/analytics');
    await this.waitForLoadingToComplete();
  }

  async navigateToAuditLogs(): Promise<void> {
    await this.goto('/admin/audit-logs');
    await this.waitForLoadingToComplete();
  }

  // User management actions
  async searchUsers(query: string): Promise<void> {
    await this.userSearch.fill(query);
    await this.page.waitForTimeout(500);
    await this.waitForLoadingToComplete();
  }

  async filterByRole(role: string): Promise<void> {
    await this.roleFilter.selectOption(role);
    await this.waitForLoadingToComplete();
  }

  async getUserCount(): Promise<number> {
    return await this.userRows.count();
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<void> {
    await this.addUserButton.click();

    await this.page.locator('input[name="email"]').fill(userData.email);
    await this.page.locator('input[name="firstName"]').fill(userData.firstName);
    await this.page.locator('input[name="lastName"]').fill(userData.lastName);
    await this.page.locator('select[name="role"]').selectOption(userData.role);

    const submitButton = this.page.locator('[role="dialog"] button[type="submit"]');
    await submitButton.click();

    await this.waitForLoadingToComplete();
  }

  async editUser(index: number): Promise<void> {
    const row = this.userRows.nth(index);
    const editButton = row.locator('[data-testid="edit-user"], button:has-text("Edit")');

    await editButton.click();
    await this.waitForLoadingToComplete();
  }

  async deleteUser(index: number): Promise<void> {
    const row = this.userRows.nth(index);
    const deleteButton = row.locator('[data-testid="delete-user"], button:has-text("Delete")');

    await deleteButton.click();

    const confirmButton = this.page.locator('[role="dialog"] button:has-text("Confirm")');
    await confirmButton.click();

    await this.waitForLoadingToComplete();
  }

  async toggleUserStatus(index: number): Promise<void> {
    const row = this.userRows.nth(index);
    const statusToggle = row.locator('[data-testid="status-toggle"], input[type="checkbox"]');

    await statusToggle.click();
    await this.waitForLoadingToComplete();
  }

  // Organization management
  async createOrganization(orgData: {
    name: string;
    domain: string;
    plan: string;
  }): Promise<void> {
    await this.addOrganizationButton.click();

    await this.page.locator('input[name="name"]').fill(orgData.name);
    await this.page.locator('input[name="domain"]').fill(orgData.domain);
    await this.page.locator('select[name="plan"]').selectOption(orgData.plan);

    const submitButton = this.page.locator('[role="dialog"] button[type="submit"]');
    await submitButton.click();

    await this.waitForLoadingToComplete();
  }

  async getOrganizationCount(): Promise<number> {
    return await this.organizationRows.count();
  }

  // Analytics actions
  async selectDateRange(range: 'week' | 'month' | 'quarter' | 'year'): Promise<void> {
    const rangeSelector = this.page.locator('[data-testid="date-range-selector"]');
    await rangeSelector.selectOption(range);
    await this.waitForLoadingToComplete();
  }

  async exportAnalytics(): Promise<void> {
    const exportButton = this.page.locator('[data-testid="export-analytics"], button:has-text("Export")');
    await exportButton.click();
    await this.waitForLoadingToComplete();
  }

  // Audit log actions
  async filterAuditLogs(filters: {
    action?: string;
    user?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<void> {
    if (filters.action) {
      await this.page.locator('select[name="action"]').selectOption(filters.action);
    }
    if (filters.user) {
      await this.page.locator('input[name="user"]').fill(filters.user);
    }
    if (filters.dateFrom) {
      await this.page.locator('input[name="dateFrom"]').fill(filters.dateFrom);
    }
    if (filters.dateTo) {
      await this.page.locator('input[name="dateTo"]').fill(filters.dateTo);
    }

    const applyButton = this.page.locator('button:has-text("Apply")');
    await applyButton.click();

    await this.waitForLoadingToComplete();
  }

  async getAuditLogCount(): Promise<number> {
    return await this.auditLogRows.count();
  }

  // Stats getters
  async getStatValue(statName: string): Promise<string | null> {
    const card = this.statCards.filter({ hasText: statName });
    const value = card.locator('[data-testid="stat-value"]');
    return await value.textContent();
  }

  // Assertions
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.dashboardContainer).toBeVisible();
  }

  async expectStatsVisible(): Promise<void> {
    await expect(this.statsOverview).toBeVisible();
  }

  async expectUsersTableVisible(): Promise<void> {
    await expect(this.usersTable).toBeVisible();
  }

  async expectUserCreated(email: string): Promise<void> {
    await this.waitForToast('success');
    const userRow = this.userRows.filter({ hasText: email });
    await expect(userRow).toBeVisible();
  }

  async expectUserDeleted(): Promise<void> {
    await this.waitForToast('success');
  }

  async expectOrganizationCreated(name: string): Promise<void> {
    await this.waitForToast('success');
    const orgRow = this.organizationRows.filter({ hasText: name });
    await expect(orgRow).toBeVisible();
  }

  async expectAnalyticsLoaded(): Promise<void> {
    await expect(this.analyticsSection).toBeVisible();
  }

  async expectAuditLogsVisible(): Promise<void> {
    await expect(this.auditLogsSection).toBeVisible();
  }
}
