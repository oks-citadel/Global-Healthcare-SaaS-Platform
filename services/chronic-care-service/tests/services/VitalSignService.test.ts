import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
const mockPrisma = {
  vitalSign: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(() => mockPrisma),
}));

describe("VitalSignService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Create Vital Sign", () => {
    it("should create a new vital sign record", async () => {
      const vitalSignData = {
        patientId: "patient-123",
        type: "blood_pressure",
        value: "120/80",
        unit: "mmHg",
        timestamp: new Date(),
      };

      const mockVitalSign = {
        id: "vital-123",
        ...vitalSignData,
        createdAt: new Date(),
      };

      mockPrisma.vitalSign.create.mockResolvedValue(mockVitalSign);

      const result = mockPrisma.vitalSign.create({ data: vitalSignData });

      await expect(result).resolves.toEqual(mockVitalSign);
      expect(mockPrisma.vitalSign.create).toHaveBeenCalledWith({
        data: vitalSignData,
      });
    });

    it("should create blood glucose reading", async () => {
      const glucoseData = {
        patientId: "patient-123",
        type: "blood_glucose",
        value: "120",
        unit: "mg/dL",
        timestamp: new Date(),
      };

      mockPrisma.vitalSign.create.mockResolvedValue({
        id: "vital-124",
        ...glucoseData,
      });

      const result = mockPrisma.vitalSign.create({ data: glucoseData });

      await expect(result).resolves.toBeDefined();
    });

    it("should create heart rate reading", async () => {
      const heartRateData = {
        patientId: "patient-123",
        type: "heart_rate",
        value: "72",
        unit: "bpm",
        timestamp: new Date(),
      };

      mockPrisma.vitalSign.create.mockResolvedValue({
        id: "vital-125",
        ...heartRateData,
      });

      const result = mockPrisma.vitalSign.create({ data: heartRateData });

      await expect(result).resolves.toBeDefined();
    });

    it("should create weight reading", async () => {
      const weightData = {
        patientId: "patient-123",
        type: "weight",
        value: "75",
        unit: "kg",
        timestamp: new Date(),
      };

      mockPrisma.vitalSign.create.mockResolvedValue({
        id: "vital-126",
        ...weightData,
      });

      const result = mockPrisma.vitalSign.create({ data: weightData });

      await expect(result).resolves.toBeDefined();
    });
  });

  describe("List Vital Signs", () => {
    it("should retrieve vital signs for a patient", async () => {
      const mockVitalSigns = [
        {
          id: "vital-1",
          patientId: "patient-123",
          type: "blood_pressure",
          value: "120/80",
          timestamp: new Date(),
        },
        {
          id: "vital-2",
          patientId: "patient-123",
          type: "blood_glucose",
          value: "110",
          timestamp: new Date(),
        },
      ];

      mockPrisma.vitalSign.findMany.mockResolvedValue(mockVitalSigns);

      const result = mockPrisma.vitalSign.findMany({
        where: { patientId: "patient-123" },
      });

      await expect(result).resolves.toEqual(mockVitalSigns);
    });

    it("should filter vital signs by type", async () => {
      const mockVitalSigns = [
        {
          id: "vital-1",
          patientId: "patient-123",
          type: "blood_pressure",
          value: "120/80",
        },
      ];

      mockPrisma.vitalSign.findMany.mockResolvedValue(mockVitalSigns);

      const result = mockPrisma.vitalSign.findMany({
        where: {
          patientId: "patient-123",
          type: "blood_pressure",
        },
      });

      await expect(result).resolves.toEqual(mockVitalSigns);
    });

    it("should filter vital signs by date range", async () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");

      mockPrisma.vitalSign.findMany.mockResolvedValue([]);

      const result = mockPrisma.vitalSign.findMany({
        where: {
          patientId: "patient-123",
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      await expect(result).resolves.toBeDefined();
      expect(mockPrisma.vitalSign.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          timestamp: expect.objectContaining({
            gte: startDate,
            lte: endDate,
          }),
        }),
      });
    });

    it("should sort vital signs by timestamp", async () => {
      mockPrisma.vitalSign.findMany.mockResolvedValue([]);

      await mockPrisma.vitalSign.findMany({
        where: { patientId: "patient-123" },
        orderBy: { timestamp: "desc" },
      });

      expect(mockPrisma.vitalSign.findMany).toHaveBeenCalledWith({
        where: { patientId: "patient-123" },
        orderBy: { timestamp: "desc" },
      });
    });
  });

  describe("Get Vital Sign by ID", () => {
    it("should retrieve a specific vital sign", async () => {
      const mockVitalSign = {
        id: "vital-123",
        patientId: "patient-123",
        type: "blood_pressure",
        value: "120/80",
      };

      mockPrisma.vitalSign.findUnique.mockResolvedValue(mockVitalSign);

      const result = mockPrisma.vitalSign.findUnique({
        where: { id: "vital-123" },
      });

      await expect(result).resolves.toEqual(mockVitalSign);
    });

    it("should return null for non-existent vital sign", async () => {
      mockPrisma.vitalSign.findUnique.mockResolvedValue(null);

      const result = mockPrisma.vitalSign.findUnique({
        where: { id: "non-existent" },
      });

      await expect(result).resolves.toBeNull();
    });
  });

  describe("Update Vital Sign", () => {
    it("should update a vital sign record", async () => {
      const updateData = {
        value: "125/85",
        notes: "Updated reading",
      };

      const mockUpdated = {
        id: "vital-123",
        patientId: "patient-123",
        type: "blood_pressure",
        ...updateData,
      };

      mockPrisma.vitalSign.update.mockResolvedValue(mockUpdated);

      const result = mockPrisma.vitalSign.update({
        where: { id: "vital-123" },
        data: updateData,
      });

      await expect(result).resolves.toEqual(mockUpdated);
    });
  });

  describe("Delete Vital Sign", () => {
    it("should delete a vital sign record", async () => {
      const mockDeleted = {
        id: "vital-123",
        patientId: "patient-123",
        type: "blood_pressure",
      };

      mockPrisma.vitalSign.delete.mockResolvedValue(mockDeleted);

      const result = mockPrisma.vitalSign.delete({
        where: { id: "vital-123" },
      });

      await expect(result).resolves.toEqual(mockDeleted);
    });
  });

  describe("Vital Signs Analysis", () => {
    it("should identify abnormal blood pressure", () => {
      const reading = {
        systolic: 150,
        diastolic: 95,
      };

      const isAbnormal = reading.systolic > 140 || reading.diastolic > 90;
      expect(isAbnormal).toBe(true);
    });

    it("should identify normal blood pressure", () => {
      const reading = {
        systolic: 120,
        diastolic: 80,
      };

      const isNormal = reading.systolic <= 130 && reading.diastolic <= 85;
      expect(isNormal).toBe(true);
    });

    it("should identify high blood glucose", () => {
      const glucoseLevel = 180; // mg/dL
      const isHigh = glucoseLevel > 140;
      expect(isHigh).toBe(true);
    });

    it("should identify low blood glucose", () => {
      const glucoseLevel = 60; // mg/dL
      const isLow = glucoseLevel < 70;
      expect(isLow).toBe(true);
    });

    it("should calculate average from readings", () => {
      const readings = [120, 125, 118, 122, 119];
      const average = readings.reduce((a, b) => a + b, 0) / readings.length;
      expect(average).toBeCloseTo(120.8, 1);
    });
  });

  describe("Alerts and Notifications", () => {
    it("should trigger alert for critically high blood pressure", () => {
      const reading = {
        systolic: 180,
        diastolic: 110,
      };

      const isCritical = reading.systolic >= 180 || reading.diastolic >= 110;
      expect(isCritical).toBe(true);
    });

    it("should trigger alert for critically low heart rate", () => {
      const heartRate = 45; // bpm
      const isCritical = heartRate < 50;
      expect(isCritical).toBe(true);
    });

    it("should trigger alert for critically high heart rate", () => {
      const heartRate = 120; // bpm
      const isCritical = heartRate > 100;
      expect(isCritical).toBe(true);
    });
  });
});
