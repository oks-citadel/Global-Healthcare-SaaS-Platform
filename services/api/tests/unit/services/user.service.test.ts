import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from '../../../src/services/user.service.js';
import { NotFoundError } from '../../../src/utils/errors.js';
import { prisma } from '../../../src/lib/prisma.js';

// Mock Prisma client
vi.mock('../../../src/lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should retrieve a user by ID successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        role: 'patient',
        status: 'active',
        emailVerified: true,
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await userService.getUserById('user-123');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        phone: mockUser.phone,
        role: mockUser.role,
        status: mockUser.status,
        emailVerified: mockUser.emailVerified,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
      });
    });

    it('should not include password in response', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed_password',
        firstName: 'John',
        lastName: 'Doe',
        phone: null,
        role: 'patient',
        status: 'active',
        emailVerified: false,
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await userService.getUserById('user-123');

      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundError when user does not exist', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        userService.getUserById('non-existent-id')
      ).rejects.toThrow(NotFoundError);

      await expect(
        userService.getUserById('non-existent-id')
      ).rejects.toThrow('User not found');
    });

    it('should handle users with null phone numbers', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: null,
        role: 'provider',
        status: 'active',
        emailVerified: true,
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await userService.getUserById('user-123');

      expect(result.phone).toBeNull();
    });

    it('should handle users with different roles', async () => {
      const roles = ['patient', 'provider', 'admin', 'super_admin'];

      for (const role of roles) {
        const mockUser = {
          id: `user-${role}`,
          email: `${role}@example.com`,
          firstName: 'Test',
          lastName: 'User',
          phone: null,
          role,
          status: 'active',
          emailVerified: true,
          createdAt: new Date('2025-01-01T10:00:00Z'),
          updatedAt: new Date('2025-01-15T10:00:00Z'),
        };

        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

        const result = await userService.getUserById(`user-${role}`);

        expect(result.role).toBe(role);
      }
    });

    it('should handle database errors', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(
        userService.getUserById('user-123')
      ).rejects.toThrow('Database connection error');
    });
  });

  describe('updateUser', () => {
    const existingUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'patient',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2025-01-01T10:00:00Z'),
      updatedAt: new Date('2025-01-15T10:00:00Z'),
    };

    it('should update user successfully', async () => {
      const updatedUser = {
        ...existingUser,
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
      };

      const result = await userService.updateUser('user-123', input);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+0987654321',
        },
      });

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
      expect(result.phone).toBe('+0987654321');
    });

    it('should update only firstName', async () => {
      const updatedUser = {
        ...existingUser,
        firstName: 'Jane',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        firstName: 'Jane',
      };

      const result = await userService.updateUser('user-123', input);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          firstName: 'Jane',
          lastName: existingUser.lastName,
          phone: existingUser.phone,
        },
      });

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe(existingUser.lastName);
    });

    it('should update only lastName', async () => {
      const updatedUser = {
        ...existingUser,
        lastName: 'Smith',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        lastName: 'Smith',
      };

      const result = await userService.updateUser('user-123', input);

      expect(result.lastName).toBe('Smith');
      expect(result.firstName).toBe(existingUser.firstName);
    });

    it('should update only phone', async () => {
      const updatedUser = {
        ...existingUser,
        phone: '+0987654321',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        phone: '+0987654321',
      };

      const result = await userService.updateUser('user-123', input);

      expect(result.phone).toBe('+0987654321');
    });

    it('should allow clearing phone by setting to null', async () => {
      const updatedUser = {
        ...existingUser,
        phone: null,
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        phone: null,
      };

      const result = await userService.updateUser('user-123', input);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          phone: null,
        },
      });

      expect(result.phone).toBeNull();
    });

    it('should preserve existing values when not provided in update', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(existingUser as any);

      const input = {};

      await userService.updateUser('user-123', input);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          phone: existingUser.phone,
        },
      });
    });

    it('should throw NotFoundError when user does not exist', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const input = {
        firstName: 'Jane',
      };

      await expect(
        userService.updateUser('non-existent-id', input)
      ).rejects.toThrow(NotFoundError);

      await expect(
        userService.updateUser('non-existent-id', input)
      ).rejects.toThrow('User not found');

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should not update email (email should not be updatable)', async () => {
      const updatedUser = {
        ...existingUser,
        firstName: 'Jane',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        firstName: 'Jane',
        // Attempting to update email (should be ignored)
        email: 'newemail@example.com' as any,
      };

      await userService.updateUser('user-123', input);

      // Verify that email is not in the update data
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          firstName: 'Jane',
          lastName: existingUser.lastName,
          phone: existingUser.phone,
        },
      });
    });

    it('should not update role', async () => {
      const updatedUser = {
        ...existingUser,
        firstName: 'Jane',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        firstName: 'Jane',
        // Attempting to update role (should be ignored)
        role: 'admin' as any,
      };

      await userService.updateUser('user-123', input);

      // Verify that role is not in the update data
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          firstName: 'Jane',
          lastName: existingUser.lastName,
          phone: existingUser.phone,
        },
      });
    });

    it('should handle database errors during update', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockRejectedValue(
        new Error('Database update failed')
      );

      const input = {
        firstName: 'Jane',
      };

      await expect(
        userService.updateUser('user-123', input)
      ).rejects.toThrow('Database update failed');
    });

    it('should handle updating user with special characters in name', async () => {
      const updatedUser = {
        ...existingUser,
        firstName: "O'Brien",
        lastName: 'Smith-Jones',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        firstName: "O'Brien",
        lastName: 'Smith-Jones',
      };

      const result = await userService.updateUser('user-123', input);

      expect(result.firstName).toBe("O'Brien");
      expect(result.lastName).toBe('Smith-Jones');
    });

    it('should handle international phone numbers', async () => {
      const updatedUser = {
        ...existingUser,
        phone: '+44 20 7946 0958',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        phone: '+44 20 7946 0958',
      };

      const result = await userService.updateUser('user-123', input);

      expect(result.phone).toBe('+44 20 7946 0958');
    });

    it('should not include password in updated user response', async () => {
      const updatedUser = {
        ...existingUser,
        password: 'hashed_password',
        firstName: 'Jane',
        updatedAt: new Date('2025-01-16T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        firstName: 'Jane',
      };

      const result = await userService.updateUser('user-123', input);

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('edge cases', () => {
    it('should handle concurrent updates gracefully', async () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: null,
        role: 'patient',
        status: 'active',
        emailVerified: true,
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...user,
        firstName: 'Updated',
      } as any);

      const input1 = { firstName: 'Update1' };
      const input2 = { firstName: 'Update2' };

      await Promise.all([
        userService.updateUser('user-123', input1),
        userService.updateUser('user-123', input2),
      ]);

      expect(prisma.user.update).toHaveBeenCalledTimes(2);
    });

    it('should handle empty string values', async () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: null,
        role: 'patient',
        status: 'active',
        emailVerified: true,
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      const updatedUser = {
        ...user,
        phone: '',
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        phone: '',
      };

      const result = await userService.updateUser('user-123', input);

      expect(result.phone).toBe('');
    });

    it('should handle very long names', async () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: null,
        role: 'patient',
        status: 'active',
        emailVerified: true,
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      const longName = 'A'.repeat(255);
      const updatedUser = {
        ...user,
        firstName: longName,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const input = {
        firstName: longName,
      };

      const result = await userService.updateUser('user-123', input);

      expect(result.firstName).toBe(longName);
      expect(result.firstName.length).toBe(255);
    });
  });
});
