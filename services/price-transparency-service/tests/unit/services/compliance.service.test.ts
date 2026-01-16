/**
 * Unit Tests for Compliance Service
 * Tests CMS Hospital Price Transparency and No Surprises Act compliance checks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPrismaClient, mockDecimal } from '../../helpers/mocks';
import {
  mockOrganizationId,
  mockChargemasterItem,
  mockChargemasterItems,
  mockShoppableService,
  mockShoppableServices,
  mockPayerContract,
  mockPayerContracts,
  mockMachineReadableFile,
  mockMachineReadableFilePublished,
  mockGoodFaithEstimate,
  mockGoodFaithEstimateDelivered,
  mockGoodFaithEstimateAcknowledged,
  mockGFELineItem,
  mockComplianceAudit,
  mockComplianceAuditFailing,
} from '../../helpers/fixtures';

// Mock Prisma
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
  ComplianceAuditType: {
    cms_hospital_price_transparency: 'cms_hospital_price_transparency',
    no_surprises_act_gfe: 'no_surprises_act_gfe',
    state_price_transparency: 'state_price_transparency',
    insurance_transparency: 'insurance_transparency',
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
  GFEStatus: {
    draft: 'draft',
    pending: 'pending',
    sent: 'sent',
    delivered: 'delivered',
    acknowledged: 'acknowledged',
    expired: 'expired',
    disputed: 'disputed',
  },
  Prisma: {
    Decimal: (value: number) => mockDecimal(value),
    JsonArray: Array,
  },
}));

// Import after mocking
import { ComplianceService } from '../../../src/services/compliance.service';

describe('ComplianceService', () => {
  let service: ComplianceService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ComplianceService();
    mockPrisma = (service as any).prisma;
  });

  describe('checkHospitalPriceTransparency', () => {
    beforeEach(() => {
      // Default mocks for a compliant organization
      mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
        if (where?.OR) return Promise.resolve(950); // Items with codes
        return Promise.resolve(1000); // Total items
      });
      mockPrisma.shoppableService.count.mockResolvedValue(75);
      mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
        if (where?.rates) return Promise.resolve(45); // Contracts with rates
        return Promise.resolve(50); // Total contracts
      });
      mockPrisma.machineReadableFile.findFirst.mockResolvedValue(mockMachineReadableFilePublished);
      mockPrisma.complianceAudit.create.mockResolvedValue(mockComplianceAudit);
    });

    it('should return a compliance report', async () => {
      const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

      expect(result).toHaveProperty('organizationId', mockOrganizationId);
      expect(result).toHaveProperty('auditType', 'cms_hospital_price_transparency');
      expect(result).toHaveProperty('auditDate');
      expect(result).toHaveProperty('findings');
      expect(result).toHaveProperty('overallScore');
      expect(result).toHaveProperty('passedChecks');
      expect(result).toHaveProperty('failedChecks');
    });

    it('should save audit record to database', async () => {
      await service.checkHospitalPriceTransparency(mockOrganizationId);

      expect(mockPrisma.complianceAudit.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          organizationId: mockOrganizationId,
          auditType: 'cms_hospital_price_transparency',
          findings: expect.any(Array),
          overallScore: expect.any(Number),
        }),
      });
    });

    describe('Chargemaster Completeness Check', () => {
      it('should pass when 95%+ items have CPT/HCPCS codes', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.OR) return Promise.resolve(960); // 96% with codes
          return Promise.resolve(1000);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Chargemaster Completeness');
        expect(finding?.passed).toBe(true);
        expect(finding?.message).toContain('96.0%');
      });

      it('should fail when less than 95% items have codes', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.OR) return Promise.resolve(800); // 80% with codes
          return Promise.resolve(1000);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Chargemaster Completeness');
        expect(finding?.passed).toBe(false);
        expect(finding?.severity).toBe('major');
      });

      it('should mark as critical when less than 80% have codes', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.OR) return Promise.resolve(500); // 50% with codes
          return Promise.resolve(1000);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Chargemaster Completeness');
        expect(finding?.severity).toBe('critical');
      });

      it('should handle empty chargemaster', async () => {
        mockPrisma.chargemasterItem.count.mockResolvedValue(0);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Chargemaster Completeness');
        expect(finding?.passed).toBe(false);
        expect(finding?.details?.completenessPercent).toBe(0);
      });
    });

    describe('Shoppable Services Check', () => {
      it('should pass when 70+ shoppable services exist', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(75);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Shoppable Services Count');
        expect(finding?.passed).toBe(true);
        expect(finding?.message).toContain('75 shoppable services');
      });

      it('should fail when less than 70 shoppable services', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(50);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Shoppable Services Count');
        expect(finding?.passed).toBe(false);
        expect(finding?.recommendation).toContain('20 more shoppable services');
      });

      it('should mark as critical when less than 35 services', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(20);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Shoppable Services Count');
        expect(finding?.severity).toBe('critical');
      });

      it('should include deficit in details', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(45);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Shoppable Services Count');
        expect(finding?.details?.deficit).toBe(25);
      });
    });

    describe('Payer Negotiated Rates Check', () => {
      it('should pass when 90%+ contracts have rates', async () => {
        mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
          if (where?.rates) return Promise.resolve(46); // 92% have rates
          return Promise.resolve(50);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Payer Negotiated Rates');
        expect(finding?.passed).toBe(true);
      });

      it('should fail when less than 90% contracts have rates', async () => {
        mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
          if (where?.rates) return Promise.resolve(40); // 80% have rates
          return Promise.resolve(50);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Payer Negotiated Rates');
        expect(finding?.passed).toBe(false);
      });

      it('should mark as critical when less than 50% have rates', async () => {
        mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
          if (where?.rates) return Promise.resolve(20); // 40% have rates
          return Promise.resolve(50);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Payer Negotiated Rates');
        expect(finding?.severity).toBe('critical');
      });
    });

    describe('MRF Publication Check', () => {
      it('should pass when MRF published in last 30 days', async () => {
        const recentMRF = {
          ...mockMachineReadableFilePublished,
          lastPublishedAt: new Date(),
        };
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue(recentMRF);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'MRF Publication');
        expect(finding?.passed).toBe(true);
      });

      it('should fail when no MRF published in last 30 days', async () => {
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue(null);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'MRF Publication');
        expect(finding?.passed).toBe(false);
        expect(finding?.severity).toBe('critical');
      });

      it('should include file URL in details when published', async () => {
        const recentMRF = {
          ...mockMachineReadableFilePublished,
          lastPublishedAt: new Date(),
          fileUrl: 'https://example.com/mrf.json',
        };
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue(recentMRF);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'MRF Publication');
        expect(finding?.details?.fileUrl).toBe('https://example.com/mrf.json');
      });
    });

    describe('Discounted Cash Prices Check', () => {
      it('should pass when 100% items have cash prices', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.discountedCashPrice) return Promise.resolve(1000);
          return Promise.resolve(1000);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Discounted Cash Prices');
        expect(finding?.passed).toBe(true);
      });

      it('should fail when not all items have cash prices', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.discountedCashPrice) return Promise.resolve(900);
          if (where?.OR) return Promise.resolve(950);
          return Promise.resolve(1000);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Discounted Cash Prices');
        expect(finding?.passed).toBe(false);
      });
    });

    describe('De-identified Prices Check', () => {
      it('should pass when 90%+ items have de-identified min/max', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.AND) return Promise.resolve(950); // 95% have min/max
          if (where?.OR) return Promise.resolve(950);
          return Promise.resolve(1000);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'De-identified Min/Max Prices');
        expect(finding?.passed).toBe(true);
      });

      it('should fail when less than 90% have de-identified prices', async () => {
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.AND) return Promise.resolve(800); // 80% have min/max
          if (where?.OR) return Promise.resolve(950);
          return Promise.resolve(1000);
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'De-identified Min/Max Prices');
        expect(finding?.passed).toBe(false);
      });
    });

    describe('Overall Score Calculation', () => {
      it('should calculate overall score based on passed checks', async () => {
        // Mock all checks passing
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.discountedCashPrice) return Promise.resolve(1000);
          if (where?.AND) return Promise.resolve(950);
          if (where?.OR) return Promise.resolve(980);
          return Promise.resolve(1000);
        });
        mockPrisma.shoppableService.count.mockResolvedValue(80);
        mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
          if (where?.rates) return Promise.resolve(48);
          return Promise.resolve(50);
        });
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue({
          ...mockMachineReadableFilePublished,
          lastPublishedAt: new Date(),
        });

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        expect(result.overallScore).toBeGreaterThan(80);
        expect(result.passedChecks).toBeGreaterThan(3);
      });

      it('should include recommendations for failed checks', async () => {
        mockPrisma.shoppableService.count.mockResolvedValue(50);
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue(null);

        const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

        expect(result.recommendations.length).toBeGreaterThan(0);
        expect(result.recommendations.some(r => r.includes('shoppable services'))).toBe(true);
      });
    });

    describe('Remediation Deadline', () => {
      it('should set remediation deadline when there are failed checks', async () => {
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue(null);

        await service.checkHospitalPriceTransparency(mockOrganizationId);

        const createCall = mockPrisma.complianceAudit.create.mock.calls[0][0];
        expect(createCall.data.remedationDeadline).not.toBeNull();
      });

      it('should not set remediation deadline when all checks pass', async () => {
        // Mock all checks passing
        mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
          if (where?.discountedCashPrice) return Promise.resolve(1000);
          if (where?.AND) return Promise.resolve(950);
          if (where?.OR) return Promise.resolve(980);
          return Promise.resolve(1000);
        });
        mockPrisma.shoppableService.count.mockResolvedValue(80);
        mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
          if (where?.rates) return Promise.resolve(48);
          return Promise.resolve(50);
        });
        mockPrisma.machineReadableFile.findFirst.mockResolvedValue({
          ...mockMachineReadableFilePublished,
          lastPublishedAt: new Date(),
        });

        await service.checkHospitalPriceTransparency(mockOrganizationId);

        const createCall = mockPrisma.complianceAudit.create.mock.calls[0][0];
        expect(createCall.data.remedationDeadline).toBeNull();
      });
    });
  });

  describe('checkNoSurprisesActCompliance', () => {
    beforeEach(() => {
      // Default mocks for a compliant organization
      mockPrisma.goodFaithEstimate.count.mockResolvedValue(50);
      mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
        {
          ...mockGoodFaithEstimateDelivered,
          scheduledServiceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          deliveredAt: new Date(),
          providerNPI: '1234567890',
          providerName: 'Dr. Smith',
          facilityNPI: '0987654321',
          facilityName: 'Hospital',
          disclaimer: 'Standard disclaimer...',
          lineItems: [mockGFELineItem],
        },
      ]);
      mockPrisma.complianceAudit.create.mockResolvedValue(mockComplianceAudit);
    });

    it('should return a compliance report', async () => {
      const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

      expect(result).toHaveProperty('organizationId', mockOrganizationId);
      expect(result).toHaveProperty('auditType', 'no_surprises_act_gfe');
      expect(result).toHaveProperty('auditDate');
      expect(result).toHaveProperty('findings');
    });

    it('should save audit record to database', async () => {
      await service.checkNoSurprisesActCompliance(mockOrganizationId);

      expect(mockPrisma.complianceAudit.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          organizationId: mockOrganizationId,
          auditType: 'no_surprises_act_gfe',
        }),
      });
    });

    describe('GFE Process Check', () => {
      it('should pass when GFEs are being created', async () => {
        mockPrisma.goodFaithEstimate.count.mockResolvedValue(25);

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Process Active');
        expect(finding?.passed).toBe(true);
        expect(finding?.message).toContain('25 Good Faith Estimates');
      });

      it('should fail when no GFEs created in last 30 days', async () => {
        mockPrisma.goodFaithEstimate.count.mockResolvedValue(0);

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Process Active');
        expect(finding?.passed).toBe(false);
        expect(finding?.recommendation).toContain('Implement and activate');
      });
    });

    describe('GFE Delivery Timeline Check', () => {
      it('should pass when 95%+ GFEs delivered on time', async () => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 10); // 10 days from now

        const deliveredDate = new Date();
        deliveredDate.setDate(deliveredDate.getDate() - 1); // Yesterday (well before 3-day requirement)

        mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
          {
            ...mockGoodFaithEstimateDelivered,
            scheduledServiceDate: scheduledDate,
            deliveredAt: deliveredDate,
            lineItems: [mockGFELineItem],
          },
        ]);

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Delivery Timeline');
        expect(finding?.passed).toBe(true);
      });

      it('should fail when GFEs delivered late', async () => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 2); // 2 days from now

        const deliveredDate = new Date(); // Today (less than 3 days before service)

        mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
          {
            ...mockGoodFaithEstimateDelivered,
            scheduledServiceDate: scheduledDate,
            deliveredAt: deliveredDate,
            lineItems: [mockGFELineItem],
          },
        ]);

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Delivery Timeline');
        expect(finding?.passed).toBe(false);
      });

      it('should count undelivered GFEs as late when service is within 3 days', async () => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 2); // Service in 2 days

        mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
          {
            ...mockGoodFaithEstimate,
            scheduledServiceDate: scheduledDate,
            deliveredAt: null, // Not delivered yet
            lineItems: [],
          },
        ]);

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Delivery Timeline');
        expect(finding?.details?.lateCount).toBeGreaterThan(0);
      });
    });

    describe('GFE Content Completeness Check', () => {
      it('should pass when 95%+ GFEs have required content', async () => {
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

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Content Completeness');
        expect(finding?.passed).toBe(true);
      });

      it('should fail when GFEs missing required fields', async () => {
        mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
          {
            ...mockGoodFaithEstimate,
            providerNPI: null,
            providerName: null,
            facilityNPI: null,
            facilityName: null,
            disclaimer: null,
            lineItems: [],
          },
        ]);

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Content Completeness');
        expect(finding?.passed).toBe(false);
      });

      it('should fail when GFEs have no line items', async () => {
        mockPrisma.goodFaithEstimate.findMany.mockResolvedValue([
          {
            ...mockGoodFaithEstimate,
            providerNPI: '1234567890',
            providerName: 'Dr. Smith',
            facilityNPI: '0987654321',
            facilityName: 'Hospital',
            disclaimer: 'Standard disclaimer',
            lineItems: [], // No line items
          },
        ]);

        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'GFE Content Completeness');
        expect(finding?.passed).toBe(false);
      });
    });

    describe('Patient Rights Notice Check', () => {
      it('should include patient rights notice check', async () => {
        const result = await service.checkNoSurprisesActCompliance(mockOrganizationId);

        const finding = result.findings.find(f => f.checkName === 'Patient Rights Notice');
        expect(finding).toBeDefined();
        expect(finding?.category).toBe('No Surprises Act');
      });
    });
  });

  describe('getAuditHistory', () => {
    it('should return audit history for organization', async () => {
      mockPrisma.complianceAudit.findMany.mockResolvedValue([
        mockComplianceAudit,
        mockComplianceAuditFailing,
      ]);

      const result = await service.getAuditHistory(mockOrganizationId);

      expect(result).toHaveLength(2);
      expect(mockPrisma.complianceAudit.findMany).toHaveBeenCalledWith({
        where: { organizationId: mockOrganizationId },
        orderBy: { auditDate: 'desc' },
        take: 10,
      });
    });

    it('should filter by audit type', async () => {
      mockPrisma.complianceAudit.findMany.mockResolvedValue([mockComplianceAudit]);

      await service.getAuditHistory(mockOrganizationId, 'cms_hospital_price_transparency' as any);

      expect(mockPrisma.complianceAudit.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: mockOrganizationId,
          auditType: 'cms_hospital_price_transparency',
        },
        orderBy: { auditDate: 'desc' },
        take: 10,
      });
    });

    it('should respect limit parameter', async () => {
      mockPrisma.complianceAudit.findMany.mockResolvedValue([mockComplianceAudit]);

      await service.getAuditHistory(mockOrganizationId, undefined, 5);

      expect(mockPrisma.complianceAudit.findMany).toHaveBeenCalledWith({
        where: { organizationId: mockOrganizationId },
        orderBy: { auditDate: 'desc' },
        take: 5,
      });
    });
  });

  describe('getLatestComplianceScore', () => {
    it('should return latest compliance score', async () => {
      mockPrisma.complianceAudit.findFirst.mockResolvedValue(mockComplianceAudit);

      const result = await service.getLatestComplianceScore(
        mockOrganizationId,
        'cms_hospital_price_transparency' as any
      );

      expect(result).toHaveProperty('score', mockComplianceAudit.overallScore);
      expect(result).toHaveProperty('auditDate');
      expect(result).toHaveProperty('passedChecks', mockComplianceAudit.passedChecks);
      expect(result).toHaveProperty('failedChecks', mockComplianceAudit.failedChecks);
    });

    it('should return null when no audit exists', async () => {
      mockPrisma.complianceAudit.findFirst.mockResolvedValue(null);

      const result = await service.getLatestComplianceScore(
        mockOrganizationId,
        'cms_hospital_price_transparency' as any
      );

      expect(result).toBeNull();
    });

    it('should query for most recent audit', async () => {
      mockPrisma.complianceAudit.findFirst.mockResolvedValue(mockComplianceAudit);

      await service.getLatestComplianceScore(
        mockOrganizationId,
        'no_surprises_act_gfe' as any
      );

      expect(mockPrisma.complianceAudit.findFirst).toHaveBeenCalledWith({
        where: {
          organizationId: mockOrganizationId,
          auditType: 'no_surprises_act_gfe',
        },
        orderBy: { auditDate: 'desc' },
      });
    });
  });

  describe('Severity Levels', () => {
    it('should assign correct severity based on thresholds', async () => {
      // Test critical severity for chargemaster (< 80%)
      mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
        if (where?.OR) return Promise.resolve(500); // 50%
        if (where?.discountedCashPrice) return Promise.resolve(1000);
        if (where?.AND) return Promise.resolve(900);
        return Promise.resolve(1000);
      });
      mockPrisma.shoppableService.count.mockResolvedValue(20); // Critical
      mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
        if (where?.rates) return Promise.resolve(20); // Critical
        return Promise.resolve(50);
      });
      mockPrisma.machineReadableFile.findFirst.mockResolvedValue(null);
      mockPrisma.complianceAudit.create.mockResolvedValue(mockComplianceAuditFailing);

      const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

      const criticalFindings = result.findings.filter(f => f.severity === 'critical');
      expect(criticalFindings.length).toBeGreaterThan(0);
    });

    it('should assign major severity for moderate issues', async () => {
      mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
        if (where?.OR) return Promise.resolve(850); // 85% - major
        if (where?.discountedCashPrice) return Promise.resolve(900);
        if (where?.AND) return Promise.resolve(850);
        return Promise.resolve(1000);
      });
      mockPrisma.shoppableService.count.mockResolvedValue(50); // Major (< 70)
      mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
        if (where?.rates) return Promise.resolve(40); // 80% - major
        return Promise.resolve(50);
      });
      mockPrisma.machineReadableFile.findFirst.mockResolvedValue({
        ...mockMachineReadableFilePublished,
        lastPublishedAt: new Date(),
      });
      mockPrisma.complianceAudit.create.mockResolvedValue(mockComplianceAudit);

      const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

      const majorFindings = result.findings.filter(f => f.severity === 'major');
      expect(majorFindings.length).toBeGreaterThan(0);
    });
  });

  describe('Finding Details', () => {
    it('should include detailed metrics in findings', async () => {
      mockPrisma.chargemasterItem.count.mockImplementation(({ where }: any) => {
        if (where?.OR) return Promise.resolve(950);
        if (where?.discountedCashPrice) return Promise.resolve(980);
        if (where?.AND) return Promise.resolve(920);
        return Promise.resolve(1000);
      });
      mockPrisma.shoppableService.count.mockResolvedValue(75);
      mockPrisma.payerContract.count.mockImplementation(({ where }: any) => {
        if (where?.rates) return Promise.resolve(45);
        return Promise.resolve(50);
      });
      mockPrisma.machineReadableFile.findFirst.mockResolvedValue({
        ...mockMachineReadableFilePublished,
        lastPublishedAt: new Date(),
      });
      mockPrisma.complianceAudit.create.mockResolvedValue(mockComplianceAudit);

      const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

      // Check chargemaster details
      const chargemasterFinding = result.findings.find(f => f.checkName === 'Chargemaster Completeness');
      expect(chargemasterFinding?.details).toHaveProperty('totalItems');
      expect(chargemasterFinding?.details).toHaveProperty('itemsWithCodes');
      expect(chargemasterFinding?.details).toHaveProperty('completenessPercent');

      // Check shoppable services details
      const shoppableFinding = result.findings.find(f => f.checkName === 'Shoppable Services Count');
      expect(shoppableFinding?.details).toHaveProperty('currentCount');
      expect(shoppableFinding?.details).toHaveProperty('requiredCount', 70);
      expect(shoppableFinding?.details).toHaveProperty('deficit');
    });
  });

  describe('Category Assignment', () => {
    it('should categorize findings correctly', async () => {
      mockPrisma.chargemasterItem.count.mockResolvedValue(1000);
      mockPrisma.shoppableService.count.mockResolvedValue(75);
      mockPrisma.payerContract.count.mockResolvedValue(50);
      mockPrisma.machineReadableFile.findFirst.mockResolvedValue(mockMachineReadableFilePublished);
      mockPrisma.complianceAudit.create.mockResolvedValue(mockComplianceAudit);

      const result = await service.checkHospitalPriceTransparency(mockOrganizationId);

      const dataQualityFindings = result.findings.filter(f => f.category === 'Data Quality');
      const cmsRequirementFindings = result.findings.filter(f => f.category === 'CMS Requirements');

      expect(dataQualityFindings.length).toBeGreaterThan(0);
      expect(cmsRequirementFindings.length).toBeGreaterThan(0);
    });
  });
});
