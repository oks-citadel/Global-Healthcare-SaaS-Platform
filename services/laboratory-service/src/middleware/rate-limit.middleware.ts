import { Request, Response, NextFunction, RequestHandler } from 'express';
import Redis from 'ioredis';

/**
 * Rate Limit Configuration Types
 */
export type RateLimitEndpointType = 'general' | 'auth' | 'upload' | 'search';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Rate limit configurations by endpoint type
 */
const RATE_LIMIT_CONFIGS: Record<RateLimitEndpointType, RateLimitConfig> = {
  general: {
    windowMs: parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_GENERAL_MAX || '100', 10),
    message: 'Too many requests. Please try again later.',
  },
  auth: {
    windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '10', 10),
    message: 'Too many authentication attempts. Please try again later.',
    skipSuccessfulRequests: false,
  },
  upload: {
    windowMs: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || '20', 10),
    message: 'Too many upload requests. Please try again later.',
  },
  search: {
    windowMs: parseInt(process.env.RATE_LIMIT_SEARCH_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_SEARCH_MAX || '60', 10),
    message: 'Too many search requests. Please try again later.',
  },
};

/**
 * Skip paths - endpoints that should not be rate limited
 */
const SKIP_PATHS = ['/health', '/metrics', '/ready'];

/**
 * Service name for logging and Redis key prefix
 */
const SERVICE_NAME = 'laboratory-service';

/**
 * Redis client and connection state
 */
let redisClient: Redis | null = null;
let redisConnected = false;

/**
 * In-memory fallback store
 */
const memoryStore = new Map<string, RateLimitEntry>();

/**
 * Initialize Redis client
 */
function initializeRedis(): void {
  const redisEnabled =
    process.env.RATE_LIMIT_REDIS_ENABLED === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.RATE_LIMIT_REDIS_ENABLED !== 'false');

  if (!redisEnabled) {
    console.log(`[RateLimit:${SERVICE_NAME}] Redis disabled, using in-memory store`);
    return;
  }

  const redisUrl =
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;

  try {
    redisClient = new Redis(redisUrl, {
      password: process.env.REDIS_PASSWORD || undefined,
      connectTimeout: 5000,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 10) {
          console.error(`[RateLimit:${SERVICE_NAME}] Redis max reconnection attempts reached`);
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      lazyConnect: false,
    });

    redisClient.on('connect', () => {
      console.log(`[RateLimit:${SERVICE_NAME}] Redis connected`);
      redisConnected = true;
    });

    redisClient.on('error', (err: Error) => {
      console.error(`[RateLimit:${SERVICE_NAME}] Redis error:`, err.message);
      redisConnected = false;
    });

    redisClient.on('close', () => {
      redisConnected = false;
    });
  } catch (error) {
    console.error(`[RateLimit:${SERVICE_NAME}] Failed to initialize Redis:`, (error as Error).message);
    redisClient = null;
  }
}

// Initialize Redis on module load
initializeRedis();

/**
 * Get client identifier from request
 */
function getClientIdentifier(req: Request): string {
  // Check for authenticated user
  const user = (req as any).user;
  if (user?.id || user?.userId) {
    return `user:${user.id || user.userId}`;
  }

  // Use IP address
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return `ip:${ips[0].trim()}`;
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return `ip:${typeof realIp === 'string' ? realIp : realIp[0]}`;
  }

  return `ip:${req.socket.remoteAddress || 'unknown'}`;
}

/**
 * Increment counter using Redis
 */
async function incrementRedis(
  key: string,
  windowMs: number
): Promise<{ totalHits: number; resetTime: Date }> {
  if (!redisClient || !redisConnected) {
    throw new Error('Redis not connected');
  }

  const fullKey = `rl:${SERVICE_NAME}:${key}`;
  const now = Date.now();

  const luaScript = `
    local current = redis.call('INCR', KEYS[1])
    if current == 1 then
      redis.call('PEXPIRE', KEYS[1], ARGV[1])
    end
    local ttl = redis.call('PTTL', KEYS[1])
    return {current, ttl}
  `;

  const result = (await redisClient.eval(luaScript, 1, fullKey, windowMs.toString())) as [number, number];
  const [count, ttl] = result;

  return {
    totalHits: count,
    resetTime: new Date(now + (ttl > 0 ? ttl : windowMs)),
  };
}

/**
 * Increment counter using in-memory store
 */
function incrementMemory(key: string, windowMs: number): { totalHits: number; resetTime: Date } {
  const now = Date.now();
  const fullKey = `${SERVICE_NAME}:${key}`;
  let entry = memoryStore.get(fullKey);

  if (!entry || now >= entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else {
    entry.count++;
  }

  memoryStore.set(fullKey, entry);

  return {
    totalHits: entry.count,
    resetTime: new Date(entry.resetTime),
  };
}

/**
 * Clean up expired entries from memory store
 */
function cleanupMemoryStore(): void {
  const now = Date.now();
  let removed = 0;

  for (const [key, entry] of memoryStore.entries()) {
    if (now >= entry.resetTime) {
      memoryStore.delete(key);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`[RateLimit:${SERVICE_NAME}] Cleaned up ${removed} expired entries`);
  }
}

// Run cleanup every minute
setInterval(cleanupMemoryStore, 60000);

/**
 * Create rate limit middleware for a specific endpoint type
 */
export function createRateLimitMiddleware(type: RateLimitEndpointType): RequestHandler {
  const config = RATE_LIMIT_CONFIGS[type];

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Skip rate limiting for certain paths
    if (SKIP_PATHS.some((path) => req.path === path || req.path.startsWith(path))) {
      next();
      return;
    }

    try {
      const clientId = getClientIdentifier(req);
      const key = `${type}:${clientId}`;
      let totalHits: number;
      let resetTime: Date;

      // Try Redis first, fall back to memory
      try {
        if (redisClient && redisConnected) {
          const result = await incrementRedis(key, config.windowMs);
          totalHits = result.totalHits;
          resetTime = result.resetTime;
        } else {
          const result = incrementMemory(key, config.windowMs);
          totalHits = result.totalHits;
          resetTime = result.resetTime;
        }
      } catch (redisError) {
        // Fall back to memory store on Redis error
        const result = incrementMemory(key, config.windowMs);
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
        console.warn(
          `[RateLimit:${SERVICE_NAME}] Rate limit exceeded for ${clientId} on ${type}: ${totalHits}/${config.max}`
        );

        const retryAfterSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
        res.setHeader('Retry-After', Math.max(1, retryAfterSeconds));

        res.status(429).json({
          error: 'Too Many Requests',
          message: config.message,
          retryAfter: retryAfterSeconds,
          limit: config.max,
          windowMs: config.windowMs,
        });
        return;
      }

      next();
    } catch (error) {
      console.error(`[RateLimit:${SERVICE_NAME}] Error:`, (error as Error).message);
      // Don't block requests on rate limit errors
      next();
    }
  };
}

/**
 * Pre-configured rate limiters
 */
export const generalRateLimit: RequestHandler = createRateLimitMiddleware('general');
export const authRateLimit: RequestHandler = createRateLimitMiddleware('auth');
export const uploadRateLimit: RequestHandler = createRateLimitMiddleware('upload');
export const searchRateLimit: RequestHandler = createRateLimitMiddleware('search');

/**
 * Combined rate limiter that applies general limits to all routes
 */
export const rateLimiter: Record<RateLimitEndpointType, RequestHandler> = {
  general: generalRateLimit,
  auth: authRateLimit,
  upload: uploadRateLimit,
  search: searchRateLimit,
};

/**
 * Get rate limit status
 */
export function getRateLimitStatus(): {
  redisConnected: boolean;
  storeType: 'redis' | 'memory';
  serviceName: string;
} {
  return {
    redisConnected,
    storeType: redisConnected ? 'redis' : 'memory',
    serviceName: SERVICE_NAME,
  };
}

/**
 * Close Redis connection gracefully
 */
export async function closeRateLimitConnection(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log(`[RateLimit:${SERVICE_NAME}] Redis connection closed`);
    } catch (error) {
      console.error(`[RateLimit:${SERVICE_NAME}] Error closing Redis:`, (error as Error).message);
    }
  }
}

export default rateLimiter;
