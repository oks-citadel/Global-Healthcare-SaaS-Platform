import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import populationService from '../services/population.service';
import riskStratificationService from '../services/risk-stratification.service';
import qualityMeasuresService from '../services/quality-measures.service';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createReportSchema = z.object({
  populationId: z.string().uuid().optional(),
  reportType: z.enum([
    'population_dashboard',
    'quality_scorecard',
    'risk_stratification',
    'care_gap_analysis',
    'sdoh_assessment',
    'disease_surveillance',
    'health_equity',
    'trend_analysis',
    'predictive_model',
    'custom',
  ]),
  title: z.string().min(1),
  description: z.string().optional(),
  parameters: z.record(z.any()).optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
});

const sdohAssessmentSchema = z.object({
  patientId: z.string().uuid().optional(),
  populationId: z.string().uuid().optional(),
  category: z.enum([
    'food_insecurity',
    'housing_instability',
    'transportation',
    'utilities',
    'interpersonal_safety',
    'education',
    'employment',
    'financial_strain',
    'social_isolation',
    'health_literacy',
    'stress',
    'other',
  ]),
  factor: z.string(),
  value: z.string().optional(),
  severity: z.enum(['none', 'mild', 'moderate', 'severe']).optional(),
  assessmentTool: z.string().optional(),
  screeningScore: z.number().optional(),
  isPositiveScreen: z.boolean().optional(),
  interventionNeeded: z.boolean().optional(),
  interventionType: z.string().optional(),
  fhirPatientRef: z.string().optional(),
});

const diseaseRegistrySchema = z.object({
  conditionCode: z.string(),
  conditionName: z.string(),
  populationId: z.string().uuid().optional(),
  prevalenceCount: z.number().min(0),
  prevalenceRate: z.number().optional(),
  incidenceCount: z.number().min(0).optional(),
  incidenceRate: z.number().optional(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  ageDistribution: z.record(z.any()).optional(),
  genderDistribution: z.record(z.any()).optional(),
  raceDistribution: z.record(z.any()).optional(),
});

// GET /analytics/dashboard/:populationId - Get population analytics dashboard
router.get('/dashboard/:populationId', requireUser, async (req: UserRequest, res) => {
  try {
    const populationId = req.params.populationId;
    const measurePeriod = (req.query.measurePeriod as string) || new Date().getFullYear().toString();

    const [population, metrics, riskDistribution, qualityScorecard] = await Promise.all([
      populationService.getPopulationById(populationId),
      populationService.getPopulationMetrics(populationId),
      riskStratificationService.getPopulationRiskDistribution(populationId),
      qualityMeasuresService.getPopulationScorecard(populationId, measurePeriod),
    ]);

    if (!population) {
      res.status(404).json({ error: 'Not Found', message: 'Population not found' });
      return;
    }

    // Get care gap summary
    const careGapSummary = await prisma.careGap.groupBy({
      by: ['status'],
      where: {
        cohort: { populationId },
      },
      _count: { status: true },
    });

    // Get SDOH summary
    const sdohSummary = await prisma.sdohFactor.groupBy({
      by: ['category'],
      where: { populationId, isPositiveScreen: true },
      _count: { category: true },
    });

    const dashboard = {
      population: {
        id: population.id,
        name: population.name,
        memberCount: population.memberCount,
        status: population.status,
      },
      metrics,
      riskDistribution,
      qualityScorecard: qualityScorecard.summary,
      careGaps: careGapSummary.reduce((acc, cg) => {
        acc[cg.status] = cg._count.status;
        return acc;
      }, {} as Record<string, number>),
      sdohConcerns: sdohSummary.reduce((acc, s) => {
        acc[s.category] = s._count.category;
        return acc;
      }, {} as Record<string, number>),
      generatedAt: new Date().toISOString(),
    };

    res.json({ data: dashboard });
  } catch (error) {
    console.error('Error generating dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate dashboard' });
  }
});

// GET /analytics/reports - List analytics reports
router.get('/reports', requireUser, async (req: UserRequest, res) => {
  try {
    const where: any = {};

    if (req.query.populationId) {
      where.populationId = req.query.populationId;
    }

    if (req.query.reportType) {
      where.reportType = req.query.reportType;
    }

    const reports = await prisma.analyticsReport.findMany({
      where,
      include: {
        population: {
          select: { id: true, name: true },
        },
      },
      orderBy: { generatedAt: 'desc' },
      take: parseInt(req.query.limit as string) || 50,
      skip: parseInt(req.query.offset as string) || 0,
    });

    const total = await prisma.analyticsReport.count({ where });

    res.json({ data: reports, total });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch reports' });
  }
});

// POST /analytics/reports - Create a new analytics report
router.post('/reports', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const validated = createReportSchema.parse(req.body);

    // Generate report data based on type
    let reportData: Record<string, any> = {};

    if (validated.populationId) {
      switch (validated.reportType) {
        case 'quality_scorecard':
          const period = validated.parameters?.measurePeriod || new Date().getFullYear().toString();
          reportData = await qualityMeasuresService.getPopulationScorecard(validated.populationId, period);
          break;
        case 'risk_stratification':
          reportData = {
            distribution: await riskStratificationService.getPopulationRiskDistribution(validated.populationId),
          };
          break;
        case 'care_gap_analysis':
          const measurePeriod = validated.parameters?.measurePeriod || new Date().getFullYear().toString();
          reportData = {
            careGaps: await qualityMeasuresService.identifyCareGaps(validated.populationId, measurePeriod),
          };
          break;
        case 'sdoh_assessment':
          reportData = {
            factors: await prisma.sdohFactor.groupBy({
              by: ['category', 'severity'],
              where: { populationId: validated.populationId },
              _count: { category: true },
            }),
          };
          break;
        case 'disease_surveillance':
          reportData = {
            prevalence: await populationService.getDiseasePrevalence(validated.populationId),
          };
          break;
        case 'health_equity':
          const eqPeriod = validated.parameters?.measurePeriod;
          reportData = {
            metrics: await populationService.getHealthEquityMetrics(validated.populationId, eqPeriod),
          };
          break;
        default:
          reportData = validated.parameters || {};
      }
    }

    const report = await prisma.analyticsReport.create({
      data: {
        populationId: validated.populationId,
        reportType: validated.reportType,
        title: validated.title,
        description: validated.description,
        parameters: validated.parameters,
        data: reportData,
        periodStart: validated.periodStart ? new Date(validated.periodStart) : undefined,
        periodEnd: validated.periodEnd ? new Date(validated.periodEnd) : undefined,
        generatedBy: req.user!.id,
      },
    });

    res.status(201).json({ data: report, message: 'Report generated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create report' });
  }
});

// GET /analytics/reports/:id - Get analytics report by ID
router.get('/reports/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const report = await prisma.analyticsReport.findUnique({
      where: { id: req.params.id },
      include: {
        population: true,
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Not Found', message: 'Report not found' });
      return;
    }

    res.json({ data: report });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch report' });
  }
});

// POST /analytics/sdoh - Create SDOH assessment
router.post('/sdoh', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = sdohAssessmentSchema.parse(req.body);

    const sdohFactor = await prisma.sdohFactor.create({
      data: {
        patientId: validated.patientId,
        populationId: validated.populationId,
        fhirPatientRef: validated.fhirPatientRef,
        category: validated.category,
        factor: validated.factor,
        value: validated.value,
        severity: validated.severity,
        assessmentTool: validated.assessmentTool,
        screeningScore: validated.screeningScore,
        isPositiveScreen: validated.isPositiveScreen || false,
        interventionNeeded: validated.interventionNeeded || false,
        interventionType: validated.interventionType,
      },
    });

    res.status(201).json({ data: sdohFactor, message: 'SDOH assessment recorded successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating SDOH assessment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create SDOH assessment' });
  }
});

// GET /analytics/sdoh/patient/:patientId - Get patient SDOH assessments
router.get('/sdoh/patient/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const factors = await prisma.sdohFactor.findMany({
      where: { patientId: req.params.patientId },
      orderBy: { assessmentDate: 'desc' },
    });

    // Group by category
    const byCategory = factors.reduce((acc, f) => {
      if (!acc[f.category]) {
        acc[f.category] = [];
      }
      acc[f.category].push(f);
      return acc;
    }, {} as Record<string, any[]>);

    res.json({
      data: factors,
      byCategory,
      positiveScreens: factors.filter((f) => f.isPositiveScreen).length,
      interventionsNeeded: factors.filter((f) => f.interventionNeeded).length,
    });
  } catch (error) {
    console.error('Error fetching SDOH assessments:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch SDOH assessments' });
  }
});

// POST /analytics/disease-registry - Create disease registry entry
router.post('/disease-registry', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const validated = diseaseRegistrySchema.parse(req.body);

    const registry = await prisma.diseaseRegistry.create({
      data: {
        conditionCode: validated.conditionCode,
        conditionName: validated.conditionName,
        populationId: validated.populationId,
        prevalenceCount: validated.prevalenceCount,
        prevalenceRate: validated.prevalenceRate,
        incidenceCount: validated.incidenceCount || 0,
        incidenceRate: validated.incidenceRate,
        periodStart: new Date(validated.periodStart),
        periodEnd: new Date(validated.periodEnd),
        ageDistribution: validated.ageDistribution,
        genderDistribution: validated.genderDistribution,
        raceDistribution: validated.raceDistribution,
      },
    });

    res.status(201).json({ data: registry, message: 'Disease registry entry created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating disease registry entry:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create disease registry entry' });
  }
});

// GET /analytics/disease-registry - Get disease registry
router.get('/disease-registry', requireUser, async (req: UserRequest, res) => {
  try {
    const where: any = {};

    if (req.query.populationId) {
      where.populationId = req.query.populationId;
    }

    if (req.query.conditionCode) {
      where.conditionCode = req.query.conditionCode;
    }

    const registry = await prisma.diseaseRegistry.findMany({
      where,
      orderBy: [{ periodStart: 'desc' }, { prevalenceRate: 'desc' }],
      take: parseInt(req.query.limit as string) || 50,
      skip: parseInt(req.query.offset as string) || 0,
    });

    res.json({ data: registry });
  } catch (error) {
    console.error('Error fetching disease registry:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch disease registry' });
  }
});

// POST /analytics/health-equity - Create health equity metric
router.post('/health-equity', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const metric = await prisma.healthEquityMetric.create({
      data: req.body,
    });

    res.status(201).json({ data: metric, message: 'Health equity metric created successfully' });
  } catch (error) {
    console.error('Error creating health equity metric:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create health equity metric' });
  }
});

// GET /analytics/health-equity - Get health equity metrics
router.get('/health-equity', requireUser, async (req: UserRequest, res) => {
  try {
    const where: any = {};

    if (req.query.populationId) {
      where.populationId = req.query.populationId;
    }

    if (req.query.measureType) {
      where.measureType = req.query.measureType;
    }

    if (req.query.stratificationDimension) {
      where.stratificationDimension = req.query.stratificationDimension;
    }

    if (req.query.measurePeriod) {
      where.measurePeriod = req.query.measurePeriod;
    }

    const metrics = await prisma.healthEquityMetric.findMany({
      where,
      orderBy: [{ disparityIndex: 'desc' }],
      take: parseInt(req.query.limit as string) || 100,
    });

    // Calculate disparity summary
    const disparitySummary = {
      totalMetrics: metrics.length,
      significantDisparities: metrics.filter((m) => Math.abs(m.disparityIndex || 0) > 0.1).length,
      byDimension: metrics.reduce((acc, m) => {
        if (!acc[m.stratificationDimension]) {
          acc[m.stratificationDimension] = { count: 0, avgDisparity: 0 };
        }
        acc[m.stratificationDimension].count++;
        acc[m.stratificationDimension].avgDisparity += m.disparityIndex || 0;
        return acc;
      }, {} as Record<string, { count: number; avgDisparity: number }>),
    };

    // Calculate averages
    Object.keys(disparitySummary.byDimension).forEach((dim) => {
      disparitySummary.byDimension[dim].avgDisparity /= disparitySummary.byDimension[dim].count;
    });

    res.json({ data: metrics, summary: disparitySummary });
  } catch (error) {
    console.error('Error fetching health equity metrics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch health equity metrics' });
  }
});

// GET /analytics/predictive-models - Get predictive models
router.get('/predictive-models', requireUser, async (req: UserRequest, res) => {
  try {
    const where: any = {};

    if (req.query.modelType) {
      where.modelType = req.query.modelType;
    }

    if (req.query.isActive !== undefined) {
      where.isActive = req.query.isActive === 'true';
    }

    const models = await prisma.predictiveModel.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: models });
  } catch (error) {
    console.error('Error fetching predictive models:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch predictive models' });
  }
});

// GET /analytics/audit-log - Get analytics audit log
router.get('/audit-log', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    const where: any = {};

    if (req.query.userId) {
      where.userId = req.query.userId;
    }

    if (req.query.action) {
      where.action = req.query.action;
    }

    if (req.query.resourceType) {
      where.resourceType = req.query.resourceType;
    }

    const logs = await prisma.analyticsAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(req.query.limit as string) || 100,
      skip: parseInt(req.query.offset as string) || 0,
    });

    res.json({ data: logs });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch audit log' });
  }
});

// GET /analytics/kpis - Get population health KPIs
router.get('/kpis', requireUser, async (req: UserRequest, res) => {
  try {
    const organizationId = req.user?.organizationId || (req.query.organizationId as string);

    // Aggregate KPIs across populations
    const populations = await prisma.population.findMany({
      where: { organizationId, status: 'active' },
      select: { id: true, memberCount: true },
    });

    const totalMembers = populations.reduce((sum, p) => sum + p.memberCount, 0);

    // Risk distribution across all populations
    const riskDistribution = await prisma.populationMember.groupBy({
      by: ['riskTier'],
      where: { status: 'active' },
      _count: { riskTier: true },
    });

    // Quality measure performance
    const currentYear = new Date().getFullYear().toString();
    const qualityPerformance = await prisma.populationQualityMeasure.aggregate({
      where: { measurePeriod: currentYear },
      _avg: { performanceRate: true, starRating: true },
    });

    // Care gap summary
    const careGapStats = await prisma.careGap.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // SDOH concerns
    const sdohStats = await prisma.sdohFactor.groupBy({
      by: ['category'],
      where: { isPositiveScreen: true },
      _count: { category: true },
    });

    const kpis = {
      populations: {
        total: populations.length,
        totalMembers,
      },
      riskDistribution: riskDistribution.reduce((acc, r) => {
        if (r.riskTier) acc[r.riskTier] = r._count.riskTier;
        return acc;
      }, {} as Record<string, number>),
      qualityPerformance: {
        averagePerformanceRate: qualityPerformance._avg.performanceRate || 0,
        averageStarRating: qualityPerformance._avg.starRating || 0,
      },
      careGaps: careGapStats.reduce((acc, cg) => {
        acc[cg.status] = cg._count.status;
        return acc;
      }, {} as Record<string, number>),
      sdohConcerns: sdohStats.reduce((acc, s) => {
        acc[s.category] = s._count.category;
        return acc;
      }, {} as Record<string, number>),
      generatedAt: new Date().toISOString(),
    };

    res.json({ data: kpis });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch KPIs' });
  }
});

export default router;
