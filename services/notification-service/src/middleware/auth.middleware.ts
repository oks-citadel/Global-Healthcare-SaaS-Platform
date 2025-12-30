import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "patient" | "provider" | "admin";
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
 * Custom authentication errors
 */
export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Get JWT secret from environment
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error("JWT_SECRET environment variable is not set");
    throw new Error("JWT_SECRET is required");
  }
  return secret;
};

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to check user roles
 */
export const authorize = (
  ...allowedRoles: Array<"patient" | "provider" | "admin">
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };
};

/**
 * Middleware to verify user ownership of a resource
 * Checks if the userId in params matches the authenticated user
 * Admins can bypass this check
 */
export const requireOwnership = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new UnauthorizedError("Not authenticated"));
  }

  const { userId } = req.params;

  // Admins can access any user's resources
  if (req.user.role === "admin") {
    return next();
  }

  // Non-admins can only access their own resources
  if (userId && userId !== req.user.userId) {
    return next(new ForbiddenError("You can only access your own resources"));
  }

  next();
};

/**
 * Middleware to require admin role
 */
export const requireAdmin = authorize("admin");

/**
 * Middleware to require admin or provider role
 */
export const requireAdminOrProvider = authorize("admin", "provider");

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
      req.user = payload;
    }

    next();
  } catch {
    // Continue without user if token is invalid
    next();
  }
};
