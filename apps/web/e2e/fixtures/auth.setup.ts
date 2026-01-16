import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { testUsers } from './test-data';
import path from 'path';

/**
 * Authentication Setup
 *
 * This file contains setup scripts for authentication that can be run
 * before tests to establish logged-in states and avoid repeated login.
 */

const authFile = path.join(__dirname, '../.auth/user.json');

/**
 * Setup authenticated state for patient user
 */
setup('authenticate as patient', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Perform login
  await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);

  // Wait for successful login
  await loginPage.waitForLoginSuccess();

  // Verify user is logged in
  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);

  // Save authenticated state
  await page.context().storageState({ path: authFile });
});

/**
 * Setup authenticated state for doctor user
 */
setup('authenticate as doctor', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(testUsers.doctor1.email, testUsers.doctor1.password);
  await loginPage.waitForLoginSuccess();

  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);

  // Save to different file for doctor
  await page.context().storageState({ path: path.join(__dirname, '../.auth/doctor.json') });
});

/**
 * Setup authenticated state for admin user
 */
setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(testUsers.admin1.email, testUsers.admin1.password);
  await loginPage.waitForLoginSuccess();

  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);

  // Save to different file for admin
  await page.context().storageState({ path: path.join(__dirname, '../.auth/admin.json') });
});
