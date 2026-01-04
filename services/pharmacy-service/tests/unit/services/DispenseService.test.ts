/**
 * Unit Tests for DispenseService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DispenseService } from '../../../src/services/DispenseService';
import { mockPrismaClient } from '../helpers/mocks';
import {
  mockPrescription,
  mockPrescriptionItem,
  mockControlledPrescriptionItem,
  mockMedication,
  mockControlledMedication,
  mockDispensing,
  mockPharmacy,
  mockDispenseRequest,
} from '../helpers/fixtures';

// Mock the Prisma client
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
}));

// Mock dependent services
vi.mock('../../../src/services/InteractionCheckService', () => ({
  default: {
    performSafetyCheck: vi.fn(() => Promise.resolve({
      isSafe: true,
      requiresReview: false,
      interactionCheck: { hasCriticalInteractions: false, hasSevereInteractions: false },
      allergyCheck: { hasAllergies: false, hasCriticalAllergies: false },
    })),
  },
}));

vi.mock('../../../src/services/InventoryService', () => ({
  default: {
    checkAvailability: vi.fn(() => Promise.resolve(true)),
    decrementInventory: vi.fn(() => Promise.resolve({ success: true })),
  },
}));

vi.mock('../../../src/services/PDMPService', () => ({
  default: {
    checkPDMP: vi.fn(() => Promise.resolve({ requiresIntervention: false, alerts: [] })),
    reportToPDMP: vi.fn(() => Promise.resolve({ success: true })),
  },
}));

describe('DispenseService', () => {
  let dispenseService: DispenseService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(async () => {
    mockPrisma = mockPrismaClient();
    dispenseService = new DispenseService();
    vi.clearAllMocks();

    // Reset mocks to default successful behavior
    const InteractionCheckService = await import('../../../src/services/InteractionCheckService');
    const InventoryService = await import('../../../src/services/InventoryService');
    const PDMPService = await import('../../../src/services/PDMPService');

    vi.mocked(InteractionCheckService.default.performSafetyCheck).mockResolvedValue({
      isSafe: true,
      requiresReview: false,
      interactionCheck: { hasCriticalInteractions: false, hasSevereInteractions: false, hasModerateInteractions: false, interactions: [] },
      allergyCheck: { hasAllergies: false, hasCriticalAllergies: false, allergies: [] },
    });
    vi.mocked(InventoryService.default.checkAvailability).mockResolvedValue(true);
    vi.mocked(InventoryService.default.decrementInventory).mockResolvedValue({ success: true, quantityDeducted: 30 });
    vi.mocked(PDMPService.default.checkPDMP).mockResolvedValue({ requiresIntervention: false, alerts: [] });
    vi.mocked(PDMPService.default.reportToPDMP).mockResolvedValue({ success: true });
  });

  describe('dispenseMedication', () => {
    beforeEach(() => {
      // Setup common mock returns
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [mockPrescriptionItem],
      });
      mockPrisma.medication.findUnique.mockResolvedValue(mockMedication);
      mockPrisma.dispensing.create.mockResolvedValue(mockDispensing);
      mockPrisma.dispensing.findMany.mockResolvedValue([]);
      mockPrisma.prescriptionItem.update.mockResolvedValue({
        ...mockPrescriptionItem,
        refillsUsed: 1,
      });
    });

    it('should dispense medication successfully', async () => {
      const result = await dispenseService.dispenseMedication(mockDispenseRequest);

      expect(result).toBeDefined();
      expect(result.dispensing).toBeDefined();
      expect(result.safetyCheck.isSafe).toBe(true);
    });

    it('should throw error when prescription not found', async () => {
      mockPrisma.prescription.findUnique.mockResolvedValue(null);

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('Prescription not found');
    });

    it('should throw error when prescription is not active', async () => {
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        status: 'cancelled',
        items: [mockPrescriptionItem],
      });

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('Prescription status is cancelled');
    });

    it('should throw error when prescription is expired', async () => {
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        validUntil: new Date('2020-01-01'),
        items: [mockPrescriptionItem],
      });

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('Prescription has expired');
    });

    it('should throw error when prescription item not found', async () => {
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [],
      });

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('Prescription item not found');
    });

    it('should throw error when no refills remaining', async () => {
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [{
          ...mockPrescriptionItem,
          refillsAllowed: 2,
          refillsUsed: 2,
        }],
      });

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('No refills remaining');
    });

    it('should throw error when medication not found', async () => {
      mockPrisma.medication.findUnique.mockResolvedValue(null);

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('Medication not found');
    });

    it('should throw error when inventory is insufficient', async () => {
      const InventoryService = await import('../../../src/services/InventoryService');
      vi.mocked(InventoryService.default.checkAvailability).mockResolvedValue(false);

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('Insufficient inventory');
    });

    it('should throw error when drug interaction detected', async () => {
      const InteractionCheckService = await import('../../../src/services/InteractionCheckService');
      vi.mocked(InteractionCheckService.default.performSafetyCheck).mockResolvedValue({
        isSafe: false,
        requiresReview: true,
        interactionCheck: { hasCriticalInteractions: true, hasSevereInteractions: false, hasModerateInteractions: false, interactions: [] },
        allergyCheck: { hasAllergies: false, hasCriticalAllergies: false, allergies: [] },
      });

      await expect(dispenseService.dispenseMedication(mockDispenseRequest))
        .rejects.toThrow('Critical drug interaction or allergy detected');
    });

    it('should create controlled substance log for scheduled medications', async () => {
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [mockControlledPrescriptionItem],
      });
      mockPrisma.medication.findUnique.mockResolvedValue(mockControlledMedication);
      mockPrisma.pharmacy.findUnique.mockResolvedValue(mockPharmacy);
      mockPrisma.controlledSubstanceLog.create.mockResolvedValue({
        id: 'log-123',
        patientId: 'patient-123',
        prescriberId: 'provider-123',
        pharmacistId: 'pharmacist-123',
        medicationName: 'Oxycodone',
        ndcCode: '0999-0000-01',
        schedule: 'II',
        quantity: 30,
        dispenseDate: new Date(),
        prescriptionDate: new Date(),
        refillNumber: 0,
      });

      const result = await dispenseService.dispenseMedication({
        ...mockDispenseRequest,
        prescriptionItemId: 'item-controlled-123',
      });

      expect(result.controlledSubstanceLog).toBeDefined();
    });

    it('should throw error when PDMP check requires intervention', async () => {
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        items: [mockControlledPrescriptionItem],
      });
      mockPrisma.medication.findUnique.mockResolvedValue(mockControlledMedication);

      const PDMPService = await import('../../../src/services/PDMPService');
      vi.mocked(PDMPService.default.checkPDMP).mockResolvedValue({
        requiresIntervention: true,
        alerts: ['Patient has multiple controlled substance prescriptions'],
      });

      await expect(dispenseService.dispenseMedication({
        ...mockDispenseRequest,
        prescriptionItemId: 'item-controlled-123',
      })).rejects.toThrow('PDMP alert');
    });

    it('should increment refill count after dispensing', async () => {
      await dispenseService.dispenseMedication(mockDispenseRequest);

      expect(mockPrisma.prescriptionItem.update).toHaveBeenCalledWith({
        where: { id: 'item-123' },
        data: { refillsUsed: { increment: 1 } },
      });
    });
  });

  describe('getPatientDispensingHistory', () => {
    it('should return patient dispensing history', async () => {
      mockPrisma.dispensing.findMany.mockResolvedValue([mockDispensing]);

      const result = await dispenseService.getPatientDispensingHistory('patient-123');

      expect(mockPrisma.dispensing.findMany).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
        orderBy: { dispensedAt: 'desc' },
        take: 50,
      });
      expect(result).toHaveLength(1);
    });

    it('should respect limit parameter', async () => {
      mockPrisma.dispensing.findMany.mockResolvedValue([]);

      await dispenseService.getPatientDispensingHistory('patient-123', 10);

      const findCall = mockPrisma.dispensing.findMany.mock.calls[0][0];
      expect(findCall.take).toBe(10);
    });
  });

  describe('getPatientCurrentMedications', () => {
    it('should return medications dispensed in last 90 days', async () => {
      mockPrisma.dispensing.findMany.mockResolvedValue([
        { ...mockDispensing, medicationName: 'Metformin' },
        { ...mockDispensing, medicationName: 'Lisinopril' },
      ]);

      const result = await dispenseService.getPatientCurrentMedications('patient-123');

      expect(result).toEqual(['Metformin', 'Lisinopril']);
    });

    it('should return empty array when no recent dispensings', async () => {
      mockPrisma.dispensing.findMany.mockResolvedValue([]);

      const result = await dispenseService.getPatientCurrentMedications('patient-123');

      expect(result).toEqual([]);
    });
  });

  describe('getDispensing', () => {
    it('should return dispensing record by id', async () => {
      mockPrisma.dispensing.findUnique.mockResolvedValue(mockDispensing);

      const result = await dispenseService.getDispensing('dispensing-123');

      expect(mockPrisma.dispensing.findUnique).toHaveBeenCalledWith({
        where: { id: 'dispensing-123' },
      });
      expect(result).toEqual(mockDispensing);
    });

    it('should return null when dispensing not found', async () => {
      mockPrisma.dispensing.findUnique.mockResolvedValue(null);

      const result = await dispenseService.getDispensing('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateDispensingStatus', () => {
    it('should update dispensing status', async () => {
      const updatedDispensing = { ...mockDispensing, status: 'cancelled' };
      mockPrisma.dispensing.update.mockResolvedValue(updatedDispensing);

      const result = await dispenseService.updateDispensingStatus('dispensing-123', 'cancelled');

      expect(mockPrisma.dispensing.update).toHaveBeenCalledWith({
        where: { id: 'dispensing-123' },
        data: { status: 'cancelled' },
      });
      expect(result.status).toBe('cancelled');
    });
  });

  describe('returnMedication', () => {
    it('should process medication return successfully', async () => {
      mockPrisma.dispensing.findUnique.mockResolvedValue(mockDispensing);
      mockPrisma.dispensing.update.mockResolvedValue(mockDispensing);

      const result = await dispenseService.returnMedication('dispensing-123', 10);

      expect(result.success).toBe(true);
      expect(result.quantityReturned).toBe(10);
    });

    it('should throw error when dispensing record not found', async () => {
      mockPrisma.dispensing.findUnique.mockResolvedValue(null);

      await expect(dispenseService.returnMedication('non-existent', 10))
        .rejects.toThrow('Dispensing record not found');
    });

    it('should throw error when return quantity exceeds dispensed', async () => {
      mockPrisma.dispensing.findUnique.mockResolvedValue({
        ...mockDispensing,
        quantity: 30,
      });

      await expect(dispenseService.returnMedication('dispensing-123', 50))
        .rejects.toThrow('Cannot return more than dispensed quantity');
    });

    it('should update dispensing notes with return information', async () => {
      mockPrisma.dispensing.findUnique.mockResolvedValue(mockDispensing);
      mockPrisma.dispensing.update.mockResolvedValue(mockDispensing);

      await dispenseService.returnMedication('dispensing-123', 10);

      const updateCall = mockPrisma.dispensing.update.mock.calls[0][0];
      expect(updateCall.data.notes).toContain('Returned 10 units');
    });
  });
});
