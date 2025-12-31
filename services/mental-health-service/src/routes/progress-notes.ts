import { Router, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { ConsentService } from '../services/ConsentService';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createProgressNoteSchema = z.object({
  sessionId: z.string().uuid().optional(),
  patientId: z.string().uuid(),
  noteType: z.enum(['SOAP', 'DAP', 'BIRP', 'GIRP']).default('SOAP'),

  // SOAP fields
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),

  // DAP fields
  data: z.string().optional(),
  assessmentDAP: z.string().optional(),
  planDAP: z.string().optional(),

  // Common fields
  riskAssessment: z.string().optional(),
  interventions: z.array(z.string()).optional(),
  progress: z.string().optional(),
  homework: z.string().optional(),
  nextSteps: z.string().optional(),

  isConfidential: z.boolean().default(true),
  consentSigned: z.boolean().default(false),
});

const updateProgressNoteSchema = z.object({
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  data: z.string().optional(),
  assessmentDAP: z.string().optional(),
  planDAP: z.string().optional(),
  riskAssessment: z.string().optional(),
  interventions: z.array(z.string()).optional(),
  progress: z.string().optional(),
  homework: z.string().optional(),
  nextSteps: z.string().optional(),
});

// Create progress note
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can create progress notes
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can create progress notes',
      });
      return;
    }

    const validatedData = createProgressNoteSchema.parse(req.body);

    // Check consent if confidential
    if (validatedData.isConfidential) {
      const hasConsent = await ConsentService.hasValidConsent(
        validatedData.patientId,
        userId,
        'treatment'
      );

      if (!hasConsent && !validatedData.consentSigned) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Valid consent required for confidential notes',
        });
        return;
      }
    }

    const note = await prisma.progressNote.create({
      data: {
        sessionId: validatedData.sessionId,
        patientId: validatedData.patientId,
        providerId: userId,
        noteType: validatedData.noteType,

        subjective: validatedData.subjective,
        objective: validatedData.objective,
        assessment: validatedData.assessment,
        plan: validatedData.plan,

        data: validatedData.data,
        assessmentDAP: validatedData.assessmentDAP,
        planDAP: validatedData.planDAP,

        riskAssessment: validatedData.riskAssessment,
        interventions: validatedData.interventions || [],
        progress: validatedData.progress,
        homework: validatedData.homework,
        nextSteps: validatedData.nextSteps,

        isConfidential: validatedData.isConfidential,
        consentSigned: validatedData.consentSigned,
      },
    });

    res.status(201).json({
      data: note,
      message: 'Progress note created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating progress note:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create progress note',
    });
  }
});

// Get progress notes for a patient
router.get('/patient/:patientId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    let hasAccess = userRole === 'admin' || (userRole === 'patient' && patientId === userId);

    // For providers, check consent
    if (userRole === 'provider') {
      hasAccess = await ConsentService.hasValidConsent(patientId, userId, 'treatment');
    }

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied - valid consent required',
      });
      return;
    }

    const notes = await prisma.progressNote.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      data: notes,
      count: notes.length,
    });
  } catch (error) {
    console.error('Error fetching progress notes:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch progress notes',
    });
  }
});

// Get progress notes for a session
router.get('/session/:sessionId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Get session to check access
    const session = await prisma.therapySession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Check access to session
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && session.patientId === userId) ||
      (userRole === 'provider' && session.therapistId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const notes = await prisma.progressNote.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      data: notes,
      count: notes.length,
    });
  } catch (error) {
    console.error('Error fetching session notes:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch session notes',
    });
  }
});

// Get single progress note
router.get('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const note = await prisma.progressNote.findUnique({
      where: { id },
    });

    if (!note) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Progress note not found',
      });
      return;
    }

    // Check access
    let hasAccess = userRole === 'admin' || (userRole === 'patient' && note.patientId === userId);

    // For providers, check if they created the note or have consent
    if (userRole === 'provider') {
      const createdByProvider = note.providerId === userId;
      const hasConsent = await ConsentService.hasValidConsent(
        note.patientId,
        userId,
        'treatment'
      );
      hasAccess = createdByProvider || hasConsent;
    }

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: note });
  } catch (error) {
    console.error('Error fetching progress note:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch progress note',
    });
  }
});

// Update progress note
router.patch('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can update notes
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can update progress notes',
      });
      return;
    }

    const note = await prisma.progressNote.findUnique({
      where: { id },
    });

    if (!note) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Progress note not found',
      });
      return;
    }

    // Only the provider who created the note can update it
    if (note.providerId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only the note creator can update it',
      });
      return;
    }

    const validatedData = updateProgressNoteSchema.parse(req.body);

    const updated = await prisma.progressNote.update({
      where: { id },
      data: {
        ...(validatedData.subjective !== undefined && { subjective: validatedData.subjective }),
        ...(validatedData.objective !== undefined && { objective: validatedData.objective }),
        ...(validatedData.assessment !== undefined && { assessment: validatedData.assessment }),
        ...(validatedData.plan !== undefined && { plan: validatedData.plan }),
        ...(validatedData.data !== undefined && { data: validatedData.data }),
        ...(validatedData.assessmentDAP !== undefined && {
          assessmentDAP: validatedData.assessmentDAP,
        }),
        ...(validatedData.planDAP !== undefined && { planDAP: validatedData.planDAP }),
        ...(validatedData.riskAssessment !== undefined && {
          riskAssessment: validatedData.riskAssessment,
        }),
        ...(validatedData.interventions && { interventions: validatedData.interventions }),
        ...(validatedData.progress !== undefined && { progress: validatedData.progress }),
        ...(validatedData.homework !== undefined && { homework: validatedData.homework }),
        ...(validatedData.nextSteps !== undefined && { nextSteps: validatedData.nextSteps }),
      },
    });

    res.json({
      data: updated,
      message: 'Progress note updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating progress note:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update progress note',
    });
  }
});

// Add note to session (convenience endpoint)
router.post('/sessions/:sessionId/notes', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can add notes
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can add session notes',
      });
      return;
    }

    const session = await prisma.therapySession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Verify provider is the therapist
    if (session.therapistId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only the session therapist can add notes',
      });
      return;
    }

    const noteData = { ...req.body, sessionId, patientId: session.patientId };
    const validatedData = createProgressNoteSchema.parse(noteData);

    const note = await prisma.progressNote.create({
      data: {
        sessionId: validatedData.sessionId,
        patientId: validatedData.patientId,
        providerId: userId,
        noteType: validatedData.noteType,

        subjective: validatedData.subjective,
        objective: validatedData.objective,
        assessment: validatedData.assessment,
        plan: validatedData.plan,

        data: validatedData.data,
        assessmentDAP: validatedData.assessmentDAP,
        planDAP: validatedData.planDAP,

        riskAssessment: validatedData.riskAssessment,
        interventions: validatedData.interventions || [],
        progress: validatedData.progress,
        homework: validatedData.homework,
        nextSteps: validatedData.nextSteps,

        isConfidential: validatedData.isConfidential,
        consentSigned: validatedData.consentSigned,
      },
    });

    res.status(201).json({
      data: note,
      message: 'Session note added successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error adding session note:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add session note',
    });
  }
});

export default router;
