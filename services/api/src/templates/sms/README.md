# SMS Templates

This directory contains SMS message templates for the UnifiedHealth notification system.

## Template Guidelines

### Best Practices
1. **Keep messages concise** - SMS has a 160-character limit per segment (1600 total for concatenated messages)
2. **Include call-to-action** - Provide clear next steps (URL, phone number, etc.)
3. **Personalize** - Use patient/recipient names when available
4. **Brand consistently** - End with app name or signature
5. **Be clear** - Avoid ambiguous language or jargon
6. **Time-sensitive info first** - Put important details at the beginning

### Character Limits
- Single SMS: 160 characters
- Concatenated SMS: Up to 1600 characters (our system limit)
- Recommended: 140-150 characters to account for encoding variations

### Message Structure
```
Greeting + Key Information + Action/Link + Signature
```

Example:
```
Hi John, your appointment with Dr. Smith is confirmed for Jan 15 at 10:00 AM.
View details: https://app.com/apt/123 - UnifiedHealth
```

## Available Templates

### Appointment Templates
- `appointment-reminder.txt` - 24-hour appointment reminder
- `appointment-confirmation.txt` - New appointment confirmation
- `appointment-cancellation.txt` - Appointment cancelled notification
- `appointment-rescheduled.txt` - Appointment time changed
- `virtual-visit-link.txt` - Virtual visit join link

### Verification Templates
- `verification-code.txt` - Phone verification code

### Prescription Templates
- `prescription-ready.txt` - Prescription ready for pickup
- `prescription-refill.txt` - Prescription refill reminder

### Results Templates
- `test-results-available.txt` - Test results ready
- `lab-results-available.txt` - Lab results ready

### Payment Templates
- `payment-reminder.txt` - Payment due reminder
- `payment-confirmation.txt` - Payment received confirmation

### Medical Templates
- `referral-notification.txt` - Specialist referral
- `medication-reminder.txt` - Medication dose reminder
- `emergency-alert.txt` - Emergency notification

## Variable Syntax

Templates use simple `{{variable}}` syntax:

```
Hi {{patientName}}, your {{medicationName}} ({{dosage}}) is ready.
```

## Common Variables

### Patient Info
- `{{patientName}}` - Patient's full name
- `{{phoneNumber}}` - Patient's phone number

### Provider Info
- `{{providerName}}` - Healthcare provider name
- `{{specialty}}` - Provider specialty
- `{{clinicName}}` - Clinic/facility name

### Appointment Info
- `{{appointmentDate}}` - Appointment date
- `{{appointmentTime}}` - Appointment time
- `{{appointmentType}}` - Type of appointment
- `{{duration}}` - Appointment duration
- `{{location}}` - Physical location
- `{{appointmentId}}` - Unique appointment ID

### URLs and Links
- `{{appUrl}}` - Base application URL
- `{{joinUrl}}` - Virtual visit join link
- `{{paymentUrl}}` - Payment page link
- `{{mapsUrl}}` - Google Maps link

### Payment Info
- `{{amount}}` - Payment amount
- `{{dueDate}}` - Payment due date
- `{{invoiceNumber}}` - Invoice number
- `{{transactionId}}` - Transaction ID

### Medication Info
- `{{medicationName}}` - Medication name
- `{{dosage}}` - Dosage amount
- `{{instructions}}` - Taking instructions

### System Info
- `{{appName}}` - Application name
- `{{supportEmail}}` - Support email
- `{{supportPhone}}` - Support phone

## Testing Templates

Before using in production:
1. Test with actual data
2. Verify character count
3. Check link functionality
4. Test on multiple devices
5. Verify personalization works

## Compliance

### HIPAA Considerations
- Never include detailed medical information
- Avoid sending diagnosis or treatment details
- Use generic language ("test results ready" not "HIV test positive")
- Include "Log in to view securely" for sensitive info

### TCPA Compliance
- Only send to consented phone numbers
- Include opt-out instructions for marketing messages
- Provide clear sender identification
- Honor opt-out requests immediately

### International Considerations
- Phone numbers in E.164 format (+1234567890)
- Consider time zones for scheduled sends
- Localization for non-US recipients
- Character encoding for special characters

## Character Count Examples

✅ Good (135 characters):
```
Hi Sarah, reminder: appointment with Dr. Jones tomorrow at 2 PM.
Location: Main Clinic. Call 555-0100 to reschedule. - UnifiedHealth
```

⚠️ Too long (185 characters - uses 2 SMS segments):
```
Hi Sarah, this is a friendly reminder that you have an upcoming appointment
scheduled with Dr. Jones at our Main Street Clinic location tomorrow afternoon
at 2:00 PM. Please call us at 555-0100 if you need to reschedule. - UnifiedHealth
```

## Emergency Messages

For urgent/emergency messages:
- Start with "URGENT:" or "EMERGENCY:"
- Put critical info first
- Include contact number
- Keep concise but complete

Example:
```
URGENT: John, appointment cancelled due to provider emergency.
Call 555-0100 to reschedule. - UnifiedHealth
```
