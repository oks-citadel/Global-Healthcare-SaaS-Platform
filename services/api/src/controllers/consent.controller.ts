// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { consentService } from '../services/consent.service.js';
import { z } from 'zod';
import { ForbiddenError } from '../utils/errors.js';

const CreateConsentSchema = z.object({
  patientId: z.string().uuid(),
  type: z.enum(['data-sharing', 'treatment', 'marketing', 'research']),
  granted: z.boolean(),
  scope: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const consentController = {
  /**
   * POST /consents
   * Record patient consent
   */
  createConsent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateConsentSchema.parse(req.body);

      // Patients can only create consent for themselves
      if (req.user?.role === 'patient') {
        const patientId = await consentService.getPatientIdByUserId(req.user.userId);
        if (input.patientId !== patientId) {
          throw new ForbiddenError('Cannot create consent for another patient');
        }
      }

      const consent = await consentService.createConsent(input);
      res.status(201).json(consent);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /consents/:id
   * Get consent record
   */
  getConsent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const consent = await consentService.getConsentById(id);

      // Check access
      if (req.user?.role === 'patient') {
        const patientId = await consentService.getPatientIdByUserId(req.user.userId);
        if (consent.patientId !== patientId) {
          throw new ForbiddenError('Cannot access this consent record');
        }
      }

      res.json(consent);
    } catch (error) {
      next(error);
    }
  },
};
