import Stripe from 'stripe';
import { PrismaClient } from '../generated/client';
import { v4 as uuidv4 } from 'uuid';
import {
  stripe,
  createStripeCustomer,
  getStripeCustomer,
  createSetupIntent,
  attachPaymentMethod,
  setDefaultPaymentMethod,
  createStripeSubscription,
  updateStripeSubscription,
  cancelStripeSubscription,
  getStripeSubscription,
  listCustomerInvoices,
  getStripeInvoice,
  listCustomerPaymentMethods,
  detachPaymentMethod,
  constructWebhookEvent,
  createPaymentIntent,
  getPaymentIntent,
  createRefund,
  listCustomerCharges,
} from '../lib/stripe.js';
import { logger } from '../utils/logger.js';
import { auditService } from './audit.service.js';
import {
  CreateSubscriptionDto,
  UpdatePaymentMethodDto,
  CancelSubscriptionDto,
  CreateChargeDto,
  CreateRefundDto,
  SavePaymentMethodDto,
} from '../dtos/payment.dto.js';

const prisma = new PrismaClient();

/**
 * Payment Error Types for proper error categorization
 */
export class PaymentError extends Error {
  public readonly code: string;
  public readonly isRetryable: boolean;
  public readonly statusCode: number;

  constructor(message: string, code: string, isRetryable: boolean = false, statusCode: number = 500) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
  }
}

export class PaymentValidationError extends PaymentError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', false, 400);
    this.name = 'PaymentValidationError';
  }
}

export class PaymentNotFoundError extends PaymentError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', false, 404);
    this.name = 'PaymentNotFoundError';
  }
}

export class PaymentProcessingError extends PaymentError {
  constructor(message: string, isRetryable: boolean = true) {
    super(message, 'PROCESSING_ERROR', isRetryable, 502);
    this.name = 'PaymentProcessingError';
  }
}

/**
 * Generate idempotency key for Stripe operations
 */
function generateIdempotencyKey(prefix: string, ...parts: string[]): string {
  return `${prefix}_${parts.join('_')}_${Date.now()}`;
}

/**
 * Retry configuration for database operations
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
};

/**
 * Retry a database operation with exponential backoff
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = Math.min(
          Math.pow(2, attempt) * RETRY_CONFIG.baseDelayMs,
          RETRY_CONFIG.maxDelayMs
        );
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

  logger.error(`${operationName} failed after all retries`, { error: lastError });
  throw lastError || new Error(`${operationName} failed`);
}

interface CustomerMetadata {
  userId: string;
  email: string;
  name: string;
}

export class PaymentService {
  /**
   * Create or retrieve Stripe customer for user
   */
  async createCustomer(params: {
    userId: string;
    email: string;
    name: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    try {
      const { userId, email, name, metadata } = params;

      // Check if user already has a Stripe customer
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // If user already has a stripe customer ID, retrieve it
      // Note: You'll need to add stripeCustomerId field to User model
      // For now, we'll search by metadata
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        logger.info(`Stripe customer already exists: ${existingCustomers.data[0].id}`);
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await createStripeCustomer({
        email,
        name,
        metadata: {
          userId,
          ...metadata,
        },
      });

      logger.info(`Created Stripe customer ${customer.id} for user ${userId}`);
      return customer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Create a subscription for a user with idempotency and audit logging
   */
  async createSubscription(
    userId: string,
    data: CreateSubscriptionDto,
    requestContext?: { ipAddress?: string; userAgent?: string }
  ): Promise<{
    subscription: Stripe.Subscription;
    clientSecret: string | null;
  }> {
    const operationId = uuidv4();
    const startTime = Date.now();

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new PaymentNotFoundError('User not found');
      }

      // Get or create Stripe customer
      const customer = await this.createCustomer({
        userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      // If payment method is provided, attach it to customer with idempotency
      if (data.paymentMethodId) {
        const attachIdempotencyKey = generateIdempotencyKey('attach_pm', userId, data.paymentMethodId);
        await stripe.paymentMethods.attach(
          data.paymentMethodId,
          { customer: customer.id },
          { idempotencyKey: attachIdempotencyKey }
        );
        await setDefaultPaymentMethod(customer.id, data.paymentMethodId);
      }

      // Generate idempotency key for subscription creation
      const subscriptionIdempotencyKey = generateIdempotencyKey('subscription', userId, data.priceId);

      // Create subscription with idempotency key
      const subscription = await stripe.subscriptions.create(
        {
          customer: customer.id,
          items: [{ price: data.priceId }],
          metadata: {
            userId,
            operationId,
            ...data.metadata,
          },
          trial_period_days: data.trialPeriodDays,
          payment_behavior: 'default_incomplete',
          payment_settings: {
            payment_method_types: ['card'],
            save_default_payment_method: 'on_subscription',
          },
          expand: ['latest_invoice.payment_intent', 'customer'],
        },
        {
          idempotencyKey: subscriptionIdempotencyKey,
        }
      );

      // Get the plan details
      const plan = await prisma.plan.findUnique({
        where: { id: data.priceId },
      });

      if (!plan) {
        throw new PaymentNotFoundError('Plan not found');
      }

      // Save subscription to database with retry logic
      const dbSubscription = await retryOperation(
        async () => prisma.subscription.create({
          data: {
            userId,
            planId: plan.id,
            stripeSubscriptionId: subscription.id,
            status:
              subscription.status === 'active' || subscription.status === 'trialing'
                ? 'active'
                : 'past_due',
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        }),
        'Create subscription record'
      );

      // Extract client secret for payment confirmation
      let clientSecret: string | null = null;
      if (subscription.latest_invoice) {
        const invoice =
          typeof subscription.latest_invoice === 'string'
            ? await getStripeInvoice(subscription.latest_invoice)
            : subscription.latest_invoice;

        if ((invoice as any).payment_intent) {
          const paymentIntent =
            typeof (invoice as any).payment_intent === 'string'
              ? (invoice as any).payment_intent
              : (invoice as any).payment_intent.client_secret;
          clientSecret = paymentIntent || null;
        }
      }

      // Log audit event for subscription creation
      await auditService.logEvent({
        userId,
        action: 'SUBSCRIPTION_CREATED',
        resource: 'subscription',
        resourceId: dbSubscription.id,
        details: {
          operationId,
          stripeSubscriptionId: subscription.id,
          planId: plan.id,
          planName: plan.name,
          status: subscription.status,
          trialPeriodDays: data.trialPeriodDays,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      });

      logger.info(`Created subscription ${subscription.id} for user ${userId}`, {
        operationId,
        idempotencyKey: subscriptionIdempotencyKey,
        processingTimeMs: Date.now() - startTime,
      });

      return {
        subscription,
        clientSecret,
      };
    } catch (error: any) {
      // Log failed subscription creation for audit
      await auditService.logEvent({
        userId,
        action: 'SUBSCRIPTION_CREATION_FAILED',
        resource: 'subscription',
        details: {
          operationId,
          priceId: data.priceId,
          error: error.message,
          errorCode: error.code,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      }).catch((auditError) => {
        logger.error('Failed to log audit event for failed subscription creation', { auditError });
      });

      logger.error('Error creating subscription:', { error, operationId });

      // Categorize and rethrow with proper error type
      if (error instanceof PaymentError) {
        throw error;
      }
      if (error.type === 'StripeCardError') {
        throw new PaymentProcessingError(error.message, false);
      }
      if (error.type === 'StripeInvalidRequestError') {
        throw new PaymentValidationError(error.message);
      }
      throw new PaymentProcessingError(error.message, true);
    }
  }

  /**
   * Cancel a subscription with audit logging
   */
  async cancelSubscription(
    userId: string,
    data: CancelSubscriptionDto,
    requestContext?: { ipAddress?: string; userAgent?: string }
  ): Promise<Stripe.Subscription> {
    const operationId = uuidv4();
    const startTime = Date.now();

    try {
      // Verify subscription belongs to user
      const dbSubscription = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: data.subscriptionId,
          userId,
        },
      });

      if (!dbSubscription) {
        throw new PaymentNotFoundError('Subscription not found or does not belong to user');
      }

      // Cancel in Stripe
      const subscription = await cancelStripeSubscription(
        data.subscriptionId,
        data.cancelAtPeriodEnd
      );

      // Update database with retry logic
      await retryOperation(
        async () => prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: {
            status: data.cancelAtPeriodEnd ? 'active' : 'cancelled',
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
            updatedAt: new Date(),
          },
        }),
        'Update subscription for cancellation'
      );

      // Log audit event for subscription cancellation
      await auditService.logEvent({
        userId,
        action: data.cancelAtPeriodEnd ? 'SUBSCRIPTION_CANCEL_SCHEDULED' : 'SUBSCRIPTION_CANCELLED',
        resource: 'subscription',
        resourceId: dbSubscription.id,
        details: {
          operationId,
          stripeSubscriptionId: data.subscriptionId,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          effectiveDate: data.cancelAtPeriodEnd
            ? new Date((subscription as any).current_period_end * 1000).toISOString()
            : new Date().toISOString(),
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      });

      logger.info(`Cancelled subscription ${data.subscriptionId} for user ${userId}`, {
        operationId,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        processingTimeMs: Date.now() - startTime,
      });

      return subscription;
    } catch (error: any) {
      // Log failed cancellation for audit
      await auditService.logEvent({
        userId,
        action: 'SUBSCRIPTION_CANCELLATION_FAILED',
        resource: 'subscription',
        details: {
          operationId,
          stripeSubscriptionId: data.subscriptionId,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          error: error.message,
          errorCode: error.code,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      }).catch((auditError) => {
        logger.error('Failed to log audit event for failed cancellation', { auditError });
      });

      logger.error('Error cancelling subscription:', { error, operationId });

      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentProcessingError(error.message, true);
    }
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(
    userId: string,
    data: UpdatePaymentMethodDto
  ): Promise<Stripe.PaymentMethod> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get or create customer
      const customer = await this.createCustomer({
        userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      // Attach payment method
      const paymentMethod = await attachPaymentMethod(
        data.paymentMethodId,
        customer.id
      );

      // Set as default if requested
      if (data.setAsDefault) {
        await setDefaultPaymentMethod(customer.id, data.paymentMethodId);
      }

      logger.info(`Updated payment method for user ${userId}`);

      return paymentMethod;
    } catch (error) {
      logger.error('Error updating payment method:', error);
      throw error;
    }
  }

  /**
   * Get customer invoices
   */
  async getInvoices(
    userId: string,
    limit: number = 10
  ): Promise<Stripe.Invoice[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Find customer
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return [];
      }

      const customerId = customers.data[0].id;
      const invoices = await listCustomerInvoices(customerId, limit);

      return invoices;
    } catch (error) {
      logger.error('Error getting invoices:', error);
      throw error;
    }
  }

  /**
   * Create setup intent for saving payment method
   */
  async createSetupIntent(
    userId: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.SetupIntent> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get or create customer
      const customer = await this.createCustomer({
        userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      const setupIntent = await createSetupIntent(customer.id, {
        userId,
        ...metadata,
      });

      logger.info(`Created setup intent for user ${userId}`);

      return setupIntent;
    } catch (error) {
      logger.error('Error creating setup intent:', error);
      throw error;
    }
  }

  /**
   * Get user's current subscription
   */
  async getCurrentSubscription(userId: string): Promise<{
    dbSubscription: any;
    stripeSubscription: Stripe.Subscription | null;
  } | null> {
    try {
      const dbSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ['active', 'past_due'] },
        },
        include: {
          plan: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!dbSubscription || !dbSubscription.stripeSubscriptionId) {
        return null;
      }

      const stripeSubscription = await getStripeSubscription(
        dbSubscription.stripeSubscriptionId
      );

      return {
        dbSubscription,
        stripeSubscription,
      };
    } catch (error) {
      logger.error('Error getting current subscription:', error);
      throw error;
    }
  }

  /**
   * Get customer payment methods
   */
  async getPaymentMethods(userId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Find customer
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return [];
      }

      const customerId = customers.data[0].id;
      const paymentMethods = await listCustomerPaymentMethods(customerId);

      return paymentMethods;
    } catch (error) {
      logger.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Remove payment method
   */
  async removePaymentMethod(
    userId: string,
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      // Verify payment method belongs to user
      const paymentMethods = await this.getPaymentMethods(userId);
      const exists = paymentMethods.find((pm) => pm.id === paymentMethodId);

      if (!exists) {
        throw new Error('Payment method not found or does not belong to user');
      }

      const paymentMethod = await detachPaymentMethod(paymentMethodId);

      logger.info(`Removed payment method ${paymentMethodId} for user ${userId}`);

      return paymentMethod;
    } catch (error) {
      logger.error('Error removing payment method:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<void> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
      }

      const event = constructWebhookEvent(payload, signature, webhookSecret);

      logger.info(`Processing webhook event: ${event.type}`);

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object as Stripe.Subscription);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_method.attached':
          await this.handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
          break;

        case 'charge.refunded':
          await this.handleChargeRefunded(event.data.object as Stripe.Charge);
          break;

        default:
          logger.info(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      logger.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Handle subscription update webhook
   */
  private async handleSubscriptionUpdate(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      const userId = subscription.metadata.userId;
      if (!userId) {
        logger.warn(`Subscription ${subscription.id} has no userId in metadata`);
        return;
      }

      // Map Stripe status to our status
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

      // Update or create subscription in database
      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId: subscription.id,
        },
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

      logger.info(`Updated subscription ${subscription.id} in database`);
    } catch (error) {
      logger.error('Error handling subscription update:', error);
      throw error;
    }
  }

  /**
   * Handle subscription deleted webhook
   */
  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: 'cancelled',
          updatedAt: new Date(),
        },
      });

      logger.info(`Marked subscription ${subscription.id} as cancelled`);
    } catch (error) {
      logger.error('Error handling subscription deletion:', error);
      throw error;
    }
  }

  /**
   * Handle successful invoice payment
   */
  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice
  ): Promise<void> {
    try {
      logger.info(`Invoice ${invoice.id} payment succeeded`);
      // You can add custom logic here, such as sending receipt emails
    } catch (error) {
      logger.error('Error handling invoice payment succeeded:', error);
      throw error;
    }
  }

  /**
   * Handle failed invoice payment
   */
  private async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice
  ): Promise<void> {
    try {
      logger.warn(`Invoice ${invoice.id} payment failed`);
      // You can add custom logic here, such as sending payment failure notifications

      if ((invoice as any).subscription) {
        const subscriptionId = typeof (invoice as any).subscription === 'string'
          ? (invoice as any).subscription
          : (invoice as any).subscription.id;

        await prisma.subscription.updateMany({
          where: {
            stripeSubscriptionId: subscriptionId,
          },
          data: {
            status: 'past_due',
            updatedAt: new Date(),
          },
        });
      }
    } catch (error) {
      logger.error('Error handling invoice payment failed:', error);
      throw error;
    }
  }

  /**
   * Handle trial ending soon
   */
  private async handleTrialWillEnd(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      logger.info(`Trial ending soon for subscription ${subscription.id}`);
      // You can add custom logic here, such as sending trial ending notifications
    } catch (error) {
      logger.error('Error handling trial will end:', error);
      throw error;
    }
  }

  /**
   * Create a one-time charge with idempotency and audit logging
   */
  async createCharge(
    userId: string,
    data: CreateChargeDto,
    requestContext?: { ipAddress?: string; userAgent?: string }
  ): Promise<{
    payment: any;
    clientSecret: string | null;
  }> {
    const operationId = uuidv4();
    const startTime = Date.now();

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new PaymentNotFoundError('User not found');
      }

      // Get or create Stripe customer
      const customer = await this.createCustomer({
        userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      // Generate idempotency key for this charge operation
      const idempotencyKey = generateIdempotencyKey('charge', userId, data.amount.toString(), data.currency);

      // Create payment intent with idempotency key
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: data.amount,
          currency: data.currency,
          customer: customer.id,
          payment_method: data.paymentMethodId,
          description: data.description,
          metadata: {
            userId,
            operationId,
            ...data.metadata,
          },
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          confirm: data.confirmImmediately && data.paymentMethodId ? true : undefined,
        },
        {
          idempotencyKey,
        }
      );

      // Save payment to database with retry logic
      const payment = await retryOperation(
        async () => prisma.payment.create({
          data: {
            userId,
            stripePaymentIntentId: paymentIntent.id,
            amount: data.amount / 100, // Convert from cents to dollars
            currency: data.currency.toUpperCase(),
            status: this.mapStripePaymentStatus(paymentIntent.status),
            description: data.description,
            metadata: { ...data.metadata, operationId, idempotencyKey } as any,
          },
        }),
        'Create payment record'
      );

      // Log audit event for the charge
      await auditService.logEvent({
        userId,
        action: 'PAYMENT_CHARGE_CREATED',
        resource: 'payment',
        resourceId: payment.id,
        details: {
          operationId,
          stripePaymentIntentId: paymentIntent.id,
          amount: data.amount / 100,
          currency: data.currency.toUpperCase(),
          status: payment.status,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      });

      logger.info(`Created charge ${paymentIntent.id} for user ${userId}`, {
        operationId,
        idempotencyKey,
        processingTimeMs: Date.now() - startTime,
      });

      return {
        payment,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error: any) {
      // Log failed charge attempt for audit
      await auditService.logEvent({
        userId,
        action: 'PAYMENT_CHARGE_FAILED',
        resource: 'payment',
        details: {
          operationId,
          amount: data.amount / 100,
          currency: data.currency,
          error: error.message,
          errorCode: error.code,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      }).catch((auditError) => {
        logger.error('Failed to log audit event for failed charge', { auditError });
      });

      logger.error('Error creating charge:', { error, operationId });

      // Categorize and rethrow with proper error type
      if (error instanceof PaymentError) {
        throw error;
      }
      if (error.type === 'StripeCardError') {
        throw new PaymentProcessingError(error.message, false);
      }
      if (error.type === 'StripeInvalidRequestError') {
        throw new PaymentValidationError(error.message);
      }
      throw new PaymentProcessingError(error.message, true);
    }
  }

  /**
   * Get payment details
   */
  async getPayment(userId: string, paymentId: string): Promise<any> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          paymentMethod: true,
        },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify payment belongs to user
      if (payment.userId !== userId) {
        throw new Error('Payment not found or does not belong to user');
      }

      // Get latest data from Stripe if available
      let stripePaymentIntent = null;
      if (payment.stripePaymentIntentId) {
        try {
          stripePaymentIntent = await getPaymentIntent(payment.stripePaymentIntentId);

          // Update payment status if changed
          const newStatus = this.mapStripePaymentStatus(stripePaymentIntent.status);
          if (newStatus !== payment.status) {
            await prisma.payment.update({
              where: { id: paymentId },
              data: { status: newStatus },
            });
            payment.status = newStatus;
          }
        } catch (error) {
          logger.warn(`Could not retrieve payment intent ${payment.stripePaymentIntentId}:`, error);
        }
      }

      return {
        ...payment,
        stripePaymentIntent,
      };
    } catch (error) {
      logger.error('Error getting payment:', error);
      throw error;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(
    userId: string,
    filters?: {
      limit?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<any[]> {
    try {
      const where: any = { userId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.createdAt.lte = new Date(filters.endDate);
        }
      }

      const payments = await prisma.payment.findMany({
        where,
        include: {
          paymentMethod: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: filters?.limit || 20,
      });

      return payments;
    } catch (error) {
      logger.error('Error getting payment history:', error);
      throw error;
    }
  }

  /**
   * Refund a payment with idempotency and audit logging
   */
  async refundPayment(
    userId: string,
    paymentId: string,
    data: CreateRefundDto,
    requestContext?: { ipAddress?: string; userAgent?: string }
  ): Promise<any> {
    const operationId = uuidv4();
    const startTime = Date.now();

    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new PaymentNotFoundError('Payment not found');
      }

      // Verify payment belongs to user
      if (payment.userId !== userId) {
        throw new PaymentNotFoundError('Payment not found or does not belong to user');
      }

      // Verify payment can be refunded
      if (payment.status !== 'succeeded') {
        throw new PaymentValidationError('Only succeeded payments can be refunded');
      }

      if (!payment.stripePaymentIntentId) {
        throw new PaymentValidationError('Payment does not have a Stripe payment intent');
      }

      // Generate idempotency key for refund operation
      const idempotencyKey = generateIdempotencyKey(
        'refund',
        paymentId,
        (data.amount || 'full').toString()
      );

      // Create refund in Stripe with idempotency key
      const refund = await stripe.refunds.create(
        {
          payment_intent: payment.stripePaymentIntentId,
          amount: data.amount,
          reason: data.reason,
          metadata: {
            userId,
            paymentId,
            operationId,
            ...data.metadata,
          },
        },
        {
          idempotencyKey,
        }
      );

      // Update payment in database with retry logic
      const isFullRefund = !data.amount || data.amount === Number(payment.amount) * 100;
      const updatedPayment = await retryOperation(
        async () => prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: isFullRefund ? 'refunded' : 'partially_refunded',
            refundedAmount: refund.amount / 100,
            refundedAt: new Date(),
          },
        }),
        'Update payment for refund'
      );

      // Log audit event for the refund
      await auditService.logEvent({
        userId,
        action: 'PAYMENT_REFUND_CREATED',
        resource: 'payment',
        resourceId: paymentId,
        details: {
          operationId,
          stripeRefundId: refund.id,
          stripePaymentIntentId: payment.stripePaymentIntentId,
          originalAmount: Number(payment.amount),
          refundAmount: refund.amount / 100,
          isFullRefund,
          reason: data.reason,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      });

      logger.info(`Refunded payment ${paymentId} for user ${userId}`, {
        operationId,
        idempotencyKey,
        refundId: refund.id,
        processingTimeMs: Date.now() - startTime,
      });

      return {
        payment: updatedPayment,
        refund,
      };
    } catch (error: any) {
      // Log failed refund attempt for audit
      await auditService.logEvent({
        userId,
        action: 'PAYMENT_REFUND_FAILED',
        resource: 'payment',
        resourceId: paymentId,
        details: {
          operationId,
          amount: data.amount,
          reason: data.reason,
          error: error.message,
          errorCode: error.code,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      }).catch((auditError) => {
        logger.error('Failed to log audit event for failed refund', { auditError });
      });

      logger.error('Error refunding payment:', { error, operationId });

      // Categorize and rethrow with proper error type
      if (error instanceof PaymentError) {
        throw error;
      }
      if (error.type === 'StripeInvalidRequestError') {
        throw new PaymentValidationError(error.message);
      }
      throw new PaymentProcessingError(error.message, true);
    }
  }

  /**
   * Save a payment method
   */
  async savePaymentMethod(
    userId: string,
    data: SavePaymentMethodDto
  ): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get or create customer
      const customer = await this.createCustomer({
        userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      // Attach payment method to customer
      const paymentMethod = await attachPaymentMethod(
        data.paymentMethodId,
        customer.id
      );

      // If setting as default, unset other defaults first
      if (data.setAsDefault) {
        await prisma.paymentMethod.updateMany({
          where: {
            userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });

        await setDefaultPaymentMethod(customer.id, data.paymentMethodId);
      }

      // Save to database
      const savedPaymentMethod = await prisma.paymentMethod.create({
        data: {
          userId,
          stripePaymentMethodId: paymentMethod.id,
          type: paymentMethod.type as any,
          last4: paymentMethod.card?.last4 || '',
          brand: paymentMethod.card?.brand,
          expiryMonth: paymentMethod.card?.exp_month,
          expiryYear: paymentMethod.card?.exp_year,
          isDefault: data.setAsDefault,
          billingAddress: data.billingAddress as any,
        },
      });

      logger.info(`Saved payment method ${paymentMethod.id} for user ${userId}`);

      return savedPaymentMethod;
    } catch (error) {
      logger.error('Error saving payment method:', error);
      throw error;
    }
  }

  /**
   * Map Stripe payment status to our status
   */
  private mapStripePaymentStatus(
    stripeStatus: string
  ): 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded' {
    switch (stripeStatus) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'succeeded':
        return 'succeeded';
      case 'canceled':
        return 'cancelled';
      default:
        return 'failed';
    }
  }

  /**
   * Handle payment intent succeeded webhook
   */
  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
      await prisma.payment.updateMany({
        where: {
          stripePaymentIntentId: paymentIntent.id,
        },
        data: {
          status: 'succeeded',
          updatedAt: new Date(),
        },
      });

      logger.info(`Payment intent ${paymentIntent.id} succeeded`);
    } catch (error) {
      logger.error('Error handling payment intent succeeded:', error);
      throw error;
    }
  }

  /**
   * Handle payment intent failed webhook
   */
  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
      await prisma.payment.updateMany({
        where: {
          stripePaymentIntentId: paymentIntent.id,
        },
        data: {
          status: 'failed',
          failedReason: paymentIntent.last_payment_error?.message,
          updatedAt: new Date(),
        },
      });

      logger.warn(`Payment intent ${paymentIntent.id} failed`);
    } catch (error) {
      logger.error('Error handling payment intent failed:', error);
      throw error;
    }
  }

  /**
   * Handle payment method attached webhook
   */
  private async handlePaymentMethodAttached(
    paymentMethod: Stripe.PaymentMethod
  ): Promise<void> {
    try {
      logger.info(`Payment method ${paymentMethod.id} attached`);
      // Custom logic can be added here
    } catch (error) {
      logger.error('Error handling payment method attached:', error);
      throw error;
    }
  }

  /**
   * Handle charge refunded webhook
   */
  private async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    try {
      // Find payment by charge ID or payment intent ID
      const payment = await prisma.payment.findFirst({
        where: {
          stripePaymentIntentId: typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id,
        },
      });

      if (payment) {
        const refundedAmount = charge.amount_refunded / 100;
        const isFullyRefunded = charge.amount_refunded === charge.amount;

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: isFullyRefunded ? 'refunded' : 'partially_refunded',
            refundedAmount,
            refundedAt: new Date(),
          },
        });

        logger.info(`Charge ${charge.id} refunded`);
      }
    } catch (error) {
      logger.error('Error handling charge refunded:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
