/**
 * Unit Tests for Appeal Generation Service
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient } from "../../helpers/mocks";
import {
  mockDenial,
  mockAppeal,
  mockPayerConfig,
  mockAppealGenerationInput,
} from "../../helpers/fixtures";

// Mock Prisma
vi.mock("../../../src/generated/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
}));

// Mock logger
vi.mock("../../../src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Import after mocking
import { AppealGenerationService } from "../../../src/services/appeal-generation.service";

describe("AppealGenerationService", () => {
  let service: AppealGenerationService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AppealGenerationService();
    mockPrisma = (service as any).prisma;
  });

  describe("generateAppeal", () => {
    it("should generate an appeal for a denial", async () => {
      mockPrisma.denial.findUnique.mockResolvedValue({
        ...mockDenial,
        appeals: [],
      });
      mockPrisma.payerConfig.findFirst.mockResolvedValue(mockPayerConfig);
      mockPrisma.appeal.create.mockResolvedValue(mockAppeal);
      mockPrisma.denial.update.mockResolvedValue(mockDenial);

      const result = await service.generateAppeal(mockAppealGenerationInput);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("appealLevel", 1);
      expect(mockPrisma.appeal.create).toHaveBeenCalled();
    });

    it("should throw error if denial not found", async () => {
      mockPrisma.denial.findUnique.mockResolvedValue(null);

      await expect(
        service.generateAppeal({
          ...mockAppealGenerationInput,
          denialId: "unknown",
        }),
      ).rejects.toThrow("Denial not found");
    });

    it("should calculate correct appeal deadline based on payer config", async () => {
      const payerWithShortDeadline = {
        ...mockPayerConfig,
        appealTimeLimit: 30,
      };
      mockPrisma.denial.findUnique.mockResolvedValue({
        ...mockDenial,
        appeals: [],
      });
      mockPrisma.payerConfig.findFirst.mockResolvedValue(
        payerWithShortDeadline,
      );
      mockPrisma.appeal.create.mockResolvedValue(mockAppeal);
      mockPrisma.denial.update.mockResolvedValue(mockDenial);

      await service.generateAppeal(mockAppealGenerationInput);

      const createCall = mockPrisma.appeal.create.mock.calls[0][0];
      const deadlineDate = new Date(createCall.data.deadlineDate);
      const filedDate = new Date(createCall.data.filedDate);
      const daysDiff = Math.round(
        (deadlineDate.getTime() - filedDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      expect(daysDiff).toBeLessThanOrEqual(30);
    });

    it("should increment appeal level for subsequent appeals", async () => {
      const denialWithAppeals = {
        ...mockDenial,
        appeals: [mockAppeal],
      };
      mockPrisma.denial.findUnique.mockResolvedValue(denialWithAppeals);
      mockPrisma.payerConfig.findFirst.mockResolvedValue(mockPayerConfig);
      mockPrisma.appeal.create.mockResolvedValue({
        ...mockAppeal,
        appealLevel: 2,
      });
      mockPrisma.denial.update.mockResolvedValue(mockDenial);

      const result = await service.generateAppeal({
        ...mockAppealGenerationInput,
        appealLevel: 2,
      });

      expect(result.appealLevel).toBe(2);
    });

    it("should throw error if max appeal levels exceeded", async () => {
      const payerWithLimitedAppeals = {
        ...mockPayerConfig,
        appealLevels: 2,
      };
      const denialWithMaxAppeals = {
        ...mockDenial,
        appeals: [
          { ...mockAppeal, appealLevel: 1 },
          { ...mockAppeal, id: "appeal-2", appealLevel: 2 },
        ],
      };
      mockPrisma.denial.findUnique.mockResolvedValue(denialWithMaxAppeals);
      mockPrisma.payerConfig.findFirst.mockResolvedValue(
        payerWithLimitedAppeals,
      );

      await expect(
        service.generateAppeal({
          ...mockAppealGenerationInput,
          appealLevel: 3,
        }),
      ).rejects.toThrow(/maximum appeal levels/i);
    });

    it("should use default payer config if none found", async () => {
      mockPrisma.denial.findUnique.mockResolvedValue({
        ...mockDenial,
        appeals: [],
      });
      mockPrisma.payerConfig.findFirst.mockResolvedValue(null);
      mockPrisma.appeal.create.mockResolvedValue(mockAppeal);
      mockPrisma.denial.update.mockResolvedValue(mockDenial);

      const result = await service.generateAppeal(mockAppealGenerationInput);

      expect(result).toHaveProperty("id");
    });
  });

  describe("generateAppealLetter", () => {
    it("should generate appeal letter content", async () => {
      mockPrisma.denial.findUnique.mockResolvedValue({
        ...mockDenial,
        appeals: [mockAppeal],
      });
      mockPrisma.payerConfig.findFirst.mockResolvedValue(mockPayerConfig);

      const letter = await service.generateAppealLetter("denial-123");

      expect(letter).toHaveProperty("content");
      expect(letter.content).toContain(mockDenial.patientName);
      expect(letter.content).toContain(mockDenial.originalClaimNumber);
    });

    it("should include denial reason in letter", async () => {
      mockPrisma.denial.findUnique.mockResolvedValue({
        ...mockDenial,
        appeals: [mockAppeal],
      });
      mockPrisma.payerConfig.findFirst.mockResolvedValue(mockPayerConfig);

      const letter = await service.generateAppealLetter("denial-123");

      expect(letter.content).toContain(mockDenial.denialReasonCode);
    });

    it("should throw error if denial has no appeals", async () => {
      mockPrisma.denial.findUnique.mockResolvedValue({
        ...mockDenial,
        appeals: [],
      });

      await expect(service.generateAppealLetter("denial-123")).rejects.toThrow(
        "No appeal found",
      );
    });
  });

  describe("getAppealStatus", () => {
    it("should retrieve appeal status", async () => {
      mockPrisma.appeal.findUnique.mockResolvedValue(mockAppeal);

      const status = await service.getAppealStatus("appeal-123");

      expect(status).toEqual(mockAppeal.status);
    });

    it("should return null for non-existent appeals", async () => {
      mockPrisma.appeal.findUnique.mockResolvedValue(null);

      const status = await service.getAppealStatus("unknown-appeal");

      expect(status).toBeNull();
    });
  });

  describe("updateAppealStatus", () => {
    it("should update appeal status", async () => {
      const updatedAppeal = { ...mockAppeal, status: "approved" };
      mockPrisma.appeal.update.mockResolvedValue(updatedAppeal);
      mockPrisma.denial.update.mockResolvedValue(mockDenial);

      const result = await service.updateAppealStatus(
        "appeal-123",
        "approved",
        1500.0,
      );

      expect(mockPrisma.appeal.update).toHaveBeenCalledWith({
        where: { id: "appeal-123" },
        data: expect.objectContaining({
          status: "approved",
          approvedAmount: 1500.0,
        }),
      });
      expect(result.status).toBe("approved");
    });
  });

  describe("getAppealsForDenial", () => {
    it("should retrieve all appeals for a denial", async () => {
      mockPrisma.appeal.findMany.mockResolvedValue([mockAppeal]);

      const appeals = await service.getAppealsForDenial("denial-123");

      expect(mockPrisma.appeal.findMany).toHaveBeenCalledWith({
        where: { denialId: "denial-123" },
        orderBy: { appealLevel: "asc" },
      });
      expect(appeals).toHaveLength(1);
    });
  });

  describe("getRequiredDocuments", () => {
    it("should return required documents based on payer config", async () => {
      mockPrisma.payerConfig.findFirst.mockResolvedValue(mockPayerConfig);

      const docs = await service.getRequiredDocuments("payer-001", "CO-4");

      expect(docs).toEqual(mockPayerConfig.requiredDocuments);
    });

    it("should return default documents if no payer config", async () => {
      mockPrisma.payerConfig.findFirst.mockResolvedValue(null);

      const docs = await service.getRequiredDocuments("unknown-payer", "CO-4");

      expect(docs).toBeInstanceOf(Array);
      expect(docs.length).toBeGreaterThan(0);
    });
  });

  describe("calculateAppealDeadline", () => {
    it("should calculate deadline based on payer time limit", async () => {
      mockPrisma.payerConfig.findFirst.mockResolvedValue({
        ...mockPayerConfig,
        appealTimeLimit: 45,
      });

      const deadline = await service.calculateAppealDeadline(
        "payer-001",
        new Date("2024-01-15"),
      );

      const expectedDeadline = new Date("2024-01-15");
      expectedDeadline.setDate(expectedDeadline.getDate() + 45);

      expect(deadline.toDateString()).toBe(expectedDeadline.toDateString());
    });
  });
});
