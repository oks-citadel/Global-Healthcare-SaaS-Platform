/**
 * Billing Service
 *
 * Comprehensive billing service for healthcare platform with:
 * - Idempotency keys for all Stripe operations
 * - Proper error handling and retry logic
 * - Audit trail for all financial operations
 * - Transaction logging for compliance
 */

import Stripe from 'stripe';
import { PrismaClient } from '../generated/client';
import { v4 as uuidv4 } from 'uuid';
import { stripe } from '../lib/stripe.js';
import { logger } from '../utils/logger.js';
import { auditService } from './audit.service.js';

const prisma = new PrismaClient();

/**
 * Billing Error Types
 */
export class BillingError extends Error {
  public readonly code: string;
  public readonly isRetryable: boolean;
  public readonly statusCode: number;

  constructor(message: string, code: string, isRetryable: boolean = false, statusCode: number = 500) {
    super(message);
    this.name = 'BillingError';
    this.code = code;
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
  }
}

export class BillingValidationError extends BillingError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', false, 400);
    this.name = 'BillingValidationError';
  }
}

export class BillingNotFoundError extends BillingError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', false, 404);
    this.name = 'BillingNotFoundError';
  }
}

export class BillingProcessingError extends BillingError {
  constructor(message: string, isRetryable: boolean = true) {
    super(message, 'PROCESSING_ERROR', isRetryable, 502);
    this.name = 'BillingProcessingError';
  }
}

/**
 * Transaction types for audit logging
 */
export enum TransactionType {
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
  SUBSCRIPTION_CREATE = 'SUBSCRIPTION_CREATE',
  SUBSCRIPTION_UPDATE = 'SUBSCRIPTION_UPDATE',
  SUBSCRIPTION_CANCEL = 'SUBSCRIPTION_CANCEL',
  PAYMENT_METHOD_ADD = 'PAYMENT_METHOD_ADD',
  PAYMENT_METHOD_REMOVE = 'PAYMENT_METHOD_REMOVE',
  INVOICE_PAID = 'INVOICE_PAID',
  INVOICE_FAILED = 'INVOICE_FAILED',
}

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
};

/**
 * Generate idempotency key for Stripe operations
 */
function generateIdempotencyKey(prefix: string, ...parts: string[]): string {
  return `${prefix}_${parts.join('_')}_${Date.now()}`;
}

/**
 * Retry operation with exponential backoff
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

  throw lastError || new Error(`${operationName} failed`);
}

/**
 * Request context for audit logging
 */
interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Transaction log entry
 */
interface TransactionLogEntry {
  id: string;
  userId: string;
  transactionType: TransactionType;
  stripeId?: string;
  amount?: number;
  currency?: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  idempotencyKey?: string;
  metadata?: Record<string, any>;
  error?: string;
  processingTimeMs?: number;
  createdAt: Date;
}

export class BillingService {
  /**
   * Log a transaction for audit trail
   */
  private async logTransaction(
    entry: Omit<TransactionLogEntry, 'id' | 'createdAt'>
  ): Promise<void> {
    try {
      await prisma.billingTransactionLog.create({
        data: {
          userId: entry.userId,
          transactionType: entry.transactionType,
          stripeId: entry.stripeId,
          amount: entry.amount,
          currency: entry.currency,
          status: entry.status,
          idempotencyKey: entry.idempotencyKey,
          metadata: entry.metadata as any,
          error: entry.error,
          processingTimeMs: entry.processingTimeMs,
        },
      });
    } catch (error) {
      // Log but don't fail the operation
      logger.error('Failed to log transaction', { error, entry });
    }
  }

  /**
   * Create a charge with full idempotency and audit logging
   */
  async createCharge(
    userId: string,
    params: {
      amount: number;
      currency: string;
      paymentMethodId?: string;
      description?: string;
      metadata?: Record<string, string>;
      confirmImmediately?: boolean;
    },
    requestContext?: RequestContext
  ): Promise<{
    paymentIntent: Stripe.PaymentIntent;
    payment: any;
  }> {
    const operationId = uuidv4();
    const startTime = Date.now();
    const idempotencyKey = generateIdempotencyKey('charge', userId, params.amount.toString());

    // Log transaction start
    await this.logTransaction({
      userId,
      transactionType: TransactionType.CHARGE,
      amount: params.amount / 100,
      currency: params.currency,
      status: 'processing',
      idempotencyKey,
      metadata: { operationId },
    });

    try {
      // Validate user exists
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new BillingNotFoundError('User not found');
      }

      // Get or create Stripe customer
      let customerId: string;
      const existingCustomers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create(
          {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            metadata: { userId },
          },
          { idempotencyKey: generateIdempotencyKey('customer', userId) }
        );
        customerId = customer.id;
      }

      // Create payment intent with idempotency
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: params.amount,
          currency: params.currency,
          customer: customerId,
          payment_method: params.paymentMethodId,
          description: params.description,
          metadata: {
            userId,
            operationId,
            ...params.metadata,
          },
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          confirm: params.confirmImmediately && params.paymentMethodId ? true : undefined,
        },
        { idempotencyKey }
      );

      // Save payment to database
      const payment = await retryOperation(
        async () => prisma.payment.create({
          data: {
            userId,
            stripePaymentIntentId: paymentIntent.id,
            amount: params.amount / 100,
            currency: params.currency.toUpperCase(),
            status: this.mapPaymentStatus(paymentIntent.status),
            description: params.description,
            metadata: { operationId, idempotencyKey, ...params.metadata } as any,
          },
        }),
        'Create payment record'
      );

      // Log successful transaction
      await this.logTransaction({
        userId,
        transactionType: TransactionType.CHARGE,
        stripeId: paymentIntent.id,
        amount: params.amount / 100,
        currency: params.currency,
        status: 'succeeded',
        idempotencyKey,
        metadata: { operationId, paymentId: payment.id },
        processingTimeMs: Date.now() - startTime,
      });

      // Audit log
      await auditService.logEvent({
        userId,
        action: 'BILLING_CHARGE_CREATED',
        resource: 'payment',
        resourceId: payment.id,
        details: {
          operationId,
          stripePaymentIntentId: paymentIntent.id,
          amount: params.amount / 100,
          currency: params.currency,
          status: paymentIntent.status,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      });

      logger.info('Charge created successfully', {
        operationId,
        paymentIntentId: paymentIntent.id,
        amount: params.amount / 100,
        currency: params.currency,
        processingTimeMs: Date.now() - startTime,
      });

      return { paymentIntent, payment };

    } catch (error: any) {
      // Log failed transaction
      await this.logTransaction({
        userId,
        transactionType: TransactionType.CHARGE,
        amount: params.amount / 100,
        currency: params.currency,
        status: 'failed',
        idempotencyKey,
        metadata: { operationId },
        error: error.message,
        processingTimeMs: Date.now() - startTime,
      });

      // Audit log for failure
      await auditService.logEvent({
        userId,
        action: 'BILLING_CHARGE_FAILED',
        resource: 'payment',
        details: {
          operationId,
          amount: params.amount / 100,
          currency: params.currency,
          error: error.message,
          errorCode: error.code,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      }).catch(() => {});

      logger.error('Charge creation failed', {
        operationId,
        error: error.message,
        processingTimeMs: Date.now() - startTime,
      });

      // Categorize error
      if (error instanceof BillingError) throw error;
      if (error.type === 'StripeCardError') {
        throw new BillingProcessingError(error.message, false);
      }
      if (error.type === 'StripeInvalidRequestError') {
        throw new BillingValidationError(error.message);
      }
      throw new BillingProcessingError(error.message, true);
    }
  }

  /**
   * Process a refund with full idempotency and audit logging
   */
  async processRefund(
    userId: string,
    paymentId: string,
    params: {
      amount?: number;
      reason?: Stripe.RefundCreateParams.Reason;
      metadata?: Record<string, string>;
    },
    requestContext?: RequestContext
  ): Promise<{
    refund: Stripe.Refund;
    payment: any;
  }> {
    const operationId = uuidv4();
    const startTime = Date.now();
    const idempotencyKey = generateIdempotencyKey('refund', paymentId, (params.amount || 'full').toString());

    try {
      // Validate payment exists and belongs to user
      const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
      if (!payment) {
        throw new BillingNotFoundError('Payment not found');
      }
      if (payment.userId !== userId) {
        throw new BillingNotFoundError('Payment not found');
      }
      if (payment.status !== 'succeeded') {
        throw new BillingValidationError('Only succeeded payments can be refunded');
      }
      if (!payment.stripePaymentIntentId) {
        throw new BillingValidationError('Payment has no Stripe payment intent');
      }

      // Log transaction start
      await this.logTransaction({
        userId,
        transactionType: TransactionType.REFUND,
        stripeId: payment.stripePaymentIntentId,
        amount: params.amount ? params.amount / 100 : Number(payment.amount),
        currency: payment.currency,
        status: 'processing',
        idempotencyKey,
        metadata: { operationId, paymentId },
      });

      // Create refund with idempotency
      const refund = await stripe.refunds.create(
        {
          payment_intent: payment.stripePaymentIntentId,
          amount: params.amount,
          reason: params.reason,
          metadata: {
            userId,
            paymentId,
            operationId,
            ...params.metadata,
          },
        },
        { idempotencyKey }
      );

      // Update payment record
      const isFullRefund = !params.amount || params.amount === Number(payment.amount) * 100;
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

      // Log successful transaction
      await this.logTransaction({
        userId,
        transactionType: TransactionType.REFUND,
        stripeId: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: 'succeeded',
        idempotencyKey,
        metadata: { operationId, paymentId, isFullRefund },
        processingTimeMs: Date.now() - startTime,
      });

      // Audit log
      await auditService.logEvent({
        userId,
        action: 'BILLING_REFUND_PROCESSED',
        resource: 'payment',
        resourceId: paymentId,
        details: {
          operationId,
          stripeRefundId: refund.id,
          amount: refund.amount / 100,
          isFullRefund,
          reason: params.reason,
          processingTimeMs: Date.now() - startTime,
        },
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
      });

      logger.info('Refund processed successfully', {
        operationId,
        refundId: refund.id,
        amount: refund.amount / 100,
        processingTimeMs: Date.now() - startTime,
      });

      return { refund, payment: updatedPayment };

    } catch (error: any) {
      // Log failed transaction
      await this.logTransaction({
        userId,
        transactionType: TransactionType.REFUND,
        amount: params.amount ? params.amount / 100 : undefined,
        status: 'failed',
        idempotencyKey,
        metadata: { operationId, paymentId },
        error: error.message,
        processingTimeMs: Date.now() - startTime,
      });

      logger.error('Refund processing failed', {
        operationId,
        paymentId,
        error: error.message,
        processingTimeMs: Date.now() - startTime,
      });

      if (error instanceof BillingError) throw error;
      throw new BillingProcessingError(error.message, true);
    }
  }

  /**
   * Get billing summary for a user
   */
  async getBillingSummary(userId: string): Promise<{
    totalSpent: number;
    totalRefunded: number;
    activeSubscriptions: number;
    paymentMethods: number;
    recentTransactions: any[];
  }> {
    const [payments, subscriptions, paymentMethods] = await Promise.all([
      prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.subscription.findMany({
        where: { userId, status: 'active' },
      }),
      prisma.paymentMethod.findMany({
        where: { userId },
      }),
    ]);

    const totalSpent = payments
      .filter((p) => p.status === 'succeeded')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalRefunded = payments
      .filter((p) => p.refundedAmount)
      .reduce((sum, p) => sum + Number(p.refundedAmount || 0), 0);

    return {
      totalSpent,
      totalRefunded,
      activeSubscriptions: subscriptions.length,
      paymentMethods: paymentMethods.length,
      recentTransactions: payments.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status,
        description: p.description,
        createdAt: p.createdAt,
      })),
    };
  }

  /**
   * Get transaction history for audit purposes
   */
  async getTransactionHistory(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      transactionType?: TransactionType;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    transactions: any[];
    total: number;
  }> {
    const where: any = { userId };

    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = options.startDate;
      if (options.endDate) where.createdAt.lte = options.endDate;
    }

    if (options?.transactionType) {
      where.transactionType = options.transactionType;
    }

    const [transactions, total] = await Promise.all([
      prisma.billingTransactionLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.billingTransactionLog.count({ where }),
    ]);

    return { transactions, total };
  }

  /**
   * Map Stripe payment status to internal status
   */
  private mapPaymentStatus(
    stripeStatus: string
  ): 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' {
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
}

export const billingService = new BillingService();
