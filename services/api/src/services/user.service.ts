import { UpdateUserInput, UserResponse } from '../dtos/user.dto.js';
import { NotFoundError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';

export const userService = {
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  /**
   * Update user
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update fields
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName: input.firstName || user.firstName,
        lastName: input.lastName || user.lastName,
        phone: input.phone !== undefined ? input.phone : user.phone,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status,
      emailVerified: updatedUser.emailVerified,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };
  },
};
