/**
 * United Kingdom Country Configuration
 * Regulatory Framework: UK GDPR, Data Protection Act 2018
 */

import type { CountryConfig } from '../types';

export const UnitedKingdomConfig: CountryConfig = {
  regionId: 'europe',
  region: 'Europe',
  countryCode: 'GB',
  name: 'United Kingdom',
  enabled: true,
  regulatoryFramework: [
    'UK GDPR',
    'Data Protection Act 2018',
    'NHS Act 2006',
    'Health and Social Care Act 2012',
    'Care Act 2014',
  ],

  residency: {
    dataLocation: 'regional',
    allowedRegions: ['GB', 'EU'],
    allowCrossBorderTransfer: true,
    transferSafeguards: [
      'Adequacy Decision',
      'Standard Contractual Clauses',
      'Binding Corporate Rules',
      'International Data Transfer Agreement (IDTA)',
    ],
    encryptionRequired: true,
    encryptionStandards: ['AES-256', 'TLS 1.3', 'NHS Data Security Standards'],
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
      nhsSpineIntegration: true,
      gpConnectIntegration: true,
      nhsLoginIntegration: true,
      electronicPrescriptionService: true, // EPS
      summaryCarRecord: true, // SCR
      nationalDataOptOut: true,
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'direct-care',
      'indirect-care',
      'individual-care',
      'local-care',
      'shared-care-record',
      'research',
      'planning-service-improvement',
      'national-data-opt-out',
    ],
    withdrawalAllowed: true,
    minimumAge: 16,
    parentalConsentRequired: true,
    validityPeriod: undefined, // No automatic expiry
    requiresReconfirmation: false,
  },

  retention: {
    patientRecords: 8, // 8 years after last contact
    medicalImaging: 8,
    prescriptions: 2,
    auditLogs: 8,
    billing: 8,
    consent: 8,
    custom: {
      childHealthRecords: 25, // Until 25th birthday
      maternityRecords: 25,
      mentalHealthRecords: 20,
      gpRecords: 10,
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
      'data-sharing',
      'break-glass',
      'national-data-opt-out',
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'monthly',
    reportRecipients: ['caldicott-guardian', 'data-protection-officer', 'senior-information-risk-owner'],
  },

  providers: [
    {
      type: 'hie',
      name: 'NHS Spine',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        spineMiniServiceProvider: true,
        pdsIntegration: true, // Personal Demographics Service
        sdsIntegration: true, // Spine Directory Service
      },
    },
    {
      type: 'ehr',
      name: 'GP Connect',
      required: true,
      authMethod: 'oauth2',
      config: {
        standard: 'HL7 FHIR',
        version: 'R4',
        gpConnectVersion: '1.5',
      },
    },
    {
      type: 'ehr',
      name: 'Summary Care Record',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        scrAccess: true,
        additionalInformation: true,
      },
    },
    {
      type: 'pharmacy',
      name: 'Electronic Prescription Service (EPS)',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        epsRelease: 'R2',
        nominatedPharmacy: true,
      },
    },
    {
      type: 'idv',
      name: 'NHS Login',
      required: true,
      authMethod: 'oauth2',
      config: {
        verificationLevel: 'P9',
        nhsNumber: true,
      },
    },
    {
      type: 'payment',
      name: 'Stripe/GoCardless',
      required: true,
      authMethod: 'api-key',
      config: {
        paymentMethod: 'card-direct-debit',
        currency: 'GBP',
      },
    },
    {
      type: 'sms',
      name: 'NHS Notify',
      required: true,
      authMethod: 'api-key',
      config: {
        gdprCompliant: true,
        nhsApproved: true,
      },
    },
    {
      type: 'lab',
      name: 'Pathology Messaging Implementation Programme',
      required: false,
      authMethod: 'mutual-tls',
      config: {
        standard: 'PMIP',
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'nhs-number',
      'chi-number',
      'name',
      'dob',
      'postcode',
      'address',
      'phone',
      'email',
      'hospital-number',
      'gp-registration',
    ],
    retentionDays: 2920, // 8 years
    cloudStorageAllowed: true,
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'Europe/London',
  languages: ['en-GB'],
  currency: 'GBP',

  isolation: {
    enabled: true,
    dedicatedDatabase: true,
    dedicatedKeyVault: true,
    customerManagedKeys: true,
    dedicatedNamespace: true,
    dedicatedStorage: true,
  },

  tax: {
    vatApplicable: true,
    standardVatRate: 20,
    reducedRates: {
      medicalServices: 0, // Exempt
      prescriptionDrugs: 0,
      medicalEquipment: 0,
    },
    taxIdPattern: '^GB\\d{9}$|^GB\\d{12}$|^GBGD\\d{3}$|^GBHA\\d{3}$',
    taxIdFieldName: 'VAT Number',
    healthcareExemptions: [
      'medical-services',
      'prescription-drugs',
      'medical-equipment',
      'nhs-services',
    ],
  },

  locale: {
    primaryLanguage: 'en-GB',
    supportedLanguages: ['en-GB', 'cy-GB'], // English and Welsh
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberLocale: 'en-GB',
    addressFormat: 'street, city, postcode',
    phoneFormat: '+44 XXXX XXX XXX',
  },

  custom: {
    dataProtectionOfficer: {
      required: true,
      contactRequired: true,
    },
    caldicottGuardian: {
      required: true,
      responsibilities: [
        'patient-confidentiality',
        'information-sharing',
        'consent-oversight',
      ],
    },
    seniorInformationRiskOwner: {
      required: true,
    },
    nhsIntegration: {
      spine: true,
      gpConnect: true,
      summaryCarRecord: true,
      electronicPrescriptionService: true,
      nhsLogin: true,
      personalDemographicsService: true,
    },
    dataSharingFramework: {
      dataSecurityProtectionToolkit: true, // DSPT
      informationGovernanceToolkit: true,
      nationalDataOptOut: true,
    },
    rightOfAccess: {
      maxDays: 30,
      feeAllowed: false,
      formatRequired: 'commonly-used-electronic-format',
    },
    rightToErasure: {
      enabled: true,
      exceptions: [
        'public-health',
        'medical-diagnosis',
        'legal-obligation',
        'archiving-purposes',
      ],
    },
    breachNotification: {
      ico: 72, // hours - Information Commissioner's Office
      dataSubject: 'without undue delay',
      threshold: 'risk to rights and freedoms',
    },
    crossBorderTransfer: {
      mechanism: 'Adequacy Decision or IDTA',
      transferRiskAssessment: true,
      adequateCountries: ['EU', 'EEA'],
    },
    informationGovernance: {
      dsptCompliance: true,
      isoCompliance: '27001',
      cyberEssentials: 'Plus',
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};

export default UnitedKingdomConfig;
