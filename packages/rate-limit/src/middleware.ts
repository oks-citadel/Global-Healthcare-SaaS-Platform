import { Request, Response, NextFunction, RequestHandler } from 'express';
import rateLimit, { Options as RateLimitOptions } from 'express-rate-limit';
import {
  RateLimiterOptions,
  RateLimiterMiddleware,
  RateLimitEndpointType,
  RateLimitConfigs,
  RateLimitStatus,
  RateLimitInfo,
} from './types.js';
import { buildConfigsFromEnv, loadEnvConfig, DEFAULT_CONFIGS } from './config.js';
import { MemoryStore } from './stores/memory-store.js';
import { RedisStore } from './stores/redis-store.js';

/**
 * Extended request type with user info
 */
interface ExtendedRequest extends Request {
  user?: {
    id?: string;
    userId?: string;
    role?: string;
  };
}

/**
 * Create rate limiting middleware for a service
 *
 * @param options - Rate limiter options
 * @returns Rate limiter middleware factory
 *
 * @example
 * ```typescript
 * import { createRateLimiter } from '@unified-health/rate-limit';
 *
 * const rateLimiter = createRateLimiter({
 *   serviceName: 'telehealth-service',
 *   redis: {
 *     host: process.env.REDIS_HOST,
 *     port: parseInt(process.env.REDIS_PORT || '6379'),
 *   },
 * });
 *
 * app.use('/api', rateLimiter.general);
 * app.use('/auth', rateLimiter.auth);
 * app.use('/upload', rateLimiter.upload);
 * app.use('/search', rateLimiter.search);
 * ```
 */
export function createRateLimiter(options: RateLimiterOptions): RateLimiterMiddleware {
  const { serviceName, redis, skipPaths = ['/health', '/metrics', '/ready'], verbose = false } = options;

  // Load configs from env and merge with provided configs
  const envConfigs = buildConfigsFromEnv();
  const configs: RateLimitConfigs = {
    general: options.configs?.general || envConfigs.general,
    auth: options.configs?.auth || envConfigs.auth,
    upload: options.configs?.upload || envConfigs.upload,
    search: options.configs?.search || envConfigs.search,
  };

  // Initialize stores
  const envConfig = loadEnvConfig();
  let redisStore: RedisStore | null = null;
  const memoryStores: Map<string, MemoryStore> = new Map();
  let storeType: 'redis' | 'memory' = 'memory';
  let lastError: string | undefined;

  // Try to initialize Redis if enabled
  if (envConfig.RATE_LIMIT_REDIS_ENABLED && redis) {
    try {
      redisStore = new RedisStore(
        {
          host: redis.host || envConfig.REDIS_HOST,
          port: redis.port || envConfig.REDIS_PORT,
          password: redis.password || envConfig.REDIS_PASSWORD,
          url: redis.url || envConfig.REDIS_URL,
          keyPrefix: redis.keyPrefix || `rl:${serviceName}:`,
        },
        configs.general.windowMs,
        serviceName
      );
      storeType = 'redis';
      log(`Redis store initialized`);
    } catch (error) {
      const err = error as Error;
      lastError = err.message;
      log(`Failed to initialize Redis, using memory store: ${err.message}`, 'error');
    }
  } else {
    log(`Using in-memory store (Redis disabled or not configured)`);
  }

  /**
   * Log helper
   */
  function log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (verbose || level === 'error') {
      const prefix = `[RateLimit:${serviceName}]`;
      switch (level) {
        case 'error':
          console.error(`${prefix} ${message}`);
          break;
        case 'warn':
          console.warn(`${prefix} ${message}`);
          break;
        default:
          console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Get client identifier from request
   */
  function getClientIdentifier(req: ExtendedRequest): string {
    // Use custom key generator if provided
    if (options.keyGenerator) {
      return options.keyGenerator(req);
    }

    // Use user ID if authenticated
    const userId = req.user?.id || req.user?.userId;
    if (userId) {
      return `user:${userId}`;
    }

    // Use IP address
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
      return `ip:${ips[0].trim()}`;
    }

    const realIp = req.headers['x-real-ip'];
    if (realIp) {
      const ip = typeof realIp === 'string' ? realIp : realIp[0];
      return `ip:${ip}`;
    }

    return `ip:${req.socket.remoteAddress || 'unknown'}`;
  }

  /**
   * Get or create memory store for a window
   */
  function getMemoryStore(windowMs: number): MemoryStore {
    const key = windowMs.toString();
    if (!memoryStores.has(key)) {
      memoryStores.set(key, new MemoryStore(windowMs));
    }
    return memoryStores.get(key)!;
  }

  /**
   * Create rate limiter middleware for a specific type
   */
  function createLimiterForType(type: RateLimitEndpointType): RequestHandler {
    const config = configs[type] || DEFAULT_CONFIGS.general;
    const memoryStore = getMemoryStore(config.windowMs);

    // Determine if we should use Redis or fall back to memory
    const useRedis = redisStore?.isConnected() ?? false;

    return async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
      // Skip rate limiting for certain paths
      if (skipPaths.some(path => req.path === path || req.path.startsWith(path))) {
        next();
        return;
      }

      try {
        const key = `${type}:${getClientIdentifier(req)}`;
        let totalHits: number;
        let resetTime: Date;

        // Try Redis first, fall back to memory
        if (useRedis && redisStore?.isConnected()) {
          try {
            const result = await redisStore.increment(key);
            totalHits = result.totalHits;
            resetTime = result.resetTime;
          } catch (redisError) {
            // Fall back to memory store
            log(`Redis error, falling back to memory: ${(redisError as Error).message}`, 'warn');
            const result = await memoryStore.increment(key);
            totalHits = result.totalHits;
            resetTime = result.resetTime;
          }
        } else {
          const result = await memoryStore.increment(key);
          totalHits = result.totalHits;
          resetTime = result.resetTime;
        }

        const remaining = Math.max(0, config.max - totalHits);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', config.max);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', resetTime.toISOString());
        res.setHeader('X-RateLimit-Policy', `${config.max};w=${Math.ceil(config.windowMs / 1000)}`);

        // Check if limit exceeded
        if (totalHits > config.max) {
          // Log rate limit violation
          log(
            `Rate limit exceeded for ${key}: ${totalHits}/${config.max} (type: ${type})`,
            'warn'
          );

          // Call custom handler if provided
          if (options.onLimitReached) {
            const info: RateLimitInfo = {
              type,
              limit: config.max,
              current: totalHits,
              remaining: 0,
              resetTime,
            };
            options.onLimitReached(req, res, info);
          }

          // Set Retry-After header
          const retryAfterSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
          res.setHeader('Retry-After', Math.max(1, retryAfterSeconds));

          // Send 429 response
          res.status(429).json({
            error: 'Too Many Requests',
            message: config.message || 'Rate limit exceeded. Please try again later.',
            retryAfter: retryAfterSeconds,
            limit: config.max,
            windowMs: config.windowMs,
          });
          return;
        }

        // Handle skipSuccessfulRequests option
        if (config.skipSuccessfulRequests) {
          const originalSend = res.send.bind(res);
          res.send = function(body: any) {
            if (res.statusCode < 400) {
              // Decrement counter for successful requests
              if (useRedis && redisStore?.isConnected()) {
                redisStore.decrement(key).catch(() => {});
              } else {
                memoryStore.decrement(key).catch(() => {});
              }
            }
            return originalSend(body);
          };
        }

        next();
      } catch (error) {
        const err = error as Error;
        log(`Rate limit error: ${err.message}`, 'error');
        // Don't block requests on rate limit errors
        next();
      }
    };
  }

  /**
   * Get rate limiter status
   */
  function getStatus(): RateLimitStatus {
    return {
      redisConnected: redisStore?.isConnected() ?? false,
      storeType: redisStore?.isConnected() ? 'redis' : 'memory',
      serviceName,
      lastError,
    };
  }

  /**
   * Close all connections
   */
  async function close(): Promise<void> {
    if (redisStore) {
      await redisStore.close();
    }
    for (const store of memoryStores.values()) {
      await store.close();
    }
    memoryStores.clear();
    log('All rate limit stores closed');
  }

  // Create middleware for each type
  const generalMiddleware = createLimiterForType('general');
  const authMiddleware = createLimiterForType('auth');
  const uploadMiddleware = createLimiterForType('upload');
  const searchMiddleware = createLimiterForType('search');

  return {
    general: generalMiddleware,
    auth: authMiddleware,
    upload: uploadMiddleware,
    search: searchMiddleware,
    forType: createLimiterForType,
    getStatus,
    close,
  };
}

/**
 * Create a simple rate limiter without Redis (in-memory only)
 * Useful for development or single-instance deployments
 */
export function createSimpleRateLimiter(
  serviceName: string,
  configs?: Partial<RateLimitConfigs>
): RateLimiterMiddleware {
  return createRateLimiter({
    serviceName,
    configs,
  });
}

/**
 * Express-rate-limit compatible store adapter
 * For use with express-rate-limit directly
 */
export function createExpressRateLimitStore(
  serviceName: string,
  windowMs: number,
  redis?: { host?: string; port?: number; password?: string; url?: string }
): { store: any; close: () => Promise<void> } {
  const envConfig = loadEnvConfig();

  if (envConfig.RATE_LIMIT_REDIS_ENABLED && redis) {
    const redisStore = new RedisStore(
      {
        host: redis.host || envConfig.REDIS_HOST,
        port: redis.port || envConfig.REDIS_PORT,
        password: redis.password || envConfig.REDIS_PASSWORD,
        url: redis.url || envConfig.REDIS_URL,
      },
      windowMs,
      serviceName
    );

    return {
      store: {
        async increment(key: string) {
          if (redisStore.isConnected()) {
            return redisStore.increment(key);
          }
          throw new Error('Redis not connected');
        },
        async decrement(key: string) {
          await redisStore.decrement(key);
        },
        async resetKey(key: string) {
          await redisStore.resetKey(key);
        },
      },
      close: () => redisStore.close(),
    };
  }

  const memoryStore = new MemoryStore(windowMs);
  return {
    store: memoryStore,
    close: () => memoryStore.close(),
  };
}
