import Stripe from 'stripe';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger.js';
import { constructWebhookEvent } from './stripe.js';
import { sendEmail } from './aws-email.js';
import { sendSms } from './aws-sms.js';

const prisma = new PrismaClient();

/**
 * Enhanced Stripe Webhook Handler
 *
 * Handles all Stripe webhook events with:
 * - Comprehensive event coverage
 * - Retry mechanism with exponential backoff
 * - Error handling and logging
 * - Database persistence
 * - Customer notifications
 */

export interface WebhookEventLog {
  id: string;
  eventType: string;
  eventId: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  payload: Stripe.Event;
  error?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Process webhook with retry mechanism
 */
export async function processWebhookWithRetry(
  payload: string | Buffer,
  signature: string,
  maxRetries: number = 3
): Promise<void> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(payload, signature, webhookSecret);
  } catch (error) {
    logger.error('Webhook signature verification failed', { error });
    throw error;
  }

  // Log webhook event
  const eventLog = await logWebhookEvent(event);

  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount <= maxRetries) {
    try {
      await updateEventLog(eventLog.id, { status: 'processing', retryCount });
      await processWebhookEvent(event);
      await updateEventLog(eventLog.id, { status: 'succeeded' });
      logger.info(`Webhook event ${event.type} processed successfully`, { eventId: event.id });
      return;
    } catch (error) {
      lastError = error as Error;
      retryCount++;

      if (retryCount <= maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        logger.warn(`Webhook processing failed, retrying in ${delay}ms`, {
          eventType: event.type,
          eventId: event.id,
          retryCount,
          error: lastError.message,
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  await updateEventLog(eventLog.id, {
    status: 'failed',
    error: lastError?.message || 'Unknown error',
    retryCount,
  });

  logger.error('Webhook processing failed after all retries', {
    eventType: event.type,
    eventId: event.id,
    retryCount,
    error: lastError,
  });

  throw lastError || new Error('Webhook processing failed');
}

/**
 * Main webhook event processor
 */
async function processWebhookEvent(event: Stripe.Event): Promise<void> {
  logger.info(`Processing webhook event: ${event.type}`, { eventId: event.id });

  switch (event.type) {
    // Subscription events
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.trial_will_end':
      await handleSubscriptionTrialWillEnd(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.paused':
      await handleSubscriptionPaused(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.resumed':
      await handleSubscriptionResumed(event.data.object as Stripe.Subscription);
      break;

    // Invoice events
    case 'invoice.created':
      await handleInvoiceCreated(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.finalized':
      await handleInvoiceFinalized(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.upcoming':
      await handleInvoiceUpcoming(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.voided':
      await handleInvoiceVoided(event.data.object as Stripe.Invoice);
      break;

    // Payment Intent events
    case 'payment_intent.created':
      await handlePaymentIntentCreated(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.canceled':
      await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.processing':
      await handlePaymentIntentProcessing(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.requires_action':
      await handlePaymentIntentRequiresAction(event.data.object as Stripe.PaymentIntent);
      break;

    // Payment Method events
    case 'payment_method.attached':
      await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
      break;

    case 'payment_method.detached':
      await handlePaymentMethodDetached(event.data.object as Stripe.PaymentMethod);
      break;

    case 'payment_method.updated':
      await handlePaymentMethodUpdated(event.data.object as Stripe.PaymentMethod);
      break;

    case 'payment_method.automatically_updated':
      await handlePaymentMethodAutomaticallyUpdated(event.data.object as Stripe.PaymentMethod);
      break;

    // Charge events
    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object as Stripe.Charge);
      break;

    case 'charge.failed':
      await handleChargeFailed(event.data.object as Stripe.Charge);
      break;

    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;

    case 'charge.dispute.created':
      await handleChargeDisputeCreated(event.data.object as Stripe.Dispute);
      break;

    case 'charge.dispute.closed':
      await handleChargeDisputeClosed(event.data.object as Stripe.Dispute);
      break;

    // Customer events
    case 'customer.created':
      await handleCustomerCreated(event.data.object as Stripe.Customer);
      break;

    case 'customer.updated':
      await handleCustomerUpdated(event.data.object as Stripe.Customer);
      break;

    case 'customer.deleted':
      await handleCustomerDeleted(event.data.object as Stripe.Customer);
      break;

    // Checkout Session events
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case 'checkout.session.expired':
      await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
      break;

    default:
      logger.info(`Unhandled webhook event type: ${event.type}`, { eventId: event.id });
  }
}

// ============================================================================
// Subscription Event Handlers
// ============================================================================

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata.userId;
  if (!userId) {
    logger.warn(`Subscription ${subscription.id} has no userId in metadata`);
    return;
  }

  logger.info(`Subscription created: ${subscription.id}`, { userId });

  // Send welcome email
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user && user.email) {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Your Healthcare Subscription',
      templatePath: 'subscription-welcome.html',
      templateData: {
        name: `${user.firstName} ${user.lastName}`,
        subscriptionId: subscription.id,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toLocaleDateString() : null,
      },
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata.userId;
  if (!userId) {
    logger.warn(`Subscription ${subscription.id} has no userId in metadata`);
    return;
  }

  let status: 'active' | 'past_due' | 'cancelled' | 'expired';
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    status = 'active';
  } else if (subscription.status === 'past_due') {
    status = 'past_due';
  } else if (subscription.status === 'canceled') {
    status = 'cancelled';
  } else {
    status = 'expired';
  }

  // Cast to any to access legacy Stripe API properties that may still be present at runtime
  const subscriptionData = subscription as unknown as {
    current_period_start?: number;
    current_period_end?: number;
    cancel_at_period_end: boolean;
    items: { data: Array<{ price: { id: string } }> };
    id: string;
  };

  // Use billing_cycle_anchor as fallback if current_period fields are not available
  const periodStart = subscriptionData.current_period_start ?? subscription.billing_cycle_anchor;
  const periodEnd = subscriptionData.current_period_end ?? subscription.billing_cycle_anchor;

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status,
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    },
    create: {
      userId,
      planId: subscription.items.data[0].price.id,
      stripeSubscriptionId: subscription.id,
      status,
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  logger.info(`Subscription updated: ${subscription.id}`, { status });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'cancelled',
      updatedAt: new Date(),
    },
  });

  const userId = subscription.metadata.userId;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.email) {
      // Cast to access legacy Stripe API property that may still be present at runtime
      const subscriptionData = subscription as unknown as { current_period_end?: number };
      const periodEnd = subscriptionData.current_period_end ?? subscription.billing_cycle_anchor;

      await sendEmail({
        to: user.email,
        subject: 'Your Subscription Has Been Canceled',
        templatePath: 'subscription-canceled.html',
        templateData: {
          name: `${user.firstName} ${user.lastName}`,
          subscriptionId: subscription.id,
          endDate: new Date(periodEnd * 1000).toLocaleDateString(),
        },
      });
    }
  }

  logger.info(`Subscription deleted: ${subscription.id}`);
}

async function handleSubscriptionTrialWillEnd(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const trialEndDate = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
  const daysRemaining = trialEndDate
    ? Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

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

  // Send SMS notification if phone number available
  if (user.phone) {
    await sendSms({
      to: user.phone,
      message: `Hello ${user.firstName}, your healthcare platform trial ends in ${daysRemaining} days. Update your payment method to continue service.`,
    });
  }

  logger.info(`Trial ending notification sent for subscription: ${subscription.id}`, { daysRemaining });
}

async function handleSubscriptionPaused(subscription: Stripe.Subscription): Promise<void> {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'expired',
      updatedAt: new Date(),
    },
  });

  logger.info(`Subscription paused: ${subscription.id}`);
}

async function handleSubscriptionResumed(subscription: Stripe.Subscription): Promise<void> {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'active',
      updatedAt: new Date(),
    },
  });

  logger.info(`Subscription resumed: ${subscription.id}`);
}

// ============================================================================
// Invoice Event Handlers
// ============================================================================

async function handleInvoiceCreated(invoice: Stripe.Invoice): Promise<void> {
  logger.info(`Invoice created: ${invoice.id}`);
}

async function handleInvoiceFinalized(invoice: Stripe.Invoice): Promise<void> {
  logger.info(`Invoice finalized: ${invoice.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  logger.info(`Invoice payment succeeded: ${invoice.id}`);

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

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  logger.warn(`Invoice payment failed: ${invoice.id}`);

  // Access subscription from parent.subscription_details in newer Stripe API
  const subscriptionDetails = invoice.parent?.subscription_details;
  if (subscriptionDetails?.subscription) {
    const subscriptionId = typeof subscriptionDetails.subscription === 'string'
      ? subscriptionDetails.subscription
      : subscriptionDetails.subscription.id;

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'past_due',
        updatedAt: new Date(),
      },
    });
  }

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

async function handleInvoiceUpcoming(invoice: Stripe.Invoice): Promise<void> {
  logger.info(`Upcoming invoice: ${invoice.id}`);

  if (invoice.customer_email) {
    await sendEmail({
      to: invoice.customer_email,
      subject: 'Upcoming Payment Notification',
      templatePath: 'upcoming-invoice.html',
      templateData: {
        amountDue: (invoice.amount_due / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString() : null,
      },
    });
  }
}

async function handleInvoiceVoided(invoice: Stripe.Invoice): Promise<void> {
  logger.info(`Invoice voided: ${invoice.id}`);
}

// ============================================================================
// Payment Intent Event Handlers
// ============================================================================

async function handlePaymentIntentCreated(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  logger.info(`Payment intent created: ${paymentIntent.id}`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  logger.info(`Payment intent succeeded: ${paymentIntent.id}`);

  const userId = paymentIntent.metadata.userId;
  if (!userId) return;

  // Update payment record in database
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'succeeded',
      updatedAt: new Date(),
    },
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  logger.error(`Payment intent failed: ${paymentIntent.id}`, {
    failureCode: paymentIntent.last_payment_error?.code,
    failureMessage: paymentIntent.last_payment_error?.message,
  });

  const userId = paymentIntent.metadata.userId;
  if (!userId) return;

  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'failed',
      failedReason: paymentIntent.last_payment_error?.message,
      updatedAt: new Date(),
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user && user.email) {
    await sendEmail({
      to: user.email,
      subject: 'Payment Failed',
      templatePath: 'payment-intent-failed.html',
      templateData: {
        name: `${user.firstName} ${user.lastName}`,
        amount: (paymentIntent.amount / 100).toFixed(2),
        currency: paymentIntent.currency.toUpperCase(),
        failureReason: paymentIntent.last_payment_error?.message,
      },
    });
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  logger.info(`Payment intent canceled: ${paymentIntent.id}`);

  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'cancelled',
      updatedAt: new Date(),
    },
  });
}

async function handlePaymentIntentProcessing(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  logger.info(`Payment intent processing: ${paymentIntent.id}`);

  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'processing',
      updatedAt: new Date(),
    },
  });
}

async function handlePaymentIntentRequiresAction(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  logger.info(`Payment intent requires action: ${paymentIntent.id}`);
}

// ============================================================================
// Payment Method Event Handlers
// ============================================================================

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod): Promise<void> {
  logger.info(`Payment method attached: ${paymentMethod.id}`);
}

async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod): Promise<void> {
  logger.info(`Payment method detached: ${paymentMethod.id}`);
}

async function handlePaymentMethodUpdated(paymentMethod: Stripe.PaymentMethod): Promise<void> {
  logger.info(`Payment method updated: ${paymentMethod.id}`);
}

async function handlePaymentMethodAutomaticallyUpdated(paymentMethod: Stripe.PaymentMethod): Promise<void> {
  logger.info(`Payment method automatically updated: ${paymentMethod.id}`);

  // Notify customer about automatic card update
  if (paymentMethod.customer && typeof paymentMethod.customer === 'string') {
    // You might want to look up the user and send them a notification
    logger.info('Payment method was automatically updated (e.g., new card issued by bank)');
  }
}

// ============================================================================
// Charge Event Handlers
// ============================================================================

async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  logger.info(`Charge succeeded: ${charge.id}`);
}

async function handleChargeFailed(charge: Stripe.Charge): Promise<void> {
  logger.error(`Charge failed: ${charge.id}`, {
    failureCode: charge.failure_code,
    failureMessage: charge.failure_message,
  });
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  logger.info(`Charge refunded: ${charge.id}`, {
    amountRefunded: charge.amount_refunded / 100,
  });

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

async function handleChargeDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
  logger.warn(`Charge dispute created: ${dispute.id}`, {
    chargeId: dispute.charge,
    amount: dispute.amount / 100,
    reason: dispute.reason,
  });

  // Alert admin team about dispute
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

async function handleChargeDisputeClosed(dispute: Stripe.Dispute): Promise<void> {
  logger.info(`Charge dispute closed: ${dispute.id}`, {
    status: dispute.status,
  });
}

// ============================================================================
// Customer Event Handlers
// ============================================================================

async function handleCustomerCreated(customer: Stripe.Customer): Promise<void> {
  logger.info(`Customer created: ${customer.id}`);
}

async function handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
  logger.info(`Customer updated: ${customer.id}`);
}

async function handleCustomerDeleted(customer: Stripe.Customer): Promise<void> {
  logger.info(`Customer deleted: ${customer.id}`);
}

// ============================================================================
// Checkout Session Event Handlers
// ============================================================================

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  logger.info(`Checkout session completed: ${session.id}`);

  if (session.customer_email) {
    await sendEmail({
      to: session.customer_email,
      subject: 'Purchase Confirmation',
      templatePath: 'checkout-completed.html',
      templateData: {
        sessionId: session.id,
        amountTotal: session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00',
        currency: session.currency?.toUpperCase(),
      },
    });
  }
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session): Promise<void> {
  logger.info(`Checkout session expired: ${session.id}`);
}

// ============================================================================
// Helper Functions
// ============================================================================

async function logWebhookEvent(event: Stripe.Event): Promise<WebhookEventLog> {
  try {
    // In a real implementation, you would save this to a database
    // For now, we'll just log it
    const eventLog: WebhookEventLog = {
      id: event.id,
      eventType: event.type,
      eventId: event.id,
      status: 'pending',
      payload: event,
      retryCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.info('Webhook event logged', {
      eventId: event.id,
      eventType: event.type
    });

    return eventLog;
  } catch (error) {
    logger.error('Failed to log webhook event', { error });
    throw error;
  }
}

async function updateEventLog(
  eventId: string,
  updates: Partial<WebhookEventLog>
): Promise<void> {
  try {
    // In a real implementation, you would update this in a database
    logger.info('Webhook event log updated', { eventId, updates });
  } catch (error) {
    logger.error('Failed to update webhook event log', { error });
    throw error;
  }
}
