/**
 * Redis Cache Middleware
 * Server-side response caching using Redis for high-performance caching
 */

import { Request, Response, NextFunction, RequestHandler } from "express";
import { cacheService } from "../services/cache.service.js";
import { cacheKeys, cacheConfig } from "../config/cache.config.js";
import crypto from "crypto";

export interface RedisCacheOptions {
  ttl?: number;
  keyPrefix?: string;
  includeQuery?: boolean;
  includeHeaders?: string[];
  includeUserId?: boolean;
  includeTenantId?: boolean;
  excludePaths?: string[];
  excludeMethods?: string[];
  cacheSuccessOnly?: boolean;
  staleWhileRevalidate?: number;
  lockTimeout?: number;
}

const defaultOptions: RedisCacheOptions = {
  ttl: 300,
  keyPrefix: "api",
  includeQuery: true,
  includeHeaders: ["Accept", "Accept-Language"],
  includeUserId: true,
  includeTenantId: true,
  excludePaths: ["/auth", "/health", "/metrics", "/webhooks"],
  excludeMethods: ["POST", "PUT", "PATCH", "DELETE"],
  cacheSuccessOnly: true,
  staleWhileRevalidate: 60,
  lockTimeout: 5000,
};

/**
 * Generate cache key from request
 */
function generateCacheKey(req: Request, options: RedisCacheOptions): string {
  const components: string[] = [
    options.keyPrefix || "api",
    req.method,
    req.path,
  ];

  // Include query params
  if (options.includeQuery && Object.keys(req.query).length > 0) {
    const sortedQuery = Object.keys(req.query)
      .sort()
      .map((key) => `${key}=${req.query[key]}`)
      .join("&");
    components.push(sortedQuery);
  }

  // Include user ID for user-specific caching
  if (options.includeUserId && (req as any).user?.id) {
    components.push(`user:${(req as any).user.id}`);
  }

  // Include tenant ID for multi-tenant caching
  if (options.includeTenantId && (req as any).tenantId) {
    components.push(`tenant:${(req as any).tenantId}`);
  }

  // Include specific headers
  if (options.includeHeaders) {
    for (const header of options.includeHeaders) {
      const value = req.get(header);
      if (value) {
        components.push(`${header}:${value}`);
      }
    }
  }

  const keyString = components.join("|");
  const hash = crypto
    .createHash("sha256")
    .update(keyString)
    .digest("hex")
    .substring(0, 16);
  return `${options.keyPrefix}:${hash}`;
}

/**
 * Check if request should be cached
 */
function shouldCache(req: Request, options: RedisCacheOptions): boolean {
  // Skip excluded methods
  if (options.excludeMethods?.includes(req.method)) {
    return false;
  }

  // Skip excluded paths
  if (options.excludePaths?.some((path) => req.path.startsWith(path))) {
    return false;
  }

  // Skip if Cache-Control: no-cache
  const cacheControl = req.get("Cache-Control");
  if (
    cacheControl?.includes("no-cache") ||
    cacheControl?.includes("no-store")
  ) {
    return false;
  }

  return true;
}

/**
 * Redis cache middleware - caches API responses in Redis
 */
export function redisCacheMiddleware(
  options: RedisCacheOptions = {},
): RequestHandler {
  const opts = { ...defaultOptions, ...options };

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip if caching not applicable
    if (!shouldCache(req, opts)) {
      return next();
    }

    const cacheKey = generateCacheKey(req, opts);
    const staleKey = `${cacheKey}:stale`;

    try {
      // Try to get from cache
      const cachedResponse = await cacheService.get<{
        status: number;
        headers: Record<string, string>;
        body: any;
        timestamp: number;
      }>(cacheKey);

      if (cachedResponse) {
        // Check if data is still fresh
        const age = Date.now() - cachedResponse.timestamp;
        const ttlMs = (opts.ttl || 300) * 1000;

        if (age < ttlMs) {
          // Return cached response
          res.set("X-Cache", "HIT");
          res.set("X-Cache-Age", Math.floor(age / 1000).toString());
          res.set(
            "Cache-Control",
            `public, max-age=${Math.floor((ttlMs - age) / 1000)}`,
          );

          // Set cached headers
          for (const [key, value] of Object.entries(cachedResponse.headers)) {
            if (
              !["content-length", "transfer-encoding"].includes(
                key.toLowerCase(),
              )
            ) {
              res.set(key, value);
            }
          }

          return res.status(cachedResponse.status).json(cachedResponse.body);
        }

        // Data is stale but within revalidation window
        if (
          opts.staleWhileRevalidate &&
          age < ttlMs + opts.staleWhileRevalidate * 1000
        ) {
          // Return stale data immediately
          res.set("X-Cache", "STALE");
          res.set("X-Cache-Age", Math.floor(age / 1000).toString());

          for (const [key, value] of Object.entries(cachedResponse.headers)) {
            if (
              !["content-length", "transfer-encoding"].includes(
                key.toLowerCase(),
              )
            ) {
              res.set(key, value);
            }
          }

          // Trigger background revalidation
          setImmediate(async () => {
            try {
              // Acquire lock to prevent thundering herd
              const lock = await cacheService.acquireLock(
                cacheKey,
                opts.lockTimeout,
              );
              if (lock) {
                // This will be handled by the intercepted response
                // For now, just delete stale cache to trigger refresh on next request
                await cacheService.delete(cacheKey);
                await cacheService.releaseLock(cacheKey, lock);
              }
            } catch (err) {
              // Ignore background revalidation errors
            }
          });

          return res.status(cachedResponse.status).json(cachedResponse.body);
        }
      }

      // Cache miss - intercept response
      res.set("X-Cache", "MISS");

      const originalJson = res.json.bind(res);
      const originalSend = res.send.bind(res);

      const cacheResponse = async (body: any) => {
        // Only cache successful responses
        if (
          opts.cacheSuccessOnly &&
          (res.statusCode < 200 || res.statusCode >= 300)
        ) {
          return;
        }

        const headers: Record<string, string> = {};
        const headersToCache = ["content-type", "etag", "last-modified"];
        for (const header of headersToCache) {
          const value = res.get(header);
          if (value) {
            headers[header] = value;
          }
        }

        await cacheService.set(
          cacheKey,
          {
            status: res.statusCode,
            headers,
            body,
            timestamp: Date.now(),
          },
          opts.ttl,
        );
      };

      res.json = function (body: any): Response {
        cacheResponse(body).catch(() => {});
        return originalJson(body);
      };

      res.send = function (body: any): Response {
        if (typeof body === "object") {
          cacheResponse(body).catch(() => {});
        }
        return originalSend(body);
      };

      next();
    } catch (error) {
      // On cache error, proceed without caching
      res.set("X-Cache", "ERROR");
      next();
    }
  };
}

/**
 * Cache invalidation middleware for mutations
 */
export function cacheInvalidationMiddleware(
  patterns: string[],
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalEnd = res.end.bind(res);

    res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
      // Only invalidate on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setImmediate(async () => {
          try {
            for (const pattern of patterns) {
              await cacheService.deletePattern(pattern);
            }
          } catch (err) {
            // Ignore invalidation errors
          }
        });
      }

      return originalEnd(chunk, encoding, callback);
    };

    next();
  };
}

/**
 * Resource-specific cache middleware factory
 */
export const resourceCache = {
  providers: (ttl: number = cacheConfig.resources.provider) =>
    redisCacheMiddleware({
      ttl,
      keyPrefix: cacheConfig.prefixes.provider,
      includeUserId: false,
    }),

  appointments: (ttl: number = cacheConfig.resources.appointment) =>
    redisCacheMiddleware({
      ttl,
      keyPrefix: cacheConfig.prefixes.appointment,
      includeUserId: true,
    }),

  users: (ttl: number = cacheConfig.resources.user) =>
    redisCacheMiddleware({
      ttl,
      keyPrefix: cacheConfig.prefixes.user,
      includeUserId: true,
    }),

  records: (ttl: number = cacheConfig.resources.medicalRecord) =>
    redisCacheMiddleware({
      ttl,
      keyPrefix: cacheConfig.prefixes.record,
      includeUserId: true,
    }),

  static: (ttl: number = cacheConfig.ttl.static) =>
    redisCacheMiddleware({
      ttl,
      keyPrefix: "static",
      includeUserId: false,
      includeTenantId: false,
    }),
};

/**
 * Conditional cache bypass middleware
 */
export function cacheBypassMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // Allow cache bypass with special header (for debugging/admin)
    if (req.get("X-Cache-Bypass") === "true") {
      res.set("X-Cache", "BYPASS");
      res.set("Cache-Control", "no-store");
    }
    next();
  };
}

export default {
  redisCacheMiddleware,
  cacheInvalidationMiddleware,
  resourceCache,
  cacheBypassMiddleware,
};
