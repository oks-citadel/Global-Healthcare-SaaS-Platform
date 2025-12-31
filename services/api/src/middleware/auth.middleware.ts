import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';

/**
 * Payment Required Error for subscription-gated features
 */
class PaymentRequiredError extends Error {
  statusCode = 402;
  code = 'ERR_PAYMENT_REQUIRED';

  constructor(message: string = 'Active subscription required') {
    super(message);
    this.name = 'PaymentRequiredError';
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'patient' | 'provider' | 'admin';
  iat?: number;
  exp?: number;
}

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
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

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
      const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = payload;
    }

    next();
  } catch {
    // Continue without user if token is invalid
    next();
  }
};

/**
 * Middleware to require active subscription
 * Returns 402 Payment Required if user has no active subscription
 */
export const requireSubscription = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Check for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.userId,
        status: 'active',
      },
    });

    if (!subscription) {
      return next(
        new PaymentRequiredError(
          'Active subscription required for this feature'
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to require email verification
 * Returns 403 Forbidden if user email is not verified
 */
export const requireEmailVerified = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Check if email is verified
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { emailVerified: true },
    });

    if (!user) {
      return next(new UnauthorizedError('User not found'));
    }

    if (!user.emailVerified) {
      return next(
        new ForbiddenError(
          'Email verification required. Please verify your email to continue.'
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to require premium tier subscription
 * Returns 402 Payment Required if user doesn't have premium tier
 */
export const requirePremiumTier = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Check for active subscription with premium tier
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.userId,
        status: 'active',
      },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return next(
        new PaymentRequiredError(
          'Premium subscription required for this feature'
        )
      );
    }

    // Check if subscription tier is premium or higher
    const tier =
      (subscription as any).tier || (subscription.plan as any)?.tier || 'free';
    if (tier === 'free') {
      return next(
        new PaymentRequiredError(
          'Premium tier subscription required for this feature'
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
