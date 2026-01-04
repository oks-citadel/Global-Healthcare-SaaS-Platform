/**
 * Test Fixtures for Auth Service
 */

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  passwordHash: '$2a$04$test.hash.for.testing.purposes.only',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  dateOfBirth: new Date('1990-01-15'),
  role: 'patient' as const,
  status: 'active' as const,
  emailVerified: true,
  mfaEnabled: false,
  mfaSecret: null,
  mfaBackupCodes: [],
  mfaVerifiedAt: null,
  failedLoginAttempts: 0,
  lockedUntil: null,
  lastLoginAt: new Date('2025-01-10T10:00:00Z'),
  lastLoginIp: '192.168.1.1',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-10T10:00:00Z'),
};

export const mockMfaUser = {
  ...mockUser,
  id: 'user-mfa-123',
  email: 'mfa@example.com',
  mfaEnabled: true,
  mfaSecret: 'encrypted-mfa-secret-string',
  mfaBackupCodes: [
    'hashedcode1',
    'hashedcode2',
    'hashedcode3',
  ],
  mfaVerifiedAt: new Date('2025-01-05T00:00:00Z'),
};

export const mockProviderUser = {
  ...mockUser,
  id: 'provider-123',
  email: 'provider@example.com',
  role: 'provider' as const,
};

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-123',
  email: 'admin@example.com',
  role: 'admin' as const,
};

export const mockLockedUser = {
  ...mockUser,
  id: 'user-locked-123',
  email: 'locked@example.com',
  failedLoginAttempts: 5,
  lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
};

export const mockSuspendedUser = {
  ...mockUser,
  id: 'user-suspended-123',
  email: 'suspended@example.com',
  status: 'suspended' as const,
};

export const mockInactiveUser = {
  ...mockUser,
  id: 'user-inactive-123',
  email: 'inactive@example.com',
  status: 'inactive' as const,
};

export const mockUnverifiedUser = {
  ...mockUser,
  id: 'user-unverified-123',
  email: 'unverified@example.com',
  emailVerified: false,
};

export const mockRefreshToken = {
  id: 'token-123',
  token: 'valid-refresh-token-jwt',
  userId: 'user-123',
  tokenFamily: 'family-abc123',
  isRevoked: false,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  ipAddress: '127.0.0.1',
  userAgent: 'Mozilla/5.0',
  createdAt: new Date('2025-01-10T10:00:00Z'),
  updatedAt: new Date('2025-01-10T10:00:00Z'),
  user: mockUser,
};

export const mockRevokedRefreshToken = {
  ...mockRefreshToken,
  id: 'token-revoked-123',
  token: 'revoked-refresh-token-jwt',
  isRevoked: true,
};

export const mockExpiredRefreshToken = {
  ...mockRefreshToken,
  id: 'token-expired-123',
  token: 'expired-refresh-token-jwt',
  expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired yesterday
};

export const mockPasswordResetToken = {
  id: 'reset-token-123',
  token: 'valid-reset-token-hex',
  userId: 'user-123',
  isUsed: false,
  expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  createdAt: new Date('2025-01-10T10:00:00Z'),
  user: mockUser,
};

export const mockUsedPasswordResetToken = {
  ...mockPasswordResetToken,
  id: 'reset-token-used-123',
  token: 'used-reset-token-hex',
  isUsed: true,
};

export const mockExpiredPasswordResetToken = {
  ...mockPasswordResetToken,
  id: 'reset-token-expired-123',
  token: 'expired-reset-token-hex',
  expiresAt: new Date(Date.now() - 60 * 60 * 1000), // Expired 1 hour ago
};

export const mockEmailVerificationToken = {
  id: 'verify-token-123',
  token: 'valid-verification-token-hex',
  userId: 'user-unverified-123',
  isUsed: false,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  createdAt: new Date('2025-01-10T10:00:00Z'),
  user: mockUnverifiedUser,
};

export const mockUsedEmailVerificationToken = {
  ...mockEmailVerificationToken,
  id: 'verify-token-used-123',
  token: 'used-verification-token-hex',
  isUsed: true,
};

export const mockExpiredEmailVerificationToken = {
  ...mockEmailVerificationToken,
  id: 'verify-token-expired-123',
  token: 'expired-verification-token-hex',
  expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired 24 hours ago
};

export const mockMfaToken = {
  id: 'mfa-token-123',
  token: 'valid-mfa-session-token',
  userId: 'user-mfa-123',
  expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
  ipAddress: '127.0.0.1',
  userAgent: 'Mozilla/5.0',
  createdAt: new Date('2025-01-10T10:00:00Z'),
};

export const mockRegisterInput = {
  email: 'newuser@example.com',
  password: 'SecurePassword123!',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+1987654321',
  dateOfBirth: '1992-03-20',
  role: 'patient' as const,
};

export const mockLoginInput = {
  email: 'test@example.com',
  password: 'SecurePassword123!',
};

export const mockForgotPasswordInput = {
  email: 'test@example.com',
};

export const mockResetPasswordInput = {
  token: 'valid-reset-token-hex',
  newPassword: 'NewSecurePassword456!',
};

export const mockVerifyEmailInput = {
  token: 'valid-verification-token-hex',
};

export const mockJwtPayload = {
  userId: 'user-123',
  email: 'test@example.com',
  role: 'patient' as const,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
};

export const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNzA0ODQ0ODAwLCJleHAiOjE3MDQ4NDU3MDB9.test_signature';

export const mockMfaSetupResponse = {
  secret: 'JBSWY3DPEHPK3PXP',
  otpAuthUrl: 'otpauth://totp/UnifiedHealth:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=UnifiedHealth',
};

export const mockBackupCodes = [
  'ABCD-1234',
  'EFGH-5678',
  'IJKL-9012',
  'MNOP-3456',
  'QRST-7890',
  'UVWX-1234',
  'YZAB-5678',
  'CDEF-9012',
  'GHIJ-3456',
  'KLMN-7890',
];

export const mockOAuthAccount = {
  id: 'oauth-123',
  provider: 'google',
  providerAccountId: 'google-user-id-123',
  userId: 'user-123',
  accessToken: 'google-access-token',
  refreshToken: 'google-refresh-token',
  expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};
