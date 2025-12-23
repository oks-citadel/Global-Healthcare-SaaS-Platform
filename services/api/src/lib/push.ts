import { logger } from '../utils/logger.js';
import { Platform } from '../generated/client';
import * as admin from 'firebase-admin';
import apn from 'apn';
import webpush from 'web-push';

/**
 * Push Notification Library
 *
 * Integrates with:
 * - Firebase Cloud Messaging (FCM) for Android and iOS via Firebase Admin SDK
 * - Apple Push Notification Service (APNS) for iOS native
 * - Web Push API for web browsers
 */

// FCM configuration using Firebase Admin SDK
interface FCMConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

// APNS configuration
interface APNSConfig {
  keyId: string;
  teamId: string;
  bundleId: string;
  privateKey: string;
  production: boolean;
}

// Web Push configuration
interface WebPushConfig {
  vapidPublicKey: string;
  vapidPrivateKey: string;
  subject: string;
}

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
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
  private apnsProvider?: apn.Provider;
  private initialized: boolean = false;
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };

  constructor() {
    this.initialize();
  }

  /**
   * Initialize push notification services
   */
  private initialize() {
    try {
      // Load FCM configuration using Firebase Admin SDK
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        this.fcmConfig = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: this.fcmConfig.projectId,
              privateKey: this.fcmConfig.privateKey,
              clientEmail: this.fcmConfig.clientEmail,
            }),
          });
        }
        logger.info('Firebase Admin SDK initialized');
      }

      // Load APNS configuration
      if (process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID && process.env.APNS_BUNDLE_ID && process.env.APNS_PRIVATE_KEY) {
        this.apnsConfig = {
          keyId: process.env.APNS_KEY_ID,
          teamId: process.env.APNS_TEAM_ID,
          bundleId: process.env.APNS_BUNDLE_ID,
          privateKey: process.env.APNS_PRIVATE_KEY.replace(/\\n/g, '\n'),
          production: process.env.APNS_PRODUCTION === 'true',
        };

        // Initialize APNS provider
        this.apnsProvider = new apn.Provider({
          token: {
            key: this.apnsConfig.privateKey,
            keyId: this.apnsConfig.keyId,
            teamId: this.apnsConfig.teamId,
          },
          production: this.apnsConfig.production,
        });
        logger.info('APNS provider initialized', { production: this.apnsConfig.production });
      }

      // Load Web Push configuration
      if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        this.webPushConfig = {
          vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
          vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
          subject: process.env.VAPID_SUBJECT || 'mailto:support@unifiedhealth.com',
        };

        // Set VAPID details for web-push
        webpush.setVapidDetails(
          this.webPushConfig.subject,
          this.webPushConfig.vapidPublicKey,
          this.webPushConfig.vapidPrivateKey
        );
        logger.info('Web Push VAPID details configured');
      }

      this.initialized = true;
      logger.info('Push notification service initialized');
    } catch (error) {
      logger.error('Failed to initialize push notification service', { error });
      throw error;
    }
  }

  /**
   * Retry logic with exponential backoff
   *
   * @param fn - Function to retry
   * @param retries - Number of retries remaining
   * @param delay - Current delay in ms
   * @returns Result of the function
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = this.retryConfig.maxRetries,
    delay: number = this.retryConfig.initialDelay
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }

      logger.warn(`Retry attempt, ${retries} retries remaining`, { delay, error });
      await new Promise(resolve => setTimeout(resolve, delay));

      const nextDelay = Math.min(
        delay * this.retryConfig.backoffMultiplier,
        this.retryConfig.maxDelay
      );

      return this.retryWithBackoff(fn, retries - 1, nextDelay);
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
      // Validate token before sending
      if (!this.validateToken(token, platform)) {
        logger.warn('Invalid device token', { token, platform });
        return {
          success: false,
          error: 'Invalid device token',
          platform,
        };
      }

      logger.info('Sending push notification', { token: token.substring(0, 20) + '...', platform, title: payload.title });

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
      logger.error('Failed to send push notification', { error, token: token.substring(0, 20) + '...', platform });
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
      logger.info('Sending batch push notifications', { count: tokens.length, title: payload.title });

      // Group tokens by platform for optimized batch sending
      const tokensByPlatform = tokens.reduce((acc, { token, platform }) => {
        if (!acc[platform]) {
          acc[platform] = [];
        }
        acc[platform].push(token);
        return acc;
      }, {} as Record<Platform, string[]>);

      const allResults: Array<{ token: string; success: boolean; error?: string }> = [];

      // Process each platform
      for (const [platform, platformTokens] of Object.entries(tokensByPlatform)) {
        if (platform === 'android' && this.fcmConfig && platformTokens.length > 1) {
          // Use FCM batch API for Android
          const batchResults = await this.sendFCMBatchNotification(platformTokens, payload);
          allResults.push(...batchResults);
        } else {
          // Send individually for iOS and Web, or single Android notifications
          const results = await Promise.allSettled(
            platformTokens.map(async (token) => {
              const result = await this.sendPushNotification(token, platform as Platform, payload);
              return {
                token,
                success: result.success,
                error: result.error,
              };
            })
          );

          results.forEach((result) => {
            if (result.status === 'fulfilled') {
              allResults.push(result.value);
            } else {
              allResults.push({
                token: 'unknown',
                success: false,
                error: result.reason?.message || 'Unknown error',
              });
            }
          });
        }
      }

      const successCount = allResults.filter(r => r.success).length;
      const failureCount = allResults.filter(r => !r.success).length;

      logger.info('Batch push notifications completed', { successCount, failureCount, total: tokens.length });

      return {
        successCount,
        failureCount,
        results: allResults,
      };
    } catch (error) {
      logger.error('Failed to send batch push notifications', { error });
      throw error;
    }
  }

  /**
   * Send FCM notification using Firebase Admin SDK (Android/iOS via FCM)
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

      // Construct FCM message using Firebase Admin SDK format
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.image,
        },
        android: {
          priority: payload.priority === 'high' ? 'high' : 'normal',
          ttl: payload.ttl ? payload.ttl * 1000 : 86400000, // Convert to ms
          notification: {
            sound: payload.sound || 'default',
            icon: payload.icon || 'ic_notification',
            clickAction: payload.clickAction,
            color: '#0066CC',
          },
        },
        apns: {
          payload: {
            aps: {
              badge: payload.badge,
              sound: payload.sound || 'default',
            },
          },
        },
        data: payload.data ? this.sanitizeData(payload.data) : undefined,
      };

      // Send with retry logic
      const messageId = await this.retryWithBackoff(async () => {
        return await admin.messaging().send(message);
      });

      logger.info('FCM notification sent successfully', {
        messageId,
        token: token.substring(0, 20) + '...'
      });

      return {
        success: true,
        messageId,
        platform: 'android',
      };
    } catch (error: any) {
      logger.error('FCM notification error', {
        error: error.message,
        errorCode: error.code,
        token: token.substring(0, 20) + '...'
      });

      // Handle specific FCM error codes
      let errorMessage = 'Unknown FCM error';
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        errorMessage = 'Invalid or expired token';
      } else if (error.code === 'messaging/invalid-argument') {
        errorMessage = 'Invalid message payload';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        platform: 'android',
      };
    }
  }

  /**
   * Send FCM notifications in batch using Firebase Admin SDK
   *
   * @param tokens - Array of device tokens
   * @param payload - Notification payload
   * @returns Array of results
   */
  private async sendFCMBatchNotification(
    tokens: string[],
    payload: PushPayload
  ): Promise<Array<{ token: string; success: boolean; error?: string }>> {
    try {
      if (!this.fcmConfig) {
        throw new Error('FCM configuration not available');
      }

      // FCM batch API supports up to 500 tokens at once
      const BATCH_SIZE = 500;
      const results: Array<{ token: string; success: boolean; error?: string }> = [];

      for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        const batch = tokens.slice(i, i + BATCH_SIZE);

        // Construct multicast message
        const message: admin.messaging.MulticastMessage = {
          tokens: batch,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.image,
          },
          android: {
            priority: payload.priority === 'high' ? 'high' : 'normal',
            ttl: payload.ttl ? payload.ttl * 1000 : 86400000,
            notification: {
              sound: payload.sound || 'default',
              icon: payload.icon || 'ic_notification',
              clickAction: payload.clickAction,
              color: '#0066CC',
            },
          },
          apns: {
            payload: {
              aps: {
                badge: payload.badge,
                sound: payload.sound || 'default',
              },
            },
          },
          data: payload.data ? this.sanitizeData(payload.data) : undefined,
        };

        // Send batch with retry logic
        const batchResponse = await this.retryWithBackoff(async () => {
          return await admin.messaging().sendEachForMulticast(message);
        });

        // Process results
        batchResponse.responses.forEach((response, index) => {
          const token = batch[index];
          if (response.success) {
            results.push({
              token,
              success: true,
            });
          } else {
            const error = response.error;
            let errorMessage = 'Unknown error';

            if (error?.code === 'messaging/invalid-registration-token' ||
                error?.code === 'messaging/registration-token-not-registered') {
              errorMessage = 'Invalid or expired token';
            } else if (error?.message) {
              errorMessage = error.message;
            }

            results.push({
              token,
              success: false,
              error: errorMessage,
            });
          }
        });

        logger.info('FCM batch notification sent', {
          batchSize: batch.length,
          successCount: batchResponse.successCount,
          failureCount: batchResponse.failureCount,
        });
      }

      return results;
    } catch (error) {
      logger.error('FCM batch notification error', { error });

      // Return all as failures
      return tokens.map(token => ({
        token,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown batch error',
      }));
    }
  }

  /**
   * Sanitize data payload to ensure all values are strings
   * (Firebase requires all data values to be strings)
   */
  private sanitizeData(data: Record<string, any>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        sanitized[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }
    return sanitized;
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
      if (!this.apnsConfig || !this.apnsProvider) {
        // Fallback to FCM for iOS if APNS not configured
        logger.warn('APNS not configured, falling back to FCM for iOS');
        return await this.sendFCMNotification(token, payload);
      }

      // Create APNS notification
      const notification = new apn.Notification();

      // Set alert
      notification.alert = {
        title: payload.title,
        body: payload.body,
      };

      // Set other properties
      if (payload.badge !== undefined) {
        notification.badge = payload.badge;
      }

      notification.sound = payload.sound || 'default';
      notification.topic = this.apnsConfig.bundleId;
      notification.contentAvailable = true;
      notification.mutableContent = true;

      // Set priority
      if (payload.priority === 'high') {
        notification.priority = 10;
      } else {
        notification.priority = 5;
      }

      // Set TTL (expiry)
      if (payload.ttl) {
        notification.expiry = Math.floor(Date.now() / 1000) + payload.ttl;
      }

      // Add custom data
      if (payload.data) {
        notification.payload = {
          ...notification.payload,
          ...payload.data,
        };
      }

      // Add image if provided
      if (payload.image) {
        notification.payload = {
          ...notification.payload,
          'media-url': payload.image,
        };
      }

      // Send with retry logic
      const result = await this.retryWithBackoff(async () => {
        return await this.apnsProvider!.send(notification, token);
      });

      // Check results
      const sent = result.sent || [];
      const failed = result.failed || [];

      if (failed.length > 0) {
        const error = failed[0];
        const errorMessage = error.response?.reason || error.status || 'APNS send failed';

        logger.error('APNS notification failed', {
          error: errorMessage,
          status: error.status,
          token: token.substring(0, 20) + '...',
        });

        // Handle specific APNS errors
        let userErrorMessage = errorMessage;
        if (error.status === '410' || errorMessage === 'Unregistered') {
          userErrorMessage = 'Token is no longer valid (unregistered)';
        } else if (error.status === '400' || errorMessage === 'BadDeviceToken') {
          userErrorMessage = 'Invalid device token';
        }

        return {
          success: false,
          error: userErrorMessage,
          platform: 'ios',
        };
      }

      logger.info('APNS notification sent successfully', {
        token: token.substring(0, 20) + '...',
        sentCount: sent.length,
      });

      return {
        success: true,
        messageId: `apns-${Date.now()}-${token.substring(0, 8)}`,
        platform: 'ios',
      };
    } catch (error: any) {
      logger.error('APNS notification error', {
        error: error.message || error,
        token: token.substring(0, 20) + '...',
      });

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
   * @param token - Device subscription (JSON string)
   * @param payload - Notification payload
   * @returns Push result
   */
  private async sendWebPushNotification(token: string, payload: PushPayload): Promise<PushResult> {
    try {
      if (!this.webPushConfig) {
        throw new Error('Web Push configuration not available');
      }

      // Parse subscription from token
      let subscription: webpush.PushSubscription;
      try {
        subscription = JSON.parse(token);
      } catch (parseError) {
        logger.error('Failed to parse Web Push subscription', { error: parseError });
        return {
          success: false,
          error: 'Invalid subscription format',
          platform: 'web',
        };
      }

      // Validate subscription format
      if (!subscription.endpoint || !subscription.keys) {
        return {
          success: false,
          error: 'Invalid subscription: missing endpoint or keys',
          platform: 'web',
        };
      }

      // Construct Web Push payload
      const webPushPayload = {
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        image: payload.image,
        badge: '/badge-72x72.png',
        data: payload.data || {},
        tag: payload.data?.notificationId || 'default',
        requireInteraction: payload.priority === 'high',
        timestamp: Date.now(),
        actions: [], // Could be customized based on notification type
      };

      // Set options
      const options: webpush.RequestOptions = {
        TTL: payload.ttl || 86400, // 24 hours default
        urgency: payload.priority === 'high' ? 'high' : 'normal',
        headers: {},
      };

      // Send with retry logic
      const result = await this.retryWithBackoff(async () => {
        return await webpush.sendNotification(
          subscription,
          JSON.stringify(webPushPayload),
          options
        );
      });

      logger.info('Web Push notification sent successfully', {
        statusCode: result.statusCode,
        endpoint: subscription.endpoint.substring(0, 50) + '...',
      });

      return {
        success: true,
        messageId: `web-push-${Date.now()}-${subscription.endpoint.substring(subscription.endpoint.length - 8)}`,
        platform: 'web',
      };
    } catch (error: any) {
      // Handle specific Web Push errors
      let errorMessage = 'Unknown Web Push error';
      let shouldRetry = true;

      if (error.statusCode === 404 || error.statusCode === 410) {
        errorMessage = 'Subscription has expired or is no longer valid';
        shouldRetry = false;
      } else if (error.statusCode === 400) {
        errorMessage = 'Invalid subscription or payload';
        shouldRetry = false;
      } else if (error.statusCode === 401 || error.statusCode === 403) {
        errorMessage = 'Authentication error - invalid VAPID keys';
        shouldRetry = false;
      } else if (error.statusCode === 413) {
        errorMessage = 'Payload too large';
        shouldRetry = false;
      } else if (error.statusCode === 429) {
        errorMessage = 'Too many requests - rate limited';
      } else if (error.statusCode >= 500) {
        errorMessage = 'Push service temporarily unavailable';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      logger.error('Web Push notification error', {
        error: errorMessage,
        statusCode: error.statusCode,
        shouldRetry,
        endpoint: token.length > 50 ? token.substring(0, 50) + '...' : 'invalid',
      });

      return {
        success: false,
        error: errorMessage,
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

  /**
   * Get VAPID public key for client-side subscription
   * This key is safe to expose to clients
   *
   * @returns VAPID public key or undefined if not configured
   */
  getVapidPublicKey(): string | undefined {
    return this.webPushConfig?.vapidPublicKey;
  }

  /**
   * Check if a specific platform is configured
   *
   * @param platform - Platform to check
   * @returns True if platform is configured
   */
  isPlatformConfigured(platform: Platform): boolean {
    switch (platform) {
      case 'android':
        return !!this.fcmConfig;
      case 'ios':
        return !!this.apnsConfig || !!this.fcmConfig; // iOS can use FCM or APNS
      case 'web':
        return !!this.webPushConfig;
      default:
        return false;
    }
  }

  /**
   * Cleanup resources (close connections)
   * Should be called when shutting down the service
   */
  async cleanup(): Promise<void> {
    try {
      logger.info('Cleaning up push notification service');

      // Shutdown APNS provider
      if (this.apnsProvider) {
        await this.apnsProvider.shutdown();
        logger.info('APNS provider shutdown complete');
      }

      // Firebase Admin SDK doesn't need explicit cleanup
      // It will be cleaned up when the process exits

      logger.info('Push notification service cleanup complete');
    } catch (error) {
      logger.error('Error during push notification service cleanup', { error });
      throw error;
    }
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Export for testing
export { PushNotificationService };
