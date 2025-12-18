import { Router, Request, Response } from 'express';
import { logger } from '../../utils/logger.js';
import { stripeWebhookService } from '../../services/stripe-webhook.service.js';

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
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    // Get the signature from headers
    const signature = req.headers['stripe-signature'];

    if (!signature) {
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
    const payload = req.body;

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

    logger.info('Received Stripe webhook request', {
      signature: signature.substring(0, 20) + '...',
      bodyLength: Buffer.isBuffer(payload) ? payload.length : JSON.stringify(payload).length,
      contentType: req.headers['content-type'],
      ip: req.ip,
    });

    // Process webhook with retry mechanism and idempotency
    await stripeWebhookService.processWebhookWithRetry(
      payload,
      signature as string
    );

    const processingTime = Date.now() - startTime;

    logger.info('Stripe webhook processed successfully', {
      processingTimeMs: processingTime,
    });

    // Return 200 immediately to Stripe to acknowledge receipt
    res.status(200).json({
      received: true,
      processingTimeMs: processingTime
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;

    logger.error('Error processing Stripe webhook', {
      error: error.message,
      stack: error.stack,
      processingTimeMs: processingTime,
    });

    // Determine appropriate status code
    let statusCode = 500;
    let errorMessage = 'Internal server error';

    if (error.message?.includes('signature verification failed')) {
      statusCode = 400;
      errorMessage = 'Invalid signature';
    } else if (error.message?.includes('STRIPE_WEBHOOK_SECRET')) {
      statusCode = 500;
      errorMessage = 'Webhook configuration error';
    } else if (error.message?.includes('duplicate')) {
      statusCode = 200; // Return 200 for duplicate events
      errorMessage = 'Event already processed';
      logger.info('Webhook event already processed (idempotency)', {
        processingTimeMs: processingTime,
      });
    }

    res.status(statusCode).json({
      error: errorMessage,
      received: false,
      processingTimeMs: processingTime,
    });
  }
});

/**
 * Health check endpoint for webhook service
 */
router.get('/health', async (req: Request, res: Response): Promise<void> => {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    res.status(200).json({
      status: 'healthy',
      configured: !!webhookSecret,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
