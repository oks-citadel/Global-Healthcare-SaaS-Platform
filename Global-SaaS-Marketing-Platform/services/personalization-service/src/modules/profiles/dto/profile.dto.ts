import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsObject,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ description: 'External user ID from your system' })
  @IsString()
  @IsNotEmpty()
  externalUserId: string;

  @ApiPropertyOptional({ description: 'User email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'User last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'User timezone', example: 'America/New_York' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({ description: 'User locale', example: 'en-US' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  externalUserId: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiPropertyOptional()
  locale?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProfileWithTraitsDto extends ProfileResponseDto {
  @ApiPropertyOptional({ description: 'User traits' })
  traits?: Array<{
    key: string;
    value: any;
    source?: string;
    confidence?: number;
  }>;

  @ApiPropertyOptional({ description: 'User segments' })
  segments?: Array<{
    key: string;
    name: string;
    enteredAt: Date;
  }>;
}

export class ProfileQueryDto {
  @ApiPropertyOptional({ description: 'Filter by external user ID' })
  @IsString()
  @IsOptional()
  externalUserId?: string;

  @ApiPropertyOptional({ description: 'Filter by email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Filter by segment key' })
  @IsString()
  @IsOptional()
  segmentKey?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number = 20;
}

export class PaginatedProfilesDto {
  @ApiProperty({ type: [ProfileResponseDto] })
  items: ProfileResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
