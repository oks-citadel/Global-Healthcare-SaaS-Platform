import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import riskStratificationService, { RiskScoreInput } from '../services/risk-stratification.service';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const createRiskScoreSchema = z.object({
  patientId: z.string().uuid(),
  fhirPatientRef: z.string().optional(),
  modelName: z.string().min(1),
  modelVersion: z.string().optional(),
  scoreType: z.enum(['hcc_raf', 'cdps', 'hospitalization_risk', 'ed_utilization', 'readmission_risk', 'mortality_risk', 'cost_prediction', 'composite', 'custom']),
  rawScore: z.number(),
  riskFactors: z.array(z.record(z.any())).optional(),
  clinicalFactors: z.record(z.any()).optional(),
  socialFactors: z.record(z.any()).optional(),
  predictedCost: z.number().optional(),
  predictedEvents: z.record(z.any()).optional(),
});

const calculateHccSchema = z.object({
  patientId: z.string().uuid(),
  conditions: z.array(z.string()),
});

const calculateHospitalizationSchema = z.object({
  patientId: z.string().uuid(),
  age: z.number().min(0).max(150),
  conditions: z.array(z.string()),
  priorHospitalizations: z.number().min(0),
  priorEdVisits: z.number().min(0),
  medicationCount: z.number().min(0),
  hasCaregiver: z.boolean(),
});

// GET /risk-stratification - List risk scores
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const filters = {
      patientId: req.query.patientId as string,
      modelName: req.query.modelName as string,
      scoreType: req.query.scoreType as any,
      riskTier: req.query.riskTier as any,
      isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    };

    const result = await riskStratificationService.getRiskScores(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching risk scores:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch risk scores' });
  }
});

// POST /risk-stratification - Create a risk score
router.post('/', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = createRiskScoreSchema.parse(req.body);

    const riskScore = await riskStratificationService.createRiskScore(validated as RiskScoreInput);
    res.status(201).json({ data: riskScore, message: 'Risk score created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating risk score:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create risk score' });
  }
});

// GET /risk-stratification/:id - Get risk score by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const riskScore = await riskStratificationService.getRiskScoreById(req.params.id);

    if (!riskScore) {
      res.status(404).json({ error: 'Not Found', message: 'Risk score not found' });
      return;
    }

    res.json({ data: riskScore });
  } catch (error) {
    console.error('Error fetching risk score:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch risk score' });
  }
});

// GET /risk-stratification/:id/fhir - Get FHIR R4 RiskAssessment resource
router.get('/:id/fhir', requireUser, async (req: UserRequest, res) => {
  try {
    const riskScore = await riskStratificationService.getRiskScoreById(req.params.id);

    if (!riskScore) {
      res.status(404).json({ error: 'Not Found', message: 'Risk score not found' });
      return;
    }

    const fhirRiskAssessment = riskStratificationService.toFhirRiskAssessment(riskScore);
    res.json(fhirRiskAssessment);
  } catch (error) {
    console.error('Error generating FHIR resource:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate FHIR resource' });
  }
});

// GET /risk-stratification/patient/:patientId/profile - Get patient risk profile
router.get('/patient/:patientId/profile', requireUser, async (req: UserRequest, res) => {
  try {
    const profile = await riskStratificationService.getPatientRiskProfile(req.params.patientId);

    if (!profile) {
      res.status(404).json({ error: 'Not Found', message: 'No risk scores found for patient' });
      return;
    }

    res.json({ data: profile });
  } catch (error) {
    console.error('Error fetching patient risk profile:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch patient risk profile' });
  }
});

// POST /risk-stratification/calculate/hcc - Calculate HCC risk score
router.post('/calculate/hcc', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = calculateHccSchema.parse(req.body);

    const scoreInput = await riskStratificationService.calculateHccScore(
      validated.patientId,
      validated.conditions
    );

    // Create the risk score
    const riskScore = await riskStratificationService.createRiskScore(scoreInput);

    res.status(201).json({
      data: riskScore,
      message: 'HCC risk score calculated and saved successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error calculating HCC score:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to calculate HCC score' });
  }
});

// POST /risk-stratification/calculate/hospitalization - Calculate hospitalization risk
router.post('/calculate/hospitalization', requireUser, requireRole('admin', 'analyst', 'provider'), async (req: UserRequest, res) => {
  try {
    const validated = calculateHospitalizationSchema.parse(req.body);

    const scoreInput = await riskStratificationService.calculateHospitalizationRisk(
      validated.patientId,
      {
        age: validated.age,
        conditions: validated.conditions,
        priorHospitalizations: validated.priorHospitalizations,
        priorEdVisits: validated.priorEdVisits,
        medicationCount: validated.medicationCount,
        hasCaregiver: validated.hasCaregiver,
      }
    );

    // Create the risk score
    const riskScore = await riskStratificationService.createRiskScore(scoreInput);

    res.status(201).json({
      data: riskScore,
      message: 'Hospitalization risk score calculated and saved successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error calculating hospitalization risk:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to calculate hospitalization risk' });
  }
});

// GET /risk-stratification/cohort/:cohortId/stratification - Get cohort risk stratification
router.get('/cohort/:cohortId/stratification', requireUser, async (req: UserRequest, res) => {
  try {
    const stratification = await riskStratificationService.stratifyCohort(req.params.cohortId);
    res.json({ data: stratification });
  } catch (error) {
    console.error('Error fetching cohort stratification:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch cohort stratification' });
  }
});

// GET /risk-stratification/population/:populationId/distribution - Get population risk distribution
router.get('/population/:populationId/distribution', requireUser, async (req: UserRequest, res) => {
  try {
    const distribution = await riskStratificationService.getPopulationRiskDistribution(req.params.populationId);
    res.json({ data: distribution });
  } catch (error) {
    console.error('Error fetching population risk distribution:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch population risk distribution' });
  }
});

// GET /risk-stratification/high-risk - Get high-risk patients
router.get('/high-risk/patients', requireUser, async (req: UserRequest, res) => {
  try {
    const options = {
      populationId: req.query.populationId as string,
      minRiskScore: req.query.minRiskScore ? parseFloat(req.query.minRiskScore as string) : undefined,
      riskTiers: req.query.riskTiers ? (req.query.riskTiers as string).split(',') as any[] : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    };

    const patients = await riskStratificationService.getHighRiskPatients(options);
    res.json({ data: patients, count: patients.length });
  } catch (error) {
    console.error('Error fetching high-risk patients:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch high-risk patients' });
  }
});

// GET /risk-stratification/models - Get available risk models
router.get('/meta/models', requireUser, async (req: UserRequest, res) => {
  try {
    const models = [
      {
        name: 'CMS-HCC',
        description: 'CMS Hierarchical Condition Categories Risk Adjustment Factor',
        scoreType: 'hcc_raf',
        version: 'V24',
      },
      {
        name: 'Hospitalization-Risk',
        description: 'Predictive model for 30-day hospitalization risk',
        scoreType: 'hospitalization_risk',
        version: '1.0',
      },
      {
        name: 'Readmission-Risk',
        description: 'Predictive model for 30-day readmission risk',
        scoreType: 'readmission_risk',
        version: '1.0',
      },
      {
        name: 'ED-Utilization',
        description: 'Predictive model for emergency department utilization',
        scoreType: 'ed_utilization',
        version: '1.0',
      },
      {
        name: 'Cost-Prediction',
        description: 'Predictive model for annual healthcare costs',
        scoreType: 'cost_prediction',
        version: '1.0',
      },
    ];
    res.json({ data: models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch models' });
  }
});

// GET /risk-stratification/tiers - Get risk tier definitions
router.get('/meta/tiers', requireUser, async (req: UserRequest, res) => {
  try {
    const tiers = [
      { tier: 'low', scoreRange: '0-25', description: 'Low risk, routine care', color: '#4CAF50' },
      { tier: 'moderate', scoreRange: '25-50', description: 'Moderate risk, enhanced monitoring', color: '#FFC107' },
      { tier: 'high', scoreRange: '50-75', description: 'High risk, active care management', color: '#FF9800' },
      { tier: 'very_high', scoreRange: '75-90', description: 'Very high risk, intensive intervention', color: '#F44336' },
      { tier: 'critical', scoreRange: '90-100', description: 'Critical risk, immediate action required', color: '#9C27B0' },
    ];
    res.json({ data: tiers });
  } catch (error) {
    console.error('Error fetching tiers:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch tiers' });
  }
});

export default router;
