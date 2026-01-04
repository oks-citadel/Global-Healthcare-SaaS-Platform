/**
 * Unit Tests for OrderService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../../../src/services/OrderService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockLabOrder, mockLabTest, mockCreateOrderInput } from '../helpers/fixtures';

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
  let orderService: OrderService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    orderService = new OrderService(mockPrisma as any);
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new lab order successfully', async () => {
      const providerId = 'provider-123';
      const createdOrder = {
        ...mockLabOrder,
        tests: [mockLabTest],
      };
      mockPrisma.labOrder.create.mockResolvedValue(createdOrder);

      const result = await orderService.createOrder(mockCreateOrderInput, providerId);

      expect(mockPrisma.labOrder.create).toHaveBeenCalledOnce();
      expect(result).toEqual(createdOrder);
      expect(result.patientId).toBe(mockCreateOrderInput.patientId);
    });

    it('should generate a unique order number', async () => {
      const providerId = 'provider-123';
      mockPrisma.labOrder.create.mockResolvedValue(mockLabOrder);

      await orderService.createOrder(mockCreateOrderInput, providerId);

      const createCall = mockPrisma.labOrder.create.mock.calls[0][0];
      expect(createCall.data.orderNumber).toMatch(/^LAB-\d+-[A-Z0-9]+$/);
    });

    it('should use default priority if not specified', async () => {
      const providerId = 'provider-123';
      const inputWithoutPriority = {
        ...mockCreateOrderInput,
        priority: undefined,
      };
      mockPrisma.labOrder.create.mockResolvedValue(mockLabOrder);

      await orderService.createOrder(inputWithoutPriority as any, providerId);

      const createCall = mockPrisma.labOrder.create.mock.calls[0][0];
      expect(createCall.data.priority).toBe('routine');
    });

    it('should create tests for each test in input', async () => {
      const providerId = 'provider-123';
      mockPrisma.labOrder.create.mockResolvedValue({
        ...mockLabOrder,
        tests: [mockLabTest, { ...mockLabTest, id: 'test-456' }],
      });

      await orderService.createOrder(mockCreateOrderInput, providerId);

      const createCall = mockPrisma.labOrder.create.mock.calls[0][0];
      expect(createCall.data.tests.create).toHaveLength(2);
    });

    it('should throw error when prisma create fails', async () => {
      const providerId = 'provider-123';
      mockPrisma.labOrder.create.mockRejectedValue(new Error('Database error'));

      await expect(orderService.createOrder(mockCreateOrderInput, providerId))
        .rejects.toThrow('Database error');
    });
  });

  describe('getOrderById', () => {
    it('should return order when found', async () => {
      const orderId = 'order-123';
      mockPrisma.labOrder.findUnique.mockResolvedValue({
        ...mockLabOrder,
        tests: [mockLabTest],
      });

      const result = await orderService.getOrderById(orderId);

      expect(mockPrisma.labOrder.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });
      expect(result).toBeTruthy();
      expect(result?.id).toBe('order-123');
    });

    it('should return null when order not found', async () => {
      mockPrisma.labOrder.findUnique.mockResolvedValue(null);

      const result = await orderService.getOrderById('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error when database fails', async () => {
      mockPrisma.labOrder.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(orderService.getOrderById('order-123'))
        .rejects.toThrow('Database error');
    });
  });

  describe('getOrderByNumber', () => {
    it('should return order when found by order number', async () => {
      const orderNumber = 'LAB-1234567890-ABC123';
      mockPrisma.labOrder.findUnique.mockResolvedValue(mockLabOrder);

      const result = await orderService.getOrderByNumber(orderNumber);

      expect(mockPrisma.labOrder.findUnique).toHaveBeenCalledWith({
        where: { orderNumber },
        include: {
          tests: {
            include: {
              results: true,
            },
          },
        },
      });
      expect(result?.orderNumber).toBe(orderNumber);
    });
  });

  describe('getOrders', () => {
    it('should return paginated orders with filters', async () => {
      const orders = [mockLabOrder, { ...mockLabOrder, id: 'order-456' }];
      mockPrisma.labOrder.findMany.mockResolvedValue(orders);
      mockPrisma.labOrder.count.mockResolvedValue(10);

      const result = await orderService.getOrders({
        patientId: 'patient-123',
        status: 'pending',
        limit: 20,
        offset: 0,
      });

      expect(result.orders).toHaveLength(2);
      expect(result.total).toBe(10);
    });

    it('should filter by patient ID', async () => {
      mockPrisma.labOrder.findMany.mockResolvedValue([mockLabOrder]);
      mockPrisma.labOrder.count.mockResolvedValue(1);

      await orderService.getOrders({ patientId: 'patient-123' });

      const findCall = mockPrisma.labOrder.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe('patient-123');
    });

    it('should filter by provider ID', async () => {
      mockPrisma.labOrder.findMany.mockResolvedValue([mockLabOrder]);
      mockPrisma.labOrder.count.mockResolvedValue(1);

      await orderService.getOrders({ providerId: 'provider-123' });

      const findCall = mockPrisma.labOrder.findMany.mock.calls[0][0];
      expect(findCall.where.providerId).toBe('provider-123');
    });

    it('should filter by date range', async () => {
      mockPrisma.labOrder.findMany.mockResolvedValue([mockLabOrder]);
      mockPrisma.labOrder.count.mockResolvedValue(1);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      await orderService.getOrders({ startDate, endDate });

      const findCall = mockPrisma.labOrder.findMany.mock.calls[0][0];
      expect(findCall.where.orderedAt.gte).toEqual(startDate);
      expect(findCall.where.orderedAt.lte).toEqual(endDate);
    });

    it('should use default pagination values', async () => {
      mockPrisma.labOrder.findMany.mockResolvedValue([]);
      mockPrisma.labOrder.count.mockResolvedValue(0);

      await orderService.getOrders({});

      const findCall = mockPrisma.labOrder.findMany.mock.calls[0][0];
      expect(findCall.take).toBe(20);
      expect(findCall.skip).toBe(0);
    });
  });

  describe('updateOrder', () => {
    it('should update order status successfully', async () => {
      const updatedOrder = { ...mockLabOrder, status: 'processing' };
      mockPrisma.labOrder.update.mockResolvedValue(updatedOrder);

      const result = await orderService.updateOrder('order-123', { status: 'processing' as any });

      expect(mockPrisma.labOrder.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: expect.objectContaining({ status: 'processing' }),
        include: expect.anything(),
      });
      expect(result.status).toBe('processing');
    });

    it('should auto-set collectedAt when status is collected', async () => {
      mockPrisma.labOrder.update.mockResolvedValue({
        ...mockLabOrder,
        status: 'collected',
        collectedAt: new Date(),
      });

      await orderService.updateOrder('order-123', { status: 'collected' as any });

      const updateCall = mockPrisma.labOrder.update.mock.calls[0][0];
      expect(updateCall.data.collectedAt).toBeDefined();
    });

    it('should auto-set completedAt when status is completed', async () => {
      mockPrisma.labOrder.update.mockResolvedValue({
        ...mockLabOrder,
        status: 'completed',
        completedAt: new Date(),
      });

      await orderService.updateOrder('order-123', { status: 'completed' as any });

      const updateCall = mockPrisma.labOrder.update.mock.calls[0][0];
      expect(updateCall.data.completedAt).toBeDefined();
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order and all associated tests', async () => {
      const cancelledOrder = { ...mockLabOrder, status: 'cancelled' };
      mockPrisma.labOrder.update.mockResolvedValue(cancelledOrder);

      const result = await orderService.cancelOrder('order-123', 'Duplicate order');

      expect(mockPrisma.labOrder.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: {
          status: 'cancelled',
          tests: {
            updateMany: {
              where: { orderId: 'order-123' },
              data: { status: 'cancelled' },
            },
          },
        },
        include: {
          tests: true,
        },
      });
      expect(result.status).toBe('cancelled');
    });
  });

  describe('getOrdersByPatient', () => {
    it('should call getOrders with patient filter', async () => {
      mockPrisma.labOrder.findMany.mockResolvedValue([mockLabOrder]);
      mockPrisma.labOrder.count.mockResolvedValue(1);

      await orderService.getOrdersByPatient('patient-123', 10, 0);

      const findCall = mockPrisma.labOrder.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe('patient-123');
      expect(findCall.take).toBe(10);
    });
  });

  describe('getOrdersByProvider', () => {
    it('should call getOrders with provider filter', async () => {
      mockPrisma.labOrder.findMany.mockResolvedValue([mockLabOrder]);
      mockPrisma.labOrder.count.mockResolvedValue(1);

      await orderService.getOrdersByProvider('provider-123', 10, 0);

      const findCall = mockPrisma.labOrder.findMany.mock.calls[0][0];
      expect(findCall.where.providerId).toBe('provider-123');
    });
  });

  describe('getOrderStatistics', () => {
    it('should return order statistics', async () => {
      mockPrisma.labOrder.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(20)  // pending
        .mockResolvedValueOnce(15)  // collected
        .mockResolvedValueOnce(10)  // processing
        .mockResolvedValueOnce(50)  // completed
        .mockResolvedValueOnce(5)   // cancelled
        .mockResolvedValueOnce(8)   // urgent
        .mockResolvedValueOnce(2);  // stat

      const result = await orderService.getOrderStatistics();

      expect(result.total).toBe(100);
      expect(result.byStatus.pending).toBe(20);
      expect(result.byStatus.completed).toBe(50);
      expect(result.byPriority.urgent).toBe(8);
      expect(result.byPriority.stat).toBe(2);
    });

    it('should filter by patient when provided', async () => {
      mockPrisma.labOrder.count.mockResolvedValue(10);

      await orderService.getOrderStatistics('patient-123');

      const calls = mockPrisma.labOrder.count.mock.calls;
      expect(calls[0][0].where.patientId).toBe('patient-123');
    });

    it('should filter by provider when provided', async () => {
      mockPrisma.labOrder.count.mockResolvedValue(10);

      await orderService.getOrderStatistics(undefined, 'provider-123');

      const calls = mockPrisma.labOrder.count.mock.calls;
      expect(calls[0][0].where.providerId).toBe('provider-123');
    });
  });

  describe('updateOrderStatus', () => {
    it('should delegate to updateOrder', async () => {
      mockPrisma.labOrder.update.mockResolvedValue({
        ...mockLabOrder,
        status: 'completed',
      });

      await orderService.updateOrderStatus('order-123', 'completed' as any);

      expect(mockPrisma.labOrder.update).toHaveBeenCalled();
    });
  });
});
