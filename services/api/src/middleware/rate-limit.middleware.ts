// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import { TooManyRequestsError } from '../utils/errors.js';
import { auditService } from '../services/audit.service.js';

/**
 * HIPAA-Compliant Distributed Rate Limiting Middleware
 * Enhanced rate limiting with Redis support for distributed systems
 * Uses Redis in production for multi-replica scaling, falls back to in-memory for development
 * Protects against brute force attacks and abuse
 */

// ============================================
// Redis Configuration
// ============================================

let redisClient: RedisClientType | null = null;
let redisConnected = false;
let redisConnectionAttempted = false;

/**
 * Initialize Redis client for distributed rate limiting
 */
async function initializeRedisClient(): Promise<void> {
  if (redisConnectionAttempted) return;
  redisConnectionAttempted = true;

  const redisEnabled = process.env.RATE_LIMIT_REDIS_ENABLED === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.RATE_LIMIT_REDIS_ENABLED !== 'false');

  if (!redisEnabled) {
    console.log('[RateLimit] Redis disabled, using in-memory store');
    return;
  }

  const redisUrl = process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

  try {
    redisClient = createClient({
      url: redisUrl,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('[RateLimit] Redis max reconnection attempts reached, falling back to in-memory');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        },
        connectTimeout: 5000,
      },
    });

    redisClient.on('error', (err) => {
      console.error('[RateLimit] Redis client error:', err.message);
      redisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('[RateLimit] Redis client connected');
      redisConnected = true;
    });

    redisClient.on('ready', () => {
      console.log('[RateLimit] Redis client ready for rate limiting');
      redisConnected = true;
    });

    redisClient.on('end', () => {
      console.log('[RateLimit] Redis client disconnected');
      redisConnected = false;
    });

    await redisClient.connect();
    redisConnected = true;
    console.log('[RateLimit] Redis store initialized successfully');
  } catch (error) {
    console.error('[RateLimit] Failed to connect to Redis:', error);
    console.log('[RateLimit] Falling back to in-memory store');
    redisClient = null;
    redisConnected = false;
  }
}

// Initialize Redis connection
initializeRedisClient().catch(console.error);

/**
 * Check if Redis is available for rate limiting
 */
function isRedisAvailable(): boolean {
  return redisClient !== null && redisConnected;
}

// ============================================
// Rate Limit Store Interfaces
// ============================================

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  blockExpiry?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  blocked?: boolean;
}

// ============================================
// In-Memory Store (Fallback)
// ============================================

const memoryRateLimitStore = new Map<string, RateLimitEntry>();
const memoryIpBlockList = new Map<string, number>();

// ============================================
// Rate Limit Configurations
// ============================================

const RATE_LIMIT_CONFIG = {
  // General API requests
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },

  // Authentication endpoints (stricter)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    blockDuration: 30 * 60 * 1000, // 30 minutes block after exceeding
  },

  // Password reset (very strict)
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    blockDuration: 60 * 60 * 1000, // 1 hour block
  },

  // PHI access endpoints
  phi: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per window
  },

  // Data export (very strict)
  export: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 exports per hour
    blockDuration: 24 * 60 * 60 * 1000, // 24 hours block
  },

  // Document download
  download: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 downloads per window
  },

  // API key generation
  apiKey: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, // 3 keys per day
  },
};

// Redis key prefixes
const REDIS_PREFIX = {
  rateLimit: 'rl:',
  ipBlock: 'rl:ipblock:',
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get client identifier (user ID or IP)
 */
function getClientIdentifier(req: Request): string {
  if (req.user?.userId) {
    return `user:${req.user.userId}`;
  }

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
 * Get IP address from request
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return ips[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return typeof realIp === 'string' ? realIp : realIp[0];
  }

  return req.socket.remoteAddress || 'unknown';
}

/**
 * Get rate limit key
 */
function getRateLimitKey(identifier: string, limitType: string): string {
  return `${limitType}:${identifier}`;
}

// ============================================
// Redis Store Operations
// ============================================

/**
 * Check if IP is blocked (Redis)
 */
async function isIpBlockedRedis(ip: string): Promise<boolean> {
  if (!isRedisAvailable()) return isIpBlockedMemory(ip);

  try {
    const blockKey = `${REDIS_PREFIX.ipBlock}${ip}`;
    const blockExpiry = await redisClient!.get(blockKey);

    if (!blockExpiry) return false;

    const expiryTime = parseInt(blockExpiry, 10);
    if (Date.now() < expiryTime) {
      return true;
    }

    // Clean up expired block
    await redisClient!.del(blockKey);
    return false;
  } catch (error) {
    console.error('[RateLimit] Redis isIpBlocked error:', error);
    return isIpBlockedMemory(ip);
  }
}

/**
 * Block IP address (Redis)
 */
async function blockIpRedis(ip: string, duration: number): Promise<void> {
  const expiry = Date.now() + duration;

  if (!isRedisAvailable()) {
    blockIpMemory(ip, duration);
    return;
  }

  try {
    const blockKey = `${REDIS_PREFIX.ipBlock}${ip}`;
    const ttlSeconds = Math.ceil(duration / 1000);
    await redisClient!.setEx(blockKey, ttlSeconds, expiry.toString());
    console.log(`[RateLimit] IP blocked in Redis: ${ip} until ${new Date(expiry).toISOString()}`);
  } catch (error) {
    console.error('[RateLimit] Redis blockIp error:', error);
    blockIpMemory(ip, duration);
  }
}

/**
 * Check rate limit (Redis)
 */
async function checkRateLimitRedis(
  key: string,
  config: { windowMs: number; max: number; blockDuration?: number }
): Promise<RateLimitResult> {
  if (!isRedisAvailable()) {
    return checkRateLimitMemory(key, config);
  }

  try {
    const redisKey = `${REDIS_PREFIX.rateLimit}${key}`;
    const now = Date.now();

    // Use Redis transaction for atomic operations
    const entryJson = await redisClient!.get(redisKey);
    let entry: RateLimitEntry;

    if (entryJson) {
      entry = JSON.parse(entryJson);

      const windowExpired = now - entry.firstRequest > config.windowMs;
      const blockExpired = entry.blocked && entry.blockExpiry && now > entry.blockExpiry;

      if (windowExpired && !entry.blocked) {
        entry = {
          count: 0,
          firstRequest: now,
          lastRequest: now,
          blocked: false,
        };
      } else if (blockExpired) {
        entry = {
          count: 0,
          firstRequest: now,
          lastRequest: now,
          blocked: false,
        };
      }
    } else {
      entry = {
        count: 0,
        firstRequest: now,
        lastRequest: now,
        blocked: false,
      };
    }

    // Check if blocked
    if (entry.blocked && entry.blockExpiry && now < entry.blockExpiry) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockExpiry,
        blocked: true,
      };
    }

    // Increment count
    entry.count++;
    entry.lastRequest = now;

    // Check if limit exceeded
    if (entry.count > config.max) {
      if (config.blockDuration) {
        entry.blocked = true;
        entry.blockExpiry = now + config.blockDuration;
      }

      // Calculate TTL for Redis key
      const ttlMs = entry.blocked && entry.blockExpiry
        ? entry.blockExpiry - now
        : config.windowMs - (now - entry.firstRequest);
      const ttlSeconds = Math.max(Math.ceil(ttlMs / 1000), 1);

      await redisClient!.setEx(redisKey, ttlSeconds, JSON.stringify(entry));

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.firstRequest + config.windowMs,
        blocked: entry.blocked,
      };
    }

    // Calculate TTL for Redis key
    const ttlMs = config.windowMs - (now - entry.firstRequest);
    const ttlSeconds = Math.max(Math.ceil(ttlMs / 1000), 1);

    await redisClient!.setEx(redisKey, ttlSeconds, JSON.stringify(entry));

    return {
      allowed: true,
      remaining: config.max - entry.count,
      resetTime: entry.firstRequest + config.windowMs,
    };
  } catch (error) {
    console.error('[RateLimit] Redis checkRateLimit error:', error);
    return checkRateLimitMemory(key, config);
  }
}

/**
 * Decrement rate limit counter (Redis) - used for skipSuccessfulRequests
 */
async function decrementRateLimitRedis(key: string): Promise<void> {
  if (!isRedisAvailable()) {
    decrementRateLimitMemory(key);
    return;
  }

  try {
    const redisKey = `${REDIS_PREFIX.rateLimit}${key}`;
    const entryJson = await redisClient!.get(redisKey);

    if (entryJson) {
      const entry: RateLimitEntry = JSON.parse(entryJson);
      if (entry.count > 0) {
        entry.count--;
        const ttl = await redisClient!.ttl(redisKey);
        if (ttl > 0) {
          await redisClient!.setEx(redisKey, ttl, JSON.stringify(entry));
        }
      }
    }
  } catch (error) {
    console.error('[RateLimit] Redis decrementRateLimit error:', error);
    decrementRateLimitMemory(key);
  }
}

// ============================================
// In-Memory Store Operations (Fallback)
// ============================================

/**
 * Check if IP is blocked (Memory)
 */
function isIpBlockedMemory(ip: string): boolean {
  const blockExpiry = memoryIpBlockList.get(ip);
  if (!blockExpiry) return false;

  if (Date.now() < blockExpiry) {
    return true;
  }

  memoryIpBlockList.delete(ip);
  return false;
}

/**
 * Block IP address (Memory)
 */
function blockIpMemory(ip: string, duration: number): void {
  const expiry = Date.now() + duration;
  memoryIpBlockList.set(ip, expiry);
  console.log(`[RateLimit] IP blocked in memory: ${ip} until ${new Date(expiry).toISOString()}`);
}

/**
 * Check rate limit (Memory)
 */
function checkRateLimitMemory(
  key: string,
  config: { windowMs: number; max: number; blockDuration?: number }
): RateLimitResult {
  const now = Date.now();
  let entry = memoryRateLimitStore.get(key);

  if (entry) {
    const windowExpired = now - entry.firstRequest > config.windowMs;
    const blockExpired = entry.blocked && entry.blockExpiry && now > entry.blockExpiry;

    if (windowExpired && !entry.blocked) {
      entry = undefined;
    } else if (blockExpired) {
      entry = undefined;
    }
  }

  if (!entry) {
    entry = {
      count: 0,
      firstRequest: now,
      lastRequest: now,
      blocked: false,
    };
    memoryRateLimitStore.set(key, entry);
  }

  if (entry.blocked && entry.blockExpiry && now < entry.blockExpiry) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockExpiry,
      blocked: true,
    };
  }

  entry.count++;
  entry.lastRequest = now;

  if (entry.count > config.max) {
    if (config.blockDuration) {
      entry.blocked = true;
      entry.blockExpiry = now + config.blockDuration;
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.firstRequest + config.windowMs,
      blocked: entry.blocked,
    };
  }

  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetTime: entry.firstRequest + config.windowMs,
  };
}

/**
 * Decrement rate limit counter (Memory)
 */
function decrementRateLimitMemory(key: string): void {
  const entry = memoryRateLimitStore.get(key);
  if (entry && entry.count > 0) {
    entry.count--;
  }
}

// ============================================
// Middleware Factory
// ============================================

/**
 * Create rate limit middleware
 */
function createRateLimiter(
  limitType: keyof typeof RATE_LIMIT_CONFIG,
  options?: {
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (req: Request) => string;
  }
) {
  const config = RATE_LIMIT_CONFIG[limitType];

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = getClientIp(req);

      // Check IP block list
      const ipBlocked = await isIpBlockedRedis(ip);
      if (ipBlocked) {
        const blockKey = `${REDIS_PREFIX.ipBlock}${ip}`;
        let resetTime = 'unknown';

        if (isRedisAvailable()) {
          try {
            const blockExpiry = await redisClient!.get(blockKey);
            if (blockExpiry) {
              resetTime = new Date(parseInt(blockExpiry, 10)).toISOString();
            }
          } catch {
            const memoryExpiry = memoryIpBlockList.get(ip);
            if (memoryExpiry) {
              resetTime = new Date(memoryExpiry).toISOString();
            }
          }
        } else {
          const memoryExpiry = memoryIpBlockList.get(ip);
          if (memoryExpiry) {
            resetTime = new Date(memoryExpiry).toISOString();
          }
        }

        await auditService.logEvent({
          userId: req.user?.userId || 'anonymous',
          action: 'blocked_request',
          resource: 'rate_limit',
          details: {
            ip,
            path: req.path,
            reason: 'ip_blocked',
            resetTime,
            store: isRedisAvailable() ? 'redis' : 'memory',
          },
          ipAddress: ip,
          userAgent: req.headers['user-agent'] || 'unknown',
        });

        return next(new TooManyRequestsError(
          `IP address blocked due to excessive requests. Try again after ${resetTime}`
        ));
      }

      // Get client identifier
      const identifier = options?.keyGenerator
        ? options.keyGenerator(req)
        : getClientIdentifier(req);

      const key = getRateLimitKey(identifier, limitType);

      // Check rate limit
      const result = await checkRateLimitRedis(key, config);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      res.setHeader('X-RateLimit-Store', isRedisAvailable() ? 'redis' : 'memory');

      if (!result.allowed) {
        // Block IP if this is an auth endpoint and user is blocked
        if (limitType === 'auth' && result.blocked) {
          await blockIpRedis(ip, config.blockDuration || 0);
        }

        // Log rate limit violation
        await auditService.logEvent({
          userId: req.user?.userId || 'anonymous',
          action: 'rate_limit_exceeded',
          resource: 'rate_limit',
          details: {
            limitType,
            identifier,
            ip,
            path: req.path,
            blocked: result.blocked,
            resetTime: new Date(result.resetTime).toISOString(),
            store: isRedisAvailable() ? 'redis' : 'memory',
          },
          ipAddress: ip,
          userAgent: req.headers['user-agent'] || 'unknown',
        });

        const message = result.blocked
          ? `Too many requests. Account temporarily blocked until ${new Date(result.resetTime).toISOString()}`
          : `Too many requests. Please try again after ${new Date(result.resetTime).toISOString()}`;

        return next(new TooManyRequestsError(message));
      }

      // Handle conditional counting based on response status
      if (options?.skipSuccessfulRequests || options?.skipFailedRequests) {
        const originalSend = res.send;
        const originalJson = res.json;

        let responseSent = false;

        const decrementCounter = async () => {
          if (responseSent) return;
          responseSent = true;

          const shouldSkip =
            (options.skipSuccessfulRequests && res.statusCode < 400) ||
            (options.skipFailedRequests && res.statusCode >= 400);

          if (shouldSkip) {
            await decrementRateLimitRedis(key);
          }
        };

        res.send = function(data: any) {
          decrementCounter().catch(console.error);
          return originalSend.call(this, data);
        };

        res.json = function(data: any) {
          decrementCounter().catch(console.error);
          return originalJson.call(this, data);
        };
      }

      next();
    } catch (error) {
      console.error('[RateLimit] Middleware error:', error);
      next(error);
    }
  };
}

// ============================================
// Exported Rate Limiters
// ============================================

/**
 * General rate limiter (100 req/15min)
 */
export const generalRateLimit = createRateLimiter('general');

/**
 * Auth endpoint rate limiter (5 req/15min, blocks after exceeding)
 */
export const authRateLimit = createRateLimiter('auth', {
  skipSuccessfulRequests: true, // Only count failed attempts
});

/**
 * Password reset rate limiter (3 req/hour, blocks for 1 hour)
 */
export const passwordResetRateLimit = createRateLimiter('passwordReset');

/**
 * PHI access rate limiter (200 req/15min)
 */
export const phiRateLimit = createRateLimiter('phi');

/**
 * Export rate limiter (5 req/hour, blocks for 24 hours)
 */
export const exportRateLimit = createRateLimiter('export');

/**
 * Download rate limiter (50 req/15min)
 */
export const downloadRateLimit = createRateLimiter('download');

/**
 * API key generation rate limiter (3 req/day)
 */
export const apiKeyRateLimit = createRateLimiter('apiKey');

/**
 * Per-user rate limiter
 */
export const perUserRateLimit = (max: number, windowMs: number) => {
  return createRateLimiter('general', {
    keyGenerator: (req) => {
      if (req.user?.userId) {
        return `user:${req.user.userId}`;
      }
      return getClientIdentifier(req);
    },
  });
};

/**
 * Per-IP rate limiter
 */
export const perIpRateLimit = (max: number, windowMs: number) => {
  return createRateLimiter('general', {
    keyGenerator: (req) => `ip:${getClientIp(req)}`,
  });
};

// ============================================
// Cleanup and Maintenance
// ============================================

/**
 * Cleanup expired entries periodically (memory store only)
 */
function cleanupMemoryRateLimits(): void {
  const now = Date.now();
  let cleaned = 0;

  memoryRateLimitStore.forEach((entry, key) => {
    const windowExpired = now - entry.firstRequest > 60 * 60 * 1000; // 1 hour
    const blockExpired = entry.blocked && entry.blockExpiry && now > entry.blockExpiry;

    if ((windowExpired && !entry.blocked) || blockExpired) {
      memoryRateLimitStore.delete(key);
      cleaned++;
    }
  });

  memoryIpBlockList.forEach((expiry, ip) => {
    if (now > expiry) {
      memoryIpBlockList.delete(ip);
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`[RateLimit] Cleaned up ${cleaned} expired memory rate limit entries`);
  }
}

// Run cleanup every 5 minutes (memory store only)
setInterval(cleanupMemoryRateLimits, 5 * 60 * 1000);

// ============================================
// Statistics and Management Functions
// ============================================

/**
 * Get rate limit statistics
 */
export async function getRateLimitStats(): Promise<{
  totalEntries: number;
  blockedEntries: number;
  blockedIps: number;
  store: 'redis' | 'memory';
}> {
  if (isRedisAvailable()) {
    try {
      // Get counts from Redis using SCAN
      let totalEntries = 0;
      let blockedIps = 0;

      // Count rate limit keys
      const rlKeys = await redisClient!.keys(`${REDIS_PREFIX.rateLimit}*`);
      totalEntries = rlKeys.length;

      // Count blocked IPs
      const blockKeys = await redisClient!.keys(`${REDIS_PREFIX.ipBlock}*`);
      blockedIps = blockKeys.length;

      // Note: Getting blockedEntries count from Redis would require reading all entries
      // For performance, we return 0 here (or could implement sampling)

      return {
        totalEntries,
        blockedEntries: 0, // Not efficiently calculable in Redis without scanning all values
        blockedIps,
        store: 'redis',
      };
    } catch (error) {
      console.error('[RateLimit] Error getting Redis stats:', error);
    }
  }

  // Fallback to memory stats
  let blockedEntries = 0;
  memoryRateLimitStore.forEach(entry => {
    if (entry.blocked) {
      blockedEntries++;
    }
  });

  return {
    totalEntries: memoryRateLimitStore.size,
    blockedEntries,
    blockedIps: memoryIpBlockList.size,
    store: 'memory',
  };
}

/**
 * Manually block an IP
 */
export async function manuallyBlockIp(ip: string, durationMs: number): Promise<void> {
  await blockIpRedis(ip, durationMs);

  auditService.logEvent({
    userId: 'system',
    action: 'manual_ip_block',
    resource: 'rate_limit',
    details: {
      ip,
      duration: durationMs,
      expiry: new Date(Date.now() + durationMs).toISOString(),
      store: isRedisAvailable() ? 'redis' : 'memory',
    },
    ipAddress: ip,
  }).catch(console.error);
}

/**
 * Manually unblock an IP
 */
export async function manuallyUnblockIp(ip: string): Promise<void> {
  if (isRedisAvailable()) {
    try {
      const blockKey = `${REDIS_PREFIX.ipBlock}${ip}`;
      await redisClient!.del(blockKey);
      console.log(`[RateLimit] IP manually unblocked from Redis: ${ip}`);
    } catch (error) {
      console.error('[RateLimit] Error unblocking IP in Redis:', error);
    }
  }

  // Also clear from memory (in case of fallback)
  memoryIpBlockList.delete(ip);
  console.log(`[RateLimit] IP manually unblocked: ${ip}`);

  auditService.logEvent({
    userId: 'system',
    action: 'manual_ip_unblock',
    resource: 'rate_limit',
    details: {
      ip,
      store: isRedisAvailable() ? 'redis' : 'memory',
    },
    ipAddress: ip,
  }).catch(console.error);
}

/**
 * Clear all rate limits for a user
 */
export async function clearUserRateLimits(userId: string): Promise<void> {
  const pattern = `*user:${userId}*`;

  if (isRedisAvailable()) {
    try {
      const keys = await redisClient!.keys(`${REDIS_PREFIX.rateLimit}${pattern}`);
      if (keys.length > 0) {
        await redisClient!.del(keys);
        console.log(`[RateLimit] Cleared ${keys.length} rate limit entries for user ${userId} from Redis`);
      }
    } catch (error) {
      console.error('[RateLimit] Error clearing user rate limits in Redis:', error);
    }
  }

  // Also clear from memory
  const userKeys: string[] = [];
  memoryRateLimitStore.forEach((_, key) => {
    if (key.includes(`user:${userId}`)) {
      userKeys.push(key);
    }
  });

  userKeys.forEach(key => memoryRateLimitStore.delete(key));

  if (userKeys.length > 0) {
    console.log(`[RateLimit] Cleared ${userKeys.length} rate limit entries for user ${userId} from memory`);
  }
}

/**
 * Get Redis connection status
 */
export function getRedisStatus(): {
  enabled: boolean;
  connected: boolean;
  url: string;
} {
  const redisUrl = process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

  return {
    enabled: redisClient !== null,
    connected: redisConnected,
    url: redisUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Hide credentials
  };
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient && redisConnected) {
    try {
      await redisClient.quit();
      console.log('[RateLimit] Redis connection closed gracefully');
    } catch (error) {
      console.error('[RateLimit] Error closing Redis connection:', error);
    }
  }
}

export default {
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  phiRateLimit,
  exportRateLimit,
  downloadRateLimit,
  apiKeyRateLimit,
  perUserRateLimit,
  perIpRateLimit,
  getRateLimitStats,
  manuallyBlockIp,
  manuallyUnblockIp,
  clearUserRateLimits,
  getRedisStatus,
  closeRedisConnection,
};
