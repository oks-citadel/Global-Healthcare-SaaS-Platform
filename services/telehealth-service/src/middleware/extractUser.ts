import { Request, Response, NextFunction } from 'express';

export interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Extract user from headers set by API Gateway
export const extractUser = (
  req: UserRequest,
  res: Response,
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
