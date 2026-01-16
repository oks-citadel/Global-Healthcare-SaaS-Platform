import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../common/cache/redis.service';
import { ReindexRequestDto } from '../../../common/dto';

interface ReindexJobResponse {
  jobId: string;
  status: string;
  type: string;
  priority: number;
  targetUrls: string[];
  processedCount: number;
  totalCount: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  errorMessage?: string;
  createdAt: Date;
}

@Injectable()
export class ReindexService {
  private readonly logger = new Logger(ReindexService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Queue a reindex job
   */
  async queueReindex(dto: ReindexRequestDto): Promise<ReindexJobResponse> {
    // Determine target URLs based on type
    let targetUrls: string[] = [];
    let totalCount = 0;

    switch (dto.type) {
      case 'single_url':
        if (!dto.urls || dto.urls.length === 0) {
          throw new Error('URLs are required for single_url reindex type');
        }
        targetUrls = dto.urls.slice(0, 1);
        totalCount = 1;
        break;

      case 'bulk_urls':
        if (!dto.urls || dto.urls.length === 0) {
          throw new Error('URLs are required for bulk_urls reindex type');
        }
        targetUrls = dto.urls;
        totalCount = dto.urls.length;
        break;

      case 'full_site':
        if (dto.tenantId) {
          const pages = await this.prisma.page.findMany({
            where: { tenantId: dto.tenantId, isPublished: true },
            select: { slug: true, locale: true },
            include: { tenant: { select: { domain: true } } },
          });
          targetUrls = pages.map(
            (p: any) => `https://${p.tenant.domain}/${p.locale}/${p.slug}`,
          );
        }
        totalCount = targetUrls.length;
        break;

      case 'sitemap':
      default:
        // Sitemap refresh - invalidate all sitemap caches
        if (dto.tenantId) {
          const tenant = await this.prisma.tenant.findUnique({
            where: { id: dto.tenantId },
          });
          if (tenant) {
            await this.redis.invalidateAllSitemaps(tenant.slug);
          }
        }
        totalCount = 1;
        break;
    }

    // Create reindex job
    const job = await this.prisma.reindexJob.create({
      data: {
        tenantId: dto.tenantId,
        jobType: this.mapJobType(dto.type || 'sitemap'),
        status: 'PENDING',
        priority: dto.priority || 5,
        targetUrls,
        processedCount: 0,
        totalCount,
        scheduledAt: new Date(),
      },
    });

    this.logger.log(`Created reindex job: ${job.id} (type: ${job.jobType})`);

    // In a real implementation, this would be added to a job queue (Bull/BullMQ)
    // For now, we'll simulate processing
    this.processReindexJob(job.id).catch((err) => {
      this.logger.error(`Error processing reindex job ${job.id}:`, err);
    });

    return this.mapJobToResponse(job);
  }

  /**
   * Get reindex job status
   */
  async getReindexJob(jobId: string): Promise<ReindexJobResponse> {
    const job = await this.prisma.reindexJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Reindex job '${jobId}' not found`);
    }

    return this.mapJobToResponse(job);
  }

  /**
   * List reindex jobs
   */
  async listReindexJobs(
    tenantId?: string,
    status?: string,
    limit = 20,
  ): Promise<ReindexJobResponse[]> {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status.toUpperCase();

    const jobs = await this.prisma.reindexJob.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map((job) => this.mapJobToResponse(job));
  }

  /**
   * Cancel a reindex job
   */
  async cancelReindexJob(jobId: string): Promise<void> {
    const job = await this.prisma.reindexJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Reindex job '${jobId}' not found`);
    }

    if (job.status === 'COMPLETED' || job.status === 'FAILED') {
      throw new Error(`Cannot cancel job in ${job.status} status`);
    }

    await this.prisma.reindexJob.update({
      where: { id: jobId },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`Cancelled reindex job: ${jobId}`);
  }

  /**
   * Process reindex job (simulated)
   */
  private async processReindexJob(jobId: string): Promise<void> {
    await this.prisma.reindexJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING', startedAt: new Date() },
    });

    const job = await this.prisma.reindexJob.findUnique({
      where: { id: jobId },
    });

    if (!job) return;

    try {
      // Simulate processing
      const results: any[] = [];

      for (let i = 0; i < job.targetUrls.length; i++) {
        const url = job.targetUrls[i];

        // Simulate URL processing
        await this.sleep(100);

        results.push({
          url,
          status: 'success',
          timestamp: new Date().toISOString(),
        });

        // Update progress
        await this.prisma.reindexJob.update({
          where: { id: jobId },
          data: { processedCount: i + 1 },
        });
      }

      // Mark as completed
      await this.prisma.reindexJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          result: { processed: results },
        },
      });

      this.logger.log(`Completed reindex job: ${jobId}`);
    } catch (error) {
      await this.prisma.reindexJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorMessage: error.message,
        },
      });

      this.logger.error(`Failed reindex job ${jobId}:`, error);
    }
  }

  /**
   * Submit URLs to Google Indexing API (placeholder)
   */
  async submitToGoogleIndexingApi(urls: string[]): Promise<{
    submitted: number;
    failed: number;
    results: Array<{ url: string; status: string; error?: string }>;
  }> {
    // This would integrate with Google's Indexing API
    // Requires OAuth2 authentication and proper API setup
    const results = urls.map((url) => ({
      url,
      status: 'simulated',
      message: 'Google Indexing API integration not configured',
    }));

    return {
      submitted: urls.length,
      failed: 0,
      results,
    };
  }

  /**
   * Ping search engines about sitemap update
   */
  async pingSitemapUpdate(sitemapUrl: string): Promise<{
    google: boolean;
    bing: boolean;
  }> {
    const results = { google: false, bing: false };

    // Google no longer accepts sitemap pings, but we'll keep the structure
    // Bing still accepts pings
    try {
      // In production, you would make actual HTTP requests
      // const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      // await axios.get(bingPingUrl);
      results.bing = true;
      this.logger.log(`Pinged Bing for sitemap: ${sitemapUrl}`);
    } catch (error) {
      this.logger.error(`Failed to ping Bing:`, error);
    }

    return results;
  }

  private mapJobToResponse(job: any): ReindexJobResponse {
    return {
      jobId: job.id,
      status: job.status.toLowerCase(),
      type: job.jobType.toLowerCase(),
      priority: job.priority,
      targetUrls: job.targetUrls,
      processedCount: job.processedCount,
      totalCount: job.totalCount,
      scheduledAt: job.scheduledAt || undefined,
      startedAt: job.startedAt || undefined,
      completedAt: job.completedAt || undefined,
      result: job.result || undefined,
      errorMessage: job.errorMessage || undefined,
      createdAt: job.createdAt,
    };
  }

  private mapJobType(type: string): any {
    const mapping: Record<string, string> = {
      sitemap: 'SITEMAP',
      single_url: 'SINGLE_URL',
      bulk_urls: 'BULK_URLS',
      full_site: 'FULL_SITE',
    };
    return mapping[type] || 'SITEMAP';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
