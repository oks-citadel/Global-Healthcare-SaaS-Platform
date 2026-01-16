import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../common/cache/redis.service';
import { ScheduleAuditDto, AuditQueryDto } from '../../../common/dto';
import { SeoConfig } from '../../../config/configuration';

interface AuditIssue {
  type: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  message: string;
  url?: string;
  element?: string;
  recommendations: string[];
}

interface AuditSummary {
  critical: number;
  errors: number;
  warnings: number;
  passed: number;
  info: number;
}

interface AuditResult {
  id: string;
  tenantId: string;
  type: string;
  status: string;
  score: number | null;
  summary: AuditSummary | null;
  issues: AuditIssue[];
  pagesScanned: number;
  errorsFound: number;
  warningsFound: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  createdAt: Date;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private readonly seoConfig: SeoConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.seoConfig = this.configService.get<SeoConfig>('seo')!;
  }

  /**
   * Get latest audit results
   */
  async getLatestAudit(query: AuditQueryDto): Promise<AuditResult | null> {
    const where: any = { status: 'COMPLETED' };

    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: query.tenant },
      });
      if (tenant) {
        where.tenantId = tenant.id;
      }
    }

    if (query.type) {
      where.auditType = query.type.toUpperCase();
    }

    const audit = await this.prisma.seoAudit.findFirst({
      where,
      orderBy: { completedAt: 'desc' },
      include: {
        auditItems: true,
        tenant: { select: { slug: true } },
      },
    });

    if (!audit) return null;

    return this.mapAuditToResponse(audit);
  }

  /**
   * List audit history
   */
  async listAudits(query: AuditQueryDto): Promise<{
    data: AuditResult[];
    meta: { total: number; limit: number };
  }> {
    const where: any = {};

    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: query.tenant },
      });
      if (tenant) {
        where.tenantId = tenant.id;
      }
    }

    if (query.type) {
      where.auditType = query.type.toUpperCase();
    }

    if (query.status) {
      where.status = query.status.toUpperCase();
    }

    const limit = query.limit || 10;

    const [audits, total] = await Promise.all([
      this.prisma.seoAudit.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          auditItems: true,
          tenant: { select: { slug: true } },
        },
      }),
      this.prisma.seoAudit.count({ where }),
    ]);

    return {
      data: audits.map((a) => this.mapAuditToResponse(a)),
      meta: { total, limit },
    };
  }

  /**
   * Schedule a new audit
   */
  async scheduleAudit(dto: ScheduleAuditDto): Promise<AuditResult> {
    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID '${dto.tenantId}' not found`);
    }

    // Create audit record
    const audit = await this.prisma.seoAudit.create({
      data: {
        tenantId: dto.tenantId,
        auditType: this.mapAuditType(dto.type || 'full'),
        status: dto.scheduledAt ? 'SCHEDULED' : 'PENDING',
        scheduledAt: dto.scheduledAt,
      },
      include: {
        auditItems: true,
        tenant: { select: { slug: true } },
      },
    });

    this.logger.log(`Scheduled audit: ${audit.id} for tenant: ${tenant.slug}`);

    // If not scheduled for later, start immediately
    if (!dto.scheduledAt) {
      this.runAudit(audit.id, dto.maxPages || 1000).catch((err) => {
        this.logger.error(`Error running audit ${audit.id}:`, err);
      });
    }

    return this.mapAuditToResponse(audit);
  }

  /**
   * Run audit (internal)
   */
  async runAudit(auditId: string, maxPages: number = 1000): Promise<void> {
    const startTime = Date.now();

    await this.prisma.seoAudit.update({
      where: { id: auditId },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    const audit = await this.prisma.seoAudit.findUnique({
      where: { id: auditId },
      include: { tenant: true },
    });

    if (!audit) return;

    try {
      const issues: AuditIssue[] = [];
      let pagesScanned = 0;

      // Get pages to audit
      const pages = await this.prisma.page.findMany({
        where: { tenantId: audit.tenantId },
        take: maxPages,
        include: { tenant: { select: { domain: true } } },
      });

      // Audit each page
      for (const page of pages) {
        pagesScanned++;
        const pageIssues = await this.auditPage(page);
        issues.push(...pageIssues);
      }

      // Run additional checks based on audit type
      if (audit.auditType === 'FULL' || audit.auditType === 'TECHNICAL') {
        issues.push(...(await this.runTechnicalChecks(audit.tenantId)));
      }

      if (audit.auditType === 'FULL' || audit.auditType === 'CONTENT') {
        issues.push(...(await this.runContentChecks(audit.tenantId)));
      }

      if (audit.auditType === 'FULL' || audit.auditType === 'LINKS') {
        issues.push(...(await this.runLinkChecks(audit.tenantId)));
      }

      // Calculate summary
      const summary = this.calculateSummary(issues);
      const score = this.calculateScore(summary, pagesScanned);

      // Save audit items
      for (const issue of issues) {
        await this.prisma.auditItem.create({
          data: {
            auditId,
            category: this.categorizeIssue(issue.type),
            type: issue.type,
            severity: issue.severity.toUpperCase() as any,
            url: issue.url,
            element: issue.element,
            message: issue.message,
            recommendation: issue.recommendations.join(' '),
            metadata: issue as any,
          },
        });
      }

      const duration = Math.round((Date.now() - startTime) / 1000);

      // Update audit
      await this.prisma.seoAudit.update({
        where: { id: auditId },
        data: {
          status: 'COMPLETED',
          score,
          summary: summary as any,
          issues: issues as any,
          pagesScanned,
          errorsFound: summary.critical + summary.errors,
          warningsFound: summary.warnings,
          completedAt: new Date(),
          duration,
        },
      });

      this.logger.log(`Completed audit: ${auditId} (score: ${score})`);
    } catch (error) {
      await this.prisma.seoAudit.update({
        where: { id: auditId },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorMessage: error.message,
        },
      });

      this.logger.error(`Failed audit ${auditId}:`, error);
    }
  }

  /**
   * Audit a single page
   */
  private async auditPage(page: any): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];
    const url = `https://${page.tenant.domain}/${page.slug}`;

    // Title checks
    if (!page.title) {
      issues.push({
        type: 'missing_title',
        severity: 'critical',
        message: 'Page is missing a title tag',
        url,
        recommendations: ['Add a unique, descriptive title tag between 30-60 characters'],
      });
    } else if (page.title.length < 30) {
      issues.push({
        type: 'short_title',
        severity: 'warning',
        message: `Title tag is too short (${page.title.length} characters)`,
        url,
        recommendations: ['Expand title to at least 30 characters for better SEO'],
      });
    } else if (page.title.length > 60) {
      issues.push({
        type: 'long_title',
        severity: 'warning',
        message: `Title tag is too long (${page.title.length} characters)`,
        url,
        recommendations: ['Shorten title to under 60 characters to prevent truncation in SERPs'],
      });
    }

    // Meta description checks
    if (!page.metaDescription) {
      issues.push({
        type: 'missing_meta_description',
        severity: 'error',
        message: 'Page is missing a meta description',
        url,
        recommendations: ['Add a compelling meta description between 120-160 characters'],
      });
    } else if (page.metaDescription.length < 120) {
      issues.push({
        type: 'short_meta_description',
        severity: 'warning',
        message: `Meta description is too short (${page.metaDescription.length} characters)`,
        url,
        recommendations: ['Expand meta description to at least 120 characters'],
      });
    } else if (page.metaDescription.length > 160) {
      issues.push({
        type: 'long_meta_description',
        severity: 'info',
        message: `Meta description is long (${page.metaDescription.length} characters)`,
        url,
        recommendations: ['Consider shortening to under 160 characters to prevent truncation'],
      });
    }

    // Canonical URL check
    if (!page.canonicalUrl) {
      issues.push({
        type: 'missing_canonical',
        severity: 'warning',
        message: 'Page is missing a canonical URL',
        url,
        recommendations: ['Add a canonical URL to prevent duplicate content issues'],
      });
    }

    // Open Graph checks
    if (!page.ogTitle && !page.ogDescription && !page.ogImage) {
      issues.push({
        type: 'missing_og_tags',
        severity: 'warning',
        message: 'Page is missing Open Graph meta tags',
        url,
        recommendations: ['Add og:title, og:description, and og:image for better social sharing'],
      });
    }

    // Structured data check
    if (!page.structuredData) {
      issues.push({
        type: 'missing_structured_data',
        severity: 'info',
        message: 'Page has no structured data (JSON-LD)',
        url,
        recommendations: ['Add relevant schema.org structured data for rich snippets'],
      });
    }

    // Indexability check
    if (!page.isIndexable) {
      issues.push({
        type: 'noindex_page',
        severity: 'info',
        message: 'Page is set to noindex',
        url,
        recommendations: ['Verify this page should be excluded from search results'],
      });
    }

    return issues;
  }

  /**
   * Run technical SEO checks
   */
  private async runTechnicalChecks(tenantId: string): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];

    // Check robots.txt
    const robotsConfig = await this.prisma.robotsConfig.findUnique({
      where: { tenantId },
    });

    if (!robotsConfig) {
      issues.push({
        type: 'missing_robots_config',
        severity: 'warning',
        message: 'No custom robots.txt configuration found',
        recommendations: ['Configure robots.txt to control crawler access'],
      });
    }

    // Check sitemap
    const sitemaps = await this.prisma.sitemap.findMany({
      where: { tenantId, isActive: true },
    });

    if (sitemaps.length === 0) {
      issues.push({
        type: 'missing_sitemap',
        severity: 'error',
        message: 'No sitemap found',
        recommendations: ['Generate and submit an XML sitemap to search engines'],
      });
    }

    // Check for outdated sitemaps
    for (const sitemap of sitemaps) {
      if (sitemap.lastGenerated) {
        const daysSinceUpdate = (Date.now() - sitemap.lastGenerated.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate > 7) {
          issues.push({
            type: 'stale_sitemap',
            severity: 'warning',
            message: `Sitemap hasn't been updated in ${Math.round(daysSinceUpdate)} days`,
            recommendations: ['Regenerate sitemap to ensure it reflects current site structure'],
          });
        }
      }
    }

    return issues;
  }

  /**
   * Run content SEO checks
   */
  private async runContentChecks(tenantId: string): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];

    // Check for duplicate titles
    const pages = await this.prisma.page.findMany({
      where: { tenantId, isPublished: true },
      select: { id: true, slug: true, title: true, metaDescription: true },
    });

    const titleCounts = new Map<string, string[]>();
    const descCounts = new Map<string, string[]>();

    for (const page of pages) {
      // Track duplicate titles
      const titleKey = page.title.toLowerCase().trim();
      if (!titleCounts.has(titleKey)) {
        titleCounts.set(titleKey, []);
      }
      titleCounts.get(titleKey)!.push(page.slug);

      // Track duplicate descriptions
      if (page.metaDescription) {
        const descKey = page.metaDescription.toLowerCase().trim();
        if (!descCounts.has(descKey)) {
          descCounts.set(descKey, []);
        }
        descCounts.get(descKey)!.push(page.slug);
      }
    }

    // Report duplicate titles
    for (const [title, slugs] of titleCounts) {
      if (slugs.length > 1) {
        issues.push({
          type: 'duplicate_title',
          severity: 'error',
          message: `Duplicate title found on ${slugs.length} pages`,
          recommendations: [
            'Create unique titles for each page',
            `Affected pages: ${slugs.join(', ')}`,
          ],
        });
      }
    }

    // Report duplicate descriptions
    for (const [desc, slugs] of descCounts) {
      if (slugs.length > 1) {
        issues.push({
          type: 'duplicate_meta_description',
          severity: 'warning',
          message: `Duplicate meta description found on ${slugs.length} pages`,
          recommendations: [
            'Create unique meta descriptions for each page',
            `Affected pages: ${slugs.join(', ')}`,
          ],
        });
      }
    }

    return issues;
  }

  /**
   * Run link checks
   */
  private async runLinkChecks(tenantId: string): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];

    // Check for broken internal links
    const brokenLinks = await this.prisma.internalLink.findMany({
      where: {
        sourcePage: { tenantId },
        isBroken: true,
      },
      include: {
        sourcePage: { select: { slug: true } },
        targetPage: { select: { slug: true } },
      },
    });

    if (brokenLinks.length > 0) {
      issues.push({
        type: 'broken_internal_links',
        severity: 'error',
        message: `Found ${brokenLinks.length} broken internal links`,
        recommendations: ['Fix or remove broken links to improve user experience and crawlability'],
      });
    }

    // Check for orphan pages (no incoming links)
    const pagesWithLinks = await this.prisma.internalLink.findMany({
      where: { targetPage: { tenantId } },
      select: { targetPageId: true },
      distinct: ['targetPageId'],
    });

    const linkedPageIds = new Set(pagesWithLinks.map((l) => l.targetPageId));

    const allPages = await this.prisma.page.findMany({
      where: { tenantId, isPublished: true },
      select: { id: true, slug: true },
    });

    const orphanPages = allPages.filter((p) => !linkedPageIds.has(p.id));

    if (orphanPages.length > 0) {
      issues.push({
        type: 'orphan_pages',
        severity: 'warning',
        message: `Found ${orphanPages.length} pages with no internal links pointing to them`,
        recommendations: [
          'Add internal links to orphan pages to improve discoverability',
          `Affected pages: ${orphanPages.map((p) => p.slug).slice(0, 5).join(', ')}${orphanPages.length > 5 ? '...' : ''}`,
        ],
      });
    }

    return issues;
  }

  private calculateSummary(issues: AuditIssue[]): AuditSummary {
    return {
      critical: issues.filter((i) => i.severity === 'critical').length,
      errors: issues.filter((i) => i.severity === 'error').length,
      warnings: issues.filter((i) => i.severity === 'warning').length,
      info: issues.filter((i) => i.severity === 'info').length,
      passed: 0, // Would need to track passed checks
    };
  }

  private calculateScore(summary: AuditSummary, pagesScanned: number): number {
    if (pagesScanned === 0) return 0;

    // Deduct points for issues
    let score = 100;
    score -= summary.critical * 15;
    score -= summary.errors * 5;
    score -= summary.warnings * 2;
    score -= summary.info * 0.5;

    return Math.max(0, Math.min(100, score));
  }

  private categorizeIssue(type: string): string {
    const categories: Record<string, string> = {
      missing_title: 'content',
      short_title: 'content',
      long_title: 'content',
      missing_meta_description: 'content',
      short_meta_description: 'content',
      long_meta_description: 'content',
      duplicate_title: 'content',
      duplicate_meta_description: 'content',
      missing_canonical: 'technical',
      missing_og_tags: 'social',
      missing_structured_data: 'technical',
      noindex_page: 'technical',
      missing_robots_config: 'technical',
      missing_sitemap: 'technical',
      stale_sitemap: 'technical',
      broken_internal_links: 'links',
      orphan_pages: 'links',
    };

    return categories[type] || 'other';
  }

  private mapAuditToResponse(audit: any): AuditResult {
    return {
      id: audit.id,
      tenantId: audit.tenantId,
      type: audit.auditType.toLowerCase(),
      status: audit.status.toLowerCase(),
      score: audit.score,
      summary: audit.summary as AuditSummary | null,
      issues: (audit.auditItems || []).map((item: any) => ({
        type: item.type,
        severity: item.severity.toLowerCase(),
        message: item.message,
        url: item.url,
        element: item.element,
        recommendations: item.recommendation ? [item.recommendation] : [],
      })),
      pagesScanned: audit.pagesScanned,
      errorsFound: audit.errorsFound,
      warningsFound: audit.warningsFound,
      scheduledAt: audit.scheduledAt || undefined,
      startedAt: audit.startedAt || undefined,
      completedAt: audit.completedAt || undefined,
      duration: audit.duration || undefined,
      createdAt: audit.createdAt,
    };
  }

  private mapAuditType(type: string): any {
    const mapping: Record<string, string> = {
      full: 'FULL',
      technical: 'TECHNICAL',
      content: 'CONTENT',
      links: 'LINKS',
      performance: 'PERFORMANCE',
      accessibility: 'ACCESSIBILITY',
    };
    return mapping[type] || 'FULL';
  }

  /**
   * Scheduled audit check - runs daily to process scheduled audits
   */
  @Cron(CronExpression.EVERY_HOUR)
  async processScheduledAudits(): Promise<void> {
    const now = new Date();

    const scheduledAudits = await this.prisma.seoAudit.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { lte: now },
      },
    });

    for (const audit of scheduledAudits) {
      this.logger.log(`Starting scheduled audit: ${audit.id}`);
      this.runAudit(audit.id).catch((err) => {
        this.logger.error(`Error running scheduled audit ${audit.id}:`, err);
      });
    }
  }
}
