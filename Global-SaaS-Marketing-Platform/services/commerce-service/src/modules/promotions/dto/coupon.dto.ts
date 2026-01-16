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
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_TRIAL_EXTENSION = 'FREE_TRIAL_EXTENSION',
  FREE_ADDON = 'FREE_ADDON',
}

export class CreateCouponDto {
  @ApiProperty({ description: 'Unique coupon code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Coupon name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Coupon description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Coupon type', enum: CouponType })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)' })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({ description: 'Minimum purchase amount required' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPurchase?: number;

  @ApiPropertyOptional({ description: 'Maximum discount amount (for percentage coupons)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscount?: number;

  @ApiPropertyOptional({ description: 'Applicable product IDs (empty = all products)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableProducts?: string[];

  @ApiPropertyOptional({ description: 'Applicable plan IDs (empty = all plans)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicablePlans?: string[];

  @ApiPropertyOptional({ description: 'Total usage limit' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  usageLimit?: number;

  @ApiPropertyOptional({ description: 'Per-user usage limit' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  perUserLimit?: number;

  @ApiPropertyOptional({ description: 'Whether coupon is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Coupon start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'Coupon end date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}

export class CouponResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: CouponType })
  type: CouponType;

  @ApiProperty()
  value: number;

  @ApiPropertyOptional()
  minPurchase?: number;

  @ApiPropertyOptional()
  maxDiscount?: number;

  @ApiProperty()
  applicableProducts: string[];

  @ApiProperty()
  applicablePlans: string[];

  @ApiPropertyOptional()
  usageLimit?: number;

  @ApiProperty()
  usageCount: number;

  @ApiPropertyOptional()
  perUserLimit?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  isValid: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ValidateCouponDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Product ID to validate against' })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ description: 'Plan ID to validate against' })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiPropertyOptional({ description: 'Purchase amount' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  purchaseAmount?: number;
}

export class ValidationResultDto {
  @ApiProperty()
  isValid: boolean;

  @ApiPropertyOptional()
  error?: string;

  @ApiPropertyOptional()
  discount?: number;

  @ApiPropertyOptional()
  finalAmount?: number;

  @ApiProperty()
  coupon: CouponResponseDto;
}

export class RedeemCouponDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Order ID' })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ description: 'Discount amount applied' })
  @IsNumber()
  @Min(0)
  discount: number;
}

export class RedemptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  couponId: string;

  @ApiProperty()
  couponCode: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  orderId?: string;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  redeemedAt: Date;
}

export class CouponQueryDto {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by type', enum: CouponType })
  @IsEnum(CouponType)
  @IsOptional()
  type?: CouponType;

  @ApiPropertyOptional({ description: 'Search by code or name' })
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

export class PaginatedCouponsDto {
  @ApiProperty({ type: [CouponResponseDto] })
  items: CouponResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
