# Push Notification Service Documentation

## Overview

The Push Notification Service provides comprehensive push notification functionality for the UnifiedHealth platform, supporting multiple platforms (iOS, Android, Web) and notification types with user preferences and quiet hours management.

## Table of Contents

1. [Architecture](#architecture)
2. [Prisma Models](#prisma-models)
3. [API Endpoints](#api-endpoints)
4. [Configuration](#configuration)
5. [Platform Integration](#platform-integration)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

## Architecture

### Components

- **Push Library** (`src/lib/push.ts`): Core push notification service with platform-specific integrations
- **Push Service** (`src/services/push.service.ts`): Business logic for managing notifications and preferences
- **Push Controller** (`src/controllers/push.controller.ts`): HTTP request handlers
- **Push DTOs** (`src/dtos/push.dto.ts`): Validation schemas and type definitions

### Supported Platforms

- **Android**: Firebase Cloud Messaging (FCM)
- **iOS**: Apple Push Notification Service (APNS) or FCM
- **Web**: Web Push API with VAPID

## Prisma Models

### DeviceToken

Stores registered device tokens for push notifications.

```prisma
model DeviceToken {
  id           String       @id @default(uuid())
  userId       String
  token        String       @unique
  platform     Platform
  deviceName   String?
  deviceModel  String?
  osVersion    String?
  appVersion   String?
  active       Boolean      @default(true)
  lastUsedAt   DateTime     @default(now())
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

enum Platform {
  ios
  android
  web
}
```

### PushNotification

Stores push notification records.

```prisma
model PushNotification {
  id           String                 @id @default(uuid())
  userId       String
  title        String
  body         String
  data         Json?
  type         NotificationType
  status       NotificationStatus     @default(pending)
  sentAt       DateTime?
  readAt       DateTime?
  failedReason String?
  createdAt    DateTime               @default(now())
  updatedAt    DateTime               @updatedAt
}

enum NotificationType {
  appointment_reminder
  appointment_confirmation
  appointment_cancelled
  message_received
  prescription_ready
  lab_results_available
  payment_due
  payment_received
  general
}

enum NotificationStatus {
  pending
  sent
  delivered
  read
  failed
}
```

### NotificationPreference

Stores user notification preferences.

```prisma
model NotificationPreference {
  id                    String   @id @default(uuid())
  userId                String   @unique
  emailEnabled          Boolean  @default(true)
  smsEnabled            Boolean  @default(true)
  pushEnabled           Boolean  @default(true)
  appointmentReminders  Boolean  @default(true)
  messageAlerts         Boolean  @default(true)
  prescriptionAlerts    Boolean  @default(true)
  labResultAlerts       Boolean  @default(true)
  paymentAlerts         Boolean  @default(true)
  marketingEmails       Boolean  @default(false)
  quietHoursEnabled     Boolean  @default(false)
  quietHoursStart       String?  // HH:MM format
  quietHoursEnd         String?  // HH:MM format
  quietHoursTimezone    String?  @default("UTC")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

## API Endpoints

### Device Registration

#### Register Device

```
POST /api/v1/push/register
```

Register a device token for push notifications.

**Request Body:**
```json
{
  "token": "device-token-string",
  "platform": "ios" | "android" | "web",
  "deviceName": "John's iPhone",
  "deviceModel": "iPhone 15 Pro",
  "osVersion": "17.2",
  "appVersion": "1.0.0"
}
```

**Response:**
```json
{
  "message": "Device registered successfully",
  "device": {
    "id": "uuid",
    "platform": "ios",
    "deviceName": "John's iPhone",
    "active": true,
    "lastUsedAt": "2025-12-17T10:00:00Z",
    "createdAt": "2025-12-17T10:00:00Z"
  }
}
```

#### Unregister Device

```
DELETE /api/v1/push/unregister
```

Unregister a device token.

**Request Body:**
```json
{
  "token": "device-token-string"
}
```

#### Get Devices

```
GET /api/v1/push/devices
```

Get user's registered devices.

**Response:**
```json
{
  "devices": [
    {
      "id": "uuid",
      "platform": "ios",
      "deviceName": "John's iPhone",
      "deviceModel": "iPhone 15 Pro",
      "osVersion": "17.2",
      "appVersion": "1.0.0",
      "active": true,
      "lastUsedAt": "2025-12-17T10:00:00Z",
      "createdAt": "2025-12-17T10:00:00Z"
    }
  ],
  "total": 1
}
```

### Notifications

#### Get Notifications

```
GET /api/v1/push/notifications
```

Get user's notifications with optional filters.

**Query Parameters:**
- `type`: Filter by notification type
- `status`: Filter by status (pending, sent, delivered, read, failed)
- `startDate`: Filter by start date (ISO 8601)
- `endDate`: Filter by end date (ISO 8601)
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)
- `unreadOnly`: Filter unread notifications (boolean)

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Appointment Reminder",
      "body": "Your appointment is tomorrow at 10:00 AM",
      "type": "appointment_reminder",
      "status": "sent",
      "data": {
        "appointmentId": "uuid"
      },
      "sentAt": "2025-12-17T10:00:00Z",
      "readAt": null,
      "createdAt": "2025-12-17T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Mark Notification as Read

```
PATCH /api/v1/push/notifications/:id/read
```

Mark a notification as read.

**Response:**
```json
{
  "message": "Notification marked as read",
  "notification": {
    "id": "uuid",
    "status": "read",
    "readAt": "2025-12-17T10:00:00Z"
  }
}
```

#### Mark All as Read

```
POST /api/v1/push/notifications/mark-all-read
```

Mark all unread notifications as read.

**Response:**
```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

#### Get Unread Count

```
GET /api/v1/push/unread-count
```

Get count of unread notifications.

**Response:**
```json
{
  "unreadCount": 5
}
```

### Preferences

#### Get Preferences

```
GET /api/v1/push/preferences
```

Get user's notification preferences.

**Response:**
```json
{
  "preferences": {
    "id": "uuid",
    "userId": "uuid",
    "emailEnabled": true,
    "smsEnabled": true,
    "pushEnabled": true,
    "appointmentReminders": true,
    "messageAlerts": true,
    "prescriptionAlerts": true,
    "labResultAlerts": true,
    "paymentAlerts": true,
    "marketingEmails": false,
    "quietHoursEnabled": true,
    "quietHoursStart": "22:00",
    "quietHoursEnd": "08:00",
    "quietHoursTimezone": "America/New_York",
    "createdAt": "2025-12-17T10:00:00Z",
    "updatedAt": "2025-12-17T10:00:00Z"
  }
}
```

#### Update Preferences

```
PUT /api/v1/push/preferences
```

Update user's notification preferences.

**Request Body:**
```json
{
  "pushEnabled": true,
  "appointmentReminders": true,
  "quietHoursEnabled": true,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00",
  "quietHoursTimezone": "America/New_York"
}
```

### Admin Endpoints

#### Send Push Notification

```
POST /api/v1/push/send
```

Send a push notification to a specific user (admin only).

**Request Body:**
```json
{
  "userId": "user-uuid",
  "title": "Test Notification",
  "body": "This is a test notification",
  "type": "general",
  "data": {
    "customKey": "customValue"
  }
}
```

#### Send Batch Notifications

```
POST /api/v1/push/send-batch
```

Send push notifications to multiple users (admin only).

**Request Body:**
```json
{
  "userIds": ["user-uuid-1", "user-uuid-2"],
  "title": "System Maintenance",
  "body": "The system will be down for maintenance tonight",
  "type": "general"
}
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Firebase Cloud Messaging (FCM) - Android/iOS
FCM_SERVER_KEY=your-fcm-server-key
FCM_SENDER_ID=your-fcm-sender-id

# Apple Push Notification Service (APNS) - iOS
APNS_KEY_ID=your-apns-key-id
APNS_TEAM_ID=your-apple-team-id
APNS_BUNDLE_ID=com.unifiedhealth.app
APNS_PRODUCTION=false
APNS_KEY_PATH=/path/to/AuthKey_XXXXXXXXXX.p8

# Web Push (VAPID)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:support@unifiedhealth.com
```

## Platform Integration

### Android (FCM)

1. **Setup Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing
   - Add Android app to project

2. **Get FCM Credentials**
   - Navigate to Project Settings > Cloud Messaging
   - Copy Server Key and Sender ID
   - Add to `.env` file

3. **Client Integration**
   ```javascript
   import messaging from '@react-native-firebase/messaging';

   // Request permission
   const permission = await messaging().requestPermission();

   // Get FCM token
   const fcmToken = await messaging().getToken();

   // Register with backend
   await fetch('/api/v1/push/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       token: fcmToken,
       platform: 'android'
     })
   });
   ```

### iOS (APNS)

1. **Setup Apple Developer Account**
   - Go to [Apple Developer Console](https://developer.apple.com/account/)
   - Navigate to Certificates, Identifiers & Profiles > Keys

2. **Create APNs Key**
   - Create a new key with APNs enabled
   - Download the `.p8` key file
   - Note the Key ID and Team ID

3. **Configure Environment**
   ```bash
   APNS_KEY_ID=ABC123DEF4
   APNS_TEAM_ID=XYZ789
   APNS_BUNDLE_ID=com.unifiedhealth.app
   APNS_KEY_PATH=/path/to/AuthKey_ABC123DEF4.p8
   APNS_PRODUCTION=false
   ```

4. **Client Integration**
   ```javascript
   import messaging from '@react-native-firebase/messaging';

   // Request permission
   const permission = await messaging().requestPermission();

   // Get APNs token
   const apnsToken = await messaging().getAPNSToken();

   // Register with backend
   await fetch('/api/v1/push/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       token: apnsToken,
       platform: 'ios'
     })
   });
   ```

### Web (Web Push)

1. **Generate VAPID Keys**
   ```bash
   npx web-push generate-vapid-keys
   ```

2. **Configure Environment**
   ```bash
   VAPID_PUBLIC_KEY=BG...
   VAPID_PRIVATE_KEY=M...
   VAPID_SUBJECT=mailto:support@unifiedhealth.com
   ```

3. **Client Integration**
   ```javascript
   // Request notification permission
   const permission = await Notification.requestPermission();

   if (permission === 'granted') {
     // Register service worker
     const registration = await navigator.serviceWorker.register('/sw.js');

     // Subscribe to push notifications
     const subscription = await registration.pushManager.subscribe({
       userVisibleOnly: true,
       applicationServerKey: VAPID_PUBLIC_KEY
     });

     // Register with backend
     await fetch('/api/v1/push/register', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         token: JSON.stringify(subscription),
         platform: 'web'
       })
     });
   }
   ```

## Usage Examples

### Sending Appointment Reminders

```typescript
import { pushService } from './services/push.service';

async function sendAppointmentReminder(userId: string, appointment: Appointment) {
  await pushService.sendPushNotification(userId, {
    title: 'Appointment Reminder',
    body: `Your appointment with Dr. ${appointment.providerName} is tomorrow at ${appointment.time}`,
    type: 'appointment_reminder',
    data: {
      appointmentId: appointment.id,
      providerId: appointment.providerId,
      scheduledAt: appointment.scheduledAt
    }
  });
}
```

### Sending Lab Results Notifications

```typescript
async function notifyLabResultsAvailable(userId: string, labResultId: string) {
  await pushService.sendPushNotification(userId, {
    title: 'Lab Results Available',
    body: 'Your lab results are ready to view',
    type: 'lab_results_available',
    data: {
      labResultId,
      redirectUrl: `/lab-results/${labResultId}`
    }
  });
}
```

### Batch Notifications for System Announcements

```typescript
async function sendSystemAnnouncement(message: string) {
  // Get all active users
  const users = await prisma.user.findMany({
    where: { status: 'active' }
  });

  const userIds = users.map(u => u.id);

  await pushService.sendBatchPushNotifications(userIds, {
    title: 'System Announcement',
    body: message,
    type: 'general'
  });
}
```

## Best Practices

### 1. Respect User Preferences

Always check user preferences before sending notifications:

```typescript
// The service automatically checks preferences
await pushService.sendPushNotification(userId, notification);
```

### 2. Handle Quiet Hours

The service automatically respects quiet hours. Notifications sent during quiet hours are saved but not delivered immediately.

### 3. Token Management

- Automatically deactivate failed tokens
- Clean up old, inactive tokens periodically
- Re-register tokens when apps are updated

### 4. Notification Content

- Keep titles under 50 characters
- Keep body text under 200 characters
- Include relevant data for deep linking
- Use appropriate notification types

### 5. Error Handling

```typescript
try {
  await pushService.sendPushNotification(userId, notification);
} catch (error) {
  logger.error('Failed to send notification', { error, userId });
  // Handle gracefully - don't block critical operations
}
```

### 6. Rate Limiting

Implement rate limiting for push notifications to prevent spam:

```typescript
// Example: Limit notifications per user per hour
const recentNotifications = await prisma.pushNotification.count({
  where: {
    userId,
    createdAt: {
      gte: new Date(Date.now() - 3600000) // Last hour
    }
  }
});

if (recentNotifications > 10) {
  throw new Error('Too many notifications sent');
}
```

### 7. Notification Cleanup

Run periodic cleanup jobs to remove old notifications:

```typescript
import { pushService } from './services/push.service';

// Delete notifications older than 90 days
await pushService.deleteOldNotifications(90);
```

### 8. Testing

Test push notifications thoroughly on all platforms:

```bash
# Test FCM notification
curl -X POST http://localhost:8080/api/v1/push/send \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "title": "Test Notification",
    "body": "This is a test",
    "type": "general"
  }'
```

### 9. Monitoring

Monitor push notification delivery rates and failures:

```typescript
// Track metrics
const metrics = await prisma.pushNotification.groupBy({
  by: ['status'],
  _count: true,
  where: {
    createdAt: {
      gte: new Date(Date.now() - 86400000) // Last 24 hours
    }
  }
});
```

### 10. Security

- Never expose push tokens in logs
- Use authentication for all push endpoints
- Validate notification content
- Rate limit notification sending

## Troubleshooting

### FCM Notifications Not Delivering

1. Check FCM server key is correct
2. Verify token format is valid
3. Check Firebase Console for errors
4. Ensure device has internet connection

### APNS Notifications Not Delivering

1. Verify APNS key, team ID, and bundle ID
2. Check `.p8` key file path is correct
3. Ensure production flag matches environment
4. Check Apple Push Console for errors

### Web Push Not Working

1. Verify VAPID keys are correct
2. Check service worker is registered
3. Ensure HTTPS is used (required for web push)
4. Check browser console for errors

### Notifications Sent During Quiet Hours

1. Check quiet hours are properly configured
2. Verify timezone is correct
3. Check quiet hours logic in service

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)
