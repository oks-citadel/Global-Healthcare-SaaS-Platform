import { z } from 'zod';

// Base event properties
export const BaseEventPropertiesSchema = z.object({
  page_url: z.string().url().optional(),
  page_title: z.string().optional(),
  referrer: z.string().url().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

// Device info schema
export const DeviceInfoSchema = z.object({
  type: z.enum(['desktop', 'mobile', 'tablet', 'other']).optional(),
  os: z.string().optional(),
  os_version: z.string().optional(),
  browser: z.string().optional(),
  browser_version: z.string().optional(),
  screen_width: z.number().int().positive().optional(),
  screen_height: z.number().int().positive().optional(),
  viewport_width: z.number().int().positive().optional(),
  viewport_height: z.number().int().positive().optional(),
  device_pixel_ratio: z.number().positive().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// Geo info schema
export const GeoInfoSchema = z.object({
  country: z.string().length(2).optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// User context schema
export const UserContextSchema = z.object({
  user_id: z.string().optional(),
  anonymous_id: z.string(),
  session_id: z.string(),
  traits: z.record(z.any()).optional(),
});

// Base event schema
export const BaseEventSchema = z.object({
  event_id: z.string().uuid().optional(),
  event_type: z.string().min(1).max(256),
  timestamp: z.string().datetime().or(z.number()),
  organization_id: z.string().min(1),
  project_id: z.string().min(1).optional(),
  user: UserContextSchema,
  device: DeviceInfoSchema.optional(),
  geo: GeoInfoSchema.optional(),
  properties: z.record(z.any()).default({}),
  context: z.record(z.any()).optional(),
});

// Page view event
export const PageViewEventSchema = BaseEventSchema.extend({
  event_type: z.literal('page_view'),
  properties: BaseEventPropertiesSchema.extend({
    page_path: z.string(),
    page_hash: z.string().optional(),
    page_search: z.string().optional(),
    time_on_page: z.number().positive().optional(),
  }),
});

// Click event
export const ClickEventSchema = BaseEventSchema.extend({
  event_type: z.literal('click'),
  properties: BaseEventPropertiesSchema.extend({
    element_id: z.string().optional(),
    element_class: z.string().optional(),
    element_tag: z.string().optional(),
    element_text: z.string().max(500).optional(),
    element_href: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    element_x: z.number().optional(),
    element_y: z.number().optional(),
  }),
});

// Form submission event
export const FormSubmitEventSchema = BaseEventSchema.extend({
  event_type: z.literal('form_submit'),
  properties: BaseEventPropertiesSchema.extend({
    form_id: z.string().optional(),
    form_name: z.string().optional(),
    form_action: z.string().optional(),
    form_method: z.string().optional(),
    fields_count: z.number().int().optional(),
    success: z.boolean().optional(),
  }),
});

// Purchase event
export const PurchaseEventSchema = BaseEventSchema.extend({
  event_type: z.literal('purchase'),
  properties: BaseEventPropertiesSchema.extend({
    order_id: z.string(),
    revenue: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    products: z.array(z.object({
      product_id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      category: z.string().optional(),
      sku: z.string().optional(),
    })).optional(),
    discount: z.number().optional(),
    shipping: z.number().optional(),
    tax: z.number().optional(),
    coupon_code: z.string().optional(),
  }),
});

// Signup event
export const SignupEventSchema = BaseEventSchema.extend({
  event_type: z.literal('user_signup'),
  properties: BaseEventPropertiesSchema.extend({
    method: z.enum(['email', 'google', 'facebook', 'twitter', 'github', 'sso', 'other']),
    plan: z.string().optional(),
    referral_code: z.string().optional(),
  }),
});

// Login event
export const LoginEventSchema = BaseEventSchema.extend({
  event_type: z.literal('user_login'),
  properties: BaseEventPropertiesSchema.extend({
    method: z.enum(['email', 'google', 'facebook', 'twitter', 'github', 'sso', 'other']),
    success: z.boolean(),
    failure_reason: z.string().optional(),
  }),
});

// Custom event
export const CustomEventSchema = BaseEventSchema.extend({
  event_type: z.string().regex(/^custom_/),
  properties: z.record(z.any()),
});

// Scroll event
export const ScrollEventSchema = BaseEventSchema.extend({
  event_type: z.literal('scroll'),
  properties: BaseEventPropertiesSchema.extend({
    scroll_depth: z.number().min(0).max(100),
    max_scroll_depth: z.number().min(0).max(100),
    scroll_direction: z.enum(['up', 'down']).optional(),
  }),
});

// Video event
export const VideoEventSchema = BaseEventSchema.extend({
  event_type: z.enum(['video_play', 'video_pause', 'video_complete', 'video_progress']),
  properties: BaseEventPropertiesSchema.extend({
    video_id: z.string(),
    video_title: z.string().optional(),
    video_duration: z.number().positive(),
    video_current_time: z.number(),
    video_percent: z.number().min(0).max(100).optional(),
    video_provider: z.enum(['youtube', 'vimeo', 'html5', 'other']).optional(),
  }),
});

// Error event
export const ErrorEventSchema = BaseEventSchema.extend({
  event_type: z.literal('error'),
  properties: BaseEventPropertiesSchema.extend({
    error_message: z.string(),
    error_stack: z.string().optional(),
    error_type: z.string().optional(),
    error_source: z.string().optional(),
    error_line: z.number().int().optional(),
    error_column: z.number().int().optional(),
  }),
});

// Union of all event types
export const TrackingEventSchema = z.discriminatedUnion('event_type', [
  PageViewEventSchema,
  ClickEventSchema,
  FormSubmitEventSchema,
  PurchaseEventSchema,
  SignupEventSchema,
  LoginEventSchema,
  ScrollEventSchema,
  ErrorEventSchema,
]).or(CustomEventSchema).or(BaseEventSchema);

// Batch events schema
export const BatchEventsSchema = z.object({
  events: z.array(TrackingEventSchema).min(1).max(1000),
  batch_id: z.string().uuid().optional(),
  sent_at: z.string().datetime().optional(),
});

// Event validation result
export const EventValidationResultSchema = z.object({
  valid: z.boolean(),
  event_id: z.string().optional(),
  errors: z.array(z.object({
    path: z.string(),
    message: z.string(),
    code: z.string(),
  })).optional(),
});

// Export types
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type PageViewEvent = z.infer<typeof PageViewEventSchema>;
export type ClickEvent = z.infer<typeof ClickEventSchema>;
export type FormSubmitEvent = z.infer<typeof FormSubmitEventSchema>;
export type PurchaseEvent = z.infer<typeof PurchaseEventSchema>;
export type SignupEvent = z.infer<typeof SignupEventSchema>;
export type LoginEvent = z.infer<typeof LoginEventSchema>;
export type CustomEvent = z.infer<typeof CustomEventSchema>;
export type ScrollEvent = z.infer<typeof ScrollEventSchema>;
export type VideoEvent = z.infer<typeof VideoEventSchema>;
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;
export type TrackingEvent = z.infer<typeof TrackingEventSchema>;
export type BatchEvents = z.infer<typeof BatchEventsSchema>;
export type EventValidationResult = z.infer<typeof EventValidationResultSchema>;

// Schema definitions for API documentation
export const EventSchemaDefinitions = {
  base: {
    name: 'BaseEvent',
    description: 'Base event structure that all events inherit from',
    required_fields: ['event_type', 'timestamp', 'organization_id', 'user.anonymous_id', 'user.session_id'],
    schema: BaseEventSchema,
  },
  page_view: {
    name: 'PageViewEvent',
    description: 'Tracks page views and navigation',
    required_fields: ['properties.page_path'],
    schema: PageViewEventSchema,
  },
  click: {
    name: 'ClickEvent',
    description: 'Tracks user clicks on elements',
    required_fields: [],
    schema: ClickEventSchema,
  },
  form_submit: {
    name: 'FormSubmitEvent',
    description: 'Tracks form submissions',
    required_fields: [],
    schema: FormSubmitEventSchema,
  },
  purchase: {
    name: 'PurchaseEvent',
    description: 'Tracks purchase/transaction events',
    required_fields: ['properties.order_id', 'properties.revenue'],
    schema: PurchaseEventSchema,
  },
  user_signup: {
    name: 'SignupEvent',
    description: 'Tracks user registration',
    required_fields: ['properties.method'],
    schema: SignupEventSchema,
  },
  user_login: {
    name: 'LoginEvent',
    description: 'Tracks user login attempts',
    required_fields: ['properties.method', 'properties.success'],
    schema: LoginEventSchema,
  },
  scroll: {
    name: 'ScrollEvent',
    description: 'Tracks scroll depth and behavior',
    required_fields: ['properties.scroll_depth', 'properties.max_scroll_depth'],
    schema: ScrollEventSchema,
  },
  video: {
    name: 'VideoEvent',
    description: 'Tracks video playback events',
    required_fields: ['properties.video_id', 'properties.video_duration', 'properties.video_current_time'],
    schema: VideoEventSchema,
  },
  error: {
    name: 'ErrorEvent',
    description: 'Tracks JavaScript errors',
    required_fields: ['properties.error_message'],
    schema: ErrorEventSchema,
  },
  custom: {
    name: 'CustomEvent',
    description: 'Custom events with event_type starting with "custom_"',
    required_fields: [],
    schema: CustomEventSchema,
  },
};
