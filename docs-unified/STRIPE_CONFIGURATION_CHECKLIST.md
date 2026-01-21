# Stripe Integration Configuration Checklist

## Overview
This checklist ensures proper configuration of Stripe for the Unified Health Platform, including payment processing, subscriptions, and webhook handling.

---

## Prerequisites

- [ ] Stripe account created (https://dashboard.stripe.com/register)
- [ ] Business verification completed (for production)
- [ ] Bank account connected for payouts
- [ ] Tax information submitted

---

## 1. API Keys Configuration

### Development/Testing
- [ ] Obtain test mode API keys from Stripe Dashboard
  - Navigate to: Developers > API keys
  - Copy "Publishable key" (starts with `pk_test_`)
  - Copy "Secret key" (starts with sk_test_)

### Production
- [ ] Obtain live mode API keys
  - Switch to "Live mode" in Stripe Dashboard
  - Navigate to: Developers > API keys
  - Copy "Publishable key" (starts with pk_live_)
  - Copy "Secret key" (starts with sk_live_)

### Environment Variables
Add to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=<your-stripe-test-secret-key>
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

**Security Notes:**
- Never commit API keys to version control
- Rotate keys if exposed
- Use different keys for development/staging/production
- Restrict API key permissions to minimum required

---

## 2. Webhook Configuration

### Create Webhook Endpoint

1. Navigate to: Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL:
   - Development: `https://your-ngrok-url.ngrok.io/api/v1/payments/webhook`
   - Staging: `https://staging.yourplatform.com/api/v1/payments/webhook`
   - Production: `https://api.yourplatform.com/api/v1/payments/webhook`

### Select Events to Listen To

#### Critical Events (Required)
- [ ] `customer.subscription.created`
- [ ] `customer.subscription.updated`
- [ ] `customer.subscription.deleted`
- [ ] `customer.subscription.trial_will_end`
- [ ] `invoice.payment_succeeded`
- [ ] `invoice.payment_failed`
- [ ] `payment_intent.succeeded`
- [ ] `payment_intent.payment_failed`

#### Recommended Events
- [ ] `customer.subscription.paused`
- [ ] `customer.subscription.resumed`
- [ ] `invoice.created`
- [ ] `invoice.finalized`
- [ ] `invoice.upcoming`
- [ ] `invoice.voided`
- [ ] `payment_intent.created`
- [ ] `payment_intent.canceled`
- [ ] `payment_intent.processing`
- [ ] `payment_intent.requires_action`
- [ ] `payment_method.attached`
- [ ] `payment_method.detached`
- [ ] `payment_method.updated`
- [ ] `payment_method.automatically_updated`

#### Risk Management Events
- [ ] `charge.succeeded`
- [ ] `charge.failed`
- [ ] `charge.refunded`
- [ ] `charge.dispute.created`
- [ ] `charge.dispute.closed`
- [ ] `charge.dispute.updated`
- [ ] `radar.early_fraud_warning.created`

#### Customer Events
- [ ] `customer.created`
- [ ] `customer.updated`
- [ ] `customer.deleted`

#### Checkout Events
- [ ] `checkout.session.completed`
- [ ] `checkout.session.expired`

### Webhook Configuration
- [ ] API version: Use latest or `2023-10-16`
- [ ] Copy webhook signing secret (starts with `whsec_`)
- [ ] Add to `.env` as `STRIPE_WEBHOOK_SECRET`

### Testing Webhooks Locally

Use Stripe CLI for local webhook testing:

```bash
# Install Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows (via Scoop)
scoop install stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/v1/payments/webhook

# Trigger test webhooks
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
```

---

## 3. Products and Pricing Setup

### Create Products

1. Navigate to: Products > Add product
2. For each subscription tier:

#### Basic Plan
- [ ] Name: "Healthcare Basic"
- [ ] Description: "Essential healthcare features"
- [ ] Pricing: Recurring
  - [ ] Price: $29/month
  - [ ] Billing period: Monthly
  - [ ] Price ID: Save for environment variables

#### Professional Plan
- [ ] Name: "Healthcare Professional"
- [ ] Description: "Advanced features for healthcare professionals"
- [ ] Pricing: Recurring
  - [ ] Price: $79/month
  - [ ] Billing period: Monthly
  - [ ] Price ID: Save for environment variables

#### Enterprise Plan
- [ ] Name: "Healthcare Enterprise"
- [ ] Description: "Full-featured enterprise solution"
- [ ] Pricing: Custom or Recurring
  - [ ] Price: $299/month
  - [ ] Billing period: Monthly
  - [ ] Price ID: Save for environment variables

### Annual Billing (Optional)
- [ ] Create annual variants with 20% discount
- [ ] Link to same product
- [ ] Save annual price IDs

### Add to Environment Variables

```bash
STRIPE_BASIC_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PROFESSIONAL_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
```

---

## 4. Customer Portal Configuration

Enable customer self-service:

1. Navigate to: Settings > Billing > Customer portal
2. Configure settings:
   - [ ] Enable subscription management
   - [ ] Enable payment method updates
   - [ ] Enable invoice history
   - [ ] Configure cancellation behavior
   - [ ] Set branding (logo, colors)
   - [ ] Configure business information

### Cancellation Flow
- [ ] Immediate cancellation vs. end of period
- [ ] Cancellation reasons (survey)
- [ ] Retention offers (optional)

---

## 5. Payment Methods Configuration

### Supported Payment Methods
- [ ] Cards (Visa, Mastercard, Amex, Discover)
- [ ] ACH Direct Debit (US only)
- [ ] SEPA Direct Debit (Europe)
- [ ] Additional methods as needed

### Card Settings
- [ ] Enable 3D Secure (SCA compliance)
- [ ] Configure radar rules for fraud prevention
- [ ] Set up decline codes handling

---

## 6. Email Notifications

### Stripe Email Settings
Navigate to: Settings > Emails

- [ ] Successful payments
- [ ] Failed payments
- [ ] Upcoming invoice
- [ ] Customer receipts
- [ ] Subscription canceled
- [ ] Trial ending

**Note:** You can disable Stripe emails if using custom email templates (recommended for branding).

---

## 7. Tax Configuration

### Tax Calculation
- [ ] Enable Stripe Tax (Settings > Tax)
- [ ] Configure tax behavior
  - [ ] Inclusive vs. exclusive pricing
  - [ ] Default tax behavior
- [ ] Add tax IDs for your business

### Customer Tax IDs
- [ ] Allow customers to provide tax IDs
- [ ] Validate tax IDs
- [ ] Display on invoices

---

## 8. Security & Compliance

### PCI Compliance
- [ ] Use Stripe Elements for card collection (SAQ A)
- [ ] Never handle raw card data
- [ ] Implement HTTPS everywhere

### HIPAA Compliance (Healthcare Specific)
- [ ] Sign Stripe BAA (Business Associate Agreement)
  - Contact Stripe support to request BAA
  - Required for healthcare PHI handling
- [ ] Enable enhanced security features
- [ ] Configure audit logging

### Fraud Prevention
- [ ] Enable Stripe Radar
- [ ] Configure risk scoring
- [ ] Set up 3D Secure
- [ ] Review and adjust rules regularly

### Data Handling
- [ ] Comply with GDPR (if applicable)
- [ ] Implement data retention policies
- [ ] Set up customer data export
- [ ] Configure data deletion workflows

---

## 9. Testing

### Test Cards

Use these test card numbers in test mode:

| Scenario | Card Number | CVV | Expiry |
|----------|-------------|-----|--------|
| Success | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Declined | 4000 0000 0000 0002 | Any 3 digits | Any future date |
| Insufficient Funds | 4000 0000 0000 9995 | Any 3 digits | Any future date |
| 3D Secure | 4000 0027 6000 3184 | Any 3 digits | Any future date |

### Test Scenarios
- [ ] Successful subscription creation
- [ ] Payment method update
- [ ] Subscription cancellation
- [ ] Failed payment handling
- [ ] Trial period expiration
- [ ] Refund processing
- [ ] Webhook event handling
- [ ] Invoice generation

### Test Webhooks
```bash
# Test subscription creation
stripe trigger customer.subscription.created

# Test payment success
stripe trigger invoice.payment_succeeded

# Test payment failure
stripe trigger invoice.payment_failed

# Test trial ending
stripe trigger customer.subscription.trial_will_end
```

---

## 10. Monitoring & Alerts

### Dashboard Monitoring
- [ ] Monitor payment success rate
- [ ] Track failed payments
- [ ] Monitor dispute rate
- [ ] Review customer churn

### Alerts Setup
- [ ] Failed payment alerts
- [ ] Dispute alerts
- [ ] High-value transaction alerts
- [ ] Webhook failure alerts

### Logging
- [ ] Enable webhook logs
- [ ] Monitor API error rates
- [ ] Track integration errors
- [ ] Set up error alerting (Sentry, etc.)

---

## 11. Production Readiness

### Pre-Launch Checklist
- [ ] Switch to live mode API keys
- [ ] Update webhook URLs to production
- [ ] Test payment flow end-to-end
- [ ] Verify email notifications
- [ ] Test subscription lifecycle
- [ ] Verify refund process
- [ ] Review error handling

### Go-Live Tasks
- [ ] Update environment variables
- [ ] Enable production webhooks
- [ ] Activate customer portal
- [ ] Test with small transaction
- [ ] Monitor for 24 hours

### Post-Launch
- [ ] Daily monitoring for first week
- [ ] Review webhook success rate
- [ ] Monitor payment failure rate
- [ ] Check customer support tickets
- [ ] Optimize based on metrics

---

## 12. Maintenance

### Regular Tasks

#### Daily
- [ ] Monitor failed payments
- [ ] Check webhook delivery status
- [ ] Review fraud alerts

#### Weekly
- [ ] Review payment analytics
- [ ] Check subscription metrics
- [ ] Monitor churn rate
- [ ] Review dispute status

#### Monthly
- [ ] Reconcile payouts
- [ ] Review fee structure
- [ ] Update pricing if needed
- [ ] Audit user permissions

#### Quarterly
- [ ] Review integration health
- [ ] Update API version if needed
- [ ] Optimize webhook handlers
- [ ] Review security settings

---

## Support Resources

- Stripe Documentation: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Stripe Support: https://support.stripe.com
- Status Page: https://status.stripe.com
- Community: https://stripe.com/community

---

## Troubleshooting

### Common Issues

#### Webhooks Not Received
1. Check webhook endpoint is accessible
2. Verify webhook secret is correct
3. Check webhook event selection
4. Review webhook logs in Stripe Dashboard

#### Payment Failures
1. Check card details
2. Verify sufficient funds
3. Review Radar blocks
4. Check 3D Secure settings

#### Subscription Issues
1. Verify price ID is correct
2. Check customer has payment method
3. Review subscription status
4. Check for past-due invoices

---

## Compliance Checklist

### Healthcare-Specific Requirements
- [ ] Stripe BAA signed
- [ ] HIPAA compliance verified
- [ ] PHI handling procedures documented
- [ ] Audit logging enabled
- [ ] Data encryption verified
- [ ] Access controls implemented
- [ ] Incident response plan in place

### General Compliance
- [ ] PCI DSS compliance maintained
- [ ] GDPR compliance (if applicable)
- [ ] SOC 2 audit reviewed
- [ ] Data processing agreement signed
- [ ] Privacy policy updated
- [ ] Terms of service updated

---

## Rollback Plan

In case of issues:

1. Keep old API keys active initially
2. Maintain webhook endpoint versioning
3. Have database backup ready
4. Document rollback procedure
5. Test rollback in staging first

---

**Last Updated:** 2025-12-17
**Version:** 1.0
**Maintained By:** Integration Team
