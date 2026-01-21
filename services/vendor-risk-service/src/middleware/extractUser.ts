import { Request, Response, NextFunction } from 'express';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export type UserRequest = Request;

export const extractUser = (
  req: UserRequest,
  _res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const userEmail = req.headers['x-user-email'] as string;

  if (userId && userRole && userEmail) {
    req.user = {
      id: userId,
      email: userEmail,
      role: userRole,
    };
  }

  next();
};

export const requireUser = (
  req: UserRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'User information not found',
    });
    return;
  }
  next();
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User information not found',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions for this action',
      });
      return;
    }

    next();
  };
};
