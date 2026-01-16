import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private subscriber: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const config = {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      db: this.configService.get<number>('REDIS_DB', 0),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    };

    this.client = new Redis(config);
    this.subscriber = new Redis(config);

    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
    });

    this.client.on('error', (error) => {
      this.logger.error(`Redis client error: ${error.message}`);
    });

    this.subscriber.on('connect', () => {
      this.logger.log('Redis subscriber connected');
    });

    // Connect
    this.client.connect().catch((err) => {
      this.logger.error(`Failed to connect to Redis: ${err.message}`);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
    this.logger.log('Redis connections closed');
  }

  /**
   * Get the Redis client
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Get a value by key
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  /**
   * Set a value with optional TTL (in seconds)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);

    if (ttl) {
      await this.client.setex(key, ttl, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  /**
   * Delete a key
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Delete keys matching a pattern
   */
  async delPattern(pattern: string): Promise<number> {
    const keys = await this.client.keys(pattern);
    if (keys.length === 0) return 0;

    return this.client.del(...keys);
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * Set expiration on a key
   */
  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  /**
   * Get TTL of a key
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /**
   * Increment a counter
   */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * Decrement a counter
   */
  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  /**
   * Add to a set
   */
  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  /**
   * Get all members of a set
   */
  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  /**
   * Check if member exists in set
   */
  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  /**
   * Remove from a set
   */
  async srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  /**
   * Add to a sorted set
   */
  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.client.zadd(key, score, member);
  }

  /**
   * Get range from sorted set
   */
  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.zrange(key, start, stop);
  }

  /**
   * Get range with scores from sorted set
   */
  async zrangeWithScores(
    key: string,
    start: number,
    stop: number,
  ): Promise<{ member: string; score: number }[]> {
    const result = await this.client.zrange(key, start, stop, 'WITHSCORES');
    const items: { member: string; score: number }[] = [];

    for (let i = 0; i < result.length; i += 2) {
      items.push({
        member: result[i],
        score: parseFloat(result[i + 1]),
      });
    }

    return items;
  }

  /**
   * Set hash field
   */
  async hset(key: string, field: string, value: any): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.hset(key, field, serialized);
  }

  /**
   * Get hash field
   */
  async hget<T>(key: string, field: string): Promise<T | null> {
    const value = await this.client.hget(key, field);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  /**
   * Get all hash fields
   */
  async hgetall<T>(key: string): Promise<T | null> {
    const value = await this.client.hgetall(key);
    if (!value || Object.keys(value).length === 0) return null;

    return value as unknown as T;
  }

  /**
   * Delete hash field
   */
  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  /**
   * Publish a message to a channel
   */
  async publish(channel: string, message: any): Promise<number> {
    const serialized = typeof message === 'string' ? message : JSON.stringify(message);
    return this.client.publish(channel, serialized);
  }

  /**
   * Subscribe to a channel
   */
  async subscribe(
    channel: string,
    callback: (message: string, channel: string) => void,
  ): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', callback);
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  /**
   * Execute a pipeline
   */
  pipeline() {
    return this.client.pipeline();
  }

  /**
   * Execute a multi/transaction
   */
  multi() {
    return this.client.multi();
  }

  /**
   * Acquire a distributed lock
   */
  async acquireLock(
    key: string,
    ttl: number = 30,
    retries: number = 3,
    retryDelay: number = 100,
  ): Promise<string | null> {
    const lockKey = `lock:${key}`;
    const lockValue = `${Date.now()}-${Math.random()}`;

    for (let i = 0; i < retries; i++) {
      const result = await this.client.set(lockKey, lockValue, 'EX', ttl, 'NX');

      if (result === 'OK') {
        return lockValue;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    return null;
  }

  /**
   * Release a distributed lock
   */
  async releaseLock(key: string, lockValue: string): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await this.client.eval(script, 1, lockKey, lockValue);
    return result === 1;
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}
