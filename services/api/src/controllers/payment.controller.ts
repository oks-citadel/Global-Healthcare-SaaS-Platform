// @ts-nocheck
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

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Extract request context for audit logging
 */
function getRequestContext(req: Request): { ipAddress?: string; userAgent?: string } {
  return {
    ipAddress: req.ip || req.socket?.remoteAddress,
    userAgent: req.get('user-agent'),
  };
}

/**
 * Handle payment errors with proper HTTP status codes
 */
function handlePaymentError(error: any, res: Response, defaultMessage: string): void {
  if (error instanceof PaymentValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      code: error.code,
      message: error.message,
      isRetryable: false,
    });
    return;
  }

  if (error instanceof PaymentNotFoundError) {
    res.status(404).json({
      error: 'Not Found',
      code: error.code,
      message: error.message,
      isRetryable: false,
    });
    return;
  }

  if (error instanceof PaymentProcessingError) {
    res.status(error.statusCode).json({
      error: 'Processing Error',
      code: error.code,
      message: error.message,
      isRetryable: error.isRetryable,
    });
    return;
  }

  if (error instanceof PaymentError) {
    res.status(error.statusCode).json({
      error: 'Payment Error',
      code: error.code,
      message: error.message,
      isRetryable: error.isRetryable,
    });
    return;
  }

  // Default error handling
  res.status(500).json({
    error: defaultMessage,
    message: error.message,
  });
}

class PaymentController {
  /**
   * POST /payments/setup-intent
   * Create a setup intent for saving payment method
   */
  async createSetupIntent(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = CreateSetupIntentSchema.parse(req.body);
      const setupIntent = await paymentService.createSetupIntent(
        req.user.id,
        validatedData.metadata
      );

      res.status(200).json({
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
      });
    } catch (error: any) {
      logger.error('Error creating setup intent:', error);
      res.status(500).json({
        error: 'Failed to create setup intent',
        message: error.message,
      });
    }
  }

  /**
   * POST /payments/subscription
   * Create a new subscription with proper error handling and audit logging
   */
  async createSubscription(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = CreateSubscriptionSchema.parse(req.body);
      const requestContext = getRequestContext(req);

      const result = await paymentService.createSubscription(
        req.user.id,
        validatedData,
        requestContext
      );

      res.status(201).json({
        subscription: {
          id: result.subscription.id,
          status: result.subscription.status,
          currentPeriodStart: (result.subscription as any).current_period_start,
          currentPeriodEnd: (result.subscription as any).current_period_end,
          cancelAtPeriodEnd: result.subscription.cancel_at_period_end,
          trialStart: result.subscription.trial_start,
          trialEnd: result.subscription.trial_end,
        },
        clientSecret: result.clientSecret,
      });
    } catch (error: any) {
      logger.error('Error creating subscription:', error);
      handlePaymentError(error, res, 'Failed to create subscription');
    }
  }

  /**
   * DELETE /payments/subscription
   * Cancel a subscription with proper error handling and audit logging
   */
  async cancelSubscription(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = CancelSubscriptionSchema.parse(req.body);
      const requestContext = getRequestContext(req);

      const subscription = await paymentService.cancelSubscription(
        req.user.id,
        validatedData,
        requestContext
      );

      res.status(200).json({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at,
          currentPeriodEnd: (subscription as any).current_period_end,
        },
        message: validatedData.cancelAtPeriodEnd
          ? 'Subscription will be canceled at the end of the billing period'
          : 'Subscription canceled immediately',
      });
    } catch (error: any) {
      logger.error('Error canceling subscription:', error);
      handlePaymentError(error, res, 'Failed to cancel subscription');
    }
  }

  /**
   * GET /payments/subscription
   * Get current subscription
   */
  async getCurrentSubscription(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const subscription = await paymentService.getCurrentSubscription(req.user.id);

      if (!subscription) {
        res.status(404).json({ error: 'No active subscription found' });
        return;
      }

      res.status(200).json({
        subscription: {
          id: subscription.stripeSubscription.id,
          status: subscription.stripeSubscription.status,
          currentPeriodStart: (subscription.stripeSubscription as any).current_period_start,
          currentPeriodEnd: (subscription.stripeSubscription as any).current_period_end,
          cancelAtPeriodEnd: subscription.stripeSubscription.cancel_at_period_end,
          canceledAt: subscription.stripeSubscription.canceled_at,
          trialStart: subscription.stripeSubscription.trial_start,
          trialEnd: subscription.stripeSubscription.trial_end,
          plan: subscription.dbSubscription.plan,
        },
      });
    } catch (error: any) {
      logger.error('Error getting current subscription:', error);
      res.status(500).json({
        error: 'Failed to get current subscription',
        message: error.message,
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
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = UpdatePaymentMethodSchema.parse(req.body);
      const paymentMethod = await paymentService.updatePaymentMethod(
        req.user.id,
        validatedData
      );

      res.status(200).json({
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
      });
    } catch (error: any) {
      logger.error('Error updating payment method:', error);
      res.status(500).json({
        error: 'Failed to update payment method',
        message: error.message,
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
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const paymentMethods = await paymentService.getPaymentMethods(req.user.id);

      res.status(200).json({
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
      });
    } catch (error: any) {
      logger.error('Error getting payment methods:', error);
      res.status(500).json({
        error: 'Failed to get payment methods',
        message: error.message,
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
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      await paymentService.removePaymentMethod(req.user.id, id);

      res.status(200).json({
        message: 'Payment method removed successfully',
      });
    } catch (error: any) {
      logger.error('Error removing payment method:', error);
      res.status(500).json({
        error: 'Failed to remove payment method',
        message: error.message,
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
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedQuery = GetInvoicesSchema.parse(req.query);
      const invoices = await paymentService.getInvoices(
        req.user.id,
        validatedQuery.limit
      );

      res.status(200).json({
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
      });
    } catch (error: any) {
      logger.error('Error getting invoices:', error);
      res.status(500).json({
        error: 'Failed to get invoices',
        message: error.message,
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

      if (!signature) {
        res.status(400).json({ error: 'Missing stripe-signature header' });
        return;
      }

      // The body should be raw for webhook verification
      const payload = req.body;

      await paymentService.handleWebhook(payload, signature as string);

      res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error('Error handling webhook:', error);
      res.status(400).json({
        error: 'Webhook error',
        message: error.message,
      });
    }
  }

  /**
   * GET /payments/config
   * Get Stripe publishable key
   */
  async getConfig(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error: any) {
      logger.error('Error getting config:', error);
      res.status(500).json({
        error: 'Failed to get configuration',
        message: error.message,
      });
    }
  }

  /**
   * POST /payments/charge
   * Create a one-time charge with proper error handling and audit logging
   */
  async createCharge(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = CreateChargeSchema.parse(req.body);
      const requestContext = getRequestContext(req);

      const result = await paymentService.createCharge(
        req.user.id,
        validatedData,
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
    } catch (error: any) {
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
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedQuery = GetPaymentHistorySchema.parse(req.query);
      const payments = await paymentService.getPaymentHistory(req.user.id, {
        limit: validatedQuery.limit,
        status: validatedQuery.status,
        startDate: validatedQuery.startDate,
        endDate: validatedQuery.endDate,
      });

      res.status(200).json({
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
      });
    } catch (error: any) {
      logger.error('Error getting payment history:', error);
      res.status(500).json({
        error: 'Failed to get payment history',
        message: error.message,
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
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const payment = await paymentService.getPayment(req.user.id, id);

      res.status(200).json({
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
          metadata: payment.metadata,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        },
      });
    } catch (error: any) {
      logger.error('Error getting payment:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        error: 'Failed to get payment',
        message: error.message,
      });
    }
  }

  /**
   * POST /payments/:id/refund
   * Refund a payment with proper error handling and audit logging
   */
  async refundPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const validatedData = CreateRefundSchema.parse({
        ...req.body,
        paymentId: id,
      });

      const requestContext = getRequestContext(req);

      const result = await paymentService.refundPayment(
        req.user.id,
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
    } catch (error: any) {
      logger.error('Error refunding payment:', error);
      handlePaymentError(error, res, 'Failed to refund payment');
    }
  }

  /**
   * POST /payments/payment-method/save
   * Save a payment method (alternative to update)
   */
  async savePaymentMethod(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = SavePaymentMethodSchema.parse(req.body);
      const paymentMethod = await paymentService.savePaymentMethod(
        req.user.id,
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
    } catch (error: any) {
      logger.error('Error saving payment method:', error);
      res.status(500).json({
        error: 'Failed to save payment method',
        message: error.message,
      });
    }
  }
}

export const paymentController = new PaymentController();
