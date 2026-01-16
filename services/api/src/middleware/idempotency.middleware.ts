/**
 * Webhook Idempotency Middleware
 *
 * Express middleware for ensuring webhook events are processed only once.
 * Checks incoming webhook requests for duplicate event IDs and returns
 * early if the event has already been processed.
 *
 * Usage:
 *   router.post('/webhook', webhookIdempotency({ source: 'stripe' }), handleWebhook);
 */

import { Request, Response, NextFunction } from 'express';
import {
  getWebhookIdempotencyService,
  IdempotencyCheckResult,
} from '../lib/webhook-idempotency.js';
import { logger } from '../utils/logger.js';

/**
 * Configuration for the idempotency middleware
 */
export interface WebhookIdempotencyMiddlewareOptions {
  /** The webhook source identifier (e.g., 'stripe', 'github', 'twilio') */
  source: string;

  /**
   * Function to extract the event ID from the request.
   * Default extracts from various common locations.
   */
  getEventId?: (req: Request) => string | null;

  /**
   * Function to extract the event type from the request (optional, for logging).
   */
  getEventType?: (req: Request) => string | null;

  /**
   * Custom response for duplicate events.
   * Default returns 200 with { received: true, duplicate: true }
   */
  onDuplicate?: (
    req: Request,
    res: Response,
    result: IdempotencyCheckResult
  ) => void;

  /**
   * Whether to mark the event as processed in the middleware
   * or let the handler do it. Default is false (handler should call markEventProcessed).
   * Set to true for fire-and-forget style where you acknowledge immediately.
   */
  markProcessedImmediately?: boolean;
}

/**
 * Default event ID extraction function
 * Checks common locations for event IDs across different webhook providers
 */
function defaultGetEventId(req: Request): string | null {
  // Check common header locations
  const headerEventId =
    req.headers['x-event-id'] ||
    req.headers['x-webhook-id'] ||
    req.headers['x-request-id'] ||
    req.headers['idempotency-key'];

  if (headerEventId && typeof headerEventId === 'string') {
    return headerEventId;
  }

  // Check body for common event ID locations
  const body = req.body;
  if (body && typeof body === 'object') {
    // Stripe format
    if (body.id && typeof body.id === 'string') {
      return body.id;
    }

    // Generic event ID
    if (body.eventId && typeof body.eventId === 'string') {
      return body.eventId;
    }

    if (body.event_id && typeof body.event_id === 'string') {
      return body.event_id;
    }

    // Nested event object (some providers)
    if (body.event && body.event.id && typeof body.event.id === 'string') {
      return body.event.id;
    }

    // Message ID format (Twilio, etc.)
    if (body.MessageSid && typeof body.MessageSid === 'string') {
      return body.MessageSid;
    }
  }

  return null;
}

/**
 * Default event type extraction function
 */
function defaultGetEventType(req: Request): string | null {
  const body = req.body;
  if (body && typeof body === 'object') {
    // Stripe format
    if (body.type && typeof body.type === 'string') {
      return body.type;
    }

    // Generic event type
    if (body.eventType && typeof body.eventType === 'string') {
      return body.eventType;
    }

    if (body.event_type && typeof body.event_type === 'string') {
      return body.event_type;
    }
  }

  return null;
}

/**
 * Default duplicate event response handler
 */
function defaultOnDuplicate(
  _req: Request,
  res: Response,
  result: IdempotencyCheckResult
): void {
  res.status(200).json({
    received: true,
    duplicate: true,
    message: 'Event already processed',
    originallyProcessedAt: result.processedAt?.toISOString(),
  });
}

/**
 * Creates an idempotency middleware for webhook endpoints
 *
 * @param options - Configuration options for the middleware
 * @returns Express middleware function
 *
 * @example
 * // Basic usage with Stripe
 * router.post('/webhook/stripe',
 *   webhookIdempotency({ source: 'stripe' }),
 *   stripeWebhookHandler
 * );
 *
 * @example
 * // Custom event ID extraction
 * router.post('/webhook/custom',
 *   webhookIdempotency({
 *     source: 'custom-provider',
 *     getEventId: (req) => req.headers['x-custom-event-id'] as string,
 *   }),
 *   customWebhookHandler
 * );
 */
export function webhookIdempotency(
  options: WebhookIdempotencyMiddlewareOptions
) {
  const {
    source,
    getEventId = defaultGetEventId,
    getEventType = defaultGetEventType,
    onDuplicate = defaultOnDuplicate,
    markProcessedImmediately = false,
  } = options;

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const eventId = getEventId(req);

    // If no event ID found, skip idempotency check and proceed
    if (!eventId) {
      logger.warn('Webhook request missing event ID, skipping idempotency check', {
        source,
        path: req.path,
        method: req.method,
      });
      return next();
    }

    const eventType = getEventType(req);
    const idempotencyService = getWebhookIdempotencyService();

    try {
      // Check if event was already processed
      const result = await idempotencyService.checkEventProcessed(source, eventId);

      if (result.isDuplicate) {
        logger.info('Duplicate webhook event detected by middleware', {
          source,
          eventId,
          eventType,
          originallyProcessedAt: result.processedAt?.toISOString(),
          path: req.path,
        });

        // Return early for duplicate events
        onDuplicate(req, res, result);
        return;
      }

      // Attach idempotency info to request for use in handlers
      (req as any).webhookIdempotency = {
        eventId,
        eventType,
        source,
        markAsProcessed: async () => {
          await idempotencyService.markEventProcessed(source, eventId, eventType);
        },
      };

      // Mark as processed immediately if configured
      if (markProcessedImmediately) {
        await idempotencyService.markEventProcessed(source, eventId, eventType);
      }

      logger.debug('Webhook event passed idempotency check', {
        source,
        eventId,
        eventType,
      });

      next();
    } catch (error) {
      logger.error('Error in webhook idempotency middleware', {
        source,
        eventId,
        eventType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // On error, proceed with the request to avoid blocking legitimate events
      // The handler should implement its own retry/idempotency logic as backup
      (req as any).webhookIdempotency = {
        eventId,
        eventType,
        source,
        checkFailed: true,
        markAsProcessed: async () => {
          try {
            await idempotencyService.markEventProcessed(source, eventId, eventType);
          } catch {
            // Ignore marking errors in fallback mode
          }
        },
      };

      next();
    }
  };
}

/**
 * Extend Express Request type to include webhook idempotency info
 */
declare global {
  namespace Express {
    interface Request {
      webhookIdempotency?: {
        eventId: string;
        eventType: string | null;
        source: string;
        checkFailed?: boolean;
        markAsProcessed: () => Promise<void>;
      };
    }
  }
}

/**
 * Stripe-specific idempotency middleware
 * Pre-configured for Stripe webhook event format
 */
export function stripeWebhookIdempotency() {
  return webhookIdempotency({
    source: 'stripe',
    getEventId: (req: Request) => {
      // For raw body (used with Stripe signature verification)
      // the body might be a Buffer, so we need to handle that
      const body = req.body;

      if (Buffer.isBuffer(body)) {
        try {
          const parsed = JSON.parse(body.toString());
          return parsed.id || null;
        } catch {
          return null;
        }
      }

      if (body && typeof body === 'object' && body.id) {
        return body.id;
      }

      return null;
    },
    getEventType: (req: Request) => {
      const body = req.body;

      if (Buffer.isBuffer(body)) {
        try {
          const parsed = JSON.parse(body.toString());
          return parsed.type || null;
        } catch {
          return null;
        }
      }

      if (body && typeof body === 'object' && body.type) {
        return body.type;
      }

      return null;
    },
  });
}

/**
 * Generic webhook idempotency middleware with header-based event ID
 * Useful for custom webhook implementations
 */
export function headerBasedIdempotency(
  source: string,
  headerName: string = 'x-event-id'
) {
  return webhookIdempotency({
    source,
    getEventId: (req: Request) => {
      const value = req.headers[headerName.toLowerCase()];
      return typeof value === 'string' ? value : null;
    },
  });
}

export default webhookIdempotency;
