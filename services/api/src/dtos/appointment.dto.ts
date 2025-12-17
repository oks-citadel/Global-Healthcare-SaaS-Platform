import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  type: z.enum(['video', 'audio', 'chat', 'in-person']),
  duration: z.number().refine(val => [15, 30, 45, 60].includes(val), {
    message: 'Duration must be 15, 30, 45, or 60 minutes',
  }),
  reasonForVisit: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateAppointmentSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  type: z.enum(['video', 'audio', 'chat', 'in-person']).optional(),
  duration: z.number().refine(val => [15, 30, 45, 60].includes(val)).optional(),
  status: z.enum(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']).optional(),
  reasonForVisit: z.string().optional(),
  notes: z.string().optional(),
});

export const ListAppointmentsSchema = z.object({
  patientId: z.string().uuid().optional(),
  providerId: z.string().uuid().optional(),
  status: z.enum(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;
export type ListAppointmentsInput = z.infer<typeof ListAppointmentsSchema>;

export interface AppointmentResponse {
  id: string;
  patientId: string;
  providerId: string;
  scheduledAt: string;
  duration: number;
  type: string;
  status: string;
  reasonForVisit?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAppointments {
  data: AppointmentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
