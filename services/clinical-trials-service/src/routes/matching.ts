import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import matchingService, { TrialForMatching, SiteForMatching } from '../services/matching.service';
import { PatientProfile } from '../types/fhir';

const router: ReturnType<typeof Router> = Router();

// Lazy load Prisma
const getPrisma = async () => {
  const { PrismaClient } = await import('../generated/client');
  return new PrismaClient();
};

// Validation schemas
const patientProfileSchema = z.object({
  id: z.string(),
  demographics: z.object({
    age: z.number().min(0).max(150),
    gender: z.string(),
    ethnicity: z.string().optional(),
    race: z.string().optional(),
  }),
  conditions: z.array(z.string()),
  conditionCodes: z.array(z.object({
    coding: z.array(z.object({
      system: z.string().optional(),
      code: z.string().optional(),
      display: z.string().optional(),
    })).optional(),
    text: z.string().optional(),
  })).optional(),
  medications: z.array(z.string()),
  medicationCodes: z.array(z.any()).optional(),
  labResults: z.array(z.object({
    code: z.string(),
    display: z.string(),
    value: z.number(),
    unit: z.string(),
    date: z.string(),
    referenceRange: z.object({
      low: z.number().optional(),
      high: z.number().optional(),
    }).optional(),
  })).optional(),
  procedures: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  vitalSigns: z.array(z.object({
    type: z.string(),
    value: z.number(),
    unit: z.string(),
    date: z.string(),
  })).optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

const matchingOptionsSchema = z.object({
  maxDistance: z.number().min(1).max(500).optional(),
  distanceUnit: z.enum(['miles', 'km']).optional(),
  minMatchScore: z.number().min(0).max(100).optional(),
  includeInactive: z.boolean().optional(),
  statusFilter: z.array(z.string()).optional(),
  phaseFilter: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sortBy: z.enum(['score', 'distance', 'relevance']).optional(),
  trialIds: z.array(z.string()).optional(),
  conditions: z.array(z.string()).optional(),
});

// POST /matching/find - Find matching trials for a patient
router.post('/find', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();

    const { patient, options } = req.body;

    const validatedPatient = patientProfileSchema.parse(patient) as PatientProfile;
    const validatedOptions = matchingOptionsSchema.parse(options || {});

    // Build trial query
    const where: any = {};

    if (validatedOptions.statusFilter?.length) {
      where.status = { in: validatedOptions.statusFilter };
    } else if (!validatedOptions.includeInactive) {
      where.status = { in: ['recruiting', 'enrolling_by_invitation', 'not_yet_recruiting'] };
    }

    if (validatedOptions.phaseFilter?.length) {
      where.phase = { in: validatedOptions.phaseFilter };
    }

    if (validatedOptions.conditions?.length) {
      where.conditions = { hasSome: validatedOptions.conditions };
    }

    if (validatedOptions.trialIds?.length) {
      where.id = { in: validatedOptions.trialIds };
    }

    // Fetch trials with sites
    const trials = await prisma.clinicalTrial.findMany({
      where,
      include: {
        sites: {
          where: { isActive: true },
        },
      },
    });

    await prisma.$disconnect();

    // Map to matching format
    const trialsForMatching: TrialForMatching[] = trials.map((trial) => ({
      id: trial.id,
      nctId: trial.nctId,
      title: trial.title,
      status: trial.status,
      phase: trial.phase || undefined,
      conditions: trial.conditions,
      minimumAge: trial.minimumAge || undefined,
      maximumAge: trial.maximumAge || undefined,
      gender: trial.gender || undefined,
      healthyVolunteers: trial.healthyVolunteers,
      eligibilityCriteria: trial.eligibilityCriteria as any,
      eligibilityText: trial.eligibilityText || undefined,
      keywords: trial.keywords,
      meshTerms: trial.meshTerms,
      interventions: trial.interventions as any[],
      sites: trial.sites.map((site): SiteForMatching => ({
        id: site.id,
        facilityName: site.facilityName,
        city: site.city,
        state: site.state || undefined,
        country: site.country,
        latitude: site.latitude || undefined,
        longitude: site.longitude || undefined,
        status: site.status,
        isActive: site.isActive,
      })),
    }));

    // Perform matching
    const result = await matchingService.matchPatientToTrials(
      validatedPatient,
      trialsForMatching,
      validatedOptions
    );

    res.json({
      data: result.matches,
      pagination: result.pagination,
      totalCount: result.totalCount,
      processingTime: result.processingTime,
      summary: matchingService.generateMatchSummary(result.matches),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error finding matches:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /matching/save - Save patient matches to database
router.post('/save', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();

    const { patientId, matches, expiresInDays = 30 } = req.body;

    if (!patientId || !Array.isArray(matches)) {
      res.status(400).json({ error: 'Validation Error', message: 'patientId and matches are required' });
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const savedMatches = [];

    for (const match of matches) {
      const savedMatch = await prisma.patientMatch.upsert({
        where: {
          patientId_trialId: {
            patientId,
            trialId: match.trial.id,
          },
        },
        update: {
          matchScore: match.matchScore,
          eligibilityStatus: match.eligibilityStatus,
          matchedCriteria: match.matchedCriteria,
          unmatchedCriteria: match.unmatchedCriteria,
          uncertainCriteria: match.uncertainCriteria || [],
          matchDetails: match.matchDetails,
          distance: match.distance,
          nearestSiteId: match.nearestSites?.[0]?.siteId,
          expiresAt,
          updatedAt: new Date(),
        },
        create: {
          patientId,
          trialId: match.trial.id,
          matchScore: match.matchScore,
          eligibilityStatus: match.eligibilityStatus,
          matchedCriteria: match.matchedCriteria,
          unmatchedCriteria: match.unmatchedCriteria,
          uncertainCriteria: match.uncertainCriteria || [],
          matchDetails: match.matchDetails,
          distance: match.distance,
          nearestSiteId: match.nearestSites?.[0]?.siteId,
          expiresAt,
        },
      });

      savedMatches.push(savedMatch);
    }

    await prisma.$disconnect();

    res.status(201).json({
      data: savedMatches,
      message: `${savedMatches.length} matches saved successfully`,
    });
  } catch (error: any) {
    console.error('Error saving matches:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /matching/patient/:patientId - Get saved matches for a patient
router.get('/patient/:patientId', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { patientId } = req.params;
    const { status, minScore, includeExpired } = req.query;

    // Check authorization
    if (req.user?.role === 'patient' && req.user.id !== patientId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const where: any = { patientId };

    if (status) {
      where.eligibilityStatus = status;
    }

    if (minScore) {
      where.matchScore = { gte: parseFloat(minScore as string) };
    }

    if (!includeExpired) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    }

    const matches = await prisma.patientMatch.findMany({
      where,
      include: {
        trial: {
          select: {
            id: true,
            nctId: true,
            title: true,
            status: true,
            phase: true,
            conditions: true,
            briefSummary: true,
          },
        },
      },
      orderBy: { matchScore: 'desc' },
    });

    await prisma.$disconnect();

    res.json({
      data: matches,
      count: matches.length,
    });
  } catch (error: any) {
    console.error('Error fetching patient matches:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /matching/:matchId/review - Review a patient match
router.put('/:matchId/review', requireUser, requireRole('provider', 'coordinator', 'admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { matchId } = req.params;
    const { reviewStatus, reviewNotes } = req.body;

    const match = await prisma.patientMatch.findUnique({ where: { id: matchId } });

    if (!match) {
      res.status(404).json({ error: 'Not Found', message: 'Match not found' });
      return;
    }

    const updatedMatch = await prisma.patientMatch.update({
      where: { id: matchId },
      data: {
        reviewStatus,
        reviewNotes,
        reviewedBy: req.user?.id,
        reviewedAt: new Date(),
      },
      include: {
        trial: {
          select: {
            id: true,
            nctId: true,
            title: true,
          },
        },
      },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedMatch,
      message: 'Match review updated successfully',
    });
  } catch (error: any) {
    console.error('Error reviewing match:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /matching/:matchId/interest - Express interest in a trial
router.put('/:matchId/interest', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { matchId } = req.params;
    const { isInterested } = req.body;

    const match = await prisma.patientMatch.findUnique({ where: { id: matchId } });

    if (!match) {
      res.status(404).json({ error: 'Not Found', message: 'Match not found' });
      return;
    }

    // Verify patient can only update their own matches
    if (req.user?.role === 'patient' && match.patientId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const updatedMatch = await prisma.patientMatch.update({
      where: { id: matchId },
      data: {
        isInterested,
        interestExpressedAt: isInterested ? new Date() : null,
      },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedMatch,
      message: isInterested
        ? 'Interest expressed successfully'
        : 'Interest withdrawn',
    });
  } catch (error: any) {
    console.error('Error updating interest:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /matching/:matchId/notify - Send notification about match
router.post('/:matchId/notify', requireUser, requireRole('provider', 'coordinator', 'admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { matchId } = req.params;

    const match = await prisma.patientMatch.findUnique({
      where: { id: matchId },
      include: { trial: true },
    });

    if (!match) {
      res.status(404).json({ error: 'Not Found', message: 'Match not found' });
      return;
    }

    if (match.patientNotified) {
      res.status(400).json({ error: 'Bad Request', message: 'Patient has already been notified' });
      return;
    }

    // Create notification
    await prisma.trialNotification.create({
      data: {
        recipientId: match.patientId,
        recipientType: 'patient',
        type: 'new_match',
        title: 'New Clinical Trial Match',
        message: `You have been matched to a clinical trial: ${match.trial.title}`,
        trialId: match.trialId,
        matchId: match.id,
        priority: match.matchScore >= 80 ? 'high' : 'normal',
      },
    });

    // Update match
    const updatedMatch = await prisma.patientMatch.update({
      where: { id: matchId },
      data: {
        patientNotified: true,
        notifiedAt: new Date(),
      },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedMatch,
      message: 'Patient notified successfully',
    });
  } catch (error: any) {
    console.error('Error notifying patient:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// DELETE /matching/:matchId - Delete a match
router.delete('/:matchId', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { matchId } = req.params;

    const match = await prisma.patientMatch.findUnique({ where: { id: matchId } });

    if (!match) {
      res.status(404).json({ error: 'Not Found', message: 'Match not found' });
      return;
    }

    await prisma.patientMatch.delete({ where: { id: matchId } });
    await prisma.$disconnect();

    res.json({ message: 'Match deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /matching/statistics - Get overall matching statistics
router.get('/statistics', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();

    const [
      totalMatches,
      eligibleCount,
      potentiallyEligibleCount,
      ineligibleCount,
      interestedCount,
      avgScore,
    ] = await Promise.all([
      prisma.patientMatch.count(),
      prisma.patientMatch.count({ where: { eligibilityStatus: 'eligible' } }),
      prisma.patientMatch.count({ where: { eligibilityStatus: 'potentially_eligible' } }),
      prisma.patientMatch.count({ where: { eligibilityStatus: 'ineligible' } }),
      prisma.patientMatch.count({ where: { isInterested: true } }),
      prisma.patientMatch.aggregate({ _avg: { matchScore: true } }),
    ]);

    // Get matches by status over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMatches = await prisma.patientMatch.groupBy({
      by: ['eligibilityStatus'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    });

    await prisma.$disconnect();

    res.json({
      data: {
        totalMatches,
        breakdown: {
          eligible: eligibleCount,
          potentiallyEligible: potentiallyEligibleCount,
          ineligible: ineligibleCount,
        },
        interestedPatients: interestedCount,
        averageMatchScore: Math.round(avgScore._avg.matchScore || 0),
        last30Days: recentMatches.reduce((acc: any, item) => {
          acc[item.eligibilityStatus] = item._count;
          return acc;
        }, {}),
      },
    });
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
