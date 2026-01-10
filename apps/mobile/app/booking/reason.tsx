/**
 * Appointment Reason Screen
 * Captures the reason for the appointment and additional notes
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

const commonReasons = [
  'Annual checkup',
  'Follow-up visit',
  'New symptoms',
  'Prescription refill',
  'Test results review',
  'Chronic condition management',
  'Vaccination',
  'Other',
];

const commonSymptoms = [
  'Headache',
  'Fever',
  'Cough',
  'Fatigue',
  'Pain',
  'Nausea',
  'Dizziness',
  'Shortness of breath',
];

export default function ReasonScreen() {
  const params = useLocalSearchParams<{
    providerId: string;
    appointmentType: string;
    date: string;
    slotId: string;
    startTime: string;
    endTime: string;
  }>();
  const router = useRouter();

  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isNewPatient, setIsNewPatient] = useState(false);

  const handleReasonSelect = useCallback((selectedReason: string) => {
    setReason(selectedReason);
  }, []);

  const handleSymptomToggle = useCallback((symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  }, []);

  const handleContinue = useCallback(() => {
    router.push({
      pathname: '/booking/confirm',
      params: {
        ...params,
        reason: reason || 'General consultation',
        notes: notes || '',
        symptoms: selectedSymptoms.join(','),
        isNewPatient: isNewPatient ? 'true' : 'false',
      },
    });
  }, [router, params, reason, notes, selectedSymptoms, isNewPatient]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* New Patient Toggle */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsNewPatient(!isNewPatient)}
          >
            <View
              style={[
                styles.checkbox,
                isNewPatient && styles.checkboxChecked,
              ]}
            >
              {isNewPatient && (
                <Ionicons name="checkmark" size={16} color={colors.light.text.inverse} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              This is my first visit with this doctor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reason Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Visit</Text>
          <View style={styles.reasonsGrid}>
            {commonReasons.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.reasonChip,
                  reason === r && styles.reasonChipSelected,
                ]}
                onPress={() => handleReasonSelect(r)}
              >
                <Text
                  style={[
                    styles.reasonChipText,
                    reason === r && styles.reasonChipTextSelected,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Any symptoms? <Text style={styles.optionalText}>(Optional)</Text>
          </Text>
          <View style={styles.symptomsGrid}>
            {commonSymptoms.map((symptom) => (
              <TouchableOpacity
                key={symptom}
                style={[
                  styles.symptomChip,
                  selectedSymptoms.includes(symptom) && styles.symptomChipSelected,
                ]}
                onPress={() => handleSymptomToggle(symptom)}
              >
                <Text
                  style={[
                    styles.symptomChipText,
                    selectedSymptoms.includes(symptom) && styles.symptomChipTextSelected,
                  ]}
                >
                  {symptom}
                </Text>
                {selectedSymptoms.includes(symptom) && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.primary[500]}
                    style={styles.symptomCheck}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Additional Notes <Text style={styles.optionalText}>(Optional)</Text>
          </Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Describe your symptoms or concerns in detail..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.gray[400]}
          />
          <Text style={styles.charCount}>{notes.length}/500</Text>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success[500]} />
          <Text style={styles.privacyText}>
            Your health information is protected and will only be shared with your healthcare provider.
          </Text>
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !reason && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!reason}
        >
          <Text style={styles.continueButtonText}>Review Booking</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={colors.light.text.inverse}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.divider,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    marginBottom: spacing.md,
  },
  optionalText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.regular,
    color: colors.gray[400],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkboxLabel: {
    fontSize: typography.sizes.md,
    color: colors.light.text.primary,
    flex: 1,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  reasonChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reasonChipSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  reasonChipText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  reasonChipTextSelected: {
    color: colors.primary[700],
    fontWeight: typography.fontWeights.medium,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  symptomChipSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  symptomChipText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  symptomChipTextSelected: {
    color: colors.primary[700],
    fontWeight: typography.fontWeights.medium,
  },
  symptomCheck: {
    marginLeft: spacing.xs,
  },
  notesInput: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.light.text.primary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  charCount: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    backgroundColor: colors.success[50],
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  privacyText: {
    fontSize: typography.sizes.sm,
    color: colors.success[700],
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: typography.lineHeights.sm,
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
