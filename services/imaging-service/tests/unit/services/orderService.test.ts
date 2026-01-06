/**
 * Unit Tests for OrderService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
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
  });
  return { mockPrismaInstance: mockFn() };
});

// Mock the Prisma client
vi.mock("../../../src/generated/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaInstance),
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

  describe("getOrder", () => {
    it("should return order when found", async () => {
      mockPrismaInstance.imagingOrder.findUnique.mockResolvedValue(mockOrder);

      const result = await OrderService.getOrder("order-123");

      expect(mockPrismaInstance.imagingOrder.findUnique).toHaveBeenCalledWith({
        where: { id: "order-123" },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockOrder);
    });

    it("should return null when order not found", async () => {
      mockPrismaInstance.imagingOrder.findUnique.mockResolvedValue(null);

      const result = await OrderService.getOrder("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status", async () => {
      const updatedOrder = { ...mockOrder, status: "IN_PROGRESS" };
      mockPrismaInstance.imagingOrder.update.mockResolvedValue(updatedOrder);

      const result = await OrderService.updateOrderStatus(
        "order-123",
        "IN_PROGRESS",
      );

      expect(mockPrismaInstance.imagingOrder.update).toHaveBeenCalledWith({
        where: { id: "order-123" },
        data: { status: "IN_PROGRESS" },
      });
      expect(result.status).toBe("IN_PROGRESS");
    });
  });
});
