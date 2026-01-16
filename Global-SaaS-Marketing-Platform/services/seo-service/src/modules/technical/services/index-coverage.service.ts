import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IndexCoverageQueryDto, IndexCoverageResultDto } from '../../../common/dto';

@Injectable()
export class IndexCoverageService {
  private readonly logger = new Logger(IndexCoverageService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getIndexCoverage(query: IndexCoverageQueryDto): Promise<IndexCoverageResultDto> {
    const where: any = {};
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: query.tenant } });
      if (tenant) where.tenantId = tenant.id;
    }
    if (query.status) where.indexStatus = query.status.toUpperCase();

    const coverage = await this.prisma.indexCoverage.findMany({
      where, take: query.limit || 100, orderBy: { updatedAt: 'desc' },
    });

    const indexed = coverage.filter(c => c.indexStatus === 'INDEXED').length;
    const notIndexed = coverage.filter(c => c.indexStatus === 'NOT_INDEXED').length;
    const excluded = coverage.filter(c => c.indexStatus === 'EXCLUDED').length;
    const errors = coverage.filter(c => c.issues !== null).length;

    return {
      summary: { total: coverage.length, indexed, notIndexed, excluded, errors },
      pages: coverage.map(c => ({
        url: c.url, status: c.indexStatus.toLowerCase() as any,
        crawlStatus: c.crawlStatus.toLowerCase() as any,
        lastCrawled: c.lastCrawled || undefined, lastIndexed: c.lastIndexed || undefined,
        issues: c.issues as any, robotsBlocked: c.robotsBlocked, noindexDetected: c.noindexDetected,
      })),
      coverage: {
        indexedPercentage: coverage.length > 0 ? Math.round((indexed / coverage.length) * 100) : 0,
        errorPercentage: coverage.length > 0 ? Math.round((errors / coverage.length) * 100) : 0,
        excludedPercentage: coverage.length > 0 ? Math.round((excluded / coverage.length) * 100) : 0,
      },
    };
  }

  async updateIndexStatus(url: string, status: string, issues?: any): Promise<void> {
    await this.prisma.indexCoverage.upsert({
      where: { url },
      update: { indexStatus: status.toUpperCase() as any, issues, lastCrawled: new Date() },
      create: { url, indexStatus: status.toUpperCase() as any, crawlStatus: 'CRAWLED', issues },
    });
  }
}
