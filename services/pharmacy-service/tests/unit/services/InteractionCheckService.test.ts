/**
 * Unit Tests for InteractionCheckService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDrugInteraction, mockDrugAllergy } from "../helpers/fixtures";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
    drugInteraction: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    drugAllergy: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
import { InteractionCheckService } from "../../../src/services/InteractionCheckService";

describe("InteractionCheckService", () => {
  let interactionService: InteractionCheckService;

  beforeEach(() => {
    vi.clearAllMocks();
    interactionService = new InteractionCheckService();
    (interactionService as any).prisma = mockPrismaInstance;
  });

  describe("checkDrugInteractions", () => {
    it("should return no interactions for single medication", async () => {
      const result = await interactionService.checkDrugInteractions([
        "Metformin",
      ]);

      expect(result.hasCriticalInteractions).toBe(false);
      expect(result.hasSevereInteractions).toBe(false);
      expect(result.hasModerateInteractions).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it("should return no interactions when none found", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([]);

      const result = await interactionService.checkDrugInteractions([
        "Metformin",
        "Lisinopril",
      ]);

      expect(result.hasCriticalInteractions).toBe(false);
      expect(result.hasSevereInteractions).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it("should detect critical (contraindicated) interactions", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([
        {
          ...mockDrugInteraction,
          severity: "contraindicated",
        },
      ]);

      const result = await interactionService.checkDrugInteractions([
        "Warfarin",
        "Aspirin",
      ]);

      expect(result.hasCriticalInteractions).toBe(true);
      expect(result.interactions).toHaveLength(1);
    });

    it("should detect severe interactions", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([
        {
          ...mockDrugInteraction,
          severity: "severe",
        },
      ]);

      const result = await interactionService.checkDrugInteractions([
        "Warfarin",
        "Aspirin",
      ]);

      expect(result.hasSevereInteractions).toBe(true);
    });

    it("should detect moderate interactions", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([
        {
          ...mockDrugInteraction,
          severity: "moderate",
        },
      ]);

      const result = await interactionService.checkDrugInteractions([
        "Warfarin",
        "Aspirin",
      ]);

      expect(result.hasModerateInteractions).toBe(true);
    });

    it("should check all medication pairs", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([]);

      await interactionService.checkDrugInteractions([
        "Drug1",
        "Drug2",
        "Drug3",
      ]);

      // Should check 3 pairs: (1,2), (1,3), (2,3)
      expect(mockPrismaInstance.drugInteraction.findMany).toHaveBeenCalledTimes(
        3,
      );
    });

    it("should check interactions in both directions", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([]);

      await interactionService.checkDrugInteractions(["Warfarin", "Aspirin"]);

      const findCall =
        mockPrismaInstance.drugInteraction.findMany.mock.calls[0][0];
      expect(findCall.where.OR).toHaveLength(2);
    });
  });

  describe("checkDrugAllergies", () => {
    it("should return no allergies when patient has none", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.checkDrugAllergies(
        "patient-123",
        ["Metformin"],
      );

      expect(result.hasAllergies).toBe(false);
      expect(result.hasCriticalAllergies).toBe(false);
      expect(result.allergies).toHaveLength(0);
    });

    it("should return no allergies when medications dont match", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        mockDrugAllergy,
      ]); // Penicillin allergy

      const result = await interactionService.checkDrugAllergies(
        "patient-123",
        ["Metformin"],
      );

      expect(result.hasAllergies).toBe(false);
    });

    it("should detect allergy match", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        mockDrugAllergy,
      ]);

      const result = await interactionService.checkDrugAllergies(
        "patient-123",
        ["Penicillin", "Metformin"],
      );

      expect(result.hasAllergies).toBe(true);
      expect(result.allergies).toHaveLength(1);
    });

    it("should detect critical allergies (anaphylaxis)", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        {
          ...mockDrugAllergy,
          reaction: "anaphylaxis",
        },
      ]);

      const result = await interactionService.checkDrugAllergies(
        "patient-123",
        ["Penicillin"],
      );

      expect(result.hasCriticalAllergies).toBe(true);
    });

    it("should detect critical allergies (severe severity)", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        {
          ...mockDrugAllergy,
          severity: "severe",
        },
      ]);

      const result = await interactionService.checkDrugAllergies(
        "patient-123",
        ["Penicillin"],
      );

      expect(result.hasCriticalAllergies).toBe(true);
    });

    it("should only check active allergies", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      await interactionService.checkDrugAllergies("patient-123", ["Metformin"]);

      const findCall = mockPrismaInstance.drugAllergy.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe("patient-123");
      expect(findCall.where.isActive).toBe(true);
    });

    it("should match partial medication names", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        {
          ...mockDrugAllergy,
          allergen: "Penicillin",
        },
      ]);

      // Should match "Amoxicillin" because it contains "cillin" similar to Penicillin class
      const result = await interactionService.checkDrugAllergies(
        "patient-123",
        ["Penicillin VK"],
      );

      expect(result.hasAllergies).toBe(true);
    });
  });

  describe("performSafetyCheck", () => {
    it("should return safe when no issues detected", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([]);
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck(
        "patient-123",
        ["Metformin", "Lisinopril"],
      );

      expect(result.isSafe).toBe(true);
      expect(result.requiresReview).toBe(false);
    });

    it("should return unsafe when critical interaction detected", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([
        {
          ...mockDrugInteraction,
          severity: "contraindicated",
        },
      ]);
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck(
        "patient-123",
        ["Warfarin", "Aspirin"],
      );

      expect(result.isSafe).toBe(false);
    });

    it("should return unsafe when severe interaction detected", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([
        {
          ...mockDrugInteraction,
          severity: "severe",
        },
      ]);
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck(
        "patient-123",
        ["Warfarin", "Aspirin"],
      );

      expect(result.isSafe).toBe(false);
    });

    it("should return unsafe when critical allergy detected", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([]);
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        {
          ...mockDrugAllergy,
          reaction: "anaphylaxis",
        },
      ]);

      const result = await interactionService.performSafetyCheck(
        "patient-123",
        ["Penicillin"],
      );

      expect(result.isSafe).toBe(false);
    });

    it("should require review for moderate interactions", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([
        {
          ...mockDrugInteraction,
          severity: "moderate",
        },
      ]);
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck(
        "patient-123",
        ["Drug1", "Drug2"],
      );

      expect(result.isSafe).toBe(true);
      expect(result.requiresReview).toBe(true);
    });

    it("should require review for non-critical allergies", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([]);
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        {
          ...mockDrugAllergy,
          reaction: "rash",
          severity: "mild",
        },
      ]);

      const result = await interactionService.performSafetyCheck(
        "patient-123",
        ["Penicillin"],
      );

      expect(result.isSafe).toBe(true);
      expect(result.requiresReview).toBe(true);
    });

    it("should include both checks in result", async () => {
      mockPrismaInstance.drugInteraction.findMany.mockResolvedValue([]);
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck(
        "patient-123",
        ["Metformin"],
      );

      expect(result.interactionCheck).toBeDefined();
      expect(result.allergyCheck).toBeDefined();
    });
  });

  describe("addDrugInteraction", () => {
    it("should create a new drug interaction record", async () => {
      mockPrismaInstance.drugInteraction.create.mockResolvedValue(
        mockDrugInteraction,
      );

      const result = await interactionService.addDrugInteraction({
        drug1Name: "Warfarin",
        drug2Name: "Aspirin",
        severityLevel: "severe",
        description: "Increased bleeding risk",
      });

      expect(mockPrismaInstance.drugInteraction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          drug1Name: "Warfarin",
          drug2Name: "Aspirin",
          severity: "severe",
          description: "Increased bleeding risk",
          source: "manual",
        }),
      });
      expect(result).toEqual(mockDrugInteraction);
    });
  });

  describe("addDrugAllergy", () => {
    it("should create a new drug allergy record", async () => {
      mockPrismaInstance.drugAllergy.create.mockResolvedValue(mockDrugAllergy);

      const result = await interactionService.addDrugAllergy({
        patientId: "patient-123",
        allergen: "Penicillin",
        reactionType: "anaphylaxis",
        symptoms: ["hives", "swelling"],
      });

      expect(mockPrismaInstance.drugAllergy.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          patientId: "patient-123",
          allergen: "Penicillin",
          reaction: "anaphylaxis",
        }),
      });
      expect(result).toEqual(mockDrugAllergy);
    });
  });

  describe("getPatientAllergies", () => {
    it("should return all active allergies for patient", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([
        mockDrugAllergy,
      ]);

      const result =
        await interactionService.getPatientAllergies("patient-123");

      expect(mockPrismaInstance.drugAllergy.findMany).toHaveBeenCalledWith({
        where: {
          patientId: "patient-123",
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      expect(result).toHaveLength(1);
    });

    it("should return empty array when no allergies", async () => {
      mockPrismaInstance.drugAllergy.findMany.mockResolvedValue([]);

      const result =
        await interactionService.getPatientAllergies("patient-123");

      expect(result).toHaveLength(0);
    });
  });

  describe("deactivateAllergy", () => {
    it("should set allergy isActive to false", async () => {
      mockPrismaInstance.drugAllergy.update.mockResolvedValue({
        ...mockDrugAllergy,
        isActive: false,
      });

      const result = await interactionService.deactivateAllergy("allergy-123");

      expect(mockPrismaInstance.drugAllergy.update).toHaveBeenCalledWith({
        where: { id: "allergy-123" },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });
});
