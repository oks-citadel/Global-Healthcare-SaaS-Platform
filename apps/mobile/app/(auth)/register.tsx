import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Button, Input } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
  }>({});

  const { register, isLoading, clearError } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: any = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation (optional)
    if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
      });
      // Navigation will be handled by the root layout
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message ||
          'Unable to create account. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to get started with UnifiedHealth
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({ ...errors, name: undefined });
              }}
              error={errors.name}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              required
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              required
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number (optional)"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrors({ ...errors, phone: undefined });
              }}
              error={errors.phone}
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              helperText="Must be at least 8 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors({ ...errors, confirmPassword: undefined });
              }}
              error={errors.confirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              required
            />

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>I am a:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'patient' && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole('patient')}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === 'patient' && styles.roleButtonTextActive,
                    ]}
                  >
                    Patient
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'doctor' && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole('doctor')}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === 'doctor' && styles.roleButtonTextActive,
                    ]}
                  >
                    Doctor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              size="lg"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  roleContainer: {
    marginBottom: spacing.lg,
  },
  roleLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    alignItems: 'center',
    backgroundColor: colors.light.background,
  },
  roleButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  roleButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[700],
  },
  roleButtonTextActive: {
    color: colors.primary[600],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
  },
  linkText: {
    fontSize: typography.sizes.md,
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold,
  },
});
