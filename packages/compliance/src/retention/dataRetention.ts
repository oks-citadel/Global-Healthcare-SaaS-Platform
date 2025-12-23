// @ts-nocheck
/**
 * Data Retention Policy Manager
 * HIPAA 7-year retention, GDPR storage limitation, POPIA retention requirements
 */

import { EventEmitter } from 'events';

export enum RetentionPolicy {
  HIPAA_7_YEARS = 'HIPAA_7_YEARS',
  GDPR_MINIMAL = 'GDPR_MINIMAL',
  POPIA_REASONABLE = 'POPIA_REASONABLE',
  CUSTOM = 'CUSTOM'
}

export interface RetentionRule {
  id: string;
  name: string;
  policy: RetentionPolicy;
  retentionDays: number;
  dataCategory: string;
  legalBasis: string;
  autoDelete: boolean;
  gracePeriodDays?: number;
}

export class DataRetentionManager extends EventEmitter {
  private rules: Map<string, RetentionRule> = new Map();

  constructor() {
    super();
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    // HIPAA - 7 years retention for health records
    this.addRule({
      id: 'hipaa-health-records',
      name: 'HIPAA Health Records',
      policy: RetentionPolicy.HIPAA_7_YEARS,
      retentionDays: 2555, // 7 years
      dataCategory: 'health_records',
      legalBasis: '45 CFR § 164.530(j)',
      autoDelete: false // Manual review required
    });

    // GDPR - Minimal retention
    this.addRule({
      id: 'gdpr-personal-data',
      name: 'GDPR Personal Data',
      policy: RetentionPolicy.GDPR_MINIMAL,
      retentionDays: 365, // 1 year default, adjust per use case
      dataCategory: 'personal_data',
      legalBasis: 'GDPR Article 5(1)(e)',
      autoDelete: true,
      gracePeriodDays: 30
    });
  }

  addRule(rule: RetentionRule): void {
    this.rules.set(rule.id, rule);
    this.emit('rule-added', rule);
  }

  shouldRetain(dataCategory: string, createdAt: Date): boolean {
    const rule = Array.from(this.rules.values()).find(
      r => r.dataCategory === dataCategory
    );

    if (!rule) return true; // Default: retain if no rule

    const ageDays = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return ageDays < rule.retentionDays;
  }

  getExpirationDate(dataCategory: string, createdAt: Date): Date | null {
    const rule = Array.from(this.rules.values()).find(
      r => r.dataCategory === dataCategory
    );

    if (!rule) return null;

    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + rule.retentionDays);

    return expirationDate;
  }
}

export default DataRetentionManager;
