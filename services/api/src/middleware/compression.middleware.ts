import { Request, Response, NextFunction } from 'express';
import zlib from 'zlib';
import { logger } from '../utils/logger.js';

export interface CompressionOptions {
  threshold?: number; // Minimum size in bytes to compress
  level?: number; // Compression level (0-9 for gzip, 0-11 for brotli)
  preferBrotli?: boolean; // Prefer Brotli over Gzip when available
  includeTypes?: string[]; // Content types to compress
  excludeTypes?: string[]; // Content types to exclude from compression
  excludePaths?: string[]; // Paths to exclude from compression
}

const defaultOptions: CompressionOptions = {
  threshold: 1024, // 1KB minimum
  level: 6, // Default compression level
  preferBrotli: true,
  includeTypes: [
    'text/html',
    'text/css',
    'text/javascript',
    'text/xml',
    'text/plain',
    'application/javascript',
    'application/json',
    'application/xml',
    'application/xml+rss',
    'application/xhtml+xml',
    'application/ld+json',
    'image/svg+xml',
  ],
  excludeTypes: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'video/*',
    'audio/*',
  ],
  excludePaths: [],
};

/**
 * Check if content type should be compressed
 */
function shouldCompressContentType(
  contentType: string | undefined,
  options: CompressionOptions
): boolean {
  if (!contentType) return false;

  const normalizedType = contentType.split(';')[0].trim().toLowerCase();

  // Check exclude list
  if (options.excludeTypes) {
    for (const excludeType of options.excludeTypes) {
      if (excludeType.endsWith('/*')) {
        const prefix = excludeType.slice(0, -2);
        if (normalizedType.startsWith(prefix)) {
          return false;
        }
      } else if (normalizedType === excludeType.toLowerCase()) {
        return false;
      }
    }
  }

  // Check include list
  if (options.includeTypes) {
    for (const includeType of options.includeTypes) {
      if (includeType.endsWith('/*')) {
        const prefix = includeType.slice(0, -2);
        if (normalizedType.startsWith(prefix)) {
          return true;
        }
      } else if (normalizedType === includeType.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  return true;
}

/**
 * Get best compression method from Accept-Encoding header
 */
function getCompressionMethod(
  req: Request,
  preferBrotli: boolean
): 'br' | 'gzip' | 'deflate' | null {
  const acceptEncoding = req.get('Accept-Encoding') || '';
  const encodings = acceptEncoding
    .split(',')
    .map(e => e.trim().toLowerCase());

  // Check for Brotli support
  if (preferBrotli && encodings.some(e => e === 'br' || e === 'br;q=1.0')) {
    return 'br';
  }

  // Check for Gzip support
  if (encodings.some(e => e === 'gzip' || e.startsWith('gzip;'))) {
    return 'gzip';
  }

  // Check for Deflate support
  if (encodings.some(e => e === 'deflate' || e.startsWith('deflate;'))) {
    return 'deflate';
  }

  return null;
}

/**
 * Create compression stream based on method
 */
function createCompressionStream(
  method: 'br' | 'gzip' | 'deflate',
  level: number
): zlib.BrotliCompress | zlib.Gzip | zlib.Deflate {
  switch (method) {
    case 'br':
      return zlib.createBrotliCompress({
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: Math.min(level, 11),
        },
      });
    case 'gzip':
      return zlib.createGzip({ level: Math.min(level, 9) });
    case 'deflate':
      return zlib.createDeflate({ level: Math.min(level, 9) });
  }
}

/**
 * Compress buffer
 */
async function compressBuffer(
  buffer: Buffer,
  method: 'br' | 'gzip' | 'deflate',
  level: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let compressFn: (buf: Buffer, callback: (err: Error | null, result: Buffer) => void) => void;

    switch (method) {
      case 'br':
        compressFn = (buf, cb) => zlib.brotliCompress(buf, {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: Math.min(level, 11),
          },
        }, cb);
        break;
      case 'gzip':
        compressFn = (buf, cb) => zlib.gzip(buf, { level: Math.min(level, 9) }, cb);
        break;
      case 'deflate':
        compressFn = (buf, cb) => zlib.deflate(buf, { level: Math.min(level, 9) }, cb);
        break;
    }

    compressFn(buffer, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

/**
 * Compression middleware
 * Implements Gzip and Brotli compression for responses
 */
export function compressionMiddleware(options: CompressionOptions = {}) {
  const opts = { ...defaultOptions, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip if already handled
    if (res.get('Content-Encoding')) {
      return next();
    }

    // Skip excluded paths
    if (opts.excludePaths?.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Get compression method
    const method = getCompressionMethod(req, opts.preferBrotli || false);
    if (!method) {
      return next();
    }

    // Store original methods
    const originalSend = res.send;
    const originalJson = res.json;
    const originalEnd = res.end;

    let compressionApplied = false;

    // Helper to compress and send
    const compressAndSend = async (chunk: unknown, encoding?: BufferEncoding): Promise<boolean> => {
      // Only compress successful responses
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return false;
      }

      // Check content type
      const contentType = res.get('Content-Type');
      if (!shouldCompressContentType(contentType, opts)) {
        return false;
      }

      // Convert chunk to buffer
      let buffer: Buffer;
      if (Buffer.isBuffer(chunk)) {
        buffer = chunk;
      } else if (typeof chunk === 'string') {
        buffer = Buffer.from(chunk, encoding ?? 'utf8');
      } else if (chunk != null) {
        buffer = Buffer.from(JSON.stringify(chunk), 'utf8');
      } else {
        return false;
      }

      // Check threshold
      if (buffer.length < (opts.threshold || 0)) {
        return false;
      }

      try {
        // Compress the buffer
        const compressed = await compressBuffer(buffer, method, opts.level || 6);

        // Only use compression if it actually reduces size
        if (compressed.length < buffer.length) {
          res.setHeader('Content-Encoding', method);
          res.setHeader('Content-Length', compressed.length.toString());
          res.removeHeader('Content-Length'); // Let Express set it

          // Add Vary header
          const vary = res.get('Vary');
          if (vary) {
            res.setHeader('Vary', `${vary}, Accept-Encoding`);
          } else {
            res.setHeader('Vary', 'Accept-Encoding');
          }

          originalEnd.call(res, compressed);
          return true;
        }
      } catch (error) {
        logger.error('Compression error:', error);
      }

      return false;
    };

    // Override send method
    res.send = function (body: unknown): Response {
      if (compressionApplied) {
        return this;
      }

      compressAndSend(body)
        .then(compressed => {
          if (!compressed) {
            originalSend.call(this, body);
          }
          compressionApplied = true;
        })
        .catch((err: unknown) => {
          logger.error('Error in compression middleware:', err);
          originalSend.call(this, body);
          compressionApplied = true;
        });

      return this;
    };

    // Override json method
    res.json = function (body: unknown): Response {
      if (compressionApplied) {
        return this;
      }

      const json = JSON.stringify(body);

      compressAndSend(json)
        .then(compressed => {
          if (!compressed) {
            originalJson.call(this, body);
          }
          compressionApplied = true;
        })
        .catch((err: unknown) => {
          logger.error('Error in compression middleware:', err);
          originalJson.call(this, body);
          compressionApplied = true;
        });

      return this;
    };

    next();
  };
}

/**
 * Static compression middleware
 * Pre-compressed static files (for build-time compression)
 */
export function staticCompressionMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const encodings = acceptEncoding.split(',').map(e => e.trim().toLowerCase());

    // Check if client supports pre-compressed formats
    if (encodings.includes('br')) {
      req.url += '.br';
      res.setHeader('Content-Encoding', 'br');
    } else if (encodings.includes('gzip')) {
      req.url += '.gz';
      res.setHeader('Content-Encoding', 'gzip');
    }

    res.setHeader('Vary', 'Accept-Encoding');
    next();
  };
}

/**
 * Adaptive compression middleware
 * Adjusts compression level based on server load
 */
export function adaptiveCompressionMiddleware(
  getServerLoad: () => number // Function that returns load (0-1)
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const load = getServerLoad();

    // Adjust compression level based on load
    let level: number;
    if (load < 0.3) {
      level = 9; // High compression, low load
    } else if (load < 0.6) {
      level = 6; // Medium compression, medium load
    } else {
      level = 3; // Low compression, high load
    }

    const middleware = compressionMiddleware({ level });
    middleware(req, res, next);
  };
}

/**
 * Smart compression middleware
 * Decides compression based on content size and type
 */
export function smartCompressionMiddleware() {
  return compressionMiddleware({
    threshold: 1024, // 1KB
    level: 6,
    preferBrotli: true,
  });
}

export default {
  compressionMiddleware,
  staticCompressionMiddleware,
  adaptiveCompressionMiddleware,
  smartCompressionMiddleware,
};
