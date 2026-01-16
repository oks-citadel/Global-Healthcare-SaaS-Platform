/**
 * Platform Constants
 */

// ============================================================================
// Service Identifiers
// ============================================================================

export const SERVICES = {
  SEO: 'seo-service',
  CONTENT: 'content-service',
  ANALYTICS: 'analytics-service',
  PERSONALIZATION: 'personalization-service',
  LIFECYCLE: 'lifecycle-service',
  GROWTH: 'growth-service',
  COMMERCE: 'commerce-service',
  REPUTATION: 'reputation-service',
  LOCALIZATION: 'localization-service',
  AI: 'ai-service',
} as const;

export type ServiceName = (typeof SERVICES)[keyof typeof SERVICES];

// ============================================================================
// Namespace Configuration
// ============================================================================

export const NAMESPACES = {
  SEO: 'marketing-seo',
  CONTENT: 'marketing-content',
  ANALYTICS: 'marketing-analytics',
  PERSONALIZATION: 'marketing-personalization',
  LIFECYCLE: 'marketing-lifecycle',
  GROWTH: 'marketing-growth',
  COMMERCE: 'marketing-commerce',
  REPUTATION: 'marketing-reputation',
  LOCALIZATION: 'marketing-localization',
  AI: 'marketing-ai',
  OBSERVABILITY: 'marketing-observability',
  SYSTEM: 'kube-system',
} as const;

// ============================================================================
// API Versions
// ============================================================================

export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// ============================================================================
// Event Types
// ============================================================================

export const EVENT_TYPES = {
  // Page events
  PAGE_VIEW: 'page_view',
  PAGE_SCROLL: 'page_scroll',
  PAGE_LEAVE: 'page_leave',

  // User lifecycle
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN: 'login',
  LOGOUT: 'logout',

  // Engagement
  FEATURE_USED: 'feature_used',
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted',
  SEARCH: 'search',

  // Experimentation
  EXPERIMENT_ASSIGNED: 'experiment_assigned',
  EXPERIMENT_CONVERTED: 'experiment_converted',

  // Commerce
  PRODUCT_VIEWED: 'product_viewed',
  CART_UPDATED: 'cart_updated',
  CHECKOUT_STARTED: 'checkout_started',
  PURCHASE_COMPLETED: 'purchase_completed',

  // Subscription
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Email
  EMAIL_SENT: 'email_sent',
  EMAIL_DELIVERED: 'email_delivered',
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked',
  EMAIL_BOUNCED: 'email_bounced',
  EMAIL_UNSUBSCRIBED: 'email_unsubscribed',

  // Referral
  REFERRAL_SENT: 'referral_sent',
  REFERRAL_CLICKED: 'referral_clicked',
  REFERRAL_REDEEMED: 'referral_redeemed',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

// ============================================================================
// Content Types
// ============================================================================

export const CONTENT_TYPES = {
  PAGE: 'page',
  BLOG: 'blog',
  LANDING: 'landing',
  DOCUMENTATION: 'documentation',
  CASE_STUDY: 'case_study',
} as const;

export const CONTENT_STATUSES = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// ============================================================================
// SEO Constants
// ============================================================================

export const SEO = {
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 160,
  MIN_CONTENT_LENGTH: 300,
  SITEMAP_MAX_URLS: 50000,
  SITEMAP_CHANGEFREQ: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'] as const,
  ROBOTS_DIRECTIVES: ['index', 'noindex', 'follow', 'nofollow', 'none', 'noarchive', 'nosnippet'] as const,
};

export const CORE_WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

// ============================================================================
// Campaign Constants
// ============================================================================

export const CAMPAIGN_TYPES = {
  ACQUISITION: 'acquisition',
  ACTIVATION: 'activation',
  RETENTION: 'retention',
  REFERRAL: 'referral',
  REVENUE: 'revenue',
} as const;

export const CAMPAIGN_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
} as const;

// ============================================================================
// UTM Parameters
// ============================================================================

export const UTM_PARAMS = {
  SOURCE: 'utm_source',
  MEDIUM: 'utm_medium',
  CAMPAIGN: 'utm_campaign',
  TERM: 'utm_term',
  CONTENT: 'utm_content',
} as const;

export const COMMON_UTM_SOURCES = [
  'google',
  'bing',
  'facebook',
  'twitter',
  'linkedin',
  'email',
  'direct',
  'referral',
] as const;

export const COMMON_UTM_MEDIUMS = [
  'organic',
  'cpc',
  'social',
  'email',
  'affiliate',
  'referral',
  'display',
  'video',
] as const;

// ============================================================================
// Attribution Models
// ============================================================================

export const ATTRIBUTION_MODELS = {
  FIRST_TOUCH: 'first_touch',
  LAST_TOUCH: 'last_touch',
  LINEAR: 'linear',
  TIME_DECAY: 'time_decay',
  POSITION_BASED: 'position_based',
  DATA_DRIVEN: 'data_driven',
} as const;

export type AttributionModel = (typeof ATTRIBUTION_MODELS)[keyof typeof ATTRIBUTION_MODELS];

// ============================================================================
// Experiment Constants
// ============================================================================

export const EXPERIMENT_TYPES = {
  AB: 'ab',
  MULTIVARIATE: 'multivariate',
  FEATURE_FLAG: 'feature_flag',
} as const;

export const EXPERIMENT_STATUSES = {
  DRAFT: 'draft',
  RUNNING: 'running',
  PAUSED: 'paused',
  CONCLUDED: 'concluded',
} as const;

export const EXPERIMENT_MINIMUM_SAMPLE_SIZE = 100;
export const EXPERIMENT_DEFAULT_CONFIDENCE = 0.95;

// ============================================================================
// Email Constants
// ============================================================================

export const EMAIL_STATUSES = {
  QUEUED: 'queued',
  SENT: 'sent',
  DELIVERED: 'delivered',
  OPENED: 'opened',
  CLICKED: 'clicked',
  BOUNCED: 'bounced',
  COMPLAINED: 'complained',
  UNSUBSCRIBED: 'unsubscribed',
} as const;

export const EMAIL_BOUNCE_TYPES = {
  HARD: 'hard',
  SOFT: 'soft',
  TRANSIENT: 'transient',
} as const;

export const EMAIL_RATE_LIMITS = {
  TRANSACTIONAL_PER_SECOND: 14,
  BULK_PER_SECOND: 50,
  DAILY_QUOTA: 200000,
};

// ============================================================================
// Localization Constants
// ============================================================================

export const SUPPORTED_LOCALES = [
  'en-US',
  'en-GB',
  'en-AU',
  'en-CA',
  'es-ES',
  'es-MX',
  'fr-FR',
  'fr-CA',
  'de-DE',
  'de-AT',
  'it-IT',
  'pt-BR',
  'pt-PT',
  'ja-JP',
  'ko-KR',
  'zh-CN',
  'zh-TW',
  'nl-NL',
  'sv-SE',
  'no-NO',
  'da-DK',
  'fi-FI',
  'pl-PL',
  'ru-RU',
  'ar-SA',
  'he-IL',
  'hi-IN',
  'th-TH',
  'vi-VN',
  'id-ID',
  'ms-MY',
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN',
  'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'RUB', 'KRW', 'SGD', 'HKD', 'TWD',
] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

// ============================================================================
// NPS Constants
// ============================================================================

export const NPS_CATEGORIES = {
  PROMOTER: { min: 9, max: 10 },
  PASSIVE: { min: 7, max: 8 },
  DETRACTOR: { min: 0, max: 6 },
} as const;

// ============================================================================
// Cache TTLs (in seconds)
// ============================================================================

export const CACHE_TTL = {
  SITEMAP: 3600, // 1 hour
  ROBOTS_TXT: 86400, // 24 hours
  SEO_METADATA: 300, // 5 minutes
  CONTENT_PAGE: 60, // 1 minute
  FEATURE_FLAGS: 30, // 30 seconds
  USER_PROFILE: 300, // 5 minutes
  ANALYTICS_SUMMARY: 60, // 1 minute
  RECOMMENDATIONS: 300, // 5 minutes
  PRICING: 3600, // 1 hour
  TRANSLATIONS: 86400, // 24 hours
} as const;

// ============================================================================
// Rate Limits (requests per minute)
// ============================================================================

export const RATE_LIMITS = {
  PUBLIC_API: 100,
  AUTHENTICATED_API: 1000,
  ADMIN_API: 5000,
  EVENT_INGESTION: 10000,
  BULK_OPERATIONS: 10,
} as const;

// ============================================================================
// Queue Names
// ============================================================================

export const QUEUES = {
  EMAIL_SEND: 'marketing-email-send',
  EMAIL_BULK: 'marketing-email-bulk',
  EVENT_PROCESS: 'marketing-event-process',
  ANALYTICS_AGGREGATE: 'marketing-analytics-aggregate',
  SEO_AUDIT: 'marketing-seo-audit',
  CONTENT_INDEX: 'marketing-content-index',
  AI_PROCESS: 'marketing-ai-process',
  NOTIFICATION: 'marketing-notification',
} as const;

// ============================================================================
// S3 Prefixes
// ============================================================================

export const S3_PREFIXES = {
  PUBLIC_ASSETS: 'assets/',
  CONTENT_MEDIA: 'content/media/',
  TEMPLATES: 'templates/',
  EXPORTS: 'exports/',
  EVENTS_RAW: 'events/raw/',
  EVENTS_CURATED: 'events/curated/',
  ANALYTICS: 'analytics/',
  BACKUPS: 'backups/',
} as const;

// ============================================================================
// Error Codes
// ============================================================================

export const ERROR_CODES = {
  // General
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',

  // Tenant
  TENANT_NOT_FOUND: 'TENANT_NOT_FOUND',
  TENANT_SUSPENDED: 'TENANT_SUSPENDED',

  // Content
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  CONTENT_ALREADY_PUBLISHED: 'CONTENT_ALREADY_PUBLISHED',
  SLUG_ALREADY_EXISTS: 'SLUG_ALREADY_EXISTS',

  // Campaign
  CAMPAIGN_NOT_FOUND: 'CAMPAIGN_NOT_FOUND',
  CAMPAIGN_ALREADY_ACTIVE: 'CAMPAIGN_ALREADY_ACTIVE',

  // Experiment
  EXPERIMENT_NOT_FOUND: 'EXPERIMENT_NOT_FOUND',
  EXPERIMENT_ALREADY_RUNNING: 'EXPERIMENT_ALREADY_RUNNING',
  EXPERIMENT_CONCLUDED: 'EXPERIMENT_CONCLUDED',

  // Email
  EMAIL_TEMPLATE_NOT_FOUND: 'EMAIL_TEMPLATE_NOT_FOUND',
  EMAIL_SUPPRESSED: 'EMAIL_SUPPRESSED',
  EMAIL_QUOTA_EXCEEDED: 'EMAIL_QUOTA_EXCEEDED',

  // Coupon
  COUPON_NOT_FOUND: 'COUPON_NOT_FOUND',
  COUPON_EXPIRED: 'COUPON_EXPIRED',
  COUPON_USAGE_EXCEEDED: 'COUPON_USAGE_EXCEEDED',
  COUPON_CONDITIONS_NOT_MET: 'COUPON_CONDITIONS_NOT_MET',

  // Referral
  REFERRAL_CODE_NOT_FOUND: 'REFERRAL_CODE_NOT_FOUND',
  REFERRAL_ALREADY_REDEEMED: 'REFERRAL_ALREADY_REDEEMED',
  REFERRAL_EXPIRED: 'REFERRAL_EXPIRED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
