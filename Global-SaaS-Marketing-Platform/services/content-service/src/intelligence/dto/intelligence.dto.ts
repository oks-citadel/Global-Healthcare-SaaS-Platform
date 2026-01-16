import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
  IsUrl,
  IsNumber,
  IsInt,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Enums
export enum ContentType {
  PAGE = 'PAGE',
  BLOG_POST = 'BLOG_POST',
  LANDING_PAGE = 'LANDING_PAGE',
  ARTICLE = 'ARTICLE',
  GUIDE = 'GUIDE',
  CASE_STUDY = 'CASE_STUDY',
  WHITEPAPER = 'WHITEPAPER',
  EBOOK = 'EBOOK',
  INFOGRAPHIC = 'INFOGRAPHIC',
  VIDEO = 'VIDEO',
  PODCAST = 'PODCAST',
}

export enum TopicClusterType {
  PILLAR = 'PILLAR',
  CLUSTER = 'CLUSTER',
  SUPPORTING = 'SUPPORTING',
}

// Topic DTOs
export class CreateTopicDto {
  @ApiProperty({ description: 'Topic name', example: 'Content Marketing' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug', example: 'content-marketing' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional({ description: 'Topic description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Monthly search volume', example: 12000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  searchVolume?: number;

  @ApiPropertyOptional({ description: 'Keyword difficulty (0-100)', example: 45 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  difficulty?: number;

  @ApiPropertyOptional({ description: 'Relevance score (0-1)', example: 0.85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  relevanceScore?: number;

  @ApiPropertyOptional({ description: 'Parent topic ID for hierarchy' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}

export class TopicQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by parent topic ID (use "root" for top-level)' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class TopicSuggestionsDto {
  @ApiPropertyOptional({ description: 'Keywords to base suggestions on', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Content to analyze for topic suggestions' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Number of suggestions', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

// Topic Cluster DTOs
export class CreateClusterDto {
  @ApiProperty({ description: 'Cluster name', example: 'Health Marketing Strategy' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ description: 'Cluster description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Pillar topic ID' })
  @IsOptional()
  @IsUUID()
  pillarTopicId?: string;

  @ApiPropertyOptional({ description: 'Initial page mappings', type: 'array' })
  @IsOptional()
  @IsArray()
  mappings?: {
    pageId: string;
    type?: TopicClusterType;
    position?: number;
  }[];
}

export class UpdateClusterDto extends PartialType(CreateClusterDto) {}

export class ClusterQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class AddPageToClusterDto {
  @ApiProperty({ description: 'Page ID to add' })
  @IsUUID()
  pageId: string;

  @ApiPropertyOptional({ enum: TopicClusterType, default: TopicClusterType.CLUSTER })
  @IsOptional()
  @IsEnum(TopicClusterType)
  type?: TopicClusterType;

  @ApiPropertyOptional({ description: 'Position in cluster' })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}

export class SetPillarPageDto {
  @ApiProperty({ description: 'Page ID to set as pillar' })
  @IsUUID()
  pageId: string;
}

// Performance DTOs
export class PerformanceQueryDto {
  @ApiPropertyOptional({ description: 'Filter by page ID' })
  @IsOptional()
  @IsUUID()
  pageId?: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Group by period', enum: ['day', 'week', 'month'], default: 'day' })
  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'week' | 'month' = 'day';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;
}

export class TopPagesQueryDto {
  @ApiPropertyOptional({
    description: 'Metric to sort by',
    enum: ['pageViews', 'conversions', 'dwellTime', 'shares'],
    default: 'pageViews',
  })
  @IsOptional()
  @IsString()
  metric?: 'pageViews' | 'conversions' | 'dwellTime' | 'shares' = 'pageViews';

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

// AI Generation DTOs
export class GenerateOutlineDto {
  @ApiProperty({ description: 'Topic for the outline', example: 'Digital Marketing Strategies for Healthcare' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  topic: string;

  @ApiProperty({ description: 'Target keywords', type: [String], example: ['healthcare marketing', 'digital health'] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiPropertyOptional({ description: 'Target audience description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  targetAudience?: string;

  @ApiPropertyOptional({ enum: ContentType, default: ContentType.BLOG_POST })
  @IsOptional()
  @IsEnum(ContentType)
  contentType?: ContentType = ContentType.BLOG_POST;

  @ApiPropertyOptional({ description: 'Target word count', example: 1500 })
  @IsOptional()
  @IsInt()
  @Min(500)
  @Max(10000)
  wordCount?: number;

  @ApiPropertyOptional({
    description: 'Content tone',
    enum: ['professional', 'casual', 'academic', 'conversational'],
  })
  @IsOptional()
  @IsString()
  tone?: 'professional' | 'casual' | 'academic' | 'conversational';
}

export class GenerateBriefDto {
  @ApiProperty({ description: 'Content title', example: 'Complete Guide to Patient Engagement' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({ description: 'Content objective' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  objective?: string;

  @ApiPropertyOptional({ description: 'Target audience description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Key messages to convey', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyMessages?: string[];

  @ApiPropertyOptional({ description: 'Target keywords', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Competitor URLs for analysis', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  competitorUrls?: string[];

  @ApiPropertyOptional({ enum: ContentType, default: ContentType.BLOG_POST })
  @IsOptional()
  @IsEnum(ContentType)
  contentType?: ContentType = ContentType.BLOG_POST;
}

export class RepurposeContentDto {
  @ApiProperty({ description: 'Source page ID' })
  @IsUUID()
  sourcePageId: string;

  @ApiProperty({ description: 'Target content type', enum: ContentType })
  @IsEnum(ContentType)
  targetType: ContentType;

  @ApiPropertyOptional({ description: 'Additional instructions for repurposing' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  additionalInstructions?: string;
}
