/**
 * Unit Tests for TreatmentPlanService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TreatmentPlanService } from '../../../src/services/TreatmentPlanService';
import { mockPrismaClient } from '../helpers/mocks';
import {
  mockTreatmentPlan,
  mockTreatmentGoal,
  mockCreateTreatmentPlanInput,
} from '../helpers/fixtures';

// Mock the Prisma client
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
}));

describe('TreatmentPlanService', () => {
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    vi.clearAllMocks();

    // Setup default mock implementations
    mockPrisma.treatmentPlan.create.mockResolvedValue(mockTreatmentPlan);
    mockPrisma.treatmentPlan.findUnique.mockResolvedValue(mockTreatmentPlan);
    mockPrisma.treatmentPlan.findFirst.mockResolvedValue(mockTreatmentPlan);
    mockPrisma.treatmentPlan.update.mockResolvedValue(mockTreatmentPlan);
    mockPrisma.treatmentGoal.create.mockResolvedValue(mockTreatmentGoal);
    mockPrisma.treatmentGoal.findMany.mockResolvedValue([mockTreatmentGoal]);
  });

  describe('createTreatmentPlan', () => {
    it('should create a treatment plan with goals', async () => {
      const result = await TreatmentPlanService.createTreatmentPlan(mockCreateTreatmentPlanInput);

      expect(mockPrisma.treatmentPlan.create).toHaveBeenCalledWith({
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

      expect(mockPrisma.treatmentGoal.create).toHaveBeenCalled();
    });

    it('should not create goals when empty array provided', async () => {
      const inputWithNoGoals = {
        ...mockCreateTreatmentPlanInput,
        goals: [],
      };

      await TreatmentPlanService.createTreatmentPlan(inputWithNoGoals);

      expect(mockPrisma.treatmentGoal.create).not.toHaveBeenCalled();
    });

    it('should set initial goal status to in_progress', async () => {
      await TreatmentPlanService.createTreatmentPlan(mockCreateTreatmentPlanInput);

      const createCall = mockPrisma.treatmentGoal.create.mock.calls[0][0];
      expect(createCall.data.status).toBe('in_progress');
      expect(createCall.data.progress).toBe(0);
    });
  });

  describe('getTreatmentPlanWithGoals', () => {
    it('should return plan with associated goals', async () => {
      mockPrisma.treatmentPlan.findUnique.mockResolvedValue(mockTreatmentPlan);
      mockPrisma.treatmentGoal.findMany.mockResolvedValue([mockTreatmentGoal]);

      const result = await TreatmentPlanService.getTreatmentPlanWithGoals('plan-123');

      expect(result).toBeDefined();
      expect(result?.goalRecords).toHaveLength(1);
    });

    it('should return null when plan not found', async () => {
      mockPrisma.treatmentPlan.findUnique.mockResolvedValue(null);

      const result = await TreatmentPlanService.getTreatmentPlanWithGoals('non-existent');

      expect(result).toBeNull();
    });

    it('should order goals by creation date', async () => {
      await TreatmentPlanService.getTreatmentPlanWithGoals('plan-123');

      const findCall = mockPrisma.treatmentGoal.findMany.mock.calls[0][0];
      expect(findCall.orderBy.createdAt).toBe('asc');
    });
  });

  describe('getActivePlanForPatient', () => {
    it('should return active plan for patient', async () => {
      mockPrisma.treatmentPlan.findFirst.mockResolvedValue(mockTreatmentPlan);
      mockPrisma.treatmentGoal.findMany.mockResolvedValue([mockTreatmentGoal]);

      const result = await TreatmentPlanService.getActivePlanForPatient('patient-123');

      expect(mockPrisma.treatmentPlan.findFirst).toHaveBeenCalledWith({
        where: {
          patientId: 'patient-123',
          status: 'active',
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result?.status).toBe('active');
    });

    it('should return null when no active plan exists', async () => {
      mockPrisma.treatmentPlan.findFirst.mockResolvedValue(null);

      const result = await TreatmentPlanService.getActivePlanForPatient('patient-123');

      expect(result).toBeNull();
    });

    it('should get the most recent active plan', async () => {
      await TreatmentPlanService.getActivePlanForPatient('patient-123');

      const findCall = mockPrisma.treatmentPlan.findFirst.mock.calls[0][0];
      expect(findCall.orderBy.createdAt).toBe('desc');
    });
  });

  describe('updateTreatmentPlan', () => {
    it('should update plan fields', async () => {
      const updatedPlan = { ...mockTreatmentPlan, frequency: 'bi-weekly' };
      mockPrisma.treatmentPlan.update.mockResolvedValue(updatedPlan);

      const result = await TreatmentPlanService.updateTreatmentPlan('plan-123', {
        frequency: 'bi-weekly',
      });

      expect(mockPrisma.treatmentPlan.update).toHaveBeenCalledWith({
        where: { id: 'plan-123' },
        data: { frequency: 'bi-weekly' },
      });
      expect(result.frequency).toBe('bi-weekly');
    });

    it('should update plan status', async () => {
      const completedPlan = { ...mockTreatmentPlan, status: 'completed' };
      mockPrisma.treatmentPlan.update.mockResolvedValue(completedPlan);

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

      expect(mockPrisma.treatmentGoal.create).toHaveBeenCalledWith({
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

      const createCall = mockPrisma.treatmentGoal.create.mock.calls[0][0];
      expect(createCall.data.measurements).toEqual([]);
    });
  });

  describe('updateGoalProgress', () => {
    it('should update goal progress', async () => {
      const updatedGoal = { ...mockTreatmentGoal, progress: 75 };
      mockPrisma.treatmentGoal.update.mockResolvedValue(updatedGoal);

      const result = await TreatmentPlanService.updateGoalProgress('goal-123', {
        progress: 75,
      });

      expect(mockPrisma.treatmentGoal.update).toHaveBeenCalledWith({
        where: { id: 'goal-123' },
        data: { progress: 75 },
      });
      expect(result.progress).toBe(75);
    });

    it('should update goal status', async () => {
      const achievedGoal = { ...mockTreatmentGoal, status: 'achieved' };
      mockPrisma.treatmentGoal.update.mockResolvedValue(achievedGoal);

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
      mockPrisma.treatmentGoal.update.mockResolvedValue(goalWithBarriers);

      const result = await TreatmentPlanService.updateGoalProgress('goal-123', {
        barriers: ['Time constraints', 'Motivation'],
      });

      expect(result.barriers).toHaveLength(2);
    });
  });

  describe('getGoalsForPlan', () => {
    it('should return all goals for a treatment plan', async () => {
      mockPrisma.treatmentGoal.findMany.mockResolvedValue([
        mockTreatmentGoal,
        { ...mockTreatmentGoal, id: 'goal-456' },
      ]);

      const result = await TreatmentPlanService.getGoalsForPlan('plan-123');

      expect(mockPrisma.treatmentGoal.findMany).toHaveBeenCalledWith({
        where: { treatmentPlanId: 'plan-123' },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no goals', async () => {
      mockPrisma.treatmentGoal.findMany.mockResolvedValue([]);

      const result = await TreatmentPlanService.getGoalsForPlan('plan-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('calculatePlanProgress', () => {
    it('should calculate overall progress', async () => {
      mockPrisma.treatmentGoal.findMany.mockResolvedValue([
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
      mockPrisma.treatmentGoal.findMany.mockResolvedValue([]);

      const result = await TreatmentPlanService.calculatePlanProgress('plan-123');

      expect(result.totalGoals).toBe(0);
      expect(result.overallProgress).toBe(0);
    });

    it('should round progress to nearest integer', async () => {
      mockPrisma.treatmentGoal.findMany.mockResolvedValue([
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
      mockPrisma.treatmentPlan.findMany.mockResolvedValue([overduePlan]);

      const result = await TreatmentPlanService.checkPlansDueForReview();

      expect(mockPrisma.treatmentPlan.findMany).toHaveBeenCalledWith({
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
      mockPrisma.treatmentPlan.findMany.mockResolvedValue([]);

      await TreatmentPlanService.checkPlansDueForReview();

      const findCall = mockPrisma.treatmentPlan.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('active');
    });

    it('should return empty array when no plans due', async () => {
      mockPrisma.treatmentPlan.findMany.mockResolvedValue([]);

      const result = await TreatmentPlanService.checkPlansDueForReview();

      expect(result).toHaveLength(0);
    });
  });
});
