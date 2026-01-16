/**
 * Billing & Payments Main Screen
 * Overview of subscription, payments, and billing
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useSubscription,
  usePaymentMethods,
  useInvoices,
  useUsageSummary,
} from '../../src/hooks';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/theme';

export default function BillingScreen() {
  const router = useRouter();
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: paymentMethods } = usePaymentMethods();
  const { data: invoices } = useInvoices(1, 3);
  const { data: usage } = useUsageSummary();

  const defaultPayment = paymentMethods?.find(p => p.isDefault);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  if (subLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Subscription Card */}
      <TouchableOpacity
        style={styles.subscriptionCard}
        onPress={() => router.push('/billing/subscription')}
      >
        <View style={styles.subscriptionHeader}>
          <View style={styles.subscriptionInfo}>
            <Text style={styles.planName}>
              {subscription?.plan?.name || 'No Active Plan'}
            </Text>
            {subscription && (
              <View style={[
                styles.statusBadge,
                subscription.status === 'active' && styles.statusActive,
                subscription.status === 'trialing' && styles.statusTrial,
                subscription.cancelAtPeriodEnd && styles.statusCanceling,
              ]}>
                <Text style={styles.statusText}>
                  {subscription.cancelAtPeriodEnd
                    ? 'Canceling'
                    : subscription.status === 'trialing'
                    ? 'Trial'
                    : 'Active'}
                </Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </View>

        {subscription && (
          <>
            <Text style={styles.priceText}>
              {formatCurrency(subscription.plan?.price || 0)}/{subscription.plan?.interval}
            </Text>
            <Text style={styles.renewalText}>
              {subscription.cancelAtPeriodEnd
                ? `Expires ${formatDate(subscription.currentPeriodEnd)}`
                : `Renews ${formatDate(subscription.currentPeriodEnd)}`}
            </Text>
          </>
        )}

        {!subscription && (
          <View style={styles.noSubContainer}>
            <Text style={styles.noSubText}>
              Subscribe to access premium features
            </Text>
            <View style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>View Plans</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Usage Summary */}
      {usage && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Usage</Text>
          <View style={styles.usageCard}>
            <View style={styles.usageItem}>
              <View style={styles.usageHeader}>
                <Text style={styles.usageLabel}>Appointments</Text>
                <Text style={styles.usageValue}>
                  {usage.currentPeriod.appointmentsUsed}/{usage.currentPeriod.appointmentsLimit}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (usage.currentPeriod.appointmentsUsed / usage.currentPeriod.appointmentsLimit) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.usageItem}>
              <View style={styles.usageHeader}>
                <Text style={styles.usageLabel}>Messages</Text>
                <Text style={styles.usageValue}>
                  {usage.currentPeriod.messagesUsed}/{usage.currentPeriod.messagesLimit}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (usage.currentPeriod.messagesUsed / usage.currentPeriod.messagesLimit) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.usageItem}>
              <View style={styles.usageHeader}>
                <Text style={styles.usageLabel}>Storage</Text>
                <Text style={styles.usageValue}>
                  {usage.currentPeriod.storageUsedMB.toFixed(1)} MB / {usage.currentPeriod.storageLimitMB} MB
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (usage.currentPeriod.storageUsedMB / usage.currentPeriod.storageLimitMB) * 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Payment Method */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity onPress={() => router.push('/billing/payment-methods')}>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.paymentCard}
          onPress={() => router.push('/billing/payment-methods')}
        >
          {defaultPayment ? (
            <View style={styles.paymentRow}>
              <Ionicons
                name={defaultPayment.type === 'card' ? 'card' : 'business'}
                size={24}
                color={colors.primary[500]}
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>
                  {defaultPayment.card?.brand} ending in {defaultPayment.card?.last4}
                </Text>
                <Text style={styles.paymentSubtitle}>
                  Expires {defaultPayment.card?.expMonth}/{defaultPayment.card?.expYear}
                </Text>
              </View>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            </View>
          ) : (
            <View style={styles.addPaymentRow}>
              <Ionicons name="add-circle" size={24} color={colors.primary[500]} />
              <Text style={styles.addPaymentText}>Add Payment Method</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Invoices */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Invoices</Text>
          <TouchableOpacity onPress={() => router.push('/billing/invoices')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {invoices?.data && invoices.data.length > 0 ? (
          <View style={styles.invoicesList}>
            {invoices.data.map((invoice) => (
              <View key={invoice.id} style={styles.invoiceItem}>
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                  <Text style={styles.invoiceDate}>
                    {formatDate(invoice.createdAt)}
                  </Text>
                </View>
                <View style={styles.invoiceRight}>
                  <Text style={styles.invoiceAmount}>
                    {formatCurrency(invoice.amount)}
                  </Text>
                  <View style={[
                    styles.invoiceStatus,
                    invoice.status === 'paid' && styles.invoiceStatusPaid,
                    invoice.status === 'open' && styles.invoiceStatusOpen,
                  ]}>
                    <Text style={[
                      styles.invoiceStatusText,
                      invoice.status === 'paid' && styles.invoiceStatusTextPaid,
                      invoice.status === 'open' && styles.invoiceStatusTextOpen,
                    ]}>
                      {invoice.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyInvoices}>
            <Text style={styles.emptyText}>No invoices yet</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: colors.info[100] }]}>
              <Ionicons name="help-circle" size={24} color={colors.info[600]} />
            </View>
            <Text style={styles.actionText}>Billing Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: colors.warning[100] }]}>
              <Ionicons name="document-text" size={24} color={colors.warning[600]} />
            </View>
            <Text style={styles.actionText}>Tax Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: colors.success[100] }]}>
              <Ionicons name="gift" size={24} color={colors.success[600]} />
            </View>
            <Text style={styles.actionText}>Redeem Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.inverse,
  },
  statusBadge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusActive: {
    backgroundColor: colors.success[500],
  },
  statusTrial: {
    backgroundColor: colors.info[500],
  },
  statusCanceling: {
    backgroundColor: colors.warning[500],
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.light.text.inverse,
  },
  priceText: {
    fontSize: typography.sizes.lg,
    color: colors.primary[100],
    marginTop: spacing.md,
  },
  renewalText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[200],
    marginTop: spacing.xs,
  },
  noSubContainer: {
    marginTop: spacing.md,
  },
  noSubText: {
    fontSize: typography.sizes.md,
    color: colors.primary[100],
  },
  upgradeButton: {
    marginTop: spacing.md,
    backgroundColor: colors.light.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary[600],
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
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[500],
  },
  usageCard: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  usageItem: {
    marginBottom: spacing.md,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  usageLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  usageValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[700],
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 3,
  },
  paymentCard: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  paymentTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.light.text.primary,
    textTransform: 'capitalize',
  },
  paymentSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: colors.success[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  defaultText: {
    fontSize: typography.sizes.xs,
    color: colors.success[700],
    fontWeight: typography.fontWeights.medium,
  },
  addPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: typography.sizes.md,
    color: colors.primary[500],
    marginLeft: spacing.md,
  },
  invoicesList: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.divider,
  },
  invoiceInfo: {},
  invoiceNumber: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.light.text.primary,
  },
  invoiceDate: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: 2,
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
  },
  invoiceStatus: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[100],
  },
  invoiceStatusPaid: {
    backgroundColor: colors.success[50],
  },
  invoiceStatusOpen: {
    backgroundColor: colors.warning[50],
  },
  invoiceStatusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  invoiceStatusTextPaid: {
    color: colors.success[700],
  },
  invoiceStatusTextOpen: {
    color: colors.warning[700],
  },
  emptyInvoices: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[400],
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    textAlign: 'center',
  },
});
