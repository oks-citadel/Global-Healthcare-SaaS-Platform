import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { correlationIdStorage } from '../utils/logger.js';

/**
 * Extended request type with correlation context
 */
export interface CorrelatedRequest extends Request {
  correlationId: string;
  requestId: string;
  parentRequestId?: string;
  causationId?: string;
}

/**
 * Correlation context for distributed tracing
 */
export interface CorrelationContext {
  correlationId: string;
  requestId: string;
  parentRequestId?: string;
  causationId?: string;
  timestamp: string;
  serviceName: string;
}

const SERVICE_NAME = process.env.SERVICE_NAME || 'unified-health-api';

/**
 * Get current correlation context from async local storage
 */
export function getCorrelationContext(): CorrelationContext | undefined {
  const correlationId = correlationIdStorage.getStore();
  if (!correlationId) return undefined;

  return {
    correlationId,
    requestId: correlationId, // For backward compatibility
    timestamp: new Date().toISOString(),
    serviceName: SERVICE_NAME,
  };
}

/**
 * Create correlation headers for outgoing requests
 */
export function createCorrelationHeaders(): Record<string, string> {
  const context = getCorrelationContext();
  if (!context) return {};

  return {
    'X-Correlation-ID': context.correlationId,
    'X-Request-ID': context.requestId,
    'X-Service-Name': context.serviceName,
  };
}

/**
 * Middleware to add correlation ID to requests
 * The correlation ID can be provided via X-Correlation-ID header
 * or will be generated automatically
 *
 * Supports multiple header formats:
 * - X-Correlation-ID (standard)
 * - X-Request-ID (alternative)
 * - X-Amzn-Trace-Id (AWS)
 */
export function correlationMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Get correlation ID from various headers or generate new one
  const correlationId =
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string) ||
    extractCorrelationFromXRay(req.headers['x-amzn-trace-id'] as string) ||
    uuidv4();

  // Generate unique request ID for this specific request
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();

  // Get parent request ID for causation chain
  const parentRequestId = req.headers['x-parent-request-id'] as string;
  const causationId = req.headers['x-causation-id'] as string;

  // Store correlation ID in async local storage
  correlationIdStorage.run(correlationId, () => {
    // Add correlation context to request object
    const correlatedReq = req as CorrelatedRequest;
    correlatedReq.correlationId = correlationId;
    correlatedReq.requestId = requestId;
    correlatedReq.parentRequestId = parentRequestId;
    correlatedReq.causationId = causationId;

    // Add correlation headers to response
    res.setHeader('X-Correlation-ID', correlationId);
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('X-Service-Name', SERVICE_NAME);

    next();
  });
}

/**
 * Extract correlation ID from AWS X-Ray trace header
 */
function extractCorrelationFromXRay(traceHeader?: string): string | undefined {
  if (!traceHeader) return undefined;

  // X-Amzn-Trace-Id format: Root=1-xxx-xxx;Parent=xxx;Sampled=1
  const match = traceHeader.match(/Root=([^;]+)/);
  if (match) {
    // Use last part of trace ID as correlation ID
    const parts = match[1].split('-');
    return parts[parts.length - 1];
  }

  return undefined;
}

/**
 * Wrap async function to preserve correlation context
 */
export function withCorrelation<T>(
  correlationId: string,
  fn: () => Promise<T>
): Promise<T> {
  return correlationIdStorage.run(correlationId, fn);
}

/**
 * Get current correlation ID from async local storage
 */
export function getCurrentCorrelationId(): string | undefined {
  return correlationIdStorage.getStore();
}
