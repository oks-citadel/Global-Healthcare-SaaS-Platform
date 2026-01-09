/**
 * Consent Checker
 * Validates patient consent for AI processing
 */

import {
  ConsentRecord,
  ConsentError,
  AssistantType,
} from '../types';

export interface ConsentRepository {
  getConsent(patientId: string, organizationId: string): Promise<ConsentRecord | null>;
  saveConsent(consent: ConsentRecord): Promise<void>;
  revokeConsent(patientId: string, organizationId: string): Promise<void>;
}

export interface ConsentCheckResult {
  granted: boolean;
  consent?: ConsentRecord;
  reason?: string;
}

export class ConsentChecker {
  constructor(private repository: ConsentRepository) {}

  /**
   * Check if patient has granted consent for AI processing
   */
  async checkConsent(
    patientId: string,
    organizationId: string,
    _assistantType?: AssistantType
  ): Promise<ConsentCheckResult> {
    const consent = await this.repository.getConsent(patientId, organizationId);

    if (!consent) {
      return {
        granted: false,
        reason: 'No consent record found',
      };
    }

    // Check if consent is revoked
    if (consent.revokedAt) {
      return {
        granted: false,
        consent,
        reason: `Consent was revoked on ${consent.revokedAt.toISOString()}`,
      };
    }

    // Check if consent has expired
    if (consent.expiresAt && consent.expiresAt < new Date()) {
      return {
        granted: false,
        consent,
        reason: `Consent expired on ${consent.expiresAt.toISOString()}`,
      };
    }

    // Check if AI processing is consented
    if (!consent.aiProcessingConsent) {
      return {
        granted: false,
        consent,
        reason: 'AI processing consent not granted',
      };
    }

    return {
      granted: true,
      consent,
    };
  }

  /**
   * Require consent or throw error
   */
  async requireConsent(
    patientId: string,
    organizationId: string,
    assistantType?: AssistantType
  ): Promise<ConsentRecord> {
    const result = await this.checkConsent(patientId, organizationId, assistantType);

    if (!result.granted) {
      throw new ConsentError(
        result.reason || 'Consent not granted',
        patientId
      );
    }

    return result.consent!;
  }

  /**
   * Grant consent for a patient
   */
  async grantConsent(
    patientId: string,
    organizationId: string,
    consentVersion: string,
    expiresAt?: Date
  ): Promise<ConsentRecord> {
    const consent: ConsentRecord = {
      patientId,
      organizationId,
      aiProcessingConsent: true,
      consentDate: new Date(),
      consentVersion,
      expiresAt,
    };

    await this.repository.saveConsent(consent);
    return consent;
  }

  /**
   * Revoke consent for a patient
   */
  async revokeConsent(
    patientId: string,
    organizationId: string
  ): Promise<void> {
    await this.repository.revokeConsent(patientId, organizationId);
  }

  /**
   * Check if consent is valid (not expired or revoked)
   */
  isConsentValid(consent: ConsentRecord): boolean {
    if (consent.revokedAt) {
      return false;
    }

    if (consent.expiresAt && consent.expiresAt < new Date()) {
      return false;
    }

    return consent.aiProcessingConsent;
  }

  /**
   * Get consent expiration info
   */
  getExpirationInfo(consent: ConsentRecord): {
    isExpired: boolean;
    expiresAt?: Date;
    daysUntilExpiration?: number;
  } {
    if (!consent.expiresAt) {
      return { isExpired: false };
    }

    const now = new Date();
    const isExpired = consent.expiresAt < now;

    if (isExpired) {
      return { isExpired: true, expiresAt: consent.expiresAt };
    }

    const daysUntilExpiration = Math.floor(
      (consent.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isExpired: false,
      expiresAt: consent.expiresAt,
      daysUntilExpiration,
    };
  }

  /**
   * Batch check consent for multiple patients
   */
  async batchCheckConsent(
    patientIds: string[],
    organizationId: string
  ): Promise<Map<string, ConsentCheckResult>> {
    const results = new Map<string, ConsentCheckResult>();

    await Promise.all(
      patientIds.map(async (patientId) => {
        const result = await this.checkConsent(patientId, organizationId);
        results.set(patientId, result);
      })
    );

    return results;
  }
}

/**
 * In-memory consent repository (for development/testing)
 */
export class InMemoryConsentRepository implements ConsentRepository {
  private consents: Map<string, ConsentRecord> = new Map();

  private getKey(patientId: string, organizationId: string): string {
    return `${organizationId}:${patientId}`;
  }

  async getConsent(patientId: string, organizationId: string): Promise<ConsentRecord | null> {
    const key = this.getKey(patientId, organizationId);
    return this.consents.get(key) || null;
  }

  async saveConsent(consent: ConsentRecord): Promise<void> {
    const key = this.getKey(consent.patientId, consent.organizationId);
    this.consents.set(key, consent);
  }

  async revokeConsent(patientId: string, organizationId: string): Promise<void> {
    const key = this.getKey(patientId, organizationId);
    const consent = this.consents.get(key);
    if (consent) {
      consent.revokedAt = new Date();
      this.consents.set(key, consent);
    }
  }

  // Test helper methods
  clear(): void {
    this.consents.clear();
  }

  getAll(): ConsentRecord[] {
    return Array.from(this.consents.values());
  }
}
