/**
 * Unit Tests for ReportService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockRadiologyReport,
  mockFinalReport,
  mockStudy,
  mockCreateReportInput,
} from "../helpers/fixtures";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const instance = {
    radiologyReport: {
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
    criticalFinding: {
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
import ReportService from "../../../src/services/reportService";

describe("ReportService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ReportService as any).prisma = mockPrismaInstance;
  });

  describe("createReport", () => {
    it("should create a radiology report successfully", async () => {
      mockPrismaInstance.radiologyReport.create.mockResolvedValue(
        mockRadiologyReport,
      );
      mockPrismaInstance.study.update.mockResolvedValue(mockStudy);

      const result = await ReportService.createReport(mockCreateReportInput);

      expect(mockPrismaInstance.radiologyReport.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getReportById", () => {
    it("should return report when found", async () => {
      mockPrismaInstance.radiologyReport.findUnique.mockResolvedValue(
        mockRadiologyReport,
      );

      const result = await ReportService.getReportById("report-123");

      expect(
        mockPrismaInstance.radiologyReport.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: "report-123" },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRadiologyReport);
    });

    it("should throw error when report not found", async () => {
      mockPrismaInstance.radiologyReport.findUnique.mockResolvedValue(null);

      await expect(ReportService.getReportById("non-existent")).rejects.toThrow(
        "Report not found",
      );
    });
  });

  describe("signReport", () => {
    it("should sign a report", async () => {
      mockPrismaInstance.radiologyReport.update.mockResolvedValue(
        mockFinalReport,
      );
      mockPrismaInstance.study.update.mockResolvedValue(mockStudy);

      const result = await ReportService.signReport(
        "report-123",
        "radiologist-123",
      );

      expect(mockPrismaInstance.radiologyReport.update).toHaveBeenCalledWith({
        where: { id: "report-123" },
        data: expect.objectContaining({
          status: "FINAL",
          signedBy: "radiologist-123",
        }),
      });
      expect(result.status).toBe("FINAL");
    });
  });
});
