# Push Notification API Examples

This document provides examples of how to integrate the push notification service into your API endpoints.

## API Endpoint Examples

### 1. Register Device Token

**Endpoint**: `POST /api/notifications/register`

**Purpose**: Register a device token for push notifications

**Request Body**:
```json
{
  "userId": "user-123",
  "token": "device-token-or-subscription-json",
  "platform": "android" // or "ios" or "web"
}
```

**Implementation**:

```typescript
import { Router, Request, Response } from 'express';
import { pushNotificationService } from '../lib/push';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { userId, token, platform } = req.body;

    // Validate input
    if (!userId || !token || !platform) {
      return res.status(400).json({
        error: 'Missing required fields: userId, token, platform',
      });
    }

    // Validate token format
    if (!pushNotificationService.validateToken(token, platform)) {
      return res.status(400).json({
        error: 'Invalid token format for the specified platform',
      });
    }

    // Check if platform is configured
    if (!pushNotificationService.isPlatformConfigured(platform)) {
      return res.status(503).json({
        error: `Push notifications not configured for platform: ${platform}`,
      });
    }

    // Store token in database
    const deviceToken = await prisma.deviceToken.upsert({
      where: {
        userId_token: {
          userId,
          token,
        },
      },
      update: {
        platform,
        updatedAt: new Date(),
        isActive: true,
      },
      create: {
        userId,
        token,
        platform,
        isActive: true,
      },
    });

    res.json({
      success: true,
      message: 'Device token registered successfully',
      tokenId: deviceToken.id,
    });
  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({
      error: 'Failed to register device token',
    });
  }
});

export default router;
```

### 2. Send Notification to User

**Endpoint**: `POST /api/notifications/send`

**Purpose**: Send a push notification to a specific user

**Request Body**:
```json
{
  "userId": "user-123",
  "title": "Appointment Reminder",
  "body": "Your appointment is in 30 minutes",
  "data": {
    "appointmentId": "appt-456",
    "type": "appointment_reminder"
  },
  "priority": "high"
}
```

**Implementation**:

```typescript
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { userId, title, body, data, priority } = req.body;

    // Validate input
    if (!userId || !title || !body) {
      return res.status(400).json({
        error: 'Missing required fields: userId, title, body',
      });
    }

    // Get all active device tokens for the user
    const deviceTokens = await prisma.deviceToken.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (deviceTokens.length === 0) {
      return res.status(404).json({
        error: 'No active device tokens found for user',
      });
    }

    // Prepare tokens for batch sending
    const tokens = deviceTokens.map((dt) => ({
      token: dt.token,
      platform: dt.platform,
    }));

    // Send notifications
    const result = await pushNotificationService.sendBatchPushNotifications(
      tokens,
      {
        title,
        body,
        data,
        priority: priority || 'normal',
      }
    );

    // Handle failed tokens (mark as inactive)
    const failedTokens = result.results
      .filter((r) => !r.success && (
        r.error?.includes('invalid') ||
        r.error?.includes('expired') ||
        r.error?.includes('unregistered')
      ))
      .map((r) => r.token);

    if (failedTokens.length > 0) {
      await prisma.deviceToken.updateMany({
        where: {
          token: {
            in: failedTokens,
          },
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
    }

    res.json({
      success: true,
      totalSent: result.successCount,
      totalFailed: result.failureCount,
      invalidTokensRemoved: failedTokens.length,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      error: 'Failed to send notification',
    });
  }
});
```

### 3. Send Notification to Multiple Users

**Endpoint**: `POST /api/notifications/send-bulk`

**Purpose**: Send a push notification to multiple users

**Request Body**:
```json
{
  "userIds": ["user-123", "user-456", "user-789"],
  "title": "System Maintenance",
  "body": "The system will be down for maintenance tonight",
  "priority": "normal"
}
```

**Implementation**:

```typescript
router.post('/send-bulk', async (req: Request, res: Response) => {
  try {
    const { userIds, title, body, data, priority } = req.body;

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: 'userIds must be a non-empty array',
      });
    }

    if (!title || !body) {
      return res.status(400).json({
        error: 'Missing required fields: title, body',
      });
    }

    // Get all active device tokens for the users
    const deviceTokens = await prisma.deviceToken.findMany({
      where: {
        userId: {
          in: userIds,
        },
        isActive: true,
      },
    });

    if (deviceTokens.length === 0) {
      return res.status(404).json({
        error: 'No active device tokens found for any users',
      });
    }

    // Prepare tokens for batch sending
    const tokens = deviceTokens.map((dt) => ({
      token: dt.token,
      platform: dt.platform,
    }));

    // Send notifications
    const result = await pushNotificationService.sendBatchPushNotifications(
      tokens,
      {
        title,
        body,
        data,
        priority: priority || 'normal',
      }
    );

    // Handle failed tokens
    const failedTokens = result.results
      .filter((r) => !r.success && (
        r.error?.includes('invalid') ||
        r.error?.includes('expired') ||
        r.error?.includes('unregistered')
      ))
      .map((r) => r.token);

    if (failedTokens.length > 0) {
      await prisma.deviceToken.updateMany({
        where: {
          token: {
            in: failedTokens,
          },
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
    }

    res.json({
      success: true,
      usersTargeted: userIds.length,
      devicesTargeted: tokens.length,
      totalSent: result.successCount,
      totalFailed: result.failureCount,
      invalidTokensRemoved: failedTokens.length,
    });
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    res.status(500).json({
      error: 'Failed to send bulk notifications',
    });
  }
});
```

### 4. Get VAPID Public Key

**Endpoint**: `GET /api/notifications/vapid-public-key`

**Purpose**: Get the VAPID public key for web push subscriptions

**Implementation**:

```typescript
router.get('/vapid-public-key', (req: Request, res: Response) => {
  try {
    const publicKey = pushNotificationService.getVapidPublicKey();

    if (!publicKey) {
      return res.status(503).json({
        error: 'Web Push is not configured',
      });
    }

    res.json({
      publicKey,
    });
  } catch (error) {
    console.error('Error getting VAPID public key:', error);
    res.status(500).json({
      error: 'Failed to get VAPID public key',
    });
  }
});
```

### 5. Remove Device Token

**Endpoint**: `DELETE /api/notifications/token/:tokenId`

**Purpose**: Remove a device token (when user logs out or uninstalls app)

**Implementation**:

```typescript
router.delete('/token/:tokenId', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const userId = req.user?.id; // From auth middleware

    // Delete the token
    const deleted = await prisma.deviceToken.deleteMany({
      where: {
        id: tokenId,
        userId, // Ensure user can only delete their own tokens
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        error: 'Token not found',
      });
    }

    res.json({
      success: true,
      message: 'Device token removed successfully',
    });
  } catch (error) {
    console.error('Error removing device token:', error);
    res.status(500).json({
      error: 'Failed to remove device token',
    });
  }
});
```

## Database Schema

Add this model to your `schema.prisma`:

```prisma
model DeviceToken {
  id        String   @id @default(cuid())
  userId    String
  token     String
  platform  Platform
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, token])
  @@index([userId])
  @@index([isActive])
  @@map("device_tokens")
}

enum Platform {
  android
  ios
  web
}
```

Run migration:
```bash
npx prisma migrate dev --name add_device_tokens
```

## Background Job Example

For scheduled notifications (e.g., appointment reminders):

```typescript
import { CronJob } from 'cron';
import { pushNotificationService } from '../lib/push';
import { prisma } from '../lib/prisma';

// Run every 5 minutes
const appointmentReminderJob = new CronJob('*/5 * * * *', async () => {
  try {
    console.log('Running appointment reminder job...');

    // Find appointments starting in 30 minutes
    const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000);
    const thirtyFiveMinutesFromNow = new Date(Date.now() + 35 * 60 * 1000);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: thirtyMinutesFromNow,
          lte: thirtyFiveMinutesFromNow,
        },
        status: 'confirmed',
        reminderSent: false,
      },
      include: {
        patient: {
          include: {
            deviceTokens: {
              where: {
                isActive: true,
              },
            },
          },
        },
        provider: true,
      },
    });

    console.log(`Found ${upcomingAppointments.length} appointments to remind`);

    // Send reminders
    for (const appointment of upcomingAppointments) {
      const tokens = appointment.patient.deviceTokens.map((dt) => ({
        token: dt.token,
        platform: dt.platform,
      }));

      if (tokens.length > 0) {
        await pushNotificationService.sendBatchPushNotifications(tokens, {
          title: 'Appointment Reminder',
          body: `Your appointment with ${appointment.provider.name} is in 30 minutes`,
          data: {
            appointmentId: appointment.id,
            type: 'appointment_reminder',
          },
          priority: 'high',
          badge: 1,
        });

        // Mark as sent
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { reminderSent: true },
        });
      }
    }

    console.log('Appointment reminder job completed');
  } catch (error) {
    console.error('Error in appointment reminder job:', error);
  }
});

// Start the job
appointmentReminderJob.start();

export { appointmentReminderJob };
```

## WebSocket Integration

For real-time notifications:

```typescript
import { Server } from 'socket.io';
import { pushNotificationService } from '../lib/push';

export function setupNotificationHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Register for push notifications
    socket.on('register-push', async (data) => {
      const { userId, token, platform } = data;

      // Validate and store token
      if (pushNotificationService.validateToken(token, platform)) {
        await prisma.deviceToken.upsert({
          where: {
            userId_token: { userId, token },
          },
          update: {
            platform,
            isActive: true,
            updatedAt: new Date(),
          },
          create: {
            userId,
            token,
            platform,
            isActive: true,
          },
        });

        socket.emit('push-registered', { success: true });
      } else {
        socket.emit('push-registered', { success: false, error: 'Invalid token' });
      }
    });

    // Send push notification
    socket.on('send-notification', async (data) => {
      const { userId, title, body, priority } = data;

      // Get user tokens
      const deviceTokens = await prisma.deviceToken.findMany({
        where: { userId, isActive: true },
      });

      const tokens = deviceTokens.map((dt) => ({
        token: dt.token,
        platform: dt.platform,
      }));

      // Send push
      const result = await pushNotificationService.sendBatchPushNotifications(
        tokens,
        { title, body, priority }
      );

      socket.emit('notification-sent', result);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
```

## Testing Examples

### Unit Test Example

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pushNotificationService } from '../lib/push';

describe('Push Notification Service', () => {
  beforeAll(() => {
    // Set test environment variables
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_CLIENT_EMAIL = 'test@test.iam.gserviceaccount.com';
    process.env.FIREBASE_PRIVATE_KEY = 'test-key';
  });

  afterAll(async () => {
    await pushNotificationService.cleanup();
  });

  it('should validate Android tokens', () => {
    const validToken = 'a'.repeat(152);
    const invalidToken = 'short';

    expect(pushNotificationService.validateToken(validToken, 'android')).toBe(true);
    expect(pushNotificationService.validateToken(invalidToken, 'android')).toBe(false);
  });

  it('should validate iOS tokens', () => {
    const validToken = 'a'.repeat(64);
    const invalidToken = 'short';

    expect(pushNotificationService.validateToken(validToken, 'ios')).toBe(true);
    expect(pushNotificationService.validateToken(invalidToken, 'ios')).toBe(false);
  });

  it('should validate Web Push subscriptions', () => {
    const validSubscription = JSON.stringify({
      endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
      keys: {
        p256dh: 'key1',
        auth: 'key2',
      },
    });

    const invalidSubscription = JSON.stringify({ invalid: 'data' });

    expect(pushNotificationService.validateToken(validSubscription, 'web')).toBe(true);
    expect(pushNotificationService.validateToken(invalidSubscription, 'web')).toBe(false);
  });

  it('should check platform configuration', () => {
    expect(pushNotificationService.isPlatformConfigured('android')).toBe(true);
    expect(pushNotificationService.isPlatformConfigured('ios')).toBe(false);
    expect(pushNotificationService.isPlatformConfigured('web')).toBe(false);
  });

  it('should return VAPID public key', () => {
    const publicKey = pushNotificationService.getVapidPublicKey();
    expect(publicKey).toBeUndefined(); // Not configured in test
  });
});
```

### Integration Test Example

```typescript
import request from 'supertest';
import { app } from '../app';
import { describe, it, expect } from 'vitest';

describe('Notification API', () => {
  it('should register device token', async () => {
    const response = await request(app)
      .post('/api/notifications/register')
      .send({
        userId: 'test-user-123',
        token: 'a'.repeat(152),
        platform: 'android',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should reject invalid token', async () => {
    const response = await request(app)
      .post('/api/notifications/register')
      .send({
        userId: 'test-user-123',
        token: 'invalid',
        platform: 'android',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid token');
  });

  it('should get VAPID public key', async () => {
    const response = await request(app)
      .get('/api/notifications/vapid-public-key');

    expect(response.status).toBe(200);
    expect(response.body.publicKey).toBeDefined();
  });
});
```

## Error Handling Best Practices

```typescript
// Centralized error handler
router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Notification API error:', error);

  // Log to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // logToSentry(error);
  }

  res.status(500).json({
    error: 'An error occurred while processing your request',
    requestId: req.id,
  });
});
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Limit to 100 notifications per hour per user
const notificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'Too many notifications sent, please try again later',
  keyGenerator: (req) => req.user?.id || req.ip,
});

router.post('/send', notificationLimiter, async (req, res) => {
  // ... send notification
});
```

## Complete Express App Integration

```typescript
import express from 'express';
import notificationRoutes from './routes/notifications';
import { pushNotificationService } from './lib/push';

const app = express();

app.use(express.json());
app.use('/api/notifications', notificationRoutes);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, cleaning up...');
  await pushNotificationService.cleanup();
  process.exit(0);
});

export { app };
```

This completes the push notification API integration examples!
