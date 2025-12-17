import { describe, it, expect, beforeEach, vi } from 'vitest';
import { subscriptionService } from '../../../src/services/subscription.service.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../../src/utils/errors.js';
import { prisma } from '../../../src/lib/prisma.js';

// Mock Prisma client
vi.mock('../../../src/lib/prisma.js', () => ({
  prisma: {
    subscription: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('SubscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSubscription', () => {
    it('should create a subscription successfully', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.subscription.create).mockResolvedValue(mockSubscription);

      const input = {
        planId: 'plan-123',
        paymentMethodId: 'pm_123456',
      };

      const result = await subscriptionService.createSubscription('user-123', input);

      expect(prisma.subscription.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          status: 'active',
        },
      });

      expect(prisma.subscription.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          planId: 'plan-123',
          status: 'active',
          currentPeriodStart: expect.any(Date),
          currentPeriodEnd: expect.any(Date),
          cancelAtPeriodEnd: false,
        },
      });

      expect(result).toEqual({
        id: mockSubscription.id,
        userId: mockSubscription.userId,
        planId: mockSubscription.planId,
        status: mockSubscription.status,
        currentPeriodStart: mockSubscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: mockSubscription.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: mockSubscription.cancelAtPeriodEnd,
        createdAt: mockSubscription.createdAt.toISOString(),
        updatedAt: mockSubscription.updatedAt.toISOString(),
      });
    });

    it('should create subscription with coupon code', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.subscription.create).mockResolvedValue(mockSubscription);

      const input = {
        planId: 'plan-123',
        paymentMethodId: 'pm_123456',
        couponCode: 'DISCOUNT20',
      };

      const result = await subscriptionService.createSubscription('user-123', input);

      expect(result).toBeDefined();
      expect(result.status).toBe('active');
    });

    it('should throw BadRequestError when user already has active subscription', async () => {
      const existingSubscription = {
        id: 'sub-existing',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-01T00:00:00Z'),
        currentPeriodEnd: new Date('2025-01-31T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-01T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(existingSubscription);

      const input = {
        planId: 'plan-456',
        paymentMethodId: 'pm_123456',
      };

      await expect(
        subscriptionService.createSubscription('user-123', input)
      ).rejects.toThrow(BadRequestError);

      await expect(
        subscriptionService.createSubscription('user-123', input)
      ).rejects.toThrow('User already has an active subscription');

      expect(prisma.subscription.create).not.toHaveBeenCalled();
    });

    it('should calculate correct period end date (30 days)', async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.subscription.create).mockImplementation(async (args) => {
        const data = args.data as any;
        const periodDiff = data.currentPeriodEnd.getTime() - data.currentPeriodStart.getTime();
        const daysDiff = periodDiff / (1000 * 60 * 60 * 24);

        expect(daysDiff).toBeCloseTo(30, 0);

        return {
          id: 'sub-123',
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;
      });

      const input = {
        planId: 'plan-123',
        paymentMethodId: 'pm_123456',
      };

      await subscriptionService.createSubscription('user-123', input);
    });

    it('should handle database errors during creation', async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.subscription.create).mockRejectedValue(
        new Error('Database connection error')
      );

      const input = {
        planId: 'plan-123',
        paymentMethodId: 'pm_123456',
      };

      await expect(
        subscriptionService.createSubscription('user-123', input)
      ).rejects.toThrow('Database connection error');
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel a subscription successfully', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(mockSubscription);
      vi.mocked(prisma.subscription.update).mockResolvedValue({
        ...mockSubscription,
        cancelAtPeriodEnd: true,
      });

      await subscriptionService.cancelSubscription('sub-123', 'user-123');

      expect(prisma.subscription.findUnique).toHaveBeenCalledWith({
        where: { id: 'sub-123' },
      });

      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: { id: 'sub-123' },
        data: { cancelAtPeriodEnd: true },
      });
    });

    it('should throw NotFoundError when subscription does not exist', async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      await expect(
        subscriptionService.cancelSubscription('non-existent-id', 'user-123')
      ).rejects.toThrow(NotFoundError);

      await expect(
        subscriptionService.cancelSubscription('non-existent-id', 'user-123')
      ).rejects.toThrow('Subscription not found');

      expect(prisma.subscription.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError when user tries to cancel another user\'s subscription', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(mockSubscription);

      await expect(
        subscriptionService.cancelSubscription('sub-123', 'different-user-456')
      ).rejects.toThrow(ForbiddenError);

      await expect(
        subscriptionService.cancelSubscription('sub-123', 'different-user-456')
      ).rejects.toThrow('Cannot cancel another user\'s subscription');

      expect(prisma.subscription.update).not.toHaveBeenCalled();
    });

    it('should handle database errors during cancellation', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(mockSubscription);
      vi.mocked(prisma.subscription.update).mockRejectedValue(
        new Error('Database update failed')
      );

      await expect(
        subscriptionService.cancelSubscription('sub-123', 'user-123')
      ).rejects.toThrow('Database update failed');
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook for invoice.paid event', async () => {
      const payload = {
        type: 'invoice.paid',
        data: {
          object: {
            id: 'inv-123',
            customer: 'cus-123',
            amount_paid: 2999,
          },
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook for invoice.payment_failed event', async () => {
      const payload = {
        type: 'invoice.payment_failed',
        data: {
          object: {
            id: 'inv-123',
            customer: 'cus-123',
            attempt_count: 1,
          },
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook for customer.subscription.deleted event', async () => {
      const payload = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub-123',
            customer: 'cus-123',
            status: 'canceled',
          },
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle unrecognized webhook event types', async () => {
      const payload = {
        type: 'unknown.event.type',
        data: {
          object: {},
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook with null payload data', async () => {
      const payload = {
        type: 'invoice.paid',
        data: {
          object: null,
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook for customer.subscription.updated event', async () => {
      const payload = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub-123',
            customer: 'cus-123',
            status: 'active',
            current_period_end: 1234567890,
          },
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook for customer.subscription.trial_will_end event', async () => {
      const payload = {
        type: 'customer.subscription.trial_will_end',
        data: {
          object: {
            id: 'sub-123',
            customer: 'cus-123',
            trial_end: 1234567890,
          },
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook with empty signature', async () => {
      const payload = {
        type: 'invoice.paid',
        data: {
          object: {},
        },
      };

      await expect(
        subscriptionService.handleWebhook(payload, '')
      ).resolves.not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle subscription with undefined optional fields', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.subscription.create).mockResolvedValue(mockSubscription);

      const input = {
        planId: 'plan-123',
        paymentMethodId: 'pm_123456',
        couponCode: undefined,
      };

      const result = await subscriptionService.createSubscription('user-123', input);

      expect(result).toBeDefined();
    });

    it('should handle finding subscription with complex status query', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'active',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(mockSubscription);

      const input = {
        planId: 'plan-456',
        paymentMethodId: 'pm_123456',
      };

      await expect(
        subscriptionService.createSubscription('user-123', input)
      ).rejects.toThrow(BadRequestError);

      expect(prisma.subscription.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          status: 'active',
        },
      });
    });

    it('should handle cancellation when subscription has already been cancelled', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        planId: 'plan-123',
        status: 'cancelled',
        currentPeriodStart: new Date('2025-01-15T00:00:00Z'),
        currentPeriodEnd: new Date('2025-02-14T23:59:59Z'),
        cancelAtPeriodEnd: true,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(mockSubscription);
      vi.mocked(prisma.subscription.update).mockResolvedValue(mockSubscription);

      await subscriptionService.cancelSubscription('sub-123', 'user-123');

      expect(prisma.subscription.update).toHaveBeenCalled();
    });
  });
});
