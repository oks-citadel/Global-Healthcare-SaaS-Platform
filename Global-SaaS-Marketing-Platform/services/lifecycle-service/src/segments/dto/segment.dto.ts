import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum SegmentStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export enum QueryType {
  ALL_MATCH = 'ALL_MATCH',
  ANY_MATCH = 'ANY_MATCH',
  CUSTOM = 'CUSTOM',
}

export enum ConditionOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  IS_SET = 'IS_SET',
  IS_NOT_SET = 'IS_NOT_SET',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
  BETWEEN = 'BETWEEN',
}

export class SegmentConditionDto {
  @ApiProperty({ description: 'Field to evaluate' })
  @IsString()
  field: string;

  @ApiProperty({ enum: ConditionOperator, description: 'Comparison operator' })
  @IsEnum(ConditionOperator)
  operator: ConditionOperator;

  @ApiPropertyOptional({ description: 'Value to compare against' })
  @IsOptional()
  value?: any;
}

export class ConditionGroupDto {
  @ApiPropertyOptional({ description: 'Logical operator (AND/OR)', default: 'AND' })
  @IsString()
  @IsOptional()
  logic?: 'AND' | 'OR';

  @ApiProperty({ description: 'Conditions in this group', type: [SegmentConditionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SegmentConditionDto)
  conditions: SegmentConditionDto[];
}

export class CreateSegmentDto {
  @ApiProperty({ description: 'Segment name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Segment description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: QueryType, default: QueryType.ALL_MATCH })
  @IsEnum(QueryType)
  @IsOptional()
  queryType?: QueryType;

  @ApiProperty({ description: 'Segment conditions', type: [ConditionGroupDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionGroupDto)
  conditions: ConditionGroupDto[];
}

export class UpdateSegmentDto extends PartialType(CreateSegmentDto) {
  @ApiPropertyOptional({ enum: SegmentStatus })
  @IsEnum(SegmentStatus)
  @IsOptional()
  status?: SegmentStatus;
}

export class SegmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: SegmentStatus })
  status: SegmentStatus;

  @ApiProperty({ enum: QueryType })
  queryType: QueryType;

  @ApiProperty()
  conditions: any;

  @ApiProperty()
  memberCount: number;

  @ApiPropertyOptional()
  lastCalculatedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SegmentMemberDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  segmentId: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiProperty()
  addedAt: Date;
}
