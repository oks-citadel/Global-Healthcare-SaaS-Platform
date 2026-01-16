/**
 * Unit Tests for OrderService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const instance = {
    imagingOrder: {
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
      delete: vi.fn(),
      count: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  };

  // Create a class-like constructor
  function MockPrismaClient() {
    return instance;
  }

  return { mockPrismaInstance: instance, MockPrismaClient };
});

// Mock the Prisma client
vi.mock("../../../src/generated/client", () => ({
  PrismaClient: MockPrismaClient,
}));

// Mock logger
vi.mock("../../../src/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Import after mock is set up
import OrderService from "../../../src/services/orderService";

const mockOrder = {
  id: "order-123",
  orderNumber: "ORD-2024-001",
  patientId: "patient-123",
  orderingProviderId: "provider-123",
  modality: "CT",
  bodyPart: "CHEST",
  priority: "ROUTINE",
  status: "SCHEDULED",
  clinicalHistory: "Chest pain",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("OrderService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (OrderService as any).prisma = mockPrismaInstance;
  });

  describe("createOrder", () => {
    it("should create an imaging order successfully", async () => {
      mockPrismaInstance.imagingOrder.create.mockResolvedValue(mockOrder);

      const result = await OrderService.createOrder({
        patientId: "patient-123",
        orderingProviderId: "provider-123",
        modality: "CT",
        bodyPart: "CHEST",
        priority: "ROUTINE",
        clinicalHistory: "Chest pain",
      });

      expect(mockPrismaInstance.imagingOrder.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getOrderById", () => {
    it("should return order when found", async () => {
      mockPrismaInstance.imagingOrder.findUnique.mockResolvedValue(mockOrder);

      const result = await OrderService.getOrderById("order-123");

      expect(mockPrismaInstance.imagingOrder.findUnique).toHaveBeenCalledWith({
        where: { id: "order-123" },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockOrder);
    });

    it("should throw error when order not found", async () => {
      mockPrismaInstance.imagingOrder.findUnique.mockResolvedValue(null);

      await expect(OrderService.getOrderById("non-existent")).rejects.toThrow(
        "Imaging order not found",
      );
    });
  });

  describe("cancelOrder", () => {
    it("should cancel order", async () => {
      const cancelledOrder = { ...mockOrder, status: "CANCELLED" };
      mockPrismaInstance.imagingOrder.update.mockResolvedValue(cancelledOrder);

      const result = await OrderService.cancelOrder("order-123");

      expect(mockPrismaInstance.imagingOrder.update).toHaveBeenCalledWith({
        where: { id: "order-123" },
        data: { status: "CANCELLED" },
      });
      expect(result.status).toBe("CANCELLED");
    });
  });
});
