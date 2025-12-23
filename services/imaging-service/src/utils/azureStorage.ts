import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import logger from './logger';

class AzureStorageService {
  private containerClient: ContainerClient | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
      const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'medical-images';

      if (!connectionString) {
        logger.warn('Azure Storage connection string not configured');
        return;
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      this.containerClient = blobServiceClient.getContainerClient(containerName);

      // Create container if it doesn't exist
      await this.containerClient.createIfNotExists({
        access: undefined,
      });

      logger.info('Azure Blob Storage initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Azure Blob Storage', error);
    }
  }

  async uploadImage(
    blobName: string,
    data: Buffer,
    contentType: string = 'application/dicom'
  ): Promise<string> {
    if (!this.containerClient) {
      throw new Error('Azure Storage not initialized');
    }

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(data, data.length, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    return blockBlobClient.url;
  }

  async downloadImage(blobName: string): Promise<Buffer> {
    if (!this.containerClient) {
      throw new Error('Azure Storage not initialized');
    }

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    const downloadResponse = await blockBlobClient.download(0);

    if (!downloadResponse.readableStreamBody) {
      throw new Error('Failed to download image');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  async deleteImage(blobName: string): Promise<void> {
    if (!this.containerClient) {
      throw new Error('Azure Storage not initialized');
    }

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  }

  async generateSasUrl(blobName: string, expiresInMinutes: number = 60): Promise<string> {
    if (!this.containerClient) {
      throw new Error('Azure Storage not initialized');
    }

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    // In production, you would generate a SAS token here
    // For now, returning the blob URL
    return blockBlobClient.url;
  }
}

export default new AzureStorageService();
