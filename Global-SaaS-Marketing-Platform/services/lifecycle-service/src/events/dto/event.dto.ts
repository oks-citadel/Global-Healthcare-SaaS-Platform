import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsEmail, IsDateString } from 'class-validator';

export class TrackEventDto {
  @ApiProperty({ description: 'Event name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Contact ID' })
  @IsString()
  @IsOptional()
  contactId?: string;

  @ApiPropertyOptional({ description: 'Event properties' })
  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Event source' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Session ID' })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiPropertyOptional({ description: 'Event timestamp' })
  @IsDateString()
  @IsOptional()
  timestamp?: string;
}

export class EventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  contactEmail?: string;

  @ApiPropertyOptional()
  contactId?: string;

  @ApiPropertyOptional()
  properties?: Record<string, any>;

  @ApiPropertyOptional()
  source?: string;

  @ApiPropertyOptional()
  sessionId?: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  createdAt: Date;
}

export class EventQueryDto {
  @ApiPropertyOptional({ description: 'Filter by event name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by contact email' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Filter by contact ID' })
  @IsString()
  @IsOptional()
  contactId?: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
