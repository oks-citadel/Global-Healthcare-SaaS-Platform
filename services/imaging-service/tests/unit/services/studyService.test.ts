/**
 * Unit Tests for StudyService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const instance = {
    study: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    dicomImage: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    imagingOrder: {
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
import StudyService from "../../../src/services/studyService";

const mockStudy = {
  id: "study-123",
  studyInstanceUid: "1.2.3.4.5.6",
  accessionNumber: "ACC-2024-001",
  orderId: "order-123",
  patientId: "patient-123",
  modality: "CT",
  bodyPart: "CHEST",
  status: "IN_PROGRESS",
  studyDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("StudyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createStudy", () => {
    it("should create a study successfully", async () => {
      mockPrismaInstance.study.create.mockResolvedValue(mockStudy);

      const result = await StudyService.createStudy({
        orderId: "order-123",
        patientId: "patient-123",
        modality: "CT",
        bodyPart: "CHEST",
      });

      expect(mockPrismaInstance.study.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getStudy", () => {
    it("should return study when found", async () => {
      mockPrismaInstance.study.findUnique.mockResolvedValue(mockStudy);

      const result = await StudyService.getStudy("study-123");

      expect(mockPrismaInstance.study.findUnique).toHaveBeenCalledWith({
        where: { id: "study-123" },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockStudy);
    });

    it("should return null when study not found", async () => {
      mockPrismaInstance.study.findUnique.mockResolvedValue(null);

      const result = await StudyService.getStudy("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("updateStudyStatus", () => {
    it("should update study status", async () => {
      const updatedStudy = { ...mockStudy, status: "COMPLETED" };
      mockPrismaInstance.study.update.mockResolvedValue(updatedStudy);

      const result = await StudyService.updateStudyStatus(
        "study-123",
        "COMPLETED",
      );

      expect(mockPrismaInstance.study.update).toHaveBeenCalledWith({
        where: { id: "study-123" },
        data: { status: "COMPLETED" },
      });
      expect(result.status).toBe("COMPLETED");
    });
  });

  describe("listStudies", () => {
    it("should return paginated studies", async () => {
      mockPrismaInstance.study.findMany.mockResolvedValue([mockStudy]);
      mockPrismaInstance.study.count.mockResolvedValue(1);

      const result = await StudyService.listStudies({ limit: 20, offset: 0 });

      expect(result.studies).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
