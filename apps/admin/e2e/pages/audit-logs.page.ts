import { Page, Locator, expect } from "@playwright/test";

/**
 * Admin Dashboard Audit Logs Page Object Model
 *
 * Encapsulates the audit logs page elements and actions for reusable test code.
 */
export class AuditLogsPage {
  readonly page: Page;

  // Page header elements
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly exportButton: Locator;
  readonly refreshButton: Locator;

  // Filter elements
  readonly actionFilter: Locator;
  readonly resourceFilter: Locator;
  readonly userFilter: Locator;
  readonly severityFilter: Locator;
  readonly dateRangeStart: Locator;
  readonly dateRangeEnd: Locator;
  readonly clearFiltersButton: Locator;
  readonly applyFiltersButton: Locator;

  // Audit log list elements
  readonly auditLogTable: Locator;
  readonly auditLogRows: Locator;
  readonly noResultsMessage: Locator;
  readonly loadingIndicator: Locator;

  // Pagination elements
  readonly paginationContainer: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageInfo: Locator;
  readonly pageSizeSelect: Locator;

  // Log detail elements
  readonly logDetailPanel: Locator;
  readonly logTimestamp: Locator;
  readonly logAction: Locator;
  readonly logResource: Locator;
  readonly logUser: Locator;
  readonly logIpAddress: Locator;
  readonly logDetails: Locator;
  readonly logSeverity: Locator;
  readonly closeDetailButton: Locator;

  // Severity indicators
  readonly severityInfo: Locator;
  readonly severityWarning: Locator;
  readonly severityError: Locator;
  readonly severityCritical: Locator;

  // Export options
  readonly exportCsvButton: Locator;
  readonly exportExcelButton: Locator;
  readonly exportPdfButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.pageTitle = page.locator(
      'h1:has-text("Audit"), [data-testid="page-title"]',
    );
    this.searchInput = page.locator(
      'input[type="search"], input[placeholder*="Search" i], [data-testid="audit-search"]',
    );
    this.filterButton = page.locator(
      'button:has-text("Filter"), [data-testid="filter-button"]',
    );
    this.exportButton = page.locator(
      'button:has-text("Export"), [data-testid="export-logs"]',
    );
    this.refreshButton = page.locator(
      'button:has-text("Refresh"), button[aria-label="Refresh"], [data-testid="refresh"]',
    );

    // Filters
    this.actionFilter = page.locator(
      'select[name="action"], [data-testid="action-filter"]',
    );
    this.resourceFilter = page.locator(
      'select[name="resource"], [data-testid="resource-filter"]',
    );
    this.userFilter = page.locator(
      'select[name="user"], input[name="user"], [data-testid="user-filter"]',
    );
    this.severityFilter = page.locator(
      'select[name="severity"], [data-testid="severity-filter"]',
    );
    this.dateRangeStart = page.locator(
      'input[name="startDate"], [data-testid="date-start"]',
    );
    this.dateRangeEnd = page.locator(
      'input[name="endDate"], [data-testid="date-end"]',
    );
    this.clearFiltersButton = page.locator(
      'button:has-text("Clear"), [data-testid="clear-filters"]',
    );
    this.applyFiltersButton = page.locator(
      'button:has-text("Apply"), [data-testid="apply-filters"]',
    );

    // Audit log list
    this.auditLogTable = page.locator(
      'table, [data-testid="audit-logs-table"]',
    );
    this.auditLogRows = page.locator(
      'table tbody tr, [data-testid="audit-log-row"]',
    );
    this.noResultsMessage = page.locator(
      ':text("No logs found"), :text("No results"), [data-testid="no-results"]',
    );
    this.loadingIndicator = page.locator(
      '[data-testid="loading"], .loading, .spinner',
    );

    // Pagination
    this.paginationContainer = page.locator(
      '[data-testid="pagination"], .pagination',
    );
    this.prevPageButton = page.locator(
      'button[aria-label="Previous page"], button:has-text("Previous")',
    );
    this.nextPageButton = page.locator(
      'button[aria-label="Next page"], button:has-text("Next")',
    );
    this.pageInfo = page.locator('[data-testid="page-info"], .page-info');
    this.pageSizeSelect = page.locator(
      'select[name="pageSize"], [data-testid="page-size"]',
    );

    // Log detail
    this.logDetailPanel = page.locator(
      '[data-testid="log-detail"], .log-detail-panel, [role="dialog"]',
    );
    this.logTimestamp = page.locator(
      '[data-testid="log-timestamp"], .log-timestamp',
    );
    this.logAction = page.locator('[data-testid="log-action"], .log-action');
    this.logResource = page.locator(
      '[data-testid="log-resource"], .log-resource',
    );
    this.logUser = page.locator('[data-testid="log-user"], .log-user');
    this.logIpAddress = page.locator('[data-testid="log-ip"], .log-ip-address');
    this.logDetails = page.locator('[data-testid="log-details"], .log-details');
    this.logSeverity = page.locator(
      '[data-testid="log-severity"], .log-severity',
    );
    this.closeDetailButton = page.locator(
      '[data-testid="close-detail"], button:has-text("Close")',
    );

    // Severity
    this.severityInfo = page.locator('.severity-info, [data-severity="info"]');
    this.severityWarning = page.locator(
      '.severity-warning, [data-severity="warning"]',
    );
    this.severityError = page.locator(
      '.severity-error, [data-severity="error"]',
    );
    this.severityCritical = page.locator(
      '.severity-critical, [data-severity="critical"]',
    );

    // Export options
    this.exportCsvButton = page.locator(
      'button:has-text("CSV"), [data-testid="export-csv"]',
    );
    this.exportExcelButton = page.locator(
      'button:has-text("Excel"), [data-testid="export-excel"]',
    );
    this.exportPdfButton = page.locator(
      'button:has-text("PDF"), [data-testid="export-pdf"]',
    );
  }

  /**
   * Navigate to audit logs page
   */
  async goto() {
    await this.page.goto("/audit-logs");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Search audit logs
   */
  async searchLogs(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Clear search
   */
  async clearSearch() {
    await this.searchInput.clear();
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Filter by action
   */
  async filterByAction(action: string) {
    await this.actionFilter.selectOption(action);
    await this.applyFilters();
  }

  /**
   * Filter by resource
   */
  async filterByResource(resource: string) {
    await this.resourceFilter.selectOption(resource);
    await this.applyFilters();
  }

  /**
   * Filter by severity
   */
  async filterBySeverity(severity: string) {
    await this.severityFilter.selectOption(severity);
    await this.applyFilters();
  }

  /**
   * Filter by date range
   */
  async filterByDateRange(startDate: string, endDate: string) {
    await this.dateRangeStart.fill(startDate);
    await this.dateRangeEnd.fill(endDate);
    await this.applyFilters();
  }

  /**
   * Apply filters
   */
  async applyFilters() {
    if (await this.applyFiltersButton.isVisible()) {
      await this.applyFiltersButton.click();
    }
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Clear all filters
   */
  async clearFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Refresh logs
   */
  async refreshLogs() {
    await this.refreshButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get log count from table
   */
  async getLogCount(): Promise<number> {
    return await this.auditLogRows.count();
  }

  /**
   * Click on a log row by index
   */
  async clickLogByIndex(index: number) {
    await this.auditLogRows.nth(index).click();
  }

  /**
   * View log detail by action text
   */
  async viewLogDetail(actionText: string) {
    const logRow = this.page.locator(`tr:has-text("${actionText}")`);
    await logRow.click();
    await this.logDetailPanel.waitFor({ state: "visible" });
  }

  /**
   * Close log detail panel
   */
  async closeLogDetail() {
    await this.closeDetailButton.click();
  }

  /**
   * Export logs as CSV
   */
  async exportAsCsv() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.exportButton.click();
    await this.exportCsvButton.click();
    return await downloadPromise;
  }

  /**
   * Export logs as Excel
   */
  async exportAsExcel() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.exportButton.click();
    await this.exportExcelButton.click();
    return await downloadPromise;
  }

  /**
   * Export logs as PDF
   */
  async exportAsPdf() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.exportButton.click();
    await this.exportPdfButton.click();
    return await downloadPromise;
  }

  /**
   * Navigate to next page
   */
  async nextPage() {
    await this.nextPageButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to previous page
   */
  async previousPage() {
    await this.prevPageButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Change page size
   */
  async changePageSize(size: number) {
    await this.pageSizeSelect.selectOption(size.toString());
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Assert audit logs page is displayed
   */
  async assertAuditLogsPageDisplayed() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  /**
   * Assert log detail panel is visible
   */
  async assertLogDetailVisible() {
    await expect(this.logDetailPanel).toBeVisible();
  }

  /**
   * Assert no results message is displayed
   */
  async assertNoResultsDisplayed() {
    await expect(this.noResultsMessage).toBeVisible();
  }

  /**
   * Wait for logs to load
   */
  async waitForLogsLoad() {
    await this.page.waitForLoadState("networkidle");
    if (await this.loadingIndicator.isVisible()) {
      await this.loadingIndicator.waitFor({ state: "hidden" });
    }
  }

  /**
   * Get log severity counts
   */
  async getSeverityCounts(): Promise<{
    info: number;
    warning: number;
    error: number;
    critical: number;
  }> {
    return {
      info: await this.severityInfo.count(),
      warning: await this.severityWarning.count(),
      error: await this.severityError.count(),
      critical: await this.severityCritical.count(),
    };
  }

  /**
   * Get log action from detail panel
   */
  async getLogActionFromDetail(): Promise<string> {
    return (await this.logAction.textContent()) || "";
  }

  /**
   * Get log user from detail panel
   */
  async getLogUserFromDetail(): Promise<string> {
    return (await this.logUser.textContent()) || "";
  }

  /**
   * Get log details from detail panel
   */
  async getLogDetailsFromDetail(): Promise<string> {
    return (await this.logDetails.textContent()) || "";
  }
}
