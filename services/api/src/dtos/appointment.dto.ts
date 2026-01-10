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
  // Billing options
  paymentMethodId: z.string().optional(), // Stripe payment method ID for paid appointments
  // SECURITY: skipPayment is validated in controller - only admin/provider can use it
  // Patients attempting to set this will have it stripped (see appointment.controller.ts)
  skipPayment: z.boolean().optional(),
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

// ==========================================
// Appointment Billing DTOs
// ==========================================

/**
 * Schema for creating appointment payment (before or during booking)
 */
export const CreateAppointmentPaymentSchema = z.object({
  appointmentId: z.string().uuid(),
  paymentMethodId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export type CreateAppointmentPaymentInput = z.infer<typeof CreateAppointmentPaymentSchema>;

/**
 * Schema for confirming appointment payment
 */
export const ConfirmAppointmentPaymentSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export type ConfirmAppointmentPaymentInput = z.infer<typeof ConfirmAppointmentPaymentSchema>;

/**
 * Schema for completing appointment billing (after appointment)
 */
export const CompleteAppointmentBillingSchema = z.object({
  additionalCharges: z.number().int().positive().optional(),
  paymentMethodId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export type CompleteAppointmentBillingInput = z.infer<typeof CompleteAppointmentBillingSchema>;

/**
 * Schema for refunding appointment payment
 */
export const RefundAppointmentPaymentSchema = z.object({
  amount: z.number().int().positive().optional(), // Partial refund in cents
  reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
});

export type RefundAppointmentPaymentInput = z.infer<typeof RefundAppointmentPaymentSchema>;

/**
 * Schema for getting appointment price estimate
 */
export const GetAppointmentPriceSchema = z.object({
  type: z.enum(['video', 'audio', 'chat', 'in-person']),
  duration: z.coerce.number().refine(val => [15, 30, 45, 60].includes(val), {
    message: 'Duration must be 15, 30, 45, or 60 minutes',
  }),
});

export type GetAppointmentPriceInput = z.infer<typeof GetAppointmentPriceSchema>;

/**
 * Appointment billing response with payment details
 */
export interface AppointmentWithBillingResponse extends AppointmentResponse {
  billing?: {
    paymentId?: string;
    paymentIntentId?: string;
    clientSecret?: string | null;
    amount: number;
    currency: string;
    status: string;
    requiresAction?: boolean;
    isPaid: boolean;
  };
}

/**
 * Appointment billing summary response
 */
export interface AppointmentBillingSummaryResponse {
  appointmentId: string;
  totalCharged: number;
  currency: string;
  status: string;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    description: string | null;
    createdAt: Date;
  }>;
}
