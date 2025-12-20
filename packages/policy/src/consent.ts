/**
 * Consent Management Utilities
 * Handles consent checking and validation based on country configuration
 */

import type { CountryConfig } from '@global-health/country-config';
import { CountryConfigLoader } from '@global-health/country-config';
import type { ConsentRecord, ConsentScope, PolicyResult } from './types';

export class ConsentManager {
  private static consents: Map<string, ConsentRecord> = new Map();

  /**
   * Grant consent
   */
  static grantConsent(
    userId: string,
    scopes: ConsentScope[],
    countryCode: string,
    patientId?: string,
    metadata?: Record<string, any>
  ): ConsentRecord {
    const config = CountryConfigLoader.load(countryCode);

    if (!config) {
      throw new Error(`No configuration found for country: ${countryCode}`);
    }

    // Validate scopes
    const invalidScopes = scopes.filter(
      scope => !config.consent.availableScopes.includes(scope)
    );

    if (invalidScopes.length > 0) {
      throw new Error(
        `Invalid consent scopes for ${countryCode}: ${invalidScopes.join(', ')}`
      );
    }

    const consentId = this.generateConsentId(userId, patientId);
    const grantedAt = new Date().toISOString();

    let expiresAt: string | undefined;
    if (config.consent.validityPeriod) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + config.consent.validityPeriod);
      expiresAt = expiryDate.toISOString();
    }

    const consent: ConsentRecord = {
      id: consentId,
      userId,
      patientId,
      scopes,
      status: 'active',
      grantedAt,
      expiresAt,
      metadata,
    };

    this.consents.set(consentId, consent);

    return consent;
  }

  /**
   * Withdraw consent
   */
  static withdrawConsent(consentId: string, countryCode: string): boolean {
    const config = CountryConfigLoader.load(countryCode);

    if (!config) {
      throw new Error(`No configuration found for country: ${countryCode}`);
    }

    if (!config.consent.withdrawalAllowed) {
      throw new Error(`Consent withdrawal not allowed in ${config.name}`);
    }

    const consent = this.consents.get(consentId);

    if (!consent) {
      return false;
    }

    consent.status = 'withdrawn';
    consent.withdrawnAt = new Date().toISOString();

    return true;
  }

  /**
   * Check if user has given consent for a specific scope
   */
  static hasConsent(
    userId: string,
    scope: ConsentScope,
    countryCode: string,
    patientId?: string
  ): PolicyResult {
    const config = CountryConfigLoader.load(countryCode);

    if (!config) {
      return {
        allowed: false,
        reason: `No configuration found for country: ${countryCode}`,
      };
    }

    // Check if this is opt-out model
    if (config.consent.model === 'opt-out') {
      // In opt-out model, consent is assumed unless explicitly withdrawn
      const consentId = this.generateConsentId(userId, patientId);
      const consent = this.consents.get(consentId);

      if (!consent || consent.status !== 'withdrawn') {
        return { allowed: true };
      }

      return {
        allowed: false,
        reason: 'User has opted out of this consent scope',
      };
    }

    // Opt-in model - explicit consent required
    const consentId = this.generateConsentId(userId, patientId);
    const consent = this.consents.get(consentId);

    if (!consent) {
      return {
        allowed: false,
        reason: 'No consent record found',
      };
    }

    if (consent.status !== 'active') {
      return {
        allowed: false,
        reason: `Consent is ${consent.status}`,
      };
    }

    // Check if consent has expired
    if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
      consent.status = 'expired';
      return {
        allowed: false,
        reason: 'Consent has expired',
      };
    }

    // Check if scope is included
    if (!consent.scopes.includes(scope)) {
      return {
        allowed: false,
        reason: `User has not consented to scope: ${scope}`,
      };
    }

    return { allowed: true };
  }

  /**
   * Check multiple consent scopes
   */
  static hasAllConsents(
    userId: string,
    scopes: ConsentScope[],
    countryCode: string,
    patientId?: string
  ): PolicyResult {
    for (const scope of scopes) {
      const result = this.hasConsent(userId, scope, countryCode, patientId);
      if (!result.allowed) {
        return result;
      }
    }

    return { allowed: true };
  }

  /**
   * Check if user has any of the specified consent scopes
   */
  static hasAnyConsent(
    userId: string,
    scopes: ConsentScope[],
    countryCode: string,
    patientId?: string
  ): PolicyResult {
    for (const scope of scopes) {
      const result = this.hasConsent(userId, scope, countryCode, patientId);
      if (result.allowed) {
        return result;
      }
    }

    return {
      allowed: false,
      reason: 'User has not consented to any of the required scopes',
    };
  }

  /**
   * Get all consents for a user
   */
  static getUserConsents(userId: string, patientId?: string): ConsentRecord[] {
    const consentId = this.generateConsentId(userId, patientId);
    const consent = this.consents.get(consentId);

    if (!consent) {
      return [];
    }

    return [consent];
  }

  /**
   * Get active consents for a user
   */
  static getActiveConsents(userId: string, patientId?: string): ConsentRecord[] {
    return this.getUserConsents(userId, patientId).filter(
      consent => consent.status === 'active'
    );
  }

  /**
   * Check if consent requires reconfirmation
   */
  static requiresReconfirmation(
    userId: string,
    countryCode: string,
    patientId?: string
  ): boolean {
    const config = CountryConfigLoader.load(countryCode);

    if (!config || !config.consent.requiresReconfirmation) {
      return false;
    }

    const consentId = this.generateConsentId(userId, patientId);
    const consent = this.consents.get(consentId);

    if (!consent || consent.status !== 'active') {
      return false;
    }

    // Check if reconfirmation period has passed
    if (config.consent.validityPeriod && consent.expiresAt) {
      const expiryDate = new Date(consent.expiresAt);
      const now = new Date();

      // Require reconfirmation 30 days before expiry
      const reconfirmationDate = new Date(expiryDate);
      reconfirmationDate.setDate(reconfirmationDate.getDate() - 30);

      return now >= reconfirmationDate;
    }

    return false;
  }

  /**
   * Update consent scopes
   */
  static updateConsentScopes(
    consentId: string,
    scopes: ConsentScope[],
    countryCode: string
  ): boolean {
    const config = CountryConfigLoader.load(countryCode);

    if (!config) {
      throw new Error(`No configuration found for country: ${countryCode}`);
    }

    const consent = this.consents.get(consentId);

    if (!consent) {
      return false;
    }

    // Validate scopes
    const invalidScopes = scopes.filter(
      scope => !config.consent.availableScopes.includes(scope)
    );

    if (invalidScopes.length > 0) {
      throw new Error(
        `Invalid consent scopes for ${countryCode}: ${invalidScopes.join(', ')}`
      );
    }

    consent.scopes = scopes;

    return true;
  }

  /**
   * Generate consent ID
   */
  private static generateConsentId(userId: string, patientId?: string): string {
    return `consent-${userId}${patientId ? `-${patientId}` : ''}`;
  }

  /**
   * Clear all consents (for testing)
   */
  static clearAll(): void {
    this.consents.clear();
  }

  /**
   * Get consent by ID
   */
  static getConsent(consentId: string): ConsentRecord | undefined {
    return this.consents.get(consentId);
  }

  /**
   * Check if consent model is opt-in or opt-out
   */
  static getConsentModel(countryCode: string): 'opt-in' | 'opt-out' | null {
    const config = CountryConfigLoader.load(countryCode);

    if (!config) {
      return null;
    }

    return config.consent.model;
  }

  /**
   * Get available consent scopes for a country
   */
  static getAvailableScopes(countryCode: string): ConsentScope[] {
    const config = CountryConfigLoader.load(countryCode);

    if (!config) {
      return [];
    }

    return config.consent.availableScopes;
  }
}
