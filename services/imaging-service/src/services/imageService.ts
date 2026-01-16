import { PrismaClient } from '../generated/client';
import { CreateImageDTO } from '../types';
import logger from '../utils/logger';
import { AppError } from '../utils/errorHandler';
import s3Storage from '../utils/s3Storage';

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

      // Delete from S3 Storage
      try {
        const key = this.getKeyFromUrl(image.storageUrl);
        await s3Storage.deleteImage(key);
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
      const key = this.getKeyFromUrl(image.storageUrl);

      const url = await s3Storage.generatePresignedUrl(key, expiresInMinutes * 60);

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

  private getKeyFromUrl(url: string): string {
    // Extract S3 key from URL
    // Handle both S3 URL formats: https://bucket.s3.region.amazonaws.com/key and https://s3.region.amazonaws.com/bucket/key
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      // Remove leading slash
      return path.startsWith('/') ? path.slice(1) : path;
    } catch {
      // Fallback: assume it's just a key
      return url;
    }
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
