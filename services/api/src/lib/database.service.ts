// @ts-nocheck
import { prisma, checkDatabaseHealth, connectDatabase, disconnectDatabase } from './prisma.js';
import { logger } from '../utils/logger.js';

export interface TransactionClient {
  $transaction: typeof prisma.$transaction;
}

/**
 * Database service providing centralized access to Prisma operations
 * with transaction support and health checks
 */
export const databaseService = {
  /**
   * Get the Prisma client instance
   */
  get client() {
    return prisma;
  },

  /**
   * Connect to the database
   */
  connect: connectDatabase,

  /**
   * Disconnect from the database
   */
  disconnect: disconnectDatabase,

  /**
   * Check database health
   */
  checkHealth: checkDatabaseHealth,

  /**
   * Execute operations within a transaction
   * @param fn - Function containing database operations
   */
  async transaction<T>(
    fn: (tx: typeof prisma) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(async (tx) => {
      return fn(tx as typeof prisma);
    });
  },

  /**
   * Execute operations with retry logic
   * @param fn - Function containing database operations
   * @param maxRetries - Maximum number of retries
   */
  async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        const isRetryable = this.isRetryableError(lastError);

        if (!isRetryable || attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        logger.warn(`Database operation failed, retrying in ${delay}ms`, {
          attempt,
          maxRetries,
          error: lastError.message,
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  },

  /**
   * Check if an error is retryable
   */
  isRetryableError(error: Error): boolean {
    const retryableCodes = [
      'P1001', // Can't reach database server
      'P1002', // Connection timeout
      'P1008', // Operations timed out
      'P1017', // Server has closed the connection
      'P2024', // Pool timeout
    ];

    // Check for Prisma error codes
    const prismaError = error as { code?: string };
    if (prismaError.code && retryableCodes.includes(prismaError.code)) {
      return true;
    }

    // Check for connection-related errors
    const message = error.message.toLowerCase();
    const retryableMessages = [
      'connection refused',
      'connection reset',
      'socket hang up',
      'econnreset',
      'etimedout',
    ];

    return retryableMessages.some(msg => message.includes(msg));
  },

  /**
   * Soft delete helper - updates a record instead of deleting
   */
  async softDelete(
    model: string,
    id: string,
    deletedByField = 'deletedAt'
  ): Promise<void> {
    const modelRef = (prisma as Record<string, unknown>)[model];
    if (!modelRef || typeof modelRef !== 'object') {
      throw new Error(`Model ${model} not found`);
    }

    const updateFn = (modelRef as Record<string, (args: unknown) => Promise<unknown>>).update;
    if (typeof updateFn !== 'function') {
      throw new Error(`Update method not found on model ${model}`);
    }

    await updateFn({
      where: { id },
      data: { [deletedByField]: new Date() },
    });
  },

  /**
   * Paginated query helper
   */
  async paginate<T>(
    model: string,
    options: {
      page: number;
      limit: number;
      where?: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'>;
      include?: Record<string, boolean>;
    }
  ): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page, limit, where, orderBy, include } = options;
    const skip = (page - 1) * limit;

    const modelRef = (prisma as Record<string, unknown>)[model];
    if (!modelRef || typeof modelRef !== 'object') {
      throw new Error(`Model ${model} not found`);
    }

    const findManyFn = (modelRef as Record<string, (args: unknown) => Promise<T[]>>).findMany;
    const countFn = (modelRef as Record<string, (args: unknown) => Promise<number>>).count;

    const [data, total] = await Promise.all([
      findManyFn({
        where,
        orderBy,
        include,
        skip,
        take: limit,
      }),
      countFn({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

export default databaseService;
