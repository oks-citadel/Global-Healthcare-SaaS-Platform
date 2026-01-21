import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test setup for API tests

// Environment variables for testing
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Test database URL (use separate test database)
if (!process.env.TEST_DATABASE_URL) {
  process.env.TEST_DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/unified_health_test';
}

// Test API URL
if (!process.env.TEST_API_URL) {
  process.env.TEST_API_URL = 'http://localhost:3001/api/v1';
}

// JWT secrets for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-jwt-refresh-secret-key-for-testing-only';

// Global test state
let testServerStarted = false;

beforeAll(async () => {
  console.log('[Test Setup] Initializing API test environment...');

  // Wait for services to be ready (if running in CI)
  if (process.env.CI) {
    await waitForService(process.env.TEST_API_URL || 'http://localhost:3001', 30000);
  }

  testServerStarted = true;
  console.log('[Test Setup] API test environment ready');
});

afterAll(async () => {
  console.log('[Test Teardown] Cleaning up API test environment...');
  testServerStarted = false;
});

beforeEach(async () => {
  // Reset any test-specific state before each test
});

afterEach(async () => {
  // Clean up any resources after each test
});

// Utility function to wait for a service to be available
async function waitForService(url: string, timeoutMs: number): Promise<void> {
  const startTime = Date.now();
  const healthUrl = url.replace('/api/v1', '/health');

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        console.log(`[Test Setup] Service at ${url} is ready`);
        return;
      }
    } catch {
      // Service not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(`Service at ${url} did not become available within ${timeoutMs}ms`);
}

// Export test utilities
export { waitForService };
