/**
 * South Africa Country Configuration
 * Regulatory Framework: POPIA (Protection of Personal Information Act)
 */

import type { CountryConfig } from '../types';

export const SouthAfricaConfig: CountryConfig = {
  regionId: 'africa',
  region: 'Africa',
  countryCode: 'ZA',
  name: 'South Africa',
  enabled: true,
  regulatoryFramework: ['POPIA', 'National Health Act 2003', 'PFMA'],

  residency: {
    dataLocation: 'in-country',
    allowedRegions: ['ZA'],
    allowCrossBorderTransfer: true,
    transferSafeguards: [
      'Adequate Level of Protection',
      'Binding Corporate Rules',
      'Data Processing Agreement',
      'Consent',
    ],
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
      discoveryHealthIntegration: true,
      medicalSchemeIntegration: true,
      smsReminders: true,
      chronicMedicationManagement: true,
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'treatment',
      'health-records',
      'medical-scheme',
      'research',
      'public-health',
      'chronic-disease-management',
      'marketing',
    ],
    withdrawalAllowed: true,
    minimumAge: 18,
    parentalConsentRequired: true,
    validityPeriod: 365, // 1 year
    requiresReconfirmation: true,
  },

  retention: {
    patientRecords: 6,
    medicalImaging: 6,
    prescriptions: 6,
    auditLogs: 10,
    billing: 5,
    consent: 6,
    custom: {
      occupationalHealth: 40,
      childHealth: 21,
      hivRecords: 10,
      tbRecords: 10,
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
      'breach',
      'objection-handling',
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'quarterly',
    reportRecipients: ['information-officer', 'compliance-officer'],
  },

  providers: [
    {
      type: 'hie',
      name: 'National Health Information System',
      required: false,
      authMethod: 'oauth2',
      config: {
        standard: 'HL7 FHIR',
        version: 'R4',
      },
    },
    {
      type: 'ehr',
      name: 'Discovery Health/Mediclinic Integration',
      required: false,
      authMethod: 'oauth2',
      config: {
        provider: 'Discovery Health',
        chronicManagement: true,
      },
    },
    {
      type: 'payment',
      name: 'PayFast/Ozow',
      required: true,
      authMethod: 'api-key',
      config: {
        provider: 'PayFast',
        paymentMethod: 'card-eft',
        currency: 'ZAR',
      },
    },
    {
      type: 'sms',
      name: 'BulkSMS/Clickatell',
      required: true,
      authMethod: 'api-key',
      config: {
        bulkMessaging: true,
        deliveryReports: true,
      },
    },
    {
      type: 'idv',
      name: 'ID Verification (RSA ID)',
      required: true,
      authMethod: 'api-key',
      config: {
        verificationMethod: 'rsa-id',
        dhaIntegration: true, // Department of Home Affairs
      },
    },
    {
      type: 'pharmacy',
      name: 'Pharmacy Network Integration',
      required: false,
      authMethod: 'api-key',
      config: {
        network: 'clicks-dischem',
        chronicScript: true,
      },
    },
    {
      type: 'lab',
      name: 'Pathology Lab Networks',
      required: false,
      authMethod: 'api-key',
      config: {
        providers: ['Lancet', 'Pathcare', 'Ampath'],
        resultIntegration: true,
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'id-number',
      'passport-number',
      'name',
      'dob',
      'address',
      'phone',
      'email',
      'medical-aid-number',
      'hiv-status',
      'biometric-data',
    ],
    retentionDays: 3650, // 10 years
    cloudStorageAllowed: true,
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'Africa/Johannesburg',
  languages: ['en-ZA', 'af', 'zu'],
  currency: 'ZAR',

  isolation: {
    enabled: true,
    dedicatedDatabase: true,
    dedicatedSecretsManager: true,
    dedicatedKeyVault: true,
    customerManagedKeys: true,
    dedicatedNamespace: true,
    dedicatedStorage: true,
  },

  tax: {
    vatApplicable: true,
    standardVatRate: 15,
    reducedRates: {
      medicalServices: 0, // Exempt
      prescriptionMedicines: 0,
      medicalDevices: 0,
    },
    taxIdPattern: '^\\d{10}$',
    taxIdFieldName: 'VAT Number',
    healthcareExemptions: [
      'medical-services',
      'prescription-medicines',
      'medical-devices',
    ],
  },

  locale: {
    primaryLanguage: 'en-ZA',
    supportedLanguages: ['en-ZA', 'af-ZA', 'zu-ZA'],
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
    numberLocale: 'en-ZA',
    addressFormat: 'street, suburb, city, postal-code',
    phoneFormat: '+27 XX XXX XXXX',
  },

  custom: {
    informationOfficer: {
      required: true,
      registrationRequired: true,
      registrationAuthority: 'Information Regulator',
    },
    medicalSchemeIntegration: {
      enabled: true,
      providers: ['Discovery', 'Momentum', 'Bonitas', 'Fedhealth'],
      chronicBenefits: true,
    },
    publicHealthIntegration: {
      nicd: true, // National Institute for Communicable Diseases
      diseaseReporting: true,
      hivProgramme: true,
      tbProgramme: true,
    },
    rightOfAccess: {
      maxDays: 30,
      feeAllowed: true,
      maxFee: 50, // ZAR (prescribed fee)
    },
    rightToObjection: {
      enabled: true,
      processingDays: 30,
    },
    breachNotification: {
      regulator: 'as soon as reasonably possible',
      dataSubject: 'as soon as reasonably possible',
      threshold: 'harm likely',
    },
    crossBorderTransfer: {
      notificationRequired: false,
      adequacyAssessment: true,
      authorizedCountries: ['EU', 'UK', 'US-Privacy Shield equivalent'],
    },
    chronicDiseaseManagement: {
      enabled: true,
      conditions: ['diabetes', 'hypertension', 'asthma', 'hiv', 'epilepsy'],
      medicationReminders: true,
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};

export default SouthAfricaConfig;
