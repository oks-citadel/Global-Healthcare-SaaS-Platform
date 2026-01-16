import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsObject,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDate,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TrialStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CONVERTED = 'CONVERTED',
  CANCELLED = 'CANCELLED',
}

export enum NudgeType {
  WELCOME = 'WELCOME',
  FEATURE_HIGHLIGHT = 'FEATURE_HIGHLIGHT',
  USAGE_TIP = 'USAGE_TIP',
  UPGRADE_PROMPT = 'UPGRADE_PROMPT',
  TRIAL_ENDING = 'TRIAL_ENDING',
  LAST_CHANCE = 'LAST_CHANCE',
}

export enum NudgeChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH',
  SMS = 'SMS',
}

export class CreateTrialUserDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'User email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Plan ID user is trying' })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiProperty({ description: 'Trial start date' })
  @IsDate()
  @Type(() => Date)
  trialStartDate: Date;

  @ApiProperty({ description: 'Trial end date' })
  @IsDate()
  @Type(() => Date)
  trialEndDate: Date;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateTrialUserDto extends PartialType(CreateTrialUserDto) {
  @ApiPropertyOptional({ description: 'Trial status', enum: TrialStatus })
  @IsEnum(TrialStatus)
  @IsOptional()
  status?: TrialStatus;

  @ApiPropertyOptional({ description: 'Engagement score (0-100)' })
  @IsNumber()
  @IsOptional()
  engagementScore?: number;

  @ApiPropertyOptional({ description: 'Last activity timestamp' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastActivityAt?: Date;
}

export class TrialUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  planId?: string;

  @ApiProperty()
  trialStartDate: Date;

  @ApiProperty()
  trialEndDate: Date;

  @ApiProperty({ enum: TrialStatus })
  status: TrialStatus;

  @ApiPropertyOptional()
  convertedAt?: Date;

  @ApiProperty()
  engagementScore: number;

  @ApiPropertyOptional()
  lastActivityAt?: Date;

  @ApiProperty()
  daysRemaining: number;

  @ApiProperty()
  daysInTrial: number;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class NudgeContentDto {
  @ApiProperty({ description: 'Nudge title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Nudge message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'CTA text' })
  @IsString()
  @IsOptional()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'CTA URL' })
  @IsString()
  @IsOptional()
  ctaUrl?: string;

  @ApiPropertyOptional({ description: 'Additional data' })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class CreateNudgeDto {
  @ApiProperty({ description: 'Trial user ID' })
  @IsString()
  @IsNotEmpty()
  trialUserId: string;

  @ApiProperty({ description: 'Nudge type', enum: NudgeType })
  @IsEnum(NudgeType)
  type: NudgeType;

  @ApiProperty({ description: 'Delivery channel', enum: NudgeChannel })
  @IsEnum(NudgeChannel)
  channel: NudgeChannel;

  @ApiProperty({ description: 'Nudge content', type: NudgeContentDto })
  @IsObject()
  content: NudgeContentDto;
}

export class NudgeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  trialUserId: string;

  @ApiProperty({ enum: NudgeType })
  type: NudgeType;

  @ApiProperty({ enum: NudgeChannel })
  channel: NudgeChannel;

  @ApiProperty()
  content: NudgeContentDto;

  @ApiProperty()
  sentAt: Date;

  @ApiPropertyOptional()
  openedAt?: Date;

  @ApiPropertyOptional()
  clickedAt?: Date;

  @ApiPropertyOptional()
  convertedAt?: Date;
}

export class TrialConversionQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: TrialStatus })
  @IsEnum(TrialStatus)
  @IsOptional()
  status?: TrialStatus;

  @ApiPropertyOptional({ description: 'Filter by plan ID' })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiPropertyOptional({ description: 'Days until trial ends (max)' })
  @IsNumber()
  @IsOptional()
  daysRemainingMax?: number;

  @ApiPropertyOptional({ description: 'Minimum engagement score' })
  @IsNumber()
  @IsOptional()
  minEngagementScore?: number;

  @ApiPropertyOptional({ description: 'Maximum engagement score' })
  @IsNumber()
  @IsOptional()
  maxEngagementScore?: number;
}

export class ConversionMetricsDto {
  @ApiProperty()
  totalTrials: number;

  @ApiProperty()
  activeTrials: number;

  @ApiProperty()
  convertedTrials: number;

  @ApiProperty()
  expiredTrials: number;

  @ApiProperty()
  cancelledTrials: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  avgEngagementScore: number;

  @ApiProperty()
  avgDaysToConvert: number;

  @ApiProperty()
  trialsByPlan: Record<string, number>;

  @ApiProperty()
  conversionsByPlan: Record<string, number>;
}

export class TrialAtRiskDto {
  @ApiProperty()
  trialUser: TrialUserResponseDto;

  @ApiProperty()
  riskScore: number;

  @ApiProperty()
  riskFactors: string[];

  @ApiProperty()
  suggestedNudgeType: NudgeType;
}
