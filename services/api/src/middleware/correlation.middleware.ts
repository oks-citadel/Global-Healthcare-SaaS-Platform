import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { correlationIdStorage } from '../utils/logger.js';

/**
 * Middleware to add correlation ID to requests
 * The correlation ID can be provided via X-Correlation-ID header
 * or will be generated automatically
 */
export function correlationMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Get correlation ID from header or generate new one
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();

  // Store correlation ID in async local storage
  correlationIdStorage.run(correlationId, () => {
    // Add correlation ID to request object
    (req as Request & { correlationId: string }).correlationId = correlationId;

    // Add correlation ID to response headers
    res.setHeader('X-Correlation-ID', correlationId);

    next();
  });
}
