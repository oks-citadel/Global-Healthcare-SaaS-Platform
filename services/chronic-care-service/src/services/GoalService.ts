import { PrismaClient, GoalType, GoalStatus } from '../generated/client';
import EngagementService from './EngagementService';

const prisma = new PrismaClient();

export class GoalService {
  async createGoal(data: {
    patientId: string;
    carePlanId?: string;
    title: string;
    description?: string;
    goalType: GoalType;
    targetValue?: number;
    targetUnit?: string;
    targetDate?: Date;
    frequency?: string;
  }) {
    const goal = await prisma.goal.create({
      data,
    });

    // Track engagement
    await EngagementService.trackEngagement({
      patientId: data.patientId,
      carePlanId: data.carePlanId,
      engagementType: 'goal_progress',
      activityType: 'goal_created',
      description: `Created goal: ${data.title}`,
      metadata: { goalId: goal.id, goalType: data.goalType },
    });

    return goal;
  }

  async getGoalsByPatient(
    patientId: string,
    filters?: {
      carePlanId?: string;
      status?: GoalStatus;
      goalType?: GoalType;
    }
  ) {
    const where: any = { patientId };

    if (filters?.carePlanId) {
      where.carePlanId = filters.carePlanId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.goalType) {
      where.goalType = filters.goalType;
    }

    return await prisma.goal.findMany({
      where,
      include: {
        progress: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { status: 'asc' },
        { targetDate: 'asc' },
      ],
    });
  }

  async getGoalById(id: string) {
    return await prisma.goal.findUnique({
      where: { id },
      include: {
        progress: {
          orderBy: { recordedAt: 'desc' },
        },
      },
    });
  }

  async updateGoal(id: string, data: Partial<{
    title: string;
    description: string;
    targetValue: number;
    targetUnit: string;
    targetDate: Date;
    frequency: string;
    status: GoalStatus;
  }>) {
    return await prisma.goal.update({
      where: { id },
      data,
    });
  }

  async recordProgress(
    goalId: string,
    data: {
      currentValue?: number;
      currentUnit?: string;
      notes?: string;
      recordedAt?: Date;
    }
  ) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    const progress = await prisma.goalProgress.create({
      data: {
        goal: { connect: { id: goalId } },
        value: data.currentValue || 0,
        currentValue: data.currentValue,
        currentUnit: data.currentUnit,
        notes: data.notes,
        recordedAt: data.recordedAt || new Date(),
      },
    });

    // Check if goal is achieved
    if (goal.targetValue && data.currentValue) {
      const isAchieved = this.checkGoalAchievement(goal, data.currentValue);

      if (isAchieved && goal.status !== 'achieved') {
        await this.updateGoal(goalId, {
          status: 'achieved',
        });

        await prisma.goal.update({
          where: { id: goalId },
          data: { completedAt: new Date() },
        });
      }
    }

    // Track engagement
    await EngagementService.trackEngagement({
      patientId: goal.patientId,
      carePlanId: goal.carePlanId || undefined,
      engagementType: 'goal_progress',
      activityType: 'goal_progress_updated',
      description: `Updated progress for goal: ${goal.title}`,
      metadata: { goalId, currentValue: data.currentValue },
    });

    return progress;
  }

  private checkGoalAchievement(goal: any, currentValue: number): boolean {
    if (!goal.targetValue) return false;

    // Logic depends on goal type
    switch (goal.goalType) {
      case 'weight_loss':
        return currentValue <= goal.targetValue;
      case 'vital_sign':
        // For vital signs, check if within acceptable range (simplified)
        return Math.abs(currentValue - goal.targetValue) <= (goal.targetValue * 0.1);
      case 'activity':
      case 'medication_adherence':
        return currentValue >= goal.targetValue;
      default:
        return currentValue >= goal.targetValue;
    }
  }

  async getGoalProgress(goalId: string, limit?: number) {
    return await prisma.goalProgress.findMany({
      where: { goalId },
      orderBy: { recordedAt: 'desc' },
      take: limit || 50,
    });
  }

  async getGoalStatistics(goalId: string) {
    const goal = await this.getGoalById(goalId);

    if (!goal || goal.progress.length === 0) {
      return null;
    }

    const progressValues = goal.progress
      .filter(p => p.currentValue !== null)
      .map(p => p.currentValue!);

    if (progressValues.length === 0) {
      return null;
    }

    const latest = goal.progress[0];
    const oldest = goal.progress[goal.progress.length - 1];

    const stats = {
      goalId,
      totalRecords: goal.progress.length,
      latestValue: latest.currentValue,
      latestDate: latest.recordedAt,
      oldestValue: oldest.currentValue,
      oldestDate: oldest.recordedAt,
      targetValue: goal.targetValue,
      targetUnit: goal.targetUnit,
      progress: goal.targetValue && latest.currentValue
        ? this.calculateProgressPercentage(goal, latest.currentValue)
        : null,
      status: goal.status,
    };

    return stats;
  }

  private calculateProgressPercentage(goal: any, currentValue: number): number {
    if (!goal.targetValue) return 0;

    const startValue = goal.progress[goal.progress.length - 1]?.currentValue || 0;
    const targetValue = goal.targetValue;

    switch (goal.goalType) {
      case 'weight_loss':
        const weightLoss = startValue - currentValue;
        const targetLoss = startValue - targetValue;
        return Math.min(100, Math.max(0, (weightLoss / targetLoss) * 100));
      default:
        const progress = currentValue - startValue;
        const target = targetValue - startValue;
        return Math.min(100, Math.max(0, (progress / target) * 100));
    }
  }

  async deleteGoal(id: string) {
    return await prisma.goal.delete({
      where: { id },
    });
  }

  async getActiveGoalsSummary(patientId: string) {
    const activeGoals = await prisma.goal.findMany({
      where: {
        patientId,
        status: 'active',
      },
      include: {
        progress: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    return activeGoals.map(goal => ({
      id: goal.id,
      title: goal.title,
      goalType: goal.goalType,
      targetValue: goal.targetValue,
      targetUnit: goal.targetUnit,
      targetDate: goal.targetDate,
      latestProgress: goal.progress[0] || null,
      progressPercentage: goal.progress[0]?.currentValue && goal.targetValue
        ? this.calculateProgressPercentage(goal, goal.progress[0].currentValue)
        : 0,
    }));
  }
}

export default new GoalService();
