/**
 * Canada Country Configuration
 * Regulatory Framework: PIPEDA, Provincial Health Privacy Laws
 */

import type { CountryConfig } from '../types';

export const CanadaConfig: CountryConfig = {
  regionId: 'americas',
  region: 'North America',
  countryCode: 'CA',
  name: 'Canada',
  enabled: true,
  regulatoryFramework: [
    'PIPEDA',
    'PHIPA (Ontario)',
    'HIA (Alberta)',
    'PHIA (Manitoba)',
    'E-Health Act (Ontario)',
    'Canada Health Act',
  ],

  residency: {
    dataLocation: 'in-country',
    allowedRegions: ['CA'],
    allowCrossBorderTransfer: false,
    transferSafeguards: [
      'Model Clauses',
      'Data Processing Agreement',
      'Privacy Shield Equivalent',
    ],
    encryptionRequired: true,
    encryptionStandards: ['AES-256', 'TLS 1.3', 'FIPS 140-2'],
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
      provincialHealthRegistry: true,
      ontarioHealthConnect: true,
      canadaHealthInfoway: true,
      prescriptionMonitoringProgram: true,
      panCanadianTrust: true,
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'treatment',
      'health-records',
      'provincial-registry',
      'circle-of-care',
      'research',
      'public-health',
      'health-system-planning',
    ],
    withdrawalAllowed: true,
    minimumAge: 16, // Varies by province
    parentalConsentRequired: true,
    validityPeriod: 365, // 1 year
    requiresReconfirmation: true,
  },

  retention: {
    patientRecords: 10, // Minimum, varies by province
    medicalImaging: 10,
    prescriptions: 2,
    auditLogs: 10,
    billing: 7,
    consent: 10,
    custom: {
      pediatricRecords: 10, // Plus age of majority
      maternalRecords: 25,
      mentalHealthRecords: 10,
      longTermCare: 15,
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
      'cross-provincial-access',
      'break-glass',
      'privacy-breach',
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'quarterly',
    reportRecipients: ['privacy-officer', 'health-information-custodian', 'provincial-regulator'],
  },

  providers: [
    {
      type: 'hie',
      name: 'Provincial Health Registry',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        standard: 'HL7 v2.x/FHIR',
        provincialVariant: true,
        insuranceNumberValidation: true,
      },
    },
    {
      type: 'ehr',
      name: 'Canada Health Infoway',
      required: false,
      authMethod: 'oauth2',
      config: {
        standard: 'HL7 FHIR',
        version: 'R4',
        panCanadianTrust: true,
      },
    },
    {
      type: 'pharmacy',
      name: 'Prescription Monitoring Program',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        narcoticsMonitoring: true,
        provincialIntegration: true,
      },
    },
    {
      type: 'idv',
      name: 'Provincial Health Card Validation',
      required: true,
      authMethod: 'api-key',
      config: {
        healthCardValidation: true,
        provincialRegistry: true,
      },
    },
    {
      type: 'payment',
      name: 'Stripe/Moneris',
      required: true,
      authMethod: 'api-key',
      config: {
        paymentMethod: 'card-interac',
        currency: 'CAD',
        pciCompliant: true,
      },
    },
    {
      type: 'sms',
      name: 'Twilio Canada',
      required: true,
      authMethod: 'api-key',
      config: {
        canadianDataResidency: true,
        pipedaCompliant: true,
      },
    },
    {
      type: 'lab',
      name: 'Provincial Laboratory Networks',
      required: false,
      authMethod: 'mutual-tls',
      config: {
        provincialLabs: true,
        resultIntegration: true,
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'health-card-number',
      'sin', // Social Insurance Number
      'name',
      'dob',
      'address',
      'phone',
      'email',
      'provincial-id',
      'ohip-number',
      'alberta-phn',
    ],
    retentionDays: 3650, // 10 years
    cloudStorageAllowed: true,
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'America/Toronto', // Default to Eastern
  languages: ['en-CA', 'fr-CA'],
  currency: 'CAD',

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
    vatApplicable: true, // GST/HST
    standardVatRate: 5, // Federal GST
    reducedRates: {
      medicalServices: 0, // Exempt
      prescriptionDrugs: 0,
      medicalDevices: 0,
    },
    taxIdPattern: '^\\d{9}RT\\d{4}$',
    taxIdFieldName: 'Business Number (BN)',
    healthcareExemptions: [
      'medical-services',
      'prescription-drugs',
      'medical-devices',
      'hospital-services',
    ],
  },

  locale: {
    primaryLanguage: 'en-CA',
    supportedLanguages: ['en-CA', 'fr-CA'],
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12h',
    numberLocale: 'en-CA',
    addressFormat: 'street, city, province postal-code',
    phoneFormat: '+1 (XXX) XXX-XXXX',
  },

  custom: {
    privacyOfficer: {
      required: true,
      contactRequired: true,
      provincialRegistration: true,
    },
    healthInformationCustodian: {
      required: true,
      designation: 'mandatory',
    },
    provincialVariations: {
      ontario: {
        regulation: 'PHIPA',
        consentAge: 16,
        lockboxConsent: true,
      },
      alberta: {
        regulation: 'HIA',
        consentAge: 18,
        electronicHealthRecord: 'Netcare',
      },
      britishColumbia: {
        regulation: 'FIPPA',
        consentAge: 19,
        electronicHealthRecord: 'PharmaNet',
      },
      quebec: {
        regulation: 'Act Respecting Health Services',
        consentAge: 14,
        electronicHealthRecord: 'DSQ',
        language: 'fr-CA',
      },
    },
    provincialHealthInsurance: {
      enabled: true,
      insuranceNumberRequired: true,
      provincialValidation: true,
      reciprocalBilling: true,
    },
    rightOfAccess: {
      maxDays: 30,
      feeAllowed: true,
      maxFee: 30, // CAD
      extensionAllowed: true,
      extensionMaxDays: 30,
    },
    breachNotification: {
      privacyCommissioner: 'as soon as feasible',
      individual: 'as soon as feasible',
      threshold: 'real risk of significant harm',
      recordKeeping: '24 months',
    },
    crossBorderTransfer: {
      notificationRequired: true,
      consentRequired: true,
      safeguardsRequired: true,
      provincialApproval: true,
    },
    circleOfCare: {
      enabled: true,
      impliedConsent: false,
      lockboxSupport: true,
    },
    telehealth: {
      interprovincialLicensing: true,
      virtualCareGuidelines: true,
      consentForRecording: true,
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};

export default CanadaConfig;
