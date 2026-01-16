import { Subscription, SubscriptionStatus, Prisma } from '../generated/client';
import { BaseRepository } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export class SubscriptionRepository extends BaseRepository<Subscription, typeof prisma.subscription> {
  constructor() {
    super(prisma.subscription, 'Subscription');
  }

  /**
   * Find subscriptions by user ID
   */
  async findByUserId(
    userId: string,
    include?: Prisma.SubscriptionInclude
  ): Promise<Subscription[]> {
    return this.model.findMany({
      where: { userId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find active subscription by user ID
   */
  async findActiveByUserId(
    userId: string,
    include?: Prisma.SubscriptionInclude
  ): Promise<Subscription | null> {
    return this.model.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find subscription by Stripe subscription ID
   */
  async findByStripeSubscriptionId(
    stripeSubscriptionId: string,
    include?: Prisma.SubscriptionInclude
  ): Promise<Subscription | null> {
    return this.model.findUnique({
      where: { stripeSubscriptionId },
      include,
    });
  }

  /**
   * Find subscriptions by status
   */
  async findByStatus(
    status: SubscriptionStatus,
    include?: Prisma.SubscriptionInclude
  ): Promise<Subscription[]> {
    return this.model.findMany({
      where: { status },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find subscriptions by plan ID
   */
  async findByPlanId(
    planId: string,
    include?: Prisma.SubscriptionInclude
  ): Promise<Subscription[]> {
    return this.model.findMany({
      where: { planId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find expiring subscriptions
   */
  async findExpiring(daysFromNow: number = 7): Promise<Subscription[]> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysFromNow);

    return this.model.findMany({
      where: {
        status: 'active',
        currentPeriodEnd: {
          lte: endDate,
          gte: new Date(),
        },
      },
      include: {
        plan: true,
      },
      orderBy: { currentPeriodEnd: 'asc' },
    });
  }

  /**
   * Find expired subscriptions
   */
  async findExpired(): Promise<Subscription[]> {
    return this.model.findMany({
      where: {
        status: 'active',
        currentPeriodEnd: {
          lt: new Date(),
        },
      },
      include: {
        plan: true,
      },
    });
  }

  /**
   * Find subscriptions to cancel at period end
   */
  async findCancellingAtPeriodEnd(): Promise<Subscription[]> {
    return this.model.findMany({
      where: {
        cancelAtPeriodEnd: true,
        status: 'active',
      },
      include: {
        plan: true,
      },
      orderBy: { currentPeriodEnd: 'asc' },
    });
  }

  /**
   * Update subscription status
   */
  async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription> {
    return this.model.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Update subscription period
   */
  async updatePeriod(
    id: string,
    currentPeriodStart: Date,
    currentPeriodEnd: Date
  ): Promise<Subscription> {
    return this.model.update({
      where: { id },
      data: {
        currentPeriodStart,
        currentPeriodEnd,
      },
    });
  }

  /**
   * Set cancel at period end
   */
  async setCancelAtPeriodEnd(id: string, cancel: boolean): Promise<Subscription> {
    return this.model.update({
      where: { id },
      data: { cancelAtPeriodEnd: cancel },
    });
  }

  /**
   * Cancel subscription immediately
   */
  async cancelImmediately(id: string): Promise<Subscription> {
    return this.model.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelAtPeriodEnd: false,
      },
    });
  }

  /**
   * Reactivate subscription
   */
  async reactivate(id: string): Promise<Subscription> {
    return this.model.update({
      where: { id },
      data: {
        status: 'active',
        cancelAtPeriodEnd: false,
      },
    });
  }

  /**
   * Update subscription plan
   */
  async updatePlan(id: string, planId: string): Promise<Subscription> {
    return this.model.update({
      where: { id },
      data: { planId },
    });
  }

  /**
   * Count subscriptions by status
   */
  async countByStatus(status: SubscriptionStatus): Promise<number> {
    return this.model.count({ where: { status } });
  }

  /**
   * Count active subscriptions
   */
  async countActive(): Promise<number> {
    return this.countByStatus('active');
  }

  /**
   * Count subscriptions by plan
   */
  async countByPlan(planId: string): Promise<number> {
    return this.model.count({ where: { planId } });
  }

  /**
   * Get subscription with full details
   */
  async findWithFullDetails(id: string): Promise<Subscription | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        plan: true,
      },
    });
  }

  /**
   * Find subscriptions by date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: {
      status?: SubscriptionStatus;
      planId?: string;
    }
  ): Promise<Subscription[]> {
    const where: Prisma.SubscriptionWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.planId) {
      where.planId = options.planId;
    }

    return this.model.findMany({
      where,
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get subscription statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    pastDue: number;
    cancelled: number;
    expired: number;
    expiringIn7Days: number;
  }> {
    const [total, active, pastDue, cancelled, expired, expiringIn7Days] = await Promise.all([
      this.count(),
      this.countByStatus('active'),
      this.countByStatus('past_due'),
      this.countByStatus('cancelled'),
      this.countByStatus('expired'),
      this.findExpiring(7).then((subs) => subs.length),
    ]);

    return {
      total,
      active,
      pastDue,
      cancelled,
      expired,
      expiringIn7Days,
    };
  }

  /**
   * Get plan statistics
   */
  async getPlanStats(planId: string): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    monthlyRecurringRevenue: number;
  }> {
    const [totalSubscriptions, activeSubscriptions, cancelledSubscriptions, plan] =
      await Promise.all([
        this.countByPlan(planId),
        this.model.count({ where: { planId, status: 'active' } }),
        this.model.count({ where: { planId, status: 'cancelled' } }),
        prisma.plan.findUnique({ where: { id: planId } }),
      ]);

    const monthlyRecurringRevenue = plan
      ? activeSubscriptions * Number(plan.price)
      : 0;

    return {
      totalSubscriptions,
      activeSubscriptions,
      cancelledSubscriptions,
      monthlyRecurringRevenue,
    };
  }

  /**
   * Mark expired subscriptions
   */
  async markExpiredSubscriptions(): Promise<number> {
    const result = await this.updateMany(
      {
        status: 'active',
        currentPeriodEnd: {
          lt: new Date(),
        },
      },
      { status: 'expired' }
    );

    return result.count;
  }

  /**
   * Find recent subscriptions
   */
  async findRecent(limit: number = 10): Promise<Subscription[]> {
    return this.model.findMany({
      include: {
        plan: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const count = await this.model.count({
      where: {
        userId,
        status: 'active',
      },
    });

    return count > 0;
  }

  /**
   * Get user's subscription history
   */
  async getUserHistory(userId: string): Promise<Subscription[]> {
    return this.model.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const subscriptionRepository = new SubscriptionRepository();
