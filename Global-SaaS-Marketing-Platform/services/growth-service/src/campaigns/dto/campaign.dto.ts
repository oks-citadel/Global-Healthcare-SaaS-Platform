import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
  IsObject,
  Min,
} from 'class-validator';

export enum CampaignType {
  EMAIL = 'EMAIL',
  SOCIAL = 'SOCIAL',
  PPC = 'PPC',
  CONTENT = 'CONTENT',
  AFFILIATE = 'AFFILIATE',
  REFERRAL = 'REFERRAL',
  INFLUENCER = 'INFLUENCER',
  RETARGETING = 'RETARGETING',
  BRAND_AWARENESS = 'BRAND_AWARENESS',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateCampaignDto {
  @ApiProperty({ description: 'Campaign name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Campaign description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CampaignType, description: 'Campaign type' })
  @IsEnum(CampaignType)
  type: CampaignType;

  @ApiPropertyOptional({ enum: CampaignStatus, default: CampaignStatus.DRAFT })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;

  @ApiPropertyOptional({ description: 'Campaign budget' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ description: 'Budget currency', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Campaign start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Campaign end date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Target audience configuration' })
  @IsObject()
  @IsOptional()
  targetAudience?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Campaign goals' })
  @IsObject()
  @IsOptional()
  goals?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Marketing channels', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  channels?: string[];

  @ApiPropertyOptional({ description: 'Campaign tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

export class CampaignResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: CampaignType })
  type: CampaignType;

  @ApiProperty({ enum: CampaignStatus })
  status: CampaignStatus;

  @ApiPropertyOptional()
  budget?: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  targetAudience?: Record<string, any>;

  @ApiPropertyOptional()
  goals?: Record<string, any>;

  @ApiProperty({ type: [String] })
  channels: string[];

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  impressions: number;

  @ApiProperty()
  clicks: number;

  @ApiProperty()
  conversions: number;

  @ApiProperty()
  spend: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CampaignMetricsDto {
  @ApiProperty()
  impressions: number;

  @ApiProperty()
  clicks: number;

  @ApiProperty()
  conversions: number;

  @ApiProperty()
  spend: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty({ description: 'Click-through rate' })
  ctr: number;

  @ApiProperty({ description: 'Conversion rate' })
  conversionRate: number;

  @ApiProperty({ description: 'Cost per click' })
  cpc: number;

  @ApiProperty({ description: 'Cost per acquisition' })
  cpa: number;

  @ApiProperty({ description: 'Return on ad spend' })
  roas: number;

  @ApiProperty({ description: 'Return on investment' })
  roi: number;
}

export class CampaignFilterDto {
  @ApiPropertyOptional({ enum: CampaignType })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @ApiPropertyOptional({ enum: CampaignStatus })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;

  @ApiPropertyOptional({ description: 'Filter by tag' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ description: 'Start date from' })
  @IsDateString()
  @IsOptional()
  startDateFrom?: string;

  @ApiPropertyOptional({ description: 'Start date to' })
  @IsDateString()
  @IsOptional()
  startDateTo?: string;

  @ApiPropertyOptional({ description: 'Search by name' })
  @IsString()
  @IsOptional()
  search?: string;
}
