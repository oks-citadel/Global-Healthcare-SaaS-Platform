import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsBoolean,
  IsObject,
  IsArray,
  IsUrl,
  MaxLength,
  MinLength,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum ContentStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

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

// Create Content Page DTO
export class CreateContentPageDto {
  @ApiProperty({ description: 'Page title', example: 'Introduction to Health Marketing' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug', example: 'introduction-to-health-marketing' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional({ description: 'Short excerpt', example: 'Learn the basics of health marketing...' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  excerpt?: string;

  @ApiProperty({ description: 'Rich content structure', example: { blocks: [] } })
  @IsObject()
  content: Record<string, any>;

  @ApiPropertyOptional({ description: 'SEO meta title', example: 'Health Marketing Guide | Unified Health' })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Featured image URL' })
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({ enum: ContentType, default: ContentType.PAGE })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiProperty({ description: 'Author ID' })
  @IsUUID()
  authorId: string;

  @ApiPropertyOptional({ description: 'Canonical URL for SEO' })
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;

  @ApiPropertyOptional({ description: 'Prevent indexing by search engines', default: false })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @ApiPropertyOptional({ description: 'Prevent following links', default: false })
  @IsOptional()
  @IsBoolean()
  noFollow?: boolean;

  @ApiPropertyOptional({ description: 'Topic IDs to associate', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  topicIds?: string[];
}

// Update Content Page DTO
export class UpdateContentPageDto extends PartialType(CreateContentPageDto) {
  @ApiPropertyOptional({ description: 'Change message for version history' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  changeMessage?: string;
}

// Query Content Pages DTO
export class ContentPageQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ enum: ContentType })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({ description: 'Filter by author ID' })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by topic ID' })
  @IsOptional()
  @IsUUID()
  topicId?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['createdAt', 'updatedAt', 'publishedAt', 'title'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// Publish Content DTO
export class PublishContentDto {
  @ApiProperty({ description: 'Page ID to publish' })
  @IsUUID()
  pageId: string;
}

// Schedule Content DTO
export class ScheduleContentDto {
  @ApiProperty({ description: 'Page ID to schedule' })
  @IsUUID()
  pageId: string;

  @ApiProperty({ description: 'Scheduled publish date/time', example: '2024-12-31T12:00:00Z' })
  @IsDateString()
  scheduledAt: string;
}

// Save Draft DTO
export class SaveDraftDto {
  @ApiPropertyOptional({ description: 'Existing page ID (omit for new draft)' })
  @IsOptional()
  @IsUUID()
  pageId?: string;

  @ApiProperty({ description: 'Draft title' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiProperty({ description: 'Draft content' })
  @IsObject()
  content: Record<string, any>;

  @ApiPropertyOptional({ description: 'Draft excerpt' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  excerpt?: string;
}

// Version Query DTO
export class VersionQueryDto {
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
  @Max(50)
  limit?: number = 10;
}

// Restore Version DTO
export class RestoreVersionDto {
  @ApiProperty({ description: 'Version number to restore' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  versionNumber: number;
}

// Compare Versions DTO
export class CompareVersionsDto {
  @ApiProperty({ description: 'First version number' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  versionA: number;

  @ApiProperty({ description: 'Second version number' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  versionB: number;
}

// Response DTOs
export class ContentPageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  excerpt?: string;

  @ApiProperty()
  content: Record<string, any>;

  @ApiPropertyOptional()
  metaTitle?: string;

  @ApiPropertyOptional()
  metaDescription?: string;

  @ApiPropertyOptional()
  featuredImage?: string;

  @ApiProperty({ enum: ContentType })
  type: ContentType;

  @ApiProperty({ enum: ContentStatus })
  status: ContentStatus;

  @ApiPropertyOptional()
  publishedAt?: Date;

  @ApiPropertyOptional()
  scheduledAt?: Date;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  createdBy: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  versionNumber: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class VersionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pageId: string;

  @ApiProperty()
  versionNumber: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  changeMessage?: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;
}
