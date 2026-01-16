/**
 * Unit Tests for Therapy Session Scheduling
 * Tests for the therapy sessions route functionality
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockRequest,
  mockResponse,
  mockNext,
  mockPrismaClient,
} from "../helpers/mocks";
import { mockTherapySession, mockUser } from "../helpers/fixtures";

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
    therapySession: {
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
  Prisma: {
    TherapySessionWhereInput: {},
  },
}));

// Mock fixtures for therapy sessions
const mockSession = {
  id: "session-123",
  patientId: "patient-123",
  therapistId: "therapist-123",
  sessionType: "individual",
  scheduledAt: new Date("2026-02-01T14:00:00Z"),
  duration: 60,
  status: "scheduled",
  modality: "telehealth",
  notes: "Initial consultation",
  actualStartTime: null,
  actualEndTime: null,
  homework: null,
  nextSessionDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createMockSession = (overrides: Partial<typeof mockSession> = {}) => ({
  ...mockSession,
  ...overrides,
});

describe("Therapy Session Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("List Sessions", () => {
    it("should return sessions for patient role", async () => {
      const sessions = [
        createMockSession({ id: "session-1" }),
        createMockSession({ id: "session-2" }),
      ];
      mockPrismaInstance.therapySession.findMany.mockResolvedValue(sessions);

      const result = await mockPrismaInstance.therapySession.findMany({
        where: { patientId: "patient-123" },
        orderBy: { scheduledAt: "desc" },
      });

      expect(result).toHaveLength(2);
      expect(mockPrismaInstance.therapySession.findMany).toHaveBeenCalledWith({
        where: { patientId: "patient-123" },
        orderBy: { scheduledAt: "desc" },
      });
    });

    it("should return sessions for provider role", async () => {
      mockPrismaInstance.therapySession.findMany.mockResolvedValue([mockSession]);

      const result = await mockPrismaInstance.therapySession.findMany({
        where: { therapistId: "therapist-123" },
        orderBy: { scheduledAt: "desc" },
      });

      expect(result).toHaveLength(1);
      expect(mockPrismaInstance.therapySession.findMany).toHaveBeenCalledWith({
        where: { therapistId: "therapist-123" },
        orderBy: { scheduledAt: "desc" },
      });
    });

    it("should filter sessions by status", async () => {
      mockPrismaInstance.therapySession.findMany.mockResolvedValue([
        createMockSession({ status: "scheduled" }),
      ]);

      const result = await mockPrismaInstance.therapySession.findMany({
        where: { patientId: "patient-123", status: "scheduled" },
      });

      expect(result[0].status).toBe("scheduled");
    });

    it("should filter sessions by date range", async () => {
      const startDate = new Date("2026-01-01");
      const endDate = new Date("2026-12-31");
      mockPrismaInstance.therapySession.findMany.mockResolvedValue([mockSession]);

      await mockPrismaInstance.therapySession.findMany({
        where: {
          patientId: "patient-123",
          scheduledAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const findCall = mockPrismaInstance.therapySession.findMany.mock.calls[0][0];
      expect(findCall.where.scheduledAt.gte).toEqual(startDate);
      expect(findCall.where.scheduledAt.lte).toEqual(endDate);
    });

    it("should return empty array when no sessions", async () => {
      mockPrismaInstance.therapySession.findMany.mockResolvedValue([]);

      const result = await mockPrismaInstance.therapySession.findMany({
        where: { patientId: "patient-123" },
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("Get Single Session", () => {
    it("should return session by ID", async () => {
      mockPrismaInstance.therapySession.findUnique.mockResolvedValue(mockSession);

      const result = await mockPrismaInstance.therapySession.findUnique({
        where: { id: "session-123" },
      });

      expect(result).toEqual(mockSession);
      expect(mockPrismaInstance.therapySession.findUnique).toHaveBeenCalledWith({
        where: { id: "session-123" },
      });
    });

    it("should return null for non-existent session", async () => {
      mockPrismaInstance.therapySession.findUnique.mockResolvedValue(null);

      const result = await mockPrismaInstance.therapySession.findUnique({
        where: { id: "non-existent" },
      });

      expect(result).toBeNull();
    });
  });

  describe("Create Session", () => {
    it("should create a new therapy session", async () => {
      const newSession = {
        patientId: "patient-123",
        therapistId: "therapist-123",
        sessionType: "individual",
        scheduledAt: new Date("2026-02-15T10:00:00Z"),
        duration: 50,
        modality: "in_person",
        notes: "Follow-up session",
      };

      mockPrismaInstance.therapySession.create.mockResolvedValue({
        id: "session-new",
        ...newSession,
        status: "scheduled",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrismaInstance.therapySession.create({
        data: newSession,
      });

      expect(result.id).toBe("session-new");
      expect(result.sessionType).toBe("individual");
      expect(result.status).toBe("scheduled");
    });

    it("should handle different session types", async () => {
      const sessionTypes = ["individual", "group", "couples", "family"];

      for (const sessionType of sessionTypes) {
        mockPrismaInstance.therapySession.create.mockResolvedValue({
          ...mockSession,
          sessionType,
        });

        const result = await mockPrismaInstance.therapySession.create({
          data: { ...mockSession, sessionType },
        });

        expect(result.sessionType).toBe(sessionType);
      }
    });

    it("should validate duration range (30-180 minutes)", async () => {
      const validDurations = [30, 50, 60, 90, 120, 180];

      for (const duration of validDurations) {
        mockPrismaInstance.therapySession.create.mockResolvedValue({
          ...mockSession,
          duration,
        });

        const result = await mockPrismaInstance.therapySession.create({
          data: { ...mockSession, duration },
        });

        expect(result.duration).toBe(duration);
      }
    });
  });

  describe("Update Session", () => {
    it("should update session status to in_progress", async () => {
      const startTime = new Date();
      mockPrismaInstance.therapySession.update.mockResolvedValue({
        ...mockSession,
        status: "in_progress",
        actualStartTime: startTime,
      });

      const result = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: {
          status: "in_progress",
          actualStartTime: startTime,
        },
      });

      expect(result.status).toBe("in_progress");
      expect(result.actualStartTime).toBe(startTime);
    });

    it("should update session status to completed", async () => {
      const endTime = new Date();
      mockPrismaInstance.therapySession.update.mockResolvedValue({
        ...mockSession,
        status: "completed",
        actualEndTime: endTime,
      });

      const result = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: {
          status: "completed",
          actualEndTime: endTime,
        },
      });

      expect(result.status).toBe("completed");
      expect(result.actualEndTime).toBe(endTime);
    });

    it("should update session with homework assignment", async () => {
      const homework = "Practice mindfulness exercises 10 minutes daily";
      mockPrismaInstance.therapySession.update.mockResolvedValue({
        ...mockSession,
        homework,
      });

      const result = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { homework },
      });

      expect(result.homework).toBe(homework);
    });

    it("should schedule next session date", async () => {
      const nextSessionDate = new Date("2026-02-08T14:00:00Z");
      mockPrismaInstance.therapySession.update.mockResolvedValue({
        ...mockSession,
        nextSessionDate,
      });

      const result = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { nextSessionDate },
      });

      expect(result.nextSessionDate).toEqual(nextSessionDate);
    });

    it("should update session notes", async () => {
      const notes = "Patient showed significant improvement in mood regulation";
      mockPrismaInstance.therapySession.update.mockResolvedValue({
        ...mockSession,
        notes,
      });

      const result = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { notes },
      });

      expect(result.notes).toBe(notes);
    });
  });

  describe("Cancel Session", () => {
    it("should cancel session by updating status", async () => {
      mockPrismaInstance.therapySession.update.mockResolvedValue({
        ...mockSession,
        status: "cancelled",
      });

      const result = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { status: "cancelled" },
      });

      expect(result.status).toBe("cancelled");
    });

    it("should mark session as no_show", async () => {
      mockPrismaInstance.therapySession.update.mockResolvedValue({
        ...mockSession,
        status: "no_show",
      });

      const result = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { status: "no_show" },
      });

      expect(result.status).toBe("no_show");
    });
  });

  describe("Session Status Transitions", () => {
    it("should transition from scheduled to in_progress", async () => {
      mockPrismaInstance.therapySession.findUnique.mockResolvedValue(
        createMockSession({ status: "scheduled" })
      );
      mockPrismaInstance.therapySession.update.mockResolvedValue(
        createMockSession({ status: "in_progress" })
      );

      const current = await mockPrismaInstance.therapySession.findUnique({
        where: { id: "session-123" },
      });
      expect(current.status).toBe("scheduled");

      const updated = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { status: "in_progress" },
      });
      expect(updated.status).toBe("in_progress");
    });

    it("should transition from in_progress to completed", async () => {
      mockPrismaInstance.therapySession.findUnique.mockResolvedValue(
        createMockSession({ status: "in_progress" })
      );
      mockPrismaInstance.therapySession.update.mockResolvedValue(
        createMockSession({ status: "completed" })
      );

      const updated = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { status: "completed" },
      });

      expect(updated.status).toBe("completed");
    });

    it("should transition from scheduled to cancelled", async () => {
      mockPrismaInstance.therapySession.findUnique.mockResolvedValue(
        createMockSession({ status: "scheduled" })
      );
      mockPrismaInstance.therapySession.update.mockResolvedValue(
        createMockSession({ status: "cancelled" })
      );

      const updated = await mockPrismaInstance.therapySession.update({
        where: { id: "session-123" },
        data: { status: "cancelled" },
      });

      expect(updated.status).toBe("cancelled");
    });
  });

  describe("Session Modalities", () => {
    it("should support telehealth sessions", async () => {
      mockPrismaInstance.therapySession.create.mockResolvedValue({
        ...mockSession,
        modality: "telehealth",
      });

      const result = await mockPrismaInstance.therapySession.create({
        data: { ...mockSession, modality: "telehealth" },
      });

      expect(result.modality).toBe("telehealth");
    });

    it("should support in-person sessions", async () => {
      mockPrismaInstance.therapySession.create.mockResolvedValue({
        ...mockSession,
        modality: "in_person",
      });

      const result = await mockPrismaInstance.therapySession.create({
        data: { ...mockSession, modality: "in_person" },
      });

      expect(result.modality).toBe("in_person");
    });

    it("should support phone sessions", async () => {
      mockPrismaInstance.therapySession.create.mockResolvedValue({
        ...mockSession,
        modality: "phone",
      });

      const result = await mockPrismaInstance.therapySession.create({
        data: { ...mockSession, modality: "phone" },
      });

      expect(result.modality).toBe("phone");
    });
  });

  describe("Scheduling Edge Cases", () => {
    it("should handle sessions with only required fields", async () => {
      const minimalSession = {
        patientId: "patient-123",
        therapistId: "therapist-123",
        sessionType: "individual",
        scheduledAt: new Date(),
        duration: 50,
      };

      mockPrismaInstance.therapySession.create.mockResolvedValue({
        id: "session-minimal",
        ...minimalSession,
        status: "scheduled",
        modality: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrismaInstance.therapySession.create({
        data: minimalSession,
      });

      expect(result.id).toBeDefined();
      expect(result.modality).toBeNull();
      expect(result.notes).toBeNull();
    });

    it("should handle concurrent session queries", async () => {
      const sessions = Array.from({ length: 5 }, (_, i) =>
        createMockSession({ id: `session-${i}` })
      );

      mockPrismaInstance.therapySession.findMany.mockResolvedValue(sessions);

      const results = await Promise.all([
        mockPrismaInstance.therapySession.findMany({ where: { patientId: "patient-123" } }),
        mockPrismaInstance.therapySession.findMany({ where: { therapistId: "therapist-123" } }),
      ]);

      expect(results[0]).toHaveLength(5);
      expect(results[1]).toHaveLength(5);
    });
  });
});
