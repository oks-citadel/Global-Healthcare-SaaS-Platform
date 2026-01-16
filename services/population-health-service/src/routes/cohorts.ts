import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createCohortSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  populationId: z.string().uuid(),
  cohortType: z.enum(['risk_stratification', 'disease_registry', 'care_management', 'quality_improvement', 'research', 'custom']),
  criteria: z.record(z.any()),
  riskLevel: z.enum(['low', 'moderate', 'high', 'very_high', 'critical']).optional(),
  interventionPriority: z.number().min(1).max(5).optional(),
  fhirGroupId: z.string().optional(),
});

const updateCohortSchema = createCohortSchema.partial().omit({ populationId: true });

const addCohortMemberSchema = z.object({
  patientId: z.string().uuid(),
  fhirPatientRef: z.string().optional(),
  riskScore: z.number().optional(),
});

const createCareGapSchema = z.object({
  patientId: z.string().uuid(),
  gapType: z.enum(['preventive_care', 'chronic_disease_management', 'medication_adherence', 'screening', 'immunization', 'follow_up', 'lab_test', 'specialist_referral', 'wellness_visit', 'other']),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  qualityMeasureId: z.string().optional(),
  recommendedAction: z.string().optional(),
  actionDueDate: z.string().datetime().optional(),
  fhirPatientRef: z.string().optional(),
  fhirConditionRef: z.string().optional(),
});

// GET /cohorts - List all cohorts
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const where: any = {};

    if (req.query.populationId) {
      where.populationId = req.query.populationId;
    }

    if (req.query.cohortType) {
      where.cohortType = req.query.cohortType;
    }

    if (req.query.riskLevel) {
      where.riskLevel = req.query.riskLevel;
    }

    const cohorts = await prisma.cohort.findMany({
      where,
      include: {
        population: {
          select: { id: true, name: true, organizationId: true },
        },
        _count: {
          select: { careGaps: true },
        },
      },
      orderBy: [
        { interventionPriority: 'asc' },
        { createdAt: 'desc' },
      ],
      take: parseInt(req.query.limit as string) || 50,
      skip: parseInt(req.query.offset as string) || 0,
    });

    const total = await prisma.cohort.count({ where });

    res.json({ data: cohorts, total });
  } catch (error) {
    console.error('Error fetching cohorts:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch cohorts' });
  }
});

// POST /cohorts - Create a new cohort
router.post('/', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = createCohortSchema.parse(req.body);

    const cohort = await prisma.cohort.create({
      data: {
        name: validated.name,
        description: validated.description,
        populationId: validated.populationId,
        cohortType: validated.cohortType,
        criteria: validated.criteria,
        riskLevel: validated.riskLevel,
        interventionPriority: validated.interventionPriority,
        fhirGroupId: validated.fhirGroupId,
        createdBy: req.user!.id,
      },
      include: {
        population: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({ data: cohort, message: 'Cohort created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating cohort:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create cohort' });
  }
});

// GET /cohorts/:id - Get cohort by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const cohort = await prisma.cohort.findUnique({
      where: { id: req.params.id },
      include: {
        population: true,
        careGaps: {
          where: { status: 'open' },
          take: 10,
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!cohort) {
      res.status(404).json({ error: 'Not Found', message: 'Cohort not found' });
      return;
    }

    res.json({ data: cohort });
  } catch (error) {
    console.error('Error fetching cohort:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch cohort' });
  }
});

// PUT /cohorts/:id - Update cohort
router.put('/:id', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const validated = updateCohortSchema.parse(req.body);

    const cohort = await prisma.cohort.update({
      where: { id: req.params.id },
      data: validated,
    });

    res.json({ data: cohort, message: 'Cohort updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating cohort:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update cohort' });
  }
});

// DELETE /cohorts/:id - Delete cohort
router.delete('/:id', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    await prisma.cohort.delete({ where: { id: req.params.id } });
    res.json({ message: 'Cohort deleted successfully' });
  } catch (error) {
    console.error('Error deleting cohort:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete cohort' });
  }
});

// GET /cohorts/:id/members - Get cohort members
router.get('/:id/members', requireUser, async (req: UserRequest, res) => {
  try {
    const where: any = { cohortId: req.params.id };

    if (req.query.status) {
      where.status = req.query.status;
    }

    const members = await prisma.cohortMember.findMany({
      where,
      orderBy: { riskScore: 'desc' },
      take: parseInt(req.query.limit as string) || 50,
      skip: parseInt(req.query.offset as string) || 0,
    });

    const total = await prisma.cohortMember.count({ where });

    res.json({ data: members, total });
  } catch (error) {
    console.error('Error fetching cohort members:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch cohort members' });
  }
});

// POST /cohorts/:id/members - Add member to cohort
router.post('/:id/members', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const validated = addCohortMemberSchema.parse(req.body);

    const member = await prisma.cohortMember.upsert({
      where: {
        cohortId_patientId: {
          cohortId: req.params.id,
          patientId: validated.patientId,
        },
      },
      create: {
        cohortId: req.params.id,
        patientId: validated.patientId,
        fhirPatientRef: validated.fhirPatientRef,
        riskScore: validated.riskScore,
        status: 'active',
      },
      update: {
        status: 'active',
        removedAt: null,
        riskScore: validated.riskScore,
      },
    });

    // Update cohort member count
    const count = await prisma.cohortMember.count({
      where: { cohortId: req.params.id, status: 'active' },
    });
    await prisma.cohort.update({
      where: { id: req.params.id },
      data: { memberCount: count },
    });

    res.status(201).json({ data: member, message: 'Member added to cohort' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error adding cohort member:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add cohort member' });
  }
});

// DELETE /cohorts/:id/members/:patientId - Remove member from cohort
router.delete('/:id/members/:patientId', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    await prisma.cohortMember.update({
      where: {
        cohortId_patientId: {
          cohortId: req.params.id,
          patientId: req.params.patientId,
        },
      },
      data: {
        status: 'inactive',
        removedAt: new Date(),
      },
    });

    // Update cohort member count
    const count = await prisma.cohortMember.count({
      where: { cohortId: req.params.id, status: 'active' },
    });
    await prisma.cohort.update({
      where: { id: req.params.id },
      data: { memberCount: count },
    });

    res.json({ message: 'Member removed from cohort' });
  } catch (error) {
    console.error('Error removing cohort member:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to remove cohort member' });
  }
});

// GET /cohorts/:id/care-gaps - Get care gaps for cohort
router.get('/:id/care-gaps', requireUser, async (req: UserRequest, res) => {
  try {
    const where: any = { cohortId: req.params.id };

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.priority) {
      where.priority = req.query.priority;
    }

    if (req.query.gapType) {
      where.gapType = req.query.gapType;
    }

    const careGaps = await prisma.careGap.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { identifiedAt: 'desc' },
      ],
      take: parseInt(req.query.limit as string) || 50,
      skip: parseInt(req.query.offset as string) || 0,
    });

    const total = await prisma.careGap.count({ where });

    // Group by type for summary
    const summary = await prisma.careGap.groupBy({
      by: ['gapType'],
      where: { cohortId: req.params.id, status: 'open' },
      _count: { gapType: true },
    });

    res.json({
      data: careGaps,
      total,
      summary: summary.reduce((acc, s) => {
        acc[s.gapType] = s._count.gapType;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('Error fetching care gaps:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch care gaps' });
  }
});

// POST /cohorts/:id/care-gaps - Create care gap for cohort
router.post('/:id/care-gaps', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = createCareGapSchema.parse(req.body);

    const careGap = await prisma.careGap.create({
      data: {
        cohortId: req.params.id,
        patientId: validated.patientId,
        fhirPatientRef: validated.fhirPatientRef,
        gapType: validated.gapType,
        title: validated.title,
        description: validated.description,
        priority: validated.priority || 'medium',
        qualityMeasureId: validated.qualityMeasureId,
        recommendedAction: validated.recommendedAction,
        actionDueDate: validated.actionDueDate ? new Date(validated.actionDueDate) : undefined,
        fhirConditionRef: validated.fhirConditionRef,
        status: 'open',
      },
    });

    res.status(201).json({ data: careGap, message: 'Care gap created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating care gap:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create care gap' });
  }
});

// PUT /cohorts/:id/care-gaps/:gapId - Update care gap status
router.put('/:id/care-gaps/:gapId', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const updateData: any = {};

    if (req.body.status) {
      updateData.status = req.body.status;
      if (req.body.status === 'resolved') {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = req.user!.id;
      }
    }

    if (req.body.resolutionNotes) {
      updateData.resolutionNotes = req.body.resolutionNotes;
    }

    if (req.body.priority) {
      updateData.priority = req.body.priority;
    }

    const careGap = await prisma.careGap.update({
      where: { id: req.params.gapId },
      data: updateData,
    });

    res.json({ data: careGap, message: 'Care gap updated successfully' });
  } catch (error) {
    console.error('Error updating care gap:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update care gap' });
  }
});

// GET /cohorts/:id/fhir - Get FHIR R4 Group resource for cohort
router.get('/:id/fhir', requireUser, async (req: UserRequest, res) => {
  try {
    const cohort = await prisma.cohort.findUnique({
      where: { id: req.params.id },
      include: { population: true },
    });

    if (!cohort) {
      res.status(404).json({ error: 'Not Found', message: 'Cohort not found' });
      return;
    }

    const fhirGroup = {
      resourceType: 'Group',
      id: cohort.fhirGroupId || cohort.id,
      meta: {
        lastUpdated: cohort.updatedAt.toISOString(),
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
        text: cohort.cohortType,
      },
      name: cohort.name,
      quantity: cohort.memberCount,
      managingEntity: {
        reference: `Group/${cohort.population.fhirGroupId || cohort.population.id}`,
        display: cohort.population.name,
      },
      characteristic: [
        {
          code: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/group-characteristic',
                code: 'cohort-type',
              },
            ],
          },
          valueCodeableConcept: {
            text: cohort.cohortType,
          },
          exclude: false,
        },
      ],
      extension: cohort.riskLevel
        ? [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/cohort-risk-level',
              valueCode: cohort.riskLevel,
            },
          ]
        : undefined,
    };

    res.json(fhirGroup);
  } catch (error) {
    console.error('Error generating FHIR resource:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate FHIR resource' });
  }
});

export default router;
