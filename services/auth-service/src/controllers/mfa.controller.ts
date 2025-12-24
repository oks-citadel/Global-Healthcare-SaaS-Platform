import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { mfaService } from "../services/mfa.service.js";
import {
  VerifyMfaSetupSchema,
  DisableMfaSchema,
  RegenerateBackupCodesSchema,
  VerifyMfaLoginSchema,
} from "../dtos/mfa.dto.js";
import { BadRequestError } from "../utils/errors.js";

export class MfaController {
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new BadRequestError("User not authenticated");
      const status = await mfaService.getMfaStatus(req.user.userId);
      res.json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  }

  async enableMfa(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new BadRequestError("User not authenticated");
      const result = await mfaService.enableMfa(req.user.userId);
      res.json({
        success: true,
        data: result,
        message: "Scan the QR code with your authenticator app",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifySetup(req: Request, res: Response, next: NextFunction) {
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
  }

  async disableMfa(req: Request, res: Response, next: NextFunction) {
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
  }

  async regenerateBackupCodes(req: Request, res: Response, next: NextFunction) {
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
  }

  async verifyMfaLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const input = VerifyMfaLoginSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const userId = await mfaService.verifyLoginMfa(
        input.mfaToken,
        input.code,
      );
      // Complete login and return tokens
      const result = await authService.completeMfaLogin(
        userId,
        ipAddress,
        userAgent,
      );
      res.json({ success: true, data: result, message: "Login successful" });
    } catch (error) {
      next(error);
    }
  }
}

export const mfaController = new MfaController();
