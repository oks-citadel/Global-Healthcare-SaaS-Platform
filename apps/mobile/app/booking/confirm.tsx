/**
 * Booking Confirmation Screen
 * Reviews all booking details before final submission
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProvider, useBookAppointment } from "../../src/hooks";
import { AppointmentType } from "../../src/types";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../../src/theme";

const appointmentTypeLabels: Record<
  AppointmentType,
  { label: string; icon: string }
> = {
  video: { label: "Video Visit", icon: "videocam" },
  phone: { label: "Phone Call", icon: "call" },
  "in-person": { label: "In-Person Visit", icon: "location" },
};

export default function ConfirmScreen() {
  const params = useLocalSearchParams<{
    providerId: string;
    appointmentType: AppointmentType;
    date: string;
    slotId: string;
    startTime: string;
    endTime: string;
    reason: string;
    notes: string;
    symptoms: string;
    isNewPatient: string;
  }>();
  const router = useRouter();

  const { data: provider, isLoading: providerLoading } = useProvider(
    params.providerId,
  );
  const { mutate: bookAppointment, isPending: isBooking } =
    useBookAppointment();

  const symptoms = useMemo(() => {
    return params.symptoms ? params.symptoms.split(",").filter(Boolean) : [];
  }, [params.symptoms]);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const formatTime = useCallback((time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12 || 12;
    return `${hour}:${minutes.toString().padStart(2, "0")} ${period}`;
  }, []);

  const handleConfirmBooking = useCallback(() => {
    if (!provider) return;

    bookAppointment(
      {
        provider,
        selectedDate: params.date,
        selectedSlot: {
          id: params.slotId,
          startTime: params.startTime,
          endTime: params.endTime,
          available: true,
          providerId: params.providerId,
          appointmentType: params.appointmentType,
        },
        appointmentType: params.appointmentType,
        reason: params.reason,
        notes: params.notes,
        symptoms: symptoms,
        isNewPatient: params.isNewPatient === "true",
        step: "confirm",
      },
      {
        onSuccess: () => {
          router.replace("/booking/success");
        },
        onError: (_error) => {
          Alert.alert(
            "Booking Failed",
            "Unable to complete your booking. Please try again.",
            [{ text: "OK" }],
          );
        },
      },
    );
  }, [provider, params, symptoms, bookAppointment, router]);

  if (providerLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  const typeInfo =
    appointmentTypeLabels[params.appointmentType] ||
    appointmentTypeLabels.video;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="checkmark-circle"
            size={48}
            color={colors.success[500]}
          />
          <Text style={styles.headerTitle}>Review Your Booking</Text>
          <Text style={styles.headerSubtitle}>
            Please verify the details before confirming
          </Text>
        </View>

        {/* Provider Card */}
        {provider && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Doctor</Text>
            <View style={styles.providerRow}>
              <Image
                source={{
                  uri: provider.avatar || "https://via.placeholder.com/50",
                }}
                style={styles.providerAvatar}
              />
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>
                  Dr. {provider.firstName} {provider.lastName}
                </Text>
                <Text style={styles.providerSpecialty}>
                  {provider.specialty}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Appointment Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons
                name={typeInfo.icon as any}
                size={20}
                color={colors.primary[500]}
              />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{typeInfo.label}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar" size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(params.date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="time" size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {formatTime(params.startTime)} - {formatTime(params.endTime)}
              </Text>
            </View>
          </View>
        </View>

        {/* Visit Reason */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visit Information</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="medical" size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Reason</Text>
              <Text style={styles.detailValue}>{params.reason}</Text>
            </View>
          </View>

          {symptoms.length > 0 && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons
                  name="fitness"
                  size={20}
                  color={colors.primary[500]}
                />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Symptoms</Text>
                <View style={styles.symptomsRow}>
                  {symptoms.map((symptom, index) => (
                    <View key={index} style={styles.symptomChip}>
                      <Text style={styles.symptomText}>{symptom}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {params.notes && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={colors.primary[500]}
                />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailValue}>{params.notes}</Text>
              </View>
            </View>
          )}

          {params.isNewPatient === "true" && (
            <View style={styles.newPatientBadge}>
              <Ionicons name="person-add" size={16} color={colors.info[600]} />
              <Text style={styles.newPatientText}>
                First visit with this doctor
              </Text>
            </View>
          )}
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policyCard}>
          <Ionicons
            name="information-circle"
            size={20}
            color={colors.info[500]}
          />
          <View style={styles.policyContent}>
            <Text style={styles.policyTitle}>Cancellation Policy</Text>
            <Text style={styles.policyText}>
              You can cancel or reschedule your appointment up to 24 hours
              before the scheduled time without any charges.
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isBooking}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isBooking && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmBooking}
          disabled={isBooking}
        >
          {isBooking ? (
            <ActivityIndicator size="small" color={colors.light.text.inverse} />
          ) : (
            <>
              <Ionicons
                name="checkmark"
                size={20}
                color={colors.light.text.inverse}
              />
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.light.background,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.primary,
    marginTop: spacing.md,
  },
  headerSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.light.background,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    marginBottom: spacing.md,
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
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
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  detailInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  detailValue: {
    fontSize: typography.sizes.md,
    color: colors.light.text.primary,
    fontWeight: typography.fontWeights.medium,
    marginTop: 2,
  },
  symptomsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  symptomChip: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  symptomText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[700],
  },
  newPatientBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.info[50],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  newPatientText: {
    fontSize: typography.sizes.sm,
    color: colors.info[700],
    marginLeft: spacing.sm,
  },
  policyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.info[50],
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  policyContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  policyTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.info[700],
  },
  policyText: {
    fontSize: typography.sizes.sm,
    color: colors.info[600],
    marginTop: spacing.xs,
    lineHeight: typography.lineHeights.sm,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: spacing.lg,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.divider,
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: colors.gray[600],
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  confirmButton: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.primary[300],
  },
  confirmButtonText: {
    color: colors.light.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    marginLeft: spacing.sm,
  },
});
