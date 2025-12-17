/**
 * Redis Caching Utilities
 *
 * Implements cache-aside pattern, TTL management, and cache invalidation
 * for high-performance data access.
 */

import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger.js';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  defaultTTL?: number; // Default TTL in seconds
  enableCompression?: boolean;
  maxRetries?: number;
}

export interface CacheEntry<T> {
  data: T;
  createdAt: number;
  ttl: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
  hitRate: number;
}

export class CacheError extends Error {
  constructor(message: string, public readonly operation: string) {
    super(message);
    this.name = 'CacheError';
  }
}

export class CacheService {
  private client: RedisClientType | null = null;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0,
    hitRate: 0
  };
  private isConnected = false;

  constructor(private config: CacheConfig) {}

  /**
   * Initialize Redis connection
   */
  async connect(): Promise<void> {
    try {
      this.client = createClient({
        socket: {
          host: this.config.host,
          port: this.config.port,
          reconnectStrategy: (retries) => {
            if (retries > (this.config.maxRetries || 10)) {
              logger.error('Max Redis reconnection attempts reached');
              return new Error('Max reconnection attempts reached');
            }
            return Math.min(retries * 100, 3000);
          }
        },
        password: this.config.password,
        database: this.config.db || 0
      }) as RedisClientType;

      this.client.on('error', (err) => {
        logger.error('Redis client error', { error: err.message });
        this.stats.errors++;
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('reconnecting', () => {
        logger.warn('Redis client reconnecting');
      });

      await this.client.connect();
      logger.info('Cache service initialized', {
        host: this.config.host,
        port: this.config.port
      });
    } catch (error) {
      logger.error('Failed to connect to Redis', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new CacheError('Failed to connect to Redis', 'connect');
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Cache service disconnected');
    }
  }

  /**
   * Build full cache key with prefix
   */
  private buildKey(key: string): string {
    return this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) {
      logger.warn('Cache not available for get operation');
      return null;
    }

    try {
      const fullKey = this.buildKey(key);
      const value = await this.client.get(fullKey);

      if (value === null) {
        this.stats.misses++;
        this.updateHitRate();
        logger.debug('Cache miss', { key: fullKey });
        return null;
      }

      this.stats.hits++;
      this.updateHitRate();
      logger.debug('Cache hit', { key: fullKey });

      return JSON.parse(value) as T;
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache get error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(
    key: string,
    value: T,
    ttl?: number
  ): Promise<void> {
    if (!this.client || !this.isConnected) {
      logger.warn('Cache not available for set operation');
      return;
    }

    try {
      const fullKey = this.buildKey(key);
      const serialized = JSON.stringify(value);
      const ttlSeconds = ttl || this.config.defaultTTL || 3600;

      await this.client.setEx(fullKey, ttlSeconds, serialized);

      this.stats.sets++;
      logger.debug('Cache set', { key: fullKey, ttl: ttlSeconds });
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache set error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new CacheError('Failed to set cache', 'set');
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      logger.warn('Cache not available for delete operation');
      return;
    }

    try {
      const fullKey = this.buildKey(key);
      await this.client.del(fullKey);

      this.stats.deletes++;
      logger.debug('Cache delete', { key: fullKey });
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache delete error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new CacheError('Failed to delete cache', 'delete');
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!this.client || !this.isConnected) {
      logger.warn('Cache not available for deletePattern operation');
      return 0;
    }

    try {
      const fullPattern = this.buildKey(pattern);
      const keys = await this.client.keys(fullPattern);

      if (keys.length === 0) {
        return 0;
      }

      const deleted = await this.client.del(keys);
      this.stats.deletes += deleted;

      logger.debug('Cache pattern delete', {
        pattern: fullPattern,
        deleted
      });

      return deleted;
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache deletePattern error', {
        pattern,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new CacheError('Failed to delete pattern', 'deletePattern');
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      const fullKey = this.buildKey(key);
      const exists = await this.client.exists(fullKey);
      return exists === 1;
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache exists error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  async getTTL(key: string): Promise<number> {
    if (!this.client || !this.isConnected) {
      return -1;
    }

    try {
      const fullKey = this.buildKey(key);
      return await this.client.ttl(fullKey);
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache getTTL error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return -1;
    }
  }

  /**
   * Cache-aside pattern: get or compute and cache
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Compute the value
    const value = await factory();

    // Store in cache (fire and forget to avoid blocking)
    this.set(key, value, ttl).catch(error => {
      logger.error('Failed to cache value in getOrSet', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    });

    return value;
  }

  /**
   * Invalidate cache entries by tags
   */
  async invalidateByTag(tag: string): Promise<number> {
    return this.deletePattern(`*:${tag}:*`);
  }

  /**
   * Flush all cache entries
   */
  async flush(): Promise<void> {
    if (!this.client || !this.isConnected) {
      logger.warn('Cache not available for flush operation');
      return;
    }

    try {
      await this.client.flushDb();
      logger.info('Cache flushed');
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache flush error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new CacheError('Failed to flush cache', 'flush');
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      hitRate: 0
    };
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Check if cache is connected
   */
  isHealthy(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Ping Redis server
   */
  async ping(): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.ping();
      return true;
    } catch (error) {
      logger.error('Cache ping failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }
}

/**
 * Cache decorator for methods
 */
export function Cacheable(options: {
  key: string | ((args: any[]) => string);
  ttl?: number;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const cache = this.cache || globalCache;
      if (!cache) {
        return originalMethod.apply(this, args);
      }

      const cacheKey =
        typeof options.key === 'function'
          ? options.key(args)
          : options.key;

      return cache.getOrSet(
        cacheKey,
        () => originalMethod.apply(this, args),
        options.ttl
      );
    };

    return descriptor;
  };
}

/**
 * Cache invalidation decorator
 */
export function CacheInvalidate(options: {
  keys?: string | string[] | ((args: any[]) => string | string[]);
  patterns?: string | string[] | ((args: any[]) => string | string[]);
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const result = await originalMethod.apply(this, args);

      const cache = this.cache || globalCache;
      if (!cache) {
        return result;
      }

      // Invalidate keys
      if (options.keys) {
        const keys =
          typeof options.keys === 'function'
            ? options.keys(args)
            : options.keys;
        const keyArray = Array.isArray(keys) ? keys : [keys];

        for (const key of keyArray) {
          await cache.delete(key).catch(err =>
            logger.error('Cache invalidation error', { key, error: err })
          );
        }
      }

      // Invalidate patterns
      if (options.patterns) {
        const patterns =
          typeof options.patterns === 'function'
            ? options.patterns(args)
            : options.patterns;
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];

        for (const pattern of patternArray) {
          await cache.deletePattern(pattern).catch(err =>
            logger.error('Cache pattern invalidation error', {
              pattern,
              error: err
            })
          );
        }
      }

      return result;
    };

    return descriptor;
  };
}

// Global cache instance
let globalCache: CacheService | null = null;

/**
 * Initialize global cache
 */
export function initializeCache(config: CacheConfig): CacheService {
  globalCache = new CacheService(config);
  return globalCache;
}

/**
 * Get global cache instance
 */
export function getCache(): CacheService | null {
  return globalCache;
}

/**
 * Common cache key builders
 */
export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userProfile: (userId: string) => `user:${userId}:profile`,
  userPermissions: (userId: string) => `user:${userId}:permissions`,
  appointment: (id: string) => `appointment:${id}`,
  appointments: (userId: string, page: number) =>
    `appointments:user:${userId}:page:${page}`,
  practitioner: (id: string) => `practitioner:${id}`,
  patient: (id: string) => `patient:${id}`,
  organization: (id: string) => `organization:${id}`,
  medicalRecord: (id: string) => `medical-record:${id}`,
  prescription: (id: string) => `prescription:${id}`
};

/**
 * Common cache TTLs (in seconds)
 */
export const CacheTTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
  PERMANENT: 604800 // 7 days
};
