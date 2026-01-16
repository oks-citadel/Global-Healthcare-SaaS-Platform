/**
 * Webhook Idempotency Service
 *
 * Provides idempotency for webhook event processing to prevent duplicate
 * event handling. Uses Redis as the primary storage with an in-memory
 * fallback when Redis is unavailable.
 *
 * Event IDs are stored with a 24-hour TTL to handle retries while
 * preventing indefinite storage growth.
 */

import { logger } from '../utils/logger.js';

/**
 * Processed event record
 */
export interface ProcessedEvent {
  eventId: string;
  processedAt: Date;
  source: string;
  eventType?: string;
}

/**
 * Idempotency check result
 */
export interface IdempotencyCheckResult {
  isDuplicate: boolean;
  processedAt?: Date;
  source?: string;
}

/**
 * Configuration for the idempotency service
 */
export interface WebhookIdempotencyConfig {
  /** TTL in seconds for processed event records (default: 86400 = 24 hours) */
  ttlSeconds?: number;
  /** Key prefix for Redis storage */
  keyPrefix?: string;
  /** Maximum size of in-memory fallback cache */
  maxMemoryCacheSize?: number;
}

const DEFAULT_CONFIG: Required<WebhookIdempotencyConfig> = {
  ttlSeconds: 86400, // 24 hours
  keyPrefix: 'webhook:idempotency:',
  maxMemoryCacheSize: 10000,
};

/**
 * In-memory cache entry with expiration
 */
interface MemoryCacheEntry {
  processedAt: Date;
  source: string;
  eventType?: string;
  expiresAt: number;
}

/**
 * WebhookIdempotencyService
 *
 * Manages idempotency for webhook events using Redis with in-memory fallback.
 */
export class WebhookIdempotencyService {
  private config: Required<WebhookIdempotencyConfig>;
  private redisClient: any | null = null;
  private memoryCache: Map<string, MemoryCacheEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: WebhookIdempotencyConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanupInterval();
  }

  /**
   * Set the Redis client for persistent storage
   */
  setRedisClient(client: any): void {
    this.redisClient = client;
    logger.info('Webhook idempotency service connected to Redis');
  }

  /**
   * Check if Redis is available
   */
  private isRedisAvailable(): boolean {
    return this.redisClient !== null && typeof this.redisClient.get === 'function';
  }

  /**
   * Build the storage key for an event
   */
  private buildKey(source: string, eventId: string): string {
    return `${this.config.keyPrefix}${source}:${eventId}`;
  }

  /**
   * Check if an event has already been processed
   *
   * @param source - The webhook source (e.g., 'stripe', 'github')
   * @param eventId - The unique event identifier
   * @returns IdempotencyCheckResult indicating if the event is a duplicate
   */
  async checkEventProcessed(
    source: string,
    eventId: string
  ): Promise<IdempotencyCheckResult> {
    const key = this.buildKey(source, eventId);

    try {
      // Try Redis first if available
      if (this.isRedisAvailable()) {
        const stored = await this.redisClient.get(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          logger.debug('Event found in Redis (duplicate)', {
            source,
            eventId,
            processedAt: parsed.processedAt,
          });
          return {
            isDuplicate: true,
            processedAt: new Date(parsed.processedAt),
            source: parsed.source,
          };
        }
      }

      // Check in-memory cache as fallback
      const memoryEntry = this.memoryCache.get(key);
      if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
        logger.debug('Event found in memory cache (duplicate)', {
          source,
          eventId,
          processedAt: memoryEntry.processedAt,
        });
        return {
          isDuplicate: true,
          processedAt: memoryEntry.processedAt,
          source: memoryEntry.source,
        };
      }

      // Not found - event is new
      return { isDuplicate: false };
    } catch (error) {
      logger.error('Error checking event idempotency', {
        source,
        eventId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // On error, check memory cache as fallback
      const memoryEntry = this.memoryCache.get(key);
      if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
        return {
          isDuplicate: true,
          processedAt: memoryEntry.processedAt,
          source: memoryEntry.source,
        };
      }

      // Default to not duplicate on error to avoid blocking events
      return { isDuplicate: false };
    }
  }

  /**
   * Mark an event as processed
   *
   * @param source - The webhook source (e.g., 'stripe', 'github')
   * @param eventId - The unique event identifier
   * @param eventType - Optional event type for logging/debugging
   */
  async markEventProcessed(
    source: string,
    eventId: string,
    eventType?: string
  ): Promise<void> {
    const key = this.buildKey(source, eventId);
    const processedAt = new Date();
    const record: ProcessedEvent = {
      eventId,
      processedAt,
      source,
      eventType,
    };

    try {
      // Store in Redis if available
      if (this.isRedisAvailable()) {
        await this.redisClient.setex(
          key,
          this.config.ttlSeconds,
          JSON.stringify(record)
        );
        logger.debug('Event marked as processed in Redis', {
          source,
          eventId,
          eventType,
        });
      }

      // Always store in memory cache as backup
      this.storeInMemoryCache(key, {
        processedAt,
        source,
        eventType,
        expiresAt: Date.now() + this.config.ttlSeconds * 1000,
      });

      logger.info('Webhook event marked as processed', {
        source,
        eventId,
        eventType,
        storageMethod: this.isRedisAvailable() ? 'redis+memory' : 'memory',
      });
    } catch (error) {
      logger.error('Error marking event as processed', {
        source,
        eventId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Fallback to memory-only storage
      this.storeInMemoryCache(key, {
        processedAt,
        source,
        eventType,
        expiresAt: Date.now() + this.config.ttlSeconds * 1000,
      });
    }
  }

  /**
   * Store entry in memory cache with size limit enforcement
   */
  private storeInMemoryCache(key: string, entry: MemoryCacheEntry): void {
    // Enforce size limit by removing oldest entries
    if (this.memoryCache.size >= this.config.maxMemoryCacheSize) {
      const entriesToRemove = Math.floor(this.config.maxMemoryCacheSize * 0.1);
      const iterator = this.memoryCache.keys();
      for (let i = 0; i < entriesToRemove; i++) {
        const keyToRemove = iterator.next().value;
        if (keyToRemove) {
          this.memoryCache.delete(keyToRemove);
        }
      }
      logger.debug('Evicted entries from memory cache', {
        evictedCount: entriesToRemove,
      });
    }

    this.memoryCache.set(key, entry);
  }

  /**
   * Remove an event from the processed cache (for testing or manual cleanup)
   */
  async removeEvent(source: string, eventId: string): Promise<void> {
    const key = this.buildKey(source, eventId);

    try {
      if (this.isRedisAvailable()) {
        await this.redisClient.del(key);
      }
      this.memoryCache.delete(key);
      logger.debug('Event removed from idempotency cache', { source, eventId });
    } catch (error) {
      logger.error('Error removing event from cache', {
        source,
        eventId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get statistics about the idempotency service
   */
  async getStats(): Promise<{
    memoryCacheSize: number;
    redisAvailable: boolean;
    ttlSeconds: number;
  }> {
    return {
      memoryCacheSize: this.memoryCache.size,
      redisAvailable: this.isRedisAvailable(),
      ttlSeconds: this.config.ttlSeconds,
    };
  }

  /**
   * Start periodic cleanup of expired memory cache entries
   */
  private startCleanupInterval(): void {
    // Clean up every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);

    // Don't prevent process exit
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Clean up expired entries from memory cache
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt <= now) {
        this.memoryCache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      logger.debug('Cleaned up expired idempotency entries', {
        removedCount,
        remainingCount: this.memoryCache.size,
      });
    }
  }

  /**
   * Shutdown the service and cleanup resources
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.memoryCache.clear();
    logger.info('Webhook idempotency service shut down');
  }

  /**
   * Clear all cached entries (for testing)
   */
  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    if (this.isRedisAvailable()) {
      try {
        const keys = await this.redisClient.keys(`${this.config.keyPrefix}*`);
        if (keys && keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (error) {
        logger.error('Error clearing Redis idempotency keys', { error });
      }
    }
    logger.debug('Idempotency cache cleared');
  }
}

// Singleton instance
let idempotencyServiceInstance: WebhookIdempotencyService | null = null;

/**
 * Get the singleton idempotency service instance
 */
export function getWebhookIdempotencyService(
  config?: WebhookIdempotencyConfig
): WebhookIdempotencyService {
  if (!idempotencyServiceInstance) {
    idempotencyServiceInstance = new WebhookIdempotencyService(config);
  }
  return idempotencyServiceInstance;
}

/**
 * Initialize the webhook idempotency service with Redis
 */
export function initializeWebhookIdempotency(
  redisClient: any,
  config?: WebhookIdempotencyConfig
): WebhookIdempotencyService {
  const service = getWebhookIdempotencyService(config);
  service.setRedisClient(redisClient);
  return service;
}

/**
 * Helper function to check and mark event in one operation
 * Returns true if the event should be processed (not a duplicate)
 */
export async function processWebhookIdempotently(
  source: string,
  eventId: string,
  eventType?: string
): Promise<boolean> {
  const service = getWebhookIdempotencyService();
  const result = await service.checkEventProcessed(source, eventId);

  if (result.isDuplicate) {
    logger.info('Duplicate webhook event detected', {
      source,
      eventId,
      eventType,
      originallyProcessedAt: result.processedAt,
    });
    return false;
  }

  // Mark as processed before returning
  await service.markEventProcessed(source, eventId, eventType);
  return true;
}

export default WebhookIdempotencyService;
