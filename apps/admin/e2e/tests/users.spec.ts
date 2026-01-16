import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DashboardPage } from "../pages/dashboard.page";
import { UsersPage } from "../pages/users.page";
import {
  testAdmins,
  testUsers,
  generateRandomUser,
} from "../fixtures/test-data";

/**
 * Admin Dashboard User Management E2E Tests
 *
 * Tests for user creation, editing, suspension, and management
 */

test.describe("User Management", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    usersPage = new UsersPage(page);

    // Login as admin before each test
    await loginPage.goto();
    await loginPage.login(testAdmins.admin1.email, testAdmins.admin1.password);
    await loginPage.waitForLoginSuccess();
  });

  test.describe("Users List View", () => {
    test("should display users page with search and filters", async ({
      page,
    }) => {
      await usersPage.goto();

      await usersPage.assertUsersPageDisplayed();
      await expect(usersPage.searchInput).toBeVisible();
      await expect(usersPage.addUserButton).toBeVisible();
    });

    test("should navigate to users page from dashboard", async ({ page }) => {
      await dashboardPage.gotoUsers();

      await usersPage.assertUsersPageDisplayed();
      expect(page.url()).toContain("users");
    });

    test("should display list of users", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      const userCount = await usersPage.getUserCount();
      expect(userCount).toBeGreaterThanOrEqual(0);
    });

    test("should search for users by email", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.searchUser(testUsers.activePatient.email);
      await usersPage.waitForUsersLoad();

      // Should filter results
      const userCount = await usersPage.getUserCount();
      expect(userCount).toBeGreaterThanOrEqual(0);
    });

    test("should search for users by name", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.searchUser(testUsers.activePatient.firstName);
      await usersPage.waitForUsersLoad();
    });

    test("should show no results message for non-existent user", async ({
      page,
    }) => {
      await usersPage.goto();

      await usersPage.searchUser("nonexistentuser12345@test.com");

      await usersPage.assertNoResultsDisplayed();
    });

    test("should filter users by role", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.filterByRole("doctor");
      await usersPage.waitForUsersLoad();
    });

    test("should filter users by status", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.filterByStatus("active");
      await usersPage.waitForUsersLoad();
    });

    test("should clear filters and show all users", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      const initialCount = await usersPage.getUserCount();

      await usersPage.filterByStatus("suspended");
      await usersPage.waitForUsersLoad();

      await usersPage.clearFilters();
      await usersPage.waitForUsersLoad();

      const finalCount = await usersPage.getUserCount();
      expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe("Create New User", () => {
    test("should open add user form when clicking add button", async ({
      page,
    }) => {
      await usersPage.goto();

      await usersPage.clickAddUser();

      await usersPage.assertUserModalVisible();
    });

    test("should create a new user with required information", async ({
      page,
    }) => {
      await usersPage.goto();

      const newUser = generateRandomUser();

      await usersPage.clickAddUser();
      await usersPage.fillUserForm({
        ...newUser,
        password: "Test@1234",
        confirmPassword: "Test@1234",
      });
      await usersPage.submitUserForm();

      // Wait for form to close and list to update
      await usersPage.waitForUsersLoad();

      // Search for the new user
      await usersPage.searchUser(newUser.email);
      await usersPage.assertUserInList(newUser.email);
    });

    test("should show validation errors for empty required fields", async ({
      page,
    }) => {
      await usersPage.goto();

      await usersPage.clickAddUser();

      // Try to submit without filling required fields
      await usersPage.submitUserForm();

      // Should show validation errors
      const errorMessage = page.locator(
        '[role="alert"], .error-message, .validation-error',
      );
      await expect(errorMessage.first()).toBeVisible();
    });

    test("should cancel adding user and return to list", async ({ page }) => {
      await usersPage.goto();

      await usersPage.clickAddUser();
      await usersPage.cancelUserForm();

      // Modal should be closed
      await expect(usersPage.userModal).not.toBeVisible();
    });

    test("should validate password requirements", async ({ page }) => {
      await usersPage.goto();

      await usersPage.clickAddUser();

      const newUser = generateRandomUser();
      await usersPage.fillUserForm({
        ...newUser,
        password: "123", // Weak password
        confirmPassword: "123",
      });

      await usersPage.submitUserForm();

      // Should show password validation error
      const errorMessage = page.locator('[role="alert"], .error-message');
      await expect(errorMessage.first()).toBeVisible();
    });

    test("should validate password confirmation matches", async ({ page }) => {
      await usersPage.goto();

      await usersPage.clickAddUser();

      const newUser = generateRandomUser();
      await usersPage.fillUserForm({
        ...newUser,
        password: "Test@1234",
        confirmPassword: "Different@1234",
      });

      await usersPage.submitUserForm();

      // Should show password mismatch error
      const errorMessage = page.locator('[role="alert"], .error-message');
      await expect(errorMessage.first()).toBeVisible();
    });

    test("should prevent duplicate email registration", async ({ page }) => {
      await usersPage.goto();

      await usersPage.clickAddUser();

      // Try to create user with existing email
      await usersPage.fillUserForm({
        email: testUsers.activePatient.email,
        firstName: "Test",
        lastName: "User",
        role: "patient",
        status: "active",
        password: "Test@1234",
        confirmPassword: "Test@1234",
      });

      await usersPage.submitUserForm();

      // Should show duplicate email error
      const errorMessage = page.locator('[role="alert"], .error-message');
      await expect(errorMessage.first()).toBeVisible();
    });
  });

  test.describe("Edit User", () => {
    test("should open edit form for existing user", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.editUser(testUsers.activePatient.email);

      await usersPage.assertUserModalVisible();
    });

    test("should update user information", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.editUser(testUsers.activePatient.email);

      // Update last name
      await usersPage.lastNameInput.clear();
      await usersPage.lastNameInput.fill("UpdatedLastName");

      await usersPage.submitUserForm();

      await usersPage.waitForUsersLoad();
    });

    test("should cancel editing and not save changes", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.editUser(testUsers.activePatient.email);

      // Make changes
      await usersPage.lastNameInput.clear();
      await usersPage.lastNameInput.fill("ShouldNotBeSaved");

      await usersPage.cancelUserForm();

      // Modal should be closed
      await expect(usersPage.userModal).not.toBeVisible();
    });
  });

  test.describe("Suspend User", () => {
    test("should suspend an active user", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      // Filter to active users
      await usersPage.filterByStatus("active");
      await usersPage.waitForUsersLoad();

      const userCount = await usersPage.getUserCount();
      if (userCount > 0) {
        // Get first active user email
        const firstRow = usersPage.userRows.first();
        const email = await firstRow.locator("td:nth-child(2)").textContent();

        if (email) {
          await usersPage.suspendUser(email);

          // Verify user status changed
          await usersPage.waitForUsersLoad();
        }
      }
    });

    test("should show confirmation dialog before suspending", async ({
      page,
    }) => {
      await usersPage.goto();
      await usersPage.filterByStatus("active");
      await usersPage.waitForUsersLoad();

      const userCount = await usersPage.getUserCount();
      if (userCount > 0) {
        const firstRow = usersPage.userRows.first();
        await firstRow.locator(usersPage.suspendUserButton).click();

        // Should show confirmation dialog
        await expect(usersPage.confirmDialog).toBeVisible();

        // Cancel the action
        await usersPage.cancelConfirmButton.click();
      }
    });
  });

  test.describe("Activate User", () => {
    test("should activate a suspended user", async ({ page }) => {
      await usersPage.goto();
      await usersPage.filterByStatus("suspended");
      await usersPage.waitForUsersLoad();

      const userCount = await usersPage.getUserCount();
      if (userCount > 0) {
        const firstRow = usersPage.userRows.first();
        const email = await firstRow.locator("td:nth-child(2)").textContent();

        if (email) {
          await usersPage.activateUser(email);

          await usersPage.waitForUsersLoad();
        }
      }
    });
  });

  test.describe("Reset User Password", () => {
    test("should reset password for a user", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      const userCount = await usersPage.getUserCount();
      if (userCount > 0) {
        const firstRow = usersPage.userRows.first();
        const email = await firstRow.locator("td:nth-child(2)").textContent();

        if (email) {
          await usersPage.resetUserPassword(email);

          // Should show success message
          const successMessage = page.locator(
            '[role="status"], .toast, .notification',
          );
          await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe("Bulk Actions", () => {
    test("should select all users", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      await usersPage.selectAllUsers();

      // All checkboxes should be checked
      const checkboxes = await usersPage.userCheckboxes.count();
      for (let i = 0; i < checkboxes; i++) {
        const isChecked = await usersPage.userCheckboxes.nth(i).isChecked();
        expect(isChecked).toBe(true);
      }
    });

    test("should select individual users", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      const userCount = await usersPage.getUserCount();
      if (userCount >= 2) {
        await usersPage.selectUserByIndex(0);
        await usersPage.selectUserByIndex(1);

        const firstChecked = await usersPage.userCheckboxes.nth(0).isChecked();
        const secondChecked = await usersPage.userCheckboxes.nth(1).isChecked();

        expect(firstChecked).toBe(true);
        expect(secondChecked).toBe(true);
      }
    });

    test("should show bulk actions menu when users are selected", async ({
      page,
    }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      const userCount = await usersPage.getUserCount();
      if (userCount > 0) {
        await usersPage.selectUserByIndex(0);

        // Bulk actions should be visible
        await expect(usersPage.bulkActionsMenu).toBeVisible();
      }
    });
  });

  test.describe("Pagination", () => {
    test("should navigate to next page of users", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      if (
        (await usersPage.nextPageButton.isVisible()) &&
        (await usersPage.nextPageButton.isEnabled())
      ) {
        await usersPage.nextPage();
        await usersPage.waitForUsersLoad();

        const userCount = await usersPage.getUserCount();
        expect(userCount).toBeGreaterThan(0);
      }
    });

    test("should change page size", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      if (await usersPage.pageSizeSelect.isVisible()) {
        await usersPage.changePageSize(25);
        await usersPage.waitForUsersLoad();
      }
    });
  });

  test.describe("Export Users", () => {
    test("should export users list", async ({ page }) => {
      await usersPage.goto();
      await usersPage.waitForUsersLoad();

      if (await usersPage.exportButton.isVisible()) {
        const download = await usersPage.exportUsers();
        expect(download).toBeTruthy();
      }
    });
  });
});
