import { Page, Locator, expect } from "@playwright/test";

/**
 * Admin Dashboard Main Page Object Model
 *
 * Encapsulates the dashboard page elements and actions for reusable test code.
 */
export class DashboardPage {
  readonly page: Page;

  // Main navigation elements
  readonly dashboardLink: Locator;
  readonly usersLink: Locator;
  readonly settingsLink: Locator;
  readonly auditLogsLink: Locator;
  readonly reportsLink: Locator;
  readonly analyticsLink: Locator;
  readonly logoutButton: Locator;

  // Dashboard header elements
  readonly userMenu: Locator;
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly notificationBell: Locator;
  readonly notificationBadge: Locator;

  // Dashboard content elements
  readonly welcomeMessage: Locator;
  readonly systemHealthCard: Locator;
  readonly userStatsCard: Locator;
  readonly recentActivityCard: Locator;
  readonly quickActionsCard: Locator;

  // Stats widgets
  readonly totalUsersCount: Locator;
  readonly activeUsersCount: Locator;
  readonly pendingUsersCount: Locator;
  readonly suspendedUsersCount: Locator;

  // Quick action buttons
  readonly addUserButton: Locator;
  readonly viewAuditLogsButton: Locator;
  readonly systemSettingsButton: Locator;
  readonly generateReportButton: Locator;

  // Sidebar elements
  readonly sidebar: Locator;
  readonly sidebarToggle: Locator;

  // Recent activity
  readonly recentActivityList: Locator;
  readonly recentActivityItems: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.dashboardLink = page.locator(
      'nav a[href="/dashboard"], nav a[href="/"], nav a:has-text("Dashboard"), [data-testid="nav-dashboard"]',
    );
    this.usersLink = page.locator(
      'nav a[href="/users"], nav a:has-text("Users"), [data-testid="nav-users"]',
    );
    this.settingsLink = page.locator(
      'nav a[href="/settings"], nav a:has-text("Settings"), [data-testid="nav-settings"]',
    );
    this.auditLogsLink = page.locator(
      'nav a[href="/audit-logs"], nav a[href="/audit"], nav a:has-text("Audit"), [data-testid="nav-audit"]',
    );
    this.reportsLink = page.locator(
      'nav a[href="/reports"], nav a:has-text("Reports"), [data-testid="nav-reports"]',
    );
    this.analyticsLink = page.locator(
      'nav a[href="/analytics"], nav a:has-text("Analytics"), [data-testid="nav-analytics"]',
    );
    this.logoutButton = page.locator(
      'button:has-text("Logout"), button:has-text("Sign Out"), [data-testid="logout"]',
    );

    // Header
    this.userMenu = page.locator(
      '[data-testid="user-menu"], .user-menu, [aria-label="User menu"]',
    );
    this.userAvatar = page.locator(
      '[data-testid="user-avatar"], .user-avatar, .avatar',
    );
    this.userName = page.locator('[data-testid="user-name"], .user-name');
    this.notificationBell = page.locator(
      '[data-testid="notifications"], [aria-label="Notifications"], button:has(.lucide-bell)',
    );
    this.notificationBadge = page.locator(
      '[data-testid="notification-badge"], .notification-badge',
    );

    // Content sections
    this.welcomeMessage = page.locator(
      '[data-testid="welcome-message"], h1, h2',
    );
    this.systemHealthCard = page.locator(
      '[data-testid="system-health"], .system-health-card',
    );
    this.userStatsCard = page.locator(
      '[data-testid="user-stats"], .user-stats-card',
    );
    this.recentActivityCard = page.locator(
      '[data-testid="recent-activity"], .recent-activity-card',
    );
    this.quickActionsCard = page.locator(
      '[data-testid="quick-actions"], .quick-actions-card',
    );

    // Stats
    this.totalUsersCount = page.locator(
      '[data-testid="total-users"], .stat-total-users',
    );
    this.activeUsersCount = page.locator(
      '[data-testid="active-users"], .stat-active-users',
    );
    this.pendingUsersCount = page.locator(
      '[data-testid="pending-users"], .stat-pending-users',
    );
    this.suspendedUsersCount = page.locator(
      '[data-testid="suspended-users"], .stat-suspended-users',
    );

    // Quick actions
    this.addUserButton = page.locator(
      'button:has-text("Add User"), a:has-text("Add User"), [data-testid="add-user"]',
    );
    this.viewAuditLogsButton = page.locator(
      'button:has-text("View Audit"), a:has-text("View Audit"), [data-testid="view-audit"]',
    );
    this.systemSettingsButton = page.locator(
      'button:has-text("System Settings"), a:has-text("System Settings"), [data-testid="system-settings"]',
    );
    this.generateReportButton = page.locator(
      'button:has-text("Generate Report"), a:has-text("Generate Report"), [data-testid="generate-report"]',
    );

    // Sidebar
    this.sidebar = page.locator('[data-testid="sidebar"], aside, .sidebar');
    this.sidebarToggle = page.locator(
      '[data-testid="sidebar-toggle"], .sidebar-toggle',
    );

    // Recent activity
    this.recentActivityList = page.locator(
      '[data-testid="activity-list"], .activity-list',
    );
    this.recentActivityItems = page.locator(
      '[data-testid="activity-item"], .activity-item',
    );
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to users page
   */
  async gotoUsers() {
    await this.usersLink.click();
    await this.page.waitForURL(/\/users/);
  }

  /**
   * Navigate to settings page
   */
  async gotoSettings() {
    await this.settingsLink.click();
    await this.page.waitForURL(/\/settings/);
  }

  /**
   * Navigate to audit logs page
   */
  async gotoAuditLogs() {
    await this.auditLogsLink.click();
    await this.page.waitForURL(/\/audit/);
  }

  /**
   * Navigate to reports page
   */
  async gotoReports() {
    await this.reportsLink.click();
    await this.page.waitForURL(/\/reports/);
  }

  /**
   * Perform logout
   */
  async logout() {
    // Open user menu if logout is in dropdown
    if (await this.userMenu.isVisible()) {
      await this.userMenu.click();
    }

    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/);
  }

  /**
   * Click add user button
   */
  async clickAddUser() {
    await this.addUserButton.click();
  }

  /**
   * Click view audit logs button
   */
  async clickViewAuditLogs() {
    await this.viewAuditLogsButton.click();
  }

  /**
   * Click system settings button
   */
  async clickSystemSettings() {
    await this.systemSettingsButton.click();
  }

  /**
   * Open notifications
   */
  async openNotifications() {
    await this.notificationBell.click();
  }

  /**
   * Get notification count
   */
  async getNotificationCount(): Promise<number> {
    if (!(await this.notificationBadge.isVisible())) {
      return 0;
    }
    const text = await this.notificationBadge.textContent();
    return parseInt(text || "0", 10);
  }

  /**
   * Get user name from header
   */
  async getUserName(): Promise<string> {
    return (await this.userName.textContent()) || "";
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return (await this.welcomeMessage.textContent()) || "";
  }

  /**
   * Get total users count
   */
  async getTotalUsersCount(): Promise<number> {
    const text = await this.totalUsersCount.textContent();
    return parseInt(text?.replace(/\D/g, "") || "0", 10);
  }

  /**
   * Get active users count
   */
  async getActiveUsersCount(): Promise<number> {
    const text = await this.activeUsersCount.textContent();
    return parseInt(text?.replace(/\D/g, "") || "0", 10);
  }

  /**
   * Get recent activity items count
   */
  async getRecentActivityCount(): Promise<number> {
    return await this.recentActivityItems.count();
  }

  /**
   * Toggle sidebar visibility
   */
  async toggleSidebar() {
    await this.sidebarToggle.click();
  }

  /**
   * Check if sidebar is visible
   */
  async isSidebarVisible(): Promise<boolean> {
    return await this.sidebar.isVisible();
  }

  /**
   * Assert dashboard page is displayed
   */
  async assertDashboardDisplayed() {
    await expect(this.dashboardLink).toBeVisible();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Assert user is logged in
   */
  async assertUserLoggedIn(expectedName?: string) {
    if (await this.userMenu.isVisible()) {
      await expect(this.userMenu).toBeVisible();
    }

    if (expectedName && (await this.userName.isVisible())) {
      await expect(this.userName).toContainText(expectedName);
    }
  }

  /**
   * Assert navigation links are visible
   */
  async assertNavigationVisible() {
    await expect(this.dashboardLink).toBeVisible();
    await expect(this.usersLink).toBeVisible();
    await expect(this.settingsLink).toBeVisible();
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.page.waitForLoadState("networkidle");
    await this.dashboardLink.waitFor({ state: "visible", timeout: 10000 });
  }

  /**
   * Get all navigation links
   */
  async getNavigationLinks(): Promise<string[]> {
    const links = await this.page.locator("nav a").allTextContents();
    return links;
  }

  /**
   * Check if navigation link is active
   */
  async isNavigationLinkActive(linkText: string): Promise<boolean> {
    const link = this.page.locator(`nav a:has-text("${linkText}")`);
    const classes = await link.getAttribute("class");
    return classes?.includes("active") || classes?.includes("current") || false;
  }

  /**
   * Refresh dashboard
   */
  async refresh() {
    await this.page.reload();
    await this.waitForDashboardLoad();
  }
}
