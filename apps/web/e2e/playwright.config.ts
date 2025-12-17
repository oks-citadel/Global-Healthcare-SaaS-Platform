import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  // Global setup and teardown
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  // Maximum time one test can run for
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     */
    timeout: 5000,
  },
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Maximum time for page.goto
    navigationTimeout: 15 * 1000,

    // Action timeout
    actionTimeout: 10 * 1000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use prepared auth state
        storageState: process.env.STORAGE_STATE,
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: process.env.STORAGE_STATE,
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: process.env.STORAGE_STATE,
      },
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: process.env.STORAGE_STATE,
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        storageState: process.env.STORAGE_STATE,
      },
    },

    // Test against branded browsers
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        storageState: process.env.STORAGE_STATE,
      },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        storageState: process.env.STORAGE_STATE,
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // Output folder for test artifacts
  outputDir: 'test-results/artifacts',
});
