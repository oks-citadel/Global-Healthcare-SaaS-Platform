/**
 * Unit Tests for TestCatalogService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestCatalogService } from '../../../src/services/TestCatalogService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockDiagnosticTest } from '../helpers/fixtures';

// Mock logger
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('TestCatalogService', () => {
  let catalogService: TestCatalogService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    catalogService = new TestCatalogService(mockPrisma as any);
    vi.clearAllMocks();
  });

  describe('createTest', () => {
    const createInput = {
      code: 'CBC',
      name: 'Complete Blood Count',
      category: 'hematology' as const,
      description: 'Complete blood count with differential',
      preparation: 'No fasting required',
      sampleType: 'whole_blood',
      turnaroundTime: '24 hours',
      price: 50.00,
      currency: 'USD',
    };

    it('should create a new test catalog entry', async () => {
      mockPrisma.diagnosticTest.create.mockResolvedValue(mockDiagnosticTest);

      const result = await catalogService.createTest(createInput);

      expect(mockPrisma.diagnosticTest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          code: 'CBC',
          name: 'Complete Blood Count',
          category: 'hematology',
          isActive: true,
        }),
      });
      expect(result.code).toBe('CBC');
    });

    it('should default currency to USD if not provided', async () => {
      const inputWithoutCurrency = { ...createInput, currency: undefined };
      mockPrisma.diagnosticTest.create.mockResolvedValue(mockDiagnosticTest);

      await catalogService.createTest(inputWithoutCurrency);

      const createCall = mockPrisma.diagnosticTest.create.mock.calls[0][0];
      expect(createCall.data.currency).toBe('USD');
    });

    it('should throw error when creation fails', async () => {
      mockPrisma.diagnosticTest.create.mockRejectedValue(new Error('Duplicate code'));

      await expect(catalogService.createTest(createInput)).rejects.toThrow('Duplicate code');
    });
  });

  describe('getTestById', () => {
    it('should return test when found', async () => {
      mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

      const result = await catalogService.getTestById('diagnostic-123');

      expect(mockPrisma.diagnosticTest.findUnique).toHaveBeenCalledWith({
        where: { id: 'diagnostic-123' },
      });
      expect(result?.id).toBe('diagnostic-123');
    });

    it('should return null when test not found', async () => {
      mockPrisma.diagnosticTest.findUnique.mockResolvedValue(null);

      const result = await catalogService.getTestById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getTestByCode', () => {
    it('should return test when found by code', async () => {
      mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

      const result = await catalogService.getTestByCode('CBC');

      expect(mockPrisma.diagnosticTest.findUnique).toHaveBeenCalledWith({
        where: { code: 'CBC' },
      });
      expect(result?.code).toBe('CBC');
    });
  });

  describe('getAllTests', () => {
    it('should return paginated tests', async () => {
      const tests = [mockDiagnosticTest, { ...mockDiagnosticTest, id: 'diagnostic-456' }];
      mockPrisma.diagnosticTest.findMany.mockResolvedValue(tests);
      mockPrisma.diagnosticTest.count.mockResolvedValue(10);

      const result = await catalogService.getAllTests({ limit: 50, offset: 0 });

      expect(result.tests).toHaveLength(2);
      expect(result.total).toBe(10);
    });

    it('should filter by category', async () => {
      mockPrisma.diagnosticTest.findMany.mockResolvedValue([mockDiagnosticTest]);
      mockPrisma.diagnosticTest.count.mockResolvedValue(1);

      await catalogService.getAllTests({ category: 'hematology' as any });

      const findCall = mockPrisma.diagnosticTest.findMany.mock.calls[0][0];
      expect(findCall.where.category).toBe('hematology');
    });

    it('should filter by active status', async () => {
      mockPrisma.diagnosticTest.findMany.mockResolvedValue([mockDiagnosticTest]);
      mockPrisma.diagnosticTest.count.mockResolvedValue(1);

      await catalogService.getAllTests({ isActive: true });

      const findCall = mockPrisma.diagnosticTest.findMany.mock.calls[0][0];
      expect(findCall.where.isActive).toBe(true);
    });

    it('should search by name, code, and description', async () => {
      mockPrisma.diagnosticTest.findMany.mockResolvedValue([mockDiagnosticTest]);
      mockPrisma.diagnosticTest.count.mockResolvedValue(1);

      await catalogService.getAllTests({ search: 'blood' });

      const findCall = mockPrisma.diagnosticTest.findMany.mock.calls[0][0];
      expect(findCall.where.OR).toBeDefined();
      expect(findCall.where.OR).toHaveLength(3);
    });
  });

  describe('getTestsByCategory', () => {
    it('should return active tests by category', async () => {
      mockPrisma.diagnosticTest.findMany.mockResolvedValue([mockDiagnosticTest]);
      mockPrisma.diagnosticTest.count.mockResolvedValue(1);

      await catalogService.getTestsByCategory('hematology' as any);

      const findCall = mockPrisma.diagnosticTest.findMany.mock.calls[0][0];
      expect(findCall.where.category).toBe('hematology');
      expect(findCall.where.isActive).toBe(true);
    });
  });

  describe('updateTest', () => {
    it('should update test fields', async () => {
      const updatedTest = { ...mockDiagnosticTest, price: 75.00 };
      mockPrisma.diagnosticTest.update.mockResolvedValue(updatedTest);

      const result = await catalogService.updateTest('diagnostic-123', { price: 75.00 });

      expect(mockPrisma.diagnosticTest.update).toHaveBeenCalledWith({
        where: { id: 'diagnostic-123' },
        data: { price: 75.00 },
      });
      expect(result.price).toBe(75.00);
    });
  });

  describe('deactivateTest', () => {
    it('should set isActive to false', async () => {
      const deactivatedTest = { ...mockDiagnosticTest, isActive: false };
      mockPrisma.diagnosticTest.update.mockResolvedValue(deactivatedTest);

      const result = await catalogService.deactivateTest('diagnostic-123');

      expect(mockPrisma.diagnosticTest.update).toHaveBeenCalledWith({
        where: { id: 'diagnostic-123' },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('activateTest', () => {
    it('should set isActive to true', async () => {
      mockPrisma.diagnosticTest.update.mockResolvedValue(mockDiagnosticTest);

      const result = await catalogService.activateTest('diagnostic-123');

      expect(mockPrisma.diagnosticTest.update).toHaveBeenCalledWith({
        where: { id: 'diagnostic-123' },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('deleteTest', () => {
    it('should delete test and associated reference ranges', async () => {
      mockPrisma.diagnosticTest.delete.mockResolvedValue(mockDiagnosticTest);

      // Add a reference range first
      mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);
      await catalogService.addReferenceRange('diagnostic-123', {
        componentName: 'WBC',
        lowValue: 4500,
        highValue: 11000,
        unit: 'cells/mcL',
      });

      const result = await catalogService.deleteTest('diagnostic-123');

      expect(mockPrisma.diagnosticTest.delete).toHaveBeenCalledWith({
        where: { id: 'diagnostic-123' },
      });
      expect(result.id).toBe('diagnostic-123');
    });
  });

  describe('searchTests', () => {
    it('should search for active tests', async () => {
      mockPrisma.diagnosticTest.findMany.mockResolvedValue([mockDiagnosticTest]);
      mockPrisma.diagnosticTest.count.mockResolvedValue(1);

      await catalogService.searchTests('blood', 20);

      const findCall = mockPrisma.diagnosticTest.findMany.mock.calls[0][0];
      expect(findCall.where.isActive).toBe(true);
      expect(findCall.take).toBe(20);
    });
  });

  describe('getTestStatistics', () => {
    it('should return test catalog statistics', async () => {
      mockPrisma.diagnosticTest.count
        .mockResolvedValueOnce(100)  // total
        .mockResolvedValueOnce(95)   // active
        .mockResolvedValueOnce(5);   // inactive

      mockPrisma.diagnosticTest.groupBy.mockResolvedValue([
        { category: 'hematology', _count: 30 },
        { category: 'biochemistry', _count: 40 },
        { category: 'immunology', _count: 25 },
      ]);

      const result = await catalogService.getTestStatistics();

      expect(result.total).toBe(100);
      expect(result.active).toBe(95);
      expect(result.inactive).toBe(5);
      expect(result.byCategory.hematology).toBe(30);
    });
  });

  describe('Reference Range Management', () => {
    describe('addReferenceRange', () => {
      it('should add reference range for a test', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        const result = await catalogService.addReferenceRange('diagnostic-123', {
          componentName: 'White Blood Cells',
          lowValue: 4500,
          highValue: 11000,
          unit: 'cells/mcL',
        });

        expect(result.testCatalogId).toBe('diagnostic-123');
        expect(result.componentName).toBe('White Blood Cells');
        expect(result.lowValue).toBe(4500);
        expect(result.highValue).toBe(11000);
      });

      it('should throw error when test not found', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(null);

        await expect(catalogService.addReferenceRange('non-existent', {
          componentName: 'WBC',
        })).rejects.toThrow('Test with ID non-existent not found');
      });

      it('should support age and gender specific ranges', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        const result = await catalogService.addReferenceRange('diagnostic-123', {
          componentName: 'Hemoglobin',
          lowValue: 14.0,
          highValue: 18.0,
          unit: 'g/dL',
          gender: 'M',
          ageMin: 18,
          ageMax: 65,
        });

        expect(result.gender).toBe('M');
        expect(result.ageMin).toBe(18);
        expect(result.ageMax).toBe(65);
      });
    });

    describe('getReferenceRanges', () => {
      it('should return all reference ranges for a test', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        // Add some reference ranges
        await catalogService.addReferenceRange('diagnostic-123', { componentName: 'WBC' });
        await catalogService.addReferenceRange('diagnostic-123', { componentName: 'RBC' });

        const result = await catalogService.getReferenceRanges('diagnostic-123');

        expect(result).toHaveLength(2);
      });

      it('should sort ranges by component name', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        await catalogService.addReferenceRange('diagnostic-123', { componentName: 'Zinc' });
        await catalogService.addReferenceRange('diagnostic-123', { componentName: 'Albumin' });

        const result = await catalogService.getReferenceRanges('diagnostic-123');

        expect(result[0].componentName).toBe('Albumin');
        expect(result[1].componentName).toBe('Zinc');
      });
    });

    describe('updateReferenceRange', () => {
      it('should update reference range fields', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        const range = await catalogService.addReferenceRange('diagnostic-123', {
          componentName: 'WBC',
          lowValue: 4500,
          highValue: 11000,
        });

        const result = await catalogService.updateReferenceRange(range.id, {
          lowValue: 4000,
          highValue: 10500,
        });

        expect(result?.lowValue).toBe(4000);
        expect(result?.highValue).toBe(10500);
      });

      it('should return null when range not found', async () => {
        const result = await catalogService.updateReferenceRange('non-existent', {
          lowValue: 4000,
        });

        expect(result).toBeNull();
      });
    });

    describe('deleteReferenceRange', () => {
      it('should delete reference range', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        const range = await catalogService.addReferenceRange('diagnostic-123', {
          componentName: 'WBC',
        });

        const result = await catalogService.deleteReferenceRange(range.id);

        expect(result?.id).toBe(range.id);

        // Verify it's no longer in the list
        const ranges = await catalogService.getReferenceRanges('diagnostic-123');
        expect(ranges.find(r => r.id === range.id)).toBeUndefined();
      });

      it('should return null when range not found', async () => {
        const result = await catalogService.deleteReferenceRange('non-existent');

        expect(result).toBeNull();
      });
    });

    describe('findApplicableReferenceRange', () => {
      beforeEach(async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        // Add generic range
        await catalogService.addReferenceRange('diagnostic-123', {
          componentName: 'Hemoglobin',
          lowValue: 12.0,
          highValue: 16.0,
          unit: 'g/dL',
        });

        // Add male-specific range
        await catalogService.addReferenceRange('diagnostic-123', {
          componentName: 'Hemoglobin',
          lowValue: 14.0,
          highValue: 18.0,
          unit: 'g/dL',
          gender: 'M',
        });

        // Add female-specific range
        await catalogService.addReferenceRange('diagnostic-123', {
          componentName: 'Hemoglobin',
          lowValue: 12.0,
          highValue: 16.0,
          unit: 'g/dL',
          gender: 'F',
        });
      });

      it('should find most specific range for male patient', async () => {
        const result = await catalogService.findApplicableReferenceRange(
          'diagnostic-123',
          'Hemoglobin',
          30,
          'M'
        );

        expect(result?.gender).toBe('M');
        expect(result?.lowValue).toBe(14.0);
      });

      it('should find most specific range for female patient', async () => {
        const result = await catalogService.findApplicableReferenceRange(
          'diagnostic-123',
          'Hemoglobin',
          30,
          'F'
        );

        expect(result?.gender).toBe('F');
        expect(result?.lowValue).toBe(12.0);
      });

      it('should fall back to generic range when no specific match', async () => {
        const result = await catalogService.findApplicableReferenceRange(
          'diagnostic-123',
          'Hemoglobin'
        );

        expect(result?.gender).toBeUndefined();
      });

      it('should return null when no range found for component', async () => {
        const result = await catalogService.findApplicableReferenceRange(
          'diagnostic-123',
          'NonExistentComponent'
        );

        expect(result).toBeNull();
      });
    });

    describe('clearAllReferenceRanges', () => {
      it('should clear all reference ranges from memory', async () => {
        mockPrisma.diagnosticTest.findUnique.mockResolvedValue(mockDiagnosticTest);

        await catalogService.addReferenceRange('diagnostic-123', { componentName: 'WBC' });
        await catalogService.addReferenceRange('diagnostic-123', { componentName: 'RBC' });

        await catalogService.clearAllReferenceRanges();

        const ranges = await catalogService.getReferenceRanges('diagnostic-123');
        expect(ranges).toHaveLength(0);
      });
    });
  });
});
