import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Rate limit endpoint types with different limits
 */
export type RateLimitEndpointType =
  | 'general'      // General API: 100 req/min
  | 'auth'         // Authentication: 10 req/min
  | 'upload'       // File uploads: 20 req/min
  | 'search';      // Search/query: 60 req/min

/**
 * Rate limit configuration for a specific endpoint type
 */
export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum number of requests in the window */
  max: number;
  /** Custom error message */
  message?: string;
  /** Skip successful requests (useful for auth) */
  skipSuccessfulRequests?: boolean;
  /** Skip failed requests */
  skipFailedRequests?: boolean;
  /** Duration to block after exceeding limit (ms) */
  blockDuration?: number;
}

/**
 * Rate limit configurations for all endpoint types
 */
export interface RateLimitConfigs {
  general: RateLimitConfig;
  auth: RateLimitConfig;
  upload: RateLimitConfig;
  search: RateLimitConfig;
  [key: string]: RateLimitConfig;
}

/**
 * Redis connection options
 */
export interface RedisConnectionOptions {
  /** Redis host */
  host?: string;
  /** Redis port */
  port?: number;
  /** Redis password */
  password?: string;
  /** Redis URL (overrides host/port) */
  url?: string;
  /** Connection timeout in ms */
  connectTimeout?: number;
  /** Max retry attempts */
  maxRetries?: number;
  /** Key prefix for rate limit entries */
  keyPrefix?: string;
}

/**
 * Rate limiter options
 */
export interface RateLimiterOptions {
  /** Service name for logging and Redis key prefixes */
  serviceName: string;
  /** Redis connection options (if not provided, uses in-memory store) */
  redis?: RedisConnectionOptions;
  /** Custom rate limit configurations (overrides defaults) */
  configs?: Partial<RateLimitConfigs>;
  /** Skip rate limiting for specific paths */
  skipPaths?: string[];
  /** Custom key generator function */
  keyGenerator?: (req: Request) => string;
  /** Enable verbose logging */
  verbose?: boolean;
  /** Custom handler for rate limit exceeded */
  onLimitReached?: (req: Request, res: Response, options: RateLimitInfo) => void;
}

/**
 * Rate limit info passed to handlers
 */
export interface RateLimitInfo {
  /** Rate limit type */
  type: RateLimitEndpointType;
  /** Maximum requests allowed */
  limit: number;
  /** Current request count */
  current: number;
  /** Remaining requests */
  remaining: number;
  /** Reset time (Unix timestamp) */
  resetTime: Date;
}

/**
 * Rate limit store interface
 */
export interface RateLimitStore {
  /** Increment the counter for a key */
  increment(key: string): Promise<{ totalHits: number; resetTime: Date }>;
  /** Decrement the counter for a key */
  decrement(key: string): Promise<void>;
  /** Reset the counter for a key */
  resetKey(key: string): Promise<void>;
  /** Check if store is connected/available */
  isConnected(): boolean;
  /** Close the store connection */
  close(): Promise<void>;
}

/**
 * Rate limit middleware factory result
 */
export interface RateLimiterMiddleware {
  /** General API rate limiter (100 req/min) */
  general: RequestHandler;
  /** Authentication rate limiter (10 req/min) */
  auth: RequestHandler;
  /** File upload rate limiter (20 req/min) */
  upload: RequestHandler;
  /** Search/query rate limiter (60 req/min) */
  search: RequestHandler;
  /** Get rate limiter for custom type */
  forType: (type: RateLimitEndpointType) => RequestHandler;
  /** Get store status */
  getStatus: () => RateLimitStatus;
  /** Close Redis connection */
  close: () => Promise<void>;
}

/**
 * Rate limit status
 */
export interface RateLimitStatus {
  /** Whether Redis is connected */
  redisConnected: boolean;
  /** Current store type */
  storeType: 'redis' | 'memory';
  /** Service name */
  serviceName: string;
  /** Last error if any */
  lastError?: string;
}

/**
 * Environment variable configuration
 */
export interface RateLimitEnvConfig {
  /** Enable Redis store */
  RATE_LIMIT_REDIS_ENABLED: boolean;
  /** Redis host */
  REDIS_HOST: string;
  /** Redis port */
  REDIS_PORT: number;
  /** Redis password */
  REDIS_PASSWORD?: string;
  /** Redis URL (overrides host/port) */
  REDIS_URL?: string;
  /** General rate limit max requests */
  RATE_LIMIT_GENERAL_MAX: number;
  /** General rate limit window (ms) */
  RATE_LIMIT_GENERAL_WINDOW_MS: number;
  /** Auth rate limit max requests */
  RATE_LIMIT_AUTH_MAX: number;
  /** Auth rate limit window (ms) */
  RATE_LIMIT_AUTH_WINDOW_MS: number;
  /** Upload rate limit max requests */
  RATE_LIMIT_UPLOAD_MAX: number;
  /** Upload rate limit window (ms) */
  RATE_LIMIT_UPLOAD_WINDOW_MS: number;
  /** Search rate limit max requests */
  RATE_LIMIT_SEARCH_MAX: number;
  /** Search rate limit window (ms) */
  RATE_LIMIT_SEARCH_WINDOW_MS: number;
}
