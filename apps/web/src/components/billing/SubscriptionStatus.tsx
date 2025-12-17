'use client';

import React from 'react';
import { Plan } from './PlanSelector';

export interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  canceledAt: number | null;
  trialStart: number | null;
  trialEnd: number | null;
  plan: Plan;
}

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  loading?: boolean;
  onCancelSubscription?: () => void;
  onResumeSubscription?: () => void;
  onUpgrade?: () => void;
  className?: string;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  subscription,
  loading = false,
  onCancelSubscription,
  onResumeSubscription,
  onUpgrade,
  className = '',
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number, currency: string, interval: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);

    return `${formattedPrice}/${interval === 'monthly' ? 'month' : 'year'}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; text: string; icon: string }
    > = {
      active: {
        color: 'bg-green-100 text-green-800',
        text: 'Active',
        icon: '✓',
      },
      trialing: {
        color: 'bg-blue-100 text-blue-800',
        text: 'Trial',
        icon: '⏱',
      },
      past_due: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Past Due',
        icon: '⚠',
      },
      canceled: {
        color: 'bg-red-100 text-red-800',
        text: 'Canceled',
        icon: '✕',
      },
      incomplete: {
        color: 'bg-gray-100 text-gray-800',
        text: 'Incomplete',
        icon: '○',
      },
      incomplete_expired: {
        color: 'bg-gray-100 text-gray-800',
        text: 'Expired',
        icon: '○',
      },
      unpaid: {
        color: 'bg-red-100 text-red-800',
        text: 'Unpaid',
        icon: '!',
      },
    };

    const config = statusConfig[status] || statusConfig.incomplete;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const isInTrial = () => {
    if (!subscription || !subscription.trialEnd) return false;
    const now = Math.floor(Date.now() / 1000);
    return now < subscription.trialEnd;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="p-6">
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No active subscription
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by selecting a plan below.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Current Subscription
            </h3>
          </div>
          <div>{getStatusBadge(subscription.status)}</div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                {subscription.plan.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {subscription.plan.description}
              </p>
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(
                  subscription.plan.price,
                  subscription.plan.currency,
                  subscription.plan.interval
                )}
              </span>
            </div>

            {isInTrial() && subscription.trialEnd && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Trial Period:</strong> Your trial ends on{' '}
                  {formatDate(subscription.trialEnd)}. You won't be charged until
                  then.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Period</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(subscription.currentPeriodStart)} -{' '}
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div>
                  <p className="text-sm text-gray-500">Cancels On</p>
                  <p className="text-sm font-medium text-red-600">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              )}
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  Your subscription will be canceled at the end of the current
                  billing period. You'll continue to have access until{' '}
                  {formatDate(subscription.currentPeriodEnd)}.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-900 mb-2">
                Plan Features
              </h5>
              <ul className="space-y-2">
                {subscription.plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {subscription.cancelAtPeriodEnd ? (
              <button
                onClick={onResumeSubscription}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Resume Subscription
              </button>
            ) : (
              <>
                {onUpgrade && (
                  <button
                    onClick={onUpgrade}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                )}
                {onCancelSubscription && (
                  <button
                    onClick={onCancelSubscription}
                    className="flex-1 px-4 py-2 bg-white text-red-600 font-medium rounded-md border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
