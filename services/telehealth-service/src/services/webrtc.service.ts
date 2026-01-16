import { Server as SocketServer, Socket } from 'socket.io';
import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  from: string;
  to: string;
  roomId: string;
}

export class WebRTCService {
  private io: SocketServer;
  private rooms: Map<string, Set<string>> = new Map();

  constructor(io: SocketServer) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Join room
      socket.on('join-room', async (data: { roomId: string; userId: string }) => {
        try {
          const { roomId, userId } = data;

          // Verify room exists
          const visit = await prisma.visit.findUnique({
            where: { roomId },
            include: { appointment: true },
          });

          if (!visit) {
            socket.emit('error', { message: 'Invalid room' });
            return;
          }

          // Verify user has access
          const hasAccess =
            visit.appointment.patientId === userId ||
            visit.appointment.providerId === userId;

          if (!hasAccess) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }

          // Join socket room
          socket.join(roomId);

          // Track users in room
          if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
          }
          this.rooms.get(roomId)!.add(socket.id);

          // Notify other participants
          socket.to(roomId).emit('user-joined', {
            userId,
            socketId: socket.id,
          });

          // Send current participants to new user
          const participants = Array.from(this.rooms.get(roomId)!).filter(
            (id) => id !== socket.id
          );

          socket.emit('room-joined', {
            roomId,
            participants,
            iceServers: visit.iceServers,
          });

          console.log(`User ${userId} joined room ${roomId}`);
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // WebRTC signaling
      socket.on('signal', (signal: WebRTCSignal) => {
        try {
          const { roomId, to, type, data } = signal;

          // Forward signal to specific peer
          if (to) {
            socket.to(to).emit('signal', {
              type,
              data,
              from: socket.id,
            });
          } else {
            // Broadcast to room
            socket.to(roomId).emit('signal', {
              type,
              data,
              from: socket.id,
            });
          }
        } catch (error) {
          console.error('Error handling signal:', error);
        }
      });

      // Mute/unmute audio
      socket.on('toggle-audio', (data: { roomId: string; muted: boolean }) => {
        socket.to(data.roomId).emit('peer-audio-toggle', {
          socketId: socket.id,
          muted: data.muted,
        });
      });

      // Enable/disable video
      socket.on('toggle-video', (data: { roomId: string; enabled: boolean }) => {
        socket.to(data.roomId).emit('peer-video-toggle', {
          socketId: socket.id,
          enabled: data.enabled,
        });
      });

      // Screen sharing
      socket.on('start-screen-share', (data: { roomId: string }) => {
        socket.to(data.roomId).emit('peer-screen-share-started', {
          socketId: socket.id,
        });
      });

      socket.on('stop-screen-share', (data: { roomId: string }) => {
        socket.to(data.roomId).emit('peer-screen-share-stopped', {
          socketId: socket.id,
        });
      });

      // Leave room
      socket.on('leave-room', (data: { roomId: string }) => {
        this.handleLeaveRoom(socket, data.roomId);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Remove from all rooms
        this.rooms.forEach((participants, roomId) => {
          if (participants.has(socket.id)) {
            this.handleLeaveRoom(socket, roomId);
          }
        });
      });
    });
  }

  private handleLeaveRoom(socket: Socket, roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(socket.id);

      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    socket.leave(roomId);
    socket.to(roomId).emit('user-left', {
      socketId: socket.id,
    });

    console.log(`Socket ${socket.id} left room ${roomId}`);
  }

  // Get active participants in a room
  public getRoomParticipants(roomId: string): string[] {
    const participants = this.rooms.get(roomId);
    return participants ? Array.from(participants) : [];
  }

  // Get number of active rooms
  public getActiveRoomsCount(): number {
    return this.rooms.size;
  }
}

export default WebRTCService;
