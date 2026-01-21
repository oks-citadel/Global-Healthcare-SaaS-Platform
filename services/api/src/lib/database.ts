/**
 * Production-Ready Database Connection Manager
 *
 * Features:
 * - Connection pooling with configurable limits
 * - Connection health checks and monitoring
 * - Automatic retry with exponential backoff
 * - Read replica support (if configured)
 * - Query timeout handling
 * - Connection metrics and monitoring
 * - Graceful connection management
 */

import { PrismaClient } from '../generated/client';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

// Database configuration interface
interface DatabaseConfig {
  // Connection pool settings
  connectionLimit: number;
  poolTimeout: number;
  connectTimeout: number;
  socketTimeout: number;

  // Retry settings
  maxRetries: number;
  retryDelay: number;
  retryBackoffMultiplier: number;

  // Health check settings
  healthCheckInterval: number;

  // Query settings
  queryTimeout: number;
  slowQueryThreshold: number;

  // Read replica settings (optional)
  enableReadReplica: boolean;
  readReplicaUrl?: string;
}

// Default production configuration
const defaultConfig: DatabaseConfig = {
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  poolTimeout: parseInt(process.env.DB_POOL_TIMEOUT || '10'),
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '5'),
  socketTimeout: parseInt(process.env.DB_SOCKET_TIMEOUT || '60'),
  maxRetries: parseInt(process.env.DB_MAX_RETRIES || '3'),
  retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000'),
  retryBackoffMultiplier: parseFloat(process.env.DB_RETRY_BACKOFF || '2'),
  healthCheckInterval: parseInt(process.env.DB_HEALTH_CHECK_INTERVAL || '30000'),
  queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
  slowQueryThreshold: parseInt(process.env.DB_SLOW_QUERY_THRESHOLD || '1000'),
  enableReadReplica: process.env.DB_READ_REPLICA_URL ? true : false,
  readReplicaUrl: process.env.DB_READ_REPLICA_URL,
};

// Connection pool metrics
interface PoolMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  totalQueries: number;
  slowQueries: number;
  failedQueries: number;
  averageQueryTime: number;
  lastHealthCheck?: Date;
  lastHealthCheckStatus?: 'healthy' | 'unhealthy';
}

class DatabaseManager {
  private primaryClient: PrismaClient;
  private replicaClient?: PrismaClient;
  private dbConfig: DatabaseConfig;
  private metrics: PoolMetrics;
  private healthCheckTimer?: NodeJS.Timeout;
  private isConnected: boolean = false;

  constructor(config: DatabaseConfig = defaultConfig) {
    this.dbConfig = config;
    this.metrics = {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      waitingRequests: 0,
      totalQueries: 0,
      slowQueries: 0,
      failedQueries: 0,
      averageQueryTime: 0,
    };

    // Build connection URL with pool parameters
    const primaryUrl = this.buildConnectionUrl(process.env.DATABASE_URL!);

    // Initialize primary client with production settings
    this.primaryClient = new PrismaClient({
      datasources: {
        db: {
          url: primaryUrl,
        },
      },
      log: this.getLogLevels(),
      errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
    });

    // Initialize read replica if configured
    if (this.dbConfig.enableReadReplica && this.dbConfig.readReplicaUrl) {
      const replicaUrl = this.buildConnectionUrl(this.dbConfig.readReplicaUrl);
      this.replicaClient = new PrismaClient({
        datasources: {
          db: {
            url: replicaUrl,
          },
        },
        log: this.getLogLevels(),
        errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
      });
      logger.info('Read replica configured');
    }

    this.setupEventListeners();
  }

  /**
   * Build connection URL with pooling parameters
   */
  private buildConnectionUrl(baseUrl: string): string {
    const url = new URL(baseUrl);
    const params = new URLSearchParams(url.search);

    // Add connection pooling parameters
    params.set('connection_limit', this.dbConfig.connectionLimit.toString());
    params.set('pool_timeout', this.dbConfig.poolTimeout.toString());
    params.set('connect_timeout', this.dbConfig.connectTimeout.toString());

    if (this.dbConfig.socketTimeout > 0) {
      params.set('socket_timeout', this.dbConfig.socketTimeout.toString());
    }

    // Add statement timeout for query-level timeouts
    if (this.dbConfig.queryTimeout > 0) {
      params.set('statement_timeout', this.dbConfig.queryTimeout.toString());
    }

    url.search = params.toString();
    return url.toString();
  }

  /**
   * Get log levels based on environment
   */
  private getLogLevels() {
    if (config.env === 'development') {
      return [
        { emit: 'event' as const, level: 'query' as const },
        { emit: 'event' as const, level: 'error' as const },
        { emit: 'event' as const, level: 'info' as const },
        { emit: 'event' as const, level: 'warn' as const },
      ];
    }

    return [
      { emit: 'event' as const, level: 'error' as const },
      { emit: 'event' as const, level: 'warn' as const },
    ];
  }

  /**
   * Setup event listeners for monitoring
   */
  private setupEventListeners(): void {
    // Query event listener
    interface PrismaQueryEvent {
      query: string;
      params: string;
      duration: number;
      target: string;
    }

    interface PrismaLogEvent {
      message: string;
      target?: string;
    }

    this.primaryClient.$on('query' as never, (e: PrismaQueryEvent) => {
      this.metrics.totalQueries++;

      // Track slow queries
      if (e.duration > this.dbConfig.slowQueryThreshold) {
        this.metrics.slowQueries++;
        logger.warn('Slow query detected', {
          query: e.query,
          duration: e.duration,
          params: e.params,
        });
      }

      // Update average query time
      this.metrics.averageQueryTime =
        (this.metrics.averageQueryTime * (this.metrics.totalQueries - 1) + e.duration) /
        this.metrics.totalQueries;

      if (config.env === 'development') {
        logger.debug('Query executed', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      }
    });

    // Error event listener
    this.primaryClient.$on('error' as never, (e: PrismaLogEvent) => {
      this.metrics.failedQueries++;
      logger.error('Prisma error', {
        message: e.message,
        target: e.target,
      });
    });

    // Warning event listener
    this.primaryClient.$on('warn' as never, (e: PrismaLogEvent) => {
      logger.warn('Prisma warning', { message: e.message });
    });

    // Info event listener
    this.primaryClient.$on('info' as never, (e: PrismaLogEvent) => {
      logger.info('Prisma info', { message: e.message });
    });
  }

  /**
   * Connect to database with retry logic
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn('Database already connected');
      return;
    }

    let retries = 0;
    let lastError: Error | null = null;

    while (retries < this.dbConfig.maxRetries) {
      try {
        await this.primaryClient.$connect();

        // Connect to replica if configured
        if (this.replicaClient) {
          await this.replicaClient.$connect();
        }

        this.isConnected = true;
        this.metrics.totalConnections++;

        logger.info('Database connected successfully', {
          connectionLimit: this.dbConfig.connectionLimit,
          poolTimeout: this.dbConfig.poolTimeout,
          hasReplica: !!this.replicaClient,
        });

        // Start health check monitoring
        this.startHealthCheck();
        return;
      } catch (error) {
        lastError = error as Error;
        retries++;

        if (retries < this.dbConfig.maxRetries) {
          const delay = this.dbConfig.retryDelay * Math.pow(this.dbConfig.retryBackoffMultiplier, retries - 1);
          logger.warn(`Database connection failed, retrying in ${delay}ms (attempt ${retries}/${this.dbConfig.maxRetries})`, {
            error: lastError.message,
          });
          await this.sleep(delay);
        }
      }
    }

    logger.error('Failed to connect to database after all retries', {
      retries: this.dbConfig.maxRetries,
      error: lastError?.message,
    });
    throw lastError;
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      // Stop health checks
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
      }

      await this.primaryClient.$disconnect();

      if (this.replicaClient) {
        await this.replicaClient.$disconnect();
      }

      this.isConnected = false;
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from database', { error });
      throw error;
    }
  }

  /**
   * Start health check monitoring
   */
  private startHealthCheck() {
    this.healthCheckTimer = setInterval(async () => {
      try {
        const health = await this.checkHealth();
        this.metrics.lastHealthCheck = new Date();
        this.metrics.lastHealthCheckStatus = health.healthy ? 'healthy' : 'unhealthy';

        if (!health.healthy) {
          logger.error('Database health check failed', health);
        }
      } catch (error) {
        logger.error('Health check error', { error });
        this.metrics.lastHealthCheckStatus = 'unhealthy';
      }
    }, this.dbConfig.healthCheckInterval);
  }

  /**
   * Check database health
   */
  async checkHealth(): Promise<{
    healthy: boolean;
    latency?: number;
    error?: string;
    replica?: {
      healthy: boolean;
      latency?: number;
      error?: string;
    };
  }> {
    const start = Date.now();

    try {
      // Check primary connection
      await this.primaryClient.$queryRaw`SELECT 1 as health_check`;
      const primaryLatency = Date.now() - start;

      // Check replica if configured
      let replicaHealth;
      if (this.replicaClient) {
        const replicaStart = Date.now();
        try {
          await this.replicaClient.$queryRaw`SELECT 1 as health_check`;
          replicaHealth = {
            healthy: true,
            latency: Date.now() - replicaStart,
          };
        } catch (error) {
          replicaHealth = {
            healthy: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }

      return {
        healthy: true,
        latency: primaryLatency,
        replica: replicaHealth,
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get primary client for write operations
   */
  getClient(): PrismaClient {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.primaryClient;
  }

  /**
   * Get replica client for read operations (falls back to primary if not configured)
   */
  getReplicaClient(): PrismaClient {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.replicaClient || this.primaryClient;
  }

  /**
   * Execute query with retry logic
   */
  async executeWithRetry<T>(
    operation: (client: PrismaClient) => Promise<T>,
    isReadOperation = false
  ): Promise<T> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < this.dbConfig.maxRetries) {
      try {
        const client = isReadOperation ? this.getReplicaClient() : this.getClient();
        return await operation(client);
      } catch (error) {
        lastError = error as Error;
        retries++;

        // Don't retry for certain errors (e.g., unique constraint violations)
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        if (retries < this.dbConfig.maxRetries) {
          const delay = this.dbConfig.retryDelay * Math.pow(this.dbConfig.retryBackoffMultiplier, retries - 1);
          logger.warn(`Database operation failed, retrying in ${delay}ms (attempt ${retries}/${this.dbConfig.maxRetries})`, {
            error: lastError.message,
          });
          await this.sleep(delay);
        }
      }
    }

    this.metrics.failedQueries++;
    throw lastError;
  }

  /**
   * Check if error is non-retryable
   */
  private isNonRetryableError(error: unknown): boolean {
    const nonRetryableCodes = [
      'P2002', // Unique constraint violation
      'P2003', // Foreign key constraint violation
      'P2025', // Record not found
    ];

    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string };
      if (nonRetryableCodes.includes(prismaError.code)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get connection pool metrics
   */
  getMetrics(): PoolMetrics {
    return { ...this.metrics };
  }

  /**
   * Export metrics in Prometheus format
   */
  exportMetricsPrometheus(): string {
    const metrics = this.getMetrics();
    return `
# HELP db_total_connections Total database connections
# TYPE db_total_connections counter
db_total_connections ${metrics.totalConnections}

# HELP db_active_connections Active database connections
# TYPE db_active_connections gauge
db_active_connections ${metrics.activeConnections}

# HELP db_idle_connections Idle database connections
# TYPE db_idle_connections gauge
db_idle_connections ${metrics.idleConnections}

# HELP db_waiting_requests Waiting database requests
# TYPE db_waiting_requests gauge
db_waiting_requests ${metrics.waitingRequests}

# HELP db_total_queries Total database queries
# TYPE db_total_queries counter
db_total_queries ${metrics.totalQueries}

# HELP db_slow_queries Total slow queries
# TYPE db_slow_queries counter
db_slow_queries ${metrics.slowQueries}

# HELP db_failed_queries Total failed queries
# TYPE db_failed_queries counter
db_failed_queries ${metrics.failedQueries}

# HELP db_average_query_time Average query execution time in milliseconds
# TYPE db_average_query_time gauge
db_average_query_time ${metrics.averageQueryTime}
    `.trim();
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up idle connections
   */
  async cleanupIdleConnections(): Promise<void> {
    try {
      // Prisma handles connection cleanup automatically
      // This can be extended to force close connections if needed
      logger.info('Connection cleanup executed');
    } catch (error) {
      logger.error('Error during connection cleanup', { error });
    }
  }
}

// Singleton instance
let databaseManager: DatabaseManager;

/**
 * Initialize database manager
 */
export function initializeDatabaseManager(config?: Partial<DatabaseConfig>): DatabaseManager {
  if (!databaseManager) {
    databaseManager = new DatabaseManager({ ...defaultConfig, ...config });
  }
  return databaseManager;
}

/**
 * Get database manager instance
 */
export function getDatabaseManager(): DatabaseManager {
  if (!databaseManager) {
    throw new Error('Database manager not initialized. Call initializeDatabaseManager() first.');
  }
  return databaseManager;
}

// Export for convenience
export { DatabaseManager, DatabaseConfig, PoolMetrics };
