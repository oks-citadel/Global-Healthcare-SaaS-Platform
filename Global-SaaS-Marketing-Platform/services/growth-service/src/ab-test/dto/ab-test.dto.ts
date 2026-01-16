import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ABTestStatus {
  DRAFT = 'DRAFT',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum ABTestType {
  SPLIT = 'SPLIT',
  MULTIVARIATE = 'MULTIVARIATE',
  BANDIT = 'BANDIT',
}

export class CreateABTestVariantDto {
  @ApiProperty({ description: 'Variant name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Landing page variant ID' })
  @IsUUID()
  @IsOptional()
  variantId?: string;

  @ApiProperty({ description: 'Traffic percentage for this variant (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  trafficPercentage: number;

  @ApiPropertyOptional({ description: 'Is this the control variant?' })
  @IsOptional()
  isControl?: boolean;
}

export class CreateABTestDto {
  @ApiProperty({ description: 'A/B test name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Landing page ID to test' })
  @IsUUID()
  @IsOptional()
  landingPageId?: string;

  @ApiPropertyOptional({ enum: ABTestType, default: ABTestType.SPLIT })
  @IsEnum(ABTestType)
  @IsOptional()
  type?: ABTestType;

  @ApiPropertyOptional({ description: 'Target sample size' })
  @IsNumber()
  @Min(10)
  @IsOptional()
  targetSampleSize?: number;

  @ApiPropertyOptional({ description: 'Confidence level (0-1)', default: 0.95 })
  @IsNumber()
  @Min(0.5)
  @Max(0.99)
  @IsOptional()
  confidenceLevel?: number;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'Test variants', type: [CreateABTestVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateABTestVariantDto)
  variants: CreateABTestVariantDto[];
}

export class ABTestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  landingPageId?: string;

  @ApiProperty({ enum: ABTestStatus })
  status: ABTestStatus;

  @ApiProperty({ enum: ABTestType })
  type: ABTestType;

  @ApiPropertyOptional()
  targetSampleSize?: number;

  @ApiProperty()
  confidenceLevel: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  winningVariantId?: string;

  @ApiPropertyOptional()
  statisticalSignificance?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  completedAt?: Date;
}

export class ABTestVariantResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  trafficPercentage: number;

  @ApiProperty()
  visitors: number;

  @ApiProperty()
  conversions: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  isControl: boolean;

  @ApiProperty()
  isWinner: boolean;

  @ApiPropertyOptional({ description: 'Improvement over control (%)' })
  improvement?: number;

  @ApiPropertyOptional({ description: 'Statistical significance' })
  significance?: number;
}

export class ABTestResultsDto {
  @ApiProperty()
  testId: string;

  @ApiProperty()
  testName: string;

  @ApiProperty({ enum: ABTestStatus })
  status: ABTestStatus;

  @ApiProperty()
  totalVisitors: number;

  @ApiProperty()
  totalConversions: number;

  @ApiProperty({ type: [ABTestVariantResultDto] })
  variants: ABTestVariantResultDto[];

  @ApiPropertyOptional()
  winningVariant?: ABTestVariantResultDto;

  @ApiProperty({ description: 'Is the result statistically significant?' })
  isSignificant: boolean;

  @ApiProperty({ description: 'Confidence level achieved' })
  confidenceLevel: number;

  @ApiPropertyOptional({ description: 'Recommendation based on results' })
  recommendation?: string;

  @ApiProperty()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Days running' })
  daysRunning: number;
}
