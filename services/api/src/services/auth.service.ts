// Use CommonJS-compatible imports for modules without default exports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs') as typeof import('bcryptjs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require('jsonwebtoken') as typeof import('jsonwebtoken');
import type { SignOptions } from 'jsonwebtoken';

import { config } from '../config/index.js';
import { RegisterInput, LoginInput, AuthResponse } from '../dtos/auth.dto.js';
import { UserResponse } from '../dtos/user.dto.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../lib/prisma.js';
import { isDemoMode, demoStore } from '../lib/demo-store.js';
import type { Prisma } from '../generated/client/index.js';

/**
 * Interface representing the internal registration input with optional role
 * Role is determined server-side, not from client input
 */
interface InternalRegisterInput extends RegisterInput {
  role?: string;
}

/**
 * User record type from Prisma for database users
 */
type DatabaseUser = Prisma.UserGetPayload<object>;

/**
 * Demo user structure from the demo store
 */
interface DemoUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Union type for users from either database or demo store
 */
type UserRecord = DatabaseUser | DemoUser;

/**
 * JWT payload structure for refresh tokens
 */
interface RefreshTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Type guard to check if a JWT payload is a valid refresh token payload
 */
function isRefreshTokenPayload(payload: unknown): payload is RefreshTokenPayload {
  if (payload === null || typeof payload !== 'object') {
    return false;
  }
  const obj = payload as Record<string, unknown>;
  return typeof obj.userId === 'string';
}

/**
 * Format a date to ISO string, handling both Date objects and potential undefined/null
 */
function formatDate(date: Date | undefined | null): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date().toISOString();
}

export const authService = {
  /**
   * Register a new user
   */
  async register(input: InternalRegisterInput): Promise<AuthResponse> {
    // Demo mode - use in-memory store
    if (isDemoMode) {
      const existingUser = demoStore.users.findByEmail(input.email);
      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      const user = await demoStore.users.create({
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: input.role,
      });

      logger.info('User registered (demo mode)', { userId: user.id, email: input.email });
      return this.generateTokens(user);
    }

    // Production mode - use database
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash(input.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        role: 'patient', // Always default to patient - role assignment is server-side only
        status: 'active',
        emailVerified: false,
      },
    });

    logger.info('User registered', { userId: user.id, email: input.email });

    // Generate tokens
    return this.generateTokens(user);
  },

  /**
   * Authenticate user
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    // Demo mode - use in-memory store
    if (isDemoMode) {
      const user = demoStore.users.findByEmail(input.email);
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const validPassword: boolean = await bcrypt.compare(input.password, user.password);
      if (!validPassword) {
        throw new UnauthorizedError('Invalid credentials');
      }

      logger.info('User logged in (demo mode)', { userId: user.id });
      return this.generateTokens(user);
    }

    // Production mode - use database
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const validPassword: boolean = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    logger.info('User logged in', { userId: user.id });

    return this.generateTokens(user);
  },

  /**
   * Refresh access token
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    // Demo mode - use in-memory store
    if (isDemoMode) {
      const tokenRecord = demoStore.refreshTokens.findByToken(refreshToken);
      if (!tokenRecord) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      if (new Date() > tokenRecord.expiresAt) {
        demoStore.refreshTokens.delete(refreshToken);
        throw new UnauthorizedError('Refresh token expired');
      }

      try {
        jwt.verify(refreshToken, config.jwt.secret);
        const user = tokenRecord.user;

        if (!user) {
          throw new UnauthorizedError('User not found');
        }

        demoStore.refreshTokens.delete(refreshToken);
        return this.generateTokens(user);
      } catch {
        throw new UnauthorizedError('Invalid refresh token');
      }
    }

    // Production mode - use database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      await prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new UnauthorizedError('Refresh token expired');
    }

    try {
      const payload: unknown = jwt.verify(refreshToken, config.jwt.secret);

      // Validate payload structure
      if (!isRefreshTokenPayload(payload)) {
        throw new UnauthorizedError('Invalid refresh token payload');
      }

      const user = tokenRecord.user;

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Remove old refresh token
      await prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  },

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    // Demo mode - use in-memory store
    if (isDemoMode) {
      demoStore.refreshTokens.deleteByUserId(userId);
      logger.info('User logged out (demo mode)', { userId });
      return;
    }

    // Production mode - use database
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
    logger.info('User logged out', { userId });
  },

  /**
   * Get current user
   */
  async getCurrentUser(userId: string): Promise<UserResponse> {
    // Demo mode - use in-memory store
    if (isDemoMode) {
      const user = demoStore.users.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? undefined,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    }

    // Production mode - use database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? undefined,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  /**
   * Get available roles
   */
  async getRoles(): Promise<{ roles: string[] }> {
    return {
      roles: ['patient', 'provider', 'admin'],
    };
  },

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(user: UserRecord): Promise<AuthResponse> {
    // JWT sign options - cast to SignOptions to work with the strict typing
    // expiresIn expects StringValue | number, where StringValue is a branded type from 'ms'
    // Using SignOptions type directly with type assertion for the string values
    const accessTokenOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn']
    };
    const refreshTokenOptions: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn']
    };

    const accessToken: string = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      accessTokenOptions
    );

    const refreshToken: string = jwt.sign(
      { userId: user.id },
      config.jwt.secret,
      refreshTokenOptions
    );

    // Calculate expiration time (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Store refresh token
    if (isDemoMode) {
      demoStore.refreshTokens.create({
        token: refreshToken,
        userId: user.id,
        expiresAt,
      });
    } else {
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: formatDate(user.createdAt),
        updatedAt: formatDate(user.updatedAt),
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },
};
