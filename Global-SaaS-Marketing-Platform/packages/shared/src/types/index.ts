/**
 * Shared Types
 */

// ============================================================================
// Base Types
// ============================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  nextCursor?: string;
  prevCursor?: string;
}

export interface ResponseMeta {
  requestId: string;
  timestamp: string;
  version: string;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta: ResponseMeta;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  meta: ResponseMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: ResponseMeta;
}

// ============================================================================
// Tenant & User Types
// ============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  defaultLocale: string;
  supportedLocales: string[];
  timezone: string;
  currency: string;
  features: Record<string, boolean>;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'editor' | 'viewer' | 'api';

// ============================================================================
// Event Types
// ============================================================================

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  tenantId: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, unknown>;
  context: EventContext;
}

export interface EventContext {
  ip?: string;
  userAgent?: string;
  locale?: string;
  pageUrl?: string;
  referrer?: string;
  campaign?: CampaignContext;
}

export interface CampaignContext {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export type EventType =
  | 'page_view'
  | 'signup_started'
  | 'signup_completed'
  | 'login'
  | 'feature_used'
  | 'experiment_assigned'
  | 'conversion'
  | 'subscription_created'
  | 'subscription_cancelled'
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked';

// ============================================================================
// SEO Types
// ============================================================================

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  hreflang?: HreflangTag[];
  schema?: JsonLdSchema[];
}

export interface HreflangTag {
  locale: string;
  url: string;
}

export interface JsonLdSchema {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  alternates?: HreflangTag[];
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  inp: number; // Interaction to Next Paint (ms)
  ttfb: number; // Time to First Byte (ms)
}

// ============================================================================
// Content Types
// ============================================================================

export interface ContentPage {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  content: string;
  contentType: ContentType;
  status: ContentStatus;
  author: string;
  seo: SeoMetadata;
  publishedAt?: Date;
  scheduledAt?: Date;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ContentType = 'page' | 'blog' | 'landing' | 'documentation' | 'case_study';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

// ============================================================================
// Campaign & Growth Types
// ============================================================================

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  goals: CampaignGoal[];
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignType = 'acquisition' | 'activation' | 'retention' | 'referral' | 'revenue';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface CampaignGoal {
  metric: string;
  target: number;
  current: number;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
}

export interface ReferralCode {
  code: string;
  userId: string;
  tenantId: string;
  usageCount: number;
  maxUsage?: number;
  reward: ReferralReward;
  expiresAt?: Date;
  createdAt: Date;
}

export interface ReferralReward {
  type: 'credit' | 'discount' | 'subscription';
  value: number;
  currency?: string;
}

// ============================================================================
// Email & Lifecycle Types
// ============================================================================

export interface EmailTemplate {
  id: string;
  tenantId: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSend {
  id: string;
  tenantId: string;
  templateId: string;
  recipientEmail: string;
  recipientName?: string;
  variables: Record<string, string>;
  status: EmailStatus;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
}

export type EmailStatus = 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';

export interface LifecycleFlow {
  id: string;
  tenantId: string;
  name: string;
  trigger: FlowTrigger;
  steps: FlowStep[];
  status: 'active' | 'paused' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowTrigger {
  type: 'event' | 'segment_enter' | 'segment_exit' | 'schedule';
  condition: Record<string, unknown>;
}

export interface FlowStep {
  id: string;
  type: 'email' | 'wait' | 'condition' | 'action';
  config: Record<string, unknown>;
  nextSteps?: string[];
}

// ============================================================================
// Experiment Types
// ============================================================================

export interface Experiment {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: ExperimentType;
  status: ExperimentStatus;
  variants: ExperimentVariant[];
  targetingRules?: TargetingRule[];
  startDate?: Date;
  endDate?: Date;
  results?: ExperimentResults;
  createdAt: Date;
  updatedAt: Date;
}

export type ExperimentType = 'ab' | 'multivariate' | 'feature_flag';
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'concluded';

export interface ExperimentVariant {
  id: string;
  name: string;
  weight: number;
  isControl: boolean;
  config: Record<string, unknown>;
}

export interface TargetingRule {
  attribute: string;
  operator: 'eq' | 'neq' | 'in' | 'not_in' | 'gt' | 'lt' | 'contains';
  value: unknown;
}

export interface ExperimentResults {
  totalParticipants: number;
  variantResults: VariantResult[];
  winner?: string;
  confidence: number;
}

export interface VariantResult {
  variantId: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  improvement?: number;
}

// ============================================================================
// Feature Flag Types
// ============================================================================

export interface FeatureFlag {
  key: string;
  tenantId: string;
  name: string;
  description?: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetingRules?: TargetingRule[];
  variants?: FlagVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FlagVariant {
  key: string;
  name: string;
  weight: number;
  payload?: Record<string, unknown>;
}

export interface FlagEvaluation {
  key: string;
  enabled: boolean;
  variant?: string;
  payload?: Record<string, unknown>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface FunnelDefinition {
  id: string;
  tenantId: string;
  name: string;
  steps: FunnelStep[];
  createdAt: Date;
}

export interface FunnelStep {
  name: string;
  eventType: string;
  filters?: Record<string, unknown>;
}

export interface FunnelAnalysis {
  funnelId: string;
  period: DateRange;
  totalEntered: number;
  steps: FunnelStepResult[];
  overallConversion: number;
}

export interface FunnelStepResult {
  stepName: string;
  entered: number;
  completed: number;
  dropoff: number;
  conversionRate: number;
  averageTime?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CohortDefinition {
  id: string;
  tenantId: string;
  name: string;
  cohortType: 'first_action' | 'signup' | 'custom';
  eventType: string;
  granularity: 'day' | 'week' | 'month';
}

export interface CohortAnalysis {
  cohortId: string;
  cohorts: CohortRow[];
}

export interface CohortRow {
  cohortDate: Date;
  size: number;
  retention: number[];
}

export interface AttributionResult {
  touchpoints: Touchpoint[];
  model: AttributionModel;
  conversions: number;
  revenue: number;
}

export interface Touchpoint {
  channel: string;
  campaign?: string;
  timestamp: Date;
  credit: number;
}

export type AttributionModel = 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';

// ============================================================================
// Commerce Types
// ============================================================================

export interface Coupon {
  code: string;
  tenantId: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom?: Date;
  validUntil?: Date;
  conditions?: CouponCondition[];
  createdAt: Date;
}

export interface CouponCondition {
  type: 'product' | 'category' | 'user_segment';
  operator: 'include' | 'exclude';
  values: string[];
}

export interface InAppMessage {
  id: string;
  tenantId: string;
  name: string;
  type: 'modal' | 'banner' | 'tooltip' | 'slideout';
  content: MessageContent;
  trigger: MessageTrigger;
  targeting?: TargetingRule[];
  status: 'draft' | 'active' | 'paused';
  createdAt: Date;
}

export interface MessageContent {
  title?: string;
  body: string;
  cta?: {
    text: string;
    action: string;
  };
  image?: string;
  style?: Record<string, string>;
}

export interface MessageTrigger {
  type: 'page_view' | 'event' | 'time_on_page' | 'exit_intent' | 'scroll_depth';
  condition: Record<string, unknown>;
}

// ============================================================================
// Reputation Types
// ============================================================================

export interface Review {
  id: string;
  tenantId: string;
  userId?: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
}

export interface NpsSurvey {
  id: string;
  tenantId: string;
  userId: string;
  score: number;
  feedback?: string;
  category: 'promoter' | 'passive' | 'detractor';
  createdAt: Date;
}

export interface NpsResults {
  tenantId: string;
  period: DateRange;
  totalResponses: number;
  promoters: number;
  passives: number;
  detractors: number;
  npsScore: number;
  trend: number;
}
