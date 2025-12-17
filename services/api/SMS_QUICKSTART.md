# SMS Service - Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies

Dependencies are already included in package.json:
```bash
npm install
```

Key packages:
- `twilio` - Twilio SDK for SMS
- `uuid` - For generating notification IDs
- `zod` - For validation schemas

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# Twilio Configuration (Required)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+12025551234

# Application Settings
APP_URL=https://unifiedhealth.com
APP_NAME=UnifiedHealth
```

**Get Twilio Credentials:**
1. Sign up at https://www.twilio.com/
2. Get free trial account ($15 credit)
3. Copy Account SID and Auth Token from console
4. Get a phone number from Twilio

### 3. Start the Server

```bash
npm run dev
```

## Quick Usage Examples

### Example 1: Send Appointment Reminder

```typescript
import { sendAppointmentReminder } from './services/sms.service';

// Send appointment reminder
const result = await sendAppointmentReminder('+12025551234', {
  patientName: 'John Doe',
  providerName: 'Dr. Smith',
  appointmentDate: 'Monday, Jan 15',
  appointmentTime: '2:00 PM',
  location: 'Main Clinic',
  isVirtual: false,
  appointmentId: 'apt_123',
});

console.log(result.success); // true
console.log(result.messageId); // SMxxxxx (Twilio message ID)
```

### Example 2: Send Verification Code

```typescript
import { sendVerificationCode } from './services/sms.service';

// Send 6-digit verification code
const code = '123456';
const result = await sendVerificationCode('+12025551234', code);

if (result.success) {
  console.log('Verification code sent!');
}
```

### Example 3: Send Custom SMS via API

```typescript
import { notificationService } from './services/notification.service';

// Send custom message
const result = await notificationService.sendSms({
  to: '+12025551234',
  message: 'Your test results are ready. Log in to view them.',
});

console.log(result.status); // 'sent' or 'failed'
```

### Example 4: Batch SMS

```typescript
import { notificationService } from './services/notification.service';

// Send to multiple patients
const results = await notificationService.sendBatchSms(
  ['+12025551234', '+12025555678', '+12025559999'],
  'Important: Office closed tomorrow for holiday.'
);

const sentCount = results.filter(r => r.status === 'sent').length;
console.log(`Sent to ${sentCount} recipients`);
```

### Example 5: Check Delivery Status

```typescript
import { notificationService } from './services/notification.service';

// Check if message was delivered
const status = await notificationService.getSmsStatus('SMxxxxx');

console.log(status.status); // 'delivered', 'sent', 'failed', etc.
if (status.errorMessage) {
  console.log('Error:', status.errorMessage);
}
```

## API Endpoints

### Send SMS

```bash
curl -X POST http://localhost:3000/api/notifications/sms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+12025551234",
    "message": "Your appointment is confirmed!"
  }'
```

### Batch SMS

```bash
curl -X POST http://localhost:3000/api/notifications/sms/batch \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["+12025551234", "+12025555678"],
    "message": "Reminder: Office closed tomorrow"
  }'
```

### Get SMS Status

```bash
curl -X GET http://localhost:3000/api/notifications/sms/SMxxxxx/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Available SMS Templates

### Appointments
- `sendAppointmentReminder()` - 24h before appointment
- `sendAppointmentConfirmation()` - New appointment booked
- `sendAppointmentCancellation()` - Appointment cancelled
- `sendAppointmentRescheduled()` - Time changed
- `sendVisitLink()` - Virtual visit join link

### Security
- `sendVerificationCode()` - Phone verification

### Prescriptions & Results
- `sendPrescriptionReady()` - Ready for pickup
- `sendTestResultsAvailable()` - Test results ready
- `sendLabResultsAvailable()` - Lab results ready

### Payments
- `sendPaymentReminder()` - Payment due
- `sendPaymentConfirmation()` - Payment received

### Medical
- `sendReferralNotification()` - Specialist referral
- `sendMedicationReminder()` - Take medication
- `sendEmergencyAlert()` - Urgent notification

## Phone Number Format

**Always use E.164 format:**

✅ Correct:
- `+12025551234` (US)
- `+442071234567` (UK)
- `+61412345678` (Australia)

❌ Incorrect:
- `202-555-1234`
- `(202) 555-1234`
- `2025551234`

The system auto-formats US numbers if you forget the +1:
```typescript
formatPhoneNumber('2025551234') // Returns: +12025551234
```

## Message Length Limits

- **Single SMS:** 160 characters (GSM-7 encoding)
- **Concatenated:** Up to 1600 characters (our limit)
- **Recommended:** 140-150 characters

Example:
```typescript
// ✅ Good (135 chars)
"Hi John, reminder: appointment with Dr. Smith tomorrow at 2 PM.
Call 555-0100 to reschedule. - UnifiedHealth"

// ❌ Too long (will use 2 SMS segments, costing 2x)
"Hi John, this is a friendly reminder that you have an upcoming
appointment scheduled with Dr. Smith at our clinic tomorrow afternoon
at 2:00 PM. Please call 555-0100 if you need to reschedule."
```

## Testing Without Twilio

### Stub Mode (Development)

Don't set Twilio credentials in `.env`:
```bash
# TWILIO_ACCOUNT_SID=  (leave commented)
# TWILIO_AUTH_TOKEN=   (leave commented)
```

The system will:
- ✅ Log messages instead of sending
- ✅ Return success responses
- ✅ Generate fake message IDs
- ✅ Work for development/testing

### Test Phone Numbers (Twilio Trial)

Twilio trial accounts can only send to verified numbers:
1. Go to Twilio Console
2. Add "Verified Caller IDs"
3. Verify your phone number via SMS
4. Use verified numbers for testing

## Error Handling

### Common Errors

**Invalid Phone Number:**
```typescript
{
  "error": "Invalid phone number format. Use E.164 format (e.g., +1234567890)"
}
```
**Solution:** Format phone number as `+[country code][number]`

**Message Too Long:**
```typescript
{
  "error": "Message too long. Maximum 1600 characters."
}
```
**Solution:** Shorten your message

**Twilio Not Configured:**
```typescript
{
  "success": true,
  "messageId": "stub-1234567890",
  "status": "sent"
}
```
**Note:** This is stub mode. Add Twilio credentials to send real SMS.

### Try-Catch Pattern

```typescript
try {
  const result = await sendAppointmentReminder('+12025551234', {
    // ... appointment data
  });

  if (!result.success) {
    console.error('Failed to send SMS:', result.error);
    // Handle failure (retry, alert admin, etc.)
  }
} catch (error) {
  console.error('Unexpected error:', error);
  // Handle exception
}
```

## Production Checklist

Before going live:

- [ ] Set real Twilio credentials in production `.env`
- [ ] Verify Twilio account has sufficient balance
- [ ] Test all phone number formats
- [ ] Verify message templates are HIPAA compliant
- [ ] Set up monitoring/alerts for failed messages
- [ ] Configure rate limiting if needed
- [ ] Test delivery status tracking
- [ ] Document opt-out procedures (TCPA compliance)
- [ ] Set up logging/monitoring
- [ ] Test batch operations

## Cost Estimates

**Twilio Pricing (US, approximate):**
- SMS: $0.0079 per segment
- Phone number: $1.15/month

**Example Monthly Costs:**

| Scenario | SMS/Month | Cost |
|----------|-----------|------|
| Small clinic (100 patients) | 400 | $3.16 |
| Medium practice (500 patients) | 2,000 | $15.80 |
| Large hospital (5,000 patients) | 20,000 | $158.00 |

**Tips to reduce costs:**
- Keep messages under 160 characters (1 segment)
- Use GSM-7 encoding (avoid emojis/special chars)
- Send only necessary notifications
- Use email for non-urgent communications

## Monitoring

### Check Queue Status

```typescript
import { notificationService } from './services/notification.service';

const stats = await notificationService.getQueueStats();
console.log('SMS queue:', stats.sms);
// Output: { waiting: 5, active: 2, completed: 1234, failed: 3 }
```

### View Logs

The system logs all SMS operations:
```bash
# Success
INFO: SMS sent successfully {phoneNumber: "+12025551234", messageId: "SMxxxxx"}

# Failure
ERROR: Failed to send SMS {phoneNumber: "+12025551234", error: "Invalid number"}
```

## Troubleshooting

### Messages not sending?

1. Check Twilio credentials are set correctly
2. Verify phone number is E.164 format
3. Check Twilio account balance
4. Review application logs for errors
5. Check Twilio console for delivery errors

### Status check failing?

1. Verify message ID format (should start with "SM")
2. Check message ID is from your Twilio account
3. Try again after a few seconds (status updates may be delayed)

## Getting Help

1. **Documentation:**
   - `SMS_IMPLEMENTATION_SUMMARY.md` - Full implementation details
   - `NOTIFICATION_SYSTEM.md` - Overall notification system
   - `src/templates/sms/README.md` - Template guidelines

2. **Code Comments:**
   - All functions have JSDoc comments
   - Check inline documentation in source files

3. **Twilio Resources:**
   - [Twilio SMS Docs](https://www.twilio.com/docs/sms)
   - [Twilio Console](https://console.twilio.com/)
   - [Twilio Support](https://support.twilio.com/)

## Next Steps

1. ✅ Set up Twilio account
2. ✅ Configure environment variables
3. ✅ Test with your phone number
4. ✅ Integrate with your appointment system
5. ✅ Set up scheduled reminders
6. ✅ Monitor delivery and costs

---

**Quick Links:**
- [Twilio Console](https://console.twilio.com/)
- [SMS Templates](./src/templates/sms/)
- [Full Documentation](./SMS_IMPLEMENTATION_SUMMARY.md)

**Need Help?**
Review the full implementation summary or check the inline code documentation.
