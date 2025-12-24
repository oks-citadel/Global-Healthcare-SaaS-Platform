import { z } from "zod";

/**
 * Password validation with HIPAA-compliant requirements:
 * - Minimum 12 characters (NIST SP 800-63B recommendation)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*()_+\-=[\]{}|;':",.<>?/\\]/,
    "Password must contain at least one special character",
  );

/**
 * Registration Schema - SECURITY HARDENED
 *
 * IMPORTANT: The 'role' field is intentionally NOT included here.
 * Role assignment is a server-side operation only.
 * All new registrations default to 'patient' role server-side.
 *
 * Server-owned fields that are NEVER accepted from client:
 * - role, isAdmin, permissions, status, emailVerified
 * - userId, tenantId, ownerId, createdBy, updatedBy
 * - subscriptionTier, quota, credits, balance
 * - any id, timestamps, or security tokens
 */
export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address").max(255),
    password: passwordSchema,
    firstName: z.string().min(1, "First name is required").max(100).trim(),
    lastName: z.string().min(1, "Last name is required").max(100).trim(),
    phone: z.string().max(20).optional(),
    dateOfBirth: z.string().optional(),
  })
  .strict(); // strict() rejects any unknown fields

export const LoginSchema = z
  .object({
    email: z.string().email("Invalid email address").max(255),
    password: z.string().min(1, "Password is required").max(128),
  })
  .strict();

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  })
  .strict();

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
