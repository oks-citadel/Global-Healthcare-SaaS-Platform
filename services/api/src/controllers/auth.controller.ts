import { Request, Response, NextFunction, CookieOptions } from 'express';
import { authService } from '../services/auth.service.js';
import { RegisterSchema, LoginSchema } from '../dtos/auth.dto.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Secure cookie configuration for JWT tokens
 * httpOnly: true - Prevents XSS attacks from accessing tokens via JavaScript
 * secure: true - Only sent over HTTPS in production
 * sameSite: 'strict' - Prevents CSRF attacks
 */
const isProduction = process.env.NODE_ENV === 'production';

const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
};

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * Set auth tokens as httpOnly cookies
 */
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
};

/**
 * Clear auth cookies on logout
 */
const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

export const authController = {
  /**
   * POST /auth/register
   * Register a new user
   */
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RegisterSchema.parse(req.body);
      const result = await authService.register(input);

      // Set tokens as httpOnly cookies for security
      if (result.tokens?.accessToken && result.tokens?.refreshToken) {
        setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      }

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/login
   * Authenticate user and return tokens
   * Tokens are set as httpOnly cookies (XSS-safe) and also returned in response body
   */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = LoginSchema.parse(req.body);
      const result = await authService.login(input);

      // Set tokens as httpOnly cookies for security
      if (result.tokens?.accessToken && result.tokens?.refreshToken) {
        setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token from cookie or body
   */
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try to get refresh token from cookie first, then from body
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        throw new BadRequestError('Refresh token required');
      }

      const result = await authService.refresh(refreshToken);

      // Set new tokens as httpOnly cookies
      if (result.tokens?.accessToken && result.tokens?.refreshToken) {
        setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/logout
   * Invalidate tokens and logout user
   */
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }
      await authService.logout(req.user.userId);

      // Clear httpOnly cookies
      clearAuthCookies(res);

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /auth/me
   * Get current authenticated user
   */
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }
      const user = await authService.getCurrentUser(req.user.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /roles
   * List available roles (admin only)
   */
  getRoles: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await authService.getRoles();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  },
};
