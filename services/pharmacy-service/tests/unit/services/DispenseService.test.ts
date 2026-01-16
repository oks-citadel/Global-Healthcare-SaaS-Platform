/**
 * Unit Tests for DispenseService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockPrescription,
  mockPrescriptionItem,
  mockControlledPrescriptionItem,
  mockMedication,
  mockControlledMedication,
  mockDispensing,
  mockPharmacy,
  mockDispenseRequest,
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
    medication: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    pharmacy: {
      findUnique: vi.fn(),
    },
    dispensing: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    controlledSubstanceLog: {
      create: vi.fn(),
      findMany: vi.fn(),
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
import { DispenseService } from "../../../src/services/DispenseService";

// Mock dependent services
vi.mock("../../../src/services/InteractionCheckService", () => ({
  default: {
    performSafetyCheck: vi.fn(() =>
      Promise.resolve({
        isSafe: true,
        requiresReview: false,
        interactionCheck: {
          hasCriticalInteractions: false,
          hasSevereInteractions: false,
        },
        allergyCheck: { hasAllergies: false, hasCriticalAllergies: false },
      }),
    ),
  },
}));

vi.mock("../../../src/services/InventoryService", () => ({
  default: {
    checkAvailability: vi.fn(() => Promise.resolve(true)),
    decrementInventory: vi.fn(() => Promise.resolve({ success: true })),
  },
}));

vi.mock("../../../src/services/PDMPService", () => ({
  default: {
    checkPDMP: vi.fn(() =>
      Promise.resolve({ requiresIntervention: false, alerts: [] }),
    ),
    reportToPDMP: vi.fn(() => Promise.resolve({ success: true })),
  },
}));

describe("DispenseService", () => {
  let dispenseService: DispenseService;

  beforeEach(async () => {
    vi.clearAllMocks();
    dispenseService = new DispenseService();
    (dispenseService as any).prisma = mockPrismaInstance;

    // Reset mocks to default successful behavior
    const InteractionCheckService =
      await import("../../../src/services/InteractionCheckService");
    const InventoryService =
      await import("../../../src/services/InventoryService");
    const PDMPService = await import("../../../src/services/PDMPService");

    vi.mocked(
      InteractionCheckService.default.performSafetyCheck,
    ).mockResolvedValue({
      isSafe: true,
      requiresReview: false,
      interactionCheck: {
        hasCriticalInteractions: false,
        hasSevereInteractions: false,
        hasModerateInteractions: false,
        interactions: [],
      },
      allergyCheck: {
        hasAllergies: false,
        hasCriticalAllergies: false,
        allergies: [],
      },
    });
    vi.mocked(InventoryService.default.checkAvailability).mockResolvedValue(
      true,
    );
    vi.mocked(InventoryService.default.decrementInventory).mockResolvedValue({
      success: true,
      quantityDeducted: 30,
    });
    vi.mocked(PDMPService.default.checkPDMP).mockResolvedValue({
      requiresIntervention: false,
      alerts: [],
    });
    vi.mocked(PDMPService.default.reportToPDMP).mockResolvedValue({
      success: true,
    });
  });

  describe("dispenseMedication", () => {
    beforeEach(() => {
      // Setup common mock returns
      mockPrismaInstance.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [mockPrescriptionItem],
      });
      mockPrismaInstance.medication.findUnique.mockResolvedValue(
        mockMedication,
      );
      mockPrismaInstance.dispensing.create.mockResolvedValue(mockDispensing);
      mockPrismaInstance.dispensing.findMany.mockResolvedValue([]);
      mockPrismaInstance.prescriptionItem.update.mockResolvedValue({
        ...mockPrescriptionItem,
        refillsUsed: 1,
      });
    });

    it("should dispense medication successfully", async () => {
      const result =
        await dispenseService.dispenseMedication(mockDispenseRequest);

      expect(result).toBeDefined();
      expect(result.dispensing).toBeDefined();
      expect(result.safetyCheck.isSafe).toBe(true);
    });

    it("should throw error when prescription not found", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue(null);

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("Prescription not found");
    });

    it("should throw error when prescription is not active", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        status: "cancelled",
        items: [mockPrescriptionItem],
      });

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("Prescription status is cancelled");
    });

    it("should throw error when prescription is expired", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        validUntil: new Date("2020-01-01"),
        items: [mockPrescriptionItem],
      });

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("Prescription has expired");
    });

    it("should throw error when prescription item not found", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [],
      });

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("Prescription item not found");
    });

    it("should throw error when no refills remaining", async () => {
      mockPrismaInstance.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [
          {
            ...mockPrescriptionItem,
            refillsAllowed: 2,
            refillsUsed: 2,
          },
        ],
      });

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("No refills remaining");
    });

    it("should throw error when medication not found", async () => {
      mockPrismaInstance.medication.findUnique.mockResolvedValue(null);

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("Medication not found");
    });

    it("should throw error when inventory is insufficient", async () => {
      const InventoryService =
        await import("../../../src/services/InventoryService");
      vi.mocked(InventoryService.default.checkAvailability).mockResolvedValue(
        false,
      );

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("Insufficient inventory");
    });

    it("should throw error when drug interaction detected", async () => {
      const InteractionCheckService =
        await import("../../../src/services/InteractionCheckService");
      vi.mocked(
        InteractionCheckService.default.performSafetyCheck,
      ).mockResolvedValue({
        isSafe: false,
        requiresReview: true,
        interactionCheck: {
          hasCriticalInteractions: true,
          hasSevereInteractions: false,
          hasModerateInteractions: false,
          interactions: [],
        },
        allergyCheck: {
          hasAllergies: false,
          hasCriticalAllergies: false,
          allergies: [],
        },
      });

      await expect(
        dispenseService.dispenseMedication(mockDispenseRequest),
      ).rejects.toThrow("Critical drug interaction or allergy detected");
    });

    it("should create controlled substance log for scheduled medications", async () => {
      // Use controlled item with 1 refill allowed for initial dispense
      const controlledItemWithRefill = {
        ...mockControlledPrescriptionItem,
        refillsAllowed: 1,
        refillsUsed: 0,
      };
      mockPrismaInstance.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [controlledItemWithRefill],
      });
      mockPrismaInstance.medication.findUnique.mockResolvedValue(
        mockControlledMedication,
      );
      mockPrismaInstance.pharmacy.findUnique.mockResolvedValue(mockPharmacy);
      mockPrismaInstance.controlledSubstanceLog.create.mockResolvedValue({
        id: "log-123",
        patientId: "patient-123",
        prescriberId: "provider-123",
        pharmacistId: "pharmacist-123",
        medicationName: "Oxycodone",
        ndcCode: "0999-0000-01",
        schedule: "II",
        quantity: 30,
        dispenseDate: new Date(),
        prescriptionDate: new Date(),
        refillNumber: 0,
      });

      const result = await dispenseService.dispenseMedication({
        ...mockDispenseRequest,
        prescriptionItemId: "item-controlled-123",
      });

      expect(result.controlledSubstanceLog).toBeDefined();
    });

    it("should throw error when PDMP check requires intervention", async () => {
      // Use controlled item with 1 refill allowed for initial dispense
      const controlledItemWithRefill = {
        ...mockControlledPrescriptionItem,
        refillsAllowed: 1,
        refillsUsed: 0,
      };
      mockPrismaInstance.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [controlledItemWithRefill],
      });
      mockPrismaInstance.medication.findUnique.mockResolvedValue(
        mockControlledMedication,
      );

      const PDMPService = await import("../../../src/services/PDMPService");
      vi.mocked(PDMPService.default.checkPDMP).mockResolvedValue({
        requiresIntervention: true,
        alerts: ["Patient has multiple controlled substance prescriptions"],
      });

      await expect(
        dispenseService.dispenseMedication({
          ...mockDispenseRequest,
          prescriptionItemId: "item-controlled-123",
        }),
      ).rejects.toThrow("PDMP alert");
    });

    it("should increment refill count after dispensing", async () => {
      await dispenseService.dispenseMedication(mockDispenseRequest);

      expect(mockPrismaInstance.prescriptionItem.update).toHaveBeenCalledWith({
        where: { id: "item-123" },
        data: { refillsUsed: { increment: 1 } },
      });
    });
  });

  describe("getPatientDispensingHistory", () => {
    it("should return patient dispensing history", async () => {
      mockPrismaInstance.dispensing.findMany.mockResolvedValue([
        mockDispensing,
      ]);

      const result =
        await dispenseService.getPatientDispensingHistory("patient-123");

      expect(mockPrismaInstance.dispensing.findMany).toHaveBeenCalledWith({
        where: { patientId: "patient-123" },
        orderBy: { dispensedAt: "desc" },
        take: 50,
      });
      expect(result).toHaveLength(1);
    });

    it("should respect limit parameter", async () => {
      mockPrismaInstance.dispensing.findMany.mockResolvedValue([]);

      await dispenseService.getPatientDispensingHistory("patient-123", 10);

      const findCall = mockPrismaInstance.dispensing.findMany.mock.calls[0][0];
      expect(findCall.take).toBe(10);
    });
  });

  describe("getPatientCurrentMedications", () => {
    it("should return medications dispensed in last 90 days", async () => {
      mockPrismaInstance.dispensing.findMany.mockResolvedValue([
        { ...mockDispensing, medicationName: "Metformin" },
        { ...mockDispensing, medicationName: "Lisinopril" },
      ]);

      const result =
        await dispenseService.getPatientCurrentMedications("patient-123");

      expect(result).toEqual(["Metformin", "Lisinopril"]);
    });

    it("should return empty array when no recent dispensings", async () => {
      mockPrismaInstance.dispensing.findMany.mockResolvedValue([]);

      const result =
        await dispenseService.getPatientCurrentMedications("patient-123");

      expect(result).toEqual([]);
    });
  });

  describe("getDispensing", () => {
    it("should return dispensing record by id", async () => {
      mockPrismaInstance.dispensing.findUnique.mockResolvedValue(
        mockDispensing,
      );

      const result = await dispenseService.getDispensing("dispensing-123");

      expect(mockPrismaInstance.dispensing.findUnique).toHaveBeenCalledWith({
        where: { id: "dispensing-123" },
      });
      expect(result).toEqual(mockDispensing);
    });

    it("should return null when dispensing not found", async () => {
      mockPrismaInstance.dispensing.findUnique.mockResolvedValue(null);

      const result = await dispenseService.getDispensing("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("updateDispensingStatus", () => {
    it("should update dispensing status", async () => {
      const updatedDispensing = { ...mockDispensing, status: "cancelled" };
      mockPrismaInstance.dispensing.update.mockResolvedValue(updatedDispensing);

      const result = await dispenseService.updateDispensingStatus(
        "dispensing-123",
        "cancelled",
      );

      expect(mockPrismaInstance.dispensing.update).toHaveBeenCalledWith({
        where: { id: "dispensing-123" },
        data: { status: "cancelled" },
      });
      expect(result.status).toBe("cancelled");
    });
  });

  describe("returnMedication", () => {
    it("should process medication return successfully", async () => {
      mockPrismaInstance.dispensing.findUnique.mockResolvedValue(
        mockDispensing,
      );
      mockPrismaInstance.dispensing.update.mockResolvedValue(mockDispensing);

      const result = await dispenseService.returnMedication(
        "dispensing-123",
        10,
      );

      expect(result.success).toBe(true);
      expect(result.quantityReturned).toBe(10);
    });

    it("should throw error when dispensing record not found", async () => {
      mockPrismaInstance.dispensing.findUnique.mockResolvedValue(null);

      await expect(
        dispenseService.returnMedication("non-existent", 10),
      ).rejects.toThrow("Dispensing record not found");
    });

    it("should throw error when return quantity exceeds dispensed", async () => {
      mockPrismaInstance.dispensing.findUnique.mockResolvedValue({
        ...mockDispensing,
        quantity: 30,
      });

      await expect(
        dispenseService.returnMedication("dispensing-123", 50),
      ).rejects.toThrow("Cannot return more than dispensed quantity");
    });

    it("should update dispensing notes with return information", async () => {
      mockPrismaInstance.dispensing.findUnique.mockResolvedValue(
        mockDispensing,
      );
      mockPrismaInstance.dispensing.update.mockResolvedValue(mockDispensing);

      await dispenseService.returnMedication("dispensing-123", 10);

      const updateCall = mockPrismaInstance.dispensing.update.mock.calls[0][0];
      expect(updateCall.data.notes).toContain("Returned 10 units");
    });
  });
});
