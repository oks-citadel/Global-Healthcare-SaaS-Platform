import { Router, Response } from 'express';
import { z } from 'zod';
import { AssessmentType, AssessmentStatus } from '../generated/client';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import { createAuditLog } from '../middleware/auditLogger';
import assessmentService from '../services/assessment.service';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const createAssessmentSchema = z.object({
  vendorId: z.string().uuid(),
  type: z.nativeEnum(AssessmentType),
  dueDate: z.string().datetime().optional(),
  reviewer: z.string().max(255).optional(),
  reviewerEmail: z.string().email().optional(),
});

const updateAssessmentSchema = z.object({
  status: z.nativeEnum(AssessmentStatus).optional(),
  score: z.number().min(0).max(100).optional(),
  maxScore: z.number().min(0).max(100).optional(),
  passThreshold: z.number().min(0).max(100).optional(),
  passed: z.boolean().optional(),
  findings: z.record(z.unknown()).optional(),
  recommendations: z.string().max(5000).optional(),
  attachments: z.array(z.record(z.unknown())).optional(),
});

const listAssessmentsSchema = z.object({
  vendorId: z.string().uuid().optional(),
  type: z.nativeEnum(AssessmentType).optional(),
  status: z.nativeEnum(AssessmentStatus).optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
});

const questionnaireResponseSchema = z.object({
  responses: z.record(z.unknown()),
  percentComplete: z.number().min(0).max(100),
});

const reviewQuestionnaireSchema = z.object({
  approved: z.boolean(),
  reviewNotes: z.string().max(5000).optional(),
  score: z.number().min(0).optional(),
  maxScore: z.number().min(0).optional(),
});

// List assessments
router.get('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validatedQuery = listAssessmentsSchema.parse(req.query);

    const filters = {
      ...validatedQuery,
      dueBefore: validatedQuery.dueBefore ? new Date(validatedQuery.dueBefore) : undefined,
      dueAfter: validatedQuery.dueAfter ? new Date(validatedQuery.dueAfter) : undefined,
    };

    const { assessments, total } = await assessmentService.listAssessments(filters);

    res.json({
      data: assessments,
      total,
      limit: validatedQuery.limit || 50,
      offset: validatedQuery.offset || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error listing assessments:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list assessments' });
  }
});

// Get overdue assessments
router.get('/overdue', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const assessments = await assessmentService.getOverdueAssessments();
    res.json({ data: assessments, count: assessments.length });
  } catch (error) {
    console.error('Error getting overdue assessments:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get assessments' });
  }
});

// Get upcoming assessments
router.get('/upcoming', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const daysAhead = parseInt(req.query.daysAhead as string) || 30;
    const assessments = await assessmentService.getUpcomingAssessments(daysAhead);
    res.json({ data: assessments, count: assessments.length });
  } catch (error) {
    console.error('Error getting upcoming assessments:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get assessments' });
  }
});

// Get a single assessment
router.get('/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const assessment = await assessmentService.getAssessment(id);

    if (!assessment) {
      res.status(404).json({ error: 'Not Found', message: 'Assessment not found' });
      return;
    }

    res.json({ data: assessment });
  } catch (error) {
    console.error('Error getting assessment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get assessment' });
  }
});

// Create a new assessment
router.post('/', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const validatedData = createAssessmentSchema.parse(req.body);

    const assessment = await assessmentService.createAssessment({
      ...validatedData,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : new Date(),
      createdBy: req.user!.id,
    } as any);

    await createAuditLog(req, {
      vendorId: validatedData.vendorId,
      action: 'ASSESSMENT_CREATED',
      entityType: 'Assessment',
      entityId: assessment.id,
      newValues: validatedData,
    });

    res.status(201).json({ data: assessment, message: 'Assessment created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating assessment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create assessment' });
  }
});

// Update an assessment
router.put('/:id', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateAssessmentSchema.parse(req.body);

    const existingAssessment = await assessmentService.getAssessment(id);
    if (!existingAssessment) {
      res.status(404).json({ error: 'Not Found', message: 'Assessment not found' });
      return;
    }

    const assessment = await assessmentService.updateAssessment(id, validatedData);

    await createAuditLog(req, {
      vendorId: existingAssessment.vendorId,
      action: 'ASSESSMENT_UPDATED',
      entityType: 'Assessment',
      entityId: id,
      oldValues: existingAssessment as unknown as Record<string, unknown>,
      newValues: validatedData,
    });

    res.json({ data: assessment, message: 'Assessment updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update assessment' });
  }
});

// Submit assessment for review
router.post('/:id/submit', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { findings } = z.object({ findings: z.record(z.unknown()) }).parse(req.body);

    const existingAssessment = await assessmentService.getAssessment(id);
    if (!existingAssessment) {
      res.status(404).json({ error: 'Not Found', message: 'Assessment not found' });
      return;
    }

    const assessment = await assessmentService.submitAssessmentForReview(id, findings);

    await createAuditLog(req, {
      vendorId: existingAssessment.vendorId,
      action: 'ASSESSMENT_SUBMITTED',
      entityType: 'Assessment',
      entityId: id,
      newValues: { status: assessment.status },
    });

    res.json({ data: assessment, message: 'Assessment submitted for review' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error submitting assessment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to submit assessment' });
  }
});

// Questionnaire Templates
router.get('/templates/questionnaires', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const templates = await assessmentService.getQuestionnaireTemplates(type);
    res.json({ data: templates });
  } catch (error) {
    console.error('Error getting questionnaire templates:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get templates' });
  }
});

// Create questionnaire response for a vendor
router.post('/questionnaires', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const { vendorId, templateId, expiresInDays } = z.object({
      vendorId: z.string().uuid(),
      templateId: z.string().uuid(),
      expiresInDays: z.number().min(1).max(365).optional(),
    }).parse(req.body);

    const response = await assessmentService.createQuestionnaireResponse(
      vendorId,
      templateId,
      expiresInDays
    );

    await createAuditLog(req, {
      vendorId,
      action: 'QUESTIONNAIRE_CREATED',
      entityType: 'QuestionnaireResponse',
      entityId: response.id,
      newValues: { templateId, expiresInDays },
    });

    res.status(201).json({ data: response, message: 'Questionnaire created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating questionnaire:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create questionnaire' });
  }
});

// Get vendor questionnaires
router.get('/questionnaires/vendor/:vendorId', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { vendorId } = req.params;
    const questionnaires = await assessmentService.getVendorQuestionnaires(vendorId);
    res.json({ data: questionnaires });
  } catch (error) {
    console.error('Error getting vendor questionnaires:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get questionnaires' });
  }
});

// Get a questionnaire response
router.get('/questionnaires/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const questionnaire = await assessmentService.getQuestionnaireResponse(id);

    if (!questionnaire) {
      res.status(404).json({ error: 'Not Found', message: 'Questionnaire not found' });
      return;
    }

    res.json({ data: questionnaire });
  } catch (error) {
    console.error('Error getting questionnaire:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get questionnaire' });
  }
});

// Update questionnaire responses
router.put('/questionnaires/:id/responses', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = questionnaireResponseSchema.parse(req.body);

    const existingQuestionnaire = await assessmentService.getQuestionnaireResponse(id);
    if (!existingQuestionnaire) {
      res.status(404).json({ error: 'Not Found', message: 'Questionnaire not found' });
      return;
    }

    const questionnaire = await assessmentService.updateQuestionnaireResponse(id, validatedData as any);

    await createAuditLog(req, {
      vendorId: existingQuestionnaire.vendorId,
      action: 'QUESTIONNAIRE_UPDATED',
      entityType: 'QuestionnaireResponse',
      entityId: id,
      newValues: { percentComplete: validatedData.percentComplete },
    });

    res.json({ data: questionnaire, message: 'Questionnaire responses updated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating questionnaire:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update questionnaire' });
  }
});

// Submit questionnaire
router.post('/questionnaires/:id/submit', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingQuestionnaire = await assessmentService.getQuestionnaireResponse(id);
    if (!existingQuestionnaire) {
      res.status(404).json({ error: 'Not Found', message: 'Questionnaire not found' });
      return;
    }

    const questionnaire = await assessmentService.submitQuestionnaire(id);

    await createAuditLog(req, {
      vendorId: existingQuestionnaire.vendorId,
      action: 'QUESTIONNAIRE_SUBMITTED',
      entityType: 'QuestionnaireResponse',
      entityId: id,
    });

    res.json({ data: questionnaire, message: 'Questionnaire submitted successfully' });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to submit questionnaire' });
  }
});

// Review questionnaire
router.post('/questionnaires/:id/review', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = reviewQuestionnaireSchema.parse(req.body);

    const existingQuestionnaire = await assessmentService.getQuestionnaireResponse(id);
    if (!existingQuestionnaire) {
      res.status(404).json({ error: 'Not Found', message: 'Questionnaire not found' });
      return;
    }

    const questionnaire = await assessmentService.reviewQuestionnaire(
      id,
      req.user!.id,
      validatedData.approved,
      validatedData.reviewNotes,
      validatedData.score,
      validatedData.maxScore
    );

    await createAuditLog(req, {
      vendorId: existingQuestionnaire.vendorId,
      action: validatedData.approved ? 'QUESTIONNAIRE_APPROVED' : 'QUESTIONNAIRE_REJECTED',
      entityType: 'QuestionnaireResponse',
      entityId: id,
      newValues: validatedData,
    });

    res.json({ data: questionnaire, message: `Questionnaire ${validatedData.approved ? 'approved' : 'rejected'}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error reviewing questionnaire:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to review questionnaire' });
  }
});

// Seed questionnaire templates (admin only)
router.post('/templates/seed', requireUser, requireRole('admin'), async (req: UserRequest, res: Response) => {
  try {
    await assessmentService.seedQuestionnaireTemplates();

    await createAuditLog(req, {
      action: 'QUESTIONNAIRE_TEMPLATES_SEEDED',
      entityType: 'QuestionnaireTemplate',
    });

    res.json({ message: 'Questionnaire templates seeded successfully' });
  } catch (error) {
    console.error('Error seeding templates:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to seed templates' });
  }
});

export default router;
