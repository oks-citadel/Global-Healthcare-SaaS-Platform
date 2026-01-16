import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import {
  FunnelQueryDto,
  FunnelResultDto,
  CohortQueryDto,
  CohortResultDto,
  RetentionQueryDto,
  RetentionResultDto,
  LtvQueryDto,
  LtvResultDto,
  ChurnQueryDto,
  ChurnResultDto,
  SessionQueryDto,
  SessionResultDto,
} from './dto/analytics.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('funnels')
  @ApiOperation({
    summary: 'Get funnel analysis',
    description: `
Analyzes conversion funnels to understand how users progress through a series of steps.

**Features:**
- Define custom funnel steps with event types
- Configure conversion window
- Optional strict ordering (steps must occur in sequence)
- Per-step conversion and dropoff rates
- Average time to complete funnel
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Funnel analysis results',
    type: FunnelResultDto,
  })
  async getFunnels(@Query() query: FunnelQueryDto): Promise<FunnelResultDto> {
    return this.analyticsService.analyzeFunnel(query);
  }

  @Post('funnels')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze funnel (POST)',
    description: 'Same as GET /funnels but accepts complex query in request body',
  })
  @ApiResponse({
    status: 200,
    description: 'Funnel analysis results',
    type: FunnelResultDto,
  })
  async analyzeFunnel(@Body() query: FunnelQueryDto): Promise<FunnelResultDto> {
    return this.analyticsService.analyzeFunnel(query);
  }

  @Get('cohorts')
  @ApiOperation({
    summary: 'Get cohort analysis',
    description: `
Analyzes user cohorts to understand retention patterns over time.

**Cohort Types:**
- \`first_event\` - Group by first occurrence of an event (e.g., signup)
- \`property\` - Group by user property value
- \`date_range\` - Group by specific date range

**Features:**
- Customizable period type (day, week, month)
- Retention event filtering
- Multiple period analysis
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Cohort analysis results',
    type: CohortResultDto,
  })
  async getCohorts(@Query() query: CohortQueryDto): Promise<CohortResultDto> {
    return this.analyticsService.analyzeCohort(query);
  }

  @Post('cohorts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze cohort (POST)',
    description: 'Same as GET /cohorts but accepts complex query in request body',
  })
  @ApiResponse({
    status: 200,
    description: 'Cohort analysis results',
    type: CohortResultDto,
  })
  async analyzeCohort(@Body() query: CohortQueryDto): Promise<CohortResultDto> {
    return this.analyticsService.analyzeCohort(query);
  }

  @Get('retention')
  @ApiOperation({
    summary: 'Get retention curves',
    description: `
Generates retention curves showing how user engagement changes over time.

**Metrics:**
- Day N retention rates
- Cohort sizes
- Rolling retention averages

**Use Cases:**
- Identify critical retention periods
- Compare retention across user segments
- Measure impact of product changes
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Retention curve data',
    type: RetentionResultDto,
  })
  async getRetention(@Query() query: RetentionQueryDto): Promise<RetentionResultDto> {
    return this.analyticsService.analyzeRetention(query);
  }

  @Get('ltv')
  @ApiOperation({
    summary: 'Get customer lifetime value',
    description: `
Calculates Customer Lifetime Value (LTV/CLV) across cohorts.

**Metrics:**
- Average and median LTV per cohort
- Total revenue by cohort
- Average purchases per customer
- Customer lifespan
- Projected LTV

**Use Cases:**
- Determine CAC:LTV ratios
- Identify high-value customer segments
- Forecast revenue
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'LTV analysis results',
    type: LtvResultDto,
  })
  async getLTV(@Query() query: LtvQueryDto): Promise<LtvResultDto> {
    return this.analyticsService.analyzeLTV(query);
  }

  @Get('churn')
  @ApiOperation({
    summary: 'Get churn analysis',
    description: `
Analyzes user churn patterns to understand customer attrition.

**Metrics:**
- Churn rate by period
- Retention rate
- New vs. churned users
- Net growth

**Configuration:**
- Customizable churn threshold (days of inactivity)
- Period granularity (day, week, month)
- Activity event filtering
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Churn analysis results',
    type: ChurnResultDto,
  })
  async getChurn(@Query() query: ChurnQueryDto): Promise<ChurnResultDto> {
    return this.analyticsService.analyzeChurn(query);
  }

  @Get('sessions')
  @ApiOperation({
    summary: 'Get session analytics',
    description: `
Provides detailed session-level analytics.

**Metrics:**
- Total sessions and unique users
- Session duration (average and median)
- Events per session
- Bounce rate
- Pages per session

**Use Cases:**
- Understand user engagement depth
- Identify UX issues
- Measure content effectiveness
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Session analytics data',
    type: SessionResultDto,
  })
  async getSessions(@Query() query: SessionQueryDto): Promise<SessionResultDto> {
    return this.analyticsService.analyzeSessions(query);
  }
}
