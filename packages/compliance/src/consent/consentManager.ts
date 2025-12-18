/**
 * Consent Management for GDPR (Article 7), POPIA (Section 11), and HIPAA
 *
 * Features:
 * - Granular consent management
 * - Consent versioning
 * - Easy withdrawal
 * - Audit trail
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';

export enum ConsentPurpose {
  HEALTHCARE_SERVICES = 'healthcare_services',
  ANALYTICS_RESEARCH = 'analytics_research',
  MARKETING = 'marketing',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  TELEMEDICINE = 'telemedicine',
  INSURANCE_CLAIMS = 'insurance_claims',
  CLINICAL_TRIALS = 'clinical_trials'
}

export enum ConsentStatus {
  GRANTED = 'GRANTED',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export enum LegalBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

export interface ConsentRecord {
  id: string;
  dataSubjectId: string;
  purpose: ConsentPurpose;
  status: ConsentStatus;
  legalBasis: LegalBasis;
  version: string;

  // Consent details
  grantedAt?: Date;
  withdrawnAt?: Date;
  expiresAt?: Date;

  // GDPR requirements (Article 7)
  freelyGiven: boolean;
  specific: boolean;
  informed: boolean;
  unambiguous: boolean;

  // Collection method
  collectionMethod: 'web' | 'mobile' | 'paper' | 'verbal' | 'api';
  ipAddress?: string;
  userAgent?: string;

  // Consent text shown to user
  consentText: string;
  privacyPolicyUrl?: string;

  // Metadata
  metadata?: Record<string, any>;

  // Audit
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsentCheckResult {
  hasConsent: boolean;
  consentRecord?: ConsentRecord;
  reason?: string;
}

export class ConsentManager extends EventEmitter {
  private consents: Map<string, ConsentRecord[]> = new Map();

  constructor() {
    super();
  }

  /**
   * Grant consent for a specific purpose
   */
  async grantConsent(params: {
    dataSubjectId: string;
    purpose: ConsentPurpose;
    legalBasis?: LegalBasis;
    consentText: string;
    version: string;
    collectionMethod: ConsentRecord['collectionMethod'];
    ipAddress?: string;
    userAgent?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
  }): Promise<ConsentRecord> {
    // Validate consent requirements (GDPR Article 7)
    this.validateConsentRequirements(params);

    const consent: ConsentRecord = {
      id: crypto.randomUUID(),
      dataSubjectId: params.dataSubjectId,
      purpose: params.purpose,
      status: ConsentStatus.GRANTED,
      legalBasis: params.legalBasis || LegalBasis.CONSENT,
      version: params.version,
      grantedAt: new Date(),
      expiresAt: params.expiresAt,
      freelyGiven: true,
      specific: true,
      informed: true,
      unambiguous: true,
      collectionMethod: params.collectionMethod,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      consentText: params.consentText,
      metadata: params.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store consent
    const userConsents = this.consents.get(params.dataSubjectId) || [];

    // Withdraw any existing consent for same purpose
    userConsents.forEach(c => {
      if (c.purpose === params.purpose && c.status === ConsentStatus.GRANTED) {
        c.status = ConsentStatus.WITHDRAWN;
        c.withdrawnAt = new Date();
        c.updatedAt = new Date();
      }
    });

    userConsents.push(consent);
    this.consents.set(params.dataSubjectId, userConsents);

    // Emit event for audit logging
    this.emit('consent-granted', consent);

    return consent;
  }

  /**
   * Withdraw consent (GDPR Article 7(3) - must be as easy as giving)
   */
  async withdrawConsent(params: {
    dataSubjectId: string;
    purpose: ConsentPurpose;
    reason?: string;
  }): Promise<ConsentRecord> {
    const userConsents = this.consents.get(params.dataSubjectId) || [];
    const activeConsent = userConsents.find(
      c => c.purpose === params.purpose && c.status === ConsentStatus.GRANTED
    );

    if (!activeConsent) {
      throw new Error(`No active consent found for purpose: ${params.purpose}`);
    }

    activeConsent.status = ConsentStatus.WITHDRAWN;
    activeConsent.withdrawnAt = new Date();
    activeConsent.updatedAt = new Date();
    activeConsent.metadata = {
      ...activeConsent.metadata,
      withdrawalReason: params.reason
    };

    this.consents.set(params.dataSubjectId, userConsents);

    // Emit event for audit logging
    this.emit('consent-withdrawn', activeConsent);

    return activeConsent;
  }

  /**
   * Check if user has valid consent for purpose
   */
  async checkConsent(
    dataSubjectId: string,
    purpose: ConsentPurpose
  ): Promise<ConsentCheckResult> {
    const userConsents = this.consents.get(dataSubjectId) || [];
    const activeConsent = userConsents.find(
      c => c.purpose === purpose && c.status === ConsentStatus.GRANTED
    );

    if (!activeConsent) {
      return {
        hasConsent: false,
        reason: 'No active consent found'
      };
    }

    // Check expiration
    if (activeConsent.expiresAt && activeConsent.expiresAt < new Date()) {
      activeConsent.status = ConsentStatus.EXPIRED;
      activeConsent.updatedAt = new Date();

      return {
        hasConsent: false,
        consentRecord: activeConsent,
        reason: 'Consent expired'
      };
    }

    return {
      hasConsent: true,
      consentRecord: activeConsent
    };
  }

  /**
   * Get all consents for a data subject
   */
  async getConsents(dataSubjectId: string): Promise<ConsentRecord[]> {
    return this.consents.get(dataSubjectId) || [];
  }

  /**
   * Get consent history for audit (GDPR Article 7(1))
   */
  async getConsentHistory(
    dataSubjectId: string,
    purpose?: ConsentPurpose
  ): Promise<ConsentRecord[]> {
    const allConsents = this.consents.get(dataSubjectId) || [];

    if (purpose) {
      return allConsents.filter(c => c.purpose === purpose);
    }

    return allConsents;
  }

  /**
   * Validate GDPR consent requirements
   */
  private validateConsentRequirements(params: {
    consentText: string;
    purpose: ConsentPurpose;
  }): void {
    // Consent must be specific
    if (!params.consentText || params.consentText.length < 50) {
      throw new Error('Consent text must be detailed and specific (min 50 chars)');
    }

    // Consent for marketing must be separate (GDPR)
    if (params.purpose === ConsentPurpose.MARKETING) {
      if (!params.consentText.toLowerCase().includes('marketing')) {
        throw new Error('Marketing consent must explicitly mention marketing');
      }
    }

    // Cannot bundle consents (GDPR)
    const forbiddenPhrases = [
      'agree to all',
      'accept all',
      'terms and conditions and privacy policy'
    ];

    const lowerText = params.consentText.toLowerCase();
    for (const phrase of forbiddenPhrases) {
      if (lowerText.includes(phrase)) {
        throw new Error('Consent cannot be bundled with other agreements');
      }
    }
  }

  /**
   * Refresh expired consents (prompt user to re-consent)
   */
  async refreshConsent(
    dataSubjectId: string,
    purpose: ConsentPurpose
  ): Promise<void> {
    const userConsents = this.consents.get(dataSubjectId) || [];
    const expiredConsent = userConsents.find(
      c => c.purpose === purpose && c.status === ConsentStatus.EXPIRED
    );

    if (expiredConsent) {
      // Emit event to prompt user for re-consent
      this.emit('consent-refresh-required', {
        dataSubjectId,
        purpose,
        previousConsent: expiredConsent
      });
    }
  }

  /**
   * Export consent records for data subject access request
   */
  async exportConsents(dataSubjectId: string): Promise<{
    consents: ConsentRecord[];
    summary: {
      totalConsents: number;
      activeConsents: number;
      withdrawnConsents: number;
      expiredConsents: number;
    };
  }> {
    const consents = await this.getConsents(dataSubjectId);

    return {
      consents,
      summary: {
        totalConsents: consents.length,
        activeConsents: consents.filter(c => c.status === ConsentStatus.GRANTED).length,
        withdrawnConsents: consents.filter(c => c.status === ConsentStatus.WITHDRAWN).length,
        expiredConsents: consents.filter(c => c.status === ConsentStatus.EXPIRED).length
      }
    };
  }

  /**
   * Delete consent records (GDPR Article 17 - Right to erasure)
   */
  async deleteConsents(dataSubjectId: string): Promise<void> {
    this.consents.delete(dataSubjectId);
    this.emit('consents-deleted', { dataSubjectId });
  }

  /**
   * Check if processing is lawful under GDPR Article 6
   */
  isProcessingLawful(
    dataSubjectId: string,
    purpose: ConsentPurpose,
    alternativeLegalBasis?: LegalBasis
  ): boolean {
    // If consent exists, check it
    const consentCheck = this.checkConsent(dataSubjectId, purpose);
    if (consentCheck) {
      return true;
    }

    // Check alternative legal basis
    if (alternativeLegalBasis) {
      // In production, validate against business rules
      return true;
    }

    return false;
  }
}

export default ConsentManager;
