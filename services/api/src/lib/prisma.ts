import { PrismaClient } from '../generated/client';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { applyFieldEncryption } from '../middleware/prisma-encryption.middleware.js';

// Extend PrismaClient with logging configuration
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.env === 'development'
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'info' },
          { emit: 'event', level: 'warn' },
        ]
      : [
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ],
  });
};

// Declare global prisma instance for hot reloading in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

// Use existing instance or create new one
const prismaInstance = globalThis.prisma ?? prismaClientSingleton();

// Apply field-level encryption middleware for sensitive PII data
// This automatically encrypts/decrypts fields like SSN, addresses, etc.
applyFieldEncryption(prismaInstance);

export const prisma = prismaInstance;

// Set up logging events
prisma.$on('query' as never, (e: { query: string; params: string; duration: number }) => {
  if (config.env === 'development') {
    logger.debug('Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  }
});

prisma.$on('error' as never, (e: { message: string }) => {
  logger.error('Prisma error', { message: e.message });
});

prisma.$on('warn' as never, (e: { message: string }) => {
  logger.warn('Prisma warning', { message: e.message });
});

// Prevent multiple instances in development
if (config.env !== 'production') {
  globalThis.prisma = prismaInstance;
}

// Connection management
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', { error });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Failed to disconnect from database', { error });
    throw error;
  }
}

// Health check for database connection
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  latency?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      connected: true,
      latency: Date.now() - start,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default prisma;
