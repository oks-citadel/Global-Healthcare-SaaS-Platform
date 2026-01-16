import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { create } from 'xmlbuilder2';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../common/cache/redis.service';
import { SeoConfig } from '../../../config/configuration';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  alternates?: Array<{ hreflang: string; href: string }>;
  images?: Array<{ loc: string; title?: string; caption?: string }>;
}

interface SitemapIndex {
  loc: string;
  lastmod?: string;
}

@Injectable()
export class SitemapService {
  private readonly logger = new Logger(SitemapService.name);
  private readonly seoConfig: SeoConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.seoConfig = this.configService.get<SeoConfig>('seo')!;
  }

  /**
   * Generate the main sitemap index for all tenants
   */
  async generateSitemapIndex(): Promise<string> {
    const cacheKey = 'sitemap:index';
    const cached = await this.redis.get<string>(cacheKey);
    if (cached) return cached;

    const tenants = await this.prisma.tenant.findMany({
      where: { isActive: true },
      select: { slug: true, supportedLocales: true, updatedAt: true },
    });

    const sitemaps: SitemapIndex[] = [];

    for (const tenant of tenants) {
      for (const locale of tenant.supportedLocales) {
        sitemaps.push({
          loc: `${this.getBaseUrl()}/seo/sitemap/${tenant.slug}/${locale}.xml`,
          lastmod: tenant.updatedAt.toISOString(),
        });
      }
    }

    const xml = this.buildSitemapIndex(sitemaps);
    await this.redis.set(cacheKey, xml, 3600); // Cache for 1 hour
    return xml;
  }

  /**
   * Generate tenant-specific localized sitemap
   */
  async generateTenantSitemap(
    tenantSlug: string,
    locale: string,
    forceRefresh = false,
  ): Promise<string> {
    // Check cache first
    const cacheKey = `sitemap:${tenantSlug}:${locale}`;
    if (!forceRefresh) {
      const cached = await this.redis.getSitemap(tenantSlug, locale);
      if (cached) return cached;
    }

    // Find tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant '${tenantSlug}' not found`);
    }

    if (!tenant.supportedLocales.includes(locale)) {
      throw new NotFoundException(
        `Locale '${locale}' not supported for tenant '${tenantSlug}'`,
      );
    }

    // Get all published pages for this tenant and locale
    const pages = await this.prisma.page.findMany({
      where: {
        tenantId: tenant.id,
        locale,
        isPublished: true,
        isIndexable: true,
      },
      orderBy: { lastModified: 'desc' },
      take: this.seoConfig.sitemapMaxUrls,
    });

    // Build sitemap URLs
    const urls: SitemapUrl[] = pages.map((page) => {
      const url: SitemapUrl = {
        loc: this.buildPageUrl(tenant.domain, page.slug, locale),
        lastmod: page.lastModified.toISOString(),
        changefreq: page.changeFrequency.toLowerCase(),
        priority: page.priority,
      };

      // Add hreflang alternates if available
      if (page.hreflangTags) {
        url.alternates = Object.entries(page.hreflangTags as Record<string, string>).map(
          ([lang, href]) => ({
            hreflang: lang,
            href,
          }),
        );
      }

      return url;
    });

    const xml = this.buildSitemap(urls);
    const etag = this.generateEtag(xml);

    // Cache the sitemap
    await this.redis.setSitemap(tenantSlug, xml, locale, undefined, etag);

    // Update database
    await this.prisma.sitemap.upsert({
      where: {
        tenantId_locale_type: {
          tenantId: tenant.id,
          locale,
          type: 'PAGES',
        },
      },
      update: {
        xmlContent: xml,
        urlCount: urls.length,
        etag,
        lastGenerated: new Date(),
        cacheExpiry: new Date(Date.now() + 3600000),
        generationError: null,
      },
      create: {
        tenantId: tenant.id,
        locale,
        type: 'PAGES',
        xmlContent: xml,
        urlCount: urls.length,
        etag,
        lastGenerated: new Date(),
        cacheExpiry: new Date(Date.now() + 3600000),
      },
    });

    return xml;
  }

  /**
   * Get sitemap ETag for conditional requests
   */
  async getSitemapEtag(tenantSlug: string, locale: string): Promise<string | null> {
    return this.redis.getSitemapEtag(tenantSlug, locale);
  }

  /**
   * Invalidate sitemap cache
   */
  async invalidateSitemap(tenantSlug: string, locale?: string): Promise<void> {
    if (locale) {
      await this.redis.invalidateSitemap(tenantSlug, locale);
    } else {
      await this.redis.invalidateAllSitemaps(tenantSlug);
    }

    this.logger.log(
      `Invalidated sitemap cache for tenant: ${tenantSlug}${locale ? `, locale: ${locale}` : ''}`,
    );
  }

  /**
   * Build XML sitemap index
   */
  private buildSitemapIndex(sitemaps: SitemapIndex[]): string {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('sitemapindex', {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      });

    for (const sitemap of sitemaps) {
      const sitemapEle = root.ele('sitemap');
      sitemapEle.ele('loc').txt(sitemap.loc);
      if (sitemap.lastmod) {
        sitemapEle.ele('lastmod').txt(sitemap.lastmod);
      }
    }

    return root.end({ prettyPrint: true });
  }

  /**
   * Build XML sitemap
   */
  private buildSitemap(urls: SitemapUrl[]): string {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('urlset', {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      });

    for (const url of urls) {
      const urlEle = root.ele('url');
      urlEle.ele('loc').txt(url.loc);

      if (url.lastmod) {
        urlEle.ele('lastmod').txt(url.lastmod);
      }
      if (url.changefreq) {
        urlEle.ele('changefreq').txt(url.changefreq);
      }
      if (url.priority !== undefined) {
        urlEle.ele('priority').txt(url.priority.toFixed(1));
      }

      // Add hreflang alternates
      if (url.alternates) {
        for (const alt of url.alternates) {
          urlEle.ele('xhtml:link', {
            rel: 'alternate',
            hreflang: alt.hreflang,
            href: alt.href,
          });
        }
      }

      // Add images
      if (url.images) {
        for (const img of url.images) {
          const imgEle = urlEle.ele('image:image');
          imgEle.ele('image:loc').txt(img.loc);
          if (img.title) imgEle.ele('image:title').txt(img.title);
          if (img.caption) imgEle.ele('image:caption').txt(img.caption);
        }
      }
    }

    return root.end({ prettyPrint: true });
  }

  /**
   * Build page URL
   */
  private buildPageUrl(domain: string, slug: string, locale: string): string {
    const baseUrl = `https://${domain}`;
    if (locale === this.seoConfig.defaultLocale) {
      return `${baseUrl}/${slug}`;
    }
    return `${baseUrl}/${locale}/${slug}`;
  }

  /**
   * Get base URL for sitemap index
   */
  private getBaseUrl(): string {
    const host = this.configService.get('app.host');
    const port = this.configService.get('app.port');
    const prefix = this.configService.get('app.apiPrefix');
    return `https://${host}:${port}${prefix}`;
  }

  /**
   * Generate ETag for sitemap
   */
  private generateEtag(content: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Get sitemap statistics
   */
  async getSitemapStats(tenantId?: string): Promise<{
    totalSitemaps: number;
    totalUrls: number;
    byTenant: Array<{ tenantSlug: string; urlCount: number; lastGenerated: Date | null }>;
  }> {
    const where = tenantId ? { tenantId } : {};

    const sitemaps = await this.prisma.sitemap.findMany({
      where,
      include: { tenant: { select: { slug: true } } },
    });

    const totalUrls = sitemaps.reduce((sum, s) => sum + s.urlCount, 0);

    const byTenant = sitemaps.map((s) => ({
      tenantSlug: s.tenant.slug,
      urlCount: s.urlCount,
      lastGenerated: s.lastGenerated,
    }));

    return {
      totalSitemaps: sitemaps.length,
      totalUrls,
      byTenant,
    };
  }
}
