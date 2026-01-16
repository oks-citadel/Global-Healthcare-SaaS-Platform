import { PrismaClient, GFEStatus, Prisma } from '../generated/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface CreateGFEParams {
  organizationId: string;
  patientId: string;
  scheduledServiceDate?: Date;
  primaryDiagnosis?: string;
  primaryDiagnosisCode?: string;
  scheduledProcedures: Array<{
    code: string;
    description: string;
    modifiers?: string[];
    quantity?: number;
  }>;
  providerNPI?: string;
  providerName?: string;
  providerType?: string;
  facilityNPI?: string;
  facilityName?: string;
  facilityType?: string;
  patientInsuranceType?: string;
  validForDays?: number;
}

export interface GFELineItemData {
  serviceCode: string;
  serviceDescription: string;
  modifiers?: string[];
  quantity: number;
  unitPrice: number;
  providerNPI?: string;
  providerType?: string;
  serviceLocation?: string;
  estimatedDate?: Date;
  isRecurring?: boolean;
  recurringPeriod?: string;
  notes?: string;
}

export class EstimateService {
  /**
   * Create a new Good Faith Estimate
   */
  async createGoodFaithEstimate(params: CreateGFEParams): Promise<any> {
    const {
      organizationId,
      patientId,
      scheduledServiceDate,
      primaryDiagnosis,
      primaryDiagnosisCode,
      scheduledProcedures,
      providerNPI,
      providerName,
      providerType,
      facilityNPI,
      facilityName,
      facilityType,
      patientInsuranceType,
      validForDays = 365,
    } = params;

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + validForDays);

    // Fetch prices from chargemaster for each procedure
    const lineItems: GFELineItemData[] = [];
    let estimatedTotal = new Prisma.Decimal(0);
    let discountedCashTotal = new Prisma.Decimal(0);

    for (const procedure of scheduledProcedures) {
      const chargemasterItem = await prisma.chargemasterItem.findFirst({
        where: {
          organizationId,
          isActive: true,
          OR: [
            { cptCode: procedure.code },
            { hcpcsCode: procedure.code },
          ],
        },
      });

      const quantity = procedure.quantity || 1;
      let unitPrice = new Prisma.Decimal(0);
      let cashPrice = new Prisma.Decimal(0);

      if (chargemasterItem) {
        unitPrice = chargemasterItem.grossCharge;
        cashPrice = chargemasterItem.discountedCashPrice || chargemasterItem.grossCharge;
      }

      const totalPrice = unitPrice.mul(quantity);
      estimatedTotal = estimatedTotal.add(totalPrice);
      discountedCashTotal = discountedCashTotal.add(cashPrice.mul(quantity));

      lineItems.push({
        serviceCode: procedure.code,
        serviceDescription: procedure.description || chargemasterItem?.description || 'Unknown Service',
        modifiers: procedure.modifiers || [],
        quantity,
        unitPrice: Number(unitPrice),
        providerNPI,
        providerType,
        estimatedDate: scheduledServiceDate,
      });
    }

    // Create the GFE with line items
    const gfe = await prisma.goodFaithEstimate.create({
      data: {
        organizationId,
        patientId,
        scheduledServiceDate,
        expirationDate,
        status: GFEStatus.draft,
        primaryDiagnosis,
        primaryDiagnosisCode,
        scheduledProcedures: scheduledProcedures as Prisma.JsonArray,
        providerNPI,
        providerName,
        providerType,
        facilityNPI,
        facilityName,
        facilityType,
        patientInsuranceType,
        estimatedTotal,
        discountedCashPrice: discountedCashTotal,
        validForDays,
        disclaimer: this.getStandardDisclaimer(),
        lineItems: {
          create: lineItems.map(item => ({
            serviceCode: item.serviceCode,
            serviceDescription: item.serviceDescription,
            modifiers: item.modifiers || [],
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            providerNPI: item.providerNPI,
            providerType: item.providerType,
            serviceLocation: item.serviceLocation,
            estimatedDate: item.estimatedDate,
            isRecurring: item.isRecurring || false,
            recurringPeriod: item.recurringPeriod,
            notes: item.notes,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    });

    return gfe;
  }

  /**
   * Get a Good Faith Estimate by ID
   */
  async getGoodFaithEstimate(id: string, organizationId?: string) {
    const where: Prisma.GoodFaithEstimateWhereInput = { id };
    if (organizationId) {
      where.organizationId = organizationId;
    }

    const gfe = await prisma.goodFaithEstimate.findFirst({
      where,
      include: {
        lineItems: true,
      },
    });

    return gfe;
  }

  /**
   * List Good Faith Estimates for a patient
   */
  async listPatientGFEs(patientId: string, organizationId?: string, status?: GFEStatus) {
    const where: Prisma.GoodFaithEstimateWhereInput = { patientId };

    if (organizationId) {
      where.organizationId = organizationId;
    }
    if (status) {
      where.status = status;
    }

    const gfes = await prisma.goodFaithEstimate.findMany({
      where,
      include: {
        lineItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return gfes;
  }

  /**
   * Update GFE status
   */
  async updateGFEStatus(id: string, status: GFEStatus, deliveredMethod?: string) {
    const updateData: Prisma.GoodFaithEstimateUpdateInput = { status };

    if (status === GFEStatus.delivered || status === GFEStatus.sent) {
      updateData.deliveredAt = new Date();
      updateData.deliveredMethod = deliveredMethod;
    }

    const gfe = await prisma.goodFaithEstimate.update({
      where: { id },
      data: updateData,
      include: {
        lineItems: true,
      },
    });

    return gfe;
  }

  /**
   * Record patient acknowledgment of GFE
   */
  async recordPatientAcknowledgment(id: string, signature: string) {
    const gfe = await prisma.goodFaithEstimate.update({
      where: { id },
      data: {
        status: GFEStatus.acknowledged,
        patientSignature: signature,
        patientSignedAt: new Date(),
      },
      include: {
        lineItems: true,
      },
    });

    return gfe;
  }

  /**
   * Add line items to an existing GFE
   */
  async addLineItems(gfeId: string, lineItems: GFELineItemData[]) {
    const gfe = await prisma.goodFaithEstimate.findUnique({
      where: { id: gfeId },
      include: { lineItems: true },
    });

    if (!gfe) {
      throw new Error('Good Faith Estimate not found');
    }

    if (gfe.status !== GFEStatus.draft && gfe.status !== GFEStatus.pending) {
      throw new Error('Cannot modify GFE in current status');
    }

    const createdItems = await prisma.gFELineItem.createMany({
      data: lineItems.map(item => ({
        goodFaithEstimateId: gfeId,
        serviceCode: item.serviceCode,
        serviceDescription: item.serviceDescription,
        modifiers: item.modifiers || [],
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        providerNPI: item.providerNPI,
        providerType: item.providerType,
        serviceLocation: item.serviceLocation,
        estimatedDate: item.estimatedDate,
        isRecurring: item.isRecurring || false,
        recurringPeriod: item.recurringPeriod,
        notes: item.notes,
      })),
    });

    // Recalculate totals
    const updatedGFE = await this.recalculateGFETotals(gfeId);
    return updatedGFE;
  }

  /**
   * Recalculate GFE totals
   */
  async recalculateGFETotals(gfeId: string) {
    const lineItems = await prisma.gFELineItem.findMany({
      where: { goodFaithEstimateId: gfeId },
    });

    const estimatedTotal = lineItems.reduce((sum, item) => {
      return sum.add(item.totalPrice);
    }, new Prisma.Decimal(0));

    const gfe = await prisma.goodFaithEstimate.update({
      where: { id: gfeId },
      data: {
        estimatedTotal,
      },
      include: {
        lineItems: true,
      },
    });

    return gfe;
  }

  /**
   * Calculate patient responsibility based on insurance info
   */
  async calculatePatientResponsibility(
    gfeId: string,
    deductibleRemaining: number,
    outOfPocketMax: number,
    coInsurancePercent: number,
    copayAmount: number
  ) {
    const gfe = await prisma.goodFaithEstimate.findUnique({
      where: { id: gfeId },
      include: { lineItems: true },
    });

    if (!gfe) {
      throw new Error('Good Faith Estimate not found');
    }

    const estimatedTotal = Number(gfe.estimatedTotal);

    // Simple patient responsibility calculation
    // In reality, this would be much more complex
    let patientResp = 0;
    let afterDeductible = estimatedTotal;

    // Apply deductible
    if (deductibleRemaining > 0) {
      const deductibleApplied = Math.min(deductibleRemaining, estimatedTotal);
      patientResp += deductibleApplied;
      afterDeductible = estimatedTotal - deductibleApplied;
    }

    // Apply coinsurance to remaining amount
    const coInsurance = afterDeductible * (coInsurancePercent / 100);
    patientResp += coInsurance;

    // Add copay
    patientResp += copayAmount;

    // Cap at out-of-pocket max
    patientResp = Math.min(patientResp, outOfPocketMax);

    const insurancePayment = estimatedTotal - patientResp;

    const updatedGFE = await prisma.goodFaithEstimate.update({
      where: { id: gfeId },
      data: {
        patientResponsibility: patientResp,
        coInsuranceAmount: coInsurance,
        deductibleAmount: Math.min(deductibleRemaining, estimatedTotal),
        copayAmount,
      },
      include: {
        lineItems: true,
      },
    });

    return {
      gfe: updatedGFE,
      calculation: {
        estimatedTotal,
        deductibleApplied: Math.min(deductibleRemaining, estimatedTotal),
        coInsuranceAmount: coInsurance,
        copayAmount,
        patientResponsibility: patientResp,
        estimatedInsurancePayment: insurancePayment,
      },
    };
  }

  /**
   * Check for expiring GFEs
   */
  async getExpiringGFEs(daysUntilExpiration: number = 30) {
    const expirationThreshold = new Date();
    expirationThreshold.setDate(expirationThreshold.getDate() + daysUntilExpiration);

    const expiringGFEs = await prisma.goodFaithEstimate.findMany({
      where: {
        status: {
          in: [GFEStatus.sent, GFEStatus.delivered, GFEStatus.acknowledged],
        },
        expirationDate: {
          lte: expirationThreshold,
          gt: new Date(),
        },
      },
      include: {
        lineItems: true,
      },
      orderBy: { expirationDate: 'asc' },
    });

    return expiringGFEs;
  }

  /**
   * Mark expired GFEs
   */
  async markExpiredGFEs() {
    const result = await prisma.goodFaithEstimate.updateMany({
      where: {
        status: {
          notIn: [GFEStatus.expired, GFEStatus.disputed],
        },
        expirationDate: {
          lt: new Date(),
        },
      },
      data: {
        status: GFEStatus.expired,
      },
    });

    return result.count;
  }

  /**
   * Get standard disclaimer text
   */
  private getStandardDisclaimer(): string {
    return `This Good Faith Estimate shows the costs of items and services that are reasonably expected for your health care needs for an item or service. The estimate is based on information known at the time the estimate was created.

The Good Faith Estimate does not include any unknown or unexpected costs that may arise during treatment. You could be charged more if complications or special circumstances occur. If this happens, federal law allows you to dispute (appeal) the bill.

If you are billed for more than this Good Faith Estimate, you have the right to dispute the bill. You may contact the health care provider or facility listed to let them know the billed charges are higher than the Good Faith Estimate. You can ask them to update the bill to match the Good Faith Estimate, ask to negotiate the bill, or ask if there is financial assistance available.

You may also start a dispute resolution process with the U.S. Department of Health and Human Services (HHS). If you choose to use the dispute resolution process, you must start the dispute process within 120 calendar days (about 4 months) of the date on the original bill.

There is a $25 fee to use the dispute process. If the agency reviewing your dispute agrees with you, you will have to pay the price on this Good Faith Estimate. If the agency disagrees with you and agrees with the health care provider or facility, you will have to pay the higher amount.

To learn more and get a form to start the process, go to www.cms.gov/nosurprises or call 1-800-985-3059.

For questions or more information about your right to a Good Faith Estimate or the dispute process, visit www.cms.gov/nosurprises or call 1-800-985-3059.`;
  }
}

export default new EstimateService();
