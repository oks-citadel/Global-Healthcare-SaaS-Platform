/**
 * Booking Flow Entry Screen
 * Allows selecting appointment type
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProvider } from '../../src/hooks';
import { AppointmentType } from '../../src/types';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/theme';

const appointmentTypes = [
  {
    type: 'video' as AppointmentType,
    title: 'Video Visit',
    description: 'Connect with your doctor via video call from anywhere',
    icon: 'videocam',
    color: colors.primary[500],
  },
  {
    type: 'phone' as AppointmentType,
    title: 'Phone Call',
    description: 'Speak with your doctor over the phone',
    icon: 'call',
    color: colors.success[500],
  },
  {
    type: 'in-person' as AppointmentType,
    title: 'In-Person Visit',
    description: 'Visit the doctor at their office location',
    icon: 'location',
    color: colors.secondary[500],
  },
];

export default function BookingScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);

  const { data: provider, isLoading } = useProvider(providerId);

  const handleContinue = useCallback(() => {
    if (selectedType) {
      router.push({
        pathname: '/booking/datetime',
        params: {
          providerId,
          appointmentType: selectedType,
        },
      });
    }
  }, [router, providerId, selectedType]);

  const availableTypes = appointmentTypes.filter(apt => {
    if (!provider?.availability) return true;
    return provider.availability.some(slot =>
      slot.appointmentTypes.includes(apt.type)
    );
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Provider Info */}
      {provider && (
        <View style={styles.providerCard}>
          <Image
            source={{ uri: provider.avatar || 'https://via.placeholder.com/60' }}
            style={styles.providerAvatar}
          />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>
              Dr. {provider.firstName} {provider.lastName}
            </Text>
            <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
          </View>
        </View>
      )}

      {/* Appointment Type Selection */}
      <Text style={styles.sectionTitle}>Select Appointment Type</Text>

      <View style={styles.typesList}>
        {availableTypes.map((apt) => (
          <TouchableOpacity
            key={apt.type}
            style={[
              styles.typeCard,
              selectedType === apt.type && styles.typeCardSelected,
            ]}
            onPress={() => setSelectedType(apt.type)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.typeIconContainer,
                { backgroundColor: apt.color + '20' },
              ]}
            >
              <Ionicons
                name={apt.icon as any}
                size={28}
                color={apt.color}
              />
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeTitle}>{apt.title}</Text>
              <Text style={styles.typeDescription}>{apt.description}</Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                selectedType === apt.type && styles.radioOuterSelected,
              ]}
            >
              {selectedType === apt.type && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedType && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={colors.light.text.inverse}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.divider,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  providerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  providerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
  },
  providerSpecialty: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  typesList: {
    paddingHorizontal: spacing.lg,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  typeCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  typeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  typeTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
  },
  typeDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.divider,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  continueButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  continueButtonText: {
    color: colors.light.text.inverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    marginRight: spacing.sm,
  },
});
