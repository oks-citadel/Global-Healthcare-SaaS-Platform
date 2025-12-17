import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup
 *
 * Runs once before all tests. Use this for one-time setup tasks like:
 * - Starting services
 * - Seeding database
 * - Setting up authentication
 */
async function globalSetup(config: FullConfig) {
  console.log('Starting global setup...');

  // You can add any global setup tasks here
  // For example:
  // - Start mock servers
  // - Seed test database
  // - Set up test environment variables

  // Example: Check if the app is running
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log(`Checking if app is available at ${baseURL}...`);

    await page.goto(baseURL, { timeout: 30000 });

    console.log('App is available!');

    await browser.close();
  } catch (error) {
    console.error(`Failed to connect to ${baseURL}`);
    console.error('Make sure the application is running before running E2E tests.');
    console.error('Run: pnpm dev');
    throw error;
  }

  console.log('Global setup completed!');
}

export default globalSetup;
