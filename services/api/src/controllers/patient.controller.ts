import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patient.service.js';
import { CreatePatientSchema, UpdatePatientSchema } from '../dtos/patient.dto.js';
import { ForbiddenError } from '../utils/errors.js';

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
   */
  getPatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const patient = await patientService.getPatientById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (userPatient?.id !== id) {
          throw new ForbiddenError('Cannot access other patient records');
        }
      }

      res.json(patient);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /patients/:id
   * Update patient record
   */
  updatePatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = UpdatePatientSchema.parse(req.body);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (userPatient?.id !== id) {
          throw new ForbiddenError('Cannot update other patient records');
        }
      }

      const patient = await patientService.updatePatient(id, input);
      res.json(patient);
    } catch (error) {
      next(error);
    }
  },
};
