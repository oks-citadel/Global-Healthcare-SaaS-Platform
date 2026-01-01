import { Router, RequestHandler } from 'express';
import { z } from 'zod';
import FhirProxyService from '../services/FhirProxyService';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { fhirLimiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();

// Apply FHIR-specific rate limiting
router.use(fhirLimiter as unknown as RequestHandler);

// Schema for endpoint registration
const registerEndpointSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  fhirVersion: z.enum(['R4', 'STU3', 'DSTU2']),
  authType: z.enum(['none', 'basic', 'oauth2', 'smart_on_fhir']),
  tokenEndpoint: z.string().url().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  scopes: z.array(z.string()).optional(),
  organizationName: z.string().optional(),
  organizationNpi: z.string().optional(),
});

/**
 * GET /fhir/metadata
 * Get capability statements from connected FHIR endpoints
 */
router.get('/metadata', async (req: UserRequest, res) => {
  try {
    const endpointId = req.query.endpointId as string;

    if (!endpointId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'endpointId query parameter is required',
      });
      return;
    }

    const result = await FhirProxyService.getCapabilityStatement(endpointId);

    if (!result.success) {
      res.status(result.statusCode).json({
        error: 'FHIR Error',
        message: result.error,
      });
      return;
    }

    res.json(result.data);
  } catch (error: any) {
    logger.error('Error fetching FHIR metadata', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch FHIR metadata',
    });
  }
});

/**
 * POST /fhir/endpoints
 * Register a new FHIR endpoint
 */
router.post('/endpoints', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = registerEndpointSchema.parse(req.body);

    const result = await FhirProxyService.registerEndpoint(validatedData as any);

    if (!result.success) {
      res.status(result.statusCode).json({
        error: 'Registration Failed',
        message: result.error,
      });
      return;
    }

    res.status(201).json({
      data: result.data,
      message: 'FHIR endpoint registered successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error registering FHIR endpoint', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register FHIR endpoint',
    });
  }
});

/**
 * GET /fhir/:resourceType
 * Search for FHIR resources
 */
router.get('/:resourceType', requireUser, async (req: UserRequest, res) => {
  try {
    const { resourceType } = req.params;
    const endpointId = req.query.endpointId as string;
    const { endpointId: _, ...searchParams } = req.query;

    const result = await FhirProxyService.routeRequest({
      resourceType,
      operation: 'search',
      parameters: searchParams as Record<string, string>,
      endpointId,
    });

    if (!result.success) {
      res.status(result.statusCode).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'processing',
          diagnostics: result.error,
        }],
      });
      return;
    }

    res.json(result.data);
  } catch (error: any) {
    logger.error('Error searching FHIR resources', { error: error.message });
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Internal server error',
      }],
    });
  }
});

/**
 * GET /fhir/:resourceType/:id
 * Read a specific FHIR resource
 */
router.get('/:resourceType/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { resourceType, id } = req.params;
    const endpointId = req.query.endpointId as string;

    const result = await FhirProxyService.routeRequest({
      resourceType,
      operation: 'read',
      resourceId: id,
      endpointId,
    });

    if (!result.success) {
      res.status(result.statusCode).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: result.statusCode === 404 ? 'not-found' : 'processing',
          diagnostics: result.error,
        }],
      });
      return;
    }

    res.json(result.data);
  } catch (error: any) {
    logger.error('Error reading FHIR resource', { error: error.message });
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Internal server error',
      }],
    });
  }
});

/**
 * POST /fhir/:resourceType
 * Create a new FHIR resource
 */
router.post('/:resourceType', requireUser, async (req: UserRequest, res) => {
  try {
    const { resourceType } = req.params;
    const endpointId = req.query.endpointId as string;

    const result = await FhirProxyService.routeRequest({
      resourceType,
      operation: 'create',
      body: req.body,
      endpointId,
    });

    if (!result.success) {
      res.status(result.statusCode).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'processing',
          diagnostics: result.error,
        }],
      });
      return;
    }

    res.status(201).json(result.data);
  } catch (error: any) {
    logger.error('Error creating FHIR resource', { error: error.message });
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Internal server error',
      }],
    });
  }
});

/**
 * PUT /fhir/:resourceType/:id
 * Update a FHIR resource
 */
router.put('/:resourceType/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { resourceType, id } = req.params;
    const endpointId = req.query.endpointId as string;

    const result = await FhirProxyService.routeRequest({
      resourceType,
      operation: 'update',
      resourceId: id,
      body: req.body,
      endpointId,
    });

    if (!result.success) {
      res.status(result.statusCode).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'processing',
          diagnostics: result.error,
        }],
      });
      return;
    }

    res.json(result.data);
  } catch (error: any) {
    logger.error('Error updating FHIR resource', { error: error.message });
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Internal server error',
      }],
    });
  }
});

/**
 * DELETE /fhir/:resourceType/:id
 * Delete a FHIR resource
 */
router.delete('/:resourceType/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { resourceType, id } = req.params;
    const endpointId = req.query.endpointId as string;

    const result = await FhirProxyService.routeRequest({
      resourceType,
      operation: 'delete',
      resourceId: id,
      endpointId,
    });

    if (!result.success) {
      res.status(result.statusCode).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'processing',
          diagnostics: result.error,
        }],
      });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    logger.error('Error deleting FHIR resource', { error: error.message });
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Internal server error',
      }],
    });
  }
});

/**
 * POST /fhir/$search-all
 * Search across all connected endpoints
 */
router.post('/\\$search-all', requireUser, async (req: UserRequest, res) => {
  try {
    const { resourceType, parameters, endpointIds } = req.body;

    if (!resourceType) {
      res.status(400).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'required',
          diagnostics: 'resourceType is required',
        }],
      });
      return;
    }

    const result = await FhirProxyService.searchAcrossEndpoints(
      resourceType,
      parameters || {},
      endpointIds
    );

    if (!result.success) {
      res.status(result.statusCode).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'processing',
          diagnostics: result.error,
        }],
      });
      return;
    }

    res.json(result.data);
  } catch (error: any) {
    logger.error('Error in cross-endpoint search', { error: error.message });
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Internal server error',
      }],
    });
  }
});

/**
 * POST /fhir (Bundle)
 * Execute a FHIR batch or transaction
 */
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const bundle = req.body;
    const endpointId = req.query.endpointId as string;

    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      res.status(400).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'invalid',
          diagnostics: 'Request body must be a FHIR Bundle',
        }],
      });
      return;
    }

    if (!endpointId) {
      res.status(400).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'required',
          diagnostics: 'endpointId query parameter is required',
        }],
      });
      return;
    }

    const result = await FhirProxyService.executeBatch(bundle, endpointId);

    if (!result.success) {
      res.status(result.statusCode).json({
        resourceType: 'OperationOutcome',
        issue: [{
          severity: 'error',
          code: 'processing',
          diagnostics: result.error,
        }],
      });
      return;
    }

    res.json(result.data);
  } catch (error: any) {
    logger.error('Error executing FHIR batch', { error: error.message });
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Internal server error',
      }],
    });
  }
});

export default router;
