/**
 * Unit Tests for ReportService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportService } from '../../../src/services/ReportService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockLabOrder, mockLabTest, mockLabResult } from '../helpers/fixtures';

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
  let reportService: ReportService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    reportService = new ReportService(mockPrisma as any);
    vi.clearAllMocks();
  });

  describe('generateLabReport', () => {
    it('should generate a lab report for a completed order', async () => {
      const completedOrder = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        tests: [
          {
            ...mockLabTest,
            results: [mockLabResult],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(completedOrder);
      mockPrisma.labOrder.update.mockResolvedValue({
        ...completedOrder,
        reportUrl: 'https://storage.example.com/reports/test.pdf',
      });

      const result = await reportService.generateLabReport('order-123');

      expect(result).toContain('https://storage');
      expect(mockPrisma.labOrder.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: { reportUrl: expect.any(String) },
      });
    });

    it('should throw error when order not found', async () => {
      mockPrisma.labOrder.findUnique.mockResolvedValue(null);

      await expect(reportService.generateLabReport('non-existent')).rejects.toThrow(
        'Order not found'
      );
    });

    it('should throw error when order is not completed', async () => {
      const pendingOrder = {
        ...mockLabOrder,
        status: 'pending',
        tests: [],
      };
      mockPrisma.labOrder.findUnique.mockResolvedValue(pendingOrder);

      await expect(reportService.generateLabReport('order-123')).rejects.toThrow(
        'Order is not completed yet'
      );
    });

    it('should include order information in report', async () => {
      const completedOrder = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        tests: [
          {
            ...mockLabTest,
            results: [mockLabResult],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(completedOrder);
      mockPrisma.labOrder.update.mockResolvedValue(completedOrder);

      await reportService.generateLabReport('order-123');

      expect(mockPrisma.labOrder.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });
    });

    it('should handle orders with multiple tests', async () => {
      const orderWithMultipleTests = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        tests: [
          {
            ...mockLabTest,
            results: [mockLabResult],
          },
          {
            ...mockLabTest,
            id: 'test-456',
            testCode: 'BMP',
            testName: 'Basic Metabolic Panel',
            results: [
              {
                ...mockLabResult,
                id: 'result-456',
                componentCode: 'GLUCOSE',
                componentName: 'Glucose',
              },
            ],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(orderWithMultipleTests);
      mockPrisma.labOrder.update.mockResolvedValue(orderWithMultipleTests);

      const result = await reportService.generateLabReport('order-123');

      expect(result).toBeDefined();
    });

    it('should handle orders with abnormal results', async () => {
      const orderWithAbnormalResults = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        tests: [
          {
            ...mockLabTest,
            results: [
              {
                ...mockLabResult,
                isAbnormal: true,
                abnormalFlag: 'H',
              },
            ],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(orderWithAbnormalResults);
      mockPrisma.labOrder.update.mockResolvedValue(orderWithAbnormalResults);

      const result = await reportService.generateLabReport('order-123');

      expect(result).toBeDefined();
    });

    it('should handle orders with critical results', async () => {
      const orderWithCriticalResults = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        tests: [
          {
            ...mockLabTest,
            results: [
              {
                ...mockLabResult,
                isCritical: true,
                abnormalFlag: 'HH',
              },
            ],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(orderWithCriticalResults);
      mockPrisma.labOrder.update.mockResolvedValue(orderWithCriticalResults);

      const result = await reportService.generateLabReport('order-123');

      expect(result).toBeDefined();
    });

    it('should include clinical info in report when available', async () => {
      const orderWithClinicalInfo = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        clinicalInfo: 'Patient presents with fatigue',
        tests: [
          {
            ...mockLabTest,
            results: [mockLabResult],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(orderWithClinicalInfo);
      mockPrisma.labOrder.update.mockResolvedValue(orderWithClinicalInfo);

      await reportService.generateLabReport('order-123');

      expect(mockPrisma.labOrder.update).toHaveBeenCalled();
    });
  });

  describe('getReportUrl', () => {
    it('should return report URL when available', async () => {
      mockPrisma.labOrder.findUnique.mockResolvedValue({
        reportUrl: 'https://storage.example.com/reports/test.pdf',
      });

      const result = await reportService.getReportUrl('order-123');

      expect(result).toBe('https://storage.example.com/reports/test.pdf');
    });

    it('should return null when no report URL', async () => {
      mockPrisma.labOrder.findUnique.mockResolvedValue({
        reportUrl: null,
      });

      const result = await reportService.getReportUrl('order-123');

      expect(result).toBeNull();
    });

    it('should return null when order not found', async () => {
      mockPrisma.labOrder.findUnique.mockResolvedValue(null);

      const result = await reportService.getReportUrl('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error when database fails', async () => {
      mockPrisma.labOrder.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(reportService.getReportUrl('order-123')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('regenerateReport', () => {
    it('should regenerate an existing report', async () => {
      const completedOrder = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        reportUrl: 'https://old-url.com/report.pdf',
        tests: [
          {
            ...mockLabTest,
            results: [mockLabResult],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(completedOrder);
      mockPrisma.labOrder.update.mockResolvedValue({
        ...completedOrder,
        reportUrl: 'https://new-url.com/report.pdf',
      });

      const result = await reportService.regenerateReport('order-123');

      expect(result).toContain('https://storage');
    });

    it('should accept options for regeneration', async () => {
      const completedOrder = {
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
        tests: [
          {
            ...mockLabTest,
            results: [mockLabResult],
          },
        ],
      };

      mockPrisma.labOrder.findUnique.mockResolvedValue(completedOrder);
      mockPrisma.labOrder.update.mockResolvedValue(completedOrder);

      const options = { includeLogo: true, includeFooter: true };
      const result = await reportService.regenerateReport('order-123', options);

      expect(result).toBeDefined();
    });
  });
});
