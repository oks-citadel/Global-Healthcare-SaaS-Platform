import { PrismaClient, ConsentType, ConsentRecord } from '../generated/client';

const prisma = new PrismaClient();

// Type definitions for consent data
interface GrantConsentInput {
  patientId: string;
  providerId: string;
  consentType: ConsentType;
  purpose: string;
  expiresAt?: Date;
  substanceUseDisclosure?: boolean;
  disclosureScope?: string;
  redisclosure?: boolean;
}

interface AccessValidationResult {
  allowed: boolean;
  reason: string;
  consentId?: string;
}

/**
 * ConsentService - Handles 42 CFR Part 2 compliance for substance use disorder records
 *
 * 42 CFR Part 2 is a federal regulation that protects the confidentiality of substance use
 * disorder treatment records. It requires explicit written consent before disclosure.
 */
export class ConsentService {
  /**
   * Check if a provider has valid consent to access patient records
   */
  static async hasValidConsent(
    patientId: string,
    providerId: string,
    consentType: ConsentType = 'treatment'
  ): Promise<boolean> {
    const consent = await prisma.consentRecord.findFirst({
      where: {
        patientId,
        consentType,
        status: 'active',
        grantedTo: providerId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    return !!consent;
  }

  /**
   * Check if substance use disclosure is allowed
   * Required for 42 CFR Part 2 compliance
   */
  static async canDiscloseSubstanceUse(
    patientId: string,
    providerId: string
  ): Promise<boolean> {
    const consent = await prisma.consentRecord.findFirst({
      where: {
        patientId,
        status: 'active',
        substanceUseDisclosure: true,
        grantedTo: providerId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    return !!consent;
  }

  /**
   * Grant consent for a provider
   */
  static async grantConsent(data: GrantConsentInput): Promise<ConsentRecord> {
    return await prisma.consentRecord.create({
      data: {
        patientId: data.patientId,
        providerId: data.providerId,
        consentType: data.consentType,
        purpose: data.purpose,
        grantedTo: data.providerId,
        grantedAt: new Date(),
        expiresAt: data.expiresAt,
        substanceUseDisclosure: data.substanceUseDisclosure || false,
        disclosureScope: data.disclosureScope ? [data.disclosureScope] : [],
        status: 'active',
      },
    });
  }

  /**
   * Revoke consent
   */
  static async revokeConsent(consentId: string, patientId: string): Promise<ConsentRecord> {
    const consent = await prisma.consentRecord.findUnique({
      where: { id: consentId },
    });

    if (!consent || consent.patientId !== patientId) {
      throw new Error('Consent not found or unauthorized');
    }

    return await prisma.consentRecord.update({
      where: { id: consentId },
      data: {
        status: 'revoked',
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Get all active consents for a patient
   */
  static async getPatientConsents(patientId: string): Promise<ConsentRecord[]> {
    return await prisma.consentRecord.findMany({
      where: {
        patientId,
        status: 'active',
      },
      orderBy: { grantedAt: 'desc' },
    });
  }

  /**
   * Check and update expired consents
   */
  static async updateExpiredConsents(): Promise<{ count: number }> {
    return await prisma.consentRecord.updateMany({
      where: {
        status: 'active',
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: 'expired',
      },
    });
  }

  /**
   * Validate access with detailed reason (for audit logging)
   */
  static async validateAccess(
    patientId: string,
    providerId: string,
    resourceType: string
  ): Promise<AccessValidationResult> {
    // Check for active consent
    const consent = await prisma.consentRecord.findFirst({
      where: {
        patientId,
        status: 'active',
        grantedTo: providerId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    if (!consent) {
      return {
        allowed: false,
        reason: 'No valid consent found',
      };
    }

    // Check if resource type is within scope (disclosureScope is already string[])
    if (consent.disclosureScope && consent.disclosureScope.length > 0) {
      if (!consent.disclosureScope.includes(resourceType) && !consent.disclosureScope.includes('*')) {
        return {
          allowed: false,
          reason: 'Resource type not within consent scope',
          consentId: consent.id,
        };
      }
    }

    return {
      allowed: true,
      reason: 'Valid consent found',
      consentId: consent.id,
    };
  }

  /**
   * Create emergency consent (limited time, specific purpose)
   */
  static async createEmergencyConsent(
    patientId: string,
    providerId: string,
    emergencyReason: string
  ): Promise<ConsentRecord> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72); // 72-hour emergency consent

    return await prisma.consentRecord.create({
      data: {
        patientId,
        providerId,
        consentType: 'emergency_contact',
        purpose: `Emergency: ${emergencyReason}`,
        grantedTo: providerId,
        grantedAt: new Date(),
        expiresAt,
        status: 'active',
        substanceUseDisclosure: false,
      },
    });
  }
}
