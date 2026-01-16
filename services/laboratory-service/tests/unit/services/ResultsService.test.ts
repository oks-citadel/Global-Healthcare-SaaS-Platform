/**
 * Unit Tests for ResultsService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResultsService } from '../../../src/services/ResultsService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockLabResult, mockAbnormalResult, mockCriticalResult, mockLabTest, mockLabOrder, mockCreateResultInput } from '../helpers/fixtures';

// Mock logger
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock validators
vi.mock('../../../src/utils/validators', () => ({
  validateReferenceRange: vi.fn(() => ({
    isAbnormal: false,
    isCritical: false,
    abnormalFlag: 'N',
  })),
  validateCriticalValue: vi.fn(() => false),
}));

describe('ResultsService', () => {
  let resultsService: ResultsService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    resultsService = new ResultsService(mockPrisma as any);
    vi.clearAllMocks();
  });

  describe('createResult', () => {
    it('should create a new lab result successfully', async () => {
      const performedBy = 'tech-123';
      mockPrisma.labResult.create.mockResolvedValue(mockLabResult);
      mockPrisma.labTest.findUnique.mockResolvedValue({
        ...mockLabTest,
        results: [mockLabResult],
      });
      mockPrisma.labTest.update.mockResolvedValue(mockLabTest);
      mockPrisma.labOrder.findUnique.mockResolvedValue({
        ...mockLabOrder,
        tests: [mockLabTest],
      });
      mockPrisma.labOrder.update.mockResolvedValue(mockLabOrder);

      const result = await resultsService.createResult(mockCreateResultInput, performedBy);

      expect(mockPrisma.labResult.create).toHaveBeenCalledOnce();
      expect(result.componentName).toBe('White Blood Cell Count');
    });

    it('should detect abnormal values when reference range is provided', async () => {
      const abnormalInput = {
        ...mockCreateResultInput,
        numericValue: 15000,
        referenceRange: '4500-11000',
      };
      mockPrisma.labResult.create.mockResolvedValue(mockAbnormalResult);
      mockPrisma.labTest.findUnique.mockResolvedValue({
        ...mockLabTest,
        results: [mockAbnormalResult],
      });
      mockPrisma.labTest.update.mockResolvedValue(mockLabTest);

      await resultsService.createResult(abnormalInput, 'tech-123');

      expect(mockPrisma.labResult.create).toHaveBeenCalled();
    });

    it('should throw error when creation fails', async () => {
      mockPrisma.labResult.create.mockRejectedValue(new Error('Database error'));

      await expect(resultsService.createResult(mockCreateResultInput, 'tech-123'))
        .rejects.toThrow('Database error');
    });
  });

  describe('createBulkResults', () => {
    it('should create multiple results for a test', async () => {
      const testId = 'test-123';
      const results = [
        { ...mockCreateResultInput, componentName: 'WBC' },
        { ...mockCreateResultInput, componentName: 'RBC' },
        { ...mockCreateResultInput, componentName: 'Hemoglobin' },
      ];

      mockPrisma.labResult.create.mockResolvedValue(mockLabResult);
      mockPrisma.labTest.findUnique.mockResolvedValue({
        ...mockLabTest,
        results: [mockLabResult],
      });
      mockPrisma.labTest.update.mockResolvedValue(mockLabTest);

      const result = await resultsService.createBulkResults(testId, results, 'tech-123');

      expect(result).toHaveLength(3);
      expect(mockPrisma.labResult.create).toHaveBeenCalledTimes(3);
    });
  });

  describe('getResultById', () => {
    it('should return result with test and order info', async () => {
      mockPrisma.labResult.findUnique.mockResolvedValue({
        ...mockLabResult,
        test: {
          ...mockLabTest,
          order: mockLabOrder,
        },
      });

      const result = await resultsService.getResultById('result-123');

      expect(mockPrisma.labResult.findUnique).toHaveBeenCalledWith({
        where: { id: 'result-123' },
        include: {
          test: {
            include: {
              order: true,
            },
          },
        },
      });
      expect(result?.id).toBe('result-123');
    });

    it('should return null when result not found', async () => {
      mockPrisma.labResult.findUnique.mockResolvedValue(null);

      const result = await resultsService.getResultById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getResultsByTest', () => {
    it('should return all results for a test', async () => {
      const results = [mockLabResult, { ...mockLabResult, id: 'result-456' }];
      mockPrisma.labResult.findMany.mockResolvedValue(results);

      const result = await resultsService.getResultsByTest('test-123');

      expect(mockPrisma.labResult.findMany).toHaveBeenCalledWith({
        where: { testId: 'test-123' },
        orderBy: { resultedAt: 'asc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('getResultsByOrder', () => {
    it('should return all results for an order', async () => {
      mockPrisma.labResult.findMany.mockResolvedValue([
        { ...mockLabResult, test: mockLabTest },
      ]);

      const result = await resultsService.getResultsByOrder('order-123');

      expect(mockPrisma.labResult.findMany).toHaveBeenCalledWith({
        where: {
          test: {
            orderId: 'order-123',
          },
        },
        include: {
          test: true,
        },
        orderBy: { resultedAt: 'asc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getResultsByPatient', () => {
    it('should return paginated patient results', async () => {
      mockPrisma.labResult.findMany.mockResolvedValue([mockLabResult]);
      mockPrisma.labResult.count.mockResolvedValue(1);

      const result = await resultsService.getResultsByPatient('patient-123', {
        limit: 10,
        offset: 0,
      });

      expect(result.results).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should filter by date range', async () => {
      mockPrisma.labResult.findMany.mockResolvedValue([]);
      mockPrisma.labResult.count.mockResolvedValue(0);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      await resultsService.getResultsByPatient('patient-123', { startDate, endDate });

      const findCall = mockPrisma.labResult.findMany.mock.calls[0][0];
      expect(findCall.where.resultedAt.gte).toEqual(startDate);
      expect(findCall.where.resultedAt.lte).toEqual(endDate);
    });

    it('should filter by category', async () => {
      mockPrisma.labResult.findMany.mockResolvedValue([]);
      mockPrisma.labResult.count.mockResolvedValue(0);

      await resultsService.getResultsByPatient('patient-123', { category: 'hematology' });

      const findCall = mockPrisma.labResult.findMany.mock.calls[0][0];
      expect(findCall.where.test.category).toBe('hematology');
    });
  });

  describe('getAbnormalResults', () => {
    it('should return only abnormal results', async () => {
      mockPrisma.labResult.findMany.mockResolvedValue([mockAbnormalResult]);

      const result = await resultsService.getAbnormalResults('patient-123', 20);

      expect(mockPrisma.labResult.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isAbnormal: true,
          }),
        })
      );
      expect(result[0].isAbnormal).toBe(true);
    });

    it('should filter by patient when provided', async () => {
      mockPrisma.labResult.findMany.mockResolvedValue([]);

      await resultsService.getAbnormalResults('patient-123');

      const findCall = mockPrisma.labResult.findMany.mock.calls[0][0];
      expect(findCall.where.test.order.patientId).toBe('patient-123');
    });
  });

  describe('getCriticalResults', () => {
    it('should return only critical results', async () => {
      mockPrisma.labResult.findMany.mockResolvedValue([mockCriticalResult]);

      const result = await resultsService.getCriticalResults(20);

      expect(mockPrisma.labResult.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isCritical: true,
          },
        })
      );
      expect(result[0].isCritical).toBe(true);
    });
  });

  describe('verifyResult', () => {
    it('should mark result as verified', async () => {
      const verifiedResult = {
        ...mockLabResult,
        verifiedBy: 'pathologist-123',
        verifiedAt: new Date(),
      };
      mockPrisma.labResult.update.mockResolvedValue(verifiedResult);

      const result = await resultsService.verifyResult('result-123', 'pathologist-123');

      expect(mockPrisma.labResult.update).toHaveBeenCalledWith({
        where: { id: 'result-123' },
        data: {
          verifiedBy: 'pathologist-123',
          verifiedAt: expect.any(Date),
        },
      });
      expect(result.verifiedBy).toBe('pathologist-123');
    });
  });

  describe('updateResult', () => {
    it('should update result fields', async () => {
      const updatedResult = {
        ...mockLabResult,
        value: '8000',
        numericValue: 8000,
      };
      mockPrisma.labResult.update.mockResolvedValue(updatedResult);

      const result = await resultsService.updateResult('result-123', {
        value: '8000',
        numericValue: 8000,
      });

      expect(mockPrisma.labResult.update).toHaveBeenCalledWith({
        where: { id: 'result-123' },
        data: {
          value: '8000',
          numericValue: 8000,
        },
      });
      expect(result.value).toBe('8000');
    });
  });

  describe('deleteResult', () => {
    it('should delete result', async () => {
      mockPrisma.labResult.delete.mockResolvedValue(mockLabResult);

      const result = await resultsService.deleteResult('result-123');

      expect(mockPrisma.labResult.delete).toHaveBeenCalledWith({
        where: { id: 'result-123' },
      });
      expect(result.id).toBe('result-123');
    });

    it('should throw error when deletion fails', async () => {
      mockPrisma.labResult.delete.mockRejectedValue(new Error('Result not found'));

      await expect(resultsService.deleteResult('non-existent'))
        .rejects.toThrow('Result not found');
    });
  });
});
