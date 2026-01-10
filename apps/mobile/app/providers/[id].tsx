/**
 * Provider Detail Screen
 * Shows detailed information about a doctor and allows booking
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProvider, useFavoriteProvider, useProviderReviews } from '../../src/hooks';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/theme';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: provider, isLoading, error } = useProvider(id);
  const { data: reviews } = useProviderReviews(id, 1, 5);
  const { mutate: toggleFavorite } = useFavoriteProvider();

  const handleBookAppointment = useCallback(() => {
    router.push({
      pathname: '/booking/',
      params: { providerId: id },
    });
  }, [router, id]);

  const handleMessage = useCallback(() => {
    router.push({
      pathname: '/messages/new',
      params: { recipientId: provider?.userId },
    });
  }, [router, provider]);

  const handleToggleFavorite = useCallback(() => {
    if (provider) {
      toggleFavorite({ providerId: provider.id, isFavorite: false });
    }
  }, [provider, toggleFavorite]);

  const formattedEducation = useMemo(() => {
    if (!provider?.education) return [];
    return provider.education.map(edu => ({
      ...edu,
      display: `${edu.degree} - ${edu.institution} (${edu.year})`,
    }));
  }, [provider?.education]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (error || !provider) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.error[500]} />
        <Text style={styles.errorTitle}>Doctor not found</Text>
        <Text style={styles.errorText}>
          The doctor profile you're looking for doesn't exist or has been removed.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={{ uri: provider.avatar || 'https://via.placeholder.com/120' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            Dr. {provider.firstName} {provider.lastName}
          </Text>
          {provider.title && (
            <Text style={styles.title}>{provider.title}</Text>
          )}
          <Text style={styles.specialty}>{provider.specialty}</Text>

          {/* Rating */}
          {provider.rating && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color={colors.warning[500]} />
              <Text style={styles.ratingText}>
                {provider.rating.toFixed(1)}
              </Text>
              <Text style={styles.reviewCount}>
                ({provider.reviewCount || 0} reviews)
              </Text>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleFavorite}
            >
              <Ionicons name="heart-outline" size={24} color={colors.error[500]} />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMessage}
            >
              <Ionicons name="chatbubble-outline" size={24} color={colors.primary[500]} />
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
            {provider.phone && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="call-outline" size={24} color={colors.success[500]} />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Accepting Patients Badge */}
        {provider.acceptingNewPatients && (
          <View style={styles.acceptingBanner}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success[500]} />
            <Text style={styles.acceptingBannerText}>
              Accepting new patients
            </Text>
          </View>
        )}

        {/* About Section */}
        {provider.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{provider.bio}</Text>
          </View>
        )}

        {/* Credentials Section */}
        {provider.credentials && provider.credentials.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Credentials</Text>
            <View style={styles.credentialsList}>
              {provider.credentials.map((credential, index) => (
                <View key={index} style={styles.credentialItem}>
                  <Ionicons name="ribbon" size={16} color={colors.primary[500]} />
                  <Text style={styles.credentialText}>{credential}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education Section */}
        {formattedEducation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {formattedEducation.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Ionicons name="school" size={16} color={colors.primary[500]} />
                <Text style={styles.educationText}>{edu.display}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience Section */}
        {provider.yearsOfExperience && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.experienceRow}>
              <Ionicons name="briefcase" size={16} color={colors.primary[500]} />
              <Text style={styles.experienceText}>
                {provider.yearsOfExperience}+ years of experience
              </Text>
            </View>
          </View>
        )}

        {/* Languages Section */}
        {provider.languages && provider.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.languagesRow}>
              {provider.languages.map((lang, index) => (
                <View key={index} style={styles.languageChip}>
                  <Text style={styles.languageText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Insurance Section */}
        {provider.insuranceAccepted && provider.insuranceAccepted.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Accepted</Text>
            <View style={styles.insuranceList}>
              {provider.insuranceAccepted.slice(0, 5).map((insurance, index) => (
                <Text key={index} style={styles.insuranceItem}>
                  {insurance}
                </Text>
              ))}
              {provider.insuranceAccepted.length > 5 && (
                <Text style={styles.moreText}>
                  +{provider.insuranceAccepted.length - 5} more
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Location Section */}
        {provider.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Office Location</Text>
            <View style={styles.locationCard}>
              <Ionicons name="location" size={20} color={colors.primary[500]} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{provider.location.name}</Text>
                <Text style={styles.locationAddress}>
                  {provider.location.address}
                </Text>
                <Text style={styles.locationAddress}>
                  {provider.location.city}, {provider.location.state} {provider.location.zipCode}
                </Text>
                {provider.location.phone && (
                  <Text style={styles.locationPhone}>{provider.location.phone}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Reviews Section */}
        {reviews && reviews.data.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Patient Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {reviews.data.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.patientName}</Text>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < review.rating ? 'star' : 'star-outline'}
                        size={14}
                        color={colors.warning[500]}
                      />
                    ))}
                  </View>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Spacer for bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Appointment Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookAppointment}
        >
          <Ionicons name="calendar" size={20} color={colors.light.text.inverse} />
          <Text style={styles.bookButtonText}>Book Appointment</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[800],
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  backButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    color: colors.light.text.inverse,
    fontWeight: typography.fontWeights.medium,
  },
  headerSection: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.light.card,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.primary,
  },
  title: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  specialty: {
    fontSize: typography.sizes.lg,
    color: colors.primary[600],
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  ratingText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[800],
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginLeft: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  acceptingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success[50],
    paddingVertical: spacing.sm,
  },
  acceptingBannerText: {
    fontSize: typography.sizes.sm,
    color: colors.success[700],
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeights.medium,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[500],
  },
  bioText: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    lineHeight: typography.lineHeights.md,
  },
  credentialsList: {
    gap: spacing.sm,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  credentialText: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginLeft: spacing.sm,
  },
  educationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  educationText: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceText: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginLeft: spacing.sm,
  },
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  languageChip: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  languageText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  insuranceList: {
    gap: spacing.xs,
  },
  insuranceItem: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
  },
  moreText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[500],
    marginTop: spacing.xs,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  locationInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  locationName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[800],
  },
  locationAddress: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  locationPhone: {
    fontSize: typography.sizes.sm,
    color: colors.primary[500],
    marginTop: spacing.xs,
  },
  reviewCard: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[800],
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.sm,
    lineHeight: typography.lineHeights.sm,
  },
  reviewDate: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
    marginTop: spacing.sm,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.divider,
    ...shadows.lg,
  },
  bookButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  bookButtonText: {
    color: colors.light.text.inverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    marginLeft: spacing.sm,
  },
});
