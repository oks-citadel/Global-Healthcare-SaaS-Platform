import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

// Type for drug interaction records
type DrugInteractionRecord = Awaited<ReturnType<typeof prisma.drugInteraction.findFirst>>;

export interface DrugInteractionResult {
  hasCriticalInteractions: boolean;
  hasSevereInteractions: boolean;
  hasModerateInteractions: boolean;
  interactions: Array<{
    drug1: string;
    drug2: string;
    severity: string;
    description: string;
    clinicalEffects?: string;
    management?: string;
  }>;
}

export interface AllergyCheckResult {
  hasAllergies: boolean;
  hasCriticalAllergies: boolean;
  allergies: Array<{
    allergen: string;
    reactionType: string;
    symptoms: string[];
    notes?: string;
  }>;
}

export class InteractionCheckService {
  /**
   * Check for drug-drug interactions
   */
  async checkDrugInteractions(medicationNames: string[]): Promise<DrugInteractionResult> {
    if (medicationNames.length < 2) {
      return {
        hasCriticalInteractions: false,
        hasSevereInteractions: false,
        hasModerateInteractions: false,
        interactions: [],
      };
    }

    const interactions: NonNullable<DrugInteractionRecord>[] = [];

    // Check all pairs of medications
    for (let i = 0; i < medicationNames.length; i++) {
      for (let j = i + 1; j < medicationNames.length; j++) {
        const drug1 = medicationNames[i];
        const drug2 = medicationNames[j];

        // Check both directions (drug1-drug2 and drug2-drug1)
        const foundInteractions = await prisma.drugInteraction.findMany({
          where: {
            OR: [
              {
                drug1Name: { contains: drug1, mode: 'insensitive' },
                drug2Name: { contains: drug2, mode: 'insensitive' },
              },
              {
                drug1Name: { contains: drug2, mode: 'insensitive' },
                drug2Name: { contains: drug1, mode: 'insensitive' },
              },
            ],
          },
        });

        interactions.push(...foundInteractions);
      }
    }

    const hasCriticalInteractions = interactions.some(
      (i: any) => i.severity === 'contraindicated'
    );
    const hasSevereInteractions = interactions.some(
      (i: any) => i.severity === 'severe'
    );
    const hasModerateInteractions = interactions.some(
      (i: any) => i.severity === 'moderate'
    );

    return {
      hasCriticalInteractions,
      hasSevereInteractions,
      hasModerateInteractions,
      interactions: interactions.map((i: any) => ({
        drug1: i.drug1Name,
        drug2: i.drug2Name,
        severity: i.severity,
        description: i.description,
      })),
    };
  }

  /**
   * Check for drug-allergy interactions
   */
  async checkDrugAllergies(
    patientId: string,
    medicationNames: string[]
  ): Promise<AllergyCheckResult> {
    const allergies = await prisma.drugAllergy.findMany({
      where: {
        patientId,
        isActive: true,
      },
    });

    if (allergies.length === 0) {
      return {
        hasAllergies: false,
        hasCriticalAllergies: false,
        allergies: [],
      };
    }

    // Check if any prescribed medications match known allergies
    const matchingAllergies = allergies.filter((allergy) =>
      medicationNames.some(
        (med) =>
          med.toLowerCase().includes(allergy.allergen.toLowerCase()) ||
          allergy.allergen.toLowerCase().includes(med.toLowerCase())
      )
    );

    const hasCriticalAllergies = matchingAllergies.some(
      (a: any) => a.reaction === 'anaphylaxis' || a.severity === 'severe'
    );

    return {
      hasAllergies: matchingAllergies.length > 0,
      hasCriticalAllergies,
      allergies: matchingAllergies.map((a: any) => ({
        allergen: a.allergen,
        reactionType: a.reaction,
        symptoms: [] as string[],
      })),
    };
  }

  /**
   * Perform comprehensive safety check (interactions + allergies)
   */
  async performSafetyCheck(patientId: string, medicationNames: string[]) {
    const [interactionCheck, allergyCheck] = await Promise.all([
      this.checkDrugInteractions(medicationNames),
      this.checkDrugAllergies(patientId, medicationNames),
    ]);

    const isSafe =
      !interactionCheck.hasCriticalInteractions &&
      !interactionCheck.hasSevereInteractions &&
      !allergyCheck.hasCriticalAllergies;

    return {
      isSafe,
      requiresReview:
        interactionCheck.hasSevereInteractions ||
        interactionCheck.hasModerateInteractions ||
        allergyCheck.hasAllergies,
      interactionCheck,
      allergyCheck,
    };
  }

  /**
   * Add a drug interaction record
   */
  async addDrugInteraction(data: {
    drug1Name: string;
    drug1RxNorm?: string;
    drug2Name: string;
    drug2RxNorm?: string;
    severityLevel: string;
    description: string;
    clinicalEffects?: string;
    management?: string;
    documentation?: string;
  }) {
    return await prisma.drugInteraction.create({
      data: {
        drug1Name: data.drug1Name,
        drug2Name: data.drug2Name,
        severity: data.severityLevel,
        description: data.description,
        source: 'manual',
      } as any,
    });
  }

  /**
   * Add a drug allergy for a patient
   */
  async addDrugAllergy(data: {
    patientId: string;
    allergen: string;
    allergenRxNorm?: string;
    reactionType: string;
    symptoms: string[];
    onsetDate?: Date;
    verifiedBy?: string;
    notes?: string;
  }) {
    return await prisma.drugAllergy.create({
      data: {
        patientId: data.patientId,
        allergen: data.allergen,
        reaction: data.reactionType,
        severity: 'moderate',
        onsetDate: data.onsetDate || new Date(),
      } as any,
    });
  }

  /**
   * Get patient allergies
   */
  async getPatientAllergies(patientId: string) {
    return await prisma.drugAllergy.findMany({
      where: {
        patientId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Deactivate an allergy record
   */
  async deactivateAllergy(allergyId: string) {
    return await prisma.drugAllergy.update({
      where: { id: allergyId },
      data: { isActive: false },
    });
  }
}

export default new InteractionCheckService();
