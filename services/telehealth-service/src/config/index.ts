/**
 * Telehealth Service Configuration
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
 * Telehealth Service configuration schema
 * Validates all required and optional environment variables
 */
const telehealthConfigSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),

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

  // WebRTC Configuration
  TURN_SERVER_URL: z.string().optional(),
  TURN_USERNAME: z.string().optional(),
  TURN_PASSWORD: z.string().optional(),
  STUN_SERVER_URL: z.string().default('stun:stun.l.google.com:19302'),

  // Video Recording (Optional)
  VIDEO_RECORDING_ENABLED: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  RECORDING_STORAGE_BUCKET: z.string().optional(),
  RECORDING_ENCRYPTION_KEY: z.string().min(32).optional(),

  // Twilio Video (Optional - Alternative to WebRTC)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_API_KEY: z.string().optional(),
  TWILIO_API_SECRET: z.string().optional(),

  // Rate Limiting (Optional)
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(100),
});

// ============================================================================
// Type Exports
// ============================================================================

type TelehealthConfigEnv = z.infer<typeof telehealthConfigSchema>;

export interface TelehealthConfig {
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

  webrtc: {
    turnServerUrl?: string;
    turnUsername?: string;
    turnPassword?: string;
    stunServerUrl: string;
  };

  recording: {
    enabled: boolean;
    storageBucket?: string;
    encryptionKey?: string;
  };

  twilio: {
    accountSid?: string;
    authToken?: string;
    apiKey?: string;
    apiSecret?: string;
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
function validateAndTransform(): TelehealthConfig {
  const result = telehealthConfigSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors.map((err) => {
      const field = err.path.join('.') || 'unknown';
      return `  - ${field}: ${err.message}`;
    });

    const errorMessage = [
      '',
      '============================================================',
      '  CONFIGURATION ERROR: Telehealth Service',
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
    serviceName: 'telehealth-service',
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

    webrtc: {
      turnServerUrl: env.TURN_SERVER_URL,
      turnUsername: env.TURN_USERNAME,
      turnPassword: env.TURN_PASSWORD,
      stunServerUrl: env.STUN_SERVER_URL,
    },

    recording: {
      enabled: env.VIDEO_RECORDING_ENABLED,
      storageBucket: env.RECORDING_STORAGE_BUCKET,
      encryptionKey: env.RECORDING_ENCRYPTION_KEY,
    },

    twilio: {
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
      apiKey: env.TWILIO_API_KEY,
      apiSecret: env.TWILIO_API_SECRET,
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

const SENSITIVE_PATTERNS = ['secret', 'password', 'key', 'token', 'credential', 'auth'];

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
export function logConfig(cfg: TelehealthConfig): void {
  const masked = maskSensitiveValues(cfg as unknown as Record<string, unknown>);

  console.log('');
  console.log('============================================================');
  console.log('  Telehealth Service Configuration');
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
  console.log('  WebRTC STUN Server:', cfg.webrtc.stunServerUrl);
  if (cfg.webrtc.turnServerUrl) {
    console.log('  WebRTC TURN Server:', cfg.webrtc.turnServerUrl);
  }
  console.log('');
  console.log('  Video Recording:', cfg.recording.enabled ? 'Enabled' : 'Disabled');
  if (cfg.recording.enabled && cfg.recording.storageBucket) {
    console.log('  Recording Storage:', cfg.recording.storageBucket);
  }
  console.log('');
  console.log('  Twilio Integration:', cfg.twilio.accountSid ? 'Configured' : 'Not Configured');
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
