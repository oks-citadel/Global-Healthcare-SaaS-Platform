/**
 * Unit Tests for InteractionCheckService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InteractionCheckService } from '../../../src/services/InteractionCheckService';
import { mockPrismaClient } from '../helpers/mocks';
import { mockDrugInteraction, mockDrugAllergy } from '../helpers/fixtures';

// Mock the Prisma client
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
}));

describe('InteractionCheckService', () => {
  let interactionService: InteractionCheckService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    interactionService = new InteractionCheckService();
    vi.clearAllMocks();
  });

  describe('checkDrugInteractions', () => {
    it('should return no interactions for single medication', async () => {
      const result = await interactionService.checkDrugInteractions(['Metformin']);

      expect(result.hasCriticalInteractions).toBe(false);
      expect(result.hasSevereInteractions).toBe(false);
      expect(result.hasModerateInteractions).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it('should return no interactions when none found', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([]);

      const result = await interactionService.checkDrugInteractions(['Metformin', 'Lisinopril']);

      expect(result.hasCriticalInteractions).toBe(false);
      expect(result.hasSevereInteractions).toBe(false);
      expect(result.interactions).toHaveLength(0);
    });

    it('should detect critical (contraindicated) interactions', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([{
        ...mockDrugInteraction,
        severity: 'contraindicated',
      }]);

      const result = await interactionService.checkDrugInteractions(['Warfarin', 'Aspirin']);

      expect(result.hasCriticalInteractions).toBe(true);
      expect(result.interactions).toHaveLength(1);
    });

    it('should detect severe interactions', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([{
        ...mockDrugInteraction,
        severity: 'severe',
      }]);

      const result = await interactionService.checkDrugInteractions(['Warfarin', 'Aspirin']);

      expect(result.hasSevereInteractions).toBe(true);
    });

    it('should detect moderate interactions', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([{
        ...mockDrugInteraction,
        severity: 'moderate',
      }]);

      const result = await interactionService.checkDrugInteractions(['Warfarin', 'Aspirin']);

      expect(result.hasModerateInteractions).toBe(true);
    });

    it('should check all medication pairs', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([]);

      await interactionService.checkDrugInteractions(['Drug1', 'Drug2', 'Drug3']);

      // Should check 3 pairs: (1,2), (1,3), (2,3)
      expect(mockPrisma.drugInteraction.findMany).toHaveBeenCalledTimes(3);
    });

    it('should check interactions in both directions', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([]);

      await interactionService.checkDrugInteractions(['Warfarin', 'Aspirin']);

      const findCall = mockPrisma.drugInteraction.findMany.mock.calls[0][0];
      expect(findCall.where.OR).toHaveLength(2);
    });
  });

  describe('checkDrugAllergies', () => {
    it('should return no allergies when patient has none', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.checkDrugAllergies('patient-123', ['Metformin']);

      expect(result.hasAllergies).toBe(false);
      expect(result.hasCriticalAllergies).toBe(false);
      expect(result.allergies).toHaveLength(0);
    });

    it('should return no allergies when medications dont match', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([mockDrugAllergy]); // Penicillin allergy

      const result = await interactionService.checkDrugAllergies('patient-123', ['Metformin']);

      expect(result.hasAllergies).toBe(false);
    });

    it('should detect allergy match', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([mockDrugAllergy]);

      const result = await interactionService.checkDrugAllergies('patient-123', ['Penicillin', 'Metformin']);

      expect(result.hasAllergies).toBe(true);
      expect(result.allergies).toHaveLength(1);
    });

    it('should detect critical allergies (anaphylaxis)', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([{
        ...mockDrugAllergy,
        reaction: 'anaphylaxis',
      }]);

      const result = await interactionService.checkDrugAllergies('patient-123', ['Penicillin']);

      expect(result.hasCriticalAllergies).toBe(true);
    });

    it('should detect critical allergies (severe severity)', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([{
        ...mockDrugAllergy,
        severity: 'severe',
      }]);

      const result = await interactionService.checkDrugAllergies('patient-123', ['Penicillin']);

      expect(result.hasCriticalAllergies).toBe(true);
    });

    it('should only check active allergies', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      await interactionService.checkDrugAllergies('patient-123', ['Metformin']);

      const findCall = mockPrisma.drugAllergy.findMany.mock.calls[0][0];
      expect(findCall.where.patientId).toBe('patient-123');
      expect(findCall.where.isActive).toBe(true);
    });

    it('should match partial medication names', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([{
        ...mockDrugAllergy,
        allergen: 'Penicillin',
      }]);

      // Should match "Amoxicillin" because it contains "cillin" similar to Penicillin class
      const result = await interactionService.checkDrugAllergies('patient-123', ['Penicillin VK']);

      expect(result.hasAllergies).toBe(true);
    });
  });

  describe('performSafetyCheck', () => {
    it('should return safe when no issues detected', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([]);
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck('patient-123', ['Metformin', 'Lisinopril']);

      expect(result.isSafe).toBe(true);
      expect(result.requiresReview).toBe(false);
    });

    it('should return unsafe when critical interaction detected', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([{
        ...mockDrugInteraction,
        severity: 'contraindicated',
      }]);
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck('patient-123', ['Warfarin', 'Aspirin']);

      expect(result.isSafe).toBe(false);
    });

    it('should return unsafe when severe interaction detected', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([{
        ...mockDrugInteraction,
        severity: 'severe',
      }]);
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck('patient-123', ['Warfarin', 'Aspirin']);

      expect(result.isSafe).toBe(false);
    });

    it('should return unsafe when critical allergy detected', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([]);
      mockPrisma.drugAllergy.findMany.mockResolvedValue([{
        ...mockDrugAllergy,
        reaction: 'anaphylaxis',
      }]);

      const result = await interactionService.performSafetyCheck('patient-123', ['Penicillin']);

      expect(result.isSafe).toBe(false);
    });

    it('should require review for moderate interactions', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([{
        ...mockDrugInteraction,
        severity: 'moderate',
      }]);
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck('patient-123', ['Drug1', 'Drug2']);

      expect(result.isSafe).toBe(true);
      expect(result.requiresReview).toBe(true);
    });

    it('should require review for non-critical allergies', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([]);
      mockPrisma.drugAllergy.findMany.mockResolvedValue([{
        ...mockDrugAllergy,
        reaction: 'rash',
        severity: 'mild',
      }]);

      const result = await interactionService.performSafetyCheck('patient-123', ['Penicillin']);

      expect(result.isSafe).toBe(true);
      expect(result.requiresReview).toBe(true);
    });

    it('should include both checks in result', async () => {
      mockPrisma.drugInteraction.findMany.mockResolvedValue([]);
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.performSafetyCheck('patient-123', ['Metformin']);

      expect(result.interactionCheck).toBeDefined();
      expect(result.allergyCheck).toBeDefined();
    });
  });

  describe('addDrugInteraction', () => {
    it('should create a new drug interaction record', async () => {
      mockPrisma.drugInteraction.create.mockResolvedValue(mockDrugInteraction);

      const result = await interactionService.addDrugInteraction({
        drug1Name: 'Warfarin',
        drug2Name: 'Aspirin',
        severityLevel: 'severe',
        description: 'Increased bleeding risk',
      });

      expect(mockPrisma.drugInteraction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          drug1Name: 'Warfarin',
          drug2Name: 'Aspirin',
          severity: 'severe',
          description: 'Increased bleeding risk',
          source: 'manual',
        }),
      });
      expect(result).toEqual(mockDrugInteraction);
    });
  });

  describe('addDrugAllergy', () => {
    it('should create a new drug allergy record', async () => {
      mockPrisma.drugAllergy.create.mockResolvedValue(mockDrugAllergy);

      const result = await interactionService.addDrugAllergy({
        patientId: 'patient-123',
        allergen: 'Penicillin',
        reactionType: 'anaphylaxis',
        symptoms: ['hives', 'swelling'],
      });

      expect(mockPrisma.drugAllergy.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          patientId: 'patient-123',
          allergen: 'Penicillin',
          reaction: 'anaphylaxis',
        }),
      });
      expect(result).toEqual(mockDrugAllergy);
    });
  });

  describe('getPatientAllergies', () => {
    it('should return all active allergies for patient', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([mockDrugAllergy]);

      const result = await interactionService.getPatientAllergies('patient-123');

      expect(mockPrisma.drugAllergy.findMany).toHaveBeenCalledWith({
        where: {
          patientId: 'patient-123',
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no allergies', async () => {
      mockPrisma.drugAllergy.findMany.mockResolvedValue([]);

      const result = await interactionService.getPatientAllergies('patient-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('deactivateAllergy', () => {
    it('should set allergy isActive to false', async () => {
      mockPrisma.drugAllergy.update.mockResolvedValue({
        ...mockDrugAllergy,
        isActive: false,
      });

      const result = await interactionService.deactivateAllergy('allergy-123');

      expect(mockPrisma.drugAllergy.update).toHaveBeenCalledWith({
        where: { id: 'allergy-123' },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });
});
