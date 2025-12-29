import { z } from "zod";

// Channel types
export const NotificationChannelSchema = z.enum([
  "email",
  "sms",
  "push",
  "in_app",
]);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

// Status types
export const NotificationStatusSchema = z.enum([
  "pending",
  "queued",
  "sent",
  "delivered",
  "failed",
  "read",
]);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

// Priority types
export const NotificationPrioritySchema = z.enum([
  "low",
  "normal",
  "high",
  "urgent",
]);
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;

// Notification type categories
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

// Create notification input schema
export const CreateNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().min(1).max(100),
  title: z.string().max(200).optional(),
  message: z.string().min(1),
  channel: NotificationChannelSchema,
  priority: NotificationPrioritySchema.default("normal"),
  metadata: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
  templateId: z.string().uuid().optional(),
  templateVariables: z.record(z.string()).optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

// Notification preference schema
export const NotificationPreferenceSchema = z.object({
  userId: z.string().uuid(),
  channel: NotificationChannelSchema,
  enabled: z.boolean(),
  settings: z.record(z.unknown()).optional(),
});

export type NotificationPreference = z.infer<typeof NotificationPreferenceSchema>;

// Quiet hours schema
export const QuietHoursSchema = z.object({
  enabled: z.boolean(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  timezone: z.string().default("UTC"),
});

export type QuietHours = z.infer<typeof QuietHoursSchema>;

// Template schema
export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(100),
  channel: NotificationChannelSchema,
  subject: z.string().max(200).optional(),
  body: z.string().min(1),
  variables: z.array(z.string()).optional().default([]),
  locale: z.string().min(2).max(10).default("en"),
});

export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>;

// Notification interface (for TypeScript type checking)
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title?: string;
  message: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  status: NotificationStatus;
  metadata?: Record<string, unknown>;
  templateId?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Template interface
export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  variables: string[];
  locale: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  };
}
