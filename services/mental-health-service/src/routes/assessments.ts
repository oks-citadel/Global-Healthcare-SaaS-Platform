import { Router, Response } from 'express';
import { PrismaClient, Prisma } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Type for Prisma where clause
type MentalHealthAssessmentWhereInput = Prisma.MentalHealthAssessmentWhereInput;

// Type for assessment stats
interface AssessmentScoreEntry {
  score: number | null;
  date: Date;
}

interface AssessmentTypeStats {
  count: number;
  scores: AssessmentScoreEntry[];
  latestScore: number | null;
  trend: 'improving' | 'declining' | 'stable' | null;
}

// Validation schema
const createAssessmentSchema = z.object({
  patientId: z.string().uuid(),
  assessmentType: z.enum([
    'PHQ9',
    'GAD7',
    'PCL5',
    'AUDIT',
    'DAST',
    'MDQ',
    'YBOCS',
    'PSS',
    'general_intake',
  ]),
  score: z.number().optional(),
  severity: z.string().optional(),
  results: z.record(z.any()),
  notes: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().datetime().optional(),
});

// Get assessments
router.get('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { patientId, assessmentType } = req.query;

    const where: MentalHealthAssessmentWhereInput = {};

    // Access control
    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'provider') {
      if (patientId && typeof patientId === 'string') {
        where.patientId = patientId;
      } else {
        where.assessedBy = userId;
      }
    }

    // Filter by assessment type
    if (assessmentType && typeof assessmentType === 'string') {
      where.assessmentType = assessmentType as any;
    }

    const assessments = await prisma.mentalHealthAssessment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      data: assessments,
      count: assessments.length,
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch assessments',
    });
  }
});

// Get single assessment
router.get('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const assessment = await prisma.mentalHealthAssessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Assessment not found',
      });
      return;
    }

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && assessment.patientId === userId) ||
      (userRole === 'provider' && assessment.assessedBy === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: assessment });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch assessment',
    });
  }
});

// Create assessment
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can create assessments
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can create assessments',
      });
      return;
    }

    const validatedData = createAssessmentSchema.parse(req.body);

    const assessment = await prisma.mentalHealthAssessment.create({
      data: {
        patientId: validatedData.patientId,
        assessedBy: userId,
        assessmentType: validatedData.assessmentType,
        score: validatedData.score,
        severity: validatedData.severity as any,
        results: validatedData.results,
        notes: validatedData.notes,
        followUpRequired: validatedData.followUpRequired || false,
        followUpDate: validatedData.followUpDate
          ? new Date(validatedData.followUpDate)
          : null,
      },
    });

    res.status(201).json({
      data: assessment,
      message: 'Assessment created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating assessment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create assessment',
    });
  }
});

// Get assessment statistics for a patient
router.get('/stats/:patientId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && patientId === userId) ||
      userRole === 'provider';

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const assessments = await prisma.mentalHealthAssessment.findMany({
      where: { patientId },
      orderBy: { createdAt: 'asc' },
    });

    // Group by assessment type
    const stats: Record<string, AssessmentTypeStats> = {};

    assessments.forEach((assessment) => {
      const type = assessment.assessmentType;
      if (!stats[type]) {
        stats[type] = {
          count: 0,
          scores: [],
          latestScore: null,
          trend: null,
        };
      }

      stats[type].count++;
      if (assessment.score !== null) {
        stats[type].scores.push({
          score: assessment.score,
          date: assessment.createdAt,
        });
        stats[type].latestScore = assessment.score;
      }
    });

    // Calculate trends
    Object.keys(stats).forEach((type) => {
      const scores = stats[type].scores;
      if (scores.length >= 2) {
        const firstScore = scores[0].score;
        const lastScore = scores[scores.length - 1].score;
        if (firstScore !== null && lastScore !== null) {
          const change = lastScore - firstScore;
          stats[type].trend = change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable';
        }
      }
    });

    res.json({
      data: {
        patientId,
        totalAssessments: assessments.length,
        statistics: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching assessment stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch assessment statistics',
    });
  }
});

export default router;
