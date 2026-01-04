/**
 * Unit Tests for AuthService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockPrismaClient } from '../helpers/mocks';
import {
  mockUser,
  mockMfaUser,
  mockLockedUser,
  mockSuspendedUser,
  mockInactiveUser,
  mockUnverifiedUser,
  mockRefreshToken,
  mockRevokedRefreshToken,
  mockExpiredRefreshToken,
  mockPasswordResetToken,
  mockUsedPasswordResetToken,
  mockExpiredPasswordResetToken,
  mockEmailVerificationToken,
  mockUsedEmailVerificationToken,
  mockExpiredEmailVerificationToken,
  mockRegisterInput,
  mockLoginInput,
  mockForgotPasswordInput,
  mockResetPasswordInput,
  mockVerifyEmailInput,
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
      refreshExpiresIn: '30d',
      algorithm: 'HS256',
    },
    security: {
      bcryptRounds: 4,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      passwordResetExpiry: 1,
      emailVerificationExpiry: 24,
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

vi.mock('../../../src/utils/email.js', () => ({
  emailService: {
    sendPasswordResetEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'msg-123' }),
    sendEmailVerificationEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'msg-123' }),
  },
}));

// Import after mocking
import { AuthService } from '../../../src/services/auth.service';
import { prisma } from '../../../src/utils/prisma.js';

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    authService = new AuthService();
    mockPrisma = prisma as unknown as ReturnType<typeof mockPrismaClient>;
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        ...mockUser,
        id: 'new-user-123',
        email: mockRegisterInput.email.toLowerCase(),
      });
      mockPrisma.emailVerificationToken.create.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await authService.register(mockRegisterInput, '127.0.0.1');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterInput.email.toLowerCase() },
      });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
    });

    it('should throw ConflictError if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(authService.register(mockRegisterInput, '127.0.0.1'))
        .rejects.toThrow('Email already registered');
    });

    it('should hash password with bcrypt', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.emailVerificationToken.create.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const hashSpy = vi.spyOn(bcrypt, 'hash');

      await authService.register(mockRegisterInput, '127.0.0.1');

      expect(hashSpy).toHaveBeenCalledWith(mockRegisterInput.password, expect.any(Number));
    });

    it('should set default role to patient', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.emailVerificationToken.create.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      await authService.register({ ...mockRegisterInput, role: undefined }, '127.0.0.1');

      const createCall = mockPrisma.user.create.mock.calls[0][0];
      expect(createCall.data.role).toBe('patient');
    });

    it('should store IP address on registration', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.emailVerificationToken.create.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      await authService.register(mockRegisterInput, '192.168.1.100');

      const createCall = mockPrisma.user.create.mock.calls[0][0];
      expect(createCall.data.lastLoginIp).toBe('192.168.1.100');
    });
  });

  describe('login', () => {
    it('should login user successfully without MFA', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockPrisma.refreshToken.create.mockResolvedValue({});

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(mockLoginInput, '127.0.0.1', 'Mozilla/5.0');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: expect.objectContaining({
          failedLoginAttempts: 0,
          lockedUntil: null,
        }),
      });
    });

    it('should return MFA required response for MFA-enabled user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockMfaUser);
      mockPrisma.user.update.mockResolvedValue(mockMfaUser);
      mockPrisma.mfaToken.create.mockResolvedValue({});

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(
        { email: mockMfaUser.email, password: 'password' },
        '127.0.0.1',
        'Mozilla/5.0'
      );

      expect(result).toHaveProperty('mfaRequired', true);
      expect(result).toHaveProperty('mfaToken');
      expect(mockPrisma.mfaToken.create).toHaveBeenCalled();
    });

    it('should throw UnauthorizedError for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(mockLoginInput, '127.0.0.1'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(mockLoginInput, '127.0.0.1'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw TooManyRequestsError for locked account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockLockedUser);

      await expect(authService.login(
        { email: mockLockedUser.email, password: 'password' },
        '127.0.0.1'
      )).rejects.toThrow(/Account is locked/);
    });

    it('should throw UnauthorizedError for suspended account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockSuspendedUser);
      mockPrisma.user.update.mockResolvedValue(mockSuspendedUser);

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await expect(authService.login(
        { email: mockSuspendedUser.email, password: 'password' },
        '127.0.0.1'
      )).rejects.toThrow('Account has been suspended');
    });

    it('should throw UnauthorizedError for inactive account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockInactiveUser);
      mockPrisma.user.update.mockResolvedValue(mockInactiveUser);

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await expect(authService.login(
        { email: mockInactiveUser.email, password: 'password' },
        '127.0.0.1'
      )).rejects.toThrow('Account is inactive');
    });

    it('should increment failed login attempts on wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(mockLoginInput, '127.0.0.1'))
        .rejects.toThrow('Invalid credentials');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: expect.objectContaining({
          failedLoginAttempts: 1,
        }),
      });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully', async () => {
      const validToken = jwt.sign(
        { userId: mockUser.id },
        'test-jwt-secret-key-for-testing-purposes-only',
        { expiresIn: '30d' }
      );

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        token: validToken,
      });
      mockPrisma.refreshToken.update.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await authService.refresh(validToken, '127.0.0.1', 'Mozilla/5.0');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: mockRefreshToken.id },
        data: { isRevoked: true },
      });
    });

    it('should throw UnauthorizedError for invalid token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(authService.refresh('invalid-token', '127.0.0.1'))
        .rejects.toThrow('Invalid refresh token');
    });

    it('should throw UnauthorizedError for revoked token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRevokedRefreshToken);
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      await expect(authService.refresh('revoked-token', '127.0.0.1'))
        .rejects.toThrow('Invalid refresh token');
    });

    it('should revoke token family on token reuse', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRevokedRefreshToken);
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      await expect(authService.refresh('revoked-token', '127.0.0.1'))
        .rejects.toThrow('Invalid refresh token');

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { tokenFamily: mockRevokedRefreshToken.tokenFamily },
        data: { isRevoked: true },
      });
    });

    it('should throw UnauthorizedError for expired token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockExpiredRefreshToken);
      mockPrisma.refreshToken.delete.mockResolvedValue({});

      await expect(authService.refresh('expired-token', '127.0.0.1'))
        .rejects.toThrow('Refresh token expired');
    });
  });

  describe('logout', () => {
    it('should revoke all refresh tokens for user', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await authService.logout('user-123');

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        data: { isRevoked: true },
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return user response', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser('user-123');

      expect(result).toHaveProperty('id', mockUser.id);
      expect(result).toHaveProperty('email', mockUser.email);
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.getCurrentUser('non-existent'))
        .rejects.toThrow('User not found');
    });
  });

  describe('forgotPassword', () => {
    it('should create password reset token for existing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.passwordResetToken.create.mockResolvedValue({});

      const result = await authService.forgotPassword(mockForgotPasswordInput);

      expect(result.message).toBe('If the email exists, a reset link has been sent');
      expect(mockPrisma.passwordResetToken.create).toHaveBeenCalled();
    });

    it('should not reveal if email does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authService.forgotPassword({ email: 'nonexistent@example.com' });

      expect(result.message).toBe('If the email exists, a reset link has been sent');
      expect(mockPrisma.passwordResetToken.create).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(mockPasswordResetToken);
      mockPrisma.$transaction.mockResolvedValue([{}, {}, {}]);

      const result = await authService.resetPassword(mockResetPasswordInput);

      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw BadRequestError for invalid token', async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(authService.resetPassword({ token: 'invalid', newPassword: 'NewPass123!' }))
        .rejects.toThrow('Invalid or expired reset token');
    });

    it('should throw BadRequestError for used token', async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(mockUsedPasswordResetToken);

      await expect(authService.resetPassword(mockResetPasswordInput))
        .rejects.toThrow('Invalid or expired reset token');
    });

    it('should throw BadRequestError for expired token', async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(mockExpiredPasswordResetToken);
      mockPrisma.passwordResetToken.delete.mockResolvedValue({});

      await expect(authService.resetPassword({
        token: mockExpiredPasswordResetToken.token,
        newPassword: 'NewPass123!',
      })).rejects.toThrow('Reset token has expired');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(mockEmailVerificationToken);
      mockPrisma.$transaction.mockResolvedValue([{}, {}]);

      const result = await authService.verifyEmail(mockVerifyEmailInput);

      expect(result.message).toBe('Email verified successfully');
    });

    it('should throw BadRequestError for invalid token', async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(null);

      await expect(authService.verifyEmail({ token: 'invalid' }))
        .rejects.toThrow('Invalid or expired verification token');
    });

    it('should throw BadRequestError for used token', async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(mockUsedEmailVerificationToken);

      await expect(authService.verifyEmail({ token: mockUsedEmailVerificationToken.token }))
        .rejects.toThrow('Invalid or expired verification token');
    });

    it('should throw BadRequestError for expired token', async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(mockExpiredEmailVerificationToken);
      mockPrisma.emailVerificationToken.delete.mockResolvedValue({});

      await expect(authService.verifyEmail({ token: mockExpiredEmailVerificationToken.token }))
        .rejects.toThrow('Verification token has expired');
    });
  });

  describe('resendVerification', () => {
    it('should resend verification email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUnverifiedUser);
      mockPrisma.emailVerificationToken.deleteMany.mockResolvedValue({});
      mockPrisma.emailVerificationToken.create.mockResolvedValue({});

      const result = await authService.resendVerification(mockUnverifiedUser.email);

      expect(result.message).toBe('If the email exists, a verification link has been sent');
    });

    it('should throw BadRequestError for already verified email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser); // mockUser has emailVerified: true

      await expect(authService.resendVerification(mockUser.email))
        .rejects.toThrow('Email is already verified');
    });

    it('should not reveal if email does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authService.resendVerification('nonexistent@example.com');

      expect(result.message).toBe('If the email exists, a verification link has been sent');
    });
  });

  describe('completeMfaLogin', () => {
    it('should complete login after MFA verification', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockMfaUser);
      mockPrisma.user.update.mockResolvedValue(mockMfaUser);
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await authService.completeMfaLogin(mockMfaUser.id, '127.0.0.1', 'Mozilla/5.0');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockMfaUser.id },
        data: expect.objectContaining({
          failedLoginAttempts: 0,
          lockedUntil: null,
        }),
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.completeMfaLogin('non-existent', '127.0.0.1'))
        .rejects.toThrow('User not found');
    });
  });
});
