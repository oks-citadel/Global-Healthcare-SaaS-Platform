/**
 * Unit Tests for Estimate Service
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient, mockDecimal } from "../../helpers/mocks";
import {
  mockChargemasterItem,
  mockGoodFaithEstimate,
  mockGFELineItem,
  mockCreateGFEParams,
} from "../../helpers/fixtures";

// Mock Prisma
vi.mock("../../../src/generated/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
  GFEStatus: {
    draft: "draft",
    pending: "pending",
    sent: "sent",
    delivered: "delivered",
    acknowledged: "acknowledged",
    expired: "expired",
    disputed: "disputed",
  },
  Prisma: {
    Decimal: (value: number) => ({
      toNumber: () => value,
      add: (other: any) => ({
        toNumber: () => value + (other?.toNumber?.() || other),
      }),
      mul: (other: any) => ({
        toNumber: () => value * (other?.toNumber?.() || other),
      }),
      toString: () => value.toString(),
    }),
    JsonArray: Array,
  },
}));

// Import after mocking
import { EstimateService } from "../../../src/services/estimate.service";

describe("EstimateService", () => {
  let service: EstimateService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EstimateService();
    mockPrisma = (service as any).prisma;
  });

  describe("createGoodFaithEstimate", () => {
    it("should create a new Good Faith Estimate", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.goodFaithEstimate.create.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [mockGFELineItem],
      });

      const result = await service.createGoodFaithEstimate(mockCreateGFEParams);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("status", "draft");
      expect(mockPrisma.goodFaithEstimate.create).toHaveBeenCalled();
    });

    it("should calculate estimated total from procedures", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.goodFaithEstimate.create.mockResolvedValue({
        ...mockGoodFaithEstimate,
        estimatedTotal: mockDecimal(250),
        lineItems: [mockGFELineItem],
      });

      const result = await service.createGoodFaithEstimate(mockCreateGFEParams);

      expect(result.estimatedTotal).toBeDefined();
    });

    it("should create line items for each procedure", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.goodFaithEstimate.create.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [mockGFELineItem],
      });

      await service.createGoodFaithEstimate(mockCreateGFEParams);

      const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
      expect(createCall.data.lineItems).toBeDefined();
      expect(createCall.data.lineItems.create).toBeInstanceOf(Array);
    });

    it("should set expiration date based on validForDays", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.goodFaithEstimate.create.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [],
      });

      await service.createGoodFaithEstimate({
        ...mockCreateGFEParams,
        validForDays: 180,
      });

      const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
      const expirationDate = new Date(createCall.data.expirationDate);
      const today = new Date();
      const daysDiff = Math.round(
        (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      expect(daysDiff).toBeCloseTo(180, 0);
    });

    it("should include standard disclaimer", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(
        mockChargemasterItem,
      );
      mockPrisma.goodFaithEstimate.create.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [],
      });

      await service.createGoodFaithEstimate(mockCreateGFEParams);

      const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
      expect(createCall.data.disclaimer).toBeDefined();
      expect(createCall.data.disclaimer).toContain("Good Faith Estimate");
    });

    it("should handle procedures not in chargemaster", async () => {
      mockPrisma.chargemasterItem.findFirst.mockResolvedValue(null);
      mockPrisma.goodFaithEstimate.create.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [],
      });

      const result = await service.createGoodFaithEstimate(mockCreateGFEParams);

      expect(result).toHaveProperty("id");
    });
  });

  describe("getGoodFaithEstimate", () => {
    it("should retrieve GFE by ID", async () => {
      mockPrisma.goodFaithEstimate.findFirst.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [mockGFELineItem],
      });

      const result = await service.getGoodFaithEstimate("gfe-123");

      expect(result).toHaveProperty("id", "gfe-123");
      expect(result!.lineItems).toBeDefined();
    });

    it("should filter by organization if provided", async () => {
      mockPrisma.goodFaithEstimate.findFirst.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [],
      });

      await service.getGoodFaithEstimate("gfe-123", "org-123");

      expect(mockPrisma.goodFaithEstimate.findFirst).toHaveBeenCalledWith({
        where: { id: "gfe-123", organizationId: "org-123" },
        include: { lineItems: true },
      });
    });

    it("should return null for non-existent GFE", async () => {
      mockPrisma.goodFaithEstimate.findFirst.mockResolvedValue(null);

      const result = await service.getGoodFaithEstimate("unknown");

      expect(result).toBeNull();
    });
  });

  describe("listPatientGFEs", () => {
    it("should list GFEs for a patient", async () => {
      mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
        mockGoodFaithEstimate,
      ]);

      const result = await service.listPatientGFEs("patient-789");

      expect(result).toHaveLength(1);
      expect(mockPrisma.goodFaithEstimate.findMany).toHaveBeenCalledWith({
        where: { patientId: "patient-789" },
        include: { lineItems: true },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should filter by status if provided", async () => {
      mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
        mockGoodFaithEstimate,
      ]);

      await service.listPatientGFEs("patient-789", undefined, "draft" as any);

      expect(mockPrisma.goodFaithEstimate.findMany).toHaveBeenCalledWith({
        where: { patientId: "patient-789", status: "draft" },
        include: { lineItems: true },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("updateGFEStatus", () => {
    it("should update GFE status", async () => {
      mockPrisma.goodFaithEstimate.update.mockResolvedValue({
        ...mockGoodFaithEstimate,
        status: "sent",
        lineItems: [],
      });

      const result = await service.updateGFEStatus("gfe-123", "sent" as any);

      expect(result.status).toBe("sent");
    });

    it("should set deliveredAt for delivered status", async () => {
      mockPrisma.goodFaithEstimate.update.mockResolvedValue({
        ...mockGoodFaithEstimate,
        status: "delivered",
        deliveredAt: new Date(),
        lineItems: [],
      });

      await service.updateGFEStatus("gfe-123", "delivered" as any, "email");

      const updateCall = mockPrisma.goodFaithEstimate.update.mock.calls[0][0];
      expect(updateCall.data.deliveredAt).toBeDefined();
      expect(updateCall.data.deliveredMethod).toBe("email");
    });
  });

  describe("recordPatientAcknowledgment", () => {
    it("should record patient acknowledgment with signature", async () => {
      mockPrisma.goodFaithEstimate.update.mockResolvedValue({
        ...mockGoodFaithEstimate,
        status: "acknowledged",
        patientSignature: "John Doe",
        patientSignedAt: new Date(),
        lineItems: [],
      });

      const result = await service.recordPatientAcknowledgment(
        "gfe-123",
        "John Doe",
      );

      expect(result.status).toBe("acknowledged");
      expect(result.patientSignature).toBe("John Doe");
      expect(result.patientSignedAt).toBeDefined();
    });
  });

  describe("addLineItems", () => {
    it("should add line items to existing GFE", async () => {
      mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
        ...mockGoodFaithEstimate,
        status: "draft",
        lineItems: [],
      });
      mockPrisma.gFELineItem.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.gFELineItem.findMany.mockResolvedValue([mockGFELineItem]);
      mockPrisma.goodFaithEstimate.update.mockResolvedValue({
        ...mockGoodFaithEstimate,
        lineItems: [mockGFELineItem],
      });

      const result = await service.addLineItems("gfe-123", [
        {
          serviceCode: "99214",
          serviceDescription: "Office Visit Level 4",
          quantity: 1,
          unitPrice: 350,
        },
      ]);

      expect(mockPrisma.gFELineItem.createMany).toHaveBeenCalled();
    });

    it("should throw error if GFE not found", async () => {
      mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue(null);

      await expect(service.addLineItems("unknown", [])).rejects.toThrow(
        "Good Faith Estimate not found",
      );
    });

    it("should not allow modifications to non-draft GFEs", async () => {
      mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
        ...mockGoodFaithEstimate,
        status: "delivered",
        lineItems: [],
      });

      await expect(service.addLineItems("gfe-123", [])).rejects.toThrow(
        "Cannot modify GFE in current status",
      );
    });
  });

  describe("calculatePatientResponsibility", () => {
    it("should calculate patient responsibility based on insurance", async () => {
      mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
        ...mockGoodFaithEstimate,
        estimatedTotal: mockDecimal(1000),
        lineItems: [],
      });
      mockPrisma.goodFaithEstimate.update.mockResolvedValue({
        ...mockGoodFaithEstimate,
        patientResponsibility: 300,
        lineItems: [],
      });

      const result = await service.calculatePatientResponsibility(
        "gfe-123",
        500, // deductible remaining
        3000, // out of pocket max
        20, // coinsurance %
        50, // copay
      );

      expect(result).toHaveProperty("gfe");
      expect(result).toHaveProperty("calculation");
      expect(result.calculation).toHaveProperty("patientResponsibility");
      expect(result.calculation).toHaveProperty("estimatedInsurancePayment");
    });

    it("should throw error if GFE not found", async () => {
      mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue(null);

      await expect(
        service.calculatePatientResponsibility("unknown", 500, 3000, 20, 50),
      ).rejects.toThrow("Good Faith Estimate not found");
    });

    it("should apply deductible correctly", async () => {
      mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
        ...mockGoodFaithEstimate,
        estimatedTotal: mockDecimal(1000),
        lineItems: [],
      });
      mockPrisma.goodFaithEstimate.update.mockResolvedValue(
        mockGoodFaithEstimate,
      );

      const result = await service.calculatePatientResponsibility(
        "gfe-123",
        500, // deductible remaining
        3000,
        0, // no coinsurance
        0, // no copay
      );

      expect(result.calculation.deductibleApplied).toBe(500);
    });

    it("should cap at out of pocket max", async () => {
      mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
        ...mockGoodFaithEstimate,
        estimatedTotal: mockDecimal(10000),
        lineItems: [],
      });
      mockPrisma.goodFaithEstimate.update.mockResolvedValue(
        mockGoodFaithEstimate,
      );

      const result = await service.calculatePatientResponsibility(
        "gfe-123",
        5000, // high deductible
        2000, // but lower OOP max
        50, // high coinsurance
        500, // high copay
      );

      expect(result.calculation.patientResponsibility).toBeLessThanOrEqual(
        2000,
      );
    });
  });

  describe("getExpiringGFEs", () => {
    it("should return GFEs expiring within specified days", async () => {
      mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
        mockGoodFaithEstimate,
      ]);

      const result = await service.getExpiringGFEs(30);

      expect(mockPrisma.goodFaithEstimate.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          status: { in: ["sent", "delivered", "acknowledged"] },
          expirationDate: expect.any(Object),
        }),
        include: { lineItems: true },
        orderBy: { expirationDate: "asc" },
      });
    });
  });

  describe("markExpiredGFEs", () => {
    it("should mark expired GFEs", async () => {
      mockPrisma.goodFaithEstimate.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markExpiredGFEs();

      expect(result).toBe(5);
      expect(mockPrisma.goodFaithEstimate.updateMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          status: { notIn: ["expired", "disputed"] },
          expirationDate: { lt: expect.any(Date) },
        }),
        data: { status: "expired" },
      });
    });
  });
});
