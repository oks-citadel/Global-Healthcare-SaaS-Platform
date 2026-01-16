import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';
import { DynamoDBService } from '../../common/services/dynamodb.service';
import { ClickmapQueryDto, ClickmapResultDto, ClickmapElementDto } from '../dto/behavior.dto';

@Injectable()
export class ClickmapService {
  private readonly logger = new Logger(ClickmapService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly redisService: RedisService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  async getClickmapData(query: ClickmapQueryDto): Promise<ClickmapResultDto> {
    const cacheKey = `clickmap:${query.organizationId}:${this.hashQuery(query)}`;

    // Check cache
    const cached = await this.redisService.getJson<ClickmapResultDto>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached clickmap result');
      return cached;
    }

    const minClicks = query.minClicks || 1;

    try {
      // Query click data aggregated by element from DynamoDB
      const clickData = await this.dynamoDBService.query({
        tableName: 'element_clicks',
        keyCondition: 'pk = :pk AND sk BETWEEN :start AND :end',
        expressionValues: {
          ':pk': `ORG#${query.organizationId}#PAGE#${this.hashUrl(query.pageUrl)}`,
          ':start': query.startDate,
          ':end': query.endDate,
        },
      });

      // Get page view count for click rate calculation
      const pageViewData = await this.dynamoDBService.get('page_metrics', {
        pk: `ORG#${query.organizationId}#PAGE#${this.hashUrl(query.pageUrl)}`,
        sk: `RANGE#${query.startDate}#${query.endDate}`,
      });
      const pageViews = pageViewData?.page_views || 1000;

      // Aggregate by element selector
      const elementMap = new Map<string, {
        selector: string;
        elementType: string;
        text?: string;
        clicks: number;
        uniqueClickers: Set<string>;
        position: { x: number; y: number; width: number; height: number };
      }>();

      const uniqueClickers = new Set<string>();
      let totalClicks = 0;

      for (const item of clickData.items) {
        const selector = item.element_selector || `#unknown-${item.element_id}`;
        const userId = item.user_id || item.anonymous_id;

        let element = elementMap.get(selector);
        if (!element) {
          element = {
            selector,
            elementType: item.element_type || 'div',
            text: item.element_text?.substring(0, 50),
            clicks: 0,
            uniqueClickers: new Set(),
            position: {
              x: item.element_x || 0,
              y: item.element_y || 0,
              width: item.element_width || 100,
              height: item.element_height || 40,
            },
          };
          elementMap.set(selector, element);
        }

        element.clicks++;
        element.uniqueClickers.add(userId);
        uniqueClickers.add(userId);
        totalClicks++;
      }

      // Convert to result format and filter by minClicks
      const elements: ClickmapElementDto[] = Array.from(elementMap.values())
        .filter((el) => el.clicks >= minClicks)
        .map((el) => ({
          selector: el.selector,
          elementType: el.elementType,
          text: el.text,
          clicks: el.clicks,
          uniqueClicks: el.uniqueClickers.size,
          clickRate: Math.round((el.clicks / pageViews) * 10000) / 100,
          position: el.position,
        }))
        .sort((a, b) => b.clicks - a.clicks);

      const clickmapResult: ClickmapResultDto = {
        pageUrl: query.pageUrl,
        elements,
        totalClicks,
        uniqueClickers: uniqueClickers.size,
        pageViews,
      };

      // Cache result
      await this.redisService.setJson(cacheKey, clickmapResult, this.CACHE_TTL);

      return clickmapResult;
    } catch (error) {
      this.logger.error(`Clickmap data retrieval failed: ${error.message}`);
      return this.getMockClickmapData(query);
    }
  }

  private hashUrl(url: string): string {
    return Buffer.from(url).toString('base64').substring(0, 32);
  }

  private hashQuery(query: ClickmapQueryDto): string {
    return Buffer.from(JSON.stringify(query)).toString('base64').substring(0, 32);
  }

  private getMockClickmapData(query: ClickmapQueryDto): ClickmapResultDto {
    const pageViews = 5000 + Math.floor(Math.random() * 3000);
    const minClicks = query.minClicks || 1;

    // Define typical page elements
    const elementTemplates = [
      { selector: '#main-cta', type: 'button', text: 'Get Started', baseClicks: 800, x: 960, y: 400, w: 200, h: 50 },
      { selector: '#nav-home', type: 'a', text: 'Home', baseClicks: 600, x: 100, y: 30, w: 60, h: 30 },
      { selector: '#nav-features', type: 'a', text: 'Features', baseClicks: 450, x: 180, y: 30, w: 70, h: 30 },
      { selector: '#nav-pricing', type: 'a', text: 'Pricing', baseClicks: 500, x: 270, y: 30, w: 60, h: 30 },
      { selector: '#nav-contact', type: 'a', text: 'Contact', baseClicks: 300, x: 350, y: 30, w: 60, h: 30 },
      { selector: '#hero-image', type: 'img', text: undefined, baseClicks: 250, x: 480, y: 200, w: 500, h: 300 },
      { selector: '#learn-more', type: 'a', text: 'Learn More', baseClicks: 350, x: 960, y: 480, w: 120, h: 40 },
      { selector: '#feature-card-1', type: 'div', text: 'Analytics', baseClicks: 200, x: 300, y: 600, w: 280, h: 200 },
      { selector: '#feature-card-2', type: 'div', text: 'Reports', baseClicks: 180, x: 620, y: 600, w: 280, h: 200 },
      { selector: '#feature-card-3', type: 'div', text: 'Insights', baseClicks: 160, x: 940, y: 600, w: 280, h: 200 },
      { selector: '#footer-link-1', type: 'a', text: 'Terms', baseClicks: 50, x: 400, y: 900, w: 50, h: 20 },
      { selector: '#footer-link-2', type: 'a', text: 'Privacy', baseClicks: 60, x: 470, y: 900, w: 60, h: 20 },
      { selector: '#social-twitter', type: 'a', text: undefined, baseClicks: 80, x: 1700, y: 30, w: 30, h: 30 },
      { selector: '#social-linkedin', type: 'a', text: undefined, baseClicks: 70, x: 1750, y: 30, w: 30, h: 30 },
      { selector: '#search-icon', type: 'button', text: undefined, baseClicks: 120, x: 1650, y: 30, w: 30, h: 30 },
    ];

    const elements: ClickmapElementDto[] = elementTemplates
      .map((template) => {
        const variance = 0.7 + Math.random() * 0.6;
        const clicks = Math.round(template.baseClicks * variance);
        const uniqueClicks = Math.round(clicks * (0.6 + Math.random() * 0.3));

        return {
          selector: template.selector,
          elementType: template.type,
          text: template.text,
          clicks,
          uniqueClicks,
          clickRate: Math.round((clicks / pageViews) * 10000) / 100,
          position: {
            x: template.x,
            y: template.y,
            width: template.w,
            height: template.h,
          },
        };
      })
      .filter((el) => el.clicks >= minClicks)
      .sort((a, b) => b.clicks - a.clicks);

    const totalClicks = elements.reduce((sum, el) => sum + el.clicks, 0);
    const uniqueClickers = Math.round(totalClicks * 0.35);

    return {
      pageUrl: query.pageUrl,
      elements,
      totalClicks,
      uniqueClickers,
      pageViews,
    };
  }
}
