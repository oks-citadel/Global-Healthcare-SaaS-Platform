import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsError } from '../utils/errors.js';
import { auditService } from '../services/audit.service.js';

/**
 * HIPAA-Compliant Rate Limiting Middleware
 * Enhanced rate limiting with per-user tracking and IP-based blocking
 * Protects against brute force attacks and abuse
 */

/**
 * Rate limit store (in-memory for development, use Redis in production)
 */
interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  blockExpiry?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const ipBlockList = new Map<string, number>(); // IP -> block expiry timestamp

/**
 * Rate limit configurations
 */
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

/**
 * Get client identifier (user ID or IP)
 */
function getClientIdentifier(req: Request): string {
  // Use user ID if authenticated
  if (req.user?.userId) {
    return `user:${req.user.userId}`;
  }

  // Otherwise use IP address
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

/**
 * Check if IP is blocked
 */
function isIpBlocked(ip: string): boolean {
  const blockExpiry = ipBlockList.get(ip);
  if (!blockExpiry) return false;

  if (Date.now() < blockExpiry) {
    return true;
  }

  // Unblock if expiry passed
  ipBlockList.delete(ip);
  return false;
}

/**
 * Block IP address
 */
function blockIp(ip: string, duration: number): void {
  const expiry = Date.now() + duration;
  ipBlockList.set(ip, expiry);
  console.log(`IP blocked: ${ip} until ${new Date(expiry).toISOString()}`);
}

/**
 * Check rate limit
 */
function checkRateLimit(
  key: string,
  config: { windowMs: number; max: number; blockDuration?: number }
): { allowed: boolean; remaining: number; resetTime: number; blocked?: boolean } {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  // Clean up expired entries
  if (entry) {
    const windowExpired = now - entry.firstRequest > config.windowMs;
    const blockExpired = entry.blocked && entry.blockExpiry && now > entry.blockExpiry;

    if (windowExpired && !entry.blocked) {
      // Reset window
      entry = undefined;
    } else if (blockExpired) {
      // Unblock
      entry = undefined;
    }
  }

  // Create new entry if needed
  if (!entry) {
    entry = {
      count: 0,
      firstRequest: now,
      lastRequest: now,
      blocked: false,
    };
    rateLimitStore.set(key, entry);
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
    // Block if configured
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
      if (isIpBlocked(ip)) {
        const blockExpiry = ipBlockList.get(ip);
        const resetTime = blockExpiry ? new Date(blockExpiry).toISOString() : 'unknown';

        await auditService.logEvent({
          userId: req.user?.userId || 'anonymous',
          action: 'blocked_request',
          resource: 'rate_limit',
          details: {
            ip,
            path: req.path,
            reason: 'ip_blocked',
            resetTime,
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
      const result = checkRateLimit(key, config);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

      if (!result.allowed) {
        // Block IP if this is an auth endpoint and user is blocked
        if (limitType === 'auth' && result.blocked) {
          blockIp(ip, config.blockDuration || 0);
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

        const decrementCounter = () => {
          if (responseSent) return;
          responseSent = true;

          const shouldSkip =
            (options.skipSuccessfulRequests && res.statusCode < 400) ||
            (options.skipFailedRequests && res.statusCode >= 400);

          if (shouldSkip) {
            const entry = rateLimitStore.get(key);
            if (entry && entry.count > 0) {
              entry.count--;
            }
          }
        };

        res.send = function(data: any) {
          decrementCounter();
          return originalSend.call(this, data);
        };

        res.json = function(data: any) {
          decrementCounter();
          return originalJson.call(this, data);
        };
      }

      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      next(error);
    }
  };
}

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

/**
 * Cleanup expired entries periodically
 */
function cleanupRateLimits(): void {
  const now = Date.now();
  let cleaned = 0;

  rateLimitStore.forEach((entry, key) => {
    const windowExpired = now - entry.firstRequest > 60 * 60 * 1000; // 1 hour
    const blockExpired = entry.blocked && entry.blockExpiry && now > entry.blockExpiry;

    if (windowExpired && !entry.blocked || blockExpired) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  });

  // Cleanup IP blocks
  ipBlockList.forEach((expiry, ip) => {
    if (now > expiry) {
      ipBlockList.delete(ip);
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired rate limit entries`);
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

/**
 * Get rate limit statistics
 */
export function getRateLimitStats(): {
  totalEntries: number;
  blockedEntries: number;
  blockedIps: number;
} {
  let blockedEntries = 0;

  rateLimitStore.forEach(entry => {
    if (entry.blocked) {
      blockedEntries++;
    }
  });

  return {
    totalEntries: rateLimitStore.size,
    blockedEntries,
    blockedIps: ipBlockList.size,
  };
}

/**
 * Manually block an IP
 */
export function manuallyBlockIp(ip: string, durationMs: number): void {
  blockIp(ip, durationMs);

  auditService.logEvent({
    userId: 'system',
    action: 'manual_ip_block',
    resource: 'rate_limit',
    details: {
      ip,
      duration: durationMs,
      expiry: new Date(Date.now() + durationMs).toISOString(),
    },
    ipAddress: ip,
  }).catch(console.error);
}

/**
 * Manually unblock an IP
 */
export function manuallyUnblockIp(ip: string): void {
  ipBlockList.delete(ip);
  console.log(`IP manually unblocked: ${ip}`);

  auditService.logEvent({
    userId: 'system',
    action: 'manual_ip_unblock',
    resource: 'rate_limit',
    details: { ip },
    ipAddress: ip,
  }).catch(console.error);
}

/**
 * Clear all rate limits for a user
 */
export function clearUserRateLimits(userId: string): void {
  const userKeys: string[] = [];

  rateLimitStore.forEach((_, key) => {
    if (key.includes(`user:${userId}`)) {
      userKeys.push(key);
    }
  });

  userKeys.forEach(key => rateLimitStore.delete(key));
  console.log(`Cleared ${userKeys.length} rate limit entries for user: ${userId}`);
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
};
