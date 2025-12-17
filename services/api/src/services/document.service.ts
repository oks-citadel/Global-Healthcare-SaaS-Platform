import {
  UploadDocumentInput,
  DocumentQueryInput,
  DocumentResponseType,
  DocumentListResponseType,
  DocumentType
} from '../dtos/document.dto.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { config } from '../config/index.js';
import { prisma } from '../lib/prisma.js';

// Allowed MIME types for healthcare documents
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/dicom',
  'application/dicom',
  'text/plain',
  'application/json',
  'application/xml',
  'application/hl7-v2',
  'application/fhir+json',
  'application/fhir+xml',
];

// Maximum file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const documentService = {
  /**
   * Upload a document (metadata only - actual file upload handled separately)
   */
  async uploadDocument(
    input: UploadDocumentInput,
    uploadedBy: string,
    fileSize: number
  ): Promise<DocumentResponseType> {
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(input.mimeType)) {
      throw new BadRequestError(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      );
    }

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      throw new BadRequestError(
        `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    // Create document first to get ID
    const document = await prisma.document.create({
      data: {
        patientId: input.patientId,
        type: input.type,
        fileName: input.fileName,
        fileUrl: '', // Will be updated after generating URL
        mimeType: input.mimeType,
        size: fileSize,
        description: input.description || null,
        uploadedBy,
      },
    });

    // Generate storage URL using the document ID
    const fileUrl = `${config.storageUrl || 'https://storage.example.com'}/documents/${document.id}/${input.fileName}`;

    // Update with the file URL
    const updatedDocument = await prisma.document.update({
      where: { id: document.id },
      data: { fileUrl },
    });

    return {
      id: updatedDocument.id,
      patientId: updatedDocument.patientId,
      type: updatedDocument.type,
      fileName: updatedDocument.fileName,
      fileUrl: updatedDocument.fileUrl,
      mimeType: updatedDocument.mimeType,
      size: updatedDocument.size,
      description: updatedDocument.description,
      uploadedBy: updatedDocument.uploadedBy,
      createdAt: updatedDocument.createdAt.toISOString(),
      updatedAt: updatedDocument.updatedAt.toISOString(),
    };
  },

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<DocumentResponseType> {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    return {
      id: document.id,
      patientId: document.patientId,
      type: document.type,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      mimeType: document.mimeType,
      size: document.size,
      description: document.description,
      uploadedBy: document.uploadedBy,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    };
  },

  /**
   * List documents with filtering and pagination
   */
  async listDocuments(query: DocumentQueryInput): Promise<DocumentListResponseType> {
    const where: any = {};

    if (query.patientId) {
      where.patientId = query.patientId;
    }

    if (query.type) {
      where.type = query.type;
    }

    const total = await prisma.document.count({ where });
    const totalPages = Math.ceil(total / query.limit);
    const offset = (query.page - 1) * query.limit;

    const documents = await prisma.document.findMany({
      where,
      skip: offset,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    });

    const data = documents.map(doc => ({
      id: doc.id,
      patientId: doc.patientId,
      type: doc.type,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      mimeType: doc.mimeType,
      size: doc.size,
      description: doc.description,
      uploadedBy: doc.uploadedBy,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));

    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  },

  /**
   * Get documents by patient ID
   */
  async getDocumentsByPatientId(patientId: string): Promise<DocumentResponseType[]> {
    const documents = await prisma.document.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    return documents.map(doc => ({
      id: doc.id,
      patientId: doc.patientId,
      type: doc.type,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      mimeType: doc.mimeType,
      size: doc.size,
      description: doc.description,
      uploadedBy: doc.uploadedBy,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  },

  /**
   * Delete document
   */
  async deleteDocument(id: string, requesterId: string): Promise<void> {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Only the uploader or admin can delete
    // (This check would be more comprehensive in production)
    if (document.uploadedBy !== requesterId) {
      throw new ForbiddenError('Only the uploader can delete this document');
    }

    await prisma.document.delete({
      where: { id },
    });
  },

  /**
   * Generate pre-signed upload URL (stub for actual cloud storage integration)
   */
  async generateUploadUrl(
    documentId: string,
    fileName: string,
    mimeType: string
  ): Promise<{ uploadUrl: string; expiresAt: string }> {
    // In production, this would generate a signed URL for direct upload to cloud storage
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    return {
      uploadUrl: `${config.storageUrl || 'https://storage.example.com'}/upload/${documentId}/${fileName}?token=mock-token`,
      expiresAt,
    };
  },

  /**
   * Generate pre-signed download URL (stub for actual cloud storage integration)
   */
  async generateDownloadUrl(id: string): Promise<{ downloadUrl: string; expiresAt: string }> {
    const document = documents.get(id);
    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // In production, this would generate a signed URL for secure download
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    return {
      downloadUrl: `${document.fileUrl}?token=mock-token`,
      expiresAt,
    };
  },
};
