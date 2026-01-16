/**
 * Unit Tests for ImageService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to define mocks before hoisting
const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const instance = {
    image: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    study: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  };

  function MockPrismaClient() {
    return instance;
  }

  return { mockPrismaInstance: instance, MockPrismaClient };
});

vi.mock('../../../src/generated/client', () => ({
  PrismaClient: MockPrismaClient,
}));

vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

const mockS3Storage = {
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
  generatePresignedUrl: vi.fn(),
};

vi.mock('../../../src/utils/s3Storage', () => ({
  default: mockS3Storage,
}));

import ImageService from '../../../src/services/imageService';
import { mockDicomImage, mockStudy } from '../helpers/fixtures';

describe('ImageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createImage', () => {
    it('should create an image successfully', async () => {
      const createData = {
        studyId: 'study-123',
        seriesInstanceUID: '1.2.840.1234567890.123456.1',
        sopInstanceUID: '1.2.840.1234567890.123456.1.1',
        instanceNumber: 1,
        seriesNumber: 1,
        storageUrl: 's3://bucket/image.dcm',
        fileSize: 2048000,
      };

      mockPrismaInstance.image.create.mockResolvedValue({
        ...mockDicomImage,
        ...createData,
      });
      mockPrismaInstance.image.findMany.mockResolvedValue([mockDicomImage]);
      mockPrismaInstance.study.update.mockResolvedValue(mockStudy);

      const result = await ImageService.createImage(createData);

      expect(mockPrismaInstance.image.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.studyId).toBe('study-123');
    });

    it('should throw error when creation fails', async () => {
      mockPrismaInstance.image.create.mockRejectedValue(new Error('Database error'));

      await expect(
        ImageService.createImage({
          studyId: 'study-123',
          seriesInstanceUID: '1.2.840.1234567890.123456.1',
          sopInstanceUID: '1.2.840.1234567890.123456.1.1',
          instanceNumber: 1,
          seriesNumber: 1,
          storageUrl: 's3://bucket/image.dcm',
          fileSize: 2048000,
        })
      ).rejects.toThrow('Failed to create image');
    });
  });

  describe('getImagesByStudy', () => {
    it('should return images for a study', async () => {
      const images = [
        { ...mockDicomImage, instanceNumber: 1 },
        { ...mockDicomImage, id: 'image-456', instanceNumber: 2 },
      ];
      mockPrismaInstance.image.findMany.mockResolvedValue(images);

      const result = await ImageService.getImagesByStudy('study-123');

      expect(mockPrismaInstance.image.findMany).toHaveBeenCalledWith({
        where: { studyId: 'study-123' },
        orderBy: [{ seriesNumber: 'asc' }, { instanceNumber: 'asc' }],
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no images found', async () => {
      mockPrismaInstance.image.findMany.mockResolvedValue([]);
      const result = await ImageService.getImagesByStudy('study-123');
      expect(result).toHaveLength(0);
    });

    it('should throw error when fetch fails', async () => {
      mockPrismaInstance.image.findMany.mockRejectedValue(new Error('Database error'));
      await expect(ImageService.getImagesByStudy('study-123')).rejects.toThrow('Failed to fetch images');
    });
  });

  describe('getImageById', () => {
    it('should return image when found', async () => {
      mockPrismaInstance.image.findUnique.mockResolvedValue({
        ...mockDicomImage,
        study: { id: 'study-123', accessionNumber: 'ACC-123', patientName: 'John Doe', modality: 'CT' },
      });

      const result = await ImageService.getImageById('image-123');
      expect(result).toBeDefined();
      expect(result.id).toBe('image-123');
    });

    it('should throw error when image not found', async () => {
      mockPrismaInstance.image.findUnique.mockResolvedValue(null);
      await expect(ImageService.getImageById('non-existent')).rejects.toThrow('Image not found');
    });
  });

  describe('deleteImage', () => {
    it('should delete image from database and storage', async () => {
      mockPrismaInstance.image.findUnique.mockResolvedValue(mockDicomImage);
      mockPrismaInstance.image.delete.mockResolvedValue(mockDicomImage);
      mockPrismaInstance.image.findMany.mockResolvedValue([]);
      mockPrismaInstance.study.update.mockResolvedValue(mockStudy);
      mockS3Storage.deleteImage.mockResolvedValue(undefined);

      await ImageService.deleteImage('image-123');

      expect(mockPrismaInstance.image.delete).toHaveBeenCalledWith({ where: { id: 'image-123' } });
      expect(mockS3Storage.deleteImage).toHaveBeenCalled();
    });

    it('should throw error when image not found', async () => {
      mockPrismaInstance.image.findUnique.mockResolvedValue(null);
      await expect(ImageService.deleteImage('non-existent')).rejects.toThrow('Image not found');
    });
  });

  describe('updateImageMetadata', () => {
    it('should update image metadata', async () => {
      const metadata = { annotation: 'test annotation', processed: true };
      mockPrismaInstance.image.update.mockResolvedValue({ ...mockDicomImage, metadata });

      const result = await ImageService.updateImageMetadata('image-123', metadata);
      expect(mockPrismaInstance.image.update).toHaveBeenCalledWith({
        where: { id: 'image-123' },
        data: { metadata },
      });
      expect(result.metadata).toEqual(metadata);
    });

    it('should throw error when update fails', async () => {
      mockPrismaInstance.image.update.mockRejectedValue(new Error('Database error'));
      await expect(ImageService.updateImageMetadata('image-123', { test: 'data' })).rejects.toThrow('Failed to update image metadata');
    });
  });
});
