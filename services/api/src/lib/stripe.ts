// @ts-nocheck
import Stripe from 'stripe';
import { logger } from '../utils/logger.js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'Unified Health Platform',
    version: '1.0.0',
  },
});

/**
 * Helper function to create a Stripe customer
 */
export const createStripeCustomer = async (params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> => {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    });
    logger.info(`Stripe customer created: ${customer.id}`);
    return customer;
  } catch (error) {
    logger.error('Error creating Stripe customer:', error);
    throw error;
  }
};

/**
 * Helper function to retrieve a Stripe customer
 */
export const getStripeCustomer = async (
  customerId: string
): Promise<Stripe.Customer> => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      throw new Error('Customer has been deleted');
    }
    return customer as Stripe.Customer;
  } catch (error) {
    logger.error(`Error retrieving Stripe customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Helper function to update a Stripe customer
 */
export const updateStripeCustomer = async (
  customerId: string,
  params: Stripe.CustomerUpdateParams
): Promise<Stripe.Customer> => {
  try {
    const customer = await stripe.customers.update(customerId, params);
    logger.info(`Stripe customer updated: ${customer.id}`);
    return customer;
  } catch (error) {
    logger.error(`Error updating Stripe customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Helper function to create a setup intent for saving payment method
 */
export const createSetupIntent = async (
  customerId: string,
  metadata?: Record<string, string>
): Promise<Stripe.SetupIntent> => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata,
    });
    logger.info(`Setup intent created: ${setupIntent.id}`);
    return setupIntent;
  } catch (error) {
    logger.error('Error creating setup intent:', error);
    throw error;
  }
};

/**
 * Helper function to attach payment method to customer
 */
export const attachPaymentMethod = async (
  paymentMethodId: string,
  customerId: string
): Promise<Stripe.PaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    logger.info(`Payment method attached: ${paymentMethod.id}`);
    return paymentMethod;
  } catch (error) {
    logger.error('Error attaching payment method:', error);
    throw error;
  }
};

/**
 * Helper function to set default payment method
 */
export const setDefaultPaymentMethod = async (
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.Customer> => {
  try {
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    logger.info(`Default payment method set for customer: ${customerId}`);
    return customer;
  } catch (error) {
    logger.error('Error setting default payment method:', error);
    throw error;
  }
};

/**
 * Helper function to create a subscription
 */
export const createStripeSubscription = async (params: {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
}): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      metadata: params.metadata,
      trial_period_days: params.trialPeriodDays,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent', 'customer'],
    });
    logger.info(`Stripe subscription created: ${subscription.id}`);
    return subscription;
  } catch (error) {
    logger.error('Error creating Stripe subscription:', error);
    throw error;
  }
};

/**
 * Helper function to update a subscription
 */
export const updateStripeSubscription = async (
  subscriptionId: string,
  params: Stripe.SubscriptionUpdateParams
): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      params
    );
    logger.info(`Stripe subscription updated: ${subscription.id}`);
    return subscription;
  } catch (error) {
    logger.error(`Error updating Stripe subscription ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Helper function to cancel a subscription
 */
export const cancelStripeSubscription = async (
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = false
): Promise<Stripe.Subscription> => {
  try {
    let subscription: Stripe.Subscription;
    if (cancelAtPeriodEnd) {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      subscription = await stripe.subscriptions.cancel(subscriptionId);
    }
    logger.info(`Stripe subscription cancelled: ${subscription.id}`);
    return subscription;
  } catch (error) {
    logger.error(`Error cancelling Stripe subscription ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Helper function to retrieve a subscription
 */
export const getStripeSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'default_payment_method'],
    });
    return subscription;
  } catch (error) {
    logger.error(`Error retrieving Stripe subscription ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Helper function to list customer invoices
 */
export const listCustomerInvoices = async (
  customerId: string,
  limit: number = 10
): Promise<Stripe.Invoice[]> => {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    });
    return invoices.data;
  } catch (error) {
    logger.error(`Error listing invoices for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Helper function to retrieve an invoice
 */
export const getStripeInvoice = async (
  invoiceId: string
): Promise<Stripe.Invoice> => {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice;
  } catch (error) {
    logger.error(`Error retrieving invoice ${invoiceId}:`, error);
    throw error;
  }
};

/**
 * Helper function to construct webhook event
 */
export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    logger.error('Error constructing webhook event:', error);
    throw error;
  }
};

/**
 * Helper function to list all prices/plans
 */
export const listStripePrices = async (
  productId?: string
): Promise<Stripe.Price[]> => {
  try {
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      expand: ['data.product'],
    });
    return prices.data;
  } catch (error) {
    logger.error('Error listing Stripe prices:', error);
    throw error;
  }
};

/**
 * Helper function to retrieve payment method
 */
export const getPaymentMethod = async (
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    logger.error(`Error retrieving payment method ${paymentMethodId}:`, error);
    throw error;
  }
};

/**
 * Helper function to list customer payment methods
 */
export const listCustomerPaymentMethods = async (
  customerId: string,
  type: string = 'card'
): Promise<Stripe.PaymentMethod[]> => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: type as any,
    });
    return paymentMethods.data;
  } catch (error) {
    logger.error(`Error listing payment methods for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Helper function to detach payment method
 */
export const detachPaymentMethod = async (
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    logger.info(`Payment method detached: ${paymentMethod.id}`);
    return paymentMethod;
  } catch (error) {
    logger.error(`Error detaching payment method ${paymentMethodId}:`, error);
    throw error;
  }
};

/**
 * Helper function to create a payment intent (for one-time charges)
 */
export const createPaymentIntent = async (params: {
  amount: number;
  currency: string;
  customerId?: string;
  paymentMethodId?: string;
  metadata?: Record<string, string>;
  description?: string;
  confirmImmediately?: boolean;
}): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: params.amount,
      currency: params.currency,
      customer: params.customerId,
      payment_method: params.paymentMethodId,
      metadata: params.metadata,
      description: params.description,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    };

    if (params.confirmImmediately && params.paymentMethodId) {
      paymentIntentParams.confirm = true;
      paymentIntentParams.return_url = undefined;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    logger.info(`Payment intent created: ${paymentIntent.id}`);
    return paymentIntent;
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Helper function to retrieve a payment intent
 */
export const getPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error(`Error retrieving payment intent ${paymentIntentId}:`, error);
    throw error;
  }
};

/**
 * Helper function to confirm a payment intent
 */
export const confirmPaymentIntent = async (
  paymentIntentId: string,
  paymentMethodId?: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
    logger.info(`Payment intent confirmed: ${paymentIntent.id}`);
    return paymentIntent;
  } catch (error) {
    logger.error(`Error confirming payment intent ${paymentIntentId}:`, error);
    throw error;
  }
};

/**
 * Helper function to cancel a payment intent
 */
export const cancelPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    logger.info(`Payment intent cancelled: ${paymentIntent.id}`);
    return paymentIntent;
  } catch (error) {
    logger.error(`Error cancelling payment intent ${paymentIntentId}:`, error);
    throw error;
  }
};

/**
 * Helper function to create a refund
 */
export const createRefund = async (params: {
  paymentIntentId?: string;
  chargeId?: string;
  amount?: number;
  reason?: Stripe.RefundCreateParams.Reason;
  metadata?: Record<string, string>;
}): Promise<Stripe.Refund> => {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: params.paymentIntentId,
      charge: params.chargeId,
      amount: params.amount,
      reason: params.reason,
      metadata: params.metadata,
    };

    const refund = await stripe.refunds.create(refundParams);
    logger.info(`Refund created: ${refund.id} for ${params.paymentIntentId || params.chargeId}`);
    return refund;
  } catch (error) {
    logger.error('Error creating refund:', error);
    throw error;
  }
};

/**
 * Helper function to retrieve a refund
 */
export const getRefund = async (refundId: string): Promise<Stripe.Refund> => {
  try {
    const refund = await stripe.refunds.retrieve(refundId);
    return refund;
  } catch (error) {
    logger.error(`Error retrieving refund ${refundId}:`, error);
    throw error;
  }
};

/**
 * Helper function to list charges for a customer
 */
export const listCustomerCharges = async (
  customerId: string,
  limit: number = 10
): Promise<Stripe.Charge[]> => {
  try {
    const charges = await stripe.charges.list({
      customer: customerId,
      limit,
    });
    return charges.data;
  } catch (error) {
    logger.error(`Error listing charges for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Helper function to retrieve a charge
 */
export const getCharge = async (chargeId: string): Promise<Stripe.Charge> => {
  try {
    const charge = await stripe.charges.retrieve(chargeId);
    return charge;
  } catch (error) {
    logger.error(`Error retrieving charge ${chargeId}:`, error);
    throw error;
  }
};
