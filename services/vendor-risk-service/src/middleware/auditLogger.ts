import { Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/client';
import { UserRequest } from './extractUser';

const prisma = new PrismaClient();

export interface AuditLogEntry {
  vendorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const createAuditLog = async (
  req: UserRequest,
  entry: AuditLogEntry
): Promise<void> => {
  try {
    await prisma.vendorAuditLog.create({
      data: {
        vendorId: entry.vendorId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        userId: req.user?.id || 'system',
        userEmail: req.user?.email,
        userRole: req.user?.role,
        ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
        userAgent: req.headers['user-agent'],
        oldValues: entry.oldValues as any,
        newValues: entry.newValues as any,
        metadata: entry.metadata as any,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
};

export const auditMiddleware = (
  action: string,
  entityType: string,
  getEntityId?: (req: UserRequest) => string | undefined,
  getVendorId?: (req: UserRequest) => string | undefined
) => {
  return async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Store original end method
    const originalEnd = res.end;
    const originalJson = res.json;

    let responseBody: unknown;

    // Override json to capture response
    res.json = function(body: unknown) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    // Override end to log after response
    res.end = function(chunk?: unknown, encoding?: unknown) {
      // Log the action after response is sent
      setImmediate(async () => {
        try {
          await createAuditLog(req, {
            vendorId: getVendorId ? getVendorId(req) : undefined,
            action: `${req.method} ${action}`,
            entityType,
            entityId: getEntityId ? getEntityId(req) : req.params.id,
            newValues: req.method !== 'GET' ? (req.body as Record<string, unknown>) : undefined,
            metadata: {
              statusCode: res.statusCode,
              path: req.path,
              query: req.query,
            },
          });
        } catch (error) {
          console.error('Audit middleware error:', error);
        }
      });

      return originalEnd.call(this, chunk, encoding as BufferEncoding);
    };

    next();
  };
};

// Helper to log specific actions programmatically
export class AuditLogger {
  static async log(
    userId: string,
    userEmail: string | undefined,
    userRole: string | undefined,
    entry: AuditLogEntry
  ): Promise<void> {
    try {
      await prisma.vendorAuditLog.create({
        data: {
          vendorId: entry.vendorId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          userId,
          userEmail,
          userRole,
          oldValues: entry.oldValues as any,
          newValues: entry.newValues as any,
          metadata: entry.metadata as any,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  static async logVendorAction(
    userId: string,
    userEmail: string | undefined,
    vendorId: string,
    action: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.log(userId, userEmail, undefined, {
      vendorId,
      action,
      entityType: 'Vendor',
      entityId: vendorId,
      metadata: details,
    });
  }

  static async logAssessmentAction(
    userId: string,
    userEmail: string | undefined,
    vendorId: string,
    assessmentId: string,
    action: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.log(userId, userEmail, undefined, {
      vendorId,
      action,
      entityType: 'Assessment',
      entityId: assessmentId,
      metadata: details,
    });
  }

  static async logContractAction(
    userId: string,
    userEmail: string | undefined,
    vendorId: string,
    contractId: string,
    action: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.log(userId, userEmail, undefined, {
      vendorId,
      action,
      entityType: 'Contract',
      entityId: contractId,
      metadata: details,
    });
  }

  static async logIncidentAction(
    userId: string,
    userEmail: string | undefined,
    vendorId: string,
    incidentId: string,
    action: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.log(userId, userEmail, undefined, {
      vendorId,
      action,
      entityType: 'Incident',
      entityId: incidentId,
      metadata: details,
    });
  }
}
