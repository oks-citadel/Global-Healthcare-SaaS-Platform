/**
 * Unit Tests for StudyService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudyService from '../../../src/services/studyService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockStudy, mockImagingOrder, mockCreateStudyInput } from '../helpers/fixtures';

// Mock the Prisma client
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
}));

// Mock logger
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('StudyService', () => {
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    vi.clearAllMocks();
  });

  describe('createStudy', () => {
    it('should create a study successfully', async () => {
      mockPrisma.study.create.mockResolvedValue(mockStudy);
      mockPrisma.imagingOrder.update.mockResolvedValue(mockImagingOrder);

      const result = await StudyService.createStudy(mockCreateStudyInput);

      expect(mockPrisma.study.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accessionNumber: expect.stringMatching(/^ACC-\d+-[A-Z0-9]+$/),
          studyInstanceUID: expect.stringMatching(/^1\.2\.840\.\d+\.\d+$/),
          orderId: mockCreateStudyInput.orderId,
        }),
      });
      expect(result).toBeDefined();
    });

    it('should generate unique accession number', async () => {
      mockPrisma.study.create.mockResolvedValue(mockStudy);
      mockPrisma.imagingOrder.update.mockResolvedValue(mockImagingOrder);

      await StudyService.createStudy(mockCreateStudyInput);

      const createCall = mockPrisma.study.create.mock.calls[0][0];
      expect(createCall.data.accessionNumber).toMatch(/^ACC-\d+-[A-Z0-9]+$/);
    });

    it('should generate DICOM Study Instance UID', async () => {
      mockPrisma.study.create.mockResolvedValue(mockStudy);
      mockPrisma.imagingOrder.update.mockResolvedValue(mockImagingOrder);

      await StudyService.createStudy(mockCreateStudyInput);

      const createCall = mockPrisma.study.create.mock.calls[0][0];
      expect(createCall.data.studyInstanceUID).toMatch(/^1\.2\.840\.\d+\.\d+$/);
    });

    it('should update order status to IN_PROGRESS', async () => {
      mockPrisma.study.create.mockResolvedValue(mockStudy);
      mockPrisma.imagingOrder.update.mockResolvedValue(mockImagingOrder);

      await StudyService.createStudy(mockCreateStudyInput);

      expect(mockPrisma.imagingOrder.update).toHaveBeenCalledWith({
        where: { id: mockCreateStudyInput.orderId },
        data: { status: 'IN_PROGRESS' },
      });
    });

    it('should throw AppError when creation fails', async () => {
      mockPrisma.study.create.mockRejectedValue(new Error('Database error'));

      await expect(StudyService.createStudy(mockCreateStudyInput))
        .rejects.toThrow('Failed to create study');
    });
  });

  describe('getStudies', () => {
    it('should return paginated studies', async () => {
      mockPrisma.study.findMany.mockResolvedValue([mockStudy]);
      mockPrisma.study.count.mockResolvedValue(10);

      const result = await StudyService.getStudies({
        page: 1,
        limit: 10,
      });

      expect(result.studies).toHaveLength(1);
      expect(result.pagination.total).toBe(10);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should apply filters correctly', async () => {
      mockPrisma.study.findMany.mockResolvedValue([mockStudy]);
      mockPrisma.study.count.mockResolvedValue(1);

      await StudyService.getStudies({
        patientId: 'patient-123',
        modality: 'CT',
        status: 'COMPLETED',
      });

      const findCall = mockPrisma.study.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe('patient-123');
      expect(findCall.where.modality).toBe('CT');
      expect(findCall.where.status).toBe('COMPLETED');
    });

    it('should filter by date range', async () => {
      mockPrisma.study.findMany.mockResolvedValue([]);
      mockPrisma.study.count.mockResolvedValue(0);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      await StudyService.getStudies({ startDate, endDate });

      const findCall = mockPrisma.study.findMany.mock.calls[0][0];
      expect(findCall.where.studyDate.gte).toEqual(startDate);
      expect(findCall.where.studyDate.lte).toEqual(endDate);
    });

    it('should order by studyDate descending', async () => {
      mockPrisma.study.findMany.mockResolvedValue([]);
      mockPrisma.study.count.mockResolvedValue(0);

      await StudyService.getStudies({});

      const findCall = mockPrisma.study.findMany.mock.calls[0][0];
      expect(findCall.orderBy.studyDate).toBe('desc');
    });

    it('should include order and reports', async () => {
      mockPrisma.study.findMany.mockResolvedValue([]);
      mockPrisma.study.count.mockResolvedValue(0);

      await StudyService.getStudies({});

      const findCall = mockPrisma.study.findMany.mock.calls[0][0];
      expect(findCall.include.order).toBeDefined();
      expect(findCall.include.reports).toBeDefined();
    });
  });

  describe('getStudyById', () => {
    it('should return study with all related data', async () => {
      mockPrisma.study.findUnique.mockResolvedValue({
        ...mockStudy,
        order: mockImagingOrder,
        images: [],
        reports: [],
        criticalFindings: [],
      });

      const result = await StudyService.getStudyById('study-123');

      expect(mockPrisma.study.findUnique).toHaveBeenCalledWith({
        where: { id: 'study-123' },
        include: {
          order: true,
          images: {
            orderBy: {
              seriesNumber: 'asc',
            },
          },
          reports: true,
          criticalFindings: true,
        },
      });
      expect(result).toBeDefined();
    });

    it('should throw AppError when study not found', async () => {
      mockPrisma.study.findUnique.mockResolvedValue(null);

      await expect(StudyService.getStudyById('non-existent'))
        .rejects.toThrow('Study not found');
    });
  });

  describe('updateStudy', () => {
    it('should update study fields', async () => {
      const updatedStudy = { ...mockStudy, numberOfSeries: 5 };
      mockPrisma.study.update.mockResolvedValue(updatedStudy);

      const result = await StudyService.updateStudy('study-123', {
        numberOfSeries: 5,
      });

      expect(mockPrisma.study.update).toHaveBeenCalledWith({
        where: { id: 'study-123' },
        data: { numberOfSeries: 5 },
      });
      expect(result.numberOfSeries).toBe(5);
    });
  });

  describe('updateStudyStatus', () => {
    it('should update study status', async () => {
      mockPrisma.study.update.mockResolvedValue({
        ...mockStudy,
        status: 'FINAL',
      });
      mockPrisma.study.findMany.mockResolvedValue([
        { ...mockStudy, status: 'FINAL' },
      ]);
      mockPrisma.imagingOrder.update.mockResolvedValue(mockImagingOrder);

      const result = await StudyService.updateStudyStatus('study-123', 'FINAL');

      expect(result.status).toBe('FINAL');
    });

    it('should update order status when all studies completed', async () => {
      mockPrisma.study.update.mockResolvedValue({
        ...mockStudy,
        status: 'COMPLETED',
      });
      mockPrisma.study.findMany.mockResolvedValue([
        { ...mockStudy, status: 'COMPLETED' },
        { ...mockStudy, id: 'study-456', status: 'COMPLETED' },
      ]);
      mockPrisma.imagingOrder.update.mockResolvedValue({
        ...mockImagingOrder,
        status: 'COMPLETED',
      });

      await StudyService.updateStudyStatus('study-123', 'COMPLETED');

      expect(mockPrisma.imagingOrder.update).toHaveBeenCalledWith({
        where: { id: mockStudy.orderId },
        data: { status: 'COMPLETED' },
      });
    });

    it('should not update order status when not all studies completed', async () => {
      mockPrisma.study.update.mockResolvedValue({
        ...mockStudy,
        status: 'COMPLETED',
      });
      mockPrisma.study.findMany.mockResolvedValue([
        { ...mockStudy, status: 'COMPLETED' },
        { ...mockStudy, id: 'study-456', status: 'IN_PROGRESS' },
      ]);

      await StudyService.updateStudyStatus('study-123', 'COMPLETED');

      // Should be called once for the status update, but not for order completion
      expect(mockPrisma.imagingOrder.update).not.toHaveBeenCalled();
    });
  });

  describe('getStudyByAccessionNumber', () => {
    it('should return study by accession number', async () => {
      mockPrisma.study.findUnique.mockResolvedValue(mockStudy);

      const result = await StudyService.getStudyByAccessionNumber('ACC-1234567890-ABC123');

      expect(mockPrisma.study.findUnique).toHaveBeenCalledWith({
        where: { accessionNumber: 'ACC-1234567890-ABC123' },
        include: {
          order: true,
          images: true,
          reports: true,
        },
      });
      expect(result).toBeDefined();
    });

    it('should throw AppError when study not found', async () => {
      mockPrisma.study.findUnique.mockResolvedValue(null);

      await expect(StudyService.getStudyByAccessionNumber('invalid'))
        .rejects.toThrow('Study not found');
    });
  });

  describe('deleteStudy', () => {
    it('should delete study successfully', async () => {
      mockPrisma.study.delete.mockResolvedValue(mockStudy);

      await StudyService.deleteStudy('study-123');

      expect(mockPrisma.study.delete).toHaveBeenCalledWith({
        where: { id: 'study-123' },
      });
    });

    it('should throw AppError when deletion fails', async () => {
      mockPrisma.study.delete.mockRejectedValue(new Error('Database error'));

      await expect(StudyService.deleteStudy('study-123'))
        .rejects.toThrow('Failed to delete study');
    });
  });
});
