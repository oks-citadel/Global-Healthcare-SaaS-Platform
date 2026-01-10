/**
 * Provider Search Screen
 * Allows patients to search and find doctors
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProviderSearch, useSpecialties, useFeaturedProviders } from '../../src/hooks';
import { Provider, ProviderSearchParams } from '../../src/types';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/theme';

export default function ProvidersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>();
  const [searchParams, setSearchParams] = useState<ProviderSearchParams>({
    limit: 20,
  });

  const { data: specialties } = useSpecialties();
  const { data: featuredProviders, isLoading: featuredLoading } = useFeaturedProviders(5);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useProviderSearch(searchParams);

  const providers = data?.pages.flatMap(page => page.data) ?? [];
  const showFeatured = !searchQuery && !selectedSpecialty && providers.length === 0;

  const handleSearch = useCallback(() => {
    setSearchParams(prev => ({
      ...prev,
      query: searchQuery || undefined,
      specialty: selectedSpecialty,
    }));
  }, [searchQuery, selectedSpecialty]);

  const handleSpecialtySelect = useCallback((specialty: string) => {
    const newSpecialty = specialty === selectedSpecialty ? undefined : specialty;
    setSelectedSpecialty(newSpecialty);
    setSearchParams(prev => ({
      ...prev,
      specialty: newSpecialty,
    }));
  }, [selectedSpecialty]);

  const handleProviderPress = useCallback((provider: Provider) => {
    router.push(`/providers/${provider.id}`);
  }, [router]);

  const renderProviderCard = useCallback(({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={styles.providerCard}
      onPress={() => handleProviderPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/80' }}
        style={styles.providerAvatar}
      />
      <View style={styles.providerInfo}>
        <Text style={styles.providerName}>
          Dr. {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.providerSpecialty}>{item.specialty}</Text>
        {item.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.warning[500]} />
            <Text style={styles.ratingText}>
              {item.rating.toFixed(1)} ({item.reviewCount || 0} reviews)
            </Text>
          </View>
        )}
        {item.acceptingNewPatients && (
          <View style={styles.acceptingBadge}>
            <Ionicons name="checkmark-circle" size={12} color={colors.success[500]} />
            <Text style={styles.acceptingText}>Accepting new patients</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  ), [handleProviderPress]);

  const renderSpecialtyChip = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.specialtyChip,
        selectedSpecialty === item && styles.specialtyChipSelected,
      ]}
      onPress={() => handleSpecialtySelect(item)}
    >
      <Text
        style={[
          styles.specialtyChipText,
          selectedSpecialty === item && styles.specialtyChipTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  ), [selectedSpecialty, handleSpecialtySelect]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors, specialties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          placeholderTextColor={colors.gray[400]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {specialties && specialties.length > 0 && (
        <FlatList
          data={specialties}
          renderItem={renderSpecialtyChip}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.specialtiesList}
          contentContainerStyle={styles.specialtiesContent}
        />
      )}

      {showFeatured && featuredProviders && featuredProviders.length > 0 && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Doctors</Text>
          {featuredProviders.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={styles.featuredCard}
              onPress={() => handleProviderPress(provider)}
            >
              <Image
                source={{ uri: provider.avatar || 'https://via.placeholder.com/60' }}
                style={styles.featuredAvatar}
              />
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredName}>
                  Dr. {provider.firstName} {provider.lastName}
                </Text>
                <Text style={styles.featuredSpecialty}>{provider.specialty}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {(searchQuery || selectedSpecialty) && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {data?.pages[0]?.total || 0} doctors found
          </Text>
        </View>
      )}
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

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && !showFeatured) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Finding doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={providers}
        renderItem={renderProviderCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !showFeatured ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical" size={64} color={colors.gray[300]} />
              <Text style={styles.emptyTitle}>No doctors found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : null
        }
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
    backgroundColor: colors.light.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.gray[500],
  },
  header: {
    padding: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.light.text.primary,
  },
  specialtiesList: {
    marginTop: spacing.md,
  },
  specialtiesContent: {
    paddingRight: spacing.md,
  },
  specialtyChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  specialtyChipSelected: {
    backgroundColor: colors.primary[500],
  },
  specialtyChipText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  specialtyChipTextSelected: {
    color: colors.light.text.inverse,
  },
  featuredSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    marginBottom: spacing.md,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  featuredAvatar: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
  },
  featuredInfo: {
    marginLeft: spacing.md,
  },
  featuredName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.light.text.primary,
  },
  featuredSpecialty: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  resultsHeader: {
    marginTop: spacing.md,
  },
  resultsText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
  },
  providerInfo: {
    flex: 1,
    marginLeft: spacing.md,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginLeft: spacing.xs,
  },
  acceptingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  acceptingText: {
    fontSize: typography.sizes.xs,
    color: colors.success[600],
    marginLeft: spacing.xs,
  },
  loadingFooter: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
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
});
