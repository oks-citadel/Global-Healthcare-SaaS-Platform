/**
 * Mock Helpers
 * Provides reusable mocks for external dependencies
 */

import { vi } from 'vitest';

/**
 * Mock Express Request
 */
export function mockRequest(overrides: any = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: undefined,
    ...overrides,
  };
}

/**
 * Mock Express Response
 */
export function mockResponse() {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Mock Express Next Function
 */
export function mockNext() {
  return vi.fn();
}

/**
 * Mock Prisma Client
 */
export function mockPrismaClient() {
  return {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    patient: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    provider: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    appointment: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    encounter: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    document: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    notification: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    pushDevice: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    consent: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    auditLog: {
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
}

/**
 * Mock Redis Client
 */
const redisEventHandlers: Record<string, Function> = {};

// Shared mock client instance - same object returned each time
export const sharedRedisClient = {
  connect: vi.fn(),
  quit: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  setEx: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
  exists: vi.fn(),
  ttl: vi.fn(),
  flushDb: vi.fn(),
  ping: vi.fn(),
  on: vi.fn(),
};

export function mockRedisClient() {
  return sharedRedisClient;
}

export function resetRedisClientMock() {
  // Clear event handlers
  Object.keys(redisEventHandlers).forEach(key => delete redisEventHandlers[key]);
  
  // Reset all mock implementations
  sharedRedisClient.connect.mockImplementation(async () => {
    await Promise.resolve();
    if (redisEventHandlers['connect']) redisEventHandlers['connect']();
  });
  sharedRedisClient.quit.mockResolvedValue(undefined);
  sharedRedisClient.get.mockResolvedValue(null);
  sharedRedisClient.set.mockResolvedValue('OK');
  sharedRedisClient.setEx.mockResolvedValue('OK');
  sharedRedisClient.del.mockResolvedValue(1);
  sharedRedisClient.keys.mockResolvedValue([]);
  sharedRedisClient.exists.mockResolvedValue(0);
  sharedRedisClient.ttl.mockResolvedValue(-1);
  sharedRedisClient.flushDb.mockResolvedValue('OK');
  sharedRedisClient.ping.mockResolvedValue('PONG');
  sharedRedisClient.on.mockImplementation((event, handler) => {
    redisEventHandlers[event] = handler;
  });
}


/**
 * Mock Logger
 */
export function mockLogger() {
  return {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };
}

/**
 * Mock AWS SES Client
 */
export function mockAwsSesClient() {
  return {
    send: vi.fn().mockResolvedValue({ MessageId: 'mock-ses-message-id' }),
  };
}

/**
 * Mock Stripe Client
 */
export function mockStripeClient() {
  return {
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      del: vi.fn(),
    },
    subscriptions: {
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
    },
    paymentIntents: {
      create: vi.fn(),
      retrieve: vi.fn(),
      confirm: vi.fn(),
      cancel: vi.fn(),
    },
    paymentMethods: {
      attach: vi.fn(),
      detach: vi.fn(),
    },
    prices: {
      list: vi.fn(),
      retrieve: vi.fn(),
    },
    products: {
      list: vi.fn(),
      retrieve: vi.fn(),
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  };
}

/**
 * Mock AWS SNS Client
 */
export function mockAwsSnsClient() {
  return {
    messages: {
      create: vi.fn().mockResolvedValue({
        MessageId: 'mock-sns-message-id',
        success: true,
      }),
    },
  };
}

/**
 * Mock Fetch Response
 */
export function mockFetchResponse(data: any, ok: boolean = true, status: number = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Map(),
  } as Response);
}

/**
 * Mock Socket.IO Server
 */
export function mockSocketIOServer() {
  return {
    emit: vi.fn(),
    to: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    on: vi.fn(),
    off: vi.fn(),
  };
}

/**
 * Mock Bull Queue
 */
export function mockBullQueue() {
  return {
    add: vi.fn().mockResolvedValue({ id: 'job-123' }),
    process: vi.fn(),
    on: vi.fn(),
    close: vi.fn(),
  };
}

/**
 * Mock JWT
 */
export function mockJWT() {
  return {
    sign: vi.fn().mockReturnValue('mock-jwt-token'),
    verify: vi.fn(),
    decode: vi.fn(),
  };
}

/**
 * Create a delay promise for testing
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Spy on console methods
 */
export function spyConsole() {
  return {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
  };
}
