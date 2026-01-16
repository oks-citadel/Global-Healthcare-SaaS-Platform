# Push Notifications - Integration Guide

This is a quick reference for developers who want to integrate push notifications into their features.

> **Related Documentation:**
> - [Push Setup Guide](PUSH_QUICKSTART.md) - Initial Firebase/APNS/VAPID setup (start here!)
> - [Push API Examples](PUSH_API_EXAMPLES.md) - API endpoint examples
> - [Push Notification Setup](PUSH_NOTIFICATION_SETUP.md) - Complete setup guide

## 🚀 Quick Setup (5 minutes)

### 1. Add Environment Variables

```bash
# Add to your .env file
FCM_SERVER_KEY=your-fcm-server-key
FCM_SENDER_ID=your-fcm-sender-id
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 2. Run Migrations

```bash
npm run db:migrate
```

### 3. Start Server

```bash
npm run dev
```

Done! The push notification service is now available.

## 📱 Send Your First Notification

```typescript
import { pushService } from './services/push.service';

// Send a notification
await pushService.sendPushNotification(userId, {
  title: 'Hello!',
  body: 'This is your first push notification',
  type: 'general',
  data: { customKey: 'customValue' }
});
```

That's it! The service handles everything else (preferences, quiet hours, token management, etc.)

## 🎯 Common Use Cases

### Appointment Reminder

```typescript
await pushService.sendPushNotification(patientUserId, {
  title: 'Appointment Reminder',
  body: `Your appointment with Dr. Smith is tomorrow at 10:00 AM`,
  type: 'appointment_reminder',
  data: {
    appointmentId: appointment.id,
    deepLink: `/appointments/${appointment.id}`
  }
});
```

### New Message

```typescript
await pushService.sendPushNotification(recipientUserId, {
  title: `Message from ${senderName}`,
  body: message,
  type: 'message_received',
  data: {
    visitId: visit.id,
    deepLink: `/visits/${visit.id}/chat`
  }
});
```

### Lab Results

```typescript
await pushService.sendPushNotification(patientUserId, {
  title: 'Lab Results Available',
  body: 'Your lab results are ready to view',
  type: 'lab_results_available',
  data: {
    documentId: document.id,
    deepLink: `/documents/${document.id}`
  }
});
```

### Payment Reminder

```typescript
await pushService.sendPushNotification(userId, {
  title: 'Payment Reminder',
  body: `Your payment of $${amount} is due on ${dueDate}`,
  type: 'payment_due',
  data: {
    invoiceId: invoice.id,
    amount: amount,
    deepLink: `/invoices/${invoice.id}`
  }
});
```

## 📊 Batch Notifications

Send to multiple users at once:

```typescript
await pushService.sendBatchPushNotifications(
  [userId1, userId2, userId3],
  {
    title: 'System Maintenance',
    body: 'The system will be down tonight for maintenance',
    type: 'general'
  }
);
```

## 🔔 Notification Types

Use these types for proper preference filtering:

- `appointment_reminder` - Appointment reminders
- `appointment_confirmation` - Appointment confirmations
- `appointment_cancelled` - Cancellations
- `message_received` - Chat messages
- `prescription_ready` - Prescription notifications
- `lab_results_available` - Lab results
- `payment_due` - Payment reminders
- `payment_received` - Payment confirmations
- `general` - General notifications

## 🎛️ User Preferences

Users can manage their preferences through the API:

```typescript
// Get preferences
const prefs = await pushService.getNotificationPreferences(userId);

// Update preferences
await pushService.updateNotificationPreferences(userId, {
  pushEnabled: true,
  appointmentReminders: true,
  messageAlerts: false,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  quietHoursTimezone: 'America/New_York'
});
```

The service automatically respects these preferences when sending notifications.

## 📱 Client Integration

### iOS/Android (React Native)

```javascript
import messaging from '@react-native-firebase/messaging';

// Request permission
await messaging().requestPermission();

// Get token
const token = await messaging().getToken();

// Register with backend
await fetch('/api/v1/push/register', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    token: token,
    platform: Platform.OS, // 'ios' or 'android'
    deviceName: DeviceInfo.getDeviceName()
  })
});
```

### Web

```javascript
// Request permission
const permission = await Notification.requestPermission();

if (permission === 'granted') {
  // Register service worker
  const registration = await navigator.serviceWorker.register('/sw.js');

  // Subscribe to push
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: VAPID_PUBLIC_KEY
  });

  // Register with backend
  await fetch('/api/v1/push/register', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: JSON.stringify(subscription),
      platform: 'web'
    })
  });
}
```

## 🔧 API Endpoints

### For Users
- `POST /api/v1/push/register` - Register device
- `GET /api/v1/push/notifications` - Get notifications
- `PATCH /api/v1/push/notifications/:id/read` - Mark as read
- `GET /api/v1/push/preferences` - Get preferences
- `PUT /api/v1/push/preferences` - Update preferences

### For Admins
- `POST /api/v1/push/send` - Send to one user
- `POST /api/v1/push/send-batch` - Send to multiple users

## 🐛 Debugging

### Check if notification was sent

```typescript
const result = await pushService.sendPushNotification(userId, notification);
console.log(result); // Check status and error messages
```

### Check user's devices

```typescript
const devices = await pushService.getUserDeviceTokens(userId);
console.log(devices); // See registered devices
```

### Check user preferences

```typescript
const prefs = await pushService.getNotificationPreferences(userId);
console.log(prefs); // See what's enabled/disabled
```

## ⚠️ Common Mistakes

### ❌ Don't do this:
```typescript
// Blocking the main operation
const appointment = await createAppointment(data);
await pushService.sendPushNotification(userId, notification); // This might fail
return appointment; // User waits for notification to send
```

### ✅ Do this instead:
```typescript
// Non-blocking
const appointment = await createAppointment(data);

// Send notification asynchronously (don't await)
pushService.sendPushNotification(userId, notification)
  .catch(err => logger.error('Notification failed', err));

return appointment; // Return immediately
```

### ❌ Don't do this:
```typescript
// Ignoring notification types
await pushService.sendPushNotification(userId, {
  title: 'Appointment',
  body: 'Your appointment is tomorrow',
  type: 'general' // Wrong! Use appointment_reminder
});
```

### ✅ Do this instead:
```typescript
await pushService.sendPushNotification(userId, {
  title: 'Appointment Reminder',
  body: 'Your appointment is tomorrow',
  type: 'appointment_reminder' // Correct! Respects user preferences
});
```

## 📚 Full Documentation

- **Complete API Docs**: `src/docs/PUSH_NOTIFICATIONS.md`
- **Integration Examples**: `src/examples/push-notification-integration.example.ts`
- **Implementation Details**: `PUSH_NOTIFICATION_IMPLEMENTATION.md`

## 🆘 Need Help?

1. Check the error logs for detailed error messages
2. Verify your environment variables are set
3. Check that the user has an active device token
4. Verify the user's notification preferences
5. Check if the user is in quiet hours

## 🎉 You're Ready!

Start sending push notifications in your features. The service handles:
- ✅ User preferences
- ✅ Quiet hours
- ✅ Token management
- ✅ Retry logic
- ✅ Multi-platform support
- ✅ Notification history

Just call `pushService.sendPushNotification()` and you're done!

---

**Pro Tip**: Always wrap notification sending in try-catch and don't let notification failures break your main operations.

```typescript
try {
  await pushService.sendPushNotification(userId, notification);
} catch (error) {
  logger.error('Notification failed', { error, userId });
  // Continue with your operation
}
```
