/**
 * Global Setup for Playwright Tests
 * Runs once before all test files
 */

import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_DIR = path.join(__dirname, 'fixtures', '.auth');

// Test users
const testUsers = {
  patient: {
    email: process.env.TEST_PATIENT_EMAIL || 'patient@test.unified.health',
    password: process.env.TEST_PATIENT_PASSWORD || 'TestPassword123!',
    file: 'patient.json',
  },
  provider: {
    email: process.env.TEST_PROVIDER_EMAIL || 'provider@test.unified.health',
    password: process.env.TEST_PROVIDER_PASSWORD || 'TestPassword123!',
    file: 'provider.json',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@test.unified.health',
    password: process.env.TEST_ADMIN_PASSWORD || 'TestPassword123!',
    file: 'admin.json',
  },
};

async function globalSetup(config: FullConfig) {
  console.log('[Global Setup] Starting...');

  // Ensure auth directory exists
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  // Authenticate each user role and save storage state
  for (const [role, user] of Object.entries(testUsers)) {
    const authFile = path.join(AUTH_DIR, user.file);

    // Skip if auth file exists and is recent (less than 1 hour old)
    if (fs.existsSync(authFile)) {
      const stats = fs.statSync(authFile);
      const ageMs = Date.now() - stats.mtimeMs;
      if (ageMs < 60 * 60 * 1000) {
        console.log(`[Global Setup] Using cached auth for ${role}`);
        continue;
      }
    }

    console.log(`[Global Setup] Authenticating ${role}...`);

    try {
      const context = await browser.newContext();
      const page = await context.newPage();

      // Navigate to login page
      const baseUrl = process.env.WEB_URL || 'http://localhost:3000';
      await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle', timeout: 30000 });

      // Fill login form
      await page.fill('input[name="email"], input[type="email"]', user.email);
      await page.fill('input[name="password"], input[type="password"]', user.password);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for navigation to dashboard or authenticated page
      await page.waitForURL(/\/(dashboard|home|appointments)/, { timeout: 30000 }).catch(() => {
        // May redirect to different pages based on role
      });

      // Wait for auth to complete (cookie to be set)
      await page.waitForTimeout(2000);

      // Save storage state
      await context.storageState({ path: authFile });

      console.log(`[Global Setup] Auth saved for ${role}`);

      await context.close();
    } catch (error) {
      console.warn(`[Global Setup] Failed to authenticate ${role}:`, error);
      // Create empty auth file to prevent test failures
      fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }));
    }
  }

  await browser.close();

  console.log('[Global Setup] Complete');
}

export default globalSetup;
