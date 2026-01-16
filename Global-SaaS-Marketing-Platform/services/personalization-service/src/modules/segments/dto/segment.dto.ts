import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class SegmentRuleDto {
  @ApiProperty({ description: 'Rule field (trait key, property, etc.)' })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Rule operator',
    enum: ['equals', 'notEquals', 'contains', 'notContains', 'greaterThan', 'lessThan', 'in', 'notIn', 'exists', 'notExists'],
  })
  @IsString()
  operator: string;

  @ApiPropertyOptional({ description: 'Rule value' })
  value?: any;
}

export class SegmentRulesDto {
  @ApiProperty({
    description: 'Logical operator for combining rules',
    enum: ['AND', 'OR'],
  })
  @IsString()
  operator: 'AND' | 'OR';

  @ApiProperty({ description: 'Array of rules or nested rule groups', type: [Object] })
  @IsArray()
  conditions: Array<SegmentRuleDto | SegmentRulesDto>;
}

export class CreateSegmentDto {
  @ApiProperty({ description: 'Unique segment key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Segment name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Segment description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Segment rules', type: SegmentRulesDto })
  @IsObject()
  rules: SegmentRulesDto;

  @ApiPropertyOptional({ description: 'Whether segment is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Whether segment is dynamic (auto-updated)', default: true })
  @IsBoolean()
  @IsOptional()
  isDynamic?: boolean;
}

export class UpdateSegmentDto extends PartialType(CreateSegmentDto) {}

export class SegmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  rules: SegmentRulesDto;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDynamic: boolean;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SegmentMemberDto {
  @ApiProperty()
  profileId: string;

  @ApiProperty()
  externalUserId: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty()
  enteredAt: Date;
}

export class SegmentWithMembersDto extends SegmentResponseDto {
  @ApiProperty({ type: [SegmentMemberDto] })
  members: SegmentMemberDto[];
}

export class SegmentQueryDto {
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

export class PaginatedSegmentsDto {
  @ApiProperty({ type: [SegmentResponseDto] })
  items: SegmentResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
