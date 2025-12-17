import { Request, Response, NextFunction } from 'express';
import { encounterService } from '../services/encounter.service.js';
import { patientService } from '../services/patient.service.js';
import {
  CreateEncounterSchema,
  UpdateEncounterSchema,
  AddClinicalNoteSchema
} from '../dtos/encounter.dto.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';

export const encounterController = {
  /**
   * POST /encounters
   * Create a new clinical encounter
   * Requires: provider or admin role
   */
  createEncounter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateEncounterSchema.parse(req.body);

      // Only providers and admins can create encounters
      if (req.user?.role === 'patient') {
        throw new ForbiddenError('Patients cannot create encounters');
      }

      const encounter = await encounterService.createEncounter(input, req.user!.userId);
      res.status(201).json(encounter);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /encounters/:id
   * Get encounter by ID
   */
  getEncounter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const encounter = await encounterService.getEncounterById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        // Patient can only view their own encounters
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== encounter.patientId) {
          throw new ForbiddenError('Cannot access this encounter');
        }
      } else if (req.user?.role === 'provider') {
        // Provider can view encounters they are assigned to
        // In a real system, we'd check if this provider is associated with this encounter
        // For now, providers can view all encounters they are part of or all if admin-like access
      }

      res.json(encounter);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /encounters
   * List encounters (filtered by role)
   */
  listEncounters: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId, providerId } = req.query;
      let encounters;

      if (req.user?.role === 'patient') {
        // Patients can only see their own encounters
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient) {
          return res.json([]);
        }
        encounters = await encounterService.getEncountersByPatientId(userPatient.id);
      } else if (patientId && typeof patientId === 'string') {
        encounters = await encounterService.getEncountersByPatientId(patientId);
      } else if (providerId && typeof providerId === 'string') {
        encounters = await encounterService.getEncountersByProviderId(providerId);
      } else if (req.user?.role === 'provider') {
        // Providers see their own encounters by default
        encounters = await encounterService.getEncountersByProviderId(req.user.userId);
      } else {
        // Admin can see all (would need proper pagination in production)
        encounters = [];
      }

      res.json(encounters);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /encounters/:id
   * Update encounter status
   * Requires: provider or admin role
   */
  updateEncounter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = UpdateEncounterSchema.parse(req.body);

      if (req.user?.role === 'patient') {
        throw new ForbiddenError('Patients cannot update encounters');
      }

      const encounter = await encounterService.updateEncounter(id, input);
      res.json(encounter);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /encounters/:id/notes
   * Add clinical note to encounter
   * Requires: provider or admin role
   */
  addClinicalNote: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = AddClinicalNoteSchema.parse(req.body);

      if (req.user?.role === 'patient') {
        throw new ForbiddenError('Patients cannot add clinical notes');
      }

      const note = await encounterService.addClinicalNote(id, input, req.user!.userId);
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /encounters/:id/notes
   * Get clinical notes for an encounter
   */
  getClinicalNotes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // First check encounter access
      const encounter = await encounterService.getEncounterById(id);

      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== encounter.patientId) {
          throw new ForbiddenError('Cannot access notes for this encounter');
        }
      }

      const notes = await encounterService.getClinicalNotes(id);
      res.json(notes);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /encounters/:id/start
   * Start an encounter
   */
  startEncounter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (req.user?.role === 'patient') {
        throw new ForbiddenError('Patients cannot start encounters');
      }

      const encounter = await encounterService.startEncounter(id);
      res.json(encounter);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /encounters/:id/end
   * End an encounter
   */
  endEncounter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (req.user?.role === 'patient') {
        throw new ForbiddenError('Patients cannot end encounters');
      }

      const encounter = await encounterService.endEncounter(id);
      res.json(encounter);
    } catch (error) {
      next(error);
    }
  },
};
