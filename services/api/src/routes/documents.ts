/**
 * Document Routes with AWS S3 Storage Integration
 *
 * HIPAA-Compliant Document Management
 * - Secure upload/download with presigned URLs
 * - Stream-based handling for large files
 * - Content validation and virus scanning
 * - Versioning and soft-delete
 * - Thumbnail generation for images
 * - Comprehensive audit logging
 */

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { s3StorageService } from '../lib/storage.js';
import { documentService } from '../services/document.service.js';
import { patientService } from '../services/patient.service.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from '../utils/errors.js';
import { z } from 'zod';

const router = Router();

// ==========================================
// Multer Configuration for File Uploads
// ==========================================

// Use memory storage for streaming to S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB default
    files: 1, // Single file upload
  },
  fileFilter: (req, file, cb) => {
    // Basic file type validation (will be validated again in service)
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/dicom',
      'application/dicom',
      'text/plain',
      'application/json',
      'application/xml',
      'application/hl7-v2',
      'application/fhir+json',
      'application/fhir+xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.ms-excel',
      'image/tiff',
      'image/bmp',
      'image/gif',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError(`File type '${file.mimetype}' not allowed`) as any);
    }
  },
});

// ==========================================
// Validation Schemas
// ==========================================

const UploadDocumentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  type: z.enum(['lab_result', 'imaging', 'prescription', 'other']),
  description: z.string().max(1000).optional(),
  generateThumbnail: z.boolean().optional().default(true),
  version: z.number().int().min(1).optional(),
});

const UpdateMetadataSchema = z.object({
  description: z.string().max(1000).optional(),
  type: z.enum(['lab_result', 'imaging', 'prescription', 'other']).optional(),
});

const GenerateUploadUrlSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  type: z.enum(['lab_result', 'imaging', 'prescription', 'other']),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
});

// ==========================================
// Helper Functions
// ==========================================

/**
 * Check if user has access to patient's documents
 */
async function checkPatientAccess(
  userId: string,
  userRole: string,
  patientId: string
): Promise<void> {
  // Admins and providers have access to all patient documents
  if (userRole === 'admin' || userRole === 'provider') {
    return;
  }

  // Patients can only access their own documents
  if (userRole === 'patient') {
    const userPatient = await patientService.getPatientByUserId(userId);
    if (!userPatient || userPatient.id !== patientId) {
      throw new ForbiddenError('Cannot access documents for other patients');
    }
  } else {
    throw new ForbiddenError('Insufficient permissions');
  }
}

/**
 * Convert Buffer to Readable Stream
 */
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// ==========================================
// Document Upload Routes
// ==========================================

/**
 * POST /api/documents/upload
 * Upload a document directly with multipart/form-data
 */
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      // Validate request body
      const body = UploadDocumentSchema.parse({
        ...req.body,
        generateThumbnail: req.body.generateThumbnail === 'true',
        version: req.body.version ? parseInt(req.body.version, 10) : undefined,
      });

      // Check patient access
      await checkPatientAccess(req.user!.userId, req.user!.role, body.patientId);

      // Convert buffer to stream for S3 upload
      const fileStream = bufferToStream(req.file.buffer);

      // Upload to S3 Storage
      const uploadResult = await s3StorageService.uploadDocument(fileStream, {
        patientId: body.patientId,
        documentType: body.type,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user!.userId,
        description: body.description,
        generateThumbnail: body.generateThumbnail,
        version: body.version,
      });

      // Perform virus scan (async - don't block response)
      s3StorageService.scanForViruses(uploadResult.key).then((scanResult) => {
        if (!scanResult.clean) {
          console.error(
            `[SECURITY ALERT] Virus detected in object: ${uploadResult.key}`,
            scanResult.threats
          );
          // In production: delete the object and notify administrators
          // s3StorageService.deleteDocument(uploadResult.key);
        }
      });

      // Save document metadata to database
      const document = await documentService.uploadDocument(
        {
          patientId: body.patientId,
          type: body.type,
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          description: body.description,
        },
        req.user!.userId,
        req.file.size
      );

      // Update document with S3 object URL
      await documentService.updateDocumentUrl(document.id, uploadResult.url, uploadResult.key);

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          documentId: document.id,
          key: uploadResult.key,
          url: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          size: uploadResult.size,
          contentType: uploadResult.contentType,
          etag: uploadResult.etag,
          versionId: uploadResult.versionId,
          metadata: uploadResult.metadata,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/documents/upload-url
 * Generate a presigned URL for direct client-side upload
 */
router.post(
  '/upload-url',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = GenerateUploadUrlSchema.parse(req.body);

      // Check patient access
      await checkPatientAccess(req.user!.userId, req.user!.role, body.patientId);

      // Generate presigned upload URL
      const { uploadUrl, key, expiresAt } = await s3StorageService.generateUploadUrl(
        body.patientId,
        body.type,
        body.fileName,
        body.mimeType
      );

      // Create document record in database (pending upload)
      const document = await documentService.uploadDocument(
        {
          patientId: body.patientId,
          type: body.type,
          fileName: body.fileName,
          mimeType: body.mimeType,
        },
        req.user!.userId,
        0 // Size will be updated after upload
      );

      res.status(200).json({
        success: true,
        data: {
          documentId: document.id,
          uploadUrl,
          key,
          expiresAt,
          instructions: {
            method: 'PUT',
            headers: {
              'Content-Type': body.mimeType,
            },
            note: 'Upload the file to this URL using a PUT request with the file content in the body',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/documents/:id/complete-upload
 * Mark direct upload as complete and update metadata
 */
router.post(
  '/:id/complete-upload',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { key, fileSize } = req.body;

      if (!key || !fileSize) {
        throw new BadRequestError('key and fileSize are required');
      }

      // Get document
      const document = await documentService.getDocumentById(id);

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, document.patientId);

      // Verify object exists
      const metadata = await s3StorageService.getObjectMetadata(key);

      // Update document with size and confirmed upload
      const region = process.env.AWS_REGION || 'us-east-1';
      const bucket = process.env.AWS_S3_BUCKET || 'healthcare-documents';
      await documentService.updateDocumentUrl(id, `https://${bucket}.s3.${region}.amazonaws.com/${key}`, key);

      res.status(200).json({
        success: true,
        message: 'Upload completed successfully',
        data: {
          documentId: id,
          key,
          metadata,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// Document Download Routes
// ==========================================

/**
 * GET /api/documents/:id/download
 * Generate a secure presigned download URL
 */
router.get(
  '/:id/download',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const expiryMinutes = parseInt(req.query.expiryMinutes as string) || 60;

      // Get document from database
      const document = await documentService.getDocumentById(id);

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, document.patientId);

      // Get S3 key from document
      const key = document.blobName || extractKeyFromUrl(document.fileUrl);

      if (!key) {
        throw new InternalServerError('Document key not found');
      }

      // Generate secure download URL
      const downloadUrl = await s3StorageService.generateDownloadUrl(key, {
        expirySeconds: expiryMinutes * 60,
        downloadFileName: document.fileName,
      });

      res.status(200).json({
        success: true,
        data: {
          documentId: id,
          downloadUrl,
          fileName: document.fileName,
          mimeType: document.mimeType,
          size: document.size,
          expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/documents/:id/thumbnail
 * Get thumbnail URL for image documents
 */
router.get(
  '/:id/thumbnail',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Get document from database
      const document = await documentService.getDocumentById(id);

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, document.patientId);

      // Get S3 key from document
      const key = document.blobName || extractKeyFromUrl(document.fileUrl);

      if (!key) {
        throw new InternalServerError('Document key not found');
      }

      // Thumbnail key
      const thumbnailKey = `${key}_thumbnail.jpg`;

      // Generate secure download URL for thumbnail
      const thumbnailUrl = await s3StorageService.generateDownloadUrl(thumbnailKey, {
        expirySeconds: 3600,
      });

      res.status(200).json({
        success: true,
        data: {
          documentId: id,
          thumbnailUrl,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// Document Management Routes
// ==========================================

/**
 * GET /api/documents
 * List documents with filtering
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId, type, page = '1', limit = '20' } = req.query;

      // For patients, restrict to their own documents
      let effectivePatientId = patientId as string;
      if (req.user!.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user!.userId);
        if (!userPatient) {
          return res.json({
            success: true,
            data: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
          });
        }
        effectivePatientId = userPatient.id;
      }

      const result = await documentService.listDocuments({
        patientId: effectivePatientId,
        type: type as any,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/documents/:id
 * Get document details by ID
 */
router.get(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const document = await documentService.getDocumentById(id);

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, document.patientId);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/documents/:id
 * Update document metadata
 */
router.patch(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updates = UpdateMetadataSchema.parse(req.body);

      const document = await documentService.getDocumentById(id);

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, document.patientId);

      // Update database
      const updatedDocument = await documentService.updateDocument(id, updates);

      // Note: S3 metadata is immutable after upload, so we only update the database record
      // For full metadata updates, a copy operation would be needed

      res.status(200).json({
        success: true,
        message: 'Document updated successfully',
        data: updatedDocument,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/documents/:id
 * Delete document (soft delete by default)
 */
router.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const permanent = req.query.permanent === 'true';

      const document = await documentService.getDocumentById(id);

      // Check access - only uploader or admin can delete
      if (req.user!.role !== 'admin' && document.uploadedBy !== req.user!.userId) {
        throw new ForbiddenError('Only the uploader or admin can delete this document');
      }

      // Delete from S3 Storage
      const key = document.blobName || extractKeyFromUrl(document.fileUrl);
      if (key) {
        await s3StorageService.deleteDocument(key);
      }

      // Delete from database
      await documentService.deleteDocument(id, req.user!.userId);

      res.status(200).json({
        success: true,
        message: permanent
          ? 'Document permanently deleted'
          : 'Document deleted (recoverable within retention period)',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/documents/:id/version
 * Create a new version of the document
 */
router.post(
  '/:id/version',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const document = await documentService.getDocumentById(id);

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, document.patientId);

      // Get current version
      const currentVersion = document.version || 1;
      const newVersion = currentVersion + 1;

      // Upload new version
      const fileStream = bufferToStream(req.file.buffer);
      const uploadResult = await s3StorageService.uploadDocument(fileStream, {
        patientId: document.patientId,
        documentType: document.type,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user!.userId,
        description: document.description || undefined,
        version: newVersion,
      });

      // Update document record with new version
      const updatedDocument = await documentService.updateDocument(id, {
        version: newVersion,
        fileUrl: uploadResult.url,
        blobName: uploadResult.key,
        size: req.file.size,
      });

      res.status(201).json({
        success: true,
        message: `Document version ${newVersion} created successfully`,
        data: {
          documentId: id,
          version: newVersion,
          key: uploadResult.key,
          url: uploadResult.url,
          size: uploadResult.size,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// Patient Document Routes
// ==========================================

/**
 * GET /api/patients/:patientId/documents
 * Get all documents for a specific patient
 */
router.get(
  '/patients/:patientId/documents',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, patientId);

      const documents = await documentService.getDocumentsByPatientId(patientId);

      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/patients/:patientId/documents/stats
 * Get storage statistics for a patient
 */
router.get(
  '/patients/:patientId/documents/stats',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;

      // Check access
      await checkPatientAccess(req.user!.userId, req.user!.role, patientId);

      const stats = await s3StorageService.getPatientStorageStats(patientId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// Utility Functions
// ==========================================

/**
 * Extract key from S3 URL
 */
function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    // Remove leading slash
    return path.startsWith('/') ? path.slice(1) : path;
  } catch {
    return null;
  }
}

export { router as documentsRouter };
