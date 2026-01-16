import { Server, Socket } from 'socket.io';
import { AuthSocket, roomManager } from '../lib/socket.js';
import { webrtcService, ICECandidate, SessionDescription } from '../services/webrtc.service.js';
import { logger } from '../utils/logger.js';

interface JoinRoomPayload {
  visitId: string;
  role: 'doctor' | 'patient';
}

interface LeaveRoomPayload {
  roomId: string;
}

interface WebRTCSignalPayload {
  to: string;
  signal: SessionDescription | ICECandidate;
  type: 'offer' | 'answer' | 'ice-candidate';
}

interface ChatMessagePayload {
  roomId: string;
  message: string;
  timestamp?: string;
}

interface TypingPayload {
  roomId: string;
  isTyping: boolean;
}

interface CallQualityPayload {
  roomId: string;
  quality: {
    bitrate: number;
    packetsLost: number;
    jitter: number;
    latency: number;
  };
}

export function setupRealtimeController(io: Server): void {
  io.on('connection', (socket: AuthSocket) => {
    logger.info('Realtime connection established', {
      socketId: socket.id,
      userId: socket.userId,
    });

    // Join video call room
    socket.on('join-room', async (payload: JoinRoomPayload, callback) => {
      try {
        const { visitId, role } = payload;

        if (!socket.userId) {
          callback({ error: 'Unauthorized' });
          return;
        }

        // Get or create room for visit
        const roomId = webrtcService.getOrCreateRoomForVisit(visitId);

        // Add peer to WebRTC service
        const peer = webrtcService.addPeer(roomId, socket.id, socket.userId, role);

        if (!peer) {
          callback({ error: 'Failed to join room' });
          return;
        }

        // Join Socket.io room
        roomManager.joinRoom(socket, roomId);

        // Get other peers in the room
        const otherPeers = webrtcService
          .getPeersInRoom(roomId)
          .filter(p => p.socketId !== socket.id)
          .map(p => ({
            id: p.id,
            userId: p.userId,
            socketId: p.socketId,
            role: p.role,
          }));

        // Notify other peers
        roomManager.broadcastToRoom(socket, roomId, 'peer-joined', {
          peer: {
            id: peer.id,
            userId: peer.userId,
            socketId: socket.id,
            role: peer.role,
          },
        });

        logger.info('User joined video room', {
          socketId: socket.id,
          userId: socket.userId,
          visitId,
          roomId,
          role,
        });

        callback({
          success: true,
          roomId,
          peerId: peer.id,
          otherPeers,
        });
      } catch (error) {
        logger.error('Error joining room', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
        callback({ error: 'Internal server error' });
      }
    });

    // Leave video call room
    socket.on('leave-room', async (payload: LeaveRoomPayload, callback) => {
      try {
        const { roomId } = payload;
        const result = webrtcService.removePeer(socket.id);

        if (result) {
          roomManager.leaveRoom(socket, roomId);

          // Notify other peers
          roomManager.broadcastToRoom(socket, roomId, 'peer-left', {
            peerId: result.peer.id,
            userId: result.peer.userId,
          });

          logger.info('User left video room', {
            socketId: socket.id,
            userId: socket.userId,
            roomId,
          });
        }

        callback({ success: true });
      } catch (error) {
        logger.error('Error leaving room', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
        callback({ error: 'Internal server error' });
      }
    });

    // WebRTC signaling: offer
    socket.on('webrtc-offer', async (payload: WebRTCSignalPayload, callback) => {
      try {
        const { to, signal } = payload;

        const valid = webrtcService.handleOffer(socket.id, to, signal as SessionDescription);

        if (!valid) {
          callback({ error: 'Invalid offer' });
          return;
        }

        // Forward offer to target peer
        io.to(to).emit('webrtc-offer', {
          from: socket.id,
          signal,
        });

        logger.debug('WebRTC offer forwarded', {
          from: socket.id,
          to,
        });

        callback({ success: true });
      } catch (error) {
        logger.error('Error handling WebRTC offer', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
        callback({ error: 'Internal server error' });
      }
    });

    // WebRTC signaling: answer
    socket.on('webrtc-answer', async (payload: WebRTCSignalPayload, callback) => {
      try {
        const { to, signal } = payload;

        const valid = webrtcService.handleAnswer(socket.id, to, signal as SessionDescription);

        if (!valid) {
          callback({ error: 'Invalid answer' });
          return;
        }

        // Forward answer to target peer
        io.to(to).emit('webrtc-answer', {
          from: socket.id,
          signal,
        });

        logger.debug('WebRTC answer forwarded', {
          from: socket.id,
          to,
        });

        callback({ success: true });
      } catch (error) {
        logger.error('Error handling WebRTC answer', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
        callback({ error: 'Internal server error' });
      }
    });

    // WebRTC signaling: ICE candidate
    socket.on('ice-candidate', async (payload: WebRTCSignalPayload, callback) => {
      try {
        const { to, signal } = payload;

        const valid = webrtcService.handleIceCandidate(socket.id, to, signal as ICECandidate);

        if (!valid) {
          callback({ error: 'Invalid ICE candidate' });
          return;
        }

        // Forward ICE candidate to target peer
        io.to(to).emit('ice-candidate', {
          from: socket.id,
          signal,
        });

        logger.debug('ICE candidate forwarded', {
          from: socket.id,
          to,
        });

        callback({ success: true });
      } catch (error) {
        logger.error('Error handling ICE candidate', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
        callback({ error: 'Internal server error' });
      }
    });

    // Chat message
    socket.on('chat-message', async (payload: ChatMessagePayload, callback) => {
      try {
        const { roomId, message } = payload;

        if (!socket.userId) {
          callback({ error: 'Unauthorized' });
          return;
        }

        const peerInfo = webrtcService.getPeerBySocketId(socket.id);
        if (!peerInfo || peerInfo.roomId !== roomId) {
          callback({ error: 'Not in room' });
          return;
        }

        const chatMessage = {
          id: Date.now().toString(),
          roomId,
          userId: socket.userId,
          role: peerInfo.peer.role,
          message,
          timestamp: payload.timestamp || new Date().toISOString(),
        };

        // Broadcast message to all in room (including sender for confirmation)
        roomManager.emitToRoom(roomId, 'chat-message', chatMessage);

        logger.debug('Chat message sent', {
          socketId: socket.id,
          userId: socket.userId,
          roomId,
        });

        callback({ success: true, message: chatMessage });
      } catch (error) {
        logger.error('Error sending chat message', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
        callback({ error: 'Internal server error' });
      }
    });

    // Typing indicator
    socket.on('typing', async (payload: TypingPayload) => {
      try {
        const { roomId, isTyping } = payload;

        if (!socket.userId) {
          return;
        }

        const peerInfo = webrtcService.getPeerBySocketId(socket.id);
        if (!peerInfo || peerInfo.roomId !== roomId) {
          return;
        }

        // Broadcast to others in room
        roomManager.broadcastToRoom(socket, roomId, 'typing', {
          userId: socket.userId,
          role: peerInfo.peer.role,
          isTyping,
        });
      } catch (error) {
        logger.error('Error handling typing indicator', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
      }
    });

    // Call quality report
    socket.on('call-quality', async (payload: CallQualityPayload) => {
      try {
        const { roomId, quality } = payload;

        if (!socket.userId) {
          return;
        }

        const peerInfo = webrtcService.getPeerBySocketId(socket.id);
        if (!peerInfo || peerInfo.roomId !== roomId) {
          return;
        }

        logger.debug('Call quality report', {
          socketId: socket.id,
          userId: socket.userId,
          roomId,
          quality,
        });

        // Could store this in database or analytics service
        // For now, just log it
      } catch (error) {
        logger.error('Error handling call quality report', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      try {
        const result = webrtcService.removePeer(socket.id);

        if (result) {
          // Notify other peers
          roomManager.broadcastToRoom(socket, result.roomId, 'peer-left', {
            peerId: result.peer.id,
            userId: result.peer.userId,
          });

          logger.info('User disconnected from video room', {
            socketId: socket.id,
            userId: socket.userId,
            roomId: result.roomId,
          });
        }
      } catch (error) {
        logger.error('Error handling disconnect', {
          error: error instanceof Error ? error.message : 'Unknown error',
          socketId: socket.id,
        });
      }
    });
  });

  // Cleanup inactive rooms every 10 minutes
  setInterval(() => {
    webrtcService.cleanupInactiveRooms(30);
  }, 10 * 60 * 1000);

  logger.info('Realtime controller initialized');
}
