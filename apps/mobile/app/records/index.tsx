/**
 * Health Records Screen
 * Main screen for viewing all medical records
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMedicalRecords, useHealthSummary } from '../../src/hooks';
import { MedicalRecord, MedicalRecordType, RecordStatus } from '../../src/types';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/theme';

const recordTypeConfig: Record<MedicalRecordType, { icon: string; color: string; label: string }> = {
  'lab-result': { icon: 'flask', color: colors.info[500], label: 'Lab Result' },
  'imaging': { icon: 'scan', color: colors.secondary[500], label: 'Imaging' },
  'visit-summary': { icon: 'document-text', color: colors.primary[500], label: 'Visit Summary' },
  'immunization': { icon: 'shield-checkmark', color: colors.success[500], label: 'Immunization' },
  'prescription': { icon: 'medkit', color: colors.warning[500], label: 'Prescription' },
  'procedure': { icon: 'cut', color: colors.error[500], label: 'Procedure' },
  'allergy': { icon: 'alert-circle', color: colors.error[400], label: 'Allergy' },
  'vital-signs': { icon: 'heart', color: colors.error[500], label: 'Vital Signs' },
  'other': { icon: 'document', color: colors.gray[500], label: 'Other' },
};

const statusColors: Record<RecordStatus, { bg: string; text: string }> = {
  normal: { bg: colors.success[50], text: colors.success[700] },
  completed: { bg: colors.gray[100], text: colors.gray[600] },
  attention: { bg: colors.warning[50], text: colors.warning[700] },
  pending: { bg: colors.info[50], text: colors.info[700] },
  abnormal: { bg: colors.error[50], text: colors.error[700] },
  critical: { bg: colors.error[100], text: colors.error[800] },
};

const filterOptions: { key: MedicalRecordType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'lab-result', label: 'Labs' },
  { key: 'imaging', label: 'Imaging' },
  { key: 'visit-summary', label: 'Visits' },
  { key: 'prescription', label: 'Rx' },
  { key: 'immunization', label: 'Vaccines' },
];

export default function RecordsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<MedicalRecordType | 'all'>('all');

  const { data: healthSummary } = useHealthSummary();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useMedicalRecords(
    selectedFilter === 'all' ? {} : { type: selectedFilter }
  );

  const records = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  const handleRecordPress = useCallback((record: MedicalRecord) => {
    router.push(`/records/${record.id}`);
  }, [router]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <TouchableOpacity
        style={styles.statCard}
        onPress={() => router.push('/records/lab-results')}
      >
        <View style={[styles.statIcon, { backgroundColor: colors.info[100] }]}>
          <Ionicons name="flask" size={20} color={colors.info[600]} />
        </View>
        <Text style={styles.statNumber}>
          {healthSummary?.recentRecords?.filter(r => r.type === 'lab-result').length || 0}
        </Text>
        <Text style={styles.statLabel}>Lab Results</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statCard}
        onPress={() => router.push('/records/prescriptions')}
      >
        <View style={[styles.statIcon, { backgroundColor: colors.warning[100] }]}>
          <Ionicons name="medkit" size={20} color={colors.warning[600]} />
        </View>
        <Text style={styles.statNumber}>
          {healthSummary?.activePrescriptions?.length || 0}
        </Text>
        <Text style={styles.statLabel}>Active Rx</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statCard}
        onPress={() => router.push('/records/immunizations')}
      >
        <View style={[styles.statIcon, { backgroundColor: colors.success[100] }]}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success[600]} />
        </View>
        <Text style={styles.statNumber}>
          {healthSummary?.dueImmunizations?.length || 0}
        </Text>
        <Text style={styles.statLabel}>Due Vaccines</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterChips = () => (
    <FlatList
      data={filterOptions}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterList}
      contentContainerStyle={styles.filterContent}
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
    />
  );

  const renderRecordCard = ({ item }: { item: MedicalRecord }) => {
    const typeConfig = recordTypeConfig[item.type] || recordTypeConfig.other;
    const statusStyle = statusColors[item.status] || statusColors.completed;

    return (
      <TouchableOpacity
        style={styles.recordCard}
        onPress={() => handleRecordPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.recordIcon, { backgroundColor: typeConfig.color + '20' }]}>
          <Ionicons name={typeConfig.icon as any} size={24} color={typeConfig.color} />
        </View>
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.recordType}>{typeConfig.label}</Text>
          <View style={styles.recordMeta}>
            <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
            {item.providerName && (
              <Text style={styles.recordProvider} numberOfLines={1}>
                {item.providerName}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.recordRight}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {renderQuickStats()}
      <Text style={styles.sectionTitle}>Medical Records</Text>
      {renderFilterChips()}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={colors.gray[300]} />
      <Text style={styles.emptyTitle}>No records found</Text>
      <Text style={styles.emptyText}>
        Your medical records will appear here as they become available.
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Loading records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderRecordCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.gray[500],
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterList: {
    marginBottom: spacing.md,
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
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  recordTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.light.text.primary,
  },
  recordType: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  recordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  recordDate: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
  },
  recordProvider: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
    marginLeft: spacing.sm,
    maxWidth: 120,
  },
  recordRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
    textTransform: 'capitalize',
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
  loadingFooter: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
});
