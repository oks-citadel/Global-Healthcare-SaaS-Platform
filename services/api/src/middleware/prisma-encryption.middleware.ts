import { Prisma } from '../generated/client/index.js';
import {
  encryptFields,
  decryptFields,
  getEncryptedFieldsForModel,
  isEncrypted,
  logFieldEncryptionEvent,
  getFieldEncryptionService,
} from '../lib/field-encryption.js';
import { logger } from '../utils/logger.js';

/**
 * HIPAA-Compliant Prisma Field Encryption Middleware
 *
 * This middleware automatically encrypts sensitive PII fields before they are
 * written to the database and decrypts them when read.
 *
 * Supported operations:
 * - create / createMany
 * - update / updateMany
 * - upsert
 * - findUnique / findFirst / findMany
 *
 * Encrypted fields are defined in the field-encryption.ts ENCRYPTED_FIELDS config.
 */

type PrismaAction =
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'findUnique'
  | 'findFirst'
  | 'findMany'
  | 'delete'
  | 'deleteMany'
  | 'count'
  | 'aggregate'
  | 'groupBy';

const WRITE_ACTIONS: PrismaAction[] = [
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
];

const READ_ACTIONS: PrismaAction[] = [
  'findUnique',
  'findFirst',
  'findMany',
];

/**
 * Encrypt data before write operations
 * @param model - The Prisma model name
 * @param action - The Prisma action being performed
 * @param args - The arguments to the Prisma operation
 * @param customFields - Optional custom fields array (overrides default fields if provided)
 */
function encryptWriteData(
  model: string,
  action: PrismaAction,
  args: Record<string, unknown>,
  customFields?: string[]
): Record<string, unknown> {
  const fields = customFields ?? getEncryptedFieldsForModel(model);

  if (fields.length === 0) {
    return args;
  }

  const result = { ...args };

  try {
    switch (action) {
      case 'create':
        if (result.data && typeof result.data === 'object') {
          result.data = encryptFields(result.data as Record<string, unknown>, fields);
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        break;

      case 'createMany':
        if (result.data && Array.isArray(result.data)) {
          result.data = (result.data as Record<string, unknown>[]).map((item) =>
            encryptFields(item, fields)
          );
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        break;

      case 'update':
        if (result.data && typeof result.data === 'object') {
          result.data = encryptFields(result.data as Record<string, unknown>, fields);
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        break;

      case 'updateMany':
        if (result.data && typeof result.data === 'object') {
          result.data = encryptFields(result.data as Record<string, unknown>, fields);
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        break;

      case 'upsert':
        if (result.create && typeof result.create === 'object') {
          result.create = encryptFields(result.create as Record<string, unknown>, fields);
        }
        if (result.update && typeof result.update === 'object') {
          result.update = encryptFields(result.update as Record<string, unknown>, fields);
        }
        logFieldEncryptionEvent('encrypt', model, fields.join(','));
        break;
    }
  } catch (error) {
    logger.error('Failed to encrypt data before write', {
      model,
      action,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error(`Encryption failed for ${model}.${action}`);
  }

  return result;
}

/**
 * Decrypt data after read operations
 * @param model - The Prisma model name
 * @param data - The data returned from the Prisma operation
 * @param customFields - Optional custom fields array (overrides default fields if provided)
 */
function decryptReadData(
  model: string,
  data: unknown,
  customFields?: string[]
): unknown {
  const fields = customFields ?? getEncryptedFieldsForModel(model);

  if (fields.length === 0 || !data) {
    return data;
  }

  try {
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (item && typeof item === 'object') {
          const decrypted = decryptFields(item as Record<string, unknown>, fields);
          logFieldEncryptionEvent('decrypt', model, fields.join(','));
          return decrypted;
        }
        return item;
      });
    }

    if (typeof data === 'object') {
      const decrypted = decryptFields(data as Record<string, unknown>, fields);
      logFieldEncryptionEvent('decrypt', model, fields.join(','));
      return decrypted;
    }

    return data;
  } catch (error) {
    logger.error('Failed to decrypt data after read', {
      model,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return original data if decryption fails to avoid blocking reads
    return data;
  }
}

/**
 * Prisma middleware for field-level encryption
 *
 * Usage:
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * import { fieldEncryptionMiddleware } from './middleware/prisma-encryption.middleware';
 *
 * const prisma = new PrismaClient();
 * prisma.$use(fieldEncryptionMiddleware);
 * ```
 */
export const fieldEncryptionMiddleware: Prisma.Middleware = async (
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<unknown>
): Promise<unknown> => {
  const { model, action, args } = params;

  if (!model) {
    return next(params);
  }

  const typedAction = action as PrismaAction;

  // Encrypt data before write operations
  if (WRITE_ACTIONS.includes(typedAction) && args) {
    params.args = encryptWriteData(model, typedAction, args as Record<string, unknown>);
  }

  // Execute the query
  const result = await next(params);

  // Decrypt data after read operations
  if (READ_ACTIONS.includes(typedAction) && result) {
    return decryptReadData(model, result);
  }

  return result;
};

/**
 * Prisma extension for field-level encryption (Prisma 4.16+)
 *
 * Usage:
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * import { withFieldEncryption } from './middleware/prisma-encryption.middleware';
 *
 * const prisma = new PrismaClient().$extends(withFieldEncryption);
 * ```
 */
export const withFieldEncryption = Prisma.defineExtension({
  name: 'field-encryption',
  query: {
    $allModels: {
      async create({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        if (fields.length > 0 && args.data) {
          args.data = encryptFields(args.data as Record<string, unknown>, fields);
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        const result = await query(args);
        if (result && fields.length > 0) {
          return decryptFields(result as Record<string, unknown>, fields);
        }
        return result;
      },

      async createMany({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        if (fields.length > 0 && args.data && Array.isArray(args.data)) {
          args.data = args.data.map((item: Record<string, unknown>) =>
            encryptFields(item, fields)
          );
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        return query(args);
      },

      async update({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        if (fields.length > 0 && args.data) {
          args.data = encryptFields(args.data as Record<string, unknown>, fields);
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        const result = await query(args);
        if (result && fields.length > 0) {
          return decryptFields(result as Record<string, unknown>, fields);
        }
        return result;
      },

      async updateMany({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        if (fields.length > 0 && args.data) {
          args.data = encryptFields(args.data as Record<string, unknown>, fields);
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        return query(args);
      },

      async upsert({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        if (fields.length > 0) {
          if (args.create) {
            args.create = encryptFields(args.create as Record<string, unknown>, fields);
          }
          if (args.update) {
            args.update = encryptFields(args.update as Record<string, unknown>, fields);
          }
          logFieldEncryptionEvent('encrypt', model, fields.join(','));
        }
        const result = await query(args);
        if (result && fields.length > 0) {
          return decryptFields(result as Record<string, unknown>, fields);
        }
        return result;
      },

      async findUnique({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        const result = await query(args);
        if (result && fields.length > 0) {
          logFieldEncryptionEvent('decrypt', model, fields.join(','));
          return decryptFields(result as Record<string, unknown>, fields);
        }
        return result;
      },

      async findFirst({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        const result = await query(args);
        if (result && fields.length > 0) {
          logFieldEncryptionEvent('decrypt', model, fields.join(','));
          return decryptFields(result as Record<string, unknown>, fields);
        }
        return result;
      },

      async findMany({ model, args, query }) {
        const fields = getEncryptedFieldsForModel(model);
        const results = await query(args);
        if (results && Array.isArray(results) && fields.length > 0) {
          logFieldEncryptionEvent('decrypt', model, fields.join(','));
          return results.map((item: Record<string, unknown>) =>
            decryptFields(item, fields)
          );
        }
        return results;
      },
    },
  },
});

/**
 * Helper to apply encryption middleware to a Prisma client
 */
export function applyFieldEncryption<T extends { $use: (middleware: Prisma.Middleware) => void }>(
  prisma: T
): T {
  prisma.$use(fieldEncryptionMiddleware);
  logger.info('Field encryption middleware applied to Prisma client');
  return prisma;
}

/**
 * Configuration for selective field encryption
 */
export interface SelectiveEncryptionConfig {
  /** Models to include (if empty, includes all configured models) */
  includeModels?: string[];
  /** Models to exclude from encryption */
  excludeModels?: string[];
  /** Additional fields to encrypt (model -> fields) */
  additionalFields?: Record<string, string[]>;
  /** Fields to exclude from encryption (model -> fields) */
  excludeFields?: Record<string, string[]>;
}

/**
 * Create a selective field encryption middleware
 */
export function createSelectiveEncryptionMiddleware(
  config: SelectiveEncryptionConfig
): Prisma.Middleware {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<unknown>
  ): Promise<unknown> => {
    const { model, action, args } = params;

    if (!model) {
      return next(params);
    }

    // Check if model should be processed
    if (config.excludeModels?.includes(model)) {
      return next(params);
    }

    if (config.includeModels && config.includeModels.length > 0) {
      if (!config.includeModels.includes(model)) {
        return next(params);
      }
    }

    // Get fields to encrypt (base + additional - excluded)
    let fields = getEncryptedFieldsForModel(model);

    if (config.additionalFields?.[model]) {
      fields = [...new Set([...fields, ...config.additionalFields[model]])];
    }

    if (config.excludeFields?.[model]) {
      fields = fields.filter((f) => !config.excludeFields![model].includes(f));
    }

    if (fields.length === 0) {
      return next(params);
    }

    const typedAction = action as PrismaAction;

    // Encrypt data before write operations (use custom fields array)
    if (WRITE_ACTIONS.includes(typedAction) && args) {
      params.args = encryptWriteData(model, typedAction, args as Record<string, unknown>, fields);
    }

    // Execute the query
    const result = await next(params);

    // Decrypt data after read operations (use custom fields array)
    if (READ_ACTIONS.includes(typedAction) && result) {
      return decryptReadData(model, result, fields);
    }

    return result;
  };
}

/**
 * Decrypt a single record manually (for cases where middleware isn't used)
 */
export function decryptRecord<T extends Record<string, unknown>>(
  model: string,
  record: T
): T {
  const fields = getEncryptedFieldsForModel(model);
  if (fields.length === 0) {
    return record;
  }
  return decryptFields(record, fields);
}

/**
 * Encrypt a single record manually (for cases where middleware isn't used)
 */
export function encryptRecord<T extends Record<string, unknown>>(
  model: string,
  record: T
): T {
  const fields = getEncryptedFieldsForModel(model);
  if (fields.length === 0) {
    return record;
  }
  return encryptFields(record, fields);
}

export default {
  fieldEncryptionMiddleware,
  withFieldEncryption,
  applyFieldEncryption,
  createSelectiveEncryptionMiddleware,
  decryptRecord,
  encryptRecord,
};
