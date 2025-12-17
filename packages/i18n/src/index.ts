import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enAppointments from './locales/en/appointments.json';
import enErrors from './locales/en/errors.json';

// Import Spanish translations
import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esDashboard from './locales/es/dashboard.json';
import esAppointments from './locales/es/appointments.json';
import esErrors from './locales/es/errors.json';

// Import French translations
import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frDashboard from './locales/fr/dashboard.json';
import frAppointments from './locales/fr/appointments.json';
import frErrors from './locales/fr/errors.json';

// Translation resources
export const resources = {
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
} as const;

// Supported languages
export const supportedLanguages = ['en', 'es', 'fr'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// Language names for display
export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

// Language flags (emoji or ISO codes)
export const languageFlags: Record<SupportedLanguage, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
};

// Default namespace
export const defaultNS = 'common';

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React options
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },

    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',

    // Missing key handling
    saveMissing: false,
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${lng}:${ns}:${key}`);
      }
    },

    // Namespace separation
    keySeparator: '.',
    nsSeparator: ':',
  });

export default i18n;

// Type definitions for autocomplete
export type TranslationNamespace = keyof typeof resources.en;
export type TranslationKey<NS extends TranslationNamespace> = keyof typeof resources.en[NS];

// Helper function to change language
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(language);

  // Store the language preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', language);
    document.documentElement.lang = language;
  }
};

// Helper function to get current language
export const getCurrentLanguage = (): SupportedLanguage => {
  const current = i18n.language;
  return supportedLanguages.includes(current as SupportedLanguage)
    ? (current as SupportedLanguage)
    : 'en';
};

// Helper function to format date based on locale
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getCurrentLanguage();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj);
};

// Helper function to format time based on locale
export const formatTime = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getCurrentLanguage();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj);
};

// Helper function to format number based on locale
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = getCurrentLanguage();
  return new Intl.NumberFormat(locale, options).format(value);
};

// Helper function to format currency based on locale
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string => {
  const locale = getCurrentLanguage();
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
  };

  return new Intl.NumberFormat(locale, { ...defaultOptions, ...options }).format(value);
};
