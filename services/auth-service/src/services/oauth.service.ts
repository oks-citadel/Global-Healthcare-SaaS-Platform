import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { oauthConfig } from '../config/oauth.config.js';
import { prisma } from '../utils/prisma.js';
import { logger } from '../utils/logger.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../utils/errors.js';
import {
  OAuthProvider,
  OAuthProfile,
  OAuthStateData,
  SocialAccountResponse,
} from '../dtos/oauth.dto.js';
import { AuthResponse, JwtPayload } from '../dtos/auth.dto.js';
import { getStrategy, getEnabledProviders } from '../strategies/index.js';

/**
 * OAuth Service
 * Handles OAuth2 authentication flow, account linking, and social account management
 */
export class OAuthService {
  // Encryption constants
  private readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  private readonly IV_LENGTH = 16;
  private readonly AUTH_TAG_LENGTH = 16;

  /**
   * Get the encryption key, hashed to 32 bytes
   */
  private getEncryptionKey(): Buffer {
    return createHash('sha256')
      .update(oauthConfig.tokenEncryptionKey)
      .digest();
  }

  /**
   * Encrypt sensitive data (OAuth tokens)
   */
  private encrypt(text: string): string {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(
      this.ENCRYPTION_ALGORITHM,
      this.getEncryptionKey(),
      iv,
      { authTagLength: this.AUTH_TAG_LENGTH }
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine IV + encrypted data + auth tag
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  }

  /**
   * Decrypt sensitive data
   * Used for retrieving stored OAuth tokens for refresh operations
   */
  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = createDecipheriv(
      this.ENCRYPTION_ALGORITHM,
      this.getEncryptionKey(),
      iv,
      { authTagLength: this.AUTH_TAG_LENGTH }
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Get list of enabled OAuth providers
   */
  getEnabledProviders(): OAuthProvider[] {
    return getEnabledProviders();
  }

  /**
   * Initiate OAuth flow - create state and return authorization URL
   */
  async initiateOAuth(
    provider: OAuthProvider,
    userId?: string,
    redirectUrl?: string,
    metadata?: Record<string, unknown>
  ): Promise<{ authorizationUrl: string; state: string }> {
    // Validate provider
    const strategy = getStrategy(provider);

    // Validate redirect URL if provided
    if (redirectUrl && !this.isAllowedRedirectUrl(redirectUrl)) {
      throw new BadRequestError('Invalid redirect URL');
    }

    // Generate secure random state
    const state = randomBytes(32).toString('hex');

    // Calculate expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + oauthConfig.stateExpiryMinutes);

    // Store state in database
    await prisma.oAuthState.create({
      data: {
        state,
        provider,
        userId,
        redirectUrl: redirectUrl || oauthConfig.defaultRedirectUrl,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        expiresAt,
      },
    });

    logger.info('OAuth flow initiated', { provider, userId, state: state.substring(0, 8) + '...' });

    // Generate authorization URL
    const authorizationUrl = strategy.getAuthorizationUrl(state);

    return { authorizationUrl, state };
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(
    provider: OAuthProvider,
    code: string,
    state: string,
    appleUserInfo?: { name?: { firstName?: string; lastName?: string }; email?: string },
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ authResponse: AuthResponse; isNewUser: boolean; redirectUrl: string }> {
    // Validate and consume state
    const stateData = await this.validateAndConsumeState(state, provider);

    // Get the strategy
    const strategy = getStrategy(provider);

    // Exchange code for tokens
    const tokens = await strategy.exchangeCodeForTokens(code);

    // Fetch user profile
    let profile: OAuthProfile;
    if (provider === 'apple' && appleUserInfo) {
      const appleStrategy = await import('../strategies/apple.strategy.js');
      profile = await appleStrategy.appleStrategy.fetchUserProfile(tokens, appleUserInfo);
    } else {
      profile = await strategy.fetchUserProfile(tokens);
    }

    // Check if this is account linking or login/signup
    if (stateData.userId) {
      // Account linking flow
      const authResponse = await this.linkSocialAccount(
        stateData.userId,
        profile,
        ipAddress,
        userAgent
      );
      return {
        authResponse,
        isNewUser: false,
        redirectUrl: stateData.redirectUrl || oauthConfig.defaultRedirectUrl,
      };
    }

    // Login/Signup flow
    const result = await this.authenticateWithOAuth(profile, ipAddress, userAgent);

    return {
      ...result,
      redirectUrl: stateData.redirectUrl || oauthConfig.defaultRedirectUrl,
    };
  }

  /**
   * Validate OAuth state and consume it (one-time use)
   */
  private async validateAndConsumeState(
    state: string,
    provider: OAuthProvider
  ): Promise<OAuthStateData> {
    // Find the state record
    const stateRecord = await prisma.oAuthState.findUnique({
      where: { state },
    });

    if (!stateRecord) {
      logger.warn('Invalid OAuth state', { state: state.substring(0, 8) + '...' });
      throw new UnauthorizedError('Invalid or expired OAuth state');
    }

    // Check provider matches
    if (stateRecord.provider !== provider) {
      logger.warn('OAuth state provider mismatch', {
        expected: provider,
        actual: stateRecord.provider,
      });
      throw new UnauthorizedError('Invalid OAuth state');
    }

    // Check if expired
    if (new Date() > stateRecord.expiresAt) {
      // Delete expired state
      await prisma.oAuthState.delete({ where: { id: stateRecord.id } });
      logger.warn('OAuth state expired', { state: state.substring(0, 8) + '...' });
      throw new UnauthorizedError('OAuth state has expired. Please try again.');
    }

    // Delete state (one-time use for CSRF protection)
    await prisma.oAuthState.delete({ where: { id: stateRecord.id } });

    return {
      provider: stateRecord.provider as OAuthProvider,
      userId: stateRecord.userId || undefined,
      redirectUrl: stateRecord.redirectUrl || undefined,
      metadata: stateRecord.metadata as Record<string, unknown> | undefined,
    };
  }

  /**
   * Authenticate with OAuth - login or create account
   */
  private async authenticateWithOAuth(
    profile: OAuthProfile,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ authResponse: AuthResponse; isNewUser: boolean }> {
    // Check if social account exists
    const existingSocialAccount = await prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
      },
      include: { user: true },
    });

    if (existingSocialAccount) {
      // Existing social account - login
      const user = existingSocialAccount.user;

      // Check if account is active
      if (user.status === 'suspended') {
        throw new UnauthorizedError('Account has been suspended');
      }
      if (user.status === 'inactive') {
        throw new UnauthorizedError('Account is inactive');
      }

      // Update last login info and social account tokens
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress,
          },
        }),
        prisma.socialAccount.update({
          where: { id: existingSocialAccount.id },
          data: {
            accessToken: profile.accessToken ? this.encrypt(profile.accessToken) : null,
            refreshToken: profile.refreshToken ? this.encrypt(profile.refreshToken) : null,
            tokenExpiry: profile.tokenExpiresAt,
            lastUsedAt: new Date(),
          },
        }),
      ]);

      logger.info('OAuth login successful', {
        userId: user.id,
        provider: profile.provider,
      });

      const authResponse = await this.generateTokens(user, ipAddress, userAgent);
      return { authResponse, isNewUser: false };
    }

    // No existing social account - check if email matches an existing user
    if (profile.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email.toLowerCase() },
        include: { socialAccounts: true },
      });

      if (existingUser) {
        // Email matches existing user - automatically link accounts
        // This is a common UX pattern for social logins

        // Check if this provider is already linked to a different account
        const conflictingAccount = await prisma.socialAccount.findUnique({
          where: {
            provider_providerId: {
              provider: profile.provider,
              providerId: profile.providerId,
            },
          },
        });

        if (conflictingAccount && conflictingAccount.userId !== existingUser.id) {
          throw new ConflictError(
            `This ${profile.provider} account is already linked to a different user`
          );
        }

        // Link the social account to existing user
        await prisma.socialAccount.create({
          data: {
            userId: existingUser.id,
            provider: profile.provider,
            providerId: profile.providerId,
            accessToken: profile.accessToken ? this.encrypt(profile.accessToken) : null,
            refreshToken: profile.refreshToken ? this.encrypt(profile.refreshToken) : null,
            tokenExpiry: profile.tokenExpiresAt,
            email: profile.email,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            profileData: profile.rawProfile as object,
            lastUsedAt: new Date(),
          },
        });

        // Update last login
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress,
            // Auto-verify email if social provider says it's verified
            emailVerified: profile.emailVerified ? true : existingUser.emailVerified,
          },
        });

        logger.info('OAuth account linked and logged in', {
          userId: existingUser.id,
          provider: profile.provider,
        });

        const authResponse = await this.generateTokens(existingUser, ipAddress, userAgent);
        return { authResponse, isNewUser: false };
      }
    }

    // Create new user
    const newUser = await this.createUserFromOAuth(profile, ipAddress);

    logger.info('New user created via OAuth', {
      userId: newUser.id,
      provider: profile.provider,
    });

    const authResponse = await this.generateTokens(newUser, ipAddress, userAgent);
    return { authResponse, isNewUser: true };
  }

  /**
   * Create a new user from OAuth profile
   */
  private async createUserFromOAuth(
    profile: OAuthProfile,
    ipAddress?: string
  ): Promise<any> {
    // Generate a random password hash (user won't use it for OAuth-only accounts)
    const randomPassword = randomBytes(32).toString('hex');
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(randomPassword, config.security.bcryptRounds);

    // Create user and social account in a transaction
    const user = await prisma.user.create({
      data: {
        email: profile.email?.toLowerCase() || `${profile.providerId}@${profile.provider}.oauth`,
        passwordHash,
        firstName: profile.firstName || profile.displayName?.split(' ')[0] || 'User',
        lastName: profile.lastName || profile.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'patient',
        status: 'active',
        emailVerified: profile.emailVerified,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
        socialAccounts: {
          create: {
            provider: profile.provider,
            providerId: profile.providerId,
            accessToken: profile.accessToken ? this.encrypt(profile.accessToken) : null,
            refreshToken: profile.refreshToken ? this.encrypt(profile.refreshToken) : null,
            tokenExpiry: profile.tokenExpiresAt,
            email: profile.email,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            profileData: profile.rawProfile as object,
            lastUsedAt: new Date(),
          },
        },
      },
      include: { socialAccounts: true },
    });

    return user;
  }

  /**
   * Link a social account to an existing user
   */
  async linkSocialAccount(
    userId: string,
    profile: OAuthProfile,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { socialAccounts: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if this provider is already linked to this user
    const existingLink = user.socialAccounts.find(
      (sa) => sa.provider === profile.provider
    );

    if (existingLink) {
      throw new ConflictError(
        `A ${profile.provider} account is already linked to your account`
      );
    }

    // Check if this social account is linked to another user
    const conflictingAccount = await prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
      },
    });

    if (conflictingAccount) {
      throw new ConflictError(
        `This ${profile.provider} account is already linked to a different user`
      );
    }

    // Create the social account link
    await prisma.socialAccount.create({
      data: {
        userId,
        provider: profile.provider,
        providerId: profile.providerId,
        accessToken: profile.accessToken ? this.encrypt(profile.accessToken) : null,
        refreshToken: profile.refreshToken ? this.encrypt(profile.refreshToken) : null,
        tokenExpiry: profile.tokenExpiresAt,
        email: profile.email,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        profileData: profile.rawProfile as object,
        lastUsedAt: new Date(),
      },
    });

    logger.info('Social account linked', {
      userId,
      provider: profile.provider,
    });

    // Generate new tokens
    return this.generateTokens(user, ipAddress, userAgent);
  }

  /**
   * Unlink a social account from a user
   */
  async unlinkSocialAccount(
    userId: string,
    provider: OAuthProvider
  ): Promise<{ success: boolean; message: string }> {
    // Get user with all auth methods
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { socialAccounts: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Find the social account to unlink
    const socialAccount = user.socialAccounts.find(
      (sa) => sa.provider === provider
    );

    if (!socialAccount) {
      throw new NotFoundError(`No ${provider} account is linked to your account`);
    }

    // Check if user has other authentication methods
    // User must have either a password or another social account
    const hasPassword = user.passwordHash && user.passwordHash.length > 20;
    const otherSocialAccounts = user.socialAccounts.filter(
      (sa) => sa.provider !== provider
    );

    if (!hasPassword && otherSocialAccounts.length === 0) {
      throw new BadRequestError(
        'Cannot unlink the only authentication method. Please set a password or link another social account first.'
      );
    }

    // Delete the social account
    await prisma.socialAccount.delete({
      where: { id: socialAccount.id },
    });

    logger.info('Social account unlinked', {
      userId,
      provider,
    });

    return {
      success: true,
      message: `${provider} account has been unlinked`,
    };
  }

  /**
   * Get user's linked social accounts
   */
  async getLinkedAccounts(userId: string): Promise<SocialAccountResponse[]> {
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { userId },
      orderBy: { linkedAt: 'desc' },
    });

    return socialAccounts.map((sa) => ({
      id: sa.id,
      provider: sa.provider,
      email: sa.email,
      displayName: sa.displayName,
      avatarUrl: sa.avatarUrl,
      linkedAt: sa.linkedAt.toISOString(),
      lastUsedAt: sa.lastUsedAt?.toISOString() || null,
    }));
  }

  /**
   * Generate JWT tokens for user
   */
  private async generateTokens(
    user: any,
    ipAddress?: string,
    userAgent?: string,
    tokenFamily?: string
  ): Promise<AuthResponse> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const signOptions: jwt.SignOptions =
      config.jwt.algorithm === 'RS256'
        ? {
            algorithm: 'RS256',
            expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
          }
        : {
            algorithm: 'HS256',
            expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
          };

    const refreshSignOptions: jwt.SignOptions =
      config.jwt.algorithm === 'RS256'
        ? {
            algorithm: 'RS256',
            expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
          }
        : {
            algorithm: 'HS256',
            expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
          };

    const secret =
      config.jwt.algorithm === 'RS256' ? config.jwt.privateKey! : config.jwt.secret;

    // Generate access token
    const accessToken = jwt.sign(payload, secret, signOptions);

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user.id }, secret, refreshSignOptions);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const newTokenFamily = tokenFamily || randomBytes(16).toString('hex');

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        tokenFamily: newTokenFamily,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Validate if redirect URL is allowed
   */
  private isAllowedRedirectUrl(url: string): boolean {
    try {
      // Validate URL is parseable
      new URL(url);

      // Check against allowed patterns
      for (const pattern of oauthConfig.allowedRedirectPatterns) {
        if (this.matchUrlPattern(url, pattern)) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Match URL against a pattern (supports * wildcard)
   */
  private matchUrlPattern(url: string, pattern: string): boolean {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special chars
      .replace(/\*/g, '.*'); // Convert * to .*

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  }

  /**
   * Cleanup expired OAuth states (should be called periodically)
   */
  async cleanupExpiredStates(): Promise<number> {
    const result = await prisma.oAuthState.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      logger.info('Cleaned up expired OAuth states', { count: result.count });
    }

    return result.count;
  }
}

export const oauthService = new OAuthService();
