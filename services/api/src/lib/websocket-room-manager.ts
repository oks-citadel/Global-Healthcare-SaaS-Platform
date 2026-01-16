/**
 * WebSocket Room Management
 *
 * Handles room operations for patient-provider chats and telemedicine sessions
 *
 * @module websocket-room-manager
 */

import { Socket } from 'socket.io';
import { AuthenticatedSocket } from './websocket.js';
import { logger } from '../utils/logger.js';
import { prisma } from './prisma.js';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/errors.js';

/**
 * Room types in the system
 */
export enum RoomType {
  CHAT = 'chat',
  VIDEO_CALL = 'video_call',
  NOTIFICATION = 'notification',
}

/**
 * Room join request payload
 */
interface JoinRoomData {
  roomId: string;
  roomType: RoomType;
  metadata?: {
    visitId?: string;
    appointmentId?: string;
    [key: string]: any;
  };
}

/**
 * Room leave request payload
 */
interface LeaveRoomData {
  roomId: string;
}

/**
 * Get participants request payload
 */
interface GetParticipantsData {
  roomId: string;
}

/**
 * Room participant info
 */
interface RoomParticipant {
  socketId: string;
  userId: string;
  userRole: string;
  joinedAt: Date;
}

/**
 * Room metadata storage
 */
const roomMetadata = new Map<
  string,
  {
    type: RoomType;
    participants: Map<string, RoomParticipant>;
    createdAt: Date;
    metadata?: any;
  }
>();

class RoomManager {
  /**
   * Handle join room request
   */
  async handleJoinRoom(
    socket: AuthenticatedSocket,
    data: JoinRoomData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { roomId, roomType, metadata } = data;
      const { userId, userRole } = socket;

      logger.info('User joining room', {
        socketId: socket.id,
        userId,
        roomId,
        roomType,
      });

      // Validate room access
      const hasAccess = await this.validateRoomAccess(userId, userRole, roomId, roomType, metadata);
      if (!hasAccess) {
        const error = new UnauthorizedError('Access denied to this room');
        logger.warn('Room access denied', {
          userId,
          roomId,
          roomType,
        });
        callback?.({ success: false, error: error.message });
        return;
      }

      // Join Socket.io room
      socket.join(roomId);

      // Track room metadata
      this.trackRoomJoin(socket, roomId, roomType, metadata);

      // Notify other participants
      socket.to(roomId).emit('room:userJoined', {
        userId,
        userRole,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });

      // Get current participants
      const participants = await this.getRoomParticipants(roomId);

      logger.info('User joined room successfully', {
        socketId: socket.id,
        userId,
        roomId,
        participantCount: participants.length,
      });

      callback?.({
        success: true,
        roomId,
        roomType,
        participants,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error joining room', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        userId: socket.userId,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join room',
      });
    }
  }

  /**
   * Handle leave room request
   */
  async handleLeaveRoom(
    socket: AuthenticatedSocket,
    data: LeaveRoomData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { roomId } = data;
      const { userId } = socket;

      logger.info('User leaving room', {
        socketId: socket.id,
        userId,
        roomId,
      });

      // Leave Socket.io room
      socket.leave(roomId);

      // Remove from room metadata
      this.trackRoomLeave(socket, roomId);

      // Notify other participants
      socket.to(roomId).emit('room:userLeft', {
        userId,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });

      logger.info('User left room successfully', {
        socketId: socket.id,
        userId,
        roomId,
      });

      callback?.({
        success: true,
        roomId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error leaving room', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to leave room',
      });
    }
  }

  /**
   * Handle get participants request
   */
  async handleGetParticipants(
    socket: AuthenticatedSocket,
    data: GetParticipantsData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { roomId } = data;

      const participants = await this.getRoomParticipants(roomId);

      logger.debug('Room participants retrieved', {
        roomId,
        participantCount: participants.length,
      });

      callback?.({
        success: true,
        roomId,
        participants,
      });
    } catch (error) {
      logger.error('Error getting room participants', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get participants',
      });
    }
  }

  /**
   * Validate room access based on user role and room type
   */
  private async validateRoomAccess(
    userId: string,
    userRole: string,
    roomId: string,
    roomType: RoomType,
    metadata?: any
  ): Promise<boolean> {
    try {
      // Admin has access to all rooms
      if (userRole === 'admin') {
        return true;
      }

      // Check based on room type
      switch (roomType) {
        case RoomType.CHAT:
          return await this.validateChatRoomAccess(userId, userRole, roomId, metadata);

        case RoomType.VIDEO_CALL:
          return await this.validateVideoCallRoomAccess(userId, userRole, roomId, metadata);

        case RoomType.NOTIFICATION:
          return await this.validateNotificationRoomAccess(userId, userRole, roomId);

        default:
          logger.warn('Unknown room type', { roomType });
          return false;
      }
    } catch (error) {
      logger.error('Error validating room access', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        roomId,
      });
      return false;
    }
  }

  /**
   * Validate access to chat room
   */
  private async validateChatRoomAccess(
    userId: string,
    userRole: string,
    roomId: string,
    metadata?: any
  ): Promise<boolean> {
    // If visitId provided, verify user is part of that visit
    if (metadata?.visitId) {
      const visit = await prisma.visit.findUnique({
        where: { id: metadata.visitId },
        include: {
          appointment: {
            include: {
              patient: true,
              provider: true,
            },
          },
        },
      });

      if (!visit) {
        return false;
      }

      // Check if user is patient or provider for this visit
      const isPatient = visit.appointment.patient.userId === userId;
      const isProvider = visit.appointment.provider.userId === userId;

      return isPatient || isProvider;
    }

    // For direct chat rooms (format: chat:userId1:userId2)
    if (roomId.startsWith('chat:')) {
      const participants = roomId.split(':').slice(1);
      return participants.includes(userId);
    }

    // Default: allow if user role is patient or provider
    return ['patient', 'provider', 'doctor'].includes(userRole);
  }

  /**
   * Validate access to video call room
   */
  private async validateVideoCallRoomAccess(
    userId: string,
    userRole: string,
    roomId: string,
    metadata?: any
  ): Promise<boolean> {
    // Similar to chat room validation
    if (metadata?.visitId) {
      const visit = await prisma.visit.findUnique({
        where: { id: metadata.visitId },
        include: {
          appointment: {
            include: {
              patient: true,
              provider: true,
            },
          },
        },
      });

      if (!visit) {
        return false;
      }

      const isPatient = visit.appointment.patient.userId === userId;
      const isProvider = visit.appointment.provider.userId === userId;

      return isPatient || isProvider;
    }

    return ['patient', 'provider', 'doctor'].includes(userRole);
  }

  /**
   * Validate access to notification room
   */
  private async validateNotificationRoomAccess(
    userId: string,
    userRole: string,
    roomId: string
  ): Promise<boolean> {
    // Notification rooms are typically per-user
    return roomId === `notifications:${userId}`;
  }

  /**
   * Track room join in metadata
   */
  private trackRoomJoin(
    socket: AuthenticatedSocket,
    roomId: string,
    roomType: RoomType,
    metadata?: any
  ): void {
    let room = roomMetadata.get(roomId);

    if (!room) {
      room = {
        type: roomType,
        participants: new Map(),
        createdAt: new Date(),
        metadata,
      };
      roomMetadata.set(roomId, room);
    }

    room.participants.set(socket.id, {
      socketId: socket.id,
      userId: socket.userId,
      userRole: socket.userRole,
      joinedAt: new Date(),
    });
  }

  /**
   * Track room leave in metadata
   */
  private trackRoomLeave(socket: AuthenticatedSocket, roomId: string): void {
    const room = roomMetadata.get(roomId);
    if (room) {
      room.participants.delete(socket.id);

      // Clean up empty rooms
      if (room.participants.size === 0) {
        roomMetadata.delete(roomId);
      }
    }
  }

  /**
   * Get room participants
   */
  private async getRoomParticipants(roomId: string): Promise<RoomParticipant[]> {
    const room = roomMetadata.get(roomId);
    if (!room) {
      return [];
    }

    return Array.from(room.participants.values());
  }

  /**
   * Clean up all rooms for a socket on disconnect
   */
  async cleanupSocketRooms(socket: AuthenticatedSocket): Promise<void> {
    try {
      // Get all rooms this socket is in
      const rooms = Array.from(socket.rooms);

      // Remove from room metadata
      roomMetadata.forEach((room, roomId) => {
        if (rooms.includes(roomId)) {
          room.participants.delete(socket.id);

          // Notify other participants
          socket.to(roomId).emit('room:userLeft', {
            userId: socket.userId,
            socketId: socket.id,
            timestamp: new Date().toISOString(),
          });

          // Clean up empty rooms
          if (room.participants.size === 0) {
            roomMetadata.delete(roomId);
          }
        }
      });

      logger.debug('Cleaned up socket rooms', {
        socketId: socket.id,
        userId: socket.userId,
        roomCount: rooms.length - 1, // Exclude default room
      });
    } catch (error) {
      logger.error('Error cleaning up socket rooms', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Get room statistics
   */
  getRoomStats() {
    const stats = {
      totalRooms: roomMetadata.size,
      roomsByType: {} as Record<string, number>,
      totalParticipants: 0,
    };

    roomMetadata.forEach((room) => {
      stats.roomsByType[room.type] = (stats.roomsByType[room.type] || 0) + 1;
      stats.totalParticipants += room.participants.size;
    });

    return stats;
  }

  /**
   * Create room ID for patient-provider chat
   */
  static createChatRoomId(userId1: string, userId2: string): string {
    // Sort user IDs to ensure consistent room ID
    const [user1, user2] = [userId1, userId2].sort();
    return `chat:${user1}:${user2}`;
  }

  /**
   * Create room ID for video call
   */
  static createVideoCallRoomId(visitId: string): string {
    return `call:${visitId}`;
  }

  /**
   * Create room ID for notifications
   */
  static createNotificationRoomId(userId: string): string {
    return `notifications:${userId}`;
  }
}

// Export singleton instance
export const roomManager = new RoomManager();
