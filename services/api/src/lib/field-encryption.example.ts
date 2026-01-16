/**
 * Field-Level Encryption Examples
 *
 * This file demonstrates how to use the field-level encryption library
 * for encrypting sensitive PII data in the healthcare platform.
 */

import {
  encryptField,
  decryptField,
  encryptFields,
  decryptFields,
  isEncrypted,
  maskSSN,
  maskField,
  FieldEncryptionService,
  getEncryptedFieldsForModel,
} from './field-encryption.js';

// ============================================
// Example 1: Basic Field Encryption
// ============================================

function basicEncryptionExample() {
  // Encrypt a single value (e.g., SSN)
  const ssn = '123-45-6789';
  const encryptedSSN = encryptField(ssn);

  console.log('Original SSN:', ssn);
  console.log('Encrypted SSN:', encryptedSSN);
  // Output: ENC:v1:base64_iv:base64_authTag:base64_ciphertext

  // Check if a value is encrypted
  console.log('Is encrypted:', isEncrypted(encryptedSSN)); // true
  console.log('Is original encrypted:', isEncrypted(ssn)); // false

  // Decrypt the value
  const decryptedSSN = decryptField(encryptedSSN);
  console.log('Decrypted SSN:', decryptedSSN); // 123-45-6789
}

// ============================================
// Example 2: Encrypting Object Fields
// ============================================

function objectEncryptionExample() {
  // Patient data with sensitive fields
  const patientData = {
    id: 'patient-123',
    name: 'John Doe',
    email: 'john@example.com',
    ssn: '123-45-6789',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    dateOfBirth: '1990-01-15',
  };

  // Encrypt specific fields
  const encryptedPatient = encryptFields(patientData, ['ssn', 'email']);

  console.log('Encrypted patient:', encryptedPatient);
  // ssn and email are now encrypted, other fields remain unchanged

  // Decrypt the fields
  const decryptedPatient = decryptFields(encryptedPatient, ['ssn', 'email']);
  console.log('Decrypted patient:', decryptedPatient);
}

// ============================================
// Example 3: Using with Prisma Models
// ============================================

async function prismaIntegrationExample() {
  // The Prisma middleware automatically handles encryption/decryption
  // You don't need to do anything special - just use Prisma normally

  // Example: Creating a patient home record
  // The middleware will automatically encrypt address fields

  const patientHomeData = {
    patientId: 'patient-123',
    address: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    accessInstructions: 'Ring buzzer for apt 4B',
    gateCode: '1234',
  };

  // When you create this record, the middleware automatically encrypts:
  // - address, addressLine2, city, state, zipCode
  // - accessInstructions, gateCode
  // await prisma.patientHome.create({ data: patientHomeData });

  // When you read the record, the middleware automatically decrypts:
  // const patientHome = await prisma.patientHome.findUnique({ where: { id: '...' } });
  // patientHome.address will be decrypted automatically

  console.log('Fields encrypted for PatientHome:', getEncryptedFieldsForModel('PatientHome'));
}

// ============================================
// Example 4: Key Rotation
// ============================================

function keyRotationExample() {
  // Create a service with the current key
  const encryptionService = new FieldEncryptionService({
    currentKey: process.env.FIELD_ENCRYPTION_KEY!,
    keyVersion: 1,
  });

  // Encrypt some data
  const sensitiveData = 'sensitive information';
  const encrypted = encryptionService.encrypt(sensitiveData);

  console.log('Encrypted with v1 key:', encrypted);

  // Later, when rotating keys:
  const newKey = 'new-encryption-key-that-is-32bytes';
  encryptionService.rotateKey(newKey);

  // Old data can still be decrypted (service keeps old keys)
  const decrypted = encryptionService.decrypt(encrypted);
  console.log('Decrypted after rotation:', decrypted);

  // New encryptions use the new key
  const newEncrypted = encryptionService.encrypt('new data');
  console.log('Encrypted with v2 key:', newEncrypted);
  console.log('Current key version:', encryptionService.getKeyVersion());
}

// ============================================
// Example 5: Masking for Display
// ============================================

function maskingExample() {
  // Mask SSN for display (HIPAA compliant)
  const ssn = '123-45-6789';
  console.log('Masked SSN:', maskSSN(ssn)); // ***-**-6789

  // Generic masking
  const creditCard = '4111111111111111';
  console.log('Masked CC:', maskField(creditCard, 4)); // ************1111

  const phone = '555-123-4567';
  console.log('Masked phone:', maskField(phone, 4)); // ********4567
}

// ============================================
// Example 6: Manual Encryption (Without Middleware)
// ============================================

function manualEncryptionExample() {
  // For cases where you need to encrypt/decrypt manually
  // (e.g., in a service that doesn't use the Prisma middleware)

  const userData = {
    id: 'user-123',
    email: 'user@example.com',
    phone: '555-123-4567',
    ssn: '123-45-6789',
  };

  // Get the fields that should be encrypted for this model
  const fieldsToEncrypt = getEncryptedFieldsForModel('User');
  console.log('Fields to encrypt for User:', fieldsToEncrypt);

  // Encrypt the fields
  const encryptedUser = encryptFields(userData, fieldsToEncrypt);

  // Store to database (encrypted)...

  // Later, when reading from database:
  const decryptedUser = decryptFields(encryptedUser, fieldsToEncrypt);
  console.log('Decrypted user:', decryptedUser);
}

// ============================================
// Example 7: Selective Encryption
// ============================================

function selectiveEncryptionExample() {
  // Sometimes you need more control over what gets encrypted

  // Check what fields are configured for encryption
  console.log('PatientHome fields:', getEncryptedFieldsForModel('PatientHome'));
  console.log('Caregiver fields:', getEncryptedFieldsForModel('Caregiver'));
  console.log('User fields:', getEncryptedFieldsForModel('User'));

  // You can create a custom encryption middleware with different settings:
  // import { createSelectiveEncryptionMiddleware } from '../middleware/prisma-encryption.middleware';
  //
  // const customMiddleware = createSelectiveEncryptionMiddleware({
  //   includeModels: ['PatientHome', 'Caregiver'],
  //   excludeModels: ['AuditLog'], // Never encrypt audit logs
  //   additionalFields: {
  //     CustomModel: ['sensitiveField'],
  //   },
  //   excludeFields: {
  //     PatientHome: ['city'], // Don't encrypt city for performance reasons
  //   },
  // });
}

// ============================================
// Example 8: Error Handling
// ============================================

function errorHandlingExample() {
  try {
    // Attempting to decrypt invalid data
    const invalidData = 'not-encrypted-data';
    const result = decryptField(invalidData);
    // Returns the original value if it's not encrypted
    console.log('Result:', result);
  } catch (error) {
    console.error('Decryption failed:', error);
  }

  try {
    // Decrypting with wrong key
    const encrypted = encryptField('test', 'key1-that-is-exactly-32-bytes!!');
    const wrongKeyMap = new Map([[1, 'key2-that-is-exactly-32-bytes!!']]);
    decryptField(encrypted, wrongKeyMap);
  } catch (error) {
    console.error('Wrong key error:', error);
  }
}

// Export examples for testing
export {
  basicEncryptionExample,
  objectEncryptionExample,
  prismaIntegrationExample,
  keyRotationExample,
  maskingExample,
  manualEncryptionExample,
  selectiveEncryptionExample,
  errorHandlingExample,
};
