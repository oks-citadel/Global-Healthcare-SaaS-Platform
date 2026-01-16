# Field-Level Encryption Migration Guide

## Overview

This guide covers the implementation of HIPAA-compliant field-level encryption for sensitive PII (Personally Identifiable Information) fields in the healthcare platform. The encryption uses AES-256-GCM, which provides both confidentiality and authenticity.

## Encrypted Fields

The following fields are automatically encrypted:

### Patient/User Data
- `phone` - Phone numbers
- `emergencyContact` - Emergency contact information (JSON)

### Home Health Service
- `Caregiver`: `homeAddress`, `phone`, `email`
- `PatientHome`: `address`, `addressLine2`, `city`, `state`, `zipCode`, `accessInstructions`, `gateCode`, `emergencyContact`, `emergencyPhone`
- `MileageEntry`: `startAddress`, `endAddress`

### Clinical Data
- `ClinicalNote`: `content`
- `Appointment`: `notes`
- `ChatMessage`: `message`

### Global Fields (Applied to All Models)
- `ssn` / `socialSecurityNumber`
- `taxId` / `ein`
- `driverLicense`
- `passportNumber`
- `bankAccountNumber`
- `routingNumber`
- `creditCardNumber`

## Prerequisites

### 1. Generate Encryption Key

Generate a secure 32-byte (256-bit) encryption key:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Set Environment Variables

Add to your `.env` file:

```env
# Field-level encryption key (must be at least 32 characters)
FIELD_ENCRYPTION_KEY=your-secure-32-byte-encryption-key-here

# Optional: Keep existing ENCRYPTION_KEY for backward compatibility
ENCRYPTION_KEY=your-existing-encryption-key
```

**IMPORTANT:** Store these keys securely! Use AWS Secrets Manager, HashiCorp Vault, or similar in production.

## Implementation Steps

### Step 1: Apply Prisma Middleware

Update your Prisma client initialization:

```typescript
// src/db/client.ts
import { PrismaClient } from '@prisma/client';
import { applyFieldEncryption } from '../middleware/prisma-encryption.middleware.js';

const prisma = new PrismaClient();

// Apply field encryption middleware
applyFieldEncryption(prisma);

export { prisma };
```

Or use the Prisma extension (Prisma 4.16+):

```typescript
import { PrismaClient } from '@prisma/client';
import { withFieldEncryption } from '../middleware/prisma-encryption.middleware.js';

const prisma = new PrismaClient().$extends(withFieldEncryption);

export { prisma };
```

### Step 2: Backup Your Database

**CRITICAL:** Before running the migration, create a full database backup:

```bash
# PostgreSQL
pg_dump -h your-host -U your-user -d your-database > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use your cloud provider's backup feature
```

### Step 3: Test Migration (Dry Run)

Run the migration in dry-run mode first:

```bash
cd services/api
npx ts-node scripts/migrate-encrypt-existing-data.ts --dry-run --verbose
```

Review the output to ensure:
- All expected models are being processed
- Field counts look correct
- No unexpected errors

### Step 4: Run Migration

Run the actual migration (preferably during a maintenance window):

```bash
# Run migration with progress logging
npx ts-node scripts/migrate-encrypt-existing-data.ts --verbose

# Or with a specific batch size for large datasets
npx ts-node scripts/migrate-encrypt-existing-data.ts --batch-size=50 --verbose

# Or for a specific model only
npx ts-node scripts/migrate-encrypt-existing-data.ts --model=PatientHome
```

### Step 5: Verify Migration

After migration, verify data:

```typescript
import { prisma } from './db/client';
import { isEncrypted } from './lib/field-encryption';

// Check a sample record
const patient = await prisma.patientHome.findFirst();
console.log('Address encrypted:', isEncrypted(patient.address));

// Verify decryption works
console.log('Decrypted address:', patient.address); // Should be plaintext after middleware
```

## Key Rotation

### When to Rotate Keys

- Regularly (every 90 days recommended for HIPAA)
- After a security incident
- When personnel with key access leave
- When transitioning environments

### Rotation Process

1. Generate a new encryption key
2. Update the application configuration:

```typescript
import { FieldEncryptionService } from './lib/field-encryption';

const encryptionService = new FieldEncryptionService({
  currentKey: process.env.NEW_FIELD_ENCRYPTION_KEY!,
  keyVersion: 2,
  previousKeys: new Map([
    [1, process.env.OLD_FIELD_ENCRYPTION_KEY!],
  ]),
});

// Rotate to new key
encryptionService.rotateKey(process.env.NEW_FIELD_ENCRYPTION_KEY!);
```

3. Run re-encryption migration:

```bash
npx ts-node scripts/migrate-encrypt-existing-data.ts --verbose
```

4. After confirming all data is re-encrypted, remove old key from configuration

## Troubleshooting

### Decryption Failures

If you see decryption errors:

1. Check that the correct encryption key is set
2. Verify the key version matches the encrypted data
3. Check for data corruption or truncation

```typescript
import { isEncrypted, decryptField } from './lib/field-encryption';

// Check if value is encrypted
console.log(isEncrypted(someValue)); // true/false

// Manual decryption attempt
try {
  const decrypted = decryptField(encryptedValue);
} catch (error) {
  console.error('Decryption failed:', error);
}
```

### Performance Issues

For large datasets:

1. Use smaller batch sizes: `--batch-size=25`
2. Run during off-peak hours
3. Consider migrating models in parallel (separate runs)
4. Monitor database connection pool

### Rollback

If migration fails and you need to rollback:

1. Restore from backup
2. Remove encryption middleware
3. Investigate and fix issues
4. Re-run migration

## Security Considerations

### Key Management

- Never commit encryption keys to version control
- Use environment-specific keys
- Rotate keys regularly
- Use AWS Secrets Manager or similar for production

### Audit Logging

All encryption/decryption operations are logged:

```typescript
// Check logs for security events
// Log format: { event: 'FIELD_ENCRYPT', model: 'PatientHome', field: 'address', ... }
```

### Access Control

- Limit access to encryption keys
- Monitor for unusual decryption patterns
- Implement row-level security where appropriate

## HIPAA Compliance Notes

This implementation addresses:

- **45 CFR SS 164.312(a)(2)(iv)** - Encryption and decryption
- **45 CFR SS 164.312(e)(2)(ii)** - Encryption for data in transit

Additional HIPAA requirements to ensure:

1. Access controls (who can decrypt)
2. Audit controls (log all access)
3. Integrity controls (data hasn't been tampered)
4. Transmission security (TLS for data in transit)

## API Reference

### encryptField(value, key?, version?)

Encrypts a single string value.

```typescript
const encrypted = encryptField('123-45-6789');
// Returns: ENC:v1:base64_iv:base64_authTag:base64_ciphertext
```

### decryptField(value, keys?)

Decrypts an encrypted value.

```typescript
const decrypted = decryptField(encryptedValue);
```

### isEncrypted(value)

Checks if a value is encrypted.

```typescript
if (isEncrypted(someValue)) {
  // Value is encrypted
}
```

### maskSSN(ssn)

Masks an SSN for display.

```typescript
const masked = maskSSN('123-45-6789');
// Returns: ***-**-6789
```

## Support

For issues or questions:

1. Check the logs for error details
2. Review this migration guide
3. Contact the security team for key-related issues
4. Open a ticket for technical support
