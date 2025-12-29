/**
 * Cache Utility for Terminology Services
 * Provides in-memory caching with TTL support and optional Redis integration
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheConfig {
  defaultTTL: number; // TTL in milliseconds
  maxSize: number;
  redisClient?: RedisLike;
}

export interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<void>;
  del(key: string): Promise<void>;
}

const DEFAULT_CONFIG: CacheConfig = {
  defaultTTL: 3600000, // 1 hour
  maxSize: 10000,
};

/**
 * In-memory cache with TTL support
 * Can be extended with Redis for distributed caching
 */
export class TerminologyCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;
  private keyPrefix: string;

  constructor(keyPrefix: string, config: Partial<CacheConfig> = {}) {
    this.keyPrefix = keyPrefix;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private getFullKey(key: string): string {
    return `${this.keyPrefix}:${key}`;
  }

  /**
   * Get a value from cache
   */
  async get(key: string): Promise<T | null> {
    const fullKey = this.getFullKey(key);

    // Try Redis first if available
    if (this.config.redisClient) {
      try {
        const redisValue = await this.config.redisClient.get(fullKey);
        if (redisValue) {
          return JSON.parse(redisValue) as T;
        }
      } catch (error) {
        // Fall through to memory cache on Redis error
        console.warn(`Redis cache get error for ${fullKey}:`, error);
      }
    }

    // Check memory cache
    const entry = this.cache.get(fullKey);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(fullKey);
      return null;
    }

    return entry.value;
  }

  /**
   * Set a value in cache
   */
  async set(key: string, value: T, ttl?: number): Promise<void> {
    const fullKey = this.getFullKey(key);
    const actualTTL = ttl ?? this.config.defaultTTL;
    const expiresAt = Date.now() + actualTTL;

    // Set in Redis if available
    if (this.config.redisClient) {
      try {
        await this.config.redisClient.set(
          fullKey,
          JSON.stringify(value),
          { EX: Math.floor(actualTTL / 1000) }
        );
      } catch (error) {
        console.warn(`Redis cache set error for ${fullKey}:`, error);
      }
    }

    // Ensure we don't exceed max size
    if (this.cache.size >= this.config.maxSize) {
      this.evictExpired();
      // If still full, remove oldest entry
      if (this.cache.size >= this.config.maxSize) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
      }
    }

    // Set in memory cache
    this.cache.set(fullKey, { value, expiresAt });
  }

  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);

    if (this.config.redisClient) {
      try {
        await this.config.redisClient.del(fullKey);
      } catch (error) {
        console.warn(`Redis cache delete error for ${fullKey}:`, error);
      }
    }

    this.cache.delete(fullKey);
  }

  /**
   * Clear all entries for this prefix
   */
  async clear(): Promise<void> {
    // Clear memory cache entries with this prefix
    for (const key of this.cache.keys()) {
      if (key.startsWith(this.keyPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict expired entries
   */
  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; hasRedis: boolean } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hasRedis: !!this.config.redisClient,
    };
  }

  /**
   * Set Redis client for distributed caching
   */
  setRedisClient(client: RedisLike): void {
    this.config.redisClient = client;
  }
}

/**
 * Create a new terminology cache instance
 */
export function createTerminologyCache<T>(
  prefix: string,
  config?: Partial<CacheConfig>
): TerminologyCache<T> {
  return new TerminologyCache<T>(prefix, config);
}
