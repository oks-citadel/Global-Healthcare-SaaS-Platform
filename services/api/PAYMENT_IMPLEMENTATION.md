# Payment Endpoints Implementation

This document describes the complete payment system implementation for the Global Healthcare SaaS Platform.

## Overview

The payment system provides comprehensive payment processing capabilities using Stripe, including:
- One-time charges
- Subscription management
- Payment method management
- Refund processing
- Payment history tracking
- Webhook event handling

## Database Schema

### PaymentMethod Model
Stores user payment methods with the following fields:
- `id`: UUID primary key
- `userId`: Reference to user
- `stripePaymentMethodId`: Unique Stripe payment method ID
- `type`: Payment method type (card, bank_account, us_bank_account)
- `last4`: Last 4 digits of card/account
- `brand`: Card brand (visa, mastercard, etc.)
- `expiryMonth`: Card expiration month
- `expiryYear`: Card expiration year
- `isDefault`: Whether this is the default payment method
- `billingAddress`: JSON field for billing address

### Payment Model
Tracks all payment transactions:
- `id`: UUID primary key
- `userId`: Reference to user
- `paymentMethodId`: Optional reference to payment method used
- `stripePaymentIntentId`: Unique Stripe payment intent ID
- `amount`: Payment amount (Decimal)
- `currency`: Currency code (default: USD)
- `status`: Payment status (pending, processing, succeeded, failed, cancelled, refunded, partially_refunded)
- `description`: Payment description
- `metadata`: JSON field for additional data
- `failedReason`: Reason for payment failure
- `refundedAmount`: Amount refunded (Decimal)
- `refundedAt`: Timestamp of refund

### Invoice & InvoiceItem Models
Additional models for invoice management:
- `Invoice`: Complete invoice details with status tracking
- `InvoiceItem`: Line items for invoices

## API Endpoints

### 1. GET /api/payments/config
Get Stripe publishable key for client-side integration.

**Response:**
```json
{
  "publishableKey": "pk_test_..."
}
```

### 2. POST /api/payments/setup-intent
Create a setup intent for saving payment methods.

**Request Body:**
```json
{
  "metadata": {
    "customKey": "value"
  }
}
```

**Response:**
```json
{
  "clientSecret": "seti_...",
  "setupIntentId": "seti_..."
}
```

### 3. POST /api/payments/payment-method/save
Save a payment method to the database.

**Request Body:**
```json
{
  "paymentMethodId": "pm_...",
  "setAsDefault": true,
  "billingAddress": {
    "line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US"
  }
}
```

**Response:**
```json
{
  "paymentMethod": {
    "id": "uuid",
    "type": "card",
    "last4": "4242",
    "brand": "visa",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "isDefault": true
  },
  "message": "Payment method saved successfully"
}
```

### 4. GET /api/payments/payment-methods
List all payment methods for the authenticated user.

**Response:**
```json
{
  "paymentMethods": [
    {
      "id": "pm_...",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025
      },
      "created": 1234567890
    }
  ]
}
```

### 5. DELETE /api/payments/payment-methods/:id
Remove a payment method.

**Response:**
```json
{
  "message": "Payment method removed successfully"
}
```

### 6. POST /api/payments/charge
Create a one-time payment charge.

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "usd",
  "paymentMethodId": "pm_...",
  "description": "Consultation fee",
  "metadata": {
    "appointmentId": "uuid"
  },
  "confirmImmediately": true
}
```

**Response:**
```json
{
  "payment": {
    "id": "uuid",
    "amount": 50.00,
    "currency": "USD",
    "status": "succeeded",
    "description": "Consultation fee"
  },
  "clientSecret": "pi_..._secret_...",
  "message": "Charge created successfully"
}
```

### 7. GET /api/payments/history
Get payment history with optional filters.

**Query Parameters:**
- `limit`: Number of results (1-100, default: 20)
- `status`: Filter by status (pending, processing, succeeded, failed, cancelled, refunded, partially_refunded)
- `startDate`: Filter by start date (ISO 8601)
- `endDate`: Filter by end date (ISO 8601)

**Response:**
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 50.00,
      "currency": "USD",
      "status": "succeeded",
      "description": "Consultation fee",
      "paymentMethod": {
        "id": "pm_...",
        "type": "card",
        "last4": "4242",
        "brand": "visa"
      },
      "refundedAmount": null,
      "refundedAt": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 8. GET /api/payments/:id
Get detailed information about a specific payment.

**Response:**
```json
{
  "payment": {
    "id": "uuid",
    "amount": 50.00,
    "currency": "USD",
    "status": "succeeded",
    "description": "Consultation fee",
    "paymentMethod": {
      "id": "pm_...",
      "type": "card",
      "last4": "4242",
      "brand": "visa"
    },
    "refundedAmount": null,
    "refundedAt": null,
    "failureReason": null,
    "metadata": {},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 9. POST /api/payments/:id/refund
Refund a payment (full or partial).

**Request Body:**
```json
{
  "amount": 2500,
  "reason": "requested_by_customer",
  "metadata": {
    "refundReason": "Customer requested refund"
  }
}
```

**Response:**
```json
{
  "payment": {
    "id": "uuid",
    "amount": 50.00,
    "currency": "USD",
    "status": "partially_refunded",
    "refundedAmount": 25.00,
    "refundedAt": "2024-01-02T00:00:00Z"
  },
  "refund": {
    "id": "re_...",
    "amount": 25.00,
    "currency": "usd",
    "status": "succeeded",
    "reason": "requested_by_customer"
  },
  "message": "Payment refunded successfully"
}
```

## Webhook Events

The system handles the following Stripe webhook events:

### 1. payment_intent.succeeded
Triggered when a payment intent succeeds.
- Updates payment status to "succeeded"

### 2. payment_intent.payment_failed
Triggered when a payment intent fails.
- Updates payment status to "failed"
- Stores failure reason

### 3. payment_method.attached
Triggered when a payment method is attached to a customer.
- Logs the event (custom logic can be added)

### 4. charge.refunded
Triggered when a charge is refunded.
- Updates payment status to "refunded" or "partially_refunded"
- Records refunded amount and timestamp

### 5. customer.subscription.created/updated
Handles subscription lifecycle events.

### 6. customer.subscription.deleted
Handles subscription cancellation.

### 7. invoice.payment_succeeded
Handles successful invoice payments.

### 8. invoice.payment_failed
Handles failed invoice payments.

## Stripe Helper Functions

New helper functions added to `src/lib/stripe.ts`:

### Payment Intent Functions
- `createPaymentIntent`: Create a new payment intent
- `getPaymentIntent`: Retrieve a payment intent
- `confirmPaymentIntent`: Confirm a payment intent
- `cancelPaymentIntent`: Cancel a payment intent

### Refund Functions
- `createRefund`: Create a refund for a payment
- `getRefund`: Retrieve refund details

### Charge Functions
- `listCustomerCharges`: List charges for a customer
- `getCharge`: Get details of a specific charge

## Service Methods

New methods added to `PaymentService`:

### 1. createCharge
Create a one-time payment charge.

### 2. getPayment
Get detailed payment information with real-time Stripe data sync.

### 3. getPaymentHistory
Get paginated payment history with filtering options.

### 4. refundPayment
Process full or partial refunds with validation.

### 5. savePaymentMethod
Save and manage payment methods in the database.

### Private Helper Methods
- `mapStripePaymentStatus`: Maps Stripe payment statuses to internal statuses
- `handlePaymentIntentSucceeded`: Webhook handler for successful payments
- `handlePaymentIntentFailed`: Webhook handler for failed payments
- `handlePaymentMethodAttached`: Webhook handler for payment method attachment
- `handleChargeRefunded`: Webhook handler for refunds

## DTO Schemas

New validation schemas added to `src/dtos/payment.dto.ts`:

### CreateChargeSchema
Validates one-time charge requests:
- `amount`: Integer, positive (in cents)
- `currency`: 3-character currency code
- `paymentMethodId`: Optional Stripe payment method ID
- `description`: Optional description
- `metadata`: Optional metadata object
- `confirmImmediately`: Boolean, default true

### CreateRefundSchema
Validates refund requests:
- `paymentId`: Required payment ID
- `amount`: Optional amount (full refund if not specified)
- `reason`: Optional enum (duplicate, fraudulent, requested_by_customer)
- `metadata`: Optional metadata object

### GetPaymentHistorySchema
Validates payment history query parameters:
- `limit`: Integer, 1-100, default 20
- `status`: Optional status filter
- `startDate`: Optional ISO date string
- `endDate`: Optional ISO date string

### SavePaymentMethodSchema
Validates payment method save requests:
- `paymentMethodId`: Required Stripe payment method ID
- `setAsDefault`: Boolean, default false
- `billingAddress`: Optional address object

## Error Handling

All endpoints include comprehensive error handling:

### Common Error Responses

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "error": "Failed to get payment",
  "message": "Payment not found or does not belong to user"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to create charge",
  "message": "Detailed error message"
}
```

## Security Considerations

1. **Authentication Required**: All payment endpoints (except config and webhook) require authentication
2. **User Isolation**: All operations verify that resources belong to the authenticated user
3. **Webhook Signature Verification**: Webhooks verify Stripe signatures using the webhook secret
4. **Sensitive Data**: Payment methods store only last4 digits, not full card numbers
5. **PCI Compliance**: Card data never touches the server (handled by Stripe.js)

## Integration Guide

### Client-Side Integration

1. **Load Stripe.js:**
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_test_...');
```

2. **Create Setup Intent (Save Card):**
```javascript
const response = await fetch('/api/payments/setup-intent', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const { clientSecret } = await response.json();

const { error } = await stripe.confirmCardSetup(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: 'Customer Name' }
  }
});
```

3. **Create Charge:**
```javascript
const response = await fetch('/api/payments/charge', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'usd',
    paymentMethodId: 'pm_...',
    description: 'Consultation fee'
  })
});
```

### Server-Side Integration

All endpoints are registered in `src/routes/index.ts` and use the `authenticate` middleware for protection.

## Testing

### Test Cards
Use Stripe test cards for testing:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

### Webhook Testing
Use Stripe CLI for webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## Environment Variables

Required environment variables:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

## Migration Commands

To apply the database schema changes:
```bash
npx prisma generate
npx prisma migrate dev --name add_payment_models
```

## Support

For issues or questions:
1. Check Stripe dashboard for payment details
2. Review application logs for errors
3. Verify webhook events are being received
4. Confirm environment variables are set correctly
