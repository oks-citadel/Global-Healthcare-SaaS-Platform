import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PagesService } from '../services/pages.service';
import {
  CreatePageSeoDto,
  UpdatePageSeoDto,
  PageSeoQueryDto,
  PaginationDto,
} from '../../../common/dto';

@ApiTags('SEO - Pages')
@Controller('seo/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':slug')
  @ApiOperation({
    summary: 'Get page SEO metadata',
    description: 'Returns SEO metadata, canonical URL, hreflang tags, and structured data for a page',
  })
  @ApiParam({ name: 'slug', description: 'Page slug/path' })
  @ApiResponse({ status: 200, description: 'Page SEO metadata' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async getPageSeo(
    @Param('slug') slug: string,
    @Query() query: PageSeoQueryDto,
  ): Promise<any> {
    return this.pagesService.getPageSeo(slug, query);
  }

  @Get()
  @ApiOperation({
    summary: 'List all pages',
    description: 'Returns a paginated list of all pages with SEO metadata',
  })
  @ApiQuery({ name: 'tenantId', required: false, description: 'Filter by tenant ID' })
  @ApiResponse({ status: 200, description: 'List of pages' })
  async listPages(
    @Query('tenantId') tenantId?: string,
    @Query() pagination?: PaginationDto,
  ): Promise<any> {
    return this.pagesService.listPages(tenantId, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create page SEO metadata',
    description: 'Create SEO metadata for a new page',
  })
  @ApiBody({ type: CreatePageSeoDto })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 409, description: 'Page already exists' })
  async createPageSeo(
    @Body() dto: CreatePageSeoDto,
  ): Promise<any> {
    const page = await this.pagesService.createPageSeo(dto);
    return { success: true, data: page };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update page SEO metadata',
    description: 'Update SEO metadata for an existing page',
  })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiBody({ type: UpdatePageSeoDto })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 409, description: 'Slug conflict' })
  async updatePageSeo(
    @Param('id') id: string,
    @Body() dto: UpdatePageSeoDto,
  ): Promise<any> {
    const page = await this.pagesService.updatePageSeo(id, dto);
    return { success: true, data: page };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete page SEO metadata',
    description: 'Delete SEO metadata for a page',
  })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({ status: 204, description: 'Page deleted successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async deletePageSeo(
    @Param('id') id: string,
  ): Promise<void> {
    await this.pagesService.deletePageSeo(id);
  }

  @Post(':id/hreflang')
  @ApiOperation({
    summary: 'Generate hreflang tags',
    description: 'Generate hreflang tags for a page based on its translations',
  })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({ status: 200, description: 'Generated hreflang tags' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async generateHreflangTags(
    @Param('id') id: string,
  ): Promise<any> {
    const hreflangTags = await this.pagesService.generateHreflangTags(id);
    return { success: true, data: hreflangTags };
  }

  @Post('bulk-update')
  @ApiOperation({
    summary: 'Bulk update pages',
    description: 'Update multiple pages at once',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        updates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              data: { $ref: '#/components/schemas/UpdatePageSeoDto' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Bulk update result' })
  async bulkUpdatePages(
    @Body('updates') updates: Array<{ id: string; data: UpdatePageSeoDto }>,
  ): Promise<any> {
    const result = await this.pagesService.bulkUpdatePages(updates);
    return { success: true, ...result };
  }
}
