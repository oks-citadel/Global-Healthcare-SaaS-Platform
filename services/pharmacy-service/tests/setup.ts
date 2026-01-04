// Test setup file for Pharmacy Service
import { beforeEach, afterAll, vi } from 'vitest';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3005';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.PDMP_API_URL = 'http://localhost:3099/pdmp';
process.env.PDMP_API_KEY = 'test-pdmp-api-key';

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
