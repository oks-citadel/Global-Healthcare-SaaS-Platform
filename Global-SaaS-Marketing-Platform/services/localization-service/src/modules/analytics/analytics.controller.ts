import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('regional')
  @ApiOperation({ summary: 'Get regional analytics' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'locale', required: false })
  async getRegionalAnalytics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('region') region?: string,
    @Query('locale') locale?: string,
  ) {
    return this.analyticsService.getRegionalAnalytics(tenantId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      region,
      locale,
    });
  }

  @Post('record')
  @ApiOperation({ summary: 'Record analytics data' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async recordAnalytics(
    @Headers('x-tenant-id') tenantId: string,
    @Body()
    dto: {
      date: Date;
      region: string;
      locale: string;
      visitors: number;
      pageViews: number;
      sessions: number;
      conversions: number;
      revenue: number;
      currencyCode: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.analyticsService.recordAnalytics(tenantId, dto);
  }
}
