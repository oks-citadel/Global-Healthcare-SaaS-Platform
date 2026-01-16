/**
 * Price Transparency Service - Comprehensive Test Suite
 *
 * This file provides a comprehensive test suite covering all major functionality
 * of the Price Transparency Service including:
 * - Price Lookup (CPT codes, HCPCS codes, shoppable services)
 * - Good Faith Estimate (GFE creation, patient responsibility calculation)
 * - MRF Generation (standard charges, JSON/CSV export)
 * - Compliance checks (hospital price transparency, No Surprises Act)
 *
 * For detailed unit tests, see:
 * - tests/unit/services/price.service.test.ts
 * - tests/unit/services/estimate.service.test.ts
 * - tests/unit/services/mrf-generator.service.test.ts
 * - tests/unit/services/compliance.service.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================================
// Mock Setup
// ============================================================================

const mockDecimal = (value: number) => ({
  toNumber: () => value,
  toString: () => value.toString(),
  add: (other: any) => mockDecimal(value + (other?.toNumber?.() ?? other)),
  sub: (other: any) => mockDecimal(value - (other?.toNumber?.() ?? other)),
  mul: (other: any) => mockDecimal(value * (other?.toNumber?.() ?? other)),
  div: (other: any) => mockDecimal(value / (other?.toNumber?.() ?? other)),
  equals: (other: any) => value === (other?.toNumber?.() ?? other),
});

const mockPrismaClient = () => ({
  chargemasterItem: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  shoppableService: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  payerContract: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  payerContractRate: {
    findMany: vi.fn(),
  },
  goodFaithEstimate: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  gFELineItem: {
    findMany: vi.fn(),
    createMany: vi.fn(),
  },
  priceEstimate: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
  },
  priceComparisonCache: {
    findUnique: vi.fn(),
  },
  machineReadableFile: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  complianceAudit: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
});

// Mock Prisma
vi.mock('./generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
  GFEStatus: {
    draft: 'draft',
    pending: 'pending',
    sent: 'sent',
    delivered: 'delivered',
    acknowledged: 'acknowledged',
    expired: 'expired',
    disputed: 'disputed',
  },
  MRFFileType: {
    standard_charges: 'standard_charges',
    in_network_rates: 'in_network_rates',
    out_of_network_allowed: 'out_of_network_allowed',
    prescription_drugs: 'prescription_drugs',
    negotiated_rates: 'negotiated_rates',
  },
  MRFStatus: {
    pending: 'pending',
    generating: 'generating',
    generated: 'generated',
    published: 'published',
    failed: 'failed',
    archived: 'archived',
  },
  ComplianceAuditType: {
    cms_hospital_price_transparency: 'cms_hospital_price_transparency',
    no_surprises_act_gfe: 'no_surprises_act_gfe',
    state_price_transparency: 'state_price_transparency',
  },
  Prisma: {
    Decimal: (value: number) => mockDecimal(value),
    JsonArray: Array,
  },
}));

// Import services after mocking
import { PriceService } from './services/price.service';
import { EstimateService } from './services/estimate.service';
import { MRFGeneratorService } from './services/mrf-generator.service';
import { ComplianceService } from './services/compliance.service';

// ============================================================================
// Test Fixtures
// ============================================================================

const mockChargemasterItem = {
  id: 'cm-001',
  organizationId: 'org-123',
  code: 'CHG-99213',
  description: 'Office Visit Level 3',
  cptCode: '99213',
  hcpcsCode: null,
  ndcCode: null,
  grossCharge: mockDecimal(250),
  discountedCashPrice: mockDecimal(175),
  deidentifiedMinimum: mockDecimal(120),
  deidentifiedMaximum: mockDecimal(280),
  isShoppable: true,
  isActive: true,
};

const mockPayerContract = {
  id: 'contract-001',
  organizationId: 'org-123',
  payerId: 'payer-bcbs',
  payerName: 'Blue Cross Blue Shield',
  planType: 'PPO',
  planName: 'Standard PPO',
  isActive: true,
};

const mockPayerContractRate = {
  id: 'rate-001',
  payerContractId: 'contract-001',
  chargemasterItemId: 'cm-001',
  cptCode: '99213',
  negotiatedRate: mockDecimal(180),
  rateType: 'fixed',
  effectiveDate: new Date('2024-01-01'),
  expirationDate: new Date('2024-12-31'),
  isActive: true,
};

const mockGoodFaithEstimate = {
  id: 'gfe-123',
  organizationId: 'org-123',
  patientId: 'patient-789',
  status: 'draft',
  estimatedTotal: mockDecimal(500),
  disclaimer: 'This Good Faith Estimate shows the costs...',
  lineItems: [],
  createdAt: new Date(),
};

const mockGFELineItem = {
  id: 'gfe-line-001',
  goodFaithEstimateId: 'gfe-123',
  serviceCode: '99213',
  serviceDescription: 'Office Visit',
  quantity: 1,
  unitPrice: 250,
  totalPrice: 250,
};

const mockMRFFile = {
  id: 'mrf-001',
  organizationId: 'org-123',
  fileName: 'org-123_standard-charges_20240115.json',
  fileType: 'standard_charges',
  status: 'generated',
  recordCount: 1500,
};

// ============================================================================
// Price Transparency Service Tests
// ============================================================================

describe('Price Transparency Service', () => {
  it('should be defined', () => {
    expect(PriceService).toBeDefined();
    expect(EstimateService).toBeDefined();
    expect(MRFGeneratorService).toBeDefined();
    expect(ComplianceService).toBeDefined();
  });

  // ==========================================================================
  // Price Lookup Tests
  // ==========================================================================

  describe('Price Lookup', () => {
    let priceService: PriceService;
    let mockPrisma: any;

    beforeEach(() => {
      vi.clearAllMocks();
      priceService = new PriceService();
      mockPrisma = (priceService as any).prisma;
    });

    describe('CPT Code Lookup', () => {
      it('should look up prices by CPT code', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
        });

        expect(result).not.toBeNull();
        expect(result?.cptCode).toBe('99213');
        expect(result?.description).toBe('Office Visit Level 3');
      });

      it('should search by CPT code in the query', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);

        await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
        });

        expect(mockPrisma.chargemasterItem.findFirst).toHaveBeenCalledWith({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { cptCode: '99213' },
            ]),
          }),
          include: expect.any(Object),
        });
      });

      it('should return gross charge for CPT code', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
        });

        expect(result?.grossCharge).toBeDefined();
      });

      it('should return discounted cash price for CPT code', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
        });

        expect(result?.discountedCashPrice).toBeDefined();
      });

      it('should return de-identified min/max for CPT code', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
        });

        expect(result?.deidentifiedMinimum).toBeDefined();
        expect(result?.deidentifiedMaximum).toBeDefined();
      });
    });

    describe('HCPCS Code Lookup', () => {
      it('should look up prices by HCPCS code', async () => {
        const hcpcsItem = {
          ...mockChargemasterItem,
          cptCode: null,
          hcpcsCode: 'J0696',
          description: 'Injection, ceftriaxone sodium',
        };
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(hcpcsItem);

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: 'J0696',
        });

        expect(result).not.toBeNull();
        expect(result?.hcpcsCode).toBe('J0696');
      });

      it('should search by HCPCS code in the query', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(null);

        await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: 'J0696',
        });

        expect(mockPrisma.chargemasterItem.findFirst).toHaveBeenCalledWith({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { hcpcsCode: 'J0696' },
            ]),
          }),
          include: expect.any(Object),
        });
      });

      it('should return null for non-existent HCPCS code', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(null);

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: 'INVALID',
        });

        expect(result).toBeNull();
      });
    });

    describe('Payer-Specific Rates', () => {
      it('should include payer-specific rates when payerId provided', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue({
          ...mockChargemasterItem,
          payerRates: [
            {
              ...mockPayerContractRate,
              payerContract: mockPayerContract,
            },
          ],
        });

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
          payerId: 'payer-bcbs',
        });

        expect(result?.payerSpecificRates).toBeDefined();
        expect(result?.payerSpecificRates.length).toBeGreaterThan(0);
      });

      it('should include payer name in rates', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue({
          ...mockChargemasterItem,
          payerRates: [
            {
              ...mockPayerContractRate,
              payerContract: mockPayerContract,
            },
          ],
        });

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
          payerId: 'payer-bcbs',
        });

        expect(result?.payerSpecificRates[0].payerName).toBe('Blue Cross Blue Shield');
      });

      it('should include negotiated rate amount', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue({
          ...mockChargemasterItem,
          payerRates: [
            {
              ...mockPayerContractRate,
              payerContract: mockPayerContract,
            },
          ],
        });

        const result = await priceService.lookupPrice({
          organizationId: 'org-123',
          serviceCode: '99213',
          payerId: 'payer-bcbs',
        });

        expect(result?.payerSpecificRates[0].negotiatedRate).toBeDefined();
      });
    });

    describe('Shoppable Services', () => {
      it('should return shoppable services', async () => {
        mockPrisma.shoppableService.findMany.mockResolvedValue([
          {
            id: 'ss-001',
            serviceName: 'Office Visit',
            serviceCode: '99213',
            estimatedPrice: mockDecimal(175),
            isActive: true,
          },
        ]);
        mockPrisma.shoppableService.count.mockResolvedValue(1);

        const result = await priceService.getShoppableServices('org-123');

        expect(result.services).toHaveLength(1);
        expect(result.total).toBe(1);
      });

      it('should only return active shoppable services', async () => {
        mockPrisma.shoppableService.findMany.mockResolvedValue([]);
        mockPrisma.shoppableService.count.mockResolvedValue(0);

        await priceService.getShoppableServices('org-123');

        expect(mockPrisma.shoppableService.findMany).toHaveBeenCalledWith({
          where: expect.objectContaining({ isActive: true }),
          orderBy: expect.any(Object),
          take: 100,
          skip: 0,
        });
      });

      it('should support pagination', async () => {
        mockPrisma.shoppableService.findMany.mockResolvedValue([]);
        mockPrisma.shoppableService.count.mockResolvedValue(100);

        await priceService.getShoppableServices('org-123', 10, 20);

        expect(mockPrisma.shoppableService.findMany).toHaveBeenCalledWith({
          where: expect.any(Object),
          orderBy: expect.any(Object),
          take: 10,
          skip: 20,
        });
      });

      it('should return total count with pagination', async () => {
        mockPrisma.shoppableService.findMany.mockResolvedValue([]);
        mockPrisma.shoppableService.count.mockResolvedValue(250);

        const result = await priceService.getShoppableServices('org-123', 50, 0);

        expect(result.total).toBe(250);
      });
    });

    describe('Chargemaster Search', () => {
      it('should search chargemaster by search term', async () => {
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([mockChargemasterItem]);
        mockPrisma.chargemasterItem.count.mockResolvedValue(1);

        const result = await priceService.searchChargemaster({
          organizationId: 'org-123',
          searchTerm: 'office visit',
        });

        expect(result.items).toHaveLength(1);
        expect(result.total).toBe(1);
      });

      it('should filter by CPT code', async () => {
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([mockChargemasterItem]);
        mockPrisma.chargemasterItem.count.mockResolvedValue(1);

        await priceService.searchChargemaster({
          organizationId: 'org-123',
          cptCode: '99213',
        });

        expect(mockPrisma.chargemasterItem.findMany).toHaveBeenCalledWith({
          where: expect.objectContaining({ cptCode: '99213' }),
          orderBy: expect.any(Object),
          take: 50,
          skip: 0,
        });
      });

      it('should filter by shoppable status', async () => {
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([mockChargemasterItem]);
        mockPrisma.chargemasterItem.count.mockResolvedValue(1);

        await priceService.searchChargemaster({
          organizationId: 'org-123',
          isShoppable: true,
        });

        expect(mockPrisma.chargemasterItem.findMany).toHaveBeenCalledWith({
          where: expect.objectContaining({ isShoppable: true }),
          orderBy: expect.any(Object),
          take: 50,
          skip: 0,
        });
      });

      it('should filter by department', async () => {
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([mockChargemasterItem]);
        mockPrisma.chargemasterItem.count.mockResolvedValue(1);

        await priceService.searchChargemaster({
          organizationId: 'org-123',
          department: 'Outpatient',
        });

        expect(mockPrisma.chargemasterItem.findMany).toHaveBeenCalledWith({
          where: expect.objectContaining({
            departmentName: { contains: 'Outpatient', mode: 'insensitive' },
          }),
          orderBy: expect.any(Object),
          take: 50,
          skip: 0,
        });
      });
    });

    describe('Payer Price Comparison', () => {
      it('should compare prices across payers', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.payerContractRate.findMany.mockResolvedValue([
          { ...mockPayerContractRate, payerContract: mockPayerContract, negotiatedRate: mockDecimal(180) },
          { ...mockPayerContractRate, id: 'rate-2', payerContract: { ...mockPayerContract, payerName: 'Aetna' }, negotiatedRate: mockDecimal(165) },
        ]);

        const result = await priceService.comparePayerPrices('org-123', '99213');

        expect(result).not.toBeNull();
        expect(result?.payerRates).toHaveLength(2);
      });

      it('should calculate min negotiated rate', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.payerContractRate.findMany.mockResolvedValue([
          { ...mockPayerContractRate, payerContract: mockPayerContract, negotiatedRate: mockDecimal(200) },
          { ...mockPayerContractRate, payerContract: mockPayerContract, negotiatedRate: mockDecimal(150) },
        ]);

        const result = await priceService.comparePayerPrices('org-123', '99213');

        expect(result?.statistics.minNegotiatedRate).toBe(150);
      });

      it('should calculate max negotiated rate', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.payerContractRate.findMany.mockResolvedValue([
          { ...mockPayerContractRate, payerContract: mockPayerContract, negotiatedRate: mockDecimal(200) },
          { ...mockPayerContractRate, payerContract: mockPayerContract, negotiatedRate: mockDecimal(150) },
        ]);

        const result = await priceService.comparePayerPrices('org-123', '99213');

        expect(result?.statistics.maxNegotiatedRate).toBe(200);
      });

      it('should calculate average negotiated rate', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.payerContractRate.findMany.mockResolvedValue([
          { ...mockPayerContractRate, payerContract: mockPayerContract, negotiatedRate: mockDecimal(200) },
          { ...mockPayerContractRate, payerContract: mockPayerContract, negotiatedRate: mockDecimal(100) },
        ]);

        const result = await priceService.comparePayerPrices('org-123', '99213');

        expect(result?.statistics.averageNegotiatedRate).toBe(150);
      });

      it('should return null for unknown service', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(null);

        const result = await priceService.comparePayerPrices('org-123', 'UNKNOWN');

        expect(result).toBeNull();
      });
    });
  });

  // ==========================================================================
  // Good Faith Estimate Tests
  // ==========================================================================

  describe('Good Faith Estimate', () => {
    let estimateService: EstimateService;
    let mockPrisma: any;

    beforeEach(() => {
      vi.clearAllMocks();
      estimateService = new EstimateService();
      mockPrisma = (estimateService as any).prisma;
    });

    describe('GFE Creation', () => {
      it('should create a GFE', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          lineItems: [mockGFELineItem],
        });

        const result = await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [
            { code: '99213', description: 'Office Visit', quantity: 1 },
          ],
        });

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('status', 'draft');
      });

      it('should include line items for procedures', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          lineItems: [mockGFELineItem],
        });

        await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [
            { code: '99213', description: 'Office Visit', quantity: 1 },
          ],
        });

        const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
        expect(createCall.data.lineItems.create).toBeDefined();
      });

      it('should calculate estimated total', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          estimatedTotal: mockDecimal(500),
          lineItems: [mockGFELineItem],
        });

        const result = await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [
            { code: '99213', description: 'Office Visit', quantity: 2 },
          ],
        });

        expect(result.estimatedTotal).toBeDefined();
      });

      it('should set expiration date', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          expirationDate: new Date(),
          lineItems: [],
        });

        await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [{ code: '99213', description: 'Office Visit' }],
          validForDays: 365,
        });

        const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
        expect(createCall.data.expirationDate).toBeDefined();
      });

      it('should include provider information', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          lineItems: [],
        });

        await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [{ code: '99213', description: 'Office Visit' }],
          providerNPI: '1234567890',
          providerName: 'Dr. Smith',
        });

        const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
        expect(createCall.data.providerNPI).toBe('1234567890');
        expect(createCall.data.providerName).toBe('Dr. Smith');
      });

      it('should include facility information', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          lineItems: [],
        });

        await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [{ code: '99213', description: 'Office Visit' }],
          facilityNPI: '0987654321',
          facilityName: 'Community Hospital',
        });

        const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
        expect(createCall.data.facilityNPI).toBe('0987654321');
        expect(createCall.data.facilityName).toBe('Community Hospital');
      });
    });

    describe('Patient Responsibility Calculation', () => {
      it('should calculate patient responsibility', async () => {
        mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
          ...mockGoodFaithEstimate,
          estimatedTotal: mockDecimal(1000),
          lineItems: [],
        });
        mockPrisma.goodFaithEstimate.update.mockResolvedValue({
          ...mockGoodFaithEstimate,
          patientResponsibility: 300,
          lineItems: [],
        });

        const result = await estimateService.calculatePatientResponsibility(
          'gfe-123',
          500,  // deductible remaining
          3000, // out of pocket max
          20,   // coinsurance %
          50    // copay
        );

        expect(result).toHaveProperty('calculation');
        expect(result.calculation).toHaveProperty('patientResponsibility');
      });

      it('should apply deductible to calculation', async () => {
        mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
          ...mockGoodFaithEstimate,
          estimatedTotal: mockDecimal(1000),
          lineItems: [],
        });
        mockPrisma.goodFaithEstimate.update.mockResolvedValue(mockGoodFaithEstimate);

        const result = await estimateService.calculatePatientResponsibility(
          'gfe-123',
          500,  // $500 deductible remaining
          3000,
          0,    // no coinsurance
          0     // no copay
        );

        expect(result.calculation.deductibleApplied).toBe(500);
      });

      it('should apply coinsurance after deductible', async () => {
        mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
          ...mockGoodFaithEstimate,
          estimatedTotal: mockDecimal(1000),
          lineItems: [],
        });
        mockPrisma.goodFaithEstimate.update.mockResolvedValue(mockGoodFaithEstimate);

        const result = await estimateService.calculatePatientResponsibility(
          'gfe-123',
          500,  // $500 deductible
          3000,
          20,   // 20% coinsurance
          0
        );

        // After $500 deductible, $500 remains. 20% of $500 = $100
        expect(result.calculation.coInsuranceAmount).toBe(100);
      });

      it('should add copay to patient responsibility', async () => {
        mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
          ...mockGoodFaithEstimate,
          estimatedTotal: mockDecimal(1000),
          lineItems: [],
        });
        mockPrisma.goodFaithEstimate.update.mockResolvedValue(mockGoodFaithEstimate);

        const result = await estimateService.calculatePatientResponsibility(
          'gfe-123',
          0,
          3000,
          0,
          50  // $50 copay
        );

        expect(result.calculation.copayAmount).toBe(50);
      });

      it('should cap at out-of-pocket maximum', async () => {
        mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
          ...mockGoodFaithEstimate,
          estimatedTotal: mockDecimal(10000),
          lineItems: [],
        });
        mockPrisma.goodFaithEstimate.update.mockResolvedValue(mockGoodFaithEstimate);

        const result = await estimateService.calculatePatientResponsibility(
          'gfe-123',
          5000,  // high deductible
          2000,  // but lower OOP max
          50,    // high coinsurance
          500    // high copay
        );

        expect(result.calculation.patientResponsibility).toBeLessThanOrEqual(2000);
      });

      it('should calculate estimated insurance payment', async () => {
        mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue({
          ...mockGoodFaithEstimate,
          estimatedTotal: mockDecimal(1000),
          lineItems: [],
        });
        mockPrisma.goodFaithEstimate.update.mockResolvedValue(mockGoodFaithEstimate);

        const result = await estimateService.calculatePatientResponsibility(
          'gfe-123',
          0,
          3000,
          20,
          50
        );

        expect(result.calculation.estimatedInsurancePayment).toBeDefined();
        expect(result.calculation.estimatedInsurancePayment).toBeGreaterThan(0);
      });

      it('should throw error if GFE not found', async () => {
        mockPrisma.goodFaithEstimate.findUnique.mockResolvedValue(null);

        await expect(
          estimateService.calculatePatientResponsibility('unknown', 500, 3000, 20, 50)
        ).rejects.toThrow('Good Faith Estimate not found');
      });
    });

    describe('Standard Disclaimer', () => {
      it('should include standard disclaimer', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          disclaimer: 'This Good Faith Estimate shows the costs...',
          lineItems: [],
        });

        await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [{ code: '99213', description: 'Office Visit' }],
        });

        const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
        expect(createCall.data.disclaimer).toBeDefined();
        expect(createCall.data.disclaimer).toContain('Good Faith Estimate');
      });

      it('should include dispute rights in disclaimer', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          lineItems: [],
        });

        await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [{ code: '99213', description: 'Office Visit' }],
        });

        const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
        expect(createCall.data.disclaimer).toContain('dispute');
      });

      it('should include HHS contact information', async () => {
        mockPrisma.chargemasterItem.findFirst.mockResolvedValue(mockChargemasterItem);
        mockPrisma.goodFaithEstimate.create.mockResolvedValue({
          ...mockGoodFaithEstimate,
          lineItems: [],
        });

        await estimateService.createGoodFaithEstimate({
          organizationId: 'org-123',
          patientId: 'patient-789',
          scheduledProcedures: [{ code: '99213', description: 'Office Visit' }],
        });

        const createCall = mockPrisma.goodFaithEstimate.create.mock.calls[0][0];
        expect(createCall.data.disclaimer).toContain('cms.gov');
      });
    });

    describe('GFE Status Management', () => {
      it('should update GFE status', async () => {
        mockPrisma.goodFaithEstimate.update.mockResolvedValue({
          ...mockGoodFaithEstimate,
          status: 'sent',
          lineItems: [],
        });

        const result = await estimateService.updateGFEStatus('gfe-123', 'sent' as any);

        expect(result.status).toBe('sent');
      });

      it('should set deliveredAt when delivered', async () => {
        mockPrisma.goodFaithEstimate.update.mockResolvedValue({
          ...mockGoodFaithEstimate,
          status: 'delivered',
          deliveredAt: new Date(),
          lineItems: [],
        });

        await estimateService.updateGFEStatus('gfe-123', 'delivered' as any, 'email');

        const updateCall = mockPrisma.goodFaithEstimate.update.mock.calls[0][0];
        expect(updateCall.data.deliveredAt).toBeDefined();
        expect(updateCall.data.deliveredMethod).toBe('email');
      });

      it('should record patient acknowledgment', async () => {
        mockPrisma.goodFaithEstimate.update.mockResolvedValue({
          ...mockGoodFaithEstimate,
          status: 'acknowledged',
          patientSignature: 'John Doe',
          patientSignedAt: new Date(),
          lineItems: [],
        });

        const result = await estimateService.recordPatientAcknowledgment('gfe-123', 'John Doe');

        expect(result.status).toBe('acknowledged');
        expect(result.patientSignature).toBe('John Doe');
      });
    });
  });

  // ==========================================================================
  // MRF Generation Tests
  // ==========================================================================

  describe('MRF Generation', () => {
    let mrfService: MRFGeneratorService;
    let mockPrisma: any;

    beforeEach(() => {
      vi.clearAllMocks();
      mrfService = new MRFGeneratorService();
      mockPrisma = (mrfService as any).prisma;
    });

    describe('Standard Charges File', () => {
      it('should generate standard charges file', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMRFFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMRFFile,
          status: 'generated',
        });

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
        });

        expect(result).toHaveProperty('mrfRecord');
        expect(result).toHaveProperty('content');
      });

      it('should include hospital header', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
        });

        expect(result.content).toHaveProperty('hospital_name');
        expect(result.content).toHaveProperty('last_updated_on');
        expect(result.content).toHaveProperty('version');
      });

      it('should include affirmation statement', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
        });

        expect(result.content).toHaveProperty('affirmation');
        expect(result.content.affirmation).toHaveProperty('confirm_affirmation', true);
      });

      it('should include all chargemaster items', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, payerRates: [] },
          { ...mockChargemasterItem, id: 'cm-002', cptCode: '99214', payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
        });

        expect(result.content.standard_charge_information).toHaveLength(2);
      });

      it('should include code information', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, cptCode: '99213', payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
        });

        const item = result.content.standard_charge_information[0];
        expect(item.code_information).toContainEqual({ code: '99213', type: 'CPT' });
      });
    });

    describe('JSON Export', () => {
      it('should export as JSON', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
          outputFormat: 'json',
        });

        expect(result.format).toBe('json');
        expect(typeof result.content).toBe('object');
      });

      it('should include schema version in JSON', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
          outputFormat: 'json',
        });

        expect(result.content.version).toBeDefined();
      });
    });

    describe('CSV Export', () => {
      it('should export as CSV', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        expect(result.format).toBe('csv');
        expect(typeof result.content).toBe('string');
      });

      it('should include CSV headers', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        expect(result.content).toContain('description');
        expect(result.content).toContain('code');
        expect(result.content).toContain('gross_charge');
      });

      it('should properly escape CSV values', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue(mockMRFFile);
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          { ...mockChargemasterItem, description: 'Office visit, level 3', payerRates: [] },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMRFFile);

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        // Values with commas should be quoted
        expect(result.content).toContain('"Office visit, level 3"');
      });
    });

    describe('MRF Status Management', () => {
      it('should track generation status', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMRFFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([]);
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMRFFile,
          status: 'generated',
        });

        const result = await mrfService.generateMRF({
          organizationId: 'org-123',
          fileType: 'standard_charges' as any,
        });

        expect(result.mrfRecord.status).toBe('generated');
      });

      it('should publish MRF file', async () => {
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMRFFile,
          status: 'published',
          fileUrl: 'https://example.com/mrf.json',
          lastPublishedAt: new Date(),
        });

        const result = await mrfService.publishMRFFile('mrf-001', 'https://example.com/mrf.json');

        expect(result.status).toBe('published');
        expect(result.fileUrl).toBe('https://example.com/mrf.json');
      });

      it('should list MRF files for organization', async () => {
        mockPrisma.machineReadableFile.findMany.mockResolvedValue([mockMRFFile]);

        const result = await mrfService.listMRFFiles('org-123');

        expect(result).toHaveLength(1);
      });
    });
  });

  // ==========================================================================
  // Compliance Tests
  // ==========================================================================

  describe('Compliance', () => {
    let complianceService: ComplianceService;
    let mockPrisma: any;

    beforeEach(() => {
      vi.clearAllMocks();
      complianceService = new ComplianceService();
      mockPrisma = (complianceService as any).prisma;

      // Default mocks for compliant organization
      mockPrisma.chargemasterItem.count.mockResolvedValue(1000);
      mockPrisma.shoppableService.count.mockResolvedValue(75);
      mockPrisma.payerContract.count.mockResolvedValue(50);
      mockPrisma.machineReadableFile.findFirst.mockResolvedValue({
        ...mockMRFFile,
        status: 'published',
        lastPublishedAt: new Date(),
      });
      mockPrisma.goodFaithEstimate.count.mockResolvedValue(50);
      mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([]);
      mockPrisma.complianceAudit.create.mockResolvedValue({
        id: 'audit-001',
        organizationId: 'org-123',
        auditType: 'cms_hospital_price_transparency',
        overallScore: 95,
        passedChecks: 5,
        failedChecks: 1,
      });
    });

    describe('Hospital Price Transparency Compliance', () => {
      it('should check hospital price transparency compliance', async () => {
        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        expect(result).toHaveProperty('organizationId', 'org-123');
        expect(result).toHaveProperty('auditType', 'cms_hospital_price_transparency');
        expect(result).toHaveProperty('findings');
        expect(result).toHaveProperty('overallScore');
      });

      it('should check chargemaster completeness', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.OR) return Promise.resolve(950);
          return Promise.resolve(1000);
        });

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'Chargemaster Completeness');
        expect(finding).toBeDefined();
        expect(finding?.passed).toBe(true);
      });

      it('should check shoppable services count (minimum 70)', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(75);

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'Shoppable Services Count');
        expect(finding).toBeDefined();
        expect(finding?.passed).toBe(true);
      });

      it('should fail shoppable services when less than 70', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(50);

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'Shoppable Services Count');
        expect(finding?.passed).toBe(false);
        expect(finding?.recommendation).toContain('20 more');
      });

      it('should check MRF publication status', async () => {
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue({
          ...mockMRFFile,
          status: 'published',
          lastPublishedAt: new Date(),
        });

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'MRF Publication');
        expect(finding?.passed).toBe(true);
      });

      it('should fail MRF check when not published recently', async () => {
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue(null);

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'MRF Publication');
        expect(finding?.passed).toBe(false);
        expect(finding?.severity).toBe('critical');
      });

      it('should check payer negotiated rates', async () => {
        mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
          if (where?.rates) return Promise.resolve(45);
          return Promise.resolve(50);
        });

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'Payer Negotiated Rates');
        expect(finding).toBeDefined();
      });

      it('should check discounted cash prices', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.discountedCashPrice) return Promise.resolve(1000);
          if (where?.OR) return Promise.resolve(950);
          return Promise.resolve(1000);
        });

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'Discounted Cash Prices');
        expect(finding).toBeDefined();
      });

      it('should calculate overall compliance score', async () => {
        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        expect(result.overallScore).toBeGreaterThan(0);
        expect(result.overallScore).toBeLessThanOrEqual(100);
      });

      it('should include recommendations for failed checks', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(50);
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue(null);

        const result = await complianceService.checkHospitalPriceTransparency('org-123');

        expect(result.recommendations.length).toBeGreaterThan(0);
      });
    });

    describe('No Surprises Act Compliance', () => {
      it('should check No Surprises Act compliance', async () => {
        const result = await complianceService.checkNoSurprisesActCompliance('org-123');

        expect(result).toHaveProperty('organizationId', 'org-123');
        expect(result).toHaveProperty('auditType', 'no_surprises_act_gfe');
        expect(result).toHaveProperty('findings');
      });

      it('should check GFE process is active', async () => {
        mockPrisma.goodFaithEstimate.count.mockResolvedValue(25);

        const result = await complianceService.checkNoSurprisesActCompliance('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'GFE Process Active');
        expect(finding?.passed).toBe(true);
      });

      it('should fail GFE check when no GFEs created', async () => {
        mockPrisma.goodFaithEstimate.count.mockResolvedValue(0);

        const result = await complianceService.checkNoSurprisesActCompliance('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'GFE Process Active');
        expect(finding?.passed).toBe(false);
      });

      it('should check GFE delivery timeline', async () => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 10);

        mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
          {
            ...mockGoodFaithEstimate,
            scheduledServiceDate: scheduledDate,
            deliveredAt: new Date(),
            lineItems: [mockGFELineItem],
          },
        ]);

        const result = await complianceService.checkNoSurprisesActCompliance('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'GFE Delivery Timeline');
        expect(finding).toBeDefined();
      });

      it('should check GFE content completeness', async () => {
        mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
          {
            ...mockGoodFaithEstimate,
            providerNPI: '1234567890',
            providerName: 'Dr. Smith',
            facilityNPI: '0987654321',
            facilityName: 'Hospital',
            disclaimer: 'Standard disclaimer',
            lineItems: [mockGFELineItem],
          },
        ]);

        const result = await complianceService.checkNoSurprisesActCompliance('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'GFE Content Completeness');
        expect(finding).toBeDefined();
      });

      it('should include patient rights notice check', async () => {
        const result = await complianceService.checkNoSurprisesActCompliance('org-123');

        const finding = result.findings.find((f: any) => f.checkName === 'Patient Rights Notice');
        expect(finding).toBeDefined();
      });
    });

    describe('Audit History', () => {
      it('should retrieve compliance audit history', async () => {
        mockPrisma.complianceAudit.findMany.mockResolvedValue([
          { id: 'audit-001', auditType: 'cms_hospital_price_transparency', overallScore: 95 },
          { id: 'audit-002', auditType: 'no_surprises_act_gfe', overallScore: 90 },
        ]);

        const result = await complianceService.getAuditHistory('org-123');

        expect(result).toHaveLength(2);
      });

      it('should filter audit history by type', async () => {
        mockPrisma.complianceAudit.findMany.mockResolvedValue([
          { id: 'audit-001', auditType: 'cms_hospital_price_transparency', overallScore: 95 },
        ]);

        await complianceService.getAuditHistory('org-123', 'cms_hospital_price_transparency' as any);

        expect(mockPrisma.complianceAudit.findMany).toHaveBeenCalledWith({
          where: {
            organizationId: 'org-123',
            auditType: 'cms_hospital_price_transparency',
          },
          orderBy: { auditDate: 'desc' },
          take: 10,
        });
      });

      it('should get latest compliance score', async () => {
        mockPrisma.complianceAudit.findFirst.mockResolvedValue({
          id: 'audit-001',
          overallScore: 95,
          auditDate: new Date(),
          passedChecks: 5,
          failedChecks: 1,
        });

        const result = await complianceService.getLatestComplianceScore(
          'org-123',
          'cms_hospital_price_transparency' as any
        );

        expect(result).toHaveProperty('score', 95);
        expect(result).toHaveProperty('passedChecks', 5);
        expect(result).toHaveProperty('failedChecks', 1);
      });

      it('should return null when no audit exists', async () => {
        mockPrisma.complianceAudit.findFirst.mockResolvedValue(null);

        const result = await complianceService.getLatestComplianceScore(
          'org-123',
          'cms_hospital_price_transparency' as any
        );

        expect(result).toBeNull();
      });
    });
  });
});
