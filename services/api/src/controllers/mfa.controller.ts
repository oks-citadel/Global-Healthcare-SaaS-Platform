// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import { mfaService } from "../services/mfa.service.js";
import { authService } from "../services/auth.service.js";
import {
  VerifyMfaSetupSchema,
  DisableMfaSchema,
  RegenerateBackupCodesSchema,
  VerifyMfaLoginSchema,
} from "../dtos/mfa.dto.js";
import { BadRequestError } from "../utils/errors.js";

export const mfaController = {
  /**
   * GET /auth/mfa/status
   * Get MFA status for the authenticated user
   */
  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new BadRequestError("User not authenticated");
      const status = await mfaService.getMfaStatus(req.user.userId);
      res.json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/mfa/enroll
   * Initiate MFA enrollment - returns secret and QR code
   */
  enableMfa: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new BadRequestError("User not authenticated");
      const result = await mfaService.enableMfa(req.user.userId);
      res.json({
        success: true,
        data: result,
        message:
          "Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/mfa/verify
   * Verify MFA setup with initial TOTP code and enable MFA
   */
  verifySetup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new BadRequestError("User not authenticated");
      const input = VerifyMfaSetupSchema.parse(req.body);
      const result = await mfaService.verifyMfaSetup(
        req.user.userId,
        input.token,
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/mfa/disable
   * Disable MFA with password and code confirmation
   */
  disableMfa: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new BadRequestError("User not authenticated");
      const input = DisableMfaSchema.parse(req.body);
      const result = await mfaService.disableMfa(
        req.user.userId,
        input.password,
        input.code,
      );
      res.json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/mfa/backup-codes/regenerate
   * Regenerate backup codes
   */
  regenerateBackupCodes: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) throw new BadRequestError("User not authenticated");
      const input = RegenerateBackupCodesSchema.parse(req.body);
      const result = await mfaService.regenerateBackupCodes(
        req.user.userId,
        input.password,
        input.code,
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/mfa/verify-login
   * Verify MFA code during login flow
   */
  verifyMfaLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = VerifyMfaLoginSchema.parse(req.body);
      const userId = await mfaService.verifyLoginMfa(
        input.mfaToken,
        input.code,
      );

      // Complete login and return tokens
      const user = await authService.getCurrentUser(userId);
      const tokens = await authService.generateTokens({ id: userId, ...user });

      res.json({
        success: true,
        data: {
          user,
          tokens,
        },
        message: "Login successful",
      });
    } catch (error) {
      next(error);
    }
  },
};
