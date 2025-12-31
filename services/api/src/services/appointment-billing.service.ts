import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { paymentService } from './payment.service.js';
import {
  createPaymentIntent,
  getPaymentIntent,
  cancelPaymentIntent,
  confirmPaymentIntent,
} from '../lib/stripe.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

/**
 * Appointment type pricing configuration
 * Prices are in cents (Stripe uses smallest currency unit)
 */
export interface AppointmentTypePricing {
  type: string;
  basePrice: number; // in cents
  currency: string;
  isPaid: boolean;
  durationMultiplier?: boolean; // if true, price scales with duration
}

// Default pricing for appointment types (can be moved to config/database)
const DEFAULT_APPOINTMENT_PRICING: AppointmentTypePricing[] = [
  { type: 'video', basePrice: 5000, currency: 'usd', isPaid: true, durationMultiplier: true },
  { type: 'audio', basePrice: 3500, currency: 'usd', isPaid: true, durationMultiplier: true },
  { type: 'chat', basePrice: 2500, currency: 'usd', isPaid: true, durationMultiplier: false },
  { type: 'in-person', basePrice: 7500, currency: 'usd', isPaid: true, durationMultiplier: true },
];

export interface CreateAppointmentBillingParams {
  appointmentId: string;
  patientId: string;
  providerId: string;
  appointmentType: string;
  duration: number; // in minutes
  paymentMethodId?: string;
  metadata?: Record<string, string>;
}

export interface AppointmentBillingResult {
  paymentId: string;
  paymentIntentId: string;
  clientSecret: string | null;
  amount: number;
  currency: string;
  status: string;
  requiresAction: boolean;
}

export interface CompleteAppointmentBillingParams {
  appointmentId: string;
  paymentMethodId?: string;
  additionalCharges?: number; // Additional charges in cents (e.g., for extra services)
  metadata?: Record<string, string>;
}

export class AppointmentBillingService {
  /**
   * Get pricing for an appointment type
   */
  getPricing(appointmentType: string): AppointmentTypePricing | null {
    // Convert appointment type to match our pricing config (handle 'in-person' vs 'in_person')
    const normalizedType = appointmentType.replace('_', '-');
    return DEFAULT_APPOINTMENT_PRICING.find(p => p.type === normalizedType) || null;
  }

  /**
   * Calculate appointment price based on type and duration
   */
  calculateAppointmentPrice(appointmentType: string, durationMinutes: number): {
    amount: number;
    currency: string;
    isPaid: boolean;
  } {
    const pricing = this.getPricing(appointmentType);

    if (!pricing || !pricing.isPaid) {
      return { amount: 0, currency: 'usd', isPaid: false };
    }

    let amount = pricing.basePrice;

    // Apply duration multiplier if applicable
    // Base price is for 30 minutes, scale accordingly
    if (pricing.durationMultiplier) {
      const durationMultiplier = durationMinutes / 30;
      amount = Math.round(pricing.basePrice * durationMultiplier);
    }

    return {
      amount,
      currency: pricing.currency,
      isPaid: true,
    };
  }

  /**
   * Check if an appointment type requires payment
   */
  isAppointmentTypePaid(appointmentType: string): boolean {
    const pricing = this.getPricing(appointmentType);
    return pricing?.isPaid ?? false;
  }

  /**
   * Create a payment intent for appointment booking
   * This should be called when booking a paid appointment
   */
  async createAppointmentPayment(
    userId: string,
    params: CreateAppointmentBillingParams
  ): Promise<AppointmentBillingResult> {
    try {
      const { appointmentId, appointmentType, duration, paymentMethodId, metadata } = params;

      // Calculate price
      const { amount, currency, isPaid } = this.calculateAppointmentPrice(appointmentType, duration);

      if (!isPaid) {
        throw new BadRequestError('This appointment type does not require payment');
      }

      // Get user info for customer creation
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Create or get Stripe customer
      const customer = await paymentService.createCustomer({
        userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        amount,
        currency,
        customerId: customer.id,
        paymentMethodId,
        description: `Appointment booking - ${appointmentType} (${duration} minutes)`,
        metadata: {
          userId,
          appointmentId,
          appointmentType,
          duration: String(duration),
          ...metadata,
        },
        confirmImmediately: !!paymentMethodId,
      });

      // Save payment to database
      const payment = await prisma.payment.create({
        data: {
          userId,
          stripePaymentIntentId: paymentIntent.id,
          amount: amount / 100, // Convert from cents to dollars for storage
          currency: currency.toUpperCase(),
          status: this.mapStripePaymentStatus(paymentIntent.status),
          description: `Appointment booking - ${appointmentType} (${duration} minutes)`,
          metadata: {
            appointmentId,
            appointmentType,
            duration: String(duration),
            ...metadata,
          },
        },
      });

      logger.info(`Created appointment payment ${payment.id} for appointment ${appointmentId}`);

      return {
        paymentId: payment.id,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount,
        currency,
        status: paymentIntent.status,
        requiresAction: paymentIntent.status === 'requires_action' ||
                       paymentIntent.status === 'requires_confirmation',
      };
    } catch (error) {
      logger.error('Error creating appointment payment:', error);
      throw error;
    }
  }

  /**
   * Get payment for an appointment
   */
  async getAppointmentPayment(appointmentId: string): Promise<any | null> {
    try {
      const payment = await prisma.payment.findFirst({
        where: {
          metadata: {
            path: ['appointmentId'],
            equals: appointmentId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!payment) {
        return null;
      }

      // Get latest status from Stripe if available
      if (payment.stripePaymentIntentId) {
        try {
          const paymentIntent = await getPaymentIntent(payment.stripePaymentIntentId);
          const newStatus = this.mapStripePaymentStatus(paymentIntent.status);

          if (newStatus !== payment.status) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: newStatus },
            });
            payment.status = newStatus;
          }

          return {
            ...payment,
            stripePaymentIntent: paymentIntent,
          };
        } catch (error) {
          logger.warn(`Could not retrieve payment intent for appointment ${appointmentId}:`, error);
        }
      }

      return payment;
    } catch (error) {
      logger.error('Error getting appointment payment:', error);
      throw error;
    }
  }

  /**
   * Confirm appointment payment (when patient confirms with payment method)
   */
  async confirmAppointmentPayment(
    appointmentId: string,
    paymentMethodId: string
  ): Promise<AppointmentBillingResult> {
    try {
      const payment = await this.getAppointmentPayment(appointmentId);

      if (!payment) {
        throw new NotFoundError('Payment not found for this appointment');
      }

      if (!payment.stripePaymentIntentId) {
        throw new BadRequestError('Payment does not have a Stripe payment intent');
      }

      // Confirm the payment intent
      const paymentIntent = await confirmPaymentIntent(
        payment.stripePaymentIntentId,
        paymentMethodId
      );

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: this.mapStripePaymentStatus(paymentIntent.status),
        },
      });

      logger.info(`Confirmed appointment payment for appointment ${appointmentId}`);

      return {
        paymentId: payment.id,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: Number(payment.amount) * 100,
        currency: payment.currency.toLowerCase(),
        status: paymentIntent.status,
        requiresAction: paymentIntent.status === 'requires_action',
      };
    } catch (error) {
      logger.error('Error confirming appointment payment:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment payment (when appointment is cancelled)
   */
  async cancelAppointmentPayment(appointmentId: string): Promise<void> {
    try {
      const payment = await this.getAppointmentPayment(appointmentId);

      if (!payment) {
        logger.info(`No payment found for appointment ${appointmentId} - nothing to cancel`);
        return;
      }

      if (!payment.stripePaymentIntentId) {
        logger.info(`Payment ${payment.id} has no Stripe payment intent - nothing to cancel`);
        return;
      }

      // Only cancel if payment is not already succeeded
      if (payment.status === 'succeeded') {
        logger.warn(`Payment ${payment.id} has already succeeded - consider refund instead`);
        return;
      }

      // Cancel the payment intent
      await cancelPaymentIntent(payment.stripePaymentIntentId);

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'cancelled' },
      });

      logger.info(`Cancelled appointment payment for appointment ${appointmentId}`);
    } catch (error) {
      logger.error('Error cancelling appointment payment:', error);
      throw error;
    }
  }

  /**
   * Complete billing after appointment completion
   * This can be used to capture additional charges or finalize the payment
   */
  async completeAppointmentBilling(
    userId: string,
    params: CompleteAppointmentBillingParams
  ): Promise<AppointmentBillingResult | null> {
    try {
      const { appointmentId, additionalCharges, paymentMethodId, metadata } = params;

      // Get existing payment for this appointment
      const existingPayment = await this.getAppointmentPayment(appointmentId);

      // If there are additional charges, create a new payment for them
      if (additionalCharges && additionalCharges > 0) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundError('User not found');
        }

        const customer = await paymentService.createCustomer({
          userId,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        });

        const paymentIntent = await createPaymentIntent({
          amount: additionalCharges,
          currency: 'usd',
          customerId: customer.id,
          paymentMethodId,
          description: `Additional charges for appointment ${appointmentId}`,
          metadata: {
            userId,
            appointmentId,
            chargeType: 'additional',
            ...metadata,
          },
          confirmImmediately: !!paymentMethodId,
        });

        const payment = await prisma.payment.create({
          data: {
            userId,
            stripePaymentIntentId: paymentIntent.id,
            amount: additionalCharges / 100,
            currency: 'USD',
            status: this.mapStripePaymentStatus(paymentIntent.status),
            description: `Additional charges for appointment ${appointmentId}`,
            metadata: {
              appointmentId,
              chargeType: 'additional',
              ...metadata,
            },
          },
        });

        logger.info(`Created additional charges payment ${payment.id} for appointment ${appointmentId}`);

        return {
          paymentId: payment.id,
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          amount: additionalCharges,
          currency: 'usd',
          status: paymentIntent.status,
          requiresAction: paymentIntent.status === 'requires_action',
        };
      }

      // Return existing payment info if no additional charges
      if (existingPayment) {
        return {
          paymentId: existingPayment.id,
          paymentIntentId: existingPayment.stripePaymentIntentId || '',
          clientSecret: null,
          amount: Number(existingPayment.amount) * 100,
          currency: existingPayment.currency.toLowerCase(),
          status: existingPayment.status,
          requiresAction: false,
        };
      }

      return null;
    } catch (error) {
      logger.error('Error completing appointment billing:', error);
      throw error;
    }
  }

  /**
   * Get billing summary for an appointment
   */
  async getAppointmentBillingSummary(appointmentId: string): Promise<{
    totalCharged: number;
    currency: string;
    payments: any[];
    status: string;
  }> {
    try {
      // Find all payments for this appointment
      const payments = await prisma.payment.findMany({
        where: {
          metadata: {
            path: ['appointmentId'],
            equals: appointmentId,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      let totalCharged = 0;
      let currency = 'USD';
      let hasFailedPayment = false;
      let hasPendingPayment = false;

      for (const payment of payments) {
        if (payment.status === 'succeeded') {
          totalCharged += Number(payment.amount);
        }
        if (payment.status === 'failed') {
          hasFailedPayment = true;
        }
        if (['pending', 'processing'].includes(payment.status)) {
          hasPendingPayment = true;
        }
        currency = payment.currency;
      }

      let overallStatus = 'no_payment';
      if (payments.length > 0) {
        if (hasFailedPayment) {
          overallStatus = 'failed';
        } else if (hasPendingPayment) {
          overallStatus = 'pending';
        } else if (totalCharged > 0) {
          overallStatus = 'paid';
        } else {
          overallStatus = 'unpaid';
        }
      }

      return {
        totalCharged,
        currency,
        payments: payments.map(p => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          description: p.description,
          createdAt: p.createdAt,
        })),
        status: overallStatus,
      };
    } catch (error) {
      logger.error('Error getting appointment billing summary:', error);
      throw error;
    }
  }

  /**
   * Issue refund for appointment cancellation
   */
  async refundAppointmentPayment(
    appointmentId: string,
    amount?: number, // Partial refund amount in cents (optional)
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<any> {
    try {
      const payment = await this.getAppointmentPayment(appointmentId);

      if (!payment) {
        throw new NotFoundError('Payment not found for this appointment');
      }

      if (payment.status !== 'succeeded') {
        throw new BadRequestError('Only succeeded payments can be refunded');
      }

      // Use payment service to refund
      const result = await paymentService.refundPayment(
        payment.userId,
        payment.id,
        {
          paymentId: payment.id,
          amount,
          reason,
          metadata: {
            appointmentId,
            refundReason: 'appointment_cancellation',
          },
        }
      );

      logger.info(`Refunded appointment payment for appointment ${appointmentId}`);

      return result;
    } catch (error) {
      logger.error('Error refunding appointment payment:', error);
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
}

export const appointmentBillingService = new AppointmentBillingService();
