import { CreatePatientInput, UpdatePatientInput, PatientResponse } from '../dtos/patient.dto.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';
import { Prisma } from '../generated/client/index.js';
import type { Gender } from '../generated/client/index.js';

/**
 * Interface for emergency contact stored as JSON in database
 */
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

/**
 * Type guard to check if a value is a valid EmergencyContact
 */
function isEmergencyContact(value: unknown): value is EmergencyContact {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.name === 'string' &&
    typeof obj.relationship === 'string' &&
    typeof obj.phone === 'string'
  );
}

/**
 * Maps input gender string to Prisma Gender enum
 */
function mapGenderToEnum(gender: string): Gender {
  if (gender === 'prefer-not-to-say') {
    return 'prefer_not_to_say';
  }
  return gender as Gender;
}

/**
 * Generate a unique Medical Record Number
 */
function generateMRN(): string {
  return `MRN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

/**
 * Patient database record type from Prisma
 */
type PatientRecord = Prisma.PatientGetPayload<object>;

/**
 * Transform a patient database record to API response format
 */
function transformPatientToResponse(patient: PatientRecord): PatientResponse {
  const emergencyContact = isEmergencyContact(patient.emergencyContact)
    ? patient.emergencyContact
    : undefined;

  return {
    id: patient.id,
    userId: patient.userId,
    medicalRecordNumber: patient.medicalRecordNumber,
    dateOfBirth: patient.dateOfBirth.toISOString(),
    gender: patient.gender,
    bloodType: patient.bloodType ?? undefined,
    allergies: patient.allergies,
    emergencyContact,
    createdAt: patient.createdAt.toISOString(),
    updatedAt: patient.updatedAt.toISOString(),
  };
}

export const patientService = {
  /**
   * Create patient record
   */
  async createPatient(input: CreatePatientInput): Promise<PatientResponse> {
    // Check if patient exists for this user
    const existing = await prisma.patient.findUnique({
      where: { userId: input.userId },
    });

    if (existing) {
      throw new ConflictError('Patient record already exists for this user');
    }

    const patient = await prisma.patient.create({
      data: {
        userId: input.userId,
        medicalRecordNumber: generateMRN(),
        dateOfBirth: new Date(input.dateOfBirth),
        gender: mapGenderToEnum(input.gender),
        bloodType: input.bloodType ?? null,
        allergies: input.allergies ?? [],
        emergencyContact: input.emergencyContact ?? Prisma.JsonNull,
      },
    });

    return transformPatientToResponse(patient);
  },

  /**
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<PatientResponse> {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    return transformPatientToResponse(patient);
  },

  /**
   * Get patient by user ID
   */
  async getPatientByUserId(userId: string): Promise<PatientResponse | null> {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return null;
    }

    return transformPatientToResponse(patient);
  },

  /**
   * SECURITY: Check if a provider has a care relationship with the patient
   * A provider can access patient data if they have:
   * - An encounter with the patient
   * - An appointment with the patient
   *
   * This prevents IDOR attacks where providers access arbitrary patient records
   */
  async hasProviderPatientRelationship(providerId: string, patientId: string): Promise<boolean> {
    // Check for existing encounters between this provider and patient
    const encounterCount = await prisma.encounter.count({
      where: {
        providerId,
        patientId,
      },
    });

    if (encounterCount > 0) {
      return true;
    }

    // Check for existing appointments between this provider and patient
    const appointmentCount = await prisma.appointment.count({
      where: {
        providerId,
        patientId,
      },
    });

    if (appointmentCount > 0) {
      return true;
    }

    logger.debug('Provider-patient relationship check failed', {
      providerId,
      patientId,
      hasEncounters: encounterCount > 0,
      hasAppointments: appointmentCount > 0,
    });

    return false;
  },

  /**
   * Update patient
   */
  async updatePatient(id: string, input: UpdatePatientInput): Promise<PatientResponse> {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // Build update data with proper null handling
    const updateData: Prisma.PatientUpdateInput = {};

    if (input.dateOfBirth !== undefined) {
      updateData.dateOfBirth = new Date(input.dateOfBirth);
    }

    if (input.gender !== undefined) {
      updateData.gender = mapGenderToEnum(input.gender);
    }

    if (input.bloodType !== undefined) {
      updateData.bloodType = input.bloodType;
    }

    if (input.allergies !== undefined) {
      updateData.allergies = input.allergies;
    }

    if (input.emergencyContact !== undefined) {
      updateData.emergencyContact = input.emergencyContact ?? Prisma.JsonNull;
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: updateData,
    });

    return transformPatientToResponse(updatedPatient);
  },
};
