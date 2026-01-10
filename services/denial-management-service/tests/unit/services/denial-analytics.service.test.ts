/**
 * Unit Tests for Denial Analytics Service
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient } from "../../helpers/mocks";
import {
  mockDenial,
  mockAppeal,
  mockDenialPattern,
  mockDenialAnalyticsParams,
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
import { DenialAnalyticsService } from "../../../src/services/denial-analytics.service";

describe("DenialAnalyticsService", () => {
  let service: DenialAnalyticsService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DenialAnalyticsService();
    mockPrisma = (service as any).prisma;
  });

  describe("getDenialSummary", () => {
    it("should return denial summary for an organization", async () => {
      mockPrisma.denial.count.mockResolvedValue(100);
      mockPrisma.denial.aggregate.mockResolvedValue({
        _sum: { deniedAmount: 150000 },
        _avg: { deniedAmount: 1500 },
      });

      const summary = await service.getDenialSummary(
        "org-123",
        mockDenialAnalyticsParams,
      );

      expect(summary).toHaveProperty("totalDenials");
      expect(summary).toHaveProperty("totalDeniedAmount");
      expect(summary.totalDenials).toBe(100);
      expect(summary.totalDeniedAmount).toBe(150000);
    });

    it("should filter by date range", async () => {
      mockPrisma.denial.count.mockResolvedValue(50);
      mockPrisma.denial.aggregate.mockResolvedValue({
        _sum: { deniedAmount: 75000 },
        _avg: { deniedAmount: 1500 },
      });

      await service.getDenialSummary("org-123", mockDenialAnalyticsParams);

      expect(mockPrisma.denial.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          organizationId: "org-123",
          denialDate: expect.objectContaining({
            gte: mockDenialAnalyticsParams.startDate,
            lte: mockDenialAnalyticsParams.endDate,
          }),
        }),
      });
    });

    it("should return zero values when no denials exist", async () => {
      mockPrisma.denial.count.mockResolvedValue(0);
      mockPrisma.denial.aggregate.mockResolvedValue({
        _sum: { deniedAmount: null },
        _avg: { deniedAmount: null },
      });

      const summary = await service.getDenialSummary("org-new");

      expect(summary.totalDenials).toBe(0);
      expect(summary.totalDeniedAmount).toBe(0);
    });
  });

  describe("getDenialsByReason", () => {
    it("should group denials by reason code", async () => {
      mockPrisma.denial.groupBy.mockResolvedValue([
        {
          denialReasonCode: "CO-4",
          _count: { id: 25 },
          _sum: { deniedAmount: 37500 },
        },
        {
          denialReasonCode: "CO-16",
          _count: { id: 15 },
          _sum: { deniedAmount: 22500 },
        },
      ]);

      const result = await service.getDenialsByReason(
        "org-123",
        mockDenialAnalyticsParams,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("denialReasonCode", "CO-4");
      expect(result[0]).toHaveProperty("count", 25);
    });
  });

  describe("getDenialsByPayer", () => {
    it("should group denials by payer", async () => {
      mockPrisma.denial.groupBy.mockResolvedValue([
        {
          payerId: "payer-001",
          payerName: "Blue Cross",
          _count: { id: 30 },
          _sum: { deniedAmount: 45000 },
        },
      ]);

      const result = await service.getDenialsByPayer(
        "org-123",
        mockDenialAnalyticsParams,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("payerId");
      expect(result[0]).toHaveProperty("payerName");
      expect(result[0]).toHaveProperty("count");
    });
  });

  describe("getAppealSuccessRate", () => {
    it("should calculate appeal success rate", async () => {
      mockPrisma.appeal.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(60);

      const rate = await service.getAppealSuccessRate(
        "org-123",
        mockDenialAnalyticsParams,
      );

      expect(rate).toBe(0.6);
    });

    it("should return 0 when no appeals exist", async () => {
      mockPrisma.appeal.count.mockResolvedValue(0);

      const rate = await service.getAppealSuccessRate(
        "org-123",
        mockDenialAnalyticsParams,
      );

      expect(rate).toBe(0);
    });
  });

  describe("getDenialTrends", () => {
    it("should return denial trends over time", async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        { period: "2024-01", count: 20, total_amount: 30000 },
        { period: "2024-02", count: 25, total_amount: 37500 },
      ]);

      const trends = await service.getDenialTrends("org-123", "monthly", 3);

      expect(trends).toHaveLength(2);
      expect(trends[0]).toHaveProperty("period");
      expect(trends[0]).toHaveProperty("count");
    });
  });

  describe("getRecoveryMetrics", () => {
    it("should calculate recovery metrics", async () => {
      mockPrisma.denial.aggregate.mockResolvedValue({
        _sum: { deniedAmount: 100000, recoveredAmount: 60000 },
      });
      mockPrisma.denial.count.mockResolvedValue(50);

      const metrics = await service.getRecoveryMetrics(
        "org-123",
        mockDenialAnalyticsParams,
      );

      expect(metrics).toHaveProperty("totalDenied", 100000);
      expect(metrics).toHaveProperty("totalRecovered", 60000);
      expect(metrics).toHaveProperty("recoveryRate", 0.6);
    });
  });

  describe("getStaffProductivity", () => {
    it("should return staff productivity metrics", async () => {
      mockPrisma.staffProductivity.findMany.mockResolvedValue([
        {
          staffId: "staff-1",
          staffName: "John Smith",
          denialsWorked: 50,
          appealsSubmitted: 45,
          appealsWon: 30,
          totalRecovered: 45000,
        },
      ]);

      const productivity = await service.getStaffProductivity(
        "org-123",
        mockDenialAnalyticsParams,
      );

      expect(productivity).toHaveLength(1);
      expect(productivity[0]).toHaveProperty("staffId");
      expect(productivity[0]).toHaveProperty("denialsWorked");
    });
  });

  describe("getTopDenialCodes", () => {
    it("should return top denial reason codes", async () => {
      mockPrisma.denial.groupBy.mockResolvedValue([
        { denialReasonCode: "CO-4", _count: { id: 100 } },
        { denialReasonCode: "CO-16", _count: { id: 75 } },
      ]);

      const topCodes = await service.getTopDenialCodes("org-123", 5);

      expect(topCodes).toHaveLength(2);
      expect(topCodes[0].denialReasonCode).toBe("CO-4");
    });
  });
});
