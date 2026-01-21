/**
 * Global Teardown for Playwright Tests
 * Runs once after all test files
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('[Global Teardown] Starting cleanup...');

  // Add any global cleanup logic here
  // For example:
  // - Clean up test data created during tests
  // - Close any open connections
  // - Generate final reports

  console.log('[Global Teardown] Complete');
}

export default globalTeardown;
