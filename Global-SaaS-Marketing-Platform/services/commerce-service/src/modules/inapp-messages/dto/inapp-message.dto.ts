import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MessageType {
  BANNER = 'BANNER',
  MODAL = 'MODAL',
  TOOLTIP = 'TOOLTIP',
  SLIDEOUT = 'SLIDEOUT',
  FULLSCREEN = 'FULLSCREEN',
}

export enum TriggerType {
  PAGE_VIEW = 'PAGE_VIEW',
  EVENT = 'EVENT',
  TIME_BASED = 'TIME_BASED',
  SCROLL_DEPTH = 'SCROLL_DEPTH',
  EXIT_INTENT = 'EXIT_INTENT',
  INACTIVITY = 'INACTIVITY',
}

export enum MessageFrequency {
  ONCE = 'ONCE',
  ONCE_PER_SESSION = 'ONCE_PER_SESSION',
  ALWAYS = 'ALWAYS',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export enum TriggerAction {
  IMPRESSION = 'IMPRESSION',
  CLICK = 'CLICK',
  DISMISS = 'DISMISS',
  CONVERT = 'CONVERT',
}

export class TriggerConfigDto {
  @ApiPropertyOptional({ description: 'Page URL pattern' })
  @IsString()
  @IsOptional()
  pagePattern?: string;

  @ApiPropertyOptional({ description: 'Event name' })
  @IsString()
  @IsOptional()
  eventName?: string;

  @ApiPropertyOptional({ description: 'Delay in seconds' })
  @IsNumber()
  @IsOptional()
  delaySeconds?: number;

  @ApiPropertyOptional({ description: 'Scroll depth percentage' })
  @IsNumber()
  @IsOptional()
  scrollDepth?: number;

  @ApiPropertyOptional({ description: 'Inactivity timeout in seconds' })
  @IsNumber()
  @IsOptional()
  inactivityTimeout?: number;
}

export class TargetingDto {
  @ApiPropertyOptional({ description: 'Target user segments' })
  @IsOptional()
  segments?: string[];

  @ApiPropertyOptional({ description: 'Target user traits' })
  @IsObject()
  @IsOptional()
  traits?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Target platforms' })
  @IsOptional()
  platforms?: string[];

  @ApiPropertyOptional({ description: 'Target countries' })
  @IsOptional()
  countries?: string[];
}

export class CreateInAppMessageDto {
  @ApiProperty({ description: 'Unique message key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Message name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Message type', enum: MessageType })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({ description: 'Message title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Message body content' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ description: 'CTA button text' })
  @IsString()
  @IsOptional()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'CTA button URL' })
  @IsString()
  @IsOptional()
  ctaUrl?: string;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Targeting configuration', type: TargetingDto })
  @IsObject()
  @IsOptional()
  targeting?: TargetingDto;

  @ApiProperty({ description: 'Trigger type', enum: TriggerType })
  @IsEnum(TriggerType)
  triggerType: TriggerType;

  @ApiPropertyOptional({ description: 'Trigger configuration', type: TriggerConfigDto })
  @IsObject()
  @IsOptional()
  triggerConfig?: TriggerConfigDto;

  @ApiPropertyOptional({ description: 'Message frequency', enum: MessageFrequency, default: MessageFrequency.ONCE })
  @IsEnum(MessageFrequency)
  @IsOptional()
  frequency?: MessageFrequency;

  @ApiPropertyOptional({ description: 'Priority (higher = more important)', default: 0 })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: 'Whether message is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Message start date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Message end date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

export class UpdateInAppMessageDto extends PartialType(CreateInAppMessageDto) {}

export class InAppMessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiPropertyOptional()
  ctaText?: string;

  @ApiPropertyOptional()
  ctaUrl?: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  targeting?: TargetingDto;

  @ApiProperty({ enum: TriggerType })
  triggerType: TriggerType;

  @ApiPropertyOptional()
  triggerConfig?: TriggerConfigDto;

  @ApiProperty({ enum: MessageFrequency })
  frequency: MessageFrequency;

  @ApiProperty()
  priority: number;

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
  dismissals: number;

  @ApiProperty()
  clickRate: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetMessagesDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Current page URL' })
  @IsString()
  @IsOptional()
  pageUrl?: string;

  @ApiPropertyOptional({ description: 'Trigger event name' })
  @IsString()
  @IsOptional()
  event?: string;

  @ApiPropertyOptional({ description: 'Platform' })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional({ description: 'Maximum messages to return', default: 1 })
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class TriggerMessageDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Action type', enum: TriggerAction })
  @IsEnum(TriggerAction)
  action: TriggerAction;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class TriggerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  messageId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: TriggerAction })
  action: TriggerAction;

  @ApiProperty()
  triggeredAt: Date;
}

export class MessageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by type', enum: MessageType })
  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @ApiPropertyOptional({ description: 'Search by name or key' })
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

export class PaginatedMessagesDto {
  @ApiProperty({ type: [InAppMessageResponseDto] })
  items: InAppMessageResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
