import { z } from "zod";

/**
 * Update User Schema - SECURITY HARDENED
 *
 * Server-owned fields that are NEVER accepted from client:
 * - role, isAdmin, permissions, status, emailVerified
 * - subscriptionTier, quota, credits, balance
 * - any security tokens or passwords
 *
 * Use .strict() to reject any unknown fields.
 */
export const UpdateUserSchema = z
  .object({
    firstName: z.string().min(1).max(100).trim().optional(),
    lastName: z.string().min(1).max(100).trim().optional(),
    phone: z.string().max(20).optional(),
    address: z
      .object({
        street: z.string().max(200).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(100).optional(),
        postalCode: z.string().max(20).optional(),
        country: z.string().max(100).optional(),
      })
      .strict()
      .optional(),
    preferences: z
      .object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        language: z.string().max(10).optional(),
        timezone: z.string().max(50).optional(),
        notifications: z
          .object({
            email: z.boolean().optional(),
            sms: z.boolean().optional(),
            push: z.boolean().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

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
