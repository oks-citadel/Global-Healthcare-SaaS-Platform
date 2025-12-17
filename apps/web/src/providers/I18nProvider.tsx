'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { changeLanguage, getCurrentLanguage, type SupportedLanguage } from '@unified-health/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

/**
 * I18n Provider for Web Application
 *
 * This provider initializes i18next and provides translation context to the entire app.
 * It handles language detection, storage, and synchronization across the application.
 *
 * @example
 * ```tsx
 * // In your root layout or _app.tsx
 * import { I18nProvider } from '@/providers/I18nProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <I18nProvider>
 *           {children}
 *         </I18nProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // If initial language is provided, use it
        if (initialLanguage) {
          await changeLanguage(initialLanguage);
        }

        // Set HTML lang attribute
        const currentLang = getCurrentLanguage();
        document.documentElement.lang = currentLang;

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setIsInitialized(true); // Initialize anyway to prevent app from hanging
      }
    };

    initializeI18n();
  }, [initialLanguage]);

  // Listen for language changes and update HTML lang attribute
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.lang = lng;

      // Also update the dir attribute for RTL languages (if needed in future)
      const dir = ['ar', 'he', 'fa'].includes(lng) ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

/**
 * Context for language switching functionality
 */
interface LanguageContextValue {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isChanging: boolean;
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined);

/**
 * Provider that adds language switching capabilities
 */
export function LanguageSwitcherProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getCurrentLanguage());
  const [isChanging, setIsChanging] = useState(false);

  const handleChangeLanguage = async (language: SupportedLanguage) => {
    if (language === currentLanguage) return;

    setIsChanging(true);
    try {
      await changeLanguage(language);
      setCurrentLanguage(language);

      // Notify the app that language has changed (optional)
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const value: LanguageContextValue = {
    currentLanguage,
    changeLanguage: handleChangeLanguage,
    isChanging,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Hook to access language switching functionality
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentLanguage, changeLanguage, isChanging } = useLanguage();
 *
 *   return (
 *     <button
 *       onClick={() => changeLanguage('es')}
 *       disabled={isChanging}
 *     >
 *       Switch to Spanish
 *     </button>
 *   );
 * }
 * ```
 */
export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageSwitcherProvider');
  }
  return context;
}

/**
 * Combined provider that includes both I18n and Language Switcher
 *
 * @example
 * ```tsx
 * // In your root layout
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AppI18nProvider>
 *           {children}
 *         </AppI18nProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AppI18nProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}) {
  return (
    <I18nProvider initialLanguage={initialLanguage}>
      <LanguageSwitcherProvider>{children}</LanguageSwitcherProvider>
    </I18nProvider>
  );
}
