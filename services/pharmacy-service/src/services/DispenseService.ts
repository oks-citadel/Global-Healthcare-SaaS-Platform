import { PrismaClient } from '../generated/client';

// Define status enum locally since it may not exist in Prisma schema
type DispensingStatus = 'pending' | 'completed' | 'cancelled' | 'returned';
import InteractionCheckService from './InteractionCheckService';
import InventoryService from './InventoryService';
import PDMPService from './PDMPService';

const prisma = new PrismaClient();

// Type for controlled substance log records
type ControlledSubstanceLogRecord = Awaited<ReturnType<typeof prisma.controlledSubstanceLog.create>> | null;

export interface DispenseRequest {
  prescriptionId: string;
  prescriptionItemId: string;
  medicationId: string;
  patientId: string;
  pharmacyId: string;
  pharmacistId: string;
  quantity: number;
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
      request.quantity
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
    let controlledSubstanceLog: ControlledSubstanceLogRecord = null;
    if (medication.isControlled && medication.schedule) {
      const pdmpCheck = await PDMPService.checkPDMP(
        request.patientId,
        medication.schedule
      );

      if (pdmpCheck.requiresIntervention) {
        throw new Error(
          `PDMP alert: ${pdmpCheck.alerts.join(', ')}. Cannot dispense.`
        );
      }
    }

    // 8. Create dispensing record
    const dispensing = await (prisma.dispensing.create as any)({
      data: {
        prescriptionId: request.prescriptionId,
        medicationName: medication.name,
        patientId: request.patientId,
        pharmacyId: request.pharmacyId,
        pharmacist: request.pharmacistId,
        quantity: request.quantity,
        notes: request.notes,
        priorAuthorizationId: request.priorAuthId,
      },
    });

    // 9. Update inventory
    await InventoryService.decrementInventory(
      request.medicationId,
      request.pharmacyId,
      request.quantity,
      request.lotNumber
    );

    // 10. Increment refill count
    await prisma.prescriptionItem.update({
      where: { id: request.prescriptionItemId },
      data: { refillsUsed: { increment: 1 } },
    });

    // 11. Create controlled substance log if applicable
    if (medication.isControlled && medication.schedule) {
      const pharmacy = await prisma.pharmacy.findUnique({
        where: { id: request.pharmacyId },
      });

      controlledSubstanceLog = await (prisma.controlledSubstanceLog.create as any)({
        data: {
          patientId: request.patientId,
          prescriberId: prescription.providerId,
          pharmacistId: request.pharmacistId,
          medicationName: medication.name,
          ndcCode: request.ndcCode,
          schedule: medication.schedule,
          quantity: request.quantity,
          dispenseDate: new Date(),
          prescriptionDate: prescription.createdAt,
          refillNumber: prescriptionItem.refillsUsed,
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
    return await (prisma.dispensing.findMany as any)({
      where: { patientId },
      orderBy: { dispensedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get current medications for a patient (dispensed in last 90 days)
   */
  async getPatientCurrentMedications(patientId: string): Promise<string[]> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const recentDispensings = await (prisma.dispensing.findMany as any)({
      where: {
        patientId,
        dispensedAt: {
          gte: ninetyDaysAgo,
        },
      },
    });

    return recentDispensings.map((d: any) => d.medicationName);
  }

  /**
   * Get dispensing details
   */
  async getDispensing(id: string) {
    return await (prisma.dispensing.findUnique as any)({
      where: { id },
    });
  }

  /**
   * Update dispensing status
   */
  async updateDispensingStatus(id: string, status: DispensingStatus) {
    return await (prisma.dispensing.update as any)({
      where: { id },
      data: { status },
    });
  }

  /**
   * Return medication (reverse dispensing)
   */
  async returnMedication(dispensingId: string, quantityReturned: number) {
    const dispensing: any = await prisma.dispensing.findUnique({
      where: { id: dispensingId },
    });

    if (!dispensing) {
      throw new Error('Dispensing record not found');
    }

    if (quantityReturned > dispensing.quantity) {
      throw new Error('Cannot return more than dispensed quantity');
    }

    // Update dispensing status
    await (prisma.dispensing.update as any)({
      where: { id: dispensingId },
      data: {
        notes: `${dispensing.notes || ''}\nReturned ${quantityReturned} units`,
      },
    });

    return { success: true, quantityReturned };
  }
}

export default new DispenseService();
