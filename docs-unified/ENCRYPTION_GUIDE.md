# Encryption Implementation Guide

**Platform:** Unified Healthcare SaaS Platform
**Compliance:** HIPAA Security Rule (45 CFR § 164.312(a)(2)(iv))
**Standard:** AES-256-GCM with PBKDF2 Key Derivation
**Last Updated:** 2025-12-17

---

## Table of Contents

1. [Overview](#overview)
2. [Encryption Standards](#encryption-standards)
3. [Data at Rest Encryption](#data-at-rest-encryption)
4. [Data in Transit Encryption](#data-in-transit-encryption)
5. [PHI Field-Level Encryption](#phi-field-level-encryption)
6. [Key Management](#key-management)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)
9. [Compliance](#compliance)

---

## Overview

The Unified Healthcare Platform implements **military-grade encryption** to protect Protected Health Information (PHI) in compliance with HIPAA requirements.

### Encryption Strategy

- **Data at Rest**: AES-256-GCM encryption for all PHI fields
- **Data in Transit**: TLS 1.3 for all network communications
- **Key Management**: Azure Key Vault with automatic rotation
- **Field-Level**: Selective encryption of sensitive fields

### Compliance Requirements

**HIPAA Security Rule Requirements:**
- ✅ Encryption of PHI at rest (164.312(a)(2)(iv))
- ✅ Encryption of PHI in transit (164.312(e)(2)(ii))
- ✅ Secure key management
- ✅ Access controls for encryption keys
- ✅ Audit logging of key access

---

## Encryption Standards

### Algorithm: AES-256-GCM

**Advanced Encryption Standard with Galois/Counter Mode**

- **Key Size:** 256 bits (32 bytes)
- **Block Size:** 128 bits (16 bytes)
- **Mode:** GCM (Galois/Counter Mode)
- **Authentication:** Built-in AEAD (Authenticated Encryption with Associated Data)

**Why AES-256-GCM?**
- ✅ NIST-approved encryption algorithm
- ✅ FIPS 140-2 compliant
- ✅ Authenticated encryption (prevents tampering)
- ✅ High performance
- ✅ Industry standard for healthcare

### Key Derivation: PBKDF2

**Password-Based Key Derivation Function 2**

- **Hash Function:** SHA-256
- **Iterations:** 100,000
- **Salt Length:** 256 bits (32 bytes)
- **Output Key Length:** 256 bits (32 bytes)

**Why PBKDF2?**
- ✅ NIST-recommended (SP 800-132)
- ✅ Resistant to brute-force attacks
- ✅ Configurable iteration count
- ✅ Widely supported

---

## Data at Rest Encryption

### Implementation Details

**File:** `services/api/src/lib/encryption.ts`

**Configuration:**
```typescript
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;        // 128 bits
const AUTH_TAG_LENGTH = 16;  // 128 bits
const SALT_LENGTH = 32;      // 256 bits
const KEY_LENGTH = 32;       // 256 bits
const ITERATIONS = 100000;   // PBKDF2 iterations
```

### Encryption Process

```
┌─────────────────────────────────────────────────────────────┐
│                    ENCRYPTION PROCESS                        │
└─────────────────────────────────────────────────────────────┘

1. Generate random salt (256 bits)
   └─> crypto.randomBytes(32)

2. Derive encryption key from master key
   └─> PBKDF2(masterKey, salt, 100000 iterations, SHA-256)

3. Generate random IV (128 bits)
   └─> crypto.randomBytes(16)

4. Encrypt plaintext
   └─> AES-256-GCM(plaintext, key, iv)

5. Get authentication tag (128 bits)
   └─> GCM provides authentication tag

6. Combine components
   └─> base64(salt):base64(iv):base64(authTag):base64(ciphertext)
```

### Encrypted Data Format

```
[SALT:IV:AUTH_TAG:CIPHERTEXT]

Example:
kJ8F2+mN7qP1xR4vT6wY9zA3bC5dE8fG... : (salt - 32 bytes)
hI0jK2lM4nO6pQ8rS0tU2vW4xY6zA8bC... : (iv - 16 bytes)
dE0fG2hI4jK6lM8nO0pQ2rS4tU6vW8xY... : (auth tag - 16 bytes)
zA2bC4dE6fG8hI0jK2lM4nO6pQ8rS0tU... : (ciphertext - variable)
```

### Database Storage

Encrypted fields are stored as TEXT in PostgreSQL:

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email TEXT,              -- Encrypted
  phone TEXT,              -- Encrypted
  ssn TEXT,                -- Encrypted
  date_of_birth TEXT,      -- Encrypted
  address TEXT,            -- Encrypted
  medical_record_number TEXT, -- Encrypted
  created_at TIMESTAMP
);
```

---

## Data in Transit Encryption

### TLS Configuration

**Minimum Version:** TLS 1.2
**Recommended:** TLS 1.3

**Cipher Suites (Recommended):**
```
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
```

### HSTS Configuration

**File:** `services/api/src/middleware/security-headers.middleware.ts`

```typescript
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Configuration:**
- **max-age:** 1 year (31,536,000 seconds)
- **includeSubDomains:** Apply to all subdomains
- **preload:** Include in browser HSTS preload list

### Certificate Management

**Requirements:**
- Valid SSL/TLS certificate from trusted CA
- Certificate expiry monitoring
- Automated renewal (Let's Encrypt or Azure)
- Certificate pinning for mobile apps (recommended)

**Azure Configuration:**
```bash
# Configure custom domain with SSL
az webapp config ssl upload \
  --name unified-health-api \
  --resource-group unified-health-rg \
  --certificate-file cert.pfx \
  --certificate-password 'password'

# Bind SSL to custom domain
az webapp config ssl bind \
  --name unified-health-api \
  --resource-group unified-health-rg \
  --certificate-thumbprint 'thumbprint' \
  --ssl-type SNI
```

---

## PHI Field-Level Encryption

### Automatic PHI Detection

The encryption library automatically detects and encrypts PHI fields:

```typescript
const PHI_FIELDS = [
  'ssn', 'socialSecurityNumber',
  'dateOfBirth', 'dob',
  'phone', 'phoneNumber', 'mobilePhone',
  'email', 'emailAddress',
  'address', 'streetAddress', 'homeAddress',
  'city', 'state', 'zipCode', 'postalCode',
  'medicalRecordNumber', 'mrn',
  'insuranceId', 'policyNumber',
  'diagnosis', 'treatment', 'medication',
  'notes', 'symptoms', 'allergies'
];
```

### Field Encryption

**Encrypting a Patient Record:**

```typescript
import { phiEncryption } from './lib/encryption.js';

// Original patient data
const patient = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  ssn: '123-45-6789',
  dateOfBirth: '1980-01-15',
  address: '123 Main St, City, ST 12345'
};

// Automatically encrypt PHI fields
const encryptedPatient = phiEncryption.autoEncrypt(patient);

// Result:
{
  firstName: 'John',
  lastName: 'Doe',
  email: 'kJ8F2+mN7qP1xR4v...:hI0jK2lM4nO6pQ8r...:dE0fG2hI4jK6lM8n...:zA2bC4dE6fG8hI0j...',
  phone: 'mN7qP1xR4vT6wY9z...:jK2lM4nO6pQ8rS0t...:fG2hI4jK6lM8nO0p...:bC4dE6fG8hI0jK2l...',
  ssn: 'qP1xR4vT6wY9zA3b...:lM4nO6pQ8rS0tU2v...:hI4jK6lM8nO0pQ2r...:dE6fG8hI0jK2lM4n...',
  // ... other fields encrypted
}
```

### Field Decryption

```typescript
// Decrypt when retrieving from database
const decryptedPatient = phiEncryption.autoDecrypt(encryptedPatient);

// Result: original plaintext values
{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  ssn: '123-45-6789',
  // ... all fields decrypted
}
```

### Selective Encryption

For manual control:

```typescript
import { encryptFields, decryptFields } from './lib/encryption.js';

// Encrypt specific fields only
const encrypted = encryptFields(patient, ['email', 'phone', 'ssn']);

// Decrypt specific fields only
const decrypted = decryptFields(encrypted, ['email', 'phone', 'ssn']);
```

---

## Key Management

### Master Encryption Key

**Storage:** Azure Key Vault (production)

**Requirements:**
- Minimum length: 32 characters (256 bits)
- Random, cryptographically secure
- Never hardcoded in source code
- Stored only in Azure Key Vault

### Key Rotation

**Frequency:** Every 90 days (recommended)

**Process:**

```bash
# 1. Generate new master key
NEW_KEY=$(openssl rand -base64 32)

# 2. Store new key in Key Vault
az keyvault secret set \
  --vault-name unified-health-kv-prod \
  --name "ENCRYPTION-KEY-NEW" \
  --value "$NEW_KEY"

# 3. Re-encrypt all PHI data with new key
pnpm run rotate-encryption-key

# 4. Verify re-encryption
pnpm run verify-encryption

# 5. Archive old key (keep for recovery)
az keyvault secret set-attributes \
  --vault-name unified-health-kv-prod \
  --name "ENCRYPTION-KEY-OLD" \
  --enabled false

# 6. Promote new key to active
az keyvault secret set \
  --vault-name unified-health-kv-prod \
  --name "ENCRYPTION-KEY" \
  --value "$NEW_KEY"
```

### Key Derivation

Each encrypted field uses a **unique derived key**:

```typescript
function deriveKey(masterKey: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    masterKey,    // Master key from Azure Key Vault
    salt,         // Random salt (unique per encryption)
    100000,       // 100,000 iterations
    32,           // 256-bit output key
    'sha256'      // Hash algorithm
  );
}
```

**Benefits:**
- Different key for each encrypted value
- Even with same plaintext, different ciphertext
- Compromising one key doesn't affect others

---

## Usage Examples

### Example 1: Encrypting a Single Value

```typescript
import { encrypt, decrypt } from './lib/encryption.js';

// Encrypt
const plaintext = 'john.doe@example.com';
const encrypted = encrypt(plaintext);
// Result: "kJ8F2+mN7qP1xR4v...:hI0jK2lM4nO6pQ8r...:..."

// Decrypt
const decrypted = decrypt(encrypted);
// Result: "john.doe@example.com"
```

### Example 2: Hashing Sensitive Data (One-Way)

```typescript
import { hash, verifyHash } from './lib/encryption.js';

// Hash SSN (one-way, cannot be decrypted)
const ssn = '123-45-6789';
const hashedSSN = hash(ssn);
// Result: "salt:hash"

// Verify SSN
const isValid = verifyHash('123-45-6789', hashedSSN);
// Result: true
```

### Example 3: Encrypting Object Fields

```typescript
import { encryptFields } from './lib/encryption.js';

const patient = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
};

const encrypted = encryptFields(patient, ['email', 'phone']);
// Result: {
//   name: 'John Doe',
//   email: '...:...:...:...',
//   phone: '...:...:...:...'
// }
```

### Example 4: Masking Sensitive Data for Display

```typescript
import { maskSensitiveData } from './lib/encryption.js';

const ssn = '123-45-6789';
const masked = maskSensitiveData(ssn, 0, 4);
// Result: "********6789"

const creditCard = '4111111111111111';
const maskedCard = maskSensitiveData(creditCard, 4, 4);
// Result: "4111********1111"
```

### Example 5: Using in API Routes

```typescript
import { Router } from 'express';
import { phiEncryption } from '../lib/encryption.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

// Create patient with automatic PHI encryption
router.post('/patients', async (req, res) => {
  // Encrypt PHI fields before storing
  const encryptedData = phiEncryption.autoEncrypt(req.body);

  const patient = await prisma.patient.create({
    data: encryptedData
  });

  // Decrypt for response
  const decryptedPatient = phiEncryption.autoDecrypt(patient);

  res.json(decryptedPatient);
});

// Get patient with automatic PHI decryption
router.get('/patients/:id', async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { id: req.params.id }
  });

  // Decrypt PHI fields before returning
  const decryptedPatient = phiEncryption.autoDecrypt(patient);

  res.json(decryptedPatient);
});
```

---

## Best Practices

### 1. Key Management

✅ **DO:**
- Store master key in Azure Key Vault
- Use unique salt for each encryption
- Rotate keys every 90 days
- Keep old keys for data recovery
- Use HSM for production keys

❌ **DON'T:**
- Hardcode keys in source code
- Store keys in `.env` file (production)
- Reuse salts or IVs
- Share keys across environments
- Store keys in database

### 2. Encryption Usage

✅ **DO:**
- Encrypt all PHI fields
- Use authenticated encryption (GCM)
- Validate decryption success
- Handle encryption errors gracefully
- Log encryption operations (no plaintext)

❌ **DON'T:**
- Encrypt non-sensitive data unnecessarily
- Log plaintext PHI
- Skip authentication tag verification
- Ignore encryption errors
- Use deprecated algorithms (DES, RC4)

### 3. Performance Optimization

✅ **DO:**
- Encrypt at rest, decrypt on demand
- Cache decrypted values (securely, temporarily)
- Use connection pooling
- Batch encrypt/decrypt operations
- Monitor encryption performance

❌ **DON'T:**
- Decrypt entire database
- Keep decrypted data in memory long-term
- Encrypt already encrypted data
- Skip performance testing

### 4. Compliance

✅ **DO:**
- Document encryption procedures
- Audit key access
- Test encryption/decryption regularly
- Maintain encryption inventory
- Train staff on encryption policies

❌ **DON'T:**
- Skip audit logging
- Ignore failed encryption
- Use weak encryption for PHI
- Mix encrypted and unencrypted data

---

## Compliance

### HIPAA Security Rule

**§ 164.312(a)(2)(iv) - Encryption and Decryption**

✅ **Implemented:**
- AES-256 encryption for ePHI
- Secure key management
- Access controls for encryption keys
- Audit logging of key access
- Data integrity verification (GCM auth tag)

**§ 164.312(e)(2)(ii) - Encryption**

✅ **Implemented:**
- TLS 1.3 for data in transit
- HSTS to enforce HTTPS
- Certificate validation
- Strong cipher suites

### NIST Standards

**SP 800-52 Rev. 2 - TLS Guidelines**
- ✅ TLS 1.2 minimum (1.3 recommended)
- ✅ Strong cipher suites
- ✅ Certificate validation

**SP 800-132 - PBKDF Recommendations**
- ✅ PBKDF2 with SHA-256
- ✅ 100,000 iterations minimum
- ✅ Random salt per encryption

**SP 800-175B - Key Management**
- ✅ Key length: 256 bits
- ✅ Secure key storage (Azure Key Vault)
- ✅ Key rotation procedures

### FIPS 140-2

**Cryptographic Module Validation**
- ✅ AES-256 (FIPS-approved)
- ✅ SHA-256 (FIPS-approved)
- ✅ Random number generation (crypto.randomBytes)

---

## Testing

### Unit Tests

```typescript
import { encrypt, decrypt, phiEncryption } from './lib/encryption.js';
import { describe, it, expect } from 'vitest';

describe('Encryption', () => {
  it('should encrypt and decrypt correctly', () => {
    const plaintext = 'sensitive data';
    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(plaintext);
    expect(encrypted).not.toBe(plaintext);
  });

  it('should generate unique ciphertext for same plaintext', () => {
    const plaintext = 'test';
    const encrypted1 = encrypt(plaintext);
    const encrypted2 = encrypt(plaintext);

    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should auto-encrypt PHI fields', () => {
    const patient = { email: 'test@example.com', name: 'John' };
    const encrypted = phiEncryption.autoEncrypt(patient);

    expect(encrypted.email).not.toBe('test@example.com');
    expect(encrypted.name).toBe('John');
  });
});
```

### Performance Tests

```bash
# Run encryption benchmarks
pnpm run bench:encryption

# Expected performance:
# Encryption: ~10,000 ops/sec
# Decryption: ~10,000 ops/sec
# Key derivation: ~100 ops/sec (intentionally slow)
```

---

## Troubleshooting

### Issue: Decryption Failed

**Error:** `Failed to decrypt data`

**Causes:**
1. Wrong encryption key
2. Corrupted encrypted data
3. Invalid format

**Solutions:**
```typescript
try {
  const decrypted = decrypt(encrypted);
} catch (error) {
  // Log error (no sensitive data)
  logger.error('Decryption failed', { error: error.message });

  // Check key
  const keyValid = await verifyEncryptionKey();

  // Check format
  const parts = encrypted.split(':');
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted data format');
  }
}
```

### Issue: Performance Degradation

**Cause:** Excessive encryption operations

**Solutions:**
1. Cache decrypted values (securely, temporarily)
2. Batch operations
3. Use connection pooling
4. Monitor encryption metrics

---

## References

- [NIST SP 800-175B - Guideline for Using Cryptographic Standards](https://csrc.nist.gov/publications/detail/sp/800-175b/rev-1/final)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Azure Key Vault Best Practices](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-17
**Maintained By:** Security Engineering Team
**Review Schedule:** Quarterly
