import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { roomManager } from '../lib/socket.js';

interface Peer {
  id: string;
  userId: string;
  socketId: string;
  role: 'doctor' | 'patient';
  joinedAt: Date;
}

interface Room {
  id: string;
  visitId: string;
  peers: Map<string, Peer>;
  createdAt: Date;
  isActive: boolean;
}

interface ICECandidate {
  candidate: string;
  sdpMLineIndex?: number;
  sdpMid?: string;
}

interface SessionDescription {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp: string;
}

class WebRTCService {
  private rooms: Map<string, Room> = new Map();
  private peerToRoom: Map<string, string> = new Map();

  // Create a new video call room
  createRoom(visitId: string): string {
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      visitId,
      peers: new Map(),
      createdAt: new Date(),
      isActive: true,
    };

    this.rooms.set(roomId, room);
    logger.info('Created WebRTC room', { roomId, visitId });

    return roomId;
  }

  // Get or create a room for a visit
  getOrCreateRoomForVisit(visitId: string): string {
    // Check if room already exists for this visit
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.visitId === visitId && room.isActive) {
        return roomId;
      }
    }

    // Create new room
    return this.createRoom(visitId);
  }

  // Add peer to room
  addPeer(
    roomId: string,
    socketId: string,
    userId: string,
    role: 'doctor' | 'patient'
  ): Peer | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      logger.error('Cannot add peer: Room not found', { roomId, userId });
      return null;
    }

    const peerId = uuidv4();
    const peer: Peer = {
      id: peerId,
      userId,
      socketId,
      role,
      joinedAt: new Date(),
    };

    room.peers.set(peerId, peer);
    this.peerToRoom.set(socketId, roomId);

    logger.info('Peer added to room', {
      roomId,
      peerId,
      userId,
      role,
      peerCount: room.peers.size,
    });

    return peer;
  }

  // Remove peer from room
  removePeer(socketId: string): { roomId: string; peer: Peer } | null {
    const roomId = this.peerToRoom.get(socketId);
    if (!roomId) {
      return null;
    }

    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    // Find peer by socket ID
    let removedPeer: Peer | null = null;
    for (const [peerId, peer] of room.peers.entries()) {
      if (peer.socketId === socketId) {
        room.peers.delete(peerId);
        removedPeer = peer;
        break;
      }
    }

    this.peerToRoom.delete(socketId);

    if (removedPeer) {
      logger.info('Peer removed from room', {
        roomId,
        userId: removedPeer.userId,
        remainingPeers: room.peers.size,
      });

      // Clean up empty room
      if (room.peers.size === 0) {
        this.closeRoom(roomId);
      }
    }

    return removedPeer ? { roomId, peer: removedPeer } : null;
  }

  // Get room by ID
  getRoom(roomId: string): Room | null {
    const room = this.rooms.get(roomId);
    return room && room.isActive ? room : null;
  }

  // Get room by visit ID
  getRoomByVisitId(visitId: string): Room | null {
    for (const room of this.rooms.values()) {
      if (room.visitId === visitId && room.isActive) {
        return room;
      }
    }
    return null;
  }

  // Get all peers in a room
  getPeersInRoom(roomId: string): Peer[] {
    const room = this.rooms.get(roomId);
    if (!room) {
      return [];
    }
    return Array.from(room.peers.values());
  }

  // Get peer by socket ID
  getPeerBySocketId(socketId: string): { peer: Peer; roomId: string } | null {
    const roomId = this.peerToRoom.get(socketId);
    if (!roomId) {
      return null;
    }

    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    for (const peer of room.peers.values()) {
      if (peer.socketId === socketId) {
        return { peer, roomId };
      }
    }

    return null;
  }

  // Close a room
  closeRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) {
      return false;
    }

    // Remove all peer-to-room mappings
    for (const peer of room.peers.values()) {
      this.peerToRoom.delete(peer.socketId);
    }

    room.isActive = false;
    room.peers.clear();

    logger.info('Room closed', {
      roomId,
      visitId: room.visitId,
    });

    // Remove room after some time (for analytics/logging)
    setTimeout(() => {
      this.rooms.delete(roomId);
    }, 60000); // Keep for 1 minute

    return true;
  }

  // Handle WebRTC offer
  handleOffer(
    fromSocketId: string,
    toSocketId: string,
    offer: SessionDescription
  ): boolean {
    const fromPeer = this.getPeerBySocketId(fromSocketId);
    const toPeer = this.getPeerBySocketId(toSocketId);

    if (!fromPeer || !toPeer || fromPeer.roomId !== toPeer.roomId) {
      logger.error('Cannot handle offer: Invalid peers or different rooms', {
        fromSocketId,
        toSocketId,
      });
      return false;
    }

    logger.debug('Handling WebRTC offer', {
      fromPeerId: fromPeer.peer.id,
      toPeerId: toPeer.peer.id,
      roomId: fromPeer.roomId,
    });

    return true;
  }

  // Handle WebRTC answer
  handleAnswer(
    fromSocketId: string,
    toSocketId: string,
    answer: SessionDescription
  ): boolean {
    const fromPeer = this.getPeerBySocketId(fromSocketId);
    const toPeer = this.getPeerBySocketId(toSocketId);

    if (!fromPeer || !toPeer || fromPeer.roomId !== toPeer.roomId) {
      logger.error('Cannot handle answer: Invalid peers or different rooms', {
        fromSocketId,
        toSocketId,
      });
      return false;
    }

    logger.debug('Handling WebRTC answer', {
      fromPeerId: fromPeer.peer.id,
      toPeerId: toPeer.peer.id,
      roomId: fromPeer.roomId,
    });

    return true;
  }

  // Handle ICE candidate
  handleIceCandidate(
    fromSocketId: string,
    toSocketId: string,
    candidate: ICECandidate
  ): boolean {
    const fromPeer = this.getPeerBySocketId(fromSocketId);
    const toPeer = this.getPeerBySocketId(toSocketId);

    if (!fromPeer || !toPeer || fromPeer.roomId !== toPeer.roomId) {
      logger.error('Cannot handle ICE candidate: Invalid peers or different rooms', {
        fromSocketId,
        toSocketId,
      });
      return false;
    }

    logger.debug('Handling ICE candidate', {
      fromPeerId: fromPeer.peer.id,
      toPeerId: toPeer.peer.id,
      roomId: fromPeer.roomId,
    });

    return true;
  }

  // Get room statistics
  getRoomStats(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    return {
      roomId: room.id,
      visitId: room.visitId,
      peerCount: room.peers.size,
      isActive: room.isActive,
      createdAt: room.createdAt,
      duration: Date.now() - room.createdAt.getTime(),
      peers: Array.from(room.peers.values()).map(peer => ({
        id: peer.id,
        userId: peer.userId,
        role: peer.role,
        joinedAt: peer.joinedAt,
        duration: Date.now() - peer.joinedAt.getTime(),
      })),
    };
  }

  // Get all active rooms
  getActiveRooms() {
    const activeRooms = [];
    for (const room of this.rooms.values()) {
      if (room.isActive) {
        activeRooms.push(this.getRoomStats(room.id));
      }
    }
    return activeRooms;
  }

  // Clean up inactive rooms (can be called periodically)
  cleanupInactiveRooms(maxInactiveMinutes: number = 30): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [roomId, room] of this.rooms.entries()) {
      if (!room.isActive) {
        continue;
      }

      const inactiveTime = now - room.createdAt.getTime();
      if (room.peers.size === 0 && inactiveTime > maxInactiveMinutes * 60 * 1000) {
        this.closeRoom(roomId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info('Cleaned up inactive rooms', { count: cleaned });
    }

    return cleaned;
  }
}

export const webrtcService = new WebRTCService();
export type { Peer, Room, ICECandidate, SessionDescription };
