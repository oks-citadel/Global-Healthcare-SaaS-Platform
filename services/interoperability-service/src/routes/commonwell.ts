import { Router, RequestHandler } from 'express';
import { z } from 'zod';
import CommonWellService from '../services/CommonWellService';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { networkQueryLimiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();

// Apply network query-specific rate limiting
router.use(networkQueryLimiter as unknown as RequestHandler);

// Schema for patient search
const patientSearchSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  gender: z.string(),
  middleName: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  identifiers: z.array(z.object({
    value: z.string(),
    system: z.string(),
    type: z.string(),
  })).optional(),
});

// Schema for patient linking
const linkPatientSchema = z.object({
  localPatientId: z.string(),
  commonwellPersonId: z.string(),
  organizationId: z.string().optional(),
  linkStrength: z.enum(['definite', 'probable', 'possible']),
});

// Schema for consent update
const consentSchema = z.object({
  status: z.enum(['opt-in', 'opt-out']),
  purpose: z.array(z.string()).optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

// Schema for organization registration
const registerOrganizationSchema = z.object({
  name: z.string(),
  npi: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  contact: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
});

/**
 * POST /commonwell/search
 * Search for a person in CommonWell
 */
router.post('/search', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = patientSearchSchema.parse(req.body);

    const result = await CommonWellService.searchPerson(validatedData as any);

    if (!result.success) {
      res.status(400).json({
        error: 'Search Failed',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      requestId: result.requestId,
      matches: result.data?.matches || [],
      totalCount: result.data?.totalCount || 0,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error searching CommonWell', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search CommonWell',
    });
  }
});

/**
 * POST /commonwell/register
 * Register a new person in CommonWell
 */
router.post('/register', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = patientSearchSchema.parse(req.body);

    const result = await CommonWellService.registerPerson(validatedData as any);

    if (!result.success) {
      res.status(400).json({
        error: 'Registration Failed',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.status(201).json({
      success: true,
      requestId: result.requestId,
      personId: result.data?.personId,
      status: result.data?.status,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error registering person in CommonWell', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register person in CommonWell',
    });
  }
});

/**
 * POST /commonwell/link
 * Link a local patient to a CommonWell person
 */
router.post('/link', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = linkPatientSchema.parse(req.body);

    const result = await CommonWellService.linkPatient(validatedData as any);

    if (!result.success) {
      res.status(400).json({
        error: 'Linking Failed',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      requestId: result.requestId,
      linkId: result.data?.linkId,
      status: result.data?.status,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error linking patient', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to link patient',
    });
  }
});

/**
 * DELETE /commonwell/link/:personId/:patientId
 * Unlink a patient from CommonWell
 */
router.delete('/link/:personId/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const { personId, patientId } = req.params;

    const result = await CommonWellService.unlinkPatient(patientId, personId);

    if (!result.success) {
      res.status(400).json({
        error: 'Unlinking Failed',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      requestId: result.requestId,
      status: 'unlinked',
    });
  } catch (error: any) {
    logger.error('Error unlinking patient', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to unlink patient',
    });
  }
});

/**
 * GET /commonwell/person/:personId
 * Get person details from CommonWell
 */
router.get('/person/:personId', requireUser, async (req: UserRequest, res) => {
  try {
    const { personId } = req.params;

    const result = await CommonWellService.getPerson(personId);

    if (!result.success) {
      res.status(404).json({
        error: 'Not Found',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      requestId: result.requestId,
      person: result.data,
    });
  } catch (error: any) {
    logger.error('Error getting person', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get person',
    });
  }
});

/**
 * GET /commonwell/person/:personId/documents
 * Query documents for a person
 */
router.get('/person/:personId/documents', requireUser, async (req: UserRequest, res) => {
  try {
    const { personId } = req.params;
    const { documentType, dateFrom, dateTo } = req.query;

    const result = await CommonWellService.queryDocuments(personId, {
      documentType: documentType ? (documentType as string).split(',') : undefined,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
    });

    if (!result.success) {
      res.status(400).json({
        error: 'Query Failed',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      requestId: result.requestId,
      documents: result.data?.documents || [],
      totalCount: result.data?.totalCount || 0,
    });
  } catch (error: any) {
    logger.error('Error querying documents', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to query documents',
    });
  }
});

/**
 * GET /commonwell/person/:personId/documents/:documentId
 * Retrieve a specific document
 */
router.get('/person/:personId/documents/:documentId', requireUser, async (req: UserRequest, res) => {
  try {
    const { personId, documentId } = req.params;

    const result = await CommonWellService.retrieveDocument(personId, documentId);

    if (!result.success) {
      res.status(404).json({
        error: 'Not Found',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    // Return the document content with security headers
    // Security: Force download to prevent XSS via rendered HTML content
    const contentType = result.data?.contentType || 'application/octet-stream';
    const documentContent = Buffer.from(result.data?.content || '', 'base64');

    // Security headers to prevent XSS
    res.set('Content-Type', contentType);
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Content-Disposition', 'attachment'); // Force download, never render in browser
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    res.send(documentContent);
  } catch (error: any) {
    logger.error('Error retrieving document', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve document',
    });
  }
});

/**
 * PUT /commonwell/person/:personId/consent
 * Update consent preferences
 */
router.put('/person/:personId/consent', requireUser, async (req: UserRequest, res) => {
  try {
    const { personId } = req.params;
    const validatedData = consentSchema.parse(req.body);

    const result = await CommonWellService.updateConsent(personId, validatedData as any);

    if (!result.success) {
      res.status(400).json({
        error: 'Consent Update Failed',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      requestId: result.requestId,
      consentId: result.data?.consentId,
      status: result.data?.status,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error updating consent', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update consent',
    });
  }
});

/**
 * GET /commonwell/person/:personId/consent
 * Get consent status
 */
router.get('/person/:personId/consent', requireUser, async (req: UserRequest, res) => {
  try {
    const { personId } = req.params;

    const result = await CommonWellService.getConsent(personId);

    if (!result.success) {
      res.status(404).json({
        error: 'Not Found',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.json({
      success: true,
      requestId: result.requestId,
      consent: result.data,
    });
  } catch (error: any) {
    logger.error('Error getting consent', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get consent',
    });
  }
});

/**
 * POST /commonwell/organizations
 * Register organization in CommonWell
 */
router.post('/organizations', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = registerOrganizationSchema.parse(req.body);

    const result = await CommonWellService.registerOrganization(validatedData as any);

    if (!result.success) {
      res.status(400).json({
        error: 'Registration Failed',
        requestId: result.requestId,
        errors: result.errors,
      });
      return;
    }

    res.status(201).json({
      success: true,
      requestId: result.requestId,
      organizationId: result.data?.organizationId,
      status: result.data?.status,
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

/**
 * GET /commonwell/status
 * Get network status
 */
router.get('/status', requireUser, async (req: UserRequest, res) => {
  try {
    const result = await CommonWellService.getNetworkStatus();

    res.json({
      success: result.success,
      requestId: result.requestId,
      status: result.data,
    });
  } catch (error: any) {
    logger.error('Error getting network status', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get network status',
    });
  }
});

export default router;
