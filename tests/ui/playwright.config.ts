import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Unified Playwright Configuration for All UI Tests
 * Covers web, admin, provider-portal, and kiosk apps
 */

// Load environment variables
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './specs',
  fullyParallel: !CI,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../reports/ui/html' }],
    ['json', { outputFile: '../reports/ui/results.json' }],
    ['junit', { outputFile: '../reports/ui/junit.xml' }],
    ['list'],
    // Allure reporter (requires allure-playwright package)
    ['allure-playwright', { outputFolder: '../reports/ui/allure-results' }],
  ],
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: CI ? 'on-first-retry' : 'off',
    headless: CI,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Web App (Patient Portal) Tests
    {
      name: 'web-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.WEB_URL || 'http://localhost:3000',
        storageState: './fixtures/.auth/patient.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/(web|smoke)\/.*\.spec\.ts/,
    },

    // Admin Dashboard Tests
    {
      name: 'admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.ADMIN_URL || 'http://localhost:3001',
        storageState: './fixtures/.auth/admin.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/admin\/.*\.spec\.ts/,
    },

    // Provider Portal Tests
    {
      name: 'provider-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PROVIDER_URL || 'http://localhost:3002',
        storageState: './fixtures/.auth/provider.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/provider\/.*\.spec\.ts/,
    },

    // Kiosk App Tests
    {
      name: 'kiosk-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.KIOSK_URL || 'http://localhost:3003',
        viewport: { width: 1080, height: 1920 }, // Portrait mode for kiosk
      },
      testMatch: /.*\/kiosk\/.*\.spec\.ts/,
    },

    // Cross-browser testing (Firefox)
    {
      name: 'web-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.WEB_URL || 'http://localhost:3000',
        storageState: './fixtures/.auth/patient.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/smoke\/.*\.spec\.ts/,
    },

    // Cross-browser testing (Safari/WebKit)
    {
      name: 'web-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: process.env.WEB_URL || 'http://localhost:3000',
        storageState: './fixtures/.auth/patient.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/smoke\/.*\.spec\.ts/,
    },

    // Mobile viewport testing
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        baseURL: process.env.WEB_URL || 'http://localhost:3000',
        storageState: './fixtures/.auth/patient.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/smoke\/.*\.spec\.ts/,
    },

    // Accessibility testing project
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.WEB_URL || 'http://localhost:3000',
        storageState: './fixtures/.auth/patient.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/accessibility\/.*\.spec\.ts/,
    },

    // Visual regression testing project
    {
      name: 'visual',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.WEB_URL || 'http://localhost:3000',
        storageState: './fixtures/.auth/patient.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\/visual\/.*\.spec\.ts/,
    },
  ],

  // Global setup/teardown
  globalSetup: path.join(__dirname, 'global-setup.ts'),
  globalTeardown: path.join(__dirname, 'global-teardown.ts'),

  // Output directory for test artifacts
  outputDir: '../reports/ui/test-results',

  // Web server configuration (start dev servers if needed)
  webServer: CI ? undefined : [
    {
      command: 'pnpm --filter @unified-health/web dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
});
