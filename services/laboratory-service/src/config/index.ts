/**
 * Laboratory Service Configuration
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
 * Laboratory Service configuration schema
 * Validates all required and optional environment variables
 */
const laboratoryConfigSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3005),

  // CORS Configuration
  CORS_ORIGIN: z.string().default('*'),

  // Database Configuration
  DATABASE_URL: z.string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (val) => val.startsWith('postgresql://') || val.startsWith('postgres://'),
      { message: 'DATABASE_URL must be a valid PostgreSQL connection string' }
    ),

  // JWT Configuration
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security'),

  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // HL7/FHIR Integration (Optional)
  HL7_ENABLED: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  FHIR_SERVER_URL: z.string().url().optional().or(z.literal('')),

  // External Lab Systems Integration (Optional)
  LAB_INTEGRATION_ENABLED: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  LAB_INTEGRATION_API_KEY: z.string().optional(),
  LAB_INTEGRATION_API_URL: z.string().url().optional().or(z.literal('')),

  // Rate Limiting (Optional)
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(100),
});

// ============================================================================
// Type Exports
// ============================================================================

export interface LaboratoryConfig {
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
    secret: string;
  };

  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
  };

  hl7: {
    enabled: boolean;
    fhirServerUrl?: string;
  };

  labIntegration: {
    enabled: boolean;
    apiKey?: string;
    apiUrl?: string;
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
function validateAndTransform(): LaboratoryConfig {
  const result = laboratoryConfigSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors.map((err) => {
      const field = err.path.join('.') || 'unknown';
      return `  - ${field}: ${err.message}`;
    });

    const errorMessage = [
      '',
      '============================================================',
      '  CONFIGURATION ERROR: Laboratory Service',
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
    serviceName: 'laboratory-service',
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

    hl7: {
      enabled: env.HL7_ENABLED,
      fhirServerUrl: env.FHIR_SERVER_URL || undefined,
    },

    labIntegration: {
      enabled: env.LAB_INTEGRATION_ENABLED,
      apiKey: env.LAB_INTEGRATION_API_KEY,
      apiUrl: env.LAB_INTEGRATION_API_URL || undefined,
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
export function logConfig(cfg: LaboratoryConfig): void {
  const masked = maskSensitiveValues(cfg as unknown as Record<string, unknown>);

  console.log('');
  console.log('============================================================');
  console.log('  Laboratory Service Configuration');
  console.log('============================================================');
  console.log('');
  console.log('  Environment:', cfg.env);
  console.log('  Port:', cfg.port);
  console.log('  Log Level:', cfg.logging.level);
  console.log('  CORS Origin:', Array.isArray(cfg.cors.origin) ? cfg.cors.origin.join(', ') : cfg.cors.origin);
  console.log('');
  console.log('  Database URL:', maskValue(cfg.database.url));
  console.log('  JWT Secret:', (masked.jwt as Record<string, unknown>).secret);
  console.log('');
  console.log('  HL7 Integration:', cfg.hl7.enabled ? 'Enabled' : 'Disabled');
  if (cfg.hl7.enabled && cfg.hl7.fhirServerUrl) {
    console.log('  FHIR Server URL:', cfg.hl7.fhirServerUrl);
  }
  console.log('  Lab Integration:', cfg.labIntegration.enabled ? 'Enabled' : 'Disabled');
  if (cfg.labIntegration.enabled && cfg.labIntegration.apiUrl) {
    console.log('  Lab API URL:', cfg.labIntegration.apiUrl);
  }
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
