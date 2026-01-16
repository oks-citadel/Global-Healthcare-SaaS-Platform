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
import { MentionsService } from './mentions.service';

@ApiTags('mentions')
@ApiBearerAuth()
@Controller('reputation/mentions')
export class MentionsController {
  constructor(private readonly mentionsService: MentionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get social mentions' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'sentiment', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getMentions(
    @Headers('x-tenant-id') tenantId: string,
    @Query('platform') platform?: string,
    @Query('sentiment') sentiment?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.mentionsService.getMentions(tenantId, {
      platform,
      sentiment,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create social mention' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async createMention(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      platform: string;
      externalId: string;
      authorName: string;
      authorHandle?: string;
      authorFollowers?: number;
      content: string;
      url?: string;
      reach?: number;
      engagement?: Record<string, number>;
      tags?: string[];
      metadata?: Record<string, unknown>;
      mentionedAt: Date;
    },
  ) {
    return this.mentionsService.createMention(tenantId, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get mention statistics' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async getMentionStats(@Headers('x-tenant-id') tenantId: string) {
    return this.mentionsService.getMentionStats(tenantId);
  }
}
