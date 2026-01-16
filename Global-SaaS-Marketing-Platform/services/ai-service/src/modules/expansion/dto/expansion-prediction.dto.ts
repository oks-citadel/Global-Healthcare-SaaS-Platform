import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export class ExpansionPredictionRequestDto {
  @ApiProperty({ description: 'Customer identifier', format: 'uuid' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Current monthly recurring revenue', minimum: 0 })
  @IsNumber()
  @Min(0)
  currentMrr: number;

  @ApiProperty({ description: 'Usage growth percentage' })
  @IsNumber()
  usageGrowth: number;

  @ApiProperty({ description: 'Feature requests in last 90 days', minimum: 0 })
  @IsNumber()
  @Min(0)
  featureRequests: number;

  @ApiProperty({ description: 'Number of active users', minimum: 1 })
  @IsNumber()
  @Min(1)
  teamSize: number;

  @ApiProperty({ description: 'Product fit score', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  productFit: number;

  @ApiProperty({
    description: 'Stakeholder engagement score',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  stakeholderEngagement: number;

  @ApiProperty({ description: 'Previous successful upsells', minimum: 0 })
  @IsNumber()
  @Min(0)
  upsellHistory: number;

  @ApiProperty({ description: 'Industry growth rate percentage' })
  @IsNumber()
  industryGrowth: number;

  @ApiPropertyOptional({ description: 'Custom attributes for prediction' })
  @IsObject()
  @IsOptional()
  customAttributes?: Record<string, unknown>;
}

export class ExpansionOpportunity {
  @ApiProperty({ description: 'Opportunity type' })
  type: string;

  @ApiProperty({ description: 'Product or feature name' })
  product: string;

  @ApiProperty({ description: 'Opportunity description' })
  description: string;

  @ApiProperty({ description: 'Fit score (0-100)' })
  fitScore: number;

  @ApiProperty({ description: 'Potential revenue increase' })
  potentialRevenue: number;

  @ApiProperty({ description: 'Recommended approach' })
  approach: string;
}

export class ExpansionPredictionResponseDto {
  @ApiProperty({ description: 'Unique prediction identifier' })
  id: string;

  @ApiProperty({ description: 'Customer identifier' })
  customerId: string;

  @ApiProperty({ description: 'Expansion probability (0-1)' })
  expansionProbability: number;

  @ApiProperty({ description: 'Predicted additional revenue' })
  predictedRevenue: number;

  @ApiProperty({ description: 'Confidence score (0-1)' })
  confidence: number;

  @ApiProperty({
    description: 'Readiness level',
    enum: ['not_ready', 'early', 'ready', 'urgent'],
  })
  readinessLevel: string;

  @ApiProperty({
    description: 'Expansion opportunities',
    type: [ExpansionOpportunity],
  })
  opportunities: ExpansionOpportunity[];

  @ApiProperty({ description: 'Positive signals', type: [String] })
  signals: string[];

  @ApiProperty({ description: 'Recommended actions', type: [String] })
  recommendations: string[];

  @ApiProperty({ description: 'Optimal timing for outreach' })
  optimalTiming: string;

  @ApiProperty({ description: 'Model version used' })
  modelVersion: string;

  @ApiProperty({ description: 'Prediction timestamp' })
  predictedAt: Date;
}

export class BatchExpansionRequestDto {
  @ApiProperty({
    type: [ExpansionPredictionRequestDto],
    description: 'Array of customers to analyze',
  })
  customers: ExpansionPredictionRequestDto[];
}

export class ExpansionSummaryStats {
  @ApiProperty({ description: 'Total customers analyzed' })
  totalAnalyzed: number;

  @ApiProperty({ description: 'Ready for expansion count' })
  readyCount: number;

  @ApiProperty({ description: 'Total potential revenue' })
  totalPotentialRevenue: number;

  @ApiProperty({ description: 'Average expansion probability' })
  averageProbability: number;
}

export class BatchExpansionResponseDto {
  @ApiProperty({
    type: [ExpansionPredictionResponseDto],
    description: 'Expansion predictions',
  })
  results: ExpansionPredictionResponseDto[];

  @ApiProperty({ description: 'Summary statistics' })
  summary: ExpansionSummaryStats;

  @ApiProperty({ description: 'Processing time in milliseconds' })
  processingTimeMs: number;
}
