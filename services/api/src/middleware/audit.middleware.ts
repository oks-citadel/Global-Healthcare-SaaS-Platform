import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service.js';
import { filterPHI } from '../lib/phi-filter.js';
import { logger } from '../utils/logger.js';

/**
 * HIPAA Audit Middleware
 * Automatically logs all PHI access and modifications
 * Compliant with HIPAA Audit Control requirements (45 CFR § 164.312(b))
 */

// PHI-related resources that require audit logging
const PHI_RESOURCES = [
  'patient',
  'encounter',
  'appointment',
  'document',
  'visit',
  'medical-record',
  'prescription',
  'lab-result',
  'diagnosis',
  'treatment-plan',
];

// Actions that require audit logging
const AUDITABLE_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'view',
  'access',
  'download',
  'share',
  'export',
];

/**
 * Determines if the request involves PHI
 */
function isPHIRequest(req: Request): boolean {
  const path = req.path.toLowerCase();

  // Check if path contains PHI-related resources
  return PHI_RESOURCES.some(resource =>
    path.includes(`/${resource}`) || path.includes(`/${resource}s`)
  );
}

/**
 * Extract resource information from request
 */
function extractResourceInfo(req: Request): { resource: string; resourceId?: string; action: string } {
  const path = req.path;
  const method = req.method;

  // Parse resource from path (e.g., /api/v1/patients/123 -> patients)
  const pathParts = path.split('/').filter(Boolean);
  const resourceIndex = pathParts.findIndex(part =>
    PHI_RESOURCES.some(r => part.toLowerCase() === r || part.toLowerCase() === `${r}s`)
  );

  const resource = resourceIndex >= 0 ? pathParts[resourceIndex] : 'unknown';
  const resourceId = resourceIndex >= 0 && pathParts[resourceIndex + 1]
    ? pathParts[resourceIndex + 1]
    : undefined;

  // Map HTTP method to action
  let action: string;
  switch (method) {
    case 'GET':
      action = resourceId ? 'read' : 'list';
      break;
    case 'POST':
      action = 'create';
      break;
    case 'PUT':
    case 'PATCH':
      action = 'update';
      break;
    case 'DELETE':
      action = 'delete';
      break;
    default:
      action = method.toLowerCase();
  }

  // Check for special actions in path
  if (path.includes('/download')) action = 'download';
  if (path.includes('/share')) action = 'share';
  if (path.includes('/export')) action = 'export';

  return { resource, resourceId, action };
}

/**
 * Get client IP address from request
 */
function getClientIp(req: Request): string {
  // Check for proxy headers first
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return ips[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return typeof realIp === 'string' ? realIp : realIp[0];
  }

  return req.socket.remoteAddress || 'unknown';
}

/**
 * Middleware to audit PHI access
 * Logs user, action, resource, timestamp, IP address
 */
export const auditPHIAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only audit PHI-related requests
  if (!isPHIRequest(req)) {
    return next();
  }

  // Skip if user is not authenticated (will be caught by auth middleware)
  if (!req.user) {
    return next();
  }

  const { resource, resourceId, action } = extractResourceInfo(req);
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Capture response status for audit
  const originalSend = res.send;
  const originalJson = res.json;

  let responseLogged = false;

  const logAudit = async (statusCode: number) => {
    if (responseLogged) return;
    responseLogged = true;

    try {
      // Only log successful requests (2xx) or denied access (403, 404)
      if (statusCode >= 200 && statusCode < 300 || statusCode === 403 || statusCode === 404) {
        const details: Record<string, any> = {
          method: req.method,
          path: req.path,
          statusCode,
          query: filterPHI(req.query),
        };

        // Add request body for create/update actions (filtered for PHI)
        if (['create', 'update'].includes(action) && req.body) {
          details.body = filterPHI(req.body);
        }

        await auditService.logEvent({
          userId: req.user.userId,
          action: `${action}_${resource}`,
          resource,
          resourceId,
          details,
          ipAddress,
          userAgent,
        });
      }
    } catch (error) {
      // Log error but don't block response
      logger.error('Audit logging failed:', { error });
    }
  };

  // Override response methods to capture status code
  res.send = function(data: any) {
    logAudit(res.statusCode);
    return originalSend.call(this, data);
  };

  res.json = function(data: any) {
    logAudit(res.statusCode);
    return originalJson.call(this, data);
  };

  // Handle response finish event as fallback
  res.on('finish', () => {
    logAudit(res.statusCode);
  });

  next();
};

/**
 * Middleware to audit sensitive operations
 * Use for operations that require explicit audit logging regardless of resource
 */
export const auditSensitiveOperation = (operationType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next();
    }

    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    try {
      await auditService.logEvent({
        userId: req.user.userId,
        action: operationType,
        resource: 'system',
        details: {
          method: req.method,
          path: req.path,
          timestamp: new Date().toISOString(),
        },
        ipAddress,
        userAgent,
      });
    } catch (error) {
      logger.error('Audit logging failed:', { error });
    }

    next();
  };
};

/**
 * Middleware to audit authentication events
 */
export const auditAuthEvent = (eventType: 'login' | 'logout' | 'password_change' | 'password_reset' | 'failed_login') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    // For login events, capture userId from response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Log after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.userId || data.userId || req.body?.email || 'unknown';

        auditService.logEvent({
          userId: String(userId),
          action: eventType,
          resource: 'authentication',
          details: {
            email: req.body?.email,
            timestamp: new Date().toISOString(),
          },
          ipAddress,
          userAgent,
        }).catch(error => {
          logger.error('Auth audit logging failed:', { error });
        });
      } else if (eventType === 'failed_login') {
        // Always log failed logins
        auditService.logEvent({
          userId: req.body?.email || 'unknown',
          action: 'failed_login',
          resource: 'authentication',
          details: {
            email: req.body?.email,
            reason: data.message || 'Authentication failed',
            timestamp: new Date().toISOString(),
          },
          ipAddress,
          userAgent,
        }).catch(error => {
          logger.error('Failed login audit logging failed:', { error });
        });
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Middleware to audit data exports
 */
export const auditDataExport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next();
  }

  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    await auditService.logEvent({
      userId: req.user.userId,
      action: 'export_data',
      resource: 'data_export',
      details: {
        format: req.query.format || req.body?.format || 'unknown',
        dateRange: {
          from: req.query.from || req.body?.from,
          to: req.query.to || req.body?.to,
        },
        filters: filterPHI(req.query.filters || req.body?.filters || {}),
        timestamp: new Date().toISOString(),
      },
      ipAddress,
      userAgent,
    });
  } catch (error) {
    logger.error('Export audit logging failed:', { error });
  }

  next();
};
