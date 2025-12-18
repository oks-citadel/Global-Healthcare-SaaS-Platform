import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../src/theme';
import { Card, Button } from '../../src/components';
import apiClient from '../../src/api/client';
import { useAuth } from '../../src/hooks/useAuth';

interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  marketing: boolean;
}

const PRIVACY_STORAGE_KEY = 'privacy_settings';

export default function PrivacyScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    analytics: true,
    crashReports: true,
    marketing: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(PRIVACY_STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof PrivacySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    try {
      await AsyncStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      // Revert on error
      setSettings(settings);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleExportData = async () => {
    Alert.alert(
      'Export Data',
      'Your data export will be prepared and sent to your registered email address within 24-48 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Export',
          onPress: async () => {
            try {
              setSaving(true);
              await apiClient.post('/user/export-data');
              Alert.alert(
                'Export Requested',
                'Your data export request has been submitted. You will receive an email with a download link within 24-48 hours.'
              );
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to request data export. Please try again.'
              );
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'Please type DELETE to confirm account deletion. This will permanently delete all your data, appointments, and medical records.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'I Understand, Delete My Account',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await apiClient.delete('/user/account');

              Alert.alert(
                'Account Deleted',
                'Your account has been successfully deleted.',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      await logout();
                      router.replace('/');
                    },
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete account. Please contact support.'
              );
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
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
      {/* Data Sharing Settings */}
      <Card variant="elevated" padding="lg" style={styles.card}>
        <Text style={styles.sectionTitle}>Data Sharing</Text>
        <Text style={styles.sectionDescription}>
          Control how your data is used to improve our services
        </Text>

        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Usage Analytics</Text>
              <Text style={styles.settingDescription}>
                Help improve the app by sharing anonymous usage data
              </Text>
            </View>
            <Switch
              value={settings.analytics}
              onValueChange={() => handleToggle('analytics')}
              trackColor={{ false: colors.gray[300], true: colors.primary[300] }}
              thumbColor={settings.analytics ? colors.primary[500] : colors.gray[100]}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Crash Reports</Text>
              <Text style={styles.settingDescription}>
                Automatically send crash reports to help us fix bugs
              </Text>
            </View>
            <Switch
              value={settings.crashReports}
              onValueChange={() => handleToggle('crashReports')}
              trackColor={{ false: colors.gray[300], true: colors.primary[300] }}
              thumbColor={settings.crashReports ? colors.primary[500] : colors.gray[100]}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Marketing Communications</Text>
              <Text style={styles.settingDescription}>
                Receive updates about new features and health tips
              </Text>
            </View>
            <Switch
              value={settings.marketing}
              onValueChange={() => handleToggle('marketing')}
              trackColor={{ false: colors.gray[300], true: colors.primary[300] }}
              thumbColor={settings.marketing ? colors.primary[500] : colors.gray[100]}
            />
          </View>
        </View>
      </Card>

      {/* Data Rights */}
      <Card variant="elevated" padding="lg" style={styles.card}>
        <Text style={styles.sectionTitle}>Your Data Rights</Text>
        <Text style={styles.sectionDescription}>
          Manage your personal data and privacy
        </Text>

        <View style={styles.actionsList}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleExportData}
            disabled={saving}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📥</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Export My Data</Text>
              <Text style={styles.actionDescription}>
                Download a copy of your personal data
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Compliance Information */}
      <Card variant="elevated" padding="lg" style={styles.complianceCard}>
        <Text style={styles.complianceTitle}>Privacy & Compliance</Text>
        <Text style={styles.complianceText}>
          We are committed to protecting your privacy and complying with international data protection regulations including:
        </Text>
        <View style={styles.complianceList}>
          <Text style={styles.complianceItem}>• GDPR (General Data Protection Regulation)</Text>
          <Text style={styles.complianceItem}>• HIPAA (Health Insurance Portability and Accountability Act)</Text>
          <Text style={styles.complianceItem}>• CCPA (California Consumer Privacy Act)</Text>
        </View>
        <Text style={styles.complianceText}>
          Your health data is encrypted and stored securely. We never sell your personal information to third parties.
        </Text>
      </Card>

      {/* Danger Zone */}
      <Card variant="elevated" padding="lg" style={styles.dangerCard}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerDescription}>
          Once you delete your account, there is no going back. Please be certain.
        </Text>

        <Button
          title="Delete My Account"
          variant="danger"
          onPress={handleDeleteAccount}
          loading={saving}
          fullWidth
          size="lg"
        />
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
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.lg,
  },
  settingsList: {
    gap: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[900],
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    lineHeight: typography.lineHeights.sm,
  },
  actionsList: {
    gap: spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: spacing.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[900],
    marginBottom: spacing.xs / 2,
  },
  actionDescription: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  actionChevron: {
    fontSize: 24,
    color: colors.gray[400],
    marginLeft: spacing.sm,
  },
  complianceCard: {
    backgroundColor: colors.info[50],
    borderWidth: 1,
    borderColor: colors.info[200],
    marginBottom: spacing.lg,
  },
  complianceTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  complianceText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.sm,
  },
  complianceList: {
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
  },
  complianceItem: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeights.md,
  },
  dangerCard: {
    backgroundColor: colors.error[50],
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  dangerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.error[700],
    marginBottom: spacing.xs,
  },
  dangerDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.md,
  },
});
