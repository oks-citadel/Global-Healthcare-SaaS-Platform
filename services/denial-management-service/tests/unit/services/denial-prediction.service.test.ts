/**
 * Unit Tests for Denial Prediction Service
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient } from "../../helpers/mocks";
import {
  mockDenial,
  mockDenialPattern,
  mockClaimRiskAssessment,
  mockPayerConfig,
  mockPredictionInput,
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
import { DenialPredictionService } from "../../../src/services/denial-prediction.service";

describe("DenialPredictionService", () => {
  let service: DenialPredictionService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DenialPredictionService();
    mockPrisma = (service as any).prisma;
  });

  describe("predictDenialRisk", () => {
    it("should calculate denial risk for a claim", async () => {
      mockPrisma.denialPattern.findFirst.mockResolvedValue(mockDenialPattern);
      mockPrisma.denial.count.mockResolvedValue(10);
      mockPrisma.denial.findMany.mockResolvedValue([mockDenial]);
      mockPrisma.claimRiskAssessment.create.mockResolvedValue(
        mockClaimRiskAssessment,
      );

      const result = await service.predictDenialRisk(mockPredictionInput);

      expect(result).toHaveProperty("riskScore");
      expect(result).toHaveProperty("riskLevel");
      expect(result).toHaveProperty("riskFactors");
      expect(typeof result.riskScore).toBe("number");
      expect(result.riskScore).toBeGreaterThanOrEqual(0);
      expect(result.riskScore).toBeLessThanOrEqual(1);
    });

    it("should return low risk for claims with no historical denials", async () => {
      mockPrisma.denialPattern.findFirst.mockResolvedValue(null);
      mockPrisma.denial.count.mockResolvedValue(0);
      mockPrisma.denial.findMany.mockResolvedValue([]);
      mockPrisma.claimRiskAssessment.create.mockResolvedValue({
        ...mockClaimRiskAssessment,
        overallRiskScore: 0.15,
        riskLevel: "low",
      });

      const result = await service.predictDenialRisk({
        ...mockPredictionInput,
        payerId: "new-payer",
      });

      expect(result.riskLevel).toBe("low");
      expect(result.riskScore).toBeLessThan(0.4);
    });

    it("should return high risk for claims matching denial patterns", async () => {
      mockPrisma.denialPattern.findFirst.mockResolvedValue({
        ...mockDenialPattern,
        occurrenceCount: 50,
        appealSuccessRate: 0.2,
      });
      mockPrisma.denial.count.mockResolvedValue(50);
      mockPrisma.denial.findMany.mockResolvedValue([mockDenial]);
      mockPrisma.claimRiskAssessment.create.mockResolvedValue({
        ...mockClaimRiskAssessment,
        overallRiskScore: 0.85,
        riskLevel: "high",
      });

      const result = await service.predictDenialRisk(mockPredictionInput);

      expect(result.riskLevel).toBe("high");
      expect(result.riskScore).toBeGreaterThan(0.7);
    });

    it("should include specific risk factors in the assessment", async () => {
      mockPrisma.denialPattern.findFirst.mockResolvedValue(mockDenialPattern);
      mockPrisma.denial.count.mockResolvedValue(25);
      mockPrisma.denial.findMany.mockResolvedValue([mockDenial]);
      mockPrisma.claimRiskAssessment.create.mockResolvedValue(
        mockClaimRiskAssessment,
      );

      const result = await service.predictDenialRisk({
        ...mockPredictionInput,
        billedAmount: 50000,
      });

      expect(result.riskFactors).toBeInstanceOf(Array);
      expect(result.riskFactors.length).toBeGreaterThan(0);
    });

    it("should store risk assessment in database", async () => {
      mockPrisma.denialPattern.findFirst.mockResolvedValue(null);
      mockPrisma.denial.count.mockResolvedValue(0);
      mockPrisma.denial.findMany.mockResolvedValue([]);
      mockPrisma.claimRiskAssessment.create.mockResolvedValue(
        mockClaimRiskAssessment,
      );

      await service.predictDenialRisk(mockPredictionInput);

      expect(mockPrisma.claimRiskAssessment.create).toHaveBeenCalled();
    });

    it("should handle missing optional fields gracefully", async () => {
      mockPrisma.denialPattern.findFirst.mockResolvedValue(null);
      mockPrisma.denial.count.mockResolvedValue(0);
      mockPrisma.denial.findMany.mockResolvedValue([]);
      mockPrisma.claimRiskAssessment.create.mockResolvedValue({
        ...mockClaimRiskAssessment,
        overallRiskScore: 0.3,
        riskLevel: "low",
      });

      const minimalInput = {
        claimId: "claim-minimal",
        organizationId: "org-123",
        payerId: "payer-001",
        procedureCode: "99213",
        diagnosisCodes: ["Z00.00"],
        billedAmount: 100,
      };

      const result = await service.predictDenialRisk(minimalInput);

      expect(result).toHaveProperty("riskScore");
      expect(result).toHaveProperty("riskLevel");
    });
  });

  describe("getPayerDenialPatterns", () => {
    it("should retrieve denial patterns for a specific payer", async () => {
      mockPrisma.denialPattern.findMany.mockResolvedValue([mockDenialPattern]);

      const patterns = await service.getPayerDenialPatterns(
        "org-123",
        "payer-001",
      );

      expect(mockPrisma.denialPattern.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: "org-123",
            payerId: "payer-001",
          }),
        }),
      );
      expect(patterns).toHaveLength(1);
      expect(patterns[0]).toEqual(mockDenialPattern);
    });

    it("should return empty array when no patterns exist", async () => {
      mockPrisma.denialPattern.findMany.mockResolvedValue([]);

      const patterns = await service.getPayerDenialPatterns(
        "org-123",
        "unknown-payer",
      );

      expect(patterns).toHaveLength(0);
    });

    it("should filter patterns by procedure code if provided", async () => {
      mockPrisma.denialPattern.findMany.mockResolvedValue([mockDenialPattern]);

      await service.getPayerDenialPatterns("org-123", "payer-001", "99213");

      expect(mockPrisma.denialPattern.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            procedureCode: "99213",
          }),
        }),
      );
    });
  });

  describe("updateDenialPatterns", () => {
    it("should update patterns based on new denial data", async () => {
      mockPrisma.denial.groupBy.mockResolvedValue([
        {
          payerId: "payer-001",
          denialReasonCode: "CO-4",
          _count: { id: 25 },
          _sum: { deniedAmount: 37500 },
        },
      ]);
      mockPrisma.appeal.count.mockResolvedValue(15);
      mockPrisma.denialPattern.upsert.mockResolvedValue(mockDenialPattern);

      await service.updateDenialPatterns("org-123");

      expect(mockPrisma.denialPattern.upsert).toHaveBeenCalled();
    });

    it("should calculate appeal success rates correctly", async () => {
      mockPrisma.denial.groupBy.mockResolvedValue([
        {
          payerId: "payer-001",
          denialReasonCode: "CO-4",
          _count: { id: 100 },
          _sum: { deniedAmount: 150000 },
        },
      ]);
      mockPrisma.appeal.count
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(40);
      mockPrisma.denialPattern.upsert.mockResolvedValue(mockDenialPattern);

      await service.updateDenialPatterns("org-123");

      const upsertCall = mockPrisma.denialPattern.upsert.mock.calls[0][0];
      expect(upsertCall.create.appealSuccessRate).toBeCloseTo(0.5);
    });
  });

  describe("getRiskAssessment", () => {
    it("should retrieve existing risk assessment by claim ID", async () => {
      mockPrisma.claimRiskAssessment.findFirst.mockResolvedValue(
        mockClaimRiskAssessment,
      );

      const result = await service.getRiskAssessment("claim-789");

      expect(mockPrisma.claimRiskAssessment.findFirst).toHaveBeenCalledWith({
        where: { claimId: "claim-789" },
        orderBy: { assessedAt: "desc" },
      });
      expect(result).toEqual(mockClaimRiskAssessment);
    });

    it("should return null for non-existent assessments", async () => {
      mockPrisma.claimRiskAssessment.findFirst.mockResolvedValue(null);

      const result = await service.getRiskAssessment("unknown-claim");

      expect(result).toBeNull();
    });
  });

  describe("getRecommendedActions", () => {
    it("should provide recommended actions based on risk factors", async () => {
      const actions = await service.getRecommendedActions({
        riskScore: 0.8,
        riskLevel: "high",
        riskFactors: [
          { factor: "high_value_claim", score: 0.9, weight: 0.3 },
          { factor: "no_pre_auth", score: 0.85, weight: 0.4 },
        ],
      });

      expect(actions).toBeInstanceOf(Array);
      expect(actions.length).toBeGreaterThan(0);
    });

    it("should return fewer actions for low-risk claims", async () => {
      const lowRiskActions = await service.getRecommendedActions({
        riskScore: 0.15,
        riskLevel: "low",
        riskFactors: [],
      });

      const highRiskActions = await service.getRecommendedActions({
        riskScore: 0.85,
        riskLevel: "high",
        riskFactors: [{ factor: "payer_history", score: 0.9, weight: 0.5 }],
      });

      expect(lowRiskActions.length).toBeLessThanOrEqual(highRiskActions.length);
    });
  });
});
