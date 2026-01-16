# Stripe Payment Integration

This document provides comprehensive information about the Stripe payment integration for the Unified Healthcare Platform.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup Instructions](#setup-instructions)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Webhooks](#webhooks)
9. [Testing](#testing)
10. [Security Considerations](#security-considerations)

## Overview

The Stripe integration provides complete subscription and billing management for the platform, including:
- Subscription creation and management
- Payment method handling
- Invoice management
- Webhook event processing

## Features

### Backend (API)
- Stripe customer creation and management
- Subscription lifecycle management
- Payment method attachment and updates
- Invoice retrieval and history
- Webhook event handling for real-time updates
- Secure payment processing

### Frontend (Web App)
- Payment form with Stripe Elements
- Plan selection interface
- Subscription status display
- Invoice history view
- Payment method management
- Responsive and accessible UI

## Architecture

### Backend Structure

```
services/api/src/
├── lib/
│   └── stripe.ts                 # Stripe client initialization and helper functions
├── dtos/
│   └── payment.dto.ts           # Validation schemas for payment operations
├── services/
│   └── payment.service.ts       # Business logic for payment operations
├── controllers/
│   └── payment.controller.ts    # HTTP request handlers
└── routes/
    └── index.ts                 # Route definitions (updated)
```

### Frontend Structure

```
apps/web/src/
├── components/billing/
│   ├── PaymentForm.tsx          # Stripe Elements payment form
│   ├── PlanSelector.tsx         # Plan selection UI
│   ├── InvoiceList.tsx          # Invoice history display
│   └── SubscriptionStatus.tsx   # Current subscription info
├── hooks/
│   └── usePayment.ts            # React hooks for payment operations
└── app/(dashboard)/billing/
    └── page.tsx                 # Main billing management page
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Backend (API)
cd services/api
npm install stripe

# Frontend (Web)
cd apps/web
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Configure Stripe Account

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Set up your products and pricing in Stripe Dashboard
4. Create a webhook endpoint in Stripe Dashboard

### 3. Set Environment Variables

Create or update `.env` files:

**Backend (`services/api/.env`):**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend (`apps/web/.env.local`):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Update Database Schema

Add `stripeCustomerId` field to User model (optional but recommended):

```prisma
model User {
  // ... existing fields
  stripeCustomerId String? @unique
}
```

Run migration:
```bash
cd services/api
npm run db:migrate
```

### 5. Configure Webhook in Stripe

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Environment Variables

### Required Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Backend | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Backend | Webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend | Stripe publishable key |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API URL |

## API Endpoints

### Payment Configuration
- `GET /api/payments/config` - Get Stripe publishable key

### Setup Intent
- `POST /api/payments/setup-intent` - Create setup intent for payment method

### Subscriptions
- `POST /api/payments/subscription` - Create new subscription
- `GET /api/payments/subscription` - Get current subscription
- `DELETE /api/payments/subscription` - Cancel subscription

### Payment Methods
- `POST /api/payments/payment-method` - Add/update payment method
- `GET /api/payments/payment-methods` - List payment methods
- `DELETE /api/payments/payment-method/:id` - Remove payment method

### Invoices
- `GET /api/payments/invoices` - List customer invoices

### Webhooks
- `POST /api/payments/webhook` - Stripe webhook endpoint

## Frontend Components

### PaymentForm

Secure credit card input form using Stripe Elements.

```tsx
import { PaymentForm } from '@/components/billing/PaymentForm';

<PaymentForm
  onSuccess={(paymentMethodId) => console.log('Payment method added:', paymentMethodId)}
  onError={(error) => console.error('Error:', error)}
  buttonText="Save Card"
/>
```

### PlanSelector

Display available subscription plans with selection interface.

```tsx
import { PlanSelector } from '@/components/billing/PlanSelector';

<PlanSelector
  plans={plans}
  currentPlanId={currentPlan?.id}
  onSelectPlan={handleSelectPlan}
/>
```

### SubscriptionStatus

Show current subscription details and actions.

```tsx
import { SubscriptionStatus } from '@/components/billing/SubscriptionStatus';

<SubscriptionStatus
  subscription={subscription}
  onCancelSubscription={handleCancel}
  onUpgrade={handleUpgrade}
/>
```

### InvoiceList

Display invoice history with download links.

```tsx
import { InvoiceList } from '@/components/billing/InvoiceList';

<InvoiceList
  invoices={invoices}
  loading={isLoading}
/>
```

## Webhooks

The webhook handler processes the following events:

### Subscription Events

- **customer.subscription.created** - New subscription created
- **customer.subscription.updated** - Subscription modified
- **customer.subscription.deleted** - Subscription canceled

### Invoice Events

- **invoice.payment_succeeded** - Payment successful
- **invoice.payment_failed** - Payment failed

### Trial Events

- **customer.subscription.trial_will_end** - Trial ending soon

### Webhook Signature Verification

All webhooks are verified using the `STRIPE_WEBHOOK_SECRET` to ensure authenticity.

## Testing

### Test Cards

Use Stripe test cards for development:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0027 6000 3184 | 3D Secure authentication |

### Test Mode

1. Use test API keys (prefix `sk_test_` and `pk_test_`)
2. Test webhook events using Stripe CLI:
```bash
stripe listen --forward-to localhost:4000/api/payments/webhook
stripe trigger customer.subscription.created
```

### Integration Testing

```bash
# Backend
cd services/api
npm run test

# Frontend
cd apps/web
npm run test
```

## Security Considerations

### Best Practices

1. **Never expose secret keys** - Keep `STRIPE_SECRET_KEY` server-side only
2. **Validate webhook signatures** - Always verify webhook authenticity
3. **Use HTTPS in production** - Required for PCI compliance
4. **Handle errors gracefully** - Don't expose sensitive error details
5. **Implement rate limiting** - Protect against abuse
6. **Log security events** - Monitor for suspicious activity

### PCI Compliance

- Stripe Elements handles card data collection
- Card information never touches your servers
- No PCI compliance burden on your infrastructure

### Data Protection

- Customer data is encrypted in transit (TLS)
- Payment methods are tokenized
- Sensitive data is never logged

## Usage Examples

### Creating a Subscription

```typescript
const { mutateAsync: createSubscription } = useCreateSubscription();

await createSubscription({
  priceId: 'price_xxx',
  paymentMethodId: 'pm_xxx',
  trialPeriodDays: 14,
});
```

### Adding a Payment Method

```typescript
const { mutateAsync: updatePaymentMethod } = useUpdatePaymentMethod();

await updatePaymentMethod({
  paymentMethodId: 'pm_xxx',
  setAsDefault: true,
});
```

### Canceling a Subscription

```typescript
const { mutateAsync: cancelSubscription } = useCancelSubscription();

await cancelSubscription({
  subscriptionId: 'sub_xxx',
  cancelAtPeriodEnd: true,
  reason: 'User requested cancellation',
});
```

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Ensure `STRIPE_WEBHOOK_SECRET` is correct
   - Check that request body is raw (not parsed)

2. **Payment method attachment fails**
   - Verify customer exists in Stripe
   - Check payment method is not already attached

3. **Subscription creation fails**
   - Ensure price ID is valid
   - Verify customer has valid payment method

### Debug Mode

Enable detailed logging:

```typescript
// In stripe.ts
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
  maxNetworkRetries: 2,
  telemetry: false, // Disable in production
});
```

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Elements Guide](https://stripe.com/docs/stripe-js)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

## Support

For issues or questions:
1. Check Stripe Dashboard logs
2. Review application logs
3. Consult Stripe documentation
4. Contact support team

---

**Last Updated:** 2025-12-17
**Version:** 1.0.0
