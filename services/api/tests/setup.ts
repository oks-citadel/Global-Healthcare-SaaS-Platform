// Test setup file for Vitest
import { beforeEach, afterAll, vi, beforeAll } from "vitest";

// Mock environment variables for testing
process.env.NODE_ENV = "test";
process.env.DEMO_MODE = "true";
process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only-min-32-chars";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
process.env.ENCRYPTION_KEY = "test-32-byte-encryption-key-here!";
process.env.STRIPE_SECRET_KEY = "sk_test_mock_key";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";

// ============================================================================
// In-Memory Store for Mock Data
// ============================================================================
const mockStore: Record<string, Map<string, any>> = {};

// Generate unique IDs
let idCounter = 0;
function generateId(prefix: string = ""): string {
  return `${prefix}${++idCounter}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Reset store for clean tests
function resetStore(): void {
  Object.keys(mockStore).forEach((key) => {
    mockStore[key].clear();
  });
  idCounter = 0;
}

// ============================================================================
// Prisma Model Mock Factory
// ============================================================================
function createModelMock(modelName: string) {
  if (!mockStore[modelName]) {
    mockStore[modelName] = new Map();
  }
  const store = mockStore[modelName];

  return {
    findUnique: vi.fn().mockImplementation(async (args: any) => {
      const whereKey = Object.keys(args.where || {})[0];
      const whereValue = args.where?.[whereKey];

      // Handle composite keys or direct ID lookup
      let result: any = null;
      if (whereKey === "id" || !whereKey) {
        result = store.get(whereValue) || null;
      } else {
        // Search by other field
        for (const [, value] of store) {
          if (value[whereKey] === whereValue) {
            result = value;
            break;
          }
        }
      }

      if (result && args.include) {
        // Handle includes by adding empty arrays for relations
        Object.keys(args.include).forEach((key) => {
          if (!result[key]) {
            result[key] = [];
          }
        });
      }

      return result;
    }),

    findFirst: vi.fn().mockImplementation(async (args: any) => {
      const where = args?.where || {};
      for (const [, value] of store) {
        let matches = true;
        for (const [key, val] of Object.entries(where)) {
          if (value[key] !== val) {
            matches = false;
            break;
          }
        }
        if (matches) {
          if (args?.include) {
            Object.keys(args.include).forEach((key) => {
              if (!value[key]) value[key] = [];
            });
          }
          return value;
        }
      }
      return null;
    }),

    findMany: vi.fn().mockImplementation(async (args: any) => {
      const where = args?.where || {};
      const results: any[] = [];

      for (const [, value] of store) {
        let matches = true;
        for (const [key, val] of Object.entries(where)) {
          if (value[key] !== val) {
            matches = false;
            break;
          }
        }
        if (matches) {
          const item = { ...value };
          if (args?.include) {
            Object.keys(args.include).forEach((key) => {
              if (!item[key]) item[key] = [];
            });
          }
          results.push(item);
        }
      }

      // Handle orderBy
      if (args?.orderBy) {
        const orderKey = Object.keys(args.orderBy)[0];
        const orderDir = args.orderBy[orderKey];
        results.sort((a, b) => {
          const aVal = a[orderKey];
          const bVal = b[orderKey];
          if (aVal < bVal) return orderDir === "asc" ? -1 : 1;
          if (aVal > bVal) return orderDir === "asc" ? 1 : -1;
          return 0;
        });
      }

      // Handle pagination
      let paginatedResults = results;
      if (args?.skip !== undefined) {
        paginatedResults = paginatedResults.slice(args.skip);
      }
      if (args?.take !== undefined) {
        paginatedResults = paginatedResults.slice(0, args.take);
      }

      return paginatedResults;
    }),

    create: vi.fn().mockImplementation(async (args: any) => {
      const id = args.data.id || generateId(`${modelName.slice(0, 3)}-`);
      const now = new Date();
      const record = {
        id,
        ...args.data,
        createdAt: args.data.createdAt || now,
        updatedAt: args.data.updatedAt || now,
        timestamp: args.data.timestamp || now,
      };

      store.set(id, record);

      // Handle includes
      if (args.include) {
        Object.keys(args.include).forEach((key) => {
          if (!record[key]) record[key] = [];
        });
      }

      return record;
    }),

    update: vi.fn().mockImplementation(async (args: any) => {
      const whereKey = Object.keys(args.where || {})[0];
      const whereValue = args.where?.[whereKey];

      let record: any = null;
      let recordId: string | null = null;

      if (whereKey === "id") {
        record = store.get(whereValue);
        recordId = whereValue;
      } else {
        for (const [id, value] of store) {
          if (value[whereKey] === whereValue) {
            record = value;
            recordId = id;
            break;
          }
        }
      }

      if (!record) {
        throw new Error(`Record not found in ${modelName}`);
      }

      const updatedRecord = {
        ...record,
        ...args.data,
        updatedAt: new Date(),
      };

      store.set(recordId!, updatedRecord);

      // Handle includes
      if (args.include) {
        Object.keys(args.include).forEach((key) => {
          if (!updatedRecord[key]) updatedRecord[key] = [];
        });
      }

      return updatedRecord;
    }),

    delete: vi.fn().mockImplementation(async (args: any) => {
      const whereKey = Object.keys(args.where || {})[0];
      const whereValue = args.where?.[whereKey];

      let record: any = null;
      let recordId: string | null = null;

      if (whereKey === "id") {
        record = store.get(whereValue);
        recordId = whereValue;
      } else {
        for (const [id, value] of store) {
          if (value[whereKey] === whereValue) {
            record = value;
            recordId = id;
            break;
          }
        }
      }

      if (record && recordId) {
        store.delete(recordId);
      }

      return record;
    }),

    deleteMany: vi.fn().mockImplementation(async (args: any) => {
      const where = args?.where || {};
      let count = 0;
      const toDelete: string[] = [];

      for (const [id, value] of store) {
        let matches = true;
        for (const [key, val] of Object.entries(where)) {
          if (value[key] !== val) {
            matches = false;
            break;
          }
        }
        if (matches) {
          toDelete.push(id);
          count++;
        }
      }

      toDelete.forEach((id) => store.delete(id));
      return { count };
    }),

    count: vi.fn().mockImplementation(async (args: any) => {
      const where = args?.where || {};
      let count = 0;

      for (const [, value] of store) {
        let matches = true;
        for (const [key, val] of Object.entries(where)) {
          if (value[key] !== val) {
            matches = false;
            break;
          }
        }
        if (matches) count++;
      }

      return count;
    }),

    upsert: vi.fn().mockImplementation(async (args: any) => {
      const whereKey = Object.keys(args.where || {})[0];
      const whereValue = args.where?.[whereKey];

      let existing: any = null;
      if (whereKey === "id") {
        existing = store.get(whereValue);
      } else {
        for (const [, value] of store) {
          if (value[whereKey] === whereValue) {
            existing = value;
            break;
          }
        }
      }

      if (existing) {
        // Update
        const updatedRecord = {
          ...existing,
          ...args.update,
          updatedAt: new Date(),
        };
        store.set(existing.id, updatedRecord);
        return updatedRecord;
      } else {
        // Create
        const id = generateId(`${modelName.slice(0, 3)}-`);
        const now = new Date();
        const record = {
          id,
          ...args.create,
          createdAt: now,
          updatedAt: now,
        };
        store.set(id, record);
        return record;
      }
    }),
  };
}

// ============================================================================
// Mock Prisma Client
// ============================================================================
const mockPrismaClient = {
  user: createModelMock("user"),
  patient: createModelMock("patient"),
  provider: createModelMock("provider"),
  encounter: createModelMock("encounter"),
  clinicalNote: createModelMock("clinicalNote"),
  document: createModelMock("document"),
  appointment: createModelMock("appointment"),
  notification: createModelMock("notification"),
  pushDevice: createModelMock("pushDevice"),
  subscription: createModelMock("subscription"),
  consent: createModelMock("consent"),
  auditLog: createModelMock("auditLog"),
  payment: createModelMock("payment"),
  invoice: createModelMock("invoice"),
  visit: createModelMock("visit"),
  session: createModelMock("session"),
  refreshToken: createModelMock("refreshToken"),
  plan: createModelMock("plan"),
  // Add any other models as needed
  $connect: vi.fn().mockResolvedValue(undefined),
  $disconnect: vi.fn().mockResolvedValue(undefined),
  $transaction: vi.fn().mockImplementation(async (fn: any) => {
    if (typeof fn === "function") {
      return fn(mockPrismaClient);
    }
    return Promise.all(fn);
  }),
  $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
  $executeRaw: vi.fn().mockResolvedValue(0),
  $on: vi.fn(),
};

// ============================================================================
// Mock Prisma Module
// ============================================================================
vi.mock("../src/lib/prisma.js", () => ({
  prisma: mockPrismaClient,
  connectDatabase: vi.fn().mockResolvedValue(undefined),
  disconnectDatabase: vi.fn().mockResolvedValue(undefined),
  checkDatabaseHealth: vi
    .fn()
    .mockResolvedValue({ connected: true, latency: 1 }),
  default: mockPrismaClient,
}));

// ============================================================================
// Mock Config
// ============================================================================
vi.mock("../src/config/index.js", () => ({
  config: {
    env: "test",
    port: 8080,
    version: "1.0.0",
    cors: {
      origins: ["http://localhost:3000"],
    },
    rateLimit: {
      max: 100,
    },
    jwt: {
      secret: "test-jwt-secret-key-for-testing-only-min-32-chars",
      expiresIn: "1h",
      refreshExpiresIn: "7d",
    },
    database: {
      url: "postgresql://test:test@localhost:5432/test_db",
    },
    redis: {
      host: "localhost",
      port: 6379,
      password: undefined,
    },
    encryption: {
      key: "test-32-byte-encryption-key-here!",
    },
    aws: {
      region: "us-east-1",
      accessKeyId: "test-access-key",
      secretAccessKey: "test-secret-key",
      s3: {
        bucket: "test-bucket",
        quarantineBucket: "test-quarantine",
      },
      secretsManager: {
        enabled: false,
      },
    },
    storage: {
      url: "https://storage.example.com",
      container: "documents",
      maxFileSize: 104857600,
    },
    storageUrl: "https://storage.example.com",
    logging: {
      level: "error",
    },
    push: {
      fcm: {
        serverKey: "test-fcm-key",
        senderId: "test-sender-id",
      },
      apns: {
        keyId: "test-key-id",
        teamId: "test-team-id",
        bundleId: "com.test.app",
        production: false,
        keyPath: "/path/to/key",
      },
      webPush: {
        vapidPublicKey: "test-vapid-public",
        vapidPrivateKey: "test-vapid-private",
        subject: "mailto:test@example.com",
      },
    },
  },
  validateConfig: vi
    .fn()
    .mockReturnValue({ valid: true, errors: [], warnings: [] }),
}));

// ============================================================================
// Mock Logger
// ============================================================================
vi.mock("../src/utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    child: vi.fn().mockReturnThis(),
  },
}));

// ============================================================================
// Test Lifecycle Hooks
// ============================================================================
beforeAll(() => {
  // Any global setup
});

beforeEach(() => {
  // Reset store for clean test state
  resetStore();
  // Clear all mock call history
  vi.clearAllMocks();
});

afterAll(async () => {
  // Global cleanup
  resetStore();
});

// Export for use in test files if needed
export { mockPrismaClient, mockStore, resetStore };
