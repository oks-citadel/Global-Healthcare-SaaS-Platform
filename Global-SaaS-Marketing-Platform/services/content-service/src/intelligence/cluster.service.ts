import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { TopicClusterType, Prisma } from '@prisma/client';

export interface CreateClusterDto {
  name: string;
  description?: string;
  pillarTopicId?: string;
  mappings?: {
    pageId: string;
    type?: TopicClusterType;
    position?: number;
  }[];
}

export interface ClusterQueryDto {
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable()
export class ClusterService {
  private readonly logger = new Logger(ClusterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Create a new topic cluster
   */
  async create(tenantId: string, data: CreateClusterDto) {
    const cluster = await this.prisma.topicCluster.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        pillarTopicId: data.pillarTopicId,
        totalPages: data.mappings?.length || 0,
      },
    });

    // Create mappings if provided
    if (data.mappings && data.mappings.length > 0) {
      await this.prisma.topicClusterMapping.createMany({
        data: data.mappings.map((m, index) => ({
          clusterId: cluster.id,
          pageId: m.pageId,
          type: m.type || TopicClusterType.CLUSTER,
          position: m.position ?? index,
        })),
      });
    }

    await this.cache.deleteByPattern(`tenant:${tenantId}:cluster:*`);

    this.logger.log(`Created topic cluster: ${cluster.id}`);

    return this.findById(tenantId, cluster.id);
  }

  /**
   * Find all clusters with filtering and pagination
   */
  async findAll(tenantId: string, query: ClusterQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const cacheKey = this.cache.buildListCacheKey(tenantId, 'clusters', query);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where: Prisma.TopicClusterWhereInput = { tenantId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const result = await this.prisma.paginate(this.prisma.topicCluster, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        pillarTopic: true,
        _count: {
          select: { mappings: true },
        },
      },
    });

    await this.cache.set(cacheKey, result, { ttl: 300, tags: [`tenant:${tenantId}:clusters`] });

    return result;
  }

  /**
   * Get cluster by ID with full details
   */
  async findById(tenantId: string, id: string) {
    const cacheKey = `tenant:${tenantId}:cluster:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const cluster = await this.prisma.topicCluster.findFirst({
      where: { id, tenantId },
      include: {
        pillarTopic: true,
        mappings: {
          include: {
            page: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                publishedAt: true,
                performance: {
                  orderBy: { date: 'desc' },
                  take: 1,
                },
              },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!cluster) {
      throw new NotFoundException(`Topic cluster not found: ${id}`);
    }

    // Calculate cluster metrics
    const clusterWithMetrics = {
      ...cluster,
      metrics: this.calculateClusterMetrics(cluster),
    };

    await this.cache.set(cacheKey, clusterWithMetrics, {
      ttl: 3600,
      tags: [`tenant:${tenantId}:clusters`],
    });

    return clusterWithMetrics;
  }

  /**
   * Update a cluster
   */
  async update(tenantId: string, id: string, data: Partial<CreateClusterDto>) {
    await this.findById(tenantId, id);

    const cluster = await this.prisma.topicCluster.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        pillarTopicId: data.pillarTopicId,
      },
    });

    await this.cache.deleteByPattern(`tenant:${tenantId}:cluster:*`);

    this.logger.log(`Updated topic cluster: ${id}`);

    return this.findById(tenantId, id);
  }

  /**
   * Delete a cluster
   */
  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);

    await this.prisma.topicCluster.delete({ where: { id } });
    await this.cache.deleteByPattern(`tenant:${tenantId}:cluster:*`);

    this.logger.log(`Deleted topic cluster: ${id}`);
  }

  /**
   * Add a page to a cluster
   */
  async addPageToCluster(
    tenantId: string,
    clusterId: string,
    pageId: string,
    type: TopicClusterType = TopicClusterType.CLUSTER,
    position?: number,
  ) {
    const cluster = await this.findById(tenantId, clusterId);

    // Check if already in cluster
    const existing = await this.prisma.topicClusterMapping.findUnique({
      where: { clusterId_pageId: { clusterId, pageId } },
    });

    if (existing) {
      throw new BadRequestException('Page is already in this cluster');
    }

    // Get next position if not specified
    const pos =
      position ??
      (await this.prisma.topicClusterMapping.count({ where: { clusterId } }));

    await this.prisma.topicClusterMapping.create({
      data: {
        clusterId,
        pageId,
        type,
        position: pos,
      },
    });

    // Update total pages count
    await this.prisma.topicCluster.update({
      where: { id: clusterId },
      data: { totalPages: { increment: 1 } },
    });

    await this.cache.deleteByPattern(`tenant:${tenantId}:cluster:*`);

    this.logger.log(`Added page ${pageId} to cluster ${clusterId}`);

    return this.findById(tenantId, clusterId);
  }

  /**
   * Remove a page from a cluster
   */
  async removePageFromCluster(
    tenantId: string,
    clusterId: string,
    pageId: string,
  ) {
    await this.findById(tenantId, clusterId);

    const mapping = await this.prisma.topicClusterMapping.findUnique({
      where: { clusterId_pageId: { clusterId, pageId } },
    });

    if (!mapping) {
      throw new NotFoundException('Page is not in this cluster');
    }

    await this.prisma.topicClusterMapping.delete({
      where: { clusterId_pageId: { clusterId, pageId } },
    });

    // Update total pages count
    await this.prisma.topicCluster.update({
      where: { id: clusterId },
      data: { totalPages: { decrement: 1 } },
    });

    await this.cache.deleteByPattern(`tenant:${tenantId}:cluster:*`);

    this.logger.log(`Removed page ${pageId} from cluster ${clusterId}`);

    return this.findById(tenantId, clusterId);
  }

  /**
   * Update page position in cluster
   */
  async updatePagePosition(
    tenantId: string,
    clusterId: string,
    pageId: string,
    position: number,
  ) {
    await this.findById(tenantId, clusterId);

    await this.prisma.topicClusterMapping.update({
      where: { clusterId_pageId: { clusterId, pageId } },
      data: { position },
    });

    await this.cache.deleteByPattern(`tenant:${tenantId}:cluster:*`);

    return this.findById(tenantId, clusterId);
  }

  /**
   * Set pillar page for cluster
   */
  async setPillarPage(
    tenantId: string,
    clusterId: string,
    pageId: string,
  ) {
    const cluster = await this.findById(tenantId, clusterId);

    // Update existing pillar to cluster type if exists
    const existingPillar = cluster.mappings.find(
      (m: any) => m.type === TopicClusterType.PILLAR,
    );
    if (existingPillar) {
      await this.prisma.topicClusterMapping.update({
        where: { id: existingPillar.id },
        data: { type: TopicClusterType.CLUSTER },
      });
    }

    // Set new pillar
    const mapping = await this.prisma.topicClusterMapping.findUnique({
      where: { clusterId_pageId: { clusterId, pageId } },
    });

    if (mapping) {
      await this.prisma.topicClusterMapping.update({
        where: { id: mapping.id },
        data: { type: TopicClusterType.PILLAR, position: 0 },
      });
    } else {
      await this.prisma.topicClusterMapping.create({
        data: {
          clusterId,
          pageId,
          type: TopicClusterType.PILLAR,
          position: 0,
        },
      });

      await this.prisma.topicCluster.update({
        where: { id: clusterId },
        data: { totalPages: { increment: 1 } },
      });
    }

    await this.cache.deleteByPattern(`tenant:${tenantId}:cluster:*`);

    this.logger.log(`Set pillar page ${pageId} for cluster ${clusterId}`);

    return this.findById(tenantId, clusterId);
  }

  /**
   * Get cluster visualization data
   */
  async getVisualizationData(tenantId: string, clusterId: string) {
    const cluster = await this.findById(tenantId, clusterId);

    const nodes = cluster.mappings.map((mapping: any) => ({
      id: mapping.page.id,
      label: mapping.page.title,
      type: mapping.type,
      status: mapping.page.status,
      performance: mapping.page.performance[0] || null,
    }));

    // Create edges from pillar to all cluster pages
    const pillarPage = cluster.mappings.find(
      (m: any) => m.type === TopicClusterType.PILLAR,
    );

    const edges = pillarPage
      ? cluster.mappings
          .filter((m: any) => m.type !== TopicClusterType.PILLAR)
          .map((m: any) => ({
            source: pillarPage.page.id,
            target: m.page.id,
          }))
      : [];

    return {
      cluster: {
        id: cluster.id,
        name: cluster.name,
        pillarTopic: cluster.pillarTopic,
      },
      nodes,
      edges,
      metrics: cluster.metrics,
    };
  }

  /**
   * Calculate cluster metrics
   */
  private calculateClusterMetrics(cluster: any) {
    const pages = cluster.mappings.map((m: any) => m.page);
    const publishedPages = pages.filter((p: any) => p.status === 'PUBLISHED');

    // Aggregate performance data
    const performances = pages
      .flatMap((p: any) => p.performance || [])
      .filter(Boolean);

    const totalPageViews = performances.reduce(
      (sum: number, p: any) => sum + (p.pageViews || 0),
      0,
    );

    const avgDwellTime =
      performances.length > 0
        ? performances.reduce((sum: number, p: any) => sum + (p.avgDwellTime || 0), 0) /
          performances.length
        : 0;

    const totalConversions = performances.reduce(
      (sum: number, p: any) => sum + (p.conversions || 0),
      0,
    );

    return {
      totalPages: pages.length,
      publishedPages: publishedPages.length,
      draftPages: pages.length - publishedPages.length,
      pillarPage: cluster.mappings.find(
        (m: any) => m.type === TopicClusterType.PILLAR,
      )?.page || null,
      performance: {
        totalPageViews,
        avgDwellTime: Math.round(avgDwellTime * 100) / 100,
        totalConversions,
      },
    };
  }
}
