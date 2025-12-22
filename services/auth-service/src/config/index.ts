import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

// Load RSA keys for RS256 JWT signing
const loadRSAKeys = () => {
  try {
    // In production, load from files or secure vault
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

    if (privateKeyPath && publicKeyPath) {
      return {
        privateKey: readFileSync(privateKeyPath, 'utf8'),
        publicKey: readFileSync(publicKeyPath, 'utf8'),
      };
    }
  } catch (error) {
    console.warn('Failed to load RSA keys, falling back to symmetric key');
  }

  // Fallback to symmetric key (HS256) for development
  return null;
};

const rsaKeys = loadRSAKeys();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  env: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL || '',
  },

  jwt: {
    // Use RS256 in production, HS256 in development
    algorithm: rsaKeys ? 'RS256' : 'HS256',
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    privateKey: rsaKeys?.privateKey,
    publicKey: rsaKeys?.publicKey,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION_MINUTES || '15', 10), // minutes
    passwordResetExpiry: parseInt(process.env.PASSWORD_RESET_EXPIRY_HOURS || '1', 10), // hours
    emailVerificationExpiry: parseInt(process.env.EMAIL_VERIFICATION_EXPIRY_HOURS || '24', 10), // hours
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    authWindowMs: 15 * 60 * 1000, // 15 minutes
    authMaxRequests: 5, // stricter for auth endpoints
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
} as const;
