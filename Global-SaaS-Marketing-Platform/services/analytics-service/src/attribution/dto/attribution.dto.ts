import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Attribution Query DTOs
export class AttributionQueryDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Attribution model',
    enum: ['first_touch', 'last_touch', 'linear', 'time_decay', 'position_based', 'data_driven'],
    default: 'linear',
  })
  @IsEnum(['first_touch', 'last_touch', 'linear', 'time_decay', 'position_based', 'data_driven'])
  model: string;

  @ApiProperty({ description: 'Conversion event type' })
  @IsNotEmpty()
  @IsString()
  conversionEvent: string;

  @ApiPropertyOptional({ description: 'Touchpoint event types to include' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  touchpointEvents?: string[];

  @ApiPropertyOptional({ description: 'Lookback window in days', default: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(90)
  lookbackWindow?: number;

  @ApiPropertyOptional({ description: 'Group by channel' })
  @IsOptional()
  @IsBoolean()
  groupByChannel?: boolean;

  @ApiPropertyOptional({ description: 'Group by campaign' })
  @IsOptional()
  @IsBoolean()
  groupByCampaign?: boolean;
}

// Attribution Model DTOs
export class AttributionModelDto {
  @ApiProperty({ description: 'Model ID' })
  id: string;

  @ApiProperty({ description: 'Model name' })
  name: string;

  @ApiProperty({ description: 'Model description' })
  description: string;

  @ApiProperty({
    description: 'Model type',
    enum: ['first_touch', 'last_touch', 'linear', 'time_decay', 'position_based', 'data_driven'],
  })
  type: string;

  @ApiPropertyOptional({ description: 'Model configuration' })
  config?: Record<string, any>;
}

export class TouchpointAttributionDto {
  @ApiProperty({ description: 'Channel or touchpoint name' })
  channel: string;

  @ApiPropertyOptional({ description: 'Campaign name' })
  campaign?: string;

  @ApiProperty({ description: 'Number of conversions attributed' })
  conversions: number;

  @ApiProperty({ description: 'Attributed revenue/value' })
  attributedValue: number;

  @ApiProperty({ description: 'Percentage of total conversions' })
  percentage: number;

  @ApiProperty({ description: 'Average time to convert in seconds' })
  avgTimeToConvert: number;
}

export class AttributionResultDto {
  @ApiProperty({ type: AttributionModelDto })
  model: AttributionModelDto;

  @ApiProperty({ type: [TouchpointAttributionDto] })
  touchpoints: TouchpointAttributionDto[];

  @ApiProperty({ description: 'Total conversions' })
  totalConversions: number;

  @ApiProperty({ description: 'Total attributed value' })
  totalValue: number;
}

// Journey DTOs
export class JourneyQueryDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Specific user ID to analyze' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by conversion status' })
  @IsOptional()
  @IsBoolean()
  convertedOnly?: boolean;

  @ApiPropertyOptional({ description: 'Maximum number of journeys to return', default: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit?: number;

  @ApiPropertyOptional({ description: 'Minimum touchpoints in journey' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minTouchpoints?: number;
}

export class JourneyTouchpointDto {
  @ApiProperty({ description: 'Touchpoint timestamp' })
  timestamp: string;

  @ApiProperty({ description: 'Channel' })
  channel: string;

  @ApiProperty({ description: 'Event type' })
  eventType: string;

  @ApiPropertyOptional({ description: 'Additional properties' })
  properties?: Record<string, any>;
}

export class CustomerJourneyDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Journey ID' })
  journeyId: string;

  @ApiProperty({ description: 'Journey start date' })
  startDate: string;

  @ApiPropertyOptional({ description: 'Journey end date (conversion date)' })
  endDate?: string;

  @ApiProperty({ description: 'Whether user converted' })
  isConverted: boolean;

  @ApiPropertyOptional({ description: 'Conversion value' })
  conversionValue?: number;

  @ApiProperty({ type: [JourneyTouchpointDto] })
  touchpoints: JourneyTouchpointDto[];

  @ApiProperty({ description: 'Journey duration in seconds' })
  duration: number;

  @ApiProperty({ description: 'Total touchpoint count' })
  touchpointCount: number;
}

export class JourneyResultDto {
  @ApiProperty({ type: [CustomerJourneyDto] })
  journeys: CustomerJourneyDto[];

  @ApiProperty({ description: 'Total journeys analyzed' })
  totalJourneys: number;

  @ApiProperty({ description: 'Average journey duration in seconds' })
  avgDuration: number;

  @ApiProperty({ description: 'Average touchpoints per journey' })
  avgTouchpoints: number;

  @ApiProperty({ description: 'Overall conversion rate' })
  conversionRate: number;
}

// Touchpoint Analysis DTOs
export class TouchpointQueryDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Conversion event type' })
  @IsOptional()
  @IsString()
  conversionEvent?: string;

  @ApiPropertyOptional({ description: 'Group touchpoints by' })
  @IsOptional()
  @IsEnum(['channel', 'campaign', 'source', 'medium'])
  groupBy?: string;
}

export class TouchpointAnalysisDto {
  @ApiProperty({ description: 'Channel/touchpoint name' })
  channel: string;

  @ApiProperty({ description: 'Total touchpoints' })
  totalTouchpoints: number;

  @ApiProperty({ description: 'Unique users' })
  uniqueUsers: number;

  @ApiProperty({ description: 'As first touch count' })
  asFirstTouch: number;

  @ApiProperty({ description: 'As last touch count' })
  asLastTouch: number;

  @ApiProperty({ description: 'As middle touch count' })
  asMiddleTouch: number;

  @ApiProperty({ description: 'Average position in journey' })
  avgPosition: number;

  @ApiProperty({ description: 'Conversion rate when present in journey' })
  conversionRate: number;
}

export class TouchpointResultDto {
  @ApiProperty({ type: [TouchpointAnalysisDto] })
  touchpoints: TouchpointAnalysisDto[];

  @ApiProperty({ description: 'Total touchpoints analyzed' })
  totalTouchpoints: number;

  @ApiProperty({ description: 'Total unique users' })
  totalUniqueUsers: number;

  @ApiProperty({ description: 'Most common first touch' })
  topFirstTouch: string;

  @ApiProperty({ description: 'Most common last touch' })
  topLastTouch: string;
}
