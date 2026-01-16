import { afterEach, vi } from 'vitest';

// Mock environment
process.env.NODE_ENV = 'test';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});
