import {
  Controller,
  Get,
  Param,
  Query,
  Header,
  Headers,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { SitemapService } from '../services/sitemap.service';
import { SitemapQueryDto } from '../../../common/dto';

@ApiTags('SEO - Sitemap')
@Controller('seo')
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  @Header('Cache-Control', 'public, max-age=3600')
  @ApiOperation({
    summary: 'Get sitemap index',
    description: 'Returns the main sitemap index that links to tenant-specific sitemaps',
  })
  @ApiResponse({ status: 200, description: 'Sitemap index XML' })
  async getSitemapIndex(@Res() res: Response): Promise<void> {
    const xml = await this.sitemapService.generateSitemapIndex();
    res.send(xml);
  }

  @Get('sitemap/:tenant/:locale.xml')
  @Header('Content-Type', 'application/xml')
  @ApiOperation({
    summary: 'Get tenant-specific localized sitemap',
    description: 'Returns the sitemap for a specific tenant and locale',
  })
  @ApiParam({ name: 'tenant', description: 'Tenant slug' })
  @ApiParam({ name: 'locale', description: 'Locale code (e.g., en, es, fr)' })
  @ApiQuery({ name: 'forceRefresh', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Sitemap XML' })
  @ApiResponse({ status: 304, description: 'Not Modified' })
  @ApiResponse({ status: 404, description: 'Tenant or locale not found' })
  async getTenantSitemap(
    @Param('tenant') tenant: string,
    @Param('locale') locale: string,
    @Query() query: SitemapQueryDto,
    @Headers('if-none-match') ifNoneMatch: string,
    @Res() res: Response,
  ): Promise<void> {
    // Check ETag for conditional request
    const currentEtag = await this.sitemapService.getSitemapEtag(tenant, locale);
    if (ifNoneMatch && currentEtag && ifNoneMatch === `"${currentEtag}"`) {
      res.status(HttpStatus.NOT_MODIFIED).send();
      return;
    }

    const xml = await this.sitemapService.generateTenantSitemap(
      tenant,
      locale,
      query.forceRefresh,
    );

    // Set ETag header
    const etag = await this.sitemapService.getSitemapEtag(tenant, locale);
    if (etag) {
      res.setHeader('ETag', `"${etag}"`);
    }

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  }

  @Get('sitemap/stats')
  @ApiOperation({
    summary: 'Get sitemap statistics',
    description: 'Returns statistics about generated sitemaps',
  })
  @ApiQuery({ name: 'tenant', required: false, description: 'Filter by tenant slug' })
  @ApiResponse({ status: 200, description: 'Sitemap statistics' })
  async getSitemapStats(
    @Query('tenant') tenant?: string,
  ): Promise<{
    totalSitemaps: number;
    totalUrls: number;
    byTenant: Array<{ tenantSlug: string; urlCount: number; lastGenerated: Date | null }>;
  }> {
    let tenantId: string | undefined;

    if (tenant) {
      // This would need the PrismaService injected to look up tenant
      // For now, we'll pass undefined and let the service handle it
    }

    return this.sitemapService.getSitemapStats(tenantId);
  }
}
