/**
 * Unit Tests for MRF Generator Service
 * Tests Machine-Readable File generation for CMS compliance
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPrismaClient, mockDecimal } from '../../helpers/mocks';
import {
  mockOrganizationId,
  mockChargemasterItem,
  mockChargemasterItems,
  mockPayerContract,
  mockPayerContracts,
  mockPayerContractRate,
  mockPayerContractRates,
  mockMachineReadableFile,
  mockMachineReadableFilePublished,
  mockMRFGenerationParams,
  mockMRFGenerationParamsCSV,
  mockStandardChargesContent,
} from '../../helpers/fixtures';

// Mock Prisma
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
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
  Prisma: {
    Decimal: (value: number) => mockDecimal(value),
  },
}));

// Import after mocking
import { MRFGeneratorService } from '../../../src/services/mrf-generator.service';

describe('MRFGeneratorService', () => {
  let service: MRFGeneratorService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MRFGeneratorService();
    mockPrisma = (service as any).prisma;
  });

  describe('generateMRF', () => {
    describe('Standard Charges File', () => {
      it('should generate a standard charges MRF file', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            payerRates: [
              {
                ...mockPayerContractRate,
                payerContract: mockPayerContract,
              },
            ],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generated',
          recordCount: 1,
        });

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        expect(result).toHaveProperty('mrfRecord');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('format', 'json');
        expect(mockPrisma.machineReadableFile.create).toHaveBeenCalled();
      });

      it('should include hospital header information', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([mockChargemasterItem]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        expect(result.content).toHaveProperty('hospital_name');
        expect(result.content).toHaveProperty('last_updated_on');
        expect(result.content).toHaveProperty('version');
        expect(result.content).toHaveProperty('affirmation');
      });

      it('should include standard charge information for each item', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        expect(result.content).toHaveProperty('standard_charge_information');
        expect(result.content.standard_charge_information).toBeInstanceOf(Array);
        const item = result.content.standard_charge_information[0];
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('code_information');
        expect(item).toHaveProperty('standard_charges');
      });

      it('should include CPT code information', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            cptCode: '99213',
            hcpcsCode: null,
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const codeInfo = result.content.standard_charge_information[0].code_information;
        expect(codeInfo).toContainEqual({ code: '99213', type: 'CPT' });
      });

      it('should include HCPCS code information', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            cptCode: null,
            hcpcsCode: 'J0696',
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const codeInfo = result.content.standard_charge_information[0].code_information;
        expect(codeInfo).toContainEqual({ code: 'J0696', type: 'HCPCS' });
      });

      it('should include NDC code for drugs', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            cptCode: null,
            hcpcsCode: 'J0696',
            ndcCode: '00409-7337-01',
            drugUnitOfMeasure: 'EA',
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const codeInfo = result.content.standard_charge_information[0].code_information;
        expect(codeInfo).toContainEqual({ code: '00409-7337-01', type: 'NDC' });
        expect(result.content.standard_charge_information[0]).toHaveProperty('drug_information');
      });

      it('should use LOCAL code type when no standard codes present', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            cptCode: null,
            hcpcsCode: null,
            ndcCode: null,
            code: 'LOCAL-12345',
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const codeInfo = result.content.standard_charge_information[0].code_information;
        expect(codeInfo).toContainEqual({ code: 'LOCAL-12345', type: 'LOCAL' });
      });

      it('should include payer-specific negotiated rates', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            payerRates: [
              {
                ...mockPayerContractRate,
                negotiatedRate: mockDecimal(180),
                rateType: 'fixed',
                payerContract: {
                  ...mockPayerContract,
                  payerName: 'Blue Cross',
                  planName: 'PPO Standard',
                },
              },
            ],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const payersInfo = result.content.standard_charge_information[0].standard_charges[0].payers_information;
        expect(payersInfo).toHaveLength(1);
        expect(payersInfo[0]).toHaveProperty('payer_name', 'Blue Cross');
        expect(payersInfo[0]).toHaveProperty('plan_name', 'PPO Standard');
        expect(payersInfo[0]).toHaveProperty('standard_charge_dollar', 180);
      });

      it('should include gross charge and discounted cash price', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            grossCharge: mockDecimal(250),
            discountedCashPrice: mockDecimal(175),
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const standardCharges = result.content.standard_charge_information[0].standard_charges[0];
        expect(standardCharges).toHaveProperty('gross_charge', 250);
        expect(standardCharges).toHaveProperty('discounted_cash', 175);
      });

      it('should include de-identified min/max rates', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            deidentifiedMinimum: mockDecimal(120),
            deidentifiedMaximum: mockDecimal(280),
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const standardCharges = result.content.standard_charge_information[0].standard_charges[0];
        expect(standardCharges).toHaveProperty('minimum', 120);
        expect(standardCharges).toHaveProperty('maximum', 280);
      });
    });

    describe('In-Network Rates File', () => {
      it('should generate an in-network rates MRF file', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          fileType: 'in_network_rates',
          status: 'generating',
        });
        mockPrisma.payerContract.findMany.mockResolvedValue([
          {
            ...mockPayerContract,
            rates: [
              {
                ...mockPayerContractRate,
                chargemasterItem: mockChargemasterItem,
              },
            ],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMachineReadableFile,
          fileType: 'in_network_rates',
          status: 'generated',
        });

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'in_network_rates' as any,
        });

        expect(result).toHaveProperty('mrfRecord');
        expect(result.content).toHaveProperty('reporting_entity_name');
        expect(result.content).toHaveProperty('in_network');
      });

      it('should include plan information', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          fileType: 'in_network_rates',
          status: 'generating',
        });
        mockPrisma.payerContract.findMany.mockResolvedValue([
          {
            ...mockPayerContract,
            planName: 'PPO Standard',
            planType: 'PPO',
            ein: '12-3456789',
            rates: [
              {
                ...mockPayerContractRate,
                chargemasterItem: mockChargemasterItem,
              },
            ],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'in_network_rates' as any,
        });

        const rate = result.content.in_network[0];
        expect(rate).toHaveProperty('plan_name', 'PPO Standard');
        expect(rate).toHaveProperty('plan_market_type', 'PPO');
        expect(rate).toHaveProperty('plan_id', '12-3456789');
      });

      it('should include negotiated rate information', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          fileType: 'in_network_rates',
          status: 'generating',
        });
        mockPrisma.payerContract.findMany.mockResolvedValue([
          {
            ...mockPayerContract,
            rates: [
              {
                ...mockPayerContractRate,
                cptCode: '99213',
                negotiatedRate: mockDecimal(180),
                rateType: 'fixed',
                chargemasterItem: mockChargemasterItem,
              },
            ],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'in_network_rates' as any,
        });

        const rate = result.content.in_network[0];
        expect(rate).toHaveProperty('billing_code', '99213');
        expect(rate).toHaveProperty('negotiated_rate', 180);
        expect(rate).toHaveProperty('negotiated_type', 'negotiated');
      });
    });

    describe('Negotiated Rates File', () => {
      it('should generate a negotiated rates file', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          fileType: 'negotiated_rates',
          status: 'generating',
        });
        mockPrisma.payerContractRate.findMany.mockResolvedValue([
          {
            ...mockPayerContractRate,
            payerContract: mockPayerContract,
            chargemasterItem: mockChargemasterItem,
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMachineReadableFile,
          fileType: 'negotiated_rates',
        });

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'negotiated_rates' as any,
        });

        expect(result.content).toHaveProperty('rates');
        expect(result.content).toHaveProperty('total_rates');
      });

      it('should include discount percentage calculation', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          fileType: 'negotiated_rates',
          status: 'generating',
        });
        mockPrisma.payerContractRate.findMany.mockResolvedValue([
          {
            ...mockPayerContractRate,
            negotiatedRate: mockDecimal(180),
            payerContract: mockPayerContract,
            chargemasterItem: {
              ...mockChargemasterItem,
              grossCharge: mockDecimal(250),
            },
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'negotiated_rates' as any,
        });

        const rate = result.content.rates[0];
        expect(rate).toHaveProperty('gross_charge', 250);
        expect(rate).toHaveProperty('discount_percentage');
        // (250 - 180) / 250 * 100 = 28%
        expect(rate.discount_percentage).toBe('28.00');
      });
    });

    describe('CSV Export', () => {
      it('should convert standard charges to CSV format', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            payerRates: [
              {
                ...mockPayerContractRate,
                payerContract: mockPayerContract,
              },
            ],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        expect(result.format).toBe('csv');
        expect(typeof result.content).toBe('string');
        expect(result.content).toContain('description');
        expect(result.content).toContain('code');
        expect(result.content).toContain('gross_charge');
      });

      it('should include CSV headers', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        const lines = result.content.split('\n');
        const headers = lines[0].split(',');
        expect(headers).toContain('description');
        expect(headers).toContain('code');
        expect(headers).toContain('code_type');
        expect(headers).toContain('gross_charge');
        expect(headers).toContain('discounted_cash');
      });

      it('should properly escape CSV values with commas', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            description: 'Office visit, level 3, established patient',
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        // CSV values with commas should be quoted
        expect(result.content).toContain('"Office visit, level 3, established patient"');
      });

      it('should properly escape CSV values with quotes', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([
          {
            ...mockChargemasterItem,
            description: 'Blood test "CBC"',
            payerRates: [],
          },
        ]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const result = await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        // Quotes should be escaped by doubling them
        expect(result.content).toContain('"Blood test ""CBC"""');
      });
    });

    describe('Error Handling', () => {
      it('should update MRF status to failed on error', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockRejectedValue(new Error('Database error'));
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'failed',
          errorMessage: 'Database error',
        });

        await expect(
          service.generateMRF({
            organizationId: mockOrganizationId,
            fileType: 'standard_charges' as any,
          })
        ).rejects.toThrow('Database error');

        expect(mockPrisma.machineReadableFile.update).toHaveBeenCalledWith({
          where: { id: mockMachineReadableFile.id },
          data: expect.objectContaining({
            status: 'failed',
            errorMessage: 'Database error',
          }),
        });
      });

      it('should throw error for unsupported file type', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.machineReadableFile.update.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'failed',
        });

        await expect(
          service.generateMRF({
            organizationId: mockOrganizationId,
            fileType: 'unsupported_type' as any,
          })
        ).rejects.toThrow();
      });
    });

    describe('Validity Dates', () => {
      it('should use provided valid dates', async () => {
        const validFrom = new Date('2024-01-01');
        const validTo = new Date('2024-12-31');

        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          validFrom,
          validTo,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
          validFrom,
          validTo,
        });

        expect(mockPrisma.machineReadableFile.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            validFrom,
            validTo,
          }),
        });
      });

      it('should use default valid-to date (1 year) when not provided', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        const beforeCall = new Date();
        await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const createCall = mockPrisma.machineReadableFile.create.mock.calls[0][0];
        const validTo = createCall.data.validTo;
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        // Valid-to should be approximately 1 year from now
        expect(validTo.getFullYear()).toBe(oneYearFromNow.getFullYear());
      });
    });

    describe('File Naming', () => {
      it('should generate CMS-compliant file name', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
        });

        const createCall = mockPrisma.machineReadableFile.create.mock.calls[0][0];
        const fileName = createCall.data.fileName;

        expect(fileName).toContain(mockOrganizationId);
        expect(fileName).toContain('standard-charges');
        expect(fileName).toMatch(/\d{8}\.json$/);
      });

      it('should use correct extension for CSV format', async () => {
        mockPrisma.machineReadableFile.create.mockResolvedValue({
          ...mockMachineReadableFile,
          status: 'generating',
        });
        mockPrisma.chargemasterItem.findMany.mockResolvedValue([]);
        mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

        await service.generateMRF({
          organizationId: mockOrganizationId,
          fileType: 'standard_charges' as any,
          outputFormat: 'csv',
        });

        const createCall = mockPrisma.machineReadableFile.create.mock.calls[0][0];
        expect(createCall.data.fileName).toMatch(/\.csv$/);
      });
    });
  });

  describe('listMRFFiles', () => {
    it('should list MRF files for an organization', async () => {
      mockPrisma.machineReadableFile.findMany.mockResolvedValue([
        mockMachineReadableFile,
        mockMachineReadableFilePublished,
      ]);

      const result = await service.listMRFFiles(mockOrganizationId);

      expect(result).toHaveLength(2);
      expect(mockPrisma.machineReadableFile.findMany).toHaveBeenCalledWith({
        where: { organizationId: mockOrganizationId },
        orderBy: { generatedAt: 'desc' },
      });
    });

    it('should filter by file type', async () => {
      mockPrisma.machineReadableFile.findMany.mockResolvedValue([mockMachineReadableFile]);

      await service.listMRFFiles(mockOrganizationId, 'standard_charges' as any);

      expect(mockPrisma.machineReadableFile.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: mockOrganizationId,
          fileType: 'standard_charges',
        },
        orderBy: { generatedAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      mockPrisma.machineReadableFile.findMany.mockResolvedValue([mockMachineReadableFilePublished]);

      await service.listMRFFiles(mockOrganizationId, undefined, 'published' as any);

      expect(mockPrisma.machineReadableFile.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: mockOrganizationId,
          status: 'published',
        },
        orderBy: { generatedAt: 'desc' },
      });
    });
  });

  describe('getMRFFile', () => {
    it('should retrieve MRF file by ID', async () => {
      mockPrisma.machineReadableFile.findUnique.mockResolvedValue(mockMachineReadableFile);

      const result = await service.getMRFFile('mrf-001');

      expect(result).toEqual(mockMachineReadableFile);
      expect(mockPrisma.machineReadableFile.findUnique).toHaveBeenCalledWith({
        where: { id: 'mrf-001' },
      });
    });

    it('should return null for non-existent MRF', async () => {
      mockPrisma.machineReadableFile.findUnique.mockResolvedValue(null);

      const result = await service.getMRFFile('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('publishMRFFile', () => {
    it('should update MRF status to published', async () => {
      mockPrisma.machineReadableFile.update.mockResolvedValue({
        ...mockMachineReadableFile,
        status: 'published',
        fileUrl: 'https://example.com/mrf/file.json',
        lastPublishedAt: new Date(),
      });

      const result = await service.publishMRFFile('mrf-001', 'https://example.com/mrf/file.json');

      expect(result.status).toBe('published');
      expect(result.fileUrl).toBe('https://example.com/mrf/file.json');
      expect(mockPrisma.machineReadableFile.update).toHaveBeenCalledWith({
        where: { id: 'mrf-001' },
        data: {
          status: 'published',
          fileUrl: 'https://example.com/mrf/file.json',
          lastPublishedAt: expect.any(Date),
        },
      });
    });
  });

  describe('Rate Type Mapping', () => {
    it('should map fixed rate type to fee schedule', async () => {
      mockPrisma.machineReadableFile.create.mockResolvedValue({
        ...mockMachineReadableFile,
        status: 'generating',
      });
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        {
          ...mockChargemasterItem,
          payerRates: [
            {
              ...mockPayerContractRate,
              rateType: 'fixed',
              payerContract: mockPayerContract,
            },
          ],
        },
      ]);
      mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

      const result = await service.generateMRF({
        organizationId: mockOrganizationId,
        fileType: 'standard_charges' as any,
      });

      const payerInfo = result.content.standard_charge_information[0].standard_charges[0].payers_information[0];
      expect(payerInfo.contracting_method).toBe('fee schedule');
    });

    it('should map case_rate to case rate', async () => {
      mockPrisma.machineReadableFile.create.mockResolvedValue({
        ...mockMachineReadableFile,
        status: 'generating',
      });
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        {
          ...mockChargemasterItem,
          payerRates: [
            {
              ...mockPayerContractRate,
              rateType: 'case_rate',
              payerContract: mockPayerContract,
            },
          ],
        },
      ]);
      mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

      const result = await service.generateMRF({
        organizationId: mockOrganizationId,
        fileType: 'standard_charges' as any,
      });

      const payerInfo = result.content.standard_charge_information[0].standard_charges[0].payers_information[0];
      expect(payerInfo.contracting_method).toBe('case rate');
    });

    it('should map per_diem to per diem', async () => {
      mockPrisma.machineReadableFile.create.mockResolvedValue({
        ...mockMachineReadableFile,
        status: 'generating',
      });
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        {
          ...mockChargemasterItem,
          payerRates: [
            {
              ...mockPayerContractRate,
              rateType: 'per_diem',
              payerContract: mockPayerContract,
            },
          ],
        },
      ]);
      mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

      const result = await service.generateMRF({
        organizationId: mockOrganizationId,
        fileType: 'standard_charges' as any,
      });

      const payerInfo = result.content.standard_charge_information[0].standard_charges[0].payers_information[0];
      expect(payerInfo.contracting_method).toBe('per diem');
    });

    it('should map percentage_of_charge to percent of total billed charges', async () => {
      mockPrisma.machineReadableFile.create.mockResolvedValue({
        ...mockMachineReadableFile,
        status: 'generating',
      });
      mockPrisma.chargemasterItem.findMany.mockResolvedValue([
        {
          ...mockChargemasterItem,
          payerRates: [
            {
              ...mockPayerContractRate,
              rateType: 'percentage_of_charge',
              payerContract: mockPayerContract,
            },
          ],
        },
      ]);
      mockPrisma.machineReadableFile.update.mockResolvedValue(mockMachineReadableFile);

      const result = await service.generateMRF({
        organizationId: mockOrganizationId,
        fileType: 'standard_charges' as any,
      });

      const payerInfo = result.content.standard_charge_information[0].standard_charges[0].payers_information[0];
      expect(payerInfo.contracting_method).toBe('percent of total billed charges');
    });
  });
});
