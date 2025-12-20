/**
 * Germany Country Configuration
 * Regulatory Framework: GDPR, German Healthcare Data Protection Laws
 */

import type { CountryConfig } from '../types';

export const GermanyConfig: CountryConfig = {
  region: 'Europe',
  countryCode: 'DE',
  name: 'Germany',
  enabled: true,
  regulatoryFramework: ['GDPR', 'BDSG', 'SGB V', 'eHealth Act'],

  residency: {
    dataLocation: 'in-country',
    allowedRegions: ['DE'],
    allowCrossBorderTransfer: false,
    transferSafeguards: [
      'Standard Contractual Clauses',
      'Adequacy Decision',
      'Binding Corporate Rules',
    ],
    encryptionRequired: true,
    encryptionStandards: [
      'AES-256',
      'TLS 1.3',
      'End-to-End Encryption for eHealth Communication',
    ],
  },

  features: {
    telehealth: true,
    videoConsultation: true,
    electronicPrescription: true,
    aiDiagnosis: false, // Strict regulations on AI in healthcare
    aiTreatment: false,
    remoteMonitoring: true,
    wearableIntegration: true,
    mobileHealth: true,
    customFeatures: {
      electronicHealthCard: true, // eGK (elektronische Gesundheitskarte)
      telematikInfrastructure: true, // National eHealth infrastructure
      electronicPatientRecord: true, // ePA (elektronische Patientenakte)
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'treatment',
      'electronic-health-record',
      'data-sharing',
      'research',
      'emergency-access',
    ],
    withdrawalAllowed: true,
    minimumAge: 16,
    parentalConsentRequired: true,
    validityPeriod: undefined, // No automatic expiry, explicit withdrawal required
    requiresReconfirmation: false,
  },

  retention: {
    patientRecords: 10, // 10 years under German law
    medicalImaging: 10,
    prescriptions: 3,
    auditLogs: 10,
    billing: 10,
    consent: 10,
    custom: {
      radiologyRecords: 30,
      geneticData: 30,
    },
  },

  audit: {
    required: true,
    requiredEvents: [
      'access',
      'create',
      'update',
      'delete',
      'export',
      'print',
      'emergency-access',
      'consent-change',
      'data-transfer',
      'dpia-completion', // Data Protection Impact Assessment
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'monthly',
    reportRecipients: ['data-protection-officer', 'technical-operations'],
  },

  providers: [
    {
      type: 'hie',
      name: 'Telematik Infrastructure (gematik)',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        connector: 'TI-Connector',
        cardType: 'HBA/SMC-B',
        networkType: 'national',
      },
    },
    {
      type: 'ehr',
      name: 'ePA Provider',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        standard: 'HL7 FHIR',
        version: 'R4',
      },
    },
    {
      type: 'payment',
      name: 'SEPA Direct Debit',
      required: true,
      authMethod: 'api-key',
      config: {
        paymentMethod: 'sepa',
        psd2Compliant: true,
      },
    },
    {
      type: 'idv',
      name: 'eID (Personalausweis)',
      required: true,
      authMethod: 'oauth2',
      config: {
        verificationLevel: 'High',
        eIDAS: true,
      },
    },
    {
      type: 'sms',
      name: 'German SMS Provider',
      required: false,
      authMethod: 'api-key',
      config: {
        gdprCompliant: true,
        dataLocation: 'DE',
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'name',
      'address',
      'dob',
      'insurance-number',
      'patient-id',
      'email',
      'phone',
      'genetic-data',
      'biometric-data',
    ],
    retentionDays: 3650, // 10 years
    cloudStorageAllowed: false, // Must be in-country data centers
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'Europe/Berlin',
  languages: ['de', 'en'],
  currency: 'EUR',

  custom: {
    dataProtectionOfficer: {
      required: true,
      contactRequired: true,
    },
    dpia: {
      required: true,
      triggers: ['ai-processing', 'large-scale-processing', 'sensitive-data'],
    },
    rightOfAccess: {
      maxDays: 30,
      feeAllowed: false,
      formatRequired: 'machine-readable',
    },
    rightToErasure: {
      enabled: true,
      exceptions: ['legal-obligation', 'public-health'],
    },
    breachNotification: {
      supervisoryAuthority: 72, // hours
      dataSubject: 'without undue delay',
    },
    crossBorderTransfer: {
      mechanism: 'SCC',
      assessmentRequired: true,
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};
