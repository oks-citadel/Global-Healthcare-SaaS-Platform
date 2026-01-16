import { PrismaClient, RiskTier, ScoreType } from '../generated/client';

const prisma = new PrismaClient();

export interface RiskScoreInput {
  patientId: string;
  fhirPatientRef?: string;
  modelName: string;
  modelVersion?: string;
  scoreType: ScoreType;
  rawScore: number;
  riskFactors?: Record<string, any>[];
  clinicalFactors?: Record<string, any>;
  socialFactors?: Record<string, any>;
  predictedCost?: number;
  predictedEvents?: Record<string, any>;
}

export interface RiskScoreFilters {
  patientId?: string;
  modelName?: string;
  scoreType?: ScoreType;
  riskTier?: RiskTier;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface RiskStratificationResult {
  patientId: string;
  overallScore: number;
  tier: RiskTier;
  components: {
    clinical: number;
    utilization: number;
    social: number;
  };
  topRiskFactors: string[];
  interventionRecommendations: string[];
}

// Risk tier thresholds
const RISK_TIER_THRESHOLDS = {
  low: { min: 0, max: 25 },
  moderate: { min: 25, max: 50 },
  high: { min: 50, max: 75 },
  very_high: { min: 75, max: 90 },
  critical: { min: 90, max: 100 },
};

// HCC condition weights (simplified)
const HCC_WEIGHTS: Record<string, number> = {
  diabetes_complicated: 0.318,
  diabetes_uncomplicated: 0.105,
  chf: 0.323,
  copd: 0.328,
  ckd_stage4: 0.289,
  ckd_stage5: 0.533,
  cancer_active: 0.963,
  depression: 0.309,
  dementia: 0.508,
  stroke_recent: 0.550,
  ami_recent: 0.262,
};

export class RiskStratificationService {
  // Calculate risk tier from normalized score
  private calculateRiskTier(normalizedScore: number): RiskTier {
    if (normalizedScore < RISK_TIER_THRESHOLDS.low.max) return 'low';
    if (normalizedScore < RISK_TIER_THRESHOLDS.moderate.max) return 'moderate';
    if (normalizedScore < RISK_TIER_THRESHOLDS.high.max) return 'high';
    if (normalizedScore < RISK_TIER_THRESHOLDS.very_high.max) return 'very_high';
    return 'critical';
  }

  // Normalize score to 0-100 scale
  private normalizeScore(rawScore: number, scoreType: ScoreType): number {
    // Different normalization based on score type
    switch (scoreType) {
      case 'hcc_raf':
        // HCC RAF scores typically range from 0.5 to 5+
        return Math.min(100, (rawScore / 3) * 100);
      case 'hospitalization_risk':
      case 'readmission_risk':
      case 'ed_utilization':
      case 'mortality_risk':
        // Probability scores (0-1)
        return rawScore * 100;
      case 'cost_prediction':
        // Cost scores normalized against population average
        return Math.min(100, (rawScore / 50000) * 100);
      default:
        return Math.min(100, rawScore);
    }
  }

  // Calculate percentile within population
  private async calculatePercentile(patientId: string, normalizedScore: number, modelName: string): Promise<number> {
    const lowerCount = await prisma.riskScore.count({
      where: {
        modelName,
        isActive: true,
        normalizedScore: { lt: normalizedScore },
        patientId: { not: patientId },
      },
    });

    const totalCount = await prisma.riskScore.count({
      where: { modelName, isActive: true },
    });

    if (totalCount === 0) return 50;
    return Math.round((lowerCount / totalCount) * 100);
  }

  // Create a new risk score
  async createRiskScore(data: RiskScoreInput) {
    const normalizedScore = this.normalizeScore(data.rawScore, data.scoreType);
    const riskTier = this.calculateRiskTier(normalizedScore);
    const percentile = await this.calculatePercentile(data.patientId, normalizedScore, data.modelName);

    // Deactivate previous scores for the same patient/model
    await prisma.riskScore.updateMany({
      where: {
        patientId: data.patientId,
        modelName: data.modelName,
        isActive: true,
      },
      data: { isActive: false },
    });

    const riskScore = await prisma.riskScore.create({
      data: {
        patientId: data.patientId,
        fhirPatientRef: data.fhirPatientRef,
        modelName: data.modelName,
        modelVersion: data.modelVersion,
        scoreType: data.scoreType,
        rawScore: data.rawScore,
        normalizedScore,
        percentile,
        riskTier,
        riskFactors: data.riskFactors,
        clinicalFactors: data.clinicalFactors,
        socialFactors: data.socialFactors,
        predictedCost: data.predictedCost,
        predictedEvents: data.predictedEvents,
        isActive: true,
      },
    });

    // Update population member risk score if exists
    await prisma.populationMember.updateMany({
      where: { patientId: data.patientId },
      data: {
        currentRiskScore: normalizedScore,
        riskTier,
      },
    });

    return riskScore;
  }

  // Get risk scores with filters
  async getRiskScores(filters: RiskScoreFilters) {
    const where: any = {};

    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.modelName) where.modelName = filters.modelName;
    if (filters.scoreType) where.scoreType = filters.scoreType;
    if (filters.riskTier) where.riskTier = filters.riskTier;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const [scores, total] = await Promise.all([
      prisma.riskScore.findMany({
        where,
        orderBy: { effectiveDate: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.riskScore.count({ where }),
    ]);

    return { data: scores, total };
  }

  // Get risk score by ID
  async getRiskScoreById(id: string) {
    return await prisma.riskScore.findUnique({ where: { id } });
  }

  // Get patient's current risk profile
  async getPatientRiskProfile(patientId: string) {
    const scores = await prisma.riskScore.findMany({
      where: { patientId, isActive: true },
      orderBy: { effectiveDate: 'desc' },
    });

    if (scores.length === 0) {
      return null;
    }

    // Aggregate scores
    const profile = {
      patientId,
      scores: scores.map((s) => ({
        modelName: s.modelName,
        scoreType: s.scoreType,
        rawScore: s.rawScore,
        normalizedScore: s.normalizedScore,
        riskTier: s.riskTier,
        percentile: s.percentile,
        effectiveDate: s.effectiveDate,
      })),
      overallRiskTier: this.aggregateRiskTier(scores),
      highestRiskScore: Math.max(...scores.map((s) => s.normalizedScore || 0)),
      predictedAnnualCost: scores.reduce((sum, s) => sum + (s.predictedCost || 0), 0),
      topRiskFactors: this.aggregateRiskFactors(scores),
    };

    return profile;
  }

  // Calculate HCC Risk Adjustment Factor
  async calculateHccScore(patientId: string, conditions: string[]): Promise<RiskScoreInput> {
    let rafScore = 0.0;
    const riskFactors: Record<string, any>[] = [];

    // Base demographic score (simplified - in reality would use age/sex tables)
    const baseScore = 0.5;
    rafScore += baseScore;

    // Add condition weights
    conditions.forEach((condition) => {
      const weight = HCC_WEIGHTS[condition.toLowerCase().replace(/\s+/g, '_')] || 0;
      if (weight > 0) {
        rafScore += weight;
        riskFactors.push({
          factor: condition,
          weight,
          category: 'clinical',
        });
      }
    });

    // Calculate predicted cost (average Medicare cost * RAF)
    const avgMedicareCost = 12000;
    const predictedCost = avgMedicareCost * rafScore;

    return {
      patientId,
      modelName: 'CMS-HCC',
      modelVersion: 'V24',
      scoreType: 'hcc_raf',
      rawScore: rafScore,
      riskFactors,
      clinicalFactors: { conditions },
      predictedCost,
    };
  }

  // Calculate hospitalization risk score
  async calculateHospitalizationRisk(patientId: string, data: {
    age: number;
    conditions: string[];
    priorHospitalizations: number;
    priorEdVisits: number;
    medicationCount: number;
    hasCaregiver: boolean;
  }): Promise<RiskScoreInput> {
    let riskScore = 0;
    const riskFactors: Record<string, any>[] = [];

    // Age factor
    if (data.age >= 80) {
      riskScore += 0.15;
      riskFactors.push({ factor: 'Age 80+', weight: 0.15, category: 'demographic' });
    } else if (data.age >= 65) {
      riskScore += 0.08;
      riskFactors.push({ factor: 'Age 65-79', weight: 0.08, category: 'demographic' });
    }

    // Prior utilization
    if (data.priorHospitalizations > 0) {
      const hospWeight = Math.min(0.25, data.priorHospitalizations * 0.1);
      riskScore += hospWeight;
      riskFactors.push({ factor: 'Prior hospitalizations', weight: hospWeight, category: 'utilization' });
    }

    if (data.priorEdVisits > 2) {
      const edWeight = Math.min(0.15, (data.priorEdVisits - 2) * 0.05);
      riskScore += edWeight;
      riskFactors.push({ factor: 'Frequent ED visits', weight: edWeight, category: 'utilization' });
    }

    // Polypharmacy
    if (data.medicationCount > 10) {
      riskScore += 0.12;
      riskFactors.push({ factor: 'Polypharmacy (10+ meds)', weight: 0.12, category: 'clinical' });
    } else if (data.medicationCount > 5) {
      riskScore += 0.05;
      riskFactors.push({ factor: 'Multiple medications', weight: 0.05, category: 'clinical' });
    }

    // Chronic conditions
    const highRiskConditions = ['chf', 'copd', 'ckd', 'diabetes_complicated'];
    data.conditions.forEach((condition) => {
      if (highRiskConditions.includes(condition.toLowerCase())) {
        riskScore += 0.1;
        riskFactors.push({ factor: condition, weight: 0.1, category: 'clinical' });
      }
    });

    // Social factors
    if (!data.hasCaregiver) {
      riskScore += 0.05;
      riskFactors.push({ factor: 'No caregiver support', weight: 0.05, category: 'social' });
    }

    // Cap at 1.0
    riskScore = Math.min(1.0, riskScore);

    return {
      patientId,
      modelName: 'Hospitalization-Risk',
      modelVersion: '1.0',
      scoreType: 'hospitalization_risk',
      rawScore: riskScore,
      riskFactors,
      clinicalFactors: { conditions: data.conditions, medicationCount: data.medicationCount },
      socialFactors: { hasCaregiver: data.hasCaregiver },
      predictedEvents: { hospitalizationProbability: riskScore },
    };
  }

  // Perform cohort-level risk stratification
  async stratifyCohort(cohortId: string): Promise<{ tier: RiskTier; count: number }[]> {
    const members = await prisma.cohortMember.findMany({
      where: { cohortId, status: 'active' },
      select: { patientId: true, riskScore: true },
    });

    const stratification: Record<RiskTier, number> = {
      low: 0,
      moderate: 0,
      high: 0,
      very_high: 0,
      critical: 0,
    };

    members.forEach((member) => {
      const tier = this.calculateRiskTier(member.riskScore || 0);
      stratification[tier]++;
    });

    return Object.entries(stratification).map(([tier, count]) => ({
      tier: tier as RiskTier,
      count,
    }));
  }

  // Get risk distribution for a population
  async getPopulationRiskDistribution(populationId: string) {
    const distribution = await prisma.populationMember.groupBy({
      by: ['riskTier'],
      where: { populationId, status: 'active' },
      _count: { riskTier: true },
      _avg: { currentRiskScore: true },
    });

    return distribution.map((d) => ({
      tier: d.riskTier,
      count: d._count.riskTier,
      averageScore: d._avg.currentRiskScore,
    }));
  }

  // Get high-risk patients for intervention
  async getHighRiskPatients(options: {
    populationId?: string;
    minRiskScore?: number;
    riskTiers?: RiskTier[];
    limit?: number;
  }) {
    const where: any = {
      status: 'active',
    };

    if (options.populationId) {
      where.populationId = options.populationId;
    }

    if (options.minRiskScore) {
      where.currentRiskScore = { gte: options.minRiskScore };
    }

    if (options.riskTiers && options.riskTiers.length > 0) {
      where.riskTier = { in: options.riskTiers };
    }

    return await prisma.populationMember.findMany({
      where,
      orderBy: { currentRiskScore: 'desc' },
      take: options.limit || 100,
    });
  }

  // Aggregate risk tier from multiple scores
  private aggregateRiskTier(scores: any[]): RiskTier {
    const tiers = scores.map((s) => s.riskTier);
    const tierPriority: Record<RiskTier, number> = {
      critical: 5,
      very_high: 4,
      high: 3,
      moderate: 2,
      low: 1,
    };

    let maxPriority = 0;
    let maxTier: RiskTier = 'low';

    tiers.forEach((tier) => {
      if (tier && tierPriority[tier] > maxPriority) {
        maxPriority = tierPriority[tier];
        maxTier = tier;
      }
    });

    return maxTier;
  }

  // Aggregate risk factors from multiple scores
  private aggregateRiskFactors(scores: any[]): string[] {
    const factorMap = new Map<string, number>();

    scores.forEach((score) => {
      if (score.riskFactors && Array.isArray(score.riskFactors)) {
        score.riskFactors.forEach((rf: any) => {
          const current = factorMap.get(rf.factor) || 0;
          factorMap.set(rf.factor, current + (rf.weight || 0.1));
        });
      }
    });

    return [...factorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([factor]) => factor);
  }

  // Generate FHIR R4 RiskAssessment resource
  toFhirRiskAssessment(riskScore: any) {
    return {
      resourceType: 'RiskAssessment',
      id: riskScore.id,
      meta: {
        lastUpdated: riskScore.updatedAt.toISOString(),
      },
      status: 'final',
      subject: {
        reference: riskScore.fhirPatientRef || `Patient/${riskScore.patientId}`,
      },
      occurrenceDateTime: riskScore.effectiveDate.toISOString(),
      method: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/risk-assessment-method',
            code: riskScore.modelName,
            display: riskScore.modelName,
          },
        ],
      },
      prediction: [
        {
          outcome: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: this.getOutcomeCode(riskScore.scoreType),
                display: riskScore.scoreType,
              },
            ],
          },
          probabilityDecimal: riskScore.normalizedScore / 100,
          qualitativeRisk: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/risk-probability',
                code: riskScore.riskTier,
                display: riskScore.riskTier,
              },
            ],
          },
        },
      ],
      note: riskScore.riskFactors?.map((rf: any) => ({
        text: `${rf.factor}: ${rf.weight}`,
      })),
    };
  }

  private getOutcomeCode(scoreType: ScoreType): string {
    const codes: Record<ScoreType, string> = {
      hcc_raf: '182992009',
      cdps: '182992009',
      hospitalization_risk: '32485007',
      ed_utilization: '50849002',
      readmission_risk: '32485007',
      mortality_risk: '419620001',
      cost_prediction: '224187001',
      composite: '182992009',
      custom: '182992009',
    };
    return codes[scoreType] || '182992009';
  }
}

export default new RiskStratificationService();
