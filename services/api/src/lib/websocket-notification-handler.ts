/**
 * WebSocket Notification Handler
 *
 * Handles real-time notifications to users
 *
 * @module websocket-notification-handler
 */

import { AuthenticatedSocket, emitToUser } from './websocket.js';
import { logger } from '../utils/logger.js';
import { prisma } from './prisma.js';

/**
 * Notification type
 */
export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  APPOINTMENT_RESCHEDULED = 'appointment_rescheduled',
  MESSAGE_RECEIVED = 'message_received',
  CALL_MISSED = 'call_missed',
  PRESCRIPTION_READY = 'prescription_ready',
  LAB_RESULTS_READY = 'lab_results_ready',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  SYSTEM_ALERT = 'system_alert',
}

/**
 * Notification priority
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Notification data structure
 */
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

/**
 * Mark notification as read request
 */
interface MarkAsReadData {
  notificationId: string;
}

/**
 * Subscribe to notification topics
 */
interface SubscribeData {
  topics: string[];
}

/**
 * Unsubscribe from notification topics
 */
interface UnsubscribeData {
  topics: string[];
}

/**
 * In-memory notification store (in production, use Redis or database)
 */
const notificationStore = new Map<string, Notification[]>();

/**
 * Notification subscriptions (userId -> Set of topics)
 */
const notificationSubscriptions = new Map<string, Set<string>>();

class NotificationHandler {
  /**
   * Send notification to user
   */
  async sendNotification(notification: Notification): Promise<void> {
    try {
      const { userId } = notification;

      // Store notification
      const userNotifications = notificationStore.get(userId) || [];
      userNotifications.push(notification);
      notificationStore.set(userId, userNotifications);

      // Emit real-time notification
      emitToUser(userId, 'notification:new', {
        id: notification.id,
        type: notification.type,
        priority: notification.priority,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        timestamp: notification.createdAt.toISOString(),
      });

      logger.info('Notification sent', {
        notificationId: notification.id,
        userId,
        type: notification.type,
        priority: notification.priority,
      });

      // Persist to database (if needed)
      // await this.persistNotification(notification);
    } catch (error) {
      logger.error('Error sending notification', {
        error: error instanceof Error ? error.message : 'Unknown error',
        notification,
      });
    }
  }

  /**
   * Handle mark notification as read
   */
  async handleMarkAsRead(
    socket: AuthenticatedSocket,
    data: MarkAsReadData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId } = socket;
      const { notificationId } = data;

      logger.debug('Marking notification as read', {
        userId,
        notificationId,
      });

      // Update in store
      const userNotifications = notificationStore.get(userId) || [];
      const notification = userNotifications.find((n) => n.id === notificationId);

      if (notification) {
        notification.read = true;
        notification.readAt = new Date();

        logger.info('Notification marked as read', {
          userId,
          notificationId,
        });

        callback?.({
          success: true,
          notificationId,
        });

        // Update in database
        // await this.updateNotificationReadStatus(notificationId, true);
      } else {
        callback?.({
          success: false,
          error: 'Notification not found',
        });
      }
    } catch (error) {
      logger.error('Error marking notification as read', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });

      callback?.({
        success: false,
        error: 'Failed to mark notification as read',
      });
    }
  }

  /**
   * Handle mark all notifications as read
   */
  async handleMarkAllAsRead(
    socket: AuthenticatedSocket,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId } = socket;

      logger.debug('Marking all notifications as read', { userId });

      const userNotifications = notificationStore.get(userId) || [];
      let markedCount = 0;

      userNotifications.forEach((notification) => {
        if (!notification.read) {
          notification.read = true;
          notification.readAt = new Date();
          markedCount++;
        }
      });

      logger.info('All notifications marked as read', {
        userId,
        markedCount,
      });

      callback?.({
        success: true,
        markedCount,
      });

      // Update in database
      // await this.markAllNotificationsAsRead(userId);
    } catch (error) {
      logger.error('Error marking all notifications as read', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });

      callback?.({
        success: false,
        error: 'Failed to mark all notifications as read',
      });
    }
  }

  /**
   * Handle get unread count
   */
  async handleGetUnreadCount(
    socket: AuthenticatedSocket,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId } = socket;

      const unreadCount = await this.getUnreadCount(userId);

      logger.debug('Unread count retrieved', {
        userId,
        unreadCount,
      });

      callback?.({
        success: true,
        unreadCount,
      });
    } catch (error) {
      logger.error('Error getting unread count', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });

      callback?.({
        success: false,
        error: 'Failed to get unread count',
      });
    }
  }

  /**
   * Handle subscribe to notification topics
   */
  async handleSubscribe(socket: AuthenticatedSocket, data: SubscribeData): Promise<void> {
    try {
      const { userId } = socket;
      const { topics } = data;

      let userTopics = notificationSubscriptions.get(userId);
      if (!userTopics) {
        userTopics = new Set();
        notificationSubscriptions.set(userId, userTopics);
      }

      topics.forEach((topic) => {
        userTopics!.add(topic);
        // Join Socket.io room for this topic
        socket.join(`topic:${topic}`);
      });

      logger.info('User subscribed to notification topics', {
        userId,
        topics,
      });

      socket.emit('notification:subscribed', {
        topics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error subscribing to notification topics', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle unsubscribe from notification topics
   */
  async handleUnsubscribe(socket: AuthenticatedSocket, data: UnsubscribeData): Promise<void> {
    try {
      const { userId } = socket;
      const { topics } = data;

      const userTopics = notificationSubscriptions.get(userId);
      if (userTopics) {
        topics.forEach((topic) => {
          userTopics.delete(topic);
          // Leave Socket.io room for this topic
          socket.leave(`topic:${topic}`);
        });
      }

      logger.info('User unsubscribed from notification topics', {
        userId,
        topics,
      });

      socket.emit('notification:unsubscribed', {
        topics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error unsubscribing from notification topics', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Get unread notification count for user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const userNotifications = notificationStore.get(userId) || [];
      return userNotifications.filter((n) => !n.read).length;

      // In production, query from database:
      // return await prisma.notification.count({
      //   where: {
      //     userId,
      //     read: false
      //   }
      // });
    } catch (error) {
      logger.error('Error getting unread count', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return 0;
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    try {
      let notifications = notificationStore.get(userId) || [];

      if (unreadOnly) {
        notifications = notifications.filter((n) => !n.read);
      }

      // Sort by creation date (newest first)
      notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return notifications.slice(0, limit);

      // In production, query from database:
      // return await prisma.notification.findMany({
      //   where: {
      //     userId,
      //     ...(unreadOnly ? { read: false } : {})
      //   },
      //   orderBy: {
      //     createdAt: 'desc'
      //   },
      //   take: limit
      // });
    } catch (error) {
      logger.error('Error getting user notifications', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return [];
    }
  }

  /**
   * Create and send notification (helper method)
   */
  async createAndSendNotification(
    userId: string,
    type: NotificationType,
    priority: NotificationPriority,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      priority,
      title,
      message,
      data,
      read: false,
      createdAt: new Date(),
    };

    await this.sendNotification(notification);
  }

  /**
   * Broadcast notification to topic
   */
  async broadcastToTopic(
    topic: string,
    type: NotificationType,
    priority: NotificationPriority,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    try {
      logger.info('Broadcasting notification to topic', {
        topic,
        type,
        priority,
      });

      // Emit to all users subscribed to this topic
      const io = require('./websocket.js').getIO();
      io.to(`topic:${topic}`).emit('notification:new', {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        priority,
        title,
        message,
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error broadcasting to topic', {
        error: error instanceof Error ? error.message : 'Unknown error',
        topic,
      });
    }
  }

  /**
   * Clean up user notification subscriptions on disconnect
   */
  cleanupSubscriptions(userId: string): void {
    notificationSubscriptions.delete(userId);
  }

  /**
   * Get notification statistics
   */
  getStats() {
    let totalNotifications = 0;
    let totalUnread = 0;

    notificationStore.forEach((notifications) => {
      totalNotifications += notifications.length;
      totalUnread += notifications.filter((n) => !n.read).length;
    });

    return {
      totalNotifications,
      totalUnread,
      totalUsers: notificationStore.size,
      totalSubscriptions: notificationSubscriptions.size,
    };
  }

  /**
   * Persist notification to database (placeholder)
   */
  private async persistNotification(notification: Notification): Promise<void> {
    try {
      // This would save to a notifications table
      // await prisma.notification.create({
      //   data: {
      //     id: notification.id,
      //     userId: notification.userId,
      //     type: notification.type,
      //     priority: notification.priority,
      //     title: notification.title,
      //     message: notification.message,
      //     data: notification.data,
      //     read: false,
      //     createdAt: notification.createdAt
      //   }
      // });

      logger.debug('Notification persisted', {
        notificationId: notification.id,
      });
    } catch (error) {
      logger.error('Error persisting notification', {
        error: error instanceof Error ? error.message : 'Unknown error',
        notificationId: notification.id,
      });
    }
  }

  /**
   * Update notification read status in database (placeholder)
   */
  private async updateNotificationReadStatus(
    notificationId: string,
    read: boolean
  ): Promise<void> {
    try {
      // This would update the notifications table
      // await prisma.notification.update({
      //   where: { id: notificationId },
      //   data: {
      //     read,
      //     readAt: read ? new Date() : null
      //   }
      // });

      logger.debug('Notification read status updated', {
        notificationId,
        read,
      });
    } catch (error) {
      logger.error('Error updating notification read status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        notificationId,
      });
    }
  }

  /**
   * Mark all notifications as read in database (placeholder)
   */
  private async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      // This would update all unread notifications for the user
      // await prisma.notification.updateMany({
      //   where: {
      //     userId,
      //     read: false
      //   },
      //   data: {
      //     read: true,
      //     readAt: new Date()
      //   }
      // });

      logger.debug('All notifications marked as read in database', {
        userId,
      });
    } catch (error) {
      logger.error('Error marking all notifications as read in database', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }
}

// Export singleton instance
export const notificationHandler = new NotificationHandler();
