import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { OpenSearchService } from '../common/services/opensearch.service';
import { VersionService } from './version.service';
import { ContentStatus, Prisma } from '@prisma/client';

@Injectable()
export class PublishService {
  private readonly logger = new Logger(PublishService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly search: OpenSearchService,
    private readonly versionService: VersionService,
  ) {}

  /**
   * Publish content immediately
   */
  async publish(tenantId: string, pageId: string, userId: string) {
    const page = await this.getPage(tenantId, pageId);

    // Validate page can be published
    this.validateForPublishing(page);

    // Update page status
    const updatedPage = await this.prisma.contentPage.update({
      where: { id: pageId },
      data: {
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        scheduledAt: null,
        updatedBy: userId,
        versionNumber: { increment: 1 },
      },
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Create version
    await this.versionService.createVersion(pageId, userId, 'Published');

    // Update search index
    await this.indexPage(updatedPage);

    // Invalidate cache
    await this.invalidateCache(tenantId, pageId);

    this.logger.log(`Published content page: ${pageId}`);

    return updatedPage;
  }

  /**
   * Schedule content for future publishing
   */
  async schedule(
    tenantId: string,
    pageId: string,
    scheduledAt: Date,
    userId: string,
  ) {
    const page = await this.getPage(tenantId, pageId);

    // Validate scheduled date
    if (scheduledAt <= new Date()) {
      throw new BadRequestException('Scheduled date must be in the future');
    }

    // Validate page can be scheduled
    this.validateForPublishing(page);

    // Update page status
    const updatedPage = await this.prisma.contentPage.update({
      where: { id: pageId },
      data: {
        status: ContentStatus.SCHEDULED,
        scheduledAt,
        updatedBy: userId,
        versionNumber: { increment: 1 },
      },
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Create version
    await this.versionService.createVersion(
      pageId,
      userId,
      `Scheduled for ${scheduledAt.toISOString()}`,
    );

    // Invalidate cache
    await this.invalidateCache(tenantId, pageId);

    this.logger.log(`Scheduled content page: ${pageId} for ${scheduledAt}`);

    return updatedPage;
  }

  /**
   * Save as draft
   */
  async saveDraft(
    tenantId: string,
    userId: string,
    data: {
      pageId?: string;
      title: string;
      content: any;
      excerpt?: string;
    },
  ) {
    if (data.pageId) {
      // Update existing page
      const page = await this.getPage(tenantId, data.pageId);

      const updatedPage = await this.prisma.contentPage.update({
        where: { id: data.pageId },
        data: {
          title: data.title,
          content: data.content as Prisma.InputJsonValue,
          excerpt: data.excerpt,
          status: ContentStatus.DRAFT,
          scheduledAt: null,
          updatedBy: userId,
          versionNumber: { increment: 1 },
        },
        include: {
          topics: { include: { topic: true } },
        },
      });

      // Create version
      await this.versionService.createVersion(data.pageId, userId, 'Draft saved');

      // Invalidate cache
      await this.invalidateCache(tenantId, data.pageId);

      this.logger.log(`Saved draft for existing page: ${data.pageId}`);

      return updatedPage;
    } else {
      // Create new draft page
      const slug = this.generateSlug(data.title);

      const page = await this.prisma.contentPage.create({
        data: {
          tenantId,
          title: data.title,
          slug,
          content: data.content as Prisma.InputJsonValue,
          excerpt: data.excerpt,
          status: ContentStatus.DRAFT,
          authorId: userId,
          createdBy: userId,
        },
        include: {
          topics: { include: { topic: true } },
        },
      });

      // Create initial version
      await this.versionService.createVersion(page.id, userId, 'Initial draft');

      this.logger.log(`Created new draft page: ${page.id}`);

      return page;
    }
  }

  /**
   * Unpublish content
   */
  async unpublish(tenantId: string, pageId: string, userId: string) {
    const page = await this.getPage(tenantId, pageId);

    if (page.status !== ContentStatus.PUBLISHED) {
      throw new BadRequestException('Page is not currently published');
    }

    const updatedPage = await this.prisma.contentPage.update({
      where: { id: pageId },
      data: {
        status: ContentStatus.DRAFT,
        publishedAt: null,
        updatedBy: userId,
        versionNumber: { increment: 1 },
      },
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Create version
    await this.versionService.createVersion(pageId, userId, 'Unpublished');

    // Update search index
    await this.indexPage(updatedPage);

    // Invalidate cache
    await this.invalidateCache(tenantId, pageId);

    this.logger.log(`Unpublished content page: ${pageId}`);

    return updatedPage;
  }

  /**
   * Archive content
   */
  async archive(tenantId: string, pageId: string, userId: string) {
    const page = await this.getPage(tenantId, pageId);

    if (page.status === ContentStatus.ARCHIVED) {
      throw new BadRequestException('Page is already archived');
    }

    const updatedPage = await this.prisma.contentPage.update({
      where: { id: pageId },
      data: {
        status: ContentStatus.ARCHIVED,
        publishedAt: null,
        scheduledAt: null,
        updatedBy: userId,
        versionNumber: { increment: 1 },
      },
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Create version
    await this.versionService.createVersion(pageId, userId, 'Archived');

    // Update search index
    await this.indexPage(updatedPage);

    // Invalidate cache
    await this.invalidateCache(tenantId, pageId);

    this.logger.log(`Archived content page: ${pageId}`);

    return updatedPage;
  }

  /**
   * Cancel scheduled publishing
   */
  async cancelSchedule(tenantId: string, pageId: string, userId: string) {
    const page = await this.getPage(tenantId, pageId);

    if (page.status !== ContentStatus.SCHEDULED) {
      throw new BadRequestException('Page is not currently scheduled');
    }

    const updatedPage = await this.prisma.contentPage.update({
      where: { id: pageId },
      data: {
        status: ContentStatus.DRAFT,
        scheduledAt: null,
        updatedBy: userId,
        versionNumber: { increment: 1 },
      },
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Create version
    await this.versionService.createVersion(
      pageId,
      userId,
      'Schedule cancelled',
    );

    // Invalidate cache
    await this.invalidateCache(tenantId, pageId);

    this.logger.log(`Cancelled schedule for page: ${pageId}`);

    return updatedPage;
  }

  /**
   * Process scheduled content (called by cron job)
   */
  async processScheduledContent() {
    const now = new Date();

    const scheduledPages = await this.prisma.contentPage.findMany({
      where: {
        status: ContentStatus.SCHEDULED,
        scheduledAt: { lte: now },
        deletedAt: null,
      },
    });

    this.logger.log(`Processing ${scheduledPages.length} scheduled pages`);

    for (const page of scheduledPages) {
      try {
        await this.publish(page.tenantId, page.id, 'system');
        this.logger.log(`Auto-published scheduled page: ${page.id}`);
      } catch (error) {
        this.logger.error(
          `Failed to auto-publish page ${page.id}: ${error.message}`,
        );
      }
    }

    return scheduledPages.length;
  }

  /**
   * Get a page with validation
   */
  private async getPage(tenantId: string, pageId: string) {
    const page = await this.prisma.contentPage.findFirst({
      where: {
        id: pageId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!page) {
      throw new NotFoundException(`Content page not found: ${pageId}`);
    }

    return page;
  }

  /**
   * Validate page can be published
   */
  private validateForPublishing(page: any) {
    if (!page.title || page.title.trim() === '') {
      throw new BadRequestException('Page must have a title');
    }

    if (!page.content || Object.keys(page.content).length === 0) {
      throw new BadRequestException('Page must have content');
    }

    if (page.status === ContentStatus.DELETED) {
      throw new BadRequestException('Cannot publish deleted page');
    }
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Index page in OpenSearch
   */
  private async indexPage(page: any) {
    const document = {
      tenantId: page.tenantId,
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt,
      content: this.extractTextContent(page.content),
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      type: page.type,
      status: page.status,
      authorId: page.authorId,
      topics: page.topics?.map((t: any) => t.topic?.slug) || [],
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };

    await this.search.index('pages', page.id, document);
  }

  /**
   * Extract text content from rich content
   */
  private extractTextContent(content: any): string {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content.map((item) => this.extractTextContent(item)).join(' ');
    }
    if (typeof content === 'object' && content !== null) {
      if (content.text) return content.text;
      if (content.children) return this.extractTextContent(content.children);
      if (content.content) return this.extractTextContent(content.content);
    }
    return '';
  }

  /**
   * Invalidate cache for a page
   */
  private async invalidateCache(tenantId: string, pageId: string) {
    await this.cache.deleteByTag(`page:${pageId}`);
    await this.cache.deleteByPattern(`tenant:${tenantId}:page:*`);
  }
}
