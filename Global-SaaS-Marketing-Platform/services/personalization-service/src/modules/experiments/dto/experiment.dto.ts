import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
  IsDate,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ExperimentStatus {
  DRAFT = 'DRAFT',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  CONCLUDED = 'CONCLUDED',
  ARCHIVED = 'ARCHIVED',
}

export enum ExperimentType {
  AB_TEST = 'AB_TEST',
  MULTIVARIATE = 'MULTIVARIATE',
  SPLIT_URL = 'SPLIT_URL',
  FEATURE_FLAG = 'FEATURE_FLAG',
}

export class ExperimentVariantDto {
  @ApiProperty({ description: 'Unique variant key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Variant name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Variant description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether this is the control variant', default: false })
  @IsBoolean()
  @IsOptional()
  isControl?: boolean;

  @ApiPropertyOptional({ description: 'Traffic weight (0-100)', default: 50 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Variant payload/configuration' })
  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;
}

export class CreateExperimentDto {
  @ApiProperty({ description: 'Unique experiment key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Experiment name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Experiment description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Experiment hypothesis' })
  @IsString()
  @IsOptional()
  hypothesis?: string;

  @ApiPropertyOptional({ description: 'Experiment type', enum: ExperimentType, default: ExperimentType.AB_TEST })
  @IsEnum(ExperimentType)
  @IsOptional()
  type?: ExperimentType;

  @ApiPropertyOptional({ description: 'Target segment keys' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetSegments?: string[];

  @ApiPropertyOptional({ description: 'Percentage of traffic to include (0-100)', default: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  trafficPercent?: number;

  @ApiPropertyOptional({ description: 'Experiment start date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Experiment end date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Experiment variants', type: [ExperimentVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperimentVariantDto)
  variants: ExperimentVariantDto[];
}

export class UpdateExperimentDto extends PartialType(CreateExperimentDto) {
  @ApiPropertyOptional({ description: 'Experiment status', enum: ExperimentStatus })
  @IsEnum(ExperimentStatus)
  @IsOptional()
  status?: ExperimentStatus;
}

export class VariantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isControl: boolean;

  @ApiProperty()
  weight: number;

  @ApiPropertyOptional()
  payload?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ExperimentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  hypothesis?: string;

  @ApiProperty({ enum: ExperimentStatus })
  status: ExperimentStatus;

  @ApiProperty({ enum: ExperimentType })
  type: ExperimentType;

  @ApiProperty()
  targetSegments: string[];

  @ApiProperty()
  trafficPercent: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty({ type: [VariantResponseDto] })
  variants: VariantResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AssignmentRequestDto {
  @ApiProperty({ description: 'Profile ID or external user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Additional context for assignment' })
  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

export class AssignmentResponseDto {
  @ApiProperty()
  experimentId: string;

  @ApiProperty()
  experimentKey: string;

  @ApiProperty()
  variantId: string;

  @ApiProperty()
  variantKey: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  payload?: Record<string, any>;

  @ApiProperty()
  assignedAt: Date;

  @ApiProperty()
  isNewAssignment: boolean;
}

export class ExperimentMetricDto {
  @ApiProperty({ description: 'Metric name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Metric value' })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({ description: 'Sample size for this metric' })
  @IsNumber()
  @IsOptional()
  sampleSize?: number;
}

export class VariantResultDto {
  @ApiProperty()
  variantKey: string;

  @ApiProperty()
  variantName: string;

  @ApiProperty()
  isControl: boolean;

  @ApiProperty()
  participants: number;

  @ApiProperty()
  conversions: number;

  @ApiProperty()
  conversionRate: number;

  @ApiPropertyOptional()
  improvement?: number;

  @ApiPropertyOptional()
  confidence?: number;

  @ApiProperty()
  metrics: Record<string, ExperimentMetricDto>;
}

export class ExperimentResultsDto {
  @ApiProperty()
  experimentId: string;

  @ApiProperty()
  experimentKey: string;

  @ApiProperty({ enum: ExperimentStatus })
  status: ExperimentStatus;

  @ApiProperty()
  totalParticipants: number;

  @ApiProperty({ type: [VariantResultDto] })
  variantResults: VariantResultDto[];

  @ApiPropertyOptional()
  winningVariant?: string;

  @ApiPropertyOptional()
  statisticalSignificance?: number;

  @ApiProperty()
  startDate: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty()
  lastUpdated: Date;
}

export class ConcludeExperimentDto {
  @ApiProperty({ description: 'Winning variant key' })
  @IsString()
  @IsNotEmpty()
  winningVariant: string;

  @ApiPropertyOptional({ description: 'Conclusion notes' })
  @IsString()
  @IsOptional()
  conclusion?: string;

  @ApiPropertyOptional({ description: 'Whether to apply winning variant to all users' })
  @IsBoolean()
  @IsOptional()
  applyToAll?: boolean;
}

export class ConcludeResponseDto {
  @ApiProperty()
  experimentId: string;

  @ApiProperty()
  experimentKey: string;

  @ApiProperty({ enum: ExperimentStatus })
  status: ExperimentStatus;

  @ApiProperty()
  winningVariant: string;

  @ApiPropertyOptional()
  conclusion?: string;

  @ApiProperty()
  concludedAt: Date;
}

export class ExperimentQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: ExperimentStatus })
  @IsEnum(ExperimentStatus)
  @IsOptional()
  status?: ExperimentStatus;

  @ApiPropertyOptional({ description: 'Filter by type', enum: ExperimentType })
  @IsEnum(ExperimentType)
  @IsOptional()
  type?: ExperimentType;

  @ApiPropertyOptional({ description: 'Search by name or key' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number = 20;
}

export class PaginatedExperimentsDto {
  @ApiProperty({ type: [ExperimentResponseDto] })
  items: ExperimentResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
