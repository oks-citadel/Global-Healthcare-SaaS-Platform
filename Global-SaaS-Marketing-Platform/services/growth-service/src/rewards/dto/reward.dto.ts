import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';

export enum RewardType {
  CREDIT = 'CREDIT',
  DISCOUNT_PERCENT = 'DISCOUNT_PERCENT',
  DISCOUNT_FIXED = 'DISCOUNT_FIXED',
  FREE_TRIAL = 'FREE_TRIAL',
  POINTS = 'POINTS',
}

export enum UserRewardStatus {
  AVAILABLE = 'AVAILABLE',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export class CreateRewardDto {
  @ApiProperty({ description: 'Reward name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Reward description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: RewardType, description: 'Type of reward' })
  @IsEnum(RewardType)
  type: RewardType;

  @ApiProperty({ description: 'Reward value (amount or percentage)' })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Minimum spend to use reward' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minSpend?: number;

  @ApiPropertyOptional({ description: 'Maximum redemptions allowed' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxRedemptions?: number;

  @ApiPropertyOptional({ description: 'Valid from date' })
  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @ApiPropertyOptional({ description: 'Valid until date' })
  @IsDateString()
  @IsOptional()
  validUntil?: string;
}

export class IssueRewardDto {
  @ApiProperty({ description: 'Reward ID to issue' })
  @IsString()
  rewardId: string;

  @ApiProperty({ description: 'User ID to issue reward to' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Source of the reward (referral, affiliate, campaign, etc.)' })
  @IsString()
  @IsOptional()
  earnedFrom?: string;

  @ApiPropertyOptional({ description: 'Source ID (referral code ID, campaign ID, etc.)' })
  @IsString()
  @IsOptional()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'Expiration date for this user reward' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class RedeemRewardDto {
  @ApiProperty({ description: 'User reward ID or code' })
  @IsString()
  codeOrId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;
}

export class RewardResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: RewardType })
  type: RewardType;

  @ApiProperty()
  value: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  minSpend?: number;

  @ApiPropertyOptional()
  maxRedemptions?: number;

  @ApiPropertyOptional()
  validFrom?: Date;

  @ApiPropertyOptional()
  validUntil?: Date;

  @ApiProperty()
  totalRedemptions: number;

  @ApiProperty()
  totalValue: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class UserRewardResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rewardId: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  code?: string;

  @ApiProperty({ enum: UserRewardStatus })
  status: UserRewardStatus;

  @ApiPropertyOptional()
  earnedFrom?: string;

  @ApiPropertyOptional()
  sourceId?: string;

  @ApiPropertyOptional()
  redeemedAt?: Date;

  @ApiPropertyOptional()
  expiresAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Reward details' })
  reward?: RewardResponseDto;
}
