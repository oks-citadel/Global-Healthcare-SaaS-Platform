import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  Matches,
} from 'class-validator';

export enum LandingPageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateLandingPageDto {
  @ApiProperty({ description: 'Landing page name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL slug (must be unique)' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
  slug: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Page title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Main headline' })
  @IsString()
  @IsOptional()
  headline?: string;

  @ApiPropertyOptional({ description: 'Sub-headline' })
  @IsString()
  @IsOptional()
  subheadline?: string;

  @ApiPropertyOptional({ description: 'Page content structure' })
  @IsObject()
  @IsOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Template identifier' })
  @IsString()
  @IsOptional()
  template?: string;

  @ApiPropertyOptional({ description: 'Custom CSS styles' })
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiPropertyOptional({ description: 'Custom JavaScript' })
  @IsString()
  @IsOptional()
  customJs?: string;

  @ApiPropertyOptional({ description: 'Meta title for SEO' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta description for SEO' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Open Graph image URL' })
  @IsString()
  @IsOptional()
  ogImage?: string;

  @ApiPropertyOptional({ description: 'Canonical URL' })
  @IsString()
  @IsOptional()
  canonicalUrl?: string;

  @ApiPropertyOptional({ description: 'Conversion goal identifier' })
  @IsString()
  @IsOptional()
  conversionGoal?: string;

  @ApiPropertyOptional({ description: 'Thank you page URL after conversion' })
  @IsString()
  @IsOptional()
  thankYouUrl?: string;

  @ApiPropertyOptional({ description: 'Form field configuration' })
  @IsObject()
  @IsOptional()
  formFields?: Record<string, any>;
}

export class UpdateLandingPageDto extends PartialType(CreateLandingPageDto) {
  @ApiPropertyOptional({ enum: LandingPageStatus })
  @IsEnum(LandingPageStatus)
  @IsOptional()
  status?: LandingPageStatus;
}

export class CreateVariantDto {
  @ApiProperty({ description: 'Variant name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unique variant code (e.g., A, B, control)' })
  @IsString()
  variantCode: string;

  @ApiProperty({ description: 'Changes from the original landing page' })
  @IsObject()
  changes: Record<string, any>;

  @ApiPropertyOptional({ description: 'Is this the control variant?' })
  @IsOptional()
  isControl?: boolean;
}

export class LandingPageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: LandingPageStatus })
  status: LandingPageStatus;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  headline?: string;

  @ApiPropertyOptional()
  subheadline?: string;

  @ApiPropertyOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional()
  template?: string;

  @ApiProperty()
  views: number;

  @ApiProperty()
  uniqueViews: number;

  @ApiProperty()
  conversions: number;

  @ApiPropertyOptional()
  bounceRate?: number;

  @ApiPropertyOptional()
  avgTimeOnPage?: number;

  @ApiPropertyOptional()
  publishedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class VariantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  landingPageId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  variantCode: string;

  @ApiProperty()
  changes: Record<string, any>;

  @ApiProperty()
  views: number;

  @ApiProperty()
  conversions: number;

  @ApiPropertyOptional()
  conversionRate?: number;

  @ApiProperty()
  isControl: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class CroSuggestionDto {
  @ApiProperty({ description: 'Suggestion category' })
  category: string;

  @ApiProperty({ description: 'Priority level (high, medium, low)' })
  priority: string;

  @ApiProperty({ description: 'Suggestion title' })
  title: string;

  @ApiProperty({ description: 'Detailed description' })
  description: string;

  @ApiProperty({ description: 'Expected impact' })
  expectedImpact: string;

  @ApiPropertyOptional({ description: 'Implementation effort' })
  effort?: string;
}
