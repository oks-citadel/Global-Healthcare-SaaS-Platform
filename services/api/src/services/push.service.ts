import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';
import { pushNotificationService, PushPayload } from '../lib/push.js';
import {
  Platform,
  NotificationType,
  NotificationStatus,
  Prisma,
} from '../generated/client';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import {
  RegisterDeviceInput,
  NotificationPreferencesInput,
  NotificationFilters,
} from '../dtos/push.dto.js';

/**
 * Push Notification Service
 *
 * Manages device tokens, push notifications, and user preferences
 */

/**
 * Register a device token for push notifications
 *
 * @param userId - User ID
 * @param input - Device registration data
 * @returns Device token record
 */
export async function registerDevice(userId: string, input: RegisterDeviceInput) {
  try {
    logger.info('Registering device token', { userId, platform: input.platform });

    // Validate token
    if (!pushNotificationService.validateToken(input.token, input.platform)) {
      throw new BadRequestError('Invalid device token format');
    }

    // Check if token already exists
    const existingToken = await prisma.deviceToken.findUnique({
      where: { token: input.token },
    });

    if (existingToken) {
      // Update existing token
      const updatedToken = await prisma.deviceToken.update({
        where: { token: input.token },
        data: {
          userId,
          platform: input.platform,
          deviceName: input.deviceName,
          deviceModel: input.deviceModel,
          osVersion: input.osVersion,
          appVersion: input.appVersion,
          active: true,
          lastUsedAt: new Date(),
        },
      });

      logger.info('Device token updated', { tokenId: updatedToken.id });
      return updatedToken;
    }

    // Create new token
    const deviceToken = await prisma.deviceToken.create({
      data: {
        userId,
        token: input.token,
        platform: input.platform,
        deviceName: input.deviceName,
        deviceModel: input.deviceModel,
        osVersion: input.osVersion,
        appVersion: input.appVersion,
        active: true,
        lastUsedAt: new Date(),
      },
    });

    logger.info('Device token registered', { tokenId: deviceToken.id });
    return deviceToken;
  } catch (error) {
    logger.error('Failed to register device token', { error, userId });
    throw error;
  }
}

/**
 * Unregister a device token
 *
 * @param userId - User ID
 * @param token - Device token
 */
export async function unregisterDevice(userId: string, token: string) {
  try {
    logger.info('Unregistering device token', { userId, token });

    const deviceToken = await prisma.deviceToken.findUnique({
      where: { token },
    });

    if (!deviceToken) {
      throw new NotFoundError('Device token not found');
    }

    if (deviceToken.userId !== userId) {
      throw new BadRequestError('Device token does not belong to user');
    }

    await prisma.deviceToken.update({
      where: { token },
      data: { active: false },
    });

    logger.info('Device token unregistered');
    return { message: 'Device unregistered successfully' };
  } catch (error) {
    logger.error('Failed to unregister device token', { error, userId });
    throw error;
  }
}

/**
 * Get user's active device tokens
 *
 * @param userId - User ID
 * @returns Active device tokens
 */
export async function getUserDeviceTokens(userId: string) {
  try {
    const tokens = await prisma.deviceToken.findMany({
      where: {
        userId,
        active: true,
      },
      orderBy: { lastUsedAt: 'desc' },
    });

    return tokens;
  } catch (error) {
    logger.error('Failed to get user device tokens', { error, userId });
    throw error;
  }
}

/**
 * Check if user is in quiet hours
 *
 * @param userId - User ID
 * @returns True if in quiet hours
 */
async function isInQuietHours(userId: string): Promise<boolean> {
  try {
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences || !preferences.quietHoursEnabled) {
      return false;
    }

    if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }

    // Get current time in user's timezone
    const timezone = preferences.quietHoursTimezone || 'UTC';
    const now = new Date();
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const currentHour = userTime.getHours();
    const currentMinute = userTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Parse quiet hours
    const [startHour, startMinute] = preferences.quietHoursStart.split(':').map(Number);
    const [endHour, endMinute] = preferences.quietHoursEnd.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Check if current time is within quiet hours
    if (startTimeInMinutes < endTimeInMinutes) {
      // Normal case: quiet hours don't cross midnight
      return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
    } else {
      // Quiet hours cross midnight
      return currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes < endTimeInMinutes;
    }
  } catch (error) {
    logger.error('Failed to check quiet hours', { error, userId });
    return false;
  }
}

/**
 * Check if user can receive notification type
 *
 * @param userId - User ID
 * @param type - Notification type
 * @returns True if notification is allowed
 */
async function canReceiveNotification(userId: string, type: NotificationType): Promise<boolean> {
  try {
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return true; // Default to allowing all notifications
    }

    // Check if push is enabled
    if (!preferences.pushEnabled) {
      return false;
    }

    // Check type-specific preferences
    switch (type) {
      case 'appointment_reminder':
      case 'appointment_confirmation':
      case 'appointment_cancelled':
        return preferences.appointmentReminders;
      case 'message_received':
        return preferences.messageAlerts;
      case 'prescription_ready':
        return preferences.prescriptionAlerts;
      case 'lab_results_available':
        return preferences.labResultAlerts;
      case 'payment_due':
      case 'payment_received':
        return preferences.paymentAlerts;
      case 'general':
        return true;
      default:
        return true;
    }
  } catch (error) {
    logger.error('Failed to check notification preferences', { error, userId });
    return true; // Default to allowing notification on error
  }
}

/**
 * Send push notification to a user
 *
 * @param userId - User ID
 * @param notification - Notification data
 * @returns Notification record
 */
export async function sendPushNotification(
  userId: string,
  notification: {
    title: string;
    body: string;
    type: NotificationType;
    data?: Record<string, any>;
  }
) {
  try {
    logger.info('Sending push notification', { userId, type: notification.type, title: notification.title });

    // Check if user can receive this notification type
    const canReceive = await canReceiveNotification(userId, notification.type);
    if (!canReceive) {
      logger.info('User preferences prevent notification', { userId, type: notification.type });
      return null;
    }

    // Check quiet hours
    const inQuietHours = await isInQuietHours(userId);
    if (inQuietHours) {
      logger.info('User is in quiet hours, notification will be delayed', { userId });
      // Create notification but don't send immediately
      const savedNotification = await prisma.pushNotification.create({
        data: {
          userId,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          data: notification.data || {},
          status: 'pending',
        },
      });
      return savedNotification;
    }

    // Get user's active device tokens
    const deviceTokens = await getUserDeviceTokens(userId);

    if (deviceTokens.length === 0) {
      logger.info('No active device tokens found', { userId });
      // Save notification even if no devices
      const savedNotification = await prisma.pushNotification.create({
        data: {
          userId,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          data: notification.data || {},
          status: 'failed',
          failedReason: 'No active device tokens',
        },
      });
      return savedNotification;
    }

    // Prepare push payload
    const payload: PushPayload = {
      title: notification.title,
      body: notification.body,
      data: notification.data,
      priority: 'high',
      sound: 'default',
    };

    // Send to all devices
    const results = await pushNotificationService.sendBatchPushNotifications(
      deviceTokens.map(token => ({ token: token.token, platform: token.platform })),
      payload
    );

    // Determine overall status
    const status: NotificationStatus = results.successCount > 0 ? 'sent' : 'failed';
    const failedReason = results.successCount === 0
      ? results.results[0]?.error || 'All devices failed'
      : undefined;

    // Save notification
    const savedNotification = await prisma.pushNotification.create({
      data: {
        userId,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        data: notification.data || {},
        status,
        sentAt: status === 'sent' ? new Date() : null,
        failedReason,
      },
    });

    // Deactivate failed tokens
    const failedTokens = results.results
      .filter(r => !r.success)
      .map(r => r.token);

    if (failedTokens.length > 0) {
      await prisma.deviceToken.updateMany({
        where: {
          token: { in: failedTokens },
        },
        data: {
          active: false,
        },
      });
      logger.info('Deactivated failed device tokens', { count: failedTokens.length });
    }

    logger.info('Push notification sent', {
      notificationId: savedNotification.id,
      successCount: results.successCount,
      failureCount: results.failureCount,
    });

    return savedNotification;
  } catch (error) {
    logger.error('Failed to send push notification', { error, userId });
    throw error;
  }
}

/**
 * Send push notifications to multiple users
 *
 * @param userIds - Array of user IDs
 * @param notification - Notification data
 * @returns Array of notification records
 */
export async function sendBatchPushNotifications(
  userIds: string[],
  notification: {
    title: string;
    body: string;
    type: NotificationType;
    data?: Record<string, any>;
  }
) {
  try {
    logger.info('Sending batch push notifications', { userCount: userIds.length, type: notification.type });

    const results = await Promise.all(
      userIds.map(userId => sendPushNotification(userId, notification))
    );

    const successCount = results.filter(r => r !== null).length;
    logger.info('Batch push notifications completed', { successCount, totalCount: userIds.length });

    return results.filter(r => r !== null);
  } catch (error) {
    logger.error('Failed to send batch push notifications', { error });
    throw error;
  }
}

/**
 * Get notification preferences for a user
 *
 * @param userId - User ID
 * @returns Notification preferences
 */
export async function getNotificationPreferences(userId: string) {
  try {
    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: { userId },
      });
      logger.info('Created default notification preferences', { userId });
    }

    return preferences;
  } catch (error) {
    logger.error('Failed to get notification preferences', { error, userId });
    throw error;
  }
}

/**
 * Update notification preferences for a user
 *
 * @param userId - User ID
 * @param input - Preferences to update
 * @returns Updated preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  input: NotificationPreferencesInput
) {
  try {
    logger.info('Updating notification preferences', { userId });

    // Validate quiet hours
    if (input.quietHoursEnabled) {
      if (!input.quietHoursStart || !input.quietHoursEnd) {
        throw new BadRequestError('Quiet hours start and end times are required when enabled');
      }
    }

    // Ensure preferences exist
    await getNotificationPreferences(userId);

    // Update preferences
    const preferences = await prisma.notificationPreference.update({
      where: { userId },
      data: input as Prisma.NotificationPreferenceUpdateInput,
    });

    logger.info('Notification preferences updated', { userId });
    return preferences;
  } catch (error) {
    logger.error('Failed to update notification preferences', { error, userId });
    throw error;
  }
}

/**
 * Mark a notification as read
 *
 * @param userId - User ID
 * @param notificationId - Notification ID
 * @returns Updated notification
 */
export async function markNotificationAsRead(userId: string, notificationId: string) {
  try {
    logger.info('Marking notification as read', { userId, notificationId });

    const notification = await prisma.pushNotification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new BadRequestError('Notification does not belong to user');
    }

    if (notification.readAt) {
      logger.info('Notification already marked as read', { notificationId });
      return notification;
    }

    const updatedNotification = await prisma.pushNotification.update({
      where: { id: notificationId },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });

    logger.info('Notification marked as read', { notificationId });
    return updatedNotification;
  } catch (error) {
    logger.error('Failed to mark notification as read', { error, userId, notificationId });
    throw error;
  }
}

/**
 * Get user notifications with filters
 *
 * @param userId - User ID
 * @param filters - Filter options
 * @returns Paginated notifications
 */
export async function getUserNotifications(userId: string, filters: NotificationFilters) {
  try {
    logger.info('Getting user notifications', { userId, filters });

    // Build where clause
    const where: Prisma.PushNotificationWhereInput = {
      userId,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.unreadOnly) {
      where.readAt = null;
    }

    if (filters.startDate) {
      where.createdAt = {
        ...(where.createdAt as object || {}),
        gte: new Date(filters.startDate),
      };
    }

    if (filters.endDate) {
      where.createdAt = {
        ...(where.createdAt as object || {}),
        lte: new Date(filters.endDate),
      };
    }

    // Get total count
    const total = await prisma.pushNotification.count({ where });

    // Get notifications
    const notifications = await prisma.pushNotification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    const hasMore = (filters.offset || 0) + notifications.length < total;

    logger.info('Retrieved user notifications', { userId, count: notifications.length, total });

    return {
      notifications,
      total,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      hasMore,
    };
  } catch (error) {
    logger.error('Failed to get user notifications', { error, userId });
    throw error;
  }
}

/**
 * Delete old notifications (cleanup job)
 *
 * @param daysOld - Delete notifications older than this many days
 * @returns Number of deleted notifications
 */
export async function deleteOldNotifications(daysOld: number = 90) {
  try {
    logger.info('Deleting old notifications', { daysOld });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.pushNotification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        status: { in: ['read', 'failed'] },
      },
    });

    logger.info('Old notifications deleted', { count: result.count });
    return result.count;
  } catch (error) {
    logger.error('Failed to delete old notifications', { error });
    throw error;
  }
}

export const pushService = {
  registerDevice,
  unregisterDevice,
  getUserDeviceTokens,
  sendPushNotification,
  sendBatchPushNotifications,
  getNotificationPreferences,
  updateNotificationPreferences,
  markNotificationAsRead,
  getUserNotifications,
  deleteOldNotifications,
};

export default pushService;
