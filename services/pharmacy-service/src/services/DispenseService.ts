import { PrismaClient, DispensingStatus } from '@prisma/client';
import InteractionCheckService from './InteractionCheckService';
import InventoryService from './InventoryService';
import PDMPService from './PDMPService';

const prisma = new PrismaClient();

export interface DispenseRequest {
  prescriptionId: string;
  prescriptionItemId: string;
  medicationId: string;
  patientId: string;
  pharmacyId: string;
  pharmacistId: string;
  quantityDispensed: number;
  ndcCode?: string;
  lotNumber?: string;
  expirationDate?: Date;
  daysSupply?: number;
  priorAuthId?: string;
  notes?: string;
}

export class DispenseService {
  /**
   * Dispense medication with full safety checks
   */
  async dispenseMedication(request: DispenseRequest) {
    // 1. Verify prescription is valid
    const prescription = await prisma.prescription.findUnique({
      where: { id: request.prescriptionId },
      include: { items: true },
    });

    if (!prescription) {
      throw new Error('Prescription not found');
    }

    if (prescription.status !== 'active') {
      throw new Error(`Prescription status is ${prescription.status}`);
    }

    if (prescription.validUntil && prescription.validUntil < new Date()) {
      throw new Error('Prescription has expired');
    }

    // 2. Verify prescription item
    const prescriptionItem = prescription.items.find(
      (item) => item.id === request.prescriptionItemId
    );

    if (!prescriptionItem) {
      throw new Error('Prescription item not found');
    }

    // 3. Check refills remaining
    if (prescriptionItem.refillsUsed >= prescriptionItem.refillsAllowed) {
      throw new Error('No refills remaining');
    }

    // 4. Get medication details
    const medication = await prisma.medication.findUnique({
      where: { id: request.medicationId },
    });

    if (!medication) {
      throw new Error('Medication not found');
    }

    // 5. Check inventory
    const inventoryAvailable = await InventoryService.checkAvailability(
      request.medicationId,
      request.pharmacyId,
      request.quantityDispensed
    );

    if (!inventoryAvailable) {
      throw new Error('Insufficient inventory');
    }

    // 6. Perform safety checks
    const patientMedications = await this.getPatientCurrentMedications(
      request.patientId
    );
    const allMedications = [...patientMedications, medication.name];

    const safetyCheck = await InteractionCheckService.performSafetyCheck(
      request.patientId,
      allMedications
    );

    if (!safetyCheck.isSafe) {
      throw new Error(
        'Critical drug interaction or allergy detected. Pharmacist review required.'
      );
    }

    // 7. Check if controlled substance requires PDMP check
    let controlledSubstanceLog = null;
    if (medication.isControlled && medication.deaSchedule) {
      const pdmpCheck = await PDMPService.checkPDMP(
        request.patientId,
        medication.deaSchedule
      );

      if (pdmpCheck.requiresIntervention) {
        throw new Error(
          `PDMP alert: ${pdmpCheck.alerts.join(', ')}. Cannot dispense.`
        );
      }
    }

    // 8. Create dispensing record
    const dispensing = await prisma.dispensing.create({
      data: {
        prescriptionId: request.prescriptionId,
        prescriptionItemId: request.prescriptionItemId,
        medicationId: request.medicationId,
        patientId: request.patientId,
        pharmacyId: request.pharmacyId,
        pharmacistId: request.pharmacistId,
        quantityDispensed: request.quantityDispensed,
        ndcCode: request.ndcCode,
        lotNumber: request.lotNumber,
        expirationDate: request.expirationDate,
        daysSupply: request.daysSupply,
        refillNumber: prescriptionItem.refillsUsed,
        priorAuthId: request.priorAuthId,
        status: 'dispensed',
        notes: request.notes,
        interactionChecks: safetyCheck.interactionCheck,
        allergyChecks: safetyCheck.allergyCheck,
      },
    });

    // 9. Update inventory
    await InventoryService.decrementInventory(
      request.medicationId,
      request.pharmacyId,
      request.quantityDispensed,
      request.lotNumber
    );

    // 10. Increment refill count
    await prisma.prescriptionItem.update({
      where: { id: request.prescriptionItemId },
      data: { refillsUsed: { increment: 1 } },
    });

    // 11. Create controlled substance log if applicable
    if (medication.isControlled && medication.deaSchedule) {
      const pharmacy = await prisma.pharmacy.findUnique({
        where: { id: request.pharmacyId },
      });

      controlledSubstanceLog = await prisma.controlledSubstanceLog.create({
        data: {
          dispensingId: dispensing.id,
          patientId: request.patientId,
          prescriberId: prescription.providerId,
          pharmacistId: request.pharmacistId,
          medicationName: medication.name,
          ndcCode: request.ndcCode,
          deaSchedule: medication.deaSchedule,
          quantityDispensed: request.quantityDispensed,
          dispenseDate: new Date(),
          prescriptionDate: prescription.createdAt,
          refillNumber: prescriptionItem.refillsUsed,
          pharmacyDEA: pharmacy?.deaNumber || undefined,
        },
      });

      // Report to PDMP
      await PDMPService.reportToPDMP(controlledSubstanceLog.id);
    }

    return {
      dispensing,
      controlledSubstanceLog,
      safetyCheck,
    };
  }

  /**
   * Get dispensing history for a patient
   */
  async getPatientDispensingHistory(patientId: string, limit = 50) {
    return await prisma.dispensing.findMany({
      where: { patientId },
      include: {
        medication: true,
        priorAuth: true,
      },
      orderBy: { dispenseDate: 'desc' },
      take: limit,
    });
  }

  /**
   * Get current medications for a patient (dispensed in last 90 days)
   */
  async getPatientCurrentMedications(patientId: string): Promise<string[]> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const recentDispensings = await prisma.dispensing.findMany({
      where: {
        patientId,
        dispenseDate: {
          gte: ninetyDaysAgo,
        },
        status: 'dispensed',
      },
      include: {
        medication: true,
      },
    });

    return recentDispensings.map((d) => d.medication.name);
  }

  /**
   * Get dispensing details
   */
  async getDispensing(id: string) {
    return await prisma.dispensing.findUnique({
      where: { id },
      include: {
        medication: true,
        priorAuth: true,
        controlledSubstanceLog: true,
      },
    });
  }

  /**
   * Update dispensing status
   */
  async updateDispensingStatus(id: string, status: DispensingStatus) {
    return await prisma.dispensing.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Return medication (reverse dispensing)
   */
  async returnMedication(dispensingId: string, quantityReturned: number) {
    const dispensing = await prisma.dispensing.findUnique({
      where: { id: dispensingId },
    });

    if (!dispensing) {
      throw new Error('Dispensing record not found');
    }

    if (quantityReturned > dispensing.quantityDispensed) {
      throw new Error('Cannot return more than dispensed quantity');
    }

    // Update dispensing status
    await prisma.dispensing.update({
      where: { id: dispensingId },
      data: {
        status: 'returned',
        notes: `${dispensing.notes || ''}\nReturned ${quantityReturned} units`,
      },
    });

    // Return to inventory
    if (dispensing.lotNumber) {
      await InventoryService.incrementInventory(
        dispensing.medicationId,
        dispensing.pharmacyId,
        quantityReturned,
        dispensing.lotNumber
      );
    }

    return { success: true, quantityReturned };
  }
}

export default new DispenseService();
