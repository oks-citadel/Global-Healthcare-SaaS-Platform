# SendGrid Integration Setup Guide

## Overview
This guide provides step-by-step instructions for setting up SendGrid email integration with domain verification, SPF, DKIM, and DMARC configuration to ensure maximum email deliverability.

---

## Table of Contents
1. [SendGrid Account Setup](#1-sendgrid-account-setup)
2. [API Key Generation](#2-api-key-generation)
3. [Domain Authentication](#3-domain-authentication)
4. [SPF Configuration](#4-spf-configuration)
5. [DKIM Configuration](#5-dkim-configuration)
6. [DMARC Configuration](#6-dmarc-configuration)
7. [Email Templates](#7-email-templates)
8. [Testing](#8-testing)
9. [Monitoring](#9-monitoring)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. SendGrid Account Setup

### Create SendGrid Account

1. Visit [SendGrid Signup](https://signup.sendgrid.com/)
2. Choose your plan:
   - **Free**: 100 emails/day (testing/development)
   - **Essentials**: $19.95/month - 50,000 emails/month
   - **Pro**: $89.95/month - 100,000 emails/month
   - **Premier**: Custom pricing for higher volumes

3. Complete account verification:
   - Verify your email address
   - Add company information
   - Complete identity verification (may take 24-48 hours)

### Account Verification Checklist
- [ ] Email address verified
- [ ] Phone number verified (if required)
- [ ] Company information submitted
- [ ] Identity verification completed
- [ ] Account activated

---

## 2. API Key Generation

### Create API Key

1. Navigate to Settings > API Keys in SendGrid Dashboard
2. Click "Create API Key"
3. Configure API Key:
   - **Name**: `healthcare-platform-production` (or appropriate environment name)
   - **Permissions**: Choose one of:
     - **Full Access**: Complete control (use with caution)
     - **Restricted Access**: Recommended for production
       - Mail Send: Full Access
       - Stats: Read Access
       - Tracking: Read Access
       - Webhooks: Read and Write Access

4. Copy API Key immediately (shown only once)
5. Store securely in environment variables

### Add to Environment Variables

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=UnifiedHealth Platform
ADMIN_EMAIL=admin@yourdomain.com
```

### Security Best Practices
- [ ] Store API key in secure environment variables
- [ ] Never commit API key to version control
- [ ] Use different API keys for development/staging/production
- [ ] Rotate API keys every 90 days
- [ ] Restrict API key permissions to minimum required
- [ ] Monitor API key usage regularly

---

## 3. Domain Authentication

Domain authentication proves you own the domain you're sending from and significantly improves deliverability.

### Authenticate Your Domain

1. Navigate to: Settings > Sender Authentication > Authenticate Your Domain
2. Enter your domain information:
   - **Domain**: `yourdomain.com`
   - **DNS Host**: Select your DNS provider (GoDaddy, Cloudflare, Route53, etc.)
   - **Advanced Settings**:
     - [ ] Use automated security
     - [ ] Use custom return path
     - [ ] Brand your links

3. SendGrid will generate DNS records to add

---

## 4. SPF Configuration

SPF (Sender Policy Framework) prevents email spoofing by specifying which mail servers are authorized to send email for your domain.

### DNS Records to Add

SendGrid will provide these records. Add them to your DNS provider:

```dns
# SPF Record (TXT)
Type: TXT
Host: @ (or yourdomain.com)
Value: v=spf1 include:sendgrid.net ~all
TTL: 3600
```

### Verify SPF Record

After adding the record, wait 24-48 hours for DNS propagation, then verify:

```bash
# Using dig (Linux/Mac)
dig yourdomain.com TXT

# Using nslookup (Windows)
nslookup -type=TXT yourdomain.com

# Expected output should include:
# v=spf1 include:sendgrid.net ~all
```

### SPF Record Checklist
- [ ] SPF TXT record added to DNS
- [ ] Record includes `include:sendgrid.net`
- [ ] Record ends with `~all` or `-all`
- [ ] DNS propagation completed (24-48 hours)
- [ ] SPF record verified using dig/nslookup
- [ ] SendGrid shows domain as authenticated

---

## 5. DKIM Configuration

DKIM (DomainKeys Identified Mail) adds a digital signature to your emails to verify authenticity.

### DNS Records to Add

SendGrid provides unique DKIM records for your domain:

```dns
# DKIM Record 1 (CNAME)
Type: CNAME
Host: s1._domainkey.yourdomain.com
Value: s1.domainkey.u12345678.wl123.sendgrid.net
TTL: 3600

# DKIM Record 2 (CNAME)
Type: CNAME
Host: s2._domainkey.yourdomain.com
Value: s2.domainkey.u12345678.wl123.sendgrid.net
TTL: 3600
```

**Note**: The exact values will be different for your account. Copy them from SendGrid Dashboard.

### Verify DKIM Records

```bash
# Verify DKIM record 1
dig s1._domainkey.yourdomain.com CNAME

# Verify DKIM record 2
dig s2._domainkey.yourdomain.com CNAME
```

### DKIM Configuration Checklist
- [ ] DKIM CNAME records added to DNS
- [ ] Both s1 and s2 records configured
- [ ] DNS propagation completed
- [ ] DKIM records verified
- [ ] SendGrid shows DKIM as valid

---

## 6. DMARC Configuration

DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receiving servers how to handle emails that fail SPF or DKIM checks.

### Add DMARC Record

```dns
# DMARC Record (TXT)
Type: TXT
Host: _dmarc.yourdomain.com
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; fo=1; adkim=s; aspf=s; pct=100; rf=afrf; ri=86400; sp=quarantine
TTL: 3600
```

### DMARC Policy Levels

Start with a relaxed policy and gradually tighten:

#### Level 1 - Monitoring (Start Here)
```
v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com
```
- **p=none**: Monitor only, don't reject emails
- Use this for 2-4 weeks to gather data

#### Level 2 - Quarantine (After Monitoring)
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; pct=10
```
- **p=quarantine**: Send suspicious emails to spam
- **pct=10**: Apply to 10% of emails initially
- Gradually increase pct to 100

#### Level 3 - Reject (Production)
```
v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; pct=100
```
- **p=reject**: Reject emails that fail authentication
- Only use after thorough testing

### DMARC Record Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| v | DMARC version | v=DMARC1 |
| p | Policy for domain | p=quarantine |
| sp | Policy for subdomains | sp=quarantine |
| rua | Aggregate report email | rua=mailto:dmarc@yourdomain.com |
| ruf | Forensic report email | ruf=mailto:dmarc@yourdomain.com |
| pct | Percentage of emails to apply policy | pct=100 |
| adkim | DKIM alignment mode | adkim=s (strict) or adkim=r (relaxed) |
| aspf | SPF alignment mode | aspf=s (strict) or aspf=r (relaxed) |
| fo | Forensic reporting options | fo=1 (generate reports if either SPF or DKIM fails) |
| rf | Report format | rf=afrf |
| ri | Report interval | ri=86400 (1 day in seconds) |

### Verify DMARC Record

```bash
# Verify DMARC record
dig _dmarc.yourdomain.com TXT

# Use online tools
# https://mxtoolbox.com/dmarc.aspx
# https://dmarcian.com/dmarc-inspector/
```

### DMARC Checklist
- [ ] DMARC TXT record added to DNS
- [ ] Monitoring email addresses configured
- [ ] Started with p=none for monitoring
- [ ] DMARC record verified
- [ ] DMARC reports being received
- [ ] Policy gradually tightened based on reports
- [ ] Final policy set to p=quarantine or p=reject

---

## 7. Email Templates

### Template Types

The platform includes these pre-built templates:

1. **base.html** - Base layout for all emails
2. **welcome.html** - New user welcome
3. **subscription-welcome.html** - Subscription confirmation
4. **trial-ending.html** - Trial expiration warning
5. **payment-receipt.html** - Payment confirmation
6. **payment-failed.html** - Payment failure notification
7. **subscription-canceled.html** - Cancellation confirmation
8. **appointment-confirmation.html** - Appointment booked
9. **appointment-reminder.html** - Appointment reminder
10. **password-reset.html** - Password reset link

### Template Location
```
services/api/src/templates/emails/
```

### Customize Templates

Edit templates to match your branding:
- Update logo in base.html
- Modify color scheme
- Update company information
- Add social media links
- Customize footer

### Template Variables

Common variables available in all templates:
- `{{name}}` - Recipient name
- `{{email}}` - Recipient email
- `{{dashboardUrl}}` - Dashboard URL
- `{{helpUrl}}` - Help center URL
- `{{privacyUrl}}` - Privacy policy URL
- `{{unsubscribeUrl}}` - Unsubscribe URL

---

## 8. Testing

### Send Test Email

Use the Sendgrid API or testing script:

```typescript
import { sendEmail } from './lib/email';

// Send test email
await sendEmail({
  to: 'your-email@example.com',
  subject: 'Test Email from UnifiedHealth',
  templatePath: 'welcome.html',
  templateData: {
    name: 'Test User',
    email: 'your-email@example.com',
  },
});
```

### Testing Checklist
- [ ] Test email delivery to Gmail
- [ ] Test email delivery to Outlook
- [ ] Test email delivery to Yahoo
- [ ] Test email delivery to corporate email
- [ ] Verify emails don't land in spam
- [ ] Test all email templates
- [ ] Verify template variables render correctly
- [ ] Test email on mobile devices
- [ ] Test email on desktop clients
- [ ] Verify unsubscribe links work
- [ ] Check email rendering in dark mode

### Email Deliverability Test Tools
- [Mail Tester](https://www.mail-tester.com/) - Comprehensive email testing
- [GlockApps](https://glockapps.com/) - Spam testing
- [Litmus](https://litmus.com/) - Email rendering testing
- [Email on Acid](https://www.emailonacid.com/) - Email testing

---

## 9. Monitoring

### SendGrid Dashboard Metrics

Monitor these key metrics:

1. **Delivery Rate**: Should be > 95%
2. **Open Rate**: Aim for 20-30% for transactional emails
3. **Click Rate**: Monitor engagement
4. **Bounce Rate**: Should be < 5%
5. **Spam Report Rate**: Should be < 0.1%
6. **Unsubscribe Rate**: Should be < 1%

### Set Up Alerts

Configure alerts for:
- [ ] Bounce rate > 5%
- [ ] Spam report rate > 0.1%
- [ ] Delivery rate < 95%
- [ ] Unusual send volume
- [ ] API errors

### Email Activity Feed

Enable Email Activity Feed to:
- Track individual email delivery status
- Debug delivery issues
- Monitor user engagement
- Comply with audit requirements

Navigate to: Settings > Mail Settings > Event Webhook

### DMARC Reports

Set up DMARC report monitoring:
- Review aggregate reports weekly
- Investigate forensic reports immediately
- Identify unauthorized senders
- Adjust DMARC policy based on data

### Recommended Monitoring Tools
- [DMARC Analyzer](https://www.dmarcanalyzer.com/)
- [Postmark](https://postmarkapp.com/dmarc)
- [Valimail](https://www.valimail.com/)

---

## 10. Troubleshooting

### Common Issues and Solutions

#### Emails Going to Spam

**Causes:**
- SPF/DKIM/DMARC not configured
- Poor sender reputation
- Spammy content
- No unsubscribe link

**Solutions:**
1. Verify SPF, DKIM, and DMARC are properly configured
2. Check sender score: https://www.senderscore.org/
3. Review email content for spam triggers
4. Add clear unsubscribe link
5. Warm up IP address if using dedicated IP

#### High Bounce Rate

**Causes:**
- Invalid email addresses
- Temporary server issues
- Blocklist issues

**Solutions:**
1. Implement email validation before sending
2. Remove hard bounces from list immediately
3. Monitor suppression lists
4. Check if IP is blocklisted: https://mxtoolbox.com/blacklists.aspx

#### Domain Authentication Failed

**Causes:**
- DNS records not added
- DNS propagation incomplete
- Incorrect DNS values

**Solutions:**
1. Verify all DNS records are added correctly
2. Wait 24-48 hours for DNS propagation
3. Use `dig` or `nslookup` to verify records
4. Contact DNS provider support if needed

#### Low Open Rates

**Causes:**
- Poor subject lines
- Sending at wrong times
- Emails in spam folder
- Not mobile-optimized

**Solutions:**
1. A/B test subject lines
2. Send at optimal times (10AM-2PM weekdays)
3. Verify SPF/DKIM/DMARC setup
4. Ensure mobile-responsive templates

#### API Key Errors

**Error**: `401 Unauthorized`
**Solution**: Verify API key is correct and has proper permissions

**Error**: `403 Forbidden`
**Solution**: Check API key permissions and account status

**Error**: `429 Too Many Requests`
**Solution**: Implement rate limiting and request throttling

---

## Best Practices

### Email Content
- [ ] Use clear, concise subject lines
- [ ] Personalize emails with recipient name
- [ ] Include clear call-to-action
- [ ] Use responsive email templates
- [ ] Add plain text version
- [ ] Include physical mailing address (required by CAN-SPAM)
- [ ] Provide easy unsubscribe option

### Sending Practices
- [ ] Implement double opt-in for marketing emails
- [ ] Honor unsubscribe requests immediately
- [ ] Maintain clean email lists
- [ ] Remove hard bounces immediately
- [ ] Segment email lists for better targeting
- [ ] Respect sending limits
- [ ] Warm up new IP addresses gradually

### Compliance
- [ ] Comply with CAN-SPAM Act (US)
- [ ] Comply with GDPR (EU)
- [ ] Comply with CASL (Canada)
- [ ] Include physical mailing address
- [ ] Honor opt-out requests within 10 days
- [ ] Don't use deceptive subject lines
- [ ] Identify emails as advertisements (if applicable)

---

## Additional Resources

### Documentation
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference)
- [Email Best Practices](https://docs.sendgrid.com/ui/sending-email/email-best-practices)

### Tools
- [SendGrid Email Testing](https://app.sendgrid.com/email_testing)
- [SPF Record Generator](https://www.spfwizard.net/)
- [DMARC Record Generator](https://dmarcian.com/dmarc-record-wizard/)
- [MXToolbox](https://mxtoolbox.com/) - DNS and email testing

### Support
- [SendGrid Support](https://support.sendgrid.com/)
- [SendGrid Community](https://community.sendgrid.com/)
- [SendGrid Status](https://status.sendgrid.com/)

---

**Last Updated:** 2025-12-17
**Version:** 1.0
**Maintained By:** Integration Team
