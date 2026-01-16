import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { OpenSearchService } from '../common/services/opensearch.service';
import { VersionService } from './version.service';
import {
  CreateContentPage,
  UpdateContentPage,
  ContentPageQuery,
} from '../common/validation/schemas';
import slugify from 'slugify';
import { ContentStatus, Prisma } from '@prisma/client';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly search: OpenSearchService,
    private readonly versionService: VersionService,
  ) {}

  /**
   * Create a new content page
   */
  async create(tenantId: string, userId: string, data: CreateContentPage) {
    // Generate slug if not provided
    const slug = data.slug || this.generateSlug(data.title);

    // Check for duplicate slug
    const existingPage = await this.prisma.contentPage.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (existingPage) {
      throw new ConflictException(`Page with slug "${slug}" already exists`);
    }

    // Create page
    const page = await this.prisma.contentPage.create({
      data: {
        tenantId,
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content as Prisma.InputJsonValue,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        featuredImage: data.featuredImage,
        type: data.type,
        status: ContentStatus.DRAFT,
        authorId: data.authorId,
        createdBy: userId,
        canonicalUrl: data.canonicalUrl,
        noIndex: data.noIndex,
        noFollow: data.noFollow,
      },
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Create initial version
    await this.versionService.createVersion(page.id, userId, 'Initial version');

    // Associate topics if provided
    if (data.topicIds && data.topicIds.length > 0) {
      await this.updatePageTopics(page.id, data.topicIds);
    }

    // Index in OpenSearch
    await this.indexPage(page);

    // Invalidate list cache
    await this.cache.deleteByPattern(`tenant:${tenantId}:page:*`);

    this.logger.log(`Created content page: ${page.id}`);

    return this.findById(tenantId, page.id);
  }

  /**
   * Find all content pages with filtering and pagination
   */
  async findAll(tenantId: string, query: ContentPageQuery) {
    const {
      page,
      limit,
      status,
      type,
      authorId,
      search,
      topicId,
      sortBy,
      sortOrder,
    } = query;

    // Build cache key
    const cacheKey = this.cache.buildListCacheKey(tenantId, 'pages', query);

    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Build where clause
    const where: Prisma.ContentPageWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (authorId) where.authorId = authorId;
    if (topicId) {
      where.topics = { some: { topicId } };
    }

    // If search query provided, use OpenSearch
    if (search) {
      const searchResults = await this.search.searchPages(tenantId, search, {
        type: type?.toString(),
        status: status?.toString(),
        page,
        limit,
      });

      const pageIds = searchResults.hits.map((h) => h.id);

      if (pageIds.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        };
      }

      where.id = { in: pageIds };
    }

    // Build order by
    const orderBy: Prisma.ContentPageOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute query with pagination
    const result = await this.prisma.paginate(this.prisma.contentPage, {
      page,
      limit,
      where,
      orderBy,
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Cache result
    await this.cache.set(cacheKey, result, {
      ttl: 300, // 5 minutes
      tags: [`tenant:${tenantId}:pages`],
    });

    return result;
  }

  /**
   * Find a page by ID
   */
  async findById(tenantId: string, id: string) {
    const cacheKey = this.cache.buildPageCacheKey(tenantId, id);

    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const page = await this.prisma.contentPage.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        topics: { include: { topic: true } },
        versions: {
          take: 5,
          orderBy: { versionNumber: 'desc' },
        },
        performance: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        media: true,
      },
    });

    if (!page) {
      throw new NotFoundException(`Content page not found: ${id}`);
    }

    // Cache result
    await this.cache.set(cacheKey, page, {
      ttl: 3600,
      tags: [`tenant:${tenantId}:pages`, `page:${id}`],
    });

    return page;
  }

  /**
   * Find a page by slug
   */
  async findBySlug(tenantId: string, slug: string) {
    const cacheKey = this.cache.buildPageCacheKey(tenantId, `slug:${slug}`);

    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const page = await this.prisma.contentPage.findFirst({
      where: {
        tenantId,
        slug,
        deletedAt: null,
      },
      include: {
        topics: { include: { topic: true } },
        media: true,
      },
    });

    if (!page) {
      throw new NotFoundException(`Content page not found with slug: ${slug}`);
    }

    // Cache result
    await this.cache.set(cacheKey, page, {
      ttl: 3600,
      tags: [`tenant:${tenantId}:pages`, `page:${page.id}`],
    });

    return page;
  }

  /**
   * Update a content page
   */
  async update(
    tenantId: string,
    id: string,
    userId: string,
    data: UpdateContentPage,
  ) {
    // Verify page exists
    const existingPage = await this.findById(tenantId, id);

    // Check slug uniqueness if changed
    if (data.slug && data.slug !== existingPage.slug) {
      const duplicatePage = await this.prisma.contentPage.findUnique({
        where: { tenantId_slug: { tenantId, slug: data.slug } },
      });

      if (duplicatePage) {
        throw new ConflictException(`Page with slug "${data.slug}" already exists`);
      }
    }

    // Update page
    const page = await this.prisma.contentPage.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content as Prisma.InputJsonValue,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        featuredImage: data.featuredImage,
        type: data.type,
        authorId: data.authorId,
        updatedBy: userId,
        canonicalUrl: data.canonicalUrl,
        noIndex: data.noIndex,
        noFollow: data.noFollow,
        versionNumber: { increment: 1 },
      },
      include: {
        topics: { include: { topic: true } },
      },
    });

    // Create new version
    await this.versionService.createVersion(
      page.id,
      userId,
      data.changeMessage || 'Content updated',
    );

    // Update topics if provided
    if (data.topicIds) {
      await this.updatePageTopics(page.id, data.topicIds);
    }

    // Update search index
    await this.indexPage(page);

    // Invalidate cache
    await this.cache.deleteByTag(`page:${id}`);
    await this.cache.deleteByPattern(`tenant:${tenantId}:page:*`);

    this.logger.log(`Updated content page: ${id}`);

    return this.findById(tenantId, id);
  }

  /**
   * Delete a content page (soft delete)
   */
  async delete(tenantId: string, id: string, userId: string) {
    // Verify page exists
    await this.findById(tenantId, id);

    // Soft delete
    await this.prisma.contentPage.update({
      where: { id },
      data: {
        status: ContentStatus.DELETED,
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });

    // Remove from search index
    await this.search.delete('pages', id);

    // Invalidate cache
    await this.cache.deleteByTag(`page:${id}`);
    await this.cache.deleteByPattern(`tenant:${tenantId}:page:*`);

    this.logger.log(`Deleted content page: ${id}`);
  }

  /**
   * Generate a unique slug from title
   */
  private generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  /**
   * Update page topics
   */
  private async updatePageTopics(pageId: string, topicIds: string[]) {
    // Remove existing topics
    await this.prisma.contentTopic.deleteMany({
      where: { pageId },
    });

    // Add new topics
    if (topicIds.length > 0) {
      await this.prisma.contentTopic.createMany({
        data: topicIds.map((topicId, index) => ({
          pageId,
          topicId,
          isPrimary: index === 0,
          relevance: 1.0 - index * 0.1,
        })),
      });
    }
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
      topics: page.topics?.map((t: any) => t.topic.slug) || [],
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };

    await this.search.index('pages', page.id, document);
  }

  /**
   * Extract text content from rich content structure
   */
  private extractTextContent(content: any): string {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((item) => this.extractTextContent(item)).join(' ');
    }

    if (typeof content === 'object' && content !== null) {
      if (content.text) {
        return content.text;
      }
      if (content.children) {
        return this.extractTextContent(content.children);
      }
      if (content.content) {
        return this.extractTextContent(content.content);
      }
    }

    return '';
  }

  /**
   * Search content pages
   */
  async searchPages(tenantId: string, query: string, options?: any) {
    return this.search.searchPages(tenantId, query, options);
  }
}
