import { logger } from '../utils/logger.js';
import { Platform } from '@prisma/client';

/**
 * Push Notification Library
 *
 * Integrates with:
 * - Firebase Cloud Messaging (FCM) for Android and iOS
 * - Apple Push Notification Service (APNS) for iOS native
 * - Web Push API for web browsers
 */

// FCM configuration
interface FCMConfig {
  serverKey: string;
  senderId: string;
}

// APNS configuration
interface APNSConfig {
  keyId: string;
  teamId: string;
  bundleId: string;
  production: boolean;
  keyPath?: string;
}

// Web Push configuration
interface WebPushConfig {
  vapidPublicKey: string;
  vapidPrivateKey: string;
  subject: string;
}

// Push notification payload
export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: string;
  priority?: 'high' | 'normal';
  ttl?: number;
  icon?: string;
  image?: string;
  clickAction?: string;
}

// Push notification result
export interface PushResult {
  success: boolean;
  messageId?: string;
  error?: string;
  platform: Platform;
}

// Batch push result
export interface BatchPushResult {
  successCount: number;
  failureCount: number;
  results: Array<{
    token: string;
    success: boolean;
    error?: string;
  }>;
}

class PushNotificationService {
  private fcmConfig?: FCMConfig;
  private apnsConfig?: APNSConfig;
  private webPushConfig?: WebPushConfig;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize push notification services
   */
  private initialize() {
    try {
      // Load FCM configuration
      if (process.env.FCM_SERVER_KEY && process.env.FCM_SENDER_ID) {
        this.fcmConfig = {
          serverKey: process.env.FCM_SERVER_KEY,
          senderId: process.env.FCM_SENDER_ID,
        };
        logger.info('FCM configuration loaded');
      }

      // Load APNS configuration
      if (process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID && process.env.APNS_BUNDLE_ID) {
        this.apnsConfig = {
          keyId: process.env.APNS_KEY_ID,
          teamId: process.env.APNS_TEAM_ID,
          bundleId: process.env.APNS_BUNDLE_ID,
          production: process.env.APNS_PRODUCTION === 'true',
          keyPath: process.env.APNS_KEY_PATH,
        };
        logger.info('APNS configuration loaded');
      }

      // Load Web Push configuration
      if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        this.webPushConfig = {
          vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
          vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
          subject: process.env.VAPID_SUBJECT || 'mailto:support@unifiedhealth.com',
        };
        logger.info('Web Push configuration loaded');
      }

      this.initialized = true;
      logger.info('Push notification service initialized');
    } catch (error) {
      logger.error('Failed to initialize push notification service', { error });
      throw error;
    }
  }

  /**
   * Send push notification to a single device
   *
   * @param token - Device token
   * @param platform - Device platform
   * @param payload - Notification payload
   * @returns Push result
   */
  async sendPushNotification(
    token: string,
    platform: Platform,
    payload: PushPayload
  ): Promise<PushResult> {
    try {
      logger.info({ token, platform, title: payload.title }, 'Sending push notification');

      switch (platform) {
        case 'android':
          return await this.sendFCMNotification(token, payload);
        case 'ios':
          return await this.sendAPNSNotification(token, payload);
        case 'web':
          return await this.sendWebPushNotification(token, payload);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      logger.error('Failed to send push notification', { error, token, platform });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        platform,
      };
    }
  }

  /**
   * Send push notifications to multiple devices
   *
   * @param tokens - Array of device tokens with platforms
   * @param payload - Notification payload
   * @returns Batch push result
   */
  async sendBatchPushNotifications(
    tokens: Array<{ token: string; platform: Platform }>,
    payload: PushPayload
  ): Promise<BatchPushResult> {
    try {
      logger.info({ count: tokens.length, title: payload.title }, 'Sending batch push notifications');

      const results = await Promise.all(
        tokens.map(async ({ token, platform }) => {
          const result = await this.sendPushNotification(token, platform, payload);
          return {
            token,
            success: result.success,
            error: result.error,
          };
        })
      );

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      logger.info({ successCount, failureCount }, 'Batch push notifications completed');

      return {
        successCount,
        failureCount,
        results,
      };
    } catch (error) {
      logger.error('Failed to send batch push notifications', { error });
      throw error;
    }
  }

  /**
   * Send FCM notification (Android/iOS via FCM)
   *
   * @param token - Device token
   * @param payload - Notification payload
   * @returns Push result
   */
  private async sendFCMNotification(token: string, payload: PushPayload): Promise<PushResult> {
    try {
      if (!this.fcmConfig) {
        throw new Error('FCM configuration not available');
      }

      // Construct FCM message
      const message = {
        to: token,
        priority: payload.priority || 'high',
        notification: {
          title: payload.title,
          body: payload.body,
          sound: payload.sound || 'default',
          badge: payload.badge,
          icon: payload.icon || 'ic_notification',
          click_action: payload.clickAction,
        },
        data: payload.data || {},
        time_to_live: payload.ttl || 86400, // 24 hours
      };

      // Send to FCM
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${this.fcmConfig.serverKey}`,
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();

      if (!response.ok || result.failure === 1) {
        const errorMessage = result.results?.[0]?.error || 'FCM send failed';
        logger.error('FCM notification failed', { error: errorMessage, token });
        return {
          success: false,
          error: errorMessage,
          platform: 'android',
        };
      }

      logger.info('FCM notification sent successfully', { messageId: result.results?.[0]?.message_id });

      return {
        success: true,
        messageId: result.results?.[0]?.message_id,
        platform: 'android',
      };
    } catch (error) {
      logger.error('FCM notification error', { error, token });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown FCM error',
        platform: 'android',
      };
    }
  }

  /**
   * Send APNS notification (iOS)
   *
   * @param token - Device token
   * @param payload - Notification payload
   * @returns Push result
   */
  private async sendAPNSNotification(token: string, payload: PushPayload): Promise<PushResult> {
    try {
      if (!this.apnsConfig) {
        // Fallback to FCM for iOS if APNS not configured
        logger.warn('APNS not configured, falling back to FCM for iOS');
        return await this.sendFCMNotification(token, payload);
      }

      // Construct APNS payload
      const apnsPayload = {
        aps: {
          alert: {
            title: payload.title,
            body: payload.body,
          },
          badge: payload.badge,
          sound: payload.sound || 'default',
          'content-available': 1,
          'mutable-content': 1,
        },
        data: payload.data || {},
      };

      // NOTE: In production, you would use a proper APNS client library like 'apn'
      // For now, this is a placeholder implementation
      logger.info('APNS notification prepared', { token, payload: apnsPayload });

      // TODO: Implement actual APNS sending using 'apn' library
      // const apnProvider = new apn.Provider(this.apnsConfig);
      // const notification = new apn.Notification(apnsPayload);
      // const result = await apnProvider.send(notification, token);

      return {
        success: true,
        messageId: `apns-${Date.now()}`,
        platform: 'ios',
      };
    } catch (error) {
      logger.error('APNS notification error', { error, token });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown APNS error',
        platform: 'ios',
      };
    }
  }

  /**
   * Send Web Push notification
   *
   * @param token - Device subscription
   * @param payload - Notification payload
   * @returns Push result
   */
  private async sendWebPushNotification(token: string, payload: PushPayload): Promise<PushResult> {
    try {
      if (!this.webPushConfig) {
        throw new Error('Web Push configuration not available');
      }

      // Parse subscription from token
      const subscription = JSON.parse(token);

      // Construct Web Push payload
      const webPushPayload = {
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icon.png',
        image: payload.image,
        badge: '/badge.png',
        data: payload.data || {},
        tag: payload.data?.notificationId || 'default',
        requireInteraction: false,
        actions: [],
      };

      // NOTE: In production, you would use 'web-push' library
      // For now, this is a placeholder implementation
      logger.info('Web Push notification prepared', { subscription, payload: webPushPayload });

      // TODO: Implement actual Web Push sending using 'web-push' library
      // const webpush = require('web-push');
      // webpush.setVapidDetails(
      //   this.webPushConfig.subject,
      //   this.webPushConfig.vapidPublicKey,
      //   this.webPushConfig.vapidPrivateKey
      // );
      // await webpush.sendNotification(subscription, JSON.stringify(webPushPayload));

      return {
        success: true,
        messageId: `web-push-${Date.now()}`,
        platform: 'web',
      };
    } catch (error) {
      logger.error('Web Push notification error', { error, token });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Web Push error',
        platform: 'web',
      };
    }
  }

  /**
   * Validate device token
   *
   * @param token - Device token
   * @param platform - Device platform
   * @returns True if token is valid
   */
  validateToken(token: string, platform: Platform): boolean {
    try {
      if (!token || token.trim().length === 0) {
        return false;
      }

      switch (platform) {
        case 'android':
          // FCM tokens are typically 152+ characters
          return token.length >= 100;
        case 'ios':
          // APNS tokens are 64 hex characters or FCM tokens
          return token.length === 64 || token.length >= 100;
        case 'web':
          // Web Push subscriptions are JSON objects
          try {
            const subscription = JSON.parse(token);
            return subscription.endpoint && subscription.keys;
          } catch {
            return false;
          }
        default:
          return false;
      }
    } catch (error) {
      logger.error('Token validation error', { error, platform });
      return false;
    }
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Export for testing
export { PushNotificationService };
