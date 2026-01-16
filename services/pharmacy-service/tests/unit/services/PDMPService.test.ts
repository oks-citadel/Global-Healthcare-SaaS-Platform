/**
 * Unit Tests for PDMPService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
    controlledSubstanceLog: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
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
import { PDMPService } from "../../../src/services/PDMPService";

// Mock fixtures for controlled substance logs
const mockControlledSubstanceLog = {
  id: "log-123",
  patientId: "patient-123",
  prescriberId: "provider-123",
  pharmacyId: "pharmacy-123",
  pharmacistId: "pharmacist-123",
  medicationName: "Oxycodone",
  ndcCode: "0999-0000-01",
  schedule: "II",
  quantity: 30,
  dispensedAt: new Date("2026-01-01T10:00:00Z"),
  prescriptionDate: new Date("2026-01-01"),
  refillNumber: 0,
  reportedToPDMP: false,
  pdmpReportDate: null,
};

const createDispensingRecord = (overrides: Partial<typeof mockControlledSubstanceLog> = {}) => ({
  ...mockControlledSubstanceLog,
  ...overrides,
});

describe("PDMPService", () => {
  let pdmpService: PDMPService;

  beforeEach(() => {
    vi.clearAllMocks();
    pdmpService = new PDMPService();
  });

  describe("checkPDMP", () => {
    it("should return no alerts for patient with no controlled substance history", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([]);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.patientId).toBe("patient-123");
      expect(result.hasAlerts).toBe(false);
      expect(result.requiresIntervention).toBe(false);
      expect(result.alerts).toHaveLength(0);
      expect(result.multipleProviders).toBe(false);
      expect(result.multiplePharmacies).toBe(false);
      expect(result.overlappingPrescriptions).toBe(false);
    });

    it("should detect multiple providers (more than 3)", async () => {
      const dispensings = [
        createDispensingRecord({ prescriberId: "provider-1" }),
        createDispensingRecord({ prescriberId: "provider-2" }),
        createDispensingRecord({ prescriberId: "provider-3" }),
        createDispensingRecord({ prescriberId: "provider-4" }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(dispensings);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.multipleProviders).toBe(true);
      expect(result.hasAlerts).toBe(true);
      expect(result.alerts).toContain(
        expect.stringContaining("4 different prescribers")
      );
    });

    it("should not flag when 3 or fewer providers", async () => {
      const dispensings = [
        createDispensingRecord({ prescriberId: "provider-1" }),
        createDispensingRecord({ prescriberId: "provider-2" }),
        createDispensingRecord({ prescriberId: "provider-3" }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(dispensings);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.multipleProviders).toBe(false);
    });

    it("should detect multiple pharmacies (more than 3)", async () => {
      const dispensings = [
        createDispensingRecord({ pharmacyId: "pharmacy-1" }),
        createDispensingRecord({ pharmacyId: "pharmacy-2" }),
        createDispensingRecord({ pharmacyId: "pharmacy-3" }),
        createDispensingRecord({ pharmacyId: "pharmacy-4" }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(dispensings);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.multiplePharmacies).toBe(true);
      expect(result.hasAlerts).toBe(true);
      expect(result.alerts).toContain(
        expect.stringContaining("4 different pharmacies")
      );
    });

    it("should detect overlapping prescriptions for same medication", async () => {
      const now = new Date();
      const tenDaysAgo = new Date(now);
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const fiveDaysAgo = new Date(now);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const dispensings = [
        createDispensingRecord({
          medicationName: "Oxycodone",
          dispensedAt: tenDaysAgo,
        }),
        createDispensingRecord({
          medicationName: "Oxycodone",
          dispensedAt: fiveDaysAgo,
        }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(dispensings);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.overlappingPrescriptions).toBe(true);
      expect(result.requiresIntervention).toBe(true);
      expect(result.alerts).toContain("Overlapping controlled substance prescriptions detected");
    });

    it("should detect early refills for Schedule II substances", async () => {
      const now = new Date();
      const twentyDaysAgo = new Date(now);
      twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

      const fiveDaysAgo = new Date(now);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const dispensings = [
        createDispensingRecord({
          medicationName: "Oxycodone",
          schedule: "II",
          dispensedAt: twentyDaysAgo,
        }),
        createDispensingRecord({
          medicationName: "Oxycodone",
          schedule: "II",
          dispensedAt: fiveDaysAgo,
        }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(dispensings);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.requiresIntervention).toBe(true);
      expect(result.alerts).toContain(expect.stringContaining("early refill"));
    });

    it("should detect high-dose opioid prescriptions", async () => {
      const dispensings = [
        createDispensingRecord({
          medicationName: "Oxycodone",
          schedule: "II",
          quantity: 120,
        }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(dispensings);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.hasAlerts).toBe(true);
      expect(result.alerts).toContain("High-dose opioid prescriptions detected");
    });

    it("should detect concurrent opioid and benzodiazepine use", async () => {
      const dispensings = [
        createDispensingRecord({ medicationName: "Oxycodone" }),
        createDispensingRecord({ medicationName: "Alprazolam" }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(dispensings);

      const result = await pdmpService.checkPDMP("patient-123");

      expect(result.requiresIntervention).toBe(true);
      expect(result.alerts).toContain("Concurrent opioid and benzodiazepine use detected");
    });

    it("should recognize various opioid medications", async () => {
      const opioids = ["hydrocodone", "morphine", "fentanyl", "codeine", "tramadol"];

      for (const opioid of opioids) {
        mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([
          createDispensingRecord({ medicationName: opioid }),
          createDispensingRecord({ medicationName: "Alprazolam" }),
        ]);

        const result = await pdmpService.checkPDMP("patient-123");
        expect(result.alerts).toContain("Concurrent opioid and benzodiazepine use detected");
      }
    });

    it("should recognize various benzodiazepine medications", async () => {
      const benzos = ["lorazepam", "clonazepam", "diazepam", "temazepam"];

      for (const benzo of benzos) {
        mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([
          createDispensingRecord({ medicationName: "Oxycodone" }),
          createDispensingRecord({ medicationName: benzo }),
        ]);

        const result = await pdmpService.checkPDMP("patient-123");
        expect(result.alerts).toContain("Concurrent opioid and benzodiazepine use detected");
      }
    });

    it("should query for last 6 months of data", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([]);

      await pdmpService.checkPDMP("patient-123");

      const findCall = mockPrismaInstance.controlledSubstanceLog.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe("patient-123");
      expect(findCall.where.dispensedAt.gte).toBeDefined();

      // Verify it's approximately 6 months ago
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const queryDate = findCall.where.dispensedAt.gte;
      const daysDiff = Math.abs((queryDate.getTime() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBeLessThan(2);
    });
  });

  describe("reportToPDMP", () => {
    it("should successfully report to PDMP", async () => {
      mockPrismaInstance.controlledSubstanceLog.findUnique.mockResolvedValue(mockControlledSubstanceLog);
      mockPrismaInstance.controlledSubstanceLog.update.mockResolvedValue({
        ...mockControlledSubstanceLog,
        reportedToPDMP: true,
        pdmpReportDate: new Date(),
      });

      const result = await pdmpService.reportToPDMP("log-123");

      expect(result.success).toBe(true);
      expect(result.pdmpReportId).toBeDefined();
      expect(result.message).toBe("Successfully reported to PDMP");
    });

    it("should throw error when log not found", async () => {
      mockPrismaInstance.controlledSubstanceLog.findUnique.mockResolvedValue(null);

      await expect(pdmpService.reportToPDMP("non-existent")).rejects.toThrow(
        "Controlled substance log not found"
      );
    });

    it("should update log with report status", async () => {
      mockPrismaInstance.controlledSubstanceLog.findUnique.mockResolvedValue(mockControlledSubstanceLog);
      mockPrismaInstance.controlledSubstanceLog.update.mockResolvedValue(mockControlledSubstanceLog);

      await pdmpService.reportToPDMP("log-123");

      expect(mockPrismaInstance.controlledSubstanceLog.update).toHaveBeenCalledWith({
        where: { id: "log-123" },
        data: {
          reportedToPDMP: true,
          pdmpReportDate: expect.any(Date),
        },
      });
    });
  });

  describe("getPatientControlledSubstanceHistory", () => {
    it("should return patient history with default options", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([mockControlledSubstanceLog]);

      const result = await pdmpService.getPatientControlledSubstanceHistory("patient-123");

      expect(mockPrismaInstance.controlledSubstanceLog.findMany).toHaveBeenCalledWith({
        where: { patientId: "patient-123" },
        orderBy: { dispensedAt: "desc" },
        take: 100,
      });
      expect(result).toHaveLength(1);
    });

    it("should filter by date range", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([]);
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-12-31");

      await pdmpService.getPatientControlledSubstanceHistory("patient-123", {
        startDate,
        endDate,
      });

      const findCall = mockPrismaInstance.controlledSubstanceLog.findMany.mock.calls[0][0];
      expect(findCall.where.dispensedAt.gte).toEqual(startDate);
      expect(findCall.where.dispensedAt.lte).toEqual(endDate);
    });

    it("should filter by schedule", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([]);

      await pdmpService.getPatientControlledSubstanceHistory("patient-123", {
        schedule: "II",
      });

      const findCall = mockPrismaInstance.controlledSubstanceLog.findMany.mock.calls[0][0];
      expect(findCall.where.schedule).toBe("II");
    });

    it("should respect limit parameter", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([]);

      await pdmpService.getPatientControlledSubstanceHistory("patient-123", {
        limit: 50,
      });

      const findCall = mockPrismaInstance.controlledSubstanceLog.findMany.mock.calls[0][0];
      expect(findCall.take).toBe(50);
    });
  });

  describe("getUnreportedDispensings", () => {
    it("should return all unreported dispensings", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([
        mockControlledSubstanceLog,
      ]);

      const result = await pdmpService.getUnreportedDispensings();

      expect(mockPrismaInstance.controlledSubstanceLog.findMany).toHaveBeenCalledWith({
        where: { reportedToPDMP: false },
        orderBy: { dispensedAt: "asc" },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("bulkReportToPDMP", () => {
    it("should report all unreported dispensings", async () => {
      const unreportedLogs = [
        createDispensingRecord({ id: "log-1" }),
        createDispensingRecord({ id: "log-2" }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(unreportedLogs);
      mockPrismaInstance.controlledSubstanceLog.findUnique.mockResolvedValue(mockControlledSubstanceLog);
      mockPrismaInstance.controlledSubstanceLog.update.mockResolvedValue(mockControlledSubstanceLog);

      const result = await pdmpService.bulkReportToPDMP();

      expect(result.total).toBe(2);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
    });

    it("should track failures in bulk report", async () => {
      const unreportedLogs = [
        createDispensingRecord({ id: "log-1" }),
        createDispensingRecord({ id: "log-2" }),
      ];
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue(unreportedLogs);
      mockPrismaInstance.controlledSubstanceLog.findUnique
        .mockResolvedValueOnce(mockControlledSubstanceLog)
        .mockResolvedValueOnce(null);
      mockPrismaInstance.controlledSubstanceLog.update.mockResolvedValue(mockControlledSubstanceLog);

      const result = await pdmpService.bulkReportToPDMP();

      expect(result.total).toBe(2);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(1);
    });

    it("should return empty results when nothing to report", async () => {
      mockPrismaInstance.controlledSubstanceLog.findMany.mockResolvedValue([]);

      const result = await pdmpService.bulkReportToPDMP();

      expect(result.total).toBe(0);
      expect(result.successful).toBe(0);
      expect(result.failed).toBe(0);
    });
  });

  describe("getPDMPStatistics", () => {
    it("should return comprehensive statistics", async () => {
      mockPrismaInstance.controlledSubstanceLog.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(30)  // schedule II
        .mockResolvedValueOnce(25)  // schedule III
        .mockResolvedValueOnce(35)  // schedule IV
        .mockResolvedValueOnce(10)  // schedule V
        .mockResolvedValueOnce(90)  // reported
        .mockResolvedValueOnce(10); // unreported

      const result = await pdmpService.getPDMPStatistics();

      expect(result.totalDispensings).toBe(100);
      expect(result.bySchedule.II).toBe(30);
      expect(result.bySchedule.III).toBe(25);
      expect(result.bySchedule.IV).toBe(35);
      expect(result.bySchedule.V).toBe(10);
      expect(result.reporting.reported).toBe(90);
      expect(result.reporting.unreported).toBe(10);
      expect(result.reporting.reportingRate).toBe(90);
    });

    it("should filter statistics by date range", async () => {
      mockPrismaInstance.controlledSubstanceLog.count.mockResolvedValue(50);
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-12-31");

      await pdmpService.getPDMPStatistics({ startDate, endDate });

      const countCall = mockPrismaInstance.controlledSubstanceLog.count.mock.calls[0][0];
      expect(countCall.where.dispensedAt.gte).toEqual(startDate);
      expect(countCall.where.dispensedAt.lte).toEqual(endDate);
    });

    it("should handle zero dispensings without division error", async () => {
      mockPrismaInstance.controlledSubstanceLog.count.mockResolvedValue(0);

      const result = await pdmpService.getPDMPStatistics();

      expect(result.totalDispensings).toBe(0);
      expect(result.reporting.reportingRate).toBe(0);
    });
  });
});
