import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment mode detection
 */
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

/**
 * List of required environment variables for production
 */
const REQUIRED_ENV_VARS = [
  'JWT_SECRET',
  'DATABASE_URL',
  'ENCRYPTION_KEY',
] as const;

/**
 * List of recommended environment variables (warnings only)
 */
const RECOMMENDED_ENV_VARS = [
  'REDIS_PASSWORD',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
] as const;

/**
 * Get a required environment variable.
 * In production: throws an error if not set.
 * In development: returns fallback if provided.
 */
function getRequiredEnv(name: string, devFallback?: string): string {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (isDevelopment && devFallback !== undefined) {
    console.warn(`[CONFIG WARNING] Using development fallback for ${name}. This is NOT safe for production.`);
    return devFallback;
  }

  throw new Error(
    `Required environment variable ${name} is not set. ` +
    `Please set this variable before starting the application.`
  );
}

/**
 * Get an optional environment variable with a default value.
 */
function getOptionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Validate all configuration at startup.
 * This function should be called before the application starts accepting requests.
 */
export function validateConfig(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      if (isProduction) {
        errors.push(`Required environment variable ${envVar} is not set`);
      } else {
        warnings.push(`Environment variable ${envVar} is not set (using development fallback)`);
      }
    }
  }

  // Check recommended environment variables
  for (const envVar of RECOMMENDED_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(`Recommended environment variable ${envVar} is not set`);
    }
  }

  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    if (isProduction) {
      errors.push('JWT_SECRET must be at least 32 characters for production');
    } else {
      warnings.push('JWT_SECRET should be at least 32 characters');
    }
  }

  // Validate ENCRYPTION_KEY length (must be 32 bytes for AES-256)
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (encryptionKey && encryptionKey.length < 32) {
    errors.push('ENCRYPTION_KEY must be at least 32 characters (256 bits for AES-256)');
  }

  // Validate DATABASE_URL format
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    warnings.push('DATABASE_URL does not appear to be a valid PostgreSQL connection string');
  }

  // Production-specific validations
  if (isProduction) {
    // Check for localhost in CORS origins
    const corsOrigins = process.env.CORS_ORIGINS || '';
    if (corsOrigins.includes('localhost')) {
      warnings.push('CORS_ORIGINS contains localhost, which should be removed in production');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Run configuration validation and throw if invalid in production.
 */
function enforceValidConfig(): void {
  const validation = validateConfig();

  // Log warnings
  for (const warning of validation.warnings) {
    console.warn(`[CONFIG WARNING] ${warning}`);
  }

  // In production, fail fast on any errors
  if (!validation.valid) {
    const errorMessage = [
      'Configuration validation failed:',
      ...validation.errors.map(e => `  - ${e}`),
      '',
      'Please set all required environment variables before starting the application.',
    ].join('\n');

    throw new Error(errorMessage);
  }
}

// Build configuration object
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(getOptionalEnv('PORT', '8080'), 10),
  version: getOptionalEnv('API_VERSION', '1.0.0'),

  cors: {
    origins: getOptionalEnv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001,http://localhost:3002').split(','),
  },

  rateLimit: {
    max: parseInt(getOptionalEnv('RATE_LIMIT_MAX', '100'), 10),
  },

  jwt: {
    secret: getRequiredEnv('JWT_SECRET', isDevelopment ? 'dev-only-insecure-jwt-secret-min-32-chars' : undefined),
    expiresIn: getOptionalEnv('JWT_EXPIRY', '1h'),
    refreshExpiresIn: getOptionalEnv('REFRESH_TOKEN_EXPIRY', '7d'),
  },

  database: {
    url: getRequiredEnv('DATABASE_URL', isDevelopment ? 'postgresql://localhost:5432/unified_health_dev' : undefined),
  },

  redis: {
    host: getOptionalEnv('REDIS_HOST', 'localhost'),
    port: parseInt(getOptionalEnv('REDIS_PORT', '6379'), 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  encryption: {
    key: getRequiredEnv('ENCRYPTION_KEY', isDevelopment ? 'dev-only-32-byte-encryption-key!' : undefined),
  },

  aws: {
    region: getOptionalEnv('AWS_REGION', 'us-east-1'),
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3: {
      bucket: getOptionalEnv('AWS_S3_BUCKET', 'healthcare-documents'),
      quarantineBucket: getOptionalEnv('AWS_QUARANTINE_BUCKET', 'healthcare-quarantine'),
    },
    secretsManager: {
      enabled: process.env.AWS_SECRETS_MANAGER_ENABLED === 'true',
    },
  },

  storage: {
    url: getOptionalEnv('STORAGE_URL', 'https://storage.example.com'),
    container: getOptionalEnv('STORAGE_CONTAINER', 'documents'),
    maxFileSize: parseInt(getOptionalEnv('MAX_FILE_SIZE', '104857600'), 10), // 100MB
  },

  storageUrl: getOptionalEnv('STORAGE_URL', 'https://storage.example.com'),

  logging: {
    level: getOptionalEnv('LOG_LEVEL', 'info'),
  },

  push: {
    fcm: {
      serverKey: process.env.FCM_SERVER_KEY,
      senderId: process.env.FCM_SENDER_ID,
    },
    apns: {
      keyId: process.env.APNS_KEY_ID,
      teamId: process.env.APNS_TEAM_ID,
      bundleId: process.env.APNS_BUNDLE_ID,
      production: process.env.APNS_PRODUCTION === 'true',
      keyPath: process.env.APNS_KEY_PATH,
    },
    webPush: {
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
      subject: getOptionalEnv('VAPID_SUBJECT', 'mailto:support@theunifiedhealth.com'),
    },
  },
};

// Enforce valid configuration at module load time
enforceValidConfig();
