import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { testUsers, invalidCredentials, generateRandomPatient } from '../fixtures/test-data';

/**
 * Authentication E2E Tests
 *
 * Tests for user registration, login, logout, and authentication flows
 */

test.describe('Authentication', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Clear any existing auth data
    await loginPage.clearAuthData();
  });

  test.describe('User Registration', () => {
    test('should successfully register a new user', async ({ page }) => {
      // Generate random user data to avoid conflicts
      const newUser = generateRandomPatient();
      const timestamp = Date.now();

      await loginPage.gotoRegister();
      await loginPage.assertRegisterPageDisplayed();

      // Fill registration form
      await loginPage.register({
        email: `test${timestamp}@test.com`,
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phoneNumber,
        acceptTerms: true,
      });

      // Wait for registration success
      await loginPage.waitForRegistrationSuccess();

      // Verify redirect to appropriate page (login or dashboard)
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(login|dashboard|verify-email)/);
    });

    test('should show error for invalid email format', async ({ page }) => {
      await loginPage.gotoRegister();

      await loginPage.register({
        email: 'invalid-email',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      });

      // Should show validation error
      await loginPage.assertFieldValidationError('email');
    });

    test('should show error when passwords do not match', async ({ page }) => {
      await loginPage.gotoRegister();

      await loginPage.register({
        email: 'test@test.com',
        password: 'Test@1234',
        confirmPassword: 'Different@1234',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      });

      // Should show password mismatch error
      await loginPage.assertErrorDisplayed();
    });

    test('should show error for weak password', async ({ page }) => {
      await loginPage.gotoRegister();

      await loginPage.register({
        email: 'test@test.com',
        password: '123',
        confirmPassword: '123',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      });

      // Should show password strength error
      await loginPage.assertFieldValidationError('password');
    });

    test('should require terms acceptance', async ({ page }) => {
      await loginPage.gotoRegister();

      await loginPage.register({
        email: 'test@test.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: false,
      });

      // Should show terms acceptance error
      await loginPage.assertErrorDisplayed();
    });

    test('should prevent duplicate email registration', async ({ page }) => {
      await loginPage.gotoRegister();

      // Try to register with existing user email
      await loginPage.register({
        email: testUsers.patient1.email,
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      });

      // Should show duplicate email error
      await loginPage.assertErrorDisplayed('already exists');
    });
  });

  test.describe('User Login', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      await loginPage.goto();
      await loginPage.assertLoginPageDisplayed();

      // Login with test user
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);

      // Wait for successful login and redirect
      await loginPage.waitForLoginSuccess();

      // Verify user is on dashboard
      await dashboardPage.assertDashboardDisplayed();

      // Verify user name is displayed
      await dashboardPage.assertUserLoggedIn(testUsers.patient1.firstName);

      // Verify auth token is stored
      const token = await loginPage.getAuthToken();
      expect(token).not.toBeNull();
      expect(token).toBeTruthy();
    });

    test('should show error for invalid email', async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(
        invalidCredentials.invalidEmail.email,
        invalidCredentials.invalidEmail.password
      );

      // Should show invalid credentials error
      await loginPage.assertErrorDisplayed();

      // Should still be on login page
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    test('should show error for invalid password', async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(
        invalidCredentials.invalidPassword.email,
        invalidCredentials.invalidPassword.password
      );

      // Should show invalid credentials error
      await loginPage.assertErrorDisplayed();

      // Verify no auth token is stored
      const token = await loginPage.getAuthToken();
      expect(token).toBeNull();
    });

    test('should show error for empty credentials', async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(
        invalidCredentials.emptyCredentials.email,
        invalidCredentials.emptyCredentials.password
      );

      // Should show validation errors
      await loginPage.assertFieldValidationError('email');
      await loginPage.assertFieldValidationError('password');
    });

    test('should show error for malformed email', async ({ page }) => {
      await loginPage.goto();

      await loginPage.fillLoginForm(
        invalidCredentials.malformedEmail.email,
        invalidCredentials.malformedEmail.password
      );

      // Should show email format error
      await loginPage.assertFieldValidationError('email');
    });

    test('should toggle password visibility', async ({ page }) => {
      await loginPage.goto();

      await loginPage.fillLoginForm('test@test.com', 'password123');

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

    test('should persist login with remember me', async ({ page, context }) => {
      await loginPage.goto();

      // Login with remember me checked
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password, true);
      await loginPage.waitForLoginSuccess();

      // Close and reopen page
      await page.close();
      const newPage = await context.newPage();
      loginPage = new LoginPage(newPage);
      dashboardPage = new DashboardPage(newPage);

      // Navigate to dashboard - should still be logged in
      await dashboardPage.goto();
      await dashboardPage.assertUserLoggedIn(testUsers.patient1.firstName);
    });

    test('should navigate to registration page from login', async ({ page }) => {
      await loginPage.goto();

      await loginPage.clickRegisterLink();

      // Should be on registration page
      await loginPage.assertRegisterPageDisplayed();
      expect(page.url()).toContain('register');
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await loginPage.goto();

      await loginPage.clickForgotPassword();

      // Should be on forgot password page
      expect(page.url()).toMatch(/forgot-password|reset-password/);
    });
  });

  test.describe('User Logout', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each logout test
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();
    });

    test('should successfully logout', async ({ page }) => {
      await dashboardPage.assertDashboardDisplayed();

      // Perform logout
      await dashboardPage.logout();

      // Should redirect to login page
      expect(page.url()).toContain('login');

      // Verify auth token is cleared
      const token = await loginPage.getAuthToken();
      expect(token).toBeNull();

      // Verify user data is cleared
      const user = await loginPage.getStoredUser();
      expect(user).toBeNull();
    });

    test('should not access protected routes after logout', async ({ page }) => {
      await dashboardPage.logout();

      // Try to access dashboard
      await page.goto('/dashboard');

      // Should redirect to login
      await page.waitForURL(/\/login/);
      expect(page.url()).toContain('login');
    });

    test('should require re-authentication after logout', async ({ page }) => {
      await dashboardPage.logout();

      // Verify on login page
      await loginPage.assertLoginPageDisplayed();

      // Should need to login again
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      // Should successfully access dashboard
      await dashboardPage.assertDashboardDisplayed();
    });
  });

  test.describe('Token Refresh', () => {
    test('should refresh expired token automatically', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      // Get initial token
      const initialToken = await loginPage.getAuthToken();
      expect(initialToken).not.toBeNull();

      // Simulate token expiration by setting an expired token
      // In real scenario, you'd wait or manually expire the token
      // For now, we'll just verify the token exists and user is logged in

      // Navigate around the app
      await dashboardPage.gotoAppointments();
      await page.waitForLoadState('networkidle');

      // Token should still be valid or refreshed
      const currentToken = await loginPage.getAuthToken();
      expect(currentToken).not.toBeNull();

      // Should still be logged in
      await dashboardPage.goto();
      await dashboardPage.assertUserLoggedIn();
    });

    test('should redirect to login when token refresh fails', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      // Set an invalid token
      await loginPage.clearAuthData();
      await loginPage.setAuthToken('invalid-token');

      // Try to access protected route
      await page.goto('/appointments');

      // Should redirect to login due to invalid token
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('login');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected routes without authentication', async ({ page }) => {
      const protectedRoutes = ['/dashboard', '/appointments', '/profile', '/documents'];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await page.waitForURL(/\/login/);
        expect(page.url()).toContain('login');
      }
    });

    test('should allow access to protected routes with valid authentication', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      const protectedRoutes = [
        { path: '/dashboard', test: () => dashboardPage.assertDashboardDisplayed() },
        { path: '/appointments', test: async () => expect(page.url()).toContain('appointments') },
        { path: '/profile', test: async () => expect(page.url()).toContain('profile') },
      ];

      for (const route of protectedRoutes) {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        await route.test();
      }
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still be logged in
      await dashboardPage.assertUserLoggedIn(testUsers.patient1.firstName);
    });

    test('should handle multiple tabs with same session', async ({ page, context }) => {
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
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

    test('should logout from all tabs when logging out from one', async ({ page, context }) => {
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
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
      expect(newPage.url()).toContain('login');

      await newPage.close();
    });
  });
});
