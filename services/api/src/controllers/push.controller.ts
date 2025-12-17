import { Request, Response, NextFunction } from 'express';
import { pushService } from '../services/push.service.js';
import {
  RegisterDeviceSchema,
  UnregisterDeviceSchema,
  PushNotificationDataSchema,
  BatchPushNotificationSchema,
  NotificationPreferencesSchema,
  NotificationFiltersSchema,
} from '../dtos/push.dto.js';
import { BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * Push Notification Controller
 *
 * Handles HTTP requests for push notifications
 */

export const pushController = {
  /**
   * POST /push/register
   * Register a device token for push notifications
   */
  registerDevice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const input = RegisterDeviceSchema.parse(req.body);
      const deviceToken = await pushService.registerDevice(req.user.userId, input);

      res.status(201).json({
        message: 'Device registered successfully',
        device: {
          id: deviceToken.id,
          platform: deviceToken.platform,
          deviceName: deviceToken.deviceName,
          active: deviceToken.active,
          lastUsedAt: deviceToken.lastUsedAt,
          createdAt: deviceToken.createdAt,
        },
      });
    } catch (error) {
      logger.error('Register device error', { error });
      next(error);
    }
  },

  /**
   * DELETE /push/unregister
   * Unregister a device token
   */
  unregisterDevice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const input = UnregisterDeviceSchema.parse(req.body);
      await pushService.unregisterDevice(req.user.userId, input.token);

      res.json({ message: 'Device unregistered successfully' });
    } catch (error) {
      logger.error('Unregister device error', { error });
      next(error);
    }
  },

  /**
   * GET /push/devices
   * Get user's registered devices
   */
  getDevices: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const devices = await pushService.getUserDeviceTokens(req.user.userId);

      res.json({
        devices: devices.map(device => ({
          id: device.id,
          platform: device.platform,
          deviceName: device.deviceName,
          deviceModel: device.deviceModel,
          osVersion: device.osVersion,
          appVersion: device.appVersion,
          active: device.active,
          lastUsedAt: device.lastUsedAt,
          createdAt: device.createdAt,
        })),
        total: devices.length,
      });
    } catch (error) {
      logger.error('Get devices error', { error });
      next(error);
    }
  },

  /**
   * POST /push/send
   * Send a push notification to a user (admin only)
   */
  sendNotification: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const { userId, ...notificationData } = req.body;

      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const input = PushNotificationDataSchema.parse(notificationData);

      const notification = await pushService.sendPushNotification(userId, {
        title: input.title,
        body: input.body,
        type: input.type,
        data: input.data,
      });

      if (!notification) {
        res.json({
          message: 'Notification not sent due to user preferences',
        });
        return;
      }

      res.status(201).json({
        message: 'Notification sent successfully',
        notification: {
          id: notification.id,
          userId: notification.userId,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          status: notification.status,
          sentAt: notification.sentAt,
          createdAt: notification.createdAt,
        },
      });
    } catch (error) {
      logger.error('Send notification error', { error });
      next(error);
    }
  },

  /**
   * POST /push/send-batch
   * Send push notifications to multiple users (admin only)
   */
  sendBatchNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const input = BatchPushNotificationSchema.parse(req.body);

      const notifications = await pushService.sendBatchPushNotifications(
        input.userIds,
        {
          title: input.title,
          body: input.body,
          type: input.type,
          data: input.data,
        }
      );

      res.status(201).json({
        message: 'Batch notifications sent',
        successCount: notifications.length,
        totalCount: input.userIds.length,
        notifications: notifications.map(n => ({
          id: n.id,
          userId: n.userId,
          status: n.status,
        })),
      });
    } catch (error) {
      logger.error('Send batch notifications error', { error });
      next(error);
    }
  },

  /**
   * GET /push/notifications
   * Get user's notifications
   */
  getNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      // Parse query parameters
      const filters = NotificationFiltersSchema.parse({
        type: req.query.type,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        unreadOnly: req.query.unreadOnly === 'true',
      });

      const result = await pushService.getUserNotifications(req.user.userId, filters);

      res.json({
        notifications: result.notifications.map(n => ({
          id: n.id,
          title: n.title,
          body: n.body,
          type: n.type,
          status: n.status,
          data: n.data,
          sentAt: n.sentAt,
          readAt: n.readAt,
          createdAt: n.createdAt,
        })),
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.hasMore,
        },
      });
    } catch (error) {
      logger.error('Get notifications error', { error });
      next(error);
    }
  },

  /**
   * PATCH /push/notifications/:id/read
   * Mark a notification as read
   */
  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Notification ID is required');
      }

      const notification = await pushService.markNotificationAsRead(req.user.userId, id);

      res.json({
        message: 'Notification marked as read',
        notification: {
          id: notification.id,
          status: notification.status,
          readAt: notification.readAt,
        },
      });
    } catch (error) {
      logger.error('Mark as read error', { error });
      next(error);
    }
  },

  /**
   * POST /push/notifications/mark-all-read
   * Mark all notifications as read
   */
  markAllAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      // Get all unread notifications
      const unreadNotifications = await pushService.getUserNotifications(
        req.user.userId,
        { unreadOnly: true, limit: 100, offset: 0 }
      );

      // Mark each as read
      await Promise.all(
        unreadNotifications.notifications.map(n =>
          pushService.markNotificationAsRead(req.user.userId, n.id)
        )
      );

      res.json({
        message: 'All notifications marked as read',
        count: unreadNotifications.notifications.length,
      });
    } catch (error) {
      logger.error('Mark all as read error', { error });
      next(error);
    }
  },

  /**
   * GET /push/preferences
   * Get user's notification preferences
   */
  getPreferences: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const preferences = await pushService.getNotificationPreferences(req.user.userId);

      res.json({
        preferences: {
          id: preferences.id,
          userId: preferences.userId,
          emailEnabled: preferences.emailEnabled,
          smsEnabled: preferences.smsEnabled,
          pushEnabled: preferences.pushEnabled,
          appointmentReminders: preferences.appointmentReminders,
          messageAlerts: preferences.messageAlerts,
          prescriptionAlerts: preferences.prescriptionAlerts,
          labResultAlerts: preferences.labResultAlerts,
          paymentAlerts: preferences.paymentAlerts,
          marketingEmails: preferences.marketingEmails,
          quietHoursEnabled: preferences.quietHoursEnabled,
          quietHoursStart: preferences.quietHoursStart,
          quietHoursEnd: preferences.quietHoursEnd,
          quietHoursTimezone: preferences.quietHoursTimezone,
          createdAt: preferences.createdAt,
          updatedAt: preferences.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Get preferences error', { error });
      next(error);
    }
  },

  /**
   * PUT /push/preferences
   * Update user's notification preferences
   */
  updatePreferences: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const input = NotificationPreferencesSchema.parse(req.body);

      const preferences = await pushService.updateNotificationPreferences(
        req.user.userId,
        input
      );

      res.json({
        message: 'Preferences updated successfully',
        preferences: {
          id: preferences.id,
          userId: preferences.userId,
          emailEnabled: preferences.emailEnabled,
          smsEnabled: preferences.smsEnabled,
          pushEnabled: preferences.pushEnabled,
          appointmentReminders: preferences.appointmentReminders,
          messageAlerts: preferences.messageAlerts,
          prescriptionAlerts: preferences.prescriptionAlerts,
          labResultAlerts: preferences.labResultAlerts,
          paymentAlerts: preferences.paymentAlerts,
          marketingEmails: preferences.marketingEmails,
          quietHoursEnabled: preferences.quietHoursEnabled,
          quietHoursStart: preferences.quietHoursStart,
          quietHoursEnd: preferences.quietHoursEnd,
          quietHoursTimezone: preferences.quietHoursTimezone,
          updatedAt: preferences.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Update preferences error', { error });
      next(error);
    }
  },

  /**
   * GET /push/unread-count
   * Get count of unread notifications
   */
  getUnreadCount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const result = await pushService.getUserNotifications(
        req.user.userId,
        { unreadOnly: true, limit: 1, offset: 0 }
      );

      res.json({
        unreadCount: result.total,
      });
    } catch (error) {
      logger.error('Get unread count error', { error });
      next(error);
    }
  },
};
