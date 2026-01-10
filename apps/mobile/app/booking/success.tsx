/**
 * Booking Success Screen
 * Confirms successful appointment booking
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

export default function SuccessScreen() {
  const router = useRouter();
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate the success icon
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewAppointment = () => {
    router.replace('/(tabs)/appointments');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={64} color={colors.light.text.inverse} />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your appointment has been scheduled successfully.
          </Text>
        </Animated.View>

        {/* Info Cards */}
        <Animated.View style={[styles.infoCards, { opacity: fadeAnim }]}>
          <View style={styles.infoCard}>
            <Ionicons name="mail" size={24} color={colors.primary[500]} />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Confirmation Email</Text>
              <Text style={styles.infoCardText}>
                We've sent a confirmation email with all the details.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="notifications" size={24} color={colors.primary[500]} />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Reminders</Text>
              <Text style={styles.infoCardText}>
                You'll receive a reminder 24 hours and 1 hour before your appointment.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={24} color={colors.primary[500]} />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Add to Calendar</Text>
              <Text style={styles.infoCardText}>
                Don't forget to add this appointment to your calendar.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Next Steps */}
        <Animated.View style={[styles.nextSteps, { opacity: fadeAnim }]}>
          <Text style={styles.nextStepsTitle}>Before Your Visit</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Complete any pre-visit questionnaires
            </Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Have your insurance card ready
            </Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Prepare a list of your current medications
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewAppointment}
        >
          <Ionicons name="calendar" size={20} color={colors.light.text.inverse} />
          <Text style={styles.primaryButtonText}>View Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGoHome}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  infoCards: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  infoCardContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoCardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary[700],
  },
  infoCardText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
    marginTop: 2,
  },
  nextSteps: {
    width: '100%',
    backgroundColor: colors.gray[50],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  nextStepsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    marginBottom: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.inverse,
  },
  stepText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    flex: 1,
  },
  buttonContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  primaryButtonText: {
    color: colors.light.text.inverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    marginLeft: spacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    color: colors.gray[600],
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});
