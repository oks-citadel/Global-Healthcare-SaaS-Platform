import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
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
  phiEncryption,
} from '../../../src/lib/encryption.js';

// Mock config
vi.mock('../../../src/config/index.js', () => ({
  config: {
    encryption: {
      key: 'test-32-byte-encryption-key-here!!',
    },
  },
}));

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  logSecurityEvent: vi.fn(),
}));

describe('Encryption Library', () => {
  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt data successfully', () => {
      const plaintext = 'Sensitive PHI data';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(encrypted).not.toBe(plaintext);
      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertext for same plaintext', () => {
      const plaintext = 'Test data';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);

      expect(encrypted1).not.toBe(encrypted2);
      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });

    it('should handle unicode characters', () => {
      const plaintext = 'Test 日本語 émojis 🎉';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should encrypt empty string', () => {
      const plaintext = '';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should encrypt long text', () => {
      const plaintext = 'A'.repeat(10000);
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should use custom encryption key', () => {
      const plaintext = 'Test data';
      const customKey = 'custom-32-byte-key-for-testing!!';
      const encrypted = encrypt(plaintext, customKey);
      const decrypted = decrypt(encrypted, customKey);

      expect(decrypted).toBe(plaintext);
    });

    it('should throw error with invalid encryption key', () => {
      const plaintext = 'Test data';
      const shortKey = 'short';

      expect(() => encrypt(plaintext, shortKey)).toThrow('Failed to encrypt data');
    });

    it('should throw error when decrypting invalid data', () => {
      expect(() => decrypt('invalid-encrypted-data')).toThrow('Failed to decrypt data');
    });

    it('should throw error with wrong encryption key', () => {
      const plaintext = 'Test data';
      const key1 = 'key1-32-byte-encryption-key-here!';
      const key2 = 'key2-32-byte-encryption-key-here!';
      const encrypted = encrypt(plaintext, key1);

      expect(() => decrypt(encrypted, key2)).toThrow('Failed to decrypt data');
    });

    it('should have correct encrypted data format', () => {
      const plaintext = 'Test';
      const encrypted = encrypt(plaintext);
      const parts = encrypted.split(':');

      expect(parts).toHaveLength(4);
      expect(parts[0]).toBeTruthy(); // salt
      expect(parts[1]).toBeTruthy(); // iv
      expect(parts[2]).toBeTruthy(); // authTag
      expect(parts[3]).toBeTruthy(); // ciphertext
    });
  });

  describe('hash and verifyHash', () => {
    it('should hash data and verify successfully', () => {
      const data = '123-45-6789';
      const hashed = hash(data);
      const isValid = verifyHash(data, hashed);

      expect(hashed).not.toBe(data);
      expect(isValid).toBe(true);
    });

    it('should fail verification with wrong data', () => {
      const data = '123-45-6789';
      const wrongData = '987-65-4321';
      const hashed = hash(data);
      const isValid = verifyHash(wrongData, hashed);

      expect(isValid).toBe(false);
    });

    it('should produce different hashes for same data', () => {
      const data = 'test-data';
      const hash1 = hash(data);
      const hash2 = hash(data);

      expect(hash1).not.toBe(hash2);
      expect(verifyHash(data, hash1)).toBe(true);
      expect(verifyHash(data, hash2)).toBe(true);
    });

    it('should use provided salt', () => {
      const data = 'test-data';
      const salt = Buffer.from('test-salt').toString('base64');
      const hash1 = hash(data, salt);
      const hash2 = hash(data, salt);

      expect(hash1).toBe(hash2);
    });

    it('should have correct hash format', () => {
      const data = 'test';
      const hashed = hash(data);
      const parts = hashed.split(':');

      expect(parts).toHaveLength(2);
      expect(parts[0]).toBeTruthy(); // salt
      expect(parts[1]).toBeTruthy(); // hash
    });

    it('should return false for invalid hash format', () => {
      const data = 'test';
      const invalidHash = 'invalid-hash-format';

      expect(verifyHash(data, invalidHash)).toBe(false);
    });

    it('should handle timing-safe comparison errors', () => {
      const data = 'test';
      const hashed = hash(data);
      const shortHash = hashed.substring(0, 10);

      expect(verifyHash(data, shortHash)).toBe(false);
    });
  });

  describe('encryptFields and decryptFields', () => {
    it('should encrypt specified fields', () => {
      const obj = {
        id: '123',
        ssn: '123-45-6789',
        email: 'test@example.com',
        name: 'John Doe',
      };

      const encrypted = encryptFields(obj, ['ssn', 'email']);

      expect(encrypted.id).toBe(obj.id);
      expect(encrypted.name).toBe(obj.name);
      expect(encrypted.ssn).not.toBe(obj.ssn);
      expect(encrypted.email).not.toBe(obj.email);
    });

    it('should decrypt specified fields', () => {
      const obj = {
        id: '123',
        ssn: '123-45-6789',
        email: 'test@example.com',
      };

      const encrypted = encryptFields(obj, ['ssn', 'email']);
      const decrypted = decryptFields(encrypted, ['ssn', 'email']);

      expect(decrypted.ssn).toBe(obj.ssn);
      expect(decrypted.email).toBe(obj.email);
    });

    it('should handle null values', () => {
      const obj = {
        id: '123',
        ssn: null,
        email: 'test@example.com',
      };

      const encrypted = encryptFields(obj, ['ssn', 'email']);

      expect(encrypted.ssn).toBeNull();
      expect(encrypted.email).not.toBe(obj.email);
    });

    it('should handle undefined values', () => {
      const obj = {
        id: '123',
        email: 'test@example.com',
      };

      const encrypted = encryptFields(obj, ['ssn', 'email'] as any);

      expect(encrypted.ssn).toBeUndefined();
      expect(encrypted.email).not.toBe(obj.email);
    });

    it('should not modify original object', () => {
      const obj = {
        ssn: '123-45-6789',
      };

      const encrypted = encryptFields(obj, ['ssn']);

      expect(obj.ssn).toBe('123-45-6789');
      expect(encrypted.ssn).not.toBe(obj.ssn);
    });

    it('should handle decryption errors gracefully', () => {
      const obj = {
        ssn: 'not-encrypted-data',
      };

      const decrypted = decryptFields(obj, ['ssn']);

      // Should keep the value if decryption fails
      expect(decrypted.ssn).toBe('not-encrypted-data');
    });
  });

  describe('hashFields', () => {
    it('should hash specified fields', () => {
      const obj = {
        id: '123',
        ssn: '123-45-6789',
        name: 'John Doe',
      };

      const hashed = hashFields(obj, ['ssn']);

      expect(hashed.id).toBe(obj.id);
      expect(hashed.name).toBe(obj.name);
      expect(hashed.ssn).not.toBe(obj.ssn);
    });

    it('should handle null values', () => {
      const obj = {
        ssn: null,
      };

      const hashed = hashFields(obj, ['ssn']);

      expect(hashed.ssn).toBeNull();
    });
  });

  describe('generateSecureToken', () => {
    it('should generate token with default length', () => {
      const token = generateSecureToken();

      expect(token).toBeTruthy();
      expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
    });

    it('should generate token with custom length', () => {
      const token = generateSecureToken(16);

      expect(token).toHaveLength(32); // 16 bytes = 32 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();

      expect(token1).not.toBe(token2);
    });

    it('should only contain hex characters', () => {
      const token = generateSecureToken();

      expect(token).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('generateSecureCode', () => {
    it('should generate code with default length', () => {
      const code = generateSecureCode();

      expect(code).toHaveLength(6);
      expect(code).toMatch(/^\d+$/);
    });

    it('should generate code with custom length', () => {
      const code = generateSecureCode(4);

      expect(code).toHaveLength(4);
      expect(code).toMatch(/^\d+$/);
    });

    it('should pad with zeros', () => {
      const code = generateSecureCode(6);

      expect(code).toHaveLength(6);
    });

    it('should generate unique codes', () => {
      const code1 = generateSecureCode();
      const code2 = generateSecureCode();

      // Very high probability they'll be different
      expect(code1).not.toBe(code2);
    });
  });

  describe('maskSensitiveData', () => {
    it('should mask data with default settings', () => {
      const data = '1234567890';
      const masked = maskSensitiveData(data);

      expect(masked).toBe('******7890');
    });

    it('should mask data with custom visible start', () => {
      const data = '1234567890';
      const masked = maskSensitiveData(data, 4, 0);

      expect(masked).toBe('1234******');
    });

    it('should mask data with custom visible end', () => {
      const data = '1234567890';
      const masked = maskSensitiveData(data, 0, 6);

      expect(masked).toBe('****567890');
    });

    it('should mask data with both visible', () => {
      const data = '1234567890';
      const masked = maskSensitiveData(data, 2, 2);

      expect(masked).toBe('12******90');
    });

    it('should handle short strings', () => {
      const data = '123';
      const masked = maskSensitiveData(data);

      expect(masked).toBe('***');
    });

    it('should handle empty strings', () => {
      const data = '';
      const masked = maskSensitiveData(data);

      expect(masked).toBe('***');
    });

    it('should limit masked characters', () => {
      const data = 'A'.repeat(100);
      const masked = maskSensitiveData(data, 0, 4);

      // Masking produces multiple asterisks, count them
      expect(masked).toContain('*');
      expect(masked.match(/\*/g)?.length).toBeLessThanOrEqual(8);
    });
  });

  describe('phiEncryption', () => {
    describe('isPHIField', () => {
      it('should identify PHI fields', () => {
        expect(phiEncryption.isPHIField('ssn')).toBe(true);
        expect(phiEncryption.isPHIField('email')).toBe(true);
        expect(phiEncryption.isPHIField('phoneNumber')).toBe(true);
        expect(phiEncryption.isPHIField('dateOfBirth')).toBe(true);
      });

      it('should identify non-PHI fields', () => {
        expect(phiEncryption.isPHIField('id')).toBe(false);
        expect(phiEncryption.isPHIField('name')).toBe(false);
        expect(phiEncryption.isPHIField('status')).toBe(false);
      });

      it('should be case-insensitive', () => {
        expect(phiEncryption.isPHIField('SSN')).toBe(true);
        expect(phiEncryption.isPHIField('Email')).toBe(true);
        expect(phiEncryption.isPHIField('PHONE')).toBe(true);
      });

      it('should match partial field names', () => {
        expect(phiEncryption.isPHIField('patientEmail')).toBe(true);
        expect(phiEncryption.isPHIField('contactPhoneNumber')).toBe(true);
      });
    });

    describe('autoEncrypt', () => {
      it('should auto-encrypt PHI fields', () => {
        const obj = {
          id: '123',
          ssn: '123-45-6789',
          email: 'test@example.com',
          name: 'John Doe',
        };

        const encrypted = phiEncryption.autoEncrypt(obj);

        expect(encrypted.id).toBe(obj.id);
        expect(encrypted.name).toBe(obj.name);
        expect(encrypted.ssn).not.toBe(obj.ssn);
        expect(encrypted.email).not.toBe(obj.email);
      });

      it('should handle null PHI values', () => {
        const obj = {
          ssn: null,
          email: 'test@example.com',
        };

        const encrypted = phiEncryption.autoEncrypt(obj);

        expect(encrypted.ssn).toBeNull();
        expect(encrypted.email).not.toBe(obj.email);
      });

      it('should not encrypt non-PHI fields', () => {
        const obj = {
          id: '123',
          status: 'active',
          createdAt: new Date(),
        };

        const encrypted = phiEncryption.autoEncrypt(obj);

        expect(encrypted.id).toBe(obj.id);
        expect(encrypted.status).toBe(obj.status);
        expect(encrypted.createdAt).toBe(obj.createdAt);
      });
    });

    describe('autoDecrypt', () => {
      it('should auto-decrypt PHI fields', () => {
        const obj = {
          id: '123',
          ssn: '123-45-6789',
          email: 'test@example.com',
        };

        const encrypted = phiEncryption.autoEncrypt(obj);
        const decrypted = phiEncryption.autoDecrypt(encrypted);

        expect(decrypted.ssn).toBe(obj.ssn);
        expect(decrypted.email).toBe(obj.email);
      });

      it('should handle decryption errors', () => {
        const obj = {
          ssn: 'not-encrypted',
        };

        const decrypted = phiEncryption.autoDecrypt(obj);

        expect(decrypted.ssn).toBe('not-encrypted');
      });
    });
  });
});
