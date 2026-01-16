import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsUrl, IsArray, IsBoolean, IsNumber, IsEnum, Min, Max, IsObject, MinLength, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationDto } from './core.dto';

// ==========================================
// KEYWORD RESEARCH DTOs
// ==========================================

export class KeywordResearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiProperty({ type: [String], minItems: 1, maxItems: 100 })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiPropertyOptional({ default: 'en' })
  @IsOptional()
  @IsString()
  locale?: string = 'en';

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  includeRelated?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  includeLongTail?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  includeQuestions?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  includeSerpFeatures?: boolean = true;
}

export class KeywordResultDto {
  @ApiProperty()
  keyword: string;

  @ApiPropertyOptional()
  searchVolume?: number;

  @ApiPropertyOptional()
  cpc?: number;

  @ApiPropertyOptional()
  competition?: number;

  @ApiPropertyOptional()
  difficulty?: number;

  @ApiPropertyOptional({ enum: ['informational', 'navigational', 'commercial', 'transactional'] })
  searchIntent?: string;

  @ApiPropertyOptional()
  intentConfidence?: number;

  @ApiPropertyOptional({ type: 'array' })
  relatedKeywords?: Array<{ keyword: string; volume: number; relevance: number }>;

  @ApiPropertyOptional({ type: 'array' })
  longTailVariants?: Array<{ keyword: string; volume: number }>;

  @ApiPropertyOptional({ type: 'array' })
  questions?: Array<{ question: string; volume: number }>;

  @ApiPropertyOptional({ type: [String] })
  serpFeatures?: string[];
}

// ==========================================
// CONTENT OPTIMIZATION DTOs
// ==========================================

export class ContentOptimizeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ minLength: 10, maxLength: 100000 })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(100000)
  content?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  targetKeyword?: string;

  @ApiPropertyOptional({ default: 'en' })
  @IsOptional()
  @IsString()
  locale?: string = 'en';

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  analyzeReadability?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  analyzeKeywords?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  analyzeStructure?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  generateSuggestions?: boolean = true;
}

export class ContentOptimizationResultDto {
  @ApiProperty()
  overallScore: number;

  @ApiPropertyOptional()
  readabilityScore?: number;

  @ApiPropertyOptional()
  keywordScore?: number;

  @ApiPropertyOptional()
  structureScore?: number;

  @ApiPropertyOptional()
  engagementScore?: number;

  @ApiPropertyOptional()
  readabilityMetrics?: {
    fleschKincaid: number;
    avgSentenceLength: number;
    avgWordLength: number;
    wordCount: number;
    paragraphCount: number;
  };

  @ApiPropertyOptional()
  keywordAnalysis?: {
    targetKeyword: string;
    density: number;
    placements: Record<string, boolean>;
  };

  @ApiPropertyOptional()
  structureAnalysis?: {
    headingStructure: Record<string, number>;
    imageAnalysis: { count: number; withAlt: number; withoutAlt: number };
    linkAnalysis: { internal: number; external: number; broken: number };
  };

  @ApiPropertyOptional({ type: 'array' })
  suggestions?: Array<{
    type: string;
    priority: string;
    current?: string;
    suggested: string;
    reason: string;
  }>;
}

// ==========================================
// INTERNAL LINKS DTOs
// ==========================================

export class InternalLinksQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  pageId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeRecommendations?: boolean = true;

  @ApiPropertyOptional({ default: 10, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  maxRecommendations?: number = 10;
}

export class InternalLinkDto {
  @ApiProperty()
  sourceUrl: string;

  @ApiProperty()
  targetUrl: string;

  @ApiPropertyOptional()
  anchorText?: string;

  @ApiPropertyOptional()
  context?: string;

  @ApiPropertyOptional({ enum: ['navigation', 'content', 'footer', 'sidebar', 'breadcrumb', 'related'] })
  linkType?: string;

  @ApiPropertyOptional()
  relevanceScore?: number;

  @ApiProperty()
  isFollow: boolean;

  @ApiProperty()
  isBroken: boolean;
}

export class LinkRecommendationDto {
  @ApiProperty()
  sourceUrl: string;

  @ApiProperty()
  targetUrl: string;

  @ApiProperty()
  suggestedAnchorText: string;

  @ApiProperty()
  relevanceScore: number;

  @ApiProperty()
  reason: string;
}

// ==========================================
// CONTENT FRESHNESS DTOs
// ==========================================

export class ContentFreshnessQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional({ description: 'Minimum content age in days' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minAge?: number;

  @ApiPropertyOptional({ description: 'Maximum content age in days' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxAge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentType?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDecayScore?: boolean = true;
}

export class ContentFreshnessItemDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  lastModified: Date;

  @ApiProperty({ description: 'Content age in days' })
  contentAge: number;

  @ApiPropertyOptional({ description: 'Content decay score (0-100, higher = more decayed)' })
  decayScore?: number;

  @ApiPropertyOptional()
  contentType?: string;

  @ApiProperty({ enum: ['fresh', 'aging', 'stale', 'outdated'] })
  freshnessStatus: string;

  @ApiPropertyOptional()
  recommendation?: string;
}

// ==========================================
// STRUCTURED DATA DTOs
// ==========================================

export class GenerateSchemaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiProperty({
    enum: [
      'Organization', 'LocalBusiness', 'Product', 'Article', 'BlogPosting',
      'WebPage', 'WebSite', 'BreadcrumbList', 'FAQPage', 'HowTo', 'Event',
      'Person', 'Review', 'AggregateRating', 'VideoObject', 'ImageObject',
      'SoftwareApplication', 'Course', 'Recipe', 'JobPosting'
    ]
  })
  @IsEnum([
    'Organization', 'LocalBusiness', 'Product', 'Article', 'BlogPosting',
    'WebPage', 'WebSite', 'BreadcrumbList', 'FAQPage', 'HowTo', 'Event',
    'Person', 'Review', 'AggregateRating', 'VideoObject', 'ImageObject',
    'SoftwareApplication', 'Course', 'Recipe', 'JobPosting'
  ])
  schemaType: string;

  @ApiProperty({ type: 'object' })
  @IsObject()
  data: Record<string, any>;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  validate?: boolean = true;
}

export class SchemaResultDto {
  @ApiProperty()
  schemaType: string;

  @ApiProperty({ type: 'object' })
  jsonLd: Record<string, any>;

  @ApiProperty()
  isValid: boolean;

  @ApiPropertyOptional({ type: 'array' })
  validationErrors?: Array<{
    path: string;
    message: string;
  }>;

  @ApiPropertyOptional({ type: 'array' })
  warnings?: Array<{
    path: string;
    message: string;
  }>;

  @ApiProperty()
  htmlScript: string;
}
