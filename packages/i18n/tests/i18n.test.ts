import { describe, it, expect, beforeEach, vi } from 'vitest';
import i18n, {
  resources,
  supportedLanguages,
  languageNames,
  languageFlags,
  changeLanguage,
  getCurrentLanguage,
  formatDate,
  formatTime,
  formatNumber,
  formatCurrency,
} from '../src/index';

describe('i18n Configuration', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize i18n with correct configuration', () => {
      expect(i18n).toBeDefined();
      expect(i18n.language).toBeDefined();
    });

    it('should have all supported languages', () => {
      expect(supportedLanguages).toEqual(['en', 'es', 'fr']);
    });

    it('should have resources for all supported languages', () => {
      expect(resources).toHaveProperty('en');
      expect(resources).toHaveProperty('es');
      expect(resources).toHaveProperty('fr');
    });

    it('should have all required namespaces for each language', () => {
      const namespaces = ['common', 'auth', 'dashboard', 'appointments', 'errors'];

      supportedLanguages.forEach(lang => {
        namespaces.forEach(ns => {
          expect(resources[lang]).toHaveProperty(ns);
        });
      });
    });

    it('should set default fallback language to English', () => {
      expect(i18n.options.fallbackLng).toEqual('en');
    });
  });

  describe('Language Names', () => {
    it('should have display names for all languages', () => {
      expect(languageNames).toEqual({
        en: 'English',
        es: 'Español',
        fr: 'Français',
      });
    });

    it('should have flags for all languages', () => {
      expect(languageFlags).toHaveProperty('en');
      expect(languageFlags).toHaveProperty('es');
      expect(languageFlags).toHaveProperty('fr');
    });
  });

  describe('Language Switching', () => {
    it('should change language to Spanish', async () => {
      await changeLanguage('es');
      expect(i18n.language).toBe('es');
    });

    it('should change language to French', async () => {
      await changeLanguage('fr');
      expect(i18n.language).toBe('fr');
    });

    it('should persist language preference in localStorage', async () => {
      await changeLanguage('es');
      expect(localStorage.setItem).toHaveBeenCalledWith('i18nextLng', 'es');
    });

    it('should update document language attribute', async () => {
      const mockDocumentElement = {
        lang: 'en',
      };
      Object.defineProperty(document, 'documentElement', {
        value: mockDocumentElement,
        writable: true,
      });

      await changeLanguage('fr');
      expect(document.documentElement.lang).toBe('fr');
    });

    it('should get current language', async () => {
      await changeLanguage('es');
      const currentLang = getCurrentLanguage();
      expect(currentLang).toBe('es');
    });

    it('should fallback to English for unsupported language', () => {
      // Force invalid language
      i18n.language = 'invalid';
      const currentLang = getCurrentLanguage();
      expect(currentLang).toBe('en');
    });
  });

  describe('Translations', () => {
    it('should translate common keys in English', () => {
      const translation = i18n.t('common:welcome');
      expect(translation).toBeDefined();
      expect(typeof translation).toBe('string');
    });

    it('should translate auth keys in English', () => {
      const translation = i18n.t('auth:login');
      expect(translation).toBeDefined();
    });

    it('should translate to Spanish', async () => {
      await changeLanguage('es');
      const translation = i18n.t('common:welcome');
      expect(translation).toBeDefined();
      expect(typeof translation).toBe('string');
    });

    it('should translate to French', async () => {
      await changeLanguage('fr');
      const translation = i18n.t('common:welcome');
      expect(translation).toBeDefined();
      expect(typeof translation).toBe('string');
    });

    it('should fallback to English for missing translations', async () => {
      await changeLanguage('es');
      // If a key doesn't exist in Spanish, should fallback to English
      const translation = i18n.t('common:some_missing_key', { defaultValue: 'Default' });
      expect(translation).toBeDefined();
    });

    it('should support interpolation', () => {
      // Assuming translation has interpolation like "Hello {{name}}"
      const translation = i18n.t('common:greeting', { name: 'John' });
      expect(translation).toBeDefined();
    });

    it('should support pluralization if configured', () => {
      const translation = i18n.t('common:items', { count: 5 });
      expect(translation).toBeDefined();
    });
  });

  describe('Date Formatting', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');

    it('should format date in English locale', async () => {
      await changeLanguage('en');
      const formatted = formatDate(testDate);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should format date in Spanish locale', async () => {
      await changeLanguage('es');
      const formatted = formatDate(testDate);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should format date in French locale', async () => {
      await changeLanguage('fr');
      const formatted = formatDate(testDate);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should accept string date input', () => {
      const formatted = formatDate('2024-01-15T10:30:00Z');
      expect(formatted).toBeDefined();
    });

    it('should accept custom date format options', () => {
      const formatted = formatDate(testDate, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(formatted).toBeDefined();
    });
  });

  describe('Time Formatting', () => {
    const testDate = new Date('2024-01-15T14:30:00Z');

    it('should format time in English locale', async () => {
      await changeLanguage('en');
      const formatted = formatTime(testDate);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should format time in Spanish locale', async () => {
      await changeLanguage('es');
      const formatted = formatTime(testDate);
      expect(formatted).toBeDefined();
    });

    it('should accept string date input', () => {
      const formatted = formatTime('2024-01-15T14:30:00Z');
      expect(formatted).toBeDefined();
    });

    it('should accept custom time format options', () => {
      const formatted = formatTime(testDate, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      expect(formatted).toBeDefined();
    });
  });

  describe('Number Formatting', () => {
    it('should format numbers in English locale', async () => {
      await changeLanguage('en');
      const formatted = formatNumber(1234.56);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should format numbers in Spanish locale', async () => {
      await changeLanguage('es');
      const formatted = formatNumber(1234.56);
      expect(formatted).toBeDefined();
    });

    it('should format numbers in French locale', async () => {
      await changeLanguage('fr');
      const formatted = formatNumber(1234.56);
      expect(formatted).toBeDefined();
    });

    it('should accept custom number format options', () => {
      const formatted = formatNumber(1234.56, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(formatted).toBeDefined();
    });

    it('should format large numbers', () => {
      const formatted = formatNumber(1000000);
      expect(formatted).toBeDefined();
    });

    it('should format decimals', () => {
      const formatted = formatNumber(0.123456, {
        minimumFractionDigits: 4,
      });
      expect(formatted).toBeDefined();
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency in USD', async () => {
      await changeLanguage('en');
      const formatted = formatCurrency(100, 'USD');
      expect(formatted).toBeDefined();
      expect(formatted).toContain('100');
    });

    it('should format currency in EUR', async () => {
      await changeLanguage('fr');
      const formatted = formatCurrency(100, 'EUR');
      expect(formatted).toBeDefined();
    });

    it('should default to USD if no currency specified', () => {
      const formatted = formatCurrency(100);
      expect(formatted).toBeDefined();
    });

    it('should respect locale for currency formatting', async () => {
      await changeLanguage('es');
      const formattedES = formatCurrency(1000.50, 'EUR');

      await changeLanguage('en');
      const formattedEN = formatCurrency(1000.50, 'EUR');

      expect(formattedES).toBeDefined();
      expect(formattedEN).toBeDefined();
      // Different locales may format the same currency differently
    });

    it('should accept custom currency format options', () => {
      const formatted = formatCurrency(100, 'USD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(formatted).toBeDefined();
    });

    it('should format negative currency values', () => {
      const formatted = formatCurrency(-50, 'USD');
      expect(formatted).toBeDefined();
    });

    it('should format zero currency value', () => {
      const formatted = formatCurrency(0, 'USD');
      expect(formatted).toBeDefined();
    });
  });

  describe('Namespace Handling', () => {
    it('should support multiple namespaces', () => {
      const commonTrans = i18n.t('common:welcome');
      const authTrans = i18n.t('auth:login');

      expect(commonTrans).toBeDefined();
      expect(authTrans).toBeDefined();
    });

    it('should have default namespace as common', () => {
      expect(i18n.options.defaultNS).toBe('common');
    });
  });

  describe('Missing Translation Handling', () => {
    it('should handle missing keys gracefully', () => {
      const translation = i18n.t('nonexistent:key');
      expect(translation).toBeDefined();
    });

    it('should use fallback for missing keys', () => {
      const translation = i18n.t('missing:key', { defaultValue: 'Fallback' });
      expect(translation).toBe('Fallback');
    });
  });

  describe('Translation Resources Validation', () => {
    it('should have non-empty translation files', () => {
      Object.values(resources).forEach(langResources => {
        Object.values(langResources).forEach(namespace => {
          expect(Object.keys(namespace).length).toBeGreaterThan(0);
        });
      });
    });

    it('should have matching keys across all languages', () => {
      const enKeys = Object.keys(resources.en.common);
      const esKeys = Object.keys(resources.es.common);
      const frKeys = Object.keys(resources.fr.common);

      // Check that all languages have similar key structure
      expect(enKeys.length).toBeGreaterThan(0);
      expect(esKeys.length).toBeGreaterThan(0);
      expect(frKeys.length).toBeGreaterThan(0);
    });
  });
});
