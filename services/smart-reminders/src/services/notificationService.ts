/**
 * Notification Service
 * Handles delivery of smart reminder notifications across channels
 */

import { ReminderConfig, ReminderInstance, NotificationChannel } from '../models/ReminderConfig.js';
import { UserContext } from './contextEngine.js';
import { CombinedEvaluationResult } from './triggerEvaluator.js';
import { logger } from '../utils/logger.js';

// Notification payload
export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  imageUrl?: string;
  actionButtons?: Array<{
    id: string;
    title: string;
    action: string;
  }>;
  sound?: string;
  badge?: number;
  priority?: 'high' | 'normal' | 'low';
  ttl?: number; // Time to live in seconds
}

// Notification delivery result
export interface DeliveryResult {
  instanceId: string;
  channel: NotificationChannel;
  success: boolean;
  deliveredAt?: string;
  error?: string;
  messageId?: string;
  metadata?: Record<string, unknown>;
}

// Channel-specific delivery interfaces
interface PushNotificationProvider {
  send(token: string, payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

interface SmsProvider {
  send(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

interface EmailProvider {
  send(email: string, subject: string, body: string, html?: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

interface InAppProvider {
  send(userId: string, notification: NotificationPayload): Promise<{ success: boolean; notificationId?: string; error?: string }>;
}

// Mock providers
class MockPushProvider implements PushNotificationProvider {
  async send(token: string, payload: NotificationPayload) {
    logger.info(`[Mock Push] Sending to ${token}: ${payload.title}`);
    return { success: true, messageId: `push-${Date.now()}` };
  }
}

class MockSmsProvider implements SmsProvider {
  async send(phoneNumber: string, message: string) {
    logger.info(`[Mock SMS] Sending to ${phoneNumber}: ${message.substring(0, 50)}...`);
    return { success: true, messageId: `sms-${Date.now()}` };
  }
}

class MockEmailProvider implements EmailProvider {
  async send(email: string, subject: string, body: string) {
    logger.info(`[Mock Email] Sending to ${email}: ${subject}`);
    return { success: true, messageId: `email-${Date.now()}` };
  }
}

class MockInAppProvider implements InAppProvider {
  async send(userId: string, notification: NotificationPayload) {
    logger.info(`[Mock In-App] Sending to ${userId}: ${notification.title}`);
    return { success: true, notificationId: `inapp-${Date.now()}` };
  }
}

// Notification service
export class NotificationService {
  private pushProvider: PushNotificationProvider;
  private smsProvider: SmsProvider;
  private emailProvider: EmailProvider;
  private inAppProvider: InAppProvider;

  constructor(providers?: {
    push?: PushNotificationProvider;
    sms?: SmsProvider;
    email?: EmailProvider;
    inApp?: InAppProvider;
  }) {
    this.pushProvider = providers?.push || new MockPushProvider();
    this.smsProvider = providers?.sms || new MockSmsProvider();
    this.emailProvider = providers?.email || new MockEmailProvider();
    this.inAppProvider = providers?.inApp || new MockInAppProvider();
  }

  async sendReminder(
    reminder: ReminderConfig,
    userContext: UserContext,
    triggerResult?: CombinedEvaluationResult
  ): Promise<ReminderInstance> {
    const now = new Date().toISOString();
    const instanceId = `instance-${reminder.id}-${Date.now()}`;

    logger.info(`Sending reminder ${reminder.id} to user ${reminder.userId}`, {
      reminderId: reminder.id,
      userId: reminder.userId,
      channels: reminder.channels,
    });

    // Create reminder instance
    const instance: ReminderInstance = {
      id: instanceId,
      reminderId: reminder.id,
      userId: reminder.userId,
      scheduledAt: now,
      status: 'pending',
      channel: this.selectChannel(reminder.channels, userContext),
      retryCount: 0,
      snoozeCount: 0,
      triggerContext: triggerResult?.combinedContext,
      createdAt: now,
      updatedAt: now,
    };

    // Build notification payload
    const payload = this.buildPayload(reminder, triggerResult);

    // Attempt delivery
    let result: DeliveryResult;

    try {
      result = await this.deliverNotification(instance.channel, payload, userContext, instance);

      if (result.success) {
        instance.status = 'sent';
        instance.sentAt = new Date().toISOString();
        instance.deliveryMetadata = {
          messageId: result.messageId,
          ...result.metadata,
        };

        logger.info(`Reminder ${reminder.id} sent successfully via ${instance.channel}`, {
          reminderId: reminder.id,
          instanceId: instance.id,
          channel: instance.channel,
          messageId: result.messageId,
        });
      } else {
        // Try fallback channel if available
        if (reminder.fallbackChannel && reminder.fallbackChannel !== instance.channel) {
          logger.info(`Primary channel failed, trying fallback: ${reminder.fallbackChannel}`);
          instance.channel = reminder.fallbackChannel;
          result = await this.deliverNotification(reminder.fallbackChannel, payload, userContext, instance);

          if (result.success) {
            instance.status = 'sent';
            instance.sentAt = new Date().toISOString();
            instance.deliveryMetadata = {
              messageId: result.messageId,
              usedFallback: true,
              ...result.metadata,
            };
          }
        }

        if (!result.success) {
          instance.status = 'failed';
          instance.deliveryMetadata = {
            error: result.error,
            ...result.metadata,
          };

          logger.error(`Failed to send reminder ${reminder.id}`, {
            reminderId: reminder.id,
            instanceId: instance.id,
            error: result.error,
          });
        }
      }
    } catch (error) {
      instance.status = 'failed';
      instance.deliveryMetadata = { error: String(error) };

      logger.error(`Exception sending reminder ${reminder.id}:`, { error });
    }

    instance.updatedAt = new Date().toISOString();

    // In a real implementation, save instance to database here
    return instance;
  }

  async retryReminder(
    reminder: ReminderConfig,
    instance: ReminderInstance,
    userContext: UserContext
  ): Promise<ReminderInstance> {
    if (instance.retryCount >= reminder.maxRetries) {
      logger.warn(`Max retries reached for instance ${instance.id}`);
      instance.status = 'failed';
      instance.updatedAt = new Date().toISOString();
      return instance;
    }

    logger.info(`Retrying reminder ${reminder.id}, attempt ${instance.retryCount + 1}/${reminder.maxRetries}`);

    instance.retryCount += 1;
    const payload = this.buildPayload(reminder);

    try {
      const result = await this.deliverNotification(instance.channel, payload, userContext, instance);

      if (result.success) {
        instance.status = 'sent';
        instance.sentAt = new Date().toISOString();
        instance.deliveryMetadata = {
          ...instance.deliveryMetadata,
          messageId: result.messageId,
          retryAttempt: instance.retryCount,
        };
      } else {
        instance.deliveryMetadata = {
          ...instance.deliveryMetadata,
          lastError: result.error,
          retryAttempt: instance.retryCount,
        };
      }
    } catch (error) {
      instance.deliveryMetadata = {
        ...instance.deliveryMetadata,
        lastError: String(error),
        retryAttempt: instance.retryCount,
      };
    }

    instance.updatedAt = new Date().toISOString();
    return instance;
  }

  async handleSnooze(
    instance: ReminderInstance,
    snoozeMinutes: number
  ): Promise<ReminderInstance> {
    instance.status = 'snoozed';
    instance.snoozedUntil = new Date(Date.now() + snoozeMinutes * 60 * 1000).toISOString();
    instance.snoozeCount += 1;
    instance.updatedAt = new Date().toISOString();

    logger.info(`Reminder instance ${instance.id} snoozed for ${snoozeMinutes} minutes`, {
      instanceId: instance.id,
      snoozeCount: instance.snoozeCount,
      snoozedUntil: instance.snoozedUntil,
    });

    return instance;
  }

  async handleConfirmation(instance: ReminderInstance): Promise<ReminderInstance> {
    instance.status = 'confirmed';
    instance.confirmedAt = new Date().toISOString();
    instance.updatedAt = new Date().toISOString();

    logger.info(`Reminder instance ${instance.id} confirmed`, {
      instanceId: instance.id,
      confirmedAt: instance.confirmedAt,
    });

    return instance;
  }

  private selectChannel(
    availableChannels: NotificationChannel[],
    userContext: UserContext
  ): NotificationChannel {
    const preferredChannels = userContext.preferences?.preferredChannels || [];

    // First, try to use a preferred channel that's available
    for (const preferred of preferredChannels) {
      if (availableChannels.includes(preferred as NotificationChannel)) {
        return preferred as NotificationChannel;
      }
    }

    // If user is active in app, prefer in-app
    if (userContext.engagement?.lastAppOpen) {
      const minutesSinceOpen =
        (Date.now() - new Date(userContext.engagement.lastAppOpen).getTime()) / (60 * 1000);
      if (minutesSinceOpen < 5 && availableChannels.includes('in_app')) {
        return 'in_app';
      }
    }

    // Default: use first available channel
    return availableChannels[0];
  }

  private buildPayload(
    reminder: ReminderConfig,
    triggerResult?: CombinedEvaluationResult
  ): NotificationPayload {
    // Personalize message with trigger context
    let body = reminder.message;

    if (triggerResult?.combinedContext) {
      // Insert relevant context into message
      // This would be more sophisticated in production
      const contextInfo = Object.entries(triggerResult.combinedContext)
        .map(([type, ctx]) => {
          if (type === 'weather' && ctx && typeof ctx === 'object') {
            const weather = ctx as Record<string, unknown>;
            if (weather.weatherData) {
              return `Current conditions: ${(weather.weatherData as Record<string, unknown>).condition}`;
            }
          }
          return null;
        })
        .filter(Boolean)
        .join('. ');

      if (contextInfo) {
        body = `${body}\n\n${contextInfo}`;
      }
    }

    const payload: NotificationPayload = {
      title: reminder.title,
      body,
      data: {
        reminderId: reminder.id,
        category: reminder.category,
        priority: reminder.priority,
        relatedEntityType: reminder.relatedEntityType,
        relatedEntityId: reminder.relatedEntityId,
      },
      priority: reminder.priority === 'urgent' ? 'high' : 'normal',
    };

    // Add action buttons based on reminder type
    if (reminder.allowSnooze) {
      payload.actionButtons = [
        { id: 'confirm', title: 'Done', action: 'confirm' },
        { id: 'snooze', title: 'Snooze', action: 'snooze' },
      ];
    } else if (reminder.requireConfirmation) {
      payload.actionButtons = [
        { id: 'confirm', title: 'Confirm', action: 'confirm' },
      ];
    }

    return payload;
  }

  private async deliverNotification(
    channel: NotificationChannel,
    payload: NotificationPayload,
    userContext: UserContext,
    instance: ReminderInstance
  ): Promise<DeliveryResult> {
    switch (channel) {
      case 'push':
        if (!userContext.device?.pushToken) {
          return {
            instanceId: instance.id,
            channel,
            success: false,
            error: 'No push token available',
          };
        }
        const pushResult = await this.pushProvider.send(userContext.device.pushToken, payload);
        return {
          instanceId: instance.id,
          channel,
          success: pushResult.success,
          messageId: pushResult.messageId,
          error: pushResult.error,
          deliveredAt: pushResult.success ? new Date().toISOString() : undefined,
        };

      case 'sms':
        // In production, get phone number from user preferences/profile
        const phoneNumber = userContext.preferences?.timezone ? '+1234567890' : undefined; // Mock
        if (!phoneNumber) {
          return {
            instanceId: instance.id,
            channel,
            success: false,
            error: 'No phone number available',
          };
        }
        const smsMessage = `${payload.title}: ${payload.body}`;
        const smsResult = await this.smsProvider.send(phoneNumber, smsMessage);
        return {
          instanceId: instance.id,
          channel,
          success: smsResult.success,
          messageId: smsResult.messageId,
          error: smsResult.error,
          deliveredAt: smsResult.success ? new Date().toISOString() : undefined,
        };

      case 'email':
        // In production, get email from user preferences/profile
        const email = 'user@example.com'; // Mock
        const emailResult = await this.emailProvider.send(email, payload.title, payload.body);
        return {
          instanceId: instance.id,
          channel,
          success: emailResult.success,
          messageId: emailResult.messageId,
          error: emailResult.error,
          deliveredAt: emailResult.success ? new Date().toISOString() : undefined,
        };

      case 'in_app':
        const inAppResult = await this.inAppProvider.send(userContext.userId, payload);
        return {
          instanceId: instance.id,
          channel,
          success: inAppResult.success,
          messageId: inAppResult.notificationId,
          error: inAppResult.error,
          deliveredAt: inAppResult.success ? new Date().toISOString() : undefined,
        };

      default:
        return {
          instanceId: instance.id,
          channel,
          success: false,
          error: `Unknown channel: ${channel}`,
        };
    }
  }
}

export default NotificationService;
