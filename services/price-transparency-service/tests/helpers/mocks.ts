/**
 * Test Mocks for Price Transparency Service
 */

import { vi } from 'vitest';

/**
 * Mock Decimal type that mimics Prisma.Decimal behavior
 */
export const mockDecimal = (value: number) => ({
  toNumber: () => value,
  toString: () => value.toString(),
  add: (other: any) => mockDecimal(value + (other?.toNumber?.() ?? other)),
  sub: (other: any) => mockDecimal(value - (other?.toNumber?.() ?? other)),
  mul: (other: any) => mockDecimal(value * (other?.toNumber?.() ?? other)),
  div: (other: any) => mockDecimal(value / (other?.toNumber?.() ?? other)),
  equals: (other: any) => value === (other?.toNumber?.() ?? other),
  greaterThan: (other: any) => value > (other?.toNumber?.() ?? other),
  lessThan: (other: any) => value < (other?.toNumber?.() ?? other),
});

/**
 * Creates a mock PrismaClient instance
 */
export const mockPrismaClient = () => ({
  // Chargemaster
  chargemasterItem: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    upsert: vi.fn(),
  },

  // Shoppable Services
  shoppableService: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },

  // Payer Contracts
  payerContract: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },

  // Payer Contract Rates
  payerContractRate: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },

  // Good Faith Estimates
  goodFaithEstimate: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },

  // GFE Line Items
  gFELineItem: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
  },

  // Price Estimates
  priceEstimate: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },

  // Price Comparison Cache
  priceComparisonCache: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  },

  // Machine Readable Files
  machineReadableFile: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },

  // Compliance Audits
  complianceAudit: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },

  // Connection methods
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $transaction: vi.fn((fn: any) => fn({
    chargemasterItem: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  })),
});

/**
 * Mock for fs module
 */
export const mockFs = {
  createWriteStream: vi.fn(() => ({
    write: vi.fn(),
    end: vi.fn(),
    on: vi.fn((event: string, callback: () => void) => {
      if (event === 'finish') {
        setTimeout(callback, 0);
      }
      return { write: vi.fn(), end: vi.fn(), on: vi.fn() };
    }),
  })),
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
  unlinkSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
};

/**
 * Mock UUID generator
 */
export const mockUUID = () => 'test-uuid-' + Math.random().toString(36).substring(7);

/**
 * Reset all mocks
 */
export const resetAllMocks = () => {
  vi.clearAllMocks();
};
