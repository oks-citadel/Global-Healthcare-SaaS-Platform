'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '@/components/billing/PaymentForm';
import { PlanSelector } from '@/components/billing/PlanSelector';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { SubscriptionStatus } from '@/components/billing/SubscriptionStatus';
import {
  useStripeConfig,
  useCreateSetupIntent,
  useCreateSubscription,
  useSubscription,
  useCancelSubscription,
  useUpdatePaymentMethod,
  usePaymentMethods,
  useInvoices,
  usePlans,
} from '@/hooks/usePayment';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'payment' | 'invoices'>('subscription');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [stripePromise, setStripePromise] = useState<any>(null);

  // Fetch Stripe config and initialize
  const { data: config } = useStripeConfig();
  const { data: subscriptionData, isLoading: loadingSubscription } = useSubscription();
  const { data: plansData, isLoading: loadingPlans } = usePlans();
  const { data: invoicesData, isLoading: loadingInvoices } = useInvoices();
  const { data: paymentMethodsData } = usePaymentMethods();

  const createSetupIntent = useCreateSetupIntent();
  const createSubscription = useCreateSubscription();
  const cancelSubscription = useCancelSubscription();
  const updatePaymentMethod = useUpdatePaymentMethod();

  // Initialize Stripe
  React.useEffect(() => {
    if (config?.publishableKey && !stripePromise) {
      setStripePromise(loadStripe(config.publishableKey));
    }
  }, [config, stripePromise]);

  const handleSelectPlan = async (planId: string) => {
    try {
      // Check if user has a payment method
      if (!paymentMethodsData?.paymentMethods?.length) {
        alert('Please add a payment method first');
        setShowPaymentForm(true);
        setActiveTab('payment');
        return;
      }

      const paymentMethodId = paymentMethodsData.paymentMethods[0].id;

      // Create subscription
      await createSubscription.mutateAsync({
        priceId: planId,
        paymentMethodId,
      });

      alert('Subscription created successfully!');
      setShowPlanSelector(false);
    } catch (error: any) {
      alert(`Failed to create subscription: ${error.message}`);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionData?.subscription?.id) return;

    const confirm = window.confirm(
      'Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.'
    );

    if (!confirm) return;

    try {
      await cancelSubscription.mutateAsync({
        subscriptionId: subscriptionData.subscription.id,
        cancelAtPeriodEnd: true,
      });

      alert('Subscription will be canceled at the end of the billing period.');
    } catch (error: any) {
      alert(`Failed to cancel subscription: ${error.message}`);
    }
  };

  const handleResumeSubscription = async () => {
    if (!subscriptionData?.subscription?.id) return;

    try {
      // To resume, we need to update the subscription to not cancel at period end
      // This would require an additional API endpoint
      alert('Resume subscription functionality requires an additional API endpoint.');
    } catch (error: any) {
      alert(`Failed to resume subscription: ${error.message}`);
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    try {
      await updatePaymentMethod.mutateAsync({
        paymentMethodId,
        setAsDefault: true,
      });

      alert('Payment method added successfully!');
      setShowPaymentForm(false);
    } catch (error: any) {
      alert(`Failed to add payment method: ${error.message}`);
    }
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="mt-2 text-gray-600">
            Manage your subscription, payment methods, and billing history.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('subscription')}
                className={`${
                  activeTab === 'subscription'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Subscription
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`${
                  activeTab === 'payment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`${
                  activeTab === 'invoices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Invoices
              </button>
            </nav>
          </div>
        </div>

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <SubscriptionStatus
              subscription={subscriptionData?.subscription || null}
              loading={loadingSubscription}
              onCancelSubscription={handleCancelSubscription}
              onResumeSubscription={handleResumeSubscription}
              onUpgrade={() => setShowPlanSelector(!showPlanSelector)}
            />

            {showPlanSelector && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {subscriptionData?.subscription ? 'Change Plan' : 'Select a Plan'}
                </h2>
                <PlanSelector
                  plans={plansData?.plans || []}
                  currentPlanId={subscriptionData?.subscription?.plan?.id}
                  onSelectPlan={handleSelectPlan}
                  loading={loadingPlans || createSubscription.isPending}
                />
              </div>
            )}

            {!subscriptionData?.subscription && !showPlanSelector && (
              <div className="text-center">
                <button
                  onClick={() => setShowPlanSelector(true)}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Methods
                </h2>
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showPaymentForm ? 'Cancel' : 'Add Payment Method'}
                </button>
              </div>

              {showPaymentForm ? (
                stripePromise ? (
                  <div className="max-w-md">
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        buttonText="Save Payment Method"
                      />
                    </Elements>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600">Loading payment form...</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  {paymentMethodsData?.paymentMethods?.length ? (
                    paymentMethodsData.paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="mr-4">
                            <svg
                              className="h-8 w-8 text-gray-400"
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
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {method.card?.brand.toUpperCase()} ending in{' '}
                              {method.card?.last4}
                            </p>
                            <p className="text-sm text-gray-600">
                              Expires {method.card?.expMonth}/{method.card?.expYear}
                            </p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No payment methods saved.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div>
            <InvoiceList
              invoices={invoicesData?.invoices || []}
              loading={loadingInvoices}
            />
          </div>
        )}
      </div>
    </div>
  );
}
