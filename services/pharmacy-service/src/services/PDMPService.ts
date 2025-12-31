import { PrismaClient, Prisma } from '../generated/client';

const prisma = new PrismaClient();

// Type for controlled substance log records
type ControlledSubstanceLog = Awaited<ReturnType<typeof prisma.controlledSubstanceLog.findFirst>>;
type ControlledSubstanceLogWhereInput = Prisma.ControlledSubstanceLogWhereInput;

export interface PDMPCheckResult {
  patientId: string;
  hasAlerts: boolean;
  requiresIntervention: boolean;
  alerts: string[];
  recentControlledSubstances: NonNullable<ControlledSubstanceLog>[];
  multipleProviders: boolean;
  multiplePharmacies: boolean;
  overlappingPrescriptions: boolean;
}

export class PDMPService {
  /**
   * Check PDMP (Prescription Drug Monitoring Program) for controlled substances
   */
  async checkPDMP(patientId: string, schedule?: string): Promise<PDMPCheckResult> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get patient's recent controlled substance dispensings
    const recentDispensings = await prisma.controlledSubstanceLog.findMany({
      where: {
        patientId,
        dispensedAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        dispensedAt: 'desc',
      },
    });

    const alerts: string[] = [];
    let requiresIntervention = false;

    // Check for multiple providers
    const uniquePrescribers = new Set(recentDispensings.map((d) => d.prescriberId));
    const multipleProviders = uniquePrescribers.size > 3;
    if (multipleProviders) {
      alerts.push(
        `Patient has received controlled substances from ${uniquePrescribers.size} different prescribers in the last 6 months`
      );
    }

    // Check for multiple pharmacies
    const uniquePharmacies = new Set(recentDispensings.map((d) => d.pharmacyId).filter(Boolean));
    const multiplePharmacies = uniquePharmacies.size > 3;
    if (multiplePharmacies) {
      alerts.push(
        `Patient has filled controlled substances at ${uniquePharmacies.size} different pharmacies in the last 6 months`
      );
    }

    // Check for overlapping prescriptions (same medication, overlapping dates)
    const overlappingPrescriptions = this.detectOverlappingPrescriptions(recentDispensings);
    if (overlappingPrescriptions) {
      alerts.push('Overlapping controlled substance prescriptions detected');
      requiresIntervention = true;
    }

    // Check for early refills (Schedule II substances)
    const earlyRefills = this.detectEarlyRefills(recentDispensings);
    if (earlyRefills.length > 0) {
      alerts.push(`${earlyRefills.length} early refill(s) detected for Schedule II substances`);
      requiresIntervention = true;
    }

    // Check for high MME (Morphine Milligram Equivalent) - simplified check
    const highDoseOpioids = recentDispensings.filter(
      (d) => d.schedule === 'II' && d.quantity > 90
    );
    if (highDoseOpioids.length > 0) {
      alerts.push('High-dose opioid prescriptions detected');
    }

    // Check for dangerous combinations (opioids + benzodiazepines)
    const hasOpioids = recentDispensings.some((d) =>
      this.isOpioid(d.medicationName)
    );
    const hasBenzodiazepines = recentDispensings.some((d) =>
      this.isBenzodiazepine(d.medicationName)
    );

    if (hasOpioids && hasBenzodiazepines) {
      alerts.push('Concurrent opioid and benzodiazepine use detected');
      requiresIntervention = true;
    }

    return {
      patientId,
      hasAlerts: alerts.length > 0,
      requiresIntervention,
      alerts,
      recentControlledSubstances: recentDispensings,
      multipleProviders,
      multiplePharmacies,
      overlappingPrescriptions,
    };
  }

  /**
   * Report controlled substance dispensing to PDMP
   */
  async reportToPDMP(controlledSubstanceLogId: string) {
    // In a real implementation, this would integrate with state PDMP APIs
    // For now, we'll just mark the record as reported

    const log = await prisma.controlledSubstanceLog.findUnique({
      where: { id: controlledSubstanceLogId },
    });

    if (!log) {
      throw new Error('Controlled substance log not found');
    }

    // Simulate PDMP reporting
    const pdmpReportId = `PDMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await prisma.controlledSubstanceLog.update({
      where: { id: controlledSubstanceLogId },
      data: {
        reportedToPDMP: true,
        pdmpReportDate: new Date(),
        pdmpReportId,
      },
    });

    return {
      success: true,
      pdmpReportId,
      message: 'Successfully reported to PDMP',
    };
  }

  /**
   * Get controlled substance history for a patient
   */
  async getPatientControlledSubstanceHistory(
    patientId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      schedule?: string;
      limit?: number;
    }
  ) {
    const where: ControlledSubstanceLogWhereInput = { patientId };

    if (options?.startDate || options?.endDate) {
      where.dispensedAt = {};
      if (options.startDate) (where.dispensedAt as Record<string, Date>).gte = options.startDate;
      if (options.endDate) (where.dispensedAt as Record<string, Date>).lte = options.endDate;
    }

    if (options?.schedule) {
      where.schedule = options.schedule;
    }

    return await prisma.controlledSubstanceLog.findMany({
      where,
      orderBy: {
        dispensedAt: 'desc',
      },
      take: options?.limit || 100,
    });
  }

  /**
   * Get unreported controlled substance dispensings
   */
  async getUnreportedDispensings() {
    return await prisma.controlledSubstanceLog.findMany({
      where: {
        reportedToPDMP: false,
      },
      orderBy: {
        dispensedAt: 'asc',
      },
    });
  }

  /**
   * Bulk report unreported dispensings
   */
  async bulkReportToPDMP() {
    const unreported = await this.getUnreportedDispensings();
    const results = [];

    for (const log of unreported) {
      try {
        const result = await this.reportToPDMP(log.id);
        results.push({ id: log.id, success: true, result });
      } catch (error: any) {
        results.push({ id: log.id, success: false, error: error.message });
      }
    }

    return {
      total: unreported.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }

  /**
   * Helper: Detect overlapping prescriptions
   */
  private detectOverlappingPrescriptions(dispensings: NonNullable<ControlledSubstanceLog>[]): boolean {
    // Group by medication name
    const byMedication: { [key: string]: NonNullable<ControlledSubstanceLog>[] } = {};

    dispensings.forEach((d) => {
      if (!byMedication[d.medicationName]) {
        byMedication[d.medicationName] = [];
      }
      byMedication[d.medicationName].push(d);
    });

    // Check for overlaps within each medication
    for (const medName in byMedication) {
      const meds = byMedication[medName];
      if (meds.length < 2) continue;

      // Sort by dispense date
      meds.sort((a, b) => a.dispensedAt.getTime() - b.dispensedAt.getTime());

      // Check consecutive pairs for overlap
      for (let i = 0; i < meds.length - 1; i++) {
        const current = meds[i];
        const next = meds[i + 1];

        // Assume 30 days supply if not specified
        const daysSupply = 30;
        const currentEndDate = new Date(current.dispensedAt);
        currentEndDate.setDate(currentEndDate.getDate() + daysSupply);

        // If next dispense is before current ends, that's an overlap
        if (next.dispensedAt < currentEndDate) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Helper: Detect early refills
   */
  private detectEarlyRefills(dispensings: NonNullable<ControlledSubstanceLog>[]): Array<{ medication: string; daysEarly: number; dispensedAt: Date }> {
    const earlyRefills: Array<{ medication: string; daysEarly: number; dispensedAt: Date }> = [];
    const byMedication: { [key: string]: NonNullable<ControlledSubstanceLog>[] } = {};

    // Filter only Schedule II (no refills allowed, each is a new prescription)
    const scheduleII = dispensings.filter((d) => d.schedule === 'II');

    scheduleII.forEach((d) => {
      if (!byMedication[d.medicationName]) {
        byMedication[d.medicationName] = [];
      }
      byMedication[d.medicationName].push(d);
    });

    for (const medName in byMedication) {
      const meds = byMedication[medName];
      if (meds.length < 2) continue;

      meds.sort((a, b) => a.dispensedAt.getTime() - b.dispensedAt.getTime());

      for (let i = 0; i < meds.length - 1; i++) {
        const current = meds[i];
        const next = meds[i + 1];

        // Assume 30 days supply
        const daysSupply = 30;
        const expectedRefillDate = new Date(current.dispensedAt);
        expectedRefillDate.setDate(expectedRefillDate.getDate() + daysSupply);

        // If refilled more than 5 days early, flag it
        const daysDifference =
          (expectedRefillDate.getTime() - next.dispensedAt.getTime()) /
          (1000 * 60 * 60 * 24);

        if (daysDifference > 5) {
          earlyRefills.push({
            medication: medName,
            daysEarly: Math.round(daysDifference),
            dispensedAt: next.dispensedAt,
          });
        }
      }
    }

    return earlyRefills;
  }

  /**
   * Helper: Check if medication is an opioid
   */
  private isOpioid(medicationName: string): boolean {
    const opioids = [
      'oxycodone',
      'hydrocodone',
      'morphine',
      'fentanyl',
      'codeine',
      'tramadol',
      'hydromorphone',
      'oxymorphone',
      'methadone',
      'buprenorphine',
    ];

    const lowerName = medicationName.toLowerCase();
    return opioids.some((opioid) => lowerName.includes(opioid));
  }

  /**
   * Helper: Check if medication is a benzodiazepine
   */
  private isBenzodiazepine(medicationName: string): boolean {
    const benzos = [
      'alprazolam',
      'lorazepam',
      'clonazepam',
      'diazepam',
      'temazepam',
      'triazolam',
      'chlordiazepoxide',
      'oxazepam',
    ];

    const lowerName = medicationName.toLowerCase();
    return benzos.some((benzo) => lowerName.includes(benzo));
  }

  /**
   * Get PDMP statistics
   */
  async getPDMPStatistics(options?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: ControlledSubstanceLogWhereInput = {};

    if (options?.startDate || options?.endDate) {
      where.dispensedAt = {};
      if (options.startDate) (where.dispensedAt as Record<string, Date>).gte = options.startDate;
      if (options.endDate) (where.dispensedAt as Record<string, Date>).lte = options.endDate;
    }

    const [
      totalDispensings,
      scheduleII,
      scheduleIII,
      scheduleIV,
      scheduleV,
      reported,
      unreported,
    ] = await Promise.all([
      prisma.controlledSubstanceLog.count({ where }),
      prisma.controlledSubstanceLog.count({ where: { ...where, schedule: 'II' } }),
      prisma.controlledSubstanceLog.count({ where: { ...where, schedule: 'III' } }),
      prisma.controlledSubstanceLog.count({ where: { ...where, schedule: 'IV' } }),
      prisma.controlledSubstanceLog.count({ where: { ...where, schedule: 'V' } }),
      prisma.controlledSubstanceLog.count({ where: { ...where, reportedToPDMP: true } }),
      prisma.controlledSubstanceLog.count({ where: { ...where, reportedToPDMP: false } }),
    ]);

    return {
      totalDispensings,
      bySchedule: {
        II: scheduleII,
        III: scheduleIII,
        IV: scheduleIV,
        V: scheduleV,
      },
      reporting: {
        reported,
        unreported,
        reportingRate: totalDispensings > 0 ? (reported / totalDispensings) * 100 : 0,
      },
    };
  }
}

export default new PDMPService();
