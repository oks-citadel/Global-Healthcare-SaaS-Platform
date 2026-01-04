/**
 * Stripe Webhook Controller
 *
 * Handles all incoming Stripe webhook events with:
 * - Webhook signature verification (critical security)
 * - Idempotency handling for duplicate events
 * - Proper error handling and logging
 * - Audit trail for financial operations
 */

import { Request, Response } from 'express';
import { stripeWebhookService } from '../services/stripe-webhook.service.js';
import { subscriptionService } from '../services/subscription.service.js';
import { paymentService } from '../services/payment.service.js';
import { logger } from '../utils/logger.js';

/**
 * Webhook Error Response Codes
 */
const WEBHOOK_ERRORS = {
  MISSING_SIGNATURE: 'MISSING_SIGNATURE',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  DUPLICATE_EVENT: 'DUPLICATE_EVENT',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
} as const;

class WebhookController {
  /**
   * POST /webhooks/stripe
   *
   * Main Stripe webhook endpoint that handles all Stripe events.
   * Uses the comprehensive StripeWebhookService for processing.
   *
   * IMPORTANT: This endpoint requires raw body parsing for signature verification.
   * The Express app should be configured with:
   * app.use('/webhooks/stripe', express.raw({ type: 'application/json' }))
   */
  async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      // Step 1: Validate stripe-signature header is present
      const signature = req.headers['stripe-signature'];

      if (!signature || typeof signature !== 'string') {
        logger.warn('Webhook received without stripe-signature header', {
          headers: Object.keys(req.headers),
          ip: req.ip,
        });

        res.status(400).json({
          error: WEBHOOK_ERRORS.MISSING_SIGNATURE,
          message: 'Missing stripe-signature header',
        });
        return;
      }

      // Step 2: Get raw body for signature verification
      // The body should already be raw if Express is configured correctly
      const payload = req.body;

      if (!payload) {
        logger.error('Webhook received with empty body');
        res.status(400).json({
          error: WEBHOOK_ERRORS.PROCESSING_ERROR,
          message: 'Empty request body',
        });
        return;
      }

      // Step 3: Process the webhook with retry mechanism and idempotency
      await stripeWebhookService.processWebhookWithRetry(payload, signature);

      // Step 4: Return success response
      const processingTime = Date.now() - startTime;
      logger.info('Webhook processed successfully', { processingTimeMs: processingTime });

      res.status(200).json({
        received: true,
        processingTimeMs: processingTime,
      });

    } catch (error: any) {
      const processingTime = Date.now() - startTime;

      // Handle specific error types
      if (error.message === 'Webhook signature verification failed') {
        logger.error('Webhook signature verification failed', {
          ip: req.ip,
          processingTimeMs: processingTime,
        });

        res.status(401).json({
          error: WEBHOOK_ERRORS.INVALID_SIGNATURE,
          message: 'Invalid webhook signature',
        });
        return;
      }

      if (error.message?.includes('duplicate') || error.message?.includes('already processed')) {
        logger.info('Webhook event already processed (idempotent)', {
          processingTimeMs: processingTime,
        });

        // Return 200 for duplicate events (idempotent behavior)
        res.status(200).json({
          received: true,
          duplicate: true,
          message: 'Event already processed',
        });
        return;
      }

      // Log unexpected errors
      logger.error('Webhook processing error', {
        error: error.message,
        stack: error.stack,
        processingTimeMs: processingTime,
      });

      // Return 500 for processing errors
      // Stripe will retry the webhook based on this response
      res.status(500).json({
        error: WEBHOOK_ERRORS.PROCESSING_ERROR,
        message: 'Webhook processing failed',
        retryable: true,
      });
    }
  }

  /**
   * POST /webhooks/stripe/billing
   *
   * Alternative webhook endpoint specifically for billing-related events.
   * Uses the subscription service for processing.
   */
  async handleBillingWebhook(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const signature = req.headers['stripe-signature'];

      if (!signature || typeof signature !== 'string') {
        res.status(400).json({
          error: WEBHOOK_ERRORS.MISSING_SIGNATURE,
          message: 'Missing stripe-signature header',
        });
        return;
      }

      const payload = req.body;

      // Use subscription service which now has proper signature verification
      await subscriptionService.handleWebhook(payload, signature);

      res.status(200).json({
        received: true,
        processingTimeMs: Date.now() - startTime,
      });

    } catch (error: any) {
      const processingTime = Date.now() - startTime;

      if (error.message === 'Webhook signature verification failed') {
        res.status(401).json({
          error: WEBHOOK_ERRORS.INVALID_SIGNATURE,
          message: 'Invalid webhook signature',
        });
        return;
      }

      logger.error('Billing webhook processing error', {
        error: error.message,
        processingTimeMs: processingTime,
      });

      res.status(500).json({
        error: WEBHOOK_ERRORS.PROCESSING_ERROR,
        message: 'Webhook processing failed',
      });
    }
  }

  /**
   * POST /webhooks/stripe/payment
   *
   * Webhook endpoint for payment-related events.
   * Uses the payment service for processing.
   */
  async handlePaymentWebhook(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const signature = req.headers['stripe-signature'];

      if (!signature || typeof signature !== 'string') {
        res.status(400).json({
          error: WEBHOOK_ERRORS.MISSING_SIGNATURE,
          message: 'Missing stripe-signature header',
        });
        return;
      }

      const payload = req.body;

      // Payment service also has proper signature verification
      await paymentService.handleWebhook(payload, signature as string);

      res.status(200).json({
        received: true,
        processingTimeMs: Date.now() - startTime,
      });

    } catch (error: any) {
      const processingTime = Date.now() - startTime;

      if (error.message === 'Webhook signature verification failed') {
        res.status(401).json({
          error: WEBHOOK_ERRORS.INVALID_SIGNATURE,
          message: 'Invalid webhook signature',
        });
        return;
      }

      logger.error('Payment webhook processing error', {
        error: error.message,
        processingTimeMs: processingTime,
      });

      res.status(500).json({
        error: WEBHOOK_ERRORS.PROCESSING_ERROR,
        message: 'Webhook processing failed',
      });
    }
  }

  /**
   * GET /webhooks/health
   *
   * Health check endpoint for webhook service.
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    const webhookSecretConfigured = !!process.env.STRIPE_WEBHOOK_SECRET;

    res.status(200).json({
      status: 'healthy',
      webhookSecretConfigured,
      timestamp: new Date().toISOString(),
    });
  }
}

export const webhookController = new WebhookController();
