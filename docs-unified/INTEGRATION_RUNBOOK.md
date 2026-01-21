# Third-Party Integration Runbook

## Overview
This runbook provides comprehensive setup, configuration, and operational instructions for all third-party service integrations in the Unified Health Platform.

---

## Table of Contents
1. [Quick Start](#1-quick-start)
2. [Stripe Payment Integration](#2-stripe-payment-integration)
3. [SendGrid Email Integration](#3-sendgrid-email-integration)
4. [Twilio SMS/Voice Integration](#4-twilio-smsvoice-integration)
5. [Firebase Cloud Messaging](#5-firebase-cloud-messaging)
6. [Testing Integrations](#6-testing-integrations)
7. [Monitoring & Maintenance](#7-monitoring--maintenance)
8. [Troubleshooting](#8-troubleshooting)
9. [Disaster Recovery](#9-disaster-recovery)

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ installed
- Access to AWS/production environment
- Admin access to all third-party services
- Environment variables configured

### Initial Setup Checklist
- [ ] Clone repository
- [ ] Install dependencies: `pnpm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Configure all API keys
- [ ] Run integration tests
- [ ] Verify all services are operational

### Environment Variables Required

```bash
# Stripe
STRIPE_SECRET_KEY=<your-stripe-test-secret-key>
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=UnifiedHealth Platform
ADMIN_EMAIL=admin@yourdomain.com

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# OR
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccount.json

# Application
APP_URL=https://app.thetheunifiedhealth.com
```

---

## 2. Stripe Payment Integration

### 2.1 Initial Setup

#### Step 1: Account Creation
1. Create Stripe account at https://dashboard.stripe.com/register
2. Complete business verification
3. Connect bank account for payouts
4. Submit tax information

#### Step 2: API Keys
1. Navigate to Developers > API keys
2. Copy both publishable and secret keys
3. Add to environment variables
4. **Important**: Use test keys for development/staging

#### Step 3: Webhook Setup
1. Navigate to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/v1/payments/webhook`
3. Select all subscription, invoice, and payment events
4. Copy webhook signing secret
5. Add to environment variables

### 2.2 Product & Pricing Configuration

Create subscription plans in Stripe Dashboard:

```bash
# Basic Plan
Name: Healthcare Basic
Price: $29/month
Price ID: price_xxxxxxxxxxxxx

# Professional Plan
Name: Healthcare Professional
Price: $79/month
Price ID: price_xxxxxxxxxxxxx

# Enterprise Plan
Name: Healthcare Enterprise
Price: $299/month
Price ID: price_xxxxxxxxxxxxx
```

### 2.3 Testing

Run Stripe integration tests:

```bash
# Set test email
export TEST_EMAIL=your-email@example.com

# Run Stripe tests
npm run test:stripe

# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
stripe trigger payment_intent.succeeded
```

### 2.4 Going Live

1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint to production URL
4. Test with small real transaction
5. Monitor for 24 hours

### 2.5 Webhook Event Handling

The platform handles these critical webhook events:

**Subscription Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `customer.subscription.paused`
- `customer.subscription.resumed`

**Payment Events:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Risk Management:**
- `charge.dispute.created`
- `charge.dispute.closed`

See `STRIPE_CONFIGURATION_CHECKLIST.md` for detailed configuration.

---

## 3. SendGrid Email Integration

### 3.1 Initial Setup

#### Step 1: Account Creation
1. Sign up at https://signup.sendgrid.com/
2. Choose appropriate plan (Free for development, Essentials+ for production)
3. Verify email address
4. Complete identity verification

#### Step 2: API Key Generation
1. Navigate to Settings > API Keys
2. Create API key with appropriate permissions:
   - Mail Send: Full Access
   - Stats: Read Access
   - Webhooks: Read and Write Access
3. Copy API key immediately
4. Add to environment variables

#### Step 3: Domain Authentication

**DNS Records Required:**

```dns
# SPF Record
Type: TXT
Host: @
Value: v=spf1 include:sendgrid.net ~all

# DKIM Records (provided by SendGrid)
Type: CNAME
Host: s1._domainkey.yourdomain.com
Value: s1.domainkey.u12345678.wl123.sendgrid.net

Type: CNAME
Host: s2._domainkey.yourdomain.com
Value: s2.domainkey.u12345678.wl123.sendgrid.net
```

**DMARC Record:**

```dns
Type: TXT
Host: _dmarc.yourdomain.com
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com
```

### 3.2 Email Templates

Templates are located in:
```
services/api/src/templates/emails/
```

Available templates:
- `base.html` - Base layout
- `welcome.html` - User welcome
- `subscription-welcome.html` - Subscription confirmation
- `payment-receipt.html` - Payment confirmation
- `payment-failed.html` - Payment failure
- `appointment-confirmation.html` - Appointment booked
- `appointment-reminder.html` - Appointment reminder

### 3.3 Testing

```bash
# Set test email
export TEST_EMAIL=your-email@example.com

# Run SendGrid tests
npm run test:sendgrid

# Test specific template
node -e "
const { emailTemplatesService } = require('./dist/services/email-templates.service.js');
emailTemplatesService.sendWelcomeEmail({
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
});
"
```

### 3.4 Monitoring

Monitor these metrics daily:
- Delivery Rate (should be > 95%)
- Bounce Rate (should be < 5%)
- Spam Report Rate (should be < 0.1%)
- Open Rate (20-30% for transactional)

See `SENDGRID_SETUP_GUIDE.md` for detailed DNS configuration.

---

## 4. Twilio SMS/Voice Integration

### 4.1 Initial Setup

#### Step 1: Account Creation
1. Sign up at https://www.twilio.com/try-twilio
2. Verify your phone number
3. Choose a plan (Pay-as-you-go recommended)

#### Step 2: Phone Number Purchase
1. Navigate to Phone Numbers > Buy a Number
2. Select country and capabilities needed:
   - SMS
   - Voice
   - MMS (optional)
3. Purchase number
4. Add to environment variables

#### Step 3: API Credentials
1. Navigate to Console Dashboard
2. Copy Account SID and Auth Token
3. Add to environment variables

### 4.2 SMS Templates

Use the SMS Templates Service for consistent messaging:

```typescript
import { smsTemplatesService } from './services/sms-templates.service';

// Appointment reminder
await smsTemplatesService.sendAppointmentReminder(
  { phoneNumber: '+1234567890', firstName: 'John', lastName: 'Doe' },
  {
    providerName: 'Smith',
    appointmentDate: new Date('2025-12-20'),
    appointmentTime: '2:00 PM',
  }
);

// Verification code
await smsTemplatesService.sendVerificationCode(
  { phoneNumber: '+1234567890', firstName: 'John', lastName: 'Doe' },
  '123456'
);
```

### 4.3 Voice Call Setup

The enhanced Twilio integration supports:
- Outbound calls
- Call recording
- Call forwarding
- Conference calls
- IVR menus

Example voice call:

```typescript
import { twilioEnhancedService } from './lib/twilio-enhanced';

await twilioEnhancedService.makeCall({
  to: '+1234567890',
  twiml: twilioEnhancedService.generateVoicemailTwiML(
    'Hello, this is a reminder about your appointment',
    'https://yourdomain.com/voice/recording'
  ),
  record: true,
});
```

### 4.4 Testing

```bash
# Set test phone
export TEST_PHONE=+1234567890

# Run Twilio tests
npm run test:twilio

# Test SMS
node -e "
const { smsTemplatesService } = require('./dist/services/sms-templates.service.js');
smsTemplatesService.sendVerificationCode(
  { phoneNumber: '+1234567890', firstName: 'Test', lastName: 'User' },
  '123456'
);
"
```

### 4.5 Cost Management

Monitor usage to control costs:
- SMS: ~$0.0075 per message
- Voice: ~$0.013 per minute
- Set up usage alerts in Twilio Console
- Implement rate limiting in production

---

## 5. Firebase Cloud Messaging

### 5.1 Initial Setup

#### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name and configure settings
4. Enable Google Analytics (optional)

#### Step 2: Enable Cloud Messaging
1. In Firebase Console, go to Project Settings
2. Navigate to Cloud Messaging tab
3. Enable Firebase Cloud Messaging API

#### Step 3: Generate Service Account
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Add credentials to environment variables

**Option A: Using JSON File**
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
```

**Option B: Using Environment Variables**
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 5.2 Client-Side Integration

**Web (React)**
```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
const token = await getToken(messaging, {
  vapidKey: 'your-vapid-key'
});
```

**Android**
```kotlin
// Add to build.gradle
implementation 'com.google.firebase:firebase-messaging:23.0.0'

// Get token
FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
    if (task.isSuccessful) {
        val token = task.result
        // Send token to your server
    }
}
```

**iOS**
```swift
// Add Firebase to Podfile
pod 'Firebase/Messaging'

// Get token
Messaging.messaging().token { token, error in
    if let token = token {
        // Send token to your server
    }
}
```

### 5.3 Sending Notifications

Use the FCM Enhanced Service:

```typescript
import { fcmEnhancedService } from './lib/fcm-enhanced';

// Send to single device
await fcmEnhancedService.sendToDevice(
  deviceToken,
  {
    notification: {
      title: 'Appointment Reminder',
      body: 'Your appointment is in 1 hour',
    },
    data: {
      type: 'appointment',
      appointmentId: '123',
    },
  }
);

// Send to multiple devices
await fcmEnhancedService.sendToDevices(
  [token1, token2, token3],
  {
    notification: {
      title: 'System Update',
      body: 'New features are available',
    },
  }
);

// Send to topic
await fcmEnhancedService.sendToTopic(
  'all-users',
  {
    notification: {
      title: 'Announcement',
      body: 'Platform maintenance scheduled',
    },
  }
);
```

### 5.4 Notification Templates

Pre-built notification templates:

```typescript
// Appointment reminder
const notification = fcmEnhancedService.createAppointmentReminderNotification(
  'Dr. Smith',
  '2:00 PM',
  2 // hours until
);

// Payment notification
const notification = fcmEnhancedService.createPaymentNotification(
  29.99,
  'USD',
  'success'
);

// Message notification
const notification = fcmEnhancedService.createMessageNotification(
  'Dr. Smith',
  'Your test results are ready'
);
```

### 5.5 Testing

```bash
# Set test FCM token
export TEST_FCM_TOKEN=your-device-token

# Run FCM tests
npm run test:fcm

# Send test notification
node -e "
const { fcmEnhancedService } = require('./dist/lib/fcm-enhanced.js');
fcmEnhancedService.sendToDevice(
  'your-device-token',
  {
    notification: {
      title: 'Test Notification',
      body: 'This is a test'
    }
  }
);
"
```

### 5.6 Topic Management

Subscribe/unsubscribe devices to topics:

```typescript
// Subscribe to topic
await fcmEnhancedService.subscribeToTopic(
  ['token1', 'token2'],
  'appointment-reminders'
);

// Unsubscribe from topic
await fcmEnhancedService.unsubscribeFromTopic(
  ['token1', 'token2'],
  'appointment-reminders'
);
```

Common topics:
- `all-users` - All platform users
- `appointment-reminders` - Appointment notifications
- `payment-updates` - Payment-related notifications
- `system-alerts` - System announcements

---

## 6. Testing Integrations

### 6.1 Running Integration Tests

```bash
# Install dependencies
pnpm install

# Set up test environment variables
export TEST_EMAIL=your-email@example.com
export TEST_PHONE=+1234567890
export TEST_FCM_TOKEN=your-device-token

# Run all integration tests
npm run test:integration

# Run specific service tests
npm run test:stripe
npm run test:sendgrid
npm run test:twilio
npm run test:fcm

# Skip live tests (stub mode)
export SKIP_LIVE_TESTS=true
npm run test:integration
```

### 6.2 Test Coverage

The integration test suite covers:

**Stripe:**
- Connection verification
- Customer creation
- Setup intent creation
- Product/price listing
- Webhook verification

**SendGrid:**
- Simple email sending
- Templated emails
- Emails with attachments
- Batch emails

**Twilio:**
- SMS sending
- SMS with retry logic
- Templated SMS
- Phone number validation
- Voice calls (if configured)

**Firebase:**
- Send to device
- Send to multiple devices
- Topic messaging
- Notification templates

### 6.3 Manual Testing

#### Stripe Manual Test

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Test webhook
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
stripe trigger customer.subscription.created
```

#### SendGrid Manual Test

```bash
# Test email sending via API
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [{"to": [{"email": "test@example.com"}]}],
    "from": {"email": "noreply@yourdomain.com"},
    "subject": "Test Email",
    "content": [{"type": "text/plain", "value": "Test"}]
  }'
```

---

## 7. Monitoring & Maintenance

### 7.1 Daily Monitoring

**Stripe:**
- [ ] Check payment success rate (Dashboard > Home)
- [ ] Review failed payments (Dashboard > Payments > Failed)
- [ ] Monitor dispute alerts
- [ ] Check webhook delivery status

**SendGrid:**
- [ ] Review delivery rate (Statistics > Overview)
- [ ] Check bounce rate
- [ ] Monitor spam reports
- [ ] Review failed emails (Activity > Email Activity)

**Twilio:**
- [ ] Check message delivery rate
- [ ] Review failed messages
- [ ] Monitor usage/costs
- [ ] Check voice call quality

**Firebase:**
- [ ] Review notification delivery rate
- [ ] Check failed notifications
- [ ] Monitor token refresh rate
- [ ] Review topic subscriptions

### 7.2 Weekly Tasks

- [ ] Review integration error logs
- [ ] Check API rate limits
- [ ] Review cost/usage trends
- [ ] Update documentation if needed
- [ ] Review and respond to DMARC reports

### 7.3 Monthly Tasks

- [ ] Reconcile Stripe payouts
- [ ] Review and optimize email templates
- [ ] Audit phone number usage
- [ ] Review FCM topic subscriptions
- [ ] Update API keys if needed
- [ ] Review security settings

### 7.4 Alerting

Set up alerts for:

**Stripe:**
- Failed payment rate > 5%
- Dispute created
- Webhook failure rate > 1%

**SendGrid:**
- Bounce rate > 5%
- Spam rate > 0.1%
- Delivery rate < 95%

**Twilio:**
- Message failure rate > 5%
- Daily spend exceeds budget
- Invalid phone numbers > 10%

**Firebase:**
- Notification delivery rate < 90%
- Token refresh errors > 5%

---

## 8. Troubleshooting

### 8.1 Stripe Issues

#### Webhooks Not Received

**Symptoms:**
- Subscription status not updating
- Payment events not processed

**Solutions:**
1. Verify webhook endpoint is accessible
2. Check webhook secret in environment variables
3. Review webhook logs in Stripe Dashboard
4. Ensure raw body parser for webhook endpoint
5. Check firewall/security group settings

#### Payment Failures

**Symptoms:**
- High payment failure rate
- Customers reporting card declines

**Solutions:**
1. Check Radar rules (may be too strict)
2. Verify 3D Secure settings
3. Review decline codes in Dashboard
4. Check if customer has valid payment method
5. Verify customer has sufficient funds

### 8.2 SendGrid Issues

#### Emails Going to Spam

**Symptoms:**
- Low open rates
- Customer reports not receiving emails

**Solutions:**
1. Verify SPF, DKIM, DMARC are configured
2. Check sender reputation score
3. Review email content for spam triggers
4. Ensure unsubscribe link is present
5. Warm up IP address if using dedicated IP

#### High Bounce Rate

**Symptoms:**
- Bounce rate > 5%
- Many undelivered emails

**Solutions:**
1. Implement email validation before sending
2. Remove hard bounces immediately
3. Check for typos in email addresses
4. Verify domain authentication
5. Review suppression lists

### 8.3 Twilio Issues

#### SMS Not Delivered

**Symptoms:**
- Messages stuck in "sent" status
- Customers not receiving SMS

**Solutions:**
1. Verify phone number format (E.164)
2. Check Twilio phone number capabilities
3. Verify sufficient account balance
4. Check carrier filtering
5. Review message content for spam

#### High SMS Costs

**Symptoms:**
- Unexpected charges
- Budget exceeded

**Solutions:**
1. Implement rate limiting
2. Review message logs for duplicates
3. Use shorter messages
4. Implement unsubscribe mechanism
5. Consider bulk messaging discounts

### 8.4 Firebase Issues

#### Notifications Not Delivered

**Symptoms:**
- Low delivery rate
- Users not receiving notifications

**Solutions:**
1. Verify FCM token is valid
2. Check device token refresh logic
3. Verify Firebase credentials
4. Check notification payload format
5. Review device notification settings

#### Token Errors

**Symptoms:**
- Invalid token errors
- Token registration failures

**Solutions:**
1. Implement token refresh on client
2. Remove invalid tokens from database
3. Verify client-side FCM initialization
4. Check app permissions on device
5. Review Firebase project configuration

---

## 9. Disaster Recovery

### 9.1 Service Outage Procedures

#### Stripe Outage

1. Check Stripe Status: https://status.stripe.com
2. Enable maintenance mode for payments
3. Queue failed webhook events for retry
4. Communicate with users about payment issues
5. Manual reconciliation after service restoration

#### SendGrid Outage

1. Check SendGrid Status: https://status.sendgrid.com
2. Queue critical emails for retry
3. Use backup email service if configured
4. Notify users of email delays
5. Resend queued emails after restoration

#### Twilio Outage

1. Check Twilio Status: https://status.twilio.com
2. Queue critical SMS for retry
3. Use alternative notification methods (email, push)
4. Communicate via in-app notifications
5. Resend queued messages after restoration

#### Firebase Outage

1. Check Firebase Status: https://status.firebase.google.com
2. Fall back to alternative notification methods
3. Queue notifications for retry
4. Update users via email/SMS
5. Resend after service restoration

### 9.2 Data Backup

**Stripe:**
- Export customer data monthly
- Backup subscription records
- Download invoice history

**SendGrid:**
- Export contact lists
- Backup email templates
- Save suppression lists

**Twilio:**
- Export message logs
- Backup phone number configuration
- Save TwiML apps

**Firebase:**
- Export device tokens
- Backup topic subscriptions
- Export notification templates

### 9.3 API Key Rotation

If API keys are compromised:

1. **Immediate Actions:**
   - Revoke compromised keys immediately
   - Generate new API keys
   - Update environment variables
   - Deploy updated configuration
   - Monitor for unauthorized usage

2. **Investigation:**
   - Review access logs
   - Identify source of compromise
   - Assess potential damage
   - Document incident

3. **Prevention:**
   - Implement key rotation schedule (90 days)
   - Use secrets management system
   - Enable MFA on all accounts
   - Regular security audits

---

## 10. Support Resources

### Stripe
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com
- Status: https://status.stripe.com

### SendGrid
- Documentation: https://docs.sendgrid.com
- Support: https://support.sendgrid.com
- Status: https://status.sendgrid.com

### Twilio
- Documentation: https://www.twilio.com/docs
- Support: https://support.twilio.com
- Status: https://status.twilio.com

### Firebase
- Documentation: https://firebase.google.com/docs
- Support: https://firebase.google.com/support
- Status: https://status.firebase.google.com

---

**Last Updated:** 2025-12-17
**Version:** 1.0
**Maintained By:** Integration Team
**Review Schedule:** Quarterly
