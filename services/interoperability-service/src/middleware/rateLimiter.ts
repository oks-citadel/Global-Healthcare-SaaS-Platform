import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Standard rate limiter for general API endpoints
 */
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    });
  },
});

/**
 * FHIR-specific rate limiter
 * More permissive for healthcare data exchange
 */
export const fhirLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too Many Requests',
    message: 'FHIR API rate limit exceeded.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Rate limit by organization or IP
    return (req.headers['x-organization-id'] as string) || req.ip || 'unknown';
  },
});

/**
 * X12 transaction rate limiter
 * Lower limits for EDI transactions
 */
export const x12Limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // 50 transactions per minute
  message: {
    error: 'Too Many Requests',
    message: 'X12 transaction rate limit exceeded.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return (req.headers['x-organization-id'] as string) || req.ip || 'unknown';
  },
});

/**
 * Document exchange rate limiter
 * Higher limits for C-CDA documents
 */
export const documentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 documents per minute
  message: {
    error: 'Too Many Requests',
    message: 'Document exchange rate limit exceeded.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Direct messaging rate limiter
 */
export const directMessagingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 messages per minute
  message: {
    error: 'Too Many Requests',
    message: 'Direct messaging rate limit exceeded.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Network query rate limiter (TEFCA, Carequality, CommonWell)
 * Lower limits to prevent abuse of external networks
 */
export const networkQueryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 queries per minute
  message: {
    error: 'Too Many Requests',
    message: 'Network query rate limit exceeded.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return (req.headers['x-organization-id'] as string) || req.ip || 'unknown';
  },
});

/**
 * Bulk operation rate limiter
 * Very restrictive for batch operations
 */
export const bulkOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 bulk operations per hour
  message: {
    error: 'Too Many Requests',
    message: 'Bulk operation rate limit exceeded.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Partner-specific rate limiter factory
 * Creates a rate limiter based on partner configuration
 */
export const createPartnerLimiter = (partnerId: string, maxRequests: number, windowMinutes: number) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: {
      error: 'Too Many Requests',
      message: `Partner rate limit exceeded for ${partnerId}.`,
      retryAfter: `${windowMinutes} minutes`,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: () => partnerId,
  });
};
