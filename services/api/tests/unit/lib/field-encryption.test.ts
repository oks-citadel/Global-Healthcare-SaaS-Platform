import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Set up environment before imports
process.env.FIELD_ENCRYPTION_KEY = 'test-field-encryption-key-32bytes!';

import {
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
  FieldEncryptionService,
  ENCRYPTED_FIELDS,
} from '../../../src/lib/field-encryption.js';

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

describe('Field-Level Encryption Library', () => {
  const testKey = 'test-field-encryption-key-32bytes!';

  describe('encryptField', () => {
    it('should encrypt a string value', () => {
      const plaintext = '123-45-6789';
      const encrypted = encryptField(plaintext, testKey);

      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toMatch(/^ENC:v\d+:/);
    });

    it('should return empty string unchanged', () => {
      expect(encryptField('', testKey)).toBe('');
      expect(encryptField('   ', testKey)).toBe('   ');
    });

    it('should not double-encrypt already encrypted values', () => {
      const plaintext = 'sensitive data';
      const encrypted = encryptField(plaintext, testKey);
      const doubleEncrypted = encryptField(encrypted, testKey);

      expect(encrypted).toBe(doubleEncrypted);
    });

    it('should produce different ciphertext for same plaintext', () => {
      const plaintext = 'same data';
      const encrypted1 = encryptField(plaintext, testKey);
      const encrypted2 = encryptField(plaintext, testKey);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle unicode characters', () => {
      const plaintext = 'Test unicode: 日本語 emoji: 🏥';
      const encrypted = encryptField(plaintext, testKey);
      const decrypted = decryptField(encrypted, new Map([[1, testKey]]));

      expect(decrypted).toBe(plaintext);
    });

    it('should handle long strings', () => {
      const plaintext = 'A'.repeat(10000);
      const encrypted = encryptField(plaintext, testKey);
      const decrypted = decryptField(encrypted, new Map([[1, testKey]]));

      expect(decrypted).toBe(plaintext);
    });
  });

  describe('decryptField', () => {
    it('should decrypt an encrypted value', () => {
      const plaintext = '123-45-6789';
      const encrypted = encryptField(plaintext, testKey);
      const decrypted = decryptField(encrypted, new Map([[1, testKey]]));

      expect(decrypted).toBe(plaintext);
    });

    it('should return non-encrypted values unchanged', () => {
      const plaintext = 'not encrypted';
      const result = decryptField(plaintext);

      expect(result).toBe(plaintext);
    });

    it('should throw error with wrong key', () => {
      const plaintext = 'secret';
      const encrypted = encryptField(plaintext, testKey);
      const wrongKey = 'wrong-key-that-is-32-bytes-long!';

      expect(() => decryptField(encrypted, new Map([[1, wrongKey]]))).toThrow();
    });

    it('should throw error with invalid format', () => {
      const invalidEncrypted = 'ENC:v1:invalid';

      expect(() => decryptField(invalidEncrypted)).toThrow('Failed to decrypt field');
    });
  });

  describe('isEncrypted', () => {
    it('should return true for encrypted values', () => {
      const encrypted = encryptField('test', testKey);
      expect(isEncrypted(encrypted)).toBe(true);
    });

    it('should return false for plain values', () => {
      expect(isEncrypted('plain text')).toBe(false);
      expect(isEncrypted('')).toBe(false);
      expect(isEncrypted('ENC:')).toBe(false);
    });
  });

  describe('encryptFields', () => {
    it('should encrypt specified fields in an object', () => {
      const data = {
        id: '123',
        ssn: '123-45-6789',
        name: 'John Doe',
        phone: '555-1234',
      };

      const encrypted = encryptFields(data, ['ssn', 'phone']);

      expect(encrypted.id).toBe('123');
      expect(encrypted.name).toBe('John Doe');
      expect(isEncrypted(encrypted.ssn as string)).toBe(true);
      expect(isEncrypted(encrypted.phone as string)).toBe(true);
    });

    it('should handle null and undefined values', () => {
      const data = {
        id: '123',
        ssn: null,
        phone: undefined,
      };

      const encrypted = encryptFields(data as Record<string, unknown>, ['ssn', 'phone']);

      expect(encrypted.ssn).toBeNull();
      expect(encrypted.phone).toBeUndefined();
    });

    it('should not modify the original object', () => {
      const data = { ssn: '123-45-6789' };
      const original = { ...data };

      encryptFields(data, ['ssn']);

      expect(data.ssn).toBe(original.ssn);
    });
  });

  describe('decryptFields', () => {
    it('should decrypt specified fields in an object', () => {
      const original = {
        id: '123',
        ssn: '123-45-6789',
        phone: '555-1234',
      };

      const encrypted = encryptFields(original, ['ssn', 'phone']);
      const decrypted = decryptFields(encrypted, ['ssn', 'phone']);

      expect(decrypted.id).toBe('123');
      expect(decrypted.ssn).toBe('123-45-6789');
      expect(decrypted.phone).toBe('555-1234');
    });

    it('should handle decryption errors gracefully', () => {
      const data = {
        id: '123',
        ssn: 'not-encrypted-but-in-fields',
      };

      const decrypted = decryptFields(data, ['ssn']);

      // Should keep original value if decryption fails
      expect(decrypted.ssn).toBe('not-encrypted-but-in-fields');
    });
  });

  describe('encryptObject / decryptObject', () => {
    it('should encrypt all string values in an object', () => {
      const obj = {
        name: 'John',
        address: '123 Main St',
        nested: {
          phone: '555-1234',
        },
      };

      const encrypted = encryptObject(obj);

      expect(isEncrypted(encrypted.name as string)).toBe(true);
      expect(isEncrypted(encrypted.address as string)).toBe(true);
      expect(isEncrypted((encrypted.nested as Record<string, unknown>).phone as string)).toBe(true);
    });

    it('should decrypt all encrypted values in an object', () => {
      const original = {
        name: 'John',
        phone: '555-1234',
      };

      const encrypted = encryptObject(original);
      const decrypted = decryptObject(encrypted);

      expect(decrypted.name).toBe('John');
      expect(decrypted.phone).toBe('555-1234');
    });

    it('should handle arrays in objects', () => {
      const obj = {
        contacts: ['555-1234', '555-5678'],
      };

      const encrypted = encryptObject(obj);
      const contacts = encrypted.contacts as string[];

      expect(isEncrypted(contacts[0])).toBe(true);
      expect(isEncrypted(contacts[1])).toBe(true);

      const decrypted = decryptObject(encrypted);
      const decryptedContacts = decrypted.contacts as string[];

      expect(decryptedContacts[0]).toBe('555-1234');
      expect(decryptedContacts[1]).toBe('555-5678');
    });
  });

  describe('getEncryptedFieldsForModel', () => {
    it('should return model-specific fields', () => {
      const fields = getEncryptedFieldsForModel('PatientHome');

      expect(fields).toContain('address');
      expect(fields).toContain('city');
      expect(fields).toContain('zipCode');
    });

    it('should include global fields', () => {
      const fields = getEncryptedFieldsForModel('User');

      expect(fields).toContain('ssn');
      expect(fields).toContain('socialSecurityNumber');
    });

    it('should return empty array for unknown models', () => {
      const fields = getEncryptedFieldsForModel('UnknownModel');

      // Should still have global fields
      expect(fields).toContain('ssn');
    });
  });

  describe('rotateEncryption', () => {
    it('should re-encrypt with new key', () => {
      const plaintext = 'sensitive data';
      const oldKey = 'old-key-that-is-32-bytes-long!!';
      const newKey = 'new-key-that-is-32-bytes-long!!';

      const encrypted = encryptField(plaintext, oldKey, 1);
      const rotated = rotateEncryption(encrypted, oldKey, newKey, 2);

      expect(rotated).not.toBe(encrypted);
      expect(isEncrypted(rotated)).toBe(true);

      // Verify we can decrypt with new key
      const decrypted = decryptField(rotated, new Map([[2, newKey]]));
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('maskField', () => {
    it('should mask with default settings', () => {
      expect(maskField('1234567890')).toBe('******7890');
    });

    it('should handle custom show last', () => {
      expect(maskField('1234567890', 2)).toBe('********90');
    });

    it('should handle short strings', () => {
      expect(maskField('123', 4)).toBe('****');
    });

    it('should handle empty strings', () => {
      expect(maskField('')).toBe('****');
    });
  });

  describe('maskSSN', () => {
    it('should mask SSN correctly', () => {
      expect(maskSSN('123-45-6789')).toBe('***-**-6789');
      expect(maskSSN('123456789')).toBe('***-**-6789');
    });

    it('should handle invalid SSN', () => {
      // maskSSN falls back to maskField for non-9-digit SSNs
      // maskField('12345', 4) = '*' + '2345' = '*2345'
      expect(maskSSN('12345')).toBe('*2345');
    });

    it('should handle empty SSN', () => {
      expect(maskSSN('')).toBe('***-**-****');
    });
  });

  describe('FieldEncryptionService', () => {
    let service: FieldEncryptionService;

    beforeEach(() => {
      service = new FieldEncryptionService({
        currentKey: testKey,
        keyVersion: 1,
      });
    });

    it('should encrypt and decrypt values', () => {
      const plaintext = 'secret';
      const encrypted = service.encrypt(plaintext);
      const decrypted = service.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should encrypt and decrypt object fields', () => {
      const data = {
        id: '123',
        ssn: '123-45-6789',
      };

      const encrypted = service.encryptFields(data, ['ssn']);
      const decrypted = service.decryptFields(encrypted, ['ssn']);

      expect(decrypted.ssn).toBe('123-45-6789');
    });

    it('should support key rotation', () => {
      const plaintext = 'secret';
      const encrypted = service.encrypt(plaintext);

      // Rotate to new key
      const newKey = 'new-key-that-is-32-bytes-long!!';
      service.rotateKey(newKey);

      // Old encrypted data should still be decryptable
      const decrypted = service.decrypt(encrypted);
      expect(decrypted).toBe(plaintext);

      // New encryptions should use new key
      expect(service.getKeyVersion()).toBe(2);
    });

    it('should check if value can be decrypted', () => {
      const encrypted = service.encrypt('test');

      expect(service.canDecrypt(encrypted)).toBe(true);
      expect(service.canDecrypt('not encrypted')).toBe(false);
    });
  });

  describe('ENCRYPTED_FIELDS configuration', () => {
    it('should have PatientHome fields configured', () => {
      expect(ENCRYPTED_FIELDS.PatientHome).toBeDefined();
      expect(ENCRYPTED_FIELDS.PatientHome).toContain('address');
      expect(ENCRYPTED_FIELDS.PatientHome).toContain('city');
      expect(ENCRYPTED_FIELDS.PatientHome).toContain('state');
      expect(ENCRYPTED_FIELDS.PatientHome).toContain('zipCode');
    });

    it('should have global fields for SSN', () => {
      expect(ENCRYPTED_FIELDS._global).toContain('ssn');
      expect(ENCRYPTED_FIELDS._global).toContain('socialSecurityNumber');
    });

    it('should have Caregiver fields configured', () => {
      expect(ENCRYPTED_FIELDS.Caregiver).toBeDefined();
      expect(ENCRYPTED_FIELDS.Caregiver).toContain('homeAddress');
      expect(ENCRYPTED_FIELDS.Caregiver).toContain('phone');
      expect(ENCRYPTED_FIELDS.Caregiver).toContain('email');
    });
  });
});
