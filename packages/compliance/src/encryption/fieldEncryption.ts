/**
 * Field-Level Encryption for PHI/PII
 * HIPAA § 164.312(a)(2)(iv), GDPR Article 32, POPIA Section 19
 */

import * as crypto from 'crypto';
import type { CipherGCM, DecipherGCM } from 'crypto';

export class FieldEncryption {
  private algorithm = 'aes-256-gcm' as const;
  private keyLength = 32; // 256 bits
  private ivLength = 16; // 128 bits
  private tagLength = 16;
  private saltLength = 64;

  constructor(private masterKey: string) {
    if (!masterKey || masterKey.length < 32) {
      throw new Error('Master key must be at least 32 characters');
    }
  }

  /**
   * Encrypt sensitive field data
   */
  encrypt(plaintext: string, context?: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.saltLength);

    // Derive key from master key + salt
    const key = crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      100000,
      this.keyLength,
      'sha512'
    );

    const cipher = crypto.createCipheriv(this.algorithm, key, iv, {
      authTagLength: this.tagLength,
    }) as CipherGCM;

    // Add authenticated data if context provided
    if (context) {
      cipher.setAAD(Buffer.from(context, 'utf8'));
    }

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine: salt + iv + authTag + encrypted
    const combined = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encrypted, 'hex')
    ]);

    return combined.toString('base64');
  }

  /**
   * Decrypt sensitive field data
   */
  decrypt(ciphertext: string, context?: string): string {
    const combined = Buffer.from(ciphertext, 'base64');

    // Extract components
    const salt = combined.subarray(0, this.saltLength);
    const iv = combined.subarray(this.saltLength, this.saltLength + this.ivLength);
    const authTag = combined.subarray(
      this.saltLength + this.ivLength,
      this.saltLength + this.ivLength + this.tagLength
    );
    const encrypted = combined.subarray(this.saltLength + this.ivLength + this.tagLength);

    // Derive key
    const key = crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      100000,
      this.keyLength,
      'sha512'
    );

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv, {
      authTagLength: this.tagLength,
    }) as DecipherGCM;
    decipher.setAuthTag(authTag);

    if (context) {
      decipher.setAAD(Buffer.from(context, 'utf8'));
    }

    let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Hash PII for pseudonymization (GDPR Article 4(5))
   */
  pseudonymize(data: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    return crypto
      .createHmac('sha256', this.masterKey)
      .update(data + actualSalt)
      .digest('hex');
  }

  /**
   * Encrypt object fields selectively
   */
  encryptFields<T extends Record<string, unknown>>(
    obj: T,
    fields: Array<keyof T>,
    context?: string
  ): T {
    const result = { ...obj } as Record<string, unknown>;

    for (const field of fields) {
      const key = field as string;
      if (result[key] !== undefined && result[key] !== null) {
        const value = String(result[key]);
        result[key] = this.encrypt(value, context);
      }
    }

    return result as T;
  }

  /**
   * Decrypt object fields
   */
  decryptFields<T extends Record<string, unknown>>(
    obj: T,
    fields: Array<keyof T>,
    context?: string
  ): T {
    const result = { ...obj } as Record<string, unknown>;

    for (const field of fields) {
      const key = field as string;
      if (result[key]) {
        result[key] = this.decrypt(String(result[key]), context);
      }
    }

    return result as T;
  }
}

export default FieldEncryption;
