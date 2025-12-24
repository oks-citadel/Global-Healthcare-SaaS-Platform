import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
} from "../dtos/auth.dto.js";
import { BadRequestError } from "@healthcare/shared-lib/errors";

/**
 * Auth Controller
 *
 * Handles authentication endpoints for the auth-service microservice.
 * Migrated from: services/api/src/controllers/auth.controller.ts
 */
export const authController = {
  /**
   * POST /auth/register
   * Register a new user
   */
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RegisterSchema.parse(req.body);
      const result = await authService.register(input);

      // Emit event for other services
      await authService.emitEvent("auth.user.registered", {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        timestamp: new Date().toISOString(),
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/login
   * Authenticate user and return tokens
   */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = LoginSchema.parse(req.body);
      const result = await authService.login(input);

      // Emit session started event
      await authService.emitEvent("auth.session.started", {
        userId: result.user.id,
        sessionId: result.sessionId,
        timestamp: new Date().toISOString(),
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RefreshTokenSchema.parse(req.body);
      const result = await authService.refresh(input.refreshToken);
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
        throw new BadRequestError("User not authenticated");
      }

      await authService.logout(req.user.userId);

      // Emit session ended event
      await authService.emitEvent("auth.session.ended", {
        userId: req.user.userId,
        timestamp: new Date().toISOString(),
      });

      res.json({ message: "Logged out successfully" });
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
        throw new BadRequestError("User not authenticated");
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

  /**
   * POST /auth/verify-token
   * Verify a token (for inter-service communication)
   */
  verifyToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      if (!token) {
        throw new BadRequestError("Token is required");
      }
      const payload = await authService.verifyToken(token);
      res.json({ valid: true, payload });
    } catch (error) {
      res.json({ valid: false, error: (error as Error).message });
    }
  },
};
