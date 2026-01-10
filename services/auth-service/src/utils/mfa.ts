import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "crypto";
import { authenticator } from "otplib";
import { config } from "../config/index.js";

authenticator.options = { digits: 6, step: 30, window: 1 };

export class MfaUtils {
  private static readonly ALGORITHM = "aes-256-gcm";
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;
  private static readonly BACKUP_CODE_LENGTH = 8;
  private static readonly BACKUP_CODE_COUNT = 10;

  private static getEncryptionKey(): Buffer {
    return createHash("sha256").update(config.mfa.encryptionKey).digest();
  }

  static generateSecret(): string {
    return authenticator.generateSecret();
  }

  static encryptSecret(secret: string): string {
    const key = this.getEncryptionKey();
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(this.ALGORITHM, key, iv, {
      authTagLength: this.AUTH_TAG_LENGTH,
    });
    let enc = cipher.update(secret, "utf8", "hex");
    enc += cipher.final("hex");
    return iv.toString("hex") + cipher.getAuthTag().toString("hex") + enc;
  }

  static decryptSecret(data: string): string {
    const key = this.getEncryptionKey();
    const iv = Buffer.from(data.slice(0, 32), "hex");
    const tag = Buffer.from(data.slice(32, 64), "hex");
    const enc = data.slice(64);
    const dec = createDecipheriv(this.ALGORITHM, key, iv, {
      authTagLength: this.AUTH_TAG_LENGTH,
    });
    dec.setAuthTag(tag);
    return dec.update(enc, "hex", "utf8") + dec.final("utf8");
  }

  static generateOtpAuthUrl(secret: string, email: string): string {
    return authenticator.keyuri(email, config.mfa.issuer, secret);
  }

  static verifyToken(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch {
      return false;
    }
  }

  static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < this.BACKUP_CODE_COUNT; i++) {
      const c = randomBytes(4).toString("hex").toUpperCase();
      codes.push(c.slice(0, 4) + "-" + c.slice(4));
    }
    return codes;
  }

  static hashBackupCode(code: string): string {
    return createHash("sha256")
      .update(code.replace(/-/g, "").toUpperCase())
      .digest("hex");
  }

  static hashBackupCodes(codes: string[]): string[] {
    return codes.map((c) => this.hashBackupCode(c));
  }

  static verifyBackupCode(
    code: string,
    hashes: string[],
  ): { valid: boolean; index: number } {
    const h = this.hashBackupCode(code);
    const i = hashes.findIndex((x) => x === h);
    return { valid: i !== -1, index: i };
  }

  static generateSetupToken(): string {
    return randomBytes(32).toString("hex");
  }
}

export const mfaUtils = new MfaUtils();
