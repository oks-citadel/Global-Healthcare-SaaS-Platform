import Stripe from 'stripe';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger.js';
import { stripe, constructWebhookEvent } from '../lib/stripe.js';
import { sendEmail } from '../lib/email.js';
import { sendSms } from '../lib/sms.js';

const prisma = new PrismaClient();

/**
 * Stripe Webhook Service
 *
 * Production-ready webhook handler with:
 * - Webhook signature verification
 * - Idempotency handling (prevents duplicate processing)
 * - Database updates for payment records
 * - Email/notification triggers
 * - Error handling and logging
 * - Retry logic with exponential backoff
 */

interface WebhookEventLog {
  id: string;
  eventType: string;
  eventId: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  payload: any;
  error?: string;
  retryCount: number;
  processingTimeMs?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class StripeWebhookService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_BASE = 1000; // 1 second

  /**
   * Process webhook with retry mechanism and idempotency
   */
  async processWebhookWithRetry(
    payload: string | Buffer,
    signature: string,
    maxRetries: number = this.MAX_RETRIES
  ): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
    }

    let event: Stripe.Event;

    // Step 1: Verify webhook signature
    try {
      event = constructWebhookEvent(payload, signature, webhookSecret);
      logger.info('Webhook signature verified', {
        eventId: event.id,
        eventType: event.type,
      });
    } catch (error: any) {
      logger.error('Webhook signature verification failed', {
        error: error.message,
        signature: signature.substring(0, 20) + '...',
      });
      throw new Error('Webhook signature verification failed');
    }

    // Step 2: Check for duplicate event (idempotency)
    const isDuplicate = await this.checkIdempotency(event.id);
    if (isDuplicate) {
      logger.info('Webhook event already processed (idempotency check)', {
        eventId: event.id,
        eventType: event.type,
      });
      throw new Error('Event already processed (duplicate)');
    }

    // Step 3: Log webhook event
    const eventLog = await this.logWebhookEvent(event);

    // Step 4: Process with retry logic
    let retryCount = 0;
    let lastError: Error | null = null;
    const startTime = Date.now();

    while (retryCount <= maxRetries) {
      try {
        await this.updateEventLog(eventLog.id, {
          status: 'processing',
          retryCount,
        });

        // Process the webhook event
        await this.processWebhookEvent(event);

        // Update as succeeded
        const processingTime = Date.now() - startTime;
        await this.updateEventLog(eventLog.id, {
          status: 'succeeded',
          processingTimeMs: processingTime,
        });

        logger.info('Webhook event processed successfully', {
          eventId: event.id,
          eventType: event.type,
          retryCount,
          processingTimeMs: processingTime,
        });

        return;
      } catch (error) {
        lastError = error as Error;
        retryCount++;

        if (retryCount <= maxRetries) {
          const delay = Math.pow(2, retryCount) * this.RETRY_DELAY_BASE;
          logger.warn('Webhook processing failed, retrying...', {
            eventType: event.type,
            eventId: event.id,
            retryCount,
            delayMs: delay,
            error: lastError.message,
          });
          await this.sleep(delay);
        }
      }
    }

    // All retries exhausted
    const processingTime = Date.now() - startTime;
    await this.updateEventLog(eventLog.id, {
      status: 'failed',
      error: lastError?.message || 'Unknown error',
      retryCount,
      processingTimeMs: processingTime,
    });

    logger.error('Webhook processing failed after all retries', {
      eventType: event.type,
      eventId: event.id,
      retryCount,
      processingTimeMs: processingTime,
      error: lastError,
    });

    throw lastError || new Error('Webhook processing failed');
  }

  /**
   * Main webhook event processor
   */
  private async processWebhookEvent(event: Stripe.Event): Promise<void> {
    logger.info(`Processing webhook event: ${event.type}`, {
      eventId: event.id,
    });

    switch (event.type) {
      // Payment Intent Events
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.created':
        await this.handlePaymentIntentCreated(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await this.handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.processing':
        await this.handlePaymentIntentProcessing(event.data.object as Stripe.PaymentIntent);
        break;

      // Subscription Events
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
        await this.handleSubscriptionTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      // Invoice Events
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.upcoming':
        await this.handleInvoiceUpcoming(event.data.object as Stripe.Invoice);
        break;

      // Charge Events
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'charge.succeeded':
        await this.handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;

      case 'charge.failed':
        await this.handleChargeFailed(event.data.object as Stripe.Charge);
        break;

      case 'charge.dispute.created':
        await this.handleChargeDisputeCreated(event.data.object as Stripe.Dispute);
        break;

      // Payment Method Events
      case 'payment_method.attached':
        await this.handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
        break;

      case 'payment_method.detached':
        await this.handlePaymentMethodDetached(event.data.object as Stripe.PaymentMethod);
        break;

      case 'payment_method.automatically_updated':
        await this.handlePaymentMethodAutomaticallyUpdated(event.data.object as Stripe.PaymentMethod);
        break;

      default:
        logger.info(`Unhandled webhook event type: ${event.type}`, {
          eventId: event.id,
        });
    }
  }

  // ============================================================================
  // Payment Intent Handlers
  // ============================================================================

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    logger.info(`Payment intent succeeded: ${paymentIntent.id}`, {
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });

    const userId = paymentIntent.metadata.userId;
    if (!userId) {
      logger.warn(`Payment intent ${paymentIntent.id} has no userId in metadata`);
      return;
    }

    // Update payment record in database with retry logic
    await this.retryDatabaseOperation(async () => {
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: {
          status: 'succeeded',
          updatedAt: new Date(),
        },
      });
    });

    // Get user details for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.email) {
      // Send success email notification
      await this.sendPaymentSuccessNotification(user, paymentIntent);
    }

    // Update subscription if this payment is for a subscription
    if ((paymentIntent as any).invoice) {
      const invoiceId = typeof (paymentIntent as any).invoice === 'string'
        ? (paymentIntent as any).invoice
        : (paymentIntent as any).invoice.id;

      try {
        const invoice = await stripe.invoices.retrieve(invoiceId);
        if ((invoice as any).subscription) {
          const subscriptionId = typeof (invoice as any).subscription === 'string'
            ? (invoice as any).subscription
            : (invoice as any).subscription.id;

          await this.retryDatabaseOperation(async () => {
            await prisma.subscription.updateMany({
              where: { stripeSubscriptionId: subscriptionId },
              data: {
                status: 'active',
                updatedAt: new Date(),
              },
            });
          });

          logger.info(`Updated subscription ${subscriptionId} to active`);
        }
      } catch (error) {
        logger.error('Error retrieving invoice for payment intent', { error });
      }
    }
  }

  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    logger.error(`Payment intent failed: ${paymentIntent.id}`, {
      failureCode: paymentIntent.last_payment_error?.code,
      failureMessage: paymentIntent.last_payment_error?.message,
    });

    const userId = paymentIntent.metadata.userId;
    if (!userId) {
      logger.warn(`Payment intent ${paymentIntent.id} has no userId in metadata`);
      return;
    }

    // Update payment record with retry logic
    await this.retryDatabaseOperation(async () => {
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: {
          status: 'failed',
          failedReason: paymentIntent.last_payment_error?.message,
          updatedAt: new Date(),
        },
      });
    });

    // Get user details for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.email) {
      // Send failure notification
      await this.sendPaymentFailedNotification(user, paymentIntent);
    }
  }

  private async handlePaymentIntentCreated(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    logger.info(`Payment intent created: ${paymentIntent.id}`);
  }

  private async handlePaymentIntentCanceled(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    logger.info(`Payment intent canceled: ${paymentIntent.id}`);

    await this.retryDatabaseOperation(async () => {
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: {
          status: 'cancelled',
          updatedAt: new Date(),
        },
      });
    });
  }

  private async handlePaymentIntentProcessing(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    logger.info(`Payment intent processing: ${paymentIntent.id}`);

    await this.retryDatabaseOperation(async () => {
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: {
          status: 'processing',
          updatedAt: new Date(),
        },
      });
    });
  }

  // ============================================================================
  // Subscription Handlers
  // ============================================================================

  private async handleSubscriptionCreated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) {
      logger.warn(`Subscription ${subscription.id} has no userId in metadata`);
      return;
    }

    logger.info(`Subscription created: ${subscription.id}`, { userId });

    // Map Stripe status to our status
    const status = this.mapSubscriptionStatus(subscription.status);

    // Create or update subscription in database with retry logic
    await this.retryDatabaseOperation(async () => {
      await prisma.subscription.upsert({
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
      });
    });

    // Send welcome email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.email) {
      await this.sendSubscriptionCreatedNotification(user, subscription);
    }
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) {
      logger.warn(`Subscription ${subscription.id} has no userId in metadata`);
      return;
    }

    logger.info(`Subscription updated: ${subscription.id}`, {
      status: subscription.status,
    });

    const status = this.mapSubscriptionStatus(subscription.status);

    // Update subscription in database with retry logic
    await this.retryDatabaseOperation(async () => {
      await prisma.subscription.upsert({
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
      });
    });

    // Send notification for plan changes
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.email) {
      await this.sendSubscriptionUpdatedNotification(user, subscription);
    }
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    logger.info(`Subscription deleted: ${subscription.id}`);

    // Update subscription status with retry logic
    await this.retryDatabaseOperation(async () => {
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: 'cancelled',
          updatedAt: new Date(),
        },
      });
    });

    const userId = subscription.metadata.userId;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.email) {
        await this.sendSubscriptionCancelledNotification(user, subscription);
      }
    }
  }

  private async handleSubscriptionTrialWillEnd(
    subscription: Stripe.Subscription
  ): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const trialEndDate = subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null;
    const daysRemaining = trialEndDate
      ? Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    logger.info(`Trial ending soon for subscription: ${subscription.id}`, {
      daysRemaining,
    });

    // Send email notification
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Your Trial Ends in ${daysRemaining} Days`,
        templatePath: 'trial-ending.html',
        templateData: {
          name: `${user.firstName} ${user.lastName}`,
          daysRemaining,
          trialEndDate: trialEndDate?.toLocaleDateString(),
        },
      });
    }

    // Send SMS notification if phone available
    if (user.phone) {
      await sendSms({
        to: user.phone,
        message: `Hello ${user.firstName}, your healthcare platform trial ends in ${daysRemaining} days. Update your payment method to continue service.`,
      });
    }
  }

  // ============================================================================
  // Invoice Handlers
  // ============================================================================

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    logger.info(`Invoice paid: ${invoice.id}`, {
      amountPaid: invoice.amount_paid / 100,
      currency: invoice.currency,
    });

    // Record successful invoice payment
    if ((invoice as any).subscription) {
      const subscriptionId = typeof (invoice as any).subscription === 'string'
        ? (invoice as any).subscription
        : (invoice as any).subscription.id;

      await this.retryDatabaseOperation(async () => {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: 'active',
            updatedAt: new Date(),
          },
        });
      });
    }

    // Send payment receipt
    if (invoice.customer_email) {
      await sendEmail({
        to: invoice.customer_email,
        subject: 'Payment Receipt - Healthcare Platform',
        templatePath: 'payment-receipt.html',
        templateData: {
          invoiceNumber: invoice.number,
          amountPaid: (invoice.amount_paid / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
          invoiceUrl: invoice.hosted_invoice_url,
          invoicePdf: invoice.invoice_pdf,
          date: new Date(invoice.created * 1000).toLocaleDateString(),
        },
      });
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    logger.warn(`Invoice payment failed: ${invoice.id}`, {
      amountDue: invoice.amount_due / 100,
      attemptCount: invoice.attempt_count,
    });

    // Update subscription status to past_due
    if ((invoice as any).subscription) {
      const subscriptionId = typeof (invoice as any).subscription === 'string'
        ? (invoice as any).subscription
        : (invoice as any).subscription.id;

      await this.retryDatabaseOperation(async () => {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: 'past_due',
            updatedAt: new Date(),
          },
        });
      });
    }

    // Send payment failure notification
    if (invoice.customer_email) {
      await sendEmail({
        to: invoice.customer_email,
        subject: 'Payment Failed - Action Required',
        templatePath: 'payment-failed.html',
        templateData: {
          invoiceNumber: invoice.number,
          amountDue: (invoice.amount_due / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
          invoiceUrl: invoice.hosted_invoice_url,
          attemptCount: invoice.attempt_count,
          nextPaymentAttempt: invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString()
            : null,
        },
      });
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    logger.info(`Invoice payment succeeded: ${invoice.id}`);
    // Same as invoice.paid - could be handled together
    await this.handleInvoicePaid(invoice);
  }

  private async handleInvoiceUpcoming(invoice: Stripe.Invoice): Promise<void> {
    logger.info(`Upcoming invoice: ${invoice.id}`);

    if (invoice.customer_email) {
      await sendEmail({
        to: invoice.customer_email,
        subject: 'Upcoming Payment Notification',
        templatePath: 'upcoming-invoice.html',
        templateData: {
          amountDue: (invoice.amount_due / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
          dueDate: invoice.due_date
            ? new Date(invoice.due_date * 1000).toLocaleDateString()
            : null,
        },
      });
    }
  }

  // ============================================================================
  // Charge Handlers
  // ============================================================================

  private async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    logger.info(`Charge refunded: ${charge.id}`, {
      amountRefunded: charge.amount_refunded / 100,
      currency: charge.currency,
    });

    // Find and update payment record
    const payment = await prisma.payment.findFirst({
      where: {
        stripePaymentIntentId:
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id,
      },
    });

    if (payment) {
      const refundedAmount = charge.amount_refunded / 100;
      const isFullyRefunded = charge.amount_refunded === charge.amount;

      await this.retryDatabaseOperation(async () => {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: isFullyRefunded ? 'refunded' : 'partially_refunded',
            refundedAmount,
            refundedAt: new Date(),
            updatedAt: new Date(),
          },
        });
      });

      // Send refund notification
      if (charge.receipt_email) {
        await sendEmail({
          to: charge.receipt_email,
          subject: 'Refund Processed',
          templatePath: 'refund-processed.html',
          templateData: {
            chargeId: charge.id,
            amountRefunded: (charge.amount_refunded / 100).toFixed(2),
            currency: charge.currency.toUpperCase(),
            date: new Date().toLocaleDateString(),
          },
        });
      }
    }
  }

  private async handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
    logger.info(`Charge succeeded: ${charge.id}`);
  }

  private async handleChargeFailed(charge: Stripe.Charge): Promise<void> {
    logger.error(`Charge failed: ${charge.id}`, {
      failureCode: charge.failure_code,
      failureMessage: charge.failure_message,
    });
  }

  private async handleChargeDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
    logger.warn(`Charge dispute created: ${dispute.id}`, {
      chargeId: dispute.charge,
      amount: dispute.amount / 100,
      reason: dispute.reason,
    });

    // Alert admin team
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `URGENT: Payment Dispute Created - ${dispute.id}`,
        html: `
          <h2>Payment Dispute Created</h2>
          <p><strong>Dispute ID:</strong> ${dispute.id}</p>
          <p><strong>Charge ID:</strong> ${dispute.charge}</p>
          <p><strong>Amount:</strong> ${(dispute.amount / 100).toFixed(2)} ${dispute.currency.toUpperCase()}</p>
          <p><strong>Reason:</strong> ${dispute.reason}</p>
          <p><strong>Status:</strong> ${dispute.status}</p>
          <p><strong>Evidence Due:</strong> ${dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toLocaleDateString() : 'N/A'}</p>
          <p>Please review and respond in the Stripe Dashboard.</p>
        `,
      });
    }
  }

  // ============================================================================
  // Payment Method Handlers
  // ============================================================================

  private async handlePaymentMethodAttached(
    paymentMethod: Stripe.PaymentMethod
  ): Promise<void> {
    logger.info(`Payment method attached: ${paymentMethod.id}`);
  }

  private async handlePaymentMethodDetached(
    paymentMethod: Stripe.PaymentMethod
  ): Promise<void> {
    logger.info(`Payment method detached: ${paymentMethod.id}`);
  }

  private async handlePaymentMethodAutomaticallyUpdated(
    paymentMethod: Stripe.PaymentMethod
  ): Promise<void> {
    logger.info(`Payment method automatically updated: ${paymentMethod.id}`);

    // Notify customer about automatic card update
    if (paymentMethod.customer && typeof paymentMethod.customer === 'string') {
      try {
        const customer = await stripe.customers.retrieve(paymentMethod.customer);
        if (customer && !customer.deleted && (customer as any).email) {
          await sendEmail({
            to: (customer as any).email,
            subject: 'Payment Method Automatically Updated',
            html: `
              <p>Your payment method has been automatically updated by your bank.</p>
              <p>This usually happens when your bank issues a new card (e.g., expiration date change).</p>
              <p>No action is required on your part.</p>
            `,
          });
        }
      } catch (error) {
        logger.error('Error sending payment method update notification', { error });
      }
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Check if webhook event has already been processed (idempotency)
   */
  private async checkIdempotency(eventId: string): Promise<boolean> {
    try {
      // Check if event exists in a simple in-memory cache or database
      // For production, use Redis or database table
      const existingLog = await this.getEventLog(eventId);
      return existingLog !== null && existingLog.status === 'succeeded';
    } catch (error) {
      logger.error('Error checking idempotency', { error });
      return false;
    }
  }

  /**
   * Log webhook event to database
   */
  private async logWebhookEvent(event: Stripe.Event): Promise<WebhookEventLog> {
    try {
      // Create webhook event log in database
      const eventLog = await prisma.webhookEventLog.create({
        data: {
          eventType: event.type,
          eventId: event.id,
          status: 'pending',
          payload: event as any,
          retryCount: 0,
        },
      });

      logger.info('Webhook event logged to database', {
        id: eventLog.id,
        eventId: event.id,
        eventType: event.type,
      });

      return {
        id: eventLog.id,
        eventType: eventLog.eventType,
        eventId: eventLog.eventId,
        status: eventLog.status as 'pending' | 'processing' | 'succeeded' | 'failed',
        payload: eventLog.payload,
        error: eventLog.error || undefined,
        retryCount: eventLog.retryCount,
        processingTimeMs: eventLog.processingTimeMs || undefined,
        createdAt: eventLog.createdAt,
        updatedAt: eventLog.updatedAt,
      };
    } catch (error: any) {
      // Handle unique constraint violation (duplicate event)
      if (error.code === 'P2002') {
        logger.warn('Webhook event already exists in database', {
          eventId: event.id,
        });
        throw new Error('Event already processed (duplicate)');
      }
      logger.error('Failed to log webhook event', { error });
      throw error;
    }
  }

  /**
   * Get webhook event log
   */
  private async getEventLog(eventId: string): Promise<WebhookEventLog | null> {
    try {
      const eventLog = await prisma.webhookEventLog.findUnique({
        where: { eventId },
      });

      if (!eventLog) {
        return null;
      }

      return {
        id: eventLog.id,
        eventType: eventLog.eventType,
        eventId: eventLog.eventId,
        status: eventLog.status as 'pending' | 'processing' | 'succeeded' | 'failed',
        payload: eventLog.payload,
        error: eventLog.error || undefined,
        retryCount: eventLog.retryCount,
        processingTimeMs: eventLog.processingTimeMs || undefined,
        createdAt: eventLog.createdAt,
        updatedAt: eventLog.updatedAt,
      };
    } catch (error) {
      logger.error('Failed to get webhook event log', { error });
      return null;
    }
  }

  /**
   * Update webhook event log
   */
  private async updateEventLog(
    eventId: string,
    updates: Partial<WebhookEventLog>
  ): Promise<void> {
    try {
      await prisma.webhookEventLog.update({
        where: { id: eventId },
        data: {
          status: updates.status as any,
          error: updates.error,
          retryCount: updates.retryCount,
          processingTimeMs: updates.processingTimeMs,
          updatedAt: new Date(),
        },
      });

      logger.info('Webhook event log updated in database', { eventId, updates });
    } catch (error) {
      logger.error('Failed to update webhook event log', { error, eventId });
      // Don't throw - log update failures shouldn't stop webhook processing
    }
  }

  /**
   * Map Stripe subscription status to our status
   */
  private mapSubscriptionStatus(
    stripeStatus: Stripe.Subscription.Status
  ): 'active' | 'past_due' | 'cancelled' | 'expired' {
    switch (stripeStatus) {
      case 'active':
      case 'trialing':
        return 'active';
      case 'past_due':
        return 'past_due';
      case 'canceled':
      case 'unpaid':
        return 'cancelled';
      case 'incomplete':
      case 'incomplete_expired':
      case 'paused':
      default:
        return 'expired';
    }
  }

  /**
   * Retry database operation with exponential backoff
   */
  private async retryDatabaseOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 500; // 500ms, 1s, 2s
          logger.warn('Database operation failed, retrying...', {
            attempt: attempt + 1,
            maxRetries,
            delayMs: delay,
            error: lastError.message,
          });
          await this.sleep(delay);
        }
      }
    }

    logger.error('Database operation failed after all retries', {
      error: lastError,
    });
    throw lastError || new Error('Database operation failed');
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // Notification Methods
  // ============================================================================

  private async sendPaymentSuccessNotification(
    user: any,
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Payment Successful',
        templatePath: 'payment-success.html',
        templateData: {
          name: `${user.firstName} ${user.lastName}`,
          amount: (paymentIntent.amount / 100).toFixed(2),
          currency: paymentIntent.currency.toUpperCase(),
          paymentIntentId: paymentIntent.id,
          date: new Date().toLocaleDateString(),
        },
      });
    } catch (error) {
      logger.error('Error sending payment success notification', { error });
    }
  }

  private async sendPaymentFailedNotification(
    user: any,
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Payment Failed - Action Required',
        templatePath: 'payment-failed.html',
        templateData: {
          name: `${user.firstName} ${user.lastName}`,
          amount: (paymentIntent.amount / 100).toFixed(2),
          currency: paymentIntent.currency.toUpperCase(),
          failureReason: paymentIntent.last_payment_error?.message,
          date: new Date().toLocaleDateString(),
        },
      });
    } catch (error) {
      logger.error('Error sending payment failed notification', { error });
    }
  }

  private async sendSubscriptionCreatedNotification(
    user: any,
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Your Healthcare Subscription',
        templatePath: 'subscription-welcome.html',
        templateData: {
          name: `${user.firstName} ${user.lastName}`,
          subscriptionId: subscription.id,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toLocaleDateString()
            : null,
        },
      });
    } catch (error) {
      logger.error('Error sending subscription created notification', { error });
    }
  }

  private async sendSubscriptionUpdatedNotification(
    user: any,
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Subscription Has Been Updated',
        templatePath: 'subscription-updated.html',
        templateData: {
          name: `${user.firstName} ${user.lastName}`,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(
            (subscription as any).current_period_end * 1000
          ).toLocaleDateString(),
        },
      });
    } catch (error) {
      logger.error('Error sending subscription updated notification', { error });
    }
  }

  private async sendSubscriptionCancelledNotification(
    user: any,
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Subscription Has Been Canceled',
        templatePath: 'subscription-canceled.html',
        templateData: {
          name: `${user.firstName} ${user.lastName}`,
          subscriptionId: subscription.id,
          endDate: new Date((subscription as any).current_period_end * 1000).toLocaleDateString(),
        },
      });
    } catch (error) {
      logger.error('Error sending subscription cancelled notification', { error });
    }
  }
}

export const stripeWebhookService = new StripeWebhookService();
