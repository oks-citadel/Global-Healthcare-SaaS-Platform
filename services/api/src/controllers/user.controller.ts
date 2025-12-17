import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { UpdateUserSchema } from '../dtos/user.dto.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';

export const userController = {
  /**
   * GET /users/:id
   * Get user by ID
   */
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Users can only access their own profile unless admin
      if (req.user?.role !== 'admin' && req.user?.userId !== id) {
        throw new ForbiddenError('Cannot access other user profiles');
      }

      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /users/:id
   * Update user profile
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Users can only update their own profile unless admin
      if (req.user?.role !== 'admin' && req.user?.userId !== id) {
        throw new ForbiddenError('Cannot update other user profiles');
      }

      const input = UpdateUserSchema.parse(req.body);
      const user = await userService.updateUser(id, input);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};
