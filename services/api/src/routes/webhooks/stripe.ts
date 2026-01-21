import { Router, Request, Response } from 'express';
import { logger } from '../../utils/logger.js';
import { stripeWebhookService } from '../../services/stripe-webhook.service.js';
import { stripeWebhookIdempotency } from '../../middleware/idempotency.middleware.js';

// ==========================================
// Type Definitions
// ==========================================

interface WebhookSuccessResponse {
  received: true;
  processingTimeMs: number;
}

interface WebhookErrorResponse {
  error: string;
  received: false;
  processingTimeMs?: number;
}

interface WebhookHealthResponse {
  status: 'healthy' | 'unhealthy';
  configured: boolean;
  timestamp: string;
  error?: string;
}

const router = Router();

/**
 * Stripe Webhook Endpoint
 *
 * This endpoint receives webhook events from Stripe and processes them
 * securely with signature verification, idempotency handling, and retry logic.
 *
 * IMPORTANT: This endpoint must use raw body parsing for signature verification.
 * Configure Express to use raw body for this route:
 *
 * app.use(
 *   '/webhooks/stripe',
 *   express.raw({ type: 'application/json' })
 * );
 *
 * Stripe will send the following events:
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.paid
 * - invoice.payment_failed
 * - charge.refunded
 *
 * Configure webhook endpoint in Stripe Dashboard:
 * https://dashboard.stripe.com/webhooks
 *
 * Endpoint URL: https://your-domain.com/webhooks/stripe
 * Events to send: Select all payment-related events
 */
router.post('/', stripeWebhookIdempotency(), async (req: Request, res: Response<WebhookSuccessResponse | WebhookErrorResponse>): Promise<void> => {
  const startTime = Date.now();

  try {
    // Get the signature from headers
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      logger.warn('Webhook request missing stripe-signature header', {
        headers: req.headers,
        ip: req.ip,
      });
      res.status(400).json({
        error: 'Missing stripe-signature header',
        received: false
      });
      return;
    }

    // Get raw body (must be Buffer or string)
    const payload: Buffer | string = Buffer.isBuffer(req.body)
      ? req.body
      : typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body);

    if (!payload) {
      logger.warn('Webhook request missing body', {
        ip: req.ip,
      });
      res.status(400).json({
        error: 'Missing request body',
        received: false
      });
      return;
    }

    // Get idempotency info from middleware (if available)
    const idempotencyInfo = req.webhookIdempotency;

    logger.info('Received Stripe webhook request', {
      signature: signature.substring(0, 20) + '...',
      bodyLength: Buffer.isBuffer(payload) ? payload.length : JSON.stringify(payload).length,
      contentType: req.headers['content-type'],
      ip: req.ip,
      eventId: idempotencyInfo?.eventId,
      eventType: idempotencyInfo?.eventType,
    });

    // Process webhook with retry mechanism
    await stripeWebhookService.processWebhookWithRetry(
      payload,
      signature
    );

    // Mark event as processed after successful handling
    if (idempotencyInfo?.markAsProcessed) {
      await idempotencyInfo.markAsProcessed();
    }

    const processingTime = Date.now() - startTime;

    logger.info('Stripe webhook processed successfully', {
      processingTimeMs: processingTime,
      eventId: idempotencyInfo?.eventId,
      eventType: idempotencyInfo?.eventType,
    });

    // Return 200 immediately to Stripe to acknowledge receipt
    res.status(200).json({
      received: true,
      processingTimeMs: processingTime
    });

  } catch (error: unknown) {
    const processingTime = Date.now() - startTime;
    const idempotencyInfo = req.webhookIdempotency;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error('Error processing Stripe webhook', {
      error: errorMessage,
      stack: errorStack,
      processingTimeMs: processingTime,
      eventId: idempotencyInfo?.eventId,
      eventType: idempotencyInfo?.eventType,
    });

    // Determine appropriate status code
    let statusCode = 500;
    let responseErrorMessage = 'Internal server error';

    if (errorMessage.includes('signature verification failed')) {
      statusCode = 400;
      responseErrorMessage = 'Invalid signature';
    } else if (errorMessage.includes('STRIPE_WEBHOOK_SECRET')) {
      statusCode = 500;
      responseErrorMessage = 'Webhook configuration error';
    } else if (errorMessage.includes('duplicate')) {
      statusCode = 200; // Return 200 for duplicate events
      responseErrorMessage = 'Event already processed';
      logger.info('Webhook event already processed (idempotency)', {
        processingTimeMs: processingTime,
        eventId: idempotencyInfo?.eventId,
      });
    }

    res.status(statusCode).json({
      error: responseErrorMessage,
      received: false,
      processingTimeMs: processingTime,
    });
  }
});

/**
 * Health check endpoint for webhook service
 */
router.get('/health', async (_req: Request, res: Response<WebhookHealthResponse>): Promise<void> => {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    res.status(200).json({
      status: 'healthy',
      configured: !!webhookSecret,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      status: 'unhealthy',
      configured: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
