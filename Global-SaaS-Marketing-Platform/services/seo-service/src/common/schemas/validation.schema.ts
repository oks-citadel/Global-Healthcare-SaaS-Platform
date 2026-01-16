import { z } from 'zod';

// ==========================================
// COMMON SCHEMAS
// ==========================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const UuidSchema = z.string().uuid();

export const UrlSchema = z.string().url();

export const LocaleSchema = z.string().min(2).max(10).regex(/^[a-z]{2}(-[A-Z]{2})?$/);

export const SlugSchema = z.string().min(1).max(500).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

// ==========================================
// TENANT SCHEMAS
// ==========================================

export const TenantParamsSchema = z.object({
  tenant: z.string().min(1).max(100),
});

export const TenantLocaleParamsSchema = z.object({
  tenant: z.string().min(1).max(100),
  locale: LocaleSchema,
});

// ==========================================
// PAGE SEO SCHEMAS
// ==========================================

export const PageSlugParamsSchema = z.object({
  slug: z.string().min(1).max(500),
});

export const PageSeoQuerySchema = z.object({
  tenant: z.string().optional(),
  locale: LocaleSchema.optional(),
  includeStructuredData: z.coerce.boolean().default(true),
  includeHreflang: z.coerce.boolean().default(true),
});

export const CreatePageSeoSchema = z.object({
  tenantId: UuidSchema,
  slug: SlugSchema,
  locale: LocaleSchema.default('en'),
  title: z.string().min(1).max(70),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).default([]),
  canonicalUrl: UrlSchema.optional(),
  hreflangTags: z.record(LocaleSchema, UrlSchema).optional(),
  ogTitle: z.string().max(95).optional(),
  ogDescription: z.string().max(200).optional(),
  ogImage: UrlSchema.optional(),
  ogType: z.string().default('website'),
  twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).default('summary_large_image'),
  twitterTitle: z.string().max(70).optional(),
  twitterDescription: z.string().max(200).optional(),
  twitterImage: UrlSchema.optional(),
  robotsDirectives: z.string().default('index, follow'),
  structuredData: z.any().optional(),
  priority: z.number().min(0).max(1).default(0.5),
  changeFrequency: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).default('weekly'),
  isPublished: z.boolean().default(true),
  isIndexable: z.boolean().default(true),
});

export const UpdatePageSeoSchema = CreatePageSeoSchema.partial().omit({ tenantId: true });

// ==========================================
// SITEMAP SCHEMAS
// ==========================================

export const SitemapQuerySchema = z.object({
  tenant: z.string().optional(),
  type: z.enum(['index', 'pages', 'blog', 'products', 'images', 'videos', 'news']).optional(),
  forceRefresh: z.coerce.boolean().default(false),
});

export const GenerateSitemapSchema = z.object({
  tenantId: UuidSchema.optional(),
  locale: LocaleSchema.optional(),
  type: z.enum(['index', 'pages', 'blog', 'products', 'images', 'videos', 'news']).default('pages'),
  maxUrls: z.number().int().positive().max(50000).default(50000),
  includeLastmod: z.boolean().default(true),
  includeChangefreq: z.boolean().default(true),
  includePriority: z.boolean().default(true),
});

// ==========================================
// ROBOTS.TXT SCHEMAS
// ==========================================

export const RobotsQuerySchema = z.object({
  tenant: z.string().optional(),
});

export const UserAgentRuleSchema = z.object({
  userAgent: z.string().default('*'),
  allow: z.array(z.string()).default([]),
  disallow: z.array(z.string()).default([]),
  crawlDelay: z.number().int().positive().optional(),
});

export const UpdateRobotsConfigSchema = z.object({
  tenantId: UuidSchema,
  userAgentRules: z.array(UserAgentRuleSchema).default([]),
  sitemapUrls: z.array(UrlSchema).default([]),
  crawlDelay: z.number().int().positive().optional(),
  customDirectives: z.string().optional(),
});

// ==========================================
// MANIFEST SCHEMAS
// ==========================================

export const ManifestQuerySchema = z.object({
  tenant: z.string().optional(),
});

export const ManifestIconSchema = z.object({
  src: z.string(),
  sizes: z.string(),
  type: z.string().default('image/png'),
  purpose: z.enum(['any', 'maskable', 'monochrome']).optional(),
});

export const ManifestShortcutSchema = z.object({
  name: z.string(),
  url: z.string(),
  description: z.string().optional(),
  icons: z.array(ManifestIconSchema).optional(),
});

export const UpdateManifestConfigSchema = z.object({
  tenantId: UuidSchema,
  name: z.string().min(1).max(100),
  shortName: z.string().max(25).optional(),
  description: z.string().max(500).optional(),
  startUrl: z.string().default('/'),
  display: z.enum(['fullscreen', 'standalone', 'minimal-ui', 'browser']).default('standalone'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#ffffff'),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  orientation: z.enum([
    'any', 'natural', 'landscape', 'landscape-primary', 'landscape-secondary',
    'portrait', 'portrait-primary', 'portrait-secondary'
  ]).default('portrait-primary'),
  icons: z.array(ManifestIconSchema).default([]),
  scope: z.string().optional(),
  lang: LocaleSchema.default('en'),
  dir: z.enum(['ltr', 'rtl', 'auto']).default('ltr'),
  categories: z.array(z.string()).default([]),
  screenshots: z.array(ManifestIconSchema).optional(),
  shortcuts: z.array(ManifestShortcutSchema).optional(),
});

// ==========================================
// REINDEX SCHEMAS
// ==========================================

export const ReindexRequestSchema = z.object({
  tenantId: UuidSchema.optional(),
  urls: z.array(UrlSchema).max(1000).optional(),
  type: z.enum(['sitemap', 'single_url', 'bulk_urls', 'full_site']).default('sitemap'),
  priority: z.number().int().min(1).max(10).default(5),
  notifyOnComplete: z.boolean().default(false),
  webhookUrl: UrlSchema.optional(),
});

// ==========================================
// AUDIT SCHEMAS
// ==========================================

export const AuditQuerySchema = z.object({
  tenant: z.string().optional(),
  type: z.enum(['full', 'technical', 'content', 'links', 'performance', 'accessibility']).optional(),
  status: z.enum(['pending', 'scheduled', 'running', 'completed', 'failed', 'cancelled']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const ScheduleAuditSchema = z.object({
  tenantId: UuidSchema,
  type: z.enum(['full', 'technical', 'content', 'links', 'performance', 'accessibility']).default('full'),
  scheduledAt: z.coerce.date().optional(),
  recurring: z.boolean().default(false),
  cronExpression: z.string().regex(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/).optional(),
  maxPages: z.number().int().positive().default(1000),
  notifyOnComplete: z.boolean().default(true),
  webhookUrl: UrlSchema.optional(),
});

// ==========================================
// KEYWORD RESEARCH SCHEMAS
// ==========================================

export const KeywordResearchSchema = z.object({
  tenantId: UuidSchema.optional(),
  keywords: z.array(z.string().min(1).max(100)).min(1).max(100),
  locale: LocaleSchema.default('en'),
  includeRelated: z.boolean().default(true),
  includeLongTail: z.boolean().default(true),
  includeQuestions: z.boolean().default(true),
  includeSerpFeatures: z.boolean().default(true),
});

// ==========================================
// CONTENT OPTIMIZATION SCHEMAS
// ==========================================

export const ContentOptimizeSchema = z.object({
  tenantId: UuidSchema.optional(),
  url: UrlSchema.optional(),
  content: z.string().min(10).max(100000).optional(),
  targetKeyword: z.string().min(1).max(100).optional(),
  locale: LocaleSchema.default('en'),
  analyzeReadability: z.boolean().default(true),
  analyzeKeywords: z.boolean().default(true),
  analyzeStructure: z.boolean().default(true),
  generateSuggestions: z.boolean().default(true),
}).refine(data => data.url || data.content, {
  message: 'Either url or content must be provided',
});

// ==========================================
// INTERNAL LINKS SCHEMAS
// ==========================================

export const InternalLinksQuerySchema = z.object({
  tenant: z.string().optional(),
  pageId: UuidSchema.optional(),
  url: UrlSchema.optional(),
  includeRecommendations: z.coerce.boolean().default(true),
  maxRecommendations: z.coerce.number().int().positive().max(50).default(10),
});

// ==========================================
// CONTENT FRESHNESS SCHEMAS
// ==========================================

export const ContentFreshnessQuerySchema = z.object({
  tenant: z.string().optional(),
  minAge: z.coerce.number().int().positive().optional(), // days
  maxAge: z.coerce.number().int().positive().optional(), // days
  contentType: z.string().optional(),
  includeDecayScore: z.coerce.boolean().default(true),
  limit: z.coerce.number().int().positive().max(500).default(100),
});

// ==========================================
// STRUCTURED DATA SCHEMAS
// ==========================================

export const GenerateSchemaSchema = z.object({
  tenantId: UuidSchema.optional(),
  schemaType: z.enum([
    'Organization', 'LocalBusiness', 'Product', 'Article', 'BlogPosting',
    'WebPage', 'WebSite', 'BreadcrumbList', 'FAQPage', 'HowTo', 'Event',
    'Person', 'Review', 'AggregateRating', 'VideoObject', 'ImageObject',
    'SoftwareApplication', 'Course', 'Recipe', 'JobPosting'
  ]),
  data: z.record(z.any()),
  validate: z.boolean().default(true),
});

// ==========================================
// TECHNICAL SEO SCHEMAS
// ==========================================

export const WebVitalsQuerySchema = z.object({
  tenant: z.string().optional(),
  url: UrlSchema.optional(),
  deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const PageSpeedParamsSchema = z.object({
  url: z.string().transform(decodeURIComponent),
});

export const PageSpeedQuerySchema = z.object({
  strategy: z.enum(['mobile', 'desktop']).default('mobile'),
  categories: z.array(z.enum(['performance', 'accessibility', 'best-practices', 'seo'])).optional(),
});

export const MobileFriendlyParamsSchema = z.object({
  url: z.string().transform(decodeURIComponent),
});

export const AccessibilityParamsSchema = z.object({
  url: z.string().transform(decodeURIComponent),
});

export const AccessibilityQuerySchema = z.object({
  standard: z.enum(['WCAG2A', 'WCAG2AA', 'WCAG2AAA']).default('WCAG2AA'),
  includeWarnings: z.coerce.boolean().default(true),
});

// ==========================================
// INDEX COVERAGE SCHEMAS
// ==========================================

export const IndexCoverageQuerySchema = z.object({
  tenant: z.string().optional(),
  status: z.enum(['indexed', 'not_indexed', 'excluded', 'discovered', 'unknown']).optional(),
  hasIssues: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(500).default(100),
});

// ==========================================
// CANONICAL SCHEMAS
// ==========================================

export const CanonicalQuerySchema = z.object({
  tenant: z.string().optional(),
  hasMismatch: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(500).default(100),
});

// ==========================================
// HREFLANG SCHEMAS
// ==========================================

export const HreflangQuerySchema = z.object({
  tenant: z.string().optional(),
  locale: LocaleSchema.optional(),
  hasIssues: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(500).default(100),
});

// ==========================================
// TYPE EXPORTS
// ==========================================

export type Pagination = z.infer<typeof PaginationSchema>;
export type TenantParams = z.infer<typeof TenantParamsSchema>;
export type TenantLocaleParams = z.infer<typeof TenantLocaleParamsSchema>;
export type PageSlugParams = z.infer<typeof PageSlugParamsSchema>;
export type PageSeoQuery = z.infer<typeof PageSeoQuerySchema>;
export type CreatePageSeo = z.infer<typeof CreatePageSeoSchema>;
export type UpdatePageSeo = z.infer<typeof UpdatePageSeoSchema>;
export type SitemapQuery = z.infer<typeof SitemapQuerySchema>;
export type GenerateSitemap = z.infer<typeof GenerateSitemapSchema>;
export type RobotsQuery = z.infer<typeof RobotsQuerySchema>;
export type UserAgentRule = z.infer<typeof UserAgentRuleSchema>;
export type UpdateRobotsConfig = z.infer<typeof UpdateRobotsConfigSchema>;
export type ManifestQuery = z.infer<typeof ManifestQuerySchema>;
export type ManifestIcon = z.infer<typeof ManifestIconSchema>;
export type ManifestShortcut = z.infer<typeof ManifestShortcutSchema>;
export type UpdateManifestConfig = z.infer<typeof UpdateManifestConfigSchema>;
export type ReindexRequest = z.infer<typeof ReindexRequestSchema>;
export type AuditQuery = z.infer<typeof AuditQuerySchema>;
export type ScheduleAudit = z.infer<typeof ScheduleAuditSchema>;
export type KeywordResearch = z.infer<typeof KeywordResearchSchema>;
export type ContentOptimize = z.infer<typeof ContentOptimizeSchema>;
export type InternalLinksQuery = z.infer<typeof InternalLinksQuerySchema>;
export type ContentFreshnessQuery = z.infer<typeof ContentFreshnessQuerySchema>;
export type GenerateSchema = z.infer<typeof GenerateSchemaSchema>;
export type WebVitalsQuery = z.infer<typeof WebVitalsQuerySchema>;
export type PageSpeedParams = z.infer<typeof PageSpeedParamsSchema>;
export type PageSpeedQuery = z.infer<typeof PageSpeedQuerySchema>;
export type MobileFriendlyParams = z.infer<typeof MobileFriendlyParamsSchema>;
export type AccessibilityParams = z.infer<typeof AccessibilityParamsSchema>;
export type AccessibilityQuery = z.infer<typeof AccessibilityQuerySchema>;
export type IndexCoverageQuery = z.infer<typeof IndexCoverageQuerySchema>;
export type CanonicalQuery = z.infer<typeof CanonicalQuerySchema>;
export type HreflangQuery = z.infer<typeof HreflangQuerySchema>;
