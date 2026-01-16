import { PrismaClient, DefinitionType, PopulationStatus, MemberStatus, RiskTier } from '../generated/client';

const prisma = new PrismaClient();

export interface PopulationFilters {
  organizationId?: string;
  status?: PopulationStatus;
  definitionType?: DefinitionType;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreatePopulationInput {
  name: string;
  description?: string;
  organizationId: string;
  definitionType?: DefinitionType;
  criteria: Record<string, any>;
  fhirGroupId?: string;
  createdBy?: string;
}

export interface PopulationMetrics {
  totalMembers: number;
  activeMembers: number;
  riskDistribution: Record<string, number>;
  averageRiskScore: number | null;
  careGapsOpen: number;
  qualityMeasuresCount: number;
}

export class PopulationService {
  // Create a new population
  async createPopulation(data: CreatePopulationInput) {
    return await prisma.population.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId: data.organizationId,
        definitionType: data.definitionType || 'custom',
        criteria: data.criteria,
        fhirGroupId: data.fhirGroupId,
        createdBy: data.createdBy,
      },
    });
  }

  // Get all populations with filters
  async getPopulations(filters: PopulationFilters) {
    const where: any = {};

    if (filters.organizationId) {
      where.organizationId = filters.organizationId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.definitionType) {
      where.definitionType = filters.definitionType;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [populations, total] = await Promise.all([
      prisma.population.findMany({
        where,
        include: {
          cohorts: {
            select: { id: true, name: true, cohortType: true, memberCount: true },
          },
          _count: {
            select: {
              qualityMeasures: true,
              analytics: true,
              sdohFactors: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.population.count({ where }),
    ]);

    return { data: populations, total, limit: filters.limit || 50, offset: filters.offset || 0 };
  }

  // Get a single population by ID
  async getPopulationById(id: string) {
    return await prisma.population.findUnique({
      where: { id },
      include: {
        cohorts: true,
        qualityMeasures: {
          include: {
            qualityMeasure: true,
          },
        },
        analytics: {
          orderBy: { generatedAt: 'desc' },
          take: 5,
        },
        sdohFactors: true,
      },
    });
  }

  // Update a population
  async updatePopulation(id: string, data: Partial<CreatePopulationInput>) {
    return await prisma.population.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        definitionType: data.definitionType,
        criteria: data.criteria,
        fhirGroupId: data.fhirGroupId,
      },
    });
  }

  // Archive a population
  async archivePopulation(id: string) {
    return await prisma.population.update({
      where: { id },
      data: { status: 'archived' },
    });
  }

  // Add a member to a population
  async addMember(populationId: string, patientId: string, fhirPatientRef?: string) {
    const member = await prisma.populationMember.upsert({
      where: {
        populationId_patientId: { populationId, patientId },
      },
      create: {
        populationId,
        patientId,
        fhirPatientRef,
        status: 'active',
      },
      update: {
        status: 'active',
        disenrolledAt: null,
      },
    });

    // Update member count
    await this.updateMemberCount(populationId);

    return member;
  }

  // Remove a member from a population
  async removeMember(populationId: string, patientId: string) {
    const member = await prisma.populationMember.update({
      where: {
        populationId_patientId: { populationId, patientId },
      },
      data: {
        status: 'inactive',
        disenrolledAt: new Date(),
      },
    });

    // Update member count
    await this.updateMemberCount(populationId);

    return member;
  }

  // Get population members
  async getMembers(populationId: string, filters: { status?: MemberStatus; riskTier?: RiskTier; limit?: number; offset?: number }) {
    const where: any = { populationId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.riskTier) {
      where.riskTier = filters.riskTier;
    }

    const [members, total] = await Promise.all([
      prisma.populationMember.findMany({
        where,
        orderBy: { enrolledAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.populationMember.count({ where }),
    ]);

    return { data: members, total };
  }

  // Update member count for a population
  private async updateMemberCount(populationId: string) {
    const count = await prisma.populationMember.count({
      where: { populationId, status: 'active' },
    });

    await prisma.population.update({
      where: { id: populationId },
      data: { memberCount: count },
    });
  }

  // Get population metrics/summary
  async getPopulationMetrics(populationId: string): Promise<PopulationMetrics> {
    const [totalMembers, activeMembers, riskScores, careGaps, qualityMeasures] = await Promise.all([
      prisma.populationMember.count({ where: { populationId } }),
      prisma.populationMember.count({ where: { populationId, status: 'active' } }),
      prisma.populationMember.groupBy({
        by: ['riskTier'],
        where: { populationId, status: 'active', riskTier: { not: null } },
        _count: { riskTier: true },
      }),
      prisma.careGap.count({
        where: {
          cohort: { populationId },
          status: 'open',
        },
      }),
      prisma.populationQualityMeasure.count({ where: { populationId } }),
    ]);

    // Calculate risk distribution
    const riskDistribution: Record<string, number> = {};
    riskScores.forEach((rs) => {
      if (rs.riskTier) {
        riskDistribution[rs.riskTier] = rs._count.riskTier;
      }
    });

    // Calculate average risk score from members
    const avgRiskScore = await prisma.populationMember.aggregate({
      where: { populationId, status: 'active', currentRiskScore: { not: null } },
      _avg: { currentRiskScore: true },
    });

    return {
      totalMembers,
      activeMembers,
      riskDistribution,
      averageRiskScore: avgRiskScore._avg.currentRiskScore,
      careGapsOpen: careGaps,
      qualityMeasuresCount: qualityMeasures,
    };
  }

  // Get disease prevalence for a population
  async getDiseasePrevalence(populationId: string, periodStart?: Date, periodEnd?: Date) {
    const where: any = { populationId };

    if (periodStart) {
      where.periodStart = { gte: periodStart };
    }
    if (periodEnd) {
      where.periodEnd = { lte: periodEnd };
    }

    return await prisma.diseaseRegistry.findMany({
      where,
      orderBy: { prevalenceRate: 'desc' },
    });
  }

  // Get health equity metrics for a population
  async getHealthEquityMetrics(populationId: string, measurePeriod?: string) {
    const where: any = { populationId };

    if (measurePeriod) {
      where.measurePeriod = measurePeriod;
    }

    return await prisma.healthEquityMetric.findMany({
      where,
      orderBy: [
        { stratificationDimension: 'asc' },
        { disparityIndex: 'desc' },
      ],
    });
  }

  // Generate FHIR R4 Group resource from population
  toFhirGroup(population: any) {
    return {
      resourceType: 'Group',
      id: population.fhirGroupId || population.id,
      meta: {
        lastUpdated: population.updatedAt.toISOString(),
      },
      type: 'person',
      actual: true,
      code: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/group-type',
            code: 'person',
            display: 'Person',
          },
        ],
        text: population.definitionType,
      },
      name: population.name,
      quantity: population.memberCount,
      characteristic: this.criteriaToCharacteristics(population.criteria),
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/population-definition-type',
          valueCode: population.definitionType,
        },
      ],
    };
  }

  // Convert criteria to FHIR characteristics
  private criteriaToCharacteristics(criteria: Record<string, any>) {
    const characteristics: any[] = [];

    if (criteria.ageRange) {
      characteristics.push({
        code: {
          coding: [{ system: 'http://loinc.org', code: '30525-0', display: 'Age' }],
        },
        valueRange: {
          low: { value: criteria.ageRange.min, unit: 'years' },
          high: { value: criteria.ageRange.max, unit: 'years' },
        },
        exclude: false,
      });
    }

    if (criteria.conditions) {
      criteria.conditions.forEach((condition: string) => {
        characteristics.push({
          code: {
            coding: [{ system: 'http://snomed.info/sct', code: condition }],
          },
          valueBoolean: true,
          exclude: false,
        });
      });
    }

    if (criteria.gender) {
      characteristics.push({
        code: {
          coding: [{ system: 'http://loinc.org', code: '76689-9', display: 'Sex assigned at birth' }],
        },
        valueCodeableConcept: {
          coding: [{ system: 'http://hl7.org/fhir/administrative-gender', code: criteria.gender }],
        },
        exclude: false,
      });
    }

    return characteristics;
  }
}

export default new PopulationService();
