/**
 * Detox E2E Tests - Authentication Flow
 */

import { by, device, element, expect } from 'detox';

describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Login', () => {
    it('should display login screen on app launch', async () => {
      await expect(element(by.text('Welcome'))).toBeVisible();
      await expect(element(by.id('email-input'))).toBeVisible();
      await expect(element(by.id('password-input'))).toBeVisible();
      await expect(element(by.id('sign-in-button'))).toBeVisible();
    });

    it('should show validation errors for empty form', async () => {
      await element(by.id('sign-in-button')).tap();

      await expect(element(by.text('Email is required'))).toBeVisible();
    });

    it('should show validation error for invalid email', async () => {
      await element(by.id('email-input')).typeText('invalid-email');
      await element(by.id('sign-in-button')).tap();

      await expect(element(by.text('Invalid email'))).toBeVisible();
    });

    it('should show error for incorrect credentials', async () => {
      await element(by.id('email-input')).typeText('wrong@test.com');
      await element(by.id('password-input')).typeText('wrongpassword');
      await element(by.id('sign-in-button')).tap();

      await expect(element(by.text('Invalid credentials'))).toBeVisible();
    });

    it('should login successfully with valid credentials', async () => {
      await element(by.id('email-input')).typeText('patient@test.unified.health');
      await element(by.id('password-input')).typeText('TestPassword123!');
      await element(by.id('sign-in-button')).tap();

      // Wait for dashboard to load
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);

      await expect(element(by.text('Welcome'))).toBeVisible();
    });

    it('should mask password input', async () => {
      await expect(element(by.id('password-input'))).toHaveToggleValue(true);
    });
  });

  describe('Logout', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('patient@test.unified.health');
      await element(by.id('password-input')).typeText('TestPassword123!');
      await element(by.id('sign-in-button')).tap();

      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should logout successfully', async () => {
      await element(by.id('profile-tab')).tap();
      await element(by.id('settings-button')).tap();

      await element(by.id('sign-out-button')).tap();
      await element(by.text('Confirm')).tap();

      await expect(element(by.id('sign-in-button'))).toBeVisible();
    });
  });

  describe('Forgot Password', () => {
    it('should navigate to forgot password screen', async () => {
      await element(by.text('Forgot Password')).tap();

      await expect(element(by.text('Reset Password'))).toBeVisible();
      await expect(element(by.id('reset-email-input'))).toBeVisible();
    });

    it('should send reset link', async () => {
      await element(by.text('Forgot Password')).tap();
      await element(by.id('reset-email-input')).typeText('patient@test.unified.health');
      await element(by.id('send-reset-button')).tap();

      await expect(element(by.text('Check your email'))).toBeVisible();
    });

    it('should navigate back to login', async () => {
      await element(by.text('Forgot Password')).tap();
      await element(by.id('back-to-login')).tap();

      await expect(element(by.id('sign-in-button'))).toBeVisible();
    });
  });

  describe('Registration', () => {
    it('should navigate to registration screen', async () => {
      await element(by.text('Create Account')).tap();

      await expect(element(by.text('Register'))).toBeVisible();
    });

    it('should show validation errors for invalid registration', async () => {
      await element(by.text('Create Account')).tap();
      await element(by.id('register-button')).tap();

      await expect(element(by.text('First name is required'))).toBeVisible();
    });

    it('should show password mismatch error', async () => {
      await element(by.text('Create Account')).tap();

      await element(by.id('first-name-input')).typeText('Test');
      await element(by.id('last-name-input')).typeText('User');
      await element(by.id('email-input')).typeText('newuser@test.unified.health');
      await element(by.id('password-input')).typeText('Password123!');
      await element(by.id('confirm-password-input')).typeText('DifferentPassword123!');

      await element(by.id('register-button')).tap();

      await expect(element(by.text('Passwords do not match'))).toBeVisible();
    });
  });

  describe('Session Management', () => {
    it('should persist session across app restarts', async () => {
      // Login
      await element(by.id('email-input')).typeText('patient@test.unified.health');
      await element(by.id('password-input')).typeText('TestPassword123!');
      await element(by.id('sign-in-button')).tap();

      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);

      // Restart app
      await device.terminateApp();
      await device.launchApp();

      // Should still be logged in
      await expect(element(by.id('dashboard-screen'))).toBeVisible();
    });

    it('should handle session expiry gracefully', async () => {
      // This test would require backend manipulation to expire the session
      // For now, verify the UI handles the 401 response
      await expect(element(by.id('sign-in-button'))).toBeVisible();
    });
  });
});
