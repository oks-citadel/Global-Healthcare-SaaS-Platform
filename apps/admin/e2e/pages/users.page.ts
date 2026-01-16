import { Page, Locator, expect } from "@playwright/test";
import { TestUser } from "../fixtures/test-data";

/**
 * Admin Dashboard Users Page Object Model
 *
 * Encapsulates the users management page elements and actions for reusable test code.
 */
export class UsersPage {
  readonly page: Page;

  // Page header elements
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly addUserButton: Locator;
  readonly exportButton: Locator;

  // Filter elements
  readonly roleFilter: Locator;
  readonly statusFilter: Locator;
  readonly dateRangeFilter: Locator;
  readonly clearFiltersButton: Locator;

  // User list elements
  readonly userTable: Locator;
  readonly userRows: Locator;
  readonly noResultsMessage: Locator;
  readonly loadingIndicator: Locator;

  // Pagination elements
  readonly paginationContainer: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageInfo: Locator;
  readonly pageSizeSelect: Locator;

  // User form/modal
  readonly userModal: Locator;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly roleSelect: Locator;
  readonly statusSelect: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveUserButton: Locator;
  readonly cancelButton: Locator;

  // User detail/action buttons
  readonly viewUserButton: Locator;
  readonly editUserButton: Locator;
  readonly suspendUserButton: Locator;
  readonly activateUserButton: Locator;
  readonly deleteUserButton: Locator;
  readonly resetPasswordButton: Locator;

  // Confirmation dialog
  readonly confirmDialog: Locator;
  readonly confirmButton: Locator;
  readonly cancelConfirmButton: Locator;

  // Bulk actions
  readonly selectAllCheckbox: Locator;
  readonly userCheckboxes: Locator;
  readonly bulkActionsMenu: Locator;
  readonly bulkSuspendButton: Locator;
  readonly bulkActivateButton: Locator;
  readonly bulkDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.pageTitle = page.locator(
      'h1:has-text("Users"), [data-testid="page-title"]',
    );
    this.searchInput = page.locator(
      'input[type="search"], input[placeholder*="Search" i], [data-testid="user-search"]',
    );
    this.filterButton = page.locator(
      'button:has-text("Filter"), [data-testid="filter-button"]',
    );
    this.addUserButton = page.locator(
      'button:has-text("Add User"), button:has-text("Create User"), [data-testid="add-user"]',
    );
    this.exportButton = page.locator(
      'button:has-text("Export"), [data-testid="export-users"]',
    );

    // Filters
    this.roleFilter = page.locator(
      'select[name="role"], [data-testid="role-filter"]',
    );
    this.statusFilter = page.locator(
      'select[name="status"], [data-testid="status-filter"]',
    );
    this.dateRangeFilter = page.locator('[data-testid="date-range-filter"]');
    this.clearFiltersButton = page.locator(
      'button:has-text("Clear"), [data-testid="clear-filters"]',
    );

    // User list
    this.userTable = page.locator('table, [data-testid="users-table"]');
    this.userRows = page.locator('table tbody tr, [data-testid="user-row"]');
    this.noResultsMessage = page.locator(
      ':text("No users found"), :text("No results"), [data-testid="no-results"]',
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

    // User form/modal
    this.userModal = page.locator(
      '[role="dialog"], .modal, [data-testid="user-modal"]',
    );
    this.emailInput = page.locator(
      '[role="dialog"] input[name="email"], [role="dialog"] input[type="email"]',
    );
    this.firstNameInput = page.locator(
      '[role="dialog"] input[name="firstName"], [role="dialog"] input[name="first_name"]',
    );
    this.lastNameInput = page.locator(
      '[role="dialog"] input[name="lastName"], [role="dialog"] input[name="last_name"]',
    );
    this.roleSelect = page.locator(
      '[role="dialog"] select[name="role"], [data-testid="role-select"]',
    );
    this.statusSelect = page.locator(
      '[role="dialog"] select[name="status"], [data-testid="status-select"]',
    );
    this.passwordInput = page.locator('[role="dialog"] input[name="password"]');
    this.confirmPasswordInput = page.locator(
      '[role="dialog"] input[name="confirmPassword"], [role="dialog"] input[name="password_confirmation"]',
    );
    this.saveUserButton = page.locator(
      '[role="dialog"] button[type="submit"], [role="dialog"] button:has-text("Save")',
    );
    this.cancelButton = page.locator(
      '[role="dialog"] button:has-text("Cancel")',
    );

    // Action buttons
    this.viewUserButton = page.locator(
      'button:has-text("View"), [data-testid="view-user"]',
    );
    this.editUserButton = page.locator(
      'button:has-text("Edit"), [data-testid="edit-user"]',
    );
    this.suspendUserButton = page.locator(
      'button:has-text("Suspend"), [data-testid="suspend-user"]',
    );
    this.activateUserButton = page.locator(
      'button:has-text("Activate"), [data-testid="activate-user"]',
    );
    this.deleteUserButton = page.locator(
      'button:has-text("Delete"), [data-testid="delete-user"]',
    );
    this.resetPasswordButton = page.locator(
      'button:has-text("Reset Password"), [data-testid="reset-password"]',
    );

    // Confirmation dialog
    this.confirmDialog = page.locator(
      '[role="alertdialog"], .confirm-dialog, [data-testid="confirm-dialog"]',
    );
    this.confirmButton = page.locator(
      '[role="alertdialog"] button:has-text("Confirm"), [role="alertdialog"] button:has-text("Yes")',
    );
    this.cancelConfirmButton = page.locator(
      '[role="alertdialog"] button:has-text("Cancel"), [role="alertdialog"] button:has-text("No")',
    );

    // Bulk actions
    this.selectAllCheckbox = page.locator(
      'thead input[type="checkbox"], [data-testid="select-all"]',
    );
    this.userCheckboxes = page.locator(
      'tbody input[type="checkbox"], [data-testid="user-checkbox"]',
    );
    this.bulkActionsMenu = page.locator(
      '[data-testid="bulk-actions"], .bulk-actions',
    );
    this.bulkSuspendButton = page.locator(
      'button:has-text("Suspend Selected"), [data-testid="bulk-suspend"]',
    );
    this.bulkActivateButton = page.locator(
      'button:has-text("Activate Selected"), [data-testid="bulk-activate"]',
    );
    this.bulkDeleteButton = page.locator(
      'button:has-text("Delete Selected"), [data-testid="bulk-delete"]',
    );
  }

  /**
   * Navigate to users page
   */
  async goto() {
    await this.page.goto("/users");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Search for users
   */
  async searchUser(query: string) {
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
   * Filter by role
   */
  async filterByRole(role: string) {
    await this.roleFilter.selectOption(role);
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Filter by status
   */
  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status);
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
   * Click add user button
   */
  async clickAddUser() {
    await this.addUserButton.click();
    await this.userModal.waitFor({ state: "visible" });
  }

  /**
   * Fill user form
   */
  async fillUserForm(
    user: Partial<TestUser> & { password?: string; confirmPassword?: string },
  ) {
    if (user.email) {
      await this.emailInput.fill(user.email);
    }
    if (user.firstName) {
      await this.firstNameInput.fill(user.firstName);
    }
    if (user.lastName) {
      await this.lastNameInput.fill(user.lastName);
    }
    if (user.role) {
      await this.roleSelect.selectOption(user.role);
    }
    if (user.status) {
      await this.statusSelect.selectOption(user.status);
    }
    if (user.password) {
      await this.passwordInput.fill(user.password);
    }
    if (user.confirmPassword) {
      await this.confirmPasswordInput.fill(user.confirmPassword);
    }
  }

  /**
   * Submit user form
   */
  async submitUserForm() {
    await this.saveUserButton.click();
  }

  /**
   * Cancel user form
   */
  async cancelUserForm() {
    await this.cancelButton.click();
  }

  /**
   * Get user count from table
   */
  async getUserCount(): Promise<number> {
    return await this.userRows.count();
  }

  /**
   * Click on a user row by email
   */
  async clickUserByEmail(email: string) {
    const userRow = this.page.locator(`tr:has-text("${email}")`);
    await userRow.click();
  }

  /**
   * Select user by index
   */
  async selectUserByIndex(index: number) {
    await this.userCheckboxes.nth(index).check();
  }

  /**
   * Select all users
   */
  async selectAllUsers() {
    await this.selectAllCheckbox.check();
  }

  /**
   * Get action buttons for a user row
   */
  getUserRowActions(email: string) {
    return this.page.locator(`tr:has-text("${email}")`);
  }

  /**
   * Edit user
   */
  async editUser(email: string) {
    const row = this.getUserRowActions(email);
    await row.locator(this.editUserButton).click();
    await this.userModal.waitFor({ state: "visible" });
  }

  /**
   * Suspend user
   */
  async suspendUser(email: string) {
    const row = this.getUserRowActions(email);
    await row.locator(this.suspendUserButton).click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Activate user
   */
  async activateUser(email: string) {
    const row = this.getUserRowActions(email);
    await row.locator(this.activateUserButton).click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Delete user
   */
  async deleteUser(email: string) {
    const row = this.getUserRowActions(email);
    await row.locator(this.deleteUserButton).click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Reset user password
   */
  async resetUserPassword(email: string) {
    const row = this.getUserRowActions(email);
    await row.locator(this.resetPasswordButton).click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Bulk suspend selected users
   */
  async bulkSuspendUsers() {
    await this.bulkSuspendButton.click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Bulk activate selected users
   */
  async bulkActivateUsers() {
    await this.bulkActivateButton.click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Bulk delete selected users
   */
  async bulkDeleteUsers() {
    await this.bulkDeleteButton.click();
    await this.confirmDialog.waitFor({ state: "visible" });
    await this.confirmButton.click();
    await this.page.waitForLoadState("networkidle");
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
   * Export users
   */
  async exportUsers() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.exportButton.click();
    return await downloadPromise;
  }

  /**
   * Assert users page is displayed
   */
  async assertUsersPageDisplayed() {
    await expect(this.addUserButton).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  /**
   * Assert user modal is visible
   */
  async assertUserModalVisible() {
    await expect(this.userModal).toBeVisible();
  }

  /**
   * Assert user is in list
   */
  async assertUserInList(email: string) {
    const userRow = this.page.locator(`tr:has-text("${email}")`);
    await expect(userRow).toBeVisible();
  }

  /**
   * Assert user is not in list
   */
  async assertUserNotInList(email: string) {
    const userRow = this.page.locator(`tr:has-text("${email}")`);
    await expect(userRow).not.toBeVisible();
  }

  /**
   * Assert no results message is displayed
   */
  async assertNoResultsDisplayed() {
    await expect(this.noResultsMessage).toBeVisible();
  }

  /**
   * Wait for users to load
   */
  async waitForUsersLoad() {
    await this.page.waitForLoadState("networkidle");
    if (await this.loadingIndicator.isVisible()) {
      await this.loadingIndicator.waitFor({ state: "hidden" });
    }
  }

  /**
   * Get user status from table
   */
  async getUserStatus(email: string): Promise<string | null> {
    const row = this.page.locator(`tr:has-text("${email}")`);
    const status = await row
      .locator('[data-testid="status"], .status, td:nth-child(5)')
      .textContent();
    return status?.toLowerCase() || null;
  }
}
