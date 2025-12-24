import { z } from "zod";

export const NotificationChannelSchema = z.enum([
  "email",
  "sms",
  "push",
  "in_app",
]);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const NotificationStatusSchema = z.enum([
  "pending",
  "sent",
  "delivered",
  "failed",
  "read",
]);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

export const NotificationPrioritySchema = z.enum([
  "low",
  "normal",
  "high",
  "urgent",
]);
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;

export const NotificationTypeSchema = z.enum([
  "appointment_reminder",
  "appointment_confirmation",
  "appointment_cancellation",
  "prescription_ready",
  "lab_results_available",
  "payment_reminder",
  "payment_confirmation",
  "secure_message",
  "system_alert",
  "marketing",
  "telehealth_reminder",
  "care_plan_update",
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const CreateNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: NotificationTypeSchema,
  channel: NotificationChannelSchema,
  priority: NotificationPrioritySchema.default("normal"),
  subject: z.string().max(200).optional(),
  body: z.string(),
  metadata: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
  templateId: z.string().uuid().optional(),
  templateVariables: z.record(z.string()).optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

export const NotificationPreferenceSchema = z.object({
  userId: z.string().uuid(),
  channel: NotificationChannelSchema,
  notificationType: NotificationTypeSchema,
  enabled: z.boolean(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
});

export type NotificationPreference = z.infer<
  typeof NotificationPreferenceSchema
>;

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  priority: NotificationPriority;
  status: NotificationStatus;
  subject?: string;
  body: string;
  metadata?: Record<string, unknown>;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
