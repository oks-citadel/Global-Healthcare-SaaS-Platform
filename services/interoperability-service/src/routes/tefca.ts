import { Router } from 'express';
import { z } from 'zod';
import TEFCAService from '../services/TEFCAService';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { networkQueryLimiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();

// Apply network query-specific rate limiting
router.use(networkQueryLimiter);

// Schema for TEFCA query
const tefcaQuerySchema = z.object({
  queryType: z.enum(['patient-discovery', 'document-query', 'document-retrieve']),
  patientDemographics: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
    }).optional(),
    ssn: z.string().optional(),
    mrn: z.string().optional(),
  }).optional(),
  documentQuery: z.object({
    patientId: z.string(),
    documentType: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }).optional(),
  documentRetrieve: z.object({
    documentId: z.string(),
    repositoryId: z.string(),
  }).optional(),
  purposeOfUse: z.enum([
    'TREATMENT',
    'PAYMENT',
    'OPERATIONS',
    'PUBLIC_HEALTH',
    'INDIVIDUAL_ACCESS',
  ]),
  requestingOrganization: z.object({
    name: z.string(),
    oid: z.string(),
    npi: z.string().optional(),
  }),
  targetQHINs: z.array(z.string()).optional(),
});

// Schema for participant registration
const registerParticipantSchema = z.object({
  organizationName: z.string(),
  organizationOid: z.string(),
  npi: z.string().optional(),
  tefcaRole: z.enum(['QHIN', 'Participant', 'Subparticipant']),
  capabilities: z.array(z.string()),
});

/**
 * POST /tefca/query
 * Execute a TEFCA query
 */
router.post('/query', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = tefcaQuerySchema.parse(req.body);

    const result = await TEFCAService.query(validatedData);

    if (!result.success) {
      res.status(400).json({
        error: 'TEFCA Query Failed',
        queryId: result.queryId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      queryId: result.queryId,
      results: result.results,
      responseTime: result.responseTime,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error executing TEFCA query', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to execute TEFCA query',
    });
  }
});

/**
 * POST /tefca/patient-discovery
 * Execute a patient discovery query
 */
router.post('/patient-discovery', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientDemographics, purposeOfUse, requestingOrganization, targetQHINs } = req.body;

    if (!patientDemographics) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'patientDemographics is required',
      });
      return;
    }

    const result = await TEFCAService.query({
      queryType: 'patient-discovery',
      patientDemographics,
      purposeOfUse: purposeOfUse || 'TREATMENT',
      requestingOrganization: requestingOrganization || {
        name: 'Default Organization',
        oid: '2.16.840.1.113883.3.0',
      },
      targetQHINs,
    });

    res.json({
      success: result.success,
      queryId: result.queryId,
      patients: result.results,
      errors: result.errors,
      responseTime: result.responseTime,
    });
  } catch (error: any) {
    logger.error('Error in patient discovery', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to execute patient discovery',
    });
  }
});

/**
 * POST /tefca/document-query
 * Execute a document query
 */
router.post('/document-query', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId, documentType, dateFrom, dateTo, purposeOfUse, requestingOrganization, targetQHINs } = req.body;

    if (!patientId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'patientId is required',
      });
      return;
    }

    const result = await TEFCAService.query({
      queryType: 'document-query',
      documentQuery: {
        patientId,
        documentType,
        dateFrom,
        dateTo,
      },
      purposeOfUse: purposeOfUse || 'TREATMENT',
      requestingOrganization: requestingOrganization || {
        name: 'Default Organization',
        oid: '2.16.840.1.113883.3.0',
      },
      targetQHINs,
    });

    res.json({
      success: result.success,
      queryId: result.queryId,
      documents: result.results,
      errors: result.errors,
      responseTime: result.responseTime,
    });
  } catch (error: any) {
    logger.error('Error in document query', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to execute document query',
    });
  }
});

/**
 * POST /tefca/document-retrieve
 * Retrieve a document
 */
router.post('/document-retrieve', requireUser, async (req: UserRequest, res) => {
  try {
    const { documentId, repositoryId, purposeOfUse, requestingOrganization } = req.body;

    if (!documentId || !repositoryId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'documentId and repositoryId are required',
      });
      return;
    }

    const result = await TEFCAService.query({
      queryType: 'document-retrieve',
      documentRetrieve: {
        documentId,
        repositoryId,
      },
      purposeOfUse: purposeOfUse || 'TREATMENT',
      requestingOrganization: requestingOrganization || {
        name: 'Default Organization',
        oid: '2.16.840.1.113883.3.0',
      },
    });

    if (!result.success || !result.results?.length) {
      res.status(404).json({
        error: 'Not Found',
        queryId: result.queryId,
        message: 'Document not found',
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      queryId: result.queryId,
      document: result.results[0],
      responseTime: result.responseTime,
    });
  } catch (error: any) {
    logger.error('Error retrieving document', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve document',
    });
  }
});

/**
 * GET /tefca/qhins
 * List available QHINs
 */
router.get('/qhins', requireUser, async (req: UserRequest, res) => {
  try {
    const qhins = TEFCAService.listQHINs();

    res.json({
      success: true,
      count: qhins.length,
      qhins,
    });
  } catch (error: any) {
    logger.error('Error listing QHINs', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list QHINs',
    });
  }
});

/**
 * POST /tefca/participants
 * Register as a TEFCA participant
 */
router.post('/participants', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = registerParticipantSchema.parse(req.body);

    const participant = await TEFCAService.registerParticipant(validatedData);

    res.status(201).json({
      success: true,
      participant,
      message: 'TEFCA participant registered successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error registering TEFCA participant', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register TEFCA participant',
    });
  }
});

/**
 * GET /tefca/participants/:participantId
 * Get participant status
 */
router.get('/participants/:participantId', requireUser, async (req: UserRequest, res) => {
  try {
    const { participantId } = req.params;

    const status = await TEFCAService.getParticipantStatus(participantId);

    if (!status) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Participant not found',
      });
      return;
    }

    res.json({
      success: true,
      participant: status,
    });
  } catch (error: any) {
    logger.error('Error getting participant status', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get participant status',
    });
  }
});

export default router;
