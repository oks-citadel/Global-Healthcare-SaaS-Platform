import { afterEach, vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-min';
process.env.HASH_SECRET = 'test-hash-secret-for-audit-logging';

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
