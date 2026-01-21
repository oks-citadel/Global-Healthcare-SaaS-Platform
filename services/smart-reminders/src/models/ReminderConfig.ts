/**
 * ReminderConfig Model
 * Defines the configuration schema for smart reminders
 */

import { z } from 'zod';

// Reminder frequency options
export const ReminderFrequencySchema = z.enum([
  'once',
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'custom',
]);

export type ReminderFrequency = z.infer<typeof ReminderFrequencySchema>;

// Reminder priority levels
export const ReminderPrioritySchema = z.enum([
  'low',
  'normal',
  'high',
  'urgent',
]);

export type ReminderPriority = z.infer<typeof ReminderPrioritySchema>;

// Reminder categories
export const ReminderCategorySchema = z.enum([
  'medication',
  'appointment',
  'health_check',
  'exercise',
  'nutrition',
  'mental_health',
  'preventive_care',
  'chronic_care',
  'follow_up',
  'custom',
]);

export type ReminderCategory = z.infer<typeof ReminderCategorySchema>;

// Notification channel types
export const NotificationChannelSchema = z.enum([
  'push',
  'sms',
  'email',
  'in_app',
]);

export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

// Time window for smart delivery
export const TimeWindowSchema = z.object({
  startHour: z.number().min(0).max(23),
  startMinute: z.number().min(0).max(59),
  endHour: z.number().min(0).max(23),
  endMinute: z.number().min(0).max(59),
  timezone: z.string(),
});

export type TimeWindow = z.infer<typeof TimeWindowSchema>;

// Days of week
export const DaysOfWeekSchema = z.array(
  z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
);

export type DaysOfWeek = z.infer<typeof DaysOfWeekSchema>;

// Custom schedule configuration
export const CustomScheduleSchema = z.object({
  daysOfWeek: DaysOfWeekSchema.optional(),
  daysOfMonth: z.array(z.number().min(1).max(31)).optional(),
  specificDates: z.array(z.string().datetime()).optional(),
  excludeDates: z.array(z.string().datetime()).optional(),
  intervalDays: z.number().min(1).optional(),
});

export type CustomSchedule = z.infer<typeof CustomScheduleSchema>;

// Trigger condition reference
export const TriggerConditionRefSchema = z.object({
  triggerId: z.string().uuid(),
  triggerType: z.string(),
  parameters: z.record(z.unknown()).optional(),
});

export type TriggerConditionRef = z.infer<typeof TriggerConditionRefSchema>;

// Reminder configuration schema
export const ReminderConfigSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  patientId: z.string().uuid().optional(),

  // Basic info
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  category: ReminderCategorySchema,
  priority: ReminderPrioritySchema.default('normal'),

  // Scheduling
  frequency: ReminderFrequencySchema,
  scheduledTime: z.string().datetime().optional(),
  timeWindow: TimeWindowSchema.optional(),
  customSchedule: CustomScheduleSchema.optional(),

  // Smart triggers
  triggers: z.array(TriggerConditionRefSchema).optional(),
  requireAllTriggers: z.boolean().default(false),

  // Notification preferences
  channels: z.array(NotificationChannelSchema).min(1),
  fallbackChannel: NotificationChannelSchema.optional(),
  maxRetries: z.number().min(0).max(5).default(2),
  retryIntervalMinutes: z.number().min(5).max(60).default(15),

  // Snooze settings
  allowSnooze: z.boolean().default(true),
  snoozeOptions: z.array(z.number()).default([15, 30, 60, 120]), // minutes
  maxSnoozeCount: z.number().min(0).max(10).default(3),

  // Confirmation
  requireConfirmation: z.boolean().default(false),
  confirmationTimeout: z.number().optional(), // minutes
  escalateOnNoConfirmation: z.boolean().default(false),
  escalationContact: z.string().uuid().optional(),

  // Metadata
  relatedEntityType: z.enum(['medication', 'appointment', 'condition', 'goal', 'custom']).optional(),
  relatedEntityId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),

  // Status
  isActive: z.boolean().default(true),
  isPaused: z.boolean().default(false),
  pausedUntil: z.string().datetime().optional(),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastTriggeredAt: z.string().datetime().optional(),
  nextScheduledAt: z.string().datetime().optional(),
});

export type ReminderConfig = z.infer<typeof ReminderConfigSchema>;

// Create reminder input schema
export const CreateReminderConfigSchema = ReminderConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastTriggeredAt: true,
  nextScheduledAt: true,
});

export type CreateReminderConfig = z.infer<typeof CreateReminderConfigSchema>;

// Update reminder input schema
export const UpdateReminderConfigSchema = CreateReminderConfigSchema.partial();

export type UpdateReminderConfig = z.infer<typeof UpdateReminderConfigSchema>;

// Reminder instance (a single scheduled occurrence)
export const ReminderInstanceSchema = z.object({
  id: z.string().uuid(),
  reminderId: z.string().uuid(),
  userId: z.string().uuid(),

  scheduledAt: z.string().datetime(),
  sentAt: z.string().datetime().optional(),
  deliveredAt: z.string().datetime().optional(),
  readAt: z.string().datetime().optional(),
  confirmedAt: z.string().datetime().optional(),
  snoozedUntil: z.string().datetime().optional(),
  snoozeCount: z.number().default(0),

  status: z.enum([
    'scheduled',
    'pending',
    'sent',
    'delivered',
    'read',
    'confirmed',
    'snoozed',
    'expired',
    'failed',
    'cancelled',
  ]),

  channel: NotificationChannelSchema,
  retryCount: z.number().default(0),

  triggerContext: z.record(z.unknown()).optional(),
  deliveryMetadata: z.record(z.unknown()).optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ReminderInstance = z.infer<typeof ReminderInstanceSchema>;

// Reminder preference (user-level settings)
export const ReminderPreferencesSchema = z.object({
  userId: z.string().uuid(),

  // Global settings
  globalEnabled: z.boolean().default(true),
  quietHoursEnabled: z.boolean().default(true),
  quietHoursStart: z.string().default('22:00'),
  quietHoursEnd: z.string().default('07:00'),
  timezone: z.string().default('America/New_York'),

  // Channel preferences
  preferredChannels: z.array(NotificationChannelSchema).default(['push', 'in_app']),
  channelSettings: z.object({
    push: z.object({
      enabled: z.boolean().default(true),
      sound: z.boolean().default(true),
      vibrate: z.boolean().default(true),
    }).optional(),
    sms: z.object({
      enabled: z.boolean().default(false),
      phoneNumber: z.string().optional(),
    }).optional(),
    email: z.object({
      enabled: z.boolean().default(true),
      emailAddress: z.string().email().optional(),
    }).optional(),
    in_app: z.object({
      enabled: z.boolean().default(true),
      badge: z.boolean().default(true),
    }).optional(),
  }).optional(),

  // Category preferences
  categorySettings: z.record(z.object({
    enabled: z.boolean().default(true),
    priority: ReminderPrioritySchema.optional(),
    channels: z.array(NotificationChannelSchema).optional(),
  })).optional(),

  // Smart delivery preferences
  smartDeliveryEnabled: z.boolean().default(true),
  preferredDeliveryWindow: TimeWindowSchema.optional(),

  updatedAt: z.string().datetime(),
});

export type ReminderPreferences = z.infer<typeof ReminderPreferencesSchema>;
