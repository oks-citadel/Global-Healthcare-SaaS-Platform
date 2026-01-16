import { afterEach, vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock fetch globally
global.fetch = vi.fn();
