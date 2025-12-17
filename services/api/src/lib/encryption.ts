import crypto from 'crypto';
import { config } from '../config/index.js';

/**
 * HIPAA-Compliant Encryption Library
 * Implements AES-256-GCM encryption for PHI data
 * Compliant with HIPAA Encryption Standard (45 CFR § 164.312(a)(2)(iv))
 */

// AES-256-GCM configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits
const KEY_LENGTH = 32; // 256 bits
const ITERATIONS = 100000; // PBKDF2 iterations

/**
 * Derive encryption key from master key using PBKDF2
 */
function deriveKey(masterKey: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    masterKey,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    'sha256'
  );
}

/**
 * Generate a random salt
 */
function generateSalt(): Buffer {
  return crypto.randomBytes(SALT_LENGTH);
}

/**
 * Generate a random IV
 */
function generateIV(): Buffer {
  return crypto.randomBytes(IV_LENGTH);
}

/**
 * Encrypt data using AES-256-GCM
 * @param plaintext - Data to encrypt
 * @param masterKey - Master encryption key (defaults to config)
 * @returns Encrypted data as base64 string with format: salt:iv:authTag:ciphertext
 */
export function encrypt(plaintext: string, masterKey?: string): string {
  try {
    const key = masterKey || config.encryption.key;

    if (!key || key.length < 32) {
      throw new Error('Encryption key must be at least 32 characters');
    }

    // Generate salt and derive key
    const salt = generateSalt();
    const derivedKey = deriveKey(key, salt);

    // Generate IV
    const iv = generateIV();

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);

    // Encrypt data
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Get auth tag
    const authTag = cipher.getAuthTag();

    // Combine salt:iv:authTag:ciphertext
    return `${salt.toString('base64')}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - Encrypted data in format: salt:iv:authTag:ciphertext
 * @param masterKey - Master encryption key (defaults to config)
 * @returns Decrypted plaintext
 */
export function decrypt(encryptedData: string, masterKey?: string): string {
  try {
    const key = masterKey || config.encryption.key;

    if (!key || key.length < 32) {
      throw new Error('Encryption key must be at least 32 characters');
    }

    // Parse encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format');
    }

    const salt = Buffer.from(parts[0], 'base64');
    const iv = Buffer.from(parts[1], 'base64');
    const authTag = Buffer.from(parts[2], 'base64');
    const encrypted = parts[3];

    // Derive key
    const derivedKey = deriveKey(key, salt);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(authTag);

    // Decrypt data
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash data using SHA-256 (one-way, for PII like SSN)
 * @param data - Data to hash
 * @param salt - Optional salt (generates random if not provided)
 * @returns Hash in format: salt:hash
 */
export function hash(data: string, salt?: string): string {
  const saltBuffer = salt ? Buffer.from(salt, 'base64') : generateSalt();
  const hash = crypto.pbkdf2Sync(data, saltBuffer, ITERATIONS, 64, 'sha256');

  return `${saltBuffer.toString('base64')}:${hash.toString('base64')}`;
}

/**
 * Verify hashed data
 * @param data - Original data to verify
 * @param hashedData - Hashed data in format: salt:hash
 * @returns True if data matches hash
 */
export function verifyHash(data: string, hashedData: string): boolean {
  try {
    const parts = hashedData.split(':');
    if (parts.length !== 2) {
      return false;
    }

    const salt = parts[0];
    const newHash = hash(data, salt);

    return crypto.timingSafeEqual(
      Buffer.from(hashedData),
      Buffer.from(newHash)
    );
  } catch {
    return false;
  }
}

/**
 * Encrypt object fields
 * @param obj - Object to encrypt
 * @param fields - Array of field names to encrypt
 * @returns New object with encrypted fields
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T,
  fields: Array<keyof T>
): T {
  const result = { ...obj };

  for (const field of fields) {
    if (result[field] !== null && result[field] !== undefined) {
      const value = String(result[field]);
      result[field] = encrypt(value) as any;
    }
  }

  return result;
}

/**
 * Decrypt object fields
 * @param obj - Object with encrypted fields
 * @param fields - Array of field names to decrypt
 * @returns New object with decrypted fields
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T,
  fields: Array<keyof T>
): T {
  const result = { ...obj };

  for (const field of fields) {
    if (result[field] !== null && result[field] !== undefined) {
      try {
        result[field] = decrypt(String(result[field])) as any;
      } catch (error) {
        console.error(`Failed to decrypt field: ${String(field)}`, error);
        // Keep encrypted value if decryption fails
      }
    }
  }

  return result;
}

/**
 * Hash object fields (one-way)
 * @param obj - Object to hash
 * @param fields - Array of field names to hash
 * @returns New object with hashed fields
 */
export function hashFields<T extends Record<string, any>>(
  obj: T,
  fields: Array<keyof T>
): T {
  const result = { ...obj };

  for (const field of fields) {
    if (result[field] !== null && result[field] !== undefined) {
      const value = String(result[field]);
      result[field] = hash(value) as any;
    }
  }

  return result;
}

/**
 * Generate a secure random token
 * @param length - Token length in bytes (default: 32)
 * @returns Random token as hex string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure random code (numeric)
 * @param length - Code length (default: 6)
 * @returns Random numeric code
 */
export function generateSecureCode(length: number = 6): string {
  const max = Math.pow(10, length);
  const code = crypto.randomInt(0, max);
  return code.toString().padStart(length, '0');
}

/**
 * Mask sensitive data for display
 * @param data - Data to mask
 * @param visibleStart - Number of characters visible at start (default: 0)
 * @param visibleEnd - Number of characters visible at end (default: 4)
 * @returns Masked string
 */
export function maskSensitiveData(
  data: string,
  visibleStart: number = 0,
  visibleEnd: number = 4
): string {
  if (!data || data.length <= visibleStart + visibleEnd) {
    return '***';
  }

  const start = data.substring(0, visibleStart);
  const end = data.substring(data.length - visibleEnd);
  const masked = '*'.repeat(Math.min(data.length - visibleStart - visibleEnd, 8));

  return `${start}${masked}${end}`;
}

/**
 * Azure Key Vault Integration (placeholder for production)
 * In production, use Azure Key Vault SDK to retrieve encryption keys
 */
export const keyVault = {
  /**
   * Retrieve encryption key from Azure Key Vault
   * @param keyName - Name of the key in Key Vault
   * @returns Encryption key
   */
  async getEncryptionKey(keyName: string): Promise<string> {
    // TODO: Implement Azure Key Vault integration
    // For now, return config key
    console.warn('Azure Key Vault not configured, using config key');
    return config.encryption.key;
  },

  /**
   * Store encryption key in Azure Key Vault
   * @param keyName - Name of the key
   * @param keyValue - Key value to store
   */
  async setEncryptionKey(keyName: string, keyValue: string): Promise<void> {
    // TODO: Implement Azure Key Vault integration
    console.warn('Azure Key Vault not configured, key not stored');
  },

  /**
   * Rotate encryption key
   * @param keyName - Name of the key to rotate
   * @returns New key value
   */
  async rotateKey(keyName: string): Promise<string> {
    // TODO: Implement key rotation with Azure Key Vault
    console.warn('Key rotation not implemented');
    return generateSecureToken(32);
  },
};

/**
 * Data encryption helper for PHI fields
 */
export const phiEncryption = {
  /**
   * Common PHI fields that require encryption
   */
  PHI_FIELDS: [
    'ssn',
    'socialSecurityNumber',
    'dateOfBirth',
    'phone',
    'phoneNumber',
    'email',
    'address',
    'streetAddress',
    'city',
    'state',
    'zipCode',
    'postalCode',
    'medicalRecordNumber',
    'insuranceId',
    'policyNumber',
    'diagnosis',
    'treatment',
    'medication',
    'notes',
    'symptoms',
    'allergies',
  ] as const,

  /**
   * Check if field name is PHI
   */
  isPHIField(fieldName: string): boolean {
    const lowerName = fieldName.toLowerCase();
    return this.PHI_FIELDS.some(phi =>
      lowerName.includes(phi.toLowerCase())
    );
  },

  /**
   * Auto-encrypt PHI fields in object
   */
  autoEncrypt<T extends Record<string, any>>(obj: T): T {
    const result = { ...obj };
    const fieldsToEncrypt: string[] = [];

    for (const key in result) {
      if (this.isPHIField(key) && result[key] !== null && result[key] !== undefined) {
        fieldsToEncrypt.push(key);
      }
    }

    return encryptFields(result, fieldsToEncrypt as any);
  },

  /**
   * Auto-decrypt PHI fields in object
   */
  autoDecrypt<T extends Record<string, any>>(obj: T): T {
    const result = { ...obj };
    const fieldsToDecrypt: string[] = [];

    for (const key in result) {
      if (this.isPHIField(key) && result[key] !== null && result[key] !== undefined) {
        fieldsToDecrypt.push(key);
      }
    }

    return decryptFields(result, fieldsToDecrypt as any);
  },
};

export default {
  encrypt,
  decrypt,
  hash,
  verifyHash,
  encryptFields,
  decryptFields,
  hashFields,
  generateSecureToken,
  generateSecureCode,
  maskSensitiveData,
  keyVault,
  phiEncryption,
};
