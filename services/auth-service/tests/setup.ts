/**
 * Test Setup for Auth Service
 */

import { vi, beforeAll, afterAll, beforeEach } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '30d';
process.env.JWT_ALGORITHM = 'HS256';
process.env.MFA_ENCRYPTION_KEY = 'test-mfa-encryption-key-32chars!';
process.env.MFA_ISSUER = 'UnifiedHealth-Test';
process.env.BCRYPT_ROUNDS = '4';
process.env.MAX_LOGIN_ATTEMPTS = '5';
process.env.LOCKOUT_DURATION = '15';
process.env.PASSWORD_RESET_EXPIRY = '1';
process.env.EMAIL_VERIFICATION_EXPIRY = '24';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/auth_test';

// Mock logger to prevent console output during tests
vi.mock('../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock email service
vi.mock('../src/utils/email.js', () => ({
  emailService: {
    sendPasswordResetEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'test-msg-id' }),
    sendEmailVerificationEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'test-msg-id' }),
  },
}));

beforeAll(() => {
  // Global setup
});

afterAll(() => {
  // Global cleanup
});

beforeEach(() => {
  vi.clearAllMocks();
});
