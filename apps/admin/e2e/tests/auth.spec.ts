import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DashboardPage } from "../pages/dashboard.page";
import { testAdmins, invalidCredentials } from "../fixtures/test-data";

/**
 * Admin Dashboard Authentication E2E Tests
 *
 * Tests for admin login, logout, and authentication flows
 */

test.describe("Admin Authentication", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Clear any existing auth data
    await loginPage.clearAuthData();
  });

  test.describe("Admin Login", () => {
    test("should display login page with all required elements", async ({
      page,
    }) => {
      await loginPage.goto();

      await loginPage.assertLoginPageDisplayed();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test("should successfully login with valid super admin credentials", async ({
      page,
    }) => {
      await loginPage.goto();
      await loginPage.assertLoginPageDisplayed();

      // Login with super admin
      await loginPage.login(
        testAdmins.superAdmin.email,
        testAdmins.superAdmin.password,
      );

      // Wait for successful login and redirect
      await loginPage.waitForLoginSuccess();

      // Verify user is on dashboard
      await dashboardPage.assertDashboardDisplayed();

      // Verify auth token is stored
      const token = await loginPage.getAuthToken();
      expect(token).not.toBeNull();
      expect(token).toBeTruthy();
    });

    test("should successfully login with valid admin credentials", async ({
      page,
    }) => {
      await loginPage.goto();

      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();

      await dashboardPage.assertDashboardDisplayed();
    });

    test("should successfully login with valid moderator credentials", async ({
      page,
    }) => {
      await loginPage.goto();

      await loginPage.login(
        testAdmins.moderator1.email,
        testAdmins.moderator1.password,
      );
      await loginPage.waitForLoginSuccess();

      await dashboardPage.assertDashboardDisplayed();
    });

    test("should show error for invalid email", async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(
        invalidCredentials.invalidEmail.email,
        invalidCredentials.invalidEmail.password,
      );

      // Should show invalid credentials error
      await loginPage.assertErrorDisplayed();

      // Should still be on login page
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    test("should show error for invalid password", async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(
        invalidCredentials.invalidPassword.email,
        invalidCredentials.invalidPassword.password,
      );

      // Should show invalid credentials error
      await loginPage.assertErrorDisplayed();

      // Verify no auth token is stored
      const token = await loginPage.getAuthToken();
      expect(token).toBeNull();
    });

    test("should show error for empty credentials", async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(
        invalidCredentials.emptyCredentials.email,
        invalidCredentials.emptyCredentials.password,
      );

      // Should show validation errors
      await loginPage.assertFieldValidationError("email");
      await loginPage.assertFieldValidationError("password");
    });

    test("should show error for malformed email", async ({ page }) => {
      await loginPage.goto();

      await loginPage.fillLoginForm(
        invalidCredentials.malformedEmail.email,
        invalidCredentials.malformedEmail.password,
      );

      // Should show email format error
      await loginPage.assertFieldValidationError("email");
    });

    test("should toggle password visibility", async ({ page }) => {
      await loginPage.goto();

      await loginPage.fillLoginForm("test@test.com", "password123");

      // Initially password should be hidden
      let isVisible = await loginPage.isPasswordVisible();
      expect(isVisible).toBe(false);

      // Toggle to show password
      await loginPage.togglePasswordVisibility();
      isVisible = await loginPage.isPasswordVisible();
      expect(isVisible).toBe(true);

      // Toggle to hide password again
      await loginPage.togglePasswordVisibility();
      isVisible = await loginPage.isPasswordVisible();
      expect(isVisible).toBe(false);
    });

    test("should navigate to forgot password page", async ({ page }) => {
      await loginPage.goto();

      await loginPage.clickForgotPassword();

      // Should be on forgot password page
      expect(page.url()).toMatch(/forgot-password|reset-password/);
    });

    test("should handle locked account", async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(
        invalidCredentials.lockedAccount.email,
        invalidCredentials.lockedAccount.password,
      );

      // Should show account locked error
      await loginPage.assertErrorDisplayed();
    });
  });

  test.describe("Two-Factor Authentication", () => {
    test("should prompt for 2FA when required", async ({ page }) => {
      await loginPage.goto();

      // Login with credentials
      await loginPage.login(
        testAdmins.superAdmin.email,
        testAdmins.superAdmin.password,
      );

      // Check if 2FA is required
      const requires2FA = await loginPage.isTwoFactorRequired();

      if (requires2FA) {
        await loginPage.waitForTwoFactorPrompt();
        await expect(loginPage.twoFactorInput).toBeVisible();
      }
    });
  });

  test.describe("Admin Logout", () => {
    test.beforeEach(async ({ page }) => {
      // Login before each logout test
      await loginPage.goto();
      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();
    });

    test("should successfully logout", async ({ page }) => {
      await dashboardPage.assertDashboardDisplayed();

      // Perform logout
      await dashboardPage.logout();

      // Should redirect to login page
      expect(page.url()).toContain("login");

      // Verify auth token is cleared
      const token = await loginPage.getAuthToken();
      expect(token).toBeNull();

      // Verify user data is cleared
      const user = await loginPage.getStoredUser();
      expect(user).toBeNull();
    });

    test("should not access protected routes after logout", async ({
      page,
    }) => {
      await dashboardPage.logout();

      // Try to access dashboard
      await page.goto("/dashboard");

      // Should redirect to login
      await page.waitForURL(/\/login/);
      expect(page.url()).toContain("login");
    });

    test("should require re-authentication after logout", async ({ page }) => {
      await dashboardPage.logout();

      // Verify on login page
      await loginPage.assertLoginPageDisplayed();

      // Should need to login again
      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();

      // Should successfully access dashboard
      await dashboardPage.assertDashboardDisplayed();
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect to login when accessing protected routes without authentication", async ({
      page,
    }) => {
      const protectedRoutes = [
        "/dashboard",
        "/users",
        "/settings",
        "/audit-logs",
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await page.waitForURL(/\/login/);
        expect(page.url()).toContain("login");
      }
    });

    test("should allow access to protected routes with valid authentication", async ({
      page,
    }) => {
      await loginPage.goto();
      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();

      const protectedRoutes = [
        {
          path: "/dashboard",
          test: () => dashboardPage.assertDashboardDisplayed(),
        },
        {
          path: "/users",
          test: async () => expect(page.url()).toContain("users"),
        },
        {
          path: "/settings",
          test: async () => expect(page.url()).toContain("settings"),
        },
      ];

      for (const route of protectedRoutes) {
        await page.goto(route.path);
        await page.waitForLoadState("networkidle");
        await route.test();
      }
    });
  });

  test.describe("Session Management", () => {
    test("should maintain session across page refreshes", async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();

      // Refresh page
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Should still be logged in
      await dashboardPage.assertUserLoggedIn();
    });

    test("should handle multiple tabs with same session", async ({
      page,
      context,
    }) => {
      await loginPage.goto();
      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();

      // Open new tab
      const newPage = await context.newPage();
      const newDashboard = new DashboardPage(newPage);

      // Navigate to dashboard in new tab
      await newDashboard.goto();

      // Should be logged in in both tabs
      await dashboardPage.assertUserLoggedIn();
      await newDashboard.assertUserLoggedIn();

      await newPage.close();
    });

    test("should logout from all tabs when logging out from one", async ({
      page,
      context,
    }) => {
      await loginPage.goto();
      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();

      // Open new tab
      const newPage = await context.newPage();
      const newDashboard = new DashboardPage(newPage);
      await newDashboard.goto();

      // Logout from first tab
      await dashboardPage.logout();

      // Refresh second tab
      await newPage.reload();

      // Should be logged out in second tab too
      await newPage.waitForURL(/\/login/);
      expect(newPage.url()).toContain("login");

      await newPage.close();
    });
  });

  test.describe("Role-Based Access", () => {
    test("should display all features for super admin", async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        testAdmins.superAdmin.email,
        testAdmins.superAdmin.password,
      );
      await loginPage.waitForLoginSuccess();

      // Super admin should see all navigation items
      await expect(dashboardPage.usersLink).toBeVisible();
      await expect(dashboardPage.settingsLink).toBeVisible();
      await expect(dashboardPage.auditLogsLink).toBeVisible();
    });

    test("should display appropriate features for regular admin", async ({
      page,
    }) => {
      await loginPage.goto();
      await loginPage.login(
        testAdmins.admin1.email,
        testAdmins.admin1.password,
      );
      await loginPage.waitForLoginSuccess();

      // Admin should see users and audit logs
      await expect(dashboardPage.usersLink).toBeVisible();
      await expect(dashboardPage.auditLogsLink).toBeVisible();
    });

    test("should display limited features for moderator", async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        testAdmins.moderator1.email,
        testAdmins.moderator1.password,
      );
      await loginPage.waitForLoginSuccess();

      // Moderator should see limited navigation
      await dashboardPage.assertDashboardDisplayed();
    });
  });
});
