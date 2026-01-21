import { Request, Response, NextFunction } from 'express';
import { consentService } from '../services/consent.service.js';
import { z } from 'zod';
import { ForbiddenError } from '../utils/errors.js';

/**
 * Consent types supported by the system
 */
type ConsentType = 'data-sharing' | 'treatment' | 'marketing' | 'research';

/**
 * Schema for creating a consent record
 */
const CreateConsentSchema = z.object({
  patientId: z.string().uuid(),
  type: z.enum(['data-sharing', 'treatment', 'marketing', 'research']),
  granted: z.boolean(),
  scope: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

/**
 * Type for validated consent input
 * Using z.output to get the validated output type from the schema
 */
type CreateConsentInput = z.output<typeof CreateConsentSchema>;

/**
 * User information attached to authenticated requests
 * Matches JwtPayload from auth.middleware.ts
 */
interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'patient' | 'provider' | 'admin';
  tenantId?: string;
  iat?: number;
  exp?: number;
}

/**
 * Extended request with authenticated user
 * Uses the global Express.Request augmentation from auth.middleware.ts
 */
type AuthenticatedRequest = Request;

/**
 * Consent response interface
 * Matches ConsentResponse from consent.service.ts
 */
interface ConsentResponse {
  id: string;
  patientId: string;
  type: string;
  granted: boolean;
  scope: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Type guard to check if user is authenticated
 */
function isAuthenticated(req: Request): req is Request & { user: AuthenticatedUser } {
  return req.user !== undefined && typeof req.user.userId === 'string';
}

/**
 * Consent Controller
 * Handles patient consent management for HIPAA/GDPR compliance
 */
export const consentController = {
  /**
   * POST /consents
   * Record patient consent
   *
   * @param req - Express request with consent data in body
   * @param res - Express response
   * @param next - Express next function for error handling
   */
  createConsent: async (
    req: AuthenticatedRequest,
    res: Response<ConsentResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Use parse() which throws on failure and returns the validated data with correct types
      const input = CreateConsentSchema.parse(req.body);

      // Patients can only create consent for themselves
      if (isAuthenticated(req) && req.user.role === 'patient') {
        const patientId = await consentService.getPatientIdByUserId(req.user.userId);
        if (patientId === null || input.patientId !== patientId) {
          throw new ForbiddenError('Cannot create consent for another patient');
        }
      }

      const consent: ConsentResponse = await consentService.createConsent({
        patientId: input.patientId,
        type: input.type,
        granted: input.granted,
        scope: input.scope,
        expiresAt: input.expiresAt,
      });
      res.status(201).json(consent);
    } catch (error: unknown) {
      next(error);
    }
  },

  /**
   * GET /consents/:id
   * Get consent record
   *
   * @param req - Express request with consent ID in params
   * @param res - Express response
   * @param next - Express next function for error handling
   */
  getConsent: async (
    req: AuthenticatedRequest,
    res: Response<ConsentResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string' || id.length === 0) {
        throw new ForbiddenError('Invalid consent ID');
      }

      const consent: ConsentResponse = await consentService.getConsentById(id);

      // Check access - patients can only view their own consent records
      if (isAuthenticated(req) && req.user.role === 'patient') {
        const patientId = await consentService.getPatientIdByUserId(req.user.userId);
        if (patientId === null || consent.patientId !== patientId) {
          throw new ForbiddenError('Cannot access this consent record');
        }
      }

      res.json(consent);
    } catch (error: unknown) {
      next(error);
    }
  },
};
