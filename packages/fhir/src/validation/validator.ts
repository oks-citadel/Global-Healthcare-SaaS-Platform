/**
 * FHIR resource validation utilities
 */

import { z } from 'zod';
import {
  PatientSchema,
  PractitionerSchema,
  OrganizationSchema,
  EncounterSchema,
  AppointmentSchema,
  ObservationSchema,
  ConditionSchema,
  MedicationRequestSchema,
  DiagnosticReportSchema,
  AllergyIntoleranceSchema,
  ConsentSchema,
} from './schemas';

export interface ValidationResult {
  valid: boolean;
  errors?: z.ZodError;
  data?: any;
}

export class FHIRValidator {
  /**
   * Validate a FHIR Patient resource
   */
  static validatePatient(data: unknown): ValidationResult {
    try {
      const validated = PatientSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR Practitioner resource
   */
  static validatePractitioner(data: unknown): ValidationResult {
    try {
      const validated = PractitionerSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR Organization resource
   */
  static validateOrganization(data: unknown): ValidationResult {
    try {
      const validated = OrganizationSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR Encounter resource
   */
  static validateEncounter(data: unknown): ValidationResult {
    try {
      const validated = EncounterSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR Appointment resource
   */
  static validateAppointment(data: unknown): ValidationResult {
    try {
      const validated = AppointmentSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR Observation resource
   */
  static validateObservation(data: unknown): ValidationResult {
    try {
      const validated = ObservationSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR Condition resource
   */
  static validateCondition(data: unknown): ValidationResult {
    try {
      const validated = ConditionSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR MedicationRequest resource
   */
  static validateMedicationRequest(data: unknown): ValidationResult {
    try {
      const validated = MedicationRequestSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR DiagnosticReport resource
   */
  static validateDiagnosticReport(data: unknown): ValidationResult {
    try {
      const validated = DiagnosticReportSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR AllergyIntolerance resource
   */
  static validateAllergyIntolerance(data: unknown): ValidationResult {
    try {
      const validated = AllergyIntoleranceSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate a FHIR Consent resource
   */
  static validateConsent(data: unknown): ValidationResult {
    try {
      const validated = ConsentSchema.parse(data);
      return { valid: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate any FHIR resource based on resourceType
   */
  static validate(data: any): ValidationResult {
    if (!data || typeof data !== 'object' || !data.resourceType) {
      return {
        valid: false,
        errors: new z.ZodError([
          {
            code: 'custom',
            path: ['resourceType'],
            message: 'Resource must have a resourceType',
          },
        ]),
      };
    }

    switch (data.resourceType) {
      case 'Patient':
        return this.validatePatient(data);
      case 'Practitioner':
        return this.validatePractitioner(data);
      case 'Organization':
        return this.validateOrganization(data);
      case 'Encounter':
        return this.validateEncounter(data);
      case 'Appointment':
        return this.validateAppointment(data);
      case 'Observation':
        return this.validateObservation(data);
      case 'Condition':
        return this.validateCondition(data);
      case 'MedicationRequest':
        return this.validateMedicationRequest(data);
      case 'DiagnosticReport':
        return this.validateDiagnosticReport(data);
      case 'AllergyIntolerance':
        return this.validateAllergyIntolerance(data);
      case 'Consent':
        return this.validateConsent(data);
      default:
        return {
          valid: false,
          errors: new z.ZodError([
            {
              code: 'custom',
              path: ['resourceType'],
              message: `Unsupported resource type: ${data.resourceType}`,
            },
          ]),
        };
    }
  }
}
