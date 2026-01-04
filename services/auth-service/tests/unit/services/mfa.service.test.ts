/**
 * Unit Tests for MfaService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockPrismaClient } from '../helpers/mocks';
import {
  mockUser,
  mockMfaUser,
  mockBackupCodes,
} from '../helpers/fixtures';

// Mock modules
vi.mock('../../../src/utils/prisma.js', () => ({
  prisma: mockPrismaClient(),
}));

vi.mock('../../../src/config/index.js', () => ({
  config: {
    jwt: {
      secret: 'test-jwt-secret-key-for-testing-purposes-only',
      expiresIn: '15m',
    },
    mfa: {
      encryptionKey: 'test-mfa-encryption-key-32chars!',
      issuer: 'UnifiedHealth-Test',
    },
  },
}));

vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('../../../src/utils/mfa.js', () => ({
  MfaUtils: {
    generateSecret: vi.fn().mockReturnValue('JBSWY3DPEHPK3PXP'),
    generateOtpAuthUrl: vi.fn().mockReturnValue('otpauth://totp/Test:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Test'),
    encryptSecret: vi.fn().mockReturnValue('encrypted-secret-string'),
    decryptSecret: vi.fn().mockReturnValue('JBSWY3DPEHPK3PXP'),
    verifyToken: vi.fn().mockReturnValue(true),
    generateBackupCodes: vi.fn().mockReturnValue(mockBackupCodes),
    hashBackupCodes: vi.fn().mockReturnValue(mockBackupCodes.map((_, i) => `hashed-${i}`)),
    verifyBackupCode: vi.fn().mockReturnValue({ valid: false, index: -1 }),
  },
}));

// Import after mocking
import { MfaService } from '../../../src/services/mfa.service';
import { prisma } from '../../../src/utils/prisma.js';
import { MfaUtils } from '../../../src/utils/mfa.js';

describe('MfaService', () => {
  let mfaService: MfaService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mfaService = new MfaService();
    mockPrisma = prisma as unknown as ReturnType<typeof mockPrismaClient>;
    vi.clearAllMocks();
  });

  describe('getMfaStatus', () => {
    it('should return MFA disabled status for user without MFA', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        mfaEnabled: false,
        mfaVerifiedAt: null,
        mfaBackupCodes: [],
      });

      const result = await mfaService.getMfaStatus('user-123');

      expect(result).toEqual({
        enabled: false,
        verifiedAt: undefined,
        backupCodesRemaining: 0,
      });
    });

    it('should return MFA enabled status for user with MFA', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        mfaEnabled: true,
        mfaVerifiedAt: new Date('2025-01-05T00:00:00Z'),
        mfaBackupCodes: ['code1', 'code2', 'code3'],
      });

      const result = await mfaService.getMfaStatus('user-mfa-123');

      expect(result).toEqual({
        enabled: true,
        verifiedAt: '2025-01-05T00:00:00.000Z',
        backupCodesRemaining: 3,
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(mfaService.getMfaStatus('non-existent'))
        .rejects.toThrow('User not found');
    });
  });

  describe('enableMfa', () => {
    it('should initiate MFA setup and return secret', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        mfaEnabled: false,
      });
      mockPrisma.user.update.mockResolvedValue({});

      const result = await mfaService.enableMfa('user-123');

      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('otpAuthUrl');
      expect(MfaUtils.generateSecret).toHaveBeenCalled();
      expect(MfaUtils.encryptSecret).toHaveBeenCalled();
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { mfaSecret: 'encrypted-secret-string' },
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(mfaService.enableMfa('non-existent'))
        .rejects.toThrow('User not found');
    });

    it('should throw BadRequestError if MFA already enabled', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        mfaEnabled: true,
      });

      await expect(mfaService.enableMfa('user-123'))
        .rejects.toThrow('MFA is already enabled');
    });
  });

  describe('verifyMfaSetup', () => {
    it('should verify MFA setup and return backup codes', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: 'encrypted-secret',
        mfaEnabled: false,
      });
      mockPrisma.user.update.mockResolvedValue({});

      const result = await mfaService.verifyMfaSetup('user-123', '123456');

      expect(result).toHaveProperty('backupCodes');
      expect(result.backupCodes).toHaveLength(10);
      expect(result.message).toContain('MFA enabled successfully');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          mfaEnabled: true,
          mfaVerifiedAt: expect.any(Date),
        }),
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(mfaService.verifyMfaSetup('non-existent', '123456'))
        .rejects.toThrow('User not found');
    });

    it('should throw BadRequestError if MFA already enabled', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: 'encrypted-secret',
        mfaEnabled: true,
      });

      await expect(mfaService.verifyMfaSetup('user-123', '123456'))
        .rejects.toThrow('MFA is already enabled');
    });

    it('should throw BadRequestError if MFA setup not initiated', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: null,
        mfaEnabled: false,
      });

      await expect(mfaService.verifyMfaSetup('user-123', '123456'))
        .rejects.toThrow('MFA setup not initiated');
    });

    it('should throw BadRequestError for invalid MFA code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: 'encrypted-secret',
        mfaEnabled: false,
      });

      vi.mocked(MfaUtils.verifyToken).mockReturnValueOnce(false);

      await expect(mfaService.verifyMfaSetup('user-123', '000000'))
        .rejects.toThrow('Invalid MFA code');
    });
  });

  describe('disableMfa', () => {
    it('should disable MFA with valid password and code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: true,
        mfaSecret: 'encrypted-secret',
        mfaBackupCodes: [],
      });
      mockPrisma.user.update.mockResolvedValue({});

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await mfaService.disableMfa('user-123', 'password', '123456');

      expect(result.message).toBe('MFA disabled successfully');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          mfaEnabled: false,
          mfaSecret: null,
          mfaBackupCodes: [],
          mfaVerifiedAt: null,
        },
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(mfaService.disableMfa('non-existent', 'password', '123456'))
        .rejects.toThrow('User not found');
    });

    it('should throw BadRequestError if MFA not enabled', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: false,
      });

      await expect(mfaService.disableMfa('user-123', 'password', '123456'))
        .rejects.toThrow('MFA is not enabled');
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: true,
        mfaSecret: 'encrypted-secret',
        mfaBackupCodes: [],
      });

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(mfaService.disableMfa('user-123', 'wrongpassword', '123456'))
        .rejects.toThrow('Invalid password');
    });

    it('should throw BadRequestError for invalid MFA code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: true,
        mfaSecret: 'encrypted-secret',
        mfaBackupCodes: [],
      });

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      vi.mocked(MfaUtils.verifyToken).mockReturnValueOnce(false);

      await expect(mfaService.disableMfa('user-123', 'password', '000000'))
        .rejects.toThrow('Invalid MFA code or backup code');
    });
  });

  describe('regenerateBackupCodes', () => {
    it('should regenerate backup codes with valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: true,
        mfaSecret: 'encrypted-secret',
      });
      mockPrisma.user.update.mockResolvedValue({});

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await mfaService.regenerateBackupCodes('user-123', 'password', '123456');

      expect(result).toHaveProperty('backupCodes');
      expect(result.backupCodes).toHaveLength(10);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(mfaService.regenerateBackupCodes('non-existent', 'password', '123456'))
        .rejects.toThrow('User not found');
    });

    it('should throw BadRequestError if MFA not enabled', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: false,
        mfaSecret: null,
      });

      await expect(mfaService.regenerateBackupCodes('user-123', 'password', '123456'))
        .rejects.toThrow('MFA is not enabled');
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: true,
        mfaSecret: 'encrypted-secret',
      });

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(mfaService.regenerateBackupCodes('user-123', 'wrongpassword', '123456'))
        .rejects.toThrow('Invalid password');
    });

    it('should throw BadRequestError for invalid MFA code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        passwordHash: '$2a$04$validhash',
        mfaEnabled: true,
        mfaSecret: 'encrypted-secret',
      });

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      vi.mocked(MfaUtils.verifyToken).mockReturnValueOnce(false);

      await expect(mfaService.regenerateBackupCodes('user-123', 'password', '000000'))
        .rejects.toThrow('Invalid MFA code');
    });
  });

  describe('generateMfaToken', () => {
    it('should generate valid MFA challenge token', () => {
      const token = mfaService.generateMfaToken('user-123');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token structure
      const decoded = jwt.verify(token, 'test-jwt-secret-key-for-testing-purposes-only') as any;
      expect(decoded.userId).toBe('user-123');
      expect(decoded.type).toBe('mfa_challenge');
    });
  });

  describe('verifyMfaToken', () => {
    it('should verify valid MFA token', () => {
      const token = jwt.sign(
        { userId: 'user-123', type: 'mfa_challenge' },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '5m' }
      );

      const payload = mfaService.verifyMfaToken(token);

      expect(payload.userId).toBe('user-123');
      expect(payload.type).toBe('mfa_challenge');
    });

    it('should throw UnauthorizedError for invalid token', () => {
      expect(() => mfaService.verifyMfaToken('invalid-token'))
        .toThrow('Invalid MFA token');
    });

    it('should throw UnauthorizedError for expired token', () => {
      const token = jwt.sign(
        { userId: 'user-123', type: 'mfa_challenge' },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '-1s' }
      );

      expect(() => mfaService.verifyMfaToken(token))
        .toThrow('MFA token expired');
    });

    it('should throw UnauthorizedError for wrong token type', () => {
      const token = jwt.sign(
        { userId: 'user-123', type: 'access_token' },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '5m' }
      );

      expect(() => mfaService.verifyMfaToken(token))
        .toThrow('Invalid MFA token');
    });
  });

  describe('verifyLoginMfa', () => {
    it('should verify MFA code during login', async () => {
      const mfaToken = jwt.sign(
        { userId: 'user-mfa-123', type: 'mfa_challenge' },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '5m' }
      );

      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: 'encrypted-secret',
        mfaBackupCodes: [],
      });

      const userId = await mfaService.verifyLoginMfa(mfaToken, '123456');

      expect(userId).toBe('user-mfa-123');
    });

    it('should verify backup code during login', async () => {
      const mfaToken = jwt.sign(
        { userId: 'user-mfa-123', type: 'mfa_challenge' },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '5m' }
      );

      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: 'encrypted-secret',
        mfaBackupCodes: ['hashed-code'],
      });
      mockPrisma.user.update.mockResolvedValue({});

      vi.mocked(MfaUtils.verifyToken).mockReturnValueOnce(false);
      vi.mocked(MfaUtils.verifyBackupCode).mockReturnValueOnce({ valid: true, index: 0 });

      const userId = await mfaService.verifyLoginMfa(mfaToken, 'ABCD-1234');

      expect(userId).toBe('user-mfa-123');
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('should throw UnauthorizedError for invalid MFA configuration', async () => {
      const mfaToken = jwt.sign(
        { userId: 'user-123', type: 'mfa_challenge' },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '5m' }
      );

      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: null,
        mfaBackupCodes: [],
      });

      await expect(mfaService.verifyLoginMfa(mfaToken, '123456'))
        .rejects.toThrow('Invalid MFA configuration');
    });

    it('should throw BadRequestError for invalid MFA code', async () => {
      const mfaToken = jwt.sign(
        { userId: 'user-mfa-123', type: 'mfa_challenge' },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '5m' }
      );

      mockPrisma.user.findUnique.mockResolvedValue({
        mfaSecret: 'encrypted-secret',
        mfaBackupCodes: [],
      });

      vi.mocked(MfaUtils.verifyToken).mockReturnValueOnce(false);
      vi.mocked(MfaUtils.verifyBackupCode).mockReturnValueOnce({ valid: false, index: -1 });

      await expect(mfaService.verifyLoginMfa(mfaToken, '000000'))
        .rejects.toThrow('Invalid MFA code');
    });
  });
});
