/**
 * Unit Tests for CriticalFindingService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const instance = {
    criticalFinding: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    study: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  };

  function MockPrismaClient() {
    return instance;
  }

  return { mockPrismaInstance: instance, MockPrismaClient };
});

vi.mock('../../../src/generated/client', () => ({
  PrismaClient: MockPrismaClient,
}));

vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

import CriticalFindingService from '../../../src/services/criticalFindingService';
import { mockCriticalFinding, mockStudy } from '../helpers/fixtures';

describe('CriticalFindingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCriticalFinding', () => {
    it('should create a critical finding successfully', async () => {
      const createData = {
        studyId: 'study-123',
        finding: 'Pulmonary embolism detected',
        severity: 'CRITICAL' as const,
        category: 'pulmonary',
        reportedBy: 'Dr. Smith',
        notifiedTo: ['provider-123'],
      };

      mockPrismaInstance.criticalFinding.create.mockResolvedValue({
        ...mockCriticalFinding,
        ...createData,
      });
      mockPrismaInstance.study.findUnique.mockResolvedValue(mockStudy);
      mockPrismaInstance.criticalFinding.update.mockResolvedValue(mockCriticalFinding);

      const result = await CriticalFindingService.createCriticalFinding(createData);

      expect(mockPrismaInstance.criticalFinding.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toBeDefined();
      expect(result.finding).toContain('Pulmonary embolism');
    });

    it('should throw error when creation fails', async () => {
      mockPrismaInstance.criticalFinding.create.mockRejectedValue(new Error('Database error'));

      await expect(
        CriticalFindingService.createCriticalFinding({
          studyId: 'study-123',
          finding: 'Test finding',
          severity: 'CRITICAL' as const,
          category: 'test',
          reportedBy: 'Dr. Test',
          notifiedTo: ['provider-123'],
        })
      ).rejects.toThrow('Failed to create critical finding');
    });
  });

  describe('getCriticalFindingById', () => {
    it('should return critical finding when found', async () => {
      mockPrismaInstance.criticalFinding.findUnique.mockResolvedValue({
        ...mockCriticalFinding,
        study: {
          id: 'study-123',
          accessionNumber: 'ACC-123',
          patientName: 'John Doe',
          studyDate: new Date(),
          modality: 'CT',
        },
      });

      const result = await CriticalFindingService.getCriticalFindingById('finding-123');

      expect(mockPrismaInstance.criticalFinding.findUnique).toHaveBeenCalledWith({
        where: { id: 'finding-123' },
        include: {
          study: {
            select: {
              id: true,
              accessionNumber: true,
              patientName: true,
              studyDate: true,
              modality: true,
            },
          },
        },
      });
      expect(result).toBeDefined();
      expect(result.id).toBe('finding-123');
    });

    it('should throw error when finding not found', async () => {
      mockPrismaInstance.criticalFinding.findUnique.mockResolvedValue(null);

      await expect(
        CriticalFindingService.getCriticalFindingById('non-existent')
      ).rejects.toThrow('Critical finding not found');
    });
  });

  describe('getCriticalFindingsByStudy', () => {
    it('should return findings for a study', async () => {
      const findings = [
        mockCriticalFinding,
        { ...mockCriticalFinding, id: 'finding-456', finding: 'Another finding' },
      ];
      mockPrismaInstance.criticalFinding.findMany.mockResolvedValue(findings);

      const result = await CriticalFindingService.getCriticalFindingsByStudy('study-123');

      expect(mockPrismaInstance.criticalFinding.findMany).toHaveBeenCalledWith({
        where: { studyId: 'study-123' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no findings found', async () => {
      mockPrismaInstance.criticalFinding.findMany.mockResolvedValue([]);

      const result = await CriticalFindingService.getCriticalFindingsByStudy('study-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('updateCriticalFinding', () => {
    it('should update critical finding', async () => {
      const updateData = {
        followUpAction: 'Started treatment',
        followUpStatus: 'IN_PROGRESS',
      };

      mockPrismaInstance.criticalFinding.update.mockResolvedValue({
        ...mockCriticalFinding,
        ...updateData,
      });

      const result = await CriticalFindingService.updateCriticalFinding(
        'finding-123',
        updateData
      );

      expect(mockPrismaInstance.criticalFinding.update).toHaveBeenCalledWith({
        where: { id: 'finding-123' },
        data: updateData,
      });
      expect(result.followUpAction).toBe('Started treatment');
    });

    it('should auto-set acknowledgedAt when acknowledgedBy is provided', async () => {
      const updateData = {
        acknowledgedBy: 'Dr. Wilson',
      };

      mockPrismaInstance.criticalFinding.update.mockResolvedValue({
        ...mockCriticalFinding,
        ...updateData,
        acknowledgedAt: new Date(),
      });

      await CriticalFindingService.updateCriticalFinding('finding-123', updateData);

      const updateCall = mockPrismaInstance.criticalFinding.update.mock.calls[0][0];
      expect(updateCall.data.acknowledgedAt).toBeDefined();
    });

    it('should throw error when update fails', async () => {
      mockPrismaInstance.criticalFinding.update.mockRejectedValue(new Error('Database error'));

      await expect(
        CriticalFindingService.updateCriticalFinding('finding-123', { notes: 'test' })
      ).rejects.toThrow('Failed to update critical finding');
    });
  });

  describe('acknowledgeCriticalFinding', () => {
    it('should acknowledge a critical finding', async () => {
      const acknowledgedBy = 'Dr. Johnson';
      const acknowledgedAt = new Date();

      mockPrismaInstance.criticalFinding.update.mockResolvedValue({
        ...mockCriticalFinding,
        acknowledgedBy,
        acknowledgedAt,
      });

      const result = await CriticalFindingService.acknowledgeCriticalFinding(
        'finding-123',
        acknowledgedBy
      );

      expect(mockPrismaInstance.criticalFinding.update).toHaveBeenCalledWith({
        where: { id: 'finding-123' },
        data: {
          acknowledgedBy,
          acknowledgedAt: expect.any(Date),
        },
      });
      expect(result.acknowledgedBy).toBe(acknowledgedBy);
    });

    it('should throw error when acknowledgment fails', async () => {
      mockPrismaInstance.criticalFinding.update.mockRejectedValue(new Error('Database error'));

      await expect(
        CriticalFindingService.acknowledgeCriticalFinding('finding-123', 'Dr. Test')
      ).rejects.toThrow('Failed to acknowledge critical finding');
    });
  });

  describe('getPendingCriticalFindings', () => {
    it('should return paginated pending findings', async () => {
      const pendingFindings = [
        { ...mockCriticalFinding, acknowledgedBy: null },
        { ...mockCriticalFinding, id: 'finding-456', acknowledgedBy: null },
      ];

      mockPrismaInstance.criticalFinding.findMany.mockResolvedValue(pendingFindings);
      mockPrismaInstance.criticalFinding.count.mockResolvedValue(10);

      const result = await CriticalFindingService.getPendingCriticalFindings(1, 10);

      expect(mockPrismaInstance.criticalFinding.findMany).toHaveBeenCalledWith({
        where: { acknowledgedBy: null },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          study: {
            select: {
              accessionNumber: true,
              patientName: true,
              modality: true,
              studyDate: true,
            },
          },
        },
      });
      expect(result.findings).toHaveLength(2);
      expect(result.pagination.total).toBe(10);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should calculate correct pagination values', async () => {
      mockPrismaInstance.criticalFinding.findMany.mockResolvedValue([]);
      mockPrismaInstance.criticalFinding.count.mockResolvedValue(25);

      const result = await CriticalFindingService.getPendingCriticalFindings(2, 10);

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
    });

    it('should throw error when fetch fails', async () => {
      mockPrismaInstance.criticalFinding.findMany.mockRejectedValue(new Error('Database error'));

      await expect(
        CriticalFindingService.getPendingCriticalFindings(1, 10)
      ).rejects.toThrow('Failed to fetch pending critical findings');
    });
  });

  describe('getCriticalFindingsBySeverity', () => {
    it('should return findings filtered by severity', async () => {
      const criticalFindings = [mockCriticalFinding];

      mockPrismaInstance.criticalFinding.findMany.mockResolvedValue(criticalFindings);
      mockPrismaInstance.criticalFinding.count.mockResolvedValue(1);

      const result = await CriticalFindingService.getCriticalFindingsBySeverity(
        'CRITICAL',
        1,
        10
      );

      expect(mockPrismaInstance.criticalFinding.findMany).toHaveBeenCalledWith({
        where: { severity: 'CRITICAL' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          study: {
            select: {
              accessionNumber: true,
              patientName: true,
              modality: true,
              studyDate: true,
            },
          },
        },
      });
      expect(result.findings).toHaveLength(1);
    });

    it('should throw error when fetch fails', async () => {
      mockPrismaInstance.criticalFinding.findMany.mockRejectedValue(new Error('Database error'));

      await expect(
        CriticalFindingService.getCriticalFindingsBySeverity('CRITICAL', 1, 10)
      ).rejects.toThrow('Failed to fetch critical findings by severity');
    });
  });
});
