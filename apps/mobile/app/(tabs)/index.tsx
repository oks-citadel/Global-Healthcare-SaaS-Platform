import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useUpcomingAppointments } from '../../src/hooks/useAppointments';
import { Card, LoadingSpinner } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';
import { Appointment } from '../../src/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    data: upcomingAppointments,
    isLoading,
    refetch,
    isRefetching,
  } = useUpcomingAppointments(3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const statusColors = {
      scheduled: colors.info[500],
      pending: colors.warning[500],
      completed: colors.success[500],
      cancelled: colors.error[500],
    };

    return (
      <Card
        key={appointment.id}
        variant="outlined"
        padding="md"
        style={styles.appointmentCard}
        onPress={() => {
          // Navigate to appointment details
        }}
      >
        <View style={styles.appointmentHeader}>
          <View>
            <Text style={styles.doctorName}>
              {appointment.doctor?.name || 'Doctor'}
            </Text>
            <Text style={styles.specialty}>
              {appointment.doctor?.specialty || 'General'}
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

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {formatDate(appointment.date)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>
              {formatTime(appointment.time)}
            </Text>
          </View>
          {appointment.reason && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reason:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {appointment.reason}
              </Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  const quickActions = [
    {
      id: 'book',
      title: 'Book Appointment',
      description: 'Schedule a new appointment',
      color: colors.primary[500],
      onPress: () => {
        // Navigate to booking screen
      },
    },
    {
      id: 'doctors',
      title: 'Find Doctors',
      description: 'Search for specialists',
      color: colors.secondary[500],
      onPress: () => {
        // Navigate to doctors list
      },
    },
    {
      id: 'records',
      title: 'Medical Records',
      description: 'View your health history',
      color: colors.info[500],
      onPress: () => {
        // Navigate to records
      },
    },
    {
      id: 'prescriptions',
      title: 'Prescriptions',
      description: 'Manage your medications',
      color: colors.success[500],
      onPress: () => {
        // Navigate to prescriptions
      },
    },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.welcomeText}>
          How can we help you today?
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + '20' },
                ]}
              >
                <View
                  style={[
                    styles.quickActionIconDot,
                    { backgroundColor: action.color },
                  ]}
                />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionDescription}>
                {action.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(renderAppointmentCard)
        ) : (
          <Card variant="outlined" padding="lg">
            <Text style={styles.emptyText}>No upcoming appointments</Text>
            <Text style={styles.emptySubtext}>
              Book your first appointment to get started
            </Text>
          </Card>
        )}
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
    paddingBottom: spacing.xl,
  },
  welcomeSection: {
    backgroundColor: colors.primary[500],
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  greeting: {
    fontSize: typography.sizes.md,
    color: colors.primary[100],
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: '#ffffff',
    marginBottom: spacing.xs,
  },
  welcomeText: {
    fontSize: typography.sizes.md,
    color: colors.primary[100],
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.gray[900],
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: spacing.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionIconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  quickActionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  quickActionDescription: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    textAlign: 'center',
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
  doctorName: {
    fontSize: typography.sizes.md,
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
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: '#ffffff',
  },
  appointmentDetails: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[900],
    flex: 1,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: typography.sizes.md,
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
});
