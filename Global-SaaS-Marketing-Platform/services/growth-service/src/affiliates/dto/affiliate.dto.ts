import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsEmail,
  IsArray,
  IsObject,
  Min,
  IsUUID,
} from 'class-validator';

export enum CommissionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  TIERED = 'TIERED',
}

export enum PayoutFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum AffiliateStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export class CreateAffiliateProgramDto {
  @ApiProperty({ description: 'Program name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Program description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: CommissionType, default: CommissionType.PERCENTAGE })
  @IsEnum(CommissionType)
  @IsOptional()
  commissionType?: CommissionType;

  @ApiProperty({ description: 'Commission rate (percentage or fixed amount)' })
  @IsNumber()
  @Min(0)
  commissionRate: number;

  @ApiPropertyOptional({ description: 'Minimum payout amount', default: 50 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPayout?: number;

  @ApiPropertyOptional({ enum: PayoutFrequency, default: PayoutFrequency.MONTHLY })
  @IsEnum(PayoutFrequency)
  @IsOptional()
  payoutFrequency?: PayoutFrequency;

  @ApiPropertyOptional({ description: 'Cookie duration in days', default: 30 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  cookieDuration?: number;

  @ApiPropertyOptional({ description: 'Terms and conditions URL' })
  @IsString()
  @IsOptional()
  termsUrl?: string;
}

export class EnrollAffiliateDto {
  @ApiProperty({ description: 'Affiliate program ID' })
  @IsUUID()
  programId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ description: 'Promotion methods', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  promotionMethods?: string[];

  @ApiPropertyOptional({ description: 'PayPal email for payouts' })
  @IsEmail()
  @IsOptional()
  paypalEmail?: string;

  @ApiPropertyOptional({ description: 'Bank details for payouts' })
  @IsObject()
  @IsOptional()
  bankDetails?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Tax ID' })
  @IsString()
  @IsOptional()
  taxId?: string;
}

export class TrackConversionDto {
  @ApiProperty({ description: 'Affiliate code' })
  @IsString()
  affiliateCode: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Order amount' })
  @IsNumber()
  @Min(0)
  orderAmount: number;

  @ApiPropertyOptional({ description: 'Click ID for tracking' })
  @IsString()
  @IsOptional()
  clickId?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class AffiliateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  programId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  affiliateCode: string;

  @ApiProperty({ enum: AffiliateStatus })
  status: AffiliateStatus;

  @ApiPropertyOptional()
  companyName?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiProperty({ type: [String] })
  promotionMethods: string[];

  @ApiProperty()
  totalClicks: number;

  @ApiProperty()
  totalConversions: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalCommission: number;

  @ApiProperty()
  pendingCommission: number;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiProperty()
  createdAt: Date;
}

export class PayoutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  affiliateId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  method?: string;

  @ApiPropertyOptional()
  transactionId?: string;

  @ApiPropertyOptional()
  processedAt?: Date;

  @ApiProperty()
  createdAt: Date;
}

export class AffiliatePayoutSummaryDto {
  @ApiProperty()
  affiliateId: string;

  @ApiProperty()
  affiliateCode: string;

  @ApiProperty()
  totalEarnings: number;

  @ApiProperty()
  pendingCommission: number;

  @ApiProperty()
  paidCommission: number;

  @ApiProperty()
  nextPayoutDate: Date;

  @ApiProperty()
  minPayoutThreshold: number;

  @ApiProperty()
  eligibleForPayout: boolean;

  @ApiProperty({ type: [PayoutResponseDto] })
  recentPayouts: PayoutResponseDto[];
}
