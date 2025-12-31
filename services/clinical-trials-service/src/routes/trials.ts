import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import trialRegistryService from '../services/trial-registry.service';

const router: ReturnType<typeof Router> = Router();

// Lazy load Prisma to handle missing generated client during initial setup
const getPrisma = async () => {
  const { PrismaClient } = await import('../generated/client');
  return new PrismaClient();
};

// Validation schemas
const searchTrialsSchema = z.object({
  conditions: z.array(z.string()).optional(),
  interventions: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  phase: z.array(z.string()).optional(),
  studyType: z.string().optional(),
  location: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    distance: z.number().optional(),
    lat: z.number().optional(),
    lon: z.number().optional(),
  }).optional(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  gender: z.string().optional(),
  healthyVolunteers: z.boolean().optional(),
  pageSize: z.number().min(1).max(100).optional(),
  pageToken: z.string().optional(),
});

const syncTrialSchema = z.object({
  nctId: z.string().regex(/^NCT\d{8}$/i, 'Invalid NCT ID format'),
});

const createTrialSchema = z.object({
  nctId: z.string().regex(/^NCT\d{8}$/i, 'Invalid NCT ID format'),
  title: z.string().min(1),
  officialTitle: z.string().optional(),
  briefSummary: z.string().optional(),
  status: z.enum([
    'not_yet_recruiting',
    'recruiting',
    'enrolling_by_invitation',
    'active_not_recruiting',
    'suspended',
    'terminated',
    'completed',
    'withdrawn',
    'unknown',
  ]),
  phase: z.enum([
    'early_phase_1',
    'phase_1',
    'phase_1_2',
    'phase_2',
    'phase_2_3',
    'phase_3',
    'phase_4',
    'not_applicable',
  ]).optional(),
  studyType: z.enum(['interventional', 'observational', 'expanded_access', 'patient_registry']).optional(),
  conditions: z.array(z.string()).optional(),
  healthyVolunteers: z.boolean().optional(),
  minimumAge: z.number().optional(),
  maximumAge: z.number().optional(),
  gender: z.string().optional(),
});

// GET /trials - List all trials from local database
router.get('/', async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const {
      status,
      phase,
      condition,
      limit = '50',
      offset = '0',
      search,
    } = req.query;

    const where: any = {};

    if (status) {
      where.status = status as string;
    }

    if (phase) {
      where.phase = phase as string;
    }

    if (condition) {
      where.conditions = {
        has: condition as string,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { nctId: { contains: search as string, mode: 'insensitive' } },
        { briefSummary: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [trials, total] = await Promise.all([
      prisma.clinicalTrial.findMany({
        where,
        include: {
          sites: {
            where: { isActive: true },
            select: {
              id: true,
              facilityName: true,
              city: true,
              state: true,
              country: true,
              status: true,
            },
          },
          _count: {
            select: {
              patientMatches: true,
              enrollments: true,
            },
          },
        },
        orderBy: { lastSyncedAt: 'desc' },
        take: parseInt(limit as string, 10),
        skip: parseInt(offset as string, 10),
      }),
      prisma.clinicalTrial.count({ where }),
    ]);

    await prisma.$disconnect();

    res.json({
      data: trials,
      pagination: {
        total,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        hasMore: parseInt(offset as string, 10) + trials.length < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching trials:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch trials' });
  }
});

// GET /trials/search/registry - Search ClinicalTrials.gov registry
router.get('/search/registry', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const queryParams: any = {};

    if (req.query.conditions) {
      queryParams.conditions = (req.query.conditions as string).split(',');
    }
    if (req.query.interventions) {
      queryParams.interventions = (req.query.interventions as string).split(',');
    }
    if (req.query.status) {
      queryParams.status = (req.query.status as string).split(',');
    }
    if (req.query.phase) {
      queryParams.phase = (req.query.phase as string).split(',');
    }
    if (req.query.studyType) {
      queryParams.studyType = req.query.studyType;
    }
    if (req.query.lat && req.query.lon && req.query.distance) {
      queryParams.location = {
        lat: parseFloat(req.query.lat as string),
        lon: parseFloat(req.query.lon as string),
        distance: parseInt(req.query.distance as string, 10),
      };
    }
    if (req.query.pageSize) {
      queryParams.pageSize = parseInt(req.query.pageSize as string, 10);
    }
    if (req.query.pageToken) {
      queryParams.pageToken = req.query.pageToken;
    }

    const results = await trialRegistryService.searchTrials(queryParams);

    res.json({
      data: results.studies,
      totalCount: results.totalCount,
      nextPageToken: results.nextPageToken,
    });
  } catch (error: any) {
    console.error('Error searching registry:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /trials/:id - Get trial by ID
router.get('/:id', async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const trial = await prisma.clinicalTrial.findUnique({
      where: { id },
      include: {
        sites: true,
        patientMatches: {
          select: {
            id: true,
            matchScore: true,
            eligibilityStatus: true,
            reviewStatus: true,
            createdAt: true,
          },
          orderBy: { matchScore: 'desc' },
          take: 10,
        },
        enrollments: {
          select: {
            id: true,
            status: true,
            enrollmentDate: true,
            site: {
              select: { facilityName: true, city: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    await prisma.$disconnect();

    if (!trial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    res.json({ data: trial });
  } catch (error: any) {
    console.error('Error fetching trial:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch trial' });
  }
});

// GET /trials/nct/:nctId - Get trial by NCT ID
router.get('/nct/:nctId', async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { nctId } = req.params;

    let trial = await prisma.clinicalTrial.findUnique({
      where: { nctId: nctId.toUpperCase() },
      include: {
        sites: true,
      },
    });

    await prisma.$disconnect();

    if (!trial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    res.json({ data: trial });
  } catch (error: any) {
    console.error('Error fetching trial:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch trial' });
  }
});

// POST /trials/sync - Sync a trial from ClinicalTrials.gov
router.post('/sync', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { nctId } = syncTrialSchema.parse(req.body);

    // Fetch from registry
    const registryData = await trialRegistryService.getTrialByNctId(nctId.toUpperCase());

    if (!registryData) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found in ClinicalTrials.gov' });
      return;
    }

    // Map to internal format
    const trialData = trialRegistryService.mapToInternalTrial(registryData);

    // Upsert trial
    const trial = await prisma.clinicalTrial.upsert({
      where: { nctId: trialData.nctId },
      update: trialData,
      create: trialData,
    });

    // Sync sites
    const sitesData = trialRegistryService.mapLocationsToSites(registryData, trial.id);

    for (const siteData of sitesData) {
      await prisma.trialSite.upsert({
        where: {
          trialId_facilityName_city: {
            trialId: trial.id,
            facilityName: siteData.facilityName,
            city: siteData.city,
          },
        },
        update: siteData,
        create: siteData,
      });
    }

    const updatedTrial = await prisma.clinicalTrial.findUnique({
      where: { id: trial.id },
      include: { sites: true },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedTrial,
      message: 'Trial synced successfully',
      sitesCount: sitesData.length,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error syncing trial:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /trials - Create a new trial manually
router.post('/', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const validatedData = createTrialSchema.parse(req.body);

    const trial = await prisma.clinicalTrial.create({
      data: {
        ...validatedData,
        conditions: validatedData.conditions || [],
      },
    });

    await prisma.$disconnect();

    res.status(201).json({
      data: trial,
      message: 'Trial created successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Conflict', message: 'A trial with this NCT ID already exists' });
      return;
    }
    console.error('Error creating trial:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create trial' });
  }
});

// PUT /trials/:id - Update a trial
router.put('/:id', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const existingTrial = await prisma.clinicalTrial.findUnique({ where: { id } });
    if (!existingTrial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    const updateSchema = createTrialSchema.partial();
    const validatedData = updateSchema.parse(req.body);

    const trial = await prisma.clinicalTrial.update({
      where: { id },
      data: validatedData,
      include: { sites: true },
    });

    await prisma.$disconnect();

    res.json({
      data: trial,
      message: 'Trial updated successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating trial:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update trial' });
  }
});

// DELETE /trials/:id - Delete a trial
router.delete('/:id', requireUser, requireRole('admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const existingTrial = await prisma.clinicalTrial.findUnique({ where: { id } });
    if (!existingTrial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    await prisma.clinicalTrial.delete({ where: { id } });
    await prisma.$disconnect();

    res.json({ message: 'Trial deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting trial:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete trial' });
  }
});

// GET /trials/:id/fhir - Get trial as FHIR ResearchStudy resource
router.get('/:id/fhir', async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const trial = await prisma.clinicalTrial.findUnique({
      where: { id },
    });

    await prisma.$disconnect();

    if (!trial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    if (trial.fhirResearchStudy) {
      res.json(trial.fhirResearchStudy);
    } else {
      // Generate FHIR resource on the fly
      res.status(404).json({
        error: 'Not Found',
        message: 'FHIR resource not available for this trial',
      });
    }
  } catch (error: any) {
    console.error('Error fetching FHIR resource:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch FHIR resource' });
  }
});

// GET /trials/:id/statistics - Get trial statistics
router.get('/:id/statistics', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const trial = await prisma.clinicalTrial.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            sites: true,
            patientMatches: true,
            enrollments: true,
          },
        },
        patientMatches: {
          select: { eligibilityStatus: true, matchScore: true },
        },
        enrollments: {
          select: { status: true },
        },
        sites: {
          select: { status: true, currentEnrollment: true, targetEnrollment: true },
        },
      },
    });

    await prisma.$disconnect();

    if (!trial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    // Calculate statistics
    const eligibilityBreakdown = trial.patientMatches.reduce((acc: any, match) => {
      acc[match.eligibilityStatus] = (acc[match.eligibilityStatus] || 0) + 1;
      return acc;
    }, {});

    const enrollmentBreakdown = trial.enrollments.reduce((acc: any, enrollment) => {
      acc[enrollment.status] = (acc[enrollment.status] || 0) + 1;
      return acc;
    }, {});

    const siteBreakdown = trial.sites.reduce((acc: any, site) => {
      acc[site.status] = (acc[site.status] || 0) + 1;
      return acc;
    }, {});

    const avgMatchScore = trial.patientMatches.length > 0
      ? Math.round(
          trial.patientMatches.reduce((sum, m) => sum + m.matchScore, 0) /
            trial.patientMatches.length
        )
      : 0;

    const totalEnrollment = trial.sites.reduce((sum, s) => sum + s.currentEnrollment, 0);
    const targetEnrollment = trial.sites.reduce((sum, s) => sum + (s.targetEnrollment || 0), 0);

    res.json({
      data: {
        trialId: id,
        nctId: trial.nctId,
        counts: trial._count,
        eligibilityBreakdown,
        enrollmentBreakdown,
        siteBreakdown,
        avgMatchScore,
        enrollmentProgress: {
          current: totalEnrollment,
          target: targetEnrollment || trial.enrollmentCount,
          percentage: targetEnrollment > 0
            ? Math.round((totalEnrollment / targetEnrollment) * 100)
            : null,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch statistics' });
  }
});

export default router;
