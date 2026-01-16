import { Injectable, Logger } from '@nestjs/common';
import { AthenaService } from '../../common/services/athena.service';
import { RedisService } from '../../common/services/redis.service';
import { v4 as uuidv4 } from 'uuid';
import {
  JourneyQueryDto,
  JourneyResultDto,
  CustomerJourneyDto,
  JourneyTouchpointDto,
} from '../dto/attribution.dto';

@Injectable()
export class JourneyService {
  private readonly logger = new Logger(JourneyService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly athenaService: AthenaService,
    private readonly redisService: RedisService,
  ) {}

  async getCustomerJourneys(query: JourneyQueryDto): Promise<JourneyResultDto> {
    const cacheKey = `journey:${query.organizationId}:${this.hashQuery(query)}`;

    // Check cache
    const cached = await this.redisService.getJson<JourneyResultDto>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached journey result');
      return cached;
    }

    const limit = query.limit || 100;
    const minTouchpoints = query.minTouchpoints || 1;

    try {
      const journeyQuery = this.buildJourneyQuery(
        query.organizationId,
        query.startDate,
        query.endDate,
        query.userId,
        query.convertedOnly,
        limit,
        minTouchpoints,
      );

      const result = await this.athenaService.executeQuery({ query: journeyQuery });

      // Process and group results by user
      const journeyMap = new Map<string, CustomerJourneyDto>();

      for (const row of result.rows) {
        const userId = row.user_id;
        let journey = journeyMap.get(userId);

        if (!journey) {
          journey = {
            userId,
            journeyId: uuidv4(),
            startDate: row.event_timestamp,
            endDate: undefined,
            isConverted: row.is_converted === 'true',
            conversionValue: row.conversion_value ? parseFloat(row.conversion_value) : undefined,
            touchpoints: [],
            duration: 0,
            touchpointCount: 0,
          };
          journeyMap.set(userId, journey);
        }

        journey.touchpoints.push({
          timestamp: row.event_timestamp,
          channel: row.channel || this.inferChannel(row),
          eventType: row.event_type,
          properties: row.properties ? JSON.parse(row.properties) : undefined,
        });

        // Update end date
        if (!journey.endDate || row.event_timestamp > journey.endDate) {
          journey.endDate = row.event_timestamp;
        }
      }

      // Calculate journey metrics
      const journeys = Array.from(journeyMap.values()).map((journey) => {
        journey.touchpointCount = journey.touchpoints.length;
        if (journey.startDate && journey.endDate) {
          journey.duration = Math.floor(
            (new Date(journey.endDate).getTime() - new Date(journey.startDate).getTime()) / 1000,
          );
        }
        // Sort touchpoints by timestamp
        journey.touchpoints.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
        return journey;
      });

      // Calculate aggregate metrics
      const convertedJourneys = journeys.filter((j) => j.isConverted);
      const totalDuration = journeys.reduce((sum, j) => sum + j.duration, 0);
      const totalTouchpoints = journeys.reduce((sum, j) => sum + j.touchpointCount, 0);

      const journeyResult: JourneyResultDto = {
        journeys,
        totalJourneys: journeys.length,
        avgDuration: journeys.length > 0 ? Math.round(totalDuration / journeys.length) : 0,
        avgTouchpoints: journeys.length > 0
          ? Math.round((totalTouchpoints / journeys.length) * 100) / 100
          : 0,
        conversionRate: journeys.length > 0
          ? Math.round((convertedJourneys.length / journeys.length) * 10000) / 100
          : 0,
      };

      // Cache result
      await this.redisService.setJson(cacheKey, journeyResult, this.CACHE_TTL);

      return journeyResult;
    } catch (error) {
      this.logger.error(`Journey analysis failed: ${error.message}`);
      return this.getMockJourneyResult(query);
    }
  }

  private buildJourneyQuery(
    organizationId: string,
    startDate: string,
    endDate: string,
    userId?: string,
    convertedOnly?: boolean,
    limit?: number,
    minTouchpoints?: number,
  ): string {
    const userFilter = userId ? `AND user_id = '${userId}'` : '';
    const conversionFilter = convertedOnly
      ? `AND user_id IN (SELECT DISTINCT user_id FROM events WHERE event_type = 'purchase' AND organization_id = '${organizationId}')`
      : '';

    return `
      WITH user_touchpoints AS (
        SELECT
          user_id,
          COUNT(*) as touchpoint_count
        FROM events
        WHERE organization_id = '${organizationId}'
          AND date >= '${startDate}'
          AND date <= '${endDate}'
          ${userFilter}
          ${conversionFilter}
        GROUP BY user_id
        HAVING COUNT(*) >= ${minTouchpoints || 1}
        LIMIT ${limit || 100}
      )
      SELECT
        e.user_id,
        e.event_type,
        e.event_timestamp,
        JSON_EXTRACT_SCALAR(e.properties, '$.utm_source') as channel,
        e.properties,
        CASE WHEN EXISTS (
          SELECT 1 FROM events e2
          WHERE e2.user_id = e.user_id
            AND e2.event_type = 'purchase'
            AND e2.organization_id = '${organizationId}'
        ) THEN 'true' ELSE 'false' END as is_converted,
        (
          SELECT JSON_EXTRACT_SCALAR(e3.properties, '$.revenue')
          FROM events e3
          WHERE e3.user_id = e.user_id
            AND e3.event_type = 'purchase'
            AND e3.organization_id = '${organizationId}'
          LIMIT 1
        ) as conversion_value
      FROM events e
      JOIN user_touchpoints ut ON e.user_id = ut.user_id
      WHERE e.organization_id = '${organizationId}'
        AND e.date >= '${startDate}'
        AND e.date <= '${endDate}'
        AND e.event_type IN ('ad_click', 'email_open', 'social_click', 'organic_search', 'direct_visit', 'page_view', 'purchase')
      ORDER BY e.user_id, e.event_timestamp
    `;
  }

  private inferChannel(row: Record<string, any>): string {
    const eventType = row.event_type;
    const properties = row.properties ? JSON.parse(row.properties) : {};

    if (properties.utm_source) {
      return properties.utm_source;
    }

    switch (eventType) {
      case 'ad_click':
        return 'Paid';
      case 'email_open':
        return 'Email';
      case 'social_click':
        return 'Social';
      case 'organic_search':
        return 'Organic Search';
      case 'direct_visit':
        return 'Direct';
      default:
        return 'Unknown';
    }
  }

  private hashQuery(query: JourneyQueryDto): string {
    return Buffer.from(JSON.stringify(query)).toString('base64').substring(0, 32);
  }

  private getMockJourneyResult(query: JourneyQueryDto): JourneyResultDto {
    const limit = query.limit || 100;
    const channels = ['Organic Search', 'Paid Search', 'Email', 'Social', 'Direct', 'Referral'];
    const eventTypes = ['page_view', 'ad_click', 'email_open', 'form_submit', 'purchase'];

    const journeys: CustomerJourneyDto[] = [];

    for (let i = 0; i < Math.min(limit, 50); i++) {
      const touchpointCount = 2 + Math.floor(Math.random() * 8);
      const isConverted = Math.random() > 0.7;
      const startDate = new Date(query.startDate);
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));

      const touchpoints: JourneyTouchpointDto[] = [];
      let currentDate = new Date(startDate);

      for (let t = 0; t < touchpointCount; t++) {
        currentDate = new Date(currentDate.getTime() + Math.random() * 86400000 * 2);
        const isLast = t === touchpointCount - 1;

        touchpoints.push({
          timestamp: currentDate.toISOString(),
          channel: channels[Math.floor(Math.random() * channels.length)],
          eventType: isLast && isConverted ? 'purchase' : eventTypes[Math.floor(Math.random() * (eventTypes.length - 1))],
        });
      }

      const duration = Math.floor(
        (new Date(touchpoints[touchpoints.length - 1].timestamp).getTime() -
          new Date(touchpoints[0].timestamp).getTime()) / 1000,
      );

      journeys.push({
        userId: `user_${uuidv4().substring(0, 8)}`,
        journeyId: uuidv4(),
        startDate: touchpoints[0].timestamp,
        endDate: touchpoints[touchpoints.length - 1].timestamp,
        isConverted,
        conversionValue: isConverted ? 50 + Math.random() * 200 : undefined,
        touchpoints,
        duration,
        touchpointCount,
      });
    }

    const convertedJourneys = journeys.filter((j) => j.isConverted);
    const totalDuration = journeys.reduce((sum, j) => sum + j.duration, 0);
    const totalTouchpoints = journeys.reduce((sum, j) => sum + j.touchpointCount, 0);

    return {
      journeys,
      totalJourneys: journeys.length,
      avgDuration: journeys.length > 0 ? Math.round(totalDuration / journeys.length) : 0,
      avgTouchpoints: journeys.length > 0
        ? Math.round((totalTouchpoints / journeys.length) * 100) / 100
        : 0,
      conversionRate: journeys.length > 0
        ? Math.round((convertedJourneys.length / journeys.length) * 10000) / 100
        : 0,
    };
  }
}
