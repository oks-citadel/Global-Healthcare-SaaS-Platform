# HIPAA Security Implementation Guide

## Quick Start

This guide provides instructions for integrating the HIPAA-compliant security measures into your application.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Middleware Integration](#middleware-integration)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)

---

## Installation

### Required Dependencies

```bash
npm install --save crypto dotenv jsonwebtoken uuid
npm install --save-dev @types/jsonwebtoken @types/uuid
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Encryption
ENCRYPTION_KEY=your-32-byte-encryption-key-here-min-32-chars

# Azure Key Vault (Optional)
AZURE_KEY_VAULT_URL=https://your-keyvault.vault.azure.net/
AZURE_KEY_VAULT_KEY_NAME=phi-encryption-key
AZURE_KEY_VAULT_ENABLED=false

# CORS
CORS_ORIGINS=https://app.example.com,https://admin.example.com

# Rate Limiting
RATE_LIMIT_MAX=100

# Session Management
CHECK_SESSION_IP=true

# Security Monitoring
SECURITY_ALERT_EMAIL=security@example.com
COMPLIANCE_OFFICER_EMAIL=compliance@example.com

# Environment
NODE_ENV=production
```

---

## Configuration

### 1. Update Main Configuration

Edit `services/api/src/config/index.ts` to include security configuration:

```typescript
import { securityConfig } from './security.js';

export const config = {
  // ... existing config
  security: securityConfig,
};
```

### 2. Validate Security Configuration

Add validation on startup:

```typescript
import { validateSecurityConfig } from './config/security.js';

const validation = validateSecurityConfig();

if (!validation.valid) {
  console.error('Security configuration errors:', validation.errors);
  process.exit(1);
}

if (validation.warnings.length > 0) {
  console.warn('Security configuration warnings:', validation.warnings);
}
```

---

## Middleware Integration

### 1. Update Main Application File

Edit `services/api/src/index.ts`:

```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

// Import security middleware
import { authenticate, authorize } from './middleware/auth.middleware.js';
import { auditPHIAccess } from './middleware/audit.middleware.js';
import { sessionManager } from './middleware/session.middleware.js';
import { generalRateLimit, authRateLimit } from './middleware/rate-limit.middleware.js';
import { autoEncryptDecrypt } from './middleware/encryption.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { getSecurityHeaders } from './config/security.js';

const app = express();

// 1. Security Headers (First)
app.use(helmet());
app.use((req, res, next) => {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
});

// 2. CORS
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// 3. Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. General Rate Limiting (Apply to all routes)
app.use(generalRateLimit);

// 5. Request ID and Logging
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// 6. Health Check (No Auth Required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 7. Authentication Routes (With Auth Rate Limiting)
app.post('/api/v1/auth/login', authRateLimit, authController.login);
app.post('/api/v1/auth/register', authRateLimit, authController.register);
app.post('/api/v1/auth/logout', authenticate, authController.logout);

// 8. Protected Routes (Apply Auth, Session, Audit, Encryption)
app.use('/api/v1', authenticate); // All routes below require authentication
app.use('/api/v1', sessionManager); // Session timeout and integrity check
app.use('/api/v1', auditPHIAccess); // Audit all PHI access
app.use('/api/v1', autoEncryptDecrypt); // Automatic encryption/decryption

// 9. Your Application Routes
app.use('/api/v1/patients', authorize('provider', 'admin'), patientRoutes);
app.use('/api/v1/encounters', authorize('provider', 'admin'), encounterRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/documents', documentRoutes);

// 10. Error Handler (Last)
app.use(errorHandler);

export default app;
```

### 2. Route-Specific Security

Apply specific security measures to individual routes:

```typescript
import {
  auditSensitiveOperation,
  auditDataExport,
  auditAuthEvent
} from './middleware/audit.middleware.js';
import {
  requireRecentAuth
} from './middleware/session.middleware.js';
import {
  exportRateLimit,
  downloadRateLimit
} from './middleware/rate-limit.middleware.js';

// Sensitive operation requiring recent authentication
router.get(
  '/patients/:id/medical-records',
  authenticate,
  requireRecentAuth,
  auditSensitiveOperation('view_medical_records'),
  patientController.getMedicalRecords
);

// Data export with strict rate limiting
router.post(
  '/export/patient-data',
  authenticate,
  authorize('admin'),
  exportRateLimit,
  auditDataExport,
  exportController.exportPatientData
);

// Document download
router.get(
  '/documents/:id/download',
  authenticate,
  downloadRateLimit,
  auditSensitiveOperation('download_document'),
  documentController.download
);

// Authentication events
router.post(
  '/auth/login',
  authRateLimit,
  auditAuthEvent('login'),
  authController.login
);

router.post(
  '/auth/password-reset',
  passwordResetRateLimit,
  auditAuthEvent('password_reset'),
  authController.resetPassword
);
```

---

## Usage Examples

### 1. Encrypting Sensitive Data

```typescript
import { encrypt, decrypt, encryptFields } from './lib/encryption.js';

// Encrypt a single value
const encryptedSSN = encrypt('123-45-6789');

// Decrypt a value
const decryptedSSN = decrypt(encryptedSSN);

// Encrypt multiple fields
const patient = {
  id: '123',
  name: 'John Doe',
  ssn: '123-45-6789',
  phone: '555-123-4567',
  email: 'john@example.com',
  diagnosis: 'Hypertension',
};

const encryptedPatient = encryptFields(patient, ['ssn', 'phone', 'email', 'diagnosis']);
```

### 2. Auto-Encrypt PHI

```typescript
import { phiEncryption } from './lib/encryption.js';

// Automatically detect and encrypt PHI fields
const data = {
  firstName: 'John',
  lastName: 'Doe',
  ssn: '123-45-6789',
  dateOfBirth: '1980-01-01',
  phone: '555-123-4567',
  notes: 'Patient history...',
};

const encrypted = phiEncryption.autoEncrypt(data);
// All PHI fields are automatically encrypted

const decrypted = phiEncryption.autoDecrypt(encrypted);
// All PHI fields are automatically decrypted
```

### 3. Filtering PHI from Logs

```typescript
import { safeLogger, filterPHI, sanitizeError } from './lib/phi-filter.js';

// Safe logging (automatically filters PHI)
safeLogger.info('Processing patient data', patientData);

// Filter PHI from object before logging
const sanitized = filterPHI(patientData);
console.log('Patient data:', sanitized);

// Sanitize error messages
try {
  // some operation
} catch (error) {
  const safeError = sanitizeError(error);
  console.error('Error occurred:', safeError);
}
```

### 4. Input Validation

```typescript
import { validateOrThrow, validateEmail, validatePassword } from './utils/validators.js';

// Validate request body
router.post('/patients', authenticate, (req, res, next) => {
  try {
    const validated = validateOrThrow(req.body, {
      firstName: { type: 'string', required: true, min: 2, max: 50 },
      lastName: { type: 'string', required: true, min: 2, max: 50 },
      email: { type: 'email', required: true },
      phone: { type: 'phone', required: true },
      dateOfBirth: { type: 'date', required: true },
    });

    // Use validated data
    const patient = await patientService.create(validated);
    res.json(patient);
  } catch (error) {
    next(error);
  }
});

// Validate email
const emailResult = validateEmail('user@example.com');
if (!emailResult.valid) {
  throw new Error(emailResult.error);
}

// Validate password strength
const passwordResult = validatePassword('MyP@ssw0rd123');
if (!passwordResult.valid) {
  throw new Error(`Password errors: ${passwordResult.errors.join(', ')}`);
}
```

### 5. Session Management

```typescript
import { createSession, terminateSession } from './middleware/session.middleware.js';

// Create session on login
const sessionId = createSession(
  userId,
  email,
  role,
  ipAddress,
  userAgent
);

// Return session ID to client
res.json({
  accessToken,
  refreshToken,
  sessionId,
});

// Terminate session on logout
router.post('/auth/logout', authenticate, (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId) {
    terminateSession(sessionId);
  }
  res.json({ message: 'Logged out successfully' });
});
```

### 6. Audit Logging

```typescript
import { auditService } from './services/audit.service.js';

// Log custom audit event
await auditService.logEvent({
  userId: req.user.userId,
  action: 'create_prescription',
  resource: 'prescription',
  resourceId: prescription.id,
  details: {
    patientId: prescription.patientId,
    medication: prescription.medication,
    dosage: prescription.dosage,
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});

// Retrieve audit logs
const logs = await auditService.listEvents({
  userId: 'user-123',
  action: 'read_patient',
  from: '2025-01-01',
  to: '2025-01-31',
  page: 1,
  limit: 100,
});
```

---

## Testing

### 1. Unit Tests

```typescript
import { encrypt, decrypt } from '../lib/encryption.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

describe('Encryption', () => {
  it('should encrypt and decrypt data', () => {
    const plaintext = 'sensitive-data';
    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });
});

describe('Validators', () => {
  it('should validate email', () => {
    const result = validateEmail('valid@example.com');
    expect(result.valid).toBe(true);
  });

  it('should reject weak passwords', () => {
    const result = validatePassword('weak');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

### 2. Integration Tests

```typescript
import request from 'supertest';
import app from '../index.js';

describe('Security Integration', () => {
  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/v1/patients')
      .expect(401);
  });

  it('should enforce rate limiting', async () => {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'test@example.com', password: 'wrong' })
      );
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);
    expect(rateLimited).toBe(true);
  });

  it('should log audit events', async () => {
    const token = 'valid-jwt-token';
    await request(app)
      .get('/api/v1/patients/123')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Verify audit log was created
    const logs = await auditService.listEvents({
      action: 'read_patient',
      resourceId: '123',
      page: 1,
      limit: 1,
    });

    expect(logs.data.length).toBeGreaterThan(0);
  });
});
```

---

## Production Deployment

### 1. Pre-Deployment Checklist

- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Set strong ENCRYPTION_KEY (min 32 characters)
- [ ] Configure Azure Key Vault for production keys
- [ ] Update CORS_ORIGINS to production domains
- [ ] Enable HTTPS/TLS 1.3
- [ ] Set NODE_ENV=production
- [ ] Configure security monitoring alerts
- [ ] Review and test backup procedures
- [ ] Configure log retention policies
- [ ] Enable malware scanning for file uploads
- [ ] Set up intrusion detection system
- [ ] Document incident response procedures

### 2. Environment Variables for Production

```env
NODE_ENV=production

# JWT
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Encryption
ENCRYPTION_KEY=<generate-with-openssl-rand-base64-32>
AZURE_KEY_VAULT_URL=https://your-prod-keyvault.vault.azure.net/
AZURE_KEY_VAULT_ENABLED=true

# CORS
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com

# Monitoring
SECURITY_ALERT_EMAIL=security@yourdomain.com
COMPLIANCE_OFFICER_EMAIL=compliance@yourdomain.com
SECURITY_ALERT_WEBHOOK=https://alerts.yourdomain.com/webhook

# Database
DATABASE_URL=postgresql://user:pass@prod-db:5432/dbname

# Redis
REDIS_HOST=prod-redis.yourdomain.com
REDIS_PORT=6379
REDIS_PASSWORD=<secure-password>
```

### 3. Generate Secure Keys

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate encryption key
openssl rand -base64 32

# Generate secure token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Monitoring Setup

```typescript
// Add to index.ts
import { getRateLimitStats } from './middleware/rate-limit.middleware.js';
import { getSessionStats } from './middleware/session.middleware.js';

// Monitoring endpoint (admin only)
app.get('/api/v1/admin/security-stats',
  authenticate,
  authorize('admin'),
  (req, res) => {
    const stats = {
      rateLimits: getRateLimitStats(),
      sessions: getSessionStats(),
      timestamp: new Date().toISOString(),
    };
    res.json(stats);
  }
);
```

### 5. Health Check with Security Status

```typescript
app.get('/health', (req, res) => {
  const validation = validateSecurityConfig();

  res.json({
    status: validation.valid ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    security: {
      configured: validation.valid,
      warnings: validation.warnings.length,
    },
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. "Encryption key must be at least 32 characters"

**Solution:** Set a proper encryption key in your `.env` file:
```bash
ENCRYPTION_KEY=$(openssl rand -base64 32)
```

#### 2. "Session expired due to inactivity"

**Solution:** This is expected after 15 minutes of inactivity. User needs to log in again.

#### 3. "Rate limit exceeded"

**Solution:** Wait for the rate limit window to expire, or increase limits in `config/security.ts` for development.

#### 4. "Failed to decrypt data"

**Possible causes:**
- Encryption key changed
- Data corrupted
- Wrong encryption format

**Solution:** Ensure the same encryption key is used for encryption and decryption.

---

## Additional Resources

- [HIPAA Compliance Documentation](./hipaa-compliance.md)
- [Security Configuration Reference](../api/src/config/security.ts)
- [OWASP Security Guidelines](https://owasp.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## Support

For security-related questions or issues:

- **Email:** security@unifiedhealthcare.com
- **Documentation:** https://docs.unifiedhealthcare.com/security
- **Security Incidents:** security-incidents@unifiedhealthcare.com (24/7)

---

**Last Updated:** 2025-01-15
