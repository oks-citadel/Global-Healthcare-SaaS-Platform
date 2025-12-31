import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

/**
 * Environment mode detection
 */
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

/**
 * List of required environment variables for production
 */
const REQUIRED_ENV_VARS = ["JWT_SECRET", "DATABASE_URL"] as const;

/**
 * Get a required environment variable.
 * In production: throws an error if not set.
 * In development: returns fallback if provided.
 */
function getRequiredEnv(name: string, devFallback?: string): string {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (isDevelopment && devFallback !== undefined) {
    console.warn(
      `[AUTH CONFIG WARNING] Using development fallback for ${name}. This is NOT safe for production.`,
    );
    return devFallback;
  }

  throw new Error(
    `Required environment variable ${name} is not set. ` +
      `Please set this variable before starting the auth service.`,
  );
}

/**
 * Get an optional environment variable with a default value.
 */
function getOptionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

// Load RSA keys for RS256 JWT signing
const loadRSAKeys = () => {
  try {
    // In production, load from files or secure vault
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

    if (privateKeyPath && publicKeyPath) {
      return {
        privateKey: readFileSync(privateKeyPath, "utf8"),
        publicKey: readFileSync(publicKeyPath, "utf8"),
      };
    }
  } catch (error) {
    console.warn("Failed to load RSA keys, falling back to symmetric key");
  }

  // Fallback to symmetric key (HS256) for development
  return null;
};

const rsaKeys = loadRSAKeys();

/**
 * Validate all configuration at startup.
 */
export function validateConfig(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      if (isProduction) {
        errors.push(`Required environment variable ${envVar} is not set`);
      } else {
        warnings.push(
          `Environment variable ${envVar} is not set (using development fallback)`,
        );
      }
    }
  }

  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    if (isProduction) {
      errors.push("JWT_SECRET must be at least 32 characters for production");
    } else {
      warnings.push("JWT_SECRET should be at least 32 characters");
    }
  }

  // Validate DATABASE_URL format
  const databaseUrl = process.env.DATABASE_URL;
  if (
    databaseUrl &&
    !databaseUrl.startsWith("postgresql://") &&
    !databaseUrl.startsWith("postgres://")
  ) {
    warnings.push(
      "DATABASE_URL does not appear to be a valid PostgreSQL connection string",
    );
  }

  // Check RSA keys for production
  if (isProduction && !rsaKeys) {
    warnings.push(
      "RSA keys not configured - using symmetric JWT signing (HS256)",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Run configuration validation and throw if invalid in production.
 */
function enforceValidConfig(): void {
  const validation = validateConfig();

  // Log warnings
  for (const warning of validation.warnings) {
    console.warn(`[AUTH CONFIG WARNING] ${warning}`);
  }

  // In production, fail fast on any errors
  if (!validation.valid) {
    const errorMessage = [
      "Auth service configuration validation failed:",
      ...validation.errors.map((e) => `  - ${e}`),
      "",
      "Please set all required environment variables before starting the auth service.",
    ].join("\n");

    throw new Error(errorMessage);
  }
}

export const config = {
  port: parseInt(getOptionalEnv("PORT", "3001"), 10),
  env: process.env.NODE_ENV || "development",

  database: {
    url: getRequiredEnv(
      "DATABASE_URL",
      isDevelopment ? "postgresql://localhost:5432/auth_dev" : undefined,
    ),
  },

  jwt: {
    // Use RS256 in production, HS256 in development
    algorithm: rsaKeys ? "RS256" : "HS256",
    secret: getRequiredEnv(
      "JWT_SECRET",
      isDevelopment ? "dev-only-insecure-jwt-secret-min-32-chars" : undefined,
    ),
    privateKey: rsaKeys?.privateKey,
    publicKey: rsaKeys?.publicKey,
    expiresIn: getOptionalEnv("JWT_EXPIRES_IN", "15m"),
    refreshExpiresIn: getOptionalEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
  },

  security: {
    bcryptRounds: parseInt(getOptionalEnv("BCRYPT_ROUNDS", "12"), 10),
    maxLoginAttempts: parseInt(getOptionalEnv("MAX_LOGIN_ATTEMPTS", "5"), 10),
    lockoutDuration: parseInt(
      getOptionalEnv("LOCKOUT_DURATION_MINUTES", "15"),
      10,
    ), // minutes
    passwordResetExpiry: parseInt(
      getOptionalEnv("PASSWORD_RESET_EXPIRY_HOURS", "1"),
      10,
    ), // hours
    emailVerificationExpiry: parseInt(
      getOptionalEnv("EMAIL_VERIFICATION_EXPIRY_HOURS", "24"),
      10,
    ), // hours
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    authWindowMs: 15 * 60 * 1000, // 15 minutes
    authMaxRequests: 5, // stricter for auth endpoints
  },

  cors: {
    origin: getOptionalEnv("CORS_ORIGIN", "*"),
    credentials: true,
  },

  mfa: {
    issuer: getOptionalEnv("MFA_ISSUER", "UnifiedHealthcare"),
    encryptionKey: getRequiredEnv(
      "MFA_ENCRYPTION_KEY",
      isDevelopment ? "dev-only-mfa-encryption-key-32chars!" : undefined,
    ),
  },

  email: {
    provider: getOptionalEnv("EMAIL_PROVIDER", "sendgrid"),
    sendgridApiKey: getOptionalEnv("SENDGRID_API_KEY", ""),
    sesRegion: getOptionalEnv("AWS_SES_REGION", "us-east-1"),
    fromAddress: getOptionalEnv("EMAIL_FROM_ADDRESS", "noreply@unified-health.com"),
    fromName: getOptionalEnv("EMAIL_FROM_NAME", "Unified Healthcare"),
    appUrl: getOptionalEnv("APP_URL", "http://localhost:3000"),
    enabled: getOptionalEnv("EMAIL_ENABLED", isDevelopment ? "false" : "true") === "true",
  },
} as const;

// Enforce valid configuration at module load time
enforceValidConfig();
