import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  IsObject,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TargetAudienceDto {
  @ApiProperty({ description: 'Audience size', minimum: 0 })
  @IsNumber()
  @Min(0)
  size: number;

  @ApiProperty({ description: 'Target segments', type: [String] })
  @IsArray()
  segments: string[];

  @ApiPropertyOptional({ description: 'Demographics data' })
  @IsObject()
  @IsOptional()
  demographics?: Record<string, unknown>;
}

export class HistoricalDataDto {
  @ApiPropertyOptional({ description: 'Number of previous campaigns' })
  @IsNumber()
  @IsOptional()
  previousCampaigns?: number;

  @ApiPropertyOptional({ description: 'Average click-through rate' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  averageCtr?: number;

  @ApiPropertyOptional({ description: 'Average conversion rate' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  averageConversionRate?: number;
}

export class CampaignForecastRequestDto {
  @ApiProperty({ description: 'Campaign identifier', format: 'uuid' })
  @IsUUID()
  campaignId: string;

  @ApiProperty({
    description: 'Campaign type',
    enum: ['email', 'social', 'ppc', 'content', 'webinar', 'event'],
  })
  @IsEnum(['email', 'social', 'ppc', 'content', 'webinar', 'event'])
  campaignType: string;

  @ApiProperty({ description: 'Campaign budget', minimum: 0 })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({ description: 'Target audience' })
  @ValidateNested()
  @Type(() => TargetAudienceDto)
  targetAudience: TargetAudienceDto;

  @ApiProperty({ description: 'Campaign duration in days', minimum: 1 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Marketing channels', type: [String] })
  @IsArray()
  channels: string[];

  @ApiPropertyOptional({ description: 'Historical campaign data' })
  @ValidateNested()
  @Type(() => HistoricalDataDto)
  @IsOptional()
  historicalData?: HistoricalDataDto;

  @ApiPropertyOptional({ description: 'Custom attributes' })
  @IsObject()
  @IsOptional()
  customAttributes?: Record<string, unknown>;
}

export class ConfidenceIntervalDto {
  @ApiProperty({ description: 'Lower bound' })
  low: number;

  @ApiProperty({ description: 'Expected value' })
  expected: number;

  @ApiProperty({ description: 'Upper bound' })
  high: number;
}

export class CampaignForecastResponseDto {
  @ApiProperty({ description: 'Unique forecast identifier' })
  id: string;

  @ApiProperty({ description: 'Campaign identifier' })
  campaignId: string;

  @ApiProperty({ description: 'Forecasted reach' })
  forecastedReach: number;

  @ApiProperty({ description: 'Forecasted clicks' })
  forecastedClicks: number;

  @ApiProperty({ description: 'Forecasted conversions' })
  forecastedConversions: number;

  @ApiProperty({ description: 'Forecasted revenue' })
  forecastedRevenue: number;

  @ApiProperty({ description: 'Forecasted ROI percentage' })
  forecastedROI: number;

  @ApiProperty({ description: 'Forecasted cost per acquisition' })
  forecastedCPA: number;

  @ApiProperty({ description: 'Confidence intervals' })
  confidenceIntervals: {
    reach: ConfidenceIntervalDto;
    conversions: ConfidenceIntervalDto;
    revenue: ConfidenceIntervalDto;
  };

  @ApiProperty({ description: 'Key assumptions', type: [String] })
  assumptions: string[];

  @ApiProperty({ description: 'Risk factors', type: [String] })
  riskFactors: string[];

  @ApiProperty({ description: 'Optimization suggestions', type: [String] })
  suggestions: string[];

  @ApiProperty({ description: 'Model version' })
  modelVersion: string;

  @ApiProperty({ description: 'Forecast timestamp' })
  forecastedAt: Date;
}

export class CampaignScenarioDto {
  @ApiProperty({ description: 'Scenario name' })
  name: string;

  @ApiProperty({ description: 'Budget multiplier' })
  budgetMultiplier: number;

  @ApiProperty({ description: 'Forecasted metrics' })
  forecast: {
    reach: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
}

export class CampaignScenariosResponseDto {
  @ApiProperty({ description: 'Campaign identifier' })
  campaignId: string;

  @ApiProperty({ description: 'Base forecast' })
  baseForecast: CampaignForecastResponseDto;

  @ApiProperty({ description: 'Alternative scenarios', type: [CampaignScenarioDto] })
  scenarios: CampaignScenarioDto[];

  @ApiProperty({ description: 'Recommended scenario' })
  recommendedScenario: string;
}
