/**
 * Zod Schemas for validation
 */
import { z } from 'zod';

// ============================================================================
// Common Schemas
// ============================================================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

export const DateRangeSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
});

export const UuidSchema = z.string().uuid();

// ============================================================================
// Event Schemas
// ============================================================================

export const EventContextSchema = z.object({
  ip: z.string().ip().optional(),
  userAgent: z.string().optional(),
  locale: z.string().optional(),
  pageUrl: z.string().url().optional(),
  referrer: z.string().url().optional(),
  campaign: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    term: z.string().optional(),
    content: z.string().optional(),
  }).optional(),
});

export const BaseEventSchema = z.object({
  eventId: z.string().uuid().optional(),
  eventType: z.string().min(1).max(100),
  timestamp: z.string().datetime().optional(),
  tenantId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  sessionId: z.string().optional(),
  properties: z.record(z.unknown()).default({}),
  context: EventContextSchema.optional(),
});

export const EventBatchSchema = z.object({
  events: z.array(BaseEventSchema).min(1).max(1000),
});

// ============================================================================
// SEO Schemas
// ============================================================================

export const SeoMetadataSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  canonical: z.string().url(),
  robots: z.string().optional(),
  ogTitle: z.string().max(60).optional(),
  ogDescription: z.string().max(160).optional(),
  ogImage: z.string().url().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image', 'player', 'app']).optional(),
  hreflang: z.array(z.object({
    locale: z.string(),
    url: z.string().url(),
  })).optional(),
});

export const KeywordResearchSchema = z.object({
  keywords: z.array(z.string()).min(1).max(50),
  locale: z.string().default('en-US'),
  includeRelated: z.boolean().default(true),
});

export const ContentOptimizeSchema = z.object({
  content: z.string().min(1),
  targetKeyword: z.string(),
  locale: z.string().default('en-US'),
});

export const SchemaGenerateSchema = z.object({
  type: z.enum(['Article', 'Product', 'Organization', 'LocalBusiness', 'FAQPage', 'HowTo', 'Review']),
  data: z.record(z.unknown()),
});

// ============================================================================
// Content Schemas
// ============================================================================

export const ContentPageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1).max(200),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  contentType: z.enum(['page', 'blog', 'landing', 'documentation', 'case_study']),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  seo: SeoMetadataSchema.optional(),
  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
});

export const ContentPublishSchema = z.object({
  pageId: z.string().uuid(),
});

export const ContentScheduleSchema = z.object({
  pageId: z.string().uuid(),
  scheduledAt: z.coerce.date(),
});

// ============================================================================
// Campaign Schemas
// ============================================================================

export const CampaignSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['acquisition', 'activation', 'retention', 'referral', 'revenue']),
  status: z.enum(['draft', 'active', 'paused', 'completed']).default('draft'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  budget: z.number().positive().optional(),
  goals: z.array(z.object({
    metric: z.string(),
    target: z.number(),
  })).optional(),
});

export const UtmGenerateSchema = z.object({
  baseUrl: z.string().url(),
  source: z.string().min(1),
  medium: z.string().min(1),
  campaign: z.string().min(1),
  term: z.string().optional(),
  content: z.string().optional(),
});

export const UtmParseSchema = z.object({
  url: z.string().url(),
});

// ============================================================================
// Referral Schemas
// ============================================================================

export const ReferralCodeGenerateSchema = z.object({
  userId: z.string().uuid(),
  maxUsage: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  reward: z.object({
    type: z.enum(['credit', 'discount', 'subscription']),
    value: z.number().positive(),
    currency: z.string().optional(),
  }),
});

export const ReferralRedeemSchema = z.object({
  code: z.string(),
  redeemedByUserId: z.string().uuid(),
});

// ============================================================================
// Email Schemas
// ============================================================================

export const EmailTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
});

export const EmailSendSchema = z.object({
  templateId: z.string().uuid(),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  variables: z.record(z.string()).default({}),
});

export const EmailBulkSendSchema = z.object({
  templateId: z.string().uuid(),
  recipients: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional(),
    variables: z.record(z.string()).default({}),
  })).min(1).max(1000),
});

// ============================================================================
// Lifecycle Schemas
// ============================================================================

export const LifecycleListSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const LifecycleSegmentSchema = z.object({
  name: z.string().min(1).max(100),
  rules: z.array(z.object({
    field: z.string(),
    operator: z.enum(['eq', 'neq', 'gt', 'lt', 'contains', 'in', 'not_in']),
    value: z.unknown(),
  })).min(1),
});

export const LifecycleFlowSchema = z.object({
  name: z.string().min(1).max(100),
  trigger: z.object({
    type: z.enum(['event', 'segment_enter', 'segment_exit', 'schedule']),
    condition: z.record(z.unknown()),
  }),
  steps: z.array(z.object({
    id: z.string(),
    type: z.enum(['email', 'wait', 'condition', 'action']),
    config: z.record(z.unknown()),
    nextSteps: z.array(z.string()).optional(),
  })).min(1),
});

// ============================================================================
// Experiment Schemas
// ============================================================================

export const ExperimentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['ab', 'multivariate', 'feature_flag']),
  variants: z.array(z.object({
    name: z.string(),
    weight: z.number().min(0).max(100),
    isControl: z.boolean(),
    config: z.record(z.unknown()).default({}),
  })).min(2),
  targetingRules: z.array(z.object({
    attribute: z.string(),
    operator: z.enum(['eq', 'neq', 'in', 'not_in', 'gt', 'lt', 'contains']),
    value: z.unknown(),
  })).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const ExperimentAssignSchema = z.object({
  userId: z.string().uuid(),
  attributes: z.record(z.unknown()).optional(),
});

// ============================================================================
// Feature Flag Schemas
// ============================================================================

export const FeatureFlagSchema = z.object({
  key: z.string().regex(/^[a-z0-9_-]+$/).min(1).max(100),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  enabled: z.boolean().default(false),
  rolloutPercentage: z.number().min(0).max(100).default(0),
  targetingRules: z.array(z.object({
    attribute: z.string(),
    operator: z.enum(['eq', 'neq', 'in', 'not_in', 'gt', 'lt', 'contains']),
    value: z.unknown(),
  })).optional(),
  variants: z.array(z.object({
    key: z.string(),
    name: z.string(),
    weight: z.number().min(0).max(100),
    payload: z.record(z.unknown()).optional(),
  })).optional(),
});

export const FlagEvaluateSchema = z.object({
  userId: z.string().uuid().optional(),
  attributes: z.record(z.unknown()).optional(),
});

// ============================================================================
// Personalization Schemas
// ============================================================================

export const UserProfileSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  traits: z.record(z.unknown()).default({}),
});

export const UserTraitsSchema = z.object({
  traits: z.record(z.unknown()),
});

export const RecommendationSchema = z.object({
  userId: z.string().uuid(),
  context: z.enum(['homepage', 'product', 'checkout', 'email']),
  limit: z.number().int().min(1).max(50).default(10),
});

// ============================================================================
// Commerce Schemas
// ============================================================================

export const CouponSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
  conditions: z.array(z.object({
    type: z.enum(['product', 'category', 'user_segment']),
    operator: z.enum(['include', 'exclude']),
    values: z.array(z.string()),
  })).optional(),
});

export const CouponValidateSchema = z.object({
  userId: z.string().uuid().optional(),
  cartTotal: z.number().positive(),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const InAppMessageSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['modal', 'banner', 'tooltip', 'slideout']),
  content: z.object({
    title: z.string().optional(),
    body: z.string().min(1),
    cta: z.object({
      text: z.string(),
      action: z.string(),
    }).optional(),
    image: z.string().url().optional(),
    style: z.record(z.string()).optional(),
  }),
  trigger: z.object({
    type: z.enum(['page_view', 'event', 'time_on_page', 'exit_intent', 'scroll_depth']),
    condition: z.record(z.unknown()),
  }),
  targeting: z.array(z.object({
    attribute: z.string(),
    operator: z.enum(['eq', 'neq', 'in', 'not_in', 'gt', 'lt', 'contains']),
    value: z.unknown(),
  })).optional(),
});

// ============================================================================
// Reputation Schemas
// ============================================================================

export const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(5000),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().optional(),
  verifiedPurchase: z.boolean().default(false),
});

export const NpsSurveySchema = z.object({
  score: z.number().int().min(0).max(10),
  feedback: z.string().max(2000).optional(),
});

export const CsatSurveySchema = z.object({
  score: z.number().int().min(1).max(5),
  feedback: z.string().max(2000).optional(),
  category: z.string().optional(),
});

// ============================================================================
// Localization Schemas
// ============================================================================

export const TranslateRequestSchema = z.object({
  key: z.string(),
  sourceLocale: z.string(),
  targetLocales: z.array(z.string()).min(1),
  sourceText: z.string(),
  context: z.string().optional(),
});

export const GeoDetectSchema = z.object({
  ip: z.string().ip().optional(),
});

// ============================================================================
// AI Schemas
// ============================================================================

export const LeadScoreSchema = z.object({
  userId: z.string().uuid(),
  signals: z.record(z.unknown()).optional(),
});

export const ChurnPredictSchema = z.object({
  userId: z.string().uuid(),
  lookbackDays: z.number().int().min(1).max(365).default(30),
});

export const ContentGenerateSchema = z.object({
  type: z.enum(['blog', 'email', 'landing', 'social', 'ad']),
  topic: z.string().min(1),
  targetAudience: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'formal']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  keywords: z.array(z.string()).optional(),
});

export const ContentOptimizeAISchema = z.object({
  content: z.string().min(1),
  goals: z.array(z.enum(['seo', 'readability', 'engagement', 'conversion'])).min(1),
  targetKeywords: z.array(z.string()).optional(),
});

// Export types from schemas
export type Pagination = z.infer<typeof PaginationSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type EventBatch = z.infer<typeof EventBatchSchema>;
export type SeoMetadata = z.infer<typeof SeoMetadataSchema>;
export type ContentPage = z.infer<typeof ContentPageSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type Experiment = z.infer<typeof ExperimentSchema>;
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
export type Coupon = z.infer<typeof CouponSchema>;
export type Review = z.infer<typeof ReviewSchema>;
