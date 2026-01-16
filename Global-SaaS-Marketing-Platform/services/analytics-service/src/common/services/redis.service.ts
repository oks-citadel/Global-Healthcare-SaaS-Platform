import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD', ''),
      db: this.configService.get('REDIS_DB', 0),
      keyPrefix: 'analytics:',
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });
  }

  async onModuleInit() {
    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    return value ? JSON.parse(value) : null;
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async increment(key: string, by: number = 1): Promise<number> {
    return this.client.incrby(key, by);
  }

  async incrementFloat(key: string, by: number): Promise<string> {
    return this.client.incrbyfloat(key, by);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  // Hash operations for counters
  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    return this.client.hincrby(key, field, increment);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hmset(key: string, data: Record<string, string | number>): Promise<void> {
    await this.client.hmset(key, data);
  }

  // Sorted set operations for time-series data
  async zadd(
    key: string,
    score: number,
    member: string,
  ): Promise<number> {
    return this.client.zadd(key, score, member);
  }

  async zrangebyscore(
    key: string,
    min: number,
    max: number,
    withScores: boolean = false,
  ): Promise<string[]> {
    if (withScores) {
      return this.client.zrangebyscore(key, min, max, 'WITHSCORES');
    }
    return this.client.zrangebyscore(key, min, max);
  }

  async zremrangebyscore(
    key: string,
    min: number,
    max: number,
  ): Promise<number> {
    return this.client.zremrangebyscore(key, min, max);
  }

  // Set operations for unique counting
  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async scard(key: string): Promise<number> {
    return this.client.scard(key);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  // HyperLogLog for cardinality estimation
  async pfadd(key: string, ...elements: string[]): Promise<number> {
    return this.client.pfadd(key, ...elements);
  }

  async pfcount(...keys: string[]): Promise<number> {
    return this.client.pfcount(...keys);
  }

  // Pipeline for batch operations
  async pipeline(
    commands: Array<{ command: string; args: any[] }>,
  ): Promise<any[]> {
    const pipeline = this.client.pipeline();

    for (const { command, args } of commands) {
      (pipeline as any)[command](...args);
    }

    const results = await pipeline.exec();
    return results?.map(([err, result]) => {
      if (err) throw err;
      return result;
    }) || [];
  }

  // Real-time counter operations for analytics
  async incrementEventCounter(
    organizationId: string,
    eventType: string,
    date: string,
  ): Promise<number> {
    const key = `counters:${organizationId}:${eventType}:${date}`;
    const count = await this.increment(key);
    // Set expiry for 90 days if this is a new key
    if (count === 1) {
      await this.expire(key, 90 * 24 * 60 * 60);
    }
    return count;
  }

  async getEventCounters(
    organizationId: string,
    eventTypes: string[],
    startDate: string,
    endDate: string,
  ): Promise<Record<string, Record<string, number>>> {
    const result: Record<string, Record<string, number>> = {};
    const pipeline = this.client.pipeline();

    const keys: Array<{ eventType: string; date: string }> = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      for (const eventType of eventTypes) {
        const key = `counters:${organizationId}:${eventType}:${dateStr}`;
        pipeline.get(key);
        keys.push({ eventType, date: dateStr });
      }
    }

    const values = await pipeline.exec();

    keys.forEach(({ eventType, date }, index) => {
      if (!result[eventType]) {
        result[eventType] = {};
      }
      const value = values?.[index]?.[1];
      result[eventType][date] = parseInt(value as string) || 0;
    });

    return result;
  }

  async trackUniqueUser(
    organizationId: string,
    userId: string,
    date: string,
  ): Promise<boolean> {
    const key = `unique_users:${organizationId}:${date}`;
    const result = await this.sadd(key, userId);
    if (result === 1) {
      await this.expire(key, 90 * 24 * 60 * 60);
    }
    return result === 1;
  }

  async getUniqueUsersCount(
    organizationId: string,
    date: string,
  ): Promise<number> {
    const key = `unique_users:${organizationId}:${date}`;
    return this.scard(key);
  }
}
