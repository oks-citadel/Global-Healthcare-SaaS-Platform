import { z } from 'zod';

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  preferences: z.record(z.unknown()).optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
