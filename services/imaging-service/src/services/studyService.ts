import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateStudyDTO, UpdateStudyDTO, StudyFilters } from '../types';
import logger from '../utils/logger';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

class StudyService {
  async createStudy(data: CreateStudyDTO) {
    try {
      // Generate unique accession number
      const accessionNumber = `ACC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Generate DICOM Study Instance UID (simplified version)
      const studyInstanceUID = `1.2.840.${Date.now()}.${Math.floor(Math.random() * 1000000)}`;

      const study = await prisma.study.create({
        data: {
          accessionNumber,
          studyInstanceUID,
          ...data,
        },
      });

      // Update order status
      await prisma.imagingOrder.update({
        where: { id: data.orderId },
        data: { status: 'IN_PROGRESS' },
      });

      logger.info(`Study created: ${study.id}`);
      return study;
    } catch (error) {
      logger.error('Error creating study', error);
      throw new AppError('Failed to create study', 500);
    }
  }

  async getStudies(filters: StudyFilters) {
    try {
      const {
        page = 1,
        limit = 10,
        patientId,
        orderId,
        modality,
        status,
        startDate,
        endDate,
      } = filters;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (patientId) where.patientId = patientId;
      if (orderId) where.orderId = orderId;
      if (modality) where.modality = modality;
      if (status) where.status = status;

      if (startDate || endDate) {
        where.studyDate = {};
        if (startDate) where.studyDate.gte = startDate;
        if (endDate) where.studyDate.lte = endDate;
      }

      const [studies, total] = await Promise.all([
        prisma.study.findMany({
          where,
          skip,
          take: limit,
          orderBy: { studyDate: 'desc' },
          include: {
            order: {
              select: {
                orderNumber: true,
                priority: true,
              },
            },
            reports: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        }),
        prisma.study.count({ where }),
      ]);

      return {
        studies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching studies', error);
      throw new AppError('Failed to fetch studies', 500);
    }
  }

  async getStudyById(id: string) {
    try {
      const study = await prisma.study.findUnique({
        where: { id },
        include: {
          order: true,
          images: {
            orderBy: {
              seriesNumber: 'asc',
            },
          },
          reports: true,
          criticalFindings: true,
        },
      });

      if (!study) {
        throw new AppError('Study not found', 404);
      }

      return study;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching study', error);
      throw new AppError('Failed to fetch study', 500);
    }
  }

  async updateStudy(id: string, data: UpdateStudyDTO) {
    try {
      const study = await prisma.study.update({
        where: { id },
        data,
      });

      logger.info(`Study updated: ${study.id}`);
      return study;
    } catch (error) {
      logger.error('Error updating study', error);
      throw new AppError('Failed to update study', 500);
    }
  }

  async updateStudyStatus(id: string, status: any) {
    try {
      const study = await prisma.study.update({
        where: { id },
        data: { status },
      });

      // Update order status if study is completed
      if (status === 'COMPLETED' || status === 'FINAL') {
        const orderStudies = await prisma.study.findMany({
          where: { orderId: study.orderId },
        });

        const allCompleted = orderStudies.every(s =>
          s.status === 'COMPLETED' || s.status === 'FINAL'
        );

        if (allCompleted) {
          await prisma.imagingOrder.update({
            where: { id: study.orderId },
            data: { status: 'COMPLETED' },
          });
        }
      }

      logger.info(`Study status updated: ${study.id} -> ${status}`);
      return study;
    } catch (error) {
      logger.error('Error updating study status', error);
      throw new AppError('Failed to update study status', 500);
    }
  }

  async getStudyByAccessionNumber(accessionNumber: string) {
    try {
      const study = await prisma.study.findUnique({
        where: { accessionNumber },
        include: {
          order: true,
          images: true,
          reports: true,
        },
      });

      if (!study) {
        throw new AppError('Study not found', 404);
      }

      return study;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching study by accession number', error);
      throw new AppError('Failed to fetch study', 500);
    }
  }

  async deleteStudy(id: string) {
    try {
      await prisma.study.delete({
        where: { id },
      });

      logger.info(`Study deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting study', error);
      throw new AppError('Failed to delete study', 500);
    }
  }
}

export default new StudyService();
