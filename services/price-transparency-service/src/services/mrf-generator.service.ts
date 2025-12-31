import { PrismaClient, MRFFileType, MRFStatus, Prisma } from '../generated/client';
import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface MRFGenerationParams {
  organizationId: string;
  fileType: MRFFileType;
  validFrom?: Date;
  validTo?: Date;
  outputFormat?: 'json' | 'csv';
}

export interface HospitalStandardChargesHeader {
  hospital_name: string;
  last_updated_on: string;
  version: string;
  hospital_location: string[];
  hospital_address: string[];
  license_number: string | null;
  affirmation: {
    affirmation: string;
    confirm_affirmation: boolean;
  };
}

export interface StandardChargeItem {
  description: string;
  code_information: Array<{
    code: string;
    type: 'CPT' | 'HCPCS' | 'DRG' | 'MS-DRG' | 'APC' | 'ICD' | 'NDC' | 'LOCAL';
  }>;
  standard_charges: Array<{
    minimum: number | null;
    maximum: number | null;
    gross_charge: number | null;
    discounted_cash: number | null;
    setting: 'inpatient' | 'outpatient' | 'both';
    payers_information: Array<{
      payer_name: string;
      plan_name: string;
      standard_charge_dollar: number | null;
      standard_charge_percentage: number | null;
      standard_charge_algorithm: string | null;
      estimated_amount: number | null;
      contracting_method: 'case rate' | 'fee schedule' | 'percent of total billed charges' | 'per diem' | 'other';
    }>;
    additional_payer_notes: string | null;
  }>;
  drug_information?: {
    unit: string;
    type: string;
  };
  additional_generic_notes: string | null;
}

export class MRFGeneratorService {
  private schemaVersion = '2.0.0';

  /**
   * Generate a Machine-Readable File for CMS compliance
   */
  async generateMRF(params: MRFGenerationParams): Promise<any> {
    const { organizationId, fileType, validFrom, validTo, outputFormat = 'json' } = params;

    // Create MRF record
    const mrfRecord = await prisma.machineReadableFile.create({
      data: {
        organizationId,
        fileName: this.generateFileName(organizationId, fileType, outputFormat),
        fileType,
        version: '1.0',
        schemaVersion: this.schemaVersion,
        validFrom: validFrom || new Date(),
        validTo: validTo || this.getDefaultValidTo(),
        status: MRFStatus.generating,
      },
    });

    try {
      let content: any;
      let recordCount = 0;

      switch (fileType) {
        case MRFFileType.standard_charges:
          const result = await this.generateStandardChargesFile(organizationId);
          content = result.content;
          recordCount = result.recordCount;
          break;

        case MRFFileType.in_network_rates:
          const inNetworkResult = await this.generateInNetworkRatesFile(organizationId);
          content = inNetworkResult.content;
          recordCount = inNetworkResult.recordCount;
          break;

        case MRFFileType.negotiated_rates:
          const negotiatedResult = await this.generateNegotiatedRatesFile(organizationId);
          content = negotiatedResult.content;
          recordCount = negotiatedResult.recordCount;
          break;

        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Convert to CSV if requested
      if (outputFormat === 'csv') {
        content = this.convertToCSV(content, fileType);
      }

      // Update MRF record with success
      const updatedMRF = await prisma.machineReadableFile.update({
        where: { id: mrfRecord.id },
        data: {
          status: MRFStatus.generated,
          recordCount,
          complianceCheckPassed: true,
          complianceCheckDate: new Date(),
        },
      });

      return {
        mrfRecord: updatedMRF,
        content,
        format: outputFormat,
      };
    } catch (error) {
      // Update MRF record with failure
      await prisma.machineReadableFile.update({
        where: { id: mrfRecord.id },
        data: {
          status: MRFStatus.failed,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Generate Standard Charges file (Hospital Price Transparency)
   */
  private async generateStandardChargesFile(organizationId: string) {
    // Fetch all chargemaster items
    const chargemasterItems = await prisma.chargemasterItem.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      include: {
        payerRates: {
          where: { isActive: true },
          include: {
            payerContract: true,
          },
        },
      },
    });

    const header: HospitalStandardChargesHeader = {
      hospital_name: 'Healthcare Organization', // Would be fetched from org config
      last_updated_on: new Date().toISOString().split('T')[0],
      version: this.schemaVersion,
      hospital_location: ['Main Campus'],
      hospital_address: ['123 Healthcare Way, City, ST 12345'],
      license_number: null,
      affirmation: {
        affirmation: 'To the best of my knowledge, the standard charge information encoded in this file is accurate and complete.',
        confirm_affirmation: true,
      },
    };

    const standardCharges: StandardChargeItem[] = chargemasterItems.map(item => {
      const codeInfo: Array<{ code: string; type: 'CPT' | 'HCPCS' | 'DRG' | 'MS-DRG' | 'APC' | 'ICD' | 'NDC' | 'LOCAL' }> = [];

      if (item.cptCode) {
        codeInfo.push({ code: item.cptCode, type: 'CPT' });
      }
      if (item.hcpcsCode) {
        codeInfo.push({ code: item.hcpcsCode, type: 'HCPCS' });
      }
      if (item.ndcCode) {
        codeInfo.push({ code: item.ndcCode, type: 'NDC' });
      }
      if (codeInfo.length === 0) {
        codeInfo.push({ code: item.code, type: 'LOCAL' });
      }

      const payersInfo = item.payerRates.map(rate => ({
        payer_name: rate.payerContract.payerName,
        plan_name: rate.payerContract.planName || 'All Plans',
        standard_charge_dollar: Number(rate.negotiatedRate),
        standard_charge_percentage: rate.percentageOfCharge ? Number(rate.percentageOfCharge) : null,
        standard_charge_algorithm: null,
        estimated_amount: Number(rate.negotiatedRate),
        contracting_method: this.mapRateTypeToContractingMethod(rate.rateType),
      }));

      return {
        description: item.description,
        code_information: codeInfo,
        standard_charges: [{
          minimum: item.deidentifiedMinimum ? Number(item.deidentifiedMinimum) : null,
          maximum: item.deidentifiedMaximum ? Number(item.deidentifiedMaximum) : null,
          gross_charge: Number(item.grossCharge),
          discounted_cash: item.discountedCashPrice ? Number(item.discountedCashPrice) : null,
          setting: 'both' as const,
          payers_information: payersInfo,
          additional_payer_notes: null,
        }],
        drug_information: item.ndcCode ? {
          unit: item.drugUnitOfMeasure || 'EA',
          type: 'NDC',
        } : undefined,
        additional_generic_notes: null,
      };
    });

    return {
      content: {
        ...header,
        standard_charge_information: standardCharges,
      },
      recordCount: standardCharges.length,
    };
  }

  /**
   * Generate In-Network Rates file
   */
  private async generateInNetworkRatesFile(organizationId: string) {
    const contracts = await prisma.payerContract.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      include: {
        rates: {
          where: { isActive: true },
          include: {
            chargemasterItem: true,
          },
        },
      },
    });

    const inNetworkRates = contracts.flatMap(contract =>
      contract.rates.map(rate => ({
        reporting_entity_name: 'Healthcare Organization',
        reporting_entity_type: 'hospital',
        plan_name: contract.planName || contract.payerName,
        plan_id_type: 'EIN',
        plan_id: contract.ein || '',
        plan_market_type: contract.planType,
        description: rate.chargemasterItem.description,
        billing_code_type: rate.cptCode ? 'CPT' : 'HCPCS',
        billing_code: rate.cptCode || rate.hcpcsCode || '',
        billing_code_modifier: rate.modifiers,
        negotiated_type: this.mapRateTypeToNegotiatedType(rate.rateType),
        negotiated_rate: Number(rate.negotiatedRate),
        expiration_date: rate.expirationDate?.toISOString().split('T')[0] || null,
        billing_class: 'professional',
        service_code: [],
        covered_services: [],
      }))
    );

    return {
      content: {
        reporting_entity_name: 'Healthcare Organization',
        reporting_entity_type: 'hospital',
        last_updated_on: new Date().toISOString().split('T')[0],
        version: this.schemaVersion,
        in_network: inNetworkRates,
      },
      recordCount: inNetworkRates.length,
    };
  }

  /**
   * Generate Negotiated Rates file
   */
  private async generateNegotiatedRatesFile(organizationId: string) {
    const rates = await prisma.payerContractRate.findMany({
      where: {
        isActive: true,
        payerContract: {
          organizationId,
          isActive: true,
        },
      },
      include: {
        payerContract: true,
        chargemasterItem: true,
      },
    });

    const negotiatedRates = rates.map(rate => ({
      payer_name: rate.payerContract.payerName,
      plan_name: rate.payerContract.planName,
      plan_type: rate.payerContract.planType,
      service_code: rate.cptCode || rate.hcpcsCode || rate.chargemasterItem.code,
      service_description: rate.chargemasterItem.description,
      negotiated_rate: Number(rate.negotiatedRate),
      rate_type: rate.rateType,
      effective_date: rate.effectiveDate.toISOString().split('T')[0],
      expiration_date: rate.expirationDate?.toISOString().split('T')[0] || null,
      gross_charge: Number(rate.chargemasterItem.grossCharge),
      discount_percentage: rate.chargemasterItem.grossCharge
        ? ((Number(rate.chargemasterItem.grossCharge) - Number(rate.negotiatedRate)) / Number(rate.chargemasterItem.grossCharge) * 100).toFixed(2)
        : null,
    }));

    return {
      content: {
        generated_on: new Date().toISOString(),
        organization_id: organizationId,
        total_rates: negotiatedRates.length,
        rates: negotiatedRates,
      },
      recordCount: negotiatedRates.length,
    };
  }

  /**
   * Convert JSON content to CSV format
   */
  private convertToCSV(content: any, fileType: MRFFileType): string {
    if (fileType === MRFFileType.standard_charges) {
      const items = content.standard_charge_information || [];
      if (items.length === 0) return '';

      const headers = [
        'description',
        'code',
        'code_type',
        'gross_charge',
        'discounted_cash',
        'minimum',
        'maximum',
        'payer_name',
        'plan_name',
        'negotiated_rate',
        'contracting_method',
      ];

      const rows: string[] = [headers.join(',')];

      for (const item of items) {
        const codes = item.code_information || [];
        const charges = item.standard_charges || [];

        for (const charge of charges) {
          const payers = charge.payers_information || [];

          if (payers.length === 0) {
            // Row without payer info
            for (const code of codes) {
              rows.push([
                this.escapeCSV(item.description),
                this.escapeCSV(code.code),
                this.escapeCSV(code.type),
                charge.gross_charge || '',
                charge.discounted_cash || '',
                charge.minimum || '',
                charge.maximum || '',
                '',
                '',
                '',
                '',
              ].join(','));
            }
          } else {
            // Row per payer
            for (const code of codes) {
              for (const payer of payers) {
                rows.push([
                  this.escapeCSV(item.description),
                  this.escapeCSV(code.code),
                  this.escapeCSV(code.type),
                  charge.gross_charge || '',
                  charge.discounted_cash || '',
                  charge.minimum || '',
                  charge.maximum || '',
                  this.escapeCSV(payer.payer_name),
                  this.escapeCSV(payer.plan_name),
                  payer.standard_charge_dollar || '',
                  this.escapeCSV(payer.contracting_method),
                ].join(','));
              }
            }
          }
        }
      }

      return rows.join('\n');
    }

    // Generic CSV conversion for other file types
    const items = Array.isArray(content) ? content : (content.rates || content.in_network || [content]);
    if (items.length === 0) return '';

    const headers = Object.keys(items[0]).filter(k => typeof items[0][k] !== 'object');
    const rows: string[] = [headers.join(',')];

    for (const item of items) {
      const values = headers.map(h => {
        const val = item[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') return this.escapeCSV(val);
        return String(val);
      });
      rows.push(values.join(','));
    }

    return rows.join('\n');
  }

  /**
   * Escape CSV value
   */
  private escapeCSV(value: string): string {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Generate file name based on CMS requirements
   */
  private generateFileName(organizationId: string, fileType: MRFFileType, format: string): string {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const typeMap: Record<MRFFileType, string> = {
      [MRFFileType.standard_charges]: 'standard-charges',
      [MRFFileType.in_network_rates]: 'in-network-rates',
      [MRFFileType.out_of_network_allowed]: 'out-of-network-allowed',
      [MRFFileType.prescription_drugs]: 'prescription-drugs',
      [MRFFileType.negotiated_rates]: 'negotiated-rates',
    };

    return `${organizationId}_${typeMap[fileType]}_${date}.${format}`;
  }

  /**
   * Get default valid-to date (1 year from now)
   */
  private getDefaultValidTo(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  /**
   * Map rate type to CMS contracting method
   */
  private mapRateTypeToContractingMethod(rateType: string): 'case rate' | 'fee schedule' | 'percent of total billed charges' | 'per diem' | 'other' {
    const mapping: Record<string, 'case rate' | 'fee schedule' | 'percent of total billed charges' | 'per diem' | 'other'> = {
      fixed: 'fee schedule',
      case_rate: 'case rate',
      per_diem: 'per diem',
      percentage_of_charge: 'percent of total billed charges',
      percentage_of_medicare: 'other',
      capitation: 'other',
    };
    return mapping[rateType] || 'other';
  }

  /**
   * Map rate type to negotiated type
   */
  private mapRateTypeToNegotiatedType(rateType: string): string {
    const mapping: Record<string, string> = {
      fixed: 'negotiated',
      case_rate: 'derived',
      per_diem: 'per diem',
      percentage_of_charge: 'percentage',
      percentage_of_medicare: 'fee schedule',
      capitation: 'capitation',
    };
    return mapping[rateType] || 'negotiated';
  }

  /**
   * List generated MRF files
   */
  async listMRFFiles(organizationId: string, fileType?: MRFFileType, status?: MRFStatus) {
    const where: Prisma.MachineReadableFileWhereInput = { organizationId };

    if (fileType) {
      where.fileType = fileType;
    }
    if (status) {
      where.status = status;
    }

    const files = await prisma.machineReadableFile.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
    });

    return files;
  }

  /**
   * Get MRF file by ID
   */
  async getMRFFile(id: string) {
    const file = await prisma.machineReadableFile.findUnique({
      where: { id },
    });
    return file;
  }

  /**
   * Update MRF file status to published
   */
  async publishMRFFile(id: string, fileUrl: string) {
    const file = await prisma.machineReadableFile.update({
      where: { id },
      data: {
        status: MRFStatus.published,
        fileUrl,
        lastPublishedAt: new Date(),
      },
    });
    return file;
  }
}

export default new MRFGeneratorService();
