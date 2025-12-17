// Test setup file for Vitest
import { beforeEach, afterAll, vi } from 'vitest';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.ENCRYPTION_KEY = 'test-32-byte-encryption-key-here';

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
