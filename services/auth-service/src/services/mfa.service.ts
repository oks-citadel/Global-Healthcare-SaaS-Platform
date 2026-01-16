import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";
import { MfaUtils } from "../utils/mfa.js";
import { config } from "../config/index.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/errors.js";
import {
  MfaSetupResponse,
  MfaStatusResponse,
  BackupCodesResponse,
} from "../dtos/mfa.dto.js";

interface MfaTokenPayload {
  userId: string;
  type: "mfa_challenge";
  iat?: number;
  exp?: number;
}

export class MfaService {
  private static readonly MFA_TOKEN_EXPIRY = "5m";

  async getMfaStatus(userId: string): Promise<MfaStatusResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaEnabled: true, mfaVerifiedAt: true, mfaBackupCodes: true },
    });
    if (!user) throw new NotFoundError("User not found");
    return {
      enabled: user.mfaEnabled,
      verifiedAt: user.mfaVerifiedAt?.toISOString(),
      backupCodesRemaining: user.mfaBackupCodes?.length || 0,
    };
  }

  async enableMfa(userId: string): Promise<MfaSetupResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, mfaEnabled: true },
    });
    if (!user) throw new NotFoundError("User not found");
    if (user.mfaEnabled) throw new BadRequestError("MFA is already enabled");
    const secret = MfaUtils.generateSecret();
    const otpAuthUrl = MfaUtils.generateOtpAuthUrl(secret, user.email);
    const encryptedSecret = MfaUtils.encryptSecret(secret);
    await prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: encryptedSecret },
    });
    logger.info("MFA setup initiated", { userId });
    return { secret, otpAuthUrl };
  }

  async verifyMfaSetup(
    userId: string,
    token: string,
  ): Promise<BackupCodesResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true },
    });
    if (!user) throw new NotFoundError("User not found");
    if (user.mfaEnabled) throw new BadRequestError("MFA is already enabled");
    if (!user.mfaSecret) throw new BadRequestError("MFA setup not initiated");
    const secret = MfaUtils.decryptSecret(user.mfaSecret);
    if (!MfaUtils.verifyToken(token, secret))
      throw new BadRequestError("Invalid MFA code");
    const backupCodes = MfaUtils.generateBackupCodes();
    const hashedBackupCodes = MfaUtils.hashBackupCodes(backupCodes);
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaVerifiedAt: new Date(),
        mfaBackupCodes: hashedBackupCodes,
      },
    });
    logger.info("MFA enabled", { userId });
    return {
      backupCodes,
      message: "MFA enabled successfully. Save these backup codes securely.",
    };
  }

  async disableMfa(
    userId: string,
    password: string,
    code: string,
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        passwordHash: true,
        mfaEnabled: true,
        mfaSecret: true,
        mfaBackupCodes: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    if (!user.mfaEnabled) throw new BadRequestError("MFA is not enabled");
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) throw new UnauthorizedError("Invalid password");
    const isCodeValid = await this.verifyMfaCodeOrBackup(
      userId,
      code,
      user.mfaSecret!,
      user.mfaBackupCodes,
    );
    if (!isCodeValid)
      throw new BadRequestError("Invalid MFA code or backup code");
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
        mfaVerifiedAt: null,
      },
    });
    logger.info("MFA disabled", { userId });
    return { message: "MFA disabled successfully" };
  }

  async regenerateBackupCodes(
    userId: string,
    password: string,
    code: string,
  ): Promise<BackupCodesResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true, mfaEnabled: true, mfaSecret: true },
    });
    if (!user) throw new NotFoundError("User not found");
    if (!user.mfaEnabled || !user.mfaSecret)
      throw new BadRequestError("MFA is not enabled");
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) throw new UnauthorizedError("Invalid password");
    const secret = MfaUtils.decryptSecret(user.mfaSecret);
    if (!MfaUtils.verifyToken(code, secret))
      throw new BadRequestError("Invalid MFA code");
    const backupCodes = MfaUtils.generateBackupCodes();
    const hashedBackupCodes = MfaUtils.hashBackupCodes(backupCodes);
    await prisma.user.update({
      where: { id: userId },
      data: { mfaBackupCodes: hashedBackupCodes },
    });
    logger.info("Backup codes regenerated", { userId });
    return { backupCodes, message: "New backup codes generated." };
  }

  generateMfaToken(userId: string): string {
    const payload: MfaTokenPayload = { userId, type: "mfa_challenge" };
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: MfaService.MFA_TOKEN_EXPIRY,
    });
  }

  verifyMfaToken(token: string): MfaTokenPayload {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as MfaTokenPayload;
      if (payload.type !== "mfa_challenge")
        throw new UnauthorizedError("Invalid MFA token");
      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw new UnauthorizedError("MFA token expired");
      throw new UnauthorizedError("Invalid MFA token");
    }
  }

  async verifyLoginMfa(mfaToken: string, code: string): Promise<string> {
    const payload = this.verifyMfaToken(mfaToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { mfaSecret: true, mfaBackupCodes: true },
    });
    if (!user || !user.mfaSecret)
      throw new UnauthorizedError("Invalid MFA configuration");
    const isValid = await this.verifyMfaCodeOrBackup(
      payload.userId,
      code,
      user.mfaSecret,
      user.mfaBackupCodes,
    );
    if (!isValid) throw new BadRequestError("Invalid MFA code");
    return payload.userId;
  }

  private async verifyMfaCodeOrBackup(
    userId: string,
    code: string,
    encryptedSecret: string,
    hashedBackupCodes: string[],
  ): Promise<boolean> {
    const secret = MfaUtils.decryptSecret(encryptedSecret);
    if (MfaUtils.verifyToken(code, secret)) return true;
    const backupResult = MfaUtils.verifyBackupCode(code, hashedBackupCodes);
    if (backupResult.valid) {
      const newBackupCodes = [...hashedBackupCodes];
      newBackupCodes.splice(backupResult.index, 1);
      await prisma.user.update({
        where: { id: userId },
        data: { mfaBackupCodes: newBackupCodes },
      });
      logger.info("Backup code used", {
        userId,
        remaining: newBackupCodes.length,
      });
      return true;
    }
    return false;
  }
}

export const mfaService = new MfaService();
