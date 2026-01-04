/**
 * Zod schemas for common configuration validation
 *
 * These schemas provide reusable validation patterns for environment variables
 * across all UnifiedHealth microservices.
 */

import { z } from 'zod';

// ============================================================================
// Custom Validators
// ============================================================================

/**
 * Validates that a string is a valid URL
 */
const urlString = z.string().url('Must be a valid URL');

/**
 * Validates PostgreSQL connection string format
 */
const postgresUrl = z.string().refine(
  (val) => val.startsWith('postgresql://') || val.startsWith('postgres://'),
  { message: 'Must be a valid PostgreSQL connection string (postgresql:// or postgres://)' }
);

/**
 * Validates Redis connection string format
 */
const redisUrl = z.string().refine(
  (val) => val.startsWith('redis://') || val.startsWith('rediss://'),
  { message: 'Must be a valid Redis connection string (redis:// or rediss://)' }
);

/**
 * Validates port number is in valid range
 */
const portNumber = z.coerce.number()
  .int('Port must be an integer')
  .min(1, 'Port must be at least 1')
  .max(65535, 'Port must be at most 65535');

/**
 * Validates environment is one of the allowed values
 */
const nodeEnv = z.enum(['development', 'production', 'test'], {
  errorMap: () => ({ message: 'NODE_ENV must be development, production, or test' }),
});

/**
 * Validates log level is one of the allowed values
 */
const logLevel = z.enum(['error', 'warn', 'info', 'debug'], {
  errorMap: () => ({ message: 'LOG_LEVEL must be error, warn, info, or debug' }),
});

/**
 * Validates a secret meets minimum security requirements
 */
const secureSecret = (minLength: number = 32) =>
  z.string().min(minLength, `Secret must be at least ${minLength} characters for security`);

/**
 * Validates a non-empty string
 */
const nonEmptyString = z.string().min(1, 'Value cannot be empty');

/**
 * Validates a boolean from string (handles 'true', 'false', '1', '0')
 */
const booleanString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true' || val === '1';
  });

/**
 * Validates CORS origin (single URL or comma-separated list)
 */
const corsOrigin = z.string().transform((val) => {
  if (val === '*') return val;
  return val.split(',').map((origin) => origin.trim());
});

/**
 * Validates duration string (e.g., '1h', '7d', '15m')
 */
const durationString = z.string().regex(
  /^\d+[smhdw]$/,
  'Duration must be a number followed by s (seconds), m (minutes), h (hours), d (days), or w (weeks)'
);

// ============================================================================
// Base Configuration Schemas
// ============================================================================

/**
 * Base configuration schema shared by all services
 */
export const baseConfigSchema = z.object({
  NODE_ENV: nodeEnv.default('development'),
  PORT: portNumber.default(3000),
  LOG_LEVEL: logLevel.default('info'),
  CORS_ORIGIN: corsOrigin.default('*'),
});

/**
 * Database configuration schema
 */
export const databaseConfigSchema = z.object({
  DATABASE_URL: postgresUrl,
  DATABASE_POOL_MIN: z.coerce.number().min(1).default(2),
  DATABASE_POOL_MAX: z.coerce.number().min(1).default(10),
  DATABASE_SSL: booleanString.default(false),
});

/**
 * Redis configuration schema
 */
export const redisConfigSchema = z.object({
  REDIS_URL: redisUrl.optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: portNumber.default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_TLS: booleanString.default(false),
});

/**
 * JWT configuration schema
 */
export const jwtConfigSchema = z.object({
  JWT_SECRET: secureSecret(32),
  JWT_EXPIRES_IN: durationString.default('1h'),
  JWT_REFRESH_EXPIRES_IN: durationString.default('7d'),
  JWT_ISSUER: z.string().default('unified-health'),
});

/**
 * Rate limiting configuration schema
 */
export const rateLimitConfigSchema = z.object({
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(100),
});

// ============================================================================
// Export individual validators for use in custom schemas
// ============================================================================

export const validators = {
  urlString,
  postgresUrl,
  redisUrl,
  portNumber,
  nodeEnv,
  logLevel,
  secureSecret,
  nonEmptyString,
  booleanString,
  corsOrigin,
  durationString,
};

// ============================================================================
// Schema Types
// ============================================================================

export type BaseConfig = z.infer<typeof baseConfigSchema>;
export type DatabaseConfigEnv = z.infer<typeof databaseConfigSchema>;
export type RedisConfigEnv = z.infer<typeof redisConfigSchema>;
export type JwtConfigEnv = z.infer<typeof jwtConfigSchema>;
export type RateLimitConfigEnv = z.infer<typeof rateLimitConfigSchema>;
