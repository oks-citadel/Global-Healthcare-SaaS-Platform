/**
 * Test Setup for Denial Management Service
 */

import { vi, beforeAll, afterAll, beforeEach } from "vitest";

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.PORT = "3010";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/denial_test";
process.env.LOG_LEVEL = "error";
process.env.CORS_ORIGIN = "http://localhost:3000";

// Mock Prisma Client
vi.mock("../src/generated/client", () => {
  const mockPrismaClient = {
    denial: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    appeal: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    denialPattern: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    claimRiskAssessment: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    payerConfig: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    staffProductivity: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      aggregate: vi.fn(),
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
