import Stripe from 'stripe';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../lib/prisma.js';
import { stripe, constructWebhookEvent } from '../lib/stripe.js';
import { auditService } from './audit.service.js';
import { SubscriptionStatus } from '../generated/client/index.js';

/**
 * Subscription lifecycle states with proper transitions
 */
const SUBSCRIPTION_STATES: Record<string, SubscriptionStatus> = {
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

/**
 * Map Stripe subscription status to internal status
 */
function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return SUBSCRIPTION_STATES.ACTIVE;
    case 'past_due':
      return SUBSCRIPTION_STATES.PAST_DUE;
    case 'canceled':
    case 'unpaid':
      return SUBSCRIPTION_STATES.CANCELLED;
    case 'incomplete':
    case 'incomplete_expired':
    case 'paused':
    default:
      return SUBSCRIPTION_STATES.EXPIRED;
  }
}

/**
 * Retry database operation with exponential backoff
 */
async function retryDbOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500;
        logger.warn(`${operationName} failed, retrying...`, {
          attempt: attempt + 1,
          maxRetries,
          delayMs: delay,
          error: lastError.message,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error(`${operationName} failed`);
}

export const subscriptionService = {
  /**
   * Create a subscription with audit logging
   */
  async createSubscription(
    userId: string,
    input: { planId: string; paymentMethodId: string; couponCode?: string },
    requestContext?: { ipAddress?: string; userAgent?: string }
  ): Promise<any> {
    const startTime = Date.now();

    // Check if user already has active subscription
    const existing = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (existing) {
      throw new BadRequestError('User already has an active subscription');
    }

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const subscription = await retryDbOperation(
      async () => prisma.subscription.create({
        data: {
          userId,
          planId: input.planId,
          status: 'active',
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: false,
        },
      }),
      'Create subscription'
    );

    // Log audit event
    await auditService.logEvent({
      userId,
      action: 'SUBSCRIPTION_CREATED',
      resource: 'subscription',
      resourceId: subscription.id,
      details: {
        planId: input.planId,
        status: subscription.status,
        processingTimeMs: Date.now() - startTime,
      },
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
    });

    logger.info('Subscription created', {
      subscriptionId: subscription.id,
      userId,
      planId: input.planId,
      processingTimeMs: Date.now() - startTime,
    });

    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };
  },

  /**
   * Cancel a subscription with audit logging
   */
  async cancelSubscription(
    id: string,
    userId: string,
    requestContext?: { ipAddress?: string; userAgent?: string }
  ): Promise<void> {
    const startTime = Date.now();

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenError('Cannot cancel another user\'s subscription');
    }

    await retryDbOperation(
      async () => prisma.subscription.update({
        where: { id },
        data: { cancelAtPeriodEnd: true },
      }),
      'Cancel subscription'
    );

    // Log audit event
    await auditService.logEvent({
      userId,
      action: 'SUBSCRIPTION_CANCEL_SCHEDULED',
      resource: 'subscription',
      resourceId: id,
      details: {
        planId: subscription.planId,
        effectiveDate: subscription.currentPeriodEnd.toISOString(),
        processingTimeMs: Date.now() - startTime,
      },
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
    });

    logger.info('Subscription cancelled', {
      subscriptionId: id,
      userId,
      processingTimeMs: Date.now() - startTime,
    });
  },

  /**
   * Handle Stripe webhook with proper signature verification and idempotency
   *
   * IMPORTANT: This method now properly verifies the Stripe webhook signature
   * to prevent replay attacks and ensure webhook authenticity.
   */
  async handleWebhook(payload: string | Buffer, signature: string): Promise<void> {
    const startTime = Date.now();

    // Step 1: Verify webhook signature (CRITICAL SECURITY CHECK)
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error('STRIPE_WEBHOOK_SECRET is not configured');
      throw new Error('Webhook secret is not configured');
    }

    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(payload, signature, webhookSecret);
      logger.info('Webhook signature verified', {
        eventId: event.id,
        eventType: event.type,
      });
    } catch (error: any) {
      logger.error('Webhook signature verification failed', {
        error: error.message,
        signaturePreview: typeof signature === 'string' ? signature.substring(0, 20) + '...' : 'invalid',
      });
      throw new Error('Webhook signature verification failed');
    }

    // Step 2: Check for duplicate event (idempotency)
    const existingEvent = await prisma.webhookEventLog.findUnique({
      where: { eventId: event.id },
    }).catch(() => null);

    if (existingEvent?.status === 'succeeded') {
      logger.info('Webhook event already processed (idempotent)', {
        eventId: event.id,
        eventType: event.type,
      });
      return; // Idempotent - already processed successfully
    }

    // Step 3: Log the webhook event
    const eventLog = await prisma.webhookEventLog.upsert({
      where: { eventId: event.id },
      update: {
        status: 'processing',
        retryCount: { increment: 1 },
        updatedAt: new Date(),
      },
      create: {
        eventId: event.id,
        eventType: event.type,
        status: 'processing',
        payload: event as any,
        retryCount: 0,
      },
    });

    try {
      // Step 4: Process the webhook event based on type
      logger.info('Processing webhook event', { eventType: event.type, eventId: event.id });

      switch (event.type) {
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object as Stripe.Subscription);
          break;

        default:
          logger.debug('Unhandled webhook event', { eventType: event.type });
      }

      // Step 5: Mark event as succeeded
      await prisma.webhookEventLog.update({
        where: { id: eventLog.id },
        data: {
          status: 'succeeded',
          processingTimeMs: Date.now() - startTime,
          updatedAt: new Date(),
        },
      });

      logger.info('Webhook event processed successfully', {
        eventId: event.id,
        eventType: event.type,
        processingTimeMs: Date.now() - startTime,
      });

    } catch (error: any) {
      // Mark event as failed
      await prisma.webhookEventLog.update({
        where: { id: eventLog.id },
        data: {
          status: 'failed',
          error: error.message,
          processingTimeMs: Date.now() - startTime,
          updatedAt: new Date(),
        },
      });

      logger.error('Webhook event processing failed', {
        eventId: event.id,
        eventType: event.type,
        error: error.message,
        processingTimeMs: Date.now() - startTime,
      });

      throw error;
    }
  },

  /**
   * Handle invoice paid event
   */
  async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    logger.info('Processing invoice.paid', { invoiceId: invoice.id });

    if ((invoice as any).subscription) {
      const subscriptionId = typeof (invoice as any).subscription === 'string'
        ? (invoice as any).subscription
        : (invoice as any).subscription.id;

      await retryDbOperation(
        async () => prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: SUBSCRIPTION_STATES.ACTIVE,
            updatedAt: new Date(),
          },
        }),
        'Update subscription to active'
      );

      logger.info('Subscription marked as active', { subscriptionId });
    }
  },

  /**
   * Handle invoice payment failed event
   */
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    logger.warn('Processing invoice.payment_failed', {
      invoiceId: invoice.id,
      attemptCount: invoice.attempt_count,
    });

    if ((invoice as any).subscription) {
      const subscriptionId = typeof (invoice as any).subscription === 'string'
        ? (invoice as any).subscription
        : (invoice as any).subscription.id;

      await retryDbOperation(
        async () => prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: SUBSCRIPTION_STATES.PAST_DUE,
            updatedAt: new Date(),
          },
        }),
        'Update subscription to past_due'
      );

      logger.info('Subscription marked as past_due', { subscriptionId });
    }
  },

  /**
   * Handle subscription created event
   */
  async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) {
      logger.warn('Subscription created without userId in metadata', {
        subscriptionId: subscription.id
      });
      return;
    }

    logger.info('Processing subscription.created', {
      subscriptionId: subscription.id,
      userId,
    });

    const status = mapStripeStatus(subscription.status);

    await retryDbOperation(
      async () => prisma.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        update: {
          status,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: new Date(),
        },
        create: {
          userId,
          planId: subscription.items.data[0].price.id,
          stripeSubscriptionId: subscription.id,
          status,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      }),
      'Create/update subscription from webhook'
    );
  },

  /**
   * Handle subscription updated event
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    logger.info('Processing subscription.updated', {
      subscriptionId: subscription.id,
      status: subscription.status,
    });

    const status = mapStripeStatus(subscription.status);

    await retryDbOperation(
      async () => prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: new Date(),
        },
      }),
      'Update subscription from webhook'
    );
  },

  /**
   * Handle subscription deleted event
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    logger.info('Processing subscription.deleted', { subscriptionId: subscription.id });

    await retryDbOperation(
      async () => prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: SUBSCRIPTION_STATES.CANCELLED,
          updatedAt: new Date(),
        },
      }),
      'Mark subscription as cancelled'
    );

    // Log audit event if userId is available
    const userId = subscription.metadata.userId;
    if (userId) {
      await auditService.logEvent({
        userId,
        action: 'SUBSCRIPTION_CANCELLED_BY_WEBHOOK',
        resource: 'subscription',
        details: {
          stripeSubscriptionId: subscription.id,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000).toISOString()
            : new Date().toISOString(),
        },
      });
    }
  },

  /**
   * Handle trial will end event
   */
  async handleTrialWillEnd(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    const trialEndDate = subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null;

    const daysRemaining = trialEndDate
      ? Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    logger.info('Processing subscription.trial_will_end', {
      subscriptionId: subscription.id,
      daysRemaining,
      trialEndDate: trialEndDate?.toISOString(),
    });

    // Log audit event for trial ending
    await auditService.logEvent({
      userId,
      action: 'SUBSCRIPTION_TRIAL_ENDING',
      resource: 'subscription',
      details: {
        stripeSubscriptionId: subscription.id,
        daysRemaining,
        trialEndDate: trialEndDate?.toISOString(),
      },
    });

    // Here you would typically send notification emails to the user
    // This is handled by the notification service
  },
};
