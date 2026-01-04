/**
 * Unit Tests for SampleTrackingService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SampleTrackingService } from '../../../src/services/SampleTrackingService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockSample } from '../helpers/fixtures';

// Mock logger
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('SampleTrackingService', () => {
  let sampleService: SampleTrackingService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    sampleService = new SampleTrackingService(mockPrisma as any);
    vi.clearAllMocks();
  });

  describe('createSample', () => {
    const createInput = {
      orderId: 'order-123',
      sampleType: 'whole_blood',
      containerType: 'EDTA tube',
      volume: '5ml',
      bodySource: 'Left arm',
      collectedBy: 'phlebotomist-123',
      priority: 'routine' as const,
      notes: 'Collected without issues',
    };

    it('should create a new sample successfully', async () => {
      const result = await sampleService.createSample(createInput);

      expect(result).toBeDefined();
      expect(result.orderId).toBe('order-123');
      expect(result.sampleType).toBe('whole_blood');
      expect(result.status).toBe('collected');
    });

    it('should generate a unique sample number', async () => {
      const result = await sampleService.createSample(createInput);

      expect(result.sampleNumber).toMatch(/^SMP-\d+-[A-Z0-9]+$/);
    });

    it('should use provided collectedBy or fallback to input', async () => {
      const result = await sampleService.createSample(createInput, 'tech-456');

      expect(result.collectedBy).toBe('tech-456');
    });

    it('should set default priority if not provided', async () => {
      const inputWithoutPriority = { ...createInput, priority: undefined };

      const result = await sampleService.createSample(inputWithoutPriority as any);

      expect(result.priority).toBe('routine');
    });

    it('should store sample in internal indices', async () => {
      const result = await sampleService.createSample(createInput);

      const fetchedById = await sampleService.getSampleById(result.id);
      const fetchedByNumber = await sampleService.getSampleByNumber(result.sampleNumber);

      expect(fetchedById).toEqual(result);
      expect(fetchedByNumber).toEqual(result);
    });
  });

  describe('getSampleById', () => {
    it('should return sample when found', async () => {
      // First create a sample
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.getSampleById(sample.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(sample.id);
    });

    it('should return null when sample not found', async () => {
      const result = await sampleService.getSampleById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getSampleByNumber', () => {
    it('should return sample when found by sample number', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.getSampleByNumber(sample.sampleNumber);

      expect(result).toBeDefined();
      expect(result?.sampleNumber).toBe(sample.sampleNumber);
    });

    it('should return null when sample number not found', async () => {
      const result = await sampleService.getSampleByNumber('SMP-INVALID');

      expect(result).toBeNull();
    });
  });

  describe('getSamplesByOrder', () => {
    it('should return all samples for an order', async () => {
      await sampleService.createSample({ orderId: 'order-123', sampleType: 'whole_blood' });
      await sampleService.createSample({ orderId: 'order-123', sampleType: 'urine' });
      await sampleService.createSample({ orderId: 'order-456', sampleType: 'stool' });

      const result = await sampleService.getSamplesByOrder('order-123');

      expect(result).toHaveLength(2);
      expect(result.every(s => s.orderId === 'order-123')).toBe(true);
    });

    it('should return empty array when no samples for order', async () => {
      const result = await sampleService.getSamplesByOrder('non-existent');

      expect(result).toHaveLength(0);
    });

    it('should sort samples by creation date', async () => {
      await sampleService.createSample({ orderId: 'order-123', sampleType: 'whole_blood' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await sampleService.createSample({ orderId: 'order-123', sampleType: 'urine' });

      const result = await sampleService.getSamplesByOrder('order-123');

      expect(result[0].sampleType).toBe('whole_blood');
      expect(result[1].sampleType).toBe('urine');
    });
  });

  describe('getAllSamples', () => {
    beforeEach(async () => {
      await sampleService.createSample({ orderId: 'order-1', sampleType: 'whole_blood' });
      await sampleService.createSample({ orderId: 'order-2', sampleType: 'urine' });
      await sampleService.createSample({ orderId: 'order-3', sampleType: 'stool' });
    });

    it('should return all samples with pagination', async () => {
      const result = await sampleService.getAllSamples({ limit: 10, offset: 0 });

      expect(result.samples).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should filter by status', async () => {
      const sample = await sampleService.getSamplesByOrder('order-1');
      await sampleService.receiveSample(sample[0].id, 'tech-123');

      const result = await sampleService.getAllSamples({ status: 'received' });

      expect(result.samples).toHaveLength(1);
      expect(result.samples[0].status).toBe('received');
    });

    it('should filter by sample type', async () => {
      const result = await sampleService.getAllSamples({ sampleType: 'whole_blood' });

      expect(result.samples.every(s => s.sampleType === 'whole_blood')).toBe(true);
    });

    it('should apply pagination correctly', async () => {
      const result = await sampleService.getAllSamples({ limit: 2, offset: 1 });

      expect(result.samples).toHaveLength(2);
      expect(result.total).toBe(3);
    });
  });

  describe('updateSample', () => {
    it('should update sample fields', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.updateSample(sample.id, {
        location: 'Lab A',
        condition: 'Good',
      });

      expect(result?.location).toBe('Lab A');
      expect(result?.condition).toBe('Good');
    });

    it('should auto-set receivedAt when status changes to received', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.updateSample(sample.id, { status: 'received' });

      expect(result?.receivedAt).toBeDefined();
    });

    it('should return null when sample not found', async () => {
      const result = await sampleService.updateSample('non-existent', { location: 'Lab A' });

      expect(result).toBeNull();
    });
  });

  describe('receiveSample', () => {
    it('should mark sample as received', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.receiveSample(sample.id, 'tech-123', 'Good');

      expect(result?.status).toBe('received');
      expect(result?.receivedAt).toBeDefined();
      expect(result?.condition).toBe('Good');
    });
  });

  describe('rejectSample', () => {
    it('should mark sample as rejected', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      // Mock the labTest updateMany
      mockPrisma.labTest.updateMany.mockResolvedValue({ count: 1 });

      const result = await sampleService.rejectSample(sample.id, 'Hemolyzed');

      expect(result?.status).toBe('rejected');
      expect(result?.rejectionReason).toBe('Hemolyzed');
    });

    it('should cancel associated lab tests', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      mockPrisma.labTest.updateMany.mockResolvedValue({ count: 2 });

      await sampleService.rejectSample(sample.id, 'Contaminated');

      expect(mockPrisma.labTest.updateMany).toHaveBeenCalledWith({
        where: { orderId: 'order-123' },
        data: { status: 'cancelled' },
      });
    });

    it('should return null when sample not found', async () => {
      const result = await sampleService.rejectSample('non-existent', 'Reason');

      expect(result).toBeNull();
    });
  });

  describe('updateSampleLocation', () => {
    it('should update sample location', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.updateSampleLocation(sample.id, 'Storage Room B');

      expect(result?.location).toBe('Storage Room B');
    });
  });

  describe('disposeSample', () => {
    it('should mark sample as disposed', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.disposeSample(sample.id);

      expect(result?.status).toBe('disposed');
    });
  });

  describe('startProcessing', () => {
    it('should mark sample as processing', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.startProcessing(sample.id);

      expect(result?.status).toBe('processing');
    });
  });

  describe('completeSample', () => {
    it('should mark sample as completed', async () => {
      const sample = await sampleService.createSample({
        orderId: 'order-123',
        sampleType: 'whole_blood',
      });

      const result = await sampleService.completeSample(sample.id);

      expect(result?.status).toBe('completed');
    });
  });

  describe('getSampleStatistics', () => {
    beforeEach(async () => {
      const sample1 = await sampleService.createSample({ orderId: 'order-1', sampleType: 'whole_blood' });
      const sample2 = await sampleService.createSample({ orderId: 'order-2', sampleType: 'urine' });
      await sampleService.createSample({ orderId: 'order-3', sampleType: 'stool' });

      await sampleService.receiveSample(sample1.id, 'tech-123');
      mockPrisma.labTest.updateMany.mockResolvedValue({ count: 1 });
      await sampleService.rejectSample(sample2.id, 'Contaminated');
    });

    it('should return sample statistics by status', async () => {
      const stats = await sampleService.getSampleStatistics();

      expect(stats.total).toBe(3);
      expect(stats.byStatus.collected).toBe(1);
      expect(stats.byStatus.received).toBe(1);
      expect(stats.byStatus.rejected).toBe(1);
    });
  });

  describe('getSamplesByStatus', () => {
    it('should return samples with specific status', async () => {
      await sampleService.createSample({ orderId: 'order-1', sampleType: 'whole_blood' });
      const sample2 = await sampleService.createSample({ orderId: 'order-2', sampleType: 'urine' });
      await sampleService.receiveSample(sample2.id, 'tech-123');

      const result = await sampleService.getSamplesByStatus('received');

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('received');
    });
  });

  describe('clearAllSamples', () => {
    it('should clear all samples from memory', async () => {
      await sampleService.createSample({ orderId: 'order-1', sampleType: 'whole_blood' });
      await sampleService.createSample({ orderId: 'order-2', sampleType: 'urine' });

      await sampleService.clearAllSamples();

      const result = await sampleService.getAllSamples({});
      expect(result.total).toBe(0);
    });
  });
});
