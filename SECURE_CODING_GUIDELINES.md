# Secure Coding Guidelines

**UnifiedHealth Global Healthcare Platform**

Version: 1.0
Last Updated: December 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [General Security Principles](#general-security-principles)
3. [Authentication & Authorization](#authentication--authorization)
4. [Data Protection](#data-protection)
5. [Input Validation](#input-validation)
6. [Output Encoding](#output-encoding)
7. [Cryptography](#cryptography)
8. [Error Handling & Logging](#error-handling--logging)
9. [API Security](#api-security)
10. [Database Security](#database-security)
11. [Healthcare-Specific Security (HIPAA)](#healthcare-specific-security-hipaa)
12. [Secret Management](#secret-management)
13. [Dependency Management](#dependency-management)
14. [Code Review Checklist](#code-review-checklist)

---

## Introduction

This document provides security guidelines for developers working on the UnifiedHealth Platform. Following these guidelines is mandatory to ensure the security and compliance of our healthcare application.

**Key Compliance Requirements:**
- HIPAA (Health Insurance Portability and Accountability Act)
- GDPR (General Data Protection Regulation)
- PCI DSS (Payment Card Industry Data Security Standard)
- SOC 2 Type II

---

## General Security Principles

### 1. Defense in Depth

Implement multiple layers of security controls:

```typescript
// ✅ GOOD: Multiple security layers
export async function accessPatientRecord(userId: string, recordId: string) {
  // Layer 1: Authentication
  if (!isAuthenticated(userId)) {
    throw new UnauthorizedError('User not authenticated');
  }

  // Layer 2: Authorization
  if (!hasPermission(userId, 'patient.read')) {
    throw new ForbiddenError('Insufficient permissions');
  }

  // Layer 3: Resource-level access control
  if (!canAccessRecord(userId, recordId)) {
    throw new ForbiddenError('Cannot access this record');
  }

  // Layer 4: Audit logging
  await auditLog.log({
    action: 'ACCESS_PATIENT_RECORD',
    userId,
    recordId,
    timestamp: new Date(),
  });

  return await db.patientRecords.findById(recordId);
}
```

### 2. Principle of Least Privilege

Grant minimal necessary permissions:

```typescript
// ✅ GOOD: Specific permissions
const permissions = {
  patient: {
    read: ['doctor', 'nurse', 'patient'],
    write: ['doctor', 'nurse'],
    delete: ['admin'],
  },
};

// ❌ BAD: Overly broad permissions
const permissions = {
  patient: {
    all: ['user'], // Too permissive!
  },
};
```

### 3. Fail Securely

Default to secure state on errors:

```typescript
// ✅ GOOD: Fail closed
function checkAccess(user: User, resource: Resource): boolean {
  try {
    return user.hasAccess(resource);
  } catch (error) {
    // On error, deny access
    logger.error('Access check failed', error);
    return false;
  }
}

// ❌ BAD: Fail open
function checkAccess(user: User, resource: Resource): boolean {
  try {
    return user.hasAccess(resource);
  } catch (error) {
    // Dangerous! Grants access on error
    return true;
  }
}
```

---

## Authentication & Authorization

### JWT Token Handling

```typescript
// ✅ GOOD: Secure JWT implementation
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = '15m'; // Short-lived tokens
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateAccessToken(userId: string): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return sign(
    {
      userId,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      issuer: 'unifiedhealth',
      audience: 'unifiedhealth-api',
    }
  );
}

export function verifyToken(token: string): TokenPayload {
  try {
    return verify(token, JWT_SECRET, {
      issuer: 'unifiedhealth',
      audience: 'unifiedhealth-api',
    }) as TokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

// ❌ BAD: Insecure JWT
const token = sign({ userId }, 'hardcoded-secret', { expiresIn: '30d' });
```

### Password Hashing

```typescript
// ✅ GOOD: Use bcrypt or argon2
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ❌ BAD: Weak hashing
import crypto from 'crypto';
const hash = crypto.createHash('md5').update(password).digest('hex');
```

### Multi-Factor Authentication (MFA)

```typescript
// ✅ GOOD: Enforce MFA for sensitive operations
export async function accessSensitiveData(
  userId: string,
  mfaToken?: string
): Promise<Data> {
  const user = await getUser(userId);

  // Require MFA for healthcare providers
  if (user.role === 'doctor' || user.role === 'nurse') {
    if (!mfaToken) {
      throw new MfaRequiredError('MFA token required');
    }

    if (!await verifyMfaToken(userId, mfaToken)) {
      throw new UnauthorizedError('Invalid MFA token');
    }
  }

  return await getSensitiveData(userId);
}
```

---

## Data Protection

### PHI/PII Handling

**Protected Health Information (PHI)** requires special handling:

```typescript
// ✅ GOOD: Encrypt PHI at rest
import { encrypt, decrypt } from '@/lib/encryption';

interface PatientRecord {
  id: string;
  // Non-PHI fields (not encrypted)
  createdAt: Date;
  updatedAt: Date;

  // PHI fields (encrypted)
  encryptedData: string; // Contains: name, SSN, DOB, address, etc.
}

export async function savePatientRecord(
  data: PatientData
): Promise<PatientRecord> {
  const { id, createdAt, updatedAt, ...phi } = data;

  // Encrypt PHI before storing
  const encryptedData = await encrypt(JSON.stringify(phi));

  return db.patientRecords.create({
    id,
    createdAt,
    updatedAt,
    encryptedData,
  });
}

export async function getPatientRecord(
  recordId: string
): Promise<PatientData> {
  const record = await db.patientRecords.findById(recordId);

  // Decrypt PHI when retrieving
  const phi = JSON.parse(await decrypt(record.encryptedData));

  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    ...phi,
  };
}
```

### Data Masking

```typescript
// ✅ GOOD: Mask sensitive data in logs and responses
export function maskSSN(ssn: string): string {
  return ssn.replace(/\d(?=\d{4})/g, '*');
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}

export function maskCreditCard(cardNumber: string): string {
  return cardNumber.replace(/\d(?=\d{4})/g, '*');
}

// Usage in logging
logger.info('Patient accessed', {
  patientId: record.id,
  ssn: maskSSN(record.ssn), // ✅ Masked
  email: maskEmail(record.email), // ✅ Masked
});

// ❌ BAD: Logging sensitive data
logger.info('Patient data', { record }); // Contains unmasked PHI!
```

### Data Retention

```typescript
// ✅ GOOD: Implement data retention policies
export async function cleanupExpiredRecords(): Promise<void> {
  const retentionPeriod = 7 * 365; // 7 years for healthcare data

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);

  // Soft delete first (for audit trail)
  await db.patientRecords.softDelete({
    where: {
      lastAccessedAt: { lt: cutoffDate },
      deletedAt: null,
    },
  });

  // Hard delete after grace period
  const gracePeriod = 90; // 90 days
  const hardDeleteDate = new Date();
  hardDeleteDate.setDate(hardDeleteDate.getDate() - gracePeriod);

  await db.patientRecords.hardDelete({
    where: {
      deletedAt: { lt: hardDeleteDate },
    },
  });
}
```

---

## Input Validation

### Server-Side Validation

**NEVER trust client input!**

```typescript
// ✅ GOOD: Comprehensive server-side validation
import { z } from 'zod';

const PatientSchema = z.object({
  firstName: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/),
  lastName: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/),
  email: z.string().email(),
  dateOfBirth: z.coerce.date().max(new Date()),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
  phoneNumber: z.string().regex(/^\+?1?\d{10,14}$/),
});

export async function createPatient(data: unknown): Promise<Patient> {
  // Validate and parse
  const validatedData = PatientSchema.parse(data);

  // Additional business logic validation
  const age = calculateAge(validatedData.dateOfBirth);
  if (age < 0 || age > 150) {
    throw new ValidationError('Invalid date of birth');
  }

  return db.patients.create(validatedData);
}

// ❌ BAD: No validation
export async function createPatient(data: any): Promise<Patient> {
  return db.patients.create(data); // Dangerous!
}
```

### SQL Injection Prevention

```typescript
// ✅ GOOD: Use parameterized queries
export async function findPatient(patientId: string): Promise<Patient> {
  // Using Prisma (parameterized by default)
  return db.patient.findUnique({
    where: { id: patientId },
  });

  // Or with raw SQL (parameterized)
  return db.$queryRaw`
    SELECT * FROM patients WHERE id = ${patientId}
  `;
}

// ❌ BAD: String concatenation (SQL injection vulnerable!)
export async function findPatient(patientId: string): Promise<Patient> {
  const query = `SELECT * FROM patients WHERE id = '${patientId}'`;
  return db.$queryRawUnsafe(query); // NEVER DO THIS!
}
```

### NoSQL Injection Prevention

```typescript
// ✅ GOOD: Validate and sanitize MongoDB queries
export async function findPatients(filters: unknown): Promise<Patient[]> {
  const FilterSchema = z.object({
    name: z.string().optional(),
    age: z.number().int().positive().optional(),
  });

  const validFilters = FilterSchema.parse(filters);

  return db.collection('patients').find(validFilters).toArray();
}

// ❌ BAD: Direct filter usage (NoSQL injection vulnerable!)
export async function findPatients(filters: any): Promise<Patient[]> {
  // Attacker could send: { $where: "malicious code" }
  return db.collection('patients').find(filters).toArray();
}
```

---

## Output Encoding

### XSS Prevention

```typescript
// ✅ GOOD: Use React's built-in XSS protection
export function PatientProfile({ patient }: Props) {
  return (
    <div>
      {/* React automatically escapes these */}
      <h1>{patient.name}</h1>
      <p>{patient.bio}</p>
    </div>
  );
}

// ⚠️ DANGEROUS: Only use dangerouslySetInnerHTML with sanitized content
import DOMPurify from 'isomorphic-dompurify';

export function RichContent({ html }: Props) {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

// ❌ BAD: Unsanitized HTML
export function UnsafeContent({ html }: Props) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />; // XSS vulnerable!
}
```

### API Response Sanitization

```typescript
// ✅ GOOD: Sanitize responses
export async function getPatient(req: Request, res: Response) {
  const patient = await db.patients.findById(req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Remove sensitive fields before sending
  const sanitized = {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    // Exclude: password, ssn, internal flags, etc.
  };

  return res.json(sanitized);
}

// ❌ BAD: Sending raw database object
export async function getPatient(req: Request, res: Response) {
  const patient = await db.patients.findById(req.params.id);
  return res.json(patient); // May expose sensitive fields!
}
```

---

## Cryptography

### Encryption at Rest

```typescript
// ✅ GOOD: Use strong encryption (AES-256-GCM)
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return: iv + authTag + ciphertext
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// ❌ BAD: Weak encryption
const cipher = crypto.createCipher('aes-128-cbc', 'weak-password');
```

### Random Number Generation

```typescript
// ✅ GOOD: Use crypto.randomBytes for security-sensitive operations
import crypto from 'crypto';

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('base64url');
}

// ❌ BAD: Using Math.random() for security
export function generateToken(): string {
  return Math.random().toString(36).substring(2); // Predictable!
}
```

---

## Error Handling & Logging

### Secure Error Responses

```typescript
// ✅ GOOD: Generic error messages to clients
export async function loginUser(email: string, password: string) {
  const user = await db.users.findByEmail(email);

  if (!user || !await verifyPassword(password, user.passwordHash)) {
    // Don't reveal which part failed (email or password)
    throw new UnauthorizedError('Invalid credentials');
  }

  return generateTokens(user);
}

// ❌ BAD: Detailed error messages
export async function loginUser(email: string, password: string) {
  const user = await db.users.findByEmail(email);

  if (!user) {
    throw new Error('Email not found'); // Reveals user existence!
  }

  if (!await verifyPassword(password, user.passwordHash)) {
    throw new Error('Wrong password'); // Reveals password is wrong!
  }

  return generateTokens(user);
}
```

### Secure Logging

```typescript
// ✅ GOOD: Structured, sanitized logging
import { logger } from '@/lib/logger';

export async function processPayment(payment: PaymentData) {
  logger.info('Processing payment', {
    userId: payment.userId,
    amount: payment.amount,
    currency: payment.currency,
    // Mask card number
    cardNumber: maskCreditCard(payment.cardNumber),
    timestamp: new Date().toISOString(),
  });

  try {
    const result = await paymentGateway.process(payment);

    logger.info('Payment successful', {
      transactionId: result.id,
      userId: payment.userId,
    });

    return result;
  } catch (error) {
    logger.error('Payment failed', {
      userId: payment.userId,
      error: error.message, // Don't log full error (may contain sensitive data)
      errorCode: error.code,
    });

    throw error;
  }
}

// ❌ BAD: Logging sensitive data
logger.info('Payment', payment); // Contains full card details!
logger.error('Error', error); // May contain sensitive stack traces!
```

### Audit Logging

```typescript
// ✅ GOOD: Comprehensive audit trail
export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  reason?: string;
}

export async function auditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
  await db.auditLogs.create({
    id: generateId(),
    timestamp: new Date(),
    ...log,
  });
}

// Log all PHI access
export async function accessPatientRecord(
  userId: string,
  recordId: string,
  req: Request
) {
  try {
    const record = await getRecord(recordId);

    await auditLog({
      action: 'PHI_ACCESS',
      userId,
      resourceType: 'patient_record',
      resourceId: recordId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      result: 'success',
    });

    return record;
  } catch (error) {
    await auditLog({
      action: 'PHI_ACCESS',
      userId,
      resourceType: 'patient_record',
      resourceId: recordId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      result: 'failure',
      reason: error.message,
    });

    throw error;
  }
}
```

---

## API Security

### Rate Limiting

```typescript
// ✅ GOOD: Implement rate limiting
import rateLimit from 'express-rate-limit';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 login attempts
  skipSuccessfulRequests: true,
});

// Apply to routes
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

### CORS Configuration

```typescript
// ✅ GOOD: Restrictive CORS policy
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://app.unifiedhealth.com',
      'https://staging.unifiedhealth.com',
      // Add more as needed
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400, // 24 hours
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-ID'],
};

app.use(cors(corsOptions));

// ❌ BAD: Allowing all origins
app.use(cors({ origin: '*' })); // Too permissive!
```

### CSRF Protection

```typescript
// ✅ GOOD: CSRF protection for state-changing operations
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

// Protected route
app.post('/api/patient', csrfProtection, async (req, res) => {
  // CSRF token automatically validated
  const patient = await createPatient(req.body);
  res.json(patient);
});

// Get CSRF token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

---

## Database Security

### Principle of Least Privilege

```sql
-- ✅ GOOD: Create application-specific database user with limited permissions
CREATE USER app_user WITH PASSWORD 'strong-random-password';

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE ON patients TO app_user;
GRANT SELECT, INSERT, UPDATE ON appointments TO app_user;

-- No DELETE, DROP, or TRUNCATE permissions
-- No access to system tables

-- ❌ BAD: Using superuser for application
-- GRANT ALL PRIVILEGES TO app_user;
```

### Connection Security

```typescript
// ✅ GOOD: Secure database connection
const DATABASE_URL = process.env.DATABASE_URL; // postgresql://user:pass@host:5432/db?sslmode=require

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// ❌ BAD: Hardcoded credentials
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://admin:password123@localhost:5432/prod',
    },
  },
});
```

---

## Healthcare-Specific Security (HIPAA)

### Minimum Necessary Standard

```typescript
// ✅ GOOD: Return only necessary PHI
export async function getDoctorPatientList(
  doctorId: string
): Promise<PatientSummary[]> {
  const patients = await db.patients.findMany({
    where: { doctorId },
    select: {
      // Only fields necessary for the patient list
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      // Don't include: SSN, full medical history, etc.
    },
  });

  return patients;
}

// ❌ BAD: Returning all PHI
export async function getDoctorPatientList(doctorId: string) {
  return db.patients.findMany({ where: { doctorId } }); // Returns everything!
}
```

### Access Logging (Required by HIPAA)

```typescript
// ✅ GOOD: Log all PHI access
export async function getPatientDetails(
  userId: string,
  patientId: string,
  req: Request
): Promise<Patient> {
  // Check access
  if (!canAccessPatient(userId, patientId)) {
    await auditLog({
      action: 'PHI_ACCESS_DENIED',
      userId,
      resourceType: 'patient',
      resourceId: patientId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      result: 'failure',
      reason: 'Insufficient permissions',
    });

    throw new ForbiddenError('Access denied');
  }

  const patient = await db.patients.findById(patientId);

  // Log successful access
  await auditLog({
    action: 'PHI_ACCESS',
    userId,
    resourceType: 'patient',
    resourceId: patientId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    result: 'success',
  });

  return patient;
}
```

### Automatic Logout

```typescript
// ✅ GOOD: Implement automatic session timeout
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes (HIPAA requirement)

export function setupAutoLogout() {
  let lastActivity = Date.now();

  // Update activity timestamp
  const updateActivity = () => {
    lastActivity = Date.now();
  };

  // Check for inactivity
  const checkInactivity = () => {
    const inactive = Date.now() - lastActivity;

    if (inactive > SESSION_TIMEOUT) {
      // Log out user
      logout();
      alert('You have been logged out due to inactivity');
    }
  };

  // Listen for user activity
  document.addEventListener('mousemove', updateActivity);
  document.addEventListener('keypress', updateActivity);

  // Check every minute
  setInterval(checkInactivity, 60 * 1000);
}
```

---

## Secret Management

### Environment Variables

```typescript
// ✅ GOOD: Use environment variables
const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRY || '15m',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
};

// Validate required variables at startup
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'STRIPE_SECRET_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}

// ❌ BAD: Hardcoded secrets
const config = {
  database: {
    url: 'postgresql://admin:password123@prod-db:5432/healthcare',
  },
  jwt: {
    secret: 'my-super-secret-key',
  },
};
```

### .env File Security

```bash
# ✅ GOOD: .env.example (committed to git)
DATABASE_URL=postgresql://user:password@localhost:5432/healthcare_dev
JWT_SECRET=your-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# ❌ BAD: .env (should NEVER be committed!)
# Add to .gitignore:
.env
.env.local
.env.production
.env.*.local
```

---

## Dependency Management

### Regular Updates

```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix

# Update dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

### Dependency Scanning

```yaml
# .github/workflows/dependency-scan.yml
name: Dependency Scan

on:
  schedule:
    - cron: '0 0 * * *' # Daily
  push:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run pnpm audit
        run: pnpm audit --audit-level=high
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## Code Review Checklist

### Security Review Checklist

Before approving a PR, verify:

**Authentication & Authorization**
- [ ] All endpoints have authentication
- [ ] Authorization checks are performed
- [ ] JWT tokens are validated properly
- [ ] MFA is enforced where required

**Data Protection**
- [ ] PHI is encrypted at rest
- [ ] PHI is encrypted in transit (HTTPS)
- [ ] Sensitive data is masked in logs
- [ ] Data retention policies are followed

**Input Validation**
- [ ] All inputs are validated server-side
- [ ] SQL injection is prevented
- [ ] NoSQL injection is prevented
- [ ] File upload restrictions are enforced

**Output Encoding**
- [ ] XSS protection is in place
- [ ] API responses are sanitized
- [ ] HTML is properly escaped

**Error Handling**
- [ ] Errors don't reveal sensitive information
- [ ] Proper error logging is implemented
- [ ] Audit logs are created for PHI access

**API Security**
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] CSRF protection is enabled

**Secret Management**
- [ ] No hardcoded secrets
- [ ] Environment variables are used
- [ ] .env files are not committed

**Dependencies**
- [ ] No known vulnerabilities
- [ ] License compliance is checked
- [ ] Dependencies are up to date

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

**Questions?**

Contact the Security Team: security@unifiedhealth.com
