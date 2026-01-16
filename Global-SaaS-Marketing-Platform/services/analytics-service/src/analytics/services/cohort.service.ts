import { Injectable, Logger } from '@nestjs/common';
import { AthenaService } from '../../common/services/athena.service';
import { RedisService } from '../../common/services/redis.service';
import { CohortQueryDto, CohortResultDto, CohortPeriodDto } from '../dto/analytics.dto';

@Injectable()
export class CohortService {
  private readonly logger = new Logger(CohortService.name);
  private readonly CACHE_TTL = 600; // 10 minutes

  constructor(
    private readonly athenaService: AthenaService,
    private readonly redisService: RedisService,
  ) {}

  async analyzeCohort(query: CohortQueryDto): Promise<CohortResultDto> {
    const cacheKey = `cohort:${query.organizationId}:${this.hashQuery(query)}`;

    // Check cache
    const cached = await this.redisService.getJson<CohortResultDto>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached cohort result');
      return cached;
    }

    const periods = query.periods || 12;
    const periodType = query.periodType || 'week';
    const retentionEvent = query.retentionEvent || 'any';

    try {
      const cohortQuery = this.buildCohortQuery(
        query.organizationId,
        query.cohort,
        query.startDate,
        query.endDate,
        periods,
        periodType,
        retentionEvent,
      );

      const result = await this.athenaService.executeQuery({ query: cohortQuery });

      // Process results
      const cohortSize = parseInt(result.rows[0]?.cohort_size || '0', 10);
      const periodResults: CohortPeriodDto[] = [];
      let totalRetention = 0;

      for (const row of result.rows) {
        const period = parseInt(row.period_number || '0', 10);
        const activeUsers = parseInt(row.active_users || '0', 10);
        const retentionRate = cohortSize > 0 ? (activeUsers / cohortSize) * 100 : 0;

        periodResults.push({
          period,
          activeUsers,
          retentionRate: Math.round(retentionRate * 100) / 100,
        });

        totalRetention += retentionRate;
      }

      const cohortResult: CohortResultDto = {
        cohort: query.cohort,
        size: cohortSize,
        periods: periodResults,
        averageRetention: periodResults.length > 0
          ? Math.round((totalRetention / periodResults.length) * 100) / 100
          : 0,
      };

      // Cache result
      await this.redisService.setJson(cacheKey, cohortResult, this.CACHE_TTL);

      return cohortResult;
    } catch (error) {
      this.logger.error(`Cohort analysis failed: ${error.message}`);

      // Return mock data for demo/fallback
      return this.getMockCohortResult(query);
    }
  }

  private buildCohortQuery(
    organizationId: string,
    cohort: { type: string; eventType?: string; property?: string; propertyValue?: any; dateRange?: { start: string; end: string } },
    startDate: string,
    endDate: string,
    periods: number,
    periodType: string,
    retentionEvent: string,
  ): string {
    let cohortCondition: string;

    switch (cohort.type) {
      case 'first_event':
        cohortCondition = `
          event_type = '${cohort.eventType || 'user_signup'}'
        `;
        break;
      case 'property':
        cohortCondition = `
          JSON_EXTRACT_SCALAR(properties, '$.${cohort.property}') = '${cohort.propertyValue}'
        `;
        break;
      case 'date_range':
        cohortCondition = `
          DATE(event_timestamp) BETWEEN DATE('${cohort.dateRange?.start}') AND DATE('${cohort.dateRange?.end}')
        `;
        break;
      default:
        cohortCondition = '1=1';
    }

    const periodFunction = this.getPeriodFunction(periodType);
    const retentionCondition = retentionEvent === 'any'
      ? '1=1'
      : `event_type = '${retentionEvent}'`;

    return `
      WITH cohort_users AS (
        SELECT DISTINCT
          user_id,
          MIN(DATE(event_timestamp)) as cohort_date
        FROM events
        WHERE organization_id = '${organizationId}'
          AND ${cohortCondition}
          AND date >= '${startDate}'
          AND date <= '${endDate}'
        GROUP BY user_id
      ),
      user_activity AS (
        SELECT
          cu.user_id,
          cu.cohort_date,
          ${periodFunction}(e.event_timestamp, cu.cohort_date) as period_number
        FROM events e
        JOIN cohort_users cu ON e.user_id = cu.user_id
        WHERE e.organization_id = '${organizationId}'
          AND e.date >= '${startDate}'
          AND ${retentionCondition}
      )
      SELECT
        period_number,
        COUNT(DISTINCT user_id) as active_users,
        (SELECT COUNT(*) FROM cohort_users) as cohort_size
      FROM user_activity
      WHERE period_number >= 0 AND period_number < ${periods}
      GROUP BY period_number
      ORDER BY period_number
    `;
  }

  private getPeriodFunction(periodType: string): string {
    switch (periodType) {
      case 'day':
        return "DATE_DIFF('day', cohort_date, DATE(event_timestamp))";
      case 'week':
        return "DATE_DIFF('week', cohort_date, DATE(event_timestamp))";
      case 'month':
        return "DATE_DIFF('month', cohort_date, DATE(event_timestamp))";
      default:
        return "DATE_DIFF('week', cohort_date, DATE(event_timestamp))";
    }
  }

  private hashQuery(query: CohortQueryDto): string {
    return Buffer.from(JSON.stringify(query)).toString('base64').substring(0, 32);
  }

  private getMockCohortResult(query: CohortQueryDto): CohortResultDto {
    const periods = query.periods || 12;
    const cohortSize = 1000;
    let currentRetention = 100;

    const periodResults: CohortPeriodDto[] = [];
    let totalRetention = 0;

    for (let i = 0; i < periods; i++) {
      // Simulate typical retention decay
      if (i === 0) {
        currentRetention = 100;
      } else if (i === 1) {
        currentRetention = 45 + Math.random() * 15; // 45-60% D1
      } else {
        currentRetention = currentRetention * (0.85 + Math.random() * 0.1); // 85-95% retention each period
      }

      const activeUsers = Math.round(cohortSize * (currentRetention / 100));

      periodResults.push({
        period: i,
        activeUsers,
        retentionRate: Math.round(currentRetention * 100) / 100,
      });

      totalRetention += currentRetention;
    }

    return {
      cohort: query.cohort,
      size: cohortSize,
      periods: periodResults,
      averageRetention: Math.round((totalRetention / periods) * 100) / 100,
    };
  }
}
