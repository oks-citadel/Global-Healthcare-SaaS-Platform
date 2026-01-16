import { Request, Response, NextFunction } from 'express';
import { encounterService } from '../services/encounter.service.js';
import { patientService } from '../services/patient.service.js';
import { providerService } from '../services/provider.service.js';
import {
  CreateEncounterSchema,
  UpdateEncounterSchema,
  AddClinicalNoteSchema
} from '../dtos/encounter.dto.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * SECURITY: Helper to check if provider has access to encounter
 * Providers can only access encounters where they are the assigned provider
 */
async function checkProviderEncounterAccess(
  userId: string,
  encounter: { providerId?: string | null },
  action: string
): Promise<void> {
  // Get the provider record for this user
  const provider = await providerService.getProviderByUserId(userId);

  if (!provider) {
    logger.warn('User attempted provider action without provider record', {
      userId,
      action,
    });
    throw new ForbiddenError('You do not have provider access');
  }

  // If encounter has no providerId, deny access
  if (!encounter.providerId) {
    logger.warn('Encounter has no assigned provider', {
      userId,
      action,
    });
    throw new ForbiddenError('Cannot access this encounter - no provider assigned');
  }

  if (provider.id !== encounter.providerId) {
    logger.warn('Provider attempted to access another provider\'s encounter', {
      userId,
      providerId: provider.id,
      encounterProviderId: encounter.providerId,
      action,
    });
    throw new ForbiddenError('Cannot access this encounter - not your assigned patient');
  }
}

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

      // Check access permissions based on role
      if (req.user?.role === 'patient') {
        // Patient can only view their own encounters
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== encounter.patientId) {
          throw new ForbiddenError('Cannot access this encounter');
        }
      } else if (req.user?.role === 'provider') {
        // SECURITY FIX: Provider can ONLY view encounters where they are the assigned provider
        await checkProviderEncounterAccess(req.user.userId, encounter, 'getEncounter');
      }
      // Admin can view all encounters (implicit)

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

      // SECURITY FIX: Check provider has access to this encounter before update
      if (req.user?.role === 'provider') {
        const encounter = await encounterService.getEncounterById(id);
        await checkProviderEncounterAccess(req.user.userId, encounter, 'updateEncounter');
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

      // SECURITY FIX: Check provider has access to this encounter before adding notes
      if (req.user?.role === 'provider') {
        const encounter = await encounterService.getEncounterById(id);
        await checkProviderEncounterAccess(req.user.userId, encounter, 'addClinicalNote');
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
      } else if (req.user?.role === 'provider') {
        // SECURITY FIX: Provider can only view notes for encounters they're assigned to
        await checkProviderEncounterAccess(req.user.userId, encounter, 'getClinicalNotes');
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

      // SECURITY FIX: Check provider has access to this encounter before starting
      if (req.user?.role === 'provider') {
        const existing = await encounterService.getEncounterById(id);
        await checkProviderEncounterAccess(req.user.userId, existing, 'startEncounter');
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

      // SECURITY FIX: Check provider has access to this encounter before ending
      if (req.user?.role === 'provider') {
        const existing = await encounterService.getEncounterById(id);
        await checkProviderEncounterAccess(req.user.userId, existing, 'endEncounter');
      }

      const encounter = await encounterService.endEncounter(id);
      res.json(encounter);
    } catch (error) {
      next(error);
    }
  },
};
