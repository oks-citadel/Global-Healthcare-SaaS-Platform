import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export class ChurnPredictionRequestDto {
  @ApiProperty({ description: 'Customer identifier', format: 'uuid' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Account age in months', minimum: 0 })
  @IsNumber()
  @Min(0)
  accountAge: number;

  @ApiProperty({ description: 'Monthly usage percentage', minimum: 0 })
  @IsNumber()
  @Min(0)
  monthlyUsage: number;

  @ApiProperty({ description: 'Support tickets in last 30 days', minimum: 0 })
  @IsNumber()
  @Min(0)
  supportTickets: number;

  @ApiProperty({ description: 'Feature adoption percentage', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  featureAdoption: number;

  @ApiProperty({ description: 'Days since last login', minimum: 0 })
  @IsNumber()
  @Min(0)
  lastLoginDays: number;

  @ApiProperty({ description: 'Payment issues in last 90 days', minimum: 0 })
  @IsNumber()
  @Min(0)
  paymentIssues: number;

  @ApiProperty({ description: 'Monthly contract value', minimum: 0 })
  @IsNumber()
  @Min(0)
  contractValue: number;

  @ApiPropertyOptional({ description: 'NPS score', minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  npsScore?: number;

  @ApiProperty({
    description: 'Engagement trend (-1 to 1, negative means declining)',
    minimum: -1,
    maximum: 1,
  })
  @IsNumber()
  @Min(-1)
  @Max(1)
  engagementTrend: number;

  @ApiPropertyOptional({ description: 'Custom attributes for prediction' })
  @IsObject()
  @IsOptional()
  customAttributes?: Record<string, unknown>;
}

export class ChurnPredictionResponseDto {
  @ApiProperty({ description: 'Unique prediction identifier' })
  id: string;

  @ApiProperty({ description: 'Customer identifier' })
  customerId: string;

  @ApiProperty({ description: 'Churn probability (0-1)' })
  churnProbability: number;

  @ApiProperty({
    description: 'Risk level',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  riskLevel: string;

  @ApiProperty({ description: 'Contributing factors', type: [String] })
  contributingFactors: string[];

  @ApiProperty({
    description: 'Recommended retention actions',
    type: 'object',
  })
  recommendedActions: ChurnRecommendedAction[];

  @ApiProperty({ description: 'Estimated revenue at risk' })
  revenueAtRisk: number;

  @ApiProperty({ description: 'Days until likely churn' })
  daysUntilLikelyChurn: number | null;

  @ApiProperty({ description: 'Model version used' })
  modelVersion: string;

  @ApiProperty({ description: 'Prediction timestamp' })
  predictedAt: Date;
}

export class ChurnRecommendedAction {
  @ApiProperty({ description: 'Action type' })
  type: string;

  @ApiProperty({ description: 'Action description' })
  description: string;

  @ApiProperty({ description: 'Priority (1-5)' })
  priority: number;

  @ApiProperty({ description: 'Expected impact' })
  expectedImpact: string;

  @ApiProperty({ description: 'Effort required' })
  effort: string;
}

export class BatchChurnPredictionRequestDto {
  @ApiProperty({
    type: [ChurnPredictionRequestDto],
    description: 'Array of customers to analyze',
  })
  customers: ChurnPredictionRequestDto[];
}

export class BatchChurnPredictionResponseDto {
  @ApiProperty({
    type: [ChurnPredictionResponseDto],
    description: 'Churn predictions',
  })
  results: ChurnPredictionResponseDto[];

  @ApiProperty({ description: 'Summary statistics' })
  summary: ChurnSummaryStats;

  @ApiProperty({ description: 'Processing time in milliseconds' })
  processingTimeMs: number;
}

export class ChurnSummaryStats {
  @ApiProperty({ description: 'Total customers analyzed' })
  totalAnalyzed: number;

  @ApiProperty({ description: 'High risk customers count' })
  highRiskCount: number;

  @ApiProperty({ description: 'Total revenue at risk' })
  totalRevenueAtRisk: number;

  @ApiProperty({ description: 'Average churn probability' })
  averageChurnProbability: number;
}
