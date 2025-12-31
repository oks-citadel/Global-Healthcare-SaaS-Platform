import { PrismaClient } from '../generated/client';
import {
  DenialRiskPrediction,
  RiskFactor,
  ClaimModification,
  COMMON_CARC_CODES,
  DENIAL_CATEGORY_CARC_MAPPING,
} from '../types';

const prisma = new PrismaClient();

interface ClaimData {
  claimId: string;
  patientId: string;
  providerId: string;
  payerId: string;
  procedureCode: string;
  procedureModifiers?: string[];
  diagnosisCodes: string[];
  billedAmount: number;
  placeOfService?: string;
  hasAuthorization?: boolean;
  authorizationNumber?: string;
  serviceDate?: Date;
}

interface HistoricalDenialData {
  payerId: string;
  procedureCode: string;
  carcCode: string;
  totalClaims: number;
  deniedClaims: number;
  denialRate: number;
}

export class DenialPredictionService {
  private readonly riskWeights = {
    historicalDenialRate: 0.25,
    payerBehavior: 0.20,
    procedureComplexity: 0.15,
    authorizationStatus: 0.15,
    codingAccuracy: 0.10,
    timingFactors: 0.08,
    documentationCompleteness: 0.07,
  };

  /**
   * Predict denial risk for a claim before submission
   */
  async predictDenialRisk(claimData: ClaimData): Promise<DenialRiskPrediction> {
    const riskFactors: RiskFactor[] = [];

    // 1. Historical denial rate analysis
    const historicalRisk = await this.analyzeHistoricalDenialRate(claimData);
    riskFactors.push(historicalRisk);

    // 2. Payer behavior analysis
    const payerRisk = await this.analyzePayerBehavior(claimData);
    riskFactors.push(payerRisk);

    // 3. Procedure complexity analysis
    const procedureRisk = this.analyzeProcedureComplexity(claimData);
    riskFactors.push(procedureRisk);

    // 4. Authorization status check
    const authRisk = this.analyzeAuthorizationStatus(claimData);
    riskFactors.push(authRisk);

    // 5. Coding accuracy analysis
    const codingRisk = await this.analyzeCodingAccuracy(claimData);
    riskFactors.push(codingRisk);

    // 6. Timing factors
    const timingRisk = this.analyzeTimingFactors(claimData);
    riskFactors.push(timingRisk);

    // 7. Documentation completeness
    const docRisk = this.analyzeDocumentation(claimData);
    riskFactors.push(docRisk);

    // Calculate overall risk score
    const overallRiskScore = this.calculateOverallRiskScore(riskFactors);
    const riskLevel = this.determineRiskLevel(overallRiskScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(riskFactors, claimData);

    // Suggest claim modifications
    const suggestedModifications = this.suggestModifications(riskFactors, claimData);

    // Calculate denial probability
    const predictedDenialProbability = overallRiskScore / 100;

    // Store risk assessment
    await this.storeRiskAssessment(claimData, overallRiskScore, riskLevel, riskFactors, recommendations);

    return {
      claimId: claimData.claimId,
      overallRiskScore,
      riskLevel,
      riskFactors,
      recommendations,
      predictedDenialProbability,
      suggestedModifications,
    };
  }

  /**
   * Analyze historical denial rates for similar claims
   */
  private async analyzeHistoricalDenialRate(claimData: ClaimData): Promise<RiskFactor> {
    const patterns = await prisma.denialPattern.findMany({
      where: {
        OR: [
          { payerId: claimData.payerId, procedureCode: claimData.procedureCode },
          { payerId: claimData.payerId },
          { procedureCode: claimData.procedureCode },
        ],
      },
      orderBy: { periodEnd: 'desc' },
      take: 5,
    });

    let denialRate = 0;
    if (patterns.length > 0) {
      // Weight more recent patterns higher
      const weights = [0.4, 0.25, 0.15, 0.12, 0.08];
      denialRate = patterns.reduce((sum, pattern, index) => {
        const weight = weights[index] || 0.05;
        return sum + pattern.denialRate * weight;
      }, 0);
    }

    const score = Math.min(denialRate * 100, 100);

    return {
      factor: 'Historical Denial Rate',
      score,
      weight: this.riskWeights.historicalDenialRate,
      description: `Historical denial rate for this payer/procedure combination is ${(denialRate * 100).toFixed(1)}%`,
      category: 'historical',
    };
  }

  /**
   * Analyze payer-specific behavior patterns
   */
  private async analyzePayerBehavior(claimData: ClaimData): Promise<RiskFactor> {
    const recentDenials = await prisma.denial.groupBy({
      by: ['carcCode'],
      where: {
        payerId: claimData.payerId,
        denialDate: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
        },
      },
      _count: true,
      orderBy: {
        _count: {
          carcCode: 'desc',
        },
      },
      take: 5,
    });

    // Check if this payer has high denial volume
    const totalDenials = recentDenials.reduce((sum, d) => sum + d._count, 0);
    const score = Math.min((totalDenials / 100) * 20, 80); // Scale based on denial volume

    const topReasons = recentDenials.map(d => COMMON_CARC_CODES[d.carcCode] || d.carcCode).join(', ');

    return {
      factor: 'Payer Behavior',
      score,
      weight: this.riskWeights.payerBehavior,
      description: `Payer has ${totalDenials} denials in last 90 days. Top reasons: ${topReasons || 'N/A'}`,
      category: 'payer',
    };
  }

  /**
   * Analyze procedure complexity and common issues
   */
  private analyzeProcedureComplexity(claimData: ClaimData): RiskFactor {
    const { procedureCode, procedureModifiers = [] } = claimData;

    let score = 0;
    const issues: string[] = [];

    // High-cost procedures are more likely to be scrutinized
    if (claimData.billedAmount > 10000) {
      score += 20;
      issues.push('High-cost procedure may face additional scrutiny');
    }

    // Procedures requiring modifiers
    const modifierRequiredProcedures = ['59', '76', '77', '78', '79'];
    if (procedureCode.startsWith('9') && procedureModifiers.length === 0) {
      score += 15;
      issues.push('E/M code may require modifier for same-day procedures');
    }

    // Multiple modifiers can indicate complexity
    if (procedureModifiers.length > 2) {
      score += 10;
      issues.push('Multiple modifiers may require additional documentation');
    }

    // Certain procedure prefixes are higher risk
    if (procedureCode.startsWith('0') || procedureCode.length > 5) {
      score += 15;
      issues.push('Unlisted or complex procedure code requires detailed documentation');
    }

    return {
      factor: 'Procedure Complexity',
      score: Math.min(score, 100),
      weight: this.riskWeights.procedureComplexity,
      description: issues.join('; ') || 'Standard procedure complexity',
      category: 'procedure',
    };
  }

  /**
   * Check authorization status
   */
  private analyzeAuthorizationStatus(claimData: ClaimData): RiskFactor {
    let score = 0;
    let description = '';

    if (!claimData.hasAuthorization) {
      // Check if procedure typically requires auth
      const authRequiredPrefixes = ['27', '29', '43', '47', '49', '60', '62', '63'];
      const requiresAuth = authRequiredPrefixes.some(prefix =>
        claimData.procedureCode.startsWith(prefix)
      );

      if (requiresAuth) {
        score = 80;
        description = 'Procedure likely requires prior authorization which is missing';
      } else {
        score = 20;
        description = 'No authorization on file, but may not be required';
      }
    } else if (claimData.authorizationNumber) {
      score = 5;
      description = 'Authorization on file';
    }

    return {
      factor: 'Authorization Status',
      score,
      weight: this.riskWeights.authorizationStatus,
      description,
      category: 'authorization',
    };
  }

  /**
   * Analyze coding accuracy
   */
  private async analyzeCodingAccuracy(claimData: ClaimData): Promise<RiskFactor> {
    const { procedureCode, diagnosisCodes, placeOfService } = claimData;
    let score = 0;
    const issues: string[] = [];

    // Check for common coding mismatches
    // This would typically involve a more comprehensive coding rules engine

    // Check diagnosis code format (ICD-10)
    for (const dx of diagnosisCodes) {
      if (!dx.match(/^[A-Z]\d{2}\.?\d{0,4}$/)) {
        score += 15;
        issues.push(`Invalid ICD-10 format: ${dx}`);
      }
    }

    // Check procedure code format (CPT)
    if (!procedureCode.match(/^\d{5}$/)) {
      if (!procedureCode.match(/^[A-Z]\d{4}$/)) { // HCPCS format
        score += 20;
        issues.push('Invalid procedure code format');
      }
    }

    // Check for diagnosis-procedure mismatch patterns from historical data
    const similarDenials = await prisma.denial.count({
      where: {
        procedureCode,
        carcCode: { in: ['4', '5', '6'] }, // Coding-related CARC codes
        denialDate: {
          gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (similarDenials > 5) {
      score += 25;
      issues.push('Historical coding issues detected for this procedure');
    }

    return {
      factor: 'Coding Accuracy',
      score: Math.min(score, 100),
      weight: this.riskWeights.codingAccuracy,
      description: issues.join('; ') || 'No coding issues detected',
      category: 'coding',
    };
  }

  /**
   * Analyze timing factors
   */
  private analyzeTimingFactors(claimData: ClaimData): RiskFactor {
    let score = 0;
    const issues: string[] = [];

    if (claimData.serviceDate) {
      const daysSinceService = Math.floor(
        (Date.now() - claimData.serviceDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      // Timely filing risk
      if (daysSinceService > 300) {
        score = 90;
        issues.push('Approaching timely filing deadline');
      } else if (daysSinceService > 180) {
        score = 40;
        issues.push('Service date is over 6 months ago');
      } else if (daysSinceService > 90) {
        score = 15;
        issues.push('Service date is over 3 months ago');
      }

      // End of year claims
      const serviceMonth = claimData.serviceDate.getMonth();
      if (serviceMonth === 11 || serviceMonth === 0) {
        score += 10;
        issues.push('Year-end claims may have eligibility changes');
      }
    }

    return {
      factor: 'Timing Factors',
      score: Math.min(score, 100),
      weight: this.riskWeights.timingFactors,
      description: issues.join('; ') || 'No timing concerns',
      category: 'timing',
    };
  }

  /**
   * Analyze documentation completeness
   */
  private analyzeDocumentation(claimData: ClaimData): RiskFactor {
    let score = 0;
    const issues: string[] = [];

    // Check for minimum required fields
    if (!claimData.diagnosisCodes || claimData.diagnosisCodes.length === 0) {
      score += 40;
      issues.push('Missing diagnosis codes');
    }

    if (!claimData.placeOfService) {
      score += 15;
      issues.push('Missing place of service');
    }

    // For high-cost procedures, documentation is more critical
    if (claimData.billedAmount > 5000 && !claimData.hasAuthorization) {
      score += 20;
      issues.push('High-cost procedure without supporting authorization');
    }

    return {
      factor: 'Documentation Completeness',
      score: Math.min(score, 100),
      weight: this.riskWeights.documentationCompleteness,
      description: issues.join('; ') || 'Documentation appears complete',
      category: 'documentation',
    };
  }

  /**
   * Calculate weighted overall risk score
   */
  private calculateOverallRiskScore(riskFactors: RiskFactor[]): number {
    const weightedScore = riskFactors.reduce((sum, factor) => {
      return sum + (factor.score * factor.weight);
    }, 0);

    return Math.round(weightedScore);
  }

  /**
   * Determine risk level based on score
   */
  private determineRiskLevel(score: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (score <= 25) return 'low';
    if (score <= 50) return 'moderate';
    if (score <= 75) return 'high';
    return 'critical';
  }

  /**
   * Generate recommendations based on risk factors
   */
  private generateRecommendations(riskFactors: RiskFactor[], claimData: ClaimData): string[] {
    const recommendations: string[] = [];

    for (const factor of riskFactors) {
      if (factor.score > 30) {
        switch (factor.category) {
          case 'authorization':
            recommendations.push('Obtain prior authorization before submission');
            recommendations.push('Verify authorization covers the specific procedure and date of service');
            break;
          case 'coding':
            recommendations.push('Review diagnosis-procedure code linkage');
            recommendations.push('Verify modifier usage is appropriate');
            break;
          case 'documentation':
            recommendations.push('Ensure medical necessity documentation is complete');
            recommendations.push('Attach supporting clinical notes');
            break;
          case 'timing':
            recommendations.push('Submit claim immediately to avoid timely filing issues');
            break;
          case 'payer':
            recommendations.push('Review payer-specific requirements before submission');
            recommendations.push('Consider pre-submission inquiry for high-value claims');
            break;
          case 'procedure':
            recommendations.push('Include detailed procedure notes for complex services');
            recommendations.push('Consider operative report attachment');
            break;
        }
      }
    }

    // Remove duplicates
    return [...new Set(recommendations)];
  }

  /**
   * Suggest claim modifications to reduce denial risk
   */
  private suggestModifications(
    riskFactors: RiskFactor[],
    claimData: ClaimData
  ): ClaimModification[] {
    const modifications: ClaimModification[] = [];

    for (const factor of riskFactors) {
      if (factor.score > 40 && factor.category === 'coding') {
        // Suggest modifier additions if missing
        if (!claimData.procedureModifiers || claimData.procedureModifiers.length === 0) {
          modifications.push({
            field: 'modifiers',
            currentValue: 'None',
            suggestedValue: 'Review for applicable modifiers (25, 59, etc.)',
            reason: 'Modifiers may be required to indicate distinct services',
          });
        }
      }

      if (factor.score > 50 && factor.category === 'authorization') {
        modifications.push({
          field: 'priorAuthorization',
          currentValue: 'Not present',
          suggestedValue: 'Obtain authorization before submission',
          reason: 'High likelihood of denial without prior authorization',
        });
      }
    }

    return modifications;
  }

  /**
   * Store risk assessment in database
   */
  private async storeRiskAssessment(
    claimData: ClaimData,
    overallRiskScore: number,
    riskLevel: string,
    riskFactors: RiskFactor[],
    recommendations: string[]
  ): Promise<void> {
    await prisma.claimRiskAssessment.upsert({
      where: { claimId: claimData.claimId },
      update: {
        overallRiskScore,
        riskLevel: riskLevel as any,
        riskFactors: riskFactors as any,
        recommendations,
        assessmentDate: new Date(),
      },
      create: {
        claimId: claimData.claimId,
        patientId: claimData.patientId,
        providerId: claimData.providerId,
        payerId: claimData.payerId,
        procedureCode: claimData.procedureCode,
        diagnosisCodes: claimData.diagnosisCodes,
        billedAmount: claimData.billedAmount,
        overallRiskScore,
        riskLevel: riskLevel as any,
        riskFactors: riskFactors as any,
        recommendations,
      },
    });
  }

  /**
   * Get denial root cause analysis
   */
  async analyzeRootCause(denialId: string): Promise<{
    primaryCause: string;
    secondaryCauses: string[];
    carcAnalysis: { code: string; description: string; category: string }[];
    suggestedActions: string[];
  }> {
    const denial = await prisma.denial.findUnique({
      where: { id: denialId },
    });

    if (!denial) {
      throw new Error('Denial not found');
    }

    // Analyze CARC code
    const carcDescription = COMMON_CARC_CODES[denial.carcCode] || 'Unknown reason';

    // Determine category from CARC
    let category = 'other';
    for (const [cat, codes] of Object.entries(DENIAL_CATEGORY_CARC_MAPPING)) {
      if (codes.includes(denial.carcCode)) {
        category = cat;
        break;
      }
    }

    // Analyze additional RARC codes
    const rarcAnalysis = denial.rarcCodes.map(code => ({
      code,
      description: `RARC ${code}`, // Would have a lookup table in production
      category: 'supplemental',
    }));

    // Generate suggested actions based on category
    const suggestedActions = this.getSuggestedActionsForCategory(category, denial.carcCode);

    return {
      primaryCause: carcDescription,
      secondaryCauses: denial.rarcCodes.map(r => `RARC ${r}`),
      carcAnalysis: [
        { code: denial.carcCode, description: carcDescription, category },
        ...rarcAnalysis,
      ],
      suggestedActions,
    };
  }

  /**
   * Get suggested actions for a denial category
   */
  private getSuggestedActionsForCategory(category: string, carcCode: string): string[] {
    const actions: Record<string, string[]> = {
      prior_authorization: [
        'Obtain retroactive authorization if available',
        'Submit peer-to-peer review request',
        'Include medical necessity documentation in appeal',
      ],
      medical_necessity: [
        'Compile supporting clinical documentation',
        'Request peer-to-peer review with payer medical director',
        'Include published clinical guidelines supporting treatment',
      ],
      coding_error: [
        'Review and correct procedure/diagnosis code linkage',
        'Verify modifier usage against payer guidelines',
        'Resubmit with corrected codes if applicable',
      ],
      duplicate_claim: [
        'Verify if original claim was paid',
        'Provide proof of different service if not duplicate',
        'Submit adjustment request if duplicate was underpaid',
      ],
      timely_filing: [
        'Request exception with proof of original submission date',
        'Provide documentation of payer-caused delays',
        'Submit to state insurance commissioner if appropriate',
      ],
      eligibility: [
        'Verify patient eligibility for date of service',
        'Check for coordination of benefits issues',
        'Submit to correct payer if identified',
      ],
      bundling: [
        'Review unbundling rules and modifier requirements',
        'Provide documentation of distinct services',
        'Appeal with modifier 59 if services are truly separate',
      ],
      documentation: [
        'Obtain and submit required documentation',
        'Include detailed clinical notes',
        'Attach operative reports or procedure notes',
      ],
    };

    return actions[category] || [
      'Review denial reason carefully',
      'Gather supporting documentation',
      'Submit appeal within filing deadline',
    ];
  }

  /**
   * Bulk predict denial risk for multiple claims
   */
  async bulkPredictRisk(claims: ClaimData[]): Promise<DenialRiskPrediction[]> {
    const predictions = await Promise.all(
      claims.map(claim => this.predictDenialRisk(claim))
    );
    return predictions;
  }
}

export default new DenialPredictionService();
