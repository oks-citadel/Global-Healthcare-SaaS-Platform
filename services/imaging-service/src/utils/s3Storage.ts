import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from './logger';
import { Readable } from 'stream';

class S3StorageService {
  private s3Client: S3Client | null = null;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET || 'medical-images';
    this.initialize();
  }

  private async initialize() {
    try {
      const region = process.env.AWS_REGION || 'us-east-1';

      if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        logger.warn('AWS credentials not configured');
        return;
      }

      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      // Check if bucket exists, create if not
      try {
        await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
        logger.info(`S3 bucket '${this.bucketName}' already exists`);
      } catch (error: any) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
          await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
          logger.info(`S3 bucket '${this.bucketName}' created successfully`);
        } else {
          throw error;
        }
      }

      logger.info('AWS S3 Storage initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize AWS S3 Storage', error);
    }
  }

  async uploadImage(
    key: string,
    data: Buffer,
    contentType: string = 'application/dicom'
  ): Promise<string> {
    if (!this.s3Client) {
      throw new Error('S3 Storage not initialized');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: data,
      ContentType: contentType,
      ServerSideEncryption: 'AES256',
    });

    await this.s3Client.send(command);

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }

  async downloadImage(key: string): Promise<Buffer> {
    if (!this.s3Client) {
      throw new Error('S3 Storage not initialized');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);

    if (!response.Body) {
      throw new Error('Failed to download image');
    }

    // Convert stream to buffer
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  async deleteImage(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error('S3 Storage not initialized');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async generatePresignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    if (!this.s3Client) {
      throw new Error('S3 Storage not initialized');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
  }

  async exists(key: string): Promise<boolean> {
    if (!this.s3Client) {
      throw new Error('S3 Storage not initialized');
    }

    try {
      await this.s3Client.send(new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }));
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }
}

export default new S3StorageService();
