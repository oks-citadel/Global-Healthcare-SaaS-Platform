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
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { SocialService } from './social.service';

@ApiTags('Social - Analytics')
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('share-tracking')
  @ApiOperation({ summary: 'Track social share' })
  @ApiResponse({ status: 201, description: 'Share tracked successfully' })
  async trackShare(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      contentType: 'post' | 'page' | 'article';
      contentId: string;
      platform: string;
      userId?: string;
      metadata?: Record<string, any>;
    },
  ) {
    return this.socialService.trackShare(tenantId, dto);
  }

  @Get('engagement')
  @ApiOperation({ summary: 'Get engagement analytics' })
  @ApiQuery({ name: 'contentType', required: false, enum: ['post', 'page', 'article', 'all'] })
  @ApiQuery({ name: 'contentId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'granularity', required: false, enum: ['hour', 'day', 'week', 'month'] })
  @ApiResponse({ status: 200, description: 'Engagement data retrieved' })
  async getEngagement(
    @Headers('x-tenant-id') tenantId: string,
    @Query('contentType') contentType?: string,
    @Query('contentId') contentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('granularity') granularity?: string,
  ) {
    return this.socialService.getEngagement(tenantId, {
      contentType,
      contentId,
      startDate,
      endDate,
      granularity,
    });
  }

  @Get('sentiment')
  @ApiOperation({ summary: 'Get sentiment analysis on community content' })
  @ApiQuery({ name: 'contentType', required: false, enum: ['post', 'comment', 'all'] })
  @ApiQuery({ name: 'contentId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'Sentiment data retrieved' })
  async getSentiment(
    @Headers('x-tenant-id') tenantId: string,
    @Query('contentType') contentType?: string,
    @Query('contentId') contentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.socialService.getSentiment(tenantId, {
      contentType,
      contentId,
      startDate,
      endDate,
    });
  }

  @Get('shares/summary')
  @ApiOperation({ summary: 'Get share summary by platform' })
  @ApiQuery({ name: 'contentId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'Share summary retrieved' })
  async getShareSummary(
    @Headers('x-tenant-id') tenantId: string,
    @Query('contentId') contentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.socialService.getShareSummary(tenantId, {
      contentId,
      startDate,
      endDate,
    });
  }

  @Get('top-content')
  @ApiOperation({ summary: 'Get top performing content by engagement' })
  @ApiQuery({ name: 'metric', required: false, enum: ['shares', 'reactions', 'comments', 'views'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'period', required: false, enum: ['day', 'week', 'month', 'all'] })
  @ApiResponse({ status: 200, description: 'Top content retrieved' })
  async getTopContent(
    @Headers('x-tenant-id') tenantId: string,
    @Query('metric') metric?: string,
    @Query('limit') limit?: number,
    @Query('period') period?: string,
  ) {
    return this.socialService.getTopContent(tenantId, {
      metric: metric || 'shares',
      limit: limit || 10,
      period: period || 'week',
    });
  }
}
