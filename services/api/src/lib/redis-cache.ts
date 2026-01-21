import Redis, { Redis as RedisClient } from 'ioredis';
import { logger } from '../utils/logger.js';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  lazyConnect?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

export interface CacheWarmingConfig<T = unknown> {
  keys: string[];
  loader: (key: string) => Promise<T>;
  ttl?: number;
}

export class RedisCache {
  private client: RedisClient;
  private isConnected: boolean = false;
  private readonly keyPrefix: string;

  constructor(config: CacheConfig) {
    this.keyPrefix = config.keyPrefix || 'app:';

    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db || 0,
      maxRetriesPerRequest: config.maxRetriesPerRequest || 3,
      enableReadyCheck: config.enableReadyCheck !== false,
      lazyConnect: config.lazyConnect || false,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Redis connection retry attempt ${times}, waiting ${delay}ms`);
        return delay;
      },
    });

    this.setupEventHandlers();
  }

  /**
   * Setup Redis event handlers
   */
  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('error', (err) => {
      logger.error('Redis client error:', err);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      logger.warn('Redis client connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting');
    });
  }

  /**
   * Build full cache key with prefix
   */
  private buildKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * Check if cache is available
   */
  public isAvailable(): boolean {
    return this.isConnected;
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key);
      const data = await this.client.get(fullKey);

      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data) as CacheEntry<T>;

      // Check if entry has expired (additional layer beyond Redis TTL)
      if (parsed.ttl && parsed.timestamp + parsed.ttl * 1000 < Date.now()) {
        await this.delete(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
      };

      const serialized = JSON.stringify(entry);

      if (ttl) {
        await this.client.setex(fullKey, ttl, serialized);
      } else {
        await this.client.set(fullKey, serialized);
      }

      return true;
    } catch (error) {
      logger.error(`Error setting cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      await this.client.del(fullKey);
      return true;
    } catch (error) {
      logger.error(`Error deleting cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const fullPattern = this.buildKey(pattern);
      const keys = await this.client.keys(fullPattern);

      if (keys.length === 0) {
        return 0;
      }

      await this.client.del(...keys);
      return keys.length;
    } catch (error) {
      logger.error(`Error deleting cache pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const result = await this.client.exists(fullKey);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set TTL on existing key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const result = await this.client.expire(fullKey, ttl);
      return result === 1;
    } catch (error) {
      logger.error(`Error setting TTL on cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL
   */
  async ttl(key: string): Promise<number> {
    try {
      const fullKey = this.buildKey(key);
      return await this.client.ttl(fullKey);
    } catch (error) {
      logger.error(`Error getting TTL for cache key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment value
   */
  async increment(key: string, by: number = 1): Promise<number> {
    try {
      const fullKey = this.buildKey(key);
      return await this.client.incrby(fullKey, by);
    } catch (error) {
      logger.error(`Error incrementing cache key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Decrement value
   */
  async decrement(key: string, by: number = 1): Promise<number> {
    try {
      const fullKey = this.buildKey(key);
      return await this.client.decrby(fullKey, by);
    } catch (error) {
      logger.error(`Error decrementing cache key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Cache-Aside Pattern
   * Get from cache or load from source
   */
  async cacheAside<T>(
    key: string,
    loader: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Load from source
    const data = await loader();

    // Store in cache (fire and forget)
    this.set(key, data, ttl).catch(err => {
      logger.error(`Error caching data for key ${key}:`, err);
    });

    return data;
  }

  /**
   * Read-Through Pattern
   * Always go through cache layer
   */
  async readThrough<T>(
    key: string,
    loader: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    return this.cacheAside(key, loader, ttl);
  }

  /**
   * Write-Through Pattern
   * Update cache and source together
   */
  async writeThrough<T>(
    key: string,
    value: T,
    persistFn: (value: T) => Promise<void>,
    ttl?: number
  ): Promise<void> {
    // Write to both cache and persistent store
    await Promise.all([
      this.set(key, value, ttl),
      persistFn(value),
    ]);
  }

  /**
   * Write-Behind Pattern
   * Update cache immediately, persist asynchronously
   */
  async writeBehind<T>(
    key: string,
    value: T,
    persistFn: (value: T) => Promise<void>,
    ttl?: number
  ): Promise<void> {
    // Write to cache immediately
    await this.set(key, value, ttl);

    // Persist asynchronously
    persistFn(value).catch(err => {
      logger.error(`Error persisting data for key ${key}:`, err);
    });
  }

  /**
   * Cache Warming
   * Pre-populate cache with frequently accessed data
   */
  async warmCache<T>(config: CacheWarmingConfig<T>): Promise<void> {
    logger.info(`Warming cache for ${config.keys.length} keys`);

    const promises = config.keys.map(async (key) => {
      try {
        const data = await config.loader(key);
        await this.set(key, data, config.ttl);
        logger.debug(`Cache warmed for key: ${key}`);
      } catch (error) {
        logger.error(`Error warming cache for key ${key}:`, error);
      }
    });

    await Promise.allSettled(promises);
    logger.info('Cache warming completed');
  }

  /**
   * Get multiple keys
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const fullKeys = keys.map(key => this.buildKey(key));
      const values = await this.client.mget(...fullKeys);

      return values.map(value => {
        if (!value) return null;
        try {
          const parsed = JSON.parse(value) as CacheEntry<T>;
          return parsed.data;
        } catch {
          return null;
        }
      });
    } catch (error) {
      logger.error('Error getting multiple cache keys:', error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple keys
   */
  async mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<boolean> {
    try {
      const pipeline = this.client.pipeline();

      entries.forEach(({ key, value, ttl }) => {
        const fullKey = this.buildKey(key);
        const entry: CacheEntry<T> = {
          data: value,
          timestamp: Date.now(),
          ttl,
        };
        const serialized = JSON.stringify(entry);

        if (ttl) {
          pipeline.setex(fullKey, ttl, serialized);
        } else {
          pipeline.set(fullKey, serialized);
        }
      });

      await pipeline.exec();
      return true;
    } catch (error) {
      logger.error('Error setting multiple cache keys:', error);
      return false;
    }
  }

  /**
   * Clear all cache entries with prefix
   */
  async clear(): Promise<void> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      logger.info(`Cleared ${keys.length} cache entries`);
    } catch (error) {
      logger.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    keyCount: number;
    memoryUsed: string;
    hitRate?: number;
  }> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}*`);
      const info = await this.client.info('memory');

      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memoryUsed = memoryMatch ? memoryMatch[1].trim() : 'N/A';

      return {
        keyCount: keys.length,
        memoryUsed,
      };
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      return {
        keyCount: 0,
        memoryUsed: 'N/A',
      };
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('Redis client disconnected');
    } catch (error) {
      logger.error('Error disconnecting Redis client:', error);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
let cacheInstance: RedisCache | null = null;

/**
 * Initialize Redis cache
 */
export function initializeCache(config: CacheConfig): RedisCache {
  if (!cacheInstance) {
    cacheInstance = new RedisCache(config);
  }
  return cacheInstance;
}

/**
 * Get cache instance
 */
export function getCache(): RedisCache {
  if (!cacheInstance) {
    throw new Error('Cache not initialized. Call initializeCache first.');
  }
  return cacheInstance;
}

export default RedisCache;
