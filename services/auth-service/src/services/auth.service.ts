import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { config } from "../config/index.js";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  TooManyRequestsError,
} from "../utils/errors.js";
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
  UserResponse,
  JwtPayload,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../dtos/auth.dto.js";
import { MfaRequiredResponse } from "../dtos/mfa.dto.js";

export class AuthService {
  /**
   * Register a new user
   */
  async register(
    input: RegisterInput,
    ipAddress?: string,
  ): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      input.password,
      config.security.bcryptRounds,
    );

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone || null,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        role: input.role || "patient",
        status: "active",
        emailVerified: false,
        lastLoginIp: ipAddress,
      },
    });

    logger.info("User registered", { userId: user.id, email: input.email });

    // Create email verification token
    await this.createEmailVerificationToken(user.id);

    // Generate tokens
    return this.generateTokens(user, ipAddress);
  }

  /**
   * Authenticate user
   */
  async login(
    input: LoginInput,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse | MfaRequiredResponse> {
    const email = input.email.toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000,
      );
      throw new TooManyRequestsError(
        `Account is locked. Try again in ${minutesLeft} minute(s)`,
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!validPassword) {
      // Increment failed login attempts
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if account is suspended
    if (user.status === "suspended") {
      throw new UnauthorizedError("Account has been suspended");
    }

    if (user.status === "inactive") {
      throw new UnauthorizedError("Account is inactive");
    }

    // Reset failed login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    logger.info("User logged in", { userId: user.id, email, ipAddress });

    // Generate tokens
    return this.generateTokens(user, ipAddress, userAgent);
  }

  /**
   * Refresh access token using refresh token
   */
  async refresh(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    // Find token record
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Check if token is revoked
    if (tokenRecord.isRevoked) {
      // Token reuse detected - revoke entire token family
      await this.revokeTokenFamily(tokenRecord.tokenFamily);
      logger.warn("Token reuse detected - revoking token family", {
        userId: tokenRecord.userId,
        tokenFamily: tokenRecord.tokenFamily,
      });
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      await prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new UnauthorizedError("Refresh token expired");
    }

    // Verify JWT signature
    try {
      const signOptions =
        config.jwt.algorithm === "RS256"
          ? { algorithms: ["RS256" as const] }
          : { algorithms: ["HS256" as const] };

      const secret =
        config.jwt.algorithm === "RS256"
          ? config.jwt.publicKey!
          : config.jwt.secret;

      jwt.verify(refreshToken, secret, signOptions);
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = tokenRecord.user;

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Revoke old refresh token (token rotation)
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });

    logger.info("Access token refreshed", { userId: user.id });

    // Generate new tokens with same token family
    return this.generateTokens(
      user,
      ipAddress,
      userAgent,
      tokenRecord.tokenFamily,
    );
  }

  /**
   * Logout user - revoke all refresh tokens
   */
  async logout(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    logger.info("User logged out", { userId });
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.toUserResponse(user);
  }

  /**
   * Forgot password - send reset token
   */
  async forgotPassword(
    input: ForgotPasswordInput,
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    // Don't reveal if email exists
    if (!user) {
      return { message: "If the email exists, a reset link has been sent" };
    }

    // Create password reset token
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() + config.security.passwordResetExpiry,
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    logger.info("Password reset requested", { userId: user.id });

    // TODO: Send email with reset token
    // In production, integrate with email service (SendGrid, SES, etc.)
    logger.info("Password reset token generated", { token, userId: user.id });

    return { message: "If the email exists, a reset link has been sent" };
  }

  /**
   * Reset password using token
   */
  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    // Find token
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token: input.token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.isUsed) {
      throw new BadRequestError("Invalid or expired reset token");
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      await prisma.passwordResetToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new BadRequestError("Reset token has expired");
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(
      input.newPassword,
      config.security.bcryptRounds,
    );

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      }),
      // Revoke all refresh tokens
      prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: { isRevoked: true },
      }),
    ]);

    logger.info("Password reset successfully", { userId: tokenRecord.userId });

    return { message: "Password reset successfully" };
  }

  /**
   * Verify email
   */
  async verifyEmail(input: VerifyEmailInput): Promise<{ message: string }> {
    const tokenRecord = await prisma.emailVerificationToken.findUnique({
      where: { token: input.token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.isUsed) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    if (new Date() > tokenRecord.expiresAt) {
      await prisma.emailVerificationToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new BadRequestError("Verification token has expired");
    }

    // Update user and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerificationToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      }),
    ]);

    logger.info("Email verified", { userId: tokenRecord.userId });

    return { message: "Email verified successfully" };
  }

  /**
   * Resend email verification
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return {
        message: "If the email exists, a verification link has been sent",
      };
    }

    if (user.emailVerified) {
      throw new BadRequestError("Email is already verified");
    }

    // Delete old tokens
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new token
    await this.createEmailVerificationToken(user.id);

    return {
      message: "If the email exists, a verification link has been sent",
    };
  }

  /**
   * Complete login after MFA verification
   */
  async completeMfaLogin(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Update last login info
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    logger.info("User logged in with MFA", { userId: user.id });

    return this.generateTokens(user, ipAddress, userAgent);
  }

  // ==================== Private Methods ====================

  /**
   * Generate JWT access and refresh tokens
   */
  private async generateTokens(
    user: any,
    ipAddress?: string,
    userAgent?: string,
    tokenFamily?: string,
  ): Promise<AuthResponse> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const signOptions: jwt.SignOptions =
      config.jwt.algorithm === "RS256"
        ? {
            algorithm: "RS256",
            expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
          }
        : {
            algorithm: "HS256",
            expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
          };

    const refreshSignOptions: jwt.SignOptions =
      config.jwt.algorithm === "RS256"
        ? {
            algorithm: "RS256",
            expiresIn: config.jwt
              .refreshExpiresIn as jwt.SignOptions["expiresIn"],
          }
        : {
            algorithm: "HS256",
            expiresIn: config.jwt
              .refreshExpiresIn as jwt.SignOptions["expiresIn"],
          };

    const secret =
      config.jwt.algorithm === "RS256"
        ? config.jwt.privateKey!
        : config.jwt.secret;

    // Generate access token
    const accessToken = jwt.sign(payload, secret, signOptions);

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      secret,
      refreshSignOptions,
    );

    // Store refresh token with rotation support
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const newTokenFamily = tokenFamily || randomBytes(16).toString("hex");

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
      user: this.toUserResponse(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Handle failed login attempt
   */
  private async handleFailedLogin(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true },
    });

    if (!user) return;

    const newAttempts = user.failedLoginAttempts + 1;

    // Lock account if max attempts reached
    if (newAttempts >= config.security.maxLoginAttempts) {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(
        lockedUntil.getMinutes() + config.security.lockoutDuration,
      );

      await prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: newAttempts,
          lockedUntil,
        },
      });

      logger.warn("Account locked due to failed login attempts", { userId });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: newAttempts,
        },
      });
    }
  }

  /**
   * Revoke entire token family (for token reuse detection)
   */
  private async revokeTokenFamily(tokenFamily: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { tokenFamily },
      data: { isRevoked: true },
    });
  }

  /**
   * Create email verification token
   */
  private async createEmailVerificationToken(userId: string): Promise<void> {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() + config.security.emailVerificationExpiry,
    );

    await prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    // TODO: Send verification email
    logger.info("Email verification token created", { token, userId });
  }

  /**
   * Generate secure random token
   */
  private generateSecureToken(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Convert user to response format
   */
  private toUserResponse(user: any): UserResponse {
    return {
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
    };
  }
}

export const authService = new AuthService();
