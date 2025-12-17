import { FullConfig } from '@playwright/test';

/**
 * Global Teardown
 *
 * Runs once after all tests. Use this for cleanup tasks like:
 * - Stopping services
 * - Cleaning up test data
 * - Generating reports
 */
async function globalTeardown(config: FullConfig) {
  console.log('Starting global teardown...');

  // You can add any global cleanup tasks here
  // For example:
  // - Stop mock servers
  // - Clean up test database
  // - Generate custom reports
  // - Upload test artifacts

  console.log('Global teardown completed!');
}

export default globalTeardown;
