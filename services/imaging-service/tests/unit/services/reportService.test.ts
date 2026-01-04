/**
 * Unit Tests for ReportService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReportService from '../../../src/services/reportService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockRadiologyReport, mockFinalReport, mockStudy, mockCreateReportInput } from '../helpers/fixtures';

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

describe('ReportService', () => {
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    vi.clearAllMocks();
  });

  describe('createReport', () => {
    it('should create a radiology report successfully', async () => {
      mockPrisma.radiologyReport.create.mockResolvedValue(mockRadiologyReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      const result = await ReportService.createReport(mockCreateReportInput);

      expect(mockPrisma.radiologyReport.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          reportNumber: expect.stringMatching(/^RPT-\d+-[A-Z0-9]+$/),
          status: 'PRELIMINARY',
          preliminaryDate: expect.any(Date),
          studyId: mockCreateReportInput.studyId,
        }),
      });
      expect(result).toBeDefined();
    });

    it('should generate unique report number', async () => {
      mockPrisma.radiologyReport.create.mockResolvedValue(mockRadiologyReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      await ReportService.createReport(mockCreateReportInput);

      const createCall = mockPrisma.radiologyReport.create.mock.calls[0][0];
      expect(createCall.data.reportNumber).toMatch(/^RPT-\d+-[A-Z0-9]+$/);
    });

    it('should default status to PRELIMINARY', async () => {
      mockPrisma.radiologyReport.create.mockResolvedValue(mockRadiologyReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      await ReportService.createReport(mockCreateReportInput);

      const createCall = mockPrisma.radiologyReport.create.mock.calls[0][0];
      expect(createCall.data.status).toBe('PRELIMINARY');
    });

    it('should update study status to PRELIMINARY', async () => {
      mockPrisma.radiologyReport.create.mockResolvedValue(mockRadiologyReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      await ReportService.createReport(mockCreateReportInput);

      expect(mockPrisma.study.update).toHaveBeenCalledWith({
        where: { id: mockCreateReportInput.studyId },
        data: { status: 'PRELIMINARY' },
      });
    });

    it('should throw AppError when creation fails', async () => {
      mockPrisma.radiologyReport.create.mockRejectedValue(new Error('Database error'));

      await expect(ReportService.createReport(mockCreateReportInput))
        .rejects.toThrow('Failed to create report');
    });
  });

  describe('getReportById', () => {
    it('should return report with study information', async () => {
      mockPrisma.radiologyReport.findUnique.mockResolvedValue({
        ...mockRadiologyReport,
        study: mockStudy,
      });

      const result = await ReportService.getReportById('report-123');

      expect(mockPrisma.radiologyReport.findUnique).toHaveBeenCalledWith({
        where: { id: 'report-123' },
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
    });

    it('should throw AppError when report not found', async () => {
      mockPrisma.radiologyReport.findUnique.mockResolvedValue(null);

      await expect(ReportService.getReportById('non-existent'))
        .rejects.toThrow('Report not found');
    });
  });

  describe('getReportByStudyId', () => {
    it('should return all reports for a study', async () => {
      mockPrisma.radiologyReport.findMany.mockResolvedValue([
        mockRadiologyReport,
        { ...mockRadiologyReport, id: 'report-456' },
      ]);

      const result = await ReportService.getReportByStudyId('study-123');

      expect(mockPrisma.radiologyReport.findMany).toHaveBeenCalledWith({
        where: { studyId: 'study-123' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no reports exist', async () => {
      mockPrisma.radiologyReport.findMany.mockResolvedValue([]);

      const result = await ReportService.getReportByStudyId('study-no-reports');

      expect(result).toHaveLength(0);
    });
  });

  describe('updateReport', () => {
    it('should update report fields', async () => {
      const updatedReport = {
        ...mockRadiologyReport,
        impression: 'Updated impression',
      };
      mockPrisma.radiologyReport.update.mockResolvedValue(updatedReport);

      const result = await ReportService.updateReport('report-123', {
        impression: 'Updated impression',
      });

      expect(mockPrisma.radiologyReport.update).toHaveBeenCalled();
      expect(result.impression).toBe('Updated impression');
    });

    it('should set finalizedDate when status is FINAL', async () => {
      mockPrisma.radiologyReport.update.mockResolvedValue(mockFinalReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      await ReportService.updateReport('report-123', {
        status: 'FINAL',
      });

      const updateCall = mockPrisma.radiologyReport.update.mock.calls[0][0];
      expect(updateCall.data.finalizedDate).toBeInstanceOf(Date);
    });

    it('should set amendedDate when status is AMENDED', async () => {
      mockPrisma.radiologyReport.update.mockResolvedValue({
        ...mockRadiologyReport,
        status: 'AMENDED',
        amendedDate: new Date(),
      });

      await ReportService.updateReport('report-123', {
        status: 'AMENDED',
      });

      const updateCall = mockPrisma.radiologyReport.update.mock.calls[0][0];
      expect(updateCall.data.amendedDate).toBeInstanceOf(Date);
    });

    it('should update study status when report finalized', async () => {
      mockPrisma.radiologyReport.update.mockResolvedValue(mockFinalReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      await ReportService.updateReport('report-123', {
        status: 'FINAL',
      });

      expect(mockPrisma.study.update).toHaveBeenCalledWith({
        where: { id: mockRadiologyReport.studyId },
        data: { status: 'FINAL' },
      });
    });
  });

  describe('signReport', () => {
    it('should sign and finalize report', async () => {
      mockPrisma.radiologyReport.update.mockResolvedValue(mockFinalReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      const result = await ReportService.signReport('report-123', 'Dr. Jane Wilson');

      expect(mockPrisma.radiologyReport.update).toHaveBeenCalledWith({
        where: { id: 'report-123' },
        data: {
          signedBy: 'Dr. Jane Wilson',
          signedAt: expect.any(Date),
          status: 'FINAL',
          finalizedDate: expect.any(Date),
        },
      });
      expect(result.status).toBe('FINAL');
    });

    it('should update study status to FINAL', async () => {
      mockPrisma.radiologyReport.update.mockResolvedValue(mockFinalReport);
      mockPrisma.study.update.mockResolvedValue(mockStudy);

      await ReportService.signReport('report-123', 'Dr. Jane Wilson');

      expect(mockPrisma.study.update).toHaveBeenCalledWith({
        where: { id: mockFinalReport.studyId },
        data: { status: 'FINAL' },
      });
    });

    it('should throw AppError when signing fails', async () => {
      mockPrisma.radiologyReport.update.mockRejectedValue(new Error('Database error'));

      await expect(ReportService.signReport('report-123', 'Dr. Jane Wilson'))
        .rejects.toThrow('Failed to sign report');
    });
  });

  describe('amendReport', () => {
    it('should amend report with reason', async () => {
      const amendedReport = {
        ...mockRadiologyReport,
        status: 'AMENDED',
        amendedDate: new Date(),
        amendmentReason: 'Correction to findings',
      };
      mockPrisma.radiologyReport.update.mockResolvedValue(amendedReport);

      const result = await ReportService.amendReport(
        'report-123',
        'Correction to findings',
        { findings: 'Updated findings' }
      );

      expect(mockPrisma.radiologyReport.update).toHaveBeenCalledWith({
        where: { id: 'report-123' },
        data: {
          findings: 'Updated findings',
          status: 'AMENDED',
          amendedDate: expect.any(Date),
          amendmentReason: 'Correction to findings',
        },
      });
      expect(result.status).toBe('AMENDED');
    });
  });

  describe('getReportsByRadiologist', () => {
    it('should return paginated reports for radiologist', async () => {
      mockPrisma.radiologyReport.findMany.mockResolvedValue([mockRadiologyReport]);
      mockPrisma.radiologyReport.count.mockResolvedValue(10);

      const result = await ReportService.getReportsByRadiologist('radiologist-123', 1, 10);

      expect(mockPrisma.radiologyReport.findMany).toHaveBeenCalledWith({
        where: { radiologistId: 'radiologist-123' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: expect.anything(),
      });
      expect(result.reports).toHaveLength(1);
      expect(result.pagination.total).toBe(10);
    });

    it('should calculate pagination correctly', async () => {
      mockPrisma.radiologyReport.findMany.mockResolvedValue([]);
      mockPrisma.radiologyReport.count.mockResolvedValue(0);

      await ReportService.getReportsByRadiologist('radiologist-123', 3, 20);

      const findCall = mockPrisma.radiologyReport.findMany.mock.calls[0][0];
      expect(findCall.skip).toBe(40);
      expect(findCall.take).toBe(20);
    });
  });

  describe('deleteReport', () => {
    it('should delete preliminary report', async () => {
      mockPrisma.radiologyReport.findUnique.mockResolvedValue(mockRadiologyReport);
      mockPrisma.radiologyReport.delete.mockResolvedValue(mockRadiologyReport);

      await ReportService.deleteReport('report-123');

      expect(mockPrisma.radiologyReport.delete).toHaveBeenCalledWith({
        where: { id: 'report-123' },
      });
    });

    it('should throw AppError when report not found', async () => {
      mockPrisma.radiologyReport.findUnique.mockResolvedValue(null);

      await expect(ReportService.deleteReport('non-existent'))
        .rejects.toThrow('Report not found');
    });

    it('should throw AppError when trying to delete non-preliminary report', async () => {
      mockPrisma.radiologyReport.findUnique.mockResolvedValue(mockFinalReport);

      await expect(ReportService.deleteReport('report-final-123'))
        .rejects.toThrow('Only preliminary reports can be deleted');
    });
  });
});
