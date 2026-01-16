import { z } from 'zod';

// Platform enum validation
export const PlatformSchema = z.enum(['ios', 'android', 'web']);

// Notification type enum validation
export const NotificationTypeSchema = z.enum([
  'appointment_reminder',
  'appointment_confirmation',
  'appointment_cancelled',
  'message_received',
  'prescription_ready',
  'lab_results_available',
  'payment_due',
  'payment_received',
  'general',
]);

// Device registration schema
export const RegisterDeviceSchema = z.object({
  token: z.string().min(1, 'Device token is required'),
  platform: PlatformSchema,
  deviceName: z.string().optional(),
  deviceModel: z.string().optional(),
  osVersion: z.string().optional(),
  appVersion: z.string().optional(),
});

// Device unregistration schema
export const UnregisterDeviceSchema = z.object({
  token: z.string().min(1, 'Device token is required'),
});

// Push notification data schema
export const PushNotificationDataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  body: z.string().min(1, 'Body is required').max(500),
  type: NotificationTypeSchema,
  data: z.record(z.any()).optional(),
});

// Batch push notification schema
export const BatchPushNotificationSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, 'At least one user ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
  body: z.string().min(1, 'Body is required').max(500),
  type: NotificationTypeSchema,
  data: z.record(z.any()).optional(),
});

// Notification preferences schema
export const NotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  appointmentReminders: z.boolean().optional(),
  messageAlerts: z.boolean().optional(),
  prescriptionAlerts: z.boolean().optional(),
  labResultAlerts: z.boolean().optional(),
  paymentAlerts: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  quietHoursEnabled: z.boolean().optional(),
  quietHoursStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, expected HH:MM').optional(),
  quietHoursEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, expected HH:MM').optional(),
  quietHoursTimezone: z.string().optional(),
});

// Notification filters schema
export const NotificationFiltersSchema = z.object({
  type: NotificationTypeSchema.optional(),
  status: z.enum(['pending', 'sent', 'delivered', 'read', 'failed']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
  unreadOnly: z.boolean().optional(),
});

// Type exports
export type RegisterDeviceInput = z.infer<typeof RegisterDeviceSchema>;
export type UnregisterDeviceInput = z.infer<typeof UnregisterDeviceSchema>;
export type PushNotificationData = z.infer<typeof PushNotificationDataSchema>;
export type BatchPushNotificationInput = z.infer<typeof BatchPushNotificationSchema>;
export type NotificationPreferencesInput = z.infer<typeof NotificationPreferencesSchema>;
export type NotificationFilters = z.infer<typeof NotificationFiltersSchema>;

// Response types
export interface DeviceTokenResponse {
  id: string;
  userId: string;
  platform: string;
  deviceName?: string;
  active: boolean;
  lastUsedAt: Date;
  createdAt: Date;
}

export interface PushNotificationResponse {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  status: string;
  data?: Record<string, any>;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

export interface NotificationPreferencesResponse {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  appointmentReminders: boolean;
  messageAlerts: boolean;
  prescriptionAlerts: boolean;
  labResultAlerts: boolean;
  paymentAlerts: boolean;
  marketingEmails: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  quietHoursTimezone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationListResponse {
  notifications: PushNotificationResponse[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
