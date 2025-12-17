import { Page, Locator, expect } from '@playwright/test';

/**
 * Dashboard Page Object Model
 *
 * Encapsulates the dashboard page elements and actions for reusable test code.
 */
export class DashboardPage {
  readonly page: Page;

  // Main navigation elements
  readonly dashboardLink: Locator;
  readonly appointmentsLink: Locator;
  readonly profileLink: Locator;
  readonly documentsLink: Locator;
  readonly messagesLink: Locator;
  readonly settingsLink: Locator;
  readonly logoutButton: Locator;

  // Dashboard header elements
  readonly userMenu: Locator;
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly notificationBell: Locator;
  readonly notificationBadge: Locator;

  // Dashboard content elements
  readonly welcomeMessage: Locator;
  readonly upcomingAppointments: Locator;
  readonly recentDocuments: Locator;
  readonly healthSummary: Locator;
  readonly quickActionsSection: Locator;

  // Quick action buttons
  readonly bookAppointmentButton: Locator;
  readonly uploadDocumentButton: Locator;
  readonly viewProfileButton: Locator;
  readonly messagesDoctorButton: Locator;

  // Appointment cards
  readonly appointmentCards: Locator;
  readonly firstAppointmentCard: Locator;

  // Search and filter
  readonly searchInput: Locator;
  readonly filterButton: Locator;

  // Sidebar elements
  readonly sidebar: Locator;
  readonly sidebarToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.dashboardLink = page.locator('nav a[href="/dashboard"], nav a:has-text("Dashboard")');
    this.appointmentsLink = page.locator('nav a[href="/appointments"], nav a:has-text("Appointments")');
    this.profileLink = page.locator('nav a[href="/profile"], nav a:has-text("Profile")');
    this.documentsLink = page.locator('nav a[href="/documents"], nav a:has-text("Documents")');
    this.messagesLink = page.locator('nav a[href="/messages"], nav a:has-text("Messages")');
    this.settingsLink = page.locator('nav a[href="/settings"], nav a:has-text("Settings")');
    this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out")');

    // Header
    this.userMenu = page.locator('[data-testid="user-menu"], .user-menu');
    this.userAvatar = page.locator('[data-testid="user-avatar"], .user-avatar');
    this.userName = page.locator('[data-testid="user-name"], .user-name');
    this.notificationBell = page.locator('[data-testid="notifications"], [aria-label="Notifications"]');
    this.notificationBadge = page.locator('[data-testid="notification-badge"], .notification-badge');

    // Content sections
    this.welcomeMessage = page.locator('[data-testid="welcome-message"], h1, h2');
    this.upcomingAppointments = page.locator('[data-testid="upcoming-appointments"], .upcoming-appointments');
    this.recentDocuments = page.locator('[data-testid="recent-documents"], .recent-documents');
    this.healthSummary = page.locator('[data-testid="health-summary"], .health-summary');
    this.quickActionsSection = page.locator('[data-testid="quick-actions"], .quick-actions');

    // Quick actions
    this.bookAppointmentButton = page.locator('button:has-text("Book Appointment"), a:has-text("Book Appointment")');
    this.uploadDocumentButton = page.locator('button:has-text("Upload Document"), a:has-text("Upload Document")');
    this.viewProfileButton = page.locator('button:has-text("View Profile"), a:has-text("View Profile")');
    this.messagesDoctorButton = page.locator('button:has-text("Message Doctor"), a:has-text("Message Doctor")');

    // Appointments
    this.appointmentCards = page.locator('[data-testid="appointment-card"], .appointment-card');
    this.firstAppointmentCard = this.appointmentCards.first();

    // Search and filters
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]');
    this.filterButton = page.locator('button:has-text("Filter"), button[aria-label="Filter"]');

    // Sidebar
    this.sidebar = page.locator('[data-testid="sidebar"], aside, .sidebar');
    this.sidebarToggle = page.locator('[data-testid="sidebar-toggle"], .sidebar-toggle');
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to appointments page
   */
  async gotoAppointments() {
    await this.appointmentsLink.click();
    await this.page.waitForURL(/\/appointments/);
  }

  /**
   * Navigate to profile page
   */
  async gotoProfile() {
    await this.profileLink.click();
    await this.page.waitForURL(/\/profile/);
  }

  /**
   * Navigate to documents page
   */
  async gotoDocuments() {
    await this.documentsLink.click();
    await this.page.waitForURL(/\/documents/);
  }

  /**
   * Navigate to messages page
   */
  async gotoMessages() {
    await this.messagesLink.click();
    await this.page.waitForURL(/\/messages/);
  }

  /**
   * Navigate to settings page
   */
  async gotoSettings() {
    await this.settingsLink.click();
    await this.page.waitForURL(/\/settings/);
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
   * Click book appointment button
   */
  async clickBookAppointment() {
    await this.bookAppointmentButton.click();
  }

  /**
   * Click upload document button
   */
  async clickUploadDocument() {
    await this.uploadDocumentButton.click();
  }

  /**
   * Click view profile button
   */
  async clickViewProfile() {
    await this.viewProfileButton.click();
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
    return parseInt(text || '0', 10);
  }

  /**
   * Get user name from header
   */
  async getUserName(): Promise<string> {
    return (await this.userName.textContent()) || '';
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return (await this.welcomeMessage.textContent()) || '';
  }

  /**
   * Get upcoming appointments count
   */
  async getUpcomingAppointmentsCount(): Promise<number> {
    return await this.appointmentCards.count();
  }

  /**
   * Get first appointment details
   */
  async getFirstAppointmentDetails() {
    if ((await this.appointmentCards.count()) === 0) {
      return null;
    }

    const card = this.firstAppointmentCard;
    const date = await card.locator('[data-testid="appointment-date"], .appointment-date').textContent();
    const time = await card.locator('[data-testid="appointment-time"], .appointment-time').textContent();
    const doctor = await card.locator('[data-testid="doctor-name"], .doctor-name').textContent();
    const type = await card.locator('[data-testid="appointment-type"], .appointment-type').textContent();

    return { date, time, doctor, type };
  }

  /**
   * Click on specific appointment card
   */
  async clickAppointmentCard(index: number = 0) {
    await this.appointmentCards.nth(index).click();
  }

  /**
   * Search for content
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
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
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.dashboardLink).toBeVisible();
  }

  /**
   * Assert user is logged in
   */
  async assertUserLoggedIn(expectedName?: string) {
    await expect(this.userMenu).toBeVisible();

    if (expectedName) {
      await expect(this.userName).toContainText(expectedName);
    }
  }

  /**
   * Assert upcoming appointments section is visible
   */
  async assertUpcomingAppointmentsVisible() {
    await expect(this.upcomingAppointments).toBeVisible();
  }

  /**
   * Assert quick actions are available
   */
  async assertQuickActionsAvailable() {
    await expect(this.quickActionsSection).toBeVisible();
    await expect(this.bookAppointmentButton).toBeVisible();
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.welcomeMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get all navigation links
   */
  async getNavigationLinks(): Promise<string[]> {
    const links = await this.page.locator('nav a').allTextContents();
    return links;
  }

  /**
   * Check if navigation link is active
   */
  async isNavigationLinkActive(linkText: string): Promise<boolean> {
    const link = this.page.locator(`nav a:has-text("${linkText}")`);
    const classes = await link.getAttribute('class');
    return classes?.includes('active') || classes?.includes('current') || false;
  }

  /**
   * Get health summary data
   */
  async getHealthSummaryData() {
    if (!(await this.healthSummary.isVisible())) {
      return null;
    }

    // Extract various health metrics if available
    const summary = await this.healthSummary.textContent();
    return summary;
  }

  /**
   * Assert no appointments message is displayed
   */
  async assertNoAppointmentsMessage() {
    const noAppointmentsMessage = this.page.locator(':text("No upcoming appointments"), :text("You don\'t have any appointments")');
    await expect(noAppointmentsMessage).toBeVisible();
  }

  /**
   * Refresh dashboard
   */
  async refresh() {
    await this.page.reload();
    await this.waitForDashboardLoad();
  }
}
