import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface UploadOptions {
  key?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read';
  folder?: string;
}

export interface UploadResult {
  key: string;
  bucket: string;
  url: string;
  cdnUrl?: string;
  size: number;
}

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private client: S3Client;
  private bucket: string;
  private cdnUrl?: string;
  private region: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    this.bucket = this.configService.get<string>('S3_BUCKET_NAME', 'unified-health-content');
    this.cdnUrl = this.configService.get<string>('S3_CDN_URL');

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });

    this.logger.log(`S3 service initialized for bucket: ${this.bucket}`);
  }

  /**
   * Upload a file to S3
   */
  async upload(
    file: Buffer,
    filename: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const key = options.key || this.generateKey(filename, options.folder);
    const contentType = options.contentType || this.getMimeType(filename);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: options.metadata,
      ACL: options.acl || 'private',
    });

    await this.client.send(command);

    const url = this.getObjectUrl(key);
    const cdnUrl = this.cdnUrl ? `${this.cdnUrl}/${key}` : undefined;

    this.logger.log(`File uploaded: ${key}`);

    return {
      key,
      bucket: this.bucket,
      url,
      cdnUrl,
      size: file.length,
    };
  }

  /**
   * Get a signed URL for uploading directly to S3
   */
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Get a signed URL for downloading from S3
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Download a file from S3
   */
  async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);
    const stream = response.Body as NodeJS.ReadableStream;

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  /**
   * Delete a file from S3
   */
  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
    this.logger.log(`File deleted: ${key}`);
  }

  /**
   * Check if a file exists in S3
   */
  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getMetadata(key: string): Promise<{
    contentType?: string;
    contentLength?: number;
    lastModified?: Date;
    metadata?: Record<string, string>;
  }> {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);

    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    };
  }

  /**
   * List files in a folder
   */
  async list(
    prefix: string,
    maxKeys: number = 1000,
  ): Promise<{ key: string; size: number; lastModified: Date }[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    const response = await this.client.send(command);

    return (response.Contents || []).map((item) => ({
      key: item.Key!,
      size: item.Size!,
      lastModified: item.LastModified!,
    }));
  }

  /**
   * Copy a file within S3
   */
  async copy(sourceKey: string, destinationKey: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${sourceKey}`,
      Key: destinationKey,
    });

    await this.client.send(command);
    this.logger.log(`File copied: ${sourceKey} -> ${destinationKey}`);
  }

  /**
   * Generate a unique key for a file
   */
  private generateKey(filename: string, folder?: string): string {
    const uuid = uuidv4();
    const extension = filename.split('.').pop() || '';
    const key = extension ? `${uuid}.${extension}` : uuid;

    return folder ? `${folder}/${key}` : key;
  }

  /**
   * Get the public URL for an object
   */
  private getObjectUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  /**
   * Get MIME type from filename
   */
  private getMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      mp4: 'video/mp4',
      webm: 'video/webm',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      json: 'application/json',
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }
}
