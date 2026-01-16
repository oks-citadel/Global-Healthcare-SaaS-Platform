import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../../src/utils/errors.js';

// Mock Prisma client - define mocks inside factory to avoid hoisting issues
vi.mock('../../../src/lib/prisma.js', () => {
  return {
    prisma: {
      subscription: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
        upsert: vi.fn(),
      },
      webhookEventLog: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
        update: vi.fn(),
      },
      auditEvent: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
    },
  };
});

// Mock Stripe library
vi.mock('../../../src/lib/stripe.js', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
  constructWebhookEvent: vi.fn(),
}));

// Mock audit service
vi.mock('../../../src/services/audit.service.js', () => ({
  auditService: {
    logEvent: vi.fn(),
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

// Import after mocks are set up
import { subscriptionService } from '../../../src/services/subscription.service.js';
import { constructWebhookEvent } from '../../../src/lib/stripe.js';
import { prisma } from '../../../src/lib/prisma.js';

// Create references to mocks for use in tests
const mockPrismaSubscription = prisma.subscription as any;
const mockWebhookEventLog = prisma.webhookEventLog as any;

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

      mockPrismaSubscription.findFirst.mockResolvedValue(null);
      mockPrismaSubscription.create.mockResolvedValue(mockSubscription);

      const input = {
        planId: 'plan-123',
        paymentMethodId: 'pm_123456',
      };

      const result = await subscriptionService.createSubscription('user-123', input);

      expect(mockPrismaSubscription.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          status: 'active',
        },
      });

      expect(mockPrismaSubscription.create).toHaveBeenCalledWith({
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

      mockPrismaSubscription.findFirst.mockResolvedValue(null);
      mockPrismaSubscription.create.mockResolvedValue(mockSubscription);

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

      mockPrismaSubscription.findFirst.mockResolvedValue(existingSubscription);

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

      expect(mockPrismaSubscription.create).not.toHaveBeenCalled();
    });

    it('should calculate correct period end date (30 days)', async () => {
      mockPrismaSubscription.findFirst.mockResolvedValue(null);
      mockPrismaSubscription.create.mockImplementation(async (args) => {
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
      mockPrismaSubscription.findFirst.mockResolvedValue(null);
      mockPrismaSubscription.create.mockRejectedValue(
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

      mockPrismaSubscription.findUnique.mockResolvedValue(mockSubscription);
      mockPrismaSubscription.update.mockResolvedValue({
        ...mockSubscription,
        cancelAtPeriodEnd: true,
      });

      await subscriptionService.cancelSubscription('sub-123', 'user-123');

      expect(mockPrismaSubscription.findUnique).toHaveBeenCalledWith({
        where: { id: 'sub-123' },
      });

      expect(mockPrismaSubscription.update).toHaveBeenCalledWith({
        where: { id: 'sub-123' },
        data: { cancelAtPeriodEnd: true },
      });
    });

    it('should throw NotFoundError when subscription does not exist', async () => {
      mockPrismaSubscription.findUnique.mockResolvedValue(null);

      await expect(
        subscriptionService.cancelSubscription('non-existent-id', 'user-123')
      ).rejects.toThrow(NotFoundError);

      await expect(
        subscriptionService.cancelSubscription('non-existent-id', 'user-123')
      ).rejects.toThrow('Subscription not found');

      expect(mockPrismaSubscription.update).not.toHaveBeenCalled();
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

      mockPrismaSubscription.findUnique.mockResolvedValue(mockSubscription);

      await expect(
        subscriptionService.cancelSubscription('sub-123', 'different-user-456')
      ).rejects.toThrow(ForbiddenError);

      await expect(
        subscriptionService.cancelSubscription('sub-123', 'different-user-456')
      ).rejects.toThrow('Cannot cancel another user\'s subscription');

      expect(mockPrismaSubscription.update).not.toHaveBeenCalled();
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

      mockPrismaSubscription.findUnique.mockResolvedValue(mockSubscription);
      mockPrismaSubscription.update.mockRejectedValue(
        new Error('Database update failed')
      );

      await expect(
        subscriptionService.cancelSubscription('sub-123', 'user-123')
      ).rejects.toThrow('Database update failed');
    });
  });

  describe('handleWebhook', () => {
    beforeEach(() => {
      // Set up STRIPE_WEBHOOK_SECRET for webhook tests
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';

      // Set up webhookEventLog mocks
      mockWebhookEventLog.findUnique.mockResolvedValue(null);
      mockWebhookEventLog.upsert.mockResolvedValue({
        id: 'event-log-123',
        eventId: 'evt_123',
        eventType: 'test',
        status: 'processing',
      });
      mockWebhookEventLog.update.mockResolvedValue({});
    });

    afterEach(() => {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    });

    it('should handle webhook for invoice.paid event', async () => {
      const mockEvent = {
        id: 'evt_123',
        type: 'invoice.paid',
        data: {
          object: {
            id: 'inv-123',
            customer: 'cus-123',
            amount_paid: 2999,
          },
        },
      };

      vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);

      await expect(
        subscriptionService.handleWebhook('{}', 'signature-123')
      ).resolves.not.toThrow();

      expect(constructWebhookEvent).toHaveBeenCalledWith('{}', 'signature-123', 'whsec_test_secret');
    });

    it('should handle webhook for invoice.payment_failed event', async () => {
      const mockEvent = {
        id: 'evt_124',
        type: 'invoice.payment_failed',
        data: {
          object: {
            id: 'inv-123',
            customer: 'cus-123',
            attempt_count: 1,
          },
        },
      };

      vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);

      await expect(
        subscriptionService.handleWebhook('{}', 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook for customer.subscription.deleted event', async () => {
      const mockEvent = {
        id: 'evt_125',
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub-123',
            customer: 'cus-123',
            status: 'canceled',
            metadata: {
              userId: 'user-123',
            },
            canceled_at: 1705329600,
          },
        },
      };

      vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);

      await expect(
        subscriptionService.handleWebhook('{}', 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle unrecognized webhook event types', async () => {
      const mockEvent = {
        id: 'evt_126',
        type: 'unknown.event.type',
        data: {
          object: {},
        },
      };

      vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);

      await expect(
        subscriptionService.handleWebhook('{}', 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook with minimal invoice data gracefully', async () => {
      const mockEvent = {
        id: 'evt_127',
        type: 'invoice.paid',
        data: {
          object: {
            id: 'inv-123',
            // No subscription field - should handle gracefully
          },
        },
      };

      vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);

      await expect(
        subscriptionService.handleWebhook('{}', 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook for customer.subscription.updated event', async () => {
      const mockEvent = {
        id: 'evt_128',
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

      vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);

      await expect(
        subscriptionService.handleWebhook('{}', 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should handle webhook for customer.subscription.trial_will_end event', async () => {
      const mockEvent = {
        id: 'evt_129',
        type: 'customer.subscription.trial_will_end',
        data: {
          object: {
            id: 'sub-123',
            customer: 'cus-123',
            trial_end: 1734567890,
            metadata: {
              userId: 'user-123',
            },
          },
        },
      };

      vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);

      await expect(
        subscriptionService.handleWebhook('{}', 'signature-123')
      ).resolves.not.toThrow();
    });

    it('should throw error when webhook signature verification fails', async () => {
      vi.mocked(constructWebhookEvent).mockImplementation(() => {
        throw new Error('Webhook signature verification failed');
      });

      await expect(
        subscriptionService.handleWebhook('{}', 'invalid-signature')
      ).rejects.toThrow('Webhook signature verification failed');
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

      mockPrismaSubscription.findFirst.mockResolvedValue(null);
      mockPrismaSubscription.create.mockResolvedValue(mockSubscription);

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

      mockPrismaSubscription.findFirst.mockResolvedValue(mockSubscription);

      const input = {
        planId: 'plan-456',
        paymentMethodId: 'pm_123456',
      };

      await expect(
        subscriptionService.createSubscription('user-123', input)
      ).rejects.toThrow(BadRequestError);

      expect(mockPrismaSubscription.findFirst).toHaveBeenCalledWith({
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

      mockPrismaSubscription.findUnique.mockResolvedValue(mockSubscription);
      mockPrismaSubscription.update.mockResolvedValue(mockSubscription);

      await subscriptionService.cancelSubscription('sub-123', 'user-123');

      expect(mockPrismaSubscription.update).toHaveBeenCalled();
    });
  });
});
