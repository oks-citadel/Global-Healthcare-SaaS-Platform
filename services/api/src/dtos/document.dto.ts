import { z } from 'zod';

// ==========================================
// Document DTOs
// ==========================================

export const DocumentTypeEnum = z.enum(['lab_result', 'imaging', 'prescription', 'other']);

export const UploadDocumentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  type: DocumentTypeEnum,
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
});

export const DocumentQuerySchema = z.object({
  patientId: z.string().uuid().optional(),
  type: DocumentTypeEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const DocumentResponse = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  type: DocumentTypeEnum,
  fileName: z.string(),
  fileUrl: z.string().url(),
  mimeType: z.string(),
  size: z.number().int(),
  description: z.string().nullable(),
  uploadedBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const DocumentListResponse = z.object({
  data: z.array(DocumentResponse),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

// Type exports
export type DocumentType = z.infer<typeof DocumentTypeEnum>;
export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;
export type DocumentQueryInput = z.infer<typeof DocumentQuerySchema>;
export type DocumentResponseType = z.infer<typeof DocumentResponse>;
export type DocumentListResponseType = z.infer<typeof DocumentListResponse>;
