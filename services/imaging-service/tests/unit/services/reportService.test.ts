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
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
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

  describe("getReport", () => {
    it("should return report when found", async () => {
      mockPrismaInstance.radiologyReport.findUnique.mockResolvedValue(
        mockRadiologyReport,
      );

      const result = await ReportService.getReport("report-123");

      expect(
        mockPrismaInstance.radiologyReport.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: "report-123" },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRadiologyReport);
    });

    it("should return null when report not found", async () => {
      mockPrismaInstance.radiologyReport.findUnique.mockResolvedValue(null);

      const result = await ReportService.getReport("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("finalizeReport", () => {
    it("should finalize a preliminary report", async () => {
      mockPrismaInstance.radiologyReport.findUnique.mockResolvedValue(
        mockRadiologyReport,
      );
      mockPrismaInstance.radiologyReport.update.mockResolvedValue(
        mockFinalReport,
      );

      const result = await ReportService.finalizeReport(
        "report-123",
        "radiologist-123",
      );

      expect(mockPrismaInstance.radiologyReport.update).toHaveBeenCalledWith({
        where: { id: "report-123" },
        data: expect.objectContaining({
          status: "FINAL",
          finalizedById: "radiologist-123",
        }),
      });
      expect(result.status).toBe("FINAL");
    });
  });
});
