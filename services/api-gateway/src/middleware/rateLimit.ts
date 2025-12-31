import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { RequestHandler } from 'express';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Store for rate limiting
class RedisStore {
  private client: Redis;
  private prefix: string;

  constructor(client: Redis, prefix = 'rl:') {
    this.client = client;
    this.prefix = prefix;
  }

  async increment(key: string): Promise<{ totalHits: number; resetTime: Date }> {
    const prefixedKey = this.prefix + key;
    const ttl = 60 * 1000; // 1 minute

    const current = await this.client.incr(prefixedKey);

    if (current === 1) {
      await this.client.pexpire(prefixedKey, ttl);
    }

    const pttl = await this.client.pttl(prefixedKey);
    const resetTime = new Date(Date.now() + pttl);

    return { totalHits: current, resetTime };
  }

  async decrement(key: string): Promise<void> {
    const prefixedKey = this.prefix + key;
    await this.client.decr(prefixedKey);
  }

  async resetKey(key: string): Promise<void> {
    const prefixedKey = this.prefix + key;
    await this.client.del(prefixedKey);
  }
}

// General rate limiter - 100 requests per minute
export const generalLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
}) as unknown as RequestHandler;

// Strict limiter for authentication endpoints - 5 requests per minute
export const authLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    error: 'Too Many Requests',
    message: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;

// API limiter with Redis store for distributed systems
export const apiLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: async (req) => {
    // Different limits based on user role
    const user = (req as any).user;
    if (user?.role === 'admin') return 1000;
    if (user?.role === 'provider') return 500;
    return 100; // patient or unauthenticated
  },
  message: {
    error: 'Too Many Requests',
    message: 'API rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
}) as unknown as RequestHandler;

export { redisClient };
