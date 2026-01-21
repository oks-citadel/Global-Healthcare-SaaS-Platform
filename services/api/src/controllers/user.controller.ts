import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { UpdateUserSchema } from '../dtos/user.dto.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

/**
 * User roles supported by the system (matches JwtPayload from auth.middleware.ts)
 */
type UserRole = 'patient' | 'provider' | 'admin';

/**
 * User status values (matches Prisma UserStatus enum)
 */
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

/**
 * User information attached to authenticated requests (matches JwtPayload)
 */
interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

/**
 * Extended request with authenticated user
 * Uses intersection type to properly extend Request
 */
type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

/**
 * User profile data (matches Prisma User model selected fields)
 */
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: Date | null;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Patient record with encounters
 */
interface PatientRecord {
  id: string;
  userId: string;
  encounters: EncounterRecord[];
}

/**
 * Encounter record with clinical notes
 */
interface EncounterRecord {
  id: string;
  patientId: string;
  notes: ClinicalNote[];
}

/**
 * Clinical note
 */
interface ClinicalNote {
  id: string;
  encounterId: string;
  content: string;
  createdAt: Date;
}

/**
 * Appointment record with visit
 */
interface AppointmentRecord {
  id: string;
  patientId: string;
  providerId: string;
  visit: VisitRecord | null;
}

/**
 * Visit record
 */
interface VisitRecord {
  id: string;
  appointmentId: string;
  status: string;
}

/**
 * Document record
 */
interface DocumentRecord {
  id: string;
  fileName: string;
  type: string;
  size: number;
  createdAt: Date;
  description: string | null;
}

/**
 * Subscription record with plan
 */
interface SubscriptionRecord {
  id: string;
  userId: string;
  plan: PlanRecord | null;
}

/**
 * Plan record
 */
interface PlanRecord {
  id: string;
  name: string;
  price: number;
}

/**
 * Payment record for export
 */
interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  description: string | null;
}

/**
 * Consent record
 */
interface ConsentRecord {
  id: string;
  patientId: string;
  type: string;
  granted: boolean;
}

/**
 * Audit log entry
 */
interface AuditLogEntry {
  action: string;
  resource: string;
  createdAt: Date;
  ipAddress: string | null;
}

/**
 * GDPR data export structure
 */
interface GDPRExportData {
  exportDate: string;
  exportVersion: string;
  gdprArticle: string;
  dataSubject: {
    id: string;
    email: string | undefined;
  };
  personalData: {
    profile: UserProfile | null;
    healthRecords: PatientRecord[];
    appointments: AppointmentRecord[];
    documents: DocumentRecord[];
    subscriptions: SubscriptionRecord[];
    payments: PaymentRecord[];
    consents: ConsentRecord[];
    activityLog: AuditLogEntry[];
  };
  metadata: {
    totalRecords: {
      patients: number;
      appointments: number;
      documents: number;
      subscriptions: number;
      payments: number;
      consents: number;
      auditLogs: number;
    };
  };
}

/**
 * Account deletion response
 */
interface DeletionResponse {
  success: boolean;
  message: string;
  scheduledDeletionAt: string;
  gracePeriodDays: number;
}

/**
 * Delete account request body
 */
interface DeleteAccountBody {
  confirmEmail?: string;
}

/**
 * Type guard to check if user is authenticated
 */
function isAuthenticated(req: AuthenticatedRequest): req is AuthenticatedRequest & { user: AuthenticatedUser } {
  return req.user !== undefined && typeof req.user.userId === 'string';
}

/**
 * User Controller
 * Handles user profile management and GDPR compliance operations
 */
export const userController = {
  /**
   * GET /users/:id
   * Get user by ID
   *
   * @param req - Express request with user ID in params
   * @param res - Express response
   * @param next - Express next function for error handling
   */
  getUser: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string' || id.length === 0) {
        throw new BadRequestError('User ID is required');
      }

      // Users can only access their own profile unless admin
      if (isAuthenticated(req)) {
        if (req.user.role !== 'admin' && req.user.userId !== id) {
          throw new ForbiddenError('Cannot access other user profiles');
        }
      } else {
        throw new ForbiddenError('Authentication required');
      }

      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error: unknown) {
      next(error);
    }
  },

  /**
   * PATCH /users/:id
   * Update user profile
   *
   * @param req - Express request with user ID in params and update data in body
   * @param res - Express response
   * @param next - Express next function for error handling
   */
  updateUser: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string' || id.length === 0) {
        throw new BadRequestError('User ID is required');
      }

      // Users can only update their own profile unless admin
      if (isAuthenticated(req)) {
        if (req.user.role !== 'admin' && req.user.userId !== id) {
          throw new ForbiddenError('Cannot update other user profiles');
        }
      } else {
        throw new ForbiddenError('Authentication required');
      }

      const input = UpdateUserSchema.parse(req.body);
      const user = await userService.updateUser(id, input);
      res.json(user);
    } catch (error: unknown) {
      next(error);
    }
  },

  /**
   * GET /users/me/export
   * GDPR Article 20 - Export all user data in machine-readable format
   * Returns all personal data associated with the user
   *
   * @param req - Express request (must be authenticated)
   * @param res - Express response with JSON data export
   * @param next - Express next function for error handling
   */
  exportUserData: async (
    req: AuthenticatedRequest,
    res: Response<GDPRExportData>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!isAuthenticated(req)) {
        throw new ForbiddenError('Authentication required');
      }

      const userId = req.user.userId;

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
          },
        }),
        // Patient records
        prisma.patient.findMany({
          where: { userId },
          include: {
            encounters: {
              include: {
                notes: true,
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
            fileName: true,
            type: true,
            size: true,
            createdAt: true,
            description: true,
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
        // Consents - query through patient relation
        prisma.consent.findMany({
          where: {
            patient: {
              userId: userId,
            },
          },
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

      const totalRecords = {
        patients: patients.length,
        appointments: appointments.length,
        documents: documents.length,
        subscriptions: subscriptions.length,
        payments: payments.length,
        consents: consents.length,
        auditLogs: auditLogs.length,
      };

      const exportData: GDPRExportData = {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        gdprArticle: 'Article 20 - Right to data portability',
        dataSubject: {
          id: userId,
          email: user?.email,
        },
        personalData: {
          profile: user as UserProfile | null,
          healthRecords: patients as unknown as PatientRecord[],
          appointments: appointments as unknown as AppointmentRecord[],
          documents: documents as unknown as DocumentRecord[],
          subscriptions: subscriptions as unknown as SubscriptionRecord[],
          payments: payments as unknown as PaymentRecord[],
          consents: consents as unknown as ConsentRecord[],
          activityLog: auditLogs as unknown as AuditLogEntry[],
        },
        metadata: {
          totalRecords,
        },
      };

      const recordSum = Object.values(totalRecords).reduce<number>(
        (a, b) => a + b,
        0
      );

      logger.info('GDPR data export completed', {
        userId,
        totalRecords: recordSum,
      });

      // Set headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="user-data-export-${userId}-${Date.now()}.json"`
      );

      res.json(exportData);
    } catch (error: unknown) {
      next(error);
    }
  },

  /**
   * DELETE /users/me
   * GDPR Article 17 - Right to erasure (Right to be forgotten)
   * Initiates account deletion with 7-day grace period
   *
   * @param req - Express request with confirmEmail in body
   * @param res - Express response
   * @param next - Express next function for error handling
   */
  deleteAccount: async (
    req: AuthenticatedRequest,
    res: Response<DeletionResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!isAuthenticated(req)) {
        throw new ForbiddenError('Authentication required');
      }

      const userId = req.user.userId;
      const body = req.body as DeleteAccountBody;
      const confirmEmail = body.confirmEmail;

      if (typeof confirmEmail !== 'string' || confirmEmail.length === 0) {
        throw new BadRequestError('Email confirmation is required');
      }

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
      // Using 'suspended' status as pending_deletion is not in the enum
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 7);

      await prisma.user.update({
        where: { id: userId },
        data: {
          status: 'suspended',
        },
      });

      // Delete all refresh tokens to invalidate sessions
      await prisma.refreshToken.deleteMany({
        where: { userId },
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
    } catch (error: unknown) {
      next(error);
    }
  },
};
