import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface CacheOptions {
  ttl?: number; // TTL in seconds
  prefix?: string;
  tags?: string[];
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTtl = 3600; // 1 hour
  private readonly defaultPrefix = 'content:cache:';

  constructor(private readonly redisService: RedisService) {}

  /**
   * Generate cache key
   */
  private generateKey(key: string, prefix?: string): string {
    return `${prefix || this.defaultPrefix}${key}`;
  }

  /**
   * Get a cached value
   */
  async get<T>(key: string, prefix?: string): Promise<T | null> {
    const cacheKey = this.generateKey(key, prefix);

    try {
      const value = await this.redisService.get<T>(cacheKey);
      if (value) {
        this.logger.debug(`Cache hit: ${cacheKey}`);
      }
      return value;
    } catch (error) {
      this.logger.error(`Cache get error: ${error.message}`);
      return null;
    }
  }

  /**
   * Set a cached value
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const cacheKey = this.generateKey(key, options.prefix);
    const ttl = options.ttl || this.defaultTtl;

    try {
      await this.redisService.set(cacheKey, value, ttl);

      // Store tags for cache invalidation
      if (options.tags && options.tags.length > 0) {
        for (const tag of options.tags) {
          await this.redisService.sadd(`${this.defaultPrefix}tag:${tag}`, cacheKey);
        }
      }

      this.logger.debug(`Cache set: ${cacheKey} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache set error: ${error.message}`);
    }
  }

  /**
   * Delete a cached value
   */
  async delete(key: string, prefix?: string): Promise<void> {
    const cacheKey = this.generateKey(key, prefix);

    try {
      await this.redisService.del(cacheKey);
      this.logger.debug(`Cache delete: ${cacheKey}`);
    } catch (error) {
      this.logger.error(`Cache delete error: ${error.message}`);
    }
  }

  /**
   * Delete all cache entries with a specific tag
   */
  async deleteByTag(tag: string): Promise<number> {
    const tagKey = `${this.defaultPrefix}tag:${tag}`;

    try {
      const keys = await this.redisService.smembers(tagKey);

      if (keys.length === 0) {
        return 0;
      }

      const pipeline = this.redisService.pipeline();

      for (const key of keys) {
        pipeline.del(key);
      }

      pipeline.del(tagKey);
      await pipeline.exec();

      this.logger.debug(`Cache invalidated by tag: ${tag} (${keys.length} keys)`);
      return keys.length;
    } catch (error) {
      this.logger.error(`Cache delete by tag error: ${error.message}`);
      return 0;
    }
  }

  /**
   * Delete cache entries matching a pattern
   */
  async deleteByPattern(pattern: string): Promise<number> {
    const fullPattern = `${this.defaultPrefix}${pattern}`;

    try {
      const deleted = await this.redisService.delPattern(fullPattern);
      this.logger.debug(`Cache invalidated by pattern: ${fullPattern} (${deleted} keys)`);
      return deleted;
    } catch (error) {
      this.logger.error(`Cache delete by pattern error: ${error.message}`);
      return 0;
    }
  }

  /**
   * Get or set cache value (with cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    const cached = await this.get<T>(key, options.prefix);

    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);

    return value;
  }

  /**
   * Wrap a function with caching
   */
  wrap<T, A extends any[]>(
    keyGenerator: (...args: A) => string,
    fn: (...args: A) => Promise<T>,
    options: CacheOptions = {},
  ): (...args: A) => Promise<T> {
    return async (...args: A): Promise<T> => {
      const key = keyGenerator(...args);
      return this.getOrSet(key, () => fn(...args), options);
    };
  }

  /**
   * Clear all cache entries for a tenant
   */
  async clearTenantCache(tenantId: string): Promise<number> {
    return this.deleteByPattern(`tenant:${tenantId}:*`);
  }

  /**
   * Clear page cache for a tenant
   */
  async clearPageCache(tenantId: string, pageId?: string): Promise<number> {
    if (pageId) {
      await this.delete(`tenant:${tenantId}:page:${pageId}`);
      return 1;
    }
    return this.deleteByPattern(`tenant:${tenantId}:page:*`);
  }

  /**
   * Build cache key for a page
   */
  buildPageCacheKey(tenantId: string, identifier: string): string {
    return `tenant:${tenantId}:page:${identifier}`;
  }

  /**
   * Build cache key for a list query
   */
  buildListCacheKey(tenantId: string, resource: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    return `tenant:${tenantId}:${resource}:list:${sortedParams}`;
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connected: boolean;
    keys?: number;
    memory?: string;
  }> {
    try {
      const connected = await this.redisService.ping();

      if (!connected) {
        return { connected: false };
      }

      const client = this.redisService.getClient();
      const info = await client.info('memory');
      const keyspace = await client.info('keyspace');

      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const keysMatch = keyspace.match(/keys=(\d+)/);

      return {
        connected: true,
        keys: keysMatch ? parseInt(keysMatch[1], 10) : 0,
        memory: memoryMatch ? memoryMatch[1] : 'unknown',
      };
    } catch {
      return { connected: false };
    }
  }
}
