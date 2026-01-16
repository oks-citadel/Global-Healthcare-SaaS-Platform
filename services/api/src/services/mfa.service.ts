// @ts-nocheck
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
} from "crypto";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { prisma } from "../lib/prisma.js";
import { isDemoMode, demoStore } from "../lib/demo-store.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/errors.js";
import {
  MfaSetupResponse,
  MfaStatusResponse,
  BackupCodesResponse,
  MfaRequiredResponse,
} from "../dtos/mfa.dto.js";

// Configure authenticator
authenticator.options = { digits: 6, step: 30, window: 1 };

// QR Code options
const QR_CODE_OPTIONS = {
  errorCorrectionLevel: "M" as const,
  type: "image/png" as const,
  width: 256,
  margin: 2,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
};

// MFA encryption configuration
const MFA_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const BACKUP_CODE_COUNT = 10;

interface MfaTokenPayload {
  userId: string;
  type: "mfa_challenge";
  iat?: number;
  exp?: number;
}

/**
 * Get encryption key from config
 */
function getEncryptionKey(): Buffer {
  const key = config.mfa?.encryptionKey || "default-mfa-key-for-development!";
  return createHash("sha256").update(key).digest();
}

/**
 * Encrypt TOTP secret
 */
function encryptSecret(secret: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(MFA_ALGORITHM, key, iv);
  let enc = cipher.update(secret, "utf8", "hex");
  enc += cipher.final("hex");
  return iv.toString("hex") + cipher.getAuthTag().toString("hex") + enc;
}

/**
 * Decrypt TOTP secret
 */
function decryptSecret(data: string): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(data.slice(0, 32), "hex");
  const tag = Buffer.from(data.slice(32, 64), "hex");
  const enc = data.slice(64);
  const dec = createDecipheriv(MFA_ALGORITHM, key, iv);
  dec.setAuthTag(tag);
  return dec.update(enc, "hex", "utf8") + dec.final("utf8");
}

/**
 * Generate backup codes
 */
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    const c = randomBytes(4).toString("hex").toUpperCase();
    codes.push(c.slice(0, 4) + "-" + c.slice(4));
  }
  return codes;
}

/**
 * Hash a backup code
 */
function hashBackupCode(code: string): string {
  return createHash("sha256")
    .update(code.replace(/-/g, "").toUpperCase())
    .digest("hex");
}

/**
 * Verify a backup code against hashed codes
 */
function verifyBackupCode(
  code: string,
  hashes: string[],
): { valid: boolean; index: number } {
  const h = hashBackupCode(code);
  const i = hashes.findIndex((x) => x === h);
  return { valid: i !== -1, index: i };
}

export const mfaService = {
  /**
   * Get MFA status for a user
   */
  async getMfaStatus(userId: string): Promise<MfaStatusResponse> {
    if (isDemoMode) {
      const user = demoStore.users.findById(userId);
      if (!user) throw new NotFoundError("User not found");
      return {
        enabled: user.mfaEnabled || false,
        verifiedAt: user.mfaVerifiedAt?.toISOString(),
        backupCodesRemaining: user.mfaBackupCodes?.length || 0,
      };
    }

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
  },

  /**
   * Enable MFA for a user - returns setup data including QR code
   */
  async enableMfa(userId: string): Promise<MfaSetupResponse> {
    let email: string;
    let mfaEnabled: boolean;

    if (isDemoMode) {
      const user = demoStore.users.findById(userId);
      if (!user) throw new NotFoundError("User not found");
      if (user.mfaEnabled) throw new BadRequestError("MFA is already enabled");
      email = user.email;
      mfaEnabled = user.mfaEnabled || false;
    } else {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, mfaEnabled: true },
      });
      if (!user) throw new NotFoundError("User not found");
      if (user.mfaEnabled) throw new BadRequestError("MFA is already enabled");
      email = user.email;
      mfaEnabled = user.mfaEnabled;
    }

    // Generate TOTP secret
    const secret = authenticator.generateSecret();
    const issuer = config.mfa?.issuer || "Unified Health";
    const otpAuthUrl = authenticator.keyuri(email, issuer, secret);

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl, QR_CODE_OPTIONS);

    // Encrypt and store secret
    const encryptedSecret = encryptSecret(secret);

    if (isDemoMode) {
      demoStore.users.update(userId, { mfaSecret: encryptedSecret });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { mfaSecret: encryptedSecret },
      });
    }

    logger.info("MFA setup initiated", { userId });
    return { secret, otpAuthUrl, qrCodeDataUrl };
  },

  /**
   * Verify MFA setup with initial TOTP code
   */
  async verifyMfaSetup(
    userId: string,
    token: string,
  ): Promise<BackupCodesResponse> {
    let user: any;

    if (isDemoMode) {
      user = demoStore.users.findById(userId);
      if (!user) throw new NotFoundError("User not found");
    } else {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { mfaSecret: true, mfaEnabled: true },
      });
      if (!user) throw new NotFoundError("User not found");
    }

    if (user.mfaEnabled) throw new BadRequestError("MFA is already enabled");
    if (!user.mfaSecret) throw new BadRequestError("MFA setup not initiated");

    // Verify TOTP code
    const secret = decryptSecret(user.mfaSecret);
    const isValid = authenticator.verify({ token, secret });
    if (!isValid) throw new BadRequestError("Invalid MFA code");

    // Generate backup codes
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = backupCodes.map((c) => hashBackupCode(c));

    if (isDemoMode) {
      demoStore.users.update(userId, {
        mfaEnabled: true,
        mfaVerifiedAt: new Date(),
        mfaBackupCodes: hashedBackupCodes,
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: true,
          mfaVerifiedAt: new Date(),
          mfaBackupCodes: hashedBackupCodes,
        },
      });
    }

    logger.info("MFA enabled", { userId });
    return {
      backupCodes,
      message: "MFA enabled successfully. Save these backup codes securely.",
    };
  },

  /**
   * Disable MFA for a user
   */
  async disableMfa(
    userId: string,
    password: string,
    code: string,
  ): Promise<{ message: string }> {
    let user: any;

    if (isDemoMode) {
      user = demoStore.users.findById(userId);
      if (!user) throw new NotFoundError("User not found");
    } else {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          password: true,
          mfaEnabled: true,
          mfaSecret: true,
          mfaBackupCodes: true,
        },
      });
      if (!user) throw new NotFoundError("User not found");
    }

    if (!user.mfaEnabled) throw new BadRequestError("MFA is not enabled");

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new UnauthorizedError("Invalid password");

    // Verify MFA code or backup code
    const isCodeValid = await this.verifyMfaCodeOrBackup(
      userId,
      code,
      user.mfaSecret,
      user.mfaBackupCodes || [],
    );
    if (!isCodeValid)
      throw new BadRequestError("Invalid MFA code or backup code");

    if (isDemoMode) {
      demoStore.users.update(userId, {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
        mfaVerifiedAt: null,
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: false,
          mfaSecret: null,
          mfaBackupCodes: [],
          mfaVerifiedAt: null,
        },
      });
    }

    logger.info("MFA disabled", { userId });
    return { message: "MFA disabled successfully" };
  },

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(
    userId: string,
    password: string,
    code: string,
  ): Promise<BackupCodesResponse> {
    let user: any;

    if (isDemoMode) {
      user = demoStore.users.findById(userId);
      if (!user) throw new NotFoundError("User not found");
    } else {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true, mfaEnabled: true, mfaSecret: true },
      });
      if (!user) throw new NotFoundError("User not found");
    }

    if (!user.mfaEnabled || !user.mfaSecret)
      throw new BadRequestError("MFA is not enabled");

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new UnauthorizedError("Invalid password");

    // Verify TOTP code (backup codes cannot be used for regeneration)
    const secret = decryptSecret(user.mfaSecret);
    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) throw new BadRequestError("Invalid MFA code");

    // Generate new backup codes
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = backupCodes.map((c) => hashBackupCode(c));

    if (isDemoMode) {
      demoStore.users.update(userId, { mfaBackupCodes: hashedBackupCodes });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { mfaBackupCodes: hashedBackupCodes },
      });
    }

    logger.info("Backup codes regenerated", { userId });
    return { backupCodes, message: "New backup codes generated." };
  },

  /**
   * Generate MFA challenge token for login
   */
  generateMfaToken(userId: string): string {
    const payload: MfaTokenPayload = { userId, type: "mfa_challenge" };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: "5m" });
  },

  /**
   * Verify MFA challenge token
   */
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
  },

  /**
   * Verify MFA code during login
   */
  async verifyLoginMfa(mfaToken: string, code: string): Promise<string> {
    const payload = this.verifyMfaToken(mfaToken);

    let user: any;
    if (isDemoMode) {
      user = demoStore.users.findById(payload.userId);
    } else {
      user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { mfaSecret: true, mfaBackupCodes: true },
      });
    }

    if (!user || !user.mfaSecret)
      throw new UnauthorizedError("Invalid MFA configuration");

    const isValid = await this.verifyMfaCodeOrBackup(
      payload.userId,
      code,
      user.mfaSecret,
      user.mfaBackupCodes || [],
    );
    if (!isValid) throw new BadRequestError("Invalid MFA code");

    return payload.userId;
  },

  /**
   * Check if user has MFA enabled
   */
  async checkMfaRequired(userId: string): Promise<boolean> {
    if (isDemoMode) {
      const user = demoStore.users.findById(userId);
      return user?.mfaEnabled || false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaEnabled: true },
    });
    return user?.mfaEnabled || false;
  },

  /**
   * Verify TOTP code or backup code
   */
  async verifyMfaCodeOrBackup(
    userId: string,
    code: string,
    encryptedSecret: string,
    hashedBackupCodes: string[],
  ): Promise<boolean> {
    // Try TOTP first
    const secret = decryptSecret(encryptedSecret);
    if (authenticator.verify({ token: code, secret })) return true;

    // Try backup code
    const backupResult = verifyBackupCode(code, hashedBackupCodes);
    if (backupResult.valid) {
      // Remove used backup code
      const newBackupCodes = [...hashedBackupCodes];
      newBackupCodes.splice(backupResult.index, 1);

      if (isDemoMode) {
        demoStore.users.update(userId, { mfaBackupCodes: newBackupCodes });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { mfaBackupCodes: newBackupCodes },
        });
      }

      logger.info("Backup code used", {
        userId,
        remaining: newBackupCodes.length,
      });
      return true;
    }

    return false;
  },
};
