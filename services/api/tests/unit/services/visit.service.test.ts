import { describe, it, expect, beforeEach, vi } from 'vitest';
import { visitService } from '../../../src/services/visit.service.js';
import { NotFoundError, BadRequestError } from '../../../src/utils/errors.js';
import { prisma } from '../../../src/lib/prisma.js';

// Mock Prisma client
vi.mock('../../../src/lib/prisma.js', () => ({
  prisma: {
    visit: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    chatMessage: {
      create: vi.fn(),
    },
  },
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123'),
}));

describe('VisitService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startVisit', () => {
    it('should start a virtual visit successfully', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.create).mockResolvedValue(mockVisit);

      const result = await visitService.startVisit('appointment-123', 'user-123');

      expect(prisma.visit.create).toHaveBeenCalledWith({
        data: {
          appointmentId: 'appointment-123',
          sessionToken: 'mock-uuid-123',
          status: 'in_progress',
          startedAt: expect.any(Date),
        },
      });

      expect(result).toEqual({
        visitId: 'visit-123',
        sessionToken: 'mock-uuid-123',
        startedAt: mockVisit.startedAt.toISOString(),
      });
    });

    it('should generate unique session token', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.create).mockResolvedValue(mockVisit);

      const result = await visitService.startVisit('appointment-123', 'user-123');

      expect(result.sessionToken).toBe('mock-uuid-123');
    });

    it('should set status to in_progress', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.create).mockResolvedValue(mockVisit);

      await visitService.startVisit('appointment-123', 'user-123');

      expect(prisma.visit.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: 'in_progress',
        }),
      });
    });

    it('should handle database errors', async () => {
      vi.mocked(prisma.visit.create).mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(
        visitService.startVisit('appointment-123', 'user-123')
      ).rejects.toThrow('Database connection error');
    });

    it('should record startedAt timestamp', async () => {
      const startTime = new Date('2025-01-15T10:00:00Z');
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: startTime,
        endedAt: null,
      };

      vi.mocked(prisma.visit.create).mockResolvedValue(mockVisit);

      const result = await visitService.startVisit('appointment-123', 'user-123');

      expect(result.startedAt).toBe(startTime.toISOString());
    });
  });

  describe('endVisit', () => {
    it('should end a virtual visit successfully', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const mockUpdatedVisit = {
        ...mockVisit,
        status: 'completed',
        endedAt: new Date('2025-01-15T10:30:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.visit.update).mockResolvedValue(mockUpdatedVisit);

      const result = await visitService.endVisit('visit-123', 'user-123');

      expect(prisma.visit.findUnique).toHaveBeenCalledWith({
        where: { id: 'visit-123' },
      });

      expect(prisma.visit.update).toHaveBeenCalledWith({
        where: { id: 'visit-123' },
        data: {
          status: 'completed',
          endedAt: expect.any(Date),
        },
      });

      expect(result.status).toBe('completed');
      expect(result.visitId).toBe('visit-123');
      expect(result.endedAt).toBeDefined();
    });

    it.skip('should calculate visit duration correctly', async () => {
      const startTime = new Date('2025-01-15T10:00:00Z');
      const endTime = new Date('2025-01-15T10:30:00Z'); // 30 minutes later

      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: startTime,
        endedAt: null,
      };

      const mockUpdatedVisit = {
        ...mockVisit,
        status: 'completed',
        endedAt: endTime,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.visit.update).mockResolvedValue(mockUpdatedVisit);

      const result = await visitService.endVisit('visit-123', 'user-123');

      // Duration should be 30 minutes = 1800 seconds
      expect(result.duration).toBe(1800);
    });

    it('should return 0 duration when startedAt is null', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: null,
        endedAt: null,
      };

      const mockUpdatedVisit = {
        ...mockVisit,
        status: 'completed',
        endedAt: new Date('2025-01-15T10:30:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.visit.update).mockResolvedValue(mockUpdatedVisit);

      const result = await visitService.endVisit('visit-123', 'user-123');

      expect(result.duration).toBe(0);
    });

    it('should throw NotFoundError when visit does not exist', async () => {
      vi.mocked(prisma.visit.findUnique).mockResolvedValue(null);

      await expect(
        visitService.endVisit('non-existent-id', 'user-123')
      ).rejects.toThrow(NotFoundError);

      await expect(
        visitService.endVisit('non-existent-id', 'user-123')
      ).rejects.toThrow('Visit not found');

      expect(prisma.visit.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError when visit is not in progress', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'completed',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: new Date('2025-01-15T10:30:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);

      await expect(
        visitService.endVisit('visit-123', 'user-123')
      ).rejects.toThrow(BadRequestError);

      await expect(
        visitService.endVisit('visit-123', 'user-123')
      ).rejects.toThrow('Visit is not in progress');

      expect(prisma.visit.update).not.toHaveBeenCalled();
    });

    it('should handle cancelled visits', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'cancelled',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);

      await expect(
        visitService.endVisit('visit-123', 'user-123')
      ).rejects.toThrow(BadRequestError);
    });

    it('should include all timestamps in response', async () => {
      const startTime = new Date('2025-01-15T10:00:00Z');
      const endTime = new Date('2025-01-15T10:30:00Z');

      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: startTime,
        endedAt: null,
      };

      const mockUpdatedVisit = {
        ...mockVisit,
        status: 'completed',
        endedAt: endTime,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.visit.update).mockResolvedValue(mockUpdatedVisit);

      const result = await visitService.endVisit('visit-123', 'user-123');

      expect(result.startedAt).toBe(startTime.toISOString());
      expect(result.endedAt).toBe(endTime.toISOString());
    });
  });

  describe('sendChatMessage', () => {
    it('should send a chat message successfully', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const mockChatMessage = {
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: 'Hello, doctor!',
        attachments: [],
        timestamp: new Date('2025-01-15T10:05:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockResolvedValue(mockChatMessage);

      const result = await visitService.sendChatMessage(
        'visit-123',
        'user-123',
        'Hello, doctor!'
      );

      expect(prisma.visit.findUnique).toHaveBeenCalledWith({
        where: { id: 'visit-123' },
      });

      expect(prisma.chatMessage.create).toHaveBeenCalledWith({
        data: {
          visitId: 'visit-123',
          senderId: 'user-123',
          message: 'Hello, doctor!',
          attachments: [],
        },
      });

      expect(result).toEqual({
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: 'Hello, doctor!',
        attachments: [],
        timestamp: mockChatMessage.timestamp.toISOString(),
      });
    });

    it('should send chat message with attachments', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const attachments = ['file1.pdf', 'file2.jpg'];
      const mockChatMessage = {
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: 'Here are the documents',
        attachments,
        timestamp: new Date('2025-01-15T10:05:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockResolvedValue(mockChatMessage);

      const result = await visitService.sendChatMessage(
        'visit-123',
        'user-123',
        'Here are the documents',
        attachments
      );

      expect(prisma.chatMessage.create).toHaveBeenCalledWith({
        data: {
          visitId: 'visit-123',
          senderId: 'user-123',
          message: 'Here are the documents',
          attachments,
        },
      });

      expect(result.attachments).toEqual(attachments);
    });

    it('should handle empty attachments array', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const mockChatMessage = {
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: 'Hello',
        attachments: [],
        timestamp: new Date('2025-01-15T10:05:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockResolvedValue(mockChatMessage);

      const result = await visitService.sendChatMessage(
        'visit-123',
        'user-123',
        'Hello',
        []
      );

      expect(result.attachments).toEqual([]);
    });

    it('should throw NotFoundError when visit does not exist', async () => {
      vi.mocked(prisma.visit.findUnique).mockResolvedValue(null);

      await expect(
        visitService.sendChatMessage('non-existent-id', 'user-123', 'Hello')
      ).rejects.toThrow(NotFoundError);

      await expect(
        visitService.sendChatMessage('non-existent-id', 'user-123', 'Hello')
      ).rejects.toThrow('Visit not found');

      expect(prisma.chatMessage.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError when visit is not in progress', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'completed',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: new Date('2025-01-15T10:30:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);

      await expect(
        visitService.sendChatMessage('visit-123', 'user-123', 'Hello')
      ).rejects.toThrow(BadRequestError);

      await expect(
        visitService.sendChatMessage('visit-123', 'user-123', 'Hello')
      ).rejects.toThrow('Visit is not in progress');

      expect(prisma.chatMessage.create).not.toHaveBeenCalled();
    });

    it('should handle cancelled visits', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'cancelled',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);

      await expect(
        visitService.sendChatMessage('visit-123', 'user-123', 'Hello')
      ).rejects.toThrow(BadRequestError);
    });

    it('should handle long messages', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const longMessage = 'A'.repeat(5000);
      const mockChatMessage = {
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: longMessage,
        attachments: [],
        timestamp: new Date('2025-01-15T10:05:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockResolvedValue(mockChatMessage);

      const result = await visitService.sendChatMessage(
        'visit-123',
        'user-123',
        longMessage
      );

      expect(result.message).toBe(longMessage);
      expect(result.message.length).toBe(5000);
    });

    it('should handle messages with special characters', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const specialMessage = "Hello! 你好 🏥 <script>alert('test')</script>";
      const mockChatMessage = {
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: specialMessage,
        attachments: [],
        timestamp: new Date('2025-01-15T10:05:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockResolvedValue(mockChatMessage);

      const result = await visitService.sendChatMessage(
        'visit-123',
        'user-123',
        specialMessage
      );

      expect(result.message).toBe(specialMessage);
    });

    it('should handle multiple attachments', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const attachments = [
        'file1.pdf',
        'file2.jpg',
        'file3.doc',
        'file4.png',
        'file5.xlsx',
      ];
      const mockChatMessage = {
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: 'Multiple files',
        attachments,
        timestamp: new Date('2025-01-15T10:05:00Z'),
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockResolvedValue(mockChatMessage);

      const result = await visitService.sendChatMessage(
        'visit-123',
        'user-123',
        'Multiple files',
        attachments
      );

      expect(result.attachments).toHaveLength(5);
      expect(result.attachments).toEqual(attachments);
    });

    it('should include timestamp in response', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      const timestamp = new Date('2025-01-15T10:05:00Z');
      const mockChatMessage = {
        id: 'message-123',
        visitId: 'visit-123',
        senderId: 'user-123',
        message: 'Hello',
        attachments: [],
        timestamp,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockResolvedValue(mockChatMessage);

      const result = await visitService.sendChatMessage(
        'visit-123',
        'user-123',
        'Hello'
      );

      expect(result.timestamp).toBe(timestamp.toISOString());
    });

    it('should handle database errors during message creation', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.chatMessage.create).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        visitService.sendChatMessage('visit-123', 'user-123', 'Hello')
      ).rejects.toThrow('Database error');
    });
  });

  describe('edge cases', () => {
    it('should handle rapid consecutive messages', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);

      const messages = ['Hello', 'How are you?', 'I need help'];
      const mockMessages = messages.map((msg, index) => ({
        id: `message-${index}`,
        visitId: 'visit-123',
        senderId: 'user-123',
        message: msg,
        attachments: [],
        timestamp: new Date(`2025-01-15T10:0${index}:00Z`),
      }));

      mockMessages.forEach((mockMsg) => {
        vi.mocked(prisma.chatMessage.create).mockResolvedValueOnce(mockMsg);
      });

      const results = await Promise.all(
        messages.map((msg) =>
          visitService.sendChatMessage('visit-123', 'user-123', msg)
        )
      );

      expect(results).toHaveLength(3);
      expect(results[0].message).toBe('Hello');
      expect(results[1].message).toBe('How are you?');
      expect(results[2].message).toBe('I need help');
    });

    it('should handle visit state transitions', async () => {
      const mockVisit = {
        id: 'visit-123',
        appointmentId: 'appointment-123',
        sessionToken: 'mock-uuid-123',
        status: 'in_progress',
        startedAt: new Date('2025-01-15T10:00:00Z'),
        endedAt: null,
      };

      vi.mocked(prisma.visit.findUnique).mockResolvedValue(mockVisit);
      vi.mocked(prisma.visit.update).mockResolvedValue({
        ...mockVisit,
        status: 'completed',
        endedAt: new Date('2025-01-15T10:30:00Z'),
      });

      // End the visit
      await visitService.endVisit('visit-123', 'user-123');

      // Try to send a message after visit ended
      vi.mocked(prisma.visit.findUnique).mockResolvedValue({
        ...mockVisit,
        status: 'completed',
        endedAt: new Date('2025-01-15T10:30:00Z'),
      });

      await expect(
        visitService.sendChatMessage('visit-123', 'user-123', 'Hello')
      ).rejects.toThrow(BadRequestError);
    });
  });
});
