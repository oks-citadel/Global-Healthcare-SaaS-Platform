/**
 * Redis Session Store
 * Production-ready Redis client for session management in the auth service
 */

import Redis, { Redis as RedisClient } from 'ioredis';
import { logger } from './logger.js';

/**
 * Redis configuration interface
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  maxRetriesPerRequest?: number;
  connectTimeout?: number;
  lazyConnect?: boolean;
  tls?: {
    rejectUnauthorized?: boolean;
  };
}

/**
 * Session data interface
 */
export interface SessionData {
  userId: string;
  email: string;
  role: string;
  lastActivity: number;
  createdAt: number;
  ipAddress: string;
  userAgent: string;
  requiresReauth?: boolean;
  mfaVerified?: boolean;
}

/**
 * Redis Session Store Class
 * Provides distributed session management with Redis backend
 */
export class RedisSessionStore {
  private client: RedisClient | null = null;
  private isConnected: boolean = false;
  private readonly keyPrefix: string;
  private readonly sessionTTL: number; // in seconds
  private readonly maxSessionsPerUser: number;

  constructor(config: Partial<RedisConfig> = {}) {
    this.keyPrefix = config.keyPrefix || 'auth:session:';
    this.sessionTTL = 15 * 60; // 15 minutes default (HIPAA compliant)
    this.maxSessionsPerUser = 3; // Max concurrent sessions per user

    this.initializeClient(config);
  }

  /**
   * Initialize Redis client with configuration
   */
  private initializeClient(config: Partial<RedisConfig>): void {
    const redisHost = config.host || process.env.REDIS_HOST || 'localhost';
    const redisPort = config.port || parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = config.password || process.env.REDIS_PASSWORD;
    const redisDb = config.db ?? parseInt(process.env.REDIS_DB || '0', 10);

    try {
      this.client = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        db: redisDb,
        maxRetriesPerRequest: config.maxRetriesPerRequest ?? 3,
        connectTimeout: config.connectTimeout ?? 5000,
        lazyConnect: config.lazyConnect ?? false,
        retryStrategy: (times: number) => {
          if (times > 5) {
            logger.error('Redis max reconnection attempts reached');
            return null; // Stop retrying
          }
          const delay = Math.min(times * 100, 3000);
          logger.warn(`Redis reconnecting in ${delay}ms (attempt ${times})`);
          return delay;
        },
        tls: config.tls,
      });

      this.setupEventHandlers();
    } catch (error) {
      logger.error('Failed to initialize Redis client', { error });
      this.client = null;
    }
  }

  /**
   * Setup Redis event handlers
   */
  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      logger.info('Redis session store connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis session store ready');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      logger.error('Redis session store error', { error: err.message });
      this.isConnected = false;
    });

    this.client.on('close', () => {
      logger.warn('Redis session store connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis session store reconnecting');
    });
  }

  /**
   * Build full session key
   */
  private buildKey(sessionId: string): string {
    return `${this.keyPrefix}${sessionId}`;
  }

  /**
   * Build user sessions index key
   */
  private buildUserSessionsKey(userId: string): string {
    return `${this.keyPrefix}user:${userId}:sessions`;
  }

  /**
   * Check if Redis is available
   */
  public isAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Create a new session
   */
  async createSession(
    sessionId: string,
    data: Omit<SessionData, 'createdAt' | 'lastActivity'>
  ): Promise<boolean> {
    if (!this.isAvailable() || !this.client) {
      logger.warn('Redis not available, session not stored');
      return false;
    }

    try {
      const sessionData: SessionData = {
        ...data,
        createdAt: Date.now(),
        lastActivity: Date.now(),
      };

      const sessionKey = this.buildKey(sessionId);
      const userSessionsKey = this.buildUserSessionsKey(data.userId);

      // Check concurrent sessions limit
      const existingSessions = await this.client.smembers(userSessionsKey);
      if (existingSessions.length >= this.maxSessionsPerUser) {
        // Remove oldest session
        const oldestSession = existingSessions[0];
        await this.deleteSession(oldestSession);
        logger.info('Removed oldest session due to concurrent limit', {
          userId: data.userId,
          removedSessionId: oldestSession,
        });
      }

      // Store session data
      await this.client.setex(
        sessionKey,
        this.sessionTTL,
        JSON.stringify(sessionData)
      );

      // Add to user's session index
      await this.client.sadd(userSessionsKey, sessionId);
      await this.client.expire(userSessionsKey, this.sessionTTL * 2); // Keep index longer

      logger.info('Session created', {
        sessionId: sessionId.substring(0, 8) + '...',
        userId: data.userId,
      });

      return true;
    } catch (error) {
      logger.error('Error creating session', { error, sessionId });
      return false;
    }
  }

  /**
   * Get session data
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    if (!this.isAvailable() || !this.client) {
      return null;
    }

    try {
      const sessionKey = this.buildKey(sessionId);
      const data = await this.client.get(sessionKey);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as SessionData;
    } catch (error) {
      logger.error('Error getting session', { error, sessionId });
      return null;
    }
  }

  /**
   * Update session activity (extends TTL)
   */
  async updateActivity(sessionId: string): Promise<boolean> {
    if (!this.isAvailable() || !this.client) {
      return false;
    }

    try {
      const sessionKey = this.buildKey(sessionId);
      const data = await this.client.get(sessionKey);

      if (!data) {
        return false;
      }

      const sessionData = JSON.parse(data) as SessionData;
      sessionData.lastActivity = Date.now();
      sessionData.requiresReauth = false;

      await this.client.setex(
        sessionKey,
        this.sessionTTL,
        JSON.stringify(sessionData)
      );

      return true;
    } catch (error) {
      logger.error('Error updating session activity', { error, sessionId });
      return false;
    }
  }

  /**
   * Mark session as requiring re-authentication
   */
  async markRequiresReauth(sessionId: string): Promise<boolean> {
    if (!this.isAvailable() || !this.client) {
      return false;
    }

    try {
      const sessionKey = this.buildKey(sessionId);
      const data = await this.client.get(sessionKey);

      if (!data) {
        return false;
      }

      const sessionData = JSON.parse(data) as SessionData;
      sessionData.requiresReauth = true;

      const ttl = await this.client.ttl(sessionKey);
      if (ttl > 0) {
        await this.client.setex(sessionKey, ttl, JSON.stringify(sessionData));
      }

      return true;
    } catch (error) {
      logger.error('Error marking session for reauth', { error, sessionId });
      return false;
    }
  }

  /**
   * Mark session as MFA verified
   */
  async markMfaVerified(sessionId: string): Promise<boolean> {
    if (!this.isAvailable() || !this.client) {
      return false;
    }

    try {
      const sessionKey = this.buildKey(sessionId);
      const data = await this.client.get(sessionKey);

      if (!data) {
        return false;
      }

      const sessionData = JSON.parse(data) as SessionData;
      sessionData.mfaVerified = true;
      sessionData.lastActivity = Date.now();

      await this.client.setex(
        sessionKey,
        this.sessionTTL,
        JSON.stringify(sessionData)
      );

      return true;
    } catch (error) {
      logger.error('Error marking MFA verified', { error, sessionId });
      return false;
    }
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    if (!this.isAvailable() || !this.client) {
      return false;
    }

    try {
      const sessionKey = this.buildKey(sessionId);

      // Get session to find userId
      const data = await this.client.get(sessionKey);
      if (data) {
        const sessionData = JSON.parse(data) as SessionData;
        const userSessionsKey = this.buildUserSessionsKey(sessionData.userId);
        await this.client.srem(userSessionsKey, sessionId);
      }

      await this.client.del(sessionKey);

      logger.info('Session deleted', {
        sessionId: sessionId.substring(0, 8) + '...',
      });

      return true;
    } catch (error) {
      logger.error('Error deleting session', { error, sessionId });
      return false;
    }
  }

  /**
   * Delete all sessions for a user
   */
  async deleteAllUserSessions(userId: string): Promise<number> {
    if (!this.isAvailable() || !this.client) {
      return 0;
    }

    try {
      const userSessionsKey = this.buildUserSessionsKey(userId);
      const sessionIds = await this.client.smembers(userSessionsKey);

      let deletedCount = 0;
      for (const sessionId of sessionIds) {
        const sessionKey = this.buildKey(sessionId);
        await this.client.del(sessionKey);
        deletedCount++;
      }

      await this.client.del(userSessionsKey);

      logger.info('All user sessions deleted', { userId, count: deletedCount });

      return deletedCount;
    } catch (error) {
      logger.error('Error deleting all user sessions', { error, userId });
      return 0;
    }
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<string[]> {
    if (!this.isAvailable() || !this.client) {
      return [];
    }

    try {
      const userSessionsKey = this.buildUserSessionsKey(userId);
      return await this.client.smembers(userSessionsKey);
    } catch (error) {
      logger.error('Error getting user sessions', { error, userId });
      return [];
    }
  }

  /**
   * Count active sessions for a user
   */
  async countUserSessions(userId: string): Promise<number> {
    if (!this.isAvailable() || !this.client) {
      return 0;
    }

    try {
      const userSessionsKey = this.buildUserSessionsKey(userId);
      return await this.client.scard(userSessionsKey);
    } catch (error) {
      logger.error('Error counting user sessions', { error, userId });
      return 0;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      await this.client.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed', { error });
      return false;
    }
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<{
    connected: boolean;
    keyCount: number;
    memoryUsed: string;
  }> {
    if (!this.isAvailable() || !this.client) {
      return { connected: false, keyCount: 0, memoryUsed: 'N/A' };
    }

    try {
      const keys = await this.client.keys(`${this.keyPrefix}*`);
      const info = await this.client.info('memory');
      const memoryMatch = info.match(/used_memory_human:(\S+)/);

      return {
        connected: true,
        keyCount: keys.length,
        memoryUsed: memoryMatch ? memoryMatch[1] : 'N/A',
      };
    } catch (error) {
      logger.error('Error getting Redis stats', { error });
      return { connected: this.isConnected, keyCount: 0, memoryUsed: 'N/A' };
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        logger.info('Redis session store disconnected');
      } catch (error) {
        logger.error('Error disconnecting Redis session store', { error });
      }
      this.client = null;
      this.isConnected = false;
    }
  }
}

// Singleton instance
let sessionStoreInstance: RedisSessionStore | null = null;

/**
 * Initialize Redis session store
 */
export function initializeSessionStore(config?: Partial<RedisConfig>): RedisSessionStore {
  if (!sessionStoreInstance) {
    sessionStoreInstance = new RedisSessionStore(config);
  }
  return sessionStoreInstance;
}

/**
 * Get session store instance
 */
export function getSessionStore(): RedisSessionStore | null {
  return sessionStoreInstance;
}

/**
 * Check if session store is available
 */
export function isSessionStoreAvailable(): boolean {
  return sessionStoreInstance?.isAvailable() ?? false;
}

export default RedisSessionStore;
