import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patient.service.js';
import { providerService } from '../services/provider.service.js';
import { CreatePatientSchema, UpdatePatientSchema } from '../dtos/patient.dto.js';
import { ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * SECURITY: Helper to check if provider has access to patient data
 * Providers can only access patients they have a care relationship with
 * (via encounters or appointments)
 */
async function checkProviderPatientAccess(
  userId: string,
  patientId: string,
  action: string
): Promise<void> {
  const provider = await providerService.getProviderByUserId(userId);

  if (!provider) {
    logger.warn('User attempted provider action without provider record', {
      userId,
      patientId,
      action,
    });
    throw new ForbiddenError('You do not have provider access');
  }

  const hasRelationship = await patientService.hasProviderPatientRelationship(
    provider.id,
    patientId
  );

  if (!hasRelationship) {
    logger.warn('Provider attempted to access patient without care relationship', {
      userId,
      providerId: provider.id,
      patientId,
      action,
    });
    throw new ForbiddenError('Cannot access this patient - no care relationship exists');
  }
}

export const patientController = {
  /**
   * POST /patients
   * Create a new patient record
   */
  createPatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreatePatientSchema.parse(req.body);

      // Patients can only create their own record, providers/admins can create for others
      if (req.user?.role === 'patient' && req.user.userId !== input.userId) {
        throw new ForbiddenError('Cannot create patient record for another user');
      }

      const patient = await patientService.createPatient(input);
      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /patients/:id
   * Get patient by ID
   * SECURITY: Role-based access control with provider relationship check
   */
  getPatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const patient = await patientService.getPatientById(id);

      // Check access permissions based on role
      if (req.user?.role === 'patient') {
        // Patients can only access their own record
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (userPatient?.id !== id) {
          throw new ForbiddenError('Cannot access other patient records');
        }
      } else if (req.user?.role === 'provider') {
        // SECURITY FIX: Providers can only access patients they have a care relationship with
        await checkProviderPatientAccess(req.user.userId, id, 'getPatient');
      }
      // Admin can access all patients (implicit)

      res.json(patient);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /patients/:id
   * Update patient record
   * SECURITY: Role-based access control with provider relationship check
   */
  updatePatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = UpdatePatientSchema.parse(req.body);

      // Check access permissions based on role
      if (req.user?.role === 'patient') {
        // Patients can only update their own record
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (userPatient?.id !== id) {
          throw new ForbiddenError('Cannot update other patient records');
        }
      } else if (req.user?.role === 'provider') {
        // SECURITY FIX: Providers can only update patients they have a care relationship with
        await checkProviderPatientAccess(req.user.userId, id, 'updatePatient');
      }
      // Admin can update all patients (implicit)

      const patient = await patientService.updatePatient(id, input);
      res.json(patient);
    } catch (error) {
      next(error);
    }
  },
};
