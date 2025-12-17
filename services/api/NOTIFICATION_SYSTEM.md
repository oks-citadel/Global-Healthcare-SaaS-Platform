# Notification System Documentation

## Overview

The UnifiedHealth notification system provides comprehensive email and SMS notification capabilities with queue-based delivery for reliability and scalability.

## Architecture

### Components

1. **Email Library** (`src/lib/email.ts`)
   - SendGrid integration
   - Template rendering engine
   - Email validation

2. **SMS Library** (`src/lib/sms.ts`)
   - Twilio integration
   - Phone number validation and formatting
   - SMS delivery tracking

3. **Queue System** (`src/lib/queue.ts`)
   - Bull queue for async processing
   - Redis-backed job queue
   - Automatic retries with exponential backoff
   - Queue monitoring and statistics

4. **Email Service** (`src/services/email.service.ts`)
   - High-level email methods
   - Template-specific email functions
   - Common data injection

5. **SMS Service** (`src/services/sms.service.ts`)
   - High-level SMS methods
   - Message templates
   - SMS notifications for various events

6. **Notification Service** (`src/services/notification.service.ts`)
   - Unified notification interface
   - Queue management
   - Batch operations

7. **Notification Scheduler** (`src/jobs/notification-scheduler.ts`)
   - Cron-based scheduled notifications
   - 24-hour appointment reminders
   - 1-hour virtual visit reminders
   - Prescription refill reminders
   - Payment reminders

## Email Templates

All email templates are located in `src/templates/emails/` and use the responsive base template.

### Base Template (`base.html`)
- Responsive design
- Gradient header with logo
- Professional footer with contact info
- Consistent branding across all emails
- Dark mode compatible

### Available Templates

1. **Welcome Email** (`welcome.html`)
   - Sent to new users upon registration
   - Features list and getting started guide

2. **Password Reset** (`password-reset.html`)
   - Secure password reset link
   - Expiry information
   - Security warnings

3. **Appointment Confirmation** (`appointment-confirmation.html`)
   - Appointment details table
   - Virtual vs in-person indicators
   - Action buttons (view, reschedule, cancel)

4. **Appointment Reminder** (`appointment-reminder.html`)
   - 24-hour reminder before appointment
   - Join link for virtual visits
   - Directions for in-person visits

5. **Visit Summary** (`visit-summary.html`)
   - Post-visit information
   - Diagnosis and prescriptions
   - Lab orders and follow-up care

6. **Invoice** (`invoice.html`)
   - Itemized charges
   - Insurance information
   - Payment options and links

## Environment Variables

### Email (SendGrid)
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@unifiedhealth.com
FROM_NAME=UnifiedHealth
```

### SMS (Twilio)
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Queue (Redis)
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

### Application
```bash
APP_URL=https://unifiedhealth.com
APP_NAME=UnifiedHealth
SUPPORT_EMAIL=support@unifiedhealth.com
SUPPORT_PHONE=+1-800-UNIFIED
BILLING_PHONE=+1-800-BILLING
```

## Installation

### Required Packages

```bash
npm install @sendgrid/mail twilio bull ioredis node-cron
npm install -D @types/bull @types/node-cron
```

### Package Versions
- `@sendgrid/mail`: ^7.7.0 or higher
- `twilio`: ^4.19.0 or higher
- `bull`: ^4.12.0 or higher
- `ioredis`: ^5.3.2 or higher
- `node-cron`: ^3.0.3 or higher

## Usage Examples

### Sending Emails

#### Using Email Service
```typescript
import { sendWelcomeEmail } from './services/email.service';

await sendWelcomeEmail('user@example.com', 'John Doe');
```

#### Using Email Library Directly
```typescript
import { sendEmail } from './lib/email';

await sendEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  templatePath: 'welcome.html',
  templateData: {
    userName: 'John Doe',
  },
});
```

### Sending SMS

#### Using SMS Service
```typescript
import { sendAppointmentReminder } from './services/sms.service';

await sendAppointmentReminder('+1234567890', {
  patientName: 'John Doe',
  providerName: 'Dr. Smith',
  appointmentDate: 'Monday, January 15, 2025',
  appointmentTime: '10:00 AM',
  isVirtual: true,
  appointmentId: 'apt_123',
});
```

#### Using SMS Library Directly
```typescript
import { sendSms } from './lib/sms';

await sendSms({
  to: '+1234567890',
  message: 'Your appointment is confirmed!',
});
```

### Using Queues

#### Queue Email
```typescript
import { notificationService } from './services/notification.service';

await notificationService.queueEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  body: '<p>Hello World</p>',
});
```

#### Queue SMS
```typescript
await notificationService.queueSms({
  to: '+1234567890',
  message: 'Test message',
});
```

#### Schedule Notifications
```typescript
import { getNotificationQueues } from './lib/queue';

const queues = getNotificationQueues();

// Schedule email for 1 hour from now
await queues.scheduleEmail(
  {
    to: 'user@example.com',
    subject: 'Reminder',
    html: '<p>Your appointment is in 1 hour</p>',
  },
  60 * 60 * 1000 // 1 hour in milliseconds
);
```

### Scheduled Jobs

#### Start All Jobs
```typescript
import { startAllScheduledJobs } from './jobs/notification-scheduler';

const tasks = startAllScheduledJobs();
```

#### Individual Jobs
```typescript
import {
  schedule24HourReminders,
  schedule1HourVirtualVisitReminders,
  schedulePrescriptionRefillReminders,
  schedulePaymentReminders,
} from './jobs/notification-scheduler';

// Start individual jobs
const appointmentReminders = schedule24HourReminders();
const virtualVisitReminders = schedule1HourVirtualVisitReminders();
const prescriptionReminders = schedulePrescriptionRefillReminders();
const paymentReminders = schedulePaymentReminders();
```

## Queue Management

### Monitor Queue Statistics
```typescript
import { notificationService } from './services/notification.service';

const stats = await notificationService.getQueueStats();
console.log('Email queue:', stats.email);
console.log('SMS queue:', stats.sms);
console.log('Scheduled queue:', stats.scheduled);
```

### Pause/Resume Queues
```typescript
import { getNotificationQueues } from './lib/queue';

const queues = getNotificationQueues();

// Pause all queues
await queues.pauseAll();

// Resume all queues
await queues.resumeAll();
```

## Template Customization

### Template Variables

All templates support these common variables:
- `appUrl` - Application URL
- `supportEmail` - Support email address
- `supportPhone` - Support phone number
- `billingPhone` - Billing phone number
- `year` - Current year
- `email` - Recipient email address

### Custom Variables

Each template has specific variables. Example for appointment confirmation:
- `patientName`
- `providerName`
- `appointmentDate`
- `appointmentTime`
- `duration`
- `appointmentType`
- `isVirtual`
- `location`

### Template Syntax

Templates use simple `{{variable}}` syntax:
```html
<p>Hi {{userName}},</p>
<p>Your appointment is on {{appointmentDate}} at {{appointmentTime}}.</p>
```

## Scheduled Jobs

### Appointment Reminders (24 hours)
- **Schedule**: Every hour
- **Purpose**: Send reminders 24 hours before appointments
- **Channels**: Email and SMS
- **Conditions**: Confirmed appointments, reminder not yet sent

### Virtual Visit Reminders (1 hour)
- **Schedule**: Every 15 minutes
- **Purpose**: Send reminders 1 hour before virtual visits
- **Channels**: Email and SMS
- **Conditions**: Virtual appointments, immediate reminder not sent

### Prescription Refill Reminders
- **Schedule**: Daily at 9:00 AM
- **Purpose**: Remind patients about expiring prescriptions
- **Channels**: Email and SMS
- **Conditions**: Prescriptions expiring in 7 days

### Payment Reminders
- **Schedule**: Daily at 10:00 AM
- **Purpose**: Remind patients about overdue payments
- **Channels**: Email and SMS
- **Conditions**: Invoices past due date

## Error Handling

### Automatic Retries
- Failed jobs automatically retry 3 times
- Exponential backoff between retries (2s, 4s, 8s)
- Failed jobs retained for debugging

### Logging
All notification operations are logged:
- Success: Info level with message ID
- Failure: Error level with error details
- Queue operations: Info level

### Monitoring
Monitor queue health:
```typescript
const stats = await notificationService.getQueueStats();

// Check for backlogs
if (stats.email.waiting > 100) {
  console.warn('Email queue backlog detected');
}

// Check for failures
if (stats.email.failed > 50) {
  console.error('High email failure rate');
}
```

## Testing

### Stub Mode
When API keys are not configured, the system runs in stub mode:
- Logs notifications instead of sending
- Returns success responses
- Useful for development and testing

### Enable Stub Mode
Simply don't set the API keys:
```bash
# Don't set these for stub mode
# SENDGRID_API_KEY=
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
```

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Email Validation**: All email addresses are validated
3. **Phone Validation**: Phone numbers validated in E.164 format
4. **Rate Limiting**: Queue system prevents API rate limit issues
5. **Message Length**: SMS messages limited to 1600 characters
6. **Unsubscribe**: All marketing emails include unsubscribe link

## Performance

### Queue Benefits
- Async processing doesn't block API requests
- Automatic retry on failures
- Rate limiting protection
- Horizontal scaling capability

### Optimization Tips
1. Use queue methods for batch operations
2. Schedule non-urgent notifications
3. Monitor queue statistics regularly
4. Keep templates optimized (use base template)
5. Cache template data when possible

## Troubleshooting

### Emails Not Sending
1. Check SENDGRID_API_KEY is set
2. Verify FROM_EMAIL is verified in SendGrid
3. Check SendGrid API logs
4. Review application error logs

### SMS Not Sending
1. Check Twilio credentials are set
2. Verify TWILIO_PHONE_NUMBER format
3. Check Twilio account balance
4. Review phone number format (E.164)

### Queue Issues
1. Verify Redis is running
2. Check Redis connection settings
3. Monitor Redis memory usage
4. Review Bull queue logs

### Template Rendering Issues
1. Check template file exists
2. Verify all variables are provided
3. Review template syntax
4. Check base template integration

## API Integration

The notification system integrates with the API routes defined in `src/routes/notification.routes.ts`:

- `POST /api/notifications/email` - Send email
- `POST /api/notifications/sms` - Send SMS
- `POST /api/notifications/batch/email` - Batch emails
- `POST /api/notifications/batch/sms` - Batch SMS

## Future Enhancements

Potential improvements:
1. Push notifications for mobile apps
2. In-app notifications
3. Notification preferences management
4. A/B testing for email templates
5. Analytics and delivery tracking
6. Multi-language support
7. Custom template builder UI
8. Webhook integrations

## Support

For issues or questions:
- Email: support@unifiedhealth.com
- Documentation: https://docs.unifiedhealth.com
- GitHub Issues: https://github.com/unifiedhealth/platform/issues
