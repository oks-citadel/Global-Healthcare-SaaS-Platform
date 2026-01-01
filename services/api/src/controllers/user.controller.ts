// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { UpdateUserSchema } from '../dtos/user.dto.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export const userController = {
  /**
   * GET /users/:id
   * Get user by ID
   */
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Users can only access their own profile unless admin
      if (req.user?.role !== 'admin' && req.user?.userId !== id) {
        throw new ForbiddenError('Cannot access other user profiles');
      }

      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /users/:id
   * Update user profile
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Users can only update their own profile unless admin
      if (req.user?.role !== 'admin' && req.user?.userId !== id) {
        throw new ForbiddenError('Cannot update other user profiles');
      }

      const input = UpdateUserSchema.parse(req.body);
      const user = await userService.updateUser(id, input);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /users/me/export
   * GDPR Article 20 - Export all user data in machine-readable format
   * Returns all personal data associated with the user
   */
  exportUserData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      logger.info('GDPR data export requested', { userId });

      // Gather all user data
      const [
        user,
        patients,
        appointments,
        documents,
        subscriptions,
        payments,
        consents,
        auditLogs,
      ] = await Promise.all([
        // User profile
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            dateOfBirth: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
            lastLoginAt: true,
          },
        }),
        // Patient records
        prisma.patient.findMany({
          where: { userId },
          include: {
            encounters: {
              include: {
                clinicalNotes: true,
              },
            },
          },
        }),
        // Appointments
        prisma.appointment.findMany({
          where: {
            OR: [{ patientId: userId }, { providerId: userId }],
          },
          include: {
            visit: true,
          },
        }),
        // Documents
        prisma.document.findMany({
          where: { uploadedBy: userId },
          select: {
            id: true,
            name: true,
            type: true,
            size: true,
            createdAt: true,
            metadata: true,
          },
        }),
        // Subscriptions
        prisma.subscription.findMany({
          where: { userId },
          include: {
            plan: true,
          },
        }),
        // Payments
        prisma.payment.findMany({
          where: { userId },
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true,
            description: true,
          },
        }),
        // Consents
        prisma.consent.findMany({
          where: { userId },
        }),
        // Audit logs (last 1000 entries)
        prisma.auditLog.findMany({
          where: { userId },
          take: 1000,
          orderBy: { createdAt: 'desc' },
          select: {
            action: true,
            resource: true,
            createdAt: true,
            ipAddress: true,
          },
        }),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        gdprArticle: 'Article 20 - Right to data portability',
        dataSubject: {
          id: userId,
          email: user?.email,
        },
        personalData: {
          profile: user,
          healthRecords: patients,
          appointments,
          documents,
          subscriptions,
          payments,
          consents,
          activityLog: auditLogs,
        },
        metadata: {
          totalRecords: {
            patients: patients.length,
            appointments: appointments.length,
            documents: documents.length,
            subscriptions: subscriptions.length,
            payments: payments.length,
            consents: consents.length,
            auditLogs: auditLogs.length,
          },
        },
      };

      logger.info('GDPR data export completed', {
        userId,
        totalRecords: Object.values(exportData.metadata.totalRecords).reduce(
          (a, b) => a + b,
          0
        ),
      });

      // Set headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="user-data-export-${userId}-${Date.now()}.json"`
      );

      res.json(exportData);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /users/me
   * GDPR Article 17 - Right to erasure (Right to be forgotten)
   * Initiates account deletion with 7-day grace period
   */
  deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ForbiddenError('Authentication required');
      }

      const { confirmEmail } = req.body;

      // Verify email confirmation
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user || user.email !== confirmEmail) {
        throw new BadRequestError(
          'Email confirmation does not match. Please confirm your email address.'
        );
      }

      logger.info('GDPR account deletion requested', { userId });

      // Mark account for deletion (7-day grace period)
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 7);

      await prisma.user.update({
        where: { id: userId },
        data: {
          status: 'pending_deletion',
          deletionRequestedAt: new Date(),
          scheduledDeletionAt: deletionDate,
        },
      });

      // Revoke all tokens
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });

      logger.info('GDPR account deletion scheduled', {
        userId,
        scheduledDeletionAt: deletionDate,
      });

      res.json({
        success: true,
        message:
          'Account deletion has been scheduled. Your account and all associated data will be permanently deleted in 7 days. You can cancel this request by logging in before the deletion date.',
        scheduledDeletionAt: deletionDate.toISOString(),
        gracePeriodDays: 7,
      });
    } catch (error) {
      next(error);
    }
  },
};
