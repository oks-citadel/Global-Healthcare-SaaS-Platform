import crypto from 'crypto';
import { logger, logSecurityEvent } from '../utils/logger.js';

/**
 * HIPAA-Compliant Field-Level Encryption Library
 * Implements AES-256-GCM encryption for sensitive PII fields
 * Compliant with HIPAA Encryption Standard (45 CFR SS 164.312(a)(2)(iv))
 *
 * Features:
 * - AES-256-GCM encryption with authenticated encryption
 * - Key rotation support with version tracking
 * - Automatic encryption/decryption for sensitive fields
 * - HIPAA audit logging
 */

// AES-256-GCM configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM (recommended)
const AUTH_TAG_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits

// Current encryption version for key rotation
const CURRENT_VERSION = 1;

// Prefix for encrypted data to identify encrypted values
const ENCRYPTED_PREFIX = 'ENC:v';

/**
 * Field encryption configuration
 */
export interface FieldEncryptionConfig {
  /** Current encryption key (must be 32 bytes / 256 bits) */
  currentKey: string;
  /** Previous encryption keys for rotation support (keyed by version) */
  previousKeys?: Map<number, string>;
  /** Current key version */
  keyVersion?: number;
}

/**
 * Sensitive PII fields that require encryption
 * Organized by model/table name
 */
export const ENCRYPTED_FIELDS: Record<string, string[]> = {
  // User/Patient PII
  User: ['phone'],
  Patient: ['emergencyContact'],

  // Home Health Service
  Caregiver: ['homeAddress', 'phone', 'email'],
  PatientHome: [
    'address',
    'addressLine2',
    'city',
    'state',
    'zipCode',
    'accessInstructions',
    'gateCode',
    'emergencyContact',
    'emergencyPhone',
  ],
  MileageEntry: ['startAddress', 'endAddress'],

  // Clinical data
  ClinicalNote: ['content'],
  Encounter: [],
  Appointment: ['notes'],
  Visit: [],
  ChatMessage: ['message'],

  // Vendor data
  Vendor: ['address'],

  // Generic sensitive fields (applied across all models)
  _global: [
    'ssn',
    'socialSecurityNumber',
    'taxId',
    'ein',
    'driverLicense',
    'passportNumber',
    'bankAccountNumber',
    'routingNumber',
    'creditCardNumber',
  ],
};

/**
 * Get the field encryption key from environment
 */
function getEncryptionKey(): string {
  const key = process.env.FIELD_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      'FIELD_ENCRYPTION_KEY or ENCRYPTION_KEY environment variable must be set'
    );
  }

  if (key.length < KEY_LENGTH) {
    throw new Error(
      `Encryption key must be at least ${KEY_LENGTH} characters (256 bits)`
    );
  }

  return key;
}

/**
 * Derive a 256-bit key from the master key using SHA-256
 * This ensures we always have exactly 32 bytes for AES-256
 */
function deriveKey(masterKey: string): Buffer {
  return crypto.createHash('sha256').update(masterKey).digest();
}

/**
 * Check if a value is encrypted (has our encryption prefix)
 */
export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && value.startsWith(ENCRYPTED_PREFIX);
}

/**
 * Encrypt a single value using AES-256-GCM
 *
 * Format: ENC:v{version}:{iv}:{authTag}:{ciphertext}
 *
 * @param plaintext - The value to encrypt
 * @param key - Optional encryption key (defaults to environment key)
 * @param version - Key version for rotation support
 * @returns Encrypted value with version prefix
 */
export function encryptField(
  plaintext: string,
  key?: string,
  version: number = CURRENT_VERSION
): string {
  try {
    if (!plaintext || plaintext.trim() === '') {
      return plaintext;
    }

    // Skip if already encrypted
    if (isEncrypted(plaintext)) {
      return plaintext;
    }

    const encryptionKey = key || getEncryptionKey();
    const derivedKey = deriveKey(encryptionKey);

    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });

    // Encrypt
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Get auth tag
    const authTag = cipher.getAuthTag();

    // Format: ENC:v{version}:{iv}:{authTag}:{ciphertext}
    return `${ENCRYPTED_PREFIX}${version}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  } catch (error) {
    logger.error('Field encryption failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error('Failed to encrypt field');
  }
}

/**
 * Decrypt a single encrypted value
 *
 * @param encryptedValue - The encrypted value with version prefix
 * @param keys - Map of key versions to keys for rotation support
 * @returns Decrypted plaintext
 */
export function decryptField(
  encryptedValue: string,
  keys?: Map<number, string>
): string {
  try {
    if (!encryptedValue || !isEncrypted(encryptedValue)) {
      return encryptedValue;
    }

    // Parse the encrypted format: ENC:v{version}:{iv}:{authTag}:{ciphertext}
    const parts = encryptedValue.split(':');
    if (parts.length !== 5) {
      throw new Error('Invalid encrypted data format');
    }

    // Extract version from "ENC:v1" -> 1
    const versionStr = parts[0] + ':' + parts[1];
    const versionMatch = versionStr.match(/ENC:v(\d+)/);
    if (!versionMatch) {
      throw new Error('Invalid version format');
    }
    const version = parseInt(versionMatch[1], 10);

    const iv = Buffer.from(parts[2], 'base64');
    const authTag = Buffer.from(parts[3], 'base64');
    const encrypted = parts[4];

    // Get the appropriate key for this version
    let encryptionKey: string;
    if (keys && keys.has(version)) {
      encryptionKey = keys.get(version)!;
    } else {
      encryptionKey = getEncryptionKey();
    }

    const derivedKey = deriveKey(encryptionKey);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    // Decrypt
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    logger.error('Field decryption failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error('Failed to decrypt field');
  }
}

/**
 * Encrypt multiple fields in an object
 *
 * @param data - Object containing fields to encrypt
 * @param fields - Array of field names to encrypt
 * @returns New object with encrypted fields
 */
export function encryptFields<T extends Record<string, unknown>>(
  data: T,
  fields: string[]
): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = { ...data };

  for (const field of fields) {
    if (field in result && result[field] != null) {
      const value = result[field];
      if (typeof value === 'string') {
        (result as Record<string, unknown>)[field] = encryptField(value);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle nested objects (like JSON fields)
        (result as Record<string, unknown>)[field] = encryptObject(
          value as Record<string, unknown>
        );
      }
    }
  }

  return result;
}

/**
 * Decrypt multiple fields in an object
 *
 * @param data - Object containing encrypted fields
 * @param fields - Array of field names to decrypt
 * @param keys - Optional map of key versions for rotation support
 * @returns New object with decrypted fields
 */
export function decryptFields<T extends Record<string, unknown>>(
  data: T,
  fields: string[],
  keys?: Map<number, string>
): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = { ...data };

  for (const field of fields) {
    if (field in result && result[field] != null) {
      const value = result[field];
      if (typeof value === 'string') {
        try {
          (result as Record<string, unknown>)[field] = decryptField(value, keys);
        } catch (error) {
          // Log but keep the original value if decryption fails
          logger.warn(`Failed to decrypt field: ${field}`, {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle nested objects
        try {
          (result as Record<string, unknown>)[field] = decryptObject(
            value as Record<string, unknown>,
            keys
          );
        } catch (error) {
          logger.warn(`Failed to decrypt nested object in field: ${field}`);
        }
      }
    }
  }

  return result;
}

/**
 * Encrypt all string values in an object (for JSON fields)
 */
export function encryptObject(
  obj: Record<string, unknown>
): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = encryptField(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = encryptObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (typeof item === 'string') {
          return encryptField(item);
        } else if (typeof item === 'object' && item !== null) {
          return encryptObject(item as Record<string, unknown>);
        }
        return item;
      });
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Decrypt all encrypted string values in an object (for JSON fields)
 */
export function decryptObject(
  obj: Record<string, unknown>,
  keys?: Map<number, string>
): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && isEncrypted(value)) {
      try {
        result[key] = decryptField(value, keys);
      } catch {
        result[key] = value; // Keep encrypted if decryption fails
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = decryptObject(value as Record<string, unknown>, keys);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (typeof item === 'string' && isEncrypted(item)) {
          try {
            return decryptField(item, keys);
          } catch {
            return item;
          }
        } else if (typeof item === 'object' && item !== null) {
          return decryptObject(item as Record<string, unknown>, keys);
        }
        return item;
      });
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Get the fields that should be encrypted for a given model
 *
 * @param modelName - Prisma model name
 * @returns Array of field names that should be encrypted
 */
export function getEncryptedFieldsForModel(modelName: string): string[] {
  const modelFields = ENCRYPTED_FIELDS[modelName] || [];
  const globalFields = ENCRYPTED_FIELDS._global || [];
  return [...new Set([...modelFields, ...globalFields])];
}

/**
 * Re-encrypt data with a new key (for key rotation)
 *
 * @param encryptedValue - Currently encrypted value
 * @param oldKey - The old encryption key
 * @param newKey - The new encryption key
 * @param newVersion - The new key version
 * @returns Re-encrypted value with new key
 */
export function rotateEncryption(
  encryptedValue: string,
  oldKey: string,
  newKey: string,
  newVersion: number
): string {
  // Decrypt with old key
  const keys = new Map<number, string>();

  // Parse the version from the encrypted value
  const versionMatch = encryptedValue.match(/ENC:v(\d+)/);
  if (versionMatch) {
    const oldVersion = parseInt(versionMatch[1], 10);
    keys.set(oldVersion, oldKey);
  }

  const plaintext = decryptField(encryptedValue, keys);

  // Re-encrypt with new key
  return encryptField(plaintext, newKey, newVersion);
}

/**
 * HIPAA-compliant field masking for display/logging
 *
 * @param value - The value to mask
 * @param showLast - Number of characters to show at the end
 * @returns Masked value
 */
export function maskField(value: string, showLast: number = 4): string {
  if (!value || value.length <= showLast) {
    return '****';
  }

  const masked = '*'.repeat(Math.min(value.length - showLast, 8));
  const visible = value.slice(-showLast);
  return masked + visible;
}

/**
 * Mask SSN for display (XXX-XX-1234)
 */
export function maskSSN(ssn: string): string {
  if (!ssn) return '***-**-****';

  // Remove any formatting
  const cleaned = ssn.replace(/\D/g, '');

  if (cleaned.length !== 9) {
    return maskField(ssn, 4);
  }

  return `***-**-${cleaned.slice(-4)}`;
}

/**
 * Log field encryption/decryption event for HIPAA audit trail
 */
export function logFieldEncryptionEvent(
  operation: 'encrypt' | 'decrypt',
  modelName: string,
  fieldName: string,
  recordId?: string
): void {
  logSecurityEvent(
    `FIELD_${operation.toUpperCase()}`,
    'low',
    {
      model: modelName,
      field: fieldName,
      recordId: recordId ? maskField(recordId) : undefined,
      timestamp: new Date().toISOString(),
    }
  );
}

/**
 * Field encryption service class for advanced use cases
 */
export class FieldEncryptionService {
  private currentKey: string;
  private keyVersion: number;
  private previousKeys: Map<number, string>;

  constructor(config?: FieldEncryptionConfig) {
    this.currentKey = config?.currentKey || getEncryptionKey();
    this.keyVersion = config?.keyVersion || CURRENT_VERSION;
    this.previousKeys = config?.previousKeys || new Map();

    // Add current key to the key map
    this.previousKeys.set(this.keyVersion, this.currentKey);
  }

  /**
   * Encrypt a field value
   */
  encrypt(value: string): string {
    return encryptField(value, this.currentKey, this.keyVersion);
  }

  /**
   * Decrypt a field value
   */
  decrypt(value: string): string {
    return decryptField(value, this.previousKeys);
  }

  /**
   * Encrypt multiple fields in an object
   */
  encryptFields<T extends Record<string, unknown>>(data: T, fields: string[]): T {
    const result = { ...data };

    for (const field of fields) {
      if (field in result && result[field] != null) {
        const value = result[field];
        if (typeof value === 'string') {
          (result as Record<string, unknown>)[field] = this.encrypt(value);
        }
      }
    }

    return result;
  }

  /**
   * Decrypt multiple fields in an object
   */
  decryptFields<T extends Record<string, unknown>>(data: T, fields: string[]): T {
    const result = { ...data };

    for (const field of fields) {
      if (field in result && result[field] != null) {
        const value = result[field];
        if (typeof value === 'string') {
          try {
            (result as Record<string, unknown>)[field] = this.decrypt(value);
          } catch {
            // Keep original value if decryption fails
          }
        }
      }
    }

    return result;
  }

  /**
   * Rotate to a new key
   */
  rotateKey(newKey: string): void {
    // Store old key with current version
    this.previousKeys.set(this.keyVersion, this.currentKey);

    // Update to new key
    this.keyVersion++;
    this.currentKey = newKey;
    this.previousKeys.set(this.keyVersion, newKey);

    logger.info('Field encryption key rotated', {
      newVersion: this.keyVersion,
      previousVersionsCount: this.previousKeys.size - 1,
    });

    logSecurityEvent('FIELD_ENCRYPTION_KEY_ROTATED', 'medium', {
      newVersion: this.keyVersion,
    });
  }

  /**
   * Get current key version
   */
  getKeyVersion(): number {
    return this.keyVersion;
  }

  /**
   * Check if we can decrypt a value (have the required key version)
   */
  canDecrypt(encryptedValue: string): boolean {
    if (!isEncrypted(encryptedValue)) {
      return false;
    }

    const versionMatch = encryptedValue.match(/ENC:v(\d+)/);
    if (!versionMatch) {
      return false;
    }

    const version = parseInt(versionMatch[1], 10);
    return this.previousKeys.has(version);
  }
}

// Default service instance
let defaultService: FieldEncryptionService | null = null;

/**
 * Get or create the default field encryption service
 */
export function getFieldEncryptionService(): FieldEncryptionService {
  if (!defaultService) {
    defaultService = new FieldEncryptionService();
  }
  return defaultService;
}

export default {
  encryptField,
  decryptField,
  encryptFields,
  decryptFields,
  encryptObject,
  decryptObject,
  isEncrypted,
  getEncryptedFieldsForModel,
  rotateEncryption,
  maskField,
  maskSSN,
  logFieldEncryptionEvent,
  FieldEncryptionService,
  getFieldEncryptionService,
  ENCRYPTED_FIELDS,
};
