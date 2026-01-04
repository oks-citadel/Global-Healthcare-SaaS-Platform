/**
 * Mental Health Service Configuration
 *
 * Validates and exports typed configuration from environment variables.
 * Implements fail-fast validation at startup with clear error messages.
 *
 * This service handles sensitive mental health data and must comply with
 * 42 CFR Part 2 regulations for substance use disorder records.
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// ============================================================================
// Schema Definition
// ============================================================================

/**
 * Mental Health Service configuration schema
 * Validates all required and optional environment variables
 */
const mentalHealthConfigSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3002),

  // CORS Configuration
  CORS_ORIGIN: z.string().default('*'),

  // Database Configuration
  DATABASE_URL: z.string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (val) => val.startsWith('postgresql://') || val.startsWith('postgres://'),
      { message: 'DATABASE_URL must be a valid PostgreSQL connection string' }
    ),

  // JWT Configuration (optional for gateway-authenticated services)
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security')
    .optional(),

  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // API Gateway Configuration
  GATEWAY_URL: z.string().url().optional().or(z.literal('')),

  // Crisis Intervention Configuration
  CRISIS_HOTLINE_988: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(true)
  ),
  SAMHSA_HOTLINE: z.string().default('1-800-662-4357'),

  // 42 CFR Part 2 Compliance Configuration
  CONSENT_EXPIRATION_DAYS: z.coerce.number().min(1).max(365).default(365),
  EMERGENCY_CONSENT_HOURS: z.coerce.number().min(1).max(168).default(72), // Max 1 week
  AUDIT_LOGGING: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(true)
  ),

  // Encryption Configuration (PHI protection)
  ENCRYPTION_KEY: z.string()
    .min(32, 'ENCRYPTION_KEY must be at least 32 characters for AES-256')
    .optional(),

  // Session Configuration
  SESSION_DURATION_MINUTES: z.coerce.number().min(15).max(180).default(60),
  SESSION_REMINDER_HOURS: z.coerce.number().min(1).max(72).default(24),

  // Rate Limiting (Optional)
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(100),
});

// ============================================================================
// Type Exports
// ============================================================================

type MentalHealthConfigEnv = z.infer<typeof mentalHealthConfigSchema>;

export interface MentalHealthConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  serviceName: string;
  version: string;

  cors: {
    origin: string | string[];
    credentials: boolean;
  };

  database: {
    url: string;
  };

  jwt: {
    secret?: string;
  };

  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
  };

  gateway: {
    url?: string;
  };

  crisis: {
    hotline988Enabled: boolean;
    samhsaHotline: string;
  };

  compliance: {
    consentExpirationDays: number;
    emergencyConsentHours: number;
    auditLogging: boolean;
  };

  encryption: {
    key?: string;
  };

  sessions: {
    durationMinutes: number;
    reminderHours: number;
  };

  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

// ============================================================================
// Validation and Transformation
// ============================================================================

/**
 * Validate environment variables and transform to typed config
 */
function validateAndTransform(): MentalHealthConfig {
  const result = mentalHealthConfigSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors.map((err) => {
      const field = err.path.join('.') || 'unknown';
      return `  - ${field}: ${err.message}`;
    });

    const errorMessage = [
      '',
      '============================================================',
      '  CONFIGURATION ERROR: Mental Health Service',
      '============================================================',
      '',
      'Missing or invalid environment variables:',
      '',
      ...errors,
      '',
      '============================================================',
      '  Please fix the above issues and restart the service.',
      '============================================================',
      '',
    ].join('\n');

    console.error(errorMessage);
    process.exit(1);
  }

  const env = result.data;

  return {
    env: env.NODE_ENV,
    port: env.PORT,
    serviceName: 'mental-health-service',
    version: '1.0.0',

    cors: {
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    },

    database: {
      url: env.DATABASE_URL,
    },

    jwt: {
      secret: env.JWT_SECRET,
    },

    logging: {
      level: env.LOG_LEVEL,
    },

    gateway: {
      url: env.GATEWAY_URL || undefined,
    },

    crisis: {
      hotline988Enabled: env.CRISIS_HOTLINE_988,
      samhsaHotline: env.SAMHSA_HOTLINE,
    },

    compliance: {
      consentExpirationDays: env.CONSENT_EXPIRATION_DAYS,
      emergencyConsentHours: env.EMERGENCY_CONSENT_HOURS,
      auditLogging: env.AUDIT_LOGGING,
    },

    encryption: {
      key: env.ENCRYPTION_KEY,
    },

    sessions: {
      durationMinutes: env.SESSION_DURATION_MINUTES,
      reminderHours: env.SESSION_REMINDER_HOURS,
    },

    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    },
  };
}

// ============================================================================
// Sensitive Value Masking
// ============================================================================

const SENSITIVE_PATTERNS = ['secret', 'password', 'key', 'token', 'credential'];

/**
 * Mask sensitive values for logging
 */
function maskValue(value: string): string {
  if (value.length <= 8) return '****';
  const visibleChars = Math.min(4, Math.floor(value.length / 4));
  return `${value.substring(0, visibleChars)}${'*'.repeat(8)}${value.substring(value.length - visibleChars)}`;
}

/**
 * Recursively mask sensitive values in an object
 */
function maskSensitiveValues(obj: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const isSensitive = SENSITIVE_PATTERNS.some((p) => key.toLowerCase().includes(p));

    if (isSensitive && typeof value === 'string') {
      masked[key] = maskValue(value);
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveValues(value as Record<string, unknown>);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

// ============================================================================
// Logging
// ============================================================================

/**
 * Log validated configuration at startup
 */
export function logConfig(cfg: MentalHealthConfig): void {
  const masked = maskSensitiveValues(cfg as unknown as Record<string, unknown>);

  console.log('');
  console.log('============================================================');
  console.log('  Mental Health Service Configuration');
  console.log('============================================================');
  console.log('');
  console.log('  Environment:', cfg.env);
  console.log('  Port:', cfg.port);
  console.log('  Log Level:', cfg.logging.level);
  console.log('  CORS Origin:', Array.isArray(cfg.cors.origin) ? cfg.cors.origin.join(', ') : cfg.cors.origin);
  console.log('');
  console.log('  Database URL:', maskValue(cfg.database.url));
  if (cfg.jwt.secret) {
    console.log('  JWT Secret:', (masked.jwt as Record<string, unknown>).secret);
  }
  if (cfg.gateway.url) {
    console.log('  Gateway URL:', cfg.gateway.url);
  }
  console.log('');
  console.log('  Crisis Resources:');
  console.log('    - 988 Hotline:', cfg.crisis.hotline988Enabled ? 'Enabled' : 'Disabled');
  console.log('    - SAMHSA Hotline:', cfg.crisis.samhsaHotline);
  console.log('');
  console.log('  42 CFR Part 2 Compliance:');
  console.log('    - Consent Expiration:', `${cfg.compliance.consentExpirationDays} days`);
  console.log('    - Emergency Consent:', `${cfg.compliance.emergencyConsentHours} hours`);
  console.log('    - Audit Logging:', cfg.compliance.auditLogging ? 'Enabled' : 'Disabled');
  console.log('');
  console.log('  Session Settings:');
  console.log('    - Default Duration:', `${cfg.sessions.durationMinutes} minutes`);
  console.log('    - Reminder Time:', `${cfg.sessions.reminderHours} hours before`);
  console.log('');
  console.log('  Encryption:', cfg.encryption.key ? 'Configured' : 'Not Configured');
  console.log('  Rate Limit:', `${cfg.rateLimit.maxRequests} requests per ${cfg.rateLimit.windowMs / 1000}s`);
  console.log('');
  console.log('============================================================');
  console.log('');
}

// ============================================================================
// Export Configuration
// ============================================================================

/**
 * Validated configuration object
 * This will fail fast at startup if any required config is missing
 */
export const config = validateAndTransform();

/**
 * Helper to check if running in production
 */
export function isProduction(): boolean {
  return config.env === 'production';
}

/**
 * Helper to check if running in development
 */
export function isDevelopment(): boolean {
  return config.env === 'development';
}

/**
 * Helper to check if running in test
 */
export function isTest(): boolean {
  return config.env === 'test';
}

export default config;
