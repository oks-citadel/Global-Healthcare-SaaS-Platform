import { z } from 'zod';

// ==========================================
// Encounter DTOs
// ==========================================

export const EncounterTypeEnum = z.enum(['virtual', 'in_person', 'phone']);
export const EncounterStatusEnum = z.enum(['planned', 'in_progress', 'finished', 'cancelled']);

export const CreateEncounterSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  providerId: z.string().uuid('Invalid provider ID'),
  appointmentId: z.string().uuid('Invalid appointment ID').optional(),
  type: EncounterTypeEnum,
  reasonForVisit: z.string().min(1).max(1000).optional(),
});

export const UpdateEncounterSchema = z.object({
  status: EncounterStatusEnum.optional(),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
});

export const AddClinicalNoteSchema = z.object({
  noteType: z.enum(['progress', 'assessment', 'plan', 'chief_complaint', 'history', 'physical_exam', 'diagnosis', 'other']),
  content: z.string().min(1).max(50000),
});

export const EncounterResponse = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  appointmentId: z.string().uuid().nullable(),
  type: EncounterTypeEnum,
  status: EncounterStatusEnum,
  startedAt: z.string().datetime().nullable(),
  endedAt: z.string().datetime().nullable(),
  notes: z.array(z.object({
    id: z.string().uuid(),
    authorId: z.string().uuid(),
    noteType: z.string(),
    content: z.string(),
    timestamp: z.string().datetime(),
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Type exports
export type EncounterType = z.infer<typeof EncounterTypeEnum>;
export type EncounterStatus = z.infer<typeof EncounterStatusEnum>;
export type CreateEncounterInput = z.infer<typeof CreateEncounterSchema>;
export type UpdateEncounterInput = z.infer<typeof UpdateEncounterSchema>;
export type AddClinicalNoteInput = z.infer<typeof AddClinicalNoteSchema>;
export type EncounterResponseType = z.infer<typeof EncounterResponse>;
