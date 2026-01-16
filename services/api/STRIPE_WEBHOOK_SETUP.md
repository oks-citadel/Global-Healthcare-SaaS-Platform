# Stripe Webhook Setup Guide

This guide explains how to configure and use Stripe webhooks for the Healthcare Platform payment system.

## Overview

The Stripe webhook implementation provides:

- **Webhook signature verification** using `STRIPE_WEBHOOK_SECRET`
- **Idempotency handling** to prevent duplicate processing
- **Database updates** for payment records
- **Email/SMS notifications** for payment events
- **Error handling and logging** with structured logging
- **Retry logic** with exponential backoff for failed operations

## Webhook Events Handled

The system handles the following Stripe webhook events:

### Payment Intent Events
- `payment_intent.succeeded` - Mark payment complete, update subscription
- `payment_intent.payment_failed` - Handle failed payments, notify user
- `payment_intent.created` - Log payment intent creation
- `payment_intent.canceled` - Mark payment as canceled
- `payment_intent.processing` - Update payment status to processing

### Subscription Events
- `customer.subscription.created` - Activate subscription, send welcome email
- `customer.subscription.updated` - Handle plan changes, update database
- `customer.subscription.deleted` - Handle cancellations, notify user
- `customer.subscription.trial_will_end` - Send trial ending reminders

### Invoice Events
- `invoice.paid` - Record successful invoice payment
- `invoice.payment_failed` - Handle failed invoice payments, notify user
- `invoice.payment_succeeded` - Same as invoice.paid
- `invoice.upcoming` - Send upcoming payment notifications

### Charge Events
- `charge.refunded` - Process refunds, update payment records
- `charge.succeeded` - Log successful charge
- `charge.failed` - Log failed charge
- `charge.dispute.created` - Alert admin team about disputes

### Payment Method Events
- `payment_method.attached` - Log payment method attachment
- `payment_method.detached` - Log payment method detachment
- `payment_method.automatically_updated` - Notify user of automatic updates

## Setup Instructions

### 1. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin Email for Dispute Notifications
ADMIN_EMAIL=admin@yourdomain.com
```

### 2. Get Webhook Secret from Stripe

#### For Development (Stripe CLI)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.15.0/stripe_1.15.0_linux_x86_64.tar.gz
   tar -xvf stripe_1.15.0_linux_x86_64.tar.gz
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/webhooks/stripe
   ```

4. Copy the webhook signing secret (`whsec_...`) to your `.env` file

#### For Production

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)

2. Click "Add endpoint"

3. Enter your production URL:
   ```
   https://your-domain.com/webhooks/stripe
   ```

4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `charge.refunded`

   Or select "Select all events" for comprehensive coverage

5. Click "Add endpoint"

6. Copy the "Signing secret" (`whsec_...`) to your production environment variables

### 3. Configure Express for Raw Body Parsing

The webhook endpoint requires raw body parsing for signature verification. Update your main application file:

```typescript
// app.ts or server.ts

import express from 'express';
import { routes } from './routes/index.js';

const app = express();

// IMPORTANT: Add raw body parsing BEFORE JSON middleware for webhook route
app.use(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' })
);

// Then add JSON middleware for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api', routes);

export default app;
```

### 4. Run Database Migration

Create the webhook event log table:

```bash
cd services/api
npx prisma migrate dev --name add_webhook_event_log
```

### 5. Test Webhook Integration

#### Using Stripe CLI

```bash
# Trigger a test payment_intent.succeeded event
stripe trigger payment_intent.succeeded

# Trigger a test customer.subscription.created event
stripe trigger customer.subscription.created

# Trigger a test invoice.payment_failed event
stripe trigger invoice.payment_failed
```

#### Using Stripe Dashboard

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select an event type and click "Send test webhook"

### 6. Monitor Webhook Events

#### Check Webhook Logs

View webhook events in your database:

```sql
SELECT * FROM "WebhookEventLog"
ORDER BY "createdAt" DESC
LIMIT 10;
```

#### Check Application Logs

```bash
# View real-time logs
docker-compose logs -f api

# Or if running locally
npm run dev
```

#### Check Stripe Dashboard

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your webhook endpoint
3. View "Recent deliveries" to see all webhook attempts

## Webhook Processing Flow

```
1. Stripe sends webhook event → POST /webhooks/stripe
                                  ↓
2. Verify webhook signature using STRIPE_WEBHOOK_SECRET
                                  ↓
3. Check for duplicate event (idempotency) using eventId
                                  ↓
4. Log event to WebhookEventLog table (status: pending)
                                  ↓
5. Process webhook event with retry logic (3 attempts)
                                  ↓
6. Update payment/subscription records in database
                                  ↓
7. Send email/SMS notifications to users
                                  ↓
8. Update WebhookEventLog (status: succeeded/failed)
                                  ↓
9. Return 200 OK to Stripe (acknowledge receipt)
```

## Error Handling

### Signature Verification Failed

**Error**: `Webhook signature verification failed`

**Cause**: Invalid webhook secret or tampered request

**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check that raw body parsing is configured correctly
- Ensure the webhook is coming from Stripe (check IP address)

### Database Connection Error

**Error**: `Database operation failed after all retries`

**Cause**: Database connection issues or timeouts

**Solution**:
- Check database connection string
- Verify database is running
- Check database logs for errors
- The webhook will be retried by Stripe automatically

### Duplicate Event

**Error**: `Event already processed (duplicate)`

**Cause**: Stripe sent the same event multiple times

**Solution**:
- This is handled automatically by idempotency checking
- Returns 200 OK to Stripe to prevent further retries
- No action needed

## Retry Logic

### Automatic Retries

The webhook handler implements automatic retries with exponential backoff:

1. **First attempt**: Immediate
2. **Retry 1**: After 2 seconds
3. **Retry 2**: After 4 seconds
4. **Retry 3**: After 8 seconds

### Stripe Retries

If the webhook endpoint returns a non-200 status code, Stripe will automatically retry:

- Immediate retry
- After 1 hour
- After 3 hours
- After 6 hours
- After 12 hours
- After 24 hours

Total retry period: ~3 days

## Security Best Practices

### 1. Always Verify Webhook Signatures

```typescript
// ✅ GOOD - Signature verification enabled
const event = stripe.webhooks.constructEvent(
  payload,
  signature,
  webhookSecret
);

// ❌ BAD - No signature verification
const event = JSON.parse(payload);
```

### 2. Use HTTPS in Production

Always use HTTPS for webhook endpoints in production:

```
✅ https://your-domain.com/webhooks/stripe
❌ http://your-domain.com/webhooks/stripe
```

### 3. Implement Idempotency

The system automatically prevents duplicate event processing using the `eventId`:

```typescript
// Check if event was already processed
const existingLog = await prisma.webhookEventLog.findUnique({
  where: { eventId: event.id }
});
```

### 4. Validate Event Data

Always validate webhook data before processing:

```typescript
const userId = paymentIntent.metadata.userId;
if (!userId) {
  logger.warn('Payment intent has no userId in metadata');
  return;
}
```

### 5. Use Environment Variables

Never hardcode secrets:

```typescript
// ✅ GOOD
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ❌ BAD
const webhookSecret = 'whsec_abc123...';
```

## Monitoring and Alerting

### 1. Monitor Webhook Success Rate

Query webhook event logs:

```sql
-- Success rate in last 24 hours
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM "WebhookEventLog"
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

### 2. Monitor Failed Webhooks

```sql
-- Failed webhooks in last hour
SELECT
  "eventId",
  "eventType",
  "error",
  "retryCount",
  "createdAt"
FROM "WebhookEventLog"
WHERE status = 'failed'
  AND "createdAt" > NOW() - INTERVAL '1 hour'
ORDER BY "createdAt" DESC;
```

### 3. Set Up Alerts

Configure alerts for:
- Webhook failure rate > 5%
- Webhook processing time > 5 seconds
- Dispute created events
- Payment failure rate > 10%

### 4. Health Check Endpoint

Use the health check endpoint to verify webhook configuration:

```bash
curl https://your-domain.com/webhooks/stripe/health
```

Response:
```json
{
  "status": "healthy",
  "configured": true,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Troubleshooting

### Webhooks Not Received

1. Check webhook endpoint URL is correct
2. Verify endpoint is publicly accessible (not localhost)
3. Check firewall rules allow incoming requests from Stripe
4. Verify HTTPS certificate is valid

### Webhooks Failing

1. Check application logs for errors
2. Verify database connection is working
3. Check `STRIPE_WEBHOOK_SECRET` is correct
4. Verify raw body parsing is configured

### Notifications Not Sent

1. Check email/SMS service configuration
2. Verify user has valid email/phone number
3. Check email/SMS service logs
4. Verify templates exist in `templates` directory

## Testing Checklist

- [ ] Webhook signature verification works
- [ ] Payment intent succeeded updates payment status
- [ ] Payment intent failed sends notification
- [ ] Subscription created sends welcome email
- [ ] Subscription updated updates database
- [ ] Subscription deleted sends cancellation email
- [ ] Invoice paid sends receipt
- [ ] Invoice payment failed sends failure notification
- [ ] Charge refunded updates payment and sends notification
- [ ] Duplicate events are handled correctly
- [ ] Failed webhooks retry with exponential backoff
- [ ] Webhook events are logged to database
- [ ] Health check endpoint returns status

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Stripe Testing Webhooks](https://stripe.com/docs/webhooks/test)

## Support

For issues or questions:
1. Check application logs
2. Check Stripe Dashboard webhook deliveries
3. Review this documentation
4. Contact the development team
