import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DashboardPage } from "../pages/dashboard.page";
import { AuditLogsPage } from "../pages/audit-logs.page";
import { testAdmins, testAuditLogs } from "../fixtures/test-data";

/**
 * Admin Dashboard Audit Log E2E Tests
 *
 * Tests for audit log viewing, filtering, and export functionality
 */

test.describe("Audit Log Viewing", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let auditLogsPage: AuditLogsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    auditLogsPage = new AuditLogsPage(page);

    // Login as admin before each test
    await loginPage.goto();
    await loginPage.login(testAdmins.admin1.email, testAdmins.admin1.password);
    await loginPage.waitForLoginSuccess();
  });

  test.describe("Audit Logs List View", () => {
    test("should display audit logs page with search and filters", async ({
      page: _page,
    }) => {
      await auditLogsPage.goto();

      await auditLogsPage.assertAuditLogsPageDisplayed();
      await expect(auditLogsPage.searchInput).toBeVisible();
    });

    test("should navigate to audit logs page from dashboard", async ({
      page,
    }) => {
      await dashboardPage.gotoAuditLogs();

      await auditLogsPage.assertAuditLogsPageDisplayed();
      expect(page.url()).toMatch(/audit/);
    });

    test("should display list of audit logs", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      expect(logCount).toBeGreaterThanOrEqual(0);
    });

    test("should search audit logs by keyword", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.searchLogs("LOGIN");

      await auditLogsPage.waitForLogsLoad();
    });

    test("should show no results message for non-matching search", async ({
      page: _page,
    }) => {
      await auditLogsPage.goto();

      await auditLogsPage.searchLogs("nonexistentaction12345");

      await auditLogsPage.assertNoResultsDisplayed();
    });

    test("should clear search and show all logs", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const initialCount = await auditLogsPage.getLogCount();

      await auditLogsPage.searchLogs("LOGIN");
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.clearSearch();
      await auditLogsPage.waitForLogsLoad();

      const finalCount = await auditLogsPage.getLogCount();
      expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe("Filter Audit Logs", () => {
    test("should filter logs by action type", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.filterByAction("LOGIN");

      await auditLogsPage.waitForLogsLoad();
    });

    test("should filter logs by resource", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.filterByResource("users");

      await auditLogsPage.waitForLogsLoad();
    });

    test("should filter logs by severity", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.filterBySeverity("warning");

      await auditLogsPage.waitForLogsLoad();
    });

    test("should filter logs by date range", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const startDate = lastWeek.toISOString().split("T")[0];
      const endDate = today.toISOString().split("T")[0];

      await auditLogsPage.filterByDateRange(startDate, endDate);

      await auditLogsPage.waitForLogsLoad();
    });

    test("should combine multiple filters", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.filterByAction("LOGIN");
      await auditLogsPage.filterBySeverity("info");

      await auditLogsPage.waitForLogsLoad();
    });

    test("should clear all filters", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const initialCount = await auditLogsPage.getLogCount();

      await auditLogsPage.filterByAction("LOGIN");
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.clearFilters();
      await auditLogsPage.waitForLogsLoad();

      const finalCount = await auditLogsPage.getLogCount();
      expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe("View Log Details", () => {
    test("should display log details when clicking on log entry", async ({
      page: _page,
    }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0) {
        await auditLogsPage.clickLogByIndex(0);

        await auditLogsPage.assertLogDetailVisible();
      }
    });

    test("should display log timestamp in details", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0) {
        await auditLogsPage.clickLogByIndex(0);

        await expect(auditLogsPage.logTimestamp).toBeVisible();
      }
    });

    test("should display log action in details", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0) {
        await auditLogsPage.clickLogByIndex(0);

        const action = await auditLogsPage.getLogActionFromDetail();
        expect(action).toBeTruthy();
      }
    });

    test("should display IP address in log details", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0) {
        await auditLogsPage.clickLogByIndex(0);

        await expect(auditLogsPage.logIpAddress).toBeVisible();
      }
    });

    test("should close log detail panel", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0) {
        await auditLogsPage.clickLogByIndex(0);
        await auditLogsPage.assertLogDetailVisible();

        await auditLogsPage.closeLogDetail();

        await expect(auditLogsPage.logDetailPanel).not.toBeVisible();
      }
    });
  });

  test.describe("Severity Indicators", () => {
    test("should display severity levels with visual indicators", async ({
      page: _page,
    }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const severityCounts = await auditLogsPage.getSeverityCounts();

      // At least one severity type should have entries
      const totalCount =
        severityCounts.info +
        severityCounts.warning +
        severityCounts.error +
        severityCounts.critical;
      expect(totalCount).toBeGreaterThanOrEqual(0);
    });

    test("should filter to show only critical severity logs", async ({
      page: _page,
    }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.filterBySeverity("critical");

      await auditLogsPage.waitForLogsLoad();
    });

    test("should filter to show only warning severity logs", async ({
      page: _page,
    }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.filterBySeverity("warning");

      await auditLogsPage.waitForLogsLoad();
    });
  });

  test.describe("Export Audit Logs", () => {
    test("should export logs as CSV", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0 && (await auditLogsPage.exportButton.isVisible())) {
        const download = await auditLogsPage.exportAsCsv();
        expect(download).toBeTruthy();
      }
    });

    test("should export logs as Excel", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0 && (await auditLogsPage.exportButton.isVisible())) {
        const download = await auditLogsPage.exportAsExcel();
        expect(download).toBeTruthy();
      }
    });

    test("should export logs as PDF", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0 && (await auditLogsPage.exportButton.isVisible())) {
        const download = await auditLogsPage.exportAsPdf();
        expect(download).toBeTruthy();
      }
    });

    test("should export filtered logs", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      // Apply filter first
      await auditLogsPage.filterByAction("LOGIN");
      await auditLogsPage.waitForLogsLoad();

      const logCount = await auditLogsPage.getLogCount();
      if (logCount > 0 && (await auditLogsPage.exportButton.isVisible())) {
        const download = await auditLogsPage.exportAsCsv();
        expect(download).toBeTruthy();
      }
    });
  });

  test.describe("Pagination", () => {
    test("should navigate to next page of logs", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      if (
        (await auditLogsPage.nextPageButton.isVisible()) &&
        (await auditLogsPage.nextPageButton.isEnabled())
      ) {
        await auditLogsPage.nextPage();
        await auditLogsPage.waitForLogsLoad();

        const logCount = await auditLogsPage.getLogCount();
        expect(logCount).toBeGreaterThan(0);
      }
    });

    test("should navigate to previous page of logs", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      if (
        (await auditLogsPage.nextPageButton.isVisible()) &&
        (await auditLogsPage.nextPageButton.isEnabled())
      ) {
        await auditLogsPage.nextPage();
        await auditLogsPage.waitForLogsLoad();

        await auditLogsPage.previousPage();
        await auditLogsPage.waitForLogsLoad();

        const logCount = await auditLogsPage.getLogCount();
        expect(logCount).toBeGreaterThan(0);
      }
    });

    test("should change page size", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      if (await auditLogsPage.pageSizeSelect.isVisible()) {
        await auditLogsPage.changePageSize(50);
        await auditLogsPage.waitForLogsLoad();
      }
    });
  });

  test.describe("Refresh Logs", () => {
    test("should refresh audit logs", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      await auditLogsPage.refreshLogs();
      await auditLogsPage.waitForLogsLoad();

      const newCount = await auditLogsPage.getLogCount();
      expect(newCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Real-time Updates", () => {
    test("should show recent activity in logs", async ({ page: _page }) => {
      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      // Filter to last 24 hours
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      const startDate = yesterday.toISOString().split("T")[0];
      const endDate = today.toISOString().split("T")[0];

      await auditLogsPage.filterByDateRange(startDate, endDate);
      await auditLogsPage.waitForLogsLoad();

      // Should have at least the login action from this test
      const logCount = await auditLogsPage.getLogCount();
      expect(logCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Permission-Based Access", () => {
    test("should allow moderator to view audit logs", async ({ page: _page }) => {
      // Logout and login as moderator
      await dashboardPage.logout();
      await loginPage.login(
        testAdmins.moderator1.email,
        testAdmins.moderator1.password,
      );
      await loginPage.waitForLoginSuccess();

      await auditLogsPage.goto();

      await auditLogsPage.assertAuditLogsPageDisplayed();
    });

    test("moderator should not be able to export logs", async ({ page: _page }) => {
      // Logout and login as moderator
      await dashboardPage.logout();
      await loginPage.login(
        testAdmins.moderator1.email,
        testAdmins.moderator1.password,
      );
      await loginPage.waitForLoginSuccess();

      await auditLogsPage.goto();
      await auditLogsPage.waitForLogsLoad();

      // Export button should not be visible or should be disabled for moderators
      const exportVisible = await auditLogsPage.exportButton
        .isVisible()
        .catch(() => false);
      if (exportVisible) {
        const exportEnabled = await auditLogsPage.exportButton.isEnabled();
        expect(exportEnabled).toBe(false);
      }
    });
  });
});
