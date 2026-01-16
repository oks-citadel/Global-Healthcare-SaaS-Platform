import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ModerationService } from './moderation.service';

@ApiTags('Community - Moderation')
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
@Controller('community/moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('queue')
  @ApiOperation({ summary: 'Get moderation review queue' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'reviewed', 'all'] })
  @ApiQuery({ name: 'type', required: false, enum: ['post', 'comment', 'all'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Moderation queue retrieved' })
  async getQueue(
    @Headers('x-tenant-id') tenantId: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.moderationService.getQueue(tenantId, { status, type, page, limit });
  }

  @Post('actions')
  @ApiOperation({ summary: 'Execute moderation action' })
  @ApiResponse({ status: 200, description: 'Moderation action executed' })
  async executeAction(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      targetType: 'post' | 'comment';
      targetId: string;
      action: 'approve' | 'reject' | 'hide' | 'delete' | 'warn';
      moderatorId: string;
      reason?: string;
      notes?: string;
    },
  ) {
    return this.moderationService.executeAction(tenantId, dto);
  }

  @Post('report')
  @ApiOperation({ summary: 'Report content for moderation' })
  @ApiResponse({ status: 201, description: 'Content reported successfully' })
  async reportContent(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      targetType: 'post' | 'comment';
      targetId: string;
      reporterId: string;
      reason: string;
      description?: string;
    },
  ) {
    return this.moderationService.reportContent(tenantId, dto);
  }

  @Get('reports/:targetId')
  @ApiOperation({ summary: 'Get reports for content' })
  @ApiParam({ name: 'targetId', description: 'Content ID' })
  @ApiQuery({ name: 'targetType', required: true, enum: ['post', 'comment'] })
  @ApiResponse({ status: 200, description: 'Reports retrieved' })
  async getReports(
    @Headers('x-tenant-id') tenantId: string,
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: 'post' | 'comment',
  ) {
    return this.moderationService.getReports(tenantId, targetType, targetId);
  }

  @Get('history/:targetId')
  @ApiOperation({ summary: 'Get moderation history for content' })
  @ApiParam({ name: 'targetId', description: 'Content ID' })
  @ApiQuery({ name: 'targetType', required: true, enum: ['post', 'comment'] })
  @ApiResponse({ status: 200, description: 'Moderation history retrieved' })
  async getHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: 'post' | 'comment',
  ) {
    return this.moderationService.getHistory(tenantId, targetType, targetId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get moderation statistics' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'Moderation stats retrieved' })
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.moderationService.getStats(tenantId, { startDate, endDate });
  }
}
