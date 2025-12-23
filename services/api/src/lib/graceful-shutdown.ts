/**
 * Graceful Shutdown Handler
 *
 * Ensures clean application shutdown by:
 * - Draining active connections
 * - Completing in-flight requests
 * - Closing database connections
 * - Cleaning up resources
 */

import { Server } from 'http';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger.js';
import { CacheService } from './cache.js';

export interface ShutdownConfig {
  timeout: number; // Maximum time to wait for graceful shutdown (ms)
  signals: string[]; // Signals to listen for
  onShutdown?: () => Promise<void> | void; // Custom cleanup function
}

export interface ShutdownState {
  isShuttingDown: boolean;
  startTime?: Date;
  reason?: string;
}

const DEFAULT_SHUTDOWN_CONFIG: ShutdownConfig = {
  timeout: 30000, // 30 seconds
  signals: ['SIGTERM', 'SIGINT']
};

export class GracefulShutdownManager {
  private state: ShutdownState = {
    isShuttingDown: false
  };
  private activeConnections = new Set<any>();
  private shutdownTimer?: NodeJS.Timeout;

  constructor(
    private server: Server,
    private prisma: PrismaClient,
    private cache: CacheService | null,
    private config: ShutdownConfig = DEFAULT_SHUTDOWN_CONFIG
  ) {}

  /**
   * Initialize graceful shutdown handlers
   */
  initialize(): void {
    // Listen for shutdown signals
    this.config.signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, starting graceful shutdown`);
        await this.shutdown(signal);
      });
    });

    // Handle uncaught errors
    process.on('uncaughtException', async (error) => {
      logger.error('Uncaught exception', {
        error: error.message,
        stack: error.stack
      });
      await this.shutdown('uncaughtException');
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      logger.error('Unhandled rejection', {
        reason,
        promise
      });
      await this.shutdown('unhandledRejection');
      process.exit(1);
    });

    // Track connections
    this.server.on('connection', (connection) => {
      this.activeConnections.add(connection);

      connection.on('close', () => {
        this.activeConnections.delete(connection);
      });
    });

    logger.info('Graceful shutdown handlers initialized', {
      signals: this.config.signals,
      timeout: this.config.timeout
    });
  }

  /**
   * Perform graceful shutdown
   */
  async shutdown(reason: string): Promise<void> {
    // Prevent multiple shutdown attempts
    if (this.state.isShuttingDown) {
      logger.warn('Shutdown already in progress');
      return;
    }

    this.state.isShuttingDown = true;
    this.state.startTime = new Date();
    this.state.reason = reason;

    logger.info('Starting graceful shutdown', {
      reason,
      activeConnections: this.activeConnections.size
    });

    // Set a timeout to force shutdown if graceful shutdown takes too long
    this.shutdownTimer = setTimeout(() => {
      logger.error('Graceful shutdown timeout exceeded, forcing shutdown', {
        timeout: this.config.timeout,
        activeConnections: this.activeConnections.size
      });
      process.exit(1);
    }, this.config.timeout);

    try {
      // Step 1: Stop accepting new connections
      await this.stopAcceptingConnections();

      // Step 2: Wait for in-flight requests to complete
      await this.drainConnections();

      // Step 3: Run custom cleanup function
      if (this.config.onShutdown) {
        logger.info('Running custom shutdown handler');
        await this.config.onShutdown();
      }

      // Step 4: Close database connections
      await this.closeDatabaseConnections();

      // Step 5: Close cache connections
      await this.closeCacheConnections();

      // Step 6: Close HTTP server
      await this.closeServer();

      const duration = Date.now() - this.state.startTime!.getTime();

      logger.info('Graceful shutdown completed', {
        duration: `${duration}ms`,
        reason
      });

      // Clear the shutdown timer
      if (this.shutdownTimer) {
        clearTimeout(this.shutdownTimer);
      }

      // Exit successfully
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      // Force exit on error
      process.exit(1);
    }
  }

  /**
   * Stop accepting new connections
   */
  private async stopAcceptingConnections(): Promise<void> {
    return new Promise((resolve) => {
      logger.info('Stopping new connections');

      // Stop accepting new connections
      this.server.close(() => {
        logger.info('Server stopped accepting new connections');
        resolve();
      });
    });
  }

  /**
   * Drain active connections
   */
  private async drainConnections(): Promise<void> {
    const maxWaitTime = this.config.timeout * 0.6; // Use 60% of timeout for draining
    const startTime = Date.now();

    logger.info('Draining active connections', {
      count: this.activeConnections.size
    });

    // Wait for connections to close naturally
    while (this.activeConnections.size > 0) {
      const elapsed = Date.now() - startTime;

      if (elapsed > maxWaitTime) {
        logger.warn('Forcing close of remaining connections', {
          remaining: this.activeConnections.size
        });

        // Force close remaining connections
        this.activeConnections.forEach(connection => {
          try {
            connection.destroy();
          } catch (error) {
            logger.error('Error destroying connection', {
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        });

        break;
      }

      // Wait a bit before checking again
      await this.sleep(100);
    }

    logger.info('All connections drained', {
      duration: `${Date.now() - startTime}ms`
    });
  }

  /**
   * Close database connections
   */
  private async closeDatabaseConnections(): Promise<void> {
    try {
      logger.info('Closing database connections');
      await this.prisma.$disconnect();
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Close cache connections
   */
  private async closeCacheConnections(): Promise<void> {
    if (!this.cache) {
      return;
    }

    try {
      logger.info('Closing cache connections');
      await this.cache.disconnect();
      logger.info('Cache connections closed');
    } catch (error) {
      logger.error('Error closing cache connections', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      // Don't throw - cache is not critical for shutdown
    }
  }

  /**
   * Close HTTP server
   */
  private async closeServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      logger.info('Closing HTTP server');

      this.server.close((error) => {
        if (error) {
          logger.error('Error closing HTTP server', {
            error: error.message
          });
          reject(error);
        } else {
          logger.info('HTTP server closed');
          resolve();
        }
      });
    });
  }

  /**
   * Get current shutdown state
   */
  getState(): ShutdownState {
    return { ...this.state };
  }

  /**
   * Check if shutdown is in progress
   */
  isShuttingDown(): boolean {
    return this.state.isShuttingDown;
  }

  /**
   * Get active connection count
   */
  getActiveConnectionCount(): number {
    return this.activeConnections.size;
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Middleware to reject requests during shutdown
 */
export function createShutdownMiddleware(manager: GracefulShutdownManager) {
  return (req: any, res: any, next: any) => {
    if (manager.isShuttingDown()) {
      logger.warn('Rejecting request during shutdown', {
        method: req.method,
        path: req.path
      });

      return res.status(503).json({
        error: 'ServiceUnavailable',
        message: 'Server is shutting down',
        code: 'ERR_1008',
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
}

/**
 * Helper to create and initialize graceful shutdown
 */
export function initializeGracefulShutdown(
  server: Server,
  prisma: PrismaClient,
  cache: CacheService | null,
  config?: Partial<ShutdownConfig>
): GracefulShutdownManager {
  const manager = new GracefulShutdownManager(
    server,
    prisma,
    cache,
    { ...DEFAULT_SHUTDOWN_CONFIG, ...config }
  );

  manager.initialize();

  return manager;
}

/**
 * Shutdown hooks for cleanup tasks
 */
export class ShutdownHooks {
  private hooks: Array<{
    name: string;
    fn: () => Promise<void> | void;
    priority: number;
  }> = [];

  /**
   * Register a shutdown hook
   */
  register(
    name: string,
    fn: () => Promise<void> | void,
    priority: number = 0
  ): void {
    this.hooks.push({ name, fn, priority });

    // Sort by priority (higher priority runs first)
    this.hooks.sort((a, b) => b.priority - a.priority);

    logger.debug('Shutdown hook registered', { name, priority });
  }

  /**
   * Execute all shutdown hooks
   */
  async execute(): Promise<void> {
    logger.info('Executing shutdown hooks', { count: this.hooks.length });

    for (const hook of this.hooks) {
      try {
        logger.debug('Executing shutdown hook', { name: hook.name });
        await hook.fn();
        logger.debug('Shutdown hook completed', { name: hook.name });
      } catch (error) {
        logger.error('Shutdown hook failed', {
          name: hook.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        // Continue with other hooks even if one fails
      }
    }

    logger.info('All shutdown hooks executed');
  }

  /**
   * Clear all hooks
   */
  clear(): void {
    this.hooks = [];
  }

  /**
   * Get all registered hooks
   */
  getHooks(): Array<{ name: string; priority: number }> {
    return this.hooks.map(({ name, priority }) => ({ name, priority }));
  }
}

// Global shutdown hooks instance
export const shutdownHooks = new ShutdownHooks();
