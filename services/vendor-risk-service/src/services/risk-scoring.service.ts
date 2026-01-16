import {
  PrismaClient,
  Vendor,
  VendorTier,
  RiskLevel,
  DataAccessLevel,
  CertificationStatus,
  ContractStatus,
  IncidentStatus,
  IncidentSeverity,
} from '../generated/client';

const prisma = new PrismaClient();

export interface RiskScoreBreakdown {
  totalScore: number;
  maxScore: number;
  riskLevel: RiskLevel;
  categories: {
    dataAccess: { score: number; maxScore: number; details: string[] };
    certifications: { score: number; maxScore: number; details: string[] };
    contracts: { score: number; maxScore: number; details: string[] };
    incidents: { score: number; maxScore: number; details: string[] };
    assessments: { score: number; maxScore: number; details: string[] };
    vendorTier: { score: number; maxScore: number; details: string[] };
  };
  recommendations: string[];
}

export interface RiskTrend {
  date: Date;
  score: number;
  riskLevel: RiskLevel;
}

export class RiskScoringService {
  private readonly MAX_SCORE = 100;

  // Weight factors for different risk categories
  private readonly WEIGHTS = {
    dataAccess: 25,
    certifications: 20,
    contracts: 15,
    incidents: 20,
    assessments: 15,
    vendorTier: 5,
  };

  async calculateRiskScore(vendorId: string): Promise<RiskScoreBreakdown> {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        certifications: true,
        contracts: true,
        incidents: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        questionnaires: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!vendor) {
      throw new Error(`Vendor not found: ${vendorId}`);
    }

    const breakdown: RiskScoreBreakdown = {
      totalScore: 0,
      maxScore: this.MAX_SCORE,
      riskLevel: RiskLevel.UNKNOWN,
      categories: {
        dataAccess: { score: 0, maxScore: this.WEIGHTS.dataAccess, details: [] },
        certifications: { score: 0, maxScore: this.WEIGHTS.certifications, details: [] },
        contracts: { score: 0, maxScore: this.WEIGHTS.contracts, details: [] },
        incidents: { score: 0, maxScore: this.WEIGHTS.incidents, details: [] },
        assessments: { score: 0, maxScore: this.WEIGHTS.assessments, details: [] },
        vendorTier: { score: 0, maxScore: this.WEIGHTS.vendorTier, details: [] },
      },
      recommendations: [],
    };

    // Calculate each category
    this.calculateDataAccessRisk(vendor, breakdown);
    this.calculateCertificationRisk(vendor, breakdown);
    this.calculateContractRisk(vendor, breakdown);
    this.calculateIncidentRisk(vendor, breakdown);
    this.calculateAssessmentRisk(vendor, breakdown);
    this.calculateTierRisk(vendor, breakdown);

    // Sum up total score (lower is better)
    breakdown.totalScore = Object.values(breakdown.categories).reduce(
      (sum, cat) => sum + cat.score,
      0
    );

    // Determine risk level based on score
    breakdown.riskLevel = this.determineRiskLevel(breakdown.totalScore);

    // Generate recommendations
    this.generateRecommendations(vendor, breakdown);

    return breakdown;
  }

  async updateVendorRiskScore(vendorId: string): Promise<Vendor> {
    const breakdown = await this.calculateRiskScore(vendorId);

    return prisma.vendor.update({
      where: { id: vendorId },
      data: {
        riskScore: breakdown.totalScore,
        riskLevel: breakdown.riskLevel,
        lastReviewDate: new Date(),
      },
    });
  }

  async recalculateAllVendorScores(): Promise<{ updated: number; errors: string[] }> {
    const vendors = await prisma.vendor.findMany({
      where: {
        status: {
          in: ['APPROVED', 'CONDITIONAL', 'IN_REVIEW'],
        },
      },
    });

    let updated = 0;
    const errors: string[] = [];

    for (const vendor of vendors) {
      try {
        await this.updateVendorRiskScore(vendor.id);
        updated++;
      } catch (error) {
        errors.push(`Failed to update vendor ${vendor.id}: ${(error as Error).message}`);
      }
    }

    return { updated, errors };
  }

  private calculateDataAccessRisk(vendor: Vendor, breakdown: RiskScoreBreakdown): void {
    let score = 0;
    const details: string[] = [];
    const maxScore = this.WEIGHTS.dataAccess;

    // PHI access adds significant risk
    if (vendor.phiAccess) {
      score += 10;
      details.push('Has access to Protected Health Information (PHI)');
    }

    // PII access adds risk
    if (vendor.piiAccess) {
      score += 5;
      details.push('Has access to Personally Identifiable Information (PII)');
    }

    // Data access level
    const accessLevelScores: Record<DataAccessLevel, number> = {
      NONE: 0,
      MINIMAL: 2,
      LIMITED: 4,
      MODERATE: 6,
      EXTENSIVE: 8,
      FULL: 10,
    };
    score += accessLevelScores[vendor.dataAccessLevel] || 0;
    details.push(`Data access level: ${vendor.dataAccessLevel}`);

    breakdown.categories.dataAccess = {
      score: Math.min(score, maxScore),
      maxScore,
      details,
    };
  }

  private calculateCertificationRisk(
    vendor: Vendor & { certifications: { status: CertificationStatus; expirationDate: Date | null }[] },
    breakdown: RiskScoreBreakdown
  ): void {
    let score = 0;
    const details: string[] = [];
    const maxScore = this.WEIGHTS.certifications;

    const validCerts = vendor.certifications.filter((c) => c.status === CertificationStatus.VALID);
    const expiredCerts = vendor.certifications.filter((c) => c.status === CertificationStatus.EXPIRED);

    // No certifications is high risk
    if (vendor.certifications.length === 0) {
      score = maxScore;
      details.push('No security certifications on file');
    } else {
      // Reduce score for each valid certification
      const certReduction = Math.min(validCerts.length * 4, maxScore);
      score = maxScore - certReduction;
      details.push(`${validCerts.length} valid certification(s)`);

      // Add risk for expired certifications
      if (expiredCerts.length > 0) {
        score += Math.min(expiredCerts.length * 3, 10);
        details.push(`${expiredCerts.length} expired certification(s)`);
      }

      // Check for soon-to-expire certifications
      const soonToExpire = validCerts.filter((c) => {
        if (!c.expirationDate) return false;
        const daysUntilExpiry = Math.floor(
          (c.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 90;
      });

      if (soonToExpire.length > 0) {
        score += 3;
        details.push(`${soonToExpire.length} certification(s) expiring within 90 days`);
      }
    }

    breakdown.categories.certifications = {
      score: Math.min(Math.max(score, 0), maxScore),
      maxScore,
      details,
    };
  }

  private calculateContractRisk(
    vendor: Vendor & { contracts: { status: ContractStatus; type: string; expirationDate: Date | null }[] },
    breakdown: RiskScoreBreakdown
  ): void {
    let score = 0;
    const details: string[] = [];
    const maxScore = this.WEIGHTS.contracts;

    const activeContracts = vendor.contracts.filter((c) => c.status === ContractStatus.ACTIVE);
    const hasBAA = activeContracts.some((c) => c.type === 'BAA');
    const hasNDA = activeContracts.some((c) => c.type === 'NDA');

    // No active contracts is very high risk
    if (activeContracts.length === 0) {
      score = maxScore;
      details.push('No active contracts');
    } else {
      // PHI access without BAA is critical
      if (vendor.phiAccess && !hasBAA) {
        score += 10;
        details.push('CRITICAL: PHI access without active BAA');
      } else if (hasBAA) {
        details.push('Active BAA in place');
      }

      // Check for NDA
      if (!hasNDA) {
        score += 3;
        details.push('No NDA on file');
      } else {
        details.push('Active NDA in place');
      }

      // Check for expiring contracts
      const expiringContracts = activeContracts.filter((c) => {
        if (!c.expirationDate) return false;
        const daysUntilExpiry = Math.floor(
          (c.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 60;
      });

      if (expiringContracts.length > 0) {
        score += 2;
        details.push(`${expiringContracts.length} contract(s) expiring within 60 days`);
      }
    }

    breakdown.categories.contracts = {
      score: Math.min(Math.max(score, 0), maxScore),
      maxScore,
      details,
    };
  }

  private calculateIncidentRisk(
    vendor: Vendor & { incidents: { status: IncidentStatus; severity: IncidentSeverity; phiInvolved: boolean }[] },
    breakdown: RiskScoreBreakdown
  ): void {
    let score = 0;
    const details: string[] = [];
    const maxScore = this.WEIGHTS.incidents;

    const openIncidents = vendor.incidents.filter(
      (i) => !['CLOSED', 'REMEDIATED'].includes(i.status)
    );

    if (openIncidents.length === 0) {
      score = 0;
      details.push('No open incidents');
    } else {
      // Score based on severity
      const severityScores: Record<IncidentSeverity, number> = {
        CRITICAL: 8,
        HIGH: 5,
        MEDIUM: 3,
        LOW: 1,
      };

      for (const incident of openIncidents) {
        score += severityScores[incident.severity] || 0;
        if (incident.phiInvolved) {
          score += 5;
          details.push('Incident involving PHI');
        }
      }

      details.push(`${openIncidents.length} open incident(s)`);

      const criticalCount = openIncidents.filter((i) => i.severity === 'CRITICAL').length;
      if (criticalCount > 0) {
        details.push(`${criticalCount} CRITICAL severity incident(s)`);
      }
    }

    breakdown.categories.incidents = {
      score: Math.min(score, maxScore),
      maxScore,
      details,
    };
  }

  private calculateAssessmentRisk(
    vendor: Vendor & { assessments: { status: string; passed: boolean | null; completedDate: Date | null }[] },
    breakdown: RiskScoreBreakdown
  ): void {
    let score = 0;
    const details: string[] = [];
    const maxScore = this.WEIGHTS.assessments;

    const recentAssessments = vendor.assessments;

    if (recentAssessments.length === 0) {
      score = maxScore;
      details.push('No security assessments on record');
    } else {
      const latestAssessment = recentAssessments[0];

      // Check if latest assessment passed
      if (latestAssessment.passed === false) {
        score += 10;
        details.push('Most recent assessment failed');
      } else if (latestAssessment.passed === true) {
        details.push('Most recent assessment passed');
      } else {
        score += 5;
        details.push('Most recent assessment pending review');
      }

      // Check age of assessment
      if (latestAssessment.completedDate) {
        const daysSinceAssessment = Math.floor(
          (Date.now() - latestAssessment.completedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceAssessment > 365) {
          score += 5;
          details.push('Assessment is over 1 year old');
        } else if (daysSinceAssessment > 180) {
          score += 2;
          details.push('Assessment is over 6 months old');
        }
      }
    }

    breakdown.categories.assessments = {
      score: Math.min(score, maxScore),
      maxScore,
      details,
    };
  }

  private calculateTierRisk(vendor: Vendor, breakdown: RiskScoreBreakdown): void {
    const maxScore = this.WEIGHTS.vendorTier;
    const tierScores: Record<VendorTier, number> = {
      TIER_1: 5, // Critical vendors need more scrutiny
      TIER_2: 3,
      TIER_3: 1,
      TIER_4: 0,
    };

    const score = tierScores[vendor.tier] || 0;
    const details = [`Vendor tier: ${vendor.tier}`];

    breakdown.categories.vendorTier = {
      score,
      maxScore,
      details,
    };
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 70) return RiskLevel.CRITICAL;
    if (score >= 50) return RiskLevel.HIGH;
    if (score >= 30) return RiskLevel.MEDIUM;
    if (score >= 15) return RiskLevel.LOW;
    return RiskLevel.MINIMAL;
  }

  private generateRecommendations(vendor: Vendor, breakdown: RiskScoreBreakdown): void {
    const recommendations: string[] = [];

    // Data access recommendations
    if (vendor.phiAccess && breakdown.categories.contracts.details.some((d) => d.includes('without active BAA'))) {
      recommendations.push('URGENT: Execute a Business Associate Agreement (BAA) immediately');
    }

    // Certification recommendations
    if (breakdown.categories.certifications.score > 10) {
      recommendations.push('Request current SOC 2 Type II or HITRUST certification');
    }
    if (breakdown.categories.certifications.details.some((d) => d.includes('expiring'))) {
      recommendations.push('Follow up on certification renewals before expiration');
    }

    // Assessment recommendations
    if (breakdown.categories.assessments.score > 10) {
      recommendations.push('Initiate a comprehensive security assessment');
    }

    // Incident recommendations
    if (breakdown.categories.incidents.score > 0) {
      recommendations.push('Review and follow up on open vendor incidents');
    }

    // Contract recommendations
    if (breakdown.categories.contracts.details.some((d) => d.includes('No NDA'))) {
      recommendations.push('Execute a Non-Disclosure Agreement (NDA)');
    }
    if (breakdown.categories.contracts.details.some((d) => d.includes('expiring'))) {
      recommendations.push('Initiate contract renewal discussions');
    }

    breakdown.recommendations = recommendations;
  }

  async getRiskTrends(vendorId: string, months: number = 12): Promise<RiskTrend[]> {
    // In a real implementation, you would query historical risk scores
    // For now, we return the current snapshot
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new Error(`Vendor not found: ${vendorId}`);
    }

    return [
      {
        date: new Date(),
        score: vendor.riskScore,
        riskLevel: vendor.riskLevel,
      },
    ];
  }
}

export default new RiskScoringService();
