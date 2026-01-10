/**
 * Date & Time Selection Screen
 * Allows selecting appointment date and time slot
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTimeSlots, useProvider } from "../../src/hooks";
import { TimeSlot, AppointmentType } from "../../src/types";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../../src/theme";

// Generate next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return dates;
};

const formatDate = (date: Date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    dayName: days[date.getDay()],
    dayNum: date.getDate(),
    month: months[date.getMonth()],
    full: date.toISOString().split("T")[0],
    isToday: date.toDateString() === new Date().toDateString(),
  };
};

export default function DateTimeScreen() {
  const { providerId, appointmentType } = useLocalSearchParams<{
    providerId: string;
    appointmentType: AppointmentType;
  }>();
  const router = useRouter();

  const dates = useMemo(() => generateDates(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const { data: _provider } = useProvider(providerId);
  const { data: slots, isLoading } = useTimeSlots(
    providerId,
    selectedDate.toISOString().split("T")[0],
    appointmentType,
  );

  const availableSlots = useMemo(() => {
    if (!slots) return [];
    return slots.filter((slot) => slot.available);
  }, [slots]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedSlot) {
      router.push({
        pathname: "/booking/reason",
        params: {
          providerId,
          appointmentType,
          date: selectedDate.toISOString().split("T")[0],
          slotId: selectedSlot.id,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
      });
    }
  }, [router, providerId, appointmentType, selectedDate, selectedSlot]);

  const groupedSlots = useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    availableSlots.forEach((slot) => {
      const hour = parseInt(slot.startTime.split(":")[0], 10);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  }, [availableSlots]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12 || 12;
    return `${hour}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >
            {dates.map((date) => {
              const formatted = formatDate(date);
              const isSelected =
                date.toDateString() === selectedDate.toDateString();

              return (
                <TouchableOpacity
                  key={formatted.full}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.dateDaySelected,
                    ]}
                  >
                    {formatted.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dateNum,
                      isSelected && styles.dateNumSelected,
                    ]}
                  >
                    {formatted.dayNum}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      isSelected && styles.dateMonthSelected,
                    ]}
                  >
                    {formatted.month}
                  </Text>
                  {formatted.isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayText}>Today</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Available Times for {formatDate(selectedDate).month}{" "}
            {formatDate(selectedDate).dayNum}
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <Text style={styles.loadingText}>Loading available times...</Text>
            </View>
          ) : availableSlots.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyTitle}>No available times</Text>
              <Text style={styles.emptyText}>
                Try selecting a different date
              </Text>
            </View>
          ) : (
            <>
              {groupedSlots.morning.length > 0 && (
                <View style={styles.timeSection}>
                  <View style={styles.timeSectionHeader}>
                    <Ionicons
                      name="sunny-outline"
                      size={16}
                      color={colors.warning[500]}
                    />
                    <Text style={styles.timeSectionTitle}>Morning</Text>
                  </View>
                  <View style={styles.slotsGrid}>
                    {groupedSlots.morning.map((slot) => (
                      <TouchableOpacity
                        key={slot.id}
                        style={[
                          styles.slotButton,
                          selectedSlot?.id === slot.id &&
                            styles.slotButtonSelected,
                        ]}
                        onPress={() => handleSlotSelect(slot)}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            selectedSlot?.id === slot.id &&
                              styles.slotTextSelected,
                          ]}
                        >
                          {formatTime(slot.startTime)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {groupedSlots.afternoon.length > 0 && (
                <View style={styles.timeSection}>
                  <View style={styles.timeSectionHeader}>
                    <Ionicons
                      name="partly-sunny-outline"
                      size={16}
                      color={colors.info[500]}
                    />
                    <Text style={styles.timeSectionTitle}>Afternoon</Text>
                  </View>
                  <View style={styles.slotsGrid}>
                    {groupedSlots.afternoon.map((slot) => (
                      <TouchableOpacity
                        key={slot.id}
                        style={[
                          styles.slotButton,
                          selectedSlot?.id === slot.id &&
                            styles.slotButtonSelected,
                        ]}
                        onPress={() => handleSlotSelect(slot)}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            selectedSlot?.id === slot.id &&
                              styles.slotTextSelected,
                          ]}
                        >
                          {formatTime(slot.startTime)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {groupedSlots.evening.length > 0 && (
                <View style={styles.timeSection}>
                  <View style={styles.timeSectionHeader}>
                    <Ionicons
                      name="moon-outline"
                      size={16}
                      color={colors.secondary[500]}
                    />
                    <Text style={styles.timeSectionTitle}>Evening</Text>
                  </View>
                  <View style={styles.slotsGrid}>
                    {groupedSlots.evening.map((slot) => (
                      <TouchableOpacity
                        key={slot.id}
                        style={[
                          styles.slotButton,
                          selectedSlot?.id === slot.id &&
                            styles.slotButtonSelected,
                        ]}
                        onPress={() => handleSlotSelect(slot)}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            selectedSlot?.id === slot.id &&
                              styles.slotTextSelected,
                          ]}
                        >
                          {formatTime(slot.startTime)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        {selectedSlot && (
          <View style={styles.selectedInfo}>
            <Ionicons name="time" size={16} color={colors.primary[500]} />
            <Text style={styles.selectedText}>
              {formatDate(selectedDate).month} {formatDate(selectedDate).dayNum}{" "}
              at {formatTime(selectedSlot.startTime)}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedSlot && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedSlot}
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    marginBottom: spacing.md,
  },
  datesContainer: {
    paddingRight: spacing.lg,
  },
  dateCard: {
    width: 70,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
    ...shadows.sm,
  },
  dateCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  dateDay: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  dateDaySelected: {
    color: colors.primary[600],
  },
  dateNum: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.primary,
    marginVertical: 2,
  },
  dateNumSelected: {
    color: colors.primary[600],
  },
  dateMonth: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  dateMonthSelected: {
    color: colors.primary[600],
  },
  todayBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  todayText: {
    fontSize: 8,
    color: colors.light.text.inverse,
    fontWeight: typography.fontWeights.bold,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.gray[500],
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[600],
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[400],
    marginTop: spacing.xs,
  },
  timeSection: {
    marginBottom: spacing.lg,
  },
  timeSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  timeSectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[600],
    marginLeft: spacing.xs,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  slotButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    minWidth: 90,
    alignItems: "center",
  },
  slotButtonSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  slotText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[700],
  },
  slotTextSelected: {
    color: colors.light.text.inverse,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.divider,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  selectedText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeights.medium,
  },
  continueButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
