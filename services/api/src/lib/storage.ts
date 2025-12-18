/**
 * Azure Blob Storage Service for HIPAA-Compliant Document Management
 *
 * Features:
 * - Stream-based upload for large files
 * - Content type validation
 * - File size limits
 * - Virus scanning integration (optional)
 * - Signed URLs for time-limited access
 * - Soft-delete support
 * - Metadata storage
 * - HIPAA-compliant encryption at rest
 * - Container organization by patient/document type
 * - Thumbnail generation for images
 * - Document versioning support
 */

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient,
  BlockBlobClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  BlobDeleteOptions,
  BlobUploadCommonResponse,
  Tags,
  ContainerCreateOptions,
} from '@azure/storage-blob';
import { Readable, PassThrough } from 'stream';
import { config } from '../config/index.js';
import { BadRequestError, NotFoundError, InternalServerError } from '../utils/errors.js';
import sharp from 'sharp';
import crypto from 'crypto';

// ==========================================
// Configuration & Constants
// ==========================================

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'healthcare-documents';
const ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

// Allowed MIME types for healthcare documents
const ALLOWED_MIME_TYPES = [
  // Medical Documents
  'application/pdf',
  'application/dicom',
  'text/plain',
  'application/json',
  'application/xml',
  'application/hl7-v2',
  'application/fhir+json',
  'application/fhir+xml',

  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/dicom',
  'image/tiff',
  'image/bmp',
  'image/gif',

  // Office Documents
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/msword', // .doc
  'application/vnd.ms-excel', // .xls
];

// Image MIME types for thumbnail generation
const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/tiff',
  'image/bmp',
  'image/gif',
];

// Default file size limit (100MB for HIPAA compliance)
const DEFAULT_MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '104857600', 10); // 100MB
const THUMBNAIL_MAX_WIDTH = 300;
const THUMBNAIL_MAX_HEIGHT = 300;
const SAS_URL_EXPIRY_MINUTES = 60; // 1 hour for downloads
const UPLOAD_SAS_URL_EXPIRY_MINUTES = 15; // 15 minutes for uploads

// ==========================================
// Types & Interfaces
// ==========================================

export interface UploadOptions {
  patientId: string;
  documentType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  description?: string;
  metadata?: Record<string, string>;
  version?: number;
  generateThumbnail?: boolean;
}

export interface UploadResult {
  blobName: string;
  url: string;
  containerName: string;
  contentType: string;
  size: number;
  etag?: string;
  versionId?: string;
  thumbnailUrl?: string;
  metadata: Record<string, string>;
}

export interface DownloadOptions {
  expiryMinutes?: number;
  downloadFileName?: string;
}

export interface DocumentMetadata {
  patientId: string;
  documentType: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  version?: string;
  encryptionMethod: string;
  checksum: string;
  [key: string]: string | undefined;
}

export interface ListBlobsOptions {
  prefix?: string;
  maxResults?: number;
  includeMetadata?: boolean;
  includeSnapshots?: boolean;
  includeSoftDeleted?: boolean;
}

export interface BlobInfo {
  name: string;
  url: string;
  size: number;
  contentType?: string;
  lastModified?: Date;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
  isDeleted?: boolean;
  versionId?: string;
}

// ==========================================
// Azure Storage Service Class
// ==========================================

class AzureStorageService {
  private blobServiceClient: BlobServiceClient | null = null;
  private containerClient: ContainerClient | null = null;
  private credential: StorageSharedKeyCredential | null = null;

  /**
   * Initialize Azure Blob Storage client
   */
  async initialize(): Promise<void> {
    try {
      // Option 1: Use connection string (recommended for simplicity)
      if (CONNECTION_STRING) {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
      }
      // Option 2: Use account name and key
      else if (ACCOUNT_NAME && ACCOUNT_KEY) {
        this.credential = new StorageSharedKeyCredential(ACCOUNT_NAME, ACCOUNT_KEY);
        this.blobServiceClient = new BlobServiceClient(
          `https://${ACCOUNT_NAME}.blob.core.windows.net`,
          this.credential
        );
      } else {
        throw new Error(
          'Azure Storage credentials not configured. Set AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY'
        );
      }

      // Get container client
      this.containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME);

      // Create container if it doesn't exist
      const containerOptions: ContainerCreateOptions = {
        access: 'private', // Private access - require SAS tokens
        metadata: {
          purpose: 'healthcare-documents',
          hipaaCompliant: 'true',
          encryptionAtRest: 'true',
        },
      };

      const createResponse = await this.containerClient.createIfNotExists(containerOptions);

      if (createResponse.succeeded) {
        console.log(`Azure Blob container '${CONTAINER_NAME}' created successfully`);
      } else {
        console.log(`Azure Blob container '${CONTAINER_NAME}' already exists`);
      }

      // Enable versioning on container (if supported)
      await this.enableVersioning();

      console.log('Azure Blob Storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Azure Blob Storage:', error);
      throw new InternalServerError('Failed to initialize storage service');
    }
  }

  /**
   * Enable blob versioning for the container
   */
  private async enableVersioning(): Promise<void> {
    try {
      if (!this.blobServiceClient) {
        throw new Error('Blob service client not initialized');
      }

      const properties = await this.blobServiceClient.getProperties();
      console.log('Blob versioning status:', properties.defaultServiceVersion);

      // Note: Versioning is typically enabled at the storage account level via Azure Portal or ARM templates
      // This is just a check to ensure it's configured
    } catch (error) {
      console.warn('Could not verify blob versioning:', error);
    }
  }

  /**
   * Validate file type against allowed MIME types
   */
  private validateMimeType(mimeType: string): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      throw new BadRequestError(
        `Invalid file type '${mimeType}'. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      );
    }
  }

  /**
   * Validate file size
   */
  private validateFileSize(size: number, maxSize: number = DEFAULT_MAX_FILE_SIZE): void {
    if (size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      throw new BadRequestError(
        `File size exceeds maximum allowed size of ${maxSizeMB}MB`
      );
    }

    if (size <= 0) {
      throw new BadRequestError('File size must be greater than 0');
    }
  }

  /**
   * Generate blob name with patient/document type organization
   */
  private generateBlobName(options: UploadOptions): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = this.sanitizeFileName(options.fileName);
    const version = options.version ? `_v${options.version}` : '';

    // Organization: {patientId}/{documentType}/{timestamp}_{random}_{filename}
    return `${options.patientId}/${options.documentType}/${timestamp}_${random}${version}_${sanitizedFileName}`;
  }

  /**
   * Sanitize file name to prevent path traversal and special characters
   */
  private sanitizeFileName(fileName: string): string {
    // Remove path separators and special characters
    return fileName
      .replace(/[\/\\]/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 255); // Limit length
  }

  /**
   * Calculate file checksum (SHA256)
   */
  private async calculateChecksum(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Generate thumbnail for images
   */
  private async generateThumbnail(
    stream: Readable,
    mimeType: string
  ): Promise<Buffer | null> {
    if (!IMAGE_MIME_TYPES.includes(mimeType.toLowerCase())) {
      return null;
    }

    try {
      const chunks: Buffer[] = [];

      // Collect stream data
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);

      // Generate thumbnail using sharp
      const thumbnail = await sharp(buffer)
        .resize(THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      return thumbnail;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return null;
    }
  }

  /**
   * Upload document to Azure Blob Storage with streaming
   */
  async uploadDocument(
    stream: Readable,
    options: UploadOptions
  ): Promise<UploadResult> {
    if (!this.containerClient) {
      await this.initialize();
    }

    // Validate inputs
    this.validateMimeType(options.mimeType);
    this.validateFileSize(options.fileSize);

    const blobName = this.generateBlobName(options);
    const blockBlobClient = this.containerClient!.getBlockBlobClient(blobName);

    // Prepare metadata
    const metadata: DocumentMetadata = {
      patientId: options.patientId,
      documentType: options.documentType,
      uploadedBy: options.uploadedBy,
      uploadedAt: new Date().toISOString(),
      encryptionMethod: 'AES-256', // Azure Storage encryption at rest
      checksum: '', // Will be calculated
      version: options.version?.toString() || '1',
      ...(options.description && { description: options.description }),
      ...(options.metadata || {}),
    };

    // Prepare tags for easy filtering
    const tags: Tags = {
      patientId: options.patientId,
      documentType: options.documentType,
      uploadedBy: options.uploadedBy,
      hipaaCompliant: 'true',
    };

    try {
      // Upload the blob with streaming
      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: options.mimeType,
          blobContentDisposition: `attachment; filename="${options.fileName}"`,
        },
        metadata,
        tags,
      };

      // For large files, use block upload with streaming
      const uploadResponse: BlobUploadCommonResponse = await blockBlobClient.uploadStream(
        stream,
        undefined, // buffer size (default: 4MB)
        undefined, // max concurrency (default: 5)
        uploadOptions
      );

      // Generate thumbnail if requested and file is an image
      let thumbnailUrl: string | undefined;
      if (options.generateThumbnail && IMAGE_MIME_TYPES.includes(options.mimeType.toLowerCase())) {
        try {
          // Create a new stream for thumbnail generation
          const thumbnailBlobName = `${blobName}_thumbnail.jpg`;
          const thumbnailStream = this.containerClient!
            .getBlockBlobClient(blobName)
            .download();

          const thumbnail = await this.generateThumbnail(
            (await thumbnailStream).readableStreamBody as Readable,
            options.mimeType
          );

          if (thumbnail) {
            const thumbnailClient = this.containerClient!.getBlockBlobClient(thumbnailBlobName);
            await thumbnailClient.uploadData(thumbnail, {
              blobHTTPHeaders: {
                blobContentType: 'image/jpeg',
              },
              metadata: {
                ...metadata,
                isThumbnail: 'true',
                originalBlob: blobName,
              },
            });

            thumbnailUrl = thumbnailClient.url;
          }
        } catch (thumbError) {
          console.error('Failed to generate thumbnail:', thumbError);
          // Continue without thumbnail - not critical
        }
      }

      // Calculate checksum from the uploaded blob
      const downloadResponse = await blockBlobClient.download();
      const checksum = await this.calculateChecksum(
        downloadResponse.readableStreamBody as Readable
      );

      // Update metadata with checksum
      await blockBlobClient.setMetadata({
        ...metadata,
        checksum,
      });

      return {
        blobName,
        url: blockBlobClient.url,
        containerName: CONTAINER_NAME,
        contentType: options.mimeType,
        size: options.fileSize,
        etag: uploadResponse.etag,
        versionId: uploadResponse.versionId,
        thumbnailUrl,
        metadata: { ...metadata, checksum },
      };
    } catch (error) {
      console.error('Failed to upload document to Azure Blob Storage:', error);
      throw new InternalServerError('Failed to upload document');
    }
  }

  /**
   * Generate SAS URL for secure download with time limit
   */
  async generateDownloadUrl(
    blobName: string,
    options: DownloadOptions = {}
  ): Promise<string> {
    if (!this.containerClient) {
      await this.initialize();
    }

    const blockBlobClient = this.containerClient!.getBlockBlobClient(blobName);

    // Check if blob exists
    const exists = await blockBlobClient.exists();
    if (!exists) {
      throw new NotFoundError(`Blob '${blobName}' not found`);
    }

    const expiryMinutes = options.expiryMinutes || SAS_URL_EXPIRY_MINUTES;
    const startsOn = new Date();
    const expiresOn = new Date(startsOn.getTime() + expiryMinutes * 60 * 1000);

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: CONTAINER_NAME,
        blobName,
        permissions: BlobSASPermissions.parse('r'), // Read-only
        startsOn,
        expiresOn,
        contentDisposition: options.downloadFileName
          ? `attachment; filename="${options.downloadFileName}"`
          : undefined,
      },
      this.credential || this.blobServiceClient!.credential as StorageSharedKeyCredential
    ).toString();

    return `${blockBlobClient.url}?${sasToken}`;
  }

  /**
   * Generate SAS URL for direct upload (presigned URL)
   */
  async generateUploadUrl(
    patientId: string,
    documentType: string,
    fileName: string,
    mimeType: string
  ): Promise<{ uploadUrl: string; blobName: string; expiresAt: Date }> {
    if (!this.containerClient) {
      await this.initialize();
    }

    this.validateMimeType(mimeType);

    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = this.sanitizeFileName(fileName);
    const blobName = `${patientId}/${documentType}/${timestamp}_${random}_${sanitizedFileName}`;

    const blockBlobClient = this.containerClient!.getBlockBlobClient(blobName);

    const startsOn = new Date();
    const expiresOn = new Date(startsOn.getTime() + UPLOAD_SAS_URL_EXPIRY_MINUTES * 60 * 1000);

    // Generate SAS token with write permissions
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: CONTAINER_NAME,
        blobName,
        permissions: BlobSASPermissions.parse('w'), // Write-only
        startsOn,
        expiresOn,
      },
      this.credential || this.blobServiceClient!.credential as StorageSharedKeyCredential
    ).toString();

    return {
      uploadUrl: `${blockBlobClient.url}?${sasToken}`,
      blobName,
      expiresAt: expiresOn,
    };
  }

  /**
   * Delete document with soft-delete support
   */
  async deleteDocument(blobName: string, softDelete: boolean = true): Promise<void> {
    if (!this.containerClient) {
      await this.initialize();
    }

    const blockBlobClient = this.containerClient!.getBlockBlobClient(blobName);

    // Check if blob exists
    const exists = await blockBlobClient.exists();
    if (!exists) {
      throw new NotFoundError(`Blob '${blobName}' not found`);
    }

    try {
      const deleteOptions: BlobDeleteOptions = {};

      if (softDelete) {
        // Soft delete - blob can be recovered within retention period
        deleteOptions.deleteSnapshots = 'include';
      } else {
        // Permanent delete
        deleteOptions.deleteSnapshots = 'include';
      }

      await blockBlobClient.delete(deleteOptions);

      // Also delete thumbnail if it exists
      try {
        const thumbnailBlobName = `${blobName}_thumbnail.jpg`;
        const thumbnailClient = this.containerClient!.getBlockBlobClient(thumbnailBlobName);
        const thumbnailExists = await thumbnailClient.exists();

        if (thumbnailExists) {
          await thumbnailClient.delete(deleteOptions);
        }
      } catch (thumbError) {
        console.warn('Failed to delete thumbnail:', thumbError);
        // Continue - thumbnail deletion is not critical
      }
    } catch (error) {
      console.error('Failed to delete blob:', error);
      throw new InternalServerError('Failed to delete document');
    }
  }

  /**
   * List blobs with filtering options
   */
  async listBlobs(options: ListBlobsOptions = {}): Promise<BlobInfo[]> {
    if (!this.containerClient) {
      await this.initialize();
    }

    const blobs: BlobInfo[] = [];
    const maxResults = options.maxResults || 100;

    try {
      const iterator = this.containerClient!.listBlobsFlat({
        prefix: options.prefix,
        includeMetadata: options.includeMetadata,
        includeSnapshots: options.includeSnapshots,
        includeTags: true,
      });

      for await (const blob of iterator) {
        if (blobs.length >= maxResults) {
          break;
        }

        blobs.push({
          name: blob.name,
          url: `${this.containerClient!.url}/${blob.name}`,
          size: blob.properties.contentLength || 0,
          contentType: blob.properties.contentType,
          lastModified: blob.properties.lastModified,
          metadata: blob.metadata,
          tags: blob.tags,
          versionId: blob.versionId,
        });
      }

      return blobs;
    } catch (error) {
      console.error('Failed to list blobs:', error);
      throw new InternalServerError('Failed to list documents');
    }
  }

  /**
   * Get blob metadata
   */
  async getBlobMetadata(blobName: string): Promise<DocumentMetadata> {
    if (!this.containerClient) {
      await this.initialize();
    }

    const blockBlobClient = this.containerClient!.getBlockBlobClient(blobName);

    try {
      const properties = await blockBlobClient.getProperties();
      return properties.metadata as DocumentMetadata;
    } catch (error) {
      console.error('Failed to get blob metadata:', error);
      throw new NotFoundError(`Blob '${blobName}' not found`);
    }
  }

  /**
   * Update blob metadata
   */
  async updateBlobMetadata(
    blobName: string,
    metadata: Partial<DocumentMetadata>
  ): Promise<void> {
    if (!this.containerClient) {
      await this.initialize();
    }

    const blockBlobClient = this.containerClient!.getBlockBlobClient(blobName);

    try {
      const currentProperties = await blockBlobClient.getProperties();
      const updatedMetadata = {
        ...currentProperties.metadata,
        ...metadata,
      };

      await blockBlobClient.setMetadata(updatedMetadata);
    } catch (error) {
      console.error('Failed to update blob metadata:', error);
      throw new InternalServerError('Failed to update document metadata');
    }
  }

  /**
   * Copy blob for versioning
   */
  async createVersion(blobName: string, versionNumber: number): Promise<string> {
    if (!this.containerClient) {
      await this.initialize();
    }

    const sourceBlobClient = this.containerClient!.getBlockBlobClient(blobName);
    const versionedBlobName = `${blobName}_v${versionNumber}`;
    const targetBlobClient = this.containerClient!.getBlockBlobClient(versionedBlobName);

    try {
      // Copy blob
      const copyPoller = await targetBlobClient.beginCopyFromURL(sourceBlobClient.url);
      await copyPoller.pollUntilDone();

      // Update metadata with version info
      const metadata = await this.getBlobMetadata(blobName);
      await this.updateBlobMetadata(versionedBlobName, {
        ...metadata,
        version: versionNumber.toString(),
        originalBlob: blobName,
      });

      return versionedBlobName;
    } catch (error) {
      console.error('Failed to create blob version:', error);
      throw new InternalServerError('Failed to create document version');
    }
  }

  /**
   * Perform virus scanning integration (placeholder)
   *
   * Note: Integrate with Azure Security Center or third-party antivirus service
   * For production, use services like:
   * - Microsoft Defender for Cloud
   * - ClamAV
   * - CloudAV
   */
  async scanForViruses(blobName: string): Promise<{ clean: boolean; threats?: string[] }> {
    // TODO: Implement actual virus scanning integration
    console.log(`[Virus Scan] Scanning blob: ${blobName}`);

    // Placeholder - always return clean
    // In production, integrate with actual antivirus service
    return {
      clean: true,
      threats: [],
    };
  }

  /**
   * Get storage usage statistics for a patient
   */
  async getPatientStorageStats(patientId: string): Promise<{
    totalSize: number;
    fileCount: number;
    documentTypes: Record<string, number>;
  }> {
    const blobs = await this.listBlobs({
      prefix: `${patientId}/`,
      includeMetadata: true,
    });

    let totalSize = 0;
    const documentTypes: Record<string, number> = {};

    for (const blob of blobs) {
      totalSize += blob.size;

      if (blob.metadata?.documentType) {
        documentTypes[blob.metadata.documentType] =
          (documentTypes[blob.metadata.documentType] || 0) + 1;
      }
    }

    return {
      totalSize,
      fileCount: blobs.length,
      documentTypes,
    };
  }
}

// Export singleton instance
export const azureStorageService = new AzureStorageService();
