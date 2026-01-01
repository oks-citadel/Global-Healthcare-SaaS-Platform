import { afterEach, vi } from "vitest";

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.PORT = "3006";
process.env.JWT_SECRET = "test-jwt-secret-key";

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
