import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { OpenSearchService } from '../common/services/opensearch.service';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';

export interface CreateTopicDto {
  name: string;
  slug?: string;
  description?: string;
  searchVolume?: number;
  difficulty?: number;
  relevanceScore?: number;
  parentId?: string;
}

export interface TopicQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
}

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly search: OpenSearchService,
  ) {}

  /**
   * Create a new topic
   */
  async create(tenantId: string, data: CreateTopicDto) {
    const slug = data.slug || this.generateSlug(data.name);

    // Check for duplicate slug
    const existingTopic = await this.prisma.topic.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (existingTopic) {
      throw new ConflictException(`Topic with slug "${slug}" already exists`);
    }

    const topic = await this.prisma.topic.create({
      data: {
        tenantId,
        name: data.name,
        slug,
        description: data.description,
        searchVolume: data.searchVolume,
        difficulty: data.difficulty,
        relevanceScore: data.relevanceScore,
        parentId: data.parentId,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    // Index in OpenSearch
    await this.indexTopic(topic);

    // Invalidate cache
    await this.cache.deleteByPattern(`tenant:${tenantId}:topic:*`);

    this.logger.log(`Created topic: ${topic.id}`);

    return topic;
  }

  /**
   * Find all topics with filtering and pagination
   */
  async findAll(tenantId: string, query: TopicQueryDto) {
    const { page = 1, limit = 10, search, parentId } = query;

    const cacheKey = this.cache.buildListCacheKey(tenantId, 'topics', query);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where: Prisma.TopicWhereInput = { tenantId };

    if (parentId === 'null' || parentId === 'root') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const result = await this.prisma.paginate(this.prisma.topic, {
      page,
      limit,
      where,
      orderBy: { name: 'asc' },
      include: {
        parent: true,
        children: { take: 5 },
        _count: {
          select: { contentTopics: true },
        },
      },
    });

    await this.cache.set(cacheKey, result, { ttl: 300, tags: [`tenant:${tenantId}:topics`] });

    return result;
  }

  /**
   * Get topic by ID
   */
  async findById(tenantId: string, id: string) {
    const cacheKey = `tenant:${tenantId}:topic:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const topic = await this.prisma.topic.findFirst({
      where: { id, tenantId },
      include: {
        parent: true,
        children: true,
        contentTopics: {
          include: {
            page: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
              },
            },
          },
          take: 20,
        },
      },
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found: ${id}`);
    }

    await this.cache.set(cacheKey, topic, { ttl: 3600, tags: [`tenant:${tenantId}:topics`] });

    return topic;
  }

  /**
   * Update a topic
   */
  async update(tenantId: string, id: string, data: Partial<CreateTopicDto>) {
    await this.findById(tenantId, id);

    if (data.slug) {
      const duplicate = await this.prisma.topic.findFirst({
        where: {
          tenantId,
          slug: data.slug,
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new ConflictException(`Topic with slug "${data.slug}" already exists`);
      }
    }

    const topic = await this.prisma.topic.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        searchVolume: data.searchVolume,
        difficulty: data.difficulty,
        relevanceScore: data.relevanceScore,
        parentId: data.parentId,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    await this.indexTopic(topic);
    await this.cache.deleteByPattern(`tenant:${tenantId}:topic:*`);

    this.logger.log(`Updated topic: ${id}`);

    return topic;
  }

  /**
   * Delete a topic
   */
  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);

    await this.prisma.topic.delete({ where: { id } });
    await this.search.delete('topics', id);
    await this.cache.deleteByPattern(`tenant:${tenantId}:topic:*`);

    this.logger.log(`Deleted topic: ${id}`);
  }

  /**
   * Get topic suggestions based on content or keywords
   */
  async getSuggestions(
    tenantId: string,
    options: {
      keywords?: string[];
      content?: string;
      limit?: number;
    },
  ) {
    const { keywords = [], content, limit = 10 } = options;

    // Build search query from keywords and content
    const searchTerms = [...keywords];
    if (content) {
      // Extract key terms from content (simplified extraction)
      const words = content
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 4);
      const wordFreq = words.reduce((acc: Record<string, number>, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
      const topWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
      searchTerms.push(...topWords);
    }

    if (searchTerms.length === 0) {
      // Return popular topics if no search terms
      return this.prisma.topic.findMany({
        where: { tenantId },
        orderBy: { searchVolume: 'desc' },
        take: limit,
        include: {
          _count: { select: { contentTopics: true } },
        },
      });
    }

    // Search for matching topics
    const searchQuery = searchTerms.join(' ');
    const searchResults = await this.search.search('topics', {
      query: searchQuery,
      filters: { tenantId },
      limit,
    });

    const topicIds = searchResults.hits.map((h) => h.id);

    if (topicIds.length === 0) {
      return [];
    }

    return this.prisma.topic.findMany({
      where: { id: { in: topicIds } },
      include: {
        _count: { select: { contentTopics: true } },
      },
    });
  }

  /**
   * Get topic hierarchy (tree structure)
   */
  async getHierarchy(tenantId: string) {
    const cacheKey = `tenant:${tenantId}:topic:hierarchy`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const allTopics = await this.prisma.topic.findMany({
      where: { tenantId },
      include: {
        _count: { select: { contentTopics: true } },
      },
      orderBy: { name: 'asc' },
    });

    // Build tree structure
    const topicMap = new Map(allTopics.map((t) => [t.id, { ...t, children: [] as any[] }]));
    const rootTopics: any[] = [];

    for (const topic of topicMap.values()) {
      if (topic.parentId && topicMap.has(topic.parentId)) {
        topicMap.get(topic.parentId)!.children.push(topic);
      } else {
        rootTopics.push(topic);
      }
    }

    await this.cache.set(cacheKey, rootTopics, { ttl: 600, tags: [`tenant:${tenantId}:topics`] });

    return rootTopics;
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, trim: true });
  }

  /**
   * Index topic in OpenSearch
   */
  private async indexTopic(topic: any) {
    const document = {
      tenantId: topic.tenantId,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      searchVolume: topic.searchVolume,
      difficulty: topic.difficulty,
      relevanceScore: topic.relevanceScore,
      parentId: topic.parentId,
      createdAt: topic.createdAt,
    };

    await this.search.index('topics', topic.id, document);
  }
}
