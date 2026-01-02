/**
 * WebSocket Presence Tracking
 *
 * Manages online/offline status and custom user presence
 *
 * @module websocket-presence
 */

import Redis from 'ioredis';
import { AuthenticatedSocket } from './websocket.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { emitToUser } from './websocket.js';

/**
 * User presence status
 */
export enum PresenceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  IN_CALL = 'in_call',
}

/**
 * User presence data
 */
interface UserPresence {
  userId: string;
  status: PresenceStatus;
  lastSeen: Date;
  socketIds: string[];
  customStatus?: string;
  metadata?: {
    inCall?: boolean;
    callId?: string;
    [key: string]: any;
  };
}

/**
 * Get presence request
 */
interface GetPresenceData {
  userIds: string[];
}

/**
 * Set status request
 */
interface SetStatusData {
  status: PresenceStatus;
  customStatus?: string;
}

/**
 * Subscribe to presence updates
 */
interface SubscribePresenceData {
  userIds: string[];
}

/**
 * Presence manager class
 */
class PresenceManager {
  private redis: Redis | null = null;
  private readonly PRESENCE_TTL = 300; // 5 minutes
  private readonly PRESENCE_KEY_PREFIX = 'presence:';
  private presenceSubscriptions = new Map<string, Set<string>>(); // userId -> Set of subscriberIds

  constructor() {
    this.initializeRedis();
  }

  /**
   * Initialize Redis connection for presence tracking
   */
  private initializeRedis(): void {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, {
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
        });

        this.redis.on('error', (error) => {
          logger.error('Presence Redis error', { error });
        });

        this.redis.on('ready', () => {
          logger.info('Presence Redis connected');
        });
      } catch (error) {
        logger.error('Failed to initialize presence Redis', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  /**
   * Set user as online
   */
  async setUserOnline(userId: string, socketId: string): Promise<void> {
    try {
      const key = this.getPresenceKey(userId);
      const presence = await this.getPresence(userId);

      const updatedPresence: UserPresence = {
        userId,
        status: PresenceStatus.ONLINE,
        lastSeen: new Date(),
        socketIds: presence ? [...presence.socketIds, socketId] : [socketId],
        customStatus: presence?.customStatus,
        metadata: presence?.metadata,
      };

      // Store in Redis with TTL
      if (this.redis) {
        await this.redis.setex(
          key,
          this.PRESENCE_TTL,
          JSON.stringify(updatedPresence)
        );
      }

      // Notify subscribers
      await this.notifyPresenceChange(userId, updatedPresence);

      logger.info('User set to online', {
        userId,
        socketId,
        totalSockets: updatedPresence.socketIds.length,
      });
    } catch (error) {
      logger.error('Error setting user online', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        socketId,
      });
    }
  }

  /**
   * Set user as offline
   */
  async setUserOffline(userId: string, socketId: string): Promise<void> {
    try {
      const key = this.getPresenceKey(userId);
      const presence = await this.getPresence(userId);

      if (!presence) {
        return;
      }

      // Remove this socket from the list
      const updatedSocketIds = presence.socketIds.filter((id) => id !== socketId);

      if (updatedSocketIds.length === 0) {
        // No more connections, set user as offline
        const updatedPresence: UserPresence = {
          userId,
          status: PresenceStatus.OFFLINE,
          lastSeen: new Date(),
          socketIds: [],
          customStatus: presence.customStatus,
          metadata: presence.metadata,
        };

        if (this.redis) {
          await this.redis.setex(
            key,
            this.PRESENCE_TTL,
            JSON.stringify(updatedPresence)
          );
        }

        // Notify subscribers
        await this.notifyPresenceChange(userId, updatedPresence);

        logger.info('User set to offline', { userId, socketId });
      } else {
        // Still has other connections, update socket list
        const updatedPresence: UserPresence = {
          ...presence,
          socketIds: updatedSocketIds,
          lastSeen: new Date(),
        };

        if (this.redis) {
          await this.redis.setex(
            key,
            this.PRESENCE_TTL,
            JSON.stringify(updatedPresence)
          );
        }

        logger.info('Socket disconnected but user still online', {
          userId,
          socketId,
          remainingSockets: updatedSocketIds.length,
        });
      }
    } catch (error) {
      logger.error('Error setting user offline', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        socketId,
      });
    }
  }

  /**
   * Get user presence
   */
  async getPresence(userId: string): Promise<UserPresence | null> {
    try {
      if (!this.redis) {
        return null;
      }

      const key = this.getPresenceKey(userId);
      const data = await this.redis.get(key);

      if (!data) {
        return null;
      }

      const presence = JSON.parse(data) as UserPresence;
      presence.lastSeen = new Date(presence.lastSeen);

      return presence;
    } catch (error) {
      logger.error('Error getting presence', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return null;
    }
  }

  /**
   * Get multiple user presences
   */
  async getMultiplePresences(userIds: string[]): Promise<Map<string, UserPresence>> {
    const presences = new Map<string, UserPresence>();

    try {
      if (!this.redis || userIds.length === 0) {
        return presences;
      }

      const keys = userIds.map((id) => this.getPresenceKey(id));
      const values = await this.redis.mget(...keys);

      values.forEach((value, index) => {
        if (value) {
          try {
            const presence = JSON.parse(value) as UserPresence;
            presence.lastSeen = new Date(presence.lastSeen);
            presences.set(userIds[index], presence);
          } catch (error) {
            logger.error('Error parsing presence data', { userId: userIds[index] });
          }
        }
      });
    } catch (error) {
      logger.error('Error getting multiple presences', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return presences;
  }

  /**
   * Update user status
   */
  async updateStatus(
    userId: string,
    status: PresenceStatus,
    customStatus?: string
  ): Promise<void> {
    try {
      const presence = await this.getPresence(userId);

      if (!presence) {
        logger.warn('Cannot update status for offline user', { userId });
        return;
      }

      const updatedPresence: UserPresence = {
        ...presence,
        status,
        customStatus,
        lastSeen: new Date(),
      };

      const key = this.getPresenceKey(userId);

      if (this.redis) {
        await this.redis.setex(
          key,
          this.PRESENCE_TTL,
          JSON.stringify(updatedPresence)
        );
      }

      // Notify subscribers
      await this.notifyPresenceChange(userId, updatedPresence);

      logger.info('User status updated', { userId, status, customStatus });
    } catch (error) {
      logger.error('Error updating user status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }

  /**
   * Handle get presence request
   */
  async handleGetPresence(
    socket: AuthenticatedSocket,
    data: GetPresenceData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userIds } = data;

      const presences = await this.getMultiplePresences(userIds);

      const result = Array.from(presences.entries()).map(([userId, presence]) => ({
        userId,
        status: presence.status,
        lastSeen: presence.lastSeen,
        customStatus: presence.customStatus,
        isOnline: presence.status !== PresenceStatus.OFFLINE,
      }));

      logger.debug('Presence data retrieved', {
        requestedCount: userIds.length,
        foundCount: result.length,
      });

      callback?.({
        success: true,
        presences: result,
      });
    } catch (error) {
      logger.error('Error handling get presence', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });

      callback?.({
        success: false,
        error: 'Failed to get presence data',
      });
    }
  }

  /**
   * Handle set status request
   */
  async handleSetStatus(socket: AuthenticatedSocket, data: SetStatusData): Promise<void> {
    try {
      const { userId } = socket;
      const { status, customStatus } = data;

      await this.updateStatus(userId, status, customStatus);

      socket.emit('presence:statusUpdated', {
        userId,
        status,
        customStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error handling set status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle subscribe to presence updates
   */
  async handleSubscribe(
    socket: AuthenticatedSocket,
    data: SubscribePresenceData
  ): Promise<void> {
    try {
      const { userId } = socket;
      const { userIds } = data;

      userIds.forEach((targetUserId) => {
        let subscribers = this.presenceSubscriptions.get(targetUserId);
        if (!subscribers) {
          subscribers = new Set();
          this.presenceSubscriptions.set(targetUserId, subscribers);
        }
        subscribers.add(userId);
      });

      logger.debug('User subscribed to presence updates', {
        subscriberId: userId,
        targetUserCount: userIds.length,
      });

      // Send initial presence data
      const presences = await this.getMultiplePresences(userIds);
      const result = Array.from(presences.entries()).map(([userId, presence]) => ({
        userId,
        status: presence.status,
        lastSeen: presence.lastSeen,
        customStatus: presence.customStatus,
      }));

      socket.emit('presence:initial', {
        presences: result,
      });
    } catch (error) {
      logger.error('Error handling presence subscribe', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Notify subscribers of presence change
   */
  private async notifyPresenceChange(
    userId: string,
    presence: UserPresence
  ): Promise<void> {
    try {
      const subscribers = this.presenceSubscriptions.get(userId);
      if (!subscribers || subscribers.size === 0) {
        return;
      }

      const notification = {
        userId,
        status: presence.status,
        lastSeen: presence.lastSeen,
        customStatus: presence.customStatus,
        timestamp: new Date().toISOString(),
      };

      // Notify each subscriber
      subscribers.forEach((subscriberId) => {
        emitToUser(subscriberId, 'presence:changed', notification);
      });

      logger.debug('Presence change notified', {
        userId,
        status: presence.status,
        subscriberCount: subscribers.size,
      });
    } catch (error) {
      logger.error('Error notifying presence change', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }

  /**
   * Clean up presence subscriptions on disconnect
   */
  cleanupSubscriptions(userId: string): void {
    // Remove user from all subscription sets
    this.presenceSubscriptions.forEach((subscribers) => {
      subscribers.delete(userId);
    });

    // Remove empty subscription sets
    const emptyKeys: string[] = [];
    this.presenceSubscriptions.forEach((subscribers, key) => {
      if (subscribers.size === 0) {
        emptyKeys.push(key);
      }
    });

    emptyKeys.forEach((key) => {
      this.presenceSubscriptions.delete(key);
    });
  }

  /**
   * Refresh user presence TTL (keep-alive)
   */
  async refreshPresence(userId: string): Promise<void> {
    try {
      const presence = await this.getPresence(userId);
      if (presence && presence.status !== PresenceStatus.OFFLINE) {
        const key = this.getPresenceKey(userId);
        if (this.redis) {
          await this.redis.expire(key, this.PRESENCE_TTL);
        }
      }
    } catch (error) {
      logger.error('Error refreshing presence', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }

  /**
   * Get presence key for Redis
   */
  private getPresenceKey(userId: string): string {
    return `${this.PRESENCE_KEY_PREFIX}${userId}`;
  }

  /**
   * Get presence statistics
   */
  async getStats(): Promise<{
    onlineUsers: number;
    totalSubscriptions: number;
  }> {
    let onlineUsers = 0;

    if (this.redis) {
      const keys = await this.redis.keys(`${this.PRESENCE_KEY_PREFIX}*`);
      const values = await this.redis.mget(...keys);

      values.forEach((value) => {
        if (value) {
          try {
            const presence = JSON.parse(value) as UserPresence;
            if (presence.status !== PresenceStatus.OFFLINE) {
              onlineUsers++;
            }
          } catch (error) {
            // Skip invalid entries
          }
        }
      });
    }

    return {
      onlineUsers,
      totalSubscriptions: this.presenceSubscriptions.size,
    };
  }
}

// Export singleton instance
export const presenceManager = new PresenceManager();
