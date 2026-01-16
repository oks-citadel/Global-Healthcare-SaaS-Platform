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
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OfferType {
  UPSELL = 'UPSELL',
  CROSS_SELL = 'CROSS_SELL',
  BUNDLE = 'BUNDLE',
  ADDON = 'ADDON',
}

export class DiscountDto {
  @ApiProperty({ description: 'Discount type', enum: ['percentage', 'fixed'] })
  @IsString()
  type: 'percentage' | 'fixed';

  @ApiProperty({ description: 'Discount value' })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({ description: 'Maximum discount amount (for percentage)' })
  @IsNumber()
  @IsOptional()
  maxAmount?: number;
}

export class TargetingDto {
  @ApiPropertyOptional({ description: 'Target user segments' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  segments?: string[];

  @ApiPropertyOptional({ description: 'Target user traits' })
  @IsObject()
  @IsOptional()
  traits?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Minimum purchase amount' })
  @IsNumber()
  @IsOptional()
  minPurchase?: number;

  @ApiPropertyOptional({ description: 'Maximum times to show per user' })
  @IsNumber()
  @IsOptional()
  maxImpressions?: number;
}

export class CreateOfferDto {
  @ApiProperty({ description: 'Unique offer key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Offer name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Offer description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Offer type', enum: OfferType })
  @IsEnum(OfferType)
  type: OfferType;

  @ApiProperty({ description: 'Source product IDs that trigger this offer' })
  @IsArray()
  @IsString({ each: true })
  sourceProducts: string[];

  @ApiProperty({ description: 'Target product IDs to recommend' })
  @IsArray()
  @IsString({ each: true })
  targetProducts: string[];

  @ApiPropertyOptional({ description: 'Discount configuration', type: DiscountDto })
  @IsObject()
  @IsOptional()
  discount?: DiscountDto;

  @ApiPropertyOptional({ description: 'Priority (higher = more important)', default: 0 })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: 'Targeting configuration', type: TargetingDto })
  @IsObject()
  @IsOptional()
  targeting?: TargetingDto;

  @ApiPropertyOptional({ description: 'Whether offer is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Offer start date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Offer end date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}

export class OfferResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: OfferType })
  type: OfferType;

  @ApiProperty()
  sourceProducts: string[];

  @ApiProperty()
  targetProducts: string[];

  @ApiPropertyOptional()
  discount?: DiscountDto;

  @ApiProperty()
  priority: number;

  @ApiPropertyOptional()
  targeting?: TargetingDto;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty()
  impressions: number;

  @ApiProperty()
  clicks: number;

  @ApiProperty()
  conversions: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetOffersQueryDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Current product ID' })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ description: 'Cart product IDs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cartProducts?: string[];

  @ApiPropertyOptional({ description: 'Offer type filter', enum: OfferType })
  @IsEnum(OfferType)
  @IsOptional()
  type?: OfferType;

  @ApiPropertyOptional({ description: 'Maximum number of offers', default: 5 })
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class OfferWithProductsDto extends OfferResponseDto {
  @ApiProperty({ description: 'Resolved target product details' })
  products: Array<{
    id: string;
    name: string;
    price: number;
    discountedPrice?: number;
    imageUrl?: string;
  }>;
}
