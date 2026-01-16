import { z } from 'zod';

// Enums
export const ContentStatusSchema = z.enum([
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
  'DELETED',
]);

export const ContentTypeSchema = z.enum([
  'PAGE',
  'BLOG_POST',
  'LANDING_PAGE',
  'ARTICLE',
  'GUIDE',
  'CASE_STUDY',
  'WHITEPAPER',
  'EBOOK',
  'INFOGRAPHIC',
  'VIDEO',
  'PODCAST',
]);

export const TopicClusterTypeSchema = z.enum(['PILLAR', 'CLUSTER', 'SUPPORTING']);

// Base schemas
export const UuidSchema = z.string().uuid();

export const SlugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const DateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Content Page schemas
export const CreateContentPageSchema = z.object({
  title: z.string().min(1).max(500),
  slug: SlugSchema.optional(),
  excerpt: z.string().max(1000).optional(),
  content: z.record(z.any()),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  featuredImage: z.string().url().optional(),
  type: ContentTypeSchema.default('PAGE'),
  authorId: UuidSchema,
  canonicalUrl: z.string().url().optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  topicIds: z.array(UuidSchema).optional(),
});

export const UpdateContentPageSchema = CreateContentPageSchema.partial().extend({
  changeMessage: z.string().max(500).optional(),
});

export const ContentPageQuerySchema = PaginationSchema.extend({
  status: ContentStatusSchema.optional(),
  type: ContentTypeSchema.optional(),
  authorId: UuidSchema.optional(),
  search: z.string().optional(),
  topicId: UuidSchema.optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Publishing schemas
export const PublishContentSchema = z.object({
  pageId: UuidSchema,
});

export const ScheduleContentSchema = z.object({
  pageId: UuidSchema,
  scheduledAt: z.coerce.date().refine(
    (date) => date > new Date(),
    { message: 'Scheduled date must be in the future' },
  ),
});

export const SaveDraftSchema = z.object({
  pageId: UuidSchema.optional(),
  title: z.string().min(1).max(500),
  content: z.record(z.any()),
  excerpt: z.string().max(1000).optional(),
});

// Topic schemas
export const CreateTopicSchema = z.object({
  name: z.string().min(1).max(200),
  slug: SlugSchema.optional(),
  description: z.string().max(1000).optional(),
  searchVolume: z.number().int().min(0).optional(),
  difficulty: z.number().min(0).max(100).optional(),
  relevanceScore: z.number().min(0).max(1).optional(),
  parentId: UuidSchema.optional(),
});

export const TopicQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  parentId: UuidSchema.optional(),
});

// Topic Cluster schemas
export const CreateTopicClusterSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  pillarTopicId: UuidSchema.optional(),
  mappings: z.array(
    z.object({
      pageId: UuidSchema,
      type: TopicClusterTypeSchema.default('CLUSTER'),
      position: z.number().int().min(0).default(0),
    }),
  ).optional(),
});

export const TopicClusterQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
});

// Performance schemas
export const PerformanceQuerySchema = PaginationSchema.merge(DateRangeSchema).extend({
  pageId: UuidSchema.optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
});

// AI Generation schemas
export const GenerateOutlineSchema = z.object({
  topic: z.string().min(1).max(500),
  keywords: z.array(z.string().max(100)).min(1).max(20),
  targetAudience: z.string().max(500).optional(),
  contentType: ContentTypeSchema.default('BLOG_POST'),
  wordCount: z.number().int().min(500).max(10000).optional(),
  tone: z.enum(['professional', 'casual', 'academic', 'conversational']).optional(),
});

export const GenerateBriefSchema = z.object({
  title: z.string().min(1).max(500),
  objective: z.string().max(1000).optional(),
  targetAudience: z.string().max(500).optional(),
  keyMessages: z.array(z.string().max(500)).max(10).optional(),
  keywords: z.array(z.string().max(100)).max(20).optional(),
  competitorUrls: z.array(z.string().url()).max(5).optional(),
  contentType: ContentTypeSchema.default('BLOG_POST'),
});

export const RepurposeContentSchema = z.object({
  sourcePageId: UuidSchema,
  targetType: ContentTypeSchema,
  additionalInstructions: z.string().max(1000).optional(),
});

// Media schemas
export const UploadMediaSchema = z.object({
  pageId: UuidSchema.optional(),
  alt: z.string().max(500).optional(),
  caption: z.string().max(1000).optional(),
  folder: z.string().max(200).optional(),
});

// Type exports
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type TopicClusterType = z.infer<typeof TopicClusterTypeSchema>;

export type CreateContentPage = z.infer<typeof CreateContentPageSchema>;
export type UpdateContentPage = z.infer<typeof UpdateContentPageSchema>;
export type ContentPageQuery = z.infer<typeof ContentPageQuerySchema>;

export type PublishContent = z.infer<typeof PublishContentSchema>;
export type ScheduleContent = z.infer<typeof ScheduleContentSchema>;
export type SaveDraft = z.infer<typeof SaveDraftSchema>;

export type CreateTopic = z.infer<typeof CreateTopicSchema>;
export type TopicQuery = z.infer<typeof TopicQuerySchema>;

export type CreateTopicCluster = z.infer<typeof CreateTopicClusterSchema>;
export type TopicClusterQuery = z.infer<typeof TopicClusterQuerySchema>;

export type PerformanceQuery = z.infer<typeof PerformanceQuerySchema>;

export type GenerateOutline = z.infer<typeof GenerateOutlineSchema>;
export type GenerateBrief = z.infer<typeof GenerateBriefSchema>;
export type RepurposeContent = z.infer<typeof RepurposeContentSchema>;

export type UploadMedia = z.infer<typeof UploadMediaSchema>;
