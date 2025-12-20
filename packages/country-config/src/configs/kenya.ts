/**
 * Kenya Country Configuration
 * Regulatory Framework: Kenya Data Protection Act, Health Act
 */

import type { CountryConfig } from '../types';

export const KenyaConfig: CountryConfig = {
  region: 'Africa',
  countryCode: 'KE',
  name: 'Kenya',
  enabled: true,
  regulatoryFramework: ['Kenya Data Protection Act 2019', 'Health Act 2017'],

  residency: {
    dataLocation: 'in-country',
    allowedRegions: ['KE'],
    allowCrossBorderTransfer: true,
    transferSafeguards: [
      'Adequate Level of Protection',
      'Data Processing Agreement',
      'Consent',
    ],
    encryptionRequired: true,
    encryptionStandards: ['AES-256', 'TLS 1.2+'],
  },

  features: {
    telehealth: true,
    videoConsultation: true,
    electronicPrescription: true,
    aiDiagnosis: true,
    aiTreatment: true,
    remoteMonitoring: true,
    wearableIntegration: true,
    mobileHealth: true,
    customFeatures: {
      mpesaIntegration: true, // Mobile money integration
      smsReminders: true,
      ussdSupport: true, // Unstructured Supplementary Service Data
      offlineSync: true, // Support for offline data sync
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'treatment',
      'health-records',
      'community-health',
      'research',
      'public-health-surveillance',
    ],
    withdrawalAllowed: true,
    minimumAge: 18,
    parentalConsentRequired: true,
    validityPeriod: 730, // 2 years
    requiresReconfirmation: true,
  },

  retention: {
    patientRecords: 10,
    medicalImaging: 5,
    prescriptions: 5,
    auditLogs: 7,
    billing: 7,
    consent: 10,
    custom: {
      immunizationRecords: 25, // Keep immunization records longer
      maternalHealth: 10,
      childHealth: 21, // Until age of majority
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
      'cross-border-transfer',
      'consent-change',
      'emergency-access',
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'quarterly',
    reportRecipients: ['data-controller', 'data-protection-officer'],
  },

  providers: [
    {
      type: 'hie',
      name: 'Kenya Health Information Exchange (KHIE)',
      required: false,
      authMethod: 'api-key',
      config: {
        standard: 'HL7 FHIR',
        version: 'R4',
      },
    },
    {
      type: 'ehr',
      name: 'OpenMRS/DHIS2 Integration',
      required: true,
      authMethod: 'oauth2',
      config: {
        platform: 'OpenMRS',
        dhis2Sync: true,
        offlineCapable: true,
      },
    },
    {
      type: 'payment',
      name: 'M-Pesa',
      required: true,
      authMethod: 'oauth2',
      config: {
        provider: 'Safaricom',
        paymentMethod: 'mobile-money',
      },
    },
    {
      type: 'sms',
      name: 'Africa\'s Talking',
      required: true,
      authMethod: 'api-key',
      config: {
        bulkMessaging: true,
        ussdSupport: true,
      },
    },
    {
      type: 'idv',
      name: 'National ID / Huduma Number',
      required: true,
      authMethod: 'api-key',
      config: {
        verificationMethod: 'government-id',
        hudumaNumber: true,
      },
    },
    {
      type: 'custom',
      name: 'Community Health Worker Integration',
      required: false,
      authMethod: 'api-key',
      config: {
        offlineFirst: true,
        syncInterval: 'daily',
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'national-id',
      'huduma-number',
      'name',
      'dob',
      'address',
      'phone',
      'email',
      'hiv-status',
      'tb-status',
    ],
    retentionDays: 2555, // 7 years
    cloudStorageAllowed: true,
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'Africa/Nairobi',
  languages: ['en', 'sw'], // English and Swahili
  currency: 'KES',

  custom: {
    dataProtectionOfficer: {
      required: true,
      registrationRequired: true,
      registrationAuthority: 'Office of the Data Protection Commissioner',
    },
    publicHealthIntegration: {
      dhis2: true,
      diseaseReporting: true,
      immunizationRegistry: true,
    },
    communityHealth: {
      chwSupport: true, // Community Health Worker support
      offlineCapability: true,
      smsNotifications: true,
    },
    mobileFirst: {
      ussd: true,
      sms: true,
      mpesa: true,
      lowBandwidth: true,
    },
    rightOfAccess: {
      maxDays: 21,
      feeAllowed: true,
      maxFee: 1000, // KES
    },
    breachNotification: {
      dataCommissioner: 72, // hours
      dataSubject: 'as soon as reasonably feasible',
    },
    crossBorderTransfer: {
      notificationRequired: true,
      authority: 'Data Protection Commissioner',
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};
