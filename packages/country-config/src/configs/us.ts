/**
 * United States Country Configuration
 * Regulatory Framework: HIPAA
 */

import type { CountryConfig } from '../types';

export const USConfig: CountryConfig = {
  regionId: 'americas',
  region: 'North America',
  countryCode: 'US',
  name: 'United States',
  enabled: true,
  regulatoryFramework: ['HIPAA', 'HITECH', 'State Privacy Laws'],

  residency: {
    dataLocation: 'regional',
    allowedRegions: ['US', 'CA'],
    allowCrossBorderTransfer: true,
    transferSafeguards: ['Business Associate Agreement', 'Data Processing Agreement'],
    encryptionRequired: true,
    encryptionStandards: ['AES-256', 'TLS 1.3'],
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
      ePrescribeControlledSubstances: true,
      directMessaging: true,
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'treatment',
      'payment',
      'operations',
      'research',
      'marketing',
      'fundraising',
    ],
    withdrawalAllowed: true,
    minimumAge: 18,
    parentalConsentRequired: true,
    validityPeriod: 365, // 1 year
    requiresReconfirmation: true,
  },

  retention: {
    patientRecords: 6, // 6 years minimum, varies by state
    medicalImaging: 7,
    prescriptions: 2,
    auditLogs: 6,
    billing: 7,
    consent: 6,
    custom: {
      minorRecords: 21, // Until age of majority + retention period
      mentalHealth: 7,
      substanceAbuse: 7,
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
      'login',
      'logout',
      'consent-change',
      'permission-change',
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'quarterly',
    reportRecipients: ['privacy-officer', 'security-officer'],
  },

  providers: [
    {
      type: 'ehr',
      name: 'Epic/Cerner FHIR Adapter',
      required: false,
      authMethod: 'oauth2',
      config: {
        fhirVersion: 'R4',
        smartOnFhir: true,
      },
    },
    {
      type: 'hie',
      name: 'CommonWell/Carequality',
      required: false,
      authMethod: 'mutual-tls',
      config: {
        networkType: 'nationwide',
      },
    },
    {
      type: 'sms',
      name: 'Twilio',
      required: true,
      authMethod: 'api-key',
      config: {
        hipaaCompliant: true,
      },
    },
    {
      type: 'payment',
      name: 'Stripe',
      required: true,
      authMethod: 'api-key',
      config: {
        pciCompliant: true,
      },
    },
    {
      type: 'idv',
      name: 'ID.me / Login.gov',
      required: true,
      authMethod: 'oauth2',
      config: {
        verificationLevel: 'IAL2',
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'ssn',
      'dob',
      'name',
      'address',
      'phone',
      'email',
      'medicalRecordNumber',
      'insuranceId',
    ],
    retentionDays: 2190, // 6 years
    cloudStorageAllowed: true,
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'America/New_York',
  languages: ['en', 'es'],
  currency: 'USD',

  isolation: {
    enabled: false,
    dedicatedDatabase: false,
    dedicatedSecretsManager: false,
    dedicatedKeyVault: false,
    customerManagedKeys: false,
    dedicatedNamespace: false,
    dedicatedStorage: false,
  },

  tax: {
    vatApplicable: false,
    taxIdPattern: '^\\d{2}-\\d{7}$',
    taxIdFieldName: 'EIN',
    healthcareExemptions: ['medical-devices', 'prescription-drugs'],
  },

  locale: {
    primaryLanguage: 'en-US',
    supportedLanguages: ['en-US', 'es-US'],
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberLocale: 'en-US',
    addressFormat: 'street, city, state zip',
    phoneFormat: '(XXX) XXX-XXXX',
  },

  custom: {
    stateLaws: {
      california: 'CCPA',
      newYork: 'SHIELD Act',
      texas: 'Texas Medical Records Privacy Act',
    },
    breachNotificationDeadline: 60, // days
    minimumNecessaryStandard: true,
    rightOfAccess: {
      maxDays: 30,
      feeAllowed: false,
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};
