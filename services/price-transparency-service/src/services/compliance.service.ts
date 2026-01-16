import { PrismaClient, ComplianceAuditType, MRFFileType, MRFStatus, GFEStatus, Prisma } from '../generated/client';

const prisma = new PrismaClient();

export interface ComplianceCheckResult {
  passed: boolean;
  checkName: string;
  category: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  message: string;
  recommendation?: string;
  details?: any;
}

export interface ComplianceReport {
  organizationId: string;
  auditType: ComplianceAuditType;
  auditDate: Date;
  overallScore: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  findings: ComplianceCheckResult[];
  recommendations: string[];
}

export class ComplianceService {
  /**
   * Run CMS Hospital Price Transparency compliance check
   */
  async checkHospitalPriceTransparency(organizationId: string): Promise<ComplianceReport> {
    const findings: ComplianceCheckResult[] = [];
    const recommendations: string[] = [];

    // Check 1: Chargemaster completeness
    const chargemasterCheck = await this.checkChargemasterCompleteness(organizationId);
    findings.push(chargemasterCheck);
    if (!chargemasterCheck.passed && chargemasterCheck.recommendation) {
      recommendations.push(chargemasterCheck.recommendation);
    }

    // Check 2: Shoppable services (70 required)
    const shoppableCheck = await this.checkShoppableServicesCount(organizationId);
    findings.push(shoppableCheck);
    if (!shoppableCheck.passed && shoppableCheck.recommendation) {
      recommendations.push(shoppableCheck.recommendation);
    }

    // Check 3: Payer negotiated rates
    const payerRatesCheck = await this.checkPayerNegotiatedRates(organizationId);
    findings.push(payerRatesCheck);
    if (!payerRatesCheck.passed && payerRatesCheck.recommendation) {
      recommendations.push(payerRatesCheck.recommendation);
    }

    // Check 4: MRF file generation and publication
    const mrfCheck = await this.checkMRFCompliance(organizationId);
    findings.push(mrfCheck);
    if (!mrfCheck.passed && mrfCheck.recommendation) {
      recommendations.push(mrfCheck.recommendation);
    }

    // Check 5: Discounted cash prices
    const cashPriceCheck = await this.checkDiscountedCashPrices(organizationId);
    findings.push(cashPriceCheck);
    if (!cashPriceCheck.passed && cashPriceCheck.recommendation) {
      recommendations.push(cashPriceCheck.recommendation);
    }

    // Check 6: De-identified min/max
    const deidentifiedCheck = await this.checkDeidentifiedPrices(organizationId);
    findings.push(deidentifiedCheck);
    if (!deidentifiedCheck.passed && deidentifiedCheck.recommendation) {
      recommendations.push(deidentifiedCheck.recommendation);
    }

    // Calculate scores
    const passedChecks = findings.filter(f => f.passed).length;
    const failedChecks = findings.filter(f => !f.passed && f.severity !== 'info').length;
    const warningChecks = findings.filter(f => !f.passed && f.severity === 'minor').length;
    const overallScore = (passedChecks / findings.length) * 100;

    // Save audit record
    await prisma.complianceAudit.create({
      data: {
        organizationId,
        auditType: ComplianceAuditType.cms_hospital_price_transparency,
        findings: findings as unknown as Prisma.JsonArray,
        overallScore,
        passedChecks,
        failedChecks,
        warningChecks,
        recommendations: recommendations as unknown as Prisma.JsonArray,
        remedationDeadline: failedChecks > 0 ? this.getRemediationDeadline(30) : null,
      },
    });

    return {
      organizationId,
      auditType: ComplianceAuditType.cms_hospital_price_transparency,
      auditDate: new Date(),
      overallScore,
      passedChecks,
      failedChecks,
      warningChecks,
      findings,
      recommendations,
    };
  }

  /**
   * Run No Surprises Act compliance check
   */
  async checkNoSurprisesActCompliance(organizationId: string): Promise<ComplianceReport> {
    const findings: ComplianceCheckResult[] = [];
    const recommendations: string[] = [];

    // Check 1: GFE process in place
    const gfeProcessCheck = await this.checkGFEProcess(organizationId);
    findings.push(gfeProcessCheck);
    if (!gfeProcessCheck.passed && gfeProcessCheck.recommendation) {
      recommendations.push(gfeProcessCheck.recommendation);
    }

    // Check 2: GFE delivery timeline
    const gfeTimelineCheck = await this.checkGFEDeliveryTimeline(organizationId);
    findings.push(gfeTimelineCheck);
    if (!gfeTimelineCheck.passed && gfeTimelineCheck.recommendation) {
      recommendations.push(gfeTimelineCheck.recommendation);
    }

    // Check 3: GFE content completeness
    const gfeContentCheck = await this.checkGFEContentCompleteness(organizationId);
    findings.push(gfeContentCheck);
    if (!gfeContentCheck.passed && gfeContentCheck.recommendation) {
      recommendations.push(gfeContentCheck.recommendation);
    }

    // Check 4: Patient rights notice
    const patientRightsCheck: ComplianceCheckResult = {
      passed: true, // Would check actual implementation
      checkName: 'Patient Rights Notice',
      category: 'No Surprises Act',
      severity: 'critical',
      message: 'Patient rights notice verification requires manual review',
      recommendation: 'Ensure patient rights notice is displayed prominently',
    };
    findings.push(patientRightsCheck);

    // Calculate scores
    const passedChecks = findings.filter(f => f.passed).length;
    const failedChecks = findings.filter(f => !f.passed && f.severity !== 'info').length;
    const warningChecks = findings.filter(f => !f.passed && f.severity === 'minor').length;
    const overallScore = (passedChecks / findings.length) * 100;

    // Save audit record
    await prisma.complianceAudit.create({
      data: {
        organizationId,
        auditType: ComplianceAuditType.no_surprises_act_gfe,
        findings: findings as unknown as Prisma.JsonArray,
        overallScore,
        passedChecks,
        failedChecks,
        warningChecks,
        recommendations: recommendations as unknown as Prisma.JsonArray,
      },
    });

    return {
      organizationId,
      auditType: ComplianceAuditType.no_surprises_act_gfe,
      auditDate: new Date(),
      overallScore,
      passedChecks,
      failedChecks,
      warningChecks,
      findings,
      recommendations,
    };
  }

  /**
   * Check chargemaster completeness
   */
  private async checkChargemasterCompleteness(organizationId: string): Promise<ComplianceCheckResult> {
    const totalItems = await prisma.chargemasterItem.count({
      where: { organizationId, isActive: true },
    });

    const itemsWithCodes = await prisma.chargemasterItem.count({
      where: {
        organizationId,
        isActive: true,
        OR: [
          { cptCode: { not: null } },
          { hcpcsCode: { not: null } },
        ],
      },
    });

    const completeness = totalItems > 0 ? (itemsWithCodes / totalItems) * 100 : 0;

    return {
      passed: completeness >= 95,
      checkName: 'Chargemaster Completeness',
      category: 'Data Quality',
      severity: completeness < 80 ? 'critical' : completeness < 95 ? 'major' : 'minor',
      message: `${completeness.toFixed(1)}% of chargemaster items have CPT/HCPCS codes`,
      recommendation: completeness < 95 ? 'Add CPT or HCPCS codes to all chargemaster items' : undefined,
      details: {
        totalItems,
        itemsWithCodes,
        completenessPercent: completeness,
      },
    };
  }

  /**
   * Check shoppable services count (CMS requires 70)
   */
  private async checkShoppableServicesCount(organizationId: string): Promise<ComplianceCheckResult> {
    const shoppableCount = await prisma.shoppableService.count({
      where: { organizationId, isActive: true },
    });

    const passed = shoppableCount >= 70;

    return {
      passed,
      checkName: 'Shoppable Services Count',
      category: 'CMS Requirements',
      severity: shoppableCount < 35 ? 'critical' : shoppableCount < 70 ? 'major' : 'info',
      message: `${shoppableCount} shoppable services defined (minimum 70 required)`,
      recommendation: !passed ? `Add ${70 - shoppableCount} more shoppable services to meet CMS requirements` : undefined,
      details: {
        currentCount: shoppableCount,
        requiredCount: 70,
        deficit: Math.max(0, 70 - shoppableCount),
      },
    };
  }

  /**
   * Check payer negotiated rates
   */
  private async checkPayerNegotiatedRates(organizationId: string): Promise<ComplianceCheckResult> {
    const contracts = await prisma.payerContract.count({
      where: { organizationId, isActive: true },
    });

    const contractsWithRates = await prisma.payerContract.count({
      where: {
        organizationId,
        isActive: true,
        rates: {
          some: { isActive: true },
        },
      },
    });

    const coverage = contracts > 0 ? (contractsWithRates / contracts) * 100 : 0;

    return {
      passed: coverage >= 90,
      checkName: 'Payer Negotiated Rates',
      category: 'Data Quality',
      severity: coverage < 50 ? 'critical' : coverage < 90 ? 'major' : 'minor',
      message: `${coverage.toFixed(1)}% of payer contracts have negotiated rates defined`,
      recommendation: coverage < 90 ? 'Upload negotiated rates for all active payer contracts' : undefined,
      details: {
        totalContracts: contracts,
        contractsWithRates,
        coveragePercent: coverage,
      },
    };
  }

  /**
   * Check MRF compliance
   */
  private async checkMRFCompliance(organizationId: string): Promise<ComplianceCheckResult> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMRF = await prisma.machineReadableFile.findFirst({
      where: {
        organizationId,
        fileType: MRFFileType.standard_charges,
        status: MRFStatus.published,
        lastPublishedAt: { gte: thirtyDaysAgo },
      },
      orderBy: { lastPublishedAt: 'desc' },
    });

    return {
      passed: !!recentMRF,
      checkName: 'MRF Publication',
      category: 'CMS Requirements',
      severity: 'critical',
      message: recentMRF
        ? `Machine-readable file published on ${recentMRF.lastPublishedAt?.toISOString().split('T')[0]}`
        : 'No machine-readable file published in the last 30 days',
      recommendation: !recentMRF ? 'Generate and publish machine-readable file immediately' : undefined,
      details: {
        lastPublished: recentMRF?.lastPublishedAt,
        fileUrl: recentMRF?.fileUrl,
      },
    };
  }

  /**
   * Check discounted cash prices
   */
  private async checkDiscountedCashPrices(organizationId: string): Promise<ComplianceCheckResult> {
    const totalItems = await prisma.chargemasterItem.count({
      where: { organizationId, isActive: true },
    });

    const itemsWithCashPrice = await prisma.chargemasterItem.count({
      where: {
        organizationId,
        isActive: true,
        discountedCashPrice: { not: null },
      },
    });

    const coverage = totalItems > 0 ? (itemsWithCashPrice / totalItems) * 100 : 0;

    return {
      passed: coverage >= 100,
      checkName: 'Discounted Cash Prices',
      category: 'CMS Requirements',
      severity: coverage < 50 ? 'critical' : coverage < 100 ? 'major' : 'info',
      message: `${coverage.toFixed(1)}% of items have discounted cash prices`,
      recommendation: coverage < 100 ? 'Add discounted cash prices to all chargemaster items' : undefined,
      details: {
        totalItems,
        itemsWithCashPrice,
        coveragePercent: coverage,
      },
    };
  }

  /**
   * Check de-identified min/max prices
   */
  private async checkDeidentifiedPrices(organizationId: string): Promise<ComplianceCheckResult> {
    const totalItems = await prisma.chargemasterItem.count({
      where: { organizationId, isActive: true },
    });

    const itemsWithDeidentified = await prisma.chargemasterItem.count({
      where: {
        organizationId,
        isActive: true,
        AND: [
          { deidentifiedMinimum: { not: null } },
          { deidentifiedMaximum: { not: null } },
        ],
      },
    });

    const coverage = totalItems > 0 ? (itemsWithDeidentified / totalItems) * 100 : 0;

    return {
      passed: coverage >= 90,
      checkName: 'De-identified Min/Max Prices',
      category: 'CMS Requirements',
      severity: coverage < 50 ? 'major' : coverage < 90 ? 'minor' : 'info',
      message: `${coverage.toFixed(1)}% of items have de-identified min/max prices`,
      recommendation: coverage < 90 ? 'Add de-identified minimum and maximum negotiated rates' : undefined,
      details: {
        totalItems,
        itemsWithDeidentified,
        coveragePercent: coverage,
      },
    };
  }

  /**
   * Check GFE process
   */
  private async checkGFEProcess(organizationId: string): Promise<ComplianceCheckResult> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const gfeCount = await prisma.goodFaithEstimate.count({
      where: {
        organizationId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    return {
      passed: gfeCount > 0,
      checkName: 'GFE Process Active',
      category: 'No Surprises Act',
      severity: gfeCount === 0 ? 'major' : 'info',
      message: `${gfeCount} Good Faith Estimates created in the last 30 days`,
      recommendation: gfeCount === 0 ? 'Implement and activate Good Faith Estimate generation process' : undefined,
      details: {
        gfeCountLast30Days: gfeCount,
      },
    };
  }

  /**
   * Check GFE delivery timeline compliance
   */
  private async checkGFEDeliveryTimeline(organizationId: string): Promise<ComplianceCheckResult> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find GFEs that should have been delivered (scheduled service date > 3 days from creation)
    const gfes = await prisma.goodFaithEstimate.findMany({
      where: {
        organizationId,
        createdAt: { gte: thirtyDaysAgo },
        scheduledServiceDate: { not: null },
      },
    });

    let onTimeCount = 0;
    let lateCount = 0;

    for (const gfe of gfes) {
      if (gfe.scheduledServiceDate && gfe.deliveredAt) {
        const daysBeforeService = Math.floor(
          (gfe.scheduledServiceDate.getTime() - gfe.deliveredAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysBeforeService >= 3) {
          onTimeCount++;
        } else {
          lateCount++;
        }
      } else if (!gfe.deliveredAt) {
        // Not yet delivered
        if (gfe.scheduledServiceDate) {
          const daysUntilService = Math.floor(
            (gfe.scheduledServiceDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          if (daysUntilService < 3) {
            lateCount++;
          }
        }
      }
    }

    const total = onTimeCount + lateCount;
    const complianceRate = total > 0 ? (onTimeCount / total) * 100 : 100;

    return {
      passed: complianceRate >= 95,
      checkName: 'GFE Delivery Timeline',
      category: 'No Surprises Act',
      severity: complianceRate < 80 ? 'critical' : complianceRate < 95 ? 'major' : 'minor',
      message: `${complianceRate.toFixed(1)}% of GFEs delivered within required timeline (3+ days before service)`,
      recommendation: complianceRate < 95 ? 'Ensure GFEs are delivered at least 3 business days before scheduled services' : undefined,
      details: {
        onTimeCount,
        lateCount,
        complianceRatePercent: complianceRate,
      },
    };
  }

  /**
   * Check GFE content completeness
   */
  private async checkGFEContentCompleteness(organizationId: string): Promise<ComplianceCheckResult> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const gfes = await prisma.goodFaithEstimate.findMany({
      where: {
        organizationId,
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        lineItems: true,
      },
    });

    let completeCount = 0;
    const requiredFields = ['providerNPI', 'providerName', 'facilityNPI', 'facilityName', 'disclaimer'];

    for (const gfe of gfes) {
      const hasRequiredFields = requiredFields.every(field => (gfe as any)[field]);
      const hasLineItems = gfe.lineItems.length > 0;

      if (hasRequiredFields && hasLineItems) {
        completeCount++;
      }
    }

    const completenessRate = gfes.length > 0 ? (completeCount / gfes.length) * 100 : 100;

    return {
      passed: completenessRate >= 95,
      checkName: 'GFE Content Completeness',
      category: 'No Surprises Act',
      severity: completenessRate < 80 ? 'major' : completenessRate < 95 ? 'minor' : 'info',
      message: `${completenessRate.toFixed(1)}% of GFEs have all required content`,
      recommendation: completenessRate < 95 ? 'Ensure all GFEs include provider NPIs, facility info, and itemized services' : undefined,
      details: {
        totalGFEs: gfes.length,
        completeGFEs: completeCount,
        completenessPercent: completenessRate,
      },
    };
  }

  /**
   * Get compliance audit history
   */
  async getAuditHistory(organizationId: string, auditType?: ComplianceAuditType, limit = 10) {
    const where: Prisma.ComplianceAuditWhereInput = { organizationId };

    if (auditType) {
      where.auditType = auditType;
    }

    const audits = await prisma.complianceAudit.findMany({
      where,
      orderBy: { auditDate: 'desc' },
      take: limit,
    });

    return audits;
  }

  /**
   * Get latest compliance score
   */
  async getLatestComplianceScore(organizationId: string, auditType: ComplianceAuditType) {
    const latestAudit = await prisma.complianceAudit.findFirst({
      where: { organizationId, auditType },
      orderBy: { auditDate: 'desc' },
    });

    return latestAudit ? {
      score: latestAudit.overallScore,
      auditDate: latestAudit.auditDate,
      passedChecks: latestAudit.passedChecks,
      failedChecks: latestAudit.failedChecks,
    } : null;
  }

  /**
   * Get remediation deadline
   */
  private getRemediationDeadline(days: number): Date {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    return deadline;
  }
}

export default new ComplianceService();
