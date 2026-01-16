import Redis from 'ioredis';
import { RateLimitStore, RedisConnectionOptions } from '../types.js';
import { REDIS_DEFAULTS } from '../config.js';

/**
 * Redis-based rate limit store for distributed rate limiting
 */
export class RedisStore implements RateLimitStore {
  private client: Redis | null = null;
  private connected: boolean = false;
  private connectionAttempted: boolean = false;
  private keyPrefix: string;
  private windowMs: number;
  private serviceName: string;
  private lastError: string | null = null;

  constructor(
    options: RedisConnectionOptions,
    windowMs: number = 60000,
    serviceName: string = 'unknown'
  ) {
    this.keyPrefix = options.keyPrefix || REDIS_DEFAULTS.keyPrefix;
    this.windowMs = windowMs;
    this.serviceName = serviceName;
    this.initializeClient(options);
  }

  /**
   * Initialize Redis client
   */
  private initializeClient(options: RedisConnectionOptions): void {
    if (this.connectionAttempted) return;
    this.connectionAttempted = true;

    try {
      const redisUrl = options.url || `redis://${options.host || REDIS_DEFAULTS.host}:${options.port || REDIS_DEFAULTS.port}`;

      this.client = new Redis(redisUrl, {
        password: options.password,
        connectTimeout: options.connectTimeout || REDIS_DEFAULTS.connectTimeout,
        maxRetriesPerRequest: options.maxRetries || REDIS_DEFAULTS.maxRetries,
        retryStrategy: (times: number) => {
          if (times > (options.maxRetries || REDIS_DEFAULTS.maxRetries)) {
            console.error(`[RateLimit:${this.serviceName}] Redis max reconnection attempts reached`);
            this.lastError = 'Max reconnection attempts reached';
            return null; // Stop retrying
          }
          const delay = Math.min(times * REDIS_DEFAULTS.retryDelayMs, REDIS_DEFAULTS.maxRetryDelayMs);
          console.log(`[RateLimit:${this.serviceName}] Redis reconnecting in ${delay}ms (attempt ${times})`);
          return delay;
        },
        lazyConnect: false,
      });

      this.client.on('connect', () => {
        console.log(`[RateLimit:${this.serviceName}] Redis connected`);
        this.connected = true;
        this.lastError = null;
      });

      this.client.on('ready', () => {
        console.log(`[RateLimit:${this.serviceName}] Redis ready`);
        this.connected = true;
      });

      this.client.on('error', (err: Error) => {
        console.error(`[RateLimit:${this.serviceName}] Redis error:`, err.message);
        this.lastError = err.message;
        this.connected = false;
      });

      this.client.on('close', () => {
        console.log(`[RateLimit:${this.serviceName}] Redis connection closed`);
        this.connected = false;
      });

      this.client.on('end', () => {
        console.log(`[RateLimit:${this.serviceName}] Redis connection ended`);
        this.connected = false;
      });

    } catch (error) {
      const err = error as Error;
      console.error(`[RateLimit:${this.serviceName}] Failed to initialize Redis:`, err.message);
      this.lastError = err.message;
      this.client = null;
      this.connected = false;
    }
  }

  /**
   * Get full Redis key
   */
  private getKey(key: string): string {
    return `${this.keyPrefix}${this.serviceName}:${key}`;
  }

  /**
   * Increment the counter for a key using Lua script for atomicity
   */
  async increment(key: string): Promise<{ totalHits: number; resetTime: Date }> {
    if (!this.isConnected() || !this.client) {
      throw new Error('Redis not connected');
    }

    const fullKey = this.getKey(key);
    const now = Date.now();
    const ttlSeconds = Math.ceil(this.windowMs / 1000);

    // Lua script for atomic increment with TTL
    const luaScript = `
      local current = redis.call('INCR', KEYS[1])
      if current == 1 then
        redis.call('PEXPIRE', KEYS[1], ARGV[1])
      end
      local ttl = redis.call('PTTL', KEYS[1])
      return {current, ttl}
    `;

    try {
      const result = await this.client.eval(luaScript, 1, fullKey, this.windowMs.toString()) as [number, number];
      const [count, ttl] = result;

      const resetTime = ttl > 0 ? new Date(now + ttl) : new Date(now + this.windowMs);

      return {
        totalHits: count,
        resetTime,
      };
    } catch (error) {
      const err = error as Error;
      console.error(`[RateLimit:${this.serviceName}] Redis increment error:`, err.message);
      this.lastError = err.message;
      throw error;
    }
  }

  /**
   * Decrement the counter for a key
   */
  async decrement(key: string): Promise<void> {
    if (!this.isConnected() || !this.client) {
      return;
    }

    const fullKey = this.getKey(key);

    try {
      const current = await this.client.get(fullKey);
      if (current && parseInt(current, 10) > 0) {
        await this.client.decr(fullKey);
      }
    } catch (error) {
      const err = error as Error;
      console.error(`[RateLimit:${this.serviceName}] Redis decrement error:`, err.message);
    }
  }

  /**
   * Reset the counter for a key
   */
  async resetKey(key: string): Promise<void> {
    if (!this.isConnected() || !this.client) {
      return;
    }

    const fullKey = this.getKey(key);

    try {
      await this.client.del(fullKey);
    } catch (error) {
      const err = error as Error;
      console.error(`[RateLimit:${this.serviceName}] Redis reset error:`, err.message);
    }
  }

  /**
   * Check if Redis is connected
   */
  isConnected(): boolean {
    return this.connected && this.client !== null;
  }

  /**
   * Get last error message
   */
  getLastError(): string | null {
    return this.lastError;
  }

  /**
   * Get store statistics
   */
  async getStats(): Promise<{ keyCount: number; memoryUsage: string }> {
    if (!this.isConnected() || !this.client) {
      return { keyCount: 0, memoryUsage: 'N/A' };
    }

    try {
      const pattern = `${this.keyPrefix}${this.serviceName}:*`;
      const keys = await this.client.keys(pattern);
      const info = await this.client.info('memory');
      const memoryMatch = info.match(/used_memory_human:(\S+)/);

      return {
        keyCount: keys.length,
        memoryUsage: memoryMatch ? memoryMatch[1] : 'N/A',
      };
    } catch (error) {
      return { keyCount: 0, memoryUsage: 'N/A' };
    }
  }

  /**
   * Close the Redis connection
   */
  async close(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        console.log(`[RateLimit:${this.serviceName}] Redis connection closed gracefully`);
      } catch (error) {
        const err = error as Error;
        console.error(`[RateLimit:${this.serviceName}] Error closing Redis:`, err.message);
      }
      this.client = null;
      this.connected = false;
    }
  }
}
