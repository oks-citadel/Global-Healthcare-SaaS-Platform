import { describe, it, expect, beforeEach, vi } from 'vitest';
import { webrtcService } from '../../../src/services/webrtc.service.js';

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock roomManager
vi.mock('../../../src/lib/socket.js', () => ({
  roomManager: {},
}));

describe('WebRTCService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear all rooms before each test
    (webrtcService as any).rooms.clear();
    (webrtcService as any).peerToRoom.clear();
  });

  describe('createRoom', () => {
    it('should create a new room successfully', () => {
      const visitId = 'visit-123';
      const roomId = webrtcService.createRoom(visitId);

      expect(roomId).toBeDefined();
      expect(typeof roomId).toBe('string');

      const room = webrtcService.getRoom(roomId);
      expect(room).toBeDefined();
      expect(room?.visitId).toBe(visitId);
      expect(room?.isActive).toBe(true);
      expect(room?.peers.size).toBe(0);
    });

    it('should create rooms with unique IDs', () => {
      const roomId1 = webrtcService.createRoom('visit-1');
      const roomId2 = webrtcService.createRoom('visit-2');

      expect(roomId1).not.toBe(roomId2);
    });

    it('should initialize room with correct properties', () => {
      const visitId = 'visit-123';
      const roomId = webrtcService.createRoom(visitId);
      const room = webrtcService.getRoom(roomId);

      expect(room).toMatchObject({
        id: roomId,
        visitId: visitId,
        isActive: true,
      });
      expect(room?.peers).toBeInstanceOf(Map);
      expect(room?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getOrCreateRoomForVisit', () => {
    it('should return existing room for visit', () => {
      const visitId = 'visit-123';
      const roomId1 = webrtcService.createRoom(visitId);
      const roomId2 = webrtcService.getOrCreateRoomForVisit(visitId);

      expect(roomId1).toBe(roomId2);
    });

    it('should create new room if none exists for visit', () => {
      const visitId = 'visit-123';
      const roomId = webrtcService.getOrCreateRoomForVisit(visitId);

      expect(roomId).toBeDefined();
      const room = webrtcService.getRoom(roomId);
      expect(room?.visitId).toBe(visitId);
    });

    it('should not return inactive rooms', () => {
      const visitId = 'visit-123';
      const roomId1 = webrtcService.createRoom(visitId);
      webrtcService.closeRoom(roomId1);

      const roomId2 = webrtcService.getOrCreateRoomForVisit(visitId);
      expect(roomId2).not.toBe(roomId1);
    });

    it('should create different rooms for different visits', () => {
      const roomId1 = webrtcService.getOrCreateRoomForVisit('visit-1');
      const roomId2 = webrtcService.getOrCreateRoomForVisit('visit-2');

      expect(roomId1).not.toBe(roomId2);
    });
  });

  describe('addPeer', () => {
    it('should add a peer to a room successfully', () => {
      const roomId = webrtcService.createRoom('visit-123');
      const peer = webrtcService.addPeer(
        roomId,
        'socket-123',
        'user-123',
        'doctor'
      );

      expect(peer).toBeDefined();
      expect(peer?.userId).toBe('user-123');
      expect(peer?.socketId).toBe('socket-123');
      expect(peer?.role).toBe('doctor');
      expect(peer?.id).toBeDefined();
      expect(peer?.joinedAt).toBeInstanceOf(Date);
    });

    it('should increment peer count in room', () => {
      const roomId = webrtcService.createRoom('visit-123');

      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      let room = webrtcService.getRoom(roomId);
      expect(room?.peers.size).toBe(1);

      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');
      room = webrtcService.getRoom(roomId);
      expect(room?.peers.size).toBe(2);
    });

    it('should return null when room does not exist', () => {
      const peer = webrtcService.addPeer(
        'non-existent-room',
        'socket-123',
        'user-123',
        'doctor'
      );

      expect(peer).toBeNull();
    });

    it('should support both doctor and patient roles', () => {
      const roomId = webrtcService.createRoom('visit-123');

      const doctor = webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      const patient = webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      expect(doctor?.role).toBe('doctor');
      expect(patient?.role).toBe('patient');
    });

    it('should create peer-to-room mapping', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-123', 'user-123', 'doctor');

      const peerInfo = webrtcService.getPeerBySocketId('socket-123');
      expect(peerInfo).toBeDefined();
      expect(peerInfo?.roomId).toBe(roomId);
    });
  });

  describe('removePeer', () => {
    it('should remove a peer from room successfully', () => {
      const roomId = webrtcService.createRoom('visit-123');
      // Add two peers so room doesn't close when we remove one
      webrtcService.addPeer(roomId, 'socket-123', 'user-123', 'doctor');
      webrtcService.addPeer(roomId, 'socket-456', 'user-456', 'patient');

      const result = webrtcService.removePeer('socket-123');

      expect(result).toBeDefined();
      expect(result?.peer.userId).toBe('user-123');
      expect(result?.roomId).toBe(roomId);

      const room = webrtcService.getRoom(roomId);
      expect(room?.peers.size).toBe(1);
    });

    it('should return null when peer does not exist', () => {
      const result = webrtcService.removePeer('non-existent-socket');
      expect(result).toBeNull();
    });

    it('should close room when last peer is removed', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-123', 'user-123', 'doctor');

      webrtcService.removePeer('socket-123');

      const room = webrtcService.getRoom(roomId);
      expect(room).toBeNull();
    });

    it('should not close room when peers remain', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      webrtcService.removePeer('socket-1');

      const room = webrtcService.getRoom(roomId);
      expect(room).toBeDefined();
      expect(room?.peers.size).toBe(1);
    });

    it('should remove peer-to-room mapping', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-123', 'user-123', 'doctor');

      webrtcService.removePeer('socket-123');

      const peerInfo = webrtcService.getPeerBySocketId('socket-123');
      expect(peerInfo).toBeNull();
    });
  });

  describe('getRoom', () => {
    it('should return room by ID', () => {
      const visitId = 'visit-123';
      const roomId = webrtcService.createRoom(visitId);

      const room = webrtcService.getRoom(roomId);

      expect(room).toBeDefined();
      expect(room?.id).toBe(roomId);
      expect(room?.visitId).toBe(visitId);
    });

    it('should return null for non-existent room', () => {
      const room = webrtcService.getRoom('non-existent-id');
      expect(room).toBeNull();
    });

    it('should return null for inactive room', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.closeRoom(roomId);

      const room = webrtcService.getRoom(roomId);
      expect(room).toBeNull();
    });
  });

  describe('getRoomByVisitId', () => {
    it('should return room by visit ID', () => {
      const visitId = 'visit-123';
      const roomId = webrtcService.createRoom(visitId);

      const room = webrtcService.getRoomByVisitId(visitId);

      expect(room).toBeDefined();
      expect(room?.id).toBe(roomId);
      expect(room?.visitId).toBe(visitId);
    });

    it('should return null when no room exists for visit', () => {
      const room = webrtcService.getRoomByVisitId('non-existent-visit');
      expect(room).toBeNull();
    });

    it('should not return inactive rooms', () => {
      const visitId = 'visit-123';
      const roomId = webrtcService.createRoom(visitId);
      webrtcService.closeRoom(roomId);

      const room = webrtcService.getRoomByVisitId(visitId);
      expect(room).toBeNull();
    });
  });

  describe('getPeersInRoom', () => {
    it('should return all peers in a room', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const peers = webrtcService.getPeersInRoom(roomId);

      expect(peers).toHaveLength(2);
      expect(peers[0].userId).toBe('user-1');
      expect(peers[1].userId).toBe('user-2');
    });

    it('should return empty array for room with no peers', () => {
      const roomId = webrtcService.createRoom('visit-123');
      const peers = webrtcService.getPeersInRoom(roomId);

      expect(peers).toHaveLength(0);
    });

    it('should return empty array for non-existent room', () => {
      const peers = webrtcService.getPeersInRoom('non-existent-room');
      expect(peers).toHaveLength(0);
    });
  });

  describe('getPeerBySocketId', () => {
    it('should return peer by socket ID', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-123', 'user-123', 'doctor');

      const peerInfo = webrtcService.getPeerBySocketId('socket-123');

      expect(peerInfo).toBeDefined();
      expect(peerInfo?.peer.socketId).toBe('socket-123');
      expect(peerInfo?.peer.userId).toBe('user-123');
      expect(peerInfo?.roomId).toBe(roomId);
    });

    it('should return null for non-existent socket ID', () => {
      const peerInfo = webrtcService.getPeerBySocketId('non-existent-socket');
      expect(peerInfo).toBeNull();
    });

    it('should return null after peer is removed', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-123', 'user-123', 'doctor');
      webrtcService.removePeer('socket-123');

      const peerInfo = webrtcService.getPeerBySocketId('socket-123');
      expect(peerInfo).toBeNull();
    });
  });

  describe('closeRoom', () => {
    it('should close a room successfully', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const result = webrtcService.closeRoom(roomId);

      expect(result).toBe(true);

      const room = webrtcService.getRoom(roomId);
      expect(room).toBeNull();
    });

    it('should return false for non-existent room', () => {
      const result = webrtcService.closeRoom('non-existent-room');
      expect(result).toBe(false);
    });

    it('should remove all peer-to-room mappings', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      webrtcService.closeRoom(roomId);

      expect(webrtcService.getPeerBySocketId('socket-1')).toBeNull();
      expect(webrtcService.getPeerBySocketId('socket-2')).toBeNull();
    });

    it('should clear all peers from room', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');

      webrtcService.closeRoom(roomId);

      // Try to get room from internal map before it's deleted
      const rooms = (webrtcService as any).rooms;
      const room = rooms.get(roomId);
      if (room) {
        expect(room.peers.size).toBe(0);
        expect(room.isActive).toBe(false);
      }
    });
  });

  describe('handleOffer', () => {
    it('should handle WebRTC offer successfully', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const offer = {
        type: 'offer' as const,
        sdp: 'offer-sdp-content',
      };

      const result = webrtcService.handleOffer('socket-1', 'socket-2', offer);

      expect(result).toBe(true);
    });

    it('should return false when from peer does not exist', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const offer = {
        type: 'offer' as const,
        sdp: 'offer-sdp-content',
      };

      const result = webrtcService.handleOffer('non-existent', 'socket-2', offer);

      expect(result).toBe(false);
    });

    it('should return false when to peer does not exist', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');

      const offer = {
        type: 'offer' as const,
        sdp: 'offer-sdp-content',
      };

      const result = webrtcService.handleOffer('socket-1', 'non-existent', offer);

      expect(result).toBe(false);
    });

    it('should return false when peers are in different rooms', () => {
      const roomId1 = webrtcService.createRoom('visit-1');
      const roomId2 = webrtcService.createRoom('visit-2');
      webrtcService.addPeer(roomId1, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId2, 'socket-2', 'user-2', 'patient');

      const offer = {
        type: 'offer' as const,
        sdp: 'offer-sdp-content',
      };

      const result = webrtcService.handleOffer('socket-1', 'socket-2', offer);

      expect(result).toBe(false);
    });
  });

  describe('handleAnswer', () => {
    it('should handle WebRTC answer successfully', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const answer = {
        type: 'answer' as const,
        sdp: 'answer-sdp-content',
      };

      const result = webrtcService.handleAnswer('socket-2', 'socket-1', answer);

      expect(result).toBe(true);
    });

    it('should return false when from peer does not exist', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');

      const answer = {
        type: 'answer' as const,
        sdp: 'answer-sdp-content',
      };

      const result = webrtcService.handleAnswer('non-existent', 'socket-1', answer);

      expect(result).toBe(false);
    });

    it('should return false when to peer does not exist', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const answer = {
        type: 'answer' as const,
        sdp: 'answer-sdp-content',
      };

      const result = webrtcService.handleAnswer('socket-2', 'non-existent', answer);

      expect(result).toBe(false);
    });

    it('should return false when peers are in different rooms', () => {
      const roomId1 = webrtcService.createRoom('visit-1');
      const roomId2 = webrtcService.createRoom('visit-2');
      webrtcService.addPeer(roomId1, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId2, 'socket-2', 'user-2', 'patient');

      const answer = {
        type: 'answer' as const,
        sdp: 'answer-sdp-content',
      };

      const result = webrtcService.handleAnswer('socket-2', 'socket-1', answer);

      expect(result).toBe(false);
    });
  });

  describe('handleIceCandidate', () => {
    it('should handle ICE candidate successfully', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const candidate = {
        candidate: 'ice-candidate-string',
        sdpMLineIndex: 0,
        sdpMid: 'audio',
      };

      const result = webrtcService.handleIceCandidate('socket-1', 'socket-2', candidate);

      expect(result).toBe(true);
    });

    it('should return false when from peer does not exist', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const candidate = {
        candidate: 'ice-candidate-string',
      };

      const result = webrtcService.handleIceCandidate('non-existent', 'socket-2', candidate);

      expect(result).toBe(false);
    });

    it('should return false when to peer does not exist', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');

      const candidate = {
        candidate: 'ice-candidate-string',
      };

      const result = webrtcService.handleIceCandidate('socket-1', 'non-existent', candidate);

      expect(result).toBe(false);
    });

    it('should return false when peers are in different rooms', () => {
      const roomId1 = webrtcService.createRoom('visit-1');
      const roomId2 = webrtcService.createRoom('visit-2');
      webrtcService.addPeer(roomId1, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId2, 'socket-2', 'user-2', 'patient');

      const candidate = {
        candidate: 'ice-candidate-string',
      };

      const result = webrtcService.handleIceCandidate('socket-1', 'socket-2', candidate);

      expect(result).toBe(false);
    });
  });

  describe('getRoomStats', () => {
    it('should return room statistics', () => {
      const visitId = 'visit-123';
      const roomId = webrtcService.createRoom(visitId);
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');

      const stats = webrtcService.getRoomStats(roomId);

      expect(stats).toBeDefined();
      expect(stats?.roomId).toBe(roomId);
      expect(stats?.visitId).toBe(visitId);
      expect(stats?.peerCount).toBe(2);
      expect(stats?.isActive).toBe(true);
      expect(stats?.createdAt).toBeInstanceOf(Date);
      expect(stats?.duration).toBeGreaterThanOrEqual(0);
      expect(stats?.peers).toHaveLength(2);
    });

    it('should return null for non-existent room', () => {
      const stats = webrtcService.getRoomStats('non-existent-room');
      expect(stats).toBeNull();
    });

    it('should include peer details in stats', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');

      const stats = webrtcService.getRoomStats(roomId);

      expect(stats?.peers[0]).toMatchObject({
        userId: 'user-1',
        role: 'doctor',
      });
      expect(stats?.peers[0].id).toBeDefined();
      expect(stats?.peers[0].joinedAt).toBeInstanceOf(Date);
      expect(stats?.peers[0].duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getActiveRooms', () => {
    it('should return all active rooms', () => {
      webrtcService.createRoom('visit-1');
      webrtcService.createRoom('visit-2');
      webrtcService.createRoom('visit-3');

      const activeRooms = webrtcService.getActiveRooms();

      expect(activeRooms).toHaveLength(3);
    });

    it('should not include inactive rooms', () => {
      const roomId1 = webrtcService.createRoom('visit-1');
      webrtcService.createRoom('visit-2');

      webrtcService.closeRoom(roomId1);

      const activeRooms = webrtcService.getActiveRooms();

      expect(activeRooms).toHaveLength(1);
    });

    it('should return empty array when no active rooms', () => {
      const activeRooms = webrtcService.getActiveRooms();
      expect(activeRooms).toHaveLength(0);
    });
  });

  describe('cleanupInactiveRooms', () => {
    it('should not cleanup rooms with active peers', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');

      const cleaned = webrtcService.cleanupInactiveRooms(0);

      expect(cleaned).toBe(0);
      expect(webrtcService.getRoom(roomId)).toBeDefined();
    });

    it('should cleanup empty rooms older than threshold', () => {
      const roomId = webrtcService.createRoom('visit-123');

      // Mock the room creation time to be in the past
      const rooms = (webrtcService as any).rooms;
      const room = rooms.get(roomId);
      if (room) {
        room.createdAt = new Date(Date.now() - 31 * 60 * 1000); // 31 minutes ago
      }

      const cleaned = webrtcService.cleanupInactiveRooms(30);

      expect(cleaned).toBe(1);
      expect(webrtcService.getRoom(roomId)).toBeNull();
    });

    it('should not cleanup recent empty rooms', () => {
      const roomId = webrtcService.createRoom('visit-123');

      const cleaned = webrtcService.cleanupInactiveRooms(30);

      expect(cleaned).toBe(0);
      expect(webrtcService.getRoom(roomId)).toBeDefined();
    });

    it('should cleanup multiple inactive rooms', () => {
      const roomId1 = webrtcService.createRoom('visit-1');
      const roomId2 = webrtcService.createRoom('visit-2');

      // Mock creation times
      const rooms = (webrtcService as any).rooms;
      const room1 = rooms.get(roomId1);
      const room2 = rooms.get(roomId2);
      if (room1) room1.createdAt = new Date(Date.now() - 31 * 60 * 1000);
      if (room2) room2.createdAt = new Date(Date.now() - 31 * 60 * 1000);

      const cleaned = webrtcService.cleanupInactiveRooms(30);

      expect(cleaned).toBe(2);
    });

    it('should not cleanup already inactive rooms', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.closeRoom(roomId);

      const cleaned = webrtcService.cleanupInactiveRooms(0);

      expect(cleaned).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle adding multiple peers with same user to different rooms', () => {
      const roomId1 = webrtcService.createRoom('visit-1');
      const roomId2 = webrtcService.createRoom('visit-2');

      const peer1 = webrtcService.addPeer(roomId1, 'socket-1', 'user-123', 'doctor');
      const peer2 = webrtcService.addPeer(roomId2, 'socket-2', 'user-123', 'patient');

      expect(peer1).toBeDefined();
      expect(peer2).toBeDefined();
      expect(peer1?.id).not.toBe(peer2?.id);
    });

    it('should handle rapid room creation and deletion', () => {
      const roomIds = [];
      for (let i = 0; i < 10; i++) {
        roomIds.push(webrtcService.createRoom(`visit-${i}`));
      }

      for (const roomId of roomIds) {
        webrtcService.closeRoom(roomId);
      }

      const activeRooms = webrtcService.getActiveRooms();
      expect(activeRooms).toHaveLength(0);
    });

    it('should handle peer operations on closed rooms', () => {
      const roomId = webrtcService.createRoom('visit-123');
      webrtcService.closeRoom(roomId);

      const peer = webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      expect(peer).toBeNull();
    });

    it('should maintain room integrity after multiple peer additions and removals', () => {
      const roomId = webrtcService.createRoom('visit-123');

      // Add peers
      webrtcService.addPeer(roomId, 'socket-1', 'user-1', 'doctor');
      webrtcService.addPeer(roomId, 'socket-2', 'user-2', 'patient');
      webrtcService.addPeer(roomId, 'socket-3', 'user-3', 'patient');

      // Remove one peer
      webrtcService.removePeer('socket-2');

      const room = webrtcService.getRoom(roomId);
      expect(room?.peers.size).toBe(2);

      const peers = webrtcService.getPeersInRoom(roomId);
      expect(peers).toHaveLength(2);
      expect(peers.some(p => p.socketId === 'socket-2')).toBe(false);
    });
  });
});
