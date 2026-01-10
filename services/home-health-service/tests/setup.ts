/**
 * Test Setup for Home Health Service
 */

import { vi, beforeAll, afterAll, beforeEach } from "vitest";

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.PORT = "3010";
process.env.DATABASE_URL =
  "postgresql://test:test@localhost:5432/homehealth_test";
process.env.LOG_LEVEL = "error";
process.env.CORS_ORIGIN = "http://localhost:3000";

// Mock Prisma Client
vi.mock("../src/generated/client", () => {
  const mockPrismaClient = {
    homeVisit: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    caregiver: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    caregiverSchedule: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    patientHome: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    visitTask: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    eVVRecord: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    timeEntry: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    mileageEntry: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((callback: any) => {
      if (Array.isArray(callback)) {
        return Promise.all(callback);
      }
      return callback(mockPrismaClient);
    }),
  };

  return {
    PrismaClient: vi.fn(() => mockPrismaClient),
    EVVVerificationMethod: {
      gps: "gps",
      telephony: "telephony",
      biometric: "biometric",
      manual_override: "manual_override",
    },
    VisitStatus: {
      scheduled: "scheduled",
      confirmed: "confirmed",
      arrived: "arrived",
      in_progress: "in_progress",
      completed: "completed",
      cancelled: "cancelled",
      no_show: "no_show",
      rescheduled: "rescheduled",
    },
    VisitType: {
      skilled_nursing: "skilled_nursing",
      physical_therapy: "physical_therapy",
      occupational_therapy: "occupational_therapy",
      speech_therapy: "speech_therapy",
      home_health_aide: "home_health_aide",
      medical_social_work: "medical_social_work",
    },
    VisitPriority: {
      routine: "routine",
      urgent: "urgent",
      stat: "stat",
    },
  };
});

beforeAll(() => {
  // Global setup
});

afterAll(() => {
  // Global cleanup
});

beforeEach(() => {
  vi.clearAllMocks();
});
