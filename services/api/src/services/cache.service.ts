/**
 * Cache Service
 * Multi-layer caching with Redis + in-memory L1 cache
 * Optimized for cost and performance
 */

import Redis from 'ioredis';
import { LRUCache } from 'lru-cache';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { cacheConfig, cacheKeys, invalidationPatterns } from '../config/cache.config.js';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export class CacheService {
  private redis: Redis;
  private memoryCache: LRUCache<string, any>;
  private isConnected: boolean = false;

  constructor() {
    // Initialize Redis connection with retry strategy
    this.redis = new Redis({
      host: cacheConfig.redis.host,
      port: cacheConfig.redis.port,
      password: cacheConfig.redis.password,
      tls: cacheConfig.redis.tls ? {} : undefined,
      maxRetriesPerRequest: cacheConfig.redis.maxRetriesPerRequest,
      retryStrategy: (times) => {
        if (times > 10) return null; // Stop retrying
        return Math.min(times * cacheConfig.redis.retryDelayMs, 3000);
      },
      lazyConnect: true,
    });

    // Initialize L1 memory cache
    this.memoryCache = new LRUCache({
      max: cacheConfig.memory.maxItems,
      ttl: cacheConfig.memory.ttl * 1000,
      updateAgeOnGet: true,
      updateAgeOnHas: false,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.redis.on('connect', () => {
      this.isConnected = true;
      console.log('Redis connected');
    });

    this.redis.on('error', (err) => {
      console.error('Redis error:', err.message);
      this.isConnected = false;
    });

    this.redis.on('close', () => {
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.redis.connect();
    }
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
    this.memoryCache.clear();
  }

  /**
   * Get value from cache (L1 memory -> L2 Redis)
   */
  async get<T>(key: string): Promise<T | null> {
    // Check L1 memory cache first
    if (cacheConfig.memory.enabled) {
      const memoryValue = this.memoryCache.get(key);
      if (memoryValue !== undefined) {
        return memoryValue as T;
      }
    }

    // Check L2 Redis cache
    if (!this.isConnected) return null;

    try {
      const redisValue = await this.redis.get(key);
      if (!redisValue) return null;

      const parsed = await this.decompress(redisValue);

      // Populate L1 cache
      if (cacheConfig.memory.enabled && parsed !== null) {
        this.memoryCache.set(key, parsed);
      }

      return parsed as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache (both L1 and L2)
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds || cacheConfig.ttl.session;

    // Set in L1 memory cache
    if (cacheConfig.memory.enabled) {
      this.memoryCache.set(key, value, { ttl: Math.min(ttl, cacheConfig.memory.ttl) * 1000 });
    }

    // Set in L2 Redis cache
    if (!this.isConnected) return;

    try {
      const serialized = await this.compress(value);
      await this.redis.setex(key, ttl, serialized);
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<void> {
    // Remove from L1
    this.memoryCache.delete(key);

    // Remove from L2
    if (this.isConnected) {
      try {
        await this.redis.del(key);
      } catch (error) {
        console.error(`Cache delete error for key ${key}:`, error);
      }
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      // Clear matching keys from L1
      for (const key of this.memoryCache.keys()) {
        if (this.matchPattern(key, pattern)) {
          this.memoryCache.delete(key);
        }
      }

      // Clear matching keys from L2 using SCAN (memory-efficient)
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error(`Cache delete pattern error for ${pattern}:`, error);
    }
  }

  /**
   * Invalidate cache for a resource
   */
  async invalidate(
    resource: keyof typeof invalidationPatterns,
    ...args: string[]
  ): Promise<void> {
    const patterns = (invalidationPatterns[resource] as (...args: string[]) => string[])(...args);
    await Promise.all(patterns.map((pattern) => this.deletePattern(pattern)));
  }

  /**
   * Get or set pattern (cache-aside)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /**
   * Acquire distributed lock
   */
  async acquireLock(
    resource: string,
    ttlMs: number = 10000
  ): Promise<string | null> {
    if (!this.isConnected) return null;

    const lockKey = cacheKeys.lock(resource);
    const lockValue = `${Date.now()}-${Math.random()}`;

    try {
      const acquired = await this.redis.set(
        lockKey,
        lockValue,
        'PX',
        ttlMs,
        'NX'
      );
      return acquired ? lockValue : null;
    } catch (error) {
      console.error(`Lock acquire error for ${resource}:`, error);
      return null;
    }
  }

  /**
   * Release distributed lock
   */
  async releaseLock(resource: string, lockValue: string): Promise<boolean> {
    if (!this.isConnected) return false;

    const lockKey = cacheKeys.lock(resource);

    // Use Lua script for atomic check-and-delete
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    try {
      const result = await this.redis.eval(script, 1, lockKey, lockValue);
      return result === 1;
    } catch (error) {
      console.error(`Lock release error for ${resource}:`, error);
      return false;
    }
  }

  /**
   * Rate limiting using sliding window
   */
  async checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    if (!this.isConnected) {
      return { allowed: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
    }

    const rateLimitKey = cacheKeys.rateLimit(key);
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    try {
      // Use Lua script for atomic operations
      const script = `
        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local window_start = tonumber(ARGV[2])
        local limit = tonumber(ARGV[3])
        local window_seconds = tonumber(ARGV[4])

        -- Remove old entries
        redis.call("ZREMRANGEBYSCORE", key, "-inf", window_start)

        -- Count current entries
        local count = redis.call("ZCARD", key)

        if count < limit then
          -- Add new entry
          redis.call("ZADD", key, now, now)
          redis.call("EXPIRE", key, window_seconds)
          return {1, limit - count - 1}
        else
          return {0, 0}
        end
      `;

      const [allowed, remaining] = (await this.redis.eval(
        script,
        1,
        rateLimitKey,
        now,
        windowStart,
        limit,
        windowSeconds
      )) as [number, number];

      return {
        allowed: allowed === 1,
        remaining,
        resetAt: now + windowSeconds * 1000,
      };
    } catch (error) {
      console.error(`Rate limit check error for ${key}:`, error);
      return { allowed: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
    }
  }

  /**
   * Compress data if above threshold
   */
  private async compress(data: any): Promise<string> {
    const json = JSON.stringify(data);

    if (cacheConfig.compression.enabled && json.length > cacheConfig.compression.threshold) {
      const compressed = await gzipAsync(json);
      return `gz:${compressed.toString('base64')}`;
    }

    return json;
  }

  /**
   * Decompress data if compressed
   */
  private async decompress(data: string): Promise<any> {
    if (data.startsWith('gz:')) {
      const compressed = Buffer.from(data.slice(3), 'base64');
      const decompressed = await gunzipAsync(compressed);
      return JSON.parse(decompressed.toString());
    }

    return JSON.parse(data);
  }

  /**
   * Match key against pattern
   */
  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(key);
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    memory: { size: number; maxSize: number };
    redis: { connected: boolean; keys?: number; memory?: string };
  }> {
    const stats: any = {
      memory: {
        size: this.memoryCache.size,
        maxSize: this.memoryCache.max,
      },
      redis: {
        connected: this.isConnected,
      },
    };

    if (this.isConnected) {
      try {
        const info = await this.redis.info('memory');
        const dbSize = await this.redis.dbsize();
        const memoryMatch = info.match(/used_memory_human:(.+)/);

        stats.redis.keys = dbSize;
        stats.redis.memory = memoryMatch ? memoryMatch[1].trim() : 'unknown';
      } catch (error) {
        // Ignore stats errors
      }
    }

    return stats;
  }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;
