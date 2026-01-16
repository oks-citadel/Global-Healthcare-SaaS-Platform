import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import populationService, { CreatePopulationInput } from '../services/population.service';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const createPopulationSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  definitionType: z.enum(['geographic', 'demographic', 'condition_based', 'payer_based', 'provider_panel', 'custom']).optional(),
  criteria: z.record(z.any()),
  fhirGroupId: z.string().optional(),
});

const updatePopulationSchema = createPopulationSchema.partial();

const addMemberSchema = z.object({
  patientId: z.string().uuid(),
  fhirPatientRef: z.string().optional(),
});

// GET /populations - List all populations
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const filters = {
      organizationId: req.user?.organizationId || (req.query.organizationId as string),
      status: req.query.status as any,
      definitionType: req.query.definitionType as any,
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    };

    const result = await populationService.getPopulations(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching populations:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch populations' });
  }
});

// POST /populations - Create a new population
router.post('/', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = createPopulationSchema.parse(req.body);

    const population = await populationService.createPopulation({
      ...validated,
      organizationId: req.user!.organizationId || req.body.organizationId,
      createdBy: req.user!.id,
    } as CreatePopulationInput);

    res.status(201).json({ data: population, message: 'Population created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating population:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create population' });
  }
});

// GET /populations/:id - Get population by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const population = await populationService.getPopulationById(req.params.id);

    if (!population) {
      res.status(404).json({ error: 'Not Found', message: 'Population not found' });
      return;
    }

    res.json({ data: population });
  } catch (error) {
    console.error('Error fetching population:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch population' });
  }
});

// PUT /populations/:id - Update population
router.put('/:id', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const validated = updatePopulationSchema.parse(req.body);

    const population = await populationService.updatePopulation(req.params.id, validated);
    res.json({ data: population, message: 'Population updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating population:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update population' });
  }
});

// DELETE /populations/:id - Archive population
router.delete('/:id', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    await populationService.archivePopulation(req.params.id);
    res.json({ message: 'Population archived successfully' });
  } catch (error) {
    console.error('Error archiving population:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to archive population' });
  }
});

// GET /populations/:id/metrics - Get population metrics
router.get('/:id/metrics', requireUser, async (req: UserRequest, res) => {
  try {
    const metrics = await populationService.getPopulationMetrics(req.params.id);
    res.json({ data: metrics });
  } catch (error) {
    console.error('Error fetching population metrics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch population metrics' });
  }
});

// GET /populations/:id/members - Get population members
router.get('/:id/members', requireUser, async (req: UserRequest, res) => {
  try {
    const filters = {
      status: req.query.status as any,
      riskTier: req.query.riskTier as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    };

    const result = await populationService.getMembers(req.params.id, filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching population members:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch population members' });
  }
});

// POST /populations/:id/members - Add member to population
router.post('/:id/members', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const validated = addMemberSchema.parse(req.body);

    const member = await populationService.addMember(
      req.params.id,
      validated.patientId,
      validated.fhirPatientRef
    );

    res.status(201).json({ data: member, message: 'Member added successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add member' });
  }
});

// DELETE /populations/:id/members/:patientId - Remove member from population
router.delete('/:id/members/:patientId', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    await populationService.removeMember(req.params.id, req.params.patientId);
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to remove member' });
  }
});

// GET /populations/:id/disease-prevalence - Get disease prevalence
router.get('/:id/disease-prevalence', requireUser, async (req: UserRequest, res) => {
  try {
    const periodStart = req.query.periodStart ? new Date(req.query.periodStart as string) : undefined;
    const periodEnd = req.query.periodEnd ? new Date(req.query.periodEnd as string) : undefined;

    const prevalence = await populationService.getDiseasePrevalence(req.params.id, periodStart, periodEnd);
    res.json({ data: prevalence });
  } catch (error) {
    console.error('Error fetching disease prevalence:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch disease prevalence' });
  }
});

// GET /populations/:id/health-equity - Get health equity metrics
router.get('/:id/health-equity', requireUser, async (req: UserRequest, res) => {
  try {
    const measurePeriod = req.query.measurePeriod as string;
    const metrics = await populationService.getHealthEquityMetrics(req.params.id, measurePeriod);
    res.json({ data: metrics });
  } catch (error) {
    console.error('Error fetching health equity metrics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch health equity metrics' });
  }
});

// GET /populations/:id/fhir - Get FHIR R4 Group resource
router.get('/:id/fhir', requireUser, async (req: UserRequest, res) => {
  try {
    const population = await populationService.getPopulationById(req.params.id);

    if (!population) {
      res.status(404).json({ error: 'Not Found', message: 'Population not found' });
      return;
    }

    const fhirGroup = populationService.toFhirGroup(population);
    res.json(fhirGroup);
  } catch (error) {
    console.error('Error generating FHIR resource:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate FHIR resource' });
  }
});

export default router;
