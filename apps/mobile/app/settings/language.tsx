import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../../src/theme';
import { Card } from '../../src/components';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

const LANGUAGE_STORAGE_KEY = 'app_language';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved) {
        setSelectedLanguage(saved);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      setSelectedLanguage(languageCode);

      // Show success message
      const language = LANGUAGES.find((lang) => lang.code === languageCode);
      Alert.alert(
        'Language Updated',
        `Your language preference has been set to ${language?.name}. The app will use this language after restart.`,
        [{ text: 'OK' }]
      );

      // Note: In a real app, you would integrate with i18n library here
      // For example: i18n.changeLanguage(languageCode);
    } catch (error) {
      console.error('Error saving language preference:', error);
      Alert.alert(
        'Error',
        'Failed to save language preference. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card variant="elevated" padding="lg" style={styles.card}>
        <Text style={styles.description}>
          Select your preferred language. This will affect the app's interface language.
        </Text>

        <View style={styles.languageList}>
          {LANGUAGES.map((language) => {
            const isSelected = selectedLanguage === language.code;

            return (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  isSelected && styles.languageItemSelected,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
                activeOpacity={0.7}
              >
                <View style={styles.languageLeft}>
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{language.name}</Text>
                    <Text style={styles.languageNative}>{language.nativeName}</Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Card variant="elevated" padding="lg" style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Language Settings</Text>
        <Text style={styles.infoText}>
          Changing the language will affect all text in the app, including menus, buttons, and notifications.
        </Text>
        <Text style={styles.infoText}>
          Medical terms and professional communications will remain in their original language to ensure accuracy.
        </Text>
        <Text style={styles.infoNote}>
          Note: Full i18n integration is coming soon. Currently, this setting prepares the app for future multilingual support.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
  },
  card: {
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.lg,
  },
  languageList: {
    gap: spacing.xs,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.gray[50],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageItemSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs / 2,
  },
  languageNative: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  infoCard: {
    backgroundColor: colors.info[50],
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  infoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.sm,
  },
  infoNote: {
    fontSize: typography.sizes.xs,
    color: colors.info[700],
    lineHeight: typography.lineHeights.sm,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
});
