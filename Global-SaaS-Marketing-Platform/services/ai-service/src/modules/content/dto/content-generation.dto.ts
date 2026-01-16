import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';

export class BrandDto {
  @ApiPropertyOptional({ description: 'Brand name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Brand voice description' })
  @IsString()
  @IsOptional()
  voice?: string;

  @ApiPropertyOptional({ description: 'Brand guidelines' })
  @IsString()
  @IsOptional()
  guidelines?: string;
}

export class ContentGenerationRequestDto {
  @ApiProperty({
    description: 'Content type',
    enum: [
      'blog_post',
      'email',
      'social_post',
      'ad_copy',
      'landing_page',
      'product_description',
      'meta_description',
      'headline',
    ],
  })
  @IsEnum([
    'blog_post',
    'email',
    'social_post',
    'ad_copy',
    'landing_page',
    'product_description',
    'meta_description',
    'headline',
  ])
  contentType: string;

  @ApiProperty({ description: 'Topic or subject' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  topic: string;

  @ApiPropertyOptional({
    description: 'Writing tone',
    enum: [
      'professional',
      'casual',
      'friendly',
      'authoritative',
      'persuasive',
      'informative',
    ],
    default: 'professional',
  })
  @IsEnum([
    'professional',
    'casual',
    'friendly',
    'authoritative',
    'persuasive',
    'informative',
  ])
  @IsOptional()
  tone?: string = 'professional';

  @ApiPropertyOptional({ description: 'Target audience description' })
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Keywords to include', type: [String] })
  @IsArray()
  @IsOptional()
  keywords?: string[];

  @ApiPropertyOptional({
    description: 'Content length',
    enum: ['short', 'medium', 'long'],
    default: 'medium',
  })
  @IsEnum(['short', 'medium', 'long'])
  @IsOptional()
  length?: string = 'medium';

  @ApiPropertyOptional({ description: 'Additional context or requirements' })
  @IsString()
  @IsOptional()
  additionalContext?: string;

  @ApiPropertyOptional({ description: 'Brand information' })
  @IsObject()
  @IsOptional()
  brand?: BrandDto;
}

export class ContentGenerationResponseDto {
  @ApiProperty({ description: 'Generated content identifier' })
  id: string;

  @ApiProperty({ description: 'Content type' })
  contentType: string;

  @ApiProperty({ description: 'Generated content' })
  generatedContent: string;

  @ApiProperty({ description: 'Alternative variations', type: [String] })
  variations: string[];

  @ApiProperty({ description: 'Suggested headlines', type: [String] })
  headlines: string[];

  @ApiProperty({ description: 'Meta description' })
  metaDescription: string;

  @ApiProperty({ description: 'Keyword usage' })
  keywordUsage: Record<string, number>;

  @ApiProperty({ description: 'Readability score (0-100)' })
  readabilityScore: number;

  @ApiProperty({ description: 'Word count' })
  wordCount: number;

  @ApiProperty({ description: 'Estimated reading time in minutes' })
  readingTime: number;

  @ApiProperty({ description: 'AI model used' })
  modelUsed: string;

  @ApiProperty({ description: 'Tokens consumed' })
  tokensUsed: number;

  @ApiProperty({ description: 'Generation timestamp' })
  generatedAt: Date;
}

export class ContentOptimizationRequestDto {
  @ApiProperty({ description: 'Original content to optimize' })
  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  content: string;

  @ApiProperty({
    description: 'Optimization type',
    enum: ['seo', 'readability', 'engagement', 'conversion', 'tone', 'grammar'],
  })
  @IsEnum(['seo', 'readability', 'engagement', 'conversion', 'tone', 'grammar'])
  optimizationType: string;

  @ApiPropertyOptional({ description: 'Target keywords for SEO optimization', type: [String] })
  @IsArray()
  @IsOptional()
  targetKeywords?: string[];

  @ApiPropertyOptional({
    description: 'Target tone for tone optimization',
    enum: [
      'professional',
      'casual',
      'friendly',
      'authoritative',
      'persuasive',
      'informative',
    ],
  })
  @IsEnum([
    'professional',
    'casual',
    'friendly',
    'authoritative',
    'persuasive',
    'informative',
  ])
  @IsOptional()
  targetTone?: string;

  @ApiPropertyOptional({
    description: 'Target reading level',
    enum: ['elementary', 'middle_school', 'high_school', 'college', 'professional'],
  })
  @IsEnum(['elementary', 'middle_school', 'high_school', 'college', 'professional'])
  @IsOptional()
  targetReadingLevel?: string;

  @ApiPropertyOptional({
    description: 'Preserve approximate content length',
    default: false,
  })
  @IsOptional()
  preserveLength?: boolean = false;
}

export class ContentImprovementDto {
  @ApiProperty({ description: 'Improvement type' })
  type: string;

  @ApiProperty({ description: 'Original text' })
  original: string;

  @ApiProperty({ description: 'Improved text' })
  improved: string;

  @ApiProperty({ description: 'Reason for improvement' })
  reason: string;
}

export class ContentOptimizationResponseDto {
  @ApiProperty({ description: 'Optimization identifier' })
  id: string;

  @ApiProperty({ description: 'Optimized content' })
  optimizedContent: string;

  @ApiProperty({ description: 'List of improvements made', type: [ContentImprovementDto] })
  improvements: ContentImprovementDto[];

  @ApiProperty({ description: 'Before/after comparison' })
  comparison: {
    originalWordCount: number;
    optimizedWordCount: number;
    originalReadabilityScore: number;
    optimizedReadabilityScore: number;
    originalSeoScore: number;
    optimizedSeoScore: number;
  };

  @ApiProperty({ description: 'Readability score (0-100)' })
  readabilityScore: number;

  @ApiProperty({ description: 'SEO score (0-100)' })
  seoScore: number;

  @ApiProperty({ description: 'Suggestions for further improvement', type: [String] })
  suggestions: string[];

  @ApiProperty({ description: 'Model used' })
  modelUsed: string;

  @ApiProperty({ description: 'Optimization timestamp' })
  optimizedAt: Date;
}
