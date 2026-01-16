import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { VitalsService } from '../services/vitals.service';
import { WebVitalsQueryDto } from '../../../common/dto';

@ApiTags('SEO - Core Web Vitals')
@Controller('seo/vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Core Web Vitals', description: 'Returns Core Web Vitals (LCP, CLS, INP) for pages' })
  @ApiResponse({ status: 200, description: 'Web Vitals data' })
  async getWebVitals(@Query() query: WebVitalsQueryDto): Promise<any> {
    const result = await this.vitalsService.getWebVitals(query);
    return { success: true, ...result };
  }

  @Post('measure')
  @ApiOperation({ summary: 'Measure Web Vitals', description: 'Run a new Web Vitals measurement for a URL' })
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string' }, tenantId: { type: 'string' }, deviceType: { type: 'string', enum: ['mobile', 'desktop'] } } } })
  @ApiResponse({ status: 200, description: 'Measurement results' })
  async measureVitals(@Body('url') url: string, @Body('tenantId') tenantId?: string, @Body('deviceType') deviceType?: 'mobile' | 'desktop'): Promise<any> {
    const result = await this.vitalsService.measureVitals(url, tenantId, deviceType);
    return { success: true, data: result };
  }

  @Get('history/:url')
  @ApiOperation({ summary: 'Get vitals history', description: 'Get historical Web Vitals data for a URL' })
  @ApiParam({ name: 'url', description: 'Encoded URL' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Historical vitals data' })
  async getVitalsHistory(@Param('url') url: string, @Query('days') days?: number, @Query('deviceType') deviceType?: string): Promise<any> {
    const result = await this.vitalsService.getVitalsHistory(decodeURIComponent(url), days, deviceType);
    return { success: true, data: result };
  }

  @Get('summary/:tenantId')
  @ApiOperation({ summary: 'Get tenant vitals summary', description: 'Get aggregated Web Vitals summary for a tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Vitals summary' })
  async getTenantSummary(@Param('tenantId') tenantId: string): Promise<any> {
    const result = await this.vitalsService.getTenantVitalsSummary(tenantId);
    return { success: true, data: result };
  }
}
