import { z } from 'zod';

export const CreatePatientSchema = z.object({
  userId: z.string().uuid(),
  dateOfBirth: z.string(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  }).optional(),
});

export const UpdatePatientSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  }).optional(),
});

export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientInput = z.infer<typeof UpdatePatientSchema>;

export interface PatientResponse {
  id: string;
  userId: string;
  medicalRecordNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  allergies: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}
