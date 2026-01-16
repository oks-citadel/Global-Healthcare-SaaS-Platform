import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { LinksService } from '../services/links.service';
import { InternalLinksQueryDto } from '../../../common/dto';

@ApiTags('SEO - Internal Links')
@Controller('seo/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get('internal')
  @ApiOperation({
    summary: 'Get internal linking recommendations',
    description: 'Analyze internal link structure and get recommendations for better internal linking',
  })
  @ApiResponse({ status: 200, description: 'Internal links and recommendations' })
  async getInternalLinks(
    @Query() query: InternalLinksQueryDto,
  ): Promise<any> {
    const result = await this.linksService.getInternalLinks(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get('analysis/:tenantId')
  @ApiOperation({
    summary: 'Analyze link structure',
    description: 'Get comprehensive link structure analysis for a tenant',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Link structure analysis' })
  async analyzeLinkStructure(
    @Param('tenantId') tenantId: string,
  ): Promise<any> {
    const analysis = await this.linksService.analyzeLinkStructure(tenantId);
    return {
      success: true,
      data: analysis,
    };
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create internal link',
    description: 'Create a new internal link between two pages',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourcePageId: { type: 'string', description: 'Source page ID' },
        targetPageId: { type: 'string', description: 'Target page ID' },
        anchorText: { type: 'string', description: 'Link anchor text' },
        linkType: { type: 'string', enum: ['NAVIGATION', 'CONTENT', 'FOOTER', 'SIDEBAR', 'BREADCRUMB', 'RELATED'], default: 'CONTENT' },
      },
      required: ['sourcePageId', 'targetPageId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Link created' })
  async createLink(
    @Body('sourcePageId') sourcePageId: string,
    @Body('targetPageId') targetPageId: string,
    @Body('anchorText') anchorText?: string,
    @Body('linkType') linkType?: string,
  ): Promise<any> {
    await this.linksService.createLink(sourcePageId, targetPageId, anchorText, linkType);
    return {
      success: true,
      message: 'Internal link created',
    };
  }

  @Post('check-broken/:tenantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check for broken links',
    description: 'Scan and identify broken internal links for a tenant',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Broken link check results' })
  async checkBrokenLinks(
    @Param('tenantId') tenantId: string,
  ): Promise<any> {
    const brokenCount = await this.linksService.checkBrokenLinks(tenantId);
    return {
      success: true,
      data: {
        brokenLinksFound: brokenCount,
        message: brokenCount > 0
          ? `Found ${brokenCount} broken internal links`
          : 'No broken links found',
      },
    };
  }

  @Get('recommendations')
  @ApiOperation({
    summary: 'Get link recommendations',
    description: 'Get AI-powered internal linking recommendations',
  })
  @ApiQuery({ name: 'tenant', required: false, description: 'Tenant slug' })
  @ApiQuery({ name: 'maxRecommendations', required: false, type: Number, default: 10 })
  @ApiResponse({ status: 200, description: 'Link recommendations' })
  async getLinkRecommendations(
    @Query('tenant') tenant?: string,
    @Query('maxRecommendations') maxRecommendations?: number,
  ): Promise<any> {
    const recommendations = await this.linksService.generateRecommendations(
      { tenant } as InternalLinksQueryDto,
      maxRecommendations || 10,
    );
    return {
      success: true,
      data: recommendations,
      meta: {
        total: recommendations.length,
      },
    };
  }
}
