/**
 * Nigeria Country Configuration
 * Regulatory Framework: NDPR (Nigeria Data Protection Regulation)
 */

import type { CountryConfig } from '../types';

export const NigeriaConfig: CountryConfig = {
  regionId: 'africa',
  region: 'Africa',
  countryCode: 'NG',
  name: 'Nigeria',
  enabled: true,
  regulatoryFramework: ['NDPR', 'NHIS Act', 'National Health Act 2014'],

  residency: {
    dataLocation: 'in-country',
    allowedRegions: ['NG'],
    allowCrossBorderTransfer: true,
    transferSafeguards: [
      'Adequate Data Protection Safeguards',
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
      paystackIntegration: true,
      flutterwaveIntegration: true,
      smsReminders: true,
      ussdSupport: true,
      offlineSync: true,
      nhisIntegration: true,
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'treatment',
      'health-records',
      'nhis-registration',
      'research',
      'public-health',
      'marketing',
    ],
    withdrawalAllowed: true,
    minimumAge: 18,
    parentalConsentRequired: true,
    validityPeriod: 730, // 2 years
    requiresReconfirmation: true,
  },

  retention: {
    patientRecords: 10,
    medicalImaging: 7,
    prescriptions: 5,
    auditLogs: 10,
    billing: 7,
    consent: 10,
    custom: {
      immunizationRecords: 25,
      maternalHealth: 10,
      childHealth: 21,
      hivRecords: 10,
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
      'data-breach',
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'quarterly',
    reportRecipients: ['data-protection-officer', 'nitda-compliance-officer'],
  },

  providers: [
    {
      type: 'hie',
      name: 'National Health Information System',
      required: false,
      authMethod: 'api-key',
      config: {
        standard: 'HL7 FHIR',
        version: 'R4',
        nhisIntegration: true,
      },
    },
    {
      type: 'ehr',
      name: 'Local EHR/OpenMRS',
      required: true,
      authMethod: 'oauth2',
      config: {
        platform: 'OpenMRS',
        offlineCapable: true,
      },
    },
    {
      type: 'payment',
      name: 'Paystack',
      required: true,
      authMethod: 'api-key',
      config: {
        provider: 'Paystack',
        paymentMethod: 'card-mobile-money',
        currency: 'NGN',
      },
    },
    {
      type: 'payment',
      name: 'Flutterwave',
      required: false,
      authMethod: 'api-key',
      config: {
        provider: 'Flutterwave',
        paymentMethod: 'card-mobile-money',
        currency: 'NGN',
      },
    },
    {
      type: 'sms',
      name: 'Termii SMS',
      required: true,
      authMethod: 'api-key',
      config: {
        bulkMessaging: true,
        ussdSupport: true,
      },
    },
    {
      type: 'idv',
      name: 'BVN/NIN Verification',
      required: true,
      authMethod: 'api-key',
      config: {
        verificationMethod: 'bvn-nin',
        nibssIntegration: true,
      },
    },
    {
      type: 'lab',
      name: 'Local Lab Networks',
      required: false,
      authMethod: 'api-key',
      config: {
        labNetwork: 'regional',
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'bvn',
      'nin',
      'name',
      'dob',
      'address',
      'phone',
      'email',
      'nhis-number',
      'hiv-status',
      'genetic-data',
    ],
    retentionDays: 3650, // 10 years
    cloudStorageAllowed: true,
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'Africa/Lagos',
  languages: ['en-NG'],
  currency: 'NGN',

  isolation: {
    enabled: false,
    dedicatedDatabase: false,
    dedicatedKeyVault: false,
    customerManagedKeys: false,
    dedicatedNamespace: false,
    dedicatedStorage: false,
  },

  tax: {
    vatApplicable: true,
    standardVatRate: 7.5,
    reducedRates: {
      medicalServices: 0, // Exempt
      pharmaceuticals: 0,
      medicalEquipment: 0,
    },
    taxIdPattern: '^\\d{8}-\\d{4}$',
    taxIdFieldName: 'TIN',
    healthcareExemptions: ['medical-services', 'pharmaceuticals', 'medical-equipment'],
  },

  locale: {
    primaryLanguage: 'en-NG',
    supportedLanguages: ['en-NG'],
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    numberLocale: 'en-NG',
    addressFormat: 'street, city, state postal-code',
    phoneFormat: '+234 XXX XXX XXXX',
  },

  custom: {
    dataProtectionOfficer: {
      required: true,
      registrationRequired: true,
      registrationAuthority: 'NITDA (National Information Technology Development Agency)',
    },
    nhisIntegration: {
      enabled: true,
      enrollmentRequired: false,
      hmoIntegration: true,
    },
    publicHealthIntegration: {
      ncdc: true, // Nigeria Centre for Disease Control
      diseaseReporting: true,
      immunizationRegistry: true,
    },
    mobileFirst: {
      ussd: true,
      sms: true,
      mobileMoney: true,
      lowBandwidth: true,
    },
    rightOfAccess: {
      maxDays: 30,
      feeAllowed: true,
      maxFee: 5000, // NGN
    },
    breachNotification: {
      nitda: 72, // hours
      dataSubject: 'without undue delay',
    },
    crossBorderTransfer: {
      notificationRequired: true,
      authority: 'NITDA',
      whitelistedCountries: ['EU', 'UK', 'US'],
    },
    localLabs: {
      networkIntegration: true,
      resultDelivery: 'mobile-first',
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};

export default NigeriaConfig;
