import { z } from "zod";

/**
 * Create Patient Schema - SECURITY HARDENED
 *
 * Note: userId is included for providers/admins creating patient records.
 * For patients creating their own record, userId is validated against
 * the authenticated user's ID in the controller.
 *
 * Server-owned fields that are NEVER accepted:
 * - medicalRecordNumber (generated server-side)
 * - status, verifiedAt, verifiedBy
 * - any billing or subscription fields
 */
export const CreatePatientSchema = z
  .object({
    userId: z.string().uuid(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
    bloodType: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional(),
    allergies: z.array(z.string().max(200)).max(50).optional(),
    emergencyContact: z
      .object({
        name: z.string().min(1).max(100),
        relationship: z.string().min(1).max(50),
        phone: z.string().min(5).max(20),
      })
      .strict()
      .optional(),
  })
  .strict();

/**
 * Update Patient Schema - SECURITY HARDENED
 *
 * userId cannot be changed once set.
 * medicalRecordNumber cannot be modified.
 */
export const UpdatePatientSchema = z
  .object({
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
    bloodType: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional(),
    allergies: z.array(z.string().max(200)).max(50).optional(),
    emergencyContact: z
      .object({
        name: z.string().min(1).max(100),
        relationship: z.string().min(1).max(50),
        phone: z.string().min(5).max(20),
      })
      .strict()
      .optional(),
  })
  .strict();

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
