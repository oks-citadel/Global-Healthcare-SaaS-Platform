import { z } from "zod";

// MFA Setup - Enable MFA
export const EnableMfaSchema = z.object({});

// MFA Verify Setup - Confirm MFA with initial code
export const VerifyMfaSetupSchema = z.object({
  token: z
    .string()
    .length(6, "MFA code must be exactly 6 digits")
    .regex(/^[0-9]+$/, "MFA code must contain only digits"),
});

// MFA Verify Login - Verify MFA during login
export const VerifyMfaLoginSchema = z.object({
  mfaToken: z.string().min(1, "MFA token is required"),
  code: z.string().min(1, "MFA code is required"),
});

// MFA Disable
export const DisableMfaSchema = z.object({
  password: z.string().min(1, "Password is required"),
  code: z.string().min(1, "MFA code or backup code is required"),
});

// MFA Backup Code Verify
export const VerifyBackupCodeSchema = z.object({
  mfaToken: z.string().min(1, "MFA token is required"),
  backupCode: z.string().min(1, "Backup code is required"),
});

// MFA Regenerate Backup Codes
export const RegenerateBackupCodesSchema = z.object({
  password: z.string().min(1, "Password is required"),
  code: z
    .string()
    .length(6, "MFA code must be exactly 6 digits")
    .regex(/^[0-9]+$/, "MFA code must contain only digits"),
});

// Type exports
export type EnableMfaInput = z.infer<typeof EnableMfaSchema>;
export type VerifyMfaSetupInput = z.infer<typeof VerifyMfaSetupSchema>;
export type VerifyMfaLoginInput = z.infer<typeof VerifyMfaLoginSchema>;
export type DisableMfaInput = z.infer<typeof DisableMfaSchema>;
export type VerifyBackupCodeInput = z.infer<typeof VerifyBackupCodeSchema>;
export type RegenerateBackupCodesInput = z.infer<
  typeof RegenerateBackupCodesSchema
>;

// MFA Setup Response
export interface MfaSetupResponse {
  secret: string;
  otpAuthUrl: string;
  qrCodeDataUrl?: string;
}

// MFA Status Response
export interface MfaStatusResponse {
  enabled: boolean;
  verifiedAt?: string;
  backupCodesRemaining: number;
}

// MFA Required Response (returned during login when MFA is needed)
export interface MfaRequiredResponse {
  mfaRequired: true;
  mfaToken: string;
  message: string;
}

// Backup Codes Response
export interface BackupCodesResponse {
  backupCodes: string[];
  message: string;
}
