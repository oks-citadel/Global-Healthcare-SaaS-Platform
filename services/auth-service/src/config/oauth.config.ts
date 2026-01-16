import { OAuthProvider } from '../dtos/oauth.dto.js';

/**
 * Environment mode detection
 */
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

/**
 * Get an optional environment variable with a default value.
 */
function getOptionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Get a required OAuth environment variable.
 * In production: throws an error if the provider is enabled but credentials are missing.
 * In development: returns empty string and logs warning.
 */
function getOAuthEnv(name: string, provider: string): string {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (isDevelopment) {
    // In development, just warn - provider will be disabled if credentials missing
    return '';
  }

  // In production, we'll handle this when checking if provider is enabled
  return '';
}

/**
 * OAuth Provider Configuration Interface
 */
export interface OAuthProviderConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope: string[];
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

/**
 * OAuth Configuration
 */
export interface OAuthConfig {
  // State token configuration
  stateExpiryMinutes: number;

  // Callback base URL
  callbackBaseUrl: string;

  // Default redirect URL after successful OAuth
  defaultRedirectUrl: string;

  // Allowed redirect URL patterns (for security)
  allowedRedirectPatterns: string[];

  // Provider configurations
  providers: {
    [key in OAuthProvider]: OAuthProviderConfig;
  };

  // Encryption key for OAuth tokens stored in database
  tokenEncryptionKey: string;
}

/**
 * Build the OAuth configuration
 */
function buildOAuthConfig(): OAuthConfig {
  const callbackBaseUrl = getOptionalEnv(
    'OAUTH_CALLBACK_BASE_URL',
    isDevelopment ? 'http://localhost:3001' : ''
  );

  const appUrl = getOptionalEnv('APP_URL', 'http://localhost:3000');

  // Google OAuth Configuration
  const googleClientId = getOAuthEnv('GOOGLE_CLIENT_ID', 'google');
  const googleClientSecret = getOAuthEnv('GOOGLE_CLIENT_SECRET', 'google');
  const googleEnabled = !!(googleClientId && googleClientSecret);

  // Facebook OAuth Configuration
  const facebookClientId = getOAuthEnv('FACEBOOK_APP_ID', 'facebook');
  const facebookClientSecret = getOAuthEnv('FACEBOOK_APP_SECRET', 'facebook');
  const facebookEnabled = !!(facebookClientId && facebookClientSecret);

  // Apple OAuth Configuration
  const appleClientId = getOAuthEnv('APPLE_CLIENT_ID', 'apple');
  const appleTeamId = getOAuthEnv('APPLE_TEAM_ID', 'apple');
  const appleKeyId = getOAuthEnv('APPLE_KEY_ID', 'apple');
  const applePrivateKey = getOAuthEnv('APPLE_PRIVATE_KEY', 'apple');
  // For Apple, the "client secret" is a JWT generated from the private key
  const appleEnabled = !!(appleClientId && appleTeamId && appleKeyId && applePrivateKey);

  // Microsoft OAuth Configuration (Azure AD / Microsoft Entra ID)
  const microsoftClientId = getOAuthEnv('MICROSOFT_CLIENT_ID', 'microsoft');
  const microsoftClientSecret = getOAuthEnv('MICROSOFT_CLIENT_SECRET', 'microsoft');
  // Tenant can be 'common', 'organizations', 'consumers', or a specific tenant ID
  const microsoftTenant = getOptionalEnv('MICROSOFT_TENANT', 'common');
  const microsoftEnabled = !!(microsoftClientId && microsoftClientSecret);

  return {
    stateExpiryMinutes: parseInt(getOptionalEnv('OAUTH_STATE_EXPIRY_MINUTES', '10'), 10),

    callbackBaseUrl,

    defaultRedirectUrl: getOptionalEnv('OAUTH_DEFAULT_REDIRECT_URL', `${appUrl}/auth/callback`),

    // Patterns of allowed redirect URLs (supports wildcards)
    allowedRedirectPatterns: getOptionalEnv('OAUTH_ALLOWED_REDIRECTS', `${appUrl}/*`)
      .split(',')
      .map(p => p.trim())
      .filter(Boolean),

    // Encryption key for storing OAuth tokens in database
    tokenEncryptionKey: getOptionalEnv(
      'OAUTH_TOKEN_ENCRYPTION_KEY',
      isDevelopment ? 'dev-oauth-token-encryption-key-32ch' : ''
    ),

    providers: {
      google: {
        enabled: googleEnabled,
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        callbackUrl: `${callbackBaseUrl}/auth/oauth/google/callback`,
        scope: ['openid', 'email', 'profile'],
        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },

      facebook: {
        enabled: facebookEnabled,
        clientId: facebookClientId,
        clientSecret: facebookClientSecret,
        callbackUrl: `${callbackBaseUrl}/auth/oauth/facebook/callback`,
        scope: ['email', 'public_profile'],
        authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        userInfoUrl: 'https://graph.facebook.com/v18.0/me',
      },

      apple: {
        enabled: appleEnabled,
        clientId: appleClientId,
        // Apple uses a JWT as client secret, generated from private key
        clientSecret: applePrivateKey, // Store the private key, generate JWT on demand
        callbackUrl: `${callbackBaseUrl}/auth/oauth/apple/callback`,
        scope: ['name', 'email'],
        authorizationUrl: 'https://appleid.apple.com/auth/authorize',
        tokenUrl: 'https://appleid.apple.com/auth/token',
        userInfoUrl: '', // Apple doesn't have a userinfo endpoint, info comes from id_token
      },

      microsoft: {
        enabled: microsoftEnabled,
        clientId: microsoftClientId,
        clientSecret: microsoftClientSecret,
        callbackUrl: `${callbackBaseUrl}/auth/oauth/microsoft/callback`,
        scope: ['openid', 'email', 'profile', 'User.Read', 'offline_access'],
        authorizationUrl: `https://login.microsoftonline.com/${microsoftTenant}/oauth2/v2.0/authorize`,
        tokenUrl: `https://login.microsoftonline.com/${microsoftTenant}/oauth2/v2.0/token`,
        userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
      },
    },
  };
}

/**
 * Apple-specific configuration
 */
export interface AppleConfig {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}

/**
 * Get Apple-specific configuration
 */
export function getAppleConfig(): AppleConfig | null {
  const clientId = process.env.APPLE_CLIENT_ID;
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY;

  if (!clientId || !teamId || !keyId || !privateKey) {
    return null;
  }

  return {
    clientId,
    teamId,
    keyId,
    // Private key might be stored with escaped newlines
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

/**
 * Validate OAuth configuration at startup
 */
export function validateOAuthConfig(config: OAuthConfig): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check if at least one provider is enabled
  const enabledProviders = Object.entries(config.providers)
    .filter(([_, cfg]) => cfg.enabled)
    .map(([name]) => name);

  if (enabledProviders.length === 0) {
    warnings.push('No OAuth providers are configured. Social login will be disabled.');
  } else {
    console.log(`[OAuth] Enabled providers: ${enabledProviders.join(', ')}`);
  }

  // Validate callback base URL in production
  if (isProduction && !config.callbackBaseUrl) {
    errors.push('OAUTH_CALLBACK_BASE_URL must be set in production');
  }

  // Validate token encryption key
  if (config.tokenEncryptionKey.length < 32) {
    if (isProduction) {
      errors.push('OAUTH_TOKEN_ENCRYPTION_KEY must be at least 32 characters in production');
    } else {
      warnings.push('OAUTH_TOKEN_ENCRYPTION_KEY should be at least 32 characters');
    }
  }

  // Validate allowed redirect patterns
  if (config.allowedRedirectPatterns.length === 0) {
    warnings.push('No allowed redirect patterns configured. Using default.');
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

// Export the configuration
export const oauthConfig = buildOAuthConfig();

// Validate on load
const validation = validateOAuthConfig(oauthConfig);
validation.warnings.forEach(w => console.warn(`[OAuth WARNING] ${w}`));
if (!validation.valid) {
  validation.errors.forEach(e => console.error(`[OAuth ERROR] ${e}`));
  if (isProduction) {
    throw new Error('OAuth configuration validation failed. See errors above.');
  }
}
