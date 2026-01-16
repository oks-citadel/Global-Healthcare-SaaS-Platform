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
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TraitDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
}

export class CreateTraitDto {
  @ApiProperty({ description: 'Unique trait key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Trait display name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Trait description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Trait data type', enum: TraitDataType })
  @IsEnum(TraitDataType)
  dataType: TraitDataType;

  @ApiPropertyOptional({ description: 'Trait category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Whether trait is computed', default: false })
  @IsBoolean()
  @IsOptional()
  isComputed?: boolean;

  @ApiPropertyOptional({ description: 'Compute rule for computed traits' })
  @IsObject()
  @IsOptional()
  computeRule?: Record<string, any>;
}

export class UpdateTraitDto extends PartialType(CreateTraitDto) {}

export class TraitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: TraitDataType })
  dataType: TraitDataType;

  @ApiPropertyOptional()
  category?: string;

  @ApiProperty()
  isComputed: boolean;

  @ApiPropertyOptional()
  computeRule?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProfileTraitValueDto {
  @ApiProperty({ description: 'Trait key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Trait value' })
  @IsNotEmpty()
  value: any;

  @ApiPropertyOptional({ description: 'Source of the trait value' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Confidence score (0-1)' })
  @IsNumber()
  @IsOptional()
  confidence?: number;
}

export class SetProfileTraitsDto {
  @ApiProperty({ description: 'Profile ID' })
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({ description: 'Traits to set', type: [ProfileTraitValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileTraitValueDto)
  traits: ProfileTraitValueDto[];
}

export class ProfileTraitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  profileId: string;

  @ApiProperty()
  traitKey: string;

  @ApiProperty()
  traitName: string;

  @ApiProperty()
  value: any;

  @ApiPropertyOptional()
  source?: string;

  @ApiPropertyOptional()
  confidence?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TraitQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by data type', enum: TraitDataType })
  @IsEnum(TraitDataType)
  @IsOptional()
  dataType?: TraitDataType;

  @ApiPropertyOptional({ description: 'Filter by computed status' })
  @IsBoolean()
  @IsOptional()
  isComputed?: boolean;

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

export class PaginatedTraitsDto {
  @ApiProperty({ type: [TraitResponseDto] })
  items: TraitResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
