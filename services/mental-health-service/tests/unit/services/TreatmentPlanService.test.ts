/**
 * Unit Tests for TreatmentPlanService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  mockTreatmentPlan,
  mockTreatmentGoal,
  mockCreateTreatmentPlanInput,
} from '../helpers/fixtures';

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance } = vi.hoisted(() => {
  const mockFn = () => ({
    treatmentPlan: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    treatmentGoal: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  });
  return { mockPrismaInstance: mockFn() };
});

// Mock the Prisma client
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaInstance),
  TreatmentPlanStatus: {
    active: 'active',
    completed: 'completed',
    cancelled: 'cancelled',
    onHold: 'onHold',
  },
  GoalStatus: {
    notStarted: 'notStarted',
    inProgress: 'inProgress',
    achieved: 'achieved',
    notAchieved: 'notAchieved',
  },
}));

// Import after mock is set up
import { TreatmentPlanService } from '../../../src/services/TreatmentPlanService';

describe('TreatmentPlanService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockPrismaInstance.treatmentPlan.create.mockResolvedValue(mockTreatmentPlan);
    mockPrismaInstance.treatmentPlan.findUnique.mockResolvedValue(mockTreatmentPlan);
    mockPrismaInstance.treatmentPlan.findFirst.mockResolvedValue(mockTreatmentPlan);
    mockPrismaInstance.treatmentPlan.update.mockResolvedValue(mockTreatmentPlan);
    mockPrismaInstance.treatmentGoal.create.mockResolvedValue(mockTreatmentGoal);
    mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([mockTreatmentGoal]);
  });

  describe('createTreatmentPlan', () => {
    it('should create a treatment plan with goals', async () => {
      const result = await TreatmentPlanService.createTreatmentPlan(mockCreateTreatmentPlanInput);

      expect(mockPrismaInstance.treatmentPlan.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          patientId: mockCreateTreatmentPlanInput.patientId,
          providerId: mockCreateTreatmentPlanInput.providerId,
          diagnosis: mockCreateTreatmentPlanInput.diagnosis,
          status: 'active',
        }),
      });
      expect(result).toBeDefined();
    });

    it('should create goal records for each goal in input', async () => {
      await TreatmentPlanService.createTreatmentPlan(mockCreateTreatmentPlanInput);

      expect(mockPrismaInstance.treatmentGoal.create).toHaveBeenCalled();
    });

    it('should not create goals when empty array provided', async () => {
      const inputWithNoGoals = {
        ...mockCreateTreatmentPlanInput,
        goals: [],
      };

      await TreatmentPlanService.createTreatmentPlan(inputWithNoGoals);

      expect(mockPrismaInstance.treatmentGoal.create).not.toHaveBeenCalled();
    });

    it('should set initial goal status to in_progress', async () => {
      await TreatmentPlanService.createTreatmentPlan(mockCreateTreatmentPlanInput);

      const createCall = mockPrismaInstance.treatmentGoal.create.mock.calls[0][0];
      expect(createCall.data.status).toBe('in_progress');
      expect(createCall.data.progress).toBe(0);
    });
  });

  describe('getTreatmentPlanWithGoals', () => {
    it('should return plan with associated goals', async () => {
      mockPrismaInstance.treatmentPlan.findUnique.mockResolvedValue(mockTreatmentPlan);
      mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([mockTreatmentGoal]);

      const result = await TreatmentPlanService.getTreatmentPlanWithGoals('plan-123');

      expect(result).toBeDefined();
      expect(result?.goalRecords).toHaveLength(1);
    });

    it('should return null when plan not found', async () => {
      mockPrismaInstance.treatmentPlan.findUnique.mockResolvedValue(null);

      const result = await TreatmentPlanService.getTreatmentPlanWithGoals('non-existent');

      expect(result).toBeNull();
    });

    it('should order goals by creation date', async () => {
      await TreatmentPlanService.getTreatmentPlanWithGoals('plan-123');

      const findCall = mockPrismaInstance.treatmentGoal.findMany.mock.calls[0][0];
      expect(findCall.orderBy.createdAt).toBe('asc');
    });
  });

  describe('getActivePlanForPatient', () => {
    it('should return active plan for patient', async () => {
      mockPrismaInstance.treatmentPlan.findFirst.mockResolvedValue(mockTreatmentPlan);
      mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([mockTreatmentGoal]);

      const result = await TreatmentPlanService.getActivePlanForPatient('patient-123');

      expect(mockPrismaInstance.treatmentPlan.findFirst).toHaveBeenCalledWith({
        where: {
          patientId: 'patient-123',
          status: 'active',
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result?.status).toBe('active');
    });

    it('should return null when no active plan exists', async () => {
      mockPrismaInstance.treatmentPlan.findFirst.mockResolvedValue(null);

      const result = await TreatmentPlanService.getActivePlanForPatient('patient-123');

      expect(result).toBeNull();
    });

    it('should get the most recent active plan', async () => {
      await TreatmentPlanService.getActivePlanForPatient('patient-123');

      const findCall = mockPrismaInstance.treatmentPlan.findFirst.mock.calls[0][0];
      expect(findCall.orderBy.createdAt).toBe('desc');
    });
  });

  describe('updateTreatmentPlan', () => {
    it('should update plan fields', async () => {
      const updatedPlan = { ...mockTreatmentPlan, frequency: 'bi-weekly' };
      mockPrismaInstance.treatmentPlan.update.mockResolvedValue(updatedPlan);

      const result = await TreatmentPlanService.updateTreatmentPlan('plan-123', {
        frequency: 'bi-weekly',
      });

      expect(mockPrismaInstance.treatmentPlan.update).toHaveBeenCalledWith({
        where: { id: 'plan-123' },
        data: { frequency: 'bi-weekly' },
      });
      expect(result.frequency).toBe('bi-weekly');
    });

    it('should update plan status', async () => {
      const completedPlan = { ...mockTreatmentPlan, status: 'completed' };
      mockPrismaInstance.treatmentPlan.update.mockResolvedValue(completedPlan);

      const result = await TreatmentPlanService.updateTreatmentPlan('plan-123', {
        status: 'completed',
      });

      expect(result.status).toBe('completed');
    });
  });

  describe('addGoal', () => {
    it('should add a new goal to treatment plan', async () => {
      const goalInput = {
        treatmentPlanId: 'plan-123',
        title: 'Improve sleep quality',
        description: 'Target 7-8 hours per night',
        targetDate: new Date('2025-06-01'),
        strategies: ['Sleep hygiene', 'Relaxation techniques'],
        measurements: ['Sleep diary'],
      };

      const result = await TreatmentPlanService.addGoal(goalInput);

      expect(mockPrismaInstance.treatmentGoal.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          treatmentPlanId: 'plan-123',
          title: 'Improve sleep quality',
          status: 'in_progress',
          progress: 0,
        }),
      });
      expect(result).toBeDefined();
    });

    it('should set default measurements when not provided', async () => {
      const goalInput = {
        treatmentPlanId: 'plan-123',
        title: 'Improve sleep quality',
        strategies: ['Sleep hygiene'],
      };

      await TreatmentPlanService.addGoal(goalInput);

      const createCall = mockPrismaInstance.treatmentGoal.create.mock.calls[0][0];
      expect(createCall.data.measurements).toEqual([]);
    });
  });

  describe('updateGoalProgress', () => {
    it('should update goal progress', async () => {
      const updatedGoal = { ...mockTreatmentGoal, progress: 75 };
      mockPrismaInstance.treatmentGoal.update.mockResolvedValue(updatedGoal);

      const result = await TreatmentPlanService.updateGoalProgress('goal-123', {
        progress: 75,
      });

      expect(mockPrismaInstance.treatmentGoal.update).toHaveBeenCalledWith({
        where: { id: 'goal-123' },
        data: { progress: 75 },
      });
      expect(result.progress).toBe(75);
    });

    it('should update goal status', async () => {
      const achievedGoal = { ...mockTreatmentGoal, status: 'achieved' };
      mockPrismaInstance.treatmentGoal.update.mockResolvedValue(achievedGoal);

      const result = await TreatmentPlanService.updateGoalProgress('goal-123', {
        status: 'achieved',
      });

      expect(result.status).toBe('achieved');
    });

    it('should add barriers to goal', async () => {
      const goalWithBarriers = {
        ...mockTreatmentGoal,
        barriers: ['Time constraints', 'Motivation'],
      };
      mockPrismaInstance.treatmentGoal.update.mockResolvedValue(goalWithBarriers);

      const result = await TreatmentPlanService.updateGoalProgress('goal-123', {
        barriers: ['Time constraints', 'Motivation'],
      });

      expect(result.barriers).toHaveLength(2);
    });
  });

  describe('getGoalsForPlan', () => {
    it('should return all goals for a treatment plan', async () => {
      mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([
        mockTreatmentGoal,
        { ...mockTreatmentGoal, id: 'goal-456' },
      ]);

      const result = await TreatmentPlanService.getGoalsForPlan('plan-123');

      expect(mockPrismaInstance.treatmentGoal.findMany).toHaveBeenCalledWith({
        where: { treatmentPlanId: 'plan-123' },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no goals', async () => {
      mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([]);

      const result = await TreatmentPlanService.getGoalsForPlan('plan-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('calculatePlanProgress', () => {
    it('should calculate overall progress', async () => {
      mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([
        { ...mockTreatmentGoal, progress: 50, status: 'in_progress' },
        { ...mockTreatmentGoal, id: 'goal-456', progress: 100, status: 'achieved' },
      ]);

      const result = await TreatmentPlanService.calculatePlanProgress('plan-123');

      expect(result.totalGoals).toBe(2);
      expect(result.achievedGoals).toBe(1);
      expect(result.inProgressGoals).toBe(1);
      expect(result.overallProgress).toBe(75);
    });

    it('should return zero progress when no goals', async () => {
      mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([]);

      const result = await TreatmentPlanService.calculatePlanProgress('plan-123');

      expect(result.totalGoals).toBe(0);
      expect(result.overallProgress).toBe(0);
    });

    it('should round progress to nearest integer', async () => {
      mockPrismaInstance.treatmentGoal.findMany.mockResolvedValue([
        { ...mockTreatmentGoal, progress: 33, status: 'in_progress' },
        { ...mockTreatmentGoal, id: 'goal-456', progress: 67, status: 'in_progress' },
      ]);

      const result = await TreatmentPlanService.calculatePlanProgress('plan-123');

      expect(result.overallProgress).toBe(50);
    });
  });

  describe('checkPlansDueForReview', () => {
    it('should return plans with past review date', async () => {
      const overduePlan = {
        ...mockTreatmentPlan,
        reviewDate: new Date('2024-01-01'),
      };
      mockPrismaInstance.treatmentPlan.findMany.mockResolvedValue([overduePlan]);

      const result = await TreatmentPlanService.checkPlansDueForReview();

      expect(mockPrismaInstance.treatmentPlan.findMany).toHaveBeenCalledWith({
        where: {
          status: 'active',
          reviewDate: {
            lte: expect.any(Date),
          },
        },
      });
      expect(result).toHaveLength(1);
    });

    it('should only check active plans', async () => {
      mockPrismaInstance.treatmentPlan.findMany.mockResolvedValue([]);

      await TreatmentPlanService.checkPlansDueForReview();

      const findCall = mockPrismaInstance.treatmentPlan.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('active');
    });

    it('should return empty array when no plans due', async () => {
      mockPrismaInstance.treatmentPlan.findMany.mockResolvedValue([]);

      const result = await TreatmentPlanService.checkPlansDueForReview();

      expect(result).toHaveLength(0);
    });
  });
});
