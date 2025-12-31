/**
 * Brazil Country Configuration
 * Regulatory Framework: LGPD (Lei Geral de Proteção de Dados)
 */

import type { CountryConfig } from '../types';

export const BrazilConfig: CountryConfig = {
  regionId: 'americas',
  region: 'South America',
  countryCode: 'BR',
  name: 'Brazil',
  enabled: true,
  regulatoryFramework: [
    'LGPD',
    'Lei 13.787/2018 (Digital Prescription)',
    'CFM Resolutions (Telemedicine)',
    'ANS Regulations',
  ],

  residency: {
    dataLocation: 'in-country',
    allowedRegions: ['BR'],
    allowCrossBorderTransfer: true,
    transferSafeguards: [
      'Adequacy Decision',
      'Standard Contractual Clauses',
      'Binding Corporate Rules',
      'Specific Consent',
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
      susIntegration: true, // Sistema Único de Saúde (Public Health)
      ansIntegration: true, // Agência Nacional de Saúde Suplementar (Private)
      digitalPrescription: true,
      rndsIntegration: true, // Rede Nacional de Dados em Saúde
      pixPayment: true,
    },
  },

  consent: {
    model: 'opt-in',
    explicitConsentRequired: true,
    availableScopes: [
      'treatment',
      'health-records',
      'sus-registry',
      'health-insurance',
      'research',
      'public-health',
      'epidemiological-surveillance',
    ],
    withdrawalAllowed: true,
    minimumAge: 18,
    parentalConsentRequired: true,
    validityPeriod: 365, // 1 year
    requiresReconfirmation: true,
  },

  retention: {
    patientRecords: 20, // CFM Resolution
    medicalImaging: 20,
    prescriptions: 2,
    auditLogs: 10,
    billing: 5,
    consent: 10,
    custom: {
      pediatricRecords: 20, // Plus time until 18
      occupationalHealth: 20,
      radiologyExams: 20,
      pathologyResults: 5,
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
      'anpd-report',
    ],
    realTime: true,
    immutable: true,
    tamperProof: true,
    reportingFrequency: 'quarterly',
    reportRecipients: ['data-protection-officer', 'controller', 'anpd'],
  },

  providers: [
    {
      type: 'hie',
      name: 'RNDS (Rede Nacional de Dados em Saúde)',
      required: true,
      authMethod: 'oauth2',
      config: {
        standard: 'HL7 FHIR',
        version: 'R4',
        govbrIntegration: true,
      },
    },
    {
      type: 'ehr',
      name: 'SUS e-SUS AB',
      required: false,
      authMethod: 'api-key',
      config: {
        platform: 'e-SUS',
        primaryCare: true,
      },
    },
    {
      type: 'ehr',
      name: 'ANS TISS',
      required: false,
      authMethod: 'api-key',
      config: {
        standard: 'TISS',
        privateHealthcare: true,
      },
    },
    {
      type: 'payment',
      name: 'PIX/Stripe Brazil',
      required: true,
      authMethod: 'api-key',
      config: {
        paymentMethod: 'pix-card-boleto',
        currency: 'BRL',
        pixEnabled: true,
      },
    },
    {
      type: 'sms',
      name: 'Twilio/Zenvia',
      required: true,
      authMethod: 'api-key',
      config: {
        bulkMessaging: true,
        lgpdCompliant: true,
      },
    },
    {
      type: 'idv',
      name: 'CPF Validation / gov.br',
      required: true,
      authMethod: 'oauth2',
      config: {
        verificationMethod: 'cpf',
        govbrIntegration: true,
        facialRecognition: true,
      },
    },
    {
      type: 'pharmacy',
      name: 'Digital Prescription System',
      required: true,
      authMethod: 'mutual-tls',
      config: {
        digitalSignature: true,
        controlledSubstances: true,
      },
    },
    {
      type: 'lab',
      name: 'Laboratory Networks',
      required: false,
      authMethod: 'api-key',
      config: {
        resultIntegration: true,
        anvisa: true, // Regulatory agency
      },
    },
  ],

  logging: {
    redactPHI: true,
    redactedFields: [
      'cpf',
      'cns', // Cartão Nacional de Saúde
      'name',
      'dob',
      'address',
      'phone',
      'email',
      'health-plan-number',
      'biometric-data',
      'genetic-data',
    ],
    retentionDays: 3650, // 10 years
    cloudStorageAllowed: true,
    minimumLevel: 'info',
    structuredLogging: true,
  },

  timezone: 'America/Sao_Paulo',
  languages: ['pt-BR'],
  currency: 'BRL',

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
    vatApplicable: true, // ICMS/ISS/PIS/COFINS
    standardVatRate: 17, // ICMS average (varies by state)
    reducedRates: {
      medicalServices: 0, // ISS exempt in most municipalities
      pharmaceuticals: 0, // ICMS exempt
      medicalEquipment: 0,
    },
    taxIdPattern: '^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$',
    taxIdFieldName: 'CNPJ',
    healthcareExemptions: [
      'medical-services',
      'pharmaceuticals',
      'hospital-services',
      'medical-equipment',
    ],
  },

  locale: {
    primaryLanguage: 'pt-BR',
    supportedLanguages: ['pt-BR'],
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberLocale: 'pt-BR',
    addressFormat: 'street, number, complement, neighborhood, city-state CEP',
    phoneFormat: '+55 (XX) XXXXX-XXXX',
  },

  custom: {
    dataProtectionOfficer: {
      required: true,
      contactRequired: true,
      anpdRegistration: false, // Not yet mandatory
    },
    susIntegration: {
      enabled: true,
      cnsRequired: true, // Cartão Nacional de Saúde
      rndsIntegration: true,
      esusIntegration: true,
      publicHealthcare: true,
    },
    ansIntegration: {
      enabled: true,
      tissStandard: true,
      healthInsuranceOperators: true,
      regulatoryReporting: true,
    },
    digitalPrescription: {
      enabled: true,
      digitalSignatureRequired: true,
      controlledSubstances: true,
      validityPeriod: 30, // days
    },
    telemedicine: {
      enabled: true,
      cfmGuidelines: true,
      consentRequired: true,
      recordingRequired: false,
    },
    rightOfAccess: {
      maxDays: 15,
      feeAllowed: false,
      formatRequired: 'clear-and-adequate',
    },
    rightToPortability: {
      enabled: true,
      structuredFormat: true,
      interoperableFormat: true,
    },
    rightToErasure: {
      enabled: true,
      exceptions: [
        'legal-obligation',
        'public-health',
        'medical-diagnosis',
        'exercise-of-rights',
      ],
    },
    breachNotification: {
      anpd: 'reasonable-period',
      dataSubject: 'reasonable-period',
      threshold: 'risk-or-damage',
    },
    crossBorderTransfer: {
      adequacyDecision: true,
      adequateCountries: ['EU', 'UK', 'Argentina', 'Uruguay'],
      safeguardsRequired: true,
      anpdNotification: false, // Not yet required
    },
    healthRegulations: {
      anvisa: true, // Pharmaceutical/medical device regulation
      cfm: true, // Medical council
      cofen: true, // Nursing council
      cff: true, // Pharmacy council
    },
    paymentMethods: {
      pix: true,
      creditCard: true,
      debitCard: true,
      boleto: true,
      healthInsurance: true,
    },
    sensitiveDataProcessing: {
      healthData: true,
      geneticData: true,
      biometricData: true,
      specificConsentRequired: true,
      dataMinimization: true,
    },
  },

  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};

export default BrazilConfig;
