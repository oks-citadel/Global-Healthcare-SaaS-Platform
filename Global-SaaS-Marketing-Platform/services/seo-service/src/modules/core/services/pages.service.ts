import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../common/cache/redis.service';
import { CreatePageSeoDto, UpdatePageSeoDto, PageSeoQueryDto, PaginationDto } from '../../../common/dto';
import { SeoConfig } from '../../../config/configuration';

interface PageSeoResponse {
  id: string;
  slug: string;
  locale: string;
  title: string;
  metaDescription?: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  hreflangTags?: Record<string, string>;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  robotsDirectives: string;
  structuredData?: any;
  priority: number;
  changeFrequency: string;
  isPublished: boolean;
  isIndexable: boolean;
  lastModified: Date;
}

@Injectable()
export class PagesService {
  private readonly logger = new Logger(PagesService.name);
  private readonly seoConfig: SeoConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.seoConfig = this.configService.get<SeoConfig>('seo')!;
  }

  /**
   * Get SEO metadata for a page by slug
   */
  async getPageSeo(slug: string, query: PageSeoQueryDto): Promise<PageSeoResponse> {
    const locale = query.locale || this.seoConfig.defaultLocale;

    // Check cache first
    const cacheKey = `page:${slug}:${locale}`;
    const cached = await this.redis.getPageSeo<PageSeoResponse>(slug, locale);
    if (cached) return cached;

    // Build query filter
    const where: any = { slug, locale };
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: query.tenant },
      });
      if (tenant) {
        where.tenantId = tenant.id;
      }
    }

    const page = await this.prisma.page.findFirst({
      where,
      include: {
        tenant: { select: { domain: true, defaultLocale: true } },
      },
    });

    if (!page) {
      throw new NotFoundException(
        `Page with slug '${slug}' and locale '${locale}' not found`,
      );
    }

    // Build response
    const response: PageSeoResponse = {
      id: page.id,
      slug: page.slug,
      locale: page.locale,
      title: page.title,
      metaDescription: page.metaDescription || undefined,
      metaKeywords: page.metaKeywords,
      canonicalUrl: page.canonicalUrl || this.buildCanonicalUrl(page.tenant.domain, page.slug, page.locale, page.tenant.defaultLocale),
      openGraph: {
        title: page.ogTitle || page.title,
        description: page.ogDescription || page.metaDescription || undefined,
        image: page.ogImage || undefined,
        type: page.ogType || 'website',
      },
      twitter: {
        card: page.twitterCard || 'summary_large_image',
        title: page.twitterTitle || page.ogTitle || page.title,
        description: page.twitterDescription || page.ogDescription || page.metaDescription || undefined,
        image: page.twitterImage || page.ogImage || undefined,
      },
      robotsDirectives: page.robotsDirectives || 'index, follow',
      priority: page.priority,
      changeFrequency: page.changeFrequency.toLowerCase(),
      isPublished: page.isPublished,
      isIndexable: page.isIndexable,
      lastModified: page.lastModified,
    };

    // Include hreflang if requested
    if (query.includeHreflang && page.hreflangTags) {
      response.hreflangTags = page.hreflangTags as Record<string, string>;
    }

    // Include structured data if requested
    if (query.includeStructuredData && page.structuredData) {
      response.structuredData = page.structuredData;
    }

    // Cache the response
    await this.redis.setPageSeo(slug, response, locale);

    return response;
  }

  /**
   * Create SEO metadata for a new page
   */
  async createPageSeo(dto: CreatePageSeoDto): Promise<PageSeoResponse> {
    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID '${dto.tenantId}' not found`);
    }

    // Check for duplicate
    const existing = await this.prisma.page.findUnique({
      where: {
        tenantId_slug_locale: {
          tenantId: dto.tenantId,
          slug: dto.slug,
          locale: dto.locale || 'en',
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Page with slug '${dto.slug}' and locale '${dto.locale}' already exists`,
      );
    }

    // Create page
    const page = await this.prisma.page.create({
      data: {
        tenantId: dto.tenantId,
        slug: dto.slug,
        locale: dto.locale || 'en',
        title: dto.title,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords || [],
        canonicalUrl: dto.canonicalUrl,
        hreflangTags: dto.hreflangTags as any,
        ogTitle: dto.ogTitle,
        ogDescription: dto.ogDescription,
        ogImage: dto.ogImage,
        ogType: dto.ogType,
        twitterCard: dto.twitterCard,
        twitterTitle: dto.twitterTitle,
        twitterDescription: dto.twitterDescription,
        twitterImage: dto.twitterImage,
        robotsDirectives: dto.robotsDirectives,
        structuredData: dto.structuredData as any,
        priority: dto.priority,
        changeFrequency: this.mapChangeFrequency(dto.changeFrequency),
        isPublished: dto.isPublished,
        isIndexable: dto.isIndexable,
      },
      include: {
        tenant: { select: { domain: true, defaultLocale: true } },
      },
    });

    this.logger.log(`Created page SEO: ${page.slug} (${page.locale})`);

    // Invalidate sitemap cache
    await this.redis.invalidateSitemap(tenant.slug, dto.locale);

    return this.mapPageToResponse(page);
  }

  /**
   * Update SEO metadata for a page
   */
  async updatePageSeo(id: string, dto: UpdatePageSeoDto): Promise<PageSeoResponse> {
    const existingPage = await this.prisma.page.findUnique({
      where: { id },
      include: { tenant: true },
    });

    if (!existingPage) {
      throw new NotFoundException(`Page with ID '${id}' not found`);
    }

    // Check for slug conflict if slug is being changed
    if (dto.slug && dto.slug !== existingPage.slug) {
      const conflict = await this.prisma.page.findFirst({
        where: {
          tenantId: existingPage.tenantId,
          slug: dto.slug,
          locale: dto.locale || existingPage.locale,
          id: { not: id },
        },
      });

      if (conflict) {
        throw new ConflictException(
          `Page with slug '${dto.slug}' and locale '${dto.locale || existingPage.locale}' already exists`,
        );
      }
    }

    // Update page
    const page = await this.prisma.page.update({
      where: { id },
      data: {
        slug: dto.slug,
        locale: dto.locale,
        title: dto.title,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        canonicalUrl: dto.canonicalUrl,
        hreflangTags: dto.hreflangTags as any,
        ogTitle: dto.ogTitle,
        ogDescription: dto.ogDescription,
        ogImage: dto.ogImage,
        ogType: dto.ogType,
        twitterCard: dto.twitterCard,
        twitterTitle: dto.twitterTitle,
        twitterDescription: dto.twitterDescription,
        twitterImage: dto.twitterImage,
        robotsDirectives: dto.robotsDirectives,
        structuredData: dto.structuredData as any,
        priority: dto.priority,
        changeFrequency: dto.changeFrequency ? this.mapChangeFrequency(dto.changeFrequency) : undefined,
        isPublished: dto.isPublished,
        isIndexable: dto.isIndexable,
        lastModified: new Date(),
      },
      include: {
        tenant: { select: { domain: true, defaultLocale: true } },
      },
    });

    // Invalidate caches
    await this.redis.invalidatePageSeo(existingPage.slug, existingPage.locale);
    if (dto.slug && dto.slug !== existingPage.slug) {
      await this.redis.invalidatePageSeo(dto.slug, dto.locale || existingPage.locale);
    }
    await this.redis.invalidateSitemap(existingPage.tenant.slug, existingPage.locale);

    this.logger.log(`Updated page SEO: ${page.slug} (${page.locale})`);

    return this.mapPageToResponse(page);
  }

  /**
   * Delete SEO metadata for a page
   */
  async deletePageSeo(id: string): Promise<void> {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: { tenant: true },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID '${id}' not found`);
    }

    await this.prisma.page.delete({ where: { id } });

    // Invalidate caches
    await this.redis.invalidatePageSeo(page.slug, page.locale);
    await this.redis.invalidateSitemap(page.tenant.slug, page.locale);

    this.logger.log(`Deleted page SEO: ${page.slug} (${page.locale})`);
  }

  /**
   * List all pages with pagination
   */
  async listPages(
    tenantId?: string,
    pagination: PaginationDto = {},
  ): Promise<{
    data: PageSeoResponse[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const where = tenantId ? { tenantId } : {};

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: pagination.sortBy
          ? { [pagination.sortBy]: pagination.sortOrder || 'desc' }
          : { lastModified: 'desc' },
        include: {
          tenant: { select: { domain: true, defaultLocale: true } },
        },
      }),
      this.prisma.page.count({ where }),
    ]);

    return {
      data: pages.map((p) => this.mapPageToResponse(p)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Bulk update pages
   */
  async bulkUpdatePages(
    updates: Array<{ id: string; data: UpdatePageSeoDto }>,
  ): Promise<{ updated: number; failed: number; errors: string[] }> {
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const update of updates) {
      try {
        await this.updatePageSeo(update.id, update.data);
        updated++;
      } catch (error) {
        failed++;
        errors.push(`Page ${update.id}: ${error.message}`);
      }
    }

    return { updated, failed, errors };
  }

  /**
   * Generate hreflang tags for a page
   */
  async generateHreflangTags(pageId: string): Promise<Record<string, string>> {
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
      include: { tenant: true },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID '${pageId}' not found`);
    }

    // Find all translations of this page
    const translations = await this.prisma.page.findMany({
      where: {
        tenantId: page.tenantId,
        slug: page.slug,
        isPublished: true,
      },
    });

    const hreflangTags: Record<string, string> = {};

    for (const translation of translations) {
      const url = this.buildCanonicalUrl(
        page.tenant.domain,
        translation.slug,
        translation.locale,
        page.tenant.defaultLocale,
      );
      hreflangTags[translation.locale] = url;
    }

    // Add x-default pointing to default locale
    if (hreflangTags[page.tenant.defaultLocale]) {
      hreflangTags['x-default'] = hreflangTags[page.tenant.defaultLocale];
    }

    return hreflangTags;
  }

  private mapPageToResponse(page: any): PageSeoResponse {
    return {
      id: page.id,
      slug: page.slug,
      locale: page.locale,
      title: page.title,
      metaDescription: page.metaDescription || undefined,
      metaKeywords: page.metaKeywords,
      canonicalUrl: page.canonicalUrl || this.buildCanonicalUrl(page.tenant.domain, page.slug, page.locale, page.tenant.defaultLocale),
      hreflangTags: page.hreflangTags as Record<string, string> || undefined,
      openGraph: {
        title: page.ogTitle || page.title,
        description: page.ogDescription || page.metaDescription || undefined,
        image: page.ogImage || undefined,
        type: page.ogType || 'website',
      },
      twitter: {
        card: page.twitterCard || 'summary_large_image',
        title: page.twitterTitle || page.ogTitle || page.title,
        description: page.twitterDescription || page.ogDescription || page.metaDescription || undefined,
        image: page.twitterImage || page.ogImage || undefined,
      },
      robotsDirectives: page.robotsDirectives || 'index, follow',
      structuredData: page.structuredData || undefined,
      priority: page.priority,
      changeFrequency: page.changeFrequency.toLowerCase(),
      isPublished: page.isPublished,
      isIndexable: page.isIndexable,
      lastModified: page.lastModified,
    };
  }

  private buildCanonicalUrl(
    domain: string,
    slug: string,
    locale: string,
    defaultLocale: string,
  ): string {
    const baseUrl = `https://${domain}`;
    if (locale === defaultLocale) {
      return `${baseUrl}/${slug}`;
    }
    return `${baseUrl}/${locale}/${slug}`;
  }

  private mapChangeFrequency(freq?: string): any {
    const mapping: Record<string, string> = {
      always: 'ALWAYS',
      hourly: 'HOURLY',
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      yearly: 'YEARLY',
      never: 'NEVER',
    };
    return mapping[freq?.toLowerCase() || 'weekly'] || 'WEEKLY';
  }
}
