import crypto from 'crypto';
import { config } from '../config/index.js';
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';
import { logger, logSecurityEvent } from '../utils/logger.js';

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
 * Azure Key Vault Configuration and Client Management
 */
interface KeyCacheEntry {
  value: string;
  timestamp: number;
  expiresAt: number;
}

export interface KeyRotationSchedule {
  keyName: string;
  rotationIntervalMs: number;
  lastRotation: number;
  nextRotation: number;
}

class AzureKeyVaultManager {
  private client: SecretClient | null = null;
  private keyCache: Map<string, KeyCacheEntry> = new Map();
  private rotationSchedules: Map<string, KeyRotationSchedule> = new Map();
  private readonly CACHE_TTL_MS = 3600000; // 1 hour
  private readonly DEFAULT_ROTATION_INTERVAL_MS = 7776000000; // 90 days
  private rotationTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Initialize Azure Key Vault client with DefaultAzureCredential
   * Uses managed identity in production, falls back to environment variables
   */
  private initializeClient(): SecretClient | null {
    try {
      const keyVaultUrl = config.azure?.keyVaultUrl || process.env.AZURE_KEY_VAULT_URL;

      // Fallback to local keys in development
      if (!keyVaultUrl) {
        if (config.env === 'development') {
          logger.warn('Azure Key Vault URL not configured, using local encryption keys for development');
          return null;
        } else {
          throw new Error('Azure Key Vault URL is required in production environment');
        }
      }

      // Initialize DefaultAzureCredential
      // This automatically tries multiple authentication methods:
      // 1. Environment variables (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
      // 2. Managed Identity (in Azure environments)
      // 3. Azure CLI credentials
      // 4. Visual Studio Code credentials
      const credential = new DefaultAzureCredential();

      const client = new SecretClient(keyVaultUrl, credential);

      logger.info('Azure Key Vault client initialized successfully', {
        keyVaultUrl: keyVaultUrl.replace(/https?:\/\//, '').split('.')[0] + '.***', // Mask URL
      });

      logSecurityEvent(
        'KEY_VAULT_INITIALIZED',
        'low',
        { keyVaultUrl: keyVaultUrl.split('.')[0] }
      );

      return client;
    } catch (error) {
      logger.error('Failed to initialize Azure Key Vault client', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (config.env === 'production') {
        throw error;
      }

      return null;
    }
  }

  /**
   * Get or initialize the Key Vault client
   */
  private getClient(): SecretClient | null {
    if (!this.client) {
      this.client = this.initializeClient();
    }
    return this.client;
  }

  /**
   * Check if a cached key is still valid
   */
  private isCacheValid(entry: KeyCacheEntry): boolean {
    return Date.now() < entry.expiresAt;
  }

  /**
   * Retrieve encryption key from Azure Key Vault with caching
   * @param keyName - Name of the key in Key Vault
   * @param forceRefresh - Force refresh from Key Vault, bypassing cache
   * @returns Encryption key
   */
  async getEncryptionKey(keyName: string, forceRefresh: boolean = false): Promise<string> {
    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = this.keyCache.get(keyName);
        if (cached && this.isCacheValid(cached)) {
          logger.debug('Retrieved encryption key from cache', { keyName });
          return cached.value;
        }
      }

      const client = this.getClient();

      // Fallback to config key if client not available (development)
      if (!client) {
        logger.warn('Using local encryption key from config', { keyName });
        return config.encryption.key;
      }

      // Retrieve from Key Vault
      logger.info('Retrieving encryption key from Azure Key Vault', { keyName });

      const secret = await client.getSecret(keyName);

      if (!secret.value) {
        throw new Error(`Key '${keyName}' has no value in Key Vault`);
      }

      // Validate key length (must be at least 32 bytes for AES-256)
      if (secret.value.length < 32) {
        throw new Error(`Key '${keyName}' must be at least 32 characters for AES-256 encryption`);
      }

      // Cache the key
      const now = Date.now();
      this.keyCache.set(keyName, {
        value: secret.value,
        timestamp: now,
        expiresAt: now + this.CACHE_TTL_MS,
      });

      logger.info('Encryption key retrieved and cached successfully', {
        keyName,
        cacheTtlMs: this.CACHE_TTL_MS,
      });

      logSecurityEvent(
        'ENCRYPTION_KEY_RETRIEVED',
        'low',
        { keyName, cached: false }
      );

      return secret.value;
    } catch (error) {
      logger.error('Failed to retrieve encryption key', {
        keyName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      logSecurityEvent(
        'KEY_RETRIEVAL_FAILED',
        'high',
        {
          keyName,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      // Fallback to cached value if available (even if expired)
      const cached = this.keyCache.get(keyName);
      if (cached) {
        logger.warn('Using expired cached key due to retrieval failure', { keyName });
        return cached.value;
      }

      // Final fallback to config in development
      if (config.env === 'development') {
        logger.warn('Falling back to local config key', { keyName });
        return config.encryption.key;
      }

      throw new Error(`Failed to retrieve encryption key '${keyName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Store encryption key in Azure Key Vault
   * @param keyName - Name of the key
   * @param keyValue - Key value to store
   * @param contentType - Optional content type (default: 'application/x-encryption-key')
   * @param tags - Optional tags for key metadata
   */
  async setEncryptionKey(
    keyName: string,
    keyValue: string,
    contentType: string = 'application/x-encryption-key',
    tags?: Record<string, string>
  ): Promise<void> {
    try {
      // Validate key length
      if (keyValue.length < 32) {
        throw new Error('Encryption key must be at least 32 characters for AES-256');
      }

      const client = this.getClient();

      // Skip Key Vault storage in development if not configured
      if (!client) {
        logger.warn('Azure Key Vault not configured, key not stored remotely', { keyName });
        return;
      }

      logger.info('Storing encryption key in Azure Key Vault', { keyName });

      // Store in Key Vault with metadata
      const secretOptions = {
        contentType,
        tags: {
          createdAt: new Date().toISOString(),
          environment: config.env,
          purpose: 'encryption',
          ...tags,
        },
      };

      await client.setSecret(keyName, keyValue, secretOptions);

      // Update cache
      const now = Date.now();
      this.keyCache.set(keyName, {
        value: keyValue,
        timestamp: now,
        expiresAt: now + this.CACHE_TTL_MS,
      });

      logger.info('Encryption key stored successfully', { keyName });

      logSecurityEvent(
        'ENCRYPTION_KEY_STORED',
        'medium',
        { keyName, hasCustomTags: !!tags }
      );
    } catch (error) {
      logger.error('Failed to store encryption key', {
        keyName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      logSecurityEvent(
        'KEY_STORAGE_FAILED',
        'high',
        {
          keyName,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      throw new Error(`Failed to store encryption key '${keyName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Rotate encryption key with automatic scheduling
   * @param keyName - Name of the key to rotate
   * @param archiveOldKey - Whether to archive the old key (default: true)
   * @returns New key value
   */
  async rotateKey(keyName: string, archiveOldKey: boolean = true): Promise<string> {
    try {
      logger.info('Starting key rotation', { keyName, archiveOldKey });

      const client = this.getClient();

      // Generate new key
      const newKeyValue = generateSecureToken(32);

      // Archive old key if requested and client is available
      if (archiveOldKey && client) {
        try {
          const oldSecret = await client.getSecret(keyName);
          if (oldSecret.value) {
            const archiveKeyName = `${keyName}-archived-${Date.now()}`;
            await client.setSecret(archiveKeyName, oldSecret.value, {
              contentType: 'application/x-encryption-key-archived',
              tags: {
                originalKeyName: keyName,
                archivedAt: new Date().toISOString(),
                reason: 'key-rotation',
              },
            });
            logger.info('Old key archived successfully', { keyName, archiveKeyName });
          }
        } catch (error) {
          logger.warn('Failed to archive old key, continuing with rotation', {
            keyName,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Store new key
      await this.setEncryptionKey(keyName, newKeyValue, 'application/x-encryption-key', {
        rotatedAt: new Date().toISOString(),
        rotationType: 'automatic',
      });

      // Invalidate cache to force refresh
      this.keyCache.delete(keyName);

      // Update rotation schedule
      const schedule = this.rotationSchedules.get(keyName);
      if (schedule) {
        schedule.lastRotation = Date.now();
        schedule.nextRotation = Date.now() + schedule.rotationIntervalMs;
        this.rotationSchedules.set(keyName, schedule);
      }

      logger.info('Key rotation completed successfully', {
        keyName,
        nextRotation: schedule?.nextRotation ? new Date(schedule.nextRotation).toISOString() : 'not scheduled',
      });

      logSecurityEvent(
        'ENCRYPTION_KEY_ROTATED',
        'medium',
        {
          keyName,
          archivedOldKey: archiveOldKey,
          nextRotation: schedule?.nextRotation,
        }
      );

      return newKeyValue;
    } catch (error) {
      logger.error('Key rotation failed', {
        keyName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      logSecurityEvent(
        'KEY_ROTATION_FAILED',
        'critical',
        {
          keyName,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      throw new Error(`Failed to rotate key '${keyName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Schedule automatic key rotation
   * @param keyName - Name of the key to rotate
   * @param rotationIntervalMs - Rotation interval in milliseconds (default: 90 days)
   */
  scheduleKeyRotation(
    keyName: string,
    rotationIntervalMs: number = this.DEFAULT_ROTATION_INTERVAL_MS
  ): void {
    try {
      // Clear existing timer if any
      const existingTimer = this.rotationTimers.get(keyName);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const now = Date.now();
      const schedule: KeyRotationSchedule = {
        keyName,
        rotationIntervalMs,
        lastRotation: now,
        nextRotation: now + rotationIntervalMs,
      };

      this.rotationSchedules.set(keyName, schedule);

      // Schedule the rotation
      const timer = setTimeout(async () => {
        try {
          logger.info('Executing scheduled key rotation', { keyName });
          await this.rotateKey(keyName, true);

          // Reschedule for next rotation
          this.scheduleKeyRotation(keyName, rotationIntervalMs);
        } catch (error) {
          logger.error('Scheduled key rotation failed', {
            keyName,
            error: error instanceof Error ? error.message : 'Unknown error',
          });

          // Retry after 1 hour
          setTimeout(() => {
            this.scheduleKeyRotation(keyName, rotationIntervalMs);
          }, 3600000);
        }
      }, rotationIntervalMs);

      this.rotationTimers.set(keyName, timer);

      logger.info('Key rotation scheduled', {
        keyName,
        rotationIntervalDays: rotationIntervalMs / (1000 * 60 * 60 * 24),
        nextRotation: new Date(schedule.nextRotation).toISOString(),
      });

      logSecurityEvent(
        'KEY_ROTATION_SCHEDULED',
        'low',
        {
          keyName,
          rotationIntervalMs,
          nextRotation: schedule.nextRotation,
        }
      );
    } catch (error) {
      logger.error('Failed to schedule key rotation', {
        keyName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Cancel scheduled key rotation
   * @param keyName - Name of the key
   */
  cancelKeyRotation(keyName: string): void {
    const timer = this.rotationTimers.get(keyName);
    if (timer) {
      clearTimeout(timer);
      this.rotationTimers.delete(keyName);
      this.rotationSchedules.delete(keyName);
      logger.info('Key rotation schedule cancelled', { keyName });
    }
  }

  /**
   * Get rotation schedule information
   * @param keyName - Name of the key
   * @returns Rotation schedule or null if not scheduled
   */
  getRotationSchedule(keyName: string): KeyRotationSchedule | null {
    return this.rotationSchedules.get(keyName) || null;
  }

  /**
   * Clear key cache (useful for testing or forcing refresh)
   * @param keyName - Optional key name to clear specific key, or clear all if not provided
   */
  clearCache(keyName?: string): void {
    if (keyName) {
      this.keyCache.delete(keyName);
      logger.info('Key cache cleared', { keyName });
    } else {
      this.keyCache.clear();
      logger.info('All key caches cleared');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.keyCache.size,
      keys: Array.from(this.keyCache.keys()),
    };
  }

  /**
   * Cleanup all timers and resources
   */
  cleanup(): void {
    for (const timer of this.rotationTimers.values()) {
      clearTimeout(timer);
    }
    this.rotationTimers.clear();
    this.rotationSchedules.clear();
    this.keyCache.clear();
    logger.info('Key Vault manager cleaned up');
  }
}

// Create singleton instance
const keyVaultManager = new AzureKeyVaultManager();

/**
 * Azure Key Vault Integration with full feature set
 * Production-ready with caching, rotation, and fallback support
 */
export const keyVault = {
  /**
   * Retrieve encryption key from Azure Key Vault
   * @param keyName - Name of the key in Key Vault
   * @param forceRefresh - Force refresh from Key Vault, bypassing cache
   * @returns Encryption key
   */
  async getEncryptionKey(keyName: string, forceRefresh: boolean = false): Promise<string> {
    return keyVaultManager.getEncryptionKey(keyName, forceRefresh);
  },

  /**
   * Store encryption key in Azure Key Vault
   * @param keyName - Name of the key
   * @param keyValue - Key value to store
   * @param contentType - Optional content type
   * @param tags - Optional tags for key metadata
   */
  async setEncryptionKey(
    keyName: string,
    keyValue: string,
    contentType?: string,
    tags?: Record<string, string>
  ): Promise<void> {
    return keyVaultManager.setEncryptionKey(keyName, keyValue, contentType, tags);
  },

  /**
   * Rotate encryption key
   * @param keyName - Name of the key to rotate
   * @param archiveOldKey - Whether to archive the old key
   * @returns New key value
   */
  async rotateKey(keyName: string, archiveOldKey: boolean = true): Promise<string> {
    return keyVaultManager.rotateKey(keyName, archiveOldKey);
  },

  /**
   * Schedule automatic key rotation
   * @param keyName - Name of the key to rotate
   * @param rotationIntervalMs - Rotation interval in milliseconds (default: 90 days)
   */
  scheduleKeyRotation(keyName: string, rotationIntervalMs?: number): void {
    return keyVaultManager.scheduleKeyRotation(keyName, rotationIntervalMs);
  },

  /**
   * Cancel scheduled key rotation
   * @param keyName - Name of the key
   */
  cancelKeyRotation(keyName: string): void {
    return keyVaultManager.cancelKeyRotation(keyName);
  },

  /**
   * Get rotation schedule information
   * @param keyName - Name of the key
   * @returns Rotation schedule or null if not scheduled
   */
  getRotationSchedule(keyName: string): KeyRotationSchedule | null {
    return keyVaultManager.getRotationSchedule(keyName);
  },

  /**
   * Clear key cache
   * @param keyName - Optional key name to clear specific key
   */
  clearCache(keyName?: string): void {
    return keyVaultManager.clearCache(keyName);
  },

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return keyVaultManager.getCacheStats();
  },

  /**
   * Cleanup all timers and resources
   */
  cleanup(): void {
    return keyVaultManager.cleanup();
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
