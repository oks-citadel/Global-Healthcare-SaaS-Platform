import { Request, Response } from 'express';
import { paymentService, PaymentError, PaymentValidationError, PaymentNotFoundError, PaymentProcessingError } from '../services/payment.service.js';
import {
  CreateSubscriptionSchema,
  UpdatePaymentMethodSchema,
  CancelSubscriptionSchema,
  CreateSetupIntentSchema,
  GetInvoicesSchema,
  CreateChargeSchema,
  CreateRefundSchema,
  GetPaymentHistorySchema,
  SavePaymentMethodSchema,
} from '../dtos/payment.dto.js';
import { logger } from '../utils/logger.js';

/**
 * User information attached to authenticated requests
 * Matches JwtPayload from auth.middleware.ts
 */
interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'patient' | 'provider' | 'admin';
  tenantId?: string;
  iat?: number;
  exp?: number;
}

/**
 * Extended request with authenticated user
 * Uses the global Express.Request augmentation from auth.middleware.ts
 */
type AuthRequest = Request;

/**
 * Request context for audit logging
 */
interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Stripe subscription period timestamps
 */
interface SubscriptionPeriod {
  current_period_start: number;
  current_period_end: number;
}

/**
 * Base error response structure
 */
interface ErrorResponse {
  error: string;
  code?: string;
  message: string;
  isRetryable?: boolean;
}

/**
 * Setup intent response
 */
interface SetupIntentResponse {
  clientSecret: string | null;
  setupIntentId: string;
}

/**
 * Subscription response structure
 */
interface SubscriptionResponse {
  subscription: {
    id: string;
    status: string;
    currentPeriodStart?: number;
    currentPeriodEnd?: number;
    cancelAtPeriodEnd: boolean;
    canceledAt?: number | null;
    trialStart?: number | null;
    trialEnd?: number | null;
    plan?: string;
  };
  clientSecret?: string | null;
  message?: string;
}

/**
 * Payment method card details
 */
interface CardDetails {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

/**
 * Payment method response structure
 */
interface PaymentMethodResponse {
  id: string;
  type: string;
  card: CardDetails | null;
  created?: number;
}

/**
 * Invoice line item
 */
interface InvoiceLineItem {
  description: string | null;
  amount: number;
  currency: string;
  quantity: number | null;
}

/**
 * Invoice response structure
 */
interface InvoiceResponse {
  id: string;
  number: string | null;
  status: string | null;
  amountDue: number;
  amountPaid: number;
  currency: string;
  created: number;
  dueDate: number | null;
  invoicePdf: string | null;
  hostedInvoiceUrl: string | null;
  lines: InvoiceLineItem[];
}

/**
 * Payment details for history/get payment
 */
interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  paymentMethod: {
    id: string;
    type: string;
    last4: string;
    brand: string;
  } | null;
  refundedAmount: number | null;
  refundedAt: Date | null;
  failureReason?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Charge response structure
 */
interface ChargeResponse {
  payment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    description: string | null;
  };
  clientSecret: string | null;
  message: string;
}

/**
 * Refund response structure
 */
interface RefundResponse {
  payment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    refundedAmount: number | null;
    refundedAt: Date | null;
  };
  refund: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reason: string | null;
  };
  message: string;
}

/**
 * Saved payment method response
 */
interface SavedPaymentMethodResponse {
  paymentMethod: {
    id: string;
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
  };
  message: string;
}

/**
 * Extract request context for audit logging
 */
function getRequestContext(req: Request): RequestContext {
  return {
    ipAddress: req.ip ?? req.socket?.remoteAddress,
    userAgent: req.get('user-agent'),
  };
}

/**
 * Type guard for payment-related errors
 */
function isPaymentError(error: unknown): error is PaymentError {
  return error instanceof PaymentError;
}

/**
 * Handle payment errors with proper HTTP status codes
 */
function handlePaymentError(error: unknown, res: Response, defaultMessage: string): void {
  if (error instanceof PaymentValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      code: error.code,
      message: error.message,
      isRetryable: false,
    } satisfies ErrorResponse);
    return;
  }

  if (error instanceof PaymentNotFoundError) {
    res.status(404).json({
      error: 'Not Found',
      code: error.code,
      message: error.message,
      isRetryable: false,
    } satisfies ErrorResponse);
    return;
  }

  if (error instanceof PaymentProcessingError) {
    res.status(error.statusCode).json({
      error: 'Processing Error',
      code: error.code,
      message: error.message,
      isRetryable: error.isRetryable,
    } satisfies ErrorResponse);
    return;
  }

  if (isPaymentError(error)) {
    res.status(error.statusCode).json({
      error: 'Payment Error',
      code: error.code,
      message: error.message,
      isRetryable: error.isRetryable,
    } satisfies ErrorResponse);
    return;
  }

  // Default error handling
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  res.status(500).json({
    error: defaultMessage,
    message: errorMessage,
  });
}

/**
 * Extract error message safely
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

class PaymentController {
  /**
   * POST /payments/setup-intent
   * Create a setup intent for saving payment method
   */
  async createSetupIntent(req: AuthRequest, res: Response<SetupIntentResponse | ErrorResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedData = CreateSetupIntentSchema.parse(req.body);
      const setupIntent = await paymentService.createSetupIntent(
        req.user.userId,
        validatedData.metadata
      );

      res.status(200).json({
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
      });
    } catch (error: unknown) {
      logger.error('Error creating setup intent:', error);
      res.status(500).json({
        error: 'Failed to create setup intent',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * POST /payments/subscription
   * Create a new subscription with proper error handling and audit logging
   */
  async createSubscription(req: AuthRequest, res: Response<SubscriptionResponse | ErrorResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedData = CreateSubscriptionSchema.parse(req.body);
      const requestContext = getRequestContext(req);

      const result = await paymentService.createSubscription(
        req.user.userId,
        validatedData,
        requestContext
      );

      // Cast to access Stripe-specific properties
      const subscriptionWithPeriod = result.subscription as typeof result.subscription & SubscriptionPeriod;

      res.status(201).json({
        subscription: {
          id: result.subscription.id,
          status: result.subscription.status,
          currentPeriodStart: subscriptionWithPeriod.current_period_start,
          currentPeriodEnd: subscriptionWithPeriod.current_period_end,
          cancelAtPeriodEnd: result.subscription.cancel_at_period_end,
          trialStart: result.subscription.trial_start,
          trialEnd: result.subscription.trial_end,
        },
        clientSecret: result.clientSecret,
      });
    } catch (error: unknown) {
      logger.error('Error creating subscription:', error);
      handlePaymentError(error, res, 'Failed to create subscription');
    }
  }

  /**
   * DELETE /payments/subscription
   * Cancel a subscription with proper error handling and audit logging
   */
  async cancelSubscription(req: AuthRequest, res: Response<SubscriptionResponse | ErrorResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedData = CancelSubscriptionSchema.parse(req.body);
      const requestContext = getRequestContext(req);

      const subscription = await paymentService.cancelSubscription(
        req.user.userId,
        validatedData,
        requestContext
      );

      // Cast to access Stripe-specific properties
      const subscriptionWithPeriod = subscription as typeof subscription & SubscriptionPeriod;

      res.status(200).json({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at,
          currentPeriodEnd: subscriptionWithPeriod.current_period_end,
        },
        message: validatedData.cancelAtPeriodEnd
          ? 'Subscription will be canceled at the end of the billing period'
          : 'Subscription canceled immediately',
      });
    } catch (error: unknown) {
      logger.error('Error canceling subscription:', error);
      handlePaymentError(error, res, 'Failed to cancel subscription');
    }
  }

  /**
   * GET /payments/subscription
   * Get current subscription
   */
  async getCurrentSubscription(req: AuthRequest, res: Response<SubscriptionResponse | ErrorResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const subscription = await paymentService.getCurrentSubscription(req.user.userId);

      if (!subscription) {
        res.status(404).json({ error: 'Not Found', message: 'No active subscription found' });
        return;
      }

      // Cast to access Stripe-specific properties
      const stripeSubWithPeriod = subscription.stripeSubscription as typeof subscription.stripeSubscription & SubscriptionPeriod;

      res.status(200).json({
        subscription: {
          id: subscription.stripeSubscription.id,
          status: subscription.stripeSubscription.status,
          currentPeriodStart: stripeSubWithPeriod.current_period_start,
          currentPeriodEnd: stripeSubWithPeriod.current_period_end,
          cancelAtPeriodEnd: subscription.stripeSubscription.cancel_at_period_end,
          canceledAt: subscription.stripeSubscription.canceled_at,
          trialStart: subscription.stripeSubscription.trial_start,
          trialEnd: subscription.stripeSubscription.trial_end,
          plan: subscription.dbSubscription.plan,
        },
      });
    } catch (error: unknown) {
      logger.error('Error getting current subscription:', error);
      res.status(500).json({
        error: 'Failed to get current subscription',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * POST /payments/payment-method
   * Update payment method
   */
  async updatePaymentMethod(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedData = UpdatePaymentMethodSchema.parse(req.body);
      const paymentMethod = await paymentService.updatePaymentMethod(
        req.user.userId,
        validatedData
      );

      const response: { paymentMethod: PaymentMethodResponse; message: string } = {
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          card: paymentMethod.card
            ? {
                brand: paymentMethod.card.brand,
                last4: paymentMethod.card.last4,
                expMonth: paymentMethod.card.exp_month,
                expYear: paymentMethod.card.exp_year,
              }
            : null,
        },
        message: 'Payment method updated successfully',
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      logger.error('Error updating payment method:', error);
      res.status(500).json({
        error: 'Failed to update payment method',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * GET /payments/payment-methods
   * Get all payment methods
   */
  async getPaymentMethods(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const paymentMethods = await paymentService.getPaymentMethods(req.user.userId);

      const response: { paymentMethods: PaymentMethodResponse[] } = {
        paymentMethods: paymentMethods.map((pm) => ({
          id: pm.id,
          type: pm.type,
          card: pm.card
            ? {
                brand: pm.card.brand,
                last4: pm.card.last4,
                expMonth: pm.card.exp_month,
                expYear: pm.card.exp_year,
              }
            : null,
          created: pm.created,
        })),
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      logger.error('Error getting payment methods:', error);
      res.status(500).json({
        error: 'Failed to get payment methods',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * DELETE /payments/payment-method/:id
   * Remove a payment method
   */
  async removePaymentMethod(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      if (typeof id !== 'string' || id.length === 0) {
        res.status(400).json({ error: 'Bad Request', message: 'Payment method ID is required' });
        return;
      }

      await paymentService.removePaymentMethod(req.user.userId, id);

      res.status(200).json({
        message: 'Payment method removed successfully',
      });
    } catch (error: unknown) {
      logger.error('Error removing payment method:', error);
      res.status(500).json({
        error: 'Failed to remove payment method',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * GET /payments/invoices
   * Get customer invoices
   */
  async getInvoices(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedQuery = GetInvoicesSchema.parse(req.query);
      const invoices = await paymentService.getInvoices(
        req.user.userId,
        validatedQuery.limit
      );

      const response: { invoices: InvoiceResponse[] } = {
        invoices: invoices.map((invoice) => ({
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          amountDue: invoice.amount_due,
          amountPaid: invoice.amount_paid,
          currency: invoice.currency,
          created: invoice.created,
          dueDate: invoice.due_date,
          invoicePdf: invoice.invoice_pdf,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          lines: invoice.lines.data.map((line) => ({
            description: line.description,
            amount: line.amount,
            currency: line.currency,
            quantity: line.quantity,
          })),
        })),
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      logger.error('Error getting invoices:', error);
      res.status(500).json({
        error: 'Failed to get invoices',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * POST /payments/webhook
   * Handle Stripe webhook events
   */
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'];

      if (typeof signature !== 'string' || signature.length === 0) {
        res.status(400).json({ error: 'Bad Request', message: 'Missing stripe-signature header' });
        return;
      }

      // The body should be raw for webhook verification
      const payload = req.body as Buffer | string;

      await paymentService.handleWebhook(payload, signature);

      res.status(200).json({ received: true });
    } catch (error: unknown) {
      logger.error('Error handling webhook:', error);
      res.status(400).json({
        error: 'Webhook error',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * GET /payments/config
   * Get Stripe publishable key
   */
  async getConfig(_req: AuthRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? null,
      });
    } catch (error: unknown) {
      logger.error('Error getting config:', error);
      res.status(500).json({
        error: 'Failed to get configuration',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * POST /payments/charge
   * Create a one-time charge with proper error handling and audit logging
   *
   * SECURITY: Server-side price validation
   * - Admin users can specify any amount (for custom charges)
   * - Regular users must provide referenceType/referenceId to look up price from DB
   * - Client-provided amounts are ignored for non-admin users
   */
  async createCharge(req: AuthRequest, res: Response<ChargeResponse | ErrorResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedData = CreateChargeSchema.parse(req.body);
      const requestContext = getRequestContext(req);

      // SECURITY FIX: Server-side price validation
      let serverSideAmount: number;
      let description = validatedData.description;

      if (req.user.role === 'admin' && validatedData.amount !== undefined) {
        // Admin can specify custom amounts
        serverSideAmount = validatedData.amount;
        logger.info('Admin creating custom charge', {
          userId: req.user.userId,
          amount: serverSideAmount,
          referenceType: validatedData.referenceType,
        });
      } else if (validatedData.referenceType && validatedData.referenceId) {
        // Look up price from database based on reference
        const priceInfo = await paymentService.getPriceForReference(
          validatedData.referenceType,
          validatedData.referenceId
        );

        if (!priceInfo) {
          res.status(400).json({
            error: 'Invalid reference',
            message: 'Could not find price for the specified reference',
          });
          return;
        }

        serverSideAmount = priceInfo.amount;
        description = description ?? priceInfo.description;

        // SECURITY: Log if client tried to specify a different amount
        if (validatedData.amount !== undefined && validatedData.amount !== serverSideAmount) {
          logger.warn('Client attempted price manipulation', {
            userId: req.user.userId,
            clientAmount: validatedData.amount,
            serverAmount: serverSideAmount,
            referenceType: validatedData.referenceType,
            referenceId: validatedData.referenceId,
            ipAddress: requestContext.ipAddress,
          });
        }
      } else {
        // Non-admin without valid reference
        logger.warn('Non-admin attempted charge without valid reference', {
          userId: req.user.userId,
          role: req.user.role,
          ipAddress: requestContext.ipAddress,
        });
        res.status(400).json({
          error: 'Invalid request',
          message: 'Please provide a valid referenceType and referenceId',
        });
        return;
      }

      const result = await paymentService.createCharge(
        req.user.userId,
        {
          ...validatedData,
          amount: serverSideAmount, // Always use server-side amount
          description,
        },
        requestContext
      );

      res.status(201).json({
        payment: {
          id: result.payment.id,
          amount: result.payment.amount,
          currency: result.payment.currency,
          status: result.payment.status,
          description: result.payment.description,
        },
        clientSecret: result.clientSecret,
        message: 'Charge created successfully',
      });
    } catch (error: unknown) {
      logger.error('Error creating charge:', error);
      handlePaymentError(error, res, 'Failed to create charge');
    }
  }

  /**
   * GET /payments/history
   * Get payment history
   */
  async getPaymentHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedQuery = GetPaymentHistorySchema.parse(req.query);
      const payments = await paymentService.getPaymentHistory(req.user.userId, {
        limit: validatedQuery.limit,
        status: validatedQuery.status,
        startDate: validatedQuery.startDate,
        endDate: validatedQuery.endDate,
      });

      const response: { payments: PaymentDetails[] } = {
        payments: payments.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          description: payment.description,
          paymentMethod: payment.paymentMethod
            ? {
                id: payment.paymentMethod.id,
                type: payment.paymentMethod.type,
                last4: payment.paymentMethod.last4,
                brand: payment.paymentMethod.brand,
              }
            : null,
          refundedAmount: payment.refundedAmount,
          refundedAt: payment.refundedAt,
          createdAt: payment.createdAt,
        })),
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      logger.error('Error getting payment history:', error);
      res.status(500).json({
        error: 'Failed to get payment history',
        message: getErrorMessage(error),
      });
    }
  }

  /**
   * GET /payments/:id
   * Get payment details
   */
  async getPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      if (typeof id !== 'string' || id.length === 0) {
        res.status(400).json({ error: 'Bad Request', message: 'Payment ID is required' });
        return;
      }

      const payment = await paymentService.getPayment(req.user.userId, id);

      const response: { payment: PaymentDetails } = {
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          description: payment.description,
          paymentMethod: payment.paymentMethod
            ? {
                id: payment.paymentMethod.id,
                type: payment.paymentMethod.type,
                last4: payment.paymentMethod.last4,
                brand: payment.paymentMethod.brand,
              }
            : null,
          refundedAmount: payment.refundedAmount,
          refundedAt: payment.refundedAt,
          failureReason: payment.failedReason,
          metadata: payment.metadata as Record<string, unknown> | undefined,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        },
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      logger.error('Error getting payment:', error);
      const errorMessage = getErrorMessage(error);
      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        error: 'Failed to get payment',
        message: errorMessage,
      });
    }
  }

  /**
   * POST /payments/:id/refund
   * Refund a payment with proper error handling and audit logging
   */
  async refundPayment(req: AuthRequest, res: Response<RefundResponse | ErrorResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      if (typeof id !== 'string' || id.length === 0) {
        res.status(400).json({ error: 'Bad Request', message: 'Payment ID is required' });
        return;
      }

      const validatedData = CreateRefundSchema.parse({
        ...req.body,
        paymentId: id,
      });

      const requestContext = getRequestContext(req);

      const result = await paymentService.refundPayment(
        req.user.userId,
        id,
        validatedData,
        requestContext
      );

      res.status(200).json({
        payment: {
          id: result.payment.id,
          amount: result.payment.amount,
          currency: result.payment.currency,
          status: result.payment.status,
          refundedAmount: result.payment.refundedAmount,
          refundedAt: result.payment.refundedAt,
        },
        refund: {
          id: result.refund.id,
          amount: result.refund.amount / 100,
          currency: result.refund.currency,
          status: result.refund.status,
          reason: result.refund.reason,
        },
        message: 'Payment refunded successfully',
      });
    } catch (error: unknown) {
      logger.error('Error refunding payment:', error);
      handlePaymentError(error, res, 'Failed to refund payment');
    }
  }

  /**
   * POST /payments/payment-method/save
   * Save a payment method (alternative to update)
   */
  async savePaymentMethod(req: AuthRequest, res: Response<SavedPaymentMethodResponse | ErrorResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      const validatedData = SavePaymentMethodSchema.parse(req.body);
      const paymentMethod = await paymentService.savePaymentMethod(
        req.user.userId,
        validatedData
      );

      res.status(200).json({
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          last4: paymentMethod.last4,
          brand: paymentMethod.brand,
          expiryMonth: paymentMethod.expiryMonth,
          expiryYear: paymentMethod.expiryYear,
          isDefault: paymentMethod.isDefault,
        },
        message: 'Payment method saved successfully',
      });
    } catch (error: unknown) {
      logger.error('Error saving payment method:', error);
      res.status(500).json({
        error: 'Failed to save payment method',
        message: getErrorMessage(error),
      });
    }
  }
}

export const paymentController = new PaymentController();
