import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BehaviorService } from './behavior.service';
import {
  HeatmapQueryDto,
  HeatmapResultDto,
  RecordingQueryDto,
  RecordingResultDto,
  ScrollmapQueryDto,
  ScrollmapResultDto,
  ClickmapQueryDto,
  ClickmapResultDto,
} from './dto/behavior.dto';

@ApiTags('Behavior')
@ApiBearerAuth()
@Controller({ path: 'analytics', version: '1' })
export class BehaviorController {
  constructor(private readonly behaviorService: BehaviorService) {}

  @Get('heatmaps')
  @ApiOperation({
    summary: 'Get heatmap data',
    description: `
Retrieves click heatmap data for a specific page URL.

**Features:**
- Aggregated click coordinates
- Resolution-aware data
- Device type filtering
- Date range filtering

**Output:**
- Grid of data points with x, y coordinates and intensity values
- Total click count and unique users

**Use Cases:**
- Identify high-engagement areas
- Optimize CTA placement
- Understand user attention patterns
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Heatmap data',
    type: HeatmapResultDto,
  })
  async getHeatmaps(@Query() query: HeatmapQueryDto): Promise<HeatmapResultDto> {
    return this.behaviorService.getHeatmapData(query);
  }

  @Get('recordings')
  @ApiOperation({
    summary: 'Get session recordings',
    description: `
Retrieves session recording data for replay and analysis.

**Features:**
- Full session event timeline
- Device and location information
- Duration and page view counts
- Filtering by user, duration, or error status

**Events Captured:**
- Mouse movements and clicks
- Scroll events
- Form inputs (masked)
- Page navigations
- Window resize

**Use Cases:**
- Debug user issues
- Understand user behavior patterns
- Identify UX problems
- Validate conversion funnels
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Session recordings',
    type: RecordingResultDto,
  })
  async getRecordings(@Query() query: RecordingQueryDto): Promise<RecordingResultDto> {
    return this.behaviorService.getRecordings(query);
  }

  @Get('scrollmaps')
  @ApiOperation({
    summary: 'Get scroll depth data',
    description: `
Analyzes scroll behavior to understand how far users scroll on a page.

**Features:**
- Percentage of users reaching each page depth
- Configurable fold divisions
- Device type filtering
- Average scroll depth calculation

**Output:**
- Fold-by-fold breakdown of viewer reach
- Average scroll depth percentage
- Total page views analyzed

**Use Cases:**
- Optimize content placement
- Identify content engagement dropoff
- Determine ideal page length
- Test content effectiveness
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Scroll depth data',
    type: ScrollmapResultDto,
  })
  async getScrollmaps(@Query() query: ScrollmapQueryDto): Promise<ScrollmapResultDto> {
    return this.behaviorService.getScrollmapData(query);
  }

  @Get('clickmaps')
  @ApiOperation({
    summary: 'Get click pattern data',
    description: `
Analyzes clicks by element to understand interaction patterns.

**Features:**
- Element-level click aggregation
- Click rate calculation
- Position data for visualization
- Device type filtering

**Element Data:**
- CSS selector and element type
- Total and unique clicks
- Click rate (clicks per page view)
- Element position and size

**Use Cases:**
- Identify popular interactive elements
- Find underperforming CTAs
- Optimize page layout
- A/B test element placement
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Click pattern data',
    type: ClickmapResultDto,
  })
  async getClickmaps(@Query() query: ClickmapQueryDto): Promise<ClickmapResultDto> {
    return this.behaviorService.getClickmapData(query);
  }
}
