import { User, Role, UserStatus, Prisma } from '../generated/client';
import { BaseRepository } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export class UserRepository extends BaseRepository<User, typeof prisma.user> {
  constructor() {
    super(prisma.user, 'User');
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string, include?: Prisma.UserInclude): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
      include,
    });
  }

  /**
   * Find users by role
   */
  async findByRole(role: Role, include?: Prisma.UserInclude): Promise<User[]> {
    return this.model.findMany({
      where: { role },
      include,
    });
  }

  /**
   * Find users by status
   */
  async findByStatus(status: UserStatus, include?: Prisma.UserInclude): Promise<User[]> {
    return this.model.findMany({
      where: { status },
      include,
    });
  }

  /**
   * Find active users
   */
  async findActiveUsers(include?: Prisma.UserInclude): Promise<User[]> {
    return this.model.findMany({
      where: { status: 'active' },
      include,
    });
  }

  /**
   * Update user email verification status
   */
  async updateEmailVerification(id: string, verified: boolean): Promise<User> {
    return this.model.update({
      where: { id },
      data: { emailVerified: verified },
    });
  }

  /**
   * Update user status
   */
  async updateStatus(id: string, status: UserStatus): Promise<User> {
    return this.model.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * Search users by name or email
   */
  async searchUsers(
    query: string,
    options?: {
      role?: Role;
      status?: UserStatus;
      limit?: number;
    }
  ): Promise<User[]> {
    const where: Prisma.UserWhereInput = {
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (options?.role) {
      where.role = options.role;
    }

    if (options?.status) {
      where.status = options.status;
    }

    return this.model.findMany({
      where,
      take: options?.limit || 50,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  /**
   * Find users with their related data
   */
  async findWithRelations(id: string): Promise<User | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        patient: true,
        provider: true,
        refreshTokens: true,
      },
    });
  }

  /**
   * Count users by role
   */
  async countByRole(role: Role): Promise<number> {
    return this.model.count({
      where: { role },
    });
  }

  /**
   * Count users by status
   */
  async countByStatus(status: UserStatus): Promise<number> {
    return this.model.count({
      where: { status },
    });
  }

  /**
   * Find recently created users
   */
  async findRecentUsers(limit: number = 10): Promise<User[]> {
    return this.model.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    const where: Prisma.UserWhereInput = { email };

    if (excludeUserId) {
      where.id = { not: excludeUserId };
    }

    const count = await this.model.count({ where });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
