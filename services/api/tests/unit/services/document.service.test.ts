import { describe, it, expect, beforeEach } from 'vitest';
import { documentService } from '../../../src/services/document.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../../src/utils/errors.js';

describe('DocumentService', () => {
  const validDocumentInput = {
    patientId: `patient-${Date.now()}`,
    type: 'lab_result' as const,
    fileName: 'blood_test_results.pdf',
    mimeType: 'application/pdf',
    description: 'Annual blood work results',
  };

  describe('uploadDocument', () => {
    it('should upload a document successfully', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-upload-${Date.now()}`,
      };

      const result = await documentService.uploadDocument(input, 'provider-123', 1024);

      expect(result).toHaveProperty('id');
      expect(result.patientId).toBe(input.patientId);
      expect(result.type).toBe('lab_result');
      expect(result.fileName).toBe('blood_test_results.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.size).toBe(1024);
      expect(result.uploadedBy).toBe('provider-123');
      expect(result.fileUrl).toContain('storage');
    });

    it('should throw BadRequestError for invalid MIME type', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-invalid-mime-${Date.now()}`,
        mimeType: 'application/x-executable',
      };

      await expect(documentService.uploadDocument(input, 'provider-123', 1024))
        .rejects
        .toThrow(BadRequestError);
    });

    it('should throw BadRequestError for file too large', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-large-${Date.now()}`,
      };

      const largeFileSize = 100 * 1024 * 1024; // 100MB

      await expect(documentService.uploadDocument(input, 'provider-123', largeFileSize))
        .rejects
        .toThrow(BadRequestError);
    });

    it('should allow different document types', async () => {
      const types = ['lab_result', 'imaging', 'prescription', 'other'] as const;

      for (const type of types) {
        const input = {
          ...validDocumentInput,
          patientId: `patient-type-${type}-${Date.now()}`,
          type,
        };

        const result = await documentService.uploadDocument(input, 'provider-123', 1024);
        expect(result.type).toBe(type);
      }
    });

    it('should allow DICOM images', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-dicom-${Date.now()}`,
        type: 'imaging' as const,
        fileName: 'xray.dcm',
        mimeType: 'application/dicom',
      };

      const result = await documentService.uploadDocument(input, 'provider-123', 5000000);
      expect(result.mimeType).toBe('application/dicom');
    });
  });

  describe('getDocumentById', () => {
    it('should return document by ID', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-get-${Date.now()}`,
      };

      const uploaded = await documentService.uploadDocument(input, 'provider-123', 1024);
      const result = await documentService.getDocumentById(uploaded.id);

      expect(result.id).toBe(uploaded.id);
      expect(result.fileName).toBe(input.fileName);
    });

    it('should throw NotFoundError for non-existent document', async () => {
      await expect(documentService.getDocumentById('non-existent-id'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('listDocuments', () => {
    it('should list documents with pagination', async () => {
      const patientId = `patient-list-${Date.now()}`;

      // Upload 5 documents
      for (let i = 0; i < 5; i++) {
        await documentService.uploadDocument(
          { ...validDocumentInput, patientId, fileName: `doc-${i}.pdf` },
          'provider-123',
          1024
        );
      }

      const result = await documentService.listDocuments({
        patientId,
        page: 1,
        limit: 3,
      });

      expect(result.data.length).toBeLessThanOrEqual(3);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(3);
      expect(result.pagination.total).toBeGreaterThanOrEqual(5);
    });

    it('should filter by document type', async () => {
      const patientId = `patient-filter-${Date.now()}`;

      await documentService.uploadDocument(
        { ...validDocumentInput, patientId, type: 'lab_result' },
        'provider-123',
        1024
      );
      await documentService.uploadDocument(
        { ...validDocumentInput, patientId, type: 'imaging', fileName: 'xray.pdf' },
        'provider-123',
        1024
      );

      const result = await documentService.listDocuments({
        patientId,
        type: 'lab_result',
        page: 1,
        limit: 10,
      });

      result.data.forEach(doc => {
        expect(doc.type).toBe('lab_result');
      });
    });

    it('should sort by creation date (newest first)', async () => {
      const patientId = `patient-sort-${Date.now()}`;

      await documentService.uploadDocument(
        { ...validDocumentInput, patientId, fileName: 'first.pdf' },
        'provider-123',
        1024
      );
      await new Promise(resolve => setTimeout(resolve, 10));
      await documentService.uploadDocument(
        { ...validDocumentInput, patientId, fileName: 'second.pdf' },
        'provider-123',
        1024
      );

      const result = await documentService.listDocuments({
        patientId,
        page: 1,
        limit: 10,
      });

      if (result.data.length >= 2) {
        const timestamps = result.data.map(d => new Date(d.createdAt).getTime());
        for (let i = 1; i < timestamps.length; i++) {
          expect(timestamps[i - 1]).toBeGreaterThanOrEqual(timestamps[i]);
        }
      }
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by uploader', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-delete-${Date.now()}`,
      };

      const uploaded = await documentService.uploadDocument(input, 'provider-123', 1024);
      await documentService.deleteDocument(uploaded.id, 'provider-123');

      await expect(documentService.getDocumentById(uploaded.id))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should throw ForbiddenError when non-uploader tries to delete', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-forbidden-${Date.now()}`,
      };

      const uploaded = await documentService.uploadDocument(input, 'provider-123', 1024);

      await expect(documentService.deleteDocument(uploaded.id, 'different-user'))
        .rejects
        .toThrow(ForbiddenError);
    });

    it('should throw NotFoundError for non-existent document', async () => {
      await expect(documentService.deleteDocument('non-existent-id', 'provider-123'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('generateUploadUrl', () => {
    it('should generate upload URL with expiration', async () => {
      const result = await documentService.generateUploadUrl(
        'doc-123',
        'test.pdf',
        'application/pdf'
      );

      expect(result).toHaveProperty('uploadUrl');
      expect(result).toHaveProperty('expiresAt');
      expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('generateDownloadUrl', () => {
    it('should generate download URL for existing document', async () => {
      const input = {
        ...validDocumentInput,
        patientId: `patient-download-${Date.now()}`,
      };

      const uploaded = await documentService.uploadDocument(input, 'provider-123', 1024);
      const result = await documentService.generateDownloadUrl(uploaded.id);

      expect(result).toHaveProperty('downloadUrl');
      expect(result).toHaveProperty('expiresAt');
      expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it('should throw NotFoundError for non-existent document', async () => {
      await expect(documentService.generateDownloadUrl('non-existent-id'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('getDocumentsByPatientId', () => {
    it('should return all documents for a patient', async () => {
      const patientId = `patient-all-docs-${Date.now()}`;

      await documentService.uploadDocument(
        { ...validDocumentInput, patientId },
        'provider-123',
        1024
      );
      await documentService.uploadDocument(
        { ...validDocumentInput, patientId, fileName: 'second.pdf' },
        'provider-123',
        2048
      );

      const result = await documentService.getDocumentsByPatientId(patientId);

      expect(result.length).toBeGreaterThanOrEqual(2);
      result.forEach(doc => {
        expect(doc.patientId).toBe(patientId);
      });
    });
  });
});
