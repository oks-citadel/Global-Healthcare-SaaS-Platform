import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, Min, IsUUID } from 'class-validator';

export enum RewardType {
  CREDIT = 'CREDIT',
  DISCOUNT_PERCENT = 'DISCOUNT_PERCENT',
  DISCOUNT_FIXED = 'DISCOUNT_FIXED',
  FREE_TRIAL = 'FREE_TRIAL',
  POINTS = 'POINTS',
}

export class CreateReferralProgramDto {
  @ApiProperty({ description: 'Program name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Program description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Reward amount for referrer' })
  @IsNumber()
  @Min(0)
  referrerReward: number;

  @ApiProperty({ description: 'Reward amount for referee' })
  @IsNumber()
  @Min(0)
  refereeReward: number;

  @ApiPropertyOptional({ enum: RewardType, default: RewardType.CREDIT })
  @IsEnum(RewardType)
  @IsOptional()
  rewardType?: RewardType;

  @ApiPropertyOptional({ description: 'Reward currency', default: 'USD' })
  @IsString()
  @IsOptional()
  rewardCurrency?: string;

  @ApiPropertyOptional({ description: 'Maximum redemptions per code' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxRedemptions?: number;

  @ApiPropertyOptional({ description: 'Minimum purchase amount required' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPurchaseAmount?: number;

  @ApiPropertyOptional({ description: 'Days until code expires' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  expirationDays?: number;

  @ApiPropertyOptional({ description: 'Max referrals per user' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxReferralsPerUser?: number;

  @ApiPropertyOptional({ description: 'Total program budget' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalBudget?: number;
}

export class GenerateReferralCodeDto {
  @ApiProperty({ description: 'Referral program ID' })
  @IsUUID()
  programId: string;

  @ApiProperty({ description: 'User ID of the referrer' })
  @IsString()
  referrerId: string;

  @ApiPropertyOptional({ description: 'Custom code (optional)' })
  @IsString()
  @IsOptional()
  customCode?: string;
}

export class RedeemReferralDto {
  @ApiProperty({ description: 'Referral code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'User ID of the referee' })
  @IsString()
  refereeId: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class TrackReferralDto {
  @ApiProperty({ description: 'Referral code' })
  @IsString()
  code: string;
}

export class ReferralCodeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  programId: string;

  @ApiProperty()
  referrerId: string;

  @ApiProperty()
  totalClicks: number;

  @ApiProperty()
  totalSignups: number;

  @ApiProperty()
  totalConversions: number;

  @ApiProperty()
  totalRewardsEarned: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  expiresAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ description: 'Shareable referral URL' })
  referralUrl: string;
}

export class ReferralRedemptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  referralCodeId: string;

  @ApiProperty()
  refereeId: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  referrerRewardAmount?: number;

  @ApiPropertyOptional()
  refereeRewardAmount?: number;

  @ApiProperty()
  createdAt: Date;
}

export class ReferralTrackingDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  programName: string;

  @ApiProperty()
  totalClicks: number;

  @ApiProperty()
  totalSignups: number;

  @ApiProperty()
  totalConversions: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  totalRewardsEarned: number;

  @ApiProperty()
  pendingRewards: number;

  @ApiProperty({ description: 'Recent redemptions' })
  recentRedemptions: any[];
}
