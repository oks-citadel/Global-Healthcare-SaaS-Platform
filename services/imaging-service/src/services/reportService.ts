import { PrismaClient } from '../generated/client';
import { CreateRadiologyReportDTO, UpdateRadiologyReportDTO } from '../types';
import logger from '../utils/logger';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

class ReportService {
  async createReport(data: CreateRadiologyReportDTO) {
    try {
      const reportNumber = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const report = await prisma.radiologyReport.create({
        data: {
          reportNumber,
          status: data.status || 'PRELIMINARY',
          preliminaryDate: new Date(),
          ...data,
        },
      });

      // Update study status
      await prisma.study.update({
        where: { id: data.studyId },
        data: { status: 'PRELIMINARY' },
      });

      logger.info(`Radiology report created: ${report.id}`);
      return report;
    } catch (error) {
      logger.error('Error creating report', error);
      throw new AppError('Failed to create report', 500);
    }
  }

  async getReportById(id: string) {
    try {
      const report = await prisma.radiologyReport.findUnique({
        where: { id },
        include: {
          study: {
            select: {
              id: true,
              accessionNumber: true,
              patientName: true,
              studyDate: true,
              modality: true,
            },
          },
        },
      });

      if (!report) {
        throw new AppError('Report not found', 404);
      }

      return report;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching report', error);
      throw new AppError('Failed to fetch report', 500);
    }
  }

  async getReportByStudyId(studyId: string) {
    try {
      const reports = await prisma.radiologyReport.findMany({
        where: { studyId },
        orderBy: { createdAt: 'desc' },
      });

      return reports;
    } catch (error) {
      logger.error('Error fetching study reports', error);
      throw new AppError('Failed to fetch study reports', 500);
    }
  }

  async updateReport(id: string, data: UpdateRadiologyReportDTO) {
    try {
      const updateData: any = { ...data };

      // Handle status transitions
      if (data.status === 'FINAL' && !updateData.finalizedDate) {
        updateData.finalizedDate = new Date();
      }

      if (data.status === 'AMENDED' && !updateData.amendedDate) {
        updateData.amendedDate = new Date();
      }

      const report = await prisma.radiologyReport.update({
        where: { id },
        data: updateData,
      });

      // Update study status if report is finalized
      if (data.status === 'FINAL') {
        await prisma.study.update({
          where: { id: report.studyId },
          data: { status: 'FINAL' },
        });
      }

      logger.info(`Report updated: ${report.id}`);
      return report;
    } catch (error) {
      logger.error('Error updating report', error);
      throw new AppError('Failed to update report', 500);
    }
  }

  async signReport(id: string, signedBy: string) {
    try {
      const report = await prisma.radiologyReport.update({
        where: { id },
        data: {
          signedBy,
          signedAt: new Date(),
          status: 'FINAL',
          finalizedDate: new Date(),
        },
      });

      // Update study status to FINAL
      await prisma.study.update({
        where: { id: report.studyId },
        data: { status: 'FINAL' },
      });

      logger.info(`Report signed: ${report.id} by ${signedBy}`);
      return report;
    } catch (error) {
      logger.error('Error signing report', error);
      throw new AppError('Failed to sign report', 500);
    }
  }

  async amendReport(id: string, amendmentReason: string, updates: UpdateRadiologyReportDTO) {
    try {
      const report = await prisma.radiologyReport.update({
        where: { id },
        data: {
          ...updates,
          status: 'AMENDED',
          amendedDate: new Date(),
          amendmentReason,
        },
      });

      logger.info(`Report amended: ${report.id}`);
      return report;
    } catch (error) {
      logger.error('Error amending report', error);
      throw new AppError('Failed to amend report', 500);
    }
  }

  async getReportsByRadiologist(radiologistId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [reports, total] = await Promise.all([
        prisma.radiologyReport.findMany({
          where: { radiologistId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            study: {
              select: {
                accessionNumber: true,
                patientName: true,
                modality: true,
                studyDate: true,
              },
            },
          },
        }),
        prisma.radiologyReport.count({ where: { radiologistId } }),
      ]);

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching radiologist reports', error);
      throw new AppError('Failed to fetch radiologist reports', 500);
    }
  }

  async deleteReport(id: string) {
    try {
      const report = await prisma.radiologyReport.findUnique({
        where: { id },
      });

      if (!report) {
        throw new AppError('Report not found', 404);
      }

      // Only allow deletion of preliminary reports
      if (report.status !== 'PRELIMINARY') {
        throw new AppError('Only preliminary reports can be deleted', 400);
      }

      await prisma.radiologyReport.delete({
        where: { id },
      });

      logger.info(`Report deleted: ${id}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting report', error);
      throw new AppError('Failed to delete report', 500);
    }
  }
}

export default new ReportService();
