/**
 * WebSocket Message Handler
 *
 * Handles real-time messaging with database persistence
 *
 * @module websocket-message-handler
 */

import { AuthenticatedSocket, emitToUser, emitToRoom } from './websocket.js';
import { logger } from '../utils/logger.js';
import { prisma } from './prisma.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';

/**
 * Send message request
 */
interface SendMessageData {
  roomId?: string;
  recipientId?: string;
  visitId?: string;
  message: string;
  attachments?: string[];
  metadata?: {
    messageType?: 'text' | 'image' | 'file' | 'system';
    replyToId?: string;
    [key: string]: any;
  };
}

/**
 * Message received acknowledgment
 */
interface MessageReceivedData {
  messageId: string;
  roomId?: string;
}

/**
 * Message read acknowledgment
 */
interface MessageReadData {
  messageIds: string[];
  roomId?: string;
}

/**
 * Typing indicator data
 */
interface TypingData {
  roomId?: string;
  recipientId?: string;
}

/**
 * Get message history request
 */
interface GetHistoryData {
  visitId?: string;
  roomId?: string;
  limit?: number;
  before?: string; // ISO timestamp for pagination
}

/**
 * Message response structure
 */
interface MessageResponse {
  id: string;
  senderId: string;
  recipientId?: string;
  visitId?: string;
  message: string;
  attachments?: string[];
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  metadata?: any;
}

class MessageHandler {
  /**
   * Handle send message
   */
  async handleSendMessage(
    socket: AuthenticatedSocket,
    data: SendMessageData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId, userRole } = socket;
      const { roomId, recipientId, visitId, message, attachments, metadata } = data;

      // Validate input
      if (!message || message.trim().length === 0) {
        throw new BadRequestError('Message content is required');
      }

      if (!roomId && !recipientId && !visitId) {
        throw new BadRequestError('Either roomId, recipientId, or visitId is required');
      }

      logger.info('Sending message', {
        socketId: socket.id,
        userId,
        roomId,
        recipientId,
        visitId,
        messageLength: message.length,
      });

      // Persist message to database if visitId provided
      let dbMessage = null;
      if (visitId) {
        dbMessage = await this.persistMessage(userId, visitId, message, attachments);
      }

      // Create message response
      const messageResponse: MessageResponse = {
        id: dbMessage?.id || `temp-${Date.now()}`,
        senderId: userId,
        recipientId,
        visitId,
        message,
        attachments,
        timestamp: dbMessage?.timestamp.toISOString() || new Date().toISOString(),
        status: 'sent',
        metadata: {
          ...metadata,
          senderRole: userRole,
        },
      };

      // Emit to appropriate target
      if (roomId) {
        // Broadcast to room
        socket.to(roomId).emit('message:new', messageResponse);
      } else if (recipientId) {
        // Send to specific user
        emitToUser(recipientId, 'message:new', messageResponse);
      } else if (visitId) {
        // Send to visit room
        const visitRoomId = `visit:${visitId}`;
        socket.to(visitRoomId).emit('message:new', messageResponse);
      }

      // Send confirmation to sender
      socket.emit('message:sent', messageResponse);

      logger.info('Message sent successfully', {
        messageId: messageResponse.id,
        userId,
        roomId,
        recipientId,
        visitId,
      });

      callback?.({
        success: true,
        message: messageResponse,
      });
    } catch (error) {
      logger.error('Error sending message', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        userId: socket.userId,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  }

  /**
   * Handle message received acknowledgment
   */
  async handleMessageReceived(
    socket: AuthenticatedSocket,
    data: MessageReceivedData
  ): Promise<void> {
    try {
      const { messageId, roomId } = data;
      const { userId } = socket;

      logger.debug('Message received acknowledgment', {
        messageId,
        userId,
        roomId,
      });

      // Emit delivery confirmation to room or sender
      if (roomId) {
        socket.to(roomId).emit('message:delivered', {
          messageId,
          userId,
          timestamp: new Date().toISOString(),
        });
      }

      // Update message status in database if needed
      // This could be implemented with a separate messages table
      // For now, we'll just emit the event
    } catch (error) {
      logger.error('Error handling message received', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle message read acknowledgment
   */
  async handleMessageRead(socket: AuthenticatedSocket, data: MessageReadData): Promise<void> {
    try {
      const { messageIds, roomId } = data;
      const { userId } = socket;

      logger.debug('Message read acknowledgment', {
        messageCount: messageIds.length,
        userId,
        roomId,
      });

      // Emit read confirmation to room or sender
      if (roomId) {
        socket.to(roomId).emit('message:read', {
          messageIds,
          userId,
          timestamp: new Date().toISOString(),
        });
      }

      // Update read status in database
      // This would require a separate messages tracking table
      // For now, we'll just emit the event
    } catch (error) {
      logger.error('Error handling message read', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle typing start indicator
   */
  async handleTypingStart(socket: AuthenticatedSocket, data: TypingData): Promise<void> {
    try {
      const { roomId, recipientId } = data;
      const { userId, userRole } = socket;

      logger.debug('Typing indicator started', {
        userId,
        roomId,
        recipientId,
      });

      const typingData = {
        userId,
        userRole,
        timestamp: new Date().toISOString(),
      };

      // Emit typing indicator
      if (roomId) {
        socket.to(roomId).emit('typing:start', typingData);
      } else if (recipientId) {
        emitToUser(recipientId, 'typing:start', typingData);
      }
    } catch (error) {
      logger.error('Error handling typing start', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle typing stop indicator
   */
  async handleTypingStop(socket: AuthenticatedSocket, data: TypingData): Promise<void> {
    try {
      const { roomId, recipientId } = data;
      const { userId, userRole } = socket;

      logger.debug('Typing indicator stopped', {
        userId,
        roomId,
        recipientId,
      });

      const typingData = {
        userId,
        userRole,
        timestamp: new Date().toISOString(),
      };

      // Emit typing stop
      if (roomId) {
        socket.to(roomId).emit('typing:stop', typingData);
      } else if (recipientId) {
        emitToUser(recipientId, 'typing:stop', typingData);
      }
    } catch (error) {
      logger.error('Error handling typing stop', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle get message history
   */
  async handleGetHistory(
    socket: AuthenticatedSocket,
    data: GetHistoryData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { visitId, limit = 50, before } = data;
      const { userId, userRole } = socket;

      if (!visitId) {
        throw new BadRequestError('visitId is required');
      }

      logger.info('Fetching message history', {
        userId,
        visitId,
        limit,
        before,
      });

      // Verify user has access to this visit
      const hasAccess = await this.verifyVisitAccess(userId, userRole, visitId);
      if (!hasAccess) {
        throw new UnauthorizedError('Access denied to this conversation');
      }

      // Fetch messages from database
      const whereClause: any = {
        visitId,
      };

      if (before) {
        whereClause.timestamp = {
          lt: new Date(before),
        };
      }

      const messages = await prisma.chatMessage.findMany({
        where: whereClause,
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      });

      // Reverse to get chronological order
      messages.reverse();

      logger.info('Message history fetched', {
        userId,
        visitId,
        messageCount: messages.length,
      });

      callback?.({
        success: true,
        messages: messages.map((msg) => ({
          id: msg.id,
          senderId: msg.senderId,
          visitId: msg.visitId,
          message: msg.message,
          attachments: msg.attachments,
          timestamp: msg.timestamp.toISOString(),
        })),
        hasMore: messages.length === limit,
      });
    } catch (error) {
      logger.error('Error fetching message history', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        userId: socket.userId,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch message history',
      });
    }
  }

  /**
   * Persist message to database
   */
  private async persistMessage(
    senderId: string,
    visitId: string,
    message: string,
    attachments?: string[]
  ): Promise<any> {
    try {
      const chatMessage = await prisma.chatMessage.create({
        data: {
          visitId,
          senderId,
          message,
          attachments: attachments || [],
        },
      });

      logger.debug('Message persisted to database', {
        messageId: chatMessage.id,
        visitId,
        senderId,
      });

      return chatMessage;
    } catch (error) {
      logger.error('Error persisting message', {
        error: error instanceof Error ? error.message : 'Unknown error',
        senderId,
        visitId,
      });
      throw error;
    }
  }

  /**
   * Verify user has access to visit
   */
  private async verifyVisitAccess(
    userId: string,
    userRole: string,
    visitId: string
  ): Promise<boolean> {
    try {
      // Admin has access to all visits
      if (userRole === 'admin') {
        return true;
      }

      // Get visit with appointment details
      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
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
    } catch (error) {
      logger.error('Error verifying visit access', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        visitId,
      });
      return false;
    }
  }

  /**
   * Get unread message count for user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      // This would require a separate message tracking table
      // For now, return 0
      // In production, you'd query a messages table with read status

      // Example query (if you had a messages table):
      // const count = await prisma.message.count({
      //   where: {
      //     recipientId: userId,
      //     status: { not: 'read' }
      //   }
      // });

      return 0;
    } catch (error) {
      logger.error('Error getting unread count', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return 0;
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(userId: string, messageIds: string[]): Promise<void> {
    try {
      // This would update a messages table with read status
      // For now, just log it

      logger.debug('Marking messages as read', {
        userId,
        messageCount: messageIds.length,
      });

      // Example update (if you had a messages table):
      // await prisma.message.updateMany({
      //   where: {
      //     id: { in: messageIds },
      //     recipientId: userId
      //   },
      //   data: {
      //     status: 'read',
      //     readAt: new Date()
      //   }
      // });
    } catch (error) {
      logger.error('Error marking messages as read', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }
}

// Export singleton instance
export const messageHandler = new MessageHandler();
