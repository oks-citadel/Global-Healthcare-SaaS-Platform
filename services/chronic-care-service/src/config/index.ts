/**
 * Chronic Care Service Configuration
 *
 * Validates and exports typed configuration from environment variables.
 * Implements fail-fast validation at startup with clear error messages.
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// ============================================================================
// Schema Definition
// ============================================================================

/**
 * Chronic Care Service configuration schema
 * Validates all required and optional environment variables
 */
const chronicCareConfigSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3003),

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

  // Redis Configuration (Optional - for caching device data)
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().min(1).max(65535).default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // Device Integration Configuration
  DEVICE_DATA_RETENTION_DAYS: z.coerce.number().min(1).default(365),
  MAX_DEVICES_PER_PATIENT: z.coerce.number().min(1).default(10),

  // Alert Configuration
  ALERT_EMAIL_ENABLED: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  ALERT_SMS_ENABLED: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  CRITICAL_ALERT_THRESHOLD_MINUTES: z.coerce.number().min(1).default(5),

  // Rate Limiting (Optional)
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(100),
});

// ============================================================================
// Type Exports
// ============================================================================

type ChronicCareConfigEnv = z.infer<typeof chronicCareConfigSchema>;

export interface ChronicCareConfig {
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

  redis: {
    url?: string;
    host: string;
    port: number;
    password?: string;
  };

  devices: {
    dataRetentionDays: number;
    maxDevicesPerPatient: number;
  };

  alerts: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    criticalAlertThresholdMinutes: number;
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
function validateAndTransform(): ChronicCareConfig {
  const result = chronicCareConfigSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors.map((err) => {
      const field = err.path.join('.') || 'unknown';
      return `  - ${field}: ${err.message}`;
    });

    const errorMessage = [
      '',
      '============================================================',
      '  CONFIGURATION ERROR: Chronic Care Service',
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
    serviceName: 'chronic-care-service',
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

    redis: {
      url: env.REDIS_URL,
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    },

    devices: {
      dataRetentionDays: env.DEVICE_DATA_RETENTION_DAYS,
      maxDevicesPerPatient: env.MAX_DEVICES_PER_PATIENT,
    },

    alerts: {
      emailEnabled: env.ALERT_EMAIL_ENABLED,
      smsEnabled: env.ALERT_SMS_ENABLED,
      criticalAlertThresholdMinutes: env.CRITICAL_ALERT_THRESHOLD_MINUTES,
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
export function logConfig(cfg: ChronicCareConfig): void {
  const masked = maskSensitiveValues(cfg as unknown as Record<string, unknown>);

  console.log('');
  console.log('============================================================');
  console.log('  Chronic Care Service Configuration');
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
  console.log('');
  console.log('  Redis:', cfg.redis.url ? maskValue(cfg.redis.url) : `${cfg.redis.host}:${cfg.redis.port}`);
  console.log('');
  console.log('  Device Settings:');
  console.log('    - Data Retention:', `${cfg.devices.dataRetentionDays} days`);
  console.log('    - Max Devices Per Patient:', cfg.devices.maxDevicesPerPatient);
  console.log('');
  console.log('  Alerts:');
  console.log('    - Email Alerts:', cfg.alerts.emailEnabled ? 'Enabled' : 'Disabled');
  console.log('    - SMS Alerts:', cfg.alerts.smsEnabled ? 'Enabled' : 'Disabled');
  console.log('    - Critical Threshold:', `${cfg.alerts.criticalAlertThresholdMinutes} minutes`);
  console.log('');
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
