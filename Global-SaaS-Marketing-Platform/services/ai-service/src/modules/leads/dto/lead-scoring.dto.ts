import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class LeadScoringRequestDto {
  @ApiProperty({ description: 'Unique lead identifier', format: 'uuid' })
  @IsUUID()
  leadId: string;

  @ApiProperty({
    description: 'Company size range',
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
  })
  @IsEnum(['1-10', '11-50', '51-200', '201-1000', '1000+'])
  companySize: string;

  @ApiProperty({ description: 'Industry vertical' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  industry: string;

  @ApiProperty({ description: 'Engagement score (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  engagementScore: number;

  @ApiProperty({ description: 'Number of website visits', minimum: 0 })
  @IsNumber()
  @Min(0)
  websiteVisits: number;

  @ApiProperty({ description: 'Number of email opens', minimum: 0 })
  @IsNumber()
  @Min(0)
  emailOpens: number;

  @ApiProperty({ description: 'Number of downloaded assets', minimum: 0 })
  @IsNumber()
  @Min(0)
  downloadedAssets: number;

  @ApiProperty({ description: 'Whether demo was requested' })
  @IsBoolean()
  demoRequested: boolean;

  @ApiProperty({
    description: 'Budget range',
    enum: ['<$1k', '$1k-$5k', '$5k-$25k', '$25k-$100k', '$100k+'],
  })
  @IsEnum(['<$1k', '$1k-$5k', '$5k-$25k', '$25k-$100k', '$100k+'])
  budgetRange: string;

  @ApiProperty({
    description: 'Decision timeframe',
    enum: ['immediate', '1-3 months', '3-6 months', '6-12 months', 'no timeline'],
  })
  @IsEnum(['immediate', '1-3 months', '3-6 months', '6-12 months', 'no timeline'])
  decisionTimeframe: string;

  @ApiPropertyOptional({ description: 'Number of competitor mentions', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  competitorMentions?: number = 0;

  @ApiPropertyOptional({ description: 'Custom attributes for scoring' })
  @IsObject()
  @IsOptional()
  customAttributes?: Record<string, unknown>;
}

export class LeadScoringResponseDto {
  @ApiProperty({ description: 'Unique score identifier' })
  id: string;

  @ApiProperty({ description: 'Lead identifier' })
  leadId: string;

  @ApiProperty({ description: 'Calculated lead score (0-100)' })
  score: number;

  @ApiProperty({ description: 'Confidence level of the prediction (0-1)' })
  confidence: number;

  @ApiProperty({
    description: 'Score category',
    enum: ['cold', 'warm', 'hot', 'qualified'],
  })
  category: string;

  @ApiProperty({ description: 'Contributing factors to the score', type: [String] })
  factors: string[];

  @ApiProperty({ description: 'Recommended next actions', type: [String] })
  recommendedActions: string[];

  @ApiProperty({ description: 'Model version used for prediction' })
  modelVersion: string;

  @ApiProperty({ description: 'Timestamp of prediction' })
  predictedAt: Date;
}

export class BatchLeadScoringRequestDto {
  @ApiProperty({ type: [LeadScoringRequestDto], description: 'Array of leads to score' })
  leads: LeadScoringRequestDto[];
}

export class BatchLeadScoringResponseDto {
  @ApiProperty({ type: [LeadScoringResponseDto], description: 'Scored leads' })
  results: LeadScoringResponseDto[];

  @ApiProperty({ description: 'Total number of leads processed' })
  totalProcessed: number;

  @ApiProperty({ description: 'Processing time in milliseconds' })
  processingTimeMs: number;
}
