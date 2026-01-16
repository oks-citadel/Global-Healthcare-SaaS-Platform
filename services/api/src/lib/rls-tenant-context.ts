/**
 * Row-Level Security (RLS) Tenant Context Manager
 *
 * This module provides utilities for setting and managing the PostgreSQL session
 * variable used by Row-Level Security policies to enforce multi-tenant data isolation
 * at the database level.
 *
 * SECURITY: This is a critical defense-in-depth layer. Even if application-level
 * tenant filtering fails, RLS policies at the database level will prevent
 * cross-tenant data access.
 *
 * HIPAA Compliance: This module helps maintain PHI data segregation by ensuring
 * that healthcare data from different tenants cannot be accessed across boundaries.
 *
 * Usage:
 * 1. Call setTenantContext() at the start of each request with the user's tenantId
 * 2. Use withTenantContext() for transaction-scoped tenant context
 * 3. Call clearTenantContext() when performing system/admin operations
 */

import { PrismaClient, Prisma } from '../generated/client/index.js';
import { logger } from '../utils/logger.js';

/**
 * The PostgreSQL session variable name used to store the current tenant ID
 * This must match the variable name used in the RLS policies
 */
export const RLS_TENANT_VARIABLE = 'app.current_tenant_id';

/**
 * Set the tenant context for the current database session.
 * This enables RLS policies to filter data by the specified tenant.
 *
 * @param prisma - The Prisma client instance
 * @param tenantId - The tenant ID to set for the session
 * @throws Error if the query fails
 *
 * @example
 * ```typescript
 * await setTenantContext(prisma, 'tenant-uuid-123');
 * const patients = await prisma.patient.findMany(); // Only returns tenant's patients
 * ```
 */
export async function setTenantContext(
  prisma: PrismaClient,
  tenantId: string
): Promise<void> {
  if (!tenantId) {
    logger.warn('Attempted to set empty tenant context');
    return;
  }

  try {
    // Use parameterized query to prevent SQL injection
    // Note: SET commands don't support parameterized values directly in PostgreSQL,
    // so we validate the tenantId format (UUID) before using it
    if (!isValidTenantId(tenantId)) {
      logger.error('Invalid tenant ID format', { tenantId: tenantId.substring(0, 8) + '...' });
      throw new Error('Invalid tenant ID format');
    }

    await prisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, false)`;

    logger.debug('Tenant context set', { tenantId: tenantId.substring(0, 8) + '...' });
  } catch (error) {
    logger.error('Failed to set tenant context', {
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: tenantId.substring(0, 8) + '...',
    });
    throw error;
  }
}

/**
 * Set the tenant context for the current transaction only.
 * The context will be automatically cleared when the transaction ends.
 *
 * @param prisma - The Prisma client instance
 * @param tenantId - The tenant ID to set for the transaction
 *
 * @example
 * ```typescript
 * await setTenantContextForTransaction(prisma, 'tenant-uuid-123');
 * ```
 */
export async function setTenantContextForTransaction(
  prisma: PrismaClient,
  tenantId: string
): Promise<void> {
  if (!tenantId || !isValidTenantId(tenantId)) {
    throw new Error('Invalid tenant ID');
  }

  // Setting the third parameter to true makes it transaction-local
  await prisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;
}

/**
 * Clear the tenant context for the current session.
 * This should be called when performing system-level operations that need
 * access to data across all tenants.
 *
 * SECURITY WARNING: Only use this for legitimate admin/system operations.
 * Clearing tenant context bypasses RLS policies.
 *
 * @param prisma - The Prisma client instance
 *
 * @example
 * ```typescript
 * await clearTenantContext(prisma);
 * const allUsers = await prisma.user.findMany(); // Returns all users across tenants
 * ```
 */
export async function clearTenantContext(prisma: PrismaClient): Promise<void> {
  try {
    await prisma.$executeRaw`RESET app.current_tenant_id`;
    logger.debug('Tenant context cleared');
  } catch (error) {
    // RESET will fail if the variable was never set, which is fine
    logger.debug('Tenant context reset (may not have been set)');
  }
}

/**
 * Get the current tenant context from the database session.
 *
 * @param prisma - The Prisma client instance
 * @returns The current tenant ID or null if not set
 */
export async function getTenantContext(prisma: PrismaClient): Promise<string | null> {
  try {
    const result = await prisma.$queryRaw<{ tenant_id: string | null }[]>`
      SELECT NULLIF(current_setting(${RLS_TENANT_VARIABLE}, true), '') as tenant_id
    `;
    return result[0]?.tenant_id || null;
  } catch (error) {
    return null;
  }
}

/**
 * Execute a callback with tenant context set, ensuring the context is properly
 * managed within a transaction.
 *
 * This is the recommended way to perform tenant-scoped operations as it:
 * 1. Sets the tenant context at the start
 * 2. Executes all operations within a transaction
 * 3. Ensures context is transaction-local (cleaned up automatically)
 *
 * @param prisma - The Prisma client instance
 * @param tenantId - The tenant ID to scope operations to
 * @param callback - The async function to execute with tenant context
 * @returns The result of the callback function
 *
 * @example
 * ```typescript
 * const result = await withTenantContext(prisma, tenantId, async (tx) => {
 *   const patient = await tx.patient.create({ data: { ... } });
 *   const appointment = await tx.appointment.create({ data: { patientId: patient.id, ... } });
 *   return { patient, appointment };
 * });
 * ```
 */
export async function withTenantContext<T>(
  prisma: PrismaClient,
  tenantId: string,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  if (!tenantId || !isValidTenantId(tenantId)) {
    throw new Error('Invalid tenant ID for tenant context');
  }

  return prisma.$transaction(async (tx) => {
    // Set tenant context for this transaction (transaction-local)
    await tx.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;

    // Execute the callback with the transaction client
    return callback(tx);
  });
}

/**
 * Execute a callback with system context (no tenant restriction).
 * Use this sparingly for admin operations that legitimately need cross-tenant access.
 *
 * SECURITY WARNING: This bypasses RLS. Use only when absolutely necessary.
 *
 * @param prisma - The Prisma client instance
 * @param callback - The async function to execute
 * @returns The result of the callback function
 *
 * @example
 * ```typescript
 * // Admin operation to count all users across tenants
 * const totalUsers = await withSystemContext(prisma, async (tx) => {
 *   return tx.user.count();
 * });
 * ```
 */
export async function withSystemContext<T>(
  prisma: PrismaClient,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  logger.info('Executing operation with system context (RLS bypassed)');

  return prisma.$transaction(async (tx) => {
    // Ensure no tenant context is set (transaction-local)
    await tx.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, '', true)`;

    return callback(tx);
  });
}

/**
 * Create a Prisma client extension that automatically sets tenant context
 * before each query. This can be used as an alternative to the middleware approach.
 *
 * @param basePrisma - The base Prisma client instance
 * @param getTenantIdFn - Function that returns the current tenant ID
 * @returns Extended Prisma client with automatic tenant context
 *
 * @example
 * ```typescript
 * const tenantPrisma = createRlsEnabledClient(prisma, () => getCurrentUserTenantId());
 * const patients = await tenantPrisma.patient.findMany();
 * ```
 */
export function createRlsEnabledClient(
  basePrisma: PrismaClient,
  getTenantIdFn: () => string | null | undefined
): PrismaClient {
  return basePrisma.$extends({
    query: {
      $allOperations: async ({ args, query, operation }) => {
        const tenantId = getTenantIdFn();

        if (tenantId && isValidTenantId(tenantId)) {
          // Set tenant context before the query
          await basePrisma.$executeRaw`SELECT set_config(${RLS_TENANT_VARIABLE}, ${tenantId}, true)`;
        }

        return query(args);
      },
    },
  }) as unknown as PrismaClient;
}

/**
 * Validate that a tenant ID has the correct format (UUID v4).
 * This prevents SQL injection and ensures data integrity.
 *
 * @param tenantId - The tenant ID to validate
 * @returns true if valid UUID format, false otherwise
 */
export function isValidTenantId(tenantId: string): boolean {
  if (!tenantId || typeof tenantId !== 'string') {
    return false;
  }

  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(tenantId);
}

/**
 * Verify that RLS is enabled and working correctly for a table.
 * This is useful for health checks and testing.
 *
 * @param prisma - The Prisma client instance
 * @param tableName - The table name to check
 * @returns Object with RLS status information
 */
export async function verifyRlsStatus(
  prisma: PrismaClient,
  tableName: string
): Promise<{
  enabled: boolean;
  forced: boolean;
  policyCount: number;
  policies: string[];
}> {
  try {
    // Check if RLS is enabled on the table
    const tableStatus = await prisma.$queryRaw<{ relrowsecurity: boolean; relforcerowsecurity: boolean }[]>`
      SELECT relrowsecurity, relforcerowsecurity
      FROM pg_class
      WHERE relname = ${tableName}
    `;

    // Get policy names for the table
    const policies = await prisma.$queryRaw<{ policyname: string }[]>`
      SELECT policyname
      FROM pg_policies
      WHERE tablename = ${tableName}
    `;

    const policyNames = policies.map((p) => p.policyname);

    return {
      enabled: tableStatus[0]?.relrowsecurity || false,
      forced: tableStatus[0]?.relforcerowsecurity || false,
      policyCount: policyNames.length,
      policies: policyNames,
    };
  } catch (error) {
    logger.error('Failed to verify RLS status', { tableName, error });
    return {
      enabled: false,
      forced: false,
      policyCount: 0,
      policies: [],
    };
  }
}

/**
 * Run a comprehensive RLS health check across all tenant-scoped tables.
 *
 * @param prisma - The Prisma client instance
 * @returns Object with health check results for all tables
 */
export async function runRlsHealthCheck(prisma: PrismaClient): Promise<{
  healthy: boolean;
  tables: Record<string, {
    enabled: boolean;
    forced: boolean;
    policyCount: number;
    status: 'ok' | 'warning' | 'error';
  }>;
  summary: string;
}> {
  const tenantTables = ['User', 'Patient', 'Provider', 'Appointment', 'Encounter', 'Document', 'Tenant'];
  const results: Record<string, any> = {};
  let allHealthy = true;

  for (const table of tenantTables) {
    const status = await verifyRlsStatus(prisma, table);
    let tableStatus: 'ok' | 'warning' | 'error' = 'ok';

    if (!status.enabled) {
      tableStatus = 'error';
      allHealthy = false;
    } else if (!status.forced || status.policyCount < 4) {
      tableStatus = 'warning';
    }

    results[table] = {
      enabled: status.enabled,
      forced: status.forced,
      policyCount: status.policyCount,
      status: tableStatus,
    };
  }

  const errorCount = Object.values(results).filter((r: any) => r.status === 'error').length;
  const warningCount = Object.values(results).filter((r: any) => r.status === 'warning').length;

  let summary = 'RLS Health Check: ';
  if (allHealthy && warningCount === 0) {
    summary += 'All tables properly configured';
  } else if (allHealthy) {
    summary += `OK with ${warningCount} warning(s)`;
  } else {
    summary += `${errorCount} table(s) missing RLS`;
  }

  return {
    healthy: allHealthy,
    tables: results,
    summary,
  };
}

export default {
  RLS_TENANT_VARIABLE,
  setTenantContext,
  setTenantContextForTransaction,
  clearTenantContext,
  getTenantContext,
  withTenantContext,
  withSystemContext,
  createRlsEnabledClient,
  isValidTenantId,
  verifyRlsStatus,
  runRlsHealthCheck,
};
