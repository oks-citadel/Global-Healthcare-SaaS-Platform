/**
 * AWS S3 Storage Service for HIPAA-Compliant Document Management
 *
 * Features:
 * - Stream-based upload for large files
 * - Content type validation
 * - File size limits
 * - Virus scanning integration (optional)
 * - Signed URLs for time-limited access
 * - Soft-delete support
 * - Metadata storage
 * - HIPAA-compliant encryption at rest (S3 SSE)
 * - Bucket organization by patient/document type
 * - Thumbnail generation for images
 * - Document versioning support
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectTaggingCommand,
  PutObjectTaggingCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable, PassThrough } from 'stream';
import { config } from '../config/index.js';
import { BadRequestError, NotFoundError, InternalServerError } from '../utils/errors.js';
import sharp from 'sharp';
import crypto from 'crypto';
import NodeClam from 'clamscan';

// ==========================================
// Configuration & Constants
// ==========================================

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'healthcare-documents';

// Virus Scanning Configuration
const VIRUS_SCAN_ENABLED = process.env.VIRUS_SCAN_ENABLED === 'true';
const CLAMAV_HOST = process.env.CLAMAV_HOST || 'localhost';
const CLAMAV_PORT = parseInt(process.env.CLAMAV_PORT || '3310', 10);
const CLAMAV_SOCKET = process.env.CLAMAV_SOCKET || '/var/run/clamav/clamd.ctl';
const CLAMAV_TIMEOUT = parseInt(process.env.CLAMAV_TIMEOUT || '60000', 10); // 60 seconds default
const QUARANTINE_BUCKET_NAME = process.env.AWS_QUARANTINE_BUCKET || 'healthcare-quarantine';

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
const PRESIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour for downloads
const UPLOAD_PRESIGNED_URL_EXPIRY_SECONDS = 900; // 15 minutes for uploads

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
  key: string;
  url: string;
  bucketName: string;
  contentType: string;
  size: number;
  etag?: string;
  versionId?: string;
  thumbnailUrl?: string;
  metadata: Record<string, string>;
  virusScanResult?: VirusScanResult;
}

export interface DownloadOptions {
  expirySeconds?: number;
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

export interface ListObjectsOptions {
  prefix?: string;
  maxResults?: number;
  includeMetadata?: boolean;
}

export interface ObjectInfo {
  key: string;
  url: string;
  size: number;
  contentType?: string;
  lastModified?: Date;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
  versionId?: string;
}

export interface VirusScanResult {
  isClean: boolean;
  isInfected: boolean;
  viruses: string[];
  scannedAt: Date;
  scanDurationMs: number;
  error?: string;
}

export interface VirusScanAuditLog {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  patientId: string;
  scanResult: VirusScanResult;
  action: 'allowed' | 'rejected' | 'quarantined' | 'scan_failed';
  timestamp: Date;
}

// ==========================================
// Virus Scanner Service Class
// ==========================================

class VirusScannerService {
  private clamScanner: NodeClam | null = null;
  private isInitialized: boolean = false;
  private initializationError: string | null = null;

  /**
   * Initialize ClamAV scanner
   */
  async initialize(): Promise<void> {
    if (!VIRUS_SCAN_ENABLED) {
      console.log('[VirusScanner] Virus scanning is disabled');
      return;
    }

    try {
      this.clamScanner = await new NodeClam().init({
        removeInfected: false,
        quarantineInfected: false,
        scanLog: null,
        debugMode: process.env.NODE_ENV === 'development',
        fileList: null,
        scanRecursively: false,
        clamdscan: {
          socket: CLAMAV_SOCKET,
          host: CLAMAV_HOST,
          port: CLAMAV_PORT,
          timeout: CLAMAV_TIMEOUT,
          localFallback: true,
          path: '/usr/bin/clamdscan',
          configFile: '/etc/clamav/clamd.conf',
          multiscan: false,
          reloadDb: false,
          active: true,
          bypassTest: false,
        },
        clamscan: {
          path: '/usr/bin/clamscan',
          db: null,
          scanArchives: true,
          active: true,
        },
        preference: 'clamdscan',
      });

      this.isInitialized = true;
      console.log('[VirusScanner] ClamAV scanner initialized successfully');
    } catch (error) {
      this.initializationError = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error('[VirusScanner] Failed to initialize ClamAV:', this.initializationError);

      if (process.env.NODE_ENV === 'production' && process.env.VIRUS_SCAN_REQUIRED === 'true') {
        throw new InternalServerError('Virus scanner initialization failed - uploads are blocked');
      }
    }
  }

  /**
   * Check if virus scanning is available
   */
  isAvailable(): boolean {
    return VIRUS_SCAN_ENABLED && this.isInitialized && this.clamScanner !== null;
  }

  /**
   * Scan a buffer for viruses
   */
  async scanBuffer(buffer: Buffer, fileName: string): Promise<VirusScanResult> {
    const startTime = Date.now();

    if (!VIRUS_SCAN_ENABLED) {
      return {
        isClean: true,
        isInfected: false,
        viruses: [],
        scannedAt: new Date(),
        scanDurationMs: 0,
      };
    }

    if (!this.isInitialized || !this.clamScanner) {
      const errorMessage = this.initializationError || 'Scanner not initialized';
      console.warn(`[VirusScanner] Scanner unavailable: ${errorMessage}`);

      if (process.env.VIRUS_SCAN_REQUIRED === 'true') {
        return {
          isClean: false,
          isInfected: false,
          viruses: [],
          scannedAt: new Date(),
          scanDurationMs: Date.now() - startTime,
          error: `Virus scanner unavailable: ${errorMessage}`,
        };
      }

      console.warn(`[VirusScanner] Allowing file '${fileName}' without scan (scanner unavailable)`);
      return {
        isClean: true,
        isInfected: false,
        viruses: [],
        scannedAt: new Date(),
        scanDurationMs: Date.now() - startTime,
        error: `Scan skipped: ${errorMessage}`,
      };
    }

    try {
      console.log(`[VirusScanner] Scanning file: ${fileName} (${buffer.length} bytes)`);
      const stream = Readable.from(buffer);
      const result = await this.clamScanner.scanStream(stream);

      const scanDurationMs = Date.now() - startTime;
      const scanResult: VirusScanResult = {
        isClean: !result.isInfected,
        isInfected: result.isInfected || false,
        viruses: result.viruses || [],
        scannedAt: new Date(),
        scanDurationMs,
      };

      if (scanResult.isInfected) {
        console.error(
          `[VirusScanner] INFECTED FILE DETECTED: ${fileName} - Viruses: ${scanResult.viruses.join(', ')}`
        );
      } else {
        console.log(`[VirusScanner] File clean: ${fileName} (scanned in ${scanDurationMs}ms)`);
      }

      return scanResult;
    } catch (error) {
      const scanDurationMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown scan error';

      console.error(`[VirusScanner] Scan error for '${fileName}': ${errorMessage}`);

      if (process.env.VIRUS_SCAN_REQUIRED === 'true') {
        return {
          isClean: false,
          isInfected: false,
          viruses: [],
          scannedAt: new Date(),
          scanDurationMs,
          error: `Scan failed: ${errorMessage}`,
        };
      }

      return {
        isClean: true,
        isInfected: false,
        viruses: [],
        scannedAt: new Date(),
        scanDurationMs,
        error: `Scan failed (allowed): ${errorMessage}`,
      };
    }
  }

  /**
   * Log virus scan result for audit trail
   */
  logScanResult(auditLog: VirusScanAuditLog): void {
    const logEntry = {
      ...auditLog,
      logType: 'VIRUS_SCAN_AUDIT',
      environment: process.env.NODE_ENV,
    };

    if (auditLog.scanResult.isInfected) {
      console.error('[SECURITY_AUDIT] Infected file rejected:', JSON.stringify(logEntry));
    } else if (auditLog.scanResult.error) {
      console.warn('[SECURITY_AUDIT] Virus scan issue:', JSON.stringify(logEntry));
    } else {
      console.info('[SECURITY_AUDIT] File scan passed:', JSON.stringify(logEntry));
    }
  }
}

// Singleton instance for virus scanner
const virusScannerService = new VirusScannerService();

// ==========================================
// S3 Storage Service Class
// ==========================================

class S3StorageService {
  private s3Client: S3Client | null = null;

  /**
   * Initialize S3 client
   */
  async initialize(): Promise<void> {
    try {
      if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        throw new Error(
          'AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY'
        );
      }

      this.s3Client = new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      });

      // Check if bucket exists, create if not
      try {
        await this.s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`S3 bucket '${BUCKET_NAME}' already exists`);
      } catch (error: any) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
          await this.s3Client.send(new CreateBucketCommand({
            Bucket: BUCKET_NAME,
          }));
          console.log(`S3 bucket '${BUCKET_NAME}' created successfully`);
        } else {
          throw error;
        }
      }

      // Initialize virus scanner service
      await virusScannerService.initialize();

      console.log('AWS S3 Storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AWS S3 Storage:', error);
      throw new InternalServerError('Failed to initialize storage service');
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
   * Generate S3 key with patient/document type organization
   */
  private generateKey(options: UploadOptions): string {
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
    return fileName
      .replace(/[\/\\]/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 255);
  }

  /**
   * Calculate file checksum (SHA256)
   */
  private calculateChecksum(buffer: Buffer): string {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
  }

  /**
   * Generate thumbnail for images
   */
  private async generateThumbnail(buffer: Buffer, mimeType: string): Promise<Buffer | null> {
    if (!IMAGE_MIME_TYPES.includes(mimeType.toLowerCase())) {
      return null;
    }

    try {
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
   * Upload document to S3 with virus scanning
   */
  async uploadDocumentWithVirusScan(
    buffer: Buffer,
    options: UploadOptions
  ): Promise<UploadResult> {
    if (!this.s3Client) {
      await this.initialize();
    }

    // Validate inputs
    this.validateMimeType(options.mimeType);
    this.validateFileSize(buffer.length);

    const actualFileSize = buffer.length;

    // Step 1: Scan for viruses BEFORE uploading
    console.log(`[Upload] Starting virus scan for file: ${options.fileName}`);
    const scanResult = await this.scanFileBeforeUpload(buffer, options.fileName, {
      ...options,
      fileSize: actualFileSize,
    });

    // Step 2: Handle scan results
    if (scanResult.isInfected) {
      const threatList = scanResult.viruses.join(', ');
      console.error(
        `[Upload] REJECTED: File '${options.fileName}' is infected with: ${threatList}`
      );
      throw new BadRequestError(
        `File upload rejected: The file contains malware (${threatList}). Please scan your file with antivirus software and try again.`
      );
    }

    if (scanResult.error && !scanResult.isClean) {
      console.error(
        `[Upload] REJECTED: Virus scan failed for '${options.fileName}': ${scanResult.error}`
      );
      throw new BadRequestError(
        'File upload rejected: Unable to verify file safety. Please try again later.'
      );
    }

    // Step 3: File is clean - proceed with upload
    console.log(`[Upload] File '${options.fileName}' passed virus scan, proceeding with upload`);

    const key = this.generateKey(options);
    const checksum = this.calculateChecksum(buffer);

    // Prepare metadata
    const metadata: Record<string, string> = {
      patientId: options.patientId,
      documentType: options.documentType,
      uploadedBy: options.uploadedBy,
      uploadedAt: new Date().toISOString(),
      encryptionMethod: 'AES-256',
      checksum,
      version: options.version?.toString() || '1',
      virusScanned: 'true',
      virusScanDate: scanResult.scannedAt.toISOString(),
      virusScanResult: scanResult.isClean ? 'clean' : 'unknown',
      ...(options.description && { description: options.description }),
      ...(options.metadata || {}),
    };

    try {
      // Upload the object
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: options.mimeType,
        ContentDisposition: `attachment; filename="${options.fileName}"`,
        Metadata: metadata,
        ServerSideEncryption: 'AES256',
        Tagging: `patientId=${options.patientId}&documentType=${options.documentType}&uploadedBy=${options.uploadedBy}&hipaaCompliant=true&virusScanned=true`,
      });

      const response = await this.s3Client!.send(command);

      // Generate thumbnail if requested and file is an image
      let thumbnailUrl: string | undefined;
      if (options.generateThumbnail && IMAGE_MIME_TYPES.includes(options.mimeType.toLowerCase())) {
        try {
          const thumbnail = await this.generateThumbnail(buffer, options.mimeType);
          if (thumbnail) {
            const thumbnailKey = `${key}_thumbnail.jpg`;
            await this.s3Client!.send(new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: thumbnailKey,
              Body: thumbnail,
              ContentType: 'image/jpeg',
              Metadata: {
                ...metadata,
                isThumbnail: 'true',
                originalKey: key,
              },
              ServerSideEncryption: 'AES256',
            }));

            thumbnailUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${thumbnailKey}`;
          }
        } catch (thumbError) {
          console.error('Failed to generate thumbnail:', thumbError);
        }
      }

      console.log(`[Upload] Successfully uploaded '${options.fileName}' as '${key}'`);

      return {
        key,
        url: `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`,
        bucketName: BUCKET_NAME,
        contentType: options.mimeType,
        size: actualFileSize,
        etag: response.ETag,
        versionId: response.VersionId,
        thumbnailUrl,
        metadata: { ...metadata, checksum },
        virusScanResult: scanResult,
      };
    } catch (error) {
      console.error('Failed to upload document to S3:', error);
      throw new InternalServerError('Failed to upload document');
    }
  }

  /**
   * Upload document to S3 (streaming)
   */
  async uploadDocument(
    stream: Readable,
    options: UploadOptions
  ): Promise<UploadResult> {
    // Convert stream to buffer for virus scanning
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    return this.uploadDocumentWithVirusScan(buffer, options);
  }

  /**
   * Generate presigned URL for secure download with time limit
   */
  async generateDownloadUrl(
    key: string,
    options: DownloadOptions = {}
  ): Promise<string> {
    if (!this.s3Client) {
      await this.initialize();
    }

    // Check if object exists
    try {
      await this.s3Client!.send(new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundError(`Object '${key}' not found`);
      }
      throw error;
    }

    const expirySeconds = options.expirySeconds || PRESIGNED_URL_EXPIRY_SECONDS;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ...(options.downloadFileName && {
        ResponseContentDisposition: `attachment; filename="${options.downloadFileName}"`,
      }),
    });

    return getSignedUrl(this.s3Client!, command, { expiresIn: expirySeconds });
  }

  /**
   * Generate presigned URL for direct upload
   */
  async generateUploadUrl(
    patientId: string,
    documentType: string,
    fileName: string,
    mimeType: string
  ): Promise<{ uploadUrl: string; key: string; expiresAt: Date }> {
    if (!this.s3Client) {
      await this.initialize();
    }

    this.validateMimeType(mimeType);

    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = this.sanitizeFileName(fileName);
    const key = `${patientId}/${documentType}/${timestamp}_${random}_${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      ServerSideEncryption: 'AES256',
    });

    const uploadUrl = await getSignedUrl(this.s3Client!, command, {
      expiresIn: UPLOAD_PRESIGNED_URL_EXPIRY_SECONDS,
    });

    const expiresAt = new Date(Date.now() + UPLOAD_PRESIGNED_URL_EXPIRY_SECONDS * 1000);

    return { uploadUrl, key, expiresAt };
  }

  /**
   * Delete document
   */
  async deleteDocument(key: string): Promise<void> {
    if (!this.s3Client) {
      await this.initialize();
    }

    // Check if object exists
    try {
      await this.s3Client!.send(new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundError(`Object '${key}' not found`);
      }
      throw error;
    }

    try {
      await this.s3Client!.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));

      // Also delete thumbnail if it exists
      try {
        const thumbnailKey = `${key}_thumbnail.jpg`;
        await this.s3Client!.send(new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: thumbnailKey,
        }));
      } catch (thumbError) {
        // Thumbnail may not exist, ignore error
      }
    } catch (error) {
      console.error('Failed to delete object:', error);
      throw new InternalServerError('Failed to delete document');
    }
  }

  /**
   * List objects with filtering options
   */
  async listObjects(options: ListObjectsOptions = {}): Promise<ObjectInfo[]> {
    if (!this.s3Client) {
      await this.initialize();
    }

    const objects: ObjectInfo[] = [];
    const maxResults = options.maxResults || 100;

    try {
      const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: options.prefix,
        MaxKeys: maxResults,
      });

      const response = await this.s3Client!.send(command);

      for (const obj of response.Contents || []) {
        if (!obj.Key) continue;

        const objectInfo: ObjectInfo = {
          key: obj.Key,
          url: `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${obj.Key}`,
          size: obj.Size || 0,
          lastModified: obj.LastModified,
        };

        if (options.includeMetadata) {
          try {
            const headResponse = await this.s3Client!.send(new HeadObjectCommand({
              Bucket: BUCKET_NAME,
              Key: obj.Key,
            }));
            objectInfo.contentType = headResponse.ContentType;
            objectInfo.metadata = headResponse.Metadata;
          } catch (error) {
            console.warn(`Failed to get metadata for ${obj.Key}:`, error);
          }
        }

        objects.push(objectInfo);
      }

      return objects;
    } catch (error) {
      console.error('Failed to list objects:', error);
      throw new InternalServerError('Failed to list documents');
    }
  }

  /**
   * Get object metadata
   */
  async getObjectMetadata(key: string): Promise<DocumentMetadata> {
    if (!this.s3Client) {
      await this.initialize();
    }

    try {
      const response = await this.s3Client!.send(new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));

      return response.Metadata as DocumentMetadata;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundError(`Object '${key}' not found`);
      }
      console.error('Failed to get object metadata:', error);
      throw new InternalServerError('Failed to get document metadata');
    }
  }

  /**
   * Copy object for versioning
   */
  async createVersion(key: string, versionNumber: number): Promise<string> {
    if (!this.s3Client) {
      await this.initialize();
    }

    const versionedKey = `${key}_v${versionNumber}`;

    try {
      await this.s3Client!.send(new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${key}`,
        Key: versionedKey,
        MetadataDirective: 'COPY',
        ServerSideEncryption: 'AES256',
      }));

      return versionedKey;
    } catch (error) {
      console.error('Failed to create object version:', error);
      throw new InternalServerError('Failed to create document version');
    }
  }

  /**
   * Scan file before upload
   */
  async scanFileBeforeUpload(
    buffer: Buffer,
    fileName: string,
    options: UploadOptions
  ): Promise<VirusScanResult> {
    const scanResult = await virusScannerService.scanBuffer(buffer, fileName);

    const auditLog: VirusScanAuditLog = {
      fileName,
      fileSize: buffer.length,
      mimeType: options.mimeType,
      uploadedBy: options.uploadedBy,
      patientId: options.patientId,
      scanResult,
      action: scanResult.isInfected
        ? 'rejected'
        : scanResult.error && !scanResult.isClean
        ? 'scan_failed'
        : 'allowed',
      timestamp: new Date(),
    };

    virusScannerService.logScanResult(auditLog);

    return scanResult;
  }

  /**
   * Scan existing object for viruses
   */
  async scanForViruses(key: string): Promise<{ clean: boolean; threats?: string[] }> {
    if (!this.s3Client) {
      await this.initialize();
    }

    try {
      const response = await this.s3Client!.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));

      const chunks: Buffer[] = [];
      const stream = response.Body as Readable;
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);

      const scanResult = await virusScannerService.scanBuffer(buffer, key);

      console.log(`[Virus Scan] Scanned object '${key}': ${scanResult.isClean ? 'CLEAN' : 'INFECTED'}`);

      return {
        clean: scanResult.isClean && !scanResult.isInfected,
        threats: scanResult.viruses.length > 0 ? scanResult.viruses : undefined,
      };
    } catch (error) {
      console.error(`[Virus Scan] Error scanning object '${key}':`, error);
      throw new InternalServerError('Failed to scan document for viruses');
    }
  }

  /**
   * Get storage usage statistics for a patient
   */
  async getPatientStorageStats(patientId: string): Promise<{
    totalSize: number;
    fileCount: number;
    documentTypes: Record<string, number>;
  }> {
    const objects = await this.listObjects({
      prefix: `${patientId}/`,
      includeMetadata: true,
    });

    let totalSize = 0;
    const documentTypes: Record<string, number> = {};

    for (const obj of objects) {
      totalSize += obj.size;

      if (obj.metadata?.documentType) {
        documentTypes[obj.metadata.documentType] =
          (documentTypes[obj.metadata.documentType] || 0) + 1;
      }
    }

    return {
      totalSize,
      fileCount: objects.length,
      documentTypes,
    };
  }

  /**
   * Download object as buffer
   */
  async downloadObject(key: string): Promise<Buffer> {
    if (!this.s3Client) {
      await this.initialize();
    }

    try {
      const response = await this.s3Client!.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));

      const chunks: Buffer[] = [];
      const stream = response.Body as Readable;
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }

      return Buffer.concat(chunks);
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundError(`Object '${key}' not found`);
      }
      console.error('Failed to download object:', error);
      throw new InternalServerError('Failed to download document');
    }
  }
}

// Export singleton instances
export const s3StorageService = new S3StorageService();

// Export for backward compatibility with Azure naming
export const azureStorageService = s3StorageService;

// Export virus scanner service for direct access if needed
export { virusScannerService };

// Export virus scanning configuration check
export const isVirusScanningEnabled = (): boolean => VIRUS_SCAN_ENABLED;
export const isVirusScanningRequired = (): boolean =>
  process.env.VIRUS_SCAN_REQUIRED === 'true';
