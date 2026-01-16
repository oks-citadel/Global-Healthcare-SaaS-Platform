import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class GrowthRecommendationQueryDto {
  @ApiPropertyOptional({
    description: 'Categories to filter by',
    enum: ['acquisition', 'activation', 'retention', 'revenue', 'referral'],
    isArray: true,
  })
  @IsArray()
  @IsEnum(['acquisition', 'activation', 'retention', 'revenue', 'referral'], {
    each: true,
  })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Minimum priority level',
    enum: ['low', 'medium', 'high', 'critical'],
  })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ description: 'Maximum results', default: 10 })
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Offset for pagination', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}

export class ActionItemDto {
  @ApiProperty({ description: 'Action description' })
  description: string;

  @ApiProperty({ description: 'Estimated time to complete' })
  estimatedTime: string;

  @ApiProperty({ description: 'Owner role' })
  owner: string;

  @ApiProperty({ description: 'Is action completed' })
  completed: boolean;
}

export class MetricDto {
  @ApiProperty({ description: 'Metric name' })
  name: string;

  @ApiProperty({ description: 'Current value' })
  currentValue: number;

  @ApiProperty({ description: 'Target value' })
  targetValue: number;

  @ApiProperty({ description: 'Unit of measurement' })
  unit: string;
}

export class GrowthRecommendationResponseDto {
  @ApiProperty({ description: 'Recommendation identifier' })
  id: string;

  @ApiProperty({
    description: 'Category',
    enum: ['acquisition', 'activation', 'retention', 'revenue', 'referral'],
  })
  category: string;

  @ApiProperty({ description: 'Recommendation title' })
  title: string;

  @ApiProperty({ description: 'Detailed description' })
  description: string;

  @ApiProperty({
    description: 'Expected impact level',
    enum: ['low', 'medium', 'high', 'transformational'],
  })
  impact: string;

  @ApiProperty({
    description: 'Implementation effort',
    enum: ['minimal', 'low', 'medium', 'high'],
  })
  effort: string;

  @ApiProperty({ description: 'Priority score (1-10)' })
  priority: number;

  @ApiProperty({ description: 'Related metrics', type: [MetricDto] })
  metrics: MetricDto[];

  @ApiProperty({ description: 'Action items', type: [ActionItemDto] })
  actionItems: ActionItemDto[];

  @ApiProperty({ description: 'Estimated ROI percentage' })
  estimatedROI: number;

  @ApiProperty({ description: 'Implementation timeline' })
  timeline: string;

  @ApiProperty({ description: 'Prerequisites', type: [String] })
  prerequisites: string[];

  @ApiProperty({
    description: 'Status',
    enum: ['pending', 'in_progress', 'completed', 'dismissed'],
  })
  status: string;

  @ApiProperty({ description: 'Generated timestamp' })
  generatedAt: Date;
}

export class GrowthRecommendationsListResponseDto {
  @ApiProperty({ type: [GrowthRecommendationResponseDto] })
  recommendations: GrowthRecommendationResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Summary by category' })
  categorySummary: Record<string, number>;

  @ApiProperty({ description: 'Total estimated impact' })
  totalEstimatedImpact: {
    revenueIncrease: number;
    costSavings: number;
    efficiencyGain: number;
  };
}

export class UpdateRecommendationStatusDto {
  @ApiProperty({
    description: 'New status',
    enum: ['pending', 'in_progress', 'completed', 'dismissed'],
  })
  @IsEnum(['pending', 'in_progress', 'completed', 'dismissed'])
  status: string;
}
