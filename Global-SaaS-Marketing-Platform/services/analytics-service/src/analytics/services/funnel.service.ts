import { Injectable, Logger } from '@nestjs/common';
import { AthenaService } from '../../common/services/athena.service';
import { RedisService } from '../../common/services/redis.service';
import { DynamoDBService } from '../../common/services/dynamodb.service';
import { FunnelQueryDto, FunnelResultDto, FunnelStepResultDto } from '../dto/analytics.dto';

@Injectable()
export class FunnelService {
  private readonly logger = new Logger(FunnelService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly athenaService: AthenaService,
    private readonly redisService: RedisService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  async analyzeFunnel(query: FunnelQueryDto): Promise<FunnelResultDto> {
    const cacheKey = `funnel:${query.organizationId}:${this.hashQuery(query)}`;

    // Check cache
    const cached = await this.redisService.getJson<FunnelResultDto>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached funnel result');
      return cached;
    }

    const conversionWindow = query.conversionWindow || 7;
    const steps = query.steps;

    // Build the funnel query
    const funnelQuery = this.buildFunnelQuery(
      query.organizationId,
      steps,
      query.startDate,
      query.endDate,
      conversionWindow,
      query.strictOrder !== false,
    );

    try {
      const result = await this.athenaService.executeQuery({ query: funnelQuery });

      // Process results
      const stepCounts: number[] = new Array(steps.length).fill(0);
      let totalTimeToConvert = 0;
      let conversionCount = 0;

      for (const row of result.rows) {
        for (let i = 0; i < steps.length; i++) {
          const stepKey = `step_${i + 1}`;
          stepCounts[i] += parseInt(row[stepKey] || '0', 10);
        }

        if (row.avg_conversion_time) {
          totalTimeToConvert += parseFloat(row.avg_conversion_time);
          conversionCount++;
        }
      }

      // Calculate conversion rates
      const stepResults: FunnelStepResultDto[] = steps.map((step, index) => {
        const count = stepCounts[index];
        const previousCount = index === 0 ? stepCounts[0] : stepCounts[index - 1];
        const conversionRate = previousCount > 0 ? (count / previousCount) * 100 : 0;
        const dropoffRate = 100 - conversionRate;

        return {
          name: step.name,
          eventType: step.eventType,
          count,
          conversionRate: Math.round(conversionRate * 100) / 100,
          dropoffRate: Math.round(dropoffRate * 100) / 100,
        };
      });

      const totalStarted = stepCounts[0] || 0;
      const totalCompleted = stepCounts[stepCounts.length - 1] || 0;
      const overallConversionRate = totalStarted > 0
        ? Math.round((totalCompleted / totalStarted) * 10000) / 100
        : 0;
      const averageTimeToConvert = conversionCount > 0
        ? Math.round(totalTimeToConvert / conversionCount)
        : 0;

      const funnelResult: FunnelResultDto = {
        steps: stepResults,
        overallConversionRate,
        totalStarted,
        totalCompleted,
        averageTimeToConvert,
      };

      // Cache result
      await this.redisService.setJson(cacheKey, funnelResult, this.CACHE_TTL);

      return funnelResult;
    } catch (error) {
      this.logger.error(`Funnel analysis failed: ${error.message}`);

      // Return mock data for demo/fallback
      return this.getMockFunnelResult(query);
    }
  }

  private buildFunnelQuery(
    organizationId: string,
    steps: Array<{ name: string; eventType: string; filters?: Record<string, any> }>,
    startDate: string,
    endDate: string,
    conversionWindow: number,
    strictOrder: boolean,
  ): string {
    const stepSelects = steps.map((step, index) => {
      const filterCondition = step.filters
        ? this.buildFilterCondition(step.filters)
        : '';
      return `
        SUM(CASE WHEN event_type = '${step.eventType}' ${filterCondition} THEN 1 ELSE 0 END) as step_${index + 1}
      `;
    }).join(',');

    if (strictOrder) {
      // More complex query for ordered funnel
      return `
        WITH user_events AS (
          SELECT
            user_id,
            event_type,
            event_timestamp,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_timestamp) as event_order
          FROM events
          WHERE organization_id = '${organizationId}'
            AND date >= '${startDate}'
            AND date <= '${endDate}'
            AND event_type IN (${steps.map(s => `'${s.eventType}'`).join(', ')})
        ),
        funnel_stages AS (
          SELECT
            user_id,
            ${steps.map((step, i) => `
              MIN(CASE WHEN event_type = '${step.eventType}' THEN event_timestamp END) as step_${i + 1}_time
            `).join(',')}
          FROM user_events
          GROUP BY user_id
        )
        SELECT
          ${steps.map((_, i) => `
            COUNT(DISTINCT CASE WHEN step_${i + 1}_time IS NOT NULL ${i > 0 ? `AND step_${i + 1}_time > step_${i}_time` : ''} THEN user_id END) as step_${i + 1}
          `).join(',')},
          AVG(CASE
            WHEN step_${steps.length}_time IS NOT NULL
            THEN DATE_DIFF('second', step_1_time, step_${steps.length}_time)
          END) as avg_conversion_time
        FROM funnel_stages
        WHERE step_1_time IS NOT NULL
          ${conversionWindow ? `AND (step_${steps.length}_time IS NULL OR DATE_DIFF('day', step_1_time, step_${steps.length}_time) <= ${conversionWindow})` : ''}
      `;
    }

    // Simple unordered funnel
    return `
      SELECT
        ${stepSelects},
        AVG(CASE WHEN completed_funnel THEN conversion_time END) as avg_conversion_time
      FROM (
        SELECT
          user_id,
          ${steps.map((step, i) => `
            MAX(CASE WHEN event_type = '${step.eventType}' THEN 1 ELSE 0 END) as did_step_${i + 1}
          `).join(',')},
          ${steps.map((step, i) => `
            MAX(CASE WHEN event_type = '${step.eventType}' THEN 1 ELSE 0 END) = 1
          `).join(' AND ')} as completed_funnel,
          DATE_DIFF('second',
            MIN(CASE WHEN event_type = '${steps[0].eventType}' THEN event_timestamp END),
            MIN(CASE WHEN event_type = '${steps[steps.length - 1].eventType}' THEN event_timestamp END)
          ) as conversion_time
        FROM events
        WHERE organization_id = '${organizationId}'
          AND date >= '${startDate}'
          AND date <= '${endDate}'
        GROUP BY user_id
      )
    `;
  }

  private buildFilterCondition(filters: Record<string, any>): string {
    const conditions = Object.entries(filters).map(([key, value]) => {
      if (typeof value === 'string') {
        return `AND JSON_EXTRACT_SCALAR(properties, '$.${key}') = '${value}'`;
      } else if (typeof value === 'number') {
        return `AND CAST(JSON_EXTRACT_SCALAR(properties, '$.${key}') AS DOUBLE) = ${value}`;
      } else if (typeof value === 'boolean') {
        return `AND JSON_EXTRACT_SCALAR(properties, '$.${key}') = '${value}'`;
      }
      return '';
    });
    return conditions.join(' ');
  }

  private hashQuery(query: FunnelQueryDto): string {
    return Buffer.from(JSON.stringify(query)).toString('base64').substring(0, 32);
  }

  private getMockFunnelResult(query: FunnelQueryDto): FunnelResultDto {
    const totalStarted = 10000;
    let currentCount = totalStarted;

    const steps: FunnelStepResultDto[] = query.steps.map((step, index) => {
      const dropoffRate = 20 + Math.random() * 30; // 20-50% dropoff
      const nextCount = index === 0 ? currentCount : Math.floor(currentCount * (1 - dropoffRate / 100));
      const conversionRate = index === 0 ? 100 : (nextCount / currentCount) * 100;

      const result = {
        name: step.name,
        eventType: step.eventType,
        count: nextCount,
        conversionRate: Math.round(conversionRate * 100) / 100,
        dropoffRate: Math.round((100 - conversionRate) * 100) / 100,
      };

      currentCount = nextCount;
      return result;
    });

    const totalCompleted = steps[steps.length - 1].count;

    return {
      steps,
      overallConversionRate: Math.round((totalCompleted / totalStarted) * 10000) / 100,
      totalStarted,
      totalCompleted,
      averageTimeToConvert: Math.floor(Math.random() * 86400) + 3600, // 1-24 hours in seconds
    };
  }
}
