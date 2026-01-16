import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';
import {
  SendEmailNotificationSchema,
  SendSmsNotificationSchema
} from '../dtos/notification.dto.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Notification Controller
 *
 * Handles HTTP requests for notification operations.
 * All endpoints require admin role for security.
 */
export const notificationController = {
  /**
   * POST /notifications/email
   * Send email notification
   *
   * @requires admin role
   * @body to - Recipient email address
   * @body subject - Email subject
   * @body body - Email body content
   * @body templateId - Optional email template ID
   */
  sendEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const input = SendEmailNotificationSchema.parse(req.body);

      // Send email notification
      const result = await notificationService.sendEmail(input);

      // Return 201 if sent successfully, 500 if failed
      if (result.status === 'sent') {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /notifications/sms
   * Send SMS notification
   *
   * @requires admin role
   * @body to - Recipient phone number (E.164 format)
   * @body message - SMS message content
   */
  sendSms: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const input = SendSmsNotificationSchema.parse(req.body);

      // Send SMS notification
      const result = await notificationService.sendSms(input);

      // Return 201 if sent successfully, 500 if failed
      if (result.status === 'sent') {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /notifications/email/batch
   * Send batch email notifications
   *
   * @requires admin role
   * @body recipients - Array of recipient email addresses
   * @body subject - Email subject
   * @body body - Email body content
   * @body templateId - Optional email template ID
   */
  sendBatchEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipients, subject, body, templateId } = req.body;

      // Validate input
      if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new BadRequestError('Recipients must be a non-empty array');
      }

      if (!subject || !body) {
        throw new BadRequestError('Subject and body are required');
      }

      // Send batch email notifications
      const results = await notificationService.sendBatchEmail(
        recipients,
        subject,
        body,
        templateId
      );

      // Count successes and failures
      const sent = results.filter(r => r.status === 'sent').length;
      const failed = results.filter(r => r.status === 'failed').length;

      res.status(201).json({
        total: results.length,
        sent,
        failed,
        results,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /notifications/sms/batch
   * Send batch SMS notifications
   *
   * @requires admin role
   * @body recipients - Array of recipient phone numbers (E.164 format)
   * @body message - SMS message content
   */
  sendBatchSms: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipients, message } = req.body;

      // Validate input
      if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new BadRequestError('Recipients must be a non-empty array');
      }

      if (!message) {
        throw new BadRequestError('Message is required');
      }

      // Send batch SMS notifications
      const results = await notificationService.sendBatchSms(
        recipients,
        message
      );

      // Count successes and failures
      const sent = results.filter(r => r.status === 'sent').length;
      const failed = results.filter(r => r.status === 'failed').length;

      res.status(201).json({
        total: results.length,
        sent,
        failed,
        results,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /notifications/sms/:id/status
   * Get SMS delivery status
   *
   * @requires admin role
   * @param id - Twilio message SID
   */
  getSmsStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Message ID is required');
      }

      // Get SMS status
      const status = await notificationService.getSmsStatus(id);

      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  },
};
