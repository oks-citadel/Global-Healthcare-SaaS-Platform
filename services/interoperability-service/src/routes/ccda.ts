import { Router } from 'express';
import { z } from 'zod';
import CCDAExchangeService from '../services/CCDAExchangeService';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { documentLimiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();

// Apply document-specific rate limiting
router.use(documentLimiter);

// Schema for C-CDA document generation
const generateDocumentSchema = z.object({
  documentType: z.enum([
    'ccd',
    'discharge_summary',
    'progress_note',
    'history_and_physical',
    'consultation_note',
    'operative_note',
    'procedure_note',
    'referral_note',
    'transfer_summary',
    'care_plan',
  ]),
  patientId: z.string(),
  patient: z.object({
    firstName: z.string(),
    lastName: z.string(),
    dob: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
    }).optional(),
    phone: z.string().optional(),
  }),
  author: z.object({
    name: z.string(),
    organization: z.string(),
    npi: z.string().optional(),
  }),
  sections: z.array(z.object({
    code: z.string(),
    title: z.string(),
    entries: z.array(z.any()),
  })),
});

// Schema for document query
const querySchema = z.object({
  patientId: z.string().optional(),
  documentType: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  authorOrganization: z.string().optional(),
});

/**
 * POST /ccda/parse
 * Parse a C-CDA document from XML
 */
router.post('/parse', requireUser, async (req: UserRequest, res) => {
  try {
    const xmlContent = typeof req.body === 'string' ? req.body : req.body.content;

    if (!xmlContent) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'C-CDA XML content is required',
      });
      return;
    }

    const document = CCDAExchangeService.parse(xmlContent);

    res.json({
      success: true,
      document: {
        id: document.id,
        documentType: document.documentType,
        patientId: document.patientId,
        title: document.title,
        creationTime: document.creationTime,
        author: document.author,
        sectionCount: document.sections.length,
        sections: document.sections.map(s => ({
          code: s.code,
          title: s.title,
        })),
      },
    });
  } catch (error: any) {
    logger.error('Error parsing C-CDA', { error: error.message });
    res.status(400).json({
      error: 'Parse Error',
      message: error.message,
    });
  }
});

/**
 * POST /ccda/validate
 * Validate a C-CDA document
 */
router.post('/validate', requireUser, async (req: UserRequest, res) => {
  try {
    const xmlContent = typeof req.body === 'string' ? req.body : req.body.content;

    if (!xmlContent) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'C-CDA XML content is required',
      });
      return;
    }

    const result = CCDAExchangeService.validate(xmlContent);

    res.json({
      valid: result.valid,
      errors: result.errors,
    });
  } catch (error: any) {
    logger.error('Error validating C-CDA', { error: error.message });
    res.status(500).json({
      error: 'Validation Error',
      message: error.message,
    });
  }
});

/**
 * POST /ccda/generate
 * Generate a C-CDA document from structured data
 */
router.post('/generate', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = generateDocumentSchema.parse(req.body);

    const xmlContent = CCDAExchangeService.generate(validatedData);

    res.set('Content-Type', 'application/xml');
    res.send(xmlContent);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error generating C-CDA', { error: error.message });
    res.status(500).json({
      error: 'Generation Error',
      message: error.message,
    });
  }
});

/**
 * POST /ccda/store
 * Store a C-CDA document
 */
router.post('/store', requireUser, async (req: UserRequest, res) => {
  try {
    const xmlContent = typeof req.body === 'string' ? req.body : req.body.content;
    const source = req.body.source;

    if (!xmlContent) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'C-CDA XML content is required',
      });
      return;
    }

    // Parse the document
    const document = CCDAExchangeService.parse(xmlContent);

    // Store the document
    const id = await CCDAExchangeService.store(document, source);

    res.status(201).json({
      success: true,
      id,
      documentId: document.id,
      message: 'Document stored successfully',
    });
  } catch (error: any) {
    logger.error('Error storing C-CDA', { error: error.message });
    res.status(500).json({
      error: 'Storage Error',
      message: error.message,
    });
  }
});

/**
 * GET /ccda/query
 * Query stored C-CDA documents
 */
router.get('/query', requireUser, async (req: UserRequest, res) => {
  try {
    const params = querySchema.parse(req.query);

    const documents = await CCDAExchangeService.query({
      patientId: params.patientId,
      documentType: params.documentType,
      dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
      dateTo: params.dateTo ? new Date(params.dateTo) : undefined,
      authorOrganization: params.authorOrganization,
    });

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error querying C-CDA documents', { error: error.message });
    res.status(500).json({
      error: 'Query Error',
      message: error.message,
    });
  }
});

/**
 * GET /ccda/:documentId
 * Retrieve a specific C-CDA document
 */
router.get('/:documentId', requireUser, async (req: UserRequest, res) => {
  try {
    const { documentId } = req.params;

    const document = await CCDAExchangeService.retrieve(documentId);

    if (!document) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Document not found',
      });
      return;
    }

    res.json({
      success: true,
      document,
    });
  } catch (error: any) {
    logger.error('Error retrieving C-CDA document', { error: error.message });
    res.status(500).json({
      error: 'Retrieval Error',
      message: error.message,
    });
  }
});

/**
 * POST /ccda/to-fhir
 * Convert a C-CDA document to FHIR Bundle
 */
router.post('/to-fhir', requireUser, async (req: UserRequest, res) => {
  try {
    const xmlContent = typeof req.body === 'string' ? req.body : req.body.content;

    if (!xmlContent) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'C-CDA XML content is required',
      });
      return;
    }

    // Parse the document
    const document = CCDAExchangeService.parse(xmlContent);

    // Convert to FHIR
    const fhirBundle = CCDAExchangeService.toFhir(document);

    res.json(fhirBundle);
  } catch (error: any) {
    logger.error('Error converting C-CDA to FHIR', { error: error.message });
    res.status(500).json({
      error: 'Conversion Error',
      message: error.message,
    });
  }
});

export default router;
