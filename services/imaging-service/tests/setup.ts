// Test setup file for Imaging Service
import { beforeEach, afterAll, vi } from 'vitest';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3007';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.DICOM_STORAGE_PATH = '/tmp/test-dicom';
process.env.PACS_SERVER_URL = 'http://localhost:8042';

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
