import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  includeQuery?: boolean; // Include query params in cache key
  includeHeaders?: string[]; // Headers to include in cache key
  varyBy?: string[]; // Headers to vary cache by
  excludePaths?: string[]; // Paths to exclude from caching
  cacheControl?: string; // Custom Cache-Control header
  enableETag?: boolean; // Enable ETag generation
}

const defaultOptions: CacheOptions = {
  ttl: 300, // 5 minutes default
  includeQuery: true,
  includeHeaders: [],
  varyBy: ['Accept', 'Accept-Encoding'],
  excludePaths: [],
  cacheControl: 'public, max-age=300',
  enableETag: true,
};

/**
 * Generate a cache key based on request details
 */
export function generateCacheKey(
  req: Request,
  options: CacheOptions = {}
): string {
  const opts = { ...defaultOptions, ...options };

  const keyComponents: string[] = [
    req.method,
    req.path,
  ];

  // Include query parameters
  if (opts.includeQuery && Object.keys(req.query).length > 0) {
    const sortedQuery = Object.keys(req.query)
      .sort()
      .map(key => `${key}=${req.query[key]}`)
      .join('&');
    keyComponents.push(sortedQuery);
  }

  // Include specific headers
  if (opts.includeHeaders && opts.includeHeaders.length > 0) {
    opts.includeHeaders.forEach(header => {
      const value = req.get(header);
      if (value) {
        keyComponents.push(`${header}:${value}`);
      }
    });
  }

  const keyString = keyComponents.join('|');
  return `cache:${crypto.createHash('md5').update(keyString).digest('hex')}`;
}

/**
 * Generate ETag from response body
 */
export function generateETag(body: any): string {
  const content = typeof body === 'string' ? body : JSON.stringify(body);
  return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
}

/**
 * Check if request ETag matches
 */
export function checkETag(req: Request, etag: string): boolean {
  const ifNoneMatch = req.get('If-None-Match');
  if (!ifNoneMatch) return false;

  // Handle multiple ETags in If-None-Match
  const etags = ifNoneMatch.split(',').map(tag => tag.trim());
  return etags.includes(etag) || etags.includes('*');
}

/**
 * Response caching middleware
 * Implements browser-side caching with Cache-Control and ETags
 */
export function cacheMiddleware(options: CacheOptions = {}) {
  const opts = { ...defaultOptions, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip excluded paths
    if (opts.excludePaths?.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Set Vary headers
    if (opts.varyBy && opts.varyBy.length > 0) {
      res.setHeader('Vary', opts.varyBy.join(', '));
    }

    // Intercept response to add caching headers
    const originalSend = res.send;
    const originalJson = res.json;

    // Override send method
    res.send = function (body: any): Response {
      // Only cache successful responses
      if (res.statusCode === 200) {
        // Set Cache-Control header
        if (opts.cacheControl) {
          res.setHeader('Cache-Control', opts.cacheControl);
        }

        // Generate and set ETag
        if (opts.enableETag) {
          const etag = generateETag(body);
          res.setHeader('ETag', etag);

          // Check if client has matching ETag
          if (checkETag(req, etag)) {
            res.status(304);
            return originalSend.call(this, '');
          }
        }

        // Set Last-Modified header
        res.setHeader('Last-Modified', new Date().toUTCString());
      }

      return originalSend.call(this, body);
    };

    // Override json method
    res.json = function (body: any): Response {
      // Only cache successful responses
      if (res.statusCode === 200) {
        // Set Cache-Control header
        if (opts.cacheControl) {
          res.setHeader('Cache-Control', opts.cacheControl);
        }

        // Generate and set ETag
        if (opts.enableETag) {
          const etag = generateETag(body);
          res.setHeader('ETag', etag);

          // Check if client has matching ETag
          if (checkETag(req, etag)) {
            res.status(304);
            return originalJson.call(this, {});
          }
        }

        // Set Last-Modified header
        res.setHeader('Last-Modified', new Date().toUTCString());
      }

      return originalJson.call(this, body);
    };

    next();
  };
}

/**
 * No-cache middleware for sensitive endpoints
 */
export function noCacheMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  };
}

/**
 * Conditional request middleware
 * Handles If-Modified-Since and If-None-Match headers
 */
export function conditionalRequestMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const ifModifiedSince = req.get('If-Modified-Since');
    const ifNoneMatch = req.get('If-None-Match');

    // Store original methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Override to check conditional headers
    const checkConditionals = (body: any) => {
      if (res.statusCode === 200) {
        const lastModified = res.get('Last-Modified');
        const etag = res.get('ETag');

        // Check If-None-Match (ETag)
        if (ifNoneMatch && etag && checkETag(req, etag)) {
          res.status(304);
          return true;
        }

        // Check If-Modified-Since
        if (ifModifiedSince && lastModified) {
          const modifiedDate = new Date(lastModified);
          const sinceDate = new Date(ifModifiedSince);

          if (modifiedDate <= sinceDate) {
            res.status(304);
            return true;
          }
        }
      }

      return false;
    };

    res.send = function (body: any): Response {
      if (checkConditionals(body)) {
        return originalSend.call(this, '');
      }
      return originalSend.call(this, body);
    };

    res.json = function (body: any): Response {
      if (checkConditionals(body)) {
        return originalJson.call(this, {});
      }
      return originalJson.call(this, body);
    };

    next();
  };
}

/**
 * Cache invalidation headers middleware
 * Sets appropriate headers for cache invalidation on mutations
 */
export function cacheInvalidationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // For mutation methods, set headers to invalidate cache
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      res.on('finish', () => {
        // Only invalidate on successful mutations
        if (res.statusCode >= 200 && res.statusCode < 300) {
          res.setHeader('Clear-Site-Data', '"cache"');
        }
      });
    }
    next();
  };
}

/**
 * Stale-while-revalidate middleware
 * Implements stale-while-revalidate caching strategy
 */
export function staleWhileRevalidateMiddleware(
  maxAge: number = 60,
  staleTime: number = 300
) {
  return cacheMiddleware({
    ttl: maxAge,
    cacheControl: `public, max-age=${maxAge}, stale-while-revalidate=${staleTime}`,
    enableETag: true,
  });
}

/**
 * Immutable cache middleware for static assets
 */
export function immutableCacheMiddleware() {
  return cacheMiddleware({
    ttl: 31536000, // 1 year
    cacheControl: 'public, max-age=31536000, immutable',
    enableETag: true,
  });
}

export default {
  cacheMiddleware,
  noCacheMiddleware,
  conditionalRequestMiddleware,
  cacheInvalidationMiddleware,
  staleWhileRevalidateMiddleware,
  immutableCacheMiddleware,
  generateCacheKey,
  generateETag,
  checkETag,
};
