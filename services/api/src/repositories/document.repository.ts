import { Document, DocumentType, Prisma } from '@prisma/client';
import { BaseRepository, PaginationOptions, PaginationResult } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export interface DocumentFilters {
  patientId?: string;
  type?: DocumentType;
  uploadedBy?: string;
  fromDate?: Date;
  toDate?: Date;
  mimeType?: string;
}

export class DocumentRepository extends BaseRepository<Document, typeof prisma.document> {
  constructor() {
    super(prisma.document, 'Document');
  }

  /**
   * Find documents by patient ID
   */
  async findByPatientId(
    patientId: string,
    include?: Prisma.DocumentInclude
  ): Promise<Document[]> {
    return this.model.findMany({
      where: { patientId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find documents by type
   */
  async findByType(
    type: DocumentType,
    include?: Prisma.DocumentInclude
  ): Promise<Document[]> {
    return this.model.findMany({
      where: { type },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find documents by patient and type
   */
  async findByPatientAndType(
    patientId: string,
    type: DocumentType,
    include?: Prisma.DocumentInclude
  ): Promise<Document[]> {
    return this.model.findMany({
      where: {
        patientId,
        type,
      },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find documents uploaded by user
   */
  async findByUploader(
    uploadedBy: string,
    include?: Prisma.DocumentInclude
  ): Promise<Document[]> {
    return this.model.findMany({
      where: { uploadedBy },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find documents with filters and pagination
   */
  async findWithFilters(
    filters: DocumentFilters,
    pagination: PaginationOptions,
    include?: Prisma.DocumentInclude
  ): Promise<PaginationResult<Document>> {
    const where: Prisma.DocumentWhereInput = {};

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.uploadedBy) {
      where.uploadedBy = filters.uploadedBy;
    }

    if (filters.mimeType) {
      where.mimeType = { contains: filters.mimeType };
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) {
        where.createdAt.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.createdAt.lte = filters.toDate;
      }
    }

    return this.findWithPagination(where, pagination, {
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find documents by date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: {
      patientId?: string;
      type?: DocumentType;
    }
  ): Promise<Document[]> {
    const where: Prisma.DocumentWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (options?.patientId) {
      where.patientId = options.patientId;
    }

    if (options?.type) {
      where.type = options.type;
    }

    return this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find recent documents
   */
  async findRecent(limit: number = 10, patientId?: string): Promise<Document[]> {
    const where: Prisma.DocumentWhereInput = {};

    if (patientId) {
      where.patientId = patientId;
    }

    return this.model.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Search documents by filename or description
   */
  async searchDocuments(
    query: string,
    options?: {
      patientId?: string;
      type?: DocumentType;
      limit?: number;
    }
  ): Promise<Document[]> {
    const where: Prisma.DocumentWhereInput = {
      OR: [
        { fileName: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (options?.patientId) {
      where.patientId = options.patientId;
    }

    if (options?.type) {
      where.type = options.type;
    }

    return this.model.findMany({
      where,
      take: options?.limit || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find documents by mime type
   */
  async findByMimeType(mimeType: string): Promise<Document[]> {
    return this.model.findMany({
      where: { mimeType },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find documents by mime type pattern (e.g., 'image/*')
   */
  async findByMimeTypePattern(pattern: string): Promise<Document[]> {
    return this.model.findMany({
      where: {
        mimeType: {
          startsWith: pattern.replace('*', ''),
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Count documents by patient
   */
  async countByPatient(patientId: string): Promise<number> {
    return this.model.count({ where: { patientId } });
  }

  /**
   * Count documents by type
   */
  async countByType(type: DocumentType): Promise<number> {
    return this.model.count({ where: { type } });
  }

  /**
   * Get total storage used by patient
   */
  async getTotalStorageByPatient(patientId: string): Promise<number> {
    const result = await prisma.$queryRaw<[{ total: bigint | null }]>`
      SELECT SUM(size) as total
      FROM "Document"
      WHERE "patientId" = ${patientId}
    `;

    return result[0]?.total ? Number(result[0].total) : 0;
  }

  /**
   * Get total storage used by all documents
   */
  async getTotalStorage(): Promise<number> {
    const result = await prisma.$queryRaw<[{ total: bigint | null }]>`
      SELECT SUM(size) as total
      FROM "Document"
    `;

    return result[0]?.total ? Number(result[0].total) : 0;
  }

  /**
   * Find large documents
   */
  async findLargeDocuments(minSizeBytes: number, limit: number = 50): Promise<Document[]> {
    return this.model.findMany({
      where: {
        size: {
          gte: minSizeBytes,
        },
      },
      take: limit,
      orderBy: { size: 'desc' },
    });
  }

  /**
   * Get document statistics by patient
   */
  async getPatientDocumentStats(patientId: string): Promise<{
    total: number;
    byType: Record<DocumentType, number>;
    totalSize: number;
  }> {
    const [total, documents, totalSize] = await Promise.all([
      this.countByPatient(patientId),
      this.findByPatientId(patientId),
      this.getTotalStorageByPatient(patientId),
    ]);

    const byType: Record<DocumentType, number> = {
      lab_result: 0,
      imaging: 0,
      prescription: 0,
      other: 0,
    };

    documents.forEach((doc) => {
      byType[doc.type] = (byType[doc.type] || 0) + 1;
    });

    return {
      total,
      byType,
      totalSize,
    };
  }

  /**
   * Delete documents by patient (cleanup)
   */
  async deleteByPatient(patientId: string): Promise<{ count: number }> {
    return this.deleteMany({ patientId });
  }

  /**
   * Find document with patient info
   */
  async findWithPatientInfo(id: string): Promise<Document | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update document metadata
   */
  async updateMetadata(
    id: string,
    metadata: {
      description?: string;
      type?: DocumentType;
    }
  ): Promise<Document> {
    return this.model.update({
      where: { id },
      data: metadata,
    });
  }
}

export const documentRepository = new DocumentRepository();
