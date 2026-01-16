import { afterEach, vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.API_SERVICE_URL = 'http://localhost:3001';
process.env.TELEHEALTH_SERVICE_URL = 'http://localhost:3002';
process.env.CHRONIC_CARE_SERVICE_URL = 'http://localhost:3003';

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
