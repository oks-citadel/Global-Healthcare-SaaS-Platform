import { z } from 'zod';

// ==========================================
// OAuth Provider Types
// ==========================================

export const OAuthProviderSchema = z.enum(['google', 'facebook', 'apple', 'microsoft']);
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;

// ==========================================
// OAuth Initiate Request
// ==========================================

export const OAuthInitiateSchema = z.object({
  provider: OAuthProviderSchema,
  redirectUrl: z.string().url().optional(),
  linkToExistingAccount: z.boolean().optional().default(false),
});

export type OAuthInitiateInput = z.infer<typeof OAuthInitiateSchema>;

// ==========================================
// OAuth Callback Request
// ==========================================

export const OAuthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().min(1, 'State parameter is required'),
  // For Apple Sign-In, user info is passed on first login
  user: z.object({
    name: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }).optional(),
    email: z.string().email().optional(),
  }).optional(),
});

export type OAuthCallbackInput = z.infer<typeof OAuthCallbackSchema>;

// ==========================================
// Link Social Account Request
// ==========================================

export const LinkSocialAccountSchema = z.object({
  provider: OAuthProviderSchema,
  redirectUrl: z.string().url().optional(),
});

export type LinkSocialAccountInput = z.infer<typeof LinkSocialAccountSchema>;

// ==========================================
// Unlink Social Account Request
// ==========================================

export const UnlinkSocialAccountSchema = z.object({
  provider: OAuthProviderSchema,
});

export type UnlinkSocialAccountInput = z.infer<typeof UnlinkSocialAccountSchema>;

// ==========================================
// OAuth Profile from Provider
// ==========================================

export interface OAuthProfile {
  providerId: string;
  provider: OAuthProvider;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  rawProfile: Record<string, unknown>;
}

// ==========================================
// Social Account Response
// ==========================================

export interface SocialAccountResponse {
  id: string;
  provider: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  linkedAt: string;
  lastUsedAt: string | null;
}

// ==========================================
// OAuth State Data
// ==========================================

export interface OAuthStateData {
  provider: OAuthProvider;
  userId?: string;
  redirectUrl?: string;
  metadata?: Record<string, unknown>;
}

// ==========================================
// OAuth Error Types
// ==========================================

export enum OAuthErrorCode {
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  INVALID_STATE = 'INVALID_STATE',
  STATE_EXPIRED = 'STATE_EXPIRED',
  EMAIL_CONFLICT = 'EMAIL_CONFLICT',
  ACCOUNT_ALREADY_LINKED = 'ACCOUNT_ALREADY_LINKED',
  ACCOUNT_NOT_LINKED = 'ACCOUNT_NOT_LINKED',
  CANNOT_UNLINK_ONLY_AUTH = 'CANNOT_UNLINK_ONLY_AUTH',
  PROFILE_FETCH_FAILED = 'PROFILE_FETCH_FAILED',
  TOKEN_EXCHANGE_FAILED = 'TOKEN_EXCHANGE_FAILED',
}

export interface OAuthError {
  code: OAuthErrorCode;
  message: string;
  provider?: OAuthProvider;
  details?: Record<string, unknown>;
}
