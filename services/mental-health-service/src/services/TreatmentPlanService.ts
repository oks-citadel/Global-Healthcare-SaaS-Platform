import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TreatmentPlanService {
  /**
   * Create a new treatment plan with goals
   */
  static async createTreatmentPlan(data: {
    patientId: string;
    providerId: string;
    diagnosis: string[];
    interventions: any;
    medications?: any;
    frequency?: string;
    startDate: Date;
    reviewDate: Date;
    goals: Array<{
      description: string;
      targetDate?: Date;
      strategies: string[];
      measurements?: any;
    }>;
  }) {
    const plan = await prisma.treatmentPlan.create({
      data: {
        patientId: data.patientId,
        providerId: data.providerId,
        diagnosis: data.diagnosis,
        goals: data.goals,
        interventions: data.interventions,
        medications: data.medications,
        frequency: data.frequency,
        startDate: data.startDate,
        reviewDate: data.reviewDate,
        status: 'active',
      },
    });

    // Create individual goal records
    if (data.goals && data.goals.length > 0) {
      await Promise.all(
        data.goals.map((goal) =>
          prisma.treatmentGoal.create({
            data: {
              treatmentPlanId: plan.id,
              description: goal.description,
              targetDate: goal.targetDate,
              strategies: goal.strategies,
              measurements: goal.measurements,
              status: 'in_progress',
              progress: 0,
              barriers: [],
            },
          })
        )
      );
    }

    return plan;
  }

  /**
   * Get treatment plan with goals
   */
  static async getTreatmentPlanWithGoals(planId: string) {
    const plan = await prisma.treatmentPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return null;
    }

    const goals = await prisma.treatmentGoal.findMany({
      where: { treatmentPlanId: planId },
      orderBy: { createdAt: 'asc' },
    });

    return {
      ...plan,
      goalRecords: goals,
    };
  }

  /**
   * Get active treatment plan for patient
   */
  static async getActivePlanForPatient(patientId: string) {
    const plan = await prisma.treatmentPlan.findFirst({
      where: {
        patientId,
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!plan) {
      return null;
    }

    const goals = await prisma.treatmentGoal.findMany({
      where: { treatmentPlanId: plan.id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      ...plan,
      goalRecords: goals,
    };
  }

  /**
   * Update treatment plan
   */
  static async updateTreatmentPlan(
    planId: string,
    data: {
      diagnosis?: string[];
      interventions?: any;
      medications?: any;
      frequency?: string;
      reviewDate?: Date;
      status?: string;
    }
  ) {
    return await prisma.treatmentPlan.update({
      where: { id: planId },
      data,
    });
  }

  /**
   * Add goal to treatment plan
   */
  static async addGoal(data: {
    treatmentPlanId: string;
    description: string;
    targetDate?: Date;
    strategies: string[];
    measurements?: any;
  }) {
    return await prisma.treatmentGoal.create({
      data: {
        treatmentPlanId: data.treatmentPlanId,
        description: data.description,
        targetDate: data.targetDate,
        strategies: data.strategies,
        measurements: data.measurements,
        status: 'in_progress',
        progress: 0,
        barriers: [],
      },
    });
  }

  /**
   * Update goal progress
   */
  static async updateGoalProgress(
    goalId: string,
    data: {
      progress?: number;
      status?: 'not_started' | 'in_progress' | 'achieved' | 'discontinued';
      barriers?: string[];
      strategies?: string[];
    }
  ) {
    return await prisma.treatmentGoal.update({
      where: { id: goalId },
      data,
    });
  }

  /**
   * Get goals for treatment plan
   */
  static async getGoalsForPlan(treatmentPlanId: string) {
    return await prisma.treatmentGoal.findMany({
      where: { treatmentPlanId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Calculate treatment plan progress
   */
  static async calculatePlanProgress(planId: string) {
    const goals = await prisma.treatmentGoal.findMany({
      where: { treatmentPlanId: planId },
    });

    if (goals.length === 0) {
      return {
        totalGoals: 0,
        achievedGoals: 0,
        inProgressGoals: 0,
        overallProgress: 0,
      };
    }

    const achievedGoals = goals.filter((g) => g.status === 'achieved').length;
    const inProgressGoals = goals.filter((g) => g.status === 'in_progress').length;
    const overallProgress = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length;

    return {
      totalGoals: goals.length,
      achievedGoals,
      inProgressGoals,
      overallProgress: Math.round(overallProgress),
    };
  }

  /**
   * Check if plan needs review
   */
  static async checkPlansDueForReview() {
    return await prisma.treatmentPlan.findMany({
      where: {
        status: 'active',
        reviewDate: {
          lte: new Date(),
        },
      },
    });
  }
}
