# Push Notification Setup Guide

This guide explains how to set up and configure the push notification service for the Unified Health Platform.

## Overview

The push notification service supports three platforms:

1. **FCM (Firebase Cloud Messaging)** - Android and iOS via Firebase
2. **APNS (Apple Push Notification Service)** - Native iOS notifications
3. **Web Push API** - Browser-based notifications

## Installation

### 1. Install Required Dependencies

Run the following command to install the necessary npm packages:

```bash
npm install firebase-admin @apns/apn web-push
```

Or add them to your `package.json`:

```json
{
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "@apns/apn": "^6.0.0",
    "web-push": "^3.6.6"
  }
}
```

### 2. Install Type Definitions (Optional)

For better TypeScript support:

```bash
npm install --save-dev @types/web-push
```

## Configuration

### Firebase Cloud Messaging (FCM)

#### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to Project Settings (gear icon)

#### Step 2: Generate Service Account Key

1. Go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file (keep it secure!)

#### Step 3: Set Environment Variables

Extract the following values from the downloaded JSON file and add to your `.env`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important:**

- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Preserve the `\n` characters (they represent newlines)
- Never commit the private key to version control

### Apple Push Notification Service (APNS)

#### Step 1: Create APNs Auth Key

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles** > **Keys**
3. Click the **+** button to create a new key
4. Select **Apple Push Notifications service (APNs)**
5. Download the `.p8` file (you can only download it once!)

#### Step 2: Get Your Team ID and Bundle ID

- **Team ID**: Found in the top-right of the Apple Developer page
- **Bundle ID**: Your app's bundle identifier (e.g., `com.unifiedhealth.app`)

#### Step 3: Set Environment Variables

```bash
APNS_KEY_ID=ABCDEFGHIJ
APNS_TEAM_ID=1234567890
APNS_BUNDLE_ID=com.unifiedhealth.app
APNS_PRODUCTION=false
APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Notes:**

- Set `APNS_PRODUCTION=true` for production environment
- Copy the entire contents of the `.p8` file into `APNS_PRIVATE_KEY`
- Keep the quotes and preserve `\n` characters

### Web Push (VAPID)

#### Step 1: Generate VAPID Keys

Run the following command to generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

This will output:

```
=======================================
Public Key:
BG3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Private Key:
yH4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
=======================================
```

#### Step 2: Set Environment Variables

```bash
VAPID_PUBLIC_KEY=BG3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_PRIVATE_KEY=yH4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_SUBJECT=mailto:support@thetheunifiedhealth.com
```

**Notes:**

- The `VAPID_SUBJECT` should be either a `mailto:` URL or your website URL
- Keep your private key secure and never expose it to clients

## Usage Examples

### Send a Single Notification

```typescript
import { pushNotificationService } from "./lib/push";

const result = await pushNotificationService.sendPushNotification(
  "device-token-here",
  "android", // or 'ios' or 'web'
  {
    title: "Appointment Reminder",
    body: "Your appointment is in 30 minutes",
    data: {
      appointmentId: "12345",
      type: "appointment_reminder",
    },
    badge: 1,
    sound: "default",
    priority: "high",
  },
);

if (result.success) {
  console.log("Notification sent:", result.messageId);
} else {
  console.error("Failed to send notification:", result.error);
}
```

### Send Batch Notifications

```typescript
const tokens = [
  { token: "android-token-1", platform: "android" },
  { token: "ios-token-1", platform: "ios" },
  { token: "web-subscription-json", platform: "web" },
];

const batchResult = await pushNotificationService.sendBatchPushNotifications(
  tokens,
  {
    title: "System Update",
    body: "A new version is available",
    priority: "normal",
  },
);

console.log(
  `Success: ${batchResult.successCount}, Failed: ${batchResult.failureCount}`,
);
```

### Validate a Token

```typescript
const isValid = pushNotificationService.validateToken(token, "android");

if (!isValid) {
  // Remove invalid token from database
}
```

## Features

### Automatic Retry Logic

All notification sends include automatic retry with exponential backoff:

- **Max Retries**: 3 attempts
- **Initial Delay**: 1 second
- **Max Delay**: 10 seconds
- **Backoff Multiplier**: 2x

### Batch Sending Optimization

- FCM: Uses `sendEachForMulticast` API (up to 500 tokens per batch)
- APNS: Individual sends with parallel processing
- Web Push: Individual sends with parallel processing

### Error Handling

The service handles specific error codes:

**FCM Errors:**

- `invalid-registration-token`: Token is invalid or expired
- `registration-token-not-registered`: Token unregistered from FCM

**APNS Errors:**

- `410/Unregistered`: Token no longer valid
- `400/BadDeviceToken`: Invalid token format

**Web Push Errors:**

- `404/410`: Subscription expired
- `401/403`: VAPID authentication failed
- `413`: Payload too large (max 4KB)
- `429`: Rate limited

### Logging

All operations are logged with structured data:

- Successful sends: `info` level
- Failed sends: `error` level
- Retries: `warn` level

## Security Best Practices

1. **Never commit credentials to git**
   - Add `.env` to `.gitignore`
   - Use environment variables or secret management services

2. **Rotate keys regularly**
   - FCM: Generate new service account keys periodically
   - APNS: Rotate auth keys annually
   - VAPID: Generate new keys when changing servers

3. **Use production keys only in production**
   - Set `APNS_PRODUCTION=false` for development/staging
   - Use separate Firebase projects for dev/prod

4. **Validate tokens before storing**
   - Use `validateToken()` method before saving to database
   - Remove invalid tokens to avoid wasted sends

5. **Rate limiting**
   - Implement rate limits on your API endpoints
   - FCM: No specific limits but monitor quota
   - APNS: Max 1000 concurrent connections
   - Web Push: Varies by browser vendor

## Troubleshooting

### FCM Issues

**Error: "insufficient permissions"**

- Ensure the service account has the "Firebase Cloud Messaging API" enabled
- Check that the correct private key is being used

**Error: "invalid-registration-token"**

- Token has expired or been unregistered
- User uninstalled the app
- Remove the token from your database

### APNS Issues

**Error: "BadDeviceToken"**

- Token format is incorrect (should be 64 hex characters)
- Token is for sandbox but you're using production (or vice versa)

**Error: "Unregistered"**

- User uninstalled the app or disabled notifications
- Remove the token from your database

### Web Push Issues

**Error: 401/403**

- Check VAPID keys are correct
- Ensure `VAPID_SUBJECT` is properly formatted

**Error: 410**

- Subscription has expired
- User cleared browser data
- Remove subscription from database

**Payload Too Large**

- Web Push limit is typically 4KB
- Reduce the size of your notification payload

## Testing

### Test with curl (FCM)

```bash
# This won't work directly - FCM requires Firebase Admin SDK
# Use the service methods instead
```

### Test with curl (APNS)

```bash
# Requires proper JWT token generation
# Use the service methods instead
```

### Test with curl (Web Push)

```bash
# Example test (won't work without proper VAPID signature)
# Use the service methods instead
```

### Recommended Testing Approach

1. Create a test endpoint:

```typescript
app.post("/api/test-notification", async (req, res) => {
  const { token, platform } = req.body;

  const result = await pushNotificationService.sendPushNotification(
    token,
    platform,
    {
      title: "Test Notification",
      body: "This is a test from the API",
      data: { test: "true" },
    },
  );

  res.json(result);
});
```

2. Use a mobile app or browser to get a valid token
3. Send the token to your test endpoint
4. Verify the notification appears on the device

## Monitoring

### Key Metrics to Track

- **Success Rate**: `successCount / totalSent`
- **Error Types**: Count of each error code
- **Average Latency**: Time to send notification
- **Token Invalidation Rate**: Invalid tokens detected

### Recommended Logging

```typescript
// Log aggregated stats periodically
logger.info("Push notification stats", {
  period: "last_hour",
  fcm: { sent: 1000, failed: 10, invalidTokens: 5 },
  apns: { sent: 500, failed: 3, invalidTokens: 2 },
  webPush: { sent: 200, failed: 5, expired: 8 },
});
```

## Production Checklist

- [ ] All environment variables configured
- [ ] Private keys secured (not in git)
- [ ] `APNS_PRODUCTION=true` in production
- [ ] Separate Firebase projects for dev/prod
- [ ] Rate limiting implemented
- [ ] Token validation on registration
- [ ] Error handling and logging in place
- [ ] Monitoring and alerting configured
- [ ] Invalid token cleanup process
- [ ] Backup credentials stored securely

## Support

For issues or questions:

- Check the logs for detailed error messages
- Verify environment variables are correct
- Ensure tokens are in the correct format
- Test with a single notification before batch sending

## References

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)
