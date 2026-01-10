/**
 * Query Optimizer Service
 * Optimizes database queries for cost and performance
 */

import { PrismaClient } from '@prisma/client';

export interface QueryMetrics {
  query: string;
  duration: number;
  rowsExamined: number;
  rowsReturned: number;
  usingIndex: boolean;
  timestamp: Date;
}

export interface QueryAnalysis {
  suggestions: string[];
  estimatedCostReduction: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConnectionPoolConfig {
  min: number;
  max: number;
  idleTimeoutMs: number;
  acquireTimeoutMs: number;
  createRetryIntervalMs: number;
  reapIntervalMs: number;
}

// Environment-based connection pool settings for cost optimization
export const connectionPoolConfigs: Record<string, ConnectionPoolConfig> = {
  development: {
    min: 1,
    max: 5,
    idleTimeoutMs: 10000,
    acquireTimeoutMs: 30000,
    createRetryIntervalMs: 200,
    reapIntervalMs: 1000,
  },
  staging: {
    min: 2,
    max: 10,
    idleTimeoutMs: 30000,
    acquireTimeoutMs: 30000,
    createRetryIntervalMs: 200,
    reapIntervalMs: 1000,
  },
  production: {
    min: 5,
    max: 20,
    idleTimeoutMs: 60000,
    acquireTimeoutMs: 30000,
    createRetryIntervalMs: 200,
    reapIntervalMs: 1000,
  },
};

export class QueryOptimizerService {
  private queryHistory: QueryMetrics[] = [];
  private readonly maxHistorySize = 1000;
  private slowQueryThresholdMs = 1000;

  constructor(private prisma: PrismaClient) {}

  /**
   * Log query execution metrics
   */
  logQuery(metrics: QueryMetrics): void {
    this.queryHistory.push(metrics);

    // Keep history size bounded
    if (this.queryHistory.length > this.maxHistorySize) {
      this.queryHistory.shift();
    }

    // Log slow queries
    if (metrics.duration > this.slowQueryThresholdMs) {
      console.warn(`Slow query detected (${metrics.duration}ms):`, {
        query: metrics.query.substring(0, 200),
        rowsExamined: metrics.rowsExamined,
        rowsReturned: metrics.rowsReturned,
        usingIndex: metrics.usingIndex,
      });
    }
  }

  /**
   * Analyze query patterns and suggest optimizations
   */
  analyzeQueryPatterns(): QueryAnalysis {
    const suggestions: string[] = [];
    let estimatedCostReduction = 0;

    // Analyze slow queries
    const slowQueries = this.queryHistory.filter(
      q => q.duration > this.slowQueryThresholdMs
    );

    if (slowQueries.length > 0) {
      suggestions.push(
        `Found ${slowQueries.length} slow queries (>${this.slowQueryThresholdMs}ms). Consider adding indexes.`
      );
      estimatedCostReduction += slowQueries.length * 5;
    }

    // Analyze queries not using indexes
    const noIndexQueries = this.queryHistory.filter(q => !q.usingIndex);
    if (noIndexQueries.length > this.queryHistory.length * 0.2) {
      suggestions.push(
        `${Math.round((noIndexQueries.length / this.queryHistory.length) * 100)}% of queries not using indexes. Review query plans.`
      );
      estimatedCostReduction += 15;
    }

    // Analyze high row examination
    const highExamination = this.queryHistory.filter(
      q => q.rowsExamined > q.rowsReturned * 10 && q.rowsExamined > 100
    );
    if (highExamination.length > 0) {
      suggestions.push(
        `${highExamination.length} queries examining 10x more rows than returned. Add more specific indexes.`
      );
      estimatedCostReduction += highExamination.length * 3;
    }

    // Determine priority
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (estimatedCostReduction > 30) priority = 'critical';
    else if (estimatedCostReduction > 20) priority = 'high';
    else if (estimatedCostReduction > 10) priority = 'medium';

    return {
      suggestions,
      estimatedCostReduction,
      priority,
    };
  }

  /**
   * Get recommended indexes based on query patterns
   */
  getIndexRecommendations(): string[] {
    const recommendations: string[] = [];
    const queryPatterns = new Map<string, number>();

    // Analyze WHERE clause patterns
    for (const metrics of this.queryHistory) {
      const pattern = this.extractWherePattern(metrics.query);
      if (pattern) {
        queryPatterns.set(pattern, (queryPatterns.get(pattern) || 0) + 1);
      }
    }

    // Recommend indexes for frequent patterns
    for (const [pattern, count] of queryPatterns.entries()) {
      if (count > 10) {
        recommendations.push(
          `Consider composite index for pattern: ${pattern} (used ${count} times)`
        );
      }
    }

    return recommendations;
  }

  /**
   * Extract WHERE pattern from query
   */
  private extractWherePattern(query: string): string | null {
    const whereMatch = query.match(/WHERE\s+(.+?)(?:ORDER|LIMIT|GROUP|$)/i);
    if (whereMatch) {
      return whereMatch[1]
        .replace(/=\s*'[^']*'/g, '= ?')
        .replace(/=\s*\d+/g, '= ?')
        .trim();
    }
    return null;
  }

  /**
   * Get query statistics
   */
  getStatistics(): {
    totalQueries: number;
    averageDuration: number;
    slowQueries: number;
    queriesWithoutIndex: number;
    p50Duration: number;
    p95Duration: number;
    p99Duration: number;
  } {
    if (this.queryHistory.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        queriesWithoutIndex: 0,
        p50Duration: 0,
        p95Duration: 0,
        p99Duration: 0,
      };
    }

    const durations = this.queryHistory
      .map(q => q.duration)
      .sort((a, b) => a - b);

    return {
      totalQueries: this.queryHistory.length,
      averageDuration:
        durations.reduce((a, b) => a + b, 0) / durations.length,
      slowQueries: this.queryHistory.filter(
        q => q.duration > this.slowQueryThresholdMs
      ).length,
      queriesWithoutIndex: this.queryHistory.filter(q => !q.usingIndex).length,
      p50Duration: durations[Math.floor(durations.length * 0.5)],
      p95Duration: durations[Math.floor(durations.length * 0.95)],
      p99Duration: durations[Math.floor(durations.length * 0.99)],
    };
  }

  /**
   * Clear query history
   */
  clearHistory(): void {
    this.queryHistory = [];
  }

  /**
   * Set slow query threshold
   */
  setSlowQueryThreshold(ms: number): void {
    this.slowQueryThresholdMs = ms;
  }
}

/**
 * Query optimization patterns for Prisma
 */
export const queryPatterns = {
  /**
   * Use select to limit returned fields (reduces data transfer costs)
   */
  selectOptimized: {
    userBasic: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
    providerList: {
      id: true,
      name: true,
      specialty: true,
      rating: true,
      imageUrl: true,
    },
    appointmentSummary: {
      id: true,
      scheduledAt: true,
      status: true,
      type: true,
      provider: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  /**
   * Pagination patterns for cost-effective data retrieval
   */
  pagination: {
    cursor: <T extends { id: string }>(cursor?: string, limit: number = 20) => ({
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    }),
    offset: (page: number = 1, limit: number = 20) => ({
      skip: (page - 1) * limit,
      take: limit,
    }),
  },

  /**
   * Batch operations for reducing database round trips
   */
  batch: {
    maxBatchSize: 100,
    chunkArray: <T>(array: T[], size: number = 100): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    },
  },
};

/**
 * Database connection string builder with connection pool optimization
 */
export function buildOptimizedConnectionString(
  baseUrl: string,
  environment: string = 'production'
): string {
  const config = connectionPoolConfigs[environment] || connectionPoolConfigs.production;

  const params = new URLSearchParams({
    connection_limit: config.max.toString(),
    pool_timeout: Math.floor(config.acquireTimeoutMs / 1000).toString(),
    connect_timeout: '10',
    socket_timeout: '60',
  });

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${params.toString()}`;
}

/**
 * Create optimized Prisma client with logging
 */
export function createOptimizedPrismaClient(
  environment: string = process.env.NODE_ENV || 'production'
): PrismaClient {
  const config = connectionPoolConfigs[environment] || connectionPoolConfigs.production;

  return new PrismaClient({
    log: environment === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
    datasources: {
      db: {
        url: buildOptimizedConnectionString(
          process.env.DATABASE_URL || '',
          environment
        ),
      },
    },
  });
}

export default QueryOptimizerService;
