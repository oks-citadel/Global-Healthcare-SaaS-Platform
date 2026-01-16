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
} from 'class-validator';
import { Type } from 'class-transformer';

// Recommendation DTOs
export class RecommendRequestDto {
  @ApiProperty({ description: 'Profile ID or external user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Recommendation context/category' })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiPropertyOptional({ description: 'Number of recommendations', default: 5 })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Items to exclude from recommendations' })
  @IsArray()
  @IsOptional()
  excludeItems?: string[];

  @ApiPropertyOptional({ description: 'Additional context data' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class RecommendationDto {
  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemType: string;

  @ApiProperty()
  score: number;

  @ApiPropertyOptional()
  reason?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;
}

export class RecommendResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [RecommendationDto] })
  recommendations: RecommendationDto[];

  @ApiProperty()
  requestId: string;

  @ApiProperty()
  generatedAt: Date;
}

// Next Best Action DTOs
export class NextBestActionRequestDto {
  @ApiProperty({ description: 'Profile ID or external user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Current page or context' })
  @IsString()
  @IsOptional()
  currentContext?: string;

  @ApiPropertyOptional({ description: 'Goal or objective' })
  @IsString()
  @IsOptional()
  goal?: string;

  @ApiPropertyOptional({ description: 'Number of actions to return', default: 3 })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Additional context data' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ActionDto {
  @ApiProperty()
  actionId: string;

  @ApiProperty()
  actionType: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  priority: number;

  @ApiPropertyOptional()
  ctaText?: string;

  @ApiPropertyOptional()
  ctaUrl?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;
}

export class NextBestActionResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [ActionDto] })
  actions: ActionDto[];

  @ApiProperty()
  requestId: string;

  @ApiProperty()
  generatedAt: Date;
}

// Content Personalization DTOs
export class ContentRequestDto {
  @ApiProperty({ description: 'Profile ID or external user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Content slot or placement ID' })
  @IsString()
  @IsNotEmpty()
  slotId: string;

  @ApiPropertyOptional({ description: 'Page context' })
  @IsString()
  @IsOptional()
  pageContext?: string;

  @ApiPropertyOptional({ description: 'Device type' })
  @IsString()
  @IsOptional()
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Additional context data' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ContentVariantDto {
  @ApiProperty()
  variantId: string;

  @ApiProperty()
  content: Record<string, any>;

  @ApiPropertyOptional()
  templateId?: string;

  @ApiPropertyOptional()
  ruleId?: string;
}

export class ContentResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  slotId: string;

  @ApiProperty({ type: ContentVariantDto })
  variant: ContentVariantDto;

  @ApiProperty()
  requestId: string;

  @ApiProperty()
  generatedAt: Date;
}

// Personalization Rules DTOs
export enum PersonalizationRuleType {
  CONTENT = 'CONTENT',
  RECOMMENDATION = 'RECOMMENDATION',
  NEXT_BEST_ACTION = 'NEXT_BEST_ACTION',
  TARGETING = 'TARGETING',
}

export class RuleConditionDto {
  @ApiProperty({ description: 'Field to evaluate' })
  @IsString()
  field: string;

  @ApiProperty({ description: 'Operator', enum: ['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan', 'in', 'notIn', 'exists'] })
  @IsString()
  operator: string;

  @ApiPropertyOptional({ description: 'Value to compare' })
  value?: any;
}

export class RuleConditionsDto {
  @ApiProperty({ description: 'Logical operator', enum: ['AND', 'OR'] })
  @IsString()
  operator: 'AND' | 'OR';

  @ApiProperty({ description: 'Array of conditions', type: [RuleConditionDto] })
  @IsArray()
  conditions: RuleConditionDto[];
}

export class RuleActionDto {
  @ApiProperty({ description: 'Action type' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Action payload' })
  @IsObject()
  payload: Record<string, any>;
}

export class CreateRuleDto {
  @ApiProperty({ description: 'Unique rule key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Rule name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Rule type', enum: PersonalizationRuleType })
  @IsEnum(PersonalizationRuleType)
  type: PersonalizationRuleType;

  @ApiPropertyOptional({ description: 'Rule priority (higher = more important)', default: 0 })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiProperty({ description: 'Rule conditions', type: RuleConditionsDto })
  @IsObject()
  conditions: RuleConditionsDto;

  @ApiProperty({ description: 'Rule actions', type: [RuleActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleActionDto)
  actions: RuleActionDto[];

  @ApiPropertyOptional({ description: 'Whether rule is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Rule start date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Rule end date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

export class UpdateRuleDto extends PartialType(CreateRuleDto) {}

export class RuleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: PersonalizationRuleType })
  type: PersonalizationRuleType;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  conditions: RuleConditionsDto;

  @ApiProperty()
  actions: RuleActionDto[];

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RuleQueryDto {
  @ApiPropertyOptional({ description: 'Filter by type', enum: PersonalizationRuleType })
  @IsEnum(PersonalizationRuleType)
  @IsOptional()
  type?: PersonalizationRuleType;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

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

export class PaginatedRulesDto {
  @ApiProperty({ type: [RuleResponseDto] })
  items: RuleResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
