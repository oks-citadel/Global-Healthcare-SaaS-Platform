/**
 * Unit Tests for OrderService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderService from '../../../src/services/orderService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockImagingOrder, mockCreateOrderInput, mockStudy } from '../helpers/fixtures';

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

describe('OrderService', () => {
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an imaging order successfully', async () => {
      mockPrisma.imagingOrder.create.mockResolvedValue(mockImagingOrder);

      const result = await OrderService.createOrder(mockCreateOrderInput);

      expect(mockPrisma.imagingOrder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          orderNumber: expect.stringMatching(/^IMG-\d+-[A-Z0-9]+$/),
          patientId: mockCreateOrderInput.patientId,
          modality: mockCreateOrderInput.modality,
        }),
      });
      expect(result).toBeDefined();
    });

    it('should generate unique order number', async () => {
      mockPrisma.imagingOrder.create.mockResolvedValue(mockImagingOrder);

      await OrderService.createOrder(mockCreateOrderInput);

      const createCall = mockPrisma.imagingOrder.create.mock.calls[0][0];
      expect(createCall.data.orderNumber).toMatch(/^IMG-\d+-[A-Z0-9]+$/);
    });

    it('should throw AppError when creation fails', async () => {
      mockPrisma.imagingOrder.create.mockRejectedValue(new Error('Database error'));

      await expect(OrderService.createOrder(mockCreateOrderInput))
        .rejects.toThrow('Failed to create imaging order');
    });
  });

  describe('getOrders', () => {
    it('should return paginated orders', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([mockImagingOrder]);
      mockPrisma.imagingOrder.count.mockResolvedValue(10);

      const result = await OrderService.getOrders({
        page: 1,
        limit: 10,
      });

      expect(result.orders).toHaveLength(1);
      expect(result.pagination.total).toBe(10);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should apply filters correctly', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([mockImagingOrder]);
      mockPrisma.imagingOrder.count.mockResolvedValue(1);

      await OrderService.getOrders({
        patientId: 'patient-123',
        modality: 'CT',
        status: 'ORDERED',
      });

      const findCall = mockPrisma.imagingOrder.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe('patient-123');
      expect(findCall.where.modality).toBe('CT');
      expect(findCall.where.status).toBe('ORDERED');
    });

    it('should filter by date range', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([]);
      mockPrisma.imagingOrder.count.mockResolvedValue(0);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      await OrderService.getOrders({ startDate, endDate });

      const findCall = mockPrisma.imagingOrder.findMany.mock.calls[0][0];
      expect(findCall.where.requestedAt.gte).toEqual(startDate);
      expect(findCall.where.requestedAt.lte).toEqual(endDate);
    });

    it('should use default pagination values', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([]);
      mockPrisma.imagingOrder.count.mockResolvedValue(0);

      await OrderService.getOrders({});

      const findCall = mockPrisma.imagingOrder.findMany.mock.calls[0][0];
      expect(findCall.skip).toBe(0);
      expect(findCall.take).toBe(10);
    });

    it('should calculate pagination offset correctly', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([]);
      mockPrisma.imagingOrder.count.mockResolvedValue(0);

      await OrderService.getOrders({ page: 3, limit: 20 });

      const findCall = mockPrisma.imagingOrder.findMany.mock.calls[0][0];
      expect(findCall.skip).toBe(40);
      expect(findCall.take).toBe(20);
    });

    it('should include study information', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([{
        ...mockImagingOrder,
        studies: [mockStudy],
      }]);
      mockPrisma.imagingOrder.count.mockResolvedValue(1);

      await OrderService.getOrders({});

      const findCall = mockPrisma.imagingOrder.findMany.mock.calls[0][0];
      expect(findCall.include.studies).toBeDefined();
    });
  });

  describe('getOrderById', () => {
    it('should return order with studies and reports', async () => {
      mockPrisma.imagingOrder.findUnique.mockResolvedValue({
        ...mockImagingOrder,
        studies: [{ ...mockStudy, reports: [], criticalFindings: [] }],
      });

      const result = await OrderService.getOrderById('order-123');

      expect(mockPrisma.imagingOrder.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        include: {
          studies: {
            include: {
              reports: true,
              criticalFindings: true,
            },
          },
        },
      });
      expect(result).toBeDefined();
    });

    it('should throw AppError when order not found', async () => {
      mockPrisma.imagingOrder.findUnique.mockResolvedValue(null);

      await expect(OrderService.getOrderById('non-existent'))
        .rejects.toThrow('Imaging order not found');
    });
  });

  describe('updateOrder', () => {
    it('should update order successfully', async () => {
      const updatedOrder = { ...mockImagingOrder, priority: 'STAT' };
      mockPrisma.imagingOrder.update.mockResolvedValue(updatedOrder);

      const result = await OrderService.updateOrder('order-123', {
        priority: 'STAT',
      });

      expect(mockPrisma.imagingOrder.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: { priority: 'STAT' },
      });
      expect(result.priority).toBe('STAT');
    });

    it('should throw AppError when update fails', async () => {
      mockPrisma.imagingOrder.update.mockRejectedValue(new Error('Database error'));

      await expect(OrderService.updateOrder('order-123', { priority: 'STAT' }))
        .rejects.toThrow('Failed to update imaging order');
    });
  });

  describe('cancelOrder', () => {
    it('should set order status to CANCELLED', async () => {
      const cancelledOrder = { ...mockImagingOrder, status: 'CANCELLED' };
      mockPrisma.imagingOrder.update.mockResolvedValue(cancelledOrder);

      const result = await OrderService.cancelOrder('order-123');

      expect(mockPrisma.imagingOrder.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: { status: 'CANCELLED' },
      });
      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('getOrdersByPatient', () => {
    it('should return all orders for a patient', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([
        mockImagingOrder,
        { ...mockImagingOrder, id: 'order-456' },
      ]);

      const result = await OrderService.getOrdersByPatient('patient-123');

      expect(mockPrisma.imagingOrder.findMany).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
        orderBy: { createdAt: 'desc' },
        include: expect.anything(),
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no orders exist', async () => {
      mockPrisma.imagingOrder.findMany.mockResolvedValue([]);

      const result = await OrderService.getOrdersByPatient('patient-no-orders');

      expect(result).toHaveLength(0);
    });
  });
});
