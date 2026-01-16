import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  ResendVerificationSchema,
} from '../dtos/auth.dto.js';
import { BadRequestError } from '../utils/errors.js';

export class AuthController {
  /**
   * POST /auth/register
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = RegisterSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await authService.register(input, ipAddress);

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully. Please verify your email.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   * Authenticate user and return tokens
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = LoginSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.login(input, ipAddress, userAgent);

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const input = RefreshTokenSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.refresh(input.refreshToken, ipAddress, userAgent);

      res.json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Invalidate tokens and logout user
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      await authService.logout(req.user.userId);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/me
   * Get current authenticated user
   */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const user = await authService.getCurrentUser(req.user.userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/forgot-password
   * Request password reset
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const input = ForgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(input);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/reset-password
   * Reset password using token
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const input = ResetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(input);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/verify-email
   * Verify email using token
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const input = VerifyEmailSchema.parse(req.body);
      const result = await authService.verifyEmail(input);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/resend-verification
   * Resend email verification
   */
  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const input = ResendVerificationSchema.parse(req.body);
      const result = await authService.resendVerification(input.email);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
