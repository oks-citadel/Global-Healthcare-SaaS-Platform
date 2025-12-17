import { CreatePatientInput, UpdatePatientInput, PatientResponse } from '../dtos/patient.dto.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { patientRepository } from '../repositories/index.js';

function generateMRN(): string {
  return `MRN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function toPatientResponse(patient: any): PatientResponse {
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
}

export const patientService = {
  /**
   * Create patient record
   */
  async createPatient(input: CreatePatientInput): Promise<PatientResponse> {
    // Check if patient exists for this user using repository
    const existing = await patientRepository.findByUserId(input.userId);

    if (existing) {
      throw new ConflictError('Patient record already exists for this user');
    }

    // Create patient using repository
    const patient = await patientRepository.create({
      userId: input.userId,
      medicalRecordNumber: generateMRN(),
      dateOfBirth: new Date(input.dateOfBirth),
      gender: input.gender,
      bloodType: input.bloodType || null,
      allergies: input.allergies || [],
      emergencyContact: input.emergencyContact || null,
    });

    return toPatientResponse(patient);
  },

  /**
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<PatientResponse> {
    const patient = await patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    return toPatientResponse(patient);
  },

  /**
   * Get patient by user ID
   */
  async getPatientByUserId(userId: string): Promise<PatientResponse | null> {
    const patient = await patientRepository.findByUserId(userId);

    if (!patient) {
      return null;
    }

    return toPatientResponse(patient);
  },

  /**
   * Update patient
   */
  async updatePatient(id: string, input: UpdatePatientInput): Promise<PatientResponse> {
    const patient = await patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // Update patient using repository
    const updatedPatient = await patientRepository.update(id, {
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : patient.dateOfBirth,
      gender: input.gender || patient.gender,
      bloodType: input.bloodType !== undefined ? input.bloodType : patient.bloodType,
      allergies: input.allergies !== undefined ? input.allergies : patient.allergies,
      emergencyContact: input.emergencyContact !== undefined ? input.emergencyContact : patient.emergencyContact,
    });

    return toPatientResponse(updatedPatient);
  },
};
