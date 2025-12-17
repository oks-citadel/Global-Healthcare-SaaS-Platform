import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../config/logger';

/**
 * Database optimization configuration
 */
export interface DatabaseOptimizationConfig {
  enableQueryLogging?: boolean;
  slowQueryThreshold?: number; // in milliseconds
  enableReadReplica?: boolean;
  connectionPoolSize?: number;
  connectionTimeout?: number;
}

/**
 * Query performance metrics
 */
export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
}

/**
 * Read replica configuration
 */
export interface ReadReplicaConfig {
  url: string;
  connectionPoolSize?: number;
}

/**
 * Database optimization class
 */
export class DatabaseOptimization {
  private primaryClient: PrismaClient;
  private replicaClient?: PrismaClient;
  private config: DatabaseOptimizationConfig;
  private queryMetrics: QueryMetrics[] = [];
  private readonly MAX_METRICS = 1000;

  constructor(
    primaryClient: PrismaClient,
    config: DatabaseOptimizationConfig = {},
    replicaConfig?: ReadReplicaConfig
  ) {
    this.primaryClient = primaryClient;
    this.config = {
      enableQueryLogging: config.enableQueryLogging ?? true,
      slowQueryThreshold: config.slowQueryThreshold ?? 1000,
      enableReadReplica: config.enableReadReplica ?? false,
      connectionPoolSize: config.connectionPoolSize ?? 10,
      connectionTimeout: config.connectionTimeout ?? 5000,
    };

    // Setup read replica if configured
    if (this.config.enableReadReplica && replicaConfig) {
      this.setupReadReplica(replicaConfig);
    }

    // Setup query monitoring
    this.setupQueryMonitoring();
  }

  /**
   * Setup read replica connection
   */
  private setupReadReplica(config: ReadReplicaConfig): void {
    this.replicaClient = new PrismaClient({
      datasources: {
        db: {
          url: config.url,
        },
      },
    });

    logger.info('Read replica configured');
  }

  /**
   * Setup query monitoring and logging
   */
  private setupQueryMonitoring(): void {
    if (!this.config.enableQueryLogging) return;

    // Use Prisma middleware to log queries
    this.primaryClient.$use(async (params, next) => {
      const start = Date.now();
      const result = await next(params);
      const duration = Date.now() - start;

      // Log slow queries
      if (duration > (this.config.slowQueryThreshold || 1000)) {
        logger.warn('Slow query detected', {
          model: params.model,
          action: params.action,
          duration: `${duration}ms`,
        });
      }

      // Store metrics
      this.addQueryMetric({
        query: `${params.model}.${params.action}`,
        duration,
        timestamp: new Date(),
      });

      return result;
    });
  }

  /**
   * Add query metric
   */
  private addQueryMetric(metric: QueryMetrics): void {
    this.queryMetrics.push(metric);

    // Keep only recent metrics
    if (this.queryMetrics.length > this.MAX_METRICS) {
      this.queryMetrics.shift();
    }
  }

  /**
   * Get client for read operations (uses replica if available)
   */
  getReadClient(): PrismaClient {
    return this.replicaClient || this.primaryClient;
  }

  /**
   * Get client for write operations (always primary)
   */
  getWriteClient(): PrismaClient {
    return this.primaryClient;
  }

  /**
   * Get query metrics
   */
  getMetrics(): QueryMetrics[] {
    return [...this.queryMetrics];
  }

  /**
   * Get average query duration
   */
  getAverageQueryDuration(): number {
    if (this.queryMetrics.length === 0) return 0;

    const total = this.queryMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.queryMetrics.length;
  }

  /**
   * Get slow queries
   */
  getSlowQueries(threshold?: number): QueryMetrics[] {
    const limit = threshold || this.config.slowQueryThreshold || 1000;
    return this.queryMetrics.filter(m => m.duration > limit);
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.queryMetrics = [];
  }
}

/**
 * Query optimization helpers
 */
export class QueryOptimization {
  /**
   * Build optimized select clause
   * Only select necessary fields
   */
  static selectFields<T extends Record<string, boolean>>(
    fields: (keyof T)[]
  ): Record<string, boolean> {
    const select: Record<string, boolean> = {};
    fields.forEach(field => {
      select[field as string] = true;
    });
    return select;
  }

  /**
   * Build efficient include clause
   * Avoid N+1 queries
   */
  static buildInclude(relations: Record<string, any>): any {
    const include: Record<string, any> = {};

    Object.entries(relations).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        include[key] = value;
      } else if (typeof value === 'object') {
        include[key] = {
          select: value,
        };
      }
    });

    return include;
  }

  /**
   * Batch queries to avoid N+1 problem
   */
  static async batchLoad<T, K extends keyof T>(
    prisma: any,
    model: string,
    ids: any[],
    idField: string = 'id'
  ): Promise<T[]> {
    if (ids.length === 0) return [];

    return prisma[model].findMany({
      where: {
        [idField]: {
          in: ids,
        },
      },
    });
  }

  /**
   * Efficient exists check
   * Uses findFirst with select instead of count
   */
  static async exists(
    prisma: any,
    model: string,
    where: any
  ): Promise<boolean> {
    const result = await prisma[model].findFirst({
      where,
      select: { id: true },
    });

    return result !== null;
  }

  /**
   * Upsert with optimistic concurrency control
   */
  static async optimisticUpsert<T>(
    prisma: any,
    model: string,
    where: any,
    create: any,
    update: any,
    versionField: string = 'version'
  ): Promise<T> {
    const existing = await prisma[model].findUnique({
      where,
      select: { [versionField]: true },
    });

    if (existing) {
      // Update with version check
      return prisma[model].update({
        where: {
          ...where,
          [versionField]: existing[versionField],
        },
        data: {
          ...update,
          [versionField]: existing[versionField] + 1,
        },
      });
    } else {
      // Create new record
      return prisma[model].create({
        data: {
          ...create,
          [versionField]: 1,
        },
      });
    }
  }

  /**
   * Bulk insert optimization
   */
  static async bulkInsert<T>(
    prisma: any,
    model: string,
    data: any[],
    batchSize: number = 1000
  ): Promise<number> {
    let inserted = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const result = await prisma[model].createMany({
        data: batch,
        skipDuplicates: true,
      });
      inserted += result.count;
    }

    return inserted;
  }

  /**
   * Bulk update optimization
   */
  static async bulkUpdate<T>(
    prisma: any,
    model: string,
    updates: Array<{ where: any; data: any }>,
    useTransaction: boolean = true
  ): Promise<number> {
    if (useTransaction) {
      return prisma.$transaction(
        updates.map(({ where, data }) =>
          prisma[model].update({ where, data })
        )
      ).then((results: any[]) => results.length);
    } else {
      let updated = 0;
      for (const { where, data } of updates) {
        await prisma[model].update({ where, data });
        updated++;
      }
      return updated;
    }
  }

  /**
   * Efficient soft delete
   */
  static async softDelete(
    prisma: any,
    model: string,
    where: any,
    deletedAtField: string = 'deletedAt'
  ): Promise<any> {
    return prisma[model].update({
      where,
      data: {
        [deletedAtField]: new Date(),
      },
    });
  }

  /**
   * Query with timeout
   */
  static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    errorMessage: string = 'Query timeout'
  ): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }
}

/**
 * Connection pool management
 */
export class ConnectionPoolManager {
  private static pools = new Map<string, PrismaClient>();

  /**
   * Get or create connection pool
   */
  static getPool(
    name: string,
    url?: string,
    poolSize: number = 10
  ): PrismaClient {
    if (!this.pools.has(name)) {
      const client = new PrismaClient({
        datasources: url ? { db: { url } } : undefined,
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ],
      });

      this.pools.set(name, client);
      logger.info(`Created connection pool: ${name}`);
    }

    return this.pools.get(name)!;
  }

  /**
   * Close pool
   */
  static async closePool(name: string): Promise<void> {
    const pool = this.pools.get(name);
    if (pool) {
      await pool.$disconnect();
      this.pools.delete(name);
      logger.info(`Closed connection pool: ${name}`);
    }
  }

  /**
   * Close all pools
   */
  static async closeAll(): Promise<void> {
    const promises = Array.from(this.pools.keys()).map(name =>
      this.closePool(name)
    );
    await Promise.all(promises);
  }

  /**
   * Health check for pool
   */
  static async healthCheck(name: string): Promise<boolean> {
    const pool = this.pools.get(name);
    if (!pool) return false;

    try {
      await pool.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error(`Health check failed for pool ${name}:`, error);
      return false;
    }
  }
}

/**
 * Index optimization helpers
 */
export class IndexOptimization {
  /**
   * Analyze query for missing indexes
   */
  static async analyzeQuery(
    prisma: PrismaClient,
    query: string
  ): Promise<any> {
    try {
      // PostgreSQL specific EXPLAIN
      const result = await prisma.$queryRawUnsafe(`EXPLAIN ${query}`);
      return result;
    } catch (error) {
      logger.error('Failed to analyze query:', error);
      return null;
    }
  }

  /**
   * Get table statistics
   */
  static async getTableStats(
    prisma: PrismaClient,
    tableName: string
  ): Promise<any> {
    try {
      // PostgreSQL specific
      const stats = await prisma.$queryRaw<any[]>`
        SELECT
          schemaname,
          tablename,
          n_live_tup as row_count,
          n_dead_tup as dead_rows,
          last_vacuum,
          last_autovacuum,
          last_analyze,
          last_autoanalyze
        FROM pg_stat_user_tables
        WHERE tablename = ${tableName}
      `;

      return stats[0] || null;
    } catch (error) {
      logger.error('Failed to get table stats:', error);
      return null;
    }
  }

  /**
   * Get index usage statistics
   */
  static async getIndexStats(
    prisma: PrismaClient,
    tableName: string
  ): Promise<any[]> {
    try {
      // PostgreSQL specific
      const stats = await prisma.$queryRaw<any[]>`
        SELECT
          indexrelname as index_name,
          idx_scan as index_scans,
          idx_tup_read as tuples_read,
          idx_tup_fetch as tuples_fetched
        FROM pg_stat_user_indexes
        WHERE relname = ${tableName}
        ORDER BY idx_scan DESC
      `;

      return stats;
    } catch (error) {
      logger.error('Failed to get index stats:', error);
      return [];
    }
  }

  /**
   * Find unused indexes
   */
  static async findUnusedIndexes(
    prisma: PrismaClient,
    minScans: number = 0
  ): Promise<any[]> {
    try {
      const indexes = await prisma.$queryRaw<any[]>`
        SELECT
          schemaname,
          tablename,
          indexrelname as index_name,
          idx_scan as index_scans
        FROM pg_stat_user_indexes
        WHERE idx_scan <= ${minScans}
          AND indexrelname NOT LIKE '%_pkey'
        ORDER BY idx_scan ASC
      `;

      return indexes;
    } catch (error) {
      logger.error('Failed to find unused indexes:', error);
      return [];
    }
  }
}

/**
 * Transaction optimization
 */
export class TransactionOptimization {
  /**
   * Execute in transaction with retry
   */
  static async withRetry<T>(
    prisma: PrismaClient,
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await prisma.$transaction(fn, {
          maxWait: 5000, // 5 seconds
          timeout: 10000, // 10 seconds
        });
      } catch (error: any) {
        lastError = error;

        // Don't retry on certain errors
        if (
          error.code === 'P2002' || // Unique constraint
          error.code === 'P2003' || // Foreign key constraint
          error.code === 'P2025' // Record not found
        ) {
          throw error;
        }

        logger.warn(`Transaction attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(resolve =>
            setTimeout(resolve, Math.min(100 * 2 ** attempt, 1000))
          );
        }
      }
    }

    throw lastError || new Error('Transaction failed after retries');
  }

  /**
   * Batch operations in single transaction
   */
  static async batchInTransaction<T>(
    prisma: PrismaClient,
    operations: Array<(tx: Prisma.TransactionClient) => Promise<any>>
  ): Promise<any[]> {
    return prisma.$transaction(async (tx) => {
      const results = [];
      for (const operation of operations) {
        const result = await operation(tx);
        results.push(result);
      }
      return results;
    });
  }
}

/**
 * Create optimized database client
 */
export function createOptimizedPrismaClient(
  config?: DatabaseOptimizationConfig,
  replicaConfig?: ReadReplicaConfig
): DatabaseOptimization {
  const primaryClient = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

  return new DatabaseOptimization(primaryClient, config, replicaConfig);
}

export default {
  DatabaseOptimization,
  QueryOptimization,
  ConnectionPoolManager,
  IndexOptimization,
  TransactionOptimization,
  createOptimizedPrismaClient,
};
