'use client';

import React, { useState } from 'react';
import {
  useSubscriptions,
  useSubscriptionStats,
  useCancelSubscription,
} from '@/hooks/useAdmin';
import { StatsCard } from '@/components/admin';
import { Subscription } from '@/types/admin';

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSubscriptions({ page, limit: 10 });
  const { data: stats, isLoading: statsLoading } = useSubscriptionStats();
  const cancelSubscription = useCancelSubscription();

  const handleCancelSubscription = async (id: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to cancel the subscription for ${userName}?`
      )
    ) {
      try {
        await cancelSubscription.mutateAsync(id);
      } catch (error) {
        console.error('Failed to cancel subscription:', error);
      }
    }
  };

  const getStatusBadgeColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanBadgeColor = (plan: Subscription['plan']) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Subscription Management
        </h1>
        <p className="text-gray-500 mt-2">
          Monitor and manage user subscriptions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </>
        ) : stats ? (
          <>
            <StatsCard
              title="Total Subscriptions"
              value={stats.total.toLocaleString()}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              }
              description={`${stats.active} active`}
            />

            <StatsCard
              title="Monthly Recurring Revenue"
              value={`$${stats.mrr.toLocaleString()}`}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <StatsCard
              title="Trial Subscriptions"
              value={stats.trial.toLocaleString()}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              description="Active trials"
            />

            <StatsCard
              title="Churn Rate"
              value={`${stats.churnRate.toFixed(1)}%`}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              }
              description={`${stats.cancelled} cancelled`}
              trend={{
                value: stats.churnRate,
                isPositive: false,
              }}
            />
          </>
        ) : null}
      </div>

      {/* Plan Distribution */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Plan Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(stats.byPlan).map(([plan, count]) => (
              <div key={plan} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize mt-1">
                  {plan}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {((count / stats.total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.data.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.userEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanBadgeColor(
                          subscription.plan
                        )}`}
                      >
                        {subscription.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                          subscription.status
                        )}`}
                      >
                        {subscription.status}
                      </span>
                      {subscription.cancelAtPeriodEnd && (
                        <div className="text-xs text-red-600 mt-1">
                          Cancels at period end
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(
                          subscription.currentPeriodStart
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        to{' '}
                        {new Date(
                          subscription.currentPeriodEnd
                        ).toLocaleDateString()}
                      </div>
                      {subscription.trialEnd && (
                        <div className="text-xs text-blue-600 mt-1">
                          Trial ends:{' '}
                          {new Date(subscription.trialEnd).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {subscription.status === 'active' &&
                        !subscription.cancelAtPeriodEnd && (
                          <button
                            onClick={() =>
                              handleCancelSubscription(
                                subscription.id,
                                subscription.userName
                              )
                            }
                            disabled={cancelSubscription.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No subscriptions found
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * data.pagination.limit + 1} to{' '}
              {Math.min(page * data.pagination.limit, data.pagination.total)} of{' '}
              {data.pagination.total} subscriptions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, data.pagination.totalPages) },
                  (_, i) => {
                    const pageNum =
                      page <= 3
                        ? i + 1
                        : page >= data.pagination.totalPages - 2
                        ? data.pagination.totalPages - 4 + i
                        : page - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
