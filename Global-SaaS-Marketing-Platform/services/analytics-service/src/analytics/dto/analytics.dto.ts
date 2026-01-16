import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// Common query parameters
export class DateRangeDto {
  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Timezone (e.g., America/New_York)' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ enum: ['hour', 'day', 'week', 'month'] })
  @IsOptional()
  @IsEnum(['hour', 'day', 'week', 'month'])
  granularity?: string;
}

export class BaseAnalyticsQueryDto extends DateRangeDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiPropertyOptional({ description: 'Project ID filter' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Segment filter' })
  @IsOptional()
  @IsString()
  segment?: string;
}

// Funnel DTOs
export class FunnelStepDto {
  @ApiProperty({ description: 'Step name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Event type for this step' })
  @IsNotEmpty()
  @IsString()
  eventType: string;

  @ApiPropertyOptional({ description: 'Additional filters for this step' })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}

export class FunnelQueryDto extends BaseAnalyticsQueryDto {
  @ApiProperty({ description: 'Funnel steps', type: [FunnelStepDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => FunnelStepDto)
  steps: FunnelStepDto[];

  @ApiPropertyOptional({ description: 'Conversion window in days', default: 7 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(90)
  conversionWindow?: number;

  @ApiPropertyOptional({ description: 'Whether to require steps in order', default: true })
  @IsOptional()
  strictOrder?: boolean;
}

export class FunnelStepResultDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  eventType: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  dropoffRate: number;
}

export class FunnelResultDto {
  @ApiProperty({ type: [FunnelStepResultDto] })
  steps: FunnelStepResultDto[];

  @ApiProperty()
  overallConversionRate: number;

  @ApiProperty()
  totalStarted: number;

  @ApiProperty()
  totalCompleted: number;

  @ApiProperty({ description: 'Average time to convert in seconds' })
  averageTimeToConvert: number;
}

// Cohort DTOs
export class CohortDefinitionDto {
  @ApiProperty({ description: 'Cohort name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['first_event', 'property', 'date_range'] })
  @IsEnum(['first_event', 'property', 'date_range'])
  type: string;

  @ApiPropertyOptional({ description: 'Event type for first_event cohort' })
  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiPropertyOptional({ description: 'Property name for property cohort' })
  @IsOptional()
  @IsString()
  property?: string;

  @ApiPropertyOptional({ description: 'Property value for property cohort' })
  @IsOptional()
  propertyValue?: any;

  @ApiPropertyOptional({ description: 'Date range for date_range cohort' })
  @IsOptional()
  @IsObject()
  dateRange?: { start: string; end: string };
}

export class CohortQueryDto extends BaseAnalyticsQueryDto {
  @ApiProperty({ type: CohortDefinitionDto })
  @ValidateNested()
  @Type(() => CohortDefinitionDto)
  cohort: CohortDefinitionDto;

  @ApiPropertyOptional({ description: 'Number of periods to analyze', default: 12 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(52)
  periods?: number;

  @ApiPropertyOptional({ enum: ['day', 'week', 'month'], default: 'week' })
  @IsOptional()
  @IsEnum(['day', 'week', 'month'])
  periodType?: string;

  @ApiPropertyOptional({ description: 'Event type for retention measurement' })
  @IsOptional()
  @IsString()
  retentionEvent?: string;
}

export class CohortPeriodDto {
  @ApiProperty()
  period: number;

  @ApiProperty()
  activeUsers: number;

  @ApiProperty()
  retentionRate: number;
}

export class CohortResultDto {
  @ApiProperty({ type: CohortDefinitionDto })
  cohort: CohortDefinitionDto;

  @ApiProperty()
  size: number;

  @ApiProperty({ type: [CohortPeriodDto] })
  periods: CohortPeriodDto[];

  @ApiProperty()
  averageRetention: number;
}

// Retention DTOs
export class RetentionQueryDto extends BaseAnalyticsQueryDto {
  @ApiPropertyOptional({ description: 'Number of days for retention curve', default: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number;

  @ApiPropertyOptional({ description: 'Event type that defines a new user' })
  @IsOptional()
  @IsString()
  acquisitionEvent?: string;

  @ApiPropertyOptional({ description: 'Event type that defines an active user' })
  @IsOptional()
  @IsString()
  retentionEvent?: string;
}

export class RetentionDayDto {
  @ApiProperty()
  day: number;

  @ApiProperty()
  activeUsers: number;

  @ApiProperty()
  retentionRate: number;
}

export class RetentionCurveDto {
  @ApiProperty()
  cohortDate: string;

  @ApiProperty()
  cohortSize: number;

  @ApiProperty({ type: [RetentionDayDto] })
  retention: RetentionDayDto[];
}

export class RetentionResultDto {
  @ApiProperty({ type: [RetentionCurveDto] })
  curves: RetentionCurveDto[];

  @ApiProperty()
  averageDay1Retention: number;

  @ApiProperty()
  averageDay7Retention: number;

  @ApiProperty()
  averageDay30Retention: number;
}

// LTV DTOs
export class LtvQueryDto extends BaseAnalyticsQueryDto {
  @ApiPropertyOptional({ description: 'Revenue event type', default: 'purchase' })
  @IsOptional()
  @IsString()
  revenueEvent?: string;

  @ApiPropertyOptional({ description: 'Revenue property in event', default: 'revenue' })
  @IsOptional()
  @IsString()
  revenueProperty?: string;

  @ApiPropertyOptional({ description: 'Project LTV for this many months', default: 12 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  projectionMonths?: number;
}

export class LtvCohortDto {
  @ApiProperty()
  cohortMonth: string;

  @ApiProperty()
  customerCount: number;

  @ApiProperty()
  averageLTV: number;

  @ApiProperty()
  medianLTV: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  averagePurchases: number;

  @ApiProperty()
  averageLifespanDays: number;

  @ApiPropertyOptional()
  projectedLTV?: number;
}

export class LtvResultDto {
  @ApiProperty({ type: [LtvCohortDto] })
  cohorts: LtvCohortDto[];

  @ApiProperty()
  overallAverageLTV: number;

  @ApiProperty()
  overallMedianLTV: number;

  @ApiProperty()
  totalCustomers: number;

  @ApiProperty()
  totalRevenue: number;
}

// Churn DTOs
export class ChurnQueryDto extends BaseAnalyticsQueryDto {
  @ApiPropertyOptional({ enum: ['day', 'week', 'month'], default: 'month' })
  @IsOptional()
  @IsEnum(['day', 'week', 'month'])
  period?: string;

  @ApiPropertyOptional({ description: 'Days of inactivity to consider churned', default: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  churnThresholdDays?: number;

  @ApiPropertyOptional({ description: 'Event type that defines activity' })
  @IsOptional()
  @IsString()
  activityEvent?: string;
}

export class ChurnPeriodDto {
  @ApiProperty()
  period: string;

  @ApiProperty()
  activeUsers: number;

  @ApiProperty()
  churnedUsers: number;

  @ApiProperty()
  churnRate: number;

  @ApiProperty()
  retainedUsers: number;

  @ApiProperty()
  retentionRate: number;

  @ApiProperty()
  newUsers: number;

  @ApiProperty()
  netGrowth: number;
}

export class ChurnResultDto {
  @ApiProperty({ type: [ChurnPeriodDto] })
  periods: ChurnPeriodDto[];

  @ApiProperty()
  averageChurnRate: number;

  @ApiProperty()
  averageRetentionRate: number;

  @ApiProperty()
  totalChurned: number;

  @ApiProperty()
  currentActiveUsers: number;
}

// Session DTOs
export class SessionQueryDto extends BaseAnalyticsQueryDto {
  @ApiPropertyOptional({ description: 'Session timeout in minutes', default: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(120)
  sessionTimeout?: number;
}

export class SessionDayDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  totalSessions: number;

  @ApiProperty()
  uniqueUsers: number;

  @ApiProperty()
  avgSessionDuration: number;

  @ApiProperty()
  medianSessionDuration: number;

  @ApiProperty()
  avgEventsPerSession: number;

  @ApiProperty()
  bounceRate: number;

  @ApiProperty()
  avgPagesPerSession: number;
}

export class SessionResultDto {
  @ApiProperty({ type: [SessionDayDto] })
  data: SessionDayDto[];

  @ApiProperty()
  totalSessions: number;

  @ApiProperty()
  totalUniqueUsers: number;

  @ApiProperty()
  overallAvgSessionDuration: number;

  @ApiProperty()
  overallBounceRate: number;
}
