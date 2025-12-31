import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireAdmin, requireOrganization } from '../middleware/extractUser';
import mrfGeneratorService from '../services/mrf-generator.service';
import { MRFFileType, MRFStatus } from '../generated/client';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const generateMRFSchema = z.object({
  fileType: z.enum([
    'standard_charges',
    'in_network_rates',
    'out_of_network_allowed',
    'prescription_drugs',
    'negotiated_rates',
  ]),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
  outputFormat: z.enum(['json', 'csv']).optional().default('json'),
});

const publishMRFSchema = z.object({
  fileUrl: z.string().url('Valid URL required'),
});

/**
 * @route POST /mrf/generate
 * @desc Generate a Machine-Readable File
 * @access Private (admin only)
 */
router.post('/generate', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const validation = generateMRFSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const organizationId = req.user!.organizationId!;
    const { fileType, validFrom, validTo, outputFormat } = validation.data;

    const result = await mrfGeneratorService.generateMRF({
      organizationId,
      fileType: fileType as MRFFileType,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validTo: validTo ? new Date(validTo) : undefined,
      outputFormat,
    });

    res.status(201).json({
      data: {
        mrfRecord: result.mrfRecord,
        format: result.format,
        contentPreview: typeof result.content === 'string'
          ? result.content.substring(0, 1000) + (result.content.length > 1000 ? '...' : '')
          : JSON.stringify(result.content).substring(0, 1000) + '...',
      },
      message: 'Machine-readable file generated successfully',
    });
  } catch (error) {
    console.error('Error generating MRF:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate machine-readable file',
    });
  }
});

/**
 * @route GET /mrf/download/:id
 * @desc Download a generated MRF file
 * @access Private (admin only)
 */
router.get('/download/:id', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    const organizationId = req.user!.organizationId!;

    const mrfRecord = await mrfGeneratorService.getMRFFile(id);

    if (!mrfRecord) {
      res.status(404).json({
        error: 'Not Found',
        message: 'MRF file not found',
      });
      return;
    }

    if (mrfRecord.organizationId !== organizationId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    // Regenerate content for download
    const result = await mrfGeneratorService.generateMRF({
      organizationId,
      fileType: mrfRecord.fileType,
      validFrom: mrfRecord.validFrom,
      validTo: mrfRecord.validTo,
      outputFormat: (format as 'json' | 'csv') || 'json',
    });

    const outputFormat = (format as string) || 'json';
    const fileName = mrfRecord.fileName.replace(/\.(json|csv)$/, `.${outputFormat}`);

    if (outputFormat === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(result.content);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.json(result.content);
    }
  } catch (error) {
    console.error('Error downloading MRF:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to download machine-readable file',
    });
  }
});

/**
 * @route GET /mrf
 * @desc List generated MRF files
 * @access Private (admin only)
 */
router.get('/', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId!;
    const { fileType, status } = req.query;

    const files = await mrfGeneratorService.listMRFFiles(
      organizationId,
      fileType as MRFFileType | undefined,
      status as MRFStatus | undefined
    );

    res.json({
      data: files,
      count: files.length,
    });
  } catch (error) {
    console.error('Error listing MRF files:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list MRF files',
    });
  }
});

/**
 * @route GET /mrf/:id
 * @desc Get MRF file details
 * @access Private (admin only)
 */
router.get('/:id', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId!;

    const file = await mrfGeneratorService.getMRFFile(id);

    if (!file) {
      res.status(404).json({
        error: 'Not Found',
        message: 'MRF file not found',
      });
      return;
    }

    if (file.organizationId !== organizationId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: file });
  } catch (error) {
    console.error('Error fetching MRF file:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch MRF file',
    });
  }
});

/**
 * @route POST /mrf/:id/publish
 * @desc Mark MRF file as published
 * @access Private (admin only)
 */
router.post('/:id/publish', requireUser, requireAdmin, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId!;

    const validation = publishMRFSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const file = await mrfGeneratorService.getMRFFile(id);

    if (!file) {
      res.status(404).json({
        error: 'Not Found',
        message: 'MRF file not found',
      });
      return;
    }

    if (file.organizationId !== organizationId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    if (file.status !== 'generated') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Only generated files can be published',
      });
      return;
    }

    const { fileUrl } = validation.data;
    const updatedFile = await mrfGeneratorService.publishMRFFile(id, fileUrl);

    res.json({
      data: updatedFile,
      message: 'MRF file marked as published',
    });
  } catch (error) {
    console.error('Error publishing MRF file:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to publish MRF file',
    });
  }
});

/**
 * @route GET /mrf/types
 * @desc Get available MRF file types
 * @access Private
 */
router.get('/types', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const fileTypes = [
      {
        type: 'standard_charges',
        name: 'Standard Charges',
        description: 'Hospital standard charges file (CMS required)',
        cmsRequired: true,
        updateFrequency: 'Annually',
      },
      {
        type: 'in_network_rates',
        name: 'In-Network Rates',
        description: 'Payer in-network negotiated rates',
        cmsRequired: true,
        updateFrequency: 'Monthly',
      },
      {
        type: 'out_of_network_allowed',
        name: 'Out-of-Network Allowed Amounts',
        description: 'Payer out-of-network allowed amounts',
        cmsRequired: true,
        updateFrequency: 'Monthly',
      },
      {
        type: 'prescription_drugs',
        name: 'Prescription Drug Pricing',
        description: 'Drug pricing information',
        cmsRequired: false,
        updateFrequency: 'Monthly',
      },
      {
        type: 'negotiated_rates',
        name: 'Negotiated Rates Summary',
        description: 'Summary of all payer negotiated rates',
        cmsRequired: false,
        updateFrequency: 'Quarterly',
      },
    ];

    res.json({ data: fileTypes });
  } catch (error) {
    console.error('Error fetching MRF types:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch MRF types',
    });
  }
});

/**
 * @route GET /mrf/schema
 * @desc Get CMS MRF schema information
 * @access Public
 */
router.get('/schema', async (req: UserRequest, res: Response) => {
  try {
    const schemaInfo = {
      version: '2.0.0',
      lastUpdated: '2024-01-01',
      documentation: 'https://www.cms.gov/hospital-price-transparency',
      requiredFields: {
        hospital_name: 'string',
        last_updated_on: 'date (YYYY-MM-DD)',
        version: 'string',
        hospital_location: 'array of strings',
        hospital_address: 'array of strings',
        affirmation: 'object with affirmation text and confirmation',
        standard_charge_information: 'array of charge objects',
      },
      chargeObjectFields: {
        description: 'string (required)',
        code_information: 'array of code objects (required)',
        standard_charges: 'array of charge detail objects (required)',
        drug_information: 'object (optional, for drugs only)',
        additional_generic_notes: 'string (optional)',
      },
      supportedCodeTypes: ['CPT', 'HCPCS', 'DRG', 'MS-DRG', 'APC', 'ICD', 'NDC', 'LOCAL'],
      contractingMethods: [
        'case rate',
        'fee schedule',
        'percent of total billed charges',
        'per diem',
        'other',
      ],
    };

    res.json({ data: schemaInfo });
  } catch (error) {
    console.error('Error fetching schema info:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch schema information',
    });
  }
});

export default router;
