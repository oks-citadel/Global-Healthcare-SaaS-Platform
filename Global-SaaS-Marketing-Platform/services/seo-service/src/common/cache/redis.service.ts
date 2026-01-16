import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfig } from '../../config/configuration';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private readonly config: RedisConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<RedisConfig>('redis')!;
  }

  async onModuleInit() {
    this.logger.log('Connecting to Redis...');

    this.client = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: this.config.db,
      keyPrefix: this.config.keyPrefix,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 attempts');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Successfully connected to Redis');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error', err);
    });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from Redis...');
    await this.client.quit();
    this.logger.log('Disconnected from Redis');
  }

  getClient(): Redis {
    return this.client;
  }

  // ==========================================
  // BASIC OPERATIONS
  // ==========================================

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  // ==========================================
  // SITEMAP CACHING
  // ==========================================

  async getSitemap(tenantId: string, locale?: string, type?: string): Promise<string | null> {
    const key = this.buildSitemapKey(tenantId, locale, type);
    return this.client.get(key);
  }

  async setSitemap(
    tenantId: string,
    xml: string,
    locale?: string,
    type?: string,
    etag?: string,
  ): Promise<void> {
    const key = this.buildSitemapKey(tenantId, locale, type);
    const ttl = this.config.ttl.sitemap;

    const pipeline = this.client.pipeline();
    pipeline.setex(key, ttl, xml);

    if (etag) {
      pipeline.setex(`${key}:etag`, ttl, etag);
    }

    await pipeline.exec();
  }

  async getSitemapEtag(tenantId: string, locale?: string, type?: string): Promise<string | null> {
    const key = `${this.buildSitemapKey(tenantId, locale, type)}:etag`;
    return this.client.get(key);
  }

  async invalidateSitemap(tenantId: string, locale?: string, type?: string): Promise<void> {
    const key = this.buildSitemapKey(tenantId, locale, type);
    await this.client.del(key, `${key}:etag`);
  }

  async invalidateAllSitemaps(tenantId: string): Promise<void> {
    const pattern = `sitemap:${tenantId}:*`;
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  private buildSitemapKey(tenantId: string, locale?: string, type?: string): string {
    const parts = ['sitemap', tenantId];
    if (locale) parts.push(locale);
    if (type) parts.push(type);
    return parts.join(':');
  }

  // ==========================================
  // ROBOTS.TXT CACHING
  // ==========================================

  async getRobots(tenantId: string): Promise<string | null> {
    return this.client.get(`robots:${tenantId}`);
  }

  async setRobots(tenantId: string, content: string): Promise<void> {
    await this.client.setex(`robots:${tenantId}`, this.config.ttl.robots, content);
  }

  async invalidateRobots(tenantId: string): Promise<void> {
    await this.client.del(`robots:${tenantId}`);
  }

  // ==========================================
  // MANIFEST CACHING
  // ==========================================

  async getManifest(tenantId: string): Promise<string | null> {
    return this.client.get(`manifest:${tenantId}`);
  }

  async setManifest(tenantId: string, content: string): Promise<void> {
    await this.client.setex(`manifest:${tenantId}`, this.config.ttl.manifest, content);
  }

  async invalidateManifest(tenantId: string): Promise<void> {
    await this.client.del(`manifest:${tenantId}`);
  }

  // ==========================================
  // PAGE SEO CACHING
  // ==========================================

  async getPageSeo<T>(slug: string, locale?: string): Promise<T | null> {
    const key = locale ? `page:${slug}:${locale}` : `page:${slug}`;
    return this.get<T>(key);
  }

  async setPageSeo(slug: string, data: any, locale?: string): Promise<void> {
    const key = locale ? `page:${slug}:${locale}` : `page:${slug}`;
    await this.set(key, data, this.config.ttl.pageSeo);
  }

  async invalidatePageSeo(slug: string, locale?: string): Promise<void> {
    if (locale) {
      await this.del(`page:${slug}:${locale}`);
    } else {
      // Invalidate all locales
      const pattern = `page:${slug}:*`;
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      await this.del(`page:${slug}`);
    }
  }

  // ==========================================
  // WEB VITALS CACHING
  // ==========================================

  async getWebVitals<T>(url: string, deviceType?: string): Promise<T | null> {
    const key = deviceType ? `vitals:${url}:${deviceType}` : `vitals:${url}`;
    return this.get<T>(key);
  }

  async setWebVitals(url: string, data: any, deviceType?: string): Promise<void> {
    const key = deviceType ? `vitals:${url}:${deviceType}` : `vitals:${url}`;
    await this.set(key, data, this.config.ttl.webVitals);
  }

  // ==========================================
  // HEALTH CHECK
  // ==========================================

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return false;
    }
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const values = await this.client.mget(keys);
    return values.map((v) => {
      if (!v) return null;
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as unknown as T;
      }
    });
  }

  async mset(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    const pipeline = this.client.pipeline();
    for (const entry of entries) {
      const serialized = typeof entry.value === 'string' ? entry.value : JSON.stringify(entry.value);
      if (entry.ttl) {
        pipeline.setex(entry.key, entry.ttl, serialized);
      } else {
        pipeline.set(entry.key, serialized);
      }
    }
    await pipeline.exec();
  }

  // ==========================================
  // PATTERN OPERATIONS
  // ==========================================

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async deleteByPattern(pattern: string): Promise<number> {
    const keys = await this.client.keys(pattern);
    if (keys.length === 0) return 0;
    return this.client.del(...keys);
  }

  async flushDb(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('flushDb can only be used in test environment');
    }
    await this.client.flushdb();
  }
}
