import {
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { FreshnessService } from '../services/freshness.service';
import { ContentFreshnessQueryDto } from '../../../common/dto';

@ApiTags('SEO - Content Freshness')
@Controller('seo/content')
export class FreshnessController {
  constructor(private readonly freshnessService: FreshnessService) {}

  @Get('freshness')
  @ApiOperation({
    summary: 'Get content freshness analysis',
    description: 'Detect content decay and get freshness scores for all content',
  })
  @ApiResponse({ status: 200, description: 'Content freshness analysis' })
  async getContentFreshness(
    @Query() query: ContentFreshnessQueryDto,
  ): Promise<any> {
    const result = await this.freshnessService.getContentFreshness(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get('freshness/needs-update/:tenantId')
  @ApiOperation({
    summary: 'Get pages needing update',
    description: 'Get a prioritized list of pages that need content updates',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 20 })
  @ApiResponse({ status: 200, description: 'Pages needing update' })
  async getPagesNeedingUpdate(
    @Param('tenantId') tenantId: string,
    @Query('limit') limit?: number,
  ): Promise<any> {
    const pages = await this.freshnessService.getPagesNeedingUpdate(tenantId, limit);
    return {
      success: true,
      data: pages,
      meta: {
        total: pages.length,
      },
    };
  }

  @Get('freshness/decay/:tenantId')
  @ApiOperation({
    summary: 'Analyze content decay patterns',
    description: 'Get insights into content decay patterns and recommendations',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Content decay analysis' })
  async analyzeDecayPatterns(
    @Param('tenantId') tenantId: string,
  ): Promise<any> {
    const analysis = await this.freshnessService.analyzeDecayPatterns(tenantId);
    return {
      success: true,
      data: analysis,
    };
  }
}
