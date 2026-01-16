/**
 * Prescriptions Screen
 * View and manage prescriptions, request refills
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePrescriptions, useRequestRefill } from '../../src/hooks';
import { Prescription, PrescriptionStatus } from '../../src/types';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/theme';

const statusConfig: Record<PrescriptionStatus, { color: string; bg: string; label: string }> = {
  active: { color: colors.success[700], bg: colors.success[50], label: 'Active' },
  completed: { color: colors.gray[600], bg: colors.gray[100], label: 'Completed' },
  cancelled: { color: colors.error[700], bg: colors.error[50], label: 'Cancelled' },
  expired: { color: colors.warning[700], bg: colors.warning[50], label: 'Expired' },
  'pending-refill': { color: colors.info[700], bg: colors.info[50], label: 'Refill Pending' },
  'on-hold': { color: colors.warning[700], bg: colors.warning[50], label: 'On Hold' },
};

const filterOptions = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending-refill', label: 'Pending' },
  { key: 'expired', label: 'Expired' },
];

export default function PrescriptionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const { data: prescriptions, isLoading, refetch, isRefetching } = usePrescriptions(
    selectedFilter === 'all' ? undefined : selectedFilter
  );
  const { mutate: requestRefill, isPending: isRefilling } = useRequestRefill();

  const handleRequestRefill = useCallback((prescription: Prescription) => {
    Alert.alert(
      'Request Refill',
      `Request a refill for ${prescription.medication.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () => {
            requestRefill(prescription.id, {
              onSuccess: () => {
                Alert.alert('Success', 'Refill request submitted successfully.');
              },
              onError: () => {
                Alert.alert('Error', 'Failed to submit refill request. Please try again.');
              },
            });
          },
        },
      ]
    );
  }, [requestRefill]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderPrescriptionCard = ({ item }: { item: Prescription }) => {
    const status = statusConfig[item.status] || statusConfig.active;
    const canRefill = item.status === 'active' && item.refillsRemaining > 0;

    return (
      <View style={styles.prescriptionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{item.medication.name}</Text>
            {item.medication.genericName && item.medication.genericName !== item.medication.name && (
              <Text style={styles.genericName}>({item.medication.genericName})</Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.dosageRow}>
          <Ionicons name="medical" size={16} color={colors.gray[400]} />
          <Text style={styles.dosageText}>
            {item.dosage} - {item.frequency}
          </Text>
        </View>

        {item.instructions && (
          <Text style={styles.instructions} numberOfLines={2}>
            {item.instructions}
          </Text>
        )}

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Prescribed</Text>
            <Text style={styles.detailValue}>{formatDate(item.startDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Refills Left</Text>
            <Text style={[
              styles.detailValue,
              item.refillsRemaining === 0 && styles.detailValueWarning,
            ]}>
              {item.refillsRemaining}
            </Text>
          </View>
          {item.nextRefillDate && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Next Refill</Text>
              <Text style={styles.detailValue}>{formatDate(item.nextRefillDate)}</Text>
            </View>
          )}
        </View>

        <View style={styles.providerRow}>
          <Ionicons name="person" size={14} color={colors.gray[400]} />
          <Text style={styles.providerName}>{item.providerName}</Text>
        </View>

        {item.pharmacy && (
          <View style={styles.pharmacyRow}>
            <Ionicons name="storefront" size={14} color={colors.gray[400]} />
            <Text style={styles.pharmacyName}>{item.pharmacy.name}</Text>
          </View>
        )}

        {canRefill && (
          <TouchableOpacity
            style={styles.refillButton}
            onPress={() => handleRequestRefill(item)}
            disabled={isRefilling}
          >
            <Ionicons name="refresh" size={18} color={colors.primary[500]} />
            <Text style={styles.refillButtonText}>Request Refill</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <FlatList
        data={filterOptions}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === item.key && styles.filterChipSelected,
            ]}
            onPress={() => setSelectedFilter(item.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === item.key && styles.filterChipTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filterContent}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="medkit-outline" size={64} color={colors.gray[300]} />
      <Text style={styles.emptyTitle}>No prescriptions found</Text>
      <Text style={styles.emptyText}>
        Your prescriptions will appear here when prescribed by your doctor.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={prescriptions}
        renderItem={renderPrescriptionCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  header: {
    paddingVertical: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  filterChipSelected: {
    backgroundColor: colors.primary[500],
  },
  filterChipText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  filterChipTextSelected: {
    color: colors.light.text.inverse,
    fontWeight: typography.fontWeights.medium,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  prescriptionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  medicationInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  medicationName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
  },
  genericName: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dosageText: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginLeft: spacing.xs,
  },
  instructions: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    fontStyle: 'italic',
    marginBottom: spacing.md,
    lineHeight: typography.lineHeights.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.divider,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.light.text.primary,
    marginTop: 2,
  },
  detailValueWarning: {
    color: colors.warning[600],
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  providerName: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginLeft: spacing.xs,
  },
  pharmacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pharmacyName: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginLeft: spacing.xs,
  },
  refillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderRadius: borderRadius.md,
  },
  refillButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.primary[500],
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
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
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
