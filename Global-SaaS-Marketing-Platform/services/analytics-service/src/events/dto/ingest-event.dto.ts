import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsObject,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeviceInfoDto {
  @ApiPropertyOptional({ enum: ['desktop', 'mobile', 'tablet', 'other'] })
  @IsOptional()
  @IsEnum(['desktop', 'mobile', 'tablet', 'other'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  os?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  os_version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  browser_version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  screen_width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  screen_height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class GeoInfoDto {
  @ApiPropertyOptional({ description: 'ISO 3166-1 alpha-2 country code' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}

export class UserContextDto {
  @ApiPropertyOptional({ description: 'Authenticated user ID' })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty({ description: 'Anonymous visitor ID' })
  @IsNotEmpty()
  @IsString()
  anonymous_id: string;

  @ApiProperty({ description: 'Session ID' })
  @IsNotEmpty()
  @IsString()
  session_id: string;

  @ApiPropertyOptional({ description: 'User traits/properties' })
  @IsOptional()
  @IsObject()
  traits?: Record<string, any>;
}

export class IngestEventDto {
  @ApiPropertyOptional({ description: 'Unique event ID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  event_id?: string;

  @ApiProperty({ description: 'Event type (e.g., page_view, click, purchase)' })
  @IsNotEmpty()
  @IsString()
  event_type: string;

  @ApiProperty({ description: 'Event timestamp in ISO 8601 format or Unix timestamp' })
  @IsNotEmpty()
  timestamp: string | number;

  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsString()
  organization_id: string;

  @ApiPropertyOptional({ description: 'Project ID within the organization' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiProperty({ description: 'User context information', type: UserContextDto })
  @ValidateNested()
  @Type(() => UserContextDto)
  user: UserContextDto;

  @ApiPropertyOptional({ description: 'Device information', type: DeviceInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  device?: DeviceInfoDto;

  @ApiPropertyOptional({ description: 'Geographic information', type: GeoInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoInfoDto)
  geo?: GeoInfoDto;

  @ApiPropertyOptional({ description: 'Event-specific properties' })
  @IsOptional()
  @IsObject()
  properties?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Additional context' })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class BatchIngestDto {
  @ApiProperty({
    description: 'Array of events to ingest',
    type: [IngestEventDto],
    minItems: 1,
    maxItems: 1000,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => IngestEventDto)
  events: IngestEventDto[];

  @ApiPropertyOptional({ description: 'Batch ID for deduplication' })
  @IsOptional()
  @IsUUID()
  batch_id?: string;

  @ApiPropertyOptional({ description: 'Timestamp when batch was sent' })
  @IsOptional()
  @IsDateString()
  sent_at?: string;
}

export class ValidateEventDto {
  @ApiProperty({ description: 'Event payload to validate' })
  @IsObject()
  event: Record<string, any>;

  @ApiPropertyOptional({ description: 'Specific schema to validate against' })
  @IsOptional()
  @IsString()
  schema?: string;
}

export class IngestResponseDto {
  @ApiProperty({ description: 'Whether the event was successfully ingested' })
  success: boolean;

  @ApiProperty({ description: 'Event ID' })
  event_id: string;

  @ApiPropertyOptional({ description: 'Kinesis sequence number' })
  sequence_number?: string;

  @ApiPropertyOptional({ description: 'Error message if ingestion failed' })
  error?: string;
}

export class BatchIngestResponseDto {
  @ApiProperty({ description: 'Batch ID' })
  batch_id: string;

  @ApiProperty({ description: 'Total events in batch' })
  total: number;

  @ApiProperty({ description: 'Successfully ingested events' })
  success_count: number;

  @ApiProperty({ description: 'Failed events' })
  failed_count: number;

  @ApiPropertyOptional({
    description: 'Details of failed events',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        index: { type: 'number' },
        error: { type: 'string' },
      },
    },
  })
  failures?: Array<{ index: number; error: string }>;
}

export class ValidationResultDto {
  @ApiProperty({ description: 'Whether the event is valid' })
  valid: boolean;

  @ApiPropertyOptional({ description: 'Validated event ID' })
  event_id?: string;

  @ApiPropertyOptional({
    description: 'Validation errors',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        message: { type: 'string' },
        code: { type: 'string' },
      },
    },
  })
  errors?: Array<{ path: string; message: string; code: string }>;
}
