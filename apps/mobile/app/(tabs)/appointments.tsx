import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  useAppointments,
  useCancelAppointment,
} from '../../src/hooks/useAppointments';
import { Card, LoadingSpinner, Button } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';
import { Appointment } from '../../src/types';

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [page, _setPage] = useState(1);

  const {
    data: appointmentsData,
    isLoading,
    refetch,
    isRefetching,
  } = useAppointments(page, 10);

  const cancelAppointmentMutation = useCancelAppointment();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointmentMutation.mutateAsync(appointmentId);
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const filterAppointments = (appointments: Appointment[]) => {
    if (!appointments) return [];

    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return appointments.filter(
          (apt) =>
            apt.status === 'scheduled' &&
            new Date(apt.date) >= now
        );
      case 'past':
        return appointments.filter(
          (apt) =>
            apt.status === 'completed' ||
            (apt.status === 'scheduled' && new Date(apt.date) < now)
        );
      case 'cancelled':
        return appointments.filter((apt) => apt.status === 'cancelled');
      default:
        return appointments;
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const statusColors = {
      scheduled: colors.info[500],
      pending: colors.warning[500],
      completed: colors.success[500],
      cancelled: colors.error[500],
    };

    const canCancel =
      appointment.status === 'scheduled' &&
      new Date(appointment.date) > new Date();

    return (
      <Card
        key={appointment.id}
        variant="elevated"
        padding="md"
        style={styles.appointmentCard}
      >
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>
              Dr. {appointment.doctor?.name || 'Unknown'}
            </Text>
            <Text style={styles.specialty}>
              {appointment.doctor?.specialty || 'General Practice'}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[appointment.status] },
            ]}
          >
            <Text style={styles.statusText}>
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(appointment.date)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {formatTime(appointment.time)}
            </Text>
          </View>
          {appointment.reason && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reason</Text>
              <Text style={styles.detailValue} numberOfLines={2}>
                {appointment.reason}
              </Text>
            </View>
          )}
        </View>

        {canCancel && (
          <>
            <View style={styles.divider} />
            <View style={styles.actions}>
              <Button
                title="Cancel Appointment"
                variant="danger"
                size="sm"
                onPress={() => handleCancelAppointment(appointment.id)}
                loading={cancelAppointmentMutation.isPending}
                fullWidth
              />
            </View>
          </>
        )}
      </Card>
    );
  };

  const filteredAppointments = filterAppointments(
    appointmentsData?.data || []
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading appointments..." />;
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.tabTextActive,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.tabActive]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'cancelled' && styles.tabTextActive,
            ]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(renderAppointmentCard)
        ) : (
          <Card variant="outlined" padding="xl" style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No {activeTab} appointments
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'upcoming'
                ? 'Book a new appointment to get started'
                : activeTab === 'past'
                ? 'Your past appointments will appear here'
                : 'Cancelled appointments will appear here'}
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Book Appointment FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          Alert.alert(
            'Book Appointment',
            'Booking functionality will be implemented soon'
          );
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary[500],
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[600],
  },
  tabTextActive: {
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  appointmentCard: {
    marginBottom: spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  specialty: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    marginLeft: spacing.md,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  appointmentDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    flex: 1,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[900],
    flex: 2,
    textAlign: 'right',
  },
  actions: {
    marginTop: spacing.md,
  },
  emptyCard: {
    marginTop: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[700],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: typography.fontWeights.bold,
  },
});
