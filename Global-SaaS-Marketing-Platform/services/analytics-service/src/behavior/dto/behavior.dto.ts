import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Common query parameters
export class BehaviorBaseQueryDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Project ID filter' })
  @IsOptional()
  @IsString()
  projectId?: string;
}

// Heatmap DTOs
export class HeatmapQueryDto extends BehaviorBaseQueryDto {
  @ApiProperty({ description: 'Page URL to analyze' })
  @IsNotEmpty()
  @IsString()
  pageUrl: string;

  @ApiPropertyOptional({ description: 'Resolution width', default: 1920 })
  @IsOptional()
  @IsNumber()
  @Min(320)
  @Max(3840)
  width?: number;

  @ApiPropertyOptional({ description: 'Resolution height', default: 1080 })
  @IsOptional()
  @IsNumber()
  @Min(480)
  @Max(2160)
  height?: number;

  @ApiPropertyOptional({ description: 'Device type filter', enum: ['desktop', 'mobile', 'tablet'] })
  @IsOptional()
  @IsEnum(['desktop', 'mobile', 'tablet'])
  deviceType?: string;
}

export class HeatmapPointDto {
  @ApiProperty({ description: 'X coordinate' })
  x: number;

  @ApiProperty({ description: 'Y coordinate' })
  y: number;

  @ApiProperty({ description: 'Intensity value (click count)' })
  value: number;
}

export class HeatmapResultDto {
  @ApiProperty({ description: 'Page URL' })
  pageUrl: string;

  @ApiProperty({ description: 'Resolution' })
  resolution: {
    width: number;
    height: number;
  };

  @ApiProperty({ type: [HeatmapPointDto], description: 'Heatmap data points' })
  dataPoints: HeatmapPointDto[];

  @ApiProperty({ description: 'Total clicks analyzed' })
  totalClicks: number;

  @ApiProperty({ description: 'Unique users' })
  uniqueUsers: number;

  @ApiProperty({ description: 'Data capture timestamp' })
  capturedAt: string;
}

// Session Recording DTOs
export class RecordingQueryDto extends BehaviorBaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ description: 'Minimum session duration in seconds' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minDuration?: number;

  @ApiPropertyOptional({ description: 'Maximum number of recordings', default: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by page URL' })
  @IsOptional()
  @IsString()
  pageUrl?: string;

  @ApiPropertyOptional({ description: 'Filter recordings with errors only' })
  @IsOptional()
  hasErrors?: boolean;
}

export class RecordingEventDto {
  @ApiProperty({ description: 'Event timestamp' })
  timestamp: string;

  @ApiProperty({ description: 'Event type' })
  type: string;

  @ApiProperty({ description: 'Event data' })
  data: Record<string, any>;
}

export class RecordingDeviceDto {
  @ApiProperty({ description: 'Device type' })
  type: string;

  @ApiProperty({ description: 'Operating system' })
  os: string;

  @ApiProperty({ description: 'Browser' })
  browser: string;

  @ApiProperty({ description: 'Screen resolution' })
  screenResolution: string;
}

export class SessionRecordingDto {
  @ApiProperty({ description: 'Session ID' })
  sessionId: string;

  @ApiPropertyOptional({ description: 'User ID' })
  userId?: string;

  @ApiProperty({ description: 'Session start time' })
  startTime: string;

  @ApiProperty({ description: 'Session end time' })
  endTime: string;

  @ApiProperty({ description: 'Session duration in seconds' })
  duration: number;

  @ApiProperty({ description: 'Page views in session' })
  pageViews: number;

  @ApiProperty({ type: [RecordingEventDto], description: 'Session events' })
  events: RecordingEventDto[];

  @ApiProperty({ type: RecordingDeviceDto, description: 'Device information' })
  device: RecordingDeviceDto;

  @ApiPropertyOptional({ description: 'Location information' })
  location?: {
    country: string;
    city?: string;
  };
}

export class RecordingResultDto {
  @ApiProperty({ type: [SessionRecordingDto], description: 'Session recordings' })
  recordings: SessionRecordingDto[];

  @ApiProperty({ description: 'Total recordings found' })
  total: number;

  @ApiProperty({ description: 'Average session duration' })
  avgDuration: number;

  @ApiProperty({ description: 'Average page views per session' })
  avgPageViews: number;
}

// Scrollmap DTOs
export class ScrollmapQueryDto extends BehaviorBaseQueryDto {
  @ApiProperty({ description: 'Page URL to analyze' })
  @IsNotEmpty()
  @IsString()
  pageUrl: string;

  @ApiPropertyOptional({ description: 'Device type filter', enum: ['desktop', 'mobile', 'tablet'] })
  @IsOptional()
  @IsEnum(['desktop', 'mobile', 'tablet'])
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Number of fold divisions', default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(100)
  folds?: number;
}

export class ScrollFoldDto {
  @ApiProperty({ description: 'Depth in pixels' })
  depth: number;

  @ApiProperty({ description: 'Percentage of page height' })
  percentage: number;

  @ApiProperty({ description: 'Number of viewers who reached this depth' })
  viewersReached: number;

  @ApiProperty({ description: 'Percentage of total viewers' })
  viewersPercentage: number;
}

export class ScrollmapResultDto {
  @ApiProperty({ description: 'Page URL' })
  pageUrl: string;

  @ApiProperty({ description: 'Resolution' })
  resolution: {
    width: number;
    height: number;
  };

  @ApiProperty({ description: 'Total page height in pixels' })
  pageHeight: number;

  @ApiProperty({ type: [ScrollFoldDto], description: 'Scroll depth data' })
  folds: ScrollFoldDto[];

  @ApiProperty({ description: 'Average scroll depth percentage' })
  avgScrollDepth: number;

  @ApiProperty({ description: 'Total page views analyzed' })
  totalViews: number;
}

// Clickmap DTOs
export class ClickmapQueryDto extends BehaviorBaseQueryDto {
  @ApiProperty({ description: 'Page URL to analyze' })
  @IsNotEmpty()
  @IsString()
  pageUrl: string;

  @ApiPropertyOptional({ description: 'Device type filter', enum: ['desktop', 'mobile', 'tablet'] })
  @IsOptional()
  @IsEnum(['desktop', 'mobile', 'tablet'])
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Minimum clicks to include element', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minClicks?: number;
}

export class ElementPositionDto {
  @ApiProperty({ description: 'X coordinate' })
  x: number;

  @ApiProperty({ description: 'Y coordinate' })
  y: number;

  @ApiProperty({ description: 'Element width' })
  width: number;

  @ApiProperty({ description: 'Element height' })
  height: number;
}

export class ClickmapElementDto {
  @ApiProperty({ description: 'CSS selector' })
  selector: string;

  @ApiProperty({ description: 'HTML element type' })
  elementType: string;

  @ApiPropertyOptional({ description: 'Element text content' })
  text?: string;

  @ApiProperty({ description: 'Total clicks' })
  clicks: number;

  @ApiProperty({ description: 'Unique clicks' })
  uniqueClicks: number;

  @ApiProperty({ description: 'Click rate (clicks per view)' })
  clickRate: number;

  @ApiProperty({ type: ElementPositionDto, description: 'Element position' })
  position: ElementPositionDto;
}

export class ClickmapResultDto {
  @ApiProperty({ description: 'Page URL' })
  pageUrl: string;

  @ApiProperty({ type: [ClickmapElementDto], description: 'Clickable elements data' })
  elements: ClickmapElementDto[];

  @ApiProperty({ description: 'Total clicks on page' })
  totalClicks: number;

  @ApiProperty({ description: 'Unique users who clicked' })
  uniqueClickers: number;

  @ApiProperty({ description: 'Total page views' })
  pageViews: number;
}
