import { z } from 'zod';

export const SendEmailNotificationSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(500),
  body: z.string().min(1, 'Body is required'),
  templateId: z.string().optional(),
});

export const SendSmsNotificationSchema = z.object({
  to: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164)'),
  message: z.string().min(1, 'Message is required').max(1600),
});

export const NotificationResponseSchema = z.object({
  id: z.string(),
  type: z.enum(['email', 'sms']),
  status: z.enum(['sent', 'pending', 'failed', 'queued']),
  recipient: z.string(),
  sentAt: z.string().optional(),
  errorMessage: z.string().optional(),
  jobId: z.string().optional(),
});

export const SmsStatusResponseSchema = z.object({
  messageId: z.string(),
  status: z.string(),
  to: z.string().optional(),
  from: z.string().optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  dateSent: z.string().optional(),
  dateUpdated: z.string().optional(),
});

export type SendEmailNotificationInput = z.infer<typeof SendEmailNotificationSchema>;
export type SendSmsNotificationInput = z.infer<typeof SendSmsNotificationSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
export type SmsStatusResponse = z.infer<typeof SmsStatusResponseSchema>;
