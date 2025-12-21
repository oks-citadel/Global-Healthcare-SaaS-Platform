import { v4 as uuidv4 } from 'uuid';
import {
  SendEmailNotificationInput,
  SendSmsNotificationInput,
  NotificationResponse,
  SmsStatusResponse
} from '../dtos/notification.dto.js';
import { logger } from '../utils/logger.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { sendEmail as sendEmailLib } from '../lib/email.js';
import { sendSms as sendSmsLib, getSmsStatus } from '../lib/sms.js';
import { getNotificationQueues } from '../lib/queue.js';

/**
 * Notification Service
 *
 * This service provides email and SMS notification capabilities
 * with queue-based delivery for reliability and scalability.
 *
 * Integrations:
 * - SendGrid for email (https://sendgrid.com)
 * - Twilio for SMS (https://twilio.com)
 * - Bull queues for async processing
 */

// Initialize queues
const queues = getNotificationQueues();

export const notificationService = {
  /**
   * Send email notification
   *
   * @param input - Email notification details
   * @returns NotificationResponse with email status
   */
  async sendEmail(input: SendEmailNotificationInput): Promise<NotificationResponse> {
    const notificationId = uuidv4();
    const timestamp = new Date().toISOString();

    try {
      // Validate input
      if (!input.to || !input.subject || !input.body) {
        throw new BadRequestError('Missing required email fields');
      }

      logger.info('Sending email notification', {
        notificationId,
        type: 'email',
        to: input.to,
        subject: input.subject,
        bodyLength: input.body.length,
        templateId: input.templateId,
        timestamp,
      });

      // Send email via library
      const result = await sendEmailLib({
        to: input.to,
        subject: input.subject,
        html: input.body,
        templatePath: input.templateId,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      return {
        id: notificationId,
        type: 'email',
        status: 'sent',
        recipient: input.to,
        sentAt: timestamp,
      };
    } catch (error) {
      logger.error('Failed to send email notification', {
        notificationId,
        error: error instanceof Error ? error.message : 'Unknown error',
        to: input.to,
      });

      return {
        id: notificationId,
        type: 'email',
        status: 'failed',
        recipient: input.to,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Send SMS notification
   *
   * @param input - SMS notification details
   * @returns NotificationResponse with SMS status
   */
  async sendSms(input: SendSmsNotificationInput): Promise<NotificationResponse> {
    const notificationId = uuidv4();
    const timestamp = new Date().toISOString();

    try {
      // Validate input
      if (!input.to || !input.message) {
        throw new BadRequestError('Missing required SMS fields');
      }

      // Validate phone number format (E.164)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(input.to)) {
        throw new BadRequestError('Invalid phone number format. Use E.164 format (e.g., +1234567890)');
      }

      // Validate message length
      if (input.message.length > 1600) {
        throw new BadRequestError('Message too long. Maximum 1600 characters.');
      }

      logger.info('Sending SMS notification', {
        notificationId,
        type: 'sms',
        to: input.to,
        messageLength: input.message.length,
        timestamp,
      });

      // Send SMS via library
      const result = await sendSmsLib({
        to: input.to,
        message: input.message,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to send SMS');
      }

      return {
        id: notificationId,
        type: 'sms',
        status: 'sent',
        recipient: input.to,
        sentAt: timestamp,
      };
    } catch (error) {
      logger.error('Failed to send SMS notification', {
        notificationId,
        error: error instanceof Error ? error.message : 'Unknown error',
        to: input.to,
      });

      return {
        id: notificationId,
        type: 'sms',
        status: 'failed',
        recipient: input.to,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Queue email notification for async delivery
   *
   * @param input - Email notification details
   * @returns NotificationResponse with queued status
   */
  async queueEmail(input: SendEmailNotificationInput): Promise<NotificationResponse> {
    const notificationId = uuidv4();
    const timestamp = new Date().toISOString();

    try {
      // Validate input
      if (!input.to || !input.subject || !input.body) {
        throw new BadRequestError('Missing required email fields');
      }

      logger.info('Queueing email notification', {
        notificationId,
        type: 'email',
        to: input.to,
        subject: input.subject,
      });

      // Add to queue
      const job = await queues.addEmailJob({
        to: input.to,
        subject: input.subject,
        html: input.body,
        templatePath: input.templateId,
      });

      return {
        id: notificationId,
        type: 'email',
        status: 'queued',
        recipient: input.to,
        sentAt: timestamp,
        jobId: job.id?.toString(),
      };
    } catch (error) {
      logger.error('Failed to queue email notification', {
        notificationId,
        error: error instanceof Error ? error.message : 'Unknown error',
        to: input.to,
      });

      return {
        id: notificationId,
        type: 'email',
        status: 'failed',
        recipient: input.to,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Queue SMS notification for async delivery
   *
   * @param input - SMS notification details
   * @returns NotificationResponse with queued status
   */
  async queueSms(input: SendSmsNotificationInput): Promise<NotificationResponse> {
    const notificationId = uuidv4();
    const timestamp = new Date().toISOString();

    try {
      // Validate input
      if (!input.to || !input.message) {
        throw new BadRequestError('Missing required SMS fields');
      }

      logger.info('Queueing SMS notification', {
        notificationId,
        type: 'sms',
        to: input.to,
      });

      // Add to queue
      const job = await queues.addSmsJob({
        to: input.to,
        message: input.message,
      });

      return {
        id: notificationId,
        type: 'sms',
        status: 'queued',
        recipient: input.to,
        sentAt: timestamp,
        jobId: job.id?.toString(),
      };
    } catch (error) {
      logger.error('Failed to queue SMS notification', {
        notificationId,
        error: error instanceof Error ? error.message : 'Unknown error',
        to: input.to,
      });

      return {
        id: notificationId,
        type: 'sms',
        status: 'failed',
        recipient: input.to,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Send batch email notifications
   *
   * @param recipients - Array of email addresses
   * @param subject - Email subject
   * @param body - Email body
   * @param templateId - Optional template ID
   * @returns Array of NotificationResponse
   */
  async sendBatchEmail(
    recipients: string[],
    subject: string,
    body: string,
    templateId?: string
  ): Promise<NotificationResponse[]> {
    logger.info('Sending batch email notifications', {
      recipientCount: recipients.length,
      subject,
    });

    const promises = recipients.map(to =>
      this.sendEmail({ to, subject, body, templateId })
    );

    return Promise.all(promises);
  },

  /**
   * Send batch SMS notifications
   *
   * @param recipients - Array of phone numbers
   * @param message - SMS message
   * @returns Array of NotificationResponse
   */
  async sendBatchSms(
    recipients: string[],
    message: string
  ): Promise<NotificationResponse[]> {
    logger.info('Sending batch SMS notifications', {
      recipientCount: recipients.length,
      messageLength: message.length,
    });

    const promises = recipients.map(to =>
      this.sendSms({ to, message })
    );

    return Promise.all(promises);
  },

  /**
   * Queue batch email notifications
   *
   * @param recipients - Array of email addresses
   * @param subject - Email subject
   * @param body - Email body
   * @param templateId - Optional template ID
   * @returns Array of NotificationResponse
   */
  async queueBatchEmail(
    recipients: string[],
    subject: string,
    body: string,
    templateId?: string
  ): Promise<NotificationResponse[]> {
    logger.info('Queueing batch email notifications', {
      recipientCount: recipients.length,
      subject,
    });

    const promises = recipients.map(to =>
      this.queueEmail({ to, subject, body, templateId })
    );

    return Promise.all(promises);
  },

  /**
   * Queue batch SMS notifications
   *
   * @param recipients - Array of phone numbers
   * @param message - SMS message
   * @returns Array of NotificationResponse
   */
  async queueBatchSms(
    recipients: string[],
    message: string
  ): Promise<NotificationResponse[]> {
    logger.info('Queueing batch SMS notifications', {
      recipientCount: recipients.length,
      messageLength: message.length,
    });

    const promises = recipients.map(to =>
      this.queueSms({ to, message })
    );

    return Promise.all(promises);
  },

  /**
   * Get queue statistics
   *
   * @returns Queue stats for all notification queues
   */
  async getQueueStats() {
    const [emailStats, smsStats, scheduledStats] = await Promise.all([
      queues.getEmailQueueStats(),
      queues.getSmsQueueStats(),
      queues.getScheduledQueueStats(),
    ]);

    return {
      email: emailStats,
      sms: smsStats,
      scheduled: scheduledStats,
    };
  },

  /**
   * Get SMS delivery status
   *
   * @param messageId - Twilio message SID
   * @returns SMS status information
   */
  async getSmsStatus(messageId: string): Promise<SmsStatusResponse> {
    try {
      if (!messageId) {
        throw new BadRequestError('Message ID is required');
      }

      logger.info('Fetching SMS status', { messageId });

      const status = await getSmsStatus(messageId);

      return {
        messageId,
        status: status.status,
        errorCode: status.errorCode,
        errorMessage: status.errorMessage,
      };
    } catch (error) {
      logger.error('Failed to fetch SMS status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        messageId,
      });

      throw error;
    }
  },
};
