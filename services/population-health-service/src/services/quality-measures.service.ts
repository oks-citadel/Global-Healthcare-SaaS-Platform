import { PrismaClient, MeasureType, MeasureCategory, ComplianceStatus } from '../generated/client';

const prisma = new PrismaClient();

export interface QualityMeasureInput {
  measureId: string;
  name: string;
  description?: string;
  measureType: MeasureType;
  category: MeasureCategory;
  steward?: string;
  domain?: string;
  fhirMeasureId?: string;
  fhirVersion?: string;
  numeratorCriteria?: Record<string, any>;
  denominatorCriteria?: Record<string, any>;
  exclusionCriteria?: Record<string, any>;
  targetRate?: number;
  reportingYear?: number;
}

export interface MeasurePerformance {
  measureId: string;
  measureName: string;
  numerator: number;
  denominator: number;
  exclusions: number;
  performanceRate: number;
  targetRate: number | null;
  gap: number | null;
  starRating: number | null;
}

// HEDIS measure definitions (simplified)
const HEDIS_MEASURES = {
  'HEDIS-BCS': {
    name: 'Breast Cancer Screening',
    domain: 'Prevention',
    description: 'Percentage of women 50-74 years who had a mammogram',
    numeratorCriteria: { procedure: 'mammography', ageRange: { min: 50, max: 74 }, gender: 'female' },
    denominatorCriteria: { ageRange: { min: 50, max: 74 }, gender: 'female' },
  },
  'HEDIS-CDC-A1C': {
    name: 'Comprehensive Diabetes Care - HbA1c Testing',
    domain: 'Chronic Disease Management',
    description: 'Percentage of diabetic patients with HbA1c test',
    numeratorCriteria: { labTest: 'HbA1c', condition: 'diabetes' },
    denominatorCriteria: { condition: 'diabetes', ageRange: { min: 18, max: 75 } },
  },
  'HEDIS-CBP': {
    name: 'Controlling High Blood Pressure',
    domain: 'Chronic Disease Management',
    description: 'Percentage of hypertensive patients with BP < 140/90',
    numeratorCriteria: { condition: 'hypertension', bpControl: { systolic: 140, diastolic: 90 } },
    denominatorCriteria: { condition: 'hypertension', ageRange: { min: 18, max: 85 } },
  },
  'HEDIS-COL': {
    name: 'Colorectal Cancer Screening',
    domain: 'Prevention',
    description: 'Percentage of adults 45-75 with colorectal screening',
    numeratorCriteria: { procedure: ['colonoscopy', 'FIT', 'sigmoidoscopy'], ageRange: { min: 45, max: 75 } },
    denominatorCriteria: { ageRange: { min: 45, max: 75 } },
  },
  'HEDIS-OMW': {
    name: 'Osteoporosis Management in Women Who Had a Fracture',
    domain: 'Chronic Disease Management',
    description: 'Women 67+ with fracture who had bone mineral density test or osteoporosis medication',
  },
  'HEDIS-SPR': {
    name: 'Statin Therapy for Patients with Cardiovascular Disease',
    domain: 'Chronic Disease Management',
    description: 'Percentage of patients with ASCVD on high-intensity statin',
  },
};

// CMS Star Rating thresholds
const STAR_THRESHOLDS = {
  5: 90,
  4: 80,
  3: 70,
  2: 60,
  1: 0,
};

export class QualityMeasuresService {
  // Create a new quality measure
  async createQualityMeasure(data: QualityMeasureInput) {
    return await prisma.qualityMeasure.create({
      data: {
        measureId: data.measureId,
        name: data.name,
        description: data.description,
        measureType: data.measureType,
        category: data.category,
        steward: data.steward,
        domain: data.domain,
        fhirMeasureId: data.fhirMeasureId,
        fhirVersion: data.fhirVersion,
        numeratorCriteria: data.numeratorCriteria,
        denominatorCriteria: data.denominatorCriteria,
        exclusionCriteria: data.exclusionCriteria,
        targetRate: data.targetRate,
        reportingYear: data.reportingYear,
      },
    });
  }

  // Get all quality measures
  async getQualityMeasures(filters: {
    category?: MeasureCategory;
    measureType?: MeasureType;
    reportingYear?: number;
    isActive?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters.category) where.category = filters.category;
    if (filters.measureType) where.measureType = filters.measureType;
    if (filters.reportingYear) where.reportingYear = filters.reportingYear;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { measureId: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.qualityMeasure.findMany({
      where,
      orderBy: [{ category: 'asc' }, { measureId: 'asc' }],
    });
  }

  // Get quality measure by ID
  async getQualityMeasureById(id: string) {
    return await prisma.qualityMeasure.findUnique({ where: { id } });
  }

  // Get quality measure by measure ID (e.g., "HEDIS-BCS")
  async getQualityMeasureByMeasureId(measureId: string) {
    return await prisma.qualityMeasure.findUnique({ where: { measureId } });
  }

  // Calculate population quality measure performance
  async calculatePopulationPerformance(
    populationId: string,
    qualityMeasureId: string,
    measurePeriod: string
  ): Promise<MeasurePerformance | null> {
    const measure = await prisma.qualityMeasure.findUnique({
      where: { id: qualityMeasureId },
    });

    if (!measure) return null;

    // Get patient measures for this population and measure
    const patientMeasures = await prisma.patientQualityMeasure.findMany({
      where: {
        qualityMeasureId,
        measurePeriod,
        // Would need to join with population members in real implementation
      },
    });

    const numerator = patientMeasures.filter((pm) => pm.inNumerator).length;
    const denominator = patientMeasures.filter((pm) => pm.inDenominator).length;
    const exclusions = patientMeasures.filter((pm) => pm.isExcluded).length;

    const effectiveDenominator = denominator - exclusions;
    const performanceRate = effectiveDenominator > 0 ? (numerator / effectiveDenominator) * 100 : 0;

    const starRating = this.calculateStarRating(performanceRate);

    // Update or create population quality measure
    await prisma.populationQualityMeasure.upsert({
      where: {
        populationId_qualityMeasureId_measurePeriod: {
          populationId,
          qualityMeasureId,
          measurePeriod,
        },
      },
      create: {
        populationId,
        qualityMeasureId,
        measurePeriod,
        numerator,
        denominator,
        exclusions,
        performanceRate,
        starRating,
      },
      update: {
        numerator,
        denominator,
        exclusions,
        performanceRate,
        starRating,
        calculatedAt: new Date(),
      },
    });

    return {
      measureId: measure.measureId,
      measureName: measure.name,
      numerator,
      denominator,
      exclusions,
      performanceRate,
      targetRate: measure.targetRate,
      gap: measure.targetRate ? measure.targetRate - performanceRate : null,
      starRating,
    };
  }

  // Calculate star rating from performance rate
  private calculateStarRating(performanceRate: number): number {
    if (performanceRate >= STAR_THRESHOLDS[5]) return 5;
    if (performanceRate >= STAR_THRESHOLDS[4]) return 4;
    if (performanceRate >= STAR_THRESHOLDS[3]) return 3;
    if (performanceRate >= STAR_THRESHOLDS[2]) return 2;
    return 1;
  }

  // Get population quality scorecard
  async getPopulationScorecard(populationId: string, measurePeriod: string) {
    const populationMeasures = await prisma.populationQualityMeasure.findMany({
      where: { populationId, measurePeriod },
      include: {
        qualityMeasure: true,
      },
      orderBy: { qualityMeasure: { domain: 'asc' } },
    });

    const byDomain = new Map<string, any[]>();
    populationMeasures.forEach((pm) => {
      const domain = pm.qualityMeasure.domain || 'Other';
      if (!byDomain.has(domain)) {
        byDomain.set(domain, []);
      }
      byDomain.get(domain)!.push({
        measureId: pm.qualityMeasure.measureId,
        measureName: pm.qualityMeasure.name,
        category: pm.qualityMeasure.category,
        numerator: pm.numerator,
        denominator: pm.denominator,
        exclusions: pm.exclusions,
        performanceRate: pm.performanceRate,
        targetRate: pm.qualityMeasure.targetRate,
        starRating: pm.starRating,
        benchmarkPercentile: pm.benchmarkPercentile,
      });
    });

    // Calculate overall metrics
    const totalMeasures = populationMeasures.length;
    const avgPerformance =
      totalMeasures > 0
        ? populationMeasures.reduce((sum, pm) => sum + (pm.performanceRate || 0), 0) / totalMeasures
        : 0;
    const avgStarRating =
      totalMeasures > 0
        ? populationMeasures.reduce((sum, pm) => sum + (pm.starRating || 0), 0) / totalMeasures
        : 0;

    return {
      populationId,
      measurePeriod,
      summary: {
        totalMeasures,
        averagePerformance: Math.round(avgPerformance * 100) / 100,
        averageStarRating: Math.round(avgStarRating * 10) / 10,
        measuresAt5Stars: populationMeasures.filter((pm) => pm.starRating === 5).length,
        measuresBelow3Stars: populationMeasures.filter((pm) => (pm.starRating || 0) < 3).length,
      },
      byDomain: Object.fromEntries(byDomain),
    };
  }

  // Track patient quality measure status
  async updatePatientMeasure(
    patientId: string,
    qualityMeasureId: string,
    measurePeriod: string,
    data: {
      inDenominator?: boolean;
      inNumerator?: boolean;
      isExcluded?: boolean;
      exclusionReason?: string;
      status?: ComplianceStatus;
      dueDate?: Date;
      completedDate?: Date;
      evidenceRef?: string;
      notes?: string;
      fhirPatientRef?: string;
    }
  ) {
    return await prisma.patientQualityMeasure.upsert({
      where: {
        patientId_qualityMeasureId_measurePeriod: {
          patientId,
          qualityMeasureId,
          measurePeriod,
        },
      },
      create: {
        patientId,
        qualityMeasureId,
        measurePeriod,
        fhirPatientRef: data.fhirPatientRef,
        inDenominator: data.inDenominator || false,
        inNumerator: data.inNumerator || false,
        isExcluded: data.isExcluded || false,
        exclusionReason: data.exclusionReason,
        status: data.status || 'pending',
        dueDate: data.dueDate,
        completedDate: data.completedDate,
        evidenceRef: data.evidenceRef,
        notes: data.notes,
      },
      update: data,
    });
  }

  // Get patient quality measures
  async getPatientMeasures(patientId: string, measurePeriod?: string) {
    const where: any = { patientId };
    if (measurePeriod) where.measurePeriod = measurePeriod;

    return await prisma.patientQualityMeasure.findMany({
      where,
      include: { qualityMeasure: true },
      orderBy: { qualityMeasure: { domain: 'asc' } },
    });
  }

  // Identify care gaps for quality measures
  async identifyCareGaps(populationId: string, measurePeriod: string) {
    const measures = await prisma.populationQualityMeasure.findMany({
      where: { populationId, measurePeriod },
      include: { qualityMeasure: true },
    });

    const careGaps = [];

    for (const measure of measures) {
      // Find patients in denominator but not in numerator
      const gapPatients = await prisma.patientQualityMeasure.findMany({
        where: {
          qualityMeasureId: measure.qualityMeasureId,
          measurePeriod,
          inDenominator: true,
          inNumerator: false,
          isExcluded: false,
        },
        select: { patientId: true, dueDate: true },
      });

      if (gapPatients.length > 0) {
        careGaps.push({
          measureId: measure.qualityMeasure.measureId,
          measureName: measure.qualityMeasure.name,
          domain: measure.qualityMeasure.domain,
          gapCount: gapPatients.length,
          patients: gapPatients.slice(0, 100), // Limit for API response
          potentialImpact:
            measure.denominator > 0
              ? ((gapPatients.length / measure.denominator) * 100).toFixed(1)
              : '0',
        });
      }
    }

    return careGaps.sort((a, b) => b.gapCount - a.gapCount);
  }

  // Seed HEDIS measures
  async seedHedisMeasures() {
    const measures = Object.entries(HEDIS_MEASURES).map(([measureId, data]) => ({
      measureId,
      name: data.name,
      description: data.description || null,
      measureType: 'process' as MeasureType,
      category: 'hedis' as MeasureCategory,
      steward: 'NCQA',
      domain: data.domain || null,
      numeratorCriteria: (data as any).numeratorCriteria || null,
      denominatorCriteria: (data as any).denominatorCriteria || null,
      targetRate: 80,
      reportingYear: new Date().getFullYear(),
    }));

    for (const measure of measures) {
      await prisma.qualityMeasure.upsert({
        where: { measureId: measure.measureId },
        create: measure,
        update: measure,
      });
    }

    return measures.length;
  }

  // Generate FHIR R4 Measure resource
  toFhirMeasure(measure: any) {
    return {
      resourceType: 'Measure',
      id: measure.fhirMeasureId || measure.id,
      meta: {
        lastUpdated: measure.updatedAt.toISOString(),
      },
      url: `urn:measure:${measure.measureId}`,
      identifier: [
        {
          system: 'urn:measure-id',
          value: measure.measureId,
        },
      ],
      version: measure.fhirVersion || '1.0',
      name: measure.measureId.replace(/[^a-zA-Z0-9]/g, ''),
      title: measure.name,
      status: measure.isActive ? 'active' : 'retired',
      description: measure.description,
      scoring: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/measure-scoring',
            code: 'proportion',
            display: 'Proportion',
          },
        ],
      },
      type: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/measure-type',
              code: measure.measureType,
              display: measure.measureType,
            },
          ],
        },
      ],
      group: [
        {
          population: [
            {
              code: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/measure-population',
                    code: 'numerator',
                  },
                ],
              },
              criteria: {
                language: 'text/cql',
                expression: JSON.stringify(measure.numeratorCriteria),
              },
            },
            {
              code: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/measure-population',
                    code: 'denominator',
                  },
                ],
              },
              criteria: {
                language: 'text/cql',
                expression: JSON.stringify(measure.denominatorCriteria),
              },
            },
            {
              code: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/measure-population',
                    code: 'denominator-exclusion',
                  },
                ],
              },
              criteria: {
                language: 'text/cql',
                expression: JSON.stringify(measure.exclusionCriteria),
              },
            },
          ],
        },
      ],
    };
  }

  // Generate FHIR R4 MeasureReport resource
  toFhirMeasureReport(populationMeasure: any, measure: any, population: any) {
    return {
      resourceType: 'MeasureReport',
      id: populationMeasure.id,
      meta: {
        lastUpdated: populationMeasure.updatedAt.toISOString(),
      },
      status: 'complete',
      type: 'summary',
      measure: `Measure/${measure.fhirMeasureId || measure.id}`,
      subject: {
        reference: `Group/${population.fhirGroupId || population.id}`,
        display: population.name,
      },
      date: populationMeasure.calculatedAt.toISOString(),
      period: {
        start: `${populationMeasure.measurePeriod}-01-01`,
        end: `${populationMeasure.measurePeriod}-12-31`,
      },
      group: [
        {
          population: [
            {
              code: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/measure-population',
                    code: 'numerator',
                  },
                ],
              },
              count: populationMeasure.numerator,
            },
            {
              code: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/measure-population',
                    code: 'denominator',
                  },
                ],
              },
              count: populationMeasure.denominator,
            },
            {
              code: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/measure-population',
                    code: 'denominator-exclusion',
                  },
                ],
              },
              count: populationMeasure.exclusions,
            },
          ],
          measureScore: {
            value: populationMeasure.performanceRate,
            unit: '%',
            system: 'http://unitsofmeasure.org',
            code: '%',
          },
        },
      ],
      extension: populationMeasure.starRating
        ? [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/measurereport-star-rating',
              valueInteger: populationMeasure.starRating,
            },
          ]
        : undefined,
    };
  }
}

export default new QualityMeasuresService();
