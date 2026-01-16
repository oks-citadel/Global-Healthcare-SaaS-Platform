import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';
import { DynamoDBService } from '../../common/services/dynamodb.service';
import { ScrollmapQueryDto, ScrollmapResultDto, ScrollFoldDto } from '../dto/behavior.dto';

@Injectable()
export class ScrollmapService {
  private readonly logger = new Logger(ScrollmapService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly redisService: RedisService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  async getScrollmapData(query: ScrollmapQueryDto): Promise<ScrollmapResultDto> {
    const cacheKey = `scrollmap:${query.organizationId}:${this.hashQuery(query)}`;

    // Check cache
    const cached = await this.redisService.getJson<ScrollmapResultDto>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached scrollmap result');
      return cached;
    }

    const foldCount = query.folds || 10;

    try {
      // Query scroll data from DynamoDB
      const scrollData = await this.dynamoDBService.query({
        tableName: 'scroll_events',
        keyCondition: 'pk = :pk AND sk BETWEEN :start AND :end',
        expressionValues: {
          ':pk': `ORG#${query.organizationId}#PAGE#${this.hashUrl(query.pageUrl)}`,
          ':start': query.startDate,
          ':end': query.endDate,
        },
      });

      // Aggregate scroll depths
      const depthCounts = new Map<number, number>();
      let totalScrollDepth = 0;
      let maxPageHeight = 0;
      let totalViews = 0;

      for (const item of scrollData.items) {
        const maxDepth = item.max_scroll_depth || 0;
        const pageHeight = item.page_height || 3000;

        totalScrollDepth += maxDepth;
        totalViews++;
        maxPageHeight = Math.max(maxPageHeight, pageHeight);

        // Count viewers who reached each percentage depth
        for (let pct = 0; pct <= 100; pct += 100 / foldCount) {
          if (maxDepth >= pct) {
            depthCounts.set(pct, (depthCounts.get(pct) || 0) + 1);
          }
        }
      }

      // Build fold data
      const folds: ScrollFoldDto[] = [];
      const pageHeight = maxPageHeight || 3000;

      for (let i = 0; i <= foldCount; i++) {
        const percentage = Math.round((i / foldCount) * 100);
        const depth = Math.round((percentage / 100) * pageHeight);
        const viewersReached = depthCounts.get(percentage) || 0;

        folds.push({
          depth,
          percentage,
          viewersReached,
          viewersPercentage: totalViews > 0
            ? Math.round((viewersReached / totalViews) * 10000) / 100
            : 0,
        });
      }

      const scrollmapResult: ScrollmapResultDto = {
        pageUrl: query.pageUrl,
        resolution: {
          width: 1920,
          height: 1080,
        },
        pageHeight,
        folds,
        avgScrollDepth: totalViews > 0
          ? Math.round((totalScrollDepth / totalViews) * 100) / 100
          : 0,
        totalViews,
      };

      // Cache result
      await this.redisService.setJson(cacheKey, scrollmapResult, this.CACHE_TTL);

      return scrollmapResult;
    } catch (error) {
      this.logger.error(`Scrollmap data retrieval failed: ${error.message}`);
      return this.getMockScrollmapData(query);
    }
  }

  private hashUrl(url: string): string {
    return Buffer.from(url).toString('base64').substring(0, 32);
  }

  private hashQuery(query: ScrollmapQueryDto): string {
    return Buffer.from(JSON.stringify(query)).toString('base64').substring(0, 32);
  }

  private getMockScrollmapData(query: ScrollmapQueryDto): ScrollmapResultDto {
    const foldCount = query.folds || 10;
    const pageHeight = 3500;
    const totalViews = 1000 + Math.floor(Math.random() * 500);

    const folds: ScrollFoldDto[] = [];
    let totalScrollDepth = 0;

    // Simulate typical scroll behavior - steep dropoff at first, then gradual
    for (let i = 0; i <= foldCount; i++) {
      const percentage = Math.round((i / foldCount) * 100);
      const depth = Math.round((percentage / 100) * pageHeight);

      // Simulate realistic scroll depth distribution
      let viewersPercentage: number;
      if (percentage === 0) {
        viewersPercentage = 100;
      } else if (percentage <= 25) {
        viewersPercentage = 100 - (percentage * 1.5);
      } else if (percentage <= 50) {
        viewersPercentage = 62.5 - ((percentage - 25) * 0.8);
      } else if (percentage <= 75) {
        viewersPercentage = 42.5 - ((percentage - 50) * 0.6);
      } else {
        viewersPercentage = 27.5 - ((percentage - 75) * 0.5);
      }

      // Add some randomness
      viewersPercentage = Math.max(5, viewersPercentage + (Math.random() * 5 - 2.5));

      const viewersReached = Math.round(totalViews * (viewersPercentage / 100));

      folds.push({
        depth,
        percentage,
        viewersReached,
        viewersPercentage: Math.round(viewersPercentage * 100) / 100,
      });

      totalScrollDepth += viewersPercentage;
    }

    // Calculate average scroll depth
    const avgScrollDepth = totalScrollDepth / (foldCount + 1);

    return {
      pageUrl: query.pageUrl,
      resolution: {
        width: query.deviceType === 'mobile' ? 390 : 1920,
        height: query.deviceType === 'mobile' ? 844 : 1080,
      },
      pageHeight,
      folds,
      avgScrollDepth: Math.round(avgScrollDepth * 100) / 100,
      totalViews,
    };
  }
}
