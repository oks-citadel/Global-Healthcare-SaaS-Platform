import { Router, RequestHandler } from 'express';
import { z } from 'zod';
import CarequalityService from '../services/CarequalityService';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { networkQueryLimiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();

// Apply network query-specific rate limiting
router.use(networkQueryLimiter as unknown as RequestHandler);

// Schema for Carequality query
const carequalityQuerySchema = z.object({
  queryType: z.enum(['patient-discovery', 'document-query', 'document-retrieve']),
  patient: z.object({
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
    identifiers: z.array(z.object({
      value: z.string(),
      system: z.string(),
    })).optional(),
  }).optional(),
  documentQuery: z.object({
    patientId: z.string(),
    homeCommunityId: z.string(),
    documentType: z.array(z.string()).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }).optional(),
  documentRetrieve: z.object({
    documentUniqueId: z.string(),
    repositoryUniqueId: z.string(),
    homeCommunityId: z.string(),
  }).optional(),
  purposeOfUse: z.string(),
  requestingOrganization: z.object({
    name: z.string(),
    oid: z.string(),
    homeCommunityId: z.string(),
  }),
  targetCommunities: z.array(z.string()).optional(),
});

// Schema for organization registration
const registerOrganizationSchema = z.object({
  organizationName: z.string(),
  homeCommunityId: z.string(),
  implementerOid: z.string(),
  npi: z.string().optional(),
  endpoints: z.array(z.object({
    service: z.string(),
    url: z.string().url(),
  })),
});

/**
 * POST /carequality/query
 * Execute a Carequality query
 */
router.post('/query', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = carequalityQuerySchema.parse(req.body);

    const result = await CarequalityService.query(validatedData);

    if (!result.success) {
      res.status(400).json({
        error: 'Carequality Query Failed',
        queryId: result.queryId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      queryId: result.queryId,
      results: result.results,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error executing Carequality query', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to execute Carequality query',
    });
  }
});

/**
 * POST /carequality/xcpd
 * Execute XCPD (Cross-Community Patient Discovery)
 */
router.post('/xcpd', requireUser, async (req: UserRequest, res) => {
  try {
    const { patient, purposeOfUse, requestingOrganization, targetCommunities } = req.body;

    if (!patient) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'patient demographics are required',
      });
      return;
    }

    const result = await CarequalityService.query({
      queryType: 'patient-discovery',
      patient,
      purposeOfUse: purposeOfUse || 'TREATMENT',
      requestingOrganization: requestingOrganization || {
        name: 'Default Organization',
        oid: '2.16.840.1.113883.3.0',
        homeCommunityId: '2.16.840.1.113883.3.0',
      },
      targetCommunities,
    });

    res.json({
      success: result.success,
      queryId: result.queryId,
      patients: result.results,
      errors: result.errors,
    });
  } catch (error: any) {
    logger.error('Error in XCPD query', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to execute XCPD query',
    });
  }
});

/**
 * POST /carequality/xca-query
 * Execute XCA Document Query
 */
router.post('/xca-query', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId, homeCommunityId, documentType, dateFrom, dateTo, purposeOfUse, requestingOrganization } = req.body;

    if (!patientId || !homeCommunityId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'patientId and homeCommunityId are required',
      });
      return;
    }

    const result = await CarequalityService.query({
      queryType: 'document-query',
      documentQuery: {
        patientId,
        homeCommunityId,
        documentType,
        dateFrom,
        dateTo,
      },
      purposeOfUse: purposeOfUse || 'TREATMENT',
      requestingOrganization: requestingOrganization || {
        name: 'Default Organization',
        oid: '2.16.840.1.113883.3.0',
        homeCommunityId: '2.16.840.1.113883.3.0',
      },
    });

    res.json({
      success: result.success,
      queryId: result.queryId,
      documents: result.results,
      errors: result.errors,
    });
  } catch (error: any) {
    logger.error('Error in XCA Query', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to execute XCA Query',
    });
  }
});

/**
 * POST /carequality/xca-retrieve
 * Execute XCA Document Retrieve
 */
router.post('/xca-retrieve', requireUser, async (req: UserRequest, res) => {
  try {
    const { documentUniqueId, repositoryUniqueId, homeCommunityId, purposeOfUse, requestingOrganization } = req.body;

    if (!documentUniqueId || !repositoryUniqueId || !homeCommunityId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'documentUniqueId, repositoryUniqueId, and homeCommunityId are required',
      });
      return;
    }

    const result = await CarequalityService.query({
      queryType: 'document-retrieve',
      documentRetrieve: {
        documentUniqueId,
        repositoryUniqueId,
        homeCommunityId,
      },
      purposeOfUse: purposeOfUse || 'TREATMENT',
      requestingOrganization: requestingOrganization || {
        name: 'Default Organization',
        oid: '2.16.840.1.113883.3.0',
        homeCommunityId: '2.16.840.1.113883.3.0',
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
    });
  } catch (error: any) {
    logger.error('Error in XCA Retrieve', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to execute XCA Retrieve',
    });
  }
});

/**
 * GET /carequality/directory
 * Search Carequality directory
 */
router.get('/directory', requireUser, async (req: UserRequest, res) => {
  try {
    const { name, state, services } = req.query;

    const results = await CarequalityService.searchDirectory({
      name: name as string,
      state: state as string,
      services: services ? (services as string).split(',') : undefined,
    });

    res.json({
      success: true,
      count: results.length,
      organizations: results,
    });
  } catch (error: any) {
    logger.error('Error searching directory', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search directory',
    });
  }
});

/**
 * POST /carequality/organizations
 * Register organization in Carequality
 */
router.post('/organizations', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = registerOrganizationSchema.parse(req.body);

    const organization = await CarequalityService.registerOrganization(validatedData);

    res.status(201).json({
      success: true,
      organization,
      message: 'Organization registered successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error registering organization', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register organization',
    });
  }
});

export default router;
