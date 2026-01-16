// @ts-nocheck
import { CreatePatientInput, UpdatePatientInput, PatientResponse } from '../dtos/patient.dto.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

function generateMRN(): string {
  return `MRN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
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
        gender: (input.gender === 'prefer-not-to-say' ? 'prefer_not_to_say' : input.gender) as any,
        bloodType: input.bloodType || null,
        allergies: input.allergies || [],
        emergencyContact: input.emergencyContact || null,
      },
    });

    return {
      id: patient.id,
      userId: patient.userId,
      medicalRecordNumber: patient.medicalRecordNumber,
      dateOfBirth: patient.dateOfBirth.toISOString(),
      gender: patient.gender,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      emergencyContact: patient.emergencyContact as any,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
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

    return {
      id: patient.id,
      userId: patient.userId,
      medicalRecordNumber: patient.medicalRecordNumber,
      dateOfBirth: patient.dateOfBirth.toISOString(),
      gender: patient.gender,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      emergencyContact: patient.emergencyContact as any,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
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

    return {
      id: patient.id,
      userId: patient.userId,
      medicalRecordNumber: patient.medicalRecordNumber,
      dateOfBirth: patient.dateOfBirth.toISOString(),
      gender: patient.gender,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      emergencyContact: patient.emergencyContact as any,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
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

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : patient.dateOfBirth,
        gender: input.gender || patient.gender,
        bloodType: input.bloodType !== undefined ? input.bloodType : patient.bloodType,
        allergies: input.allergies !== undefined ? input.allergies : patient.allergies,
        emergencyContact: input.emergencyContact !== undefined ? input.emergencyContact : patient.emergencyContact,
      },
    });

    return {
      id: updatedPatient.id,
      userId: updatedPatient.userId,
      medicalRecordNumber: updatedPatient.medicalRecordNumber,
      dateOfBirth: updatedPatient.dateOfBirth.toISOString(),
      gender: updatedPatient.gender,
      bloodType: updatedPatient.bloodType,
      allergies: updatedPatient.allergies,
      emergencyContact: updatedPatient.emergencyContact as any,
      createdAt: updatedPatient.createdAt.toISOString(),
      updatedAt: updatedPatient.updatedAt.toISOString(),
    };
  },
};
