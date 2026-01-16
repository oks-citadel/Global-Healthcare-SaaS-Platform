import { describe, it, expect, beforeEach, vi } from 'vitest';
import Stripe from 'stripe';

// Use vi.hoisted to create mock variables that are available during vi.mock hoisting
const { mockPrismaInstance } = vi.hoisted(() => ({
  mockPrismaInstance: {
    user: {
      findUnique: vi.fn(),
    },
    plan: {
      findUnique: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      upsert: vi.fn(),
    },
    auditEvent: {
      create: vi.fn(),
    },
  },
}));

// Mock PrismaClient from generated client (payment service creates its own instance)
vi.mock('../../../src/generated/client', () => {
  return {
    PrismaClient: class MockPrismaClient {
      user = mockPrismaInstance.user;
      plan = mockPrismaInstance.plan;
      subscription = mockPrismaInstance.subscription;
      auditEvent = mockPrismaInstance.auditEvent;
    },
  };
});

// Mock Stripe library
vi.mock('../../../src/lib/stripe.js', () => ({
  stripe: {
    customers: {
      list: vi.fn(),
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
    },
    subscriptions: {
      create: vi.fn(),
      cancel: vi.fn(),
      update: vi.fn(),
      retrieve: vi.fn(),
    },
    invoices: {
      list: vi.fn(),
      retrieve: vi.fn(),
    },
    paymentMethods: {
      attach: vi.fn(),
      detach: vi.fn(),
      list: vi.fn(),
    },
    setupIntents: {
      create: vi.fn(),
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
  createStripeCustomer: vi.fn(),
  getStripeCustomer: vi.fn(),
  createSetupIntent: vi.fn(),
  attachPaymentMethod: vi.fn(),
  setDefaultPaymentMethod: vi.fn(),
  createStripeSubscription: vi.fn(),
  updateStripeSubscription: vi.fn(),
  cancelStripeSubscription: vi.fn(),
  getStripeSubscription: vi.fn(),
  listCustomerInvoices: vi.fn(),
  getStripeInvoice: vi.fn(),
  listCustomerPaymentMethods: vi.fn(),
  detachPaymentMethod: vi.fn(),
  constructWebhookEvent: vi.fn(),
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

// Mock audit service
vi.mock('../../../src/services/audit.service.js', () => ({
  auditService: {
    logEvent: vi.fn().mockResolvedValue(undefined),
  },
}));

// Import service AFTER mocks are set up
import { paymentService } from '../../../src/services/payment.service.js';
import * as stripeLib from '../../../src/lib/stripe.js';

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCustomer', () => {
    it('should create a new Stripe customer', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
        name: 'John Doe',
        metadata: { userId: 'user-123' },
      } as Stripe.Customer;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [],
      } as any);
      vi.mocked(stripeLib.createStripeCustomer).mockResolvedValue(mockCustomer);

      const result = await paymentService.createCustomer({
        userId: 'user-123',
        email: 'test@example.com',
        name: 'John Doe',
      });

      expect(mockPrismaInstance.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });

      expect(stripeLib.createStripeCustomer).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'John Doe',
        metadata: { userId: 'user-123' },
      });

      expect(result).toEqual(mockCustomer);
    });

    it('should return existing customer if already exists', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_existing',
        email: 'test@example.com',
        name: 'John Doe',
      } as Stripe.Customer;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);

      const result = await paymentService.createCustomer({
        userId: 'user-123',
        email: 'test@example.com',
        name: 'John Doe',
      });

      expect(stripeLib.createStripeCustomer).not.toHaveBeenCalled();
      expect(result).toEqual(mockCustomer);
    });

    it('should throw error when user not found', async () => {
      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(null);

      await expect(
        paymentService.createCustomer({
          userId: 'non-existent',
          email: 'test@example.com',
          name: 'John Doe',
        })
      ).rejects.toThrow('User not found');
    });

    it('should include additional metadata when provided', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [],
      } as any);
      vi.mocked(stripeLib.createStripeCustomer).mockResolvedValue(mockCustomer);

      await paymentService.createCustomer({
        userId: 'user-123',
        email: 'test@example.com',
        name: 'John Doe',
        metadata: { plan: 'premium', source: 'signup' },
      });

      expect(stripeLib.createStripeCustomer).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'John Doe',
        metadata: {
          userId: 'user-123',
          plan: 'premium',
          source: 'signup',
        },
      });
    });
  });

  describe('createSubscription', () => {
    it('should create a subscription successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPlan = {
        id: 'price_123',
        name: 'Premium Plan',
        amount: 2999,
      };

      const mockSubscription = {
        id: 'sub_123456',
        customer: 'cus_123456',
        status: 'active',
        current_period_start: 1705329600,
        current_period_end: 1707921600,
        cancel_at_period_end: false,
        items: {
          data: [{ price: { id: 'price_123' } }],
        },
        latest_invoice: null,
      } as any;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(mockPrismaInstance.plan.findUnique).mockResolvedValue(mockPlan as any);
      vi.mocked(stripeLib.stripe.paymentMethods.attach).mockResolvedValue({} as any);
      vi.mocked(stripeLib.setDefaultPaymentMethod).mockResolvedValue({} as any);
      vi.mocked(stripeLib.stripe.subscriptions.create).mockResolvedValue(mockSubscription);
      vi.mocked(mockPrismaInstance.subscription.create).mockResolvedValue({
        id: 'db-sub-123',
        userId: 'user-123',
        stripeSubscriptionId: 'sub_123456',
        planId: 'price_123',
        status: 'active',
        currentPeriodStart: new Date(1705329600 * 1000),
        currentPeriodEnd: new Date(1707921600 * 1000),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const data = {
        priceId: 'price_123',
        paymentMethodId: 'pm_123456',
      };

      const result = await paymentService.createSubscription('user-123', data);

      expect(stripeLib.stripe.paymentMethods.attach).toHaveBeenCalledWith(
        'pm_123456',
        { customer: 'cus_123456' },
        expect.any(Object)
      );

      expect(stripeLib.setDefaultPaymentMethod).toHaveBeenCalledWith(
        'cus_123456',
        'pm_123456'
      );

      expect(stripeLib.stripe.subscriptions.create).toHaveBeenCalled();

      expect(result.subscription).toEqual(mockSubscription);
    });

    it('should create subscription with trial period', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPlan = {
        id: 'price_123',
        name: 'Premium Plan',
      };

      const mockSubscription = {
        id: 'sub_123456',
        customer: 'cus_123456',
        status: 'trialing',
        current_period_start: 1705329600,
        current_period_end: 1707921600,
        cancel_at_period_end: false,
        items: {
          data: [{ price: { id: 'price_123' } }],
        },
        latest_invoice: null,
      } as any;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(mockPrismaInstance.plan.findUnique).mockResolvedValue(mockPlan as any);
      vi.mocked(stripeLib.stripe.subscriptions.create).mockResolvedValue(mockSubscription);
      vi.mocked(mockPrismaInstance.subscription.create).mockResolvedValue({
        id: 'db-sub-123',
        userId: 'user-123',
        stripeSubscriptionId: 'sub_123456',
        planId: 'price_123',
        status: 'active',
        currentPeriodStart: new Date(1705329600 * 1000),
        currentPeriodEnd: new Date(1707921600 * 1000),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const data = {
        priceId: 'price_123',
        trialPeriodDays: 14,
      };

      await paymentService.createSubscription('user-123', data);

      expect(stripeLib.stripe.subscriptions.create).toHaveBeenCalled();
    });

    it('should extract client secret from invoice', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPlan = {
        id: 'price_123',
        name: 'Premium Plan',
      };

      const mockInvoice = {
        id: 'in_123456',
        payment_intent: 'pi_secret_key',
      } as any;

      const mockSubscription = {
        id: 'sub_123456',
        customer: 'cus_123456',
        status: 'active',
        current_period_start: 1705329600,
        current_period_end: 1707921600,
        cancel_at_period_end: false,
        items: {
          data: [{ price: { id: 'price_123' } }],
        },
        latest_invoice: 'in_123456',
      } as any;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(mockPrismaInstance.plan.findUnique).mockResolvedValue(mockPlan as any);
      vi.mocked(stripeLib.stripe.subscriptions.create).mockResolvedValue(mockSubscription);
      vi.mocked(stripeLib.getStripeInvoice).mockResolvedValue(mockInvoice);
      vi.mocked(mockPrismaInstance.subscription.create).mockResolvedValue({
        id: 'db-sub-123',
        userId: 'user-123',
        stripeSubscriptionId: 'sub_123456',
        planId: 'price_123',
        status: 'active',
        currentPeriodStart: new Date(1705329600 * 1000),
        currentPeriodEnd: new Date(1707921600 * 1000),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const data = {
        priceId: 'price_123',
      };

      const result = await paymentService.createSubscription('user-123', data);

      expect(result.clientSecret).toBe('pi_secret_key');
    });

    it('should throw error when user not found', async () => {
      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(null);

      const data = {
        priceId: 'price_123',
      };

      await expect(
        paymentService.createSubscription('non-existent', data)
      ).rejects.toThrow('User not found');
    });

    it('should throw error when plan not found', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockSubscription = {
        id: 'sub_123456',
        customer: 'cus_123456',
        status: 'active',
        current_period_start: 1705329600,
        current_period_end: 1707921600,
        cancel_at_period_end: false,
        items: {
          data: [{ price: { id: 'price_123' } }],
        },
        latest_invoice: null,
      } as any;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.createStripeSubscription).mockResolvedValue(mockSubscription);
      vi.mocked(mockPrismaInstance.plan.findUnique).mockResolvedValue(null);

      const data = {
        priceId: 'price_123',
      };

      await expect(
        paymentService.createSubscription('user-123', data)
      ).rejects.toThrow('Plan not found');
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', async () => {
      const mockDbSubscription = {
        id: 'db-sub-123',
        userId: 'user-123',
        stripeSubscriptionId: 'sub_123456',
      };

      const mockStripeSubscription = {
        id: 'sub_123456',
        status: 'active',
        cancel_at_period_end: true,
        current_period_start: 1705329600,
        current_period_end: 1707921600,
      } as any;

      vi.mocked(mockPrismaInstance.subscription.findFirst).mockResolvedValue(mockDbSubscription as any);
      vi.mocked(stripeLib.cancelStripeSubscription).mockResolvedValue(mockStripeSubscription);
      vi.mocked(mockPrismaInstance.subscription.update).mockResolvedValue({} as any);

      const data = {
        subscriptionId: 'sub_123456',
        cancelAtPeriodEnd: true,
      };

      const result = await paymentService.cancelSubscription('user-123', data);

      expect(stripeLib.cancelStripeSubscription).toHaveBeenCalledWith('sub_123456', true);
      expect(mockPrismaInstance.subscription.update).toHaveBeenCalledWith({
        where: { id: 'db-sub-123' },
        data: {
          status: 'active',
          cancelAtPeriodEnd: true,
          updatedAt: expect.any(Date),
        },
      });

      expect(result).toEqual(mockStripeSubscription);
    });

    it('should cancel subscription immediately', async () => {
      const mockDbSubscription = {
        id: 'db-sub-123',
        userId: 'user-123',
        stripeSubscriptionId: 'sub_123456',
      };

      const mockStripeSubscription = {
        id: 'sub_123456',
        status: 'canceled',
        cancel_at_period_end: false,
      } as Stripe.Subscription;

      vi.mocked(mockPrismaInstance.subscription.findFirst).mockResolvedValue(mockDbSubscription as any);
      vi.mocked(stripeLib.cancelStripeSubscription).mockResolvedValue(mockStripeSubscription);
      vi.mocked(mockPrismaInstance.subscription.update).mockResolvedValue({} as any);

      const data = {
        subscriptionId: 'sub_123456',
        cancelAtPeriodEnd: false,
      };

      const result = await paymentService.cancelSubscription('user-123', data);

      expect(stripeLib.cancelStripeSubscription).toHaveBeenCalledWith('sub_123456', false);
      expect(mockPrismaInstance.subscription.update).toHaveBeenCalledWith({
        where: { id: 'db-sub-123' },
        data: {
          status: 'cancelled',
          cancelAtPeriodEnd: false,
          updatedAt: expect.any(Date),
        },
      });

      expect(result).toEqual(mockStripeSubscription);
    });

    it('should throw error when subscription not found or does not belong to user', async () => {
      vi.mocked(mockPrismaInstance.subscription.findFirst).mockResolvedValue(null);

      const data = {
        subscriptionId: 'sub_123456',
        cancelAtPeriodEnd: false,
      };

      await expect(
        paymentService.cancelSubscription('user-123', data)
      ).rejects.toThrow('Subscription not found or does not belong to user');
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update payment method successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPaymentMethod = {
        id: 'pm_123456',
        type: 'card',
      } as Stripe.PaymentMethod;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.attachPaymentMethod).mockResolvedValue(mockPaymentMethod);
      vi.mocked(stripeLib.setDefaultPaymentMethod).mockResolvedValue(mockCustomer);

      const data = {
        paymentMethodId: 'pm_123456',
        setAsDefault: true,
      };

      const result = await paymentService.updatePaymentMethod('user-123', data);

      expect(stripeLib.attachPaymentMethod).toHaveBeenCalledWith('pm_123456', 'cus_123456');
      expect(stripeLib.setDefaultPaymentMethod).toHaveBeenCalledWith('cus_123456', 'pm_123456');
      expect(result).toEqual(mockPaymentMethod);
    });

    it('should not set as default when setAsDefault is false', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPaymentMethod = {
        id: 'pm_123456',
        type: 'card',
      } as Stripe.PaymentMethod;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.attachPaymentMethod).mockResolvedValue(mockPaymentMethod);

      const data = {
        paymentMethodId: 'pm_123456',
        setAsDefault: false,
      };

      await paymentService.updatePaymentMethod('user-123', data);

      expect(stripeLib.setDefaultPaymentMethod).not.toHaveBeenCalled();
    });
  });

  describe('getInvoices', () => {
    it('should retrieve customer invoices', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockInvoices = [
        { id: 'in_1', amount_paid: 2999 },
        { id: 'in_2', amount_paid: 2999 },
      ] as Stripe.Invoice[];

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.listCustomerInvoices).mockResolvedValue(mockInvoices);

      const result = await paymentService.getInvoices('user-123', 10);

      expect(stripeLib.listCustomerInvoices).toHaveBeenCalledWith('cus_123456', 10);
      expect(result).toEqual(mockInvoices);
    });

    it('should return empty array when customer not found', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [],
      } as any);

      const result = await paymentService.getInvoices('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('createSetupIntent', () => {
    it('should create setup intent successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockSetupIntent = {
        id: 'seti_123456',
        client_secret: 'seti_123456_secret',
      } as Stripe.SetupIntent;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.createSetupIntent).mockResolvedValue(mockSetupIntent);

      const result = await paymentService.createSetupIntent('user-123');

      expect(stripeLib.createSetupIntent).toHaveBeenCalledWith('cus_123456', {
        userId: 'user-123',
      });
      expect(result).toEqual(mockSetupIntent);
    });

    it('should create setup intent with custom metadata', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockSetupIntent = {
        id: 'seti_123456',
        client_secret: 'seti_123456_secret',
      } as Stripe.SetupIntent;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.createSetupIntent).mockResolvedValue(mockSetupIntent);

      await paymentService.createSetupIntent('user-123', { source: 'settings' });

      expect(stripeLib.createSetupIntent).toHaveBeenCalledWith('cus_123456', {
        userId: 'user-123',
        source: 'settings',
      });
    });
  });

  describe('getCurrentSubscription', () => {
    it('should return current subscription', async () => {
      const mockDbSubscription = {
        id: 'db-sub-123',
        userId: 'user-123',
        stripeSubscriptionId: 'sub_123456',
        status: 'active',
        plan: { name: 'Premium' },
      };

      const mockStripeSubscription = {
        id: 'sub_123456',
        status: 'active',
      } as Stripe.Subscription;

      vi.mocked(mockPrismaInstance.subscription.findFirst).mockResolvedValue(mockDbSubscription as any);
      vi.mocked(stripeLib.getStripeSubscription).mockResolvedValue(mockStripeSubscription);

      const result = await paymentService.getCurrentSubscription('user-123');

      expect(result).toEqual({
        dbSubscription: mockDbSubscription,
        stripeSubscription: mockStripeSubscription,
      });
    });

    it('should return null when no active subscription', async () => {
      vi.mocked(mockPrismaInstance.subscription.findFirst).mockResolvedValue(null);

      const result = await paymentService.getCurrentSubscription('user-123');

      expect(result).toBeNull();
    });

    it('should return null when subscription has no Stripe ID', async () => {
      const mockDbSubscription = {
        id: 'db-sub-123',
        userId: 'user-123',
        stripeSubscriptionId: null,
        status: 'active',
      };

      vi.mocked(mockPrismaInstance.subscription.findFirst).mockResolvedValue(mockDbSubscription as any);

      const result = await paymentService.getCurrentSubscription('user-123');

      expect(result).toBeNull();
    });
  });

  describe('getPaymentMethods', () => {
    it('should retrieve customer payment methods', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPaymentMethods = [
        { id: 'pm_1', type: 'card' },
        { id: 'pm_2', type: 'card' },
      ] as Stripe.PaymentMethod[];

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.listCustomerPaymentMethods).mockResolvedValue(mockPaymentMethods);

      const result = await paymentService.getPaymentMethods('user-123');

      expect(result).toEqual(mockPaymentMethods);
    });

    it('should return empty array when customer not found', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [],
      } as any);

      const result = await paymentService.getPaymentMethods('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('removePaymentMethod', () => {
    it('should remove payment method successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPaymentMethods = [
        { id: 'pm_123456', type: 'card' },
      ] as Stripe.PaymentMethod[];

      const mockDetachedPaymentMethod = {
        id: 'pm_123456',
        type: 'card',
      } as Stripe.PaymentMethod;

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.listCustomerPaymentMethods).mockResolvedValue(mockPaymentMethods);
      vi.mocked(stripeLib.detachPaymentMethod).mockResolvedValue(mockDetachedPaymentMethod);

      const result = await paymentService.removePaymentMethod('user-123', 'pm_123456');

      expect(stripeLib.detachPaymentMethod).toHaveBeenCalledWith('pm_123456');
      expect(result).toEqual(mockDetachedPaymentMethod);
    });

    it('should throw error when payment method does not belong to user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer = {
        id: 'cus_123456',
        email: 'test@example.com',
      } as Stripe.Customer;

      const mockPaymentMethods = [
        { id: 'pm_different', type: 'card' },
      ] as Stripe.PaymentMethod[];

      vi.mocked(mockPrismaInstance.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(stripeLib.stripe.customers.list).mockResolvedValue({
        data: [mockCustomer],
      } as any);
      vi.mocked(stripeLib.listCustomerPaymentMethods).mockResolvedValue(mockPaymentMethods);

      await expect(
        paymentService.removePaymentMethod('user-123', 'pm_123456')
      ).rejects.toThrow('Payment method not found or does not belong to user');
    });
  });

  describe('handleWebhook', () => {
    it('should handle customer.subscription.created event', async () => {
      const mockEvent = {
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_123456',
            customer: 'cus_123456',
            status: 'active',
            current_period_start: 1705329600,
            current_period_end: 1707921600,
            cancel_at_period_end: false,
            items: {
              data: [{ price: { id: 'price_123' } }],
            },
            metadata: { userId: 'user-123' },
          } as Stripe.Subscription,
        },
      } as Stripe.Event;

      vi.mocked(stripeLib.constructWebhookEvent).mockReturnValue(mockEvent);
      vi.mocked(mockPrismaInstance.subscription.upsert).mockResolvedValue({} as any);

      await paymentService.handleWebhook('payload', 'signature');

      expect(mockPrismaInstance.subscription.upsert).toHaveBeenCalled();
    });

    it('should handle customer.subscription.deleted event', async () => {
      const mockEvent = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_123456',
          } as Stripe.Subscription,
        },
      } as Stripe.Event;

      vi.mocked(stripeLib.constructWebhookEvent).mockReturnValue(mockEvent);
      vi.mocked(mockPrismaInstance.subscription.updateMany).mockResolvedValue({ count: 1 } as any);

      await paymentService.handleWebhook('payload', 'signature');

      expect(mockPrismaInstance.subscription.updateMany).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: 'sub_123456' },
        data: {
          status: 'cancelled',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should handle invoice.payment_failed event', async () => {
      const mockEvent = {
        type: 'invoice.payment_failed',
        data: {
          object: {
            id: 'in_123456',
            subscription: 'sub_123456',
          } as Stripe.Invoice,
        },
      } as Stripe.Event;

      vi.mocked(stripeLib.constructWebhookEvent).mockReturnValue(mockEvent);
      vi.mocked(mockPrismaInstance.subscription.updateMany).mockResolvedValue({ count: 1 } as any);

      await paymentService.handleWebhook('payload', 'signature');

      expect(mockPrismaInstance.subscription.updateMany).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: 'sub_123456' },
        data: {
          status: 'past_due',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw error when webhook secret is not defined', async () => {
      const originalEnv = process.env.STRIPE_WEBHOOK_SECRET;
      delete process.env.STRIPE_WEBHOOK_SECRET;

      await expect(
        paymentService.handleWebhook('payload', 'signature')
      ).rejects.toThrow('STRIPE_WEBHOOK_SECRET is not defined');

      process.env.STRIPE_WEBHOOK_SECRET = originalEnv;
    });
  });
});
