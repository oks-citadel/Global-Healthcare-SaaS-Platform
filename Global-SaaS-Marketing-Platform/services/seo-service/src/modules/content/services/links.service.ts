import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { InternalLinksQueryDto, InternalLinkDto, LinkRecommendationDto } from '../../../common/dto';

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get internal links for a page or tenant
   */
  async getInternalLinks(query: InternalLinksQueryDto): Promise<{
    links: InternalLinkDto[];
    recommendations: LinkRecommendationDto[];
    meta: {
      totalLinks: number;
      brokenLinks: number;
      avgLinksPerPage: number;
    };
  }> {
    const where: any = {};

    // Filter by tenant
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: query.tenant },
      });
      if (tenant) {
        where.sourcePage = { tenantId: tenant.id };
      }
    }

    // Filter by page
    if (query.pageId) {
      where.sourcePageId = query.pageId;
    }

    // Get links
    const links = await this.prisma.internalLink.findMany({
      where,
      include: {
        sourcePage: {
          select: { slug: true, locale: true, tenant: { select: { domain: true } } },
        },
        targetPage: {
          select: { slug: true, locale: true, tenant: { select: { domain: true } } },
        },
      },
      take: query.limit || 100,
    });

    // Map to DTOs
    const linkDtos: InternalLinkDto[] = links.map((link) => ({
      sourceUrl: this.buildUrl(link.sourcePage),
      targetUrl: this.buildUrl(link.targetPage),
      anchorText: link.anchorText || undefined,
      context: link.context || undefined,
      linkType: link.linkType.toLowerCase(),
      relevanceScore: link.relevanceScore || undefined,
      isFollow: link.isFollow,
      isBroken: link.isBroken,
    }));

    // Get recommendations if requested
    let recommendations: LinkRecommendationDto[] = [];
    if (query.includeRecommendations) {
      recommendations = await this.generateRecommendations(
        query,
        query.maxRecommendations || 10,
      );
    }

    // Calculate meta stats
    const brokenCount = links.filter((l) => l.isBroken).length;

    return {
      links: linkDtos,
      recommendations,
      meta: {
        totalLinks: links.length,
        brokenLinks: brokenCount,
        avgLinksPerPage: links.length > 0 ? links.length : 0,
      },
    };
  }

  /**
   * Generate internal linking recommendations
   */
  async generateRecommendations(
    query: InternalLinksQueryDto,
    maxRecommendations: number,
  ): Promise<LinkRecommendationDto[]> {
    const recommendations: LinkRecommendationDto[] = [];

    // Get tenant pages if tenant specified
    let tenantId: string | undefined;
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: query.tenant },
      });
      tenantId = tenant?.id;
    }

    if (!tenantId) return recommendations;

    // Get all published pages
    const pages = await this.prisma.page.findMany({
      where: {
        tenantId,
        isPublished: true,
        isIndexable: true,
      },
      select: {
        id: true,
        slug: true,
        locale: true,
        title: true,
        metaKeywords: true,
        tenant: { select: { domain: true } },
      },
    });

    // Get existing links to avoid duplicates
    const existingLinks = await this.prisma.internalLink.findMany({
      where: {
        sourcePage: { tenantId },
      },
      select: {
        sourcePageId: true,
        targetPageId: true,
      },
    });

    const existingLinkSet = new Set(
      existingLinks.map((l) => `${l.sourcePageId}-${l.targetPageId}`),
    );

    // Find pages with few outgoing links
    const linkCounts = new Map<string, number>();
    for (const link of existingLinks) {
      linkCounts.set(link.sourcePageId, (linkCounts.get(link.sourcePageId) || 0) + 1);
    }

    // Find pages that need more links
    const pagesNeedingLinks = pages.filter((p) => (linkCounts.get(p.id) || 0) < 3);

    // Generate recommendations for each page needing links
    for (const sourcePage of pagesNeedingLinks) {
      if (recommendations.length >= maxRecommendations) break;

      // Find relevant target pages based on keywords
      const sourceKeywords = new Set(
        (sourcePage.metaKeywords || []).map((k) => k.toLowerCase()),
      );

      for (const targetPage of pages) {
        if (recommendations.length >= maxRecommendations) break;

        // Skip same page
        if (sourcePage.id === targetPage.id) continue;

        // Skip if link already exists
        if (existingLinkSet.has(`${sourcePage.id}-${targetPage.id}`)) continue;

        // Calculate relevance based on keyword overlap
        const targetKeywords = new Set(
          (targetPage.metaKeywords || []).map((k) => k.toLowerCase()),
        );

        let overlap = 0;
        for (const keyword of sourceKeywords) {
          if (targetKeywords.has(keyword)) overlap++;
        }

        // Also check title similarity
        const titleWords = new Set(
          targetPage.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
        );
        for (const word of titleWords) {
          if (sourceKeywords.has(word)) overlap++;
        }

        if (overlap > 0) {
          const relevanceScore = Math.min(1, overlap * 0.2);

          recommendations.push({
            sourceUrl: this.buildUrl(sourcePage),
            targetUrl: this.buildUrl(targetPage),
            suggestedAnchorText: targetPage.title,
            relevanceScore,
            reason: `Shares ${overlap} keyword(s) with target page`,
          });
        }
      }
    }

    // Sort by relevance
    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return recommendations.slice(0, maxRecommendations);
  }

  /**
   * Analyze link structure for a tenant
   */
  async analyzeLinkStructure(tenantId: string): Promise<{
    totalPages: number;
    totalLinks: number;
    avgLinksPerPage: number;
    orphanPages: string[];
    hubPages: Array<{ url: string; incomingLinks: number }>;
    brokenLinks: Array<{ sourceUrl: string; targetUrl: string }>;
    linkDistribution: Record<string, number>;
  }> {
    // Get all pages
    const pages = await this.prisma.page.findMany({
      where: { tenantId, isPublished: true },
      include: { tenant: { select: { domain: true } } },
    });

    // Get all links
    const links = await this.prisma.internalLink.findMany({
      where: {
        sourcePage: { tenantId },
      },
      include: {
        sourcePage: { include: { tenant: { select: { domain: true } } } },
        targetPage: { include: { tenant: { select: { domain: true } } } },
      },
    });

    // Calculate incoming links per page
    const incomingLinks = new Map<string, number>();
    const outgoingLinks = new Map<string, number>();

    for (const link of links) {
      incomingLinks.set(
        link.targetPageId,
        (incomingLinks.get(link.targetPageId) || 0) + 1,
      );
      outgoingLinks.set(
        link.sourcePageId,
        (outgoingLinks.get(link.sourcePageId) || 0) + 1,
      );
    }

    // Find orphan pages (no incoming links)
    const orphanPages = pages
      .filter((p) => !incomingLinks.has(p.id) || incomingLinks.get(p.id) === 0)
      .map((p) => this.buildUrl(p));

    // Find hub pages (most incoming links)
    const hubPages = pages
      .filter((p) => incomingLinks.has(p.id))
      .map((p) => ({
        url: this.buildUrl(p),
        incomingLinks: incomingLinks.get(p.id) || 0,
      }))
      .sort((a, b) => b.incomingLinks - a.incomingLinks)
      .slice(0, 10);

    // Find broken links
    const brokenLinks = links
      .filter((l) => l.isBroken)
      .map((l) => ({
        sourceUrl: this.buildUrl(l.sourcePage),
        targetUrl: this.buildUrl(l.targetPage),
      }));

    // Calculate link distribution by type
    const linkDistribution: Record<string, number> = {};
    for (const link of links) {
      const type = link.linkType.toLowerCase();
      linkDistribution[type] = (linkDistribution[type] || 0) + 1;
    }

    return {
      totalPages: pages.length,
      totalLinks: links.length,
      avgLinksPerPage: pages.length > 0 ? links.length / pages.length : 0,
      orphanPages,
      hubPages,
      brokenLinks,
      linkDistribution,
    };
  }

  /**
   * Create an internal link
   */
  async createLink(
    sourcePageId: string,
    targetPageId: string,
    anchorText?: string,
    linkType = 'CONTENT',
  ): Promise<void> {
    await this.prisma.internalLink.create({
      data: {
        sourcePageId,
        targetPageId,
        anchorText,
        linkType: linkType.toUpperCase() as any,
        relevanceScore: 0.5,
        isFollow: true,
        isBroken: false,
      },
    });
  }

  /**
   * Check for broken links
   */
  async checkBrokenLinks(tenantId: string): Promise<number> {
    // In production, this would actually check if target pages exist
    // For now, we'll mark links to unpublished pages as broken

    const result = await this.prisma.internalLink.updateMany({
      where: {
        sourcePage: { tenantId },
        targetPage: { isPublished: false },
      },
      data: {
        isBroken: true,
        lastChecked: new Date(),
      },
    });

    return result.count;
  }

  private buildUrl(page: any): string {
    const domain = page.tenant?.domain || 'example.com';
    const locale = page.locale !== 'en' ? `/${page.locale}` : '';
    return `https://${domain}${locale}/${page.slug}`;
  }
}
