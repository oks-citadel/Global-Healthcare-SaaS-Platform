/**
 * Test Fixtures for Price Transparency Service
 */

import { mockDecimal } from './mocks';

// ============================================================================
// Organization and Patient Fixtures
// ============================================================================

export const mockOrganizationId = 'org-test-123';
export const mockPatientId = 'patient-test-789';
export const mockProviderId = 'provider-test-456';

// ============================================================================
// Chargemaster Item Fixtures
// ============================================================================

export const mockChargemasterItem = {
  id: 'cm-item-001',
  organizationId: mockOrganizationId,
  code: 'CHG-99213',
  description: 'Office or other outpatient visit, established patient, level 3',
  cptCode: '99213',
  hcpcsCode: null,
  ndcCode: null,
  revenueCode: '0510',
  departmentName: 'Outpatient',
  grossCharge: mockDecimal(250),
  discountedCashPrice: mockDecimal(175),
  deidentifiedMinimum: mockDecimal(120),
  deidentifiedMaximum: mockDecimal(280),
  drugUnitOfMeasure: null,
  isShoppable: true,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockChargemasterItemWithDrug = {
  ...mockChargemasterItem,
  id: 'cm-item-002',
  code: 'CHG-J0696',
  description: 'Injection, ceftriaxone sodium',
  cptCode: null,
  hcpcsCode: 'J0696',
  ndcCode: '00409-7337-01',
  departmentName: 'Pharmacy',
  grossCharge: mockDecimal(85),
  discountedCashPrice: mockDecimal(60),
  drugUnitOfMeasure: 'EA',
};

export const mockChargemasterItemSurgical = {
  ...mockChargemasterItem,
  id: 'cm-item-003',
  code: 'CHG-27447',
  description: 'Arthroplasty, knee, condyle and plateau',
  cptCode: '27447',
  departmentName: 'Surgical',
  grossCharge: mockDecimal(45000),
  discountedCashPrice: mockDecimal(32000),
  deidentifiedMinimum: mockDecimal(25000),
  deidentifiedMaximum: mockDecimal(55000),
};

export const mockChargemasterItems = [
  mockChargemasterItem,
  mockChargemasterItemWithDrug,
  mockChargemasterItemSurgical,
];

// ============================================================================
// Shoppable Service Fixtures
// ============================================================================

export const mockShoppableService = {
  id: 'ss-001',
  organizationId: mockOrganizationId,
  serviceName: 'Office Visit - Established Patient Level 3',
  serviceCode: '99213',
  description: 'A routine office visit for an established patient with low to moderate complexity',
  plainLanguageDescription: 'A standard doctor visit for existing patients',
  estimatedPrice: mockDecimal(175),
  ancillaryServices: ['Lab work may be additional'],
  isActive: true,
  cmsRequired: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockShoppableServices = Array.from({ length: 70 }, (_, i) => ({
  ...mockShoppableService,
  id: `ss-${String(i + 1).padStart(3, '0')}`,
  serviceName: `Shoppable Service ${i + 1}`,
  serviceCode: `99${200 + i}`,
  estimatedPrice: mockDecimal(100 + i * 10),
}));

// ============================================================================
// Payer Contract Fixtures
// ============================================================================

export const mockPayerContract = {
  id: 'contract-001',
  organizationId: mockOrganizationId,
  payerId: 'payer-bcbs',
  payerName: 'Blue Cross Blue Shield',
  planType: 'PPO',
  planName: 'Standard PPO Plan',
  ein: '12-3456789',
  effectiveDate: new Date('2024-01-01'),
  terminationDate: new Date('2024-12-31'),
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockPayerContractAetna = {
  ...mockPayerContract,
  id: 'contract-002',
  payerId: 'payer-aetna',
  payerName: 'Aetna',
  planType: 'HMO',
  planName: 'HMO Select',
};

export const mockPayerContractUnitedHealthcare = {
  ...mockPayerContract,
  id: 'contract-003',
  payerId: 'payer-uhc',
  payerName: 'UnitedHealthcare',
  planType: 'EPO',
  planName: 'Choice Plus EPO',
};

export const mockPayerContracts = [
  mockPayerContract,
  mockPayerContractAetna,
  mockPayerContractUnitedHealthcare,
];

// ============================================================================
// Payer Contract Rate Fixtures
// ============================================================================

export const mockPayerContractRate = {
  id: 'rate-001',
  payerContractId: 'contract-001',
  chargemasterItemId: 'cm-item-001',
  cptCode: '99213',
  hcpcsCode: null,
  modifiers: [],
  negotiatedRate: mockDecimal(180),
  percentageOfCharge: null,
  rateType: 'fixed',
  effectiveDate: new Date('2024-01-01'),
  expirationDate: new Date('2024-12-31'),
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockPayerContractRates = [
  mockPayerContractRate,
  {
    ...mockPayerContractRate,
    id: 'rate-002',
    payerContractId: 'contract-002',
    negotiatedRate: mockDecimal(165),
  },
  {
    ...mockPayerContractRate,
    id: 'rate-003',
    payerContractId: 'contract-003',
    negotiatedRate: mockDecimal(200),
  },
];

// ============================================================================
// Good Faith Estimate Fixtures
// ============================================================================

export const mockGoodFaithEstimate = {
  id: 'gfe-123',
  organizationId: mockOrganizationId,
  patientId: mockPatientId,
  scheduledServiceDate: new Date('2024-02-15'),
  expirationDate: new Date('2025-02-14'),
  status: 'draft',
  primaryDiagnosis: 'Knee osteoarthritis',
  primaryDiagnosisCode: 'M17.11',
  scheduledProcedures: [
    { code: '99213', description: 'Office Visit', quantity: 1 },
  ],
  providerNPI: '1234567890',
  providerName: 'Dr. John Smith',
  providerType: 'Orthopedic Surgeon',
  facilityNPI: '0987654321',
  facilityName: 'Community Hospital',
  facilityType: 'Acute Care Hospital',
  patientInsuranceType: 'self-pay',
  estimatedTotal: mockDecimal(500),
  discountedCashPrice: mockDecimal(400),
  patientResponsibility: null,
  coInsuranceAmount: null,
  deductibleAmount: null,
  copayAmount: null,
  validForDays: 365,
  disclaimer: 'This Good Faith Estimate shows the costs...',
  patientSignature: null,
  patientSignedAt: null,
  deliveredAt: null,
  deliveredMethod: null,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const mockGoodFaithEstimateDelivered = {
  ...mockGoodFaithEstimate,
  id: 'gfe-124',
  status: 'delivered',
  deliveredAt: new Date('2024-01-16'),
  deliveredMethod: 'email',
};

export const mockGoodFaithEstimateAcknowledged = {
  ...mockGoodFaithEstimate,
  id: 'gfe-125',
  status: 'acknowledged',
  deliveredAt: new Date('2024-01-16'),
  deliveredMethod: 'portal',
  patientSignature: 'Jane Doe',
  patientSignedAt: new Date('2024-01-17'),
};

// ============================================================================
// GFE Line Item Fixtures
// ============================================================================

export const mockGFELineItem = {
  id: 'gfe-line-001',
  goodFaithEstimateId: 'gfe-123',
  serviceCode: '99213',
  serviceDescription: 'Office or other outpatient visit, established patient',
  modifiers: [],
  quantity: 1,
  unitPrice: 250,
  totalPrice: 250,
  providerNPI: '1234567890',
  providerType: 'MD',
  serviceLocation: 'Outpatient Clinic',
  estimatedDate: new Date('2024-02-15'),
  isRecurring: false,
  recurringPeriod: null,
  notes: null,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const mockGFELineItems = [
  mockGFELineItem,
  {
    ...mockGFELineItem,
    id: 'gfe-line-002',
    serviceCode: '80053',
    serviceDescription: 'Comprehensive metabolic panel',
    unitPrice: 150,
    totalPrice: 150,
  },
];

// ============================================================================
// Price Estimate Fixtures
// ============================================================================

export const mockPriceEstimate = {
  id: 'pe-001',
  organizationId: mockOrganizationId,
  patientId: mockPatientId,
  chargemasterItemId: 'cm-item-001',
  serviceCode: '99213',
  serviceDescription: 'Office Visit',
  diagnosisCode: 'Z00.00',
  diagnosisDescription: 'General adult medical examination',
  payerId: 'payer-bcbs',
  payerName: 'Blue Cross Blue Shield',
  planType: 'PPO',
  grossCharge: 250,
  negotiatedRate: 180,
  discountedCashPrice: 175,
  estimatedInsPayment: 144,
  estimatedPatientResp: 36,
  deductibleRemaining: 0,
  outOfPocketRemaining: 3000,
  notes: null,
  expiresAt: new Date('2024-03-15'),
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

// ============================================================================
// Price Comparison Cache Fixtures
// ============================================================================

export const mockPriceComparisonCache = {
  id: 'pcc-001',
  serviceCode: '99213',
  zipCode: '90210',
  searchRadius: 25,
  results: [
    { facilityName: 'Hospital A', price: 200 },
    { facilityName: 'Hospital B', price: 180 },
  ],
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

// ============================================================================
// Machine Readable File Fixtures
// ============================================================================

export const mockMachineReadableFile = {
  id: 'mrf-001',
  organizationId: mockOrganizationId,
  fileName: 'org-test-123_standard-charges_20240115.json',
  fileType: 'standard_charges',
  version: '1.0',
  schemaVersion: '2.0.0',
  fileUrl: null,
  validFrom: new Date('2024-01-01'),
  validTo: new Date('2025-01-01'),
  status: 'generated',
  recordCount: 1500,
  complianceCheckPassed: true,
  complianceCheckDate: new Date('2024-01-15'),
  errorMessage: null,
  lastPublishedAt: null,
  generatedAt: new Date('2024-01-15'),
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const mockMachineReadableFilePublished = {
  ...mockMachineReadableFile,
  id: 'mrf-002',
  status: 'published',
  fileUrl: 'https://example.com/mrf/standard-charges.json',
  lastPublishedAt: new Date('2024-01-15'),
};

// ============================================================================
// Compliance Audit Fixtures
// ============================================================================

export const mockComplianceAudit = {
  id: 'audit-001',
  organizationId: mockOrganizationId,
  auditType: 'cms_hospital_price_transparency',
  auditDate: new Date('2024-01-15'),
  findings: [
    {
      passed: true,
      checkName: 'Chargemaster Completeness',
      category: 'Data Quality',
      severity: 'info',
      message: '98% of chargemaster items have CPT/HCPCS codes',
    },
    {
      passed: true,
      checkName: 'Shoppable Services Count',
      category: 'CMS Requirements',
      severity: 'info',
      message: '75 shoppable services defined (minimum 70 required)',
    },
  ],
  overallScore: 95.5,
  passedChecks: 5,
  failedChecks: 1,
  warningChecks: 0,
  recommendations: ['Add discounted cash prices to all chargemaster items'],
  remedationDeadline: null,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const mockComplianceAuditFailing = {
  ...mockComplianceAudit,
  id: 'audit-002',
  overallScore: 45,
  passedChecks: 2,
  failedChecks: 4,
  warningChecks: 1,
  findings: [
    {
      passed: false,
      checkName: 'Shoppable Services Count',
      category: 'CMS Requirements',
      severity: 'critical',
      message: '35 shoppable services defined (minimum 70 required)',
      recommendation: 'Add 35 more shoppable services to meet CMS requirements',
    },
    {
      passed: false,
      checkName: 'MRF Publication',
      category: 'CMS Requirements',
      severity: 'critical',
      message: 'No machine-readable file published in the last 30 days',
      recommendation: 'Generate and publish machine-readable file immediately',
    },
  ],
  recommendations: [
    'Add 35 more shoppable services to meet CMS requirements',
    'Generate and publish machine-readable file immediately',
  ],
  remedationDeadline: new Date('2024-02-15'),
};

// ============================================================================
// Input Parameter Fixtures
// ============================================================================

export const mockPriceLookupParams = {
  organizationId: mockOrganizationId,
  serviceCode: '99213',
  payerId: undefined,
  zipCode: undefined,
};

export const mockPriceLookupParamsWithPayer = {
  ...mockPriceLookupParams,
  payerId: 'payer-bcbs',
};

export const mockCreateGFEParams = {
  organizationId: mockOrganizationId,
  patientId: mockPatientId,
  scheduledServiceDate: new Date('2024-02-15'),
  primaryDiagnosis: 'Knee pain',
  primaryDiagnosisCode: 'M25.561',
  scheduledProcedures: [
    { code: '99213', description: 'Office Visit', quantity: 1 },
    { code: '73560', description: 'Knee X-Ray', quantity: 1 },
  ],
  providerNPI: '1234567890',
  providerName: 'Dr. John Smith',
  providerType: 'Orthopedic Surgeon',
  facilityNPI: '0987654321',
  facilityName: 'Community Hospital',
  facilityType: 'Acute Care Hospital',
  patientInsuranceType: 'self-pay',
  validForDays: 365,
};

export const mockMRFGenerationParams = {
  organizationId: mockOrganizationId,
  fileType: 'standard_charges' as const,
  validFrom: new Date('2024-01-01'),
  validTo: new Date('2025-01-01'),
  outputFormat: 'json' as const,
};

export const mockMRFGenerationParamsCSV = {
  ...mockMRFGenerationParams,
  outputFormat: 'csv' as const,
};

// ============================================================================
// MRF Content Fixtures
// ============================================================================

export const mockStandardChargesContent = {
  hospital_name: 'Community Hospital',
  last_updated_on: '2024-01-15',
  version: '2.0.0',
  hospital_location: ['Main Campus'],
  hospital_address: ['123 Healthcare Way, City, ST 12345'],
  license_number: 'LIC-12345',
  affirmation: {
    affirmation: 'To the best of my knowledge, the standard charge information is accurate.',
    confirm_affirmation: true,
  },
  standard_charge_information: [
    {
      description: 'Office Visit Level 3',
      code_information: [{ code: '99213', type: 'CPT' }],
      standard_charges: [
        {
          minimum: 120,
          maximum: 280,
          gross_charge: 250,
          discounted_cash: 175,
          setting: 'outpatient',
          payers_information: [
            {
              payer_name: 'Blue Cross Blue Shield',
              plan_name: 'PPO',
              standard_charge_dollar: 180,
              standard_charge_percentage: null,
              standard_charge_algorithm: null,
              estimated_amount: 180,
              contracting_method: 'fee schedule',
            },
          ],
          additional_payer_notes: null,
        },
      ],
      additional_generic_notes: null,
    },
  ],
};

export const mockInNetworkRatesContent = {
  reporting_entity_name: 'Community Hospital',
  reporting_entity_type: 'hospital',
  last_updated_on: '2024-01-15',
  version: '2.0.0',
  in_network: [
    {
      plan_name: 'PPO',
      plan_id_type: 'EIN',
      plan_id: '12-3456789',
      plan_market_type: 'PPO',
      description: 'Office Visit Level 3',
      billing_code_type: 'CPT',
      billing_code: '99213',
      negotiated_type: 'negotiated',
      negotiated_rate: 180,
      expiration_date: '2024-12-31',
    },
  ],
};
