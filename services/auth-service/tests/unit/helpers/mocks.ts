/**
 * Mock Helpers for Auth Service Tests
 */

import { vi } from 'vitest';

/**
 * Mock Express Request
 */
export function mockRequest(overrides: any = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: undefined,
    ip: '127.0.0.1',
    get: vi.fn((header: string) => overrides.headers?.[header.toLowerCase()]),
    ...overrides,
  };
}

/**
 * Mock Express Response
 */
export function mockResponse() {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Mock Express Next Function
 */
export function mockNext() {
  return vi.fn();
}

/**
 * Mock Prisma Client for Auth Service
 */
export function mockPrismaClient() {
  return {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    refreshToken: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    passwordResetToken: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    emailVerificationToken: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    mfaToken: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    oauthAccount: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn((callback: any) => {
      if (Array.isArray(callback)) {
        return Promise.all(callback);
      }
      return callback(mockPrismaClient());
    }),
  };
}

/**
 * Mock Logger
 */
export function mockLogger() {
  return {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };
}

/**
 * Mock Config
 */
export function mockConfig() {
  return {
    jwt: {
      secret: 'test-jwt-secret-key-for-testing-purposes-only',
      expiresIn: '15m',
      refreshExpiresIn: '30d',
      algorithm: 'HS256',
      privateKey: undefined,
      publicKey: undefined,
    },
    mfa: {
      encryptionKey: 'test-mfa-encryption-key-32chars!',
      issuer: 'Unified Health Test',
    },
    security: {
      bcryptRounds: 4,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      passwordResetExpiry: 1,
      emailVerificationExpiry: 24,
    },
  };
}

/**
 * Mock Email Service
 */
export function mockEmailService() {
  return {
    sendPasswordResetEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'test-msg-id' }),
    sendEmailVerificationEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'test-msg-id' }),
    sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'test-msg-id' }),
  };
}
