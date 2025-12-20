import { PrismaClient } from '@prisma/client';
import { CreateImageDTO } from '../types';
import logger from '../utils/logger';
import { AppError } from '../utils/errorHandler';
import azureStorage from '../utils/azureStorage';

const prisma = new PrismaClient();

class ImageService {
  async createImage(data: CreateImageDTO) {
    try {
      const image = await prisma.image.create({
        data: {
          ...data,
          fileSize: BigInt(data.fileSize.toString()),
        },
      });

      // Update study instance count
      await this.updateStudyCounts(data.studyId);

      logger.info(`Image created: ${image.id}`);
      return image;
    } catch (error) {
      logger.error('Error creating image', error);
      throw new AppError('Failed to create image', 500);
    }
  }

  async getImagesByStudy(studyId: string) {
    try {
      const images = await prisma.image.findMany({
        where: { studyId },
        orderBy: [
          { seriesNumber: 'asc' },
          { instanceNumber: 'asc' },
        ],
      });

      return images;
    } catch (error) {
      logger.error('Error fetching images', error);
      throw new AppError('Failed to fetch images', 500);
    }
  }

  async getImageById(id: string) {
    try {
      const image = await prisma.image.findUnique({
        where: { id },
        include: {
          study: {
            select: {
              id: true,
              accessionNumber: true,
              patientName: true,
              modality: true,
            },
          },
        },
      });

      if (!image) {
        throw new AppError('Image not found', 404);
      }

      return image;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching image', error);
      throw new AppError('Failed to fetch image', 500);
    }
  }

  async getImagesBySeries(studyId: string, seriesInstanceUID: string) {
    try {
      const images = await prisma.image.findMany({
        where: {
          studyId,
          seriesInstanceUID,
        },
        orderBy: { instanceNumber: 'asc' },
      });

      return images;
    } catch (error) {
      logger.error('Error fetching series images', error);
      throw new AppError('Failed to fetch series images', 500);
    }
  }

  async deleteImage(id: string) {
    try {
      const image = await prisma.image.findUnique({
        where: { id },
      });

      if (!image) {
        throw new AppError('Image not found', 404);
      }

      // Delete from Azure Blob Storage
      try {
        const blobName = this.getBlobNameFromUrl(image.storageUrl);
        await azureStorage.deleteImage(blobName);
      } catch (storageError) {
        logger.error('Error deleting image from storage', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      await prisma.image.delete({
        where: { id },
      });

      // Update study counts
      await this.updateStudyCounts(image.studyId);

      logger.info(`Image deleted: ${id}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting image', error);
      throw new AppError('Failed to delete image', 500);
    }
  }

  async getImageUrl(id: string, expiresInMinutes: number = 60) {
    try {
      const image = await this.getImageById(id);
      const blobName = this.getBlobNameFromUrl(image.storageUrl);

      const url = await azureStorage.generateSasUrl(blobName, expiresInMinutes);

      return url;
    } catch (error) {
      logger.error('Error generating image URL', error);
      throw new AppError('Failed to generate image URL', 500);
    }
  }

  private async updateStudyCounts(studyId: string) {
    try {
      const images = await prisma.image.findMany({
        where: { studyId },
        select: {
          seriesInstanceUID: true,
        },
      });

      const numberOfInstances = images.length;
      const uniqueSeries = new Set(images.map(img => img.seriesInstanceUID));
      const numberOfSeries = uniqueSeries.size;

      await prisma.study.update({
        where: { id: studyId },
        data: {
          numberOfSeries,
          numberOfInstances,
        },
      });
    } catch (error) {
      logger.error('Error updating study counts', error);
      // Don't throw error here, as it's a secondary operation
    }
  }

  private getBlobNameFromUrl(url: string): string {
    // Extract blob name from URL
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  async updateImageMetadata(id: string, metadata: any) {
    try {
      const image = await prisma.image.update({
        where: { id },
        data: { metadata },
      });

      logger.info(`Image metadata updated: ${id}`);
      return image;
    } catch (error) {
      logger.error('Error updating image metadata', error);
      throw new AppError('Failed to update image metadata', 500);
    }
  }
}

export default new ImageService();
