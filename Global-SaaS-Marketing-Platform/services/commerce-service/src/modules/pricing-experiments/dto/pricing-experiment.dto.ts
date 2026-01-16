import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
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

export class PricingVariantDto {
  @ApiProperty({ description: 'Variant key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Variant name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price for this variant' })
  @IsNumber()
  @Min(0)
  price: number;

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
}

export class CreatePricingExperimentDto {
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

  @ApiProperty({ description: 'Product ID to test pricing for' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Base/control price' })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Pricing variants to test', type: [PricingVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingVariantDto)
  variants: PricingVariantDto[];

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
}

export class UpdatePricingExperimentDto extends PartialType(CreatePricingExperimentDto) {
  @ApiPropertyOptional({ description: 'Experiment status', enum: ExperimentStatus })
  @IsEnum(ExperimentStatus)
  @IsOptional()
  status?: ExperimentStatus;
}

export class PricingVariantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  isControl: boolean;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  impressions: number;

  @ApiProperty()
  conversions: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  avgRevenuePerUser: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PricingExperimentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ExperimentStatus })
  status: ExperimentStatus;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ type: [PricingVariantResponseDto] })
  variants: PricingVariantResponseDto[];

  @ApiProperty()
  targetSegments: string[];

  @ApiProperty()
  trafficPercent: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetPriceDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}

export class PriceResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  experimentId?: string;

  @ApiPropertyOptional()
  variantKey?: string;

  @ApiProperty()
  isExperiment: boolean;
}

export class PricingExperimentQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: ExperimentStatus })
  @IsEnum(ExperimentStatus)
  @IsOptional()
  status?: ExperimentStatus;

  @ApiPropertyOptional({ description: 'Filter by product ID' })
  @IsString()
  @IsOptional()
  productId?: string;

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

export class PaginatedPricingExperimentsDto {
  @ApiProperty({ type: [PricingExperimentResponseDto] })
  items: PricingExperimentResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
