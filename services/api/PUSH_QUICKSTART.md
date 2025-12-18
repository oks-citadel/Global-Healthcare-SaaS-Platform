# Push Notifications - Quick Start Guide

Get push notifications working in under 10 minutes!

## Step 1: Install Dependencies (2 minutes)

```bash
cd services/api
npm install firebase-admin @apns/apn web-push
npm install --save-dev @types/web-push
```

## Step 2: Configure Firebase (3 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new)
3. Click **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file

## Step 3: Set Environment Variables (2 minutes)

Open the downloaded JSON file and copy these values to your `.env`:

```bash
# From the JSON file you downloaded:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nPaste the entire private_key value here\n-----END PRIVATE KEY-----\n"
```

**Important:** Keep the quotes around `FIREBASE_PRIVATE_KEY`

## Step 4: Test FCM (Android) (3 minutes)

Create a test file `test-push.ts`:

```typescript
import { pushNotificationService } from './src/lib/push';

async function test() {
  // Get this token from your Android app
  const androidToken = 'YOUR_ANDROID_TOKEN_HERE';

  const result = await pushNotificationService.sendPushNotification(
    androidToken,
    'android',
    {
      title: 'Test Notification',
      body: 'If you see this, FCM is working!',
      priority: 'high',
    }
  );

  console.log('Result:', result);
}

test();
```

Run it:
```bash
npx tsx test-push.ts
```

If you see `success: true`, FCM is working!

## Optional: Configure APNS (iOS)

### Quick Setup (5 minutes)

1. Go to [Apple Developer](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles** > **Keys**
3. Click **+** to create new key
4. Select **Apple Push Notifications service (APNs)**
5. Download the `.p8` file
6. Add to `.env`:

```bash
APNS_KEY_ID=ABCDEFGHIJ
APNS_TEAM_ID=1234567890
APNS_BUNDLE_ID=com.yourcompany.app
APNS_PRODUCTION=false
APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nPaste .p8 file contents\n-----END PRIVATE KEY-----\n"
```

## Optional: Configure Web Push

### Quick Setup (2 minutes)

Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

Copy the output to `.env`:
```bash
VAPID_PUBLIC_KEY=BG3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_PRIVATE_KEY=yH4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_SUBJECT=mailto:support@yourdomain.com
```

## Common Issues

### "FCM configuration not available"
**Fix:** Check that all three Firebase env variables are set

### "Cannot find module 'firebase-admin'"
**Fix:** Run `npm install firebase-admin`

### "Invalid private key"
**Fix:** Make sure the private key includes the full BEGIN/END markers and `\n` characters

### "Insufficient permissions"
**Fix:** Generate a new service account key from Firebase Console

## What's Next?

Now that push notifications are working:

1. **Read** `PUSH_API_EXAMPLES.md` for API endpoint examples
2. **Add** database schema for storing device tokens
3. **Create** endpoints for registration and sending
4. **Test** on real devices

## Full Documentation

- **Complete Setup**: `PUSH_NOTIFICATION_SETUP.md`
- **Dependencies**: `PUSH_DEPENDENCIES.md`
- **API Examples**: `PUSH_API_EXAMPLES.md`
- **Implementation Details**: `PUSH_IMPLEMENTATION_SUMMARY.md`

## Quick Test Script

Save as `test-all-platforms.ts`:

```typescript
import { pushNotificationService } from './src/lib/push';

async function testAll() {
  console.log('Testing Push Notification Service...\n');

  // Check configuration
  console.log('Platform Status:');
  console.log('- Android (FCM):', pushNotificationService.isPlatformConfigured('android') ? '✅' : '❌');
  console.log('- iOS (APNS):', pushNotificationService.isPlatformConfigured('ios') ? '✅' : '❌');
  console.log('- Web:', pushNotificationService.isPlatformConfigured('web') ? '✅' : '❌');
  console.log();

  // Test token validation
  console.log('Token Validation:');
  const validAndroidToken = 'a'.repeat(152);
  console.log('- Android token:', pushNotificationService.validateToken(validAndroidToken, 'android') ? '✅' : '❌');

  const validIosToken = 'a'.repeat(64);
  console.log('- iOS token:', pushNotificationService.validateToken(validIosToken, 'ios') ? '✅' : '❌');

  const validWebToken = JSON.stringify({
    endpoint: 'https://fcm.googleapis.com/fcm/send/test',
    keys: { p256dh: 'key1', auth: 'key2' }
  });
  console.log('- Web token:', pushNotificationService.validateToken(validWebToken, 'web') ? '✅' : '❌');
  console.log();

  console.log('Service is', pushNotificationService.isInitialized() ? 'initialized ✅' : 'not initialized ❌');

  if (pushNotificationService.isPlatformConfigured('web')) {
    const vapidKey = pushNotificationService.getVapidPublicKey();
    console.log('\nVAPID Public Key (for client):', vapidKey?.substring(0, 20) + '...');
  }
}

testAll();
```

Run:
```bash
npx tsx test-all-platforms.ts
```

Expected output:
```
Testing Push Notification Service...

Platform Status:
- Android (FCM): ✅
- iOS (APNS): ❌
- Web: ❌

Token Validation:
- Android token: ✅
- iOS token: ✅
- Web token: ✅

Service is initialized ✅
```

## That's It!

You now have a working push notification service. Start sending notifications to your users!

For production deployment, see `PUSH_NOTIFICATION_SETUP.md` for security best practices.
