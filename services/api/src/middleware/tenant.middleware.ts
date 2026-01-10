import { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '../generated/client/index.js';
import { logger } from '../utils/logger.js';
import { ForbiddenError } from '../utils/errors.js';

/**
 * Multi-Tenant Isolation Middleware
 *
 * SECURITY: This middleware ensures that all database queries are scoped to the
 * user's tenant. This prevents cross-tenant data leakage and is critical for
 * HIPAA compliance in a multi-tenant healthcare platform.
 *
 * Implementation:
 * 1. Express middleware extracts tenantId from authenticated user
 * 2. Prisma middleware automatically adds tenantId filter to all queries
 * 3. Validation middleware ensures tenantId is set before data operations
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
 * @param basePrisma - The base Prisma client instance
 * @param tenantId - The tenant ID to scope queries to
 * @returns A Prisma client that automatically filters by tenantId
 */
export function createTenantScopedPrisma(
  basePrisma: PrismaClient,
  tenantId: string
): PrismaClient {
  return basePrisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }: any) {
          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async findFirst({ model, args, query }: any) {
          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async findUnique({ model, args, query }: any) {
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
          if (isTenantScopedModel(model)) {
            args.data = { ...args.data, tenantId };
          }
          return query(args);
        },
        async createMany({ model, args, query }: any) {
          if (isTenantScopedModel(model) && Array.isArray(args.data)) {
            args.data = args.data.map((item: any) => ({ ...item, tenantId }));
          }
          return query(args);
        },
        async update({ model, args, query }: any) {
          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async updateMany({ model, args, query }: any) {
          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async delete({ model, args, query }: any) {
          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async deleteMany({ model, args, query }: any) {
          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async count({ model, args, query }: any) {
          if (isTenantScopedModel(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async aggregate({ model, args, query }: any) {
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
