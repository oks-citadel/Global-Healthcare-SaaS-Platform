import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { CreateCriticalFindingDTO, UpdateCriticalFindingDTO } from '../types';
import logger from '../utils/logger';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

class CriticalFindingService {
  async createCriticalFinding(data: CreateCriticalFindingDTO) {
    try {
      const finding = await prisma.criticalFinding.create({
        data,
      });

      // Send notifications asynchronously
      this.sendNotifications(finding).catch(error => {
        logger.error('Error sending critical finding notifications', error);
      });

      logger.info(`Critical finding created: ${finding.id}`);
      return finding;
    } catch (error) {
      logger.error('Error creating critical finding', error);
      throw new AppError('Failed to create critical finding', 500);
    }
  }

  async getCriticalFindingById(id: string) {
    try {
      const finding = await prisma.criticalFinding.findUnique({
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

      if (!finding) {
        throw new AppError('Critical finding not found', 404);
      }

      return finding;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching critical finding', error);
      throw new AppError('Failed to fetch critical finding', 500);
    }
  }

  async getCriticalFindingsByStudy(studyId: string) {
    try {
      const findings = await prisma.criticalFinding.findMany({
        where: { studyId },
        orderBy: { createdAt: 'desc' },
      });

      return findings;
    } catch (error) {
      logger.error('Error fetching critical findings', error);
      throw new AppError('Failed to fetch critical findings', 500);
    }
  }

  async updateCriticalFinding(id: string, data: UpdateCriticalFindingDTO) {
    try {
      const updateData: any = { ...data };

      if (data.acknowledgedBy && !updateData.acknowledgedAt) {
        updateData.acknowledgedAt = new Date();
      }

      const finding = await prisma.criticalFinding.update({
        where: { id },
        data: updateData,
      });

      logger.info(`Critical finding updated: ${finding.id}`);
      return finding;
    } catch (error) {
      logger.error('Error updating critical finding', error);
      throw new AppError('Failed to update critical finding', 500);
    }
  }

  async acknowledgeCriticalFinding(id: string, acknowledgedBy: string) {
    try {
      const finding = await prisma.criticalFinding.update({
        where: { id },
        data: {
          acknowledgedBy,
          acknowledgedAt: new Date(),
        },
      });

      logger.info(`Critical finding acknowledged: ${finding.id} by ${acknowledgedBy}`);
      return finding;
    } catch (error) {
      logger.error('Error acknowledging critical finding', error);
      throw new AppError('Failed to acknowledge critical finding', 500);
    }
  }

  async getPendingCriticalFindings(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [findings, total] = await Promise.all([
        prisma.criticalFinding.findMany({
          where: {
            acknowledgedBy: null,
          },
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
        prisma.criticalFinding.count({
          where: { acknowledgedBy: null },
        }),
      ]);

      return {
        findings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching pending critical findings', error);
      throw new AppError('Failed to fetch pending critical findings', 500);
    }
  }

  async getCriticalFindingsBySeverity(severity: any, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [findings, total] = await Promise.all([
        prisma.criticalFinding.findMany({
          where: { severity },
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
        prisma.criticalFinding.count({ where: { severity } }),
      ]);

      return {
        findings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching critical findings by severity', error);
      throw new AppError('Failed to fetch critical findings by severity', 500);
    }
  }

  private async sendNotifications(finding: any) {
    try {
      const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL;

      if (!notificationServiceUrl) {
        logger.warn('Notification service URL not configured');
        return;
      }

      const study = await prisma.study.findUnique({
        where: { id: finding.studyId },
      });

      if (!study) {
        logger.error('Study not found for critical finding');
        return;
      }

      // Send notifications to all recipients
      const notifications = finding.notifiedTo.map((recipient: string) => ({
        recipient,
        subject: `CRITICAL FINDING: ${finding.category}`,
        message: `Critical finding detected in study ${study.accessionNumber} for patient ${study.patientName}.\n\nFinding: ${finding.finding}\n\nSeverity: ${finding.severity}\n\nReported by: ${finding.reportedBy}`,
        priority: 'CRITICAL',
        type: 'CRITICAL_FINDING',
      }));

      await axios.post(`${notificationServiceUrl}/notifications/batch`, {
        notifications,
      });

      // Mark notifications as sent
      await prisma.criticalFinding.update({
        where: { id: finding.id },
        data: { notificationSent: true },
      });

      logger.info(`Notifications sent for critical finding: ${finding.id}`);
    } catch (error) {
      logger.error('Error in sendNotifications', error);
      // Don't throw error, as this is a background operation
    }
  }
}

export default new CriticalFindingService();
