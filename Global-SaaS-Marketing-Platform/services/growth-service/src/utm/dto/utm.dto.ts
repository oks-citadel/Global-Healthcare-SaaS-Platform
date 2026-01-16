import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsDateString, IsUUID } from 'class-validator';

export class GenerateUtmDto {
  @ApiProperty({ description: 'Original URL to add UTM parameters to' })
  @IsUrl()
  originalUrl: string;

  @ApiProperty({ description: 'UTM source (e.g., google, newsletter, twitter)' })
  @IsString()
  utmSource: string;

  @ApiProperty({ description: 'UTM medium (e.g., cpc, email, social)' })
  @IsString()
  utmMedium: string;

  @ApiProperty({ description: 'UTM campaign name' })
  @IsString()
  utmCampaign: string;

  @ApiPropertyOptional({ description: 'UTM term (keywords)' })
  @IsString()
  @IsOptional()
  utmTerm?: string;

  @ApiPropertyOptional({ description: 'UTM content (ad variation)' })
  @IsString()
  @IsOptional()
  utmContent?: string;

  @ApiPropertyOptional({ description: 'Associated campaign ID' })
  @IsUUID()
  @IsOptional()
  campaignId?: string;

  @ApiPropertyOptional({ description: 'Link expiration date' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ParseUtmDto {
  @ApiProperty({ description: 'URL to parse UTM parameters from' })
  @IsUrl()
  url: string;
}

export class UtmResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  originalUrl: string;

  @ApiProperty()
  shortCode: string;

  @ApiProperty()
  fullUrl: string;

  @ApiProperty()
  utmSource: string;

  @ApiProperty()
  utmMedium: string;

  @ApiProperty()
  utmCampaign: string;

  @ApiPropertyOptional()
  utmTerm?: string;

  @ApiPropertyOptional()
  utmContent?: string;

  @ApiPropertyOptional()
  campaignId?: string;

  @ApiProperty()
  clicks: number;

  @ApiProperty()
  uniqueClicks: number;

  @ApiPropertyOptional()
  lastClickedAt?: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  expiresAt?: Date;

  @ApiProperty()
  createdAt: Date;
}

export class ParsedUtmDto {
  @ApiProperty()
  originalUrl: string;

  @ApiPropertyOptional()
  utmSource?: string;

  @ApiPropertyOptional()
  utmMedium?: string;

  @ApiPropertyOptional()
  utmCampaign?: string;

  @ApiPropertyOptional()
  utmTerm?: string;

  @ApiPropertyOptional()
  utmContent?: string;

  @ApiProperty({ description: 'Whether all required UTM parameters are present' })
  isValid: boolean;

  @ApiPropertyOptional({ description: 'Validation warnings' })
  warnings?: string[];
}
