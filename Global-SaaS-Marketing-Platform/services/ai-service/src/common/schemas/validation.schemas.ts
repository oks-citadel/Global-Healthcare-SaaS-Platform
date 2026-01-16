import { z } from 'zod';

// Lead Scoring Schemas
export const LeadScoringInputSchema = z.object({
  leadId: z.string().uuid(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  industry: z.string().min(1).max(100),
  engagementScore: z.number().min(0).max(100),
  websiteVisits: z.number().int().min(0),
  emailOpens: z.number().int().min(0),
  downloadedAssets: z.number().int().min(0),
  demoRequested: z.boolean(),
  budgetRange: z.enum(['<$1k', '$1k-$5k', '$5k-$25k', '$25k-$100k', '$100k+']),
  decisionTimeframe: z.enum([
    'immediate',
    '1-3 months',
    '3-6 months',
    '6-12 months',
    'no timeline',
  ]),
  competitorMentions: z.number().int().min(0).default(0),
  customAttributes: z.record(z.unknown()).optional(),
});

export type LeadScoringInput = z.infer<typeof LeadScoringInputSchema>;

// Churn Prediction Schemas
export const ChurnPredictionInputSchema = z.object({
  customerId: z.string().uuid(),
  accountAge: z.number().int().min(0).describe('Account age in months'),
  monthlyUsage: z.number().min(0).describe('Monthly usage percentage'),
  supportTickets: z.number().int().min(0).describe('Support tickets in last 30 days'),
  featureAdoption: z.number().min(0).max(100).describe('Feature adoption percentage'),
  lastLoginDays: z.number().int().min(0).describe('Days since last login'),
  paymentIssues: z.number().int().min(0).describe('Payment issues in last 90 days'),
  contractValue: z.number().min(0).describe('Monthly contract value'),
  npsScore: z.number().min(0).max(10).optional(),
  engagementTrend: z.number().min(-1).max(1).describe('Engagement trend (-1 to 1)'),
  customAttributes: z.record(z.unknown()).optional(),
});

export type ChurnPredictionInput = z.infer<typeof ChurnPredictionInputSchema>;

// Expansion Prediction Schemas
export const ExpansionPredictionInputSchema = z.object({
  customerId: z.string().uuid(),
  currentMrr: z.number().min(0).describe('Current monthly recurring revenue'),
  usageGrowth: z.number().describe('Usage growth percentage'),
  featureRequests: z.number().int().min(0).describe('Feature requests in last 90 days'),
  teamSize: z.number().int().min(1).describe('Number of active users'),
  productFit: z.number().min(0).max(100).describe('Product fit score'),
  stakeholderEngagement: z.number().min(0).max(100).describe('Stakeholder engagement score'),
  upsellHistory: z.number().int().min(0).describe('Previous successful upsells'),
  industryGrowth: z.number().describe('Industry growth rate percentage'),
  customAttributes: z.record(z.unknown()).optional(),
});

export type ExpansionPredictionInput = z.infer<typeof ExpansionPredictionInputSchema>;

// Campaign Forecast Schemas
export const CampaignForecastInputSchema = z.object({
  campaignId: z.string().uuid(),
  campaignType: z.enum(['email', 'social', 'ppc', 'content', 'webinar', 'event']),
  budget: z.number().min(0),
  targetAudience: z.object({
    size: z.number().int().min(0),
    segments: z.array(z.string()),
    demographics: z.record(z.unknown()).optional(),
  }),
  duration: z.number().int().min(1).describe('Campaign duration in days'),
  channels: z.array(z.string()),
  historicalData: z.object({
    previousCampaigns: z.number().int().min(0).optional(),
    averageCtr: z.number().min(0).max(100).optional(),
    averageConversionRate: z.number().min(0).max(100).optional(),
  }).optional(),
  customAttributes: z.record(z.unknown()).optional(),
});

export type CampaignForecastInput = z.infer<typeof CampaignForecastInputSchema>;

// SEO Opportunity Schemas
export const SeoOpportunityQuerySchema = z.object({
  domain: z.string().optional(),
  industry: z.string().optional(),
  competitors: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  minSearchVolume: z.number().int().min(0).optional(),
  maxDifficulty: z.number().min(0).max(100).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type SeoOpportunityQuery = z.infer<typeof SeoOpportunityQuerySchema>;

// Growth Recommendation Schemas
export const GrowthRecommendationQuerySchema = z.object({
  categories: z.array(z.enum([
    'acquisition',
    'activation',
    'retention',
    'revenue',
    'referral',
  ])).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
});

export type GrowthRecommendationQuery = z.infer<typeof GrowthRecommendationQuerySchema>;

// Content Generation Schemas
export const ContentGenerationInputSchema = z.object({
  contentType: z.enum([
    'blog_post',
    'email',
    'social_post',
    'ad_copy',
    'landing_page',
    'product_description',
    'meta_description',
    'headline',
  ]),
  topic: z.string().min(1).max(500),
  tone: z.enum([
    'professional',
    'casual',
    'friendly',
    'authoritative',
    'persuasive',
    'informative',
  ]).default('professional'),
  targetAudience: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  additionalContext: z.string().optional(),
  brand: z.object({
    name: z.string().optional(),
    voice: z.string().optional(),
    guidelines: z.string().optional(),
  }).optional(),
});

export type ContentGenerationInput = z.infer<typeof ContentGenerationInputSchema>;

// Content Optimization Schemas
export const ContentOptimizationInputSchema = z.object({
  content: z.string().min(1).max(50000),
  optimizationType: z.enum([
    'seo',
    'readability',
    'engagement',
    'conversion',
    'tone',
    'grammar',
  ]),
  targetKeywords: z.array(z.string()).optional(),
  targetTone: z.enum([
    'professional',
    'casual',
    'friendly',
    'authoritative',
    'persuasive',
    'informative',
  ]).optional(),
  targetReadingLevel: z.enum([
    'elementary',
    'middle_school',
    'high_school',
    'college',
    'professional',
  ]).optional(),
  preserveLength: z.boolean().default(false),
});

export type ContentOptimizationInput = z.infer<typeof ContentOptimizationInputSchema>;

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type Pagination = z.infer<typeof PaginationSchema>;
