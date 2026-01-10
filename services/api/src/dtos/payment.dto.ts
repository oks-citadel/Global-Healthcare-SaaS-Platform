import { z } from 'zod';

/**
 * Schema for creating a subscription
 */
export const CreateSubscriptionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  paymentMethodId: z.string().optional(),
  trialPeriodDays: z.number().int().positive().optional(),
  metadata: z.record(z.string()).optional(),
});

export type CreateSubscriptionDto = z.infer<typeof CreateSubscriptionSchema>;

/**
 * Schema for updating payment method
 */
export const UpdatePaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  setAsDefault: z.boolean().default(true),
});

export type UpdatePaymentMethodDto = z.infer<typeof UpdatePaymentMethodSchema>;

/**
 * Schema for canceling subscription
 */
export const CancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  cancelAtPeriodEnd: z.boolean().default(false),
  reason: z.string().optional(),
});

export type CancelSubscriptionDto = z.infer<typeof CancelSubscriptionSchema>;

/**
 * Schema for creating setup intent
 */
export const CreateSetupIntentSchema = z.object({
  metadata: z.record(z.string()).optional(),
});

export type CreateSetupIntentDto = z.infer<typeof CreateSetupIntentSchema>;

/**
 * Schema for webhook event validation
 */
export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
  created: z.number(),
  livemode: z.boolean(),
});

export type WebhookEventDto = z.infer<typeof WebhookEventSchema>;

/**
 * Schema for invoice query parameters
 */
export const GetInvoicesSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  startingAfter: z.string().optional(),
  endingBefore: z.string().optional(),
});

export type GetInvoicesDto = z.infer<typeof GetInvoicesSchema>;

/**
 * Schema for updating subscription
 */
export const UpdateSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  priceId: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  metadata: z.record(z.string()).optional(),
  prorationBehavior: z
    .enum(['create_prorations', 'none', 'always_invoice'])
    .optional(),
});

export type UpdateSubscriptionDto = z.infer<typeof UpdateSubscriptionSchema>;

/**
 * Schema for creating customer
 */
export const CreateCustomerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  phone: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;

/**
 * Schema for payment intent parameters
 */
export const CreatePaymentIntentSchema = z.object({
  amount: z.number().int().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('usd'),
  paymentMethodId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  description: z.string().optional(),
});

export type CreatePaymentIntentDto = z.infer<typeof CreatePaymentIntentSchema>;

/**
 * Schema for retrieving payment method
 */
export const GetPaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export type GetPaymentMethodDto = z.infer<typeof GetPaymentMethodSchema>;

/**
 * Schema for listing prices/plans
 */
export const ListPricesSchema = z.object({
  productId: z.string().optional(),
  active: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 100)),
});

export type ListPricesDto = z.infer<typeof ListPricesSchema>;

/**
 * Schema for subscription status response
 */
export const SubscriptionStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
  ]),
  currentPeriodStart: z.number(),
  currentPeriodEnd: z.number(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.number().nullable(),
  trialStart: z.number().nullable(),
  trialEnd: z.number().nullable(),
});

export type SubscriptionStatusDto = z.infer<typeof SubscriptionStatusSchema>;

/**
 * Schema for detaching payment method
 */
export const DetachPaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export type DetachPaymentMethodDto = z.infer<typeof DetachPaymentMethodSchema>;

/**
 * Schema for retry invoice payment
 */
export const RetryInvoiceSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  paymentMethodId: z.string().optional(),
});

export type RetryInvoiceDto = z.infer<typeof RetryInvoiceSchema>;

/**
 * Schema for creating a charge (one-time payment)
 *
 * SECURITY: Amount is determined server-side based on referenceType and referenceId.
 * Client-provided amounts are only used for admin-initiated charges.
 * Normal users must provide a valid reference that maps to a server-side price.
 */
export const CreateChargeSchema = z.object({
  // SECURITY: Reference to what is being charged for (required for non-admin users)
  // The server will look up the price from this reference
  referenceType: z.enum(['appointment', 'service', 'product', 'custom']).optional(),
  referenceId: z.string().uuid().optional(),

  // SECURITY: Amount is ONLY accepted from admin users
  // For regular users, this field is ignored and price is fetched from database
  // Amount is in cents (e.g., 5000 = $50.00)
  amount: z.number().int().positive('Amount must be positive').optional(),

  currency: z.string().length(3, 'Currency must be 3 characters').default('usd'),
  paymentMethodId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  confirmImmediately: z.boolean().default(true),
}).refine(
  (data) => {
    // Either referenceType+referenceId must be provided, or amount for custom charges
    return (data.referenceType && data.referenceId) || data.amount !== undefined;
  },
  {
    message: 'Either referenceType with referenceId, or amount must be provided',
  }
);

export type CreateChargeDto = z.infer<typeof CreateChargeSchema>;

/**
 * Schema for refund parameters
 */
export const CreateRefundSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  amount: z.number().int().positive().optional(),
  reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
  metadata: z.record(z.string()).optional(),
});

export type CreateRefundDto = z.infer<typeof CreateRefundSchema>;

/**
 * Schema for payment history query parameters
 */
export const GetPaymentHistorySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  status: z
    .enum([
      'pending',
      'processing',
      'succeeded',
      'failed',
      'cancelled',
      'refunded',
      'partially_refunded',
    ])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetPaymentHistoryDto = z.infer<typeof GetPaymentHistorySchema>;

/**
 * Schema for saving payment method
 */
export const SavePaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  setAsDefault: z.boolean().default(false),
  billingAddress: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export type SavePaymentMethodDto = z.infer<typeof SavePaymentMethodSchema>;
