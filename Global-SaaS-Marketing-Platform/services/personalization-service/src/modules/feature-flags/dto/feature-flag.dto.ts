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
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FlagType {
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  JSON = 'JSON',
}

export enum FlagStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class FlagTargetingRuleDto {
  @ApiProperty({ description: 'Field to evaluate' })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Operator',
    enum: ['equals', 'notEquals', 'contains', 'in', 'notIn', 'greaterThan', 'lessThan', 'exists'],
  })
  @IsString()
  operator: string;

  @ApiPropertyOptional({ description: 'Value to compare' })
  value?: any;
}

export class FlagTargetingDto {
  @ApiProperty({ description: 'Logical operator', enum: ['AND', 'OR'] })
  @IsString()
  operator: 'AND' | 'OR';

  @ApiProperty({ description: 'Targeting rules', type: [FlagTargetingRuleDto] })
  @IsArray()
  rules: FlagTargetingRuleDto[];

  @ApiProperty({ description: 'Value to return when targeting matches' })
  value: any;

  @ApiPropertyOptional({ description: 'Rollout percentage (0-100)', default: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  rolloutPercentage?: number;
}

export class CreateFeatureFlagDto {
  @ApiProperty({ description: 'Unique flag key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Flag name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Flag description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Flag type', enum: FlagType })
  @IsEnum(FlagType)
  type: FlagType;

  @ApiProperty({ description: 'Default value when flag is off or no rules match' })
  defaultValue: any;

  @ApiPropertyOptional({ description: 'Targeting rules', type: [FlagTargetingDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FlagTargetingDto)
  targeting?: FlagTargetingDto[];

  @ApiPropertyOptional({ description: 'Flag status', enum: FlagStatus, default: FlagStatus.INACTIVE })
  @IsEnum(FlagStatus)
  @IsOptional()
  status?: FlagStatus;

  @ApiPropertyOptional({ description: 'Environment (production, staging, development)' })
  @IsString()
  @IsOptional()
  environment?: string;

  @ApiPropertyOptional({ description: 'Tags for organization' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateFeatureFlagDto extends PartialType(CreateFeatureFlagDto) {}

export class FeatureFlagResponseDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: FlagType })
  type: FlagType;

  @ApiProperty()
  defaultValue: any;

  @ApiPropertyOptional({ type: [FlagTargetingDto] })
  targeting?: FlagTargetingDto[];

  @ApiProperty({ enum: FlagStatus })
  status: FlagStatus;

  @ApiPropertyOptional()
  environment?: string;

  @ApiProperty()
  tags: string[];

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class EvaluateFlagRequestDto {
  @ApiProperty({ description: 'User ID for evaluation context' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Additional context for evaluation' })
  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

export class EvaluateFlagResponseDto {
  @ApiProperty()
  flagKey: string;

  @ApiProperty()
  value: any;

  @ApiProperty()
  isEnabled: boolean;

  @ApiPropertyOptional()
  matchedRule?: number;

  @ApiProperty()
  evaluatedAt: Date;
}

export class BulkEvaluateRequestDto {
  @ApiProperty({ description: 'User ID for evaluation context' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Flag keys to evaluate (all if empty)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  flagKeys?: string[];

  @ApiPropertyOptional({ description: 'Additional context for evaluation' })
  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

export class BulkEvaluateResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ description: 'Flag values by key' })
  flags: Record<string, any>;

  @ApiProperty()
  evaluatedAt: Date;
}

export class FlagQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: FlagStatus })
  @IsEnum(FlagStatus)
  @IsOptional()
  status?: FlagStatus;

  @ApiPropertyOptional({ description: 'Filter by type', enum: FlagType })
  @IsEnum(FlagType)
  @IsOptional()
  type?: FlagType;

  @ApiPropertyOptional({ description: 'Filter by environment' })
  @IsString()
  @IsOptional()
  environment?: string;

  @ApiPropertyOptional({ description: 'Filter by tag' })
  @IsString()
  @IsOptional()
  tag?: string;

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

export class PaginatedFlagsDto {
  @ApiProperty({ type: [FeatureFlagResponseDto] })
  items: FeatureFlagResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
