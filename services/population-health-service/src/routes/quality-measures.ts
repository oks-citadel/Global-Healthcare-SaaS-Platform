import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import qualityMeasuresService from '../services/quality-measures.service';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const createMeasureSchema = z.object({
  measureId: z.string().min(1),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  measureType: z.enum(['process', 'outcome', 'structure', 'patient_experience', 'intermediate_outcome', 'composite']),
  category: z.enum(['hedis', 'cms_stars', 'mips', 'pcmh', 'aco', 'state_medicaid', 'commercial', 'custom']),
  steward: z.string().optional(),
  domain: z.string().optional(),
  fhirMeasureId: z.string().optional(),
  fhirVersion: z.string().optional(),
  numeratorCriteria: z.record(z.any()).optional(),
  denominatorCriteria: z.record(z.any()).optional(),
  exclusionCriteria: z.record(z.any()).optional(),
  targetRate: z.number().min(0).max(100).optional(),
  reportingYear: z.number().optional(),
});

const updatePatientMeasureSchema = z.object({
  inDenominator: z.boolean().optional(),
  inNumerator: z.boolean().optional(),
  isExcluded: z.boolean().optional(),
  exclusionReason: z.string().optional(),
  status: z.enum(['pending', 'compliant', 'non_compliant', 'excluded', 'not_applicable']).optional(),
  dueDate: z.string().datetime().optional(),
  completedDate: z.string().datetime().optional(),
  evidenceRef: z.string().optional(),
  notes: z.string().optional(),
  fhirPatientRef: z.string().optional(),
});

// GET /quality-measures - List all quality measures
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const filters = {
      category: req.query.category as any,
      measureType: req.query.measureType as any,
      reportingYear: req.query.reportingYear ? parseInt(req.query.reportingYear as string) : undefined,
      isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      search: req.query.search as string,
    };

    const measures = await qualityMeasuresService.getQualityMeasures(filters);
    res.json({ data: measures, count: measures.length });
  } catch (error) {
    console.error('Error fetching quality measures:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch quality measures' });
  }
});

// POST /quality-measures - Create a new quality measure
router.post('/', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const validated = createMeasureSchema.parse(req.body);

    const measure = await qualityMeasuresService.createQualityMeasure(validated);
    res.status(201).json({ data: measure, message: 'Quality measure created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating quality measure:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create quality measure' });
  }
});

// POST /quality-measures/seed-hedis - Seed HEDIS measures
router.post('/seed-hedis', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    const count = await qualityMeasuresService.seedHedisMeasures();
    res.json({ message: `Successfully seeded ${count} HEDIS measures` });
  } catch (error) {
    console.error('Error seeding HEDIS measures:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to seed HEDIS measures' });
  }
});

// GET /quality-measures/:id - Get quality measure by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const measure = await qualityMeasuresService.getQualityMeasureById(req.params.id);

    if (!measure) {
      res.status(404).json({ error: 'Not Found', message: 'Quality measure not found' });
      return;
    }

    res.json({ data: measure });
  } catch (error) {
    console.error('Error fetching quality measure:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch quality measure' });
  }
});

// GET /quality-measures/:id/fhir - Get FHIR R4 Measure resource
router.get('/:id/fhir', requireUser, async (req: UserRequest, res) => {
  try {
    const measure = await qualityMeasuresService.getQualityMeasureById(req.params.id);

    if (!measure) {
      res.status(404).json({ error: 'Not Found', message: 'Quality measure not found' });
      return;
    }

    const fhirMeasure = qualityMeasuresService.toFhirMeasure(measure);
    res.json(fhirMeasure);
  } catch (error) {
    console.error('Error generating FHIR resource:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate FHIR resource' });
  }
});

// GET /quality-measures/population/:populationId/scorecard - Get population quality scorecard
router.get('/population/:populationId/scorecard', requireUser, async (req: UserRequest, res) => {
  try {
    const measurePeriod = (req.query.measurePeriod as string) || new Date().getFullYear().toString();
    const scorecard = await qualityMeasuresService.getPopulationScorecard(req.params.populationId, measurePeriod);
    res.json({ data: scorecard });
  } catch (error) {
    console.error('Error fetching population scorecard:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch population scorecard' });
  }
});

// POST /quality-measures/population/:populationId/calculate - Calculate population performance
router.post('/population/:populationId/calculate', requireUser, requireRole('admin', 'analyst'), async (req: UserRequest, res) => {
  try {
    const { qualityMeasureId, measurePeriod } = req.body;

    if (!qualityMeasureId || !measurePeriod) {
      res.status(400).json({ error: 'Bad Request', message: 'qualityMeasureId and measurePeriod are required' });
      return;
    }

    const performance = await qualityMeasuresService.calculatePopulationPerformance(
      req.params.populationId,
      qualityMeasureId,
      measurePeriod
    );

    if (!performance) {
      res.status(404).json({ error: 'Not Found', message: 'Quality measure not found' });
      return;
    }

    res.json({ data: performance, message: 'Performance calculated successfully' });
  } catch (error) {
    console.error('Error calculating population performance:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to calculate performance' });
  }
});

// GET /quality-measures/population/:populationId/care-gaps - Get care gaps for quality measures
router.get('/population/:populationId/care-gaps', requireUser, async (req: UserRequest, res) => {
  try {
    const measurePeriod = (req.query.measurePeriod as string) || new Date().getFullYear().toString();
    const careGaps = await qualityMeasuresService.identifyCareGaps(req.params.populationId, measurePeriod);
    res.json({ data: careGaps });
  } catch (error) {
    console.error('Error identifying care gaps:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to identify care gaps' });
  }
});

// GET /quality-measures/patient/:patientId - Get patient quality measures
router.get('/patient/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const measurePeriod = req.query.measurePeriod as string;
    const measures = await qualityMeasuresService.getPatientMeasures(req.params.patientId, measurePeriod);
    res.json({ data: measures, count: measures.length });
  } catch (error) {
    console.error('Error fetching patient measures:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch patient measures' });
  }
});

// PUT /quality-measures/patient/:patientId/:measureId - Update patient quality measure
router.put('/patient/:patientId/:measureId', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = updatePatientMeasureSchema.parse(req.body);
    const measurePeriod = (req.query.measurePeriod as string) || new Date().getFullYear().toString();

    const patientMeasure = await qualityMeasuresService.updatePatientMeasure(
      req.params.patientId,
      req.params.measureId,
      measurePeriod,
      {
        ...validated,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
        completedDate: validated.completedDate ? new Date(validated.completedDate) : undefined,
      }
    );

    res.json({ data: patientMeasure, message: 'Patient measure updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating patient measure:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update patient measure' });
  }
});

// GET /quality-measures/categories - Get available measure categories
router.get('/meta/categories', requireUser, async (req: UserRequest, res) => {
  try {
    const categories = [
      { code: 'hedis', name: 'HEDIS', description: 'Healthcare Effectiveness Data and Information Set' },
      { code: 'cms_stars', name: 'CMS Star Ratings', description: 'Medicare Advantage Star Ratings' },
      { code: 'mips', name: 'MIPS', description: 'Merit-based Incentive Payment System' },
      { code: 'pcmh', name: 'PCMH', description: 'Patient-Centered Medical Home' },
      { code: 'aco', name: 'ACO', description: 'Accountable Care Organization measures' },
      { code: 'state_medicaid', name: 'State Medicaid', description: 'State Medicaid quality measures' },
      { code: 'commercial', name: 'Commercial', description: 'Commercial payer measures' },
      { code: 'custom', name: 'Custom', description: 'Organization-specific measures' },
    ];
    res.json({ data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch categories' });
  }
});

// GET /quality-measures/domains - Get available measure domains
router.get('/meta/domains', requireUser, async (req: UserRequest, res) => {
  try {
    const domains = [
      { code: 'prevention', name: 'Prevention & Screening' },
      { code: 'chronic', name: 'Chronic Disease Management' },
      { code: 'behavioral', name: 'Behavioral Health' },
      { code: 'medication', name: 'Medication Management' },
      { code: 'access', name: 'Access to Care' },
      { code: 'patient_safety', name: 'Patient Safety' },
      { code: 'patient_experience', name: 'Patient Experience' },
      { code: 'efficiency', name: 'Efficiency & Cost' },
    ];
    res.json({ data: domains });
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch domains' });
  }
});

export default router;
