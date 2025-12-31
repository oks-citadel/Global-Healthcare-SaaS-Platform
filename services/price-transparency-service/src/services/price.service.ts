import { PrismaClient, Prisma } from '../generated/client';

const prisma = new PrismaClient();

export interface PriceLookupParams {
  organizationId: string;
  serviceCode: string; // CPT or HCPCS
  payerId?: string;
  zipCode?: string;
}

export interface PriceComparisonParams {
  serviceCode: string;
  zipCode: string;
  radiusMiles?: number;
}

export interface ChargemasterSearchParams {
  organizationId: string;
  searchTerm?: string;
  cptCode?: string;
  hcpcsCode?: string;
  department?: string;
  isShoppable?: boolean;
  limit?: number;
  offset?: number;
}

export class PriceService {
  /**
   * Look up price for a specific service
   */
  async lookupPrice(params: PriceLookupParams) {
    const { organizationId, serviceCode, payerId } = params;

    // Find the chargemaster item
    const chargemasterItem = await prisma.chargemasterItem.findFirst({
      where: {
        organizationId,
        isActive: true,
        OR: [
          { cptCode: serviceCode },
          { hcpcsCode: serviceCode },
          { code: serviceCode },
        ],
      },
      include: {
        payerRates: payerId ? {
          where: {
            isActive: true,
            payerContract: {
              payerId,
              isActive: true,
            },
          },
          include: {
            payerContract: true,
          },
        } : false,
      },
    });

    if (!chargemasterItem) {
      return null;
    }

    // Build price response
    const priceInfo = {
      chargemasterItemId: chargemasterItem.id,
      code: chargemasterItem.code,
      description: chargemasterItem.description,
      cptCode: chargemasterItem.cptCode,
      hcpcsCode: chargemasterItem.hcpcsCode,
      grossCharge: chargemasterItem.grossCharge,
      discountedCashPrice: chargemasterItem.discountedCashPrice,
      deidentifiedMinimum: chargemasterItem.deidentifiedMinimum,
      deidentifiedMaximum: chargemasterItem.deidentifiedMaximum,
      payerSpecificRates: [] as Array<{
        payerId: string;
        payerName: string;
        planType: string;
        negotiatedRate: Prisma.Decimal;
        rateType: string;
      }>,
    };

    // Add payer-specific rates if available
    if (chargemasterItem.payerRates && chargemasterItem.payerRates.length > 0) {
      priceInfo.payerSpecificRates = chargemasterItem.payerRates.map(rate => ({
        payerId: rate.payerContract.payerId,
        payerName: rate.payerContract.payerName,
        planType: rate.payerContract.planType,
        negotiatedRate: rate.negotiatedRate,
        rateType: rate.rateType,
      }));
    }

    return priceInfo;
  }

  /**
   * Get all shoppable services for an organization
   */
  async getShoppableServices(organizationId: string, limit = 100, offset = 0) {
    const [services, total] = await Promise.all([
      prisma.shoppableService.findMany({
        where: {
          organizationId,
          isActive: true,
        },
        orderBy: { serviceName: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.shoppableService.count({
        where: {
          organizationId,
          isActive: true,
        },
      }),
    ]);

    return { services, total };
  }

  /**
   * Search chargemaster items
   */
  async searchChargemaster(params: ChargemasterSearchParams) {
    const { organizationId, searchTerm, cptCode, hcpcsCode, department, isShoppable, limit = 50, offset = 0 } = params;

    const where: Prisma.ChargemasterItemWhereInput = {
      organizationId,
      isActive: true,
    };

    if (searchTerm) {
      where.OR = [
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { code: { contains: searchTerm, mode: 'insensitive' } },
        { cptCode: { contains: searchTerm, mode: 'insensitive' } },
        { hcpcsCode: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (cptCode) {
      where.cptCode = cptCode;
    }

    if (hcpcsCode) {
      where.hcpcsCode = hcpcsCode;
    }

    if (department) {
      where.departmentName = { contains: department, mode: 'insensitive' };
    }

    if (isShoppable !== undefined) {
      where.isShoppable = isShoppable;
    }

    const [items, total] = await Promise.all([
      prisma.chargemasterItem.findMany({
        where,
        orderBy: { description: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.chargemasterItem.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Compare prices across multiple payers
   */
  async comparePayerPrices(organizationId: string, serviceCode: string) {
    const chargemasterItem = await prisma.chargemasterItem.findFirst({
      where: {
        organizationId,
        isActive: true,
        OR: [
          { cptCode: serviceCode },
          { hcpcsCode: serviceCode },
        ],
      },
    });

    if (!chargemasterItem) {
      return null;
    }

    const payerRates = await prisma.payerContractRate.findMany({
      where: {
        chargemasterItemId: chargemasterItem.id,
        isActive: true,
        payerContract: {
          isActive: true,
        },
      },
      include: {
        payerContract: true,
      },
      orderBy: {
        negotiatedRate: 'asc',
      },
    });

    const rates = payerRates.map(rate => ({
      payerId: rate.payerContract.payerId,
      payerName: rate.payerContract.payerName,
      planType: rate.payerContract.planType,
      planName: rate.payerContract.planName,
      negotiatedRate: rate.negotiatedRate,
      rateType: rate.rateType,
    }));

    // Calculate statistics
    const rateValues = payerRates.map(r => Number(r.negotiatedRate));
    const minRate = Math.min(...rateValues);
    const maxRate = Math.max(...rateValues);
    const avgRate = rateValues.reduce((a, b) => a + b, 0) / rateValues.length;

    return {
      serviceCode,
      description: chargemasterItem.description,
      grossCharge: chargemasterItem.grossCharge,
      discountedCashPrice: chargemasterItem.discountedCashPrice,
      payerRates: rates,
      statistics: {
        minNegotiatedRate: minRate,
        maxNegotiatedRate: maxRate,
        averageNegotiatedRate: avgRate,
        payerCount: rates.length,
      },
    };
  }

  /**
   * Get price comparison cache or generate new
   */
  async getPriceComparison(params: PriceComparisonParams) {
    const { serviceCode, zipCode, radiusMiles = 25 } = params;

    // Check cache first
    const cached = await prisma.priceComparisonCache.findUnique({
      where: {
        serviceCode_zipCode_searchRadius: {
          serviceCode,
          zipCode,
          searchRadius: radiusMiles,
        },
      },
    });

    if (cached && cached.expiresAt > new Date()) {
      return {
        cached: true,
        ...cached,
      };
    }

    // In a real implementation, this would query external APIs
    // or aggregate from multiple organization chargemasters
    return {
      cached: false,
      message: 'Price comparison data would be generated here',
      serviceCode,
      zipCode,
      searchRadius: radiusMiles,
    };
  }

  /**
   * Create or update a price estimate for a patient
   */
  async createPriceEstimate(data: {
    organizationId: string;
    patientId?: string;
    serviceCode: string;
    serviceDescription: string;
    diagnosisCode?: string;
    diagnosisDescription?: string;
    payerId?: string;
    payerName?: string;
    planType?: string;
    grossCharge: number;
    negotiatedRate?: number;
    discountedCashPrice?: number;
    estimatedInsPayment?: number;
    estimatedPatientResp?: number;
    deductibleRemaining?: number;
    outOfPocketRemaining?: number;
    notes?: string;
    validDays?: number;
  }) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.validDays || 30));

    // Find related chargemaster item
    const chargemasterItem = await prisma.chargemasterItem.findFirst({
      where: {
        organizationId: data.organizationId,
        OR: [
          { cptCode: data.serviceCode },
          { hcpcsCode: data.serviceCode },
        ],
      },
    });

    const estimate = await prisma.priceEstimate.create({
      data: {
        organizationId: data.organizationId,
        patientId: data.patientId,
        chargemasterItemId: chargemasterItem?.id,
        serviceCode: data.serviceCode,
        serviceDescription: data.serviceDescription,
        diagnosisCode: data.diagnosisCode,
        diagnosisDescription: data.diagnosisDescription,
        payerId: data.payerId,
        payerName: data.payerName,
        planType: data.planType,
        grossCharge: data.grossCharge,
        negotiatedRate: data.negotiatedRate,
        discountedCashPrice: data.discountedCashPrice,
        estimatedInsPayment: data.estimatedInsPayment,
        estimatedPatientResp: data.estimatedPatientResp,
        deductibleRemaining: data.deductibleRemaining,
        outOfPocketRemaining: data.outOfPocketRemaining,
        notes: data.notes,
        expiresAt,
      },
    });

    return estimate;
  }

  /**
   * Get price estimates for a patient
   */
  async getPatientEstimates(patientId: string, organizationId?: string) {
    const where: Prisma.PriceEstimateWhereInput = {
      patientId,
      expiresAt: { gt: new Date() },
    };

    if (organizationId) {
      where.organizationId = organizationId;
    }

    const estimates = await prisma.priceEstimate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        chargemasterItem: true,
      },
    });

    return estimates;
  }
}

export default new PriceService();
