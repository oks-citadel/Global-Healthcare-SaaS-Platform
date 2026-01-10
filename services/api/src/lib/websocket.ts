// @ts-nocheck
/**
 * WebSocket/Socket.io Server Implementation
 *
 * Complete real-time messaging infrastructure for the healthcare platform
 * Features:
 * - JWT Authentication middleware
 * - Room management for patient-provider chats and telemedicine
 * - Event handlers for messaging, calls, and notifications
 * - Redis adapter for horizontal scaling
 * - Presence tracking (online/offline status)
 * - Message persistence to database
 * - Reconnection handling
 * - Connection health monitoring
 *
 * @module websocket
 */

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { prisma } from './prisma.js';
import { roomManager } from './websocket-room-manager.js';
import { presenceManager } from './websocket-presence.js';
import { messageHandler } from './websocket-message-handler.js';
import { callHandler } from './websocket-call-handler.js';
import { notificationHandler } from './websocket-notification-handler.js';

/**
 * Extended Socket interface with authenticated user info
 */
export interface AuthenticatedSocket extends Socket {
  userId: string;
  userRole: string;
  email?: string;
  reconnectAttempts?: number;
}

/**
 * JWT Token payload structure
 */
interface SocketAuthToken {
  userId: string;
  role: string;
  email?: string;
  iat?: number;
  exp?: number;
}

/**
 * Connection metadata for tracking
 */
interface ConnectionMetadata {
  socketId: string;
  userId: string;
  userRole: string;
  connectedAt: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Main WebSocket server instance
 */
let io: Server | null = null;

/**
 * Redis clients for Socket.io adapter (pub/sub)
 */
let redisPubClient: Redis | null = null;
let redisSubClient: Redis | null = null;

/**
 * Connection tracking
 */
const activeConnections = new Map<string, ConnectionMetadata>();

/**
 * Initialize Socket.io server with Redis adapter for horizontal scaling
 *
 * @param httpServer - HTTP server instance
 * @param useRedisAdapter - Enable Redis adapter for multi-server support
 * @returns Socket.io Server instance
 */
export async function initializeWebSocket(
  httpServer: HttpServer,
  useRedisAdapter: boolean = true
): Promise<Server> {
  // Initialize Socket.io server
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.origins,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
    maxHttpBufferSize: 1e6, // 1MB max message size
    allowEIO3: true, // Support Socket.io v3 clients
  });

  // Setup Redis adapter for horizontal scaling
  if (useRedisAdapter && process.env.REDIS_URL) {
    try {
      await setupRedisAdapter();
      logger.info('Redis adapter enabled for Socket.io horizontal scaling');
    } catch (error) {
      logger.error('Failed to setup Redis adapter', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      logger.warn('Running Socket.io without Redis adapter - single server mode');
    }
  }

  // Setup authentication middleware
  setupAuthenticationMiddleware();

  // Setup connection handlers
  setupConnectionHandlers();

  // Setup health monitoring
  setupHealthMonitoring();

  logger.info('WebSocket server initialized successfully');
  return io;
}

/**
 * Setup Redis adapter for Socket.io horizontal scaling
 */
async function setupRedisAdapter(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('Redis configuration not found');
  }

  // Create Redis clients for pub/sub using REDIS_URL for TLS support
  const redisOptions = {
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    // Enable TLS with proper certificate verification for security
    tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: true } : undefined,
  };

  redisPubClient = new Redis(redisUrl, redisOptions);
  redisSubClient = new Redis(redisUrl, redisOptions);

  // Wait for Redis connections
  await Promise.all([
    new Promise<void>((resolve, reject) => {
      redisPubClient!.once('ready', resolve);
      redisPubClient!.once('error', reject);
    }),
    new Promise<void>((resolve, reject) => {
      redisSubClient!.once('ready', resolve);
      redisSubClient!.once('error', reject);
    }),
  ]);

  // Attach Redis adapter to Socket.io
  if (io) {
    io.adapter(createAdapter(redisPubClient, redisSubClient));
  }

  logger.info('Redis adapter configured successfully');
}

/**
 * Setup JWT authentication middleware for socket connections
 */
function setupAuthenticationMiddleware(): void {
  if (!io) return;

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // Extract token from auth object or headers
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        logger.warn('Socket connection attempt without token', {
          socketId: socket.id,
          remoteAddress: socket.handshake.address,
        });
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, config.jwt.secret) as SocketAuthToken;

      // Attach user info to socket
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.email = decoded.email;
      socket.reconnectAttempts = 0;

      logger.info('Socket authenticated successfully', {
        socketId: socket.id,
        userId: decoded.userId,
        role: decoded.role,
      });

      next();
    } catch (error) {
      logger.error('Socket authentication failed', {
        socketId: socket.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof jwt.JsonWebTokenError) {
        return next(new Error('Authentication error: Invalid token'));
      } else if (error instanceof jwt.TokenExpiredError) {
        return next(new Error('Authentication error: Token expired'));
      }

      next(new Error('Authentication error: Token verification failed'));
    }
  });
}

/**
 * Setup main connection event handlers
 */
function setupConnectionHandlers(): void {
  if (!io) return;

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const { userId, userRole } = socket;

    logger.info('Client connected', {
      socketId: socket.id,
      userId,
      userRole,
      transport: socket.conn.transport.name,
    });

    // Track connection
    trackConnection(socket);

    // Join user's personal room for direct messages
    socket.join(`user:${userId}`);

    // Update presence to online
    await presenceManager.setUserOnline(userId, socket.id);

    // Emit connection success to client
    socket.emit('connected', {
      socketId: socket.id,
      userId,
      timestamp: new Date().toISOString(),
    });

    // Setup event handlers
    setupMessageHandlers(socket);
    setupCallHandlers(socket);
    setupNotificationHandlers(socket);
    setupRoomHandlers(socket);
    setupPresenceHandlers(socket);

    // Handle transport upgrade (polling -> websocket)
    socket.conn.on('upgrade', (transport) => {
      logger.info('Transport upgraded', {
        socketId: socket.id,
        userId,
        from: socket.conn.transport.name,
        to: transport.name,
      });
    });

    // Handle disconnection
    setupDisconnectHandler(socket);

    // Handle errors
    setupErrorHandler(socket);

    // Update last activity
    socket.use((__, next) => {
      updateLastActivity(socket.id);
      next();
    });
  });
}

/**
 * Setup message event handlers
 */
function setupMessageHandlers(socket: AuthenticatedSocket): void {
  // Send message
  socket.on('message:send', async (data, callback) => {
    await messageHandler.handleSendMessage(socket, data, callback);
  });

  // Message received acknowledgment
  socket.on('message:received', async (data) => {
    await messageHandler.handleMessageReceived(socket, data);
  });

  // Message read acknowledgment
  socket.on('message:read', async (data) => {
    await messageHandler.handleMessageRead(socket, data);
  });

  // Typing indicators
  socket.on('typing:start', async (data) => {
    await messageHandler.handleTypingStart(socket, data);
  });

  socket.on('typing:stop', async (data) => {
    await messageHandler.handleTypingStop(socket, data);
  });

  // Get message history
  socket.on('message:history', async (data, callback) => {
    await messageHandler.handleGetHistory(socket, data, callback);
  });
}

/**
 * Setup call event handlers (video/audio calls)
 */
function setupCallHandlers(socket: AuthenticatedSocket): void {
  // Initiate call
  socket.on('call:initiate', async (data, callback) => {
    await callHandler.handleInitiateCall(socket, data, callback);
  });

  // Accept call
  socket.on('call:accept', async (data, callback) => {
    await callHandler.handleAcceptCall(socket, data, callback);
  });

  // Reject call
  socket.on('call:reject', async (data, callback) => {
    await callHandler.handleRejectCall(socket, data, callback);
  });

  // End call
  socket.on('call:end', async (data, callback) => {
    await callHandler.handleEndCall(socket, data, callback);
  });

  // WebRTC signaling
  socket.on('call:signal', async (data) => {
    await callHandler.handleSignal(socket, data);
  });

  // Call quality metrics
  socket.on('call:quality', async (data) => {
    await callHandler.handleQualityReport(socket, data);
  });
}

/**
 * Setup notification event handlers
 */
function setupNotificationHandlers(socket: AuthenticatedSocket): void {
  // Mark notification as read
  socket.on('notification:read', async (data, callback) => {
    await notificationHandler.handleMarkAsRead(socket, data, callback);
  });

  // Mark all notifications as read
  socket.on('notification:readAll', async (callback) => {
    await notificationHandler.handleMarkAllAsRead(socket, callback);
  });

  // Get unread count
  socket.on('notification:getUnreadCount', async (callback) => {
    await notificationHandler.handleGetUnreadCount(socket, callback);
  });

  // Subscribe to notification topics
  socket.on('notification:subscribe', async (data) => {
    await notificationHandler.handleSubscribe(socket, data);
  });

  // Unsubscribe from notification topics
  socket.on('notification:unsubscribe', async (data) => {
    await notificationHandler.handleUnsubscribe(socket, data);
  });
}

/**
 * Setup room management handlers
 */
function setupRoomHandlers(socket: AuthenticatedSocket): void {
  // Join room (chat or call room)
  socket.on('room:join', async (data, callback) => {
    await roomManager.handleJoinRoom(socket, data, callback);
  });

  // Leave room
  socket.on('room:leave', async (data, callback) => {
    await roomManager.handleLeaveRoom(socket, data, callback);
  });

  // Get room participants
  socket.on('room:participants', async (data, callback) => {
    await roomManager.handleGetParticipants(socket, data, callback);
  });
}

/**
 * Setup presence tracking handlers
 */
function setupPresenceHandlers(socket: AuthenticatedSocket): void {
  // Get user presence
  socket.on('presence:get', async (data, callback) => {
    await presenceManager.handleGetPresence(socket, data, callback);
  });

  // Set custom status
  socket.on('presence:setStatus', async (data) => {
    await presenceManager.handleSetStatus(socket, data);
  });

  // Subscribe to presence updates
  socket.on('presence:subscribe', async (data) => {
    await presenceManager.handleSubscribe(socket, data);
  });
}

/**
 * Setup disconnect handler
 */
function setupDisconnectHandler(socket: AuthenticatedSocket): void {
  socket.on('disconnect', async (reason) => {
    const { userId } = socket;

    logger.info('Client disconnected', {
      socketId: socket.id,
      userId,
      reason,
    });

    // Update presence to offline
    await presenceManager.setUserOffline(userId, socket.id);

    // Clean up rooms
    await roomManager.cleanupSocketRooms(socket);

    // Remove from connection tracking
    activeConnections.delete(socket.id);

    // Handle automatic reconnection scenarios
    if (reason === 'transport close' || reason === 'ping timeout') {
      logger.info('Connection lost, client may reconnect', {
        socketId: socket.id,
        userId,
      });
    }
  });

  socket.on('disconnecting', async () => {
    logger.debug('Client disconnecting', {
      socketId: socket.id,
      userId: socket.userId,
      rooms: Array.from(socket.rooms),
    });
  });
}

/**
 * Setup error handler
 */
function setupErrorHandler(socket: AuthenticatedSocket): void {
  socket.on('error', (error) => {
    logger.error('Socket error', {
      socketId: socket.id,
      userId: socket.userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  });

  // Handle connection errors
  socket.conn.on('error', (error) => {
    logger.error('Socket connection error', {
      socketId: socket.id,
      userId: socket.userId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  });
}

/**
 * Track active connection
 */
function trackConnection(socket: AuthenticatedSocket): void {
  const metadata: ConnectionMetadata = {
    socketId: socket.id,
    userId: socket.userId,
    userRole: socket.userRole,
    connectedAt: new Date(),
    lastActivity: new Date(),
    ipAddress: socket.handshake.address,
    userAgent: socket.handshake.headers['user-agent'],
  };

  activeConnections.set(socket.id, metadata);
}

/**
 * Update last activity timestamp
 */
function updateLastActivity(socketId: string): void {
  const connection = activeConnections.get(socketId);
  if (connection) {
    connection.lastActivity = new Date();
  }
}

/**
 * Setup health monitoring
 */
function setupHealthMonitoring(): void {
  // Monitor connection health every 30 seconds
  setInterval(() => {
    if (!io) return;

    const now = Date.now();
    const staleConnections: string[] = [];

    // Check for stale connections (no activity for 5 minutes)
    activeConnections.forEach((metadata, socketId) => {
      const timeSinceActivity = now - metadata.lastActivity.getTime();
      if (timeSinceActivity > 5 * 60 * 1000) {
        staleConnections.push(socketId);
      }
    });

    // Disconnect stale connections
    if (staleConnections.length > 0) {
      logger.warn('Disconnecting stale connections', {
        count: staleConnections.length,
      });

      staleConnections.forEach((socketId) => {
        const socket = io?.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect(true);
        }
        activeConnections.delete(socketId);
      });
    }

    // Log connection stats
    logger.debug('WebSocket health check', {
      activeConnections: activeConnections.size,
      staleConnectionsRemoved: staleConnections.length,
    });
  }, 30000);
}

/**
 * Get Socket.io server instance
 */
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeWebSocket first.');
  }
  return io;
}

/**
 * Emit event to specific user
 */
export function emitToUser(userId: string, event: string, data: any): void {
  if (!io) {
    logger.warn('Cannot emit to user: Socket.io not initialized');
    return;
  }
  io.to(`user:${userId}`).emit(event, data);
}

/**
 * Emit event to specific room
 */
export function emitToRoom(roomId: string, event: string, data: any): void {
  if (!io) {
    logger.warn('Cannot emit to room: Socket.io not initialized');
    return;
  }
  io.to(roomId).emit(event, data);
}

/**
 * Broadcast event to all connected clients
 */
export function broadcast(event: string, data: any): void {
  if (!io) {
    logger.warn('Cannot broadcast: Socket.io not initialized');
    return;
  }
  io.emit(event, data);
}

/**
 * Get connection statistics
 */
export function getConnectionStats() {
  return {
    totalConnections: activeConnections.size,
    connections: Array.from(activeConnections.values()).map((conn) => ({
      socketId: conn.socketId,
      userId: conn.userId,
      userRole: conn.userRole,
      connectedAt: conn.connectedAt,
      lastActivity: conn.lastActivity,
      durationMs: Date.now() - conn.connectedAt.getTime(),
    })),
  };
}

/**
 * Check if user is connected
 */
export async function isUserConnected(userId: string): Promise<boolean> {
  if (!io) return false;

  const sockets = await io.in(`user:${userId}`).fetchSockets();
  return sockets.length > 0;
}

/**
 * Get all sockets for a user
 */
export async function getUserSockets(userId: string): Promise<AuthenticatedSocket[]> {
  if (!io) return [];

  const sockets = await io.in(`user:${userId}`).fetchSockets();
  return sockets as AuthenticatedSocket[];
}

/**
 * Disconnect user from all sessions
 */
export async function disconnectUser(userId: string, reason?: string): Promise<void> {
  if (!io) return;

  const sockets = await getUserSockets(userId);
  sockets.forEach((socket) => {
    socket.disconnect(true);
    logger.info('User forcibly disconnected', {
      socketId: socket.id,
      userId,
      reason: reason || 'Administrative action',
    });
  });
}

/**
 * Graceful shutdown
 */
export async function shutdownWebSocket(): Promise<void> {
  logger.info('Shutting down WebSocket server...');

  // Disconnect all clients gracefully
  if (io) {
    io.emit('server:shutdown', {
      message: 'Server is shutting down',
      timestamp: new Date().toISOString(),
    });

    // Give clients time to receive the message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Close all connections
    io.close();
  }

  // Disconnect Redis clients
  if (redisPubClient) {
    await redisPubClient.quit();
  }
  if (redisSubClient) {
    await redisSubClient.quit();
  }

  logger.info('WebSocket server shut down successfully');
}

// Export types
export type { SocketAuthToken, ConnectionMetadata };
