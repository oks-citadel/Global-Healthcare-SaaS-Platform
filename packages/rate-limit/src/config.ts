import { RateLimitConfigs, RateLimitEnvConfig } from './types.js';

/**
 * Default rate limit configurations
 * These can be overridden via environment variables or options
 */
export const DEFAULT_CONFIGS: RateLimitConfigs = {
  // General API: 100 requests/minute
  general: {
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many requests. Please try again later.',
  },

  // Authentication: 10 requests/minute (stricter to prevent brute force)
  auth: {
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: 'Too many authentication attempts. Please try again later.',
    skipSuccessfulRequests: false, // Count all attempts
    blockDuration: 15 * 60 * 1000, // 15 minutes block after exceeding
  },

  // File uploads: 20 requests/minute
  upload: {
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: 'Too many upload requests. Please try again later.',
  },

  // Search/query: 60 requests/minute
  search: {
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: 'Too many search requests. Please try again later.',
  },
};

/**
 * Load configuration from environment variables
 */
export function loadEnvConfig(): Partial<RateLimitEnvConfig> {
  return {
    RATE_LIMIT_REDIS_ENABLED: process.env.RATE_LIMIT_REDIS_ENABLED === 'true' ||
      (process.env.NODE_ENV === 'production' && process.env.RATE_LIMIT_REDIS_ENABLED !== 'false'),
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_URL: process.env.REDIS_URL,
    RATE_LIMIT_GENERAL_MAX: parseInt(process.env.RATE_LIMIT_GENERAL_MAX || '100', 10),
    RATE_LIMIT_GENERAL_WINDOW_MS: parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW_MS || '60000', 10),
    RATE_LIMIT_AUTH_MAX: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '10', 10),
    RATE_LIMIT_AUTH_WINDOW_MS: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '60000', 10),
    RATE_LIMIT_UPLOAD_MAX: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || '20', 10),
    RATE_LIMIT_UPLOAD_WINDOW_MS: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS || '60000', 10),
    RATE_LIMIT_SEARCH_MAX: parseInt(process.env.RATE_LIMIT_SEARCH_MAX || '60', 10),
    RATE_LIMIT_SEARCH_WINDOW_MS: parseInt(process.env.RATE_LIMIT_SEARCH_WINDOW_MS || '60000', 10),
  };
}

/**
 * Build rate limit configs from environment variables
 */
export function buildConfigsFromEnv(): RateLimitConfigs {
  const env = loadEnvConfig();

  return {
    general: {
      ...DEFAULT_CONFIGS.general,
      max: env.RATE_LIMIT_GENERAL_MAX || DEFAULT_CONFIGS.general.max,
      windowMs: env.RATE_LIMIT_GENERAL_WINDOW_MS || DEFAULT_CONFIGS.general.windowMs,
    },
    auth: {
      ...DEFAULT_CONFIGS.auth,
      max: env.RATE_LIMIT_AUTH_MAX || DEFAULT_CONFIGS.auth.max,
      windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS || DEFAULT_CONFIGS.auth.windowMs,
    },
    upload: {
      ...DEFAULT_CONFIGS.upload,
      max: env.RATE_LIMIT_UPLOAD_MAX || DEFAULT_CONFIGS.upload.max,
      windowMs: env.RATE_LIMIT_UPLOAD_WINDOW_MS || DEFAULT_CONFIGS.upload.windowMs,
    },
    search: {
      ...DEFAULT_CONFIGS.search,
      max: env.RATE_LIMIT_SEARCH_MAX || DEFAULT_CONFIGS.search.max,
      windowMs: env.RATE_LIMIT_SEARCH_WINDOW_MS || DEFAULT_CONFIGS.search.windowMs,
    },
  };
}

/**
 * Redis configuration defaults
 */
export const REDIS_DEFAULTS = {
  host: 'localhost',
  port: 6379,
  connectTimeout: 5000,
  maxRetries: 10,
  keyPrefix: 'rl:',
  retryDelayMs: 100,
  maxRetryDelayMs: 3000,
};
