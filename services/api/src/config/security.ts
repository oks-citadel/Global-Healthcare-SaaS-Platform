/**
 * Security Configuration
 * Central configuration for all security-related settings
 * HIPAA-compliant security policies and standards
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment mode detection
 */
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

/**
 * Get a required environment variable for security configuration.
 * In production: throws an error if not set.
 * In development: returns fallback if provided.
 */
function getRequiredSecurityEnv(name: string, devFallback?: string): string {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (isDevelopment && devFallback !== undefined) {
    console.warn(`[SECURITY CONFIG WARNING] Using development fallback for ${name}. This is NOT safe for production.`);
    return devFallback;
  }

  throw new Error(
    `Required security environment variable ${name} is not set. ` +
    `This is a critical security configuration that must be set before starting the application.`
  );
}

/**
 * Security Configuration Object
 */
export const securityConfig = {
  /**
   * Password Policy Configuration
   * Compliant with NIST SP 800-63B and HIPAA requirements
   */
  password: {
    // Minimum length (NIST recommends at least 12 characters)
    minLength: 12,

    // Maximum length
    maxLength: 128,

    // Require uppercase letters
    requireUppercase: true,

    // Require lowercase letters
    requireLowercase: true,

    // Require numbers
    requireNumbers: true,

    // Require special characters
    requireSpecialChars: true,

    // Special characters allowed
    specialChars: '!@#$%^&*()_+-=[]{};\':"|,.<>/?',

    // Password expiration (days) - HIPAA recommends 90 days
    expirationDays: 90,

    // Password history (prevent reuse of last N passwords)
    historyCount: 10,

    // Maximum failed login attempts before lockout
    maxFailedAttempts: 5,

    // Account lockout duration (minutes)
    lockoutDuration: 30,

    // Password reset token expiration (hours)
    resetTokenExpiration: 1,
  },

  /**
   * JWT Token Configuration
   */
  jwt: {
    // Access token secret (REQUIRED - no hardcoded fallback)
    secret: getRequiredSecurityEnv('JWT_SECRET', isDevelopment ? 'dev-only-insecure-jwt-secret-min-32-chars' : undefined),

    // Access token expiration (HIPAA recommends short-lived tokens)
    accessTokenExpiry: process.env.JWT_EXPIRY || '15m', // 15 minutes

    // Refresh token expiration
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d', // 7 days

    // Token issuer
    issuer: process.env.JWT_ISSUER || 'unified-healthcare-platform',

    // Token audience
    audience: process.env.JWT_AUDIENCE || 'unified-healthcare-api',

    // Algorithm
    algorithm: 'HS256' as const,

    // Refresh token rotation
    rotateRefreshTokens: true,

    // Refresh token reuse detection
    detectRefreshTokenReuse: true,
  },

  /**
   * Session Configuration
   * HIPAA requires automatic session timeout
   */
  session: {
    // Session timeout due to inactivity (minutes)
    inactivityTimeout: 15, // 15 minutes (HIPAA recommendation)

    // Maximum session duration (hours)
    maxDuration: 8, // 8 hours

    // Re-authentication timeout for sensitive operations (minutes)
    reauthTimeout: 5, // 5 minutes

    // Maximum concurrent sessions per user
    maxConcurrentSessions: 3,

    // Session cookie settings
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      sameSite: 'strict' as const,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
  },

  /**
   * Encryption Configuration
   * HIPAA requires AES-256 encryption for PHI
   */
  encryption: {
    // Algorithm (AES-256-GCM)
    algorithm: 'aes-256-gcm' as const,

    // Key length (256 bits)
    keyLength: 32,

    // IV length (128 bits)
    ivLength: 16,

    // Auth tag length (128 bits)
    authTagLength: 16,

    // Salt length (256 bits)
    saltLength: 32,

    // PBKDF2 iterations
    iterations: 100000,

    // Master encryption key (REQUIRED - no hardcoded fallback)
    masterKey: getRequiredSecurityEnv('ENCRYPTION_KEY', isDevelopment ? 'dev-only-32-byte-encryption-key!' : undefined),

    // Key rotation interval (days)
    keyRotationInterval: 90,

    // Azure Key Vault configuration
    keyVault: {
      url: process.env.AZURE_KEY_VAULT_URL,
      keyName: process.env.AZURE_KEY_VAULT_KEY_NAME || 'phi-encryption-key',
      enabled: process.env.AZURE_KEY_VAULT_ENABLED === 'true',
    },
  },

  /**
   * Rate Limiting Configuration
   * Protection against brute force and DoS attacks
   */
  rateLimit: {
    // General API rate limit
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window
    },

    // Authentication endpoints (stricter)
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window
      blockDuration: 30 * 60 * 1000, // 30 minutes
    },

    // Password reset (very strict)
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 attempts per hour
      blockDuration: 60 * 60 * 1000, // 1 hour
    },

    // PHI access
    phi: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // 200 requests per window
    },

    // Data export
    export: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // 5 exports per hour
      blockDuration: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  /**
   * CORS Configuration
   * Allowed origins for API access
   */
  cors: {
    // Allowed origins (should be set via environment variable)
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002').split(','),

    // Allowed methods
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Allowed headers
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Session-ID',
      'X-Request-ID',
      'X-API-Key',
    ],

    // Exposed headers
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'X-Request-ID',
    ],

    // Credentials
    credentials: true,

    // Preflight cache (seconds)
    maxAge: 86400, // 24 hours
  },

  /**
   * Content Security Policy
   * XSS protection
   */
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },

  /**
   * Security Headers Configuration
   */
  headers: {
    // Strict Transport Security (HSTS)
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },

    // X-Frame-Options (clickjacking protection)
    frameOptions: 'DENY',

    // X-Content-Type-Options (MIME sniffing protection)
    contentTypeOptions: 'nosniff',

    // X-XSS-Protection
    xssProtection: '1; mode=block',

    // Referrer-Policy
    referrerPolicy: 'strict-origin-when-cross-origin',

    // Permissions-Policy
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
    },
  },

  /**
   * Audit Logging Configuration
   * HIPAA requires comprehensive audit logs
   */
  audit: {
    // Enable audit logging
    enabled: true,

    // Log retention period (years) - HIPAA requires 6 years
    retentionYears: 6,

    // Log PHI access
    logPHIAccess: true,

    // Log authentication events
    logAuthEvents: true,

    // Log data exports
    logDataExports: true,

    // Log configuration changes
    logConfigChanges: true,

    // Log security events
    logSecurityEvents: true,

    // PHI resources that require audit logging
    phiResources: [
      'patient',
      'encounter',
      'appointment',
      'document',
      'visit',
      'prescription',
      'lab-result',
      'diagnosis',
      'treatment-plan',
    ],
  },

  /**
   * PHI Protection Configuration
   */
  phi: {
    // Enable field-level encryption
    enableEncryption: true,

    // Enable PHI filtering in logs
    enableLogFiltering: true,

    // PHI fields that require encryption
    encryptedFields: [
      'ssn',
      'socialSecurityNumber',
      'dateOfBirth',
      'phone',
      'email',
      'address',
      'medicalRecordNumber',
      'insuranceId',
      'diagnosis',
      'treatment',
      'medication',
      'notes',
    ],

    // Minimum necessary principle
    enforceMinimumNecessary: true,

    // Require purpose of use for PHI access
    requirePurposeOfUse: false, // Optional, can be enabled for stricter compliance
  },

  /**
   * Access Control Configuration
   * Role-based access control (RBAC)
   */
  accessControl: {
    // Roles
    roles: {
      admin: {
        name: 'Administrator',
        permissions: ['*'], // All permissions
      },
      provider: {
        name: 'Healthcare Provider',
        permissions: [
          'read:patients',
          'write:patients',
          'read:encounters',
          'write:encounters',
          'read:appointments',
          'write:appointments',
          'read:documents',
          'write:documents',
          'read:prescriptions',
          'write:prescriptions',
        ],
      },
      patient: {
        name: 'Patient',
        permissions: [
          'read:own_data',
          'write:own_data',
          'read:own_appointments',
          'write:own_appointments',
          'read:own_documents',
        ],
      },
      staff: {
        name: 'Administrative Staff',
        permissions: [
          'read:appointments',
          'write:appointments',
          'read:patients',
        ],
      },
    },

    // Default role for new users
    defaultRole: 'patient',

    // Require role verification
    requireRoleVerification: true,
  },

  /**
   * File Upload Configuration
   */
  upload: {
    // Maximum file size (bytes) - 50MB
    maxFileSize: 50 * 1024 * 1024,

    // Allowed MIME types
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],

    // Scan files for malware
    scanForMalware: process.env.ENABLE_MALWARE_SCAN === 'true',

    // Virus scan API
    virusScanApi: process.env.VIRUS_SCAN_API_URL,
  },

  /**
   * Data Retention Configuration
   */
  retention: {
    // Audit logs (years) - HIPAA requires 6 years
    auditLogs: 6,

    // PHI data (years) - varies by state, typically 7-10 years
    phiData: 10,

    // User sessions (days)
    sessions: 30,

    // Expired tokens (days)
    expiredTokens: 7,

    // Failed login attempts (days)
    failedLoginAttempts: 30,
  },

  /**
   * Backup and Disaster Recovery Configuration
   */
  backup: {
    // Enable automatic backups
    enabled: true,

    // Backup frequency (hours)
    frequency: 24,

    // Backup retention (days)
    retention: 30,

    // Encrypt backups
    encrypted: true,

    // Backup location
    location: process.env.BACKUP_LOCATION || 's3://unified-healthcare-backups',
  },

  /**
   * Monitoring and Alerting Configuration
   */
  monitoring: {
    // Enable security monitoring
    enabled: true,

    // Alert on suspicious activity
    alertOnSuspiciousActivity: true,

    // Alert on failed login attempts threshold
    failedLoginThreshold: 5,

    // Alert on data export
    alertOnDataExport: true,

    // Alert on configuration changes
    alertOnConfigChanges: true,

    // Alert email
    alertEmail: process.env.SECURITY_ALERT_EMAIL,

    // Alert webhook
    alertWebhook: process.env.SECURITY_ALERT_WEBHOOK,
  },

  /**
   * Compliance Configuration
   */
  compliance: {
    // HIPAA compliance mode
    hipaa: true,

    // GDPR compliance mode
    gdpr: true,

    // CCPA compliance mode
    ccpa: true,

    // SOC 2 compliance mode
    soc2: true,

    // Compliance officer email
    complianceEmail: process.env.COMPLIANCE_OFFICER_EMAIL,

    // Breach notification requirements
    breachNotification: {
      enabled: true,
      // Notify within 60 days (HIPAA requirement)
      deadlineDays: 60,
      email: process.env.BREACH_NOTIFICATION_EMAIL,
    },
  },
};

/**
 * Validate security configuration
 * Ensures all required security settings are properly configured
 */
export function validateSecurityConfig(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check JWT secret strength
  if (securityConfig.jwt.secret.length < 32) {
    if (isProduction) {
      errors.push('JWT_SECRET must be at least 32 characters for production');
    } else {
      warnings.push('JWT_SECRET should be at least 32 characters');
    }
  }

  // Check if using development fallbacks in production (should never happen due to fail-fast)
  if (isProduction) {
    if (securityConfig.jwt.secret.includes('dev-only')) {
      errors.push('Development fallback detected for JWT_SECRET in production');
    }

    if (securityConfig.encryption.masterKey.includes('dev-only')) {
      errors.push('Development fallback detected for ENCRYPTION_KEY in production');
    }

    if (!securityConfig.session.cookie.secure) {
      warnings.push('Session cookies should be secure in production');
    }
  }

  // Check encryption key length (must be 32 bytes for AES-256)
  if (securityConfig.encryption.masterKey.length < 32) {
    errors.push('Encryption key must be at least 32 characters (256 bits for AES-256)');
  }

  // Check Azure Key Vault configuration
  if (securityConfig.encryption.keyVault.enabled && !securityConfig.encryption.keyVault.url) {
    errors.push('Azure Key Vault URL must be set when Key Vault is enabled');
  }

  // Check CORS origins
  if (isProduction && securityConfig.cors.origins.includes('http://localhost:3000')) {
    warnings.push('Localhost origins should be removed in production');
  }

  // Check alert configuration
  if (securityConfig.monitoring.enabled && !securityConfig.monitoring.alertEmail && !securityConfig.monitoring.alertWebhook) {
    warnings.push('No alert destination configured for security monitoring');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get security headers for HTTP responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Strict-Transport-Security': `max-age=${securityConfig.headers.hsts.maxAge}${securityConfig.headers.hsts.includeSubDomains ? '; includeSubDomains' : ''}${securityConfig.headers.hsts.preload ? '; preload' : ''}`,
    'X-Frame-Options': securityConfig.headers.frameOptions,
    'X-Content-Type-Options': securityConfig.headers.contentTypeOptions,
    'X-XSS-Protection': securityConfig.headers.xssProtection,
    'Referrer-Policy': securityConfig.headers.referrerPolicy,
    'Content-Security-Policy': Object.entries(securityConfig.csp.directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; '),
  };
}

export default securityConfig;
