import { describe, it, expect, beforeEach } from 'vitest';
import { FieldEncryption } from '../../src/encryption/fieldEncryption';

describe('FieldEncryption', () => {
  let encryption: FieldEncryption;
  const masterKey = 'test-master-key-with-32-characters-minimum';

  beforeEach(() => {
    encryption = new FieldEncryption(masterKey);
  });

  describe('Constructor', () => {
    it('should create instance with valid master key', () => {
      expect(encryption).toBeInstanceOf(FieldEncryption);
    });

    it('should throw error with invalid master key', () => {
      expect(() => new FieldEncryption('short')).toThrow('Master key must be at least 32 characters');
    });

    it('should throw error with empty master key', () => {
      expect(() => new FieldEncryption('')).toThrow('Master key must be at least 32 characters');
    });
  });

  describe('Encrypt and Decrypt', () => {
    it('should encrypt and decrypt plaintext successfully', () => {
      const plaintext = 'Sensitive health information';

      const encrypted = encryption.encrypt(plaintext);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plaintext);

      const decrypted = encryption.decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    it('should encrypt same plaintext to different ciphertexts', () => {
      const plaintext = 'Patient SSN: 123-45-6789';

      const encrypted1 = encryption.encrypt(plaintext);
      const encrypted2 = encryption.encrypt(plaintext);

      // Different salts/IVs should produce different ciphertexts
      expect(encrypted1).not.toBe(encrypted2);

      // Both should decrypt to same plaintext
      expect(encryption.decrypt(encrypted1)).toBe(plaintext);
      expect(encryption.decrypt(encrypted2)).toBe(plaintext);
    });

    it('should handle special characters', () => {
      const plaintext = 'Special: !@#$%^&*()_+-=[]{}|;:,.<>?';

      const encrypted = encryption.encrypt(plaintext);
      const decrypted = encryption.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle unicode characters', () => {
      const plaintext = 'Unicode: 你好世界 مرحبا العالم';

      const encrypted = encryption.encrypt(plaintext);
      const decrypted = encryption.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle empty string', () => {
      const plaintext = '';

      const encrypted = encryption.encrypt(plaintext);
      const decrypted = encryption.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle very long strings', () => {
      const plaintext = 'A'.repeat(10000);

      const encrypted = encryption.encrypt(plaintext);
      const decrypted = encryption.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });
  });

  describe('Authenticated Encryption with Context', () => {
    it('should encrypt with context and decrypt successfully', () => {
      const plaintext = 'Medical record data';
      const context = 'patient-id:12345';

      const encrypted = encryption.encrypt(plaintext, context);
      const decrypted = encryption.decrypt(encrypted, context);

      expect(decrypted).toBe(plaintext);
    });

    it('should fail decryption with wrong context', () => {
      const plaintext = 'Medical record data';
      const correctContext = 'patient-id:12345';
      const wrongContext = 'patient-id:99999';

      const encrypted = encryption.encrypt(plaintext, correctContext);

      expect(() => {
        encryption.decrypt(encrypted, wrongContext);
      }).toThrow();
    });

    it('should fail decryption when context is missing', () => {
      const plaintext = 'Medical record data';
      const context = 'patient-id:12345';

      const encrypted = encryption.encrypt(plaintext, context);

      expect(() => {
        encryption.decrypt(encrypted);
      }).toThrow();
    });

    it('should fail decryption when context is provided but was not used in encryption', () => {
      const plaintext = 'Medical record data';
      const context = 'patient-id:12345';

      const encrypted = encryption.encrypt(plaintext); // No context

      expect(() => {
        encryption.decrypt(encrypted, context); // With context
      }).toThrow();
    });
  });

  describe('Pseudonymization', () => {
    it('should pseudonymize data consistently with same salt', () => {
      const data = 'user@example.com';
      const salt = 'fixed-salt';

      const hash1 = encryption.pseudonymize(data, salt);
      const hash2 = encryption.pseudonymize(data, salt);

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(data);
    });

    it('should produce different hashes with different salts', () => {
      const data = 'user@example.com';
      const salt1 = 'salt1';
      const salt2 = 'salt2';

      const hash1 = encryption.pseudonymize(data, salt1);
      const hash2 = encryption.pseudonymize(data, salt2);

      expect(hash1).not.toBe(hash2);
    });

    it('should produce different hashes for different data with same salt', () => {
      const salt = 'fixed-salt';

      const hash1 = encryption.pseudonymize('user1@example.com', salt);
      const hash2 = encryption.pseudonymize('user2@example.com', salt);

      expect(hash1).not.toBe(hash2);
    });

    it('should use random salt when not provided', () => {
      const data = 'user@example.com';

      const hash1 = encryption.pseudonymize(data);
      const hash2 = encryption.pseudonymize(data);

      // Without fixed salt, hashes should be different
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Encrypt Object Fields', () => {
    it('should encrypt specified fields in object', () => {
      const patient = {
        id: 'patient-123',
        name: 'John Doe',
        ssn: '123-45-6789',
        phone: '+1-555-0123',
        diagnosis: 'Type 2 Diabetes',
        publicInfo: 'Patient since 2020',
      };

      const encrypted = encryption.encryptFields(
        patient,
        ['ssn', 'phone', 'diagnosis']
      );

      expect(encrypted.id).toBe(patient.id); // Not encrypted
      expect(encrypted.name).toBe(patient.name); // Not encrypted
      expect(encrypted.publicInfo).toBe(patient.publicInfo); // Not encrypted
      expect(encrypted.ssn).not.toBe(patient.ssn); // Encrypted
      expect(encrypted.phone).not.toBe(patient.phone); // Encrypted
      expect(encrypted.diagnosis).not.toBe(patient.diagnosis); // Encrypted
    });

    it('should decrypt fields back to original values', () => {
      const patient = {
        id: 'patient-123',
        name: 'John Doe',
        ssn: '123-45-6789',
        phone: '+1-555-0123',
      };

      const encrypted = encryption.encryptFields(patient, ['ssn', 'phone']);
      const decrypted = encryption.decryptFields(encrypted, ['ssn', 'phone']);

      expect(decrypted).toEqual(patient);
    });

    it('should encrypt object fields with context', () => {
      const data = {
        id: 'record-123',
        sensitiveData: 'PHI content',
      };
      const context = 'patient-456';

      const encrypted = encryption.encryptFields(data, ['sensitiveData'], context);
      const decrypted = encryption.decryptFields(encrypted, ['sensitiveData'], context);

      expect(decrypted.sensitiveData).toBe(data.sensitiveData);
    });

    it('should handle null and undefined values', () => {
      const data = {
        field1: 'value',
        field2: null,
        field3: undefined,
      };

      const encrypted = encryption.encryptFields(data, ['field1', 'field2', 'field3']);

      expect(encrypted.field1).not.toBe(data.field1);
      expect(encrypted.field2).toBe(null);
      expect(encrypted.field3).toBe(undefined);
    });

    it('should handle numeric values by converting to string', () => {
      const data = {
        id: 12345,
        count: 100,
      };

      const encrypted = encryption.encryptFields(data, ['id', 'count']);

      expect(encrypted.id).not.toBe(data.id);
      expect(typeof encrypted.id).toBe('string');

      const decrypted = encryption.decryptFields(encrypted, ['id', 'count']);

      // After decryption, values are strings
      expect(decrypted.id).toBe('12345');
      expect(decrypted.count).toBe('100');
    });
  });

  describe('Security Properties', () => {
    it('should use different salts for each encryption', () => {
      const plaintext = 'test';

      const enc1 = encryption.encrypt(plaintext);
      const enc2 = encryption.encrypt(plaintext);

      // Extract salts from base64 encoded strings
      const buf1 = Buffer.from(enc1, 'base64');
      const buf2 = Buffer.from(enc2, 'base64');

      const salt1 = buf1.subarray(0, 64);
      const salt2 = buf2.subarray(0, 64);

      expect(salt1.equals(salt2)).toBe(false);
    });

    it('should use different IVs for each encryption', () => {
      const plaintext = 'test';

      const enc1 = encryption.encrypt(plaintext);
      const enc2 = encryption.encrypt(plaintext);

      // Extract IVs from base64 encoded strings
      const buf1 = Buffer.from(enc1, 'base64');
      const buf2 = Buffer.from(enc2, 'base64');

      const iv1 = buf1.subarray(64, 64 + 16);
      const iv2 = buf2.subarray(64, 64 + 16);

      expect(iv1.equals(iv2)).toBe(false);
    });

    it('should fail decryption with tampered ciphertext', () => {
      const plaintext = 'test';
      const encrypted = encryption.encrypt(plaintext);

      // Tamper with the ciphertext
      const buffer = Buffer.from(encrypted, 'base64');
      buffer[buffer.length - 1] ^= 1; // Flip a bit
      const tampered = buffer.toString('base64');

      expect(() => {
        encryption.decrypt(tampered);
      }).toThrow();
    });

    it('should return base64 encoded ciphertext', () => {
      const plaintext = 'test';
      const encrypted = encryption.encrypt(plaintext);

      // Should be valid base64
      expect(() => Buffer.from(encrypted, 'base64')).not.toThrow();

      // Should decode back to buffer
      const buffer = Buffer.from(encrypted, 'base64');
      expect(buffer.length).toBeGreaterThan(0);
    });
  });

  describe('Cross-Instance Compatibility', () => {
    it('should decrypt data encrypted by different instance with same key', () => {
      const plaintext = 'cross-instance test';

      const encryption1 = new FieldEncryption(masterKey);
      const encryption2 = new FieldEncryption(masterKey);

      const encrypted = encryption1.encrypt(plaintext);
      const decrypted = encryption2.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should fail decryption with different master key', () => {
      const plaintext = 'test';
      const key1 = 'first-master-key-32-characters-long!';
      const key2 = 'different-key-32-characters-long!!!';

      const encryption1 = new FieldEncryption(key1);
      const encryption2 = new FieldEncryption(key2);

      const encrypted = encryption1.encrypt(plaintext);

      expect(() => {
        encryption2.decrypt(encrypted);
      }).toThrow();
    });
  });
});
