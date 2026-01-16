import { Request, Response, NextFunction } from 'express';

export interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
  };
}

export const extractUser = (
  req: UserRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const userEmail = req.headers['x-user-email'] as string;
  const organizationId = req.headers['x-organization-id'] as string;

  if (userId && userRole && userEmail) {
    req.user = {
      id: userId,
      email: userEmail,
      role: userRole,
      organizationId,
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

export const requireAdmin = (
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
  if (req.user.role !== 'admin' && req.user.role !== 'billing_admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
    return;
  }
  next();
};

export const requireOrganization = (
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
  if (!req.user.organizationId) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Organization context required',
    });
    return;
  }
  next();
};
