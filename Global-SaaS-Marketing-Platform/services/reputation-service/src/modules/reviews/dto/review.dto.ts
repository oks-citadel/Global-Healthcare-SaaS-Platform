import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
  IsDateString,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Review source',
    enum: ['google', 'yelp', 'facebook', 'trustpilot', 'internal'],
  })
  @IsEnum(['google', 'yelp', 'facebook', 'trustpilot', 'internal'])
  source: string;

  @ApiPropertyOptional({ description: 'External review ID from source' })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty({ description: 'Reviewer name' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  authorName: string;

  @ApiPropertyOptional({ description: 'Reviewer email' })
  @IsEmail()
  @IsOptional()
  authorEmail?: string;

  @ApiProperty({ description: 'Rating value', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Review title' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Review content' })
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({ description: 'Is reviewer verified' })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiPropertyOptional({ description: 'Tags for the review', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Date review was published' })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ description: 'Is review published' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Is review featured' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Tags for the review', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class RespondToReviewDto {
  @ApiProperty({ description: 'Response content' })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  response: string;

  @ApiProperty({ description: 'Responder identifier' })
  @IsString()
  respondedBy: string;
}

export class ReviewQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by source',
    enum: ['google', 'yelp', 'facebook', 'trustpilot', 'internal'],
  })
  @IsEnum(['google', 'yelp', 'facebook', 'trustpilot', 'internal'])
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Minimum rating' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  minRating?: number;

  @ApiPropertyOptional({ description: 'Maximum rating' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  maxRating?: number;

  @ApiPropertyOptional({
    description: 'Filter by sentiment',
    enum: ['positive', 'negative', 'neutral'],
  })
  @IsEnum(['positive', 'negative', 'neutral'])
  @IsOptional()
  sentiment?: string;

  @ApiPropertyOptional({ description: 'Show only featured reviews' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Show only published reviews' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Filter by tag' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ description: 'Start date filter' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort field',
    default: 'publishedAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'publishedAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class ReviewResponseDto {
  @ApiProperty({ description: 'Review ID' })
  id: string;

  @ApiProperty({ description: 'Review source' })
  source: string;

  @ApiProperty({ description: 'External ID' })
  externalId: string | null;

  @ApiProperty({ description: 'Author name' })
  authorName: string;

  @ApiProperty({ description: 'Author email' })
  authorEmail: string | null;

  @ApiProperty({ description: 'Rating' })
  rating: number;

  @ApiProperty({ description: 'Title' })
  title: string | null;

  @ApiProperty({ description: 'Content' })
  content: string;

  @ApiProperty({ description: 'Response' })
  response: string | null;

  @ApiProperty({ description: 'Response timestamp' })
  respondedAt: Date | null;

  @ApiProperty({ description: 'Responder' })
  respondedBy: string | null;

  @ApiProperty({ description: 'Sentiment' })
  sentiment: string | null;

  @ApiProperty({ description: 'Sentiment score' })
  sentimentScore: number | null;

  @ApiProperty({ description: 'Is verified' })
  isVerified: boolean;

  @ApiProperty({ description: 'Is published' })
  isPublished: boolean;

  @ApiProperty({ description: 'Is featured' })
  isFeatured: boolean;

  @ApiProperty({ description: 'Tags' })
  tags: string[];

  @ApiProperty({ description: 'Published date' })
  publishedAt: Date;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;
}

export class ReviewListResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  reviews: ReviewResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
}
