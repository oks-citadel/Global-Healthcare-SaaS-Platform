import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  QueryExecutionState,
} from '@aws-sdk/client-athena';

export interface AthenaQueryOptions {
  query: string;
  database?: string;
  workgroup?: string;
  outputLocation?: string;
  parameters?: Record<string, string>;
}

export interface AthenaQueryResult {
  queryExecutionId: string;
  columns: string[];
  rows: Record<string, any>[];
  statistics: {
    dataScannedBytes: number;
    engineExecutionTimeMs: number;
    totalExecutionTimeMs: number;
  };
}

@Injectable()
export class AthenaService implements OnModuleInit {
  private readonly logger = new Logger(AthenaService.name);
  private client: AthenaClient;
  private database: string;
  private workgroup: string;
  private outputLocation: string;

  constructor(private configService: ConfigService) {
    this.client = new AthenaClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });

    this.database = this.configService.get('ATHENA_DATABASE', 'analytics_db');
    this.workgroup = this.configService.get('ATHENA_WORKGROUP', 'primary');
    this.outputLocation = this.configService.get(
      'ATHENA_OUTPUT_LOCATION',
      's3://analytics-athena-results/',
    );
  }

  async onModuleInit() {
    this.logger.log(`Athena service initialized with database: ${this.database}`);
  }

  async executeQuery(options: AthenaQueryOptions): Promise<AthenaQueryResult> {
    const startCommand = new StartQueryExecutionCommand({
      QueryString: this.interpolateParameters(options.query, options.parameters),
      QueryExecutionContext: {
        Database: options.database || this.database,
      },
      WorkGroup: options.workgroup || this.workgroup,
      ResultConfiguration: {
        OutputLocation: options.outputLocation || this.outputLocation,
      },
    });

    try {
      const startResponse = await this.client.send(startCommand);
      const queryExecutionId = startResponse.QueryExecutionId!;

      this.logger.debug(`Started query execution: ${queryExecutionId}`);

      // Wait for query to complete
      await this.waitForQueryCompletion(queryExecutionId);

      // Get results
      return await this.getQueryResults(queryExecutionId);
    } catch (error) {
      this.logger.error(`Query execution failed: ${error.message}`);
      throw error;
    }
  }

  private interpolateParameters(
    query: string,
    parameters?: Record<string, string>,
  ): string {
    if (!parameters) return query;

    let interpolatedQuery = query;
    for (const [key, value] of Object.entries(parameters)) {
      // Escape single quotes and wrap in quotes for SQL safety
      const safeValue = value.replace(/'/g, "''");
      interpolatedQuery = interpolatedQuery.replace(
        new RegExp(`\\$\\{${key}\\}`, 'g'),
        `'${safeValue}'`,
      );
    }
    return interpolatedQuery;
  }

  private async waitForQueryCompletion(
    queryExecutionId: string,
    maxWaitMs: number = 300000,
  ): Promise<void> {
    const startTime = Date.now();
    let delay = 200;

    while (Date.now() - startTime < maxWaitMs) {
      const command = new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionId });
      const response = await this.client.send(command);
      const state = response.QueryExecution?.Status?.State;

      switch (state) {
        case QueryExecutionState.SUCCEEDED:
          return;
        case QueryExecutionState.FAILED:
          throw new Error(
            `Query failed: ${response.QueryExecution?.Status?.StateChangeReason}`,
          );
        case QueryExecutionState.CANCELLED:
          throw new Error('Query was cancelled');
        default:
          // Still running, wait and retry
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay = Math.min(delay * 1.5, 5000); // Exponential backoff, max 5s
      }
    }

    throw new Error('Query timed out');
  }

  private async getQueryResults(
    queryExecutionId: string,
  ): Promise<AthenaQueryResult> {
    const results: Record<string, any>[] = [];
    let columns: string[] = [];
    let nextToken: string | undefined;
    let isFirstPage = true;

    do {
      const command = new GetQueryResultsCommand({
        QueryExecutionId: queryExecutionId,
        NextToken: nextToken,
      });

      const response = await this.client.send(command);
      const resultSet = response.ResultSet;

      if (isFirstPage && resultSet?.ResultSetMetadata?.ColumnInfo) {
        columns = resultSet.ResultSetMetadata.ColumnInfo.map(
          (col) => col.Name || '',
        );
      }

      const rows = resultSet?.Rows || [];
      const startIndex = isFirstPage ? 1 : 0; // Skip header row on first page

      for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        const rowData: Record<string, any> = {};

        row.Data?.forEach((cell, index) => {
          const columnName = columns[index];
          rowData[columnName] = cell.VarCharValue ?? null;
        });

        results.push(rowData);
      }

      nextToken = response.NextToken;
      isFirstPage = false;
    } while (nextToken);

    // Get query statistics
    const execCommand = new GetQueryExecutionCommand({
      QueryExecutionId: queryExecutionId,
    });
    const execResponse = await this.client.send(execCommand);
    const stats = execResponse.QueryExecution?.Statistics;

    return {
      queryExecutionId,
      columns,
      rows: results,
      statistics: {
        dataScannedBytes: Number(stats?.DataScannedInBytes || 0),
        engineExecutionTimeMs: Number(stats?.EngineExecutionTimeInMillis || 0),
        totalExecutionTimeMs: Number(stats?.TotalExecutionTimeInMillis || 0),
      },
    };
  }

  // Predefined query patterns for common analytics operations
  async queryFunnelData(
    organizationId: string,
    funnelSteps: string[],
    startDate: string,
    endDate: string,
  ): Promise<AthenaQueryResult> {
    const stepConditions = funnelSteps
      .map((step, index) => `SUM(CASE WHEN event_type = '${step}' THEN 1 ELSE 0 END) as step_${index + 1}`)
      .join(',\n    ');

    const query = `
      SELECT
        DATE(event_timestamp) as date,
        ${stepConditions}
      FROM events
      WHERE organization_id = \${organizationId}
        AND date >= \${startDate}
        AND date <= \${endDate}
        AND event_type IN (${funnelSteps.map((s) => `'${s}'`).join(', ')})
      GROUP BY DATE(event_timestamp)
      ORDER BY date
    `;

    return this.executeQuery({
      query,
      parameters: { organizationId, startDate, endDate },
    });
  }

  async queryCohortRetention(
    organizationId: string,
    cohortDate: string,
    retentionDays: number,
  ): Promise<AthenaQueryResult> {
    const query = `
      WITH cohort AS (
        SELECT DISTINCT user_id
        FROM events
        WHERE organization_id = \${organizationId}
          AND DATE(event_timestamp) = \${cohortDate}
          AND event_type = 'user_signup'
      ),
      activity AS (
        SELECT
          e.user_id,
          DATE_DIFF('day', DATE(\${cohortDate}), DATE(e.event_timestamp)) as day_number
        FROM events e
        JOIN cohort c ON e.user_id = c.user_id
        WHERE e.organization_id = \${organizationId}
          AND DATE(e.event_timestamp) BETWEEN DATE(\${cohortDate}) AND DATE_ADD('day', ${retentionDays}, DATE(\${cohortDate}))
      )
      SELECT
        day_number,
        COUNT(DISTINCT user_id) as active_users,
        (SELECT COUNT(*) FROM cohort) as cohort_size
      FROM activity
      GROUP BY day_number
      ORDER BY day_number
    `;

    return this.executeQuery({
      query,
      parameters: { organizationId, cohortDate },
    });
  }

  async querySessionAnalytics(
    organizationId: string,
    startDate: string,
    endDate: string,
  ): Promise<AthenaQueryResult> {
    const query = `
      WITH sessions AS (
        SELECT
          session_id,
          user_id,
          MIN(event_timestamp) as session_start,
          MAX(event_timestamp) as session_end,
          COUNT(*) as event_count,
          COUNT(DISTINCT event_type) as unique_events
        FROM events
        WHERE organization_id = \${organizationId}
          AND date >= \${startDate}
          AND date <= \${endDate}
        GROUP BY session_id, user_id
      )
      SELECT
        DATE(session_start) as date,
        COUNT(*) as total_sessions,
        COUNT(DISTINCT user_id) as unique_users,
        AVG(DATE_DIFF('second', session_start, session_end)) as avg_session_duration_seconds,
        AVG(event_count) as avg_events_per_session,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY DATE_DIFF('second', session_start, session_end)) as median_session_duration
      FROM sessions
      GROUP BY DATE(session_start)
      ORDER BY date
    `;

    return this.executeQuery({
      query,
      parameters: { organizationId, startDate, endDate },
    });
  }

  async queryAttributionData(
    organizationId: string,
    conversionEvent: string,
    startDate: string,
    endDate: string,
  ): Promise<AthenaQueryResult> {
    const query = `
      WITH conversions AS (
        SELECT user_id, MIN(event_timestamp) as conversion_time
        FROM events
        WHERE organization_id = \${organizationId}
          AND event_type = '${conversionEvent}'
          AND date >= \${startDate}
          AND date <= \${endDate}
        GROUP BY user_id
      ),
      touchpoints AS (
        SELECT
          e.user_id,
          e.event_type as touchpoint,
          e.event_timestamp,
          e.properties,
          c.conversion_time,
          ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY e.event_timestamp) as touch_order,
          COUNT(*) OVER (PARTITION BY e.user_id) as total_touches
        FROM events e
        JOIN conversions c ON e.user_id = c.user_id
        WHERE e.organization_id = \${organizationId}
          AND e.event_timestamp < c.conversion_time
          AND e.event_type IN ('ad_click', 'email_open', 'social_click', 'organic_search', 'direct_visit')
      )
      SELECT
        touchpoint,
        COUNT(DISTINCT user_id) as conversions,
        SUM(CASE WHEN touch_order = 1 THEN 1 ELSE 0 END) as first_touch,
        SUM(CASE WHEN touch_order = total_touches THEN 1 ELSE 0 END) as last_touch,
        AVG(1.0 / total_touches) as linear_attribution
      FROM touchpoints
      GROUP BY touchpoint
      ORDER BY conversions DESC
    `;

    return this.executeQuery({
      query,
      parameters: { organizationId, startDate, endDate },
    });
  }

  async queryLTV(
    organizationId: string,
    startDate: string,
    endDate: string,
  ): Promise<AthenaQueryResult> {
    const query = `
      WITH user_revenue AS (
        SELECT
          user_id,
          MIN(DATE(event_timestamp)) as first_purchase_date,
          SUM(CAST(JSON_EXTRACT_SCALAR(properties, '$.revenue') AS DOUBLE)) as total_revenue,
          COUNT(*) as purchase_count,
          DATE_DIFF('day', MIN(DATE(event_timestamp)), MAX(DATE(event_timestamp))) as customer_lifespan_days
        FROM events
        WHERE organization_id = \${organizationId}
          AND event_type = 'purchase'
          AND date >= \${startDate}
          AND date <= \${endDate}
        GROUP BY user_id
      )
      SELECT
        DATE_TRUNC('month', first_purchase_date) as cohort_month,
        COUNT(*) as customer_count,
        AVG(total_revenue) as avg_ltv,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_revenue) as median_ltv,
        AVG(purchase_count) as avg_purchases,
        AVG(customer_lifespan_days) as avg_lifespan_days,
        SUM(total_revenue) as total_cohort_revenue
      FROM user_revenue
      GROUP BY DATE_TRUNC('month', first_purchase_date)
      ORDER BY cohort_month
    `;

    return this.executeQuery({
      query,
      parameters: { organizationId, startDate, endDate },
    });
  }
}
