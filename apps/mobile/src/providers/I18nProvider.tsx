import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { changeLanguage, getCurrentLanguage, type SupportedLanguage } from '@unified-health/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

const STORAGE_KEY = '@unified_health:language';

/**
 * I18n Provider for Mobile Application (React Native / Expo)
 *
 * This provider initializes i18next for mobile and provides translation context.
 * It handles device language detection, AsyncStorage persistence, and language synchronization.
 *
 * @example
 * ```tsx
 * // In your App.tsx
 * import { I18nProvider } from './providers/I18nProvider';
 *
 * export default function App() {
 *   return (
 *     <I18nProvider>
 *       <NavigationContainer>
 *         {// Your app navigation}
 *       </NavigationContainer>
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // Try to get stored language preference
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);

        let languageToUse: SupportedLanguage;

        if (initialLanguage) {
          // Use provided initial language
          languageToUse = initialLanguage;
        } else if (storedLanguage) {
          // Use stored language preference
          languageToUse = storedLanguage as SupportedLanguage;
        } else {
          // Detect device language
          const deviceLanguage = Localization.locale.split('-')[0];
          const supportedLanguages: SupportedLanguage[] = ['en', 'es', 'fr'];

          languageToUse = supportedLanguages.includes(deviceLanguage as SupportedLanguage)
            ? (deviceLanguage as SupportedLanguage)
            : 'en';
        }

        // Change to the determined language
        await changeLanguage(languageToUse);

        // Store the language preference
        await AsyncStorage.setItem(STORAGE_KEY, languageToUse);

        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize i18n'));
        // Initialize anyway to prevent app from hanging
        setIsInitialized(true);
      }
    };

    initializeI18n();
  }, [initialLanguage]);

  // Show loading state while initializing
  if (!isInitialized) {
    // You can replace this with your custom loading component
    return null; // or <LoadingScreen />
  }

  if (error) {
    // I18n initialization error - using default language
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

/**
 * Context for language switching functionality in mobile app
 */
interface LanguageContextValue {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isChanging: boolean;
  deviceLanguage: string;
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined);

/**
 * Provider that adds language switching capabilities for mobile
 */
export function LanguageSwitcherProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getCurrentLanguage());
  const [isChanging, setIsChanging] = useState(false);
  const [deviceLanguage] = useState(Localization.locale);

  const handleChangeLanguage = async (language: SupportedLanguage) => {
    if (language === currentLanguage) return;

    setIsChanging(true);
    try {
      // Change the language in i18next
      await changeLanguage(language);

      // Store the preference in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, language);

      setCurrentLanguage(language);
    } catch (error) {
      throw error;
    } finally {
      setIsChanging(false);
    }
  };

  const value: LanguageContextValue = {
    currentLanguage,
    changeLanguage: handleChangeLanguage,
    isChanging,
    deviceLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Hook to access language switching functionality in mobile app
 *
 * @example
 * ```tsx
 * import { useLanguage } from './providers/I18nProvider';
 *
 * function SettingsScreen() {
 *   const { currentLanguage, changeLanguage, isChanging, deviceLanguage } = useLanguage();
 *
 *   return (
 *     <View>
 *       <Text>Current: {currentLanguage}</Text>
 *       <Text>Device: {deviceLanguage}</Text>
 *       <Button
 *         title="Switch to Spanish"
 *         onPress={() => changeLanguage('es')}
 *         disabled={isChanging}
 *       />
 *     </View>
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
 * Combined provider that includes both I18n and Language Switcher for mobile
 *
 * @example
 * ```tsx
 * // In your App.tsx
 * import { AppI18nProvider } from './providers/I18nProvider';
 *
 * export default function App() {
 *   return (
 *     <AppI18nProvider>
 *       <NavigationContainer>
 *         {// Your app navigation}
 *       </NavigationContainer>
 *     </AppI18nProvider>
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

/**
 * Utility function to get stored language preference
 */
export async function getStoredLanguage(): Promise<SupportedLanguage | null> {
  try {
    const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
    return storedLanguage as SupportedLanguage | null;
  } catch (error) {
    return null;
  }
}

/**
 * Utility function to clear stored language preference
 */
export async function clearStoredLanguage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Failed to clear stored language
  }
}

/**
 * Utility function to get device locale information
 */
export function getDeviceLocaleInfo() {
  return {
    locale: Localization.locale,
    locales: Localization.locales,
    timezone: Localization.timezone,
    isRTL: Localization.isRTL,
  };
}
