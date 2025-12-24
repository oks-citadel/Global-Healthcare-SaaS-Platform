import { Request, Response, NextFunction } from "express";
import { patientService } from "../services/patient.service.js";
import {
  CreatePatientSchema,
  UpdatePatientSchema,
  SearchPatientSchema,
} from "../dtos/patient.dto.js";
import { ForbiddenError, NotFoundError } from "@healthcare/shared-lib/errors";

/**
 * Patient Controller
 *
 * Handles patient management endpoints for the patient-service microservice.
 * Migrated from: services/api/src/controllers/patient.controller.ts
 *
 * FHIR Resources: Patient, RelatedPerson
 */
export const patientController = {
  /**
   * POST /patients
   * Create a new patient record
   */
  createPatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreatePatientSchema.parse(req.body);

      // Patients can only create their own record, providers/admins can create for others
      if (req.user?.role === "patient" && req.user.userId !== input.userId) {
        throw new ForbiddenError(
          "Cannot create patient record for another user",
        );
      }

      const patient = await patientService.createPatient(input);

      // Emit event for other services
      await patientService.emitEvent("patient.created", {
        patientId: patient.id,
        userId: patient.userId,
        tenantId: req.tenantId,
        timestamp: new Date().toISOString(),
      });

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

      if (!patient) {
        throw new NotFoundError("Patient not found");
      }

      // Check access permissions
      if (req.user?.role === "patient") {
        const userPatient = await patientService.getPatientByUserId(
          req.user.userId,
        );
        if (userPatient?.id !== id) {
          throw new ForbiddenError("Cannot access other patient records");
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
      if (req.user?.role === "patient") {
        const userPatient = await patientService.getPatientByUserId(
          req.user.userId,
        );
        if (userPatient?.id !== id) {
          throw new ForbiddenError("Cannot update other patient records");
        }
      }

      const patient = await patientService.updatePatient(id, input);

      // Emit event for other services
      await patientService.emitEvent("patient.updated", {
        patientId: patient.id,
        changedFields: Object.keys(input),
        tenantId: req.tenantId,
        timestamp: new Date().toISOString(),
      });

      res.json(patient);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /patients
   * Search/list patients (providers and admins only)
   */
  searchPatients: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = SearchPatientSchema.parse(req.query);
      const patients = await patientService.searchPatients(query);
      res.json(patients);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /patients/$match
   * FHIR $match operation for MPI
   */
  matchPatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const criteria = req.body;
      const matches = await patientService.matchPatients(criteria);
      res.json({
        resourceType: "Bundle",
        type: "searchset",
        entry: matches.map((match) => ({
          resource: match.patient,
          search: {
            mode: "match",
            score: match.score,
          },
        })),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /patients/$merge
   * FHIR $merge operation for duplicate resolution
   */
  mergePatients: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sourcePatientId, targetPatientId, fieldOverrides } = req.body;
      const result = await patientService.mergePatients(
        sourcePatientId,
        targetPatientId,
        fieldOverrides,
      );

      // Emit merge event
      await patientService.emitEvent("patient.merged", {
        survivingPatientId: result.survivingPatientId,
        mergedPatientId: result.mergedPatientId,
        timestamp: new Date().toISOString(),
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /patients/:id/fhir
   * Get patient as FHIR R4 Patient resource
   */
  getPatientFhir: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const fhirPatient = await patientService.getPatientAsFhir(id);
      res.json(fhirPatient);
    } catch (error) {
      next(error);
    }
  },
};
