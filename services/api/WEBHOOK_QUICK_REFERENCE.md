# Stripe Webhook Quick Reference

## Quick Start

### 1. Environment Setup

```bash
# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_EMAIL=admin@yourdomain.com
```

### 2. Local Development

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/webhooks/stripe

# Copy the webhook secret to .env
```

### 3. Database Migration

```bash
cd services/api
npx prisma migrate dev --name add_webhook_event_log
```

### 4. Express Configuration

```typescript
// app.ts - Add BEFORE express.json()
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());
```

## Webhook Events Handled

| Event | Action | Notification |
|-------|--------|--------------|
| `payment_intent.succeeded` | Update payment to succeeded | Email: payment-success.html |
| `payment_intent.payment_failed` | Update payment to failed | Email: payment-failed.html |
| `customer.subscription.created` | Create subscription | Email: subscription-welcome.html |
| `customer.subscription.updated` | Update subscription | Email: subscription-updated.html |
| `customer.subscription.deleted` | Cancel subscription | Email: subscription-canceled.html |
| `customer.subscription.trial_will_end` | Send reminder | Email + SMS: trial-ending |
| `invoice.paid` | Record payment | Email: payment-receipt.html |
| `invoice.payment_failed` | Mark past_due | Email: payment-failed.html |
| `invoice.upcoming` | Send reminder | Email: upcoming-invoice.html |
| `charge.refunded` | Update refund | Email: refund-processed.html |
| `charge.dispute.created` | Alert admin | Email to admin |

## Testing

### Trigger Test Events

```bash
# Payment intent events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed

# Subscription events
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted

# Invoice events
stripe trigger invoice.paid
stripe trigger invoice.payment_failed

# Charge events
stripe trigger charge.refunded
```

### Run Tests

```bash
npm test tests/webhooks/stripe-webhook.test.ts
```

## Monitoring

### Check Webhook Logs

```sql
-- Recent webhooks
SELECT * FROM "WebhookEventLog"
ORDER BY "createdAt" DESC
LIMIT 10;

-- Failed webhooks
SELECT * FROM "WebhookEventLog"
WHERE status = 'failed'
ORDER BY "createdAt" DESC;

-- Success rate (last 24h)
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM "WebhookEventLog"
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

### Check Logs

```bash
# Docker
docker-compose logs -f api

# Local
npm run dev
```

### Health Check

```bash
curl http://localhost:3000/webhooks/stripe/health
```

## Troubleshooting

### Signature Verification Failed

**Issue:** `Webhook signature verification failed`

**Fix:**
1. Check `STRIPE_WEBHOOK_SECRET` is correct
2. Verify raw body parsing is configured
3. Test with Stripe CLI: `stripe listen --print-secret`

### Webhooks Not Received

**Issue:** Webhooks not reaching the endpoint

**Fix:**
1. Check webhook URL in Stripe Dashboard
2. Verify endpoint is publicly accessible
3. Check firewall rules
4. Test with `curl -X POST http://localhost:3000/webhooks/stripe/health`

### Payment Not Updating

**Issue:** Payment status not updating in database

**Fix:**
1. Check webhook event log: `SELECT * FROM "WebhookEventLog" WHERE "eventId" = 'evt_...'`
2. Verify payment has correct `stripePaymentIntentId`
3. Check logs for errors
4. Verify `userId` in payment metadata

### Duplicate Events

**Issue:** Receiving same webhook multiple times

**Fix:** This is handled automatically by idempotency checking. No action needed.

## Common Patterns

### Add Metadata to Payments

```typescript
// Always include userId in metadata
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'usd',
  metadata: {
    userId: user.id,
    // other metadata
  },
});
```

### Add Metadata to Subscriptions

```typescript
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  metadata: {
    userId: user.id,
    // other metadata
  },
});
```

### Test Webhook Locally

```typescript
// tests/webhooks/stripe-webhook.test.ts
const event = {
  id: 'evt_test',
  type: 'payment_intent.succeeded',
  data: {
    object: {
      id: 'pi_test',
      amount: 1000,
      currency: 'usd',
      metadata: { userId: 'user_123' },
    },
  },
};

await request(app)
  .post('/webhooks/stripe')
  .set('stripe-signature', signature)
  .send(JSON.stringify(event));
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migration run
- [ ] Raw body parsing configured
- [ ] Webhook endpoint added to Stripe Dashboard
- [ ] Webhook secret copied to production env
- [ ] Email templates exist
- [ ] Health check endpoint accessible
- [ ] Monitoring and alerts configured
- [ ] Tests passing
- [ ] Documentation reviewed

## Useful Commands

```bash
# View recent webhook deliveries in Stripe Dashboard
open https://dashboard.stripe.com/webhooks

# Retry failed webhook from Stripe CLI
stripe webhooks resend evt_xxx

# View webhook event details
stripe events retrieve evt_xxx

# List recent events
stripe events list --limit 10

# Generate migration
npx prisma migrate dev --name add_webhook_event_log

# Generate Prisma client
npx prisma generate

# View database records
npx prisma studio
```

## File Locations

```
services/api/
├── src/
│   ├── routes/
│   │   └── webhooks/
│   │       └── stripe.ts              # Webhook route
│   ├── services/
│   │   └── stripe-webhook.service.ts  # Webhook processor
│   ├── lib/
│   │   ├── stripe.ts                  # Stripe client
│   │   ├── email.ts                   # Email service
│   │   └── sms.ts                     # SMS service
│   └── templates/
│       └── emails/                    # Email templates
├── tests/
│   └── webhooks/
│       └── stripe-webhook.test.ts     # Tests
├── prisma/
│   └── schema.prisma                  # Database schema
├── STRIPE_WEBHOOK_SETUP.md            # Full setup guide
├── WEBHOOK_IMPLEMENTATION_SUMMARY.md  # Implementation details
└── WEBHOOK_QUICK_REFERENCE.md         # This file
```

## Key URLs

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Stripe CLI Docs:** https://stripe.com/docs/stripe-cli
- **Webhook Docs:** https://stripe.com/docs/webhooks
- **API Docs:** https://stripe.com/docs/api

## Support

For help:
1. Check logs
2. Check Stripe Dashboard
3. Review documentation
4. Check database WebhookEventLog table
5. Contact development team

---

**Last Updated:** 2025-12-18

**Version:** 1.0.0

**Status:** Production Ready ✅
