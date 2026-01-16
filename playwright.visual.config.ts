import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Visual Regression Testing Configuration for Playwright
 *
 * This configuration sets up visual regression testing with screenshot comparison,
 * threshold settings, and viewport definitions for comprehensive UI testing.
 */

// Base URL for the application under test
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

// Directory for storing visual snapshots
const snapshotDir = path.join(__dirname, 'tests/visual/snapshots');

// Directory for storing test results and diff images
const outputDir = path.join(__dirname, 'test-results/visual');

export default defineConfig({
  // Test directory for visual tests
  testDir: './tests/visual',

  // Test file pattern
  testMatch: '**/*.spec.ts',

  // Maximum time one test can run
  timeout: 60000,

  // Expect timeout for assertions
  expect: {
    // Visual comparison settings
    toHaveScreenshot: {
      // Maximum allowed pixel difference ratio (0-1)
      // 0.01 = 1% difference allowed
      maxDiffPixelRatio: 0.01,

      // Maximum allowed different pixels count
      maxDiffPixels: 100,

      // Threshold for each pixel comparison (0-1)
      // Higher values are more lenient
      threshold: 0.2,

      // Animation handling - disable animations for consistent screenshots
      animations: 'disabled',

      // Caret behavior - hide caret for text inputs
      caret: 'hide',

      // Scale - use CSS pixels for consistent cross-device comparison
      scale: 'css',
    },
    toMatchSnapshot: {
      // Maximum allowed pixel difference ratio for snapshot comparisons
      maxDiffPixelRatio: 0.01,
    },
  },

  // Snapshot path configuration
  snapshotDir,
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI
  workers: process.env.CI ? 2 : undefined,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', {
      open: 'never',
      outputFolder: path.join(outputDir, 'html-report'),
    }],
    ['json', {
      outputFile: path.join(outputDir, 'results.json'),
    }],
  ],

  // Output directory for test artifacts
  outputDir,

  // Global setup and teardown
  globalSetup: process.env.VISUAL_GLOBAL_SETUP
    ? require.resolve('./tests/visual/global-setup.ts')
    : undefined,

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL,

    // Collect trace when retrying failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording on failure
    video: 'on-first-retry',

    // Viewport settings (can be overridden per project)
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors for local testing
    ignoreHTTPSErrors: true,

    // Set default timeout for actions
    actionTimeout: 15000,

    // Set default timeout for navigation
    navigationTimeout: 30000,
  },

  // Define projects for different viewports and browsers
  projects: [
    // Desktop Chrome - Primary browser
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },

    // Desktop Chrome - Standard viewport
    {
      name: 'desktop-chrome-standard',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },

    // Desktop Firefox
    {
      name: 'desktop-firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Desktop Safari (WebKit)
    {
      name: 'desktop-safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Tablet - iPad Pro
    {
      name: 'tablet-ipad-pro',
      use: {
        ...devices['iPad Pro'],
      },
    },

    // Tablet - iPad Mini (Portrait)
    {
      name: 'tablet-ipad-mini',
      use: {
        ...devices['iPad Mini'],
      },
    },

    // Tablet - iPad Mini (Landscape)
    {
      name: 'tablet-ipad-mini-landscape',
      use: {
        ...devices['iPad Mini landscape'],
      },
    },

    // Mobile - iPhone 14 Pro Max
    {
      name: 'mobile-iphone-14-pro-max',
      use: {
        ...devices['iPhone 14 Pro Max'],
      },
    },

    // Mobile - iPhone 13
    {
      name: 'mobile-iphone-13',
      use: {
        ...devices['iPhone 13'],
      },
    },

    // Mobile - iPhone SE
    {
      name: 'mobile-iphone-se',
      use: {
        ...devices['iPhone SE'],
      },
    },

    // Mobile - Pixel 7
    {
      name: 'mobile-pixel-7',
      use: {
        ...devices['Pixel 7'],
      },
    },

    // Mobile - Galaxy S23
    {
      name: 'mobile-galaxy-s23',
      use: {
        viewport: { width: 360, height: 780 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
      },
    },

    // High DPI Desktop (Retina)
    {
      name: 'desktop-hidpi',
      use: {
        ...devices['Desktop Chrome HiDPI'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Dark Mode Testing
    {
      name: 'desktop-chrome-dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        colorScheme: 'dark',
      },
    },

    // Light Mode Testing (explicit)
    {
      name: 'desktop-chrome-light',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        colorScheme: 'light',
      },
    },

    // Reduced Motion Testing
    {
      name: 'desktop-reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Reduced motion is handled via CSS, but we still want to test it
      },
    },

    // Print Layout Testing
    {
      name: 'print',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1240, height: 1754 }, // A4 at 150 DPI
      },
    },
  ],

  // Web server configuration for local testing
  webServer: process.env.CI ? undefined : {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

/**
 * Custom viewport configurations for specific use cases
 */
export const customViewports = {
  // Ultra-wide monitor
  ultrawide: { width: 2560, height: 1080 },

  // 4K Display
  '4k': { width: 3840, height: 2160 },

  // Small laptop
  smallLaptop: { width: 1366, height: 768 },

  // Standard laptop
  laptop: { width: 1440, height: 900 },

  // Large desktop
  largeDesktop: { width: 1920, height: 1200 },

  // Portrait tablet
  tabletPortrait: { width: 768, height: 1024 },

  // Landscape tablet
  tabletLandscape: { width: 1024, height: 768 },

  // Small mobile
  mobileSmall: { width: 320, height: 568 },

  // Standard mobile
  mobileStandard: { width: 375, height: 667 },

  // Large mobile
  mobileLarge: { width: 414, height: 896 },
};

/**
 * Screenshot comparison thresholds for different scenarios
 */
export const screenshotThresholds = {
  // Strict - for static content
  strict: {
    maxDiffPixelRatio: 0.001,
    maxDiffPixels: 10,
    threshold: 0.1,
  },

  // Standard - for most UI testing
  standard: {
    maxDiffPixelRatio: 0.01,
    maxDiffPixels: 100,
    threshold: 0.2,
  },

  // Lenient - for dynamic content
  lenient: {
    maxDiffPixelRatio: 0.05,
    maxDiffPixels: 500,
    threshold: 0.3,
  },

  // Very lenient - for animations or dynamic data
  veryLenient: {
    maxDiffPixelRatio: 0.1,
    maxDiffPixels: 1000,
    threshold: 0.5,
  },
};

/**
 * Common mask configurations for hiding dynamic content
 */
export const maskConfigurations = {
  // Hide timestamps and dates
  timestamps: [
    { selector: '[data-testid="timestamp"]' },
    { selector: '.timestamp' },
    { selector: 'time' },
  ],

  // Hide user-specific content
  userContent: [
    { selector: '[data-testid="user-avatar"]' },
    { selector: '[data-testid="user-name"]' },
    { selector: '.user-info' },
  ],

  // Hide dynamic counters and numbers
  counters: [
    { selector: '[data-testid="counter"]' },
    { selector: '.badge-count' },
    { selector: '.notification-count' },
  ],

  // Hide all dynamic content
  allDynamic: [
    { selector: '[data-testid="timestamp"]' },
    { selector: '[data-testid="user-avatar"]' },
    { selector: '[data-testid="counter"]' },
    { selector: '.dynamic-content' },
  ],
};
