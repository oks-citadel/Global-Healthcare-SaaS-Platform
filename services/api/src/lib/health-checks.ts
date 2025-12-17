/**
 * Comprehensive Health Check System
 *
 * Monitors database, cache, external services, and system health
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { CacheService } from './cache.js';
import { circuitBreakerManager } from './circuit-breaker.js';

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy'
}

export interface HealthCheckResult {
  status: HealthStatus;
  message?: string;
  responseTime?: number;
  details?: any;
}

export interface SystemHealth {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: HealthCheckResult;
    cache: HealthCheckResult;
    circuitBreakers: HealthCheckResult;
    memory: HealthCheckResult;
    disk?: HealthCheckResult;
  };
  degraded: boolean;
}

/**
 * Health Check Service
 */
export class HealthCheckService {
  private startTime: number;
  private version: string;

  constructor(
    private prisma: PrismaClient,
    private cache: CacheService | null,
    version: string = process.env.APP_VERSION || '1.0.0'
  ) {
    this.startTime = Date.now();
    this.version = version;
  }

  /**
   * Perform comprehensive health check
   */
  async checkHealth(): Promise<SystemHealth> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache(),
      this.checkCircuitBreakers(),
      this.checkMemory()
    ]);

    const [database, cache, circuitBreakers, memory] = checks.map(result =>
      result.status === 'fulfilled'
        ? result.value
        : {
            status: HealthStatus.UNHEALTHY,
            message: result.reason?.message || 'Health check failed'
          }
    );

    // Determine overall health status
    const allChecks = [database, cache, circuitBreakers, memory];
    const hasUnhealthy = allChecks.some(
      check => check.status === HealthStatus.UNHEALTHY
    );
    const hasDegraded = allChecks.some(
      check => check.status === HealthStatus.DEGRADED
    );

    let overallStatus = HealthStatus.HEALTHY;
    if (hasUnhealthy) {
      overallStatus = HealthStatus.UNHEALTHY;
    } else if (hasDegraded) {
      overallStatus = HealthStatus.DEGRADED;
    }

    const health: SystemHealth = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      version: this.version,
      checks: {
        database,
        cache,
        circuitBreakers,
        memory
      },
      degraded: hasDegraded || hasUnhealthy
    };

    // Log health status
    if (overallStatus !== HealthStatus.HEALTHY) {
      logger.warn('System health degraded', { health });
    }

    return health;
  }

  /**
   * Check database connectivity
   */
  async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Try to execute a simple query
      await this.prisma.$queryRaw`SELECT 1`;

      const responseTime = Date.now() - startTime;

      // Consider degraded if response time is high
      if (responseTime > 1000) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Database responding slowly',
          responseTime,
          details: { threshold: 1000 }
        };
      }

      return {
        status: HealthStatus.HEALTHY,
        responseTime
      };
    } catch (error) {
      logger.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        status: HealthStatus.UNHEALTHY,
        message: 'Database connection failed',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Check cache connectivity
   */
  async checkCache(): Promise<HealthCheckResult> {
    if (!this.cache) {
      return {
        status: HealthStatus.DEGRADED,
        message: 'Cache not configured'
      };
    }

    const startTime = Date.now();

    try {
      const isHealthy = await this.cache.ping();

      const responseTime = Date.now() - startTime;

      if (!isHealthy) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: 'Cache not responding',
          responseTime
        };
      }

      // Consider degraded if response time is high
      if (responseTime > 500) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Cache responding slowly',
          responseTime,
          details: { threshold: 500 }
        };
      }

      const stats = this.cache.getStats();

      return {
        status: HealthStatus.HEALTHY,
        responseTime,
        details: {
          hitRate: stats.hitRate,
          errors: stats.errors
        }
      };
    } catch (error) {
      logger.error('Cache health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        status: HealthStatus.UNHEALTHY,
        message: 'Cache health check failed',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Check circuit breakers status
   */
  async checkCircuitBreakers(): Promise<HealthCheckResult> {
    try {
      const stats = circuitBreakerManager.getAllStats();
      const allHealthy = circuitBreakerManager.isAllHealthy();

      const openBreakers = Object.entries(stats)
        .filter(([_, stat]) => stat.state === 'OPEN')
        .map(([name]) => name);

      if (openBreakers.length > 0) {
        return {
          status: HealthStatus.DEGRADED,
          message: `${openBreakers.length} circuit breaker(s) open`,
          details: {
            openBreakers,
            stats
          }
        };
      }

      return {
        status: HealthStatus.HEALTHY,
        details: { breakerCount: Object.keys(stats).length }
      };
    } catch (error) {
      logger.error('Circuit breaker health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        status: HealthStatus.DEGRADED,
        message: 'Circuit breaker check failed'
      };
    }
  }

  /**
   * Check memory usage
   */
  async checkMemory(): Promise<HealthCheckResult> {
    try {
      const usage = process.memoryUsage();
      const totalMemory = usage.heapTotal;
      const usedMemory = usage.heapUsed;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      // Consider degraded if memory usage is high
      if (memoryUsagePercent > 90) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: 'Memory usage critical',
          details: {
            usagePercent: memoryUsagePercent.toFixed(2),
            heapUsed: Math.round(usedMemory / 1024 / 1024) + ' MB',
            heapTotal: Math.round(totalMemory / 1024 / 1024) + ' MB',
            threshold: 90
          }
        };
      }

      if (memoryUsagePercent > 80) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Memory usage high',
          details: {
            usagePercent: memoryUsagePercent.toFixed(2),
            heapUsed: Math.round(usedMemory / 1024 / 1024) + ' MB',
            heapTotal: Math.round(totalMemory / 1024 / 1024) + ' MB',
            threshold: 80
          }
        };
      }

      return {
        status: HealthStatus.HEALTHY,
        details: {
          usagePercent: memoryUsagePercent.toFixed(2),
          heapUsed: Math.round(usedMemory / 1024 / 1024) + ' MB',
          heapTotal: Math.round(totalMemory / 1024 / 1024) + ' MB'
        }
      };
    } catch (error) {
      logger.error('Memory health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        status: HealthStatus.DEGRADED,
        message: 'Memory check failed'
      };
    }
  }

  /**
   * Get system uptime in seconds
   */
  getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Simple liveness probe - just checks if app is running
   */
  async checkLiveness(): Promise<{ status: 'ok'; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Readiness probe - checks if app is ready to serve traffic
   */
  async checkReadiness(): Promise<{
    status: 'ready' | 'not_ready';
    checks: { database: boolean; cache: boolean };
  }> {
    const [dbResult, cacheResult] = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache()
    ]);

    const dbHealthy =
      dbResult.status === 'fulfilled' &&
      dbResult.value.status !== HealthStatus.UNHEALTHY;

    const cacheHealthy =
      cacheResult.status === 'fulfilled' &&
      cacheResult.value.status !== HealthStatus.UNHEALTHY;

    // App is ready if database is healthy (cache is optional)
    const isReady = dbHealthy;

    return {
      status: isReady ? 'ready' : 'not_ready',
      checks: {
        database: dbHealthy,
        cache: cacheHealthy
      }
    };
  }
}

/**
 * Create health check routes
 */
export function createHealthCheckRoutes(healthCheck: HealthCheckService) {
  return {
    /**
     * GET /health - Comprehensive health check
     */
    health: async () => {
      return healthCheck.checkHealth();
    },

    /**
     * GET /health/live - Liveness probe
     */
    liveness: async () => {
      return healthCheck.checkLiveness();
    },

    /**
     * GET /health/ready - Readiness probe
     */
    readiness: async () => {
      return healthCheck.checkReadiness();
    }
  };
}

/**
 * Degraded mode detector
 */
export class DegradedModeDetector {
  private degradedMode = false;
  private degradedSince?: Date;
  private checkInterval?: NodeJS.Timeout;

  constructor(
    private healthCheck: HealthCheckService,
    private checkIntervalMs: number = 60000 // Check every minute
  ) {}

  /**
   * Start monitoring for degraded mode
   */
  start(): void {
    this.checkInterval = setInterval(async () => {
      await this.checkDegradedMode();
    }, this.checkIntervalMs);

    logger.info('Degraded mode detector started');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }

    logger.info('Degraded mode detector stopped');
  }

  /**
   * Check if system is in degraded mode
   */
  async checkDegradedMode(): Promise<void> {
    try {
      const health = await this.healthCheck.checkHealth();

      const wasDegraded = this.degradedMode;
      this.degradedMode = health.degraded;

      // Entering degraded mode
      if (this.degradedMode && !wasDegraded) {
        this.degradedSince = new Date();
        logger.warn('System entering degraded mode', { health });
      }

      // Recovering from degraded mode
      if (!this.degradedMode && wasDegraded) {
        const duration = this.degradedSince
          ? Date.now() - this.degradedSince.getTime()
          : 0;

        logger.info('System recovered from degraded mode', {
          duration: `${Math.floor(duration / 1000)}s`
        });

        this.degradedSince = undefined;
      }
    } catch (error) {
      logger.error('Failed to check degraded mode', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Check if currently in degraded mode
   */
  isDegraded(): boolean {
    return this.degradedMode;
  }

  /**
   * Get degraded mode info
   */
  getDegradedInfo(): {
    degraded: boolean;
    since?: string;
    duration?: number;
  } {
    return {
      degraded: this.degradedMode,
      since: this.degradedSince?.toISOString(),
      duration: this.degradedSince
        ? Date.now() - this.degradedSince.getTime()
        : undefined
    };
  }
}
