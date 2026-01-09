import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler';
import logger from '../utils/logger';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_ISSUER = process.env.JWT_ISSUER || 'global-healthcare-platform';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'imaging-service';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
  organizationId?: string;
  facilityIds?: string[];
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

/**
 * Validates JWT token structure and signature
 * Logs audit trail for PHI access
 */
export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Authentication attempt without valid authorization header', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      throw new AppError('Authentication required', 401);
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ['HS256', 'RS256'],
    }) as UserPayload;

    // Validate required fields in the decoded token
    if (!decoded.id || !decoded.email || !decoded.role) {
      logger.warn('JWT token missing required fields', {
        ip: req.ip,
        path: req.path,
        hasId: !!decoded.id,
        hasEmail: !!decoded.email,
        hasRole: !!decoded.role,
      });
      throw new AppError('Invalid token payload', 401);
    }

    // Set user on request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || [],
      organizationId: decoded.organizationId,
      facilityIds: decoded.facilityIds || [],
    };

    // Audit log for PHI access - log every authenticated request to imaging data
    logger.info('Authenticated access to imaging service', {
      userId: decoded.id,
      userEmail: decoded.email,
      userRole: decoded.role,
      ip: req.ip,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
      auditType: 'PHI_ACCESS',
    });

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('JWT token expired', { ip: req.ip, path: req.path });
      return next(new AppError('Token expired', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token', { ip: req.ip, path: req.path, error: (error as Error).message });
      return next(new AppError('Invalid token', 401));
    }
    if (error instanceof jwt.NotBeforeError) {
      logger.warn('JWT token not yet valid', { ip: req.ip, path: req.path });
      return next(new AppError('Token not yet valid', 401));
    }
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has one of the required roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Authorization attempt without authenticated user', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed - insufficient role', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        ip: req.ip,
        path: req.path,
        method: req.method,
        auditType: 'AUTHORIZATION_FAILURE',
      });
      return next(new AppError('Insufficient permissions', 403));
    }

    logger.info('Authorization successful', {
      userId: req.user.id,
      userRole: req.user.role,
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    next();
  };
};

/**
 * Permission-based authorization middleware
 * Checks if user has the required permission
 */
export const requirePermission = (permission: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Permission check without authenticated user', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      return next(new AppError('Authentication required', 401));
    }

    const userPermissions = req.user.permissions || [];

    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      logger.warn('Permission check failed', {
        userId: req.user.id,
        requiredPermission: permission,
        userPermissions: userPermissions,
        ip: req.ip,
        path: req.path,
        method: req.method,
        auditType: 'PERMISSION_DENIED',
      });
      return next(new AppError(`Permission denied: ${permission} required`, 403));
    }

    logger.info('Permission check passed', {
      userId: req.user.id,
      permission: permission,
      ip: req.ip,
      path: req.path,
    });

    next();
  };
};

/**
 * Facility access check middleware
 * Ensures user can only access data from their assigned facilities
 */
export const checkFacilityAccess = (getFacilityId: (req: AuthRequest) => string | undefined) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const facilityId = getFacilityId(req);

    // If no facility ID is being accessed, allow through
    if (!facilityId) {
      return next();
    }

    // Admin users can access all facilities
    if (req.user.role === 'admin' || req.user.role === 'system_admin') {
      return next();
    }

    const userFacilities = req.user.facilityIds || [];

    if (!userFacilities.includes(facilityId)) {
      logger.warn('Facility access denied', {
        userId: req.user.id,
        attemptedFacilityId: facilityId,
        userFacilities: userFacilities,
        ip: req.ip,
        path: req.path,
        method: req.method,
        auditType: 'FACILITY_ACCESS_DENIED',
      });
      return next(new AppError('Access denied: You do not have access to this facility', 403));
    }

    next();
  };
};
