import { Request, Response, NextFunction } from 'express';
import { documentService } from '../services/document.service.js';
import { patientService } from '../services/patient.service.js';
import { UploadDocumentSchema, DocumentQuerySchema } from '../dtos/document.dto.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';

export const documentController = {
  /**
   * POST /documents
   * Upload a new document (metadata)
   */
  uploadDocument: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = UploadDocumentSchema.parse(req.body);
      const fileSize = parseInt(req.headers['content-length'] || '0', 10) || req.body.fileSize || 0;

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== input.patientId) {
          throw new ForbiddenError('Cannot upload documents for other patients');
        }
      }

      const document = await documentService.uploadDocument(
        input,
        req.user!.userId,
        fileSize
      );

      // Generate upload URL for direct upload
      const { uploadUrl, expiresAt } = await documentService.generateUploadUrl(
        document.id,
        document.fileName,
        document.mimeType
      );

      res.status(201).json({
        document,
        uploadUrl,
        uploadUrlExpiresAt: expiresAt,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /documents/:id
   * Get document by ID
   */
  getDocument: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== document.patientId) {
          throw new ForbiddenError('Cannot access this document');
        }
      }

      res.json(document);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /documents/:id/download
   * Get document download URL
   */
  getDownloadUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== document.patientId) {
          throw new ForbiddenError('Cannot download this document');
        }
      }

      const { downloadUrl, expiresAt } = await documentService.generateDownloadUrl(id);

      res.json({
        downloadUrl,
        expiresAt,
        fileName: document.fileName,
        mimeType: document.mimeType,
        size: document.size,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /documents
   * List documents with filtering and pagination
   */
  listDocuments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = DocumentQuerySchema.parse(req.query);

      // Enforce patient access restrictions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient) {
          return res.json({
            data: [],
            pagination: { page: 1, limit: query.limit, total: 0, totalPages: 0 }
          });
        }
        // Override patientId to only show patient's own documents
        query.patientId = userPatient.id;
      }

      const result = await documentService.listDocuments(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /documents/:id
   * Delete a document
   */
  deleteDocument: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== document.patientId) {
          throw new ForbiddenError('Cannot delete this document');
        }
      }

      await documentService.deleteDocument(id, req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /patients/:patientId/documents
   * Get all documents for a specific patient
   */
  getPatientDocuments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== patientId) {
          throw new ForbiddenError('Cannot access documents for other patients');
        }
      }

      const documents = await documentService.getDocumentsByPatientId(patientId);
      res.json(documents);
    } catch (error) {
      next(error);
    }
  },
};
