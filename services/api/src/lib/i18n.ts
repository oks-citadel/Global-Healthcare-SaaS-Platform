import i18next, { TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

// Import translations for server-side
import enCommon from '@unified-health/i18n/locales/en/common.json';
import enAuth from '@unified-health/i18n/locales/en/auth.json';
import enDashboard from '@unified-health/i18n/locales/en/dashboard.json';
import enAppointments from '@unified-health/i18n/locales/en/appointments.json';
import enErrors from '@unified-health/i18n/locales/en/errors.json';

import esCommon from '@unified-health/i18n/locales/es/common.json';
import esAuth from '@unified-health/i18n/locales/es/auth.json';
import esDashboard from '@unified-health/i18n/locales/es/dashboard.json';
import esAppointments from '@unified-health/i18n/locales/es/appointments.json';
import esErrors from '@unified-health/i18n/locales/es/errors.json';

import frCommon from '@unified-health/i18n/locales/fr/common.json';
import frAuth from '@unified-health/i18n/locales/fr/auth.json';
import frDashboard from '@unified-health/i18n/locales/fr/dashboard.json';
import frAppointments from '@unified-health/i18n/locales/fr/appointments.json';
import frErrors from '@unified-health/i18n/locales/fr/errors.json';

export type SupportedLanguage = 'en' | 'es' | 'fr';
export type TranslationNamespace = 'common' | 'auth' | 'dashboard' | 'appointments' | 'errors';

// Translation resources
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    appointments: enAppointments,
    errors: enErrors,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    dashboard: esDashboard,
    appointments: esAppointments,
    errors: esErrors,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    dashboard: frDashboard,
    appointments: frAppointments,
    errors: frErrors,
  },
};

// Initialize i18next for server-side
const serverI18n = i18next.createInstance();

serverI18n.init({
  resources,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'auth', 'dashboard', 'appointments', 'errors'],
  supportedLngs: ['en', 'es', 'fr'],

  interpolation: {
    escapeValue: false, // Not needed for server-side
  },

  // Server-side specific options
  initImmediate: false, // Initialize synchronously

  debug: process.env.NODE_ENV === 'development',
});

/**
 * Get translation function for a specific language
 *
 * @param language - The language to get translations for
 * @param namespace - The translation namespace (default: 'common')
 * @returns Translation function
 *
 * @example
 * ```typescript
 * const t = getTranslation('es', 'errors');
 * const message = t('auth.invalidCredentials');
 * ```
 */
export function getTranslation(
  language: SupportedLanguage = 'en',
  namespace: TranslationNamespace = 'common'
): TFunction {
  return serverI18n.getFixedT(language, namespace);
}

/**
 * Get multiple namespaces translation functions for a specific language
 *
 * @param language - The language to get translations for
 * @returns Object with translation functions for all namespaces
 *
 * @example
 * ```typescript
 * const { auth, errors } = getTranslations('es');
 * const loginError = errors('auth.invalidCredentials');
 * const loginTitle = auth('login.title');
 * ```
 */
export function getTranslations(language: SupportedLanguage = 'en') {
  return {
    common: serverI18n.getFixedT(language, 'common'),
    auth: serverI18n.getFixedT(language, 'auth'),
    dashboard: serverI18n.getFixedT(language, 'dashboard'),
    appointments: serverI18n.getFixedT(language, 'appointments'),
    errors: serverI18n.getFixedT(language, 'errors'),
  };
}

/**
 * Detect language from request headers
 *
 * @param acceptLanguage - Accept-Language header value
 * @returns Detected supported language
 *
 * @example
 * ```typescript
 * const language = detectLanguage(req.headers['accept-language']);
 * ```
 */
export function detectLanguage(acceptLanguage?: string): SupportedLanguage {
  if (!acceptLanguage) return 'en';

  const languages = acceptLanguage.split(',').map((lang) => {
    const [code, q = '1'] = lang.trim().split(';q=');
    return {
      code: code.split('-')[0].toLowerCase(),
      quality: parseFloat(q),
    };
  });

  // Sort by quality
  languages.sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const { code } of languages) {
    if (code === 'en' || code === 'es' || code === 'fr') {
      return code as SupportedLanguage;
    }
  }

  return 'en';
}

/**
 * Translate error messages for API responses
 *
 * @param errorKey - Error key from errors namespace
 * @param language - Target language
 * @param params - Interpolation parameters
 * @returns Translated error message
 *
 * @example
 * ```typescript
 * const errorMessage = translateError('auth.invalidCredentials', 'es');
 * res.status(401).json({ error: errorMessage });
 * ```
 */
export function translateError(
  errorKey: string,
  language: SupportedLanguage = 'en',
  params?: Record<string, any>
): string {
  const t = serverI18n.getFixedT(language, 'errors');
  return t(errorKey, params);
}

/**
 * Translate validation errors
 *
 * @param field - Field name
 * @param validationType - Type of validation error
 * @param language - Target language
 * @param params - Additional parameters (e.g., min, max values)
 * @returns Translated validation error message
 *
 * @example
 * ```typescript
 * const error = translateValidationError('email', 'required', 'es');
 * // Returns: "Email es obligatorio"
 *
 * const error = translateValidationError('password', 'minLength', 'en', { min: 8 });
 * // Returns: "Password must be at least 8 characters"
 * ```
 */
export function translateValidationError(
  field: string,
  validationType: string,
  language: SupportedLanguage = 'en',
  params?: Record<string, any>
): string {
  const t = serverI18n.getFixedT(language, 'errors');
  const validationKey = `validation.${validationType}`;

  return t(validationKey, {
    field: field.charAt(0).toUpperCase() + field.slice(1),
    ...params,
  });
}

/**
 * Format error response with translations
 *
 * @param errorKey - Error key
 * @param language - Target language
 * @param statusCode - HTTP status code
 * @param details - Additional error details
 * @returns Formatted error response object
 *
 * @example
 * ```typescript
 * const errorResponse = formatErrorResponse(
 *   'auth.invalidCredentials',
 *   'es',
 *   401
 * );
 * res.status(401).json(errorResponse);
 * ```
 */
export function formatErrorResponse(
  errorKey: string,
  language: SupportedLanguage = 'en',
  statusCode: number = 500,
  details?: any
) {
  const message = translateError(errorKey, language);

  return {
    success: false,
    error: {
      code: errorKey,
      message,
      statusCode,
      ...(details && { details }),
    },
  };
}

/**
 * Middleware to extract language from request
 *
 * @example
 * ```typescript
 * // In Express
 * app.use(languageMiddleware);
 *
 * // Then in routes
 * app.get('/api/users', (req, res) => {
 *   const t = req.t; // Translation function
 *   const message = t('common:app.name');
 * });
 * ```
 */
export function languageMiddleware(req: any, res: any, next: any) {
  // Get language from query, header, or cookie
  const language =
    (req.query.lang as SupportedLanguage) ||
    detectLanguage(req.headers['accept-language']) ||
    'en';

  // Attach translation function to request
  req.language = language;
  req.t = (key: string, params?: any) => {
    const [namespace, ...keyParts] = key.includes(':') ? key.split(':') : ['common', key];
    const t = serverI18n.getFixedT(language, namespace);
    return t(keyParts.join(':'), params);
  };

  // Attach translation functions for all namespaces
  req.translations = getTranslations(language);

  next();
}

/**
 * Express error handler with i18n support
 *
 * @example
 * ```typescript
 * app.use(errorHandler);
 * ```
 */
export function errorHandler(err: any, req: any, res: any, next: any) {
  const language = req.language || detectLanguage(req.headers['accept-language']);

  // Default error
  let statusCode = err.statusCode || 500;
  let errorKey = err.errorKey || 'general.serverError';

  // Map common errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorKey = 'general.badRequest';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorKey = 'auth.unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorKey = 'general.forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorKey = 'general.notFound';
  }

  const errorResponse = formatErrorResponse(
    errorKey,
    language,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );

  res.status(statusCode).json(errorResponse);
}

export default serverI18n;
