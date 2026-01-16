import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsEmail,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ListType {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
  SUPPRESSION = 'SUPPRESSION',
}

export enum ListStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  PAUSED = 'PAUSED',
}

export enum SubscriberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  BOUNCED = 'BOUNCED',
  COMPLAINED = 'COMPLAINED',
  CLEANED = 'CLEANED',
}

export class CreateListDto {
  @ApiProperty({ description: 'List name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'List description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ListType, default: ListType.STATIC })
  @IsEnum(ListType)
  @IsOptional()
  type?: ListType;

  @ApiPropertyOptional({ description: 'Require double opt-in', default: false })
  @IsBoolean()
  @IsOptional()
  doubleOptIn?: boolean;

  @ApiPropertyOptional({ description: 'Welcome email template ID' })
  @IsString()
  @IsOptional()
  welcomeEmailId?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateListDto extends PartialType(CreateListDto) {
  @ApiPropertyOptional({ enum: ListStatus })
  @IsEnum(ListStatus)
  @IsOptional()
  status?: ListStatus;
}

export class AddSubscriberDto {
  @ApiProperty({ description: 'Subscriber email' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'First name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Subscription source' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Source ID (form ID, campaign ID, etc.)' })
  @IsString()
  @IsOptional()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class BulkAddSubscribersDto {
  @ApiProperty({ description: 'List of subscribers to add', type: [AddSubscriberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddSubscriberDto)
  subscribers: AddSubscriberDto[];

  @ApiPropertyOptional({ description: 'Skip duplicates instead of updating', default: false })
  @IsBoolean()
  @IsOptional()
  skipDuplicates?: boolean;
}

export class ListResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ListType })
  type: ListType;

  @ApiProperty({ enum: ListStatus })
  status: ListStatus;

  @ApiProperty()
  doubleOptIn: boolean;

  @ApiPropertyOptional()
  welcomeEmailId?: string;

  @ApiProperty()
  subscriberCount: number;

  @ApiProperty()
  unsubscribeCount: number;

  @ApiProperty()
  bounceCount: number;

  @ApiProperty()
  complaintCount: number;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SubscriberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  listId: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty({ enum: SubscriberStatus })
  status: SubscriberStatus;

  @ApiPropertyOptional()
  source?: string;

  @ApiPropertyOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional()
  confirmedAt?: Date;

  @ApiPropertyOptional()
  unsubscribedAt?: Date;

  @ApiProperty()
  createdAt: Date;
}
