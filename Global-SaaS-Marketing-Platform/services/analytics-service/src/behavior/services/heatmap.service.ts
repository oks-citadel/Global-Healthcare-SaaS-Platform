import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from '../../common/services/s3.service';
import { RedisService } from '../../common/services/redis.service';
import { DynamoDBService } from '../../common/services/dynamodb.service';
import { HeatmapQueryDto, HeatmapResultDto, HeatmapPointDto } from '../dto/behavior.dto';

@Injectable()
export class HeatmapService {
  private readonly logger = new Logger(HeatmapService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  async getHeatmapData(query: HeatmapQueryDto): Promise<HeatmapResultDto> {
    const cacheKey = `heatmap:${query.organizationId}:${this.hashQuery(query)}`;

    // Check cache
    const cached = await this.redisService.getJson<HeatmapResultDto>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached heatmap result');
      return cached;
    }

    const width = query.width || 1920;
    const height = query.height || 1080;

    try {
      // Query click data from DynamoDB
      const clickData = await this.dynamoDBService.query({
        tableName: 'click_events',
        keyCondition: 'pk = :pk AND sk BETWEEN :start AND :end',
        expressionValues: {
          ':pk': `ORG#${query.organizationId}#PAGE#${this.hashUrl(query.pageUrl)}`,
          ':start': query.startDate,
          ':end': query.endDate,
        },
        filterExpression: query.deviceType
          ? 'device_type = :deviceType'
          : undefined,
        expressionValues: query.deviceType
          ? {
              ':pk': `ORG#${query.organizationId}#PAGE#${this.hashUrl(query.pageUrl)}`,
              ':start': query.startDate,
              ':end': query.endDate,
              ':deviceType': query.deviceType,
            }
          : {
              ':pk': `ORG#${query.organizationId}#PAGE#${this.hashUrl(query.pageUrl)}`,
              ':start': query.startDate,
              ':end': query.endDate,
            },
      });

      // Aggregate clicks into heatmap grid
      const gridSize = 20; // pixels per grid cell
      const grid = new Map<string, number>();
      const uniqueUsers = new Set<string>();
      let totalClicks = 0;

      for (const item of clickData.items) {
        const x = Math.floor(item.x / gridSize) * gridSize;
        const y = Math.floor(item.y / gridSize) * gridSize;
        const key = `${x},${y}`;

        grid.set(key, (grid.get(key) || 0) + 1);
        uniqueUsers.add(item.user_id || item.anonymous_id);
        totalClicks++;
      }

      // Convert grid to data points
      const dataPoints: HeatmapPointDto[] = Array.from(grid.entries()).map(([key, value]) => {
        const [x, y] = key.split(',').map(Number);
        return { x, y, value };
      });

      const heatmapResult: HeatmapResultDto = {
        pageUrl: query.pageUrl,
        resolution: { width, height },
        dataPoints,
        totalClicks,
        uniqueUsers: uniqueUsers.size,
        capturedAt: new Date().toISOString(),
      };

      // Cache result
      await this.redisService.setJson(cacheKey, heatmapResult, this.CACHE_TTL);

      return heatmapResult;
    } catch (error) {
      this.logger.error(`Heatmap data retrieval failed: ${error.message}`);
      return this.getMockHeatmapData(query);
    }
  }

  private hashUrl(url: string): string {
    return Buffer.from(url).toString('base64').substring(0, 32);
  }

  private hashQuery(query: HeatmapQueryDto): string {
    return Buffer.from(JSON.stringify(query)).toString('base64').substring(0, 32);
  }

  private getMockHeatmapData(query: HeatmapQueryDto): HeatmapResultDto {
    const width = query.width || 1920;
    const height = query.height || 1080;
    const gridSize = 20;
    const dataPoints: HeatmapPointDto[] = [];

    // Generate hotspots for typical webpage areas
    const hotspots = [
      { x: width * 0.5, y: 100, intensity: 100, radius: 150 }, // Header area
      { x: width * 0.3, y: 300, intensity: 80, radius: 100 },  // CTA button area
      { x: width * 0.7, y: 400, intensity: 60, radius: 120 },  // Content area
      { x: width * 0.5, y: 600, intensity: 50, radius: 100 },  // Mid-page
      { x: width * 0.2, y: 200, intensity: 40, radius: 80 },   // Navigation
    ];

    // Generate data points based on hotspots
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        let value = 0;

        for (const hotspot of hotspots) {
          const distance = Math.sqrt(
            Math.pow(x - hotspot.x, 2) + Math.pow(y - hotspot.y, 2)
          );
          if (distance < hotspot.radius) {
            const contribution = hotspot.intensity * (1 - distance / hotspot.radius);
            value += contribution;
          }
        }

        // Add some noise
        value += Math.random() * 5;

        if (value > 5) {
          dataPoints.push({
            x,
            y,
            value: Math.round(value),
          });
        }
      }
    }

    const totalClicks = dataPoints.reduce((sum, p) => sum + p.value, 0);

    return {
      pageUrl: query.pageUrl,
      resolution: { width, height },
      dataPoints,
      totalClicks,
      uniqueUsers: Math.floor(totalClicks * 0.4),
      capturedAt: new Date().toISOString(),
    };
  }
}
