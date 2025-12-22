import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { JwtPayload } from '../dtos/auth.dto.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);

    // Verify token with appropriate algorithm
    const signOptions = config.jwt.algorithm === 'RS256'
      ? { algorithms: ['RS256' as const] }
      : { algorithms: ['HS256' as const] };

    const secret = config.jwt.algorithm === 'RS256'
      ? config.jwt.publicKey!
      : config.jwt.secret;

    const payload = jwt.verify(token, secret, signOptions) as JwtPayload;

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to check user roles
 */
export const authorize = (...allowedRoles: Array<'patient' | 'provider' | 'admin'>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      const signOptions = config.jwt.algorithm === 'RS256'
        ? { algorithms: ['RS256' as const] }
        : { algorithms: ['HS256' as const] };

      const secret = config.jwt.algorithm === 'RS256'
        ? config.jwt.publicKey!
        : config.jwt.secret;

      const payload = jwt.verify(token, secret, signOptions) as JwtPayload;
      req.user = payload;
    }

    next();
  } catch {
    // Continue without user if token is invalid
    next();
  }
};
