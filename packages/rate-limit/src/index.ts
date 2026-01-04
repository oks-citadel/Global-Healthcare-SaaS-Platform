/**
 * @unified-health/rate-limit
 *
 * Distributed rate limiting middleware with Redis support for UnifiedHealth services
 *
 * Features:
 * - Redis-based distributed rate limiting for multi-instance deployments
 * - Automatic fallback to in-memory store when Redis is unavailable
 * - Different rate limits for different endpoint types (general, auth, upload, search)
 * - Standard rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
 * - Proper 429 Too Many Requests responses
 * - Environment variable configuration
 * - TypeScript support
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createRateLimiter } from '@unified-health/rate-limit';
 *
 * const app = express();
 *
 * const rateLimiter = createRateLimiter({
 *   serviceName: 'my-service',
 *   redis: {
 *     host: process.env.REDIS_HOST,
 *     port: parseInt(process.env.REDIS_PORT || '6379'),
 *   },
 * });
 *
 * // Apply different rate limits to different routes
 * app.use('/api', rateLimiter.general);        // 100 req/min
 * app.use('/auth', rateLimiter.auth);          // 10 req/min
 * app.use('/upload', rateLimiter.upload);      // 20 req/min
 * app.use('/search', rateLimiter.search);      // 60 req/min
 *
 * // Graceful shutdown
 * process.on('SIGTERM', async () => {
 *   await rateLimiter.close();
 *   process.exit(0);
 * });
 * ```
 *
 * Environment Variables:
 * - RATE_LIMIT_REDIS_ENABLED: Enable Redis store (default: true in production)
 * - REDIS_HOST: Redis host (default: localhost)
 * - REDIS_PORT: Redis port (default: 6379)
 * - REDIS_PASSWORD: Redis password
 * - REDIS_URL: Redis URL (overrides host/port)
 * - RATE_LIMIT_GENERAL_MAX: General rate limit (default: 100)
 * - RATE_LIMIT_GENERAL_WINDOW_MS: General window (default: 60000)
 * - RATE_LIMIT_AUTH_MAX: Auth rate limit (default: 10)
 * - RATE_LIMIT_AUTH_WINDOW_MS: Auth window (default: 60000)
 * - RATE_LIMIT_UPLOAD_MAX: Upload rate limit (default: 20)
 * - RATE_LIMIT_UPLOAD_WINDOW_MS: Upload window (default: 60000)
 * - RATE_LIMIT_SEARCH_MAX: Search rate limit (default: 60)
 * - RATE_LIMIT_SEARCH_WINDOW_MS: Search window (default: 60000)
 */

export { createRateLimiter, createSimpleRateLimiter, createExpressRateLimitStore } from './middleware.js';

export { DEFAULT_CONFIGS, buildConfigsFromEnv, loadEnvConfig, REDIS_DEFAULTS } from './config.js';

export { MemoryStore } from './stores/memory-store.js';
export { RedisStore } from './stores/redis-store.js';

export type {
  RateLimitEndpointType,
  RateLimitConfig,
  RateLimitConfigs,
  RateLimiterOptions,
  RateLimiterMiddleware,
  RateLimitStatus,
  RateLimitInfo,
  RateLimitStore,
  RedisConnectionOptions,
  RateLimitEnvConfig,
} from './types.js';
