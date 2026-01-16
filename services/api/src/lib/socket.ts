import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

interface AuthSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface SocketAuthToken {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

let io: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.origins,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Socket connection attempt without token', {
        socketId: socket.id,
        remoteAddress: socket.handshake.address,
      });
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as SocketAuthToken;
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;

      logger.info('Socket authenticated', {
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
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handling
  io.on('connection', (socket: AuthSocket) => {
    logger.info('Client connected', {
      socketId: socket.id,
      userId: socket.userId,
    });

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info('Client disconnected', {
        socketId: socket.id,
        userId: socket.userId,
        reason,
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket error', {
        socketId: socket.id,
        userId: socket.userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
  });

  logger.info('Socket.io initialized');
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
}

// Room management helpers
export const roomManager = {
  // Join a video call room
  joinRoom: (socket: AuthSocket, roomId: string) => {
    socket.join(`room:${roomId}`);
    logger.info('User joined room', {
      socketId: socket.id,
      userId: socket.userId,
      roomId,
    });
  },

  // Leave a video call room
  leaveRoom: (socket: AuthSocket, roomId: string) => {
    socket.leave(`room:${roomId}`);
    logger.info('User left room', {
      socketId: socket.id,
      userId: socket.userId,
      roomId,
    });
  },

  // Get all sockets in a room
  getSocketsInRoom: async (roomId: string): Promise<Set<string>> => {
    if (!io) {
      return new Set();
    }
    const sockets = await io.in(`room:${roomId}`).fetchSockets();
    return new Set(sockets.map(s => s.id));
  },

  // Emit to a specific room
  emitToRoom: (roomId: string, event: string, data: any) => {
    if (!io) {
      logger.warn('Cannot emit to room: Socket.io not initialized');
      return;
    }
    io.to(`room:${roomId}`).emit(event, data);
  },

  // Emit to a specific user
  emitToUser: (userId: string, event: string, data: any) => {
    if (!io) {
      logger.warn('Cannot emit to user: Socket.io not initialized');
      return;
    }
    io.to(`user:${userId}`).emit(event, data);
  },

  // Broadcast to room except sender
  broadcastToRoom: (socket: Socket, roomId: string, event: string, data: any) => {
    socket.to(`room:${roomId}`).emit(event, data);
  },
};

export type { AuthSocket };
