import { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '../generated/client/index.js';
import { logger } from '../utils/logger.js';
import { ForbiddenError } from '../utils/errors.js';
import {
  setTenantContext as setRlsTenantContext,
  clearTenantContext as clearRlsTenantContext,
  isValidTenantId,
  RLS_TENANT_VARIABLE,
} from '../lib/rls-tenant-context.js';

/**
 * Multi-Tenant Isolation Middleware
 *
 * SECURITY: This middleware ensures that all database queries are scoped to the
 * user's tenant. This prevents cross-tenant data leakage and is critical for
 * HIPAA compliance in a multi-tenant healthcare platform.
 *
 * Defense-in-Depth Architecture:
 * 1. Application Layer: Express middleware extracts tenantId from authenticated user
 * 2. ORM Layer: Prisma middleware automatically adds tenantId filter to all queries
 * 3. Database Layer: PostgreSQL Row-Level Security (RLS) policies enforce isolation
 *
 * The combination of these three layers ensures that even if one layer fails,
 * the other layers will prevent cross-tenant data access.
 */

// Models that require tenant isolation
const TENANT_SCOPED_MODELS = [
  'User',
  'Patient',
  'Provider',
  'Appointment',
  'Encounter',
  'Document',
] as const;

type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number];

/**
 * Express middleware to extract and validate tenant context
 */
export const tenantContext = (req: Request, _res: Response, next: NextFunction) => {
  // tenantId should come from the authenticated user's JWT
  if (req.user?.tenantId) {
    // Attach tenantId to request for downstream use
    (req as any).tenantId = req.user.tenantId;
  }

  next();
};

/**
 * Express middleware to require tenant context for certain operations
 */
export const requireTenant = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user?.tenantId) {
    logger.warn('Operation requires tenant context', {
      userId: req.user?.userId,
      path: req.path,
      method: req.method,
    });
    return next(new ForbiddenError('Tenant context required for this operation'));
  }

  next();
};

/**
 * Create a Prisma client with tenant isolation middleware
 *
 * This should be used to create tenant-scoped Prisma clients that automatically
 * add tenantId filters to all queries on tenant-scoped models.
 *
 * Defense-in-Depth: This function provides both:
 * 1. Application-level filtering via Prisma middleware (immediate)
 * 2. Database-level RLS context setting (backup protection)
 *
 * @param basePrisma - The base Prisma client instance
 * @param tenantId - The tenant ID to scope queries to
 * @returns A Prisma client that automatically filters by tenantId
 */
export function createTenantScopedPrisma(
  basePrisma: PrismaClient,
  tenantId: string
): PrismaClient {
  // Validate tenant ID format before creating scoped client
  if (!isValidTenantId(tenantId)) {
    logger.error('Invalid tenant ID format for scoped Prisma client', {
      tenantId: tenantId?.substring(0, 8) + '...',
    });
    throw new Error('Invalid tenant ID format');
  }

  return basePrisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }: any) {
          // Set RLS context for defense-in-depth
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async findFirst({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async findUnique({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          // For findUnique, we add a validation after the query
          const result = await query(args);
          if (result && isTenantScopedModel(model) && result.tenantId !== tenantId) {
            logger.warn('Cross-tenant access attempt blocked', {
              model,
              recordTenantId: result.tenantId,
              requestTenantId: tenantId,
            });
            return null;
          }
          return result;
        },
        async create({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.data = { ...args.data, tenantId };
          }
          return query(args);
        },
        async createMany({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model) && Array.isArray(args.data)) {
            args.data = args.data.map((item: any) => ({ ...item, tenantId }));
          }
          return query(args);
        },
        async update({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async updateMany({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async delete({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async deleteMany({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async count({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async aggregate({ model, args, query }: any) {
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
      },
    },
  }) as unknown as PrismaClient;
}

/**
 * Check if a model requires tenant scoping
 */
function isTenantScopedModel(model: string): model is TenantScopedModel {
  return TENANT_SCOPED_MODELS.includes(model as TenantScopedModel);
}

/**
 * Validate that a record belongs to the specified tenant
 * Use this for explicit validation when needed
 */
export function validateTenantAccess(
  record: { tenantId?: string | null } | null,
  tenantId: string,
  modelName: string
): void {
  if (!record) return;

  if (record.tenantId && record.tenantId !== tenantId) {
    logger.error('Cross-tenant access violation', {
      modelName,
      recordTenantId: record.tenantId,
      requestTenantId: tenantId,
    });
    throw new ForbiddenError('Access denied');
  }
}

/**
 * Get tenant ID from request
 * Returns null if no tenant context is available
 */
export function getTenantId(req: Request): string | null {
  return req.user?.tenantId || (req as any).tenantId || null;
}

export default {
  tenantContext,
  requireTenant,
  createTenantScopedPrisma,
  validateTenantAccess,
  getTenantId,
};
