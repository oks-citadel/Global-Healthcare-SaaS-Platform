/**
 * Unit Tests for PrescriptionService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockPrescription,
  mockPrescriptionItem,
  mockCreatePrescriptionInput,
} from "../helpers/fixtures";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
    prescription: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    prescriptionItem: {
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

// Import after mock is set up
import { PrescriptionService } from "../../../src/services/PrescriptionService";

describe("PrescriptionService", () => {
  let prescriptionService: PrescriptionService;

  beforeEach(() => {
    vi.clearAllMocks();
    prescriptionService = new PrescriptionService();
    // Replace internal prisma with our mock
    (prescriptionService as any).prisma = mockPrismaInstance;
  });

  describe("createPrescription", () => {
    it("should create a prescription with items successfully", async () => {
      const createdPrescription = {
        ...mockPrescription,
        items: [mockPrescriptionItem],
      };
      mockPrismaInstance.prescription.create.mockResolvedValue(
        createdPrescription,
      );

      const result = await prescriptionService.createPrescription(
        mockCreatePrescriptionInput,
      );

      expect(mockPrismaInstance.prescription.create).toHaveBeenCalledWith({
        data: {
          patientId: mockCreatePrescriptionInput.patientId,
          providerId: mockCreatePrescriptionInput.providerId,
          encounterId: mockCreatePrescriptionInput.encounterId,
          notes: mockCreatePrescriptionInput.notes,
          validUntil: mockCreatePrescriptionInput.validUntil,
          items: {
            create: mockCreatePrescriptionInput.items,
          },
        },
        include: {
          items: true,
        },
      });
      expect(result).toEqual(createdPrescription);
    });

    it("should create prescription without optional fields", async () => {
      const minimalInput = {
        patientId: "patient-123",
        providerId: "provider-123",
        items: [
          {
            medicationName: "Aspirin",
            dosage: "100mg",
            frequency: "daily",
            refillsAllowed: 0,
            isGenericAllowed: true,
          },
        ],
      };
      mockPrismaInstance.prescription.create.mockResolvedValue(
        mockPrescription,
      );

      await prescriptionService.createPrescription(minimalInput);

      const createCall =
        mockPrismaInstance.prescription.create.mock.calls[0][0];
      expect(createCall.data.encounterId).toBeUndefined();
      expect(createCall.data.notes).toBeUndefined();
    });

    it("should throw error when creation fails", async () => {
      mockPrismaInstance.prescription.create.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        prescriptionService.createPrescription(mockCreatePrescriptionInput),
      ).rejects.toThrow("Database error");
    });
  });

  describe("getPrescription", () => {
    it("should return prescription with items when found", async () => {
      const prescription = {
        ...mockPrescription,
        items: [mockPrescriptionItem],
      };
      mockPrismaInstance.prescription.findUnique.mockResolvedValue(
        prescription,
      );

      const result =
        await prescriptionService.getPrescription("prescription-123");

      expect(mockPrismaInstance.prescription.findUnique).toHaveBeenCalledWith({
        where: { id: "prescription-123" },
        include: {
          items: true,
        },
      });
      expect(result).toEqual(prescription);
    });

    it("should return null when prescription not found", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue(null);

      const result = await prescriptionService.getPrescription("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("listPrescriptions", () => {
    it("should return paginated prescriptions with total count", async () => {
      const prescriptions = [
        mockPrescription,
        { ...mockPrescription, id: "prescription-456" },
      ];
      mockPrismaInstance.prescription.findMany.mockResolvedValue(prescriptions);
      mockPrismaInstance.prescription.count.mockResolvedValue(10);

      const result = await prescriptionService.listPrescriptions({
        patientId: "patient-123",
        limit: 20,
        offset: 0,
      });

      expect(result.prescriptions).toHaveLength(2);
      expect(result.total).toBe(10);
    });

    it("should filter by patient ID", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([
        mockPrescription,
      ]);
      mockPrismaInstance.prescription.count.mockResolvedValue(1);

      await prescriptionService.listPrescriptions({ patientId: "patient-123" });

      const findCall =
        mockPrismaInstance.prescription.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe("patient-123");
    });

    it("should filter by provider ID", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([
        mockPrescription,
      ]);
      mockPrismaInstance.prescription.count.mockResolvedValue(1);

      await prescriptionService.listPrescriptions({
        providerId: "provider-123",
      });

      const findCall =
        mockPrismaInstance.prescription.findMany.mock.calls[0][0];
      expect(findCall.where.providerId).toBe("provider-123");
    });

    it("should filter by status", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([
        mockPrescription,
      ]);
      mockPrismaInstance.prescription.count.mockResolvedValue(1);

      await prescriptionService.listPrescriptions({ status: "active" });

      const findCall =
        mockPrismaInstance.prescription.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe("active");
    });

    it("should use default pagination values", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([]);
      mockPrismaInstance.prescription.count.mockResolvedValue(0);

      await prescriptionService.listPrescriptions({});

      const findCall =
        mockPrismaInstance.prescription.findMany.mock.calls[0][0];
      expect(findCall.take).toBe(50);
      expect(findCall.skip).toBe(0);
    });

    it("should order by createdAt descending", async () => {
      mockPrismaInstance.prescription.findMany.mockResolvedValue([]);
      mockPrismaInstance.prescription.count.mockResolvedValue(0);

      await prescriptionService.listPrescriptions({});

      const findCall =
        mockPrismaInstance.prescription.findMany.mock.calls[0][0];
      expect(findCall.orderBy.createdAt).toBe("desc");
    });
  });

  describe("updatePrescription", () => {
    it("should update prescription fields", async () => {
      const updatedPrescription = {
        ...mockPrescription,
        notes: "Updated notes",
      };
      mockPrismaInstance.prescription.update.mockResolvedValue(
        updatedPrescription,
      );

      const result = await prescriptionService.updatePrescription(
        "prescription-123",
        {
          notes: "Updated notes",
        },
      );

      expect(mockPrismaInstance.prescription.update).toHaveBeenCalledWith({
        where: { id: "prescription-123" },
        data: { notes: "Updated notes" },
        include: { items: true },
      });
      expect(result.notes).toBe("Updated notes");
    });

    it("should update prescription status", async () => {
      const updatedPrescription = { ...mockPrescription, status: "completed" };
      mockPrismaInstance.prescription.update.mockResolvedValue(
        updatedPrescription,
      );

      const result = await prescriptionService.updatePrescription(
        "prescription-123",
        {
          status: "completed",
        },
      );

      expect(result.status).toBe("completed");
    });
  });

  describe("cancelPrescription", () => {
    it("should set prescription status to cancelled", async () => {
      const cancelledPrescription = {
        ...mockPrescription,
        status: "cancelled",
      };
      mockPrismaInstance.prescription.update.mockResolvedValue(
        cancelledPrescription,
      );

      const result =
        await prescriptionService.cancelPrescription("prescription-123");

      expect(mockPrismaInstance.prescription.update).toHaveBeenCalledWith({
        where: { id: "prescription-123" },
        data: { status: "cancelled" },
        include: { items: true },
      });
      expect(result.status).toBe("cancelled");
    });
  });

  describe("checkExpiredPrescriptions", () => {
    it("should update expired prescriptions status", async () => {
      mockPrismaInstance.prescription.updateMany.mockResolvedValue({
        count: 5,
      });

      const result = await prescriptionService.checkExpiredPrescriptions();

      expect(mockPrismaInstance.prescription.updateMany).toHaveBeenCalledWith({
        where: {
          validUntil: {
            lte: expect.any(Date),
          },
          status: "active",
        },
        data: {
          status: "expired",
        },
      });
      expect(result.count).toBe(5);
    });

    it("should return count of 0 when no prescriptions expired", async () => {
      mockPrismaInstance.prescription.updateMany.mockResolvedValue({
        count: 0,
      });

      const result = await prescriptionService.checkExpiredPrescriptions();

      expect(result.count).toBe(0);
    });
  });

  describe("getRefillsRemaining", () => {
    it("should return refill information for prescription item", async () => {
      const item = {
        ...mockPrescriptionItem,
        refillsAllowed: 5,
        refillsUsed: 2,
      };
      mockPrismaInstance.prescriptionItem.findUnique.mockResolvedValue(item);

      const result = await prescriptionService.getRefillsRemaining("item-123");

      expect(result).toEqual({
        allowed: 5,
        used: 2,
        remaining: 3,
      });
    });

    it("should return null when prescription item not found", async () => {
      mockPrismaInstance.prescriptionItem.findUnique.mockResolvedValue(null);

      const result =
        await prescriptionService.getRefillsRemaining("non-existent");

      expect(result).toBeNull();
    });

    it("should handle zero refills correctly", async () => {
      const item = {
        ...mockPrescriptionItem,
        refillsAllowed: 0,
        refillsUsed: 0,
      };
      mockPrismaInstance.prescriptionItem.findUnique.mockResolvedValue(item);

      const result = await prescriptionService.getRefillsRemaining("item-123");

      expect(result).toEqual({
        allowed: 0,
        used: 0,
        remaining: 0,
      });
    });
  });

  describe("incrementRefillCount", () => {
    it("should increment refillsUsed by 1", async () => {
      const updatedItem = { ...mockPrescriptionItem, refillsUsed: 1 };
      mockPrismaInstance.prescriptionItem.update.mockResolvedValue(updatedItem);

      const result = await prescriptionService.incrementRefillCount("item-123");

      expect(mockPrismaInstance.prescriptionItem.update).toHaveBeenCalledWith({
        where: { id: "item-123" },
        data: {
          refillsUsed: {
            increment: 1,
          },
        },
      });
      expect(result.refillsUsed).toBe(1);
    });
  });
});
