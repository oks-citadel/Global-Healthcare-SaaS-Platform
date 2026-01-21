/**
 * Type declarations for @unified-health/i18n package
 *
 * This module provides type definitions for the i18n locale JSON files
 * used throughout the Unified Health Platform.
 */

// Type for translation JSON files
interface TranslationResource {
  [key: string]: string | TranslationResource;
}

// Declare the locale JSON module imports
declare module '@unified-health/i18n/locales/en/common.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/en/auth.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/en/dashboard.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/en/appointments.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/en/errors.json' {
  const value: TranslationResource;
  export default value;
}

// Spanish locale declarations
declare module '@unified-health/i18n/locales/es/common.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/es/auth.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/es/dashboard.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/es/appointments.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/es/errors.json' {
  const value: TranslationResource;
  export default value;
}

// French locale declarations
declare module '@unified-health/i18n/locales/fr/common.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/fr/auth.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/fr/dashboard.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/fr/appointments.json' {
  const value: TranslationResource;
  export default value;
}

declare module '@unified-health/i18n/locales/fr/errors.json' {
  const value: TranslationResource;
  export default value;
}
