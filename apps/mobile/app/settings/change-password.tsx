import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input, Button, Card } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';
import apiClient from '../../src/api/client';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: colors.error[500] };
    if (score <= 3) return { score, label: 'Fair', color: colors.warning[500] };
    if (score <= 4) return { score, label: 'Good', color: colors.info[500] };
    return { score, label: 'Strong', color: colors.success[500] };
  };

  const passwordStrength = newPassword ? calculatePasswordStrength(newPassword) : null;

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to change password. Please try again.';

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card variant="elevated" padding="lg" style={styles.card}>
        <Text style={styles.description}>
          Choose a strong password to keep your account secure. Your password should be at least 8 characters long and include uppercase, lowercase, and numbers.
        </Text>

        <View style={styles.form}>
          <Input
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
              if (errors.currentPassword) {
                setErrors({ ...errors, currentPassword: undefined });
              }
            }}
            secureTextEntry={!showCurrentPassword}
            error={errors.currentPassword}
            required
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Text style={styles.toggleText}>
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            }
          />

          <Input
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (errors.newPassword) {
                setErrors({ ...errors, newPassword: undefined });
              }
            }}
            secureTextEntry={!showNewPassword}
            error={errors.newPassword}
            required
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Text style={styles.toggleText}>
                  {showNewPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            }
          />

          {passwordStrength && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthLabel}>Password Strength:</Text>
                <Text style={[styles.strengthValue, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <View
                    key={index}
                    style={[
                      styles.strengthSegment,
                      index <= passwordStrength.score && {
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          <Input
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: undefined });
              }
            }}
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword}
            required
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.toggleText}>
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Password Requirements:</Text>
          <Text style={styles.tipItem}>• At least 8 characters long</Text>
          <Text style={styles.tipItem}>• Contains uppercase letters (A-Z)</Text>
          <Text style={styles.tipItem}>• Contains lowercase letters (a-z)</Text>
          <Text style={styles.tipItem}>• Contains numbers (0-9)</Text>
          <Text style={styles.tipItem}>• Special characters recommended (!@#$%^&*)</Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Change Password"
          onPress={handleChangePassword}
          loading={loading}
          fullWidth
          size="lg"
        />
        <Button
          title="Cancel"
          variant="ghost"
          onPress={() => router.back()}
          fullWidth
          size="lg"
        />
      </View>
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
  card: {
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.lg,
  },
  form: {
    marginBottom: spacing.lg,
  },
  toggleText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold,
  },
  strengthContainer: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  strengthLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  strengthValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  strengthBar: {
    flexDirection: 'row',
    gap: spacing.xs,
    height: 4,
  },
  strengthSegment: {
    flex: 1,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
  },
  tips: {
    backgroundColor: colors.info[50],
    padding: spacing.md,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  tipsTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  tipItem: {
    fontSize: typography.sizes.xs,
    color: colors.gray[700],
    lineHeight: typography.lineHeights.md,
  },
  actions: {
    gap: spacing.sm,
  },
});
