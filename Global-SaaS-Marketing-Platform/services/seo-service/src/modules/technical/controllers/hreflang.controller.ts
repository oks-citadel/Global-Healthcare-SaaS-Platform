import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { HreflangService } from '../services/hreflang.service';
import { HreflangQueryDto } from '../../../common/dto';

@ApiTags('SEO - Hreflang')
@Controller('seo/hreflang')
export class HreflangController {
  constructor(private readonly hreflangService: HreflangService) {}

  @Get()
  @ApiOperation({ summary: 'Get hreflang tag mapping', description: 'Returns hreflang tag mappings and validates implementation' })
  @ApiResponse({ status: 200, description: 'Hreflang mapping data' })
  async getHreflangMapping(@Query() query: HreflangQueryDto): Promise<any> {
    const result = await this.hreflangService.getHreflangMapping(query);
    return { success: true, data: result };
  }

  @Post('group')
  @ApiOperation({ summary: 'Create hreflang group', description: 'Create a new hreflang group for translated pages' })
  @ApiBody({ schema: { type: 'object', properties: { urls: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, locale: { type: 'string' }, region: { type: 'string' } } } } } } })
  @ApiResponse({ status: 201, description: 'Group created' })
  async createGroup(@Body('urls') urls: Array<{ url: string; locale: string; region?: string }>): Promise<any> {
    const groupId = await this.hreflangService.createHreflangGroup(urls);
    return { success: true, data: { groupId } };
  }

  @Post('validate/:tenantId')
  @ApiOperation({ summary: 'Validate hreflang tags', description: 'Validate hreflang implementation for a tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Validation results' })
  async validateTags(@Param('tenantId') tenantId: string): Promise<any> {
    const result = await this.hreflangService.validateHreflangTags(tenantId);
    return { success: true, data: result };
  }
}
