import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../lib/prisma.js';

export const subscriptionService = {
  /**
   * Create a subscription
   */
  async createSubscription(
    userId: string,
    input: { planId: string; paymentMethodId: string; couponCode?: string }
  ): Promise<any> {
    // Check if user already has active subscription
    const existing = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (existing) {
      throw new BadRequestError('User already has an active subscription');
    }

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: input.planId,
        status: 'active',
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
    });

    logger.info('Subscription created', { subscriptionId: subscription.id, userId, planId: input.planId });

    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };
  },

  /**
   * Cancel a subscription
   */
  async cancelSubscription(id: string, userId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenError('Cannot cancel another user\'s subscription');
    }

    await prisma.subscription.update({
      where: { id },
      data: { cancelAtPeriodEnd: true },
    });

    logger.info('Subscription cancelled', { subscriptionId: id, userId });
  },

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(payload: any, signature: string): Promise<void> {
    // In production, verify Stripe signature and process events
    logger.info('Received billing webhook', { eventType: payload.type });

    // Handle different event types
    switch (payload.type) {
      case 'invoice.paid':
        // Update subscription status
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
      default:
        logger.debug('Unhandled webhook event', { eventType: payload.type });
    }
  },
};
