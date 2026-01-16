import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { TranslationNamespace, defaultNS } from '../index';

/**
 * Type-safe translation hook with namespace support
 *
 * @example
 * ```tsx
 * // Using default namespace (common)
 * const { t } = useTranslation();
 * t('app.name'); // "Unified Health Platform"
 *
 * // Using specific namespace
 * const { t } = useTranslation('auth');
 * t('login.title'); // "Sign In"
 *
 * // Using multiple namespaces
 * const { t } = useTranslation(['common', 'auth']);
 * t('common:app.name'); // "Unified Health Platform"
 * t('auth:login.title'); // "Sign In"
 * ```
 */
export function useTranslation<NS extends TranslationNamespace = typeof defaultNS>(
  ns?: NS | NS[]
) {
  return useTranslationOriginal(ns);
}

/**
 * Hook for accessing i18n instance directly
 */
export { useTranslation as default };
