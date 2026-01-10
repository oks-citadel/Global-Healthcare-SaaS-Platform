/**
 * Billing & Payment Hooks
 * Manages subscriptions, payments, and invoices
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import {
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  Invoice,
  PaginatedResponse,
} from '../types';

// ===== Subscription Management =====

// Fetch current subscription
export const useSubscription = () => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiClient.get<Subscription>('/billing/subscription');
      return response;
    },
  });
};

// Fetch available plans
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await apiClient.get<SubscriptionPlan[]>('/billing/plans');
      return response;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - plans rarely change
  });
};

// Subscribe to a plan
export const useSubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      paymentMethodId,
    }: {
      planId: string;
      paymentMethodId: string;
    }) => {
      const response = await apiClient.post<Subscription>('/billing/subscribe', {
        planId,
        paymentMethodId,
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['subscription'], data);
    },
  });
};

// Change subscription plan
export const useChangePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiClient.patch<Subscription>(
        '/billing/subscription/plan',
        { planId }
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['subscription'], data);
    },
  });
};

// Cancel subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cancelAtPeriodEnd = true) => {
      const response = await apiClient.post<Subscription>(
        '/billing/subscription/cancel',
        { cancelAtPeriodEnd }
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['subscription'], data);
    },
  });
};

// Resume cancelled subscription
export const useResumeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<Subscription>(
        '/billing/subscription/resume'
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['subscription'], data);
    },
  });
};

// ===== Payment Methods =====

// Fetch payment methods
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await apiClient.get<PaymentMethod[]>(
        '/billing/payment-methods'
      );
      return response;
    },
  });
};

// Add payment method
export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodToken: string) => {
      const response = await apiClient.post<PaymentMethod>(
        '/billing/payment-methods',
        { token: paymentMethodToken }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

// Remove payment method
export const useRemovePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      await apiClient.delete(`/billing/payment-methods/${paymentMethodId}`);
      return paymentMethodId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

// Set default payment method
export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const response = await apiClient.patch<PaymentMethod>(
        `/billing/payment-methods/${paymentMethodId}/default`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

// ===== Invoices =====

// Fetch invoices
export const useInvoices = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['invoices', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Invoice>>(
        `/billing/invoices?page=${page}&limit=${limit}`
      );
      return response;
    },
  });
};

// Fetch single invoice
export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const response = await apiClient.get<Invoice>(`/billing/invoices/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

// Download invoice PDF
export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await apiClient.get<{ downloadUrl: string }>(
        `/billing/invoices/${invoiceId}/download`
      );
      return response;
    },
  });
};

// Pay outstanding invoice
export const usePayInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      paymentMethodId,
    }: {
      invoiceId: string;
      paymentMethodId?: string;
    }) => {
      const response = await apiClient.post<Invoice>(
        `/billing/invoices/${invoiceId}/pay`,
        { paymentMethodId }
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.setQueryData(['invoice', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};

// ===== Billing Portal =====

// Get Stripe billing portal URL
export const useBillingPortal = () => {
  return useMutation({
    mutationFn: async (returnUrl?: string) => {
      const response = await apiClient.post<{ url: string }>(
        '/billing/portal',
        { returnUrl }
      );
      return response;
    },
  });
};

// Get payment setup intent
export const useSetupIntent = () => {
  return useQuery({
    queryKey: ['setup-intent'],
    queryFn: async () => {
      const response = await apiClient.post<{ clientSecret: string }>(
        '/billing/setup-intent'
      );
      return response;
    },
    enabled: false, // Only fetch when explicitly requested
  });
};

// ===== Usage & Costs =====

// Fetch usage summary
export const useUsageSummary = () => {
  return useQuery({
    queryKey: ['usage-summary'],
    queryFn: async () => {
      const response = await apiClient.get<{
        currentPeriod: {
          appointmentsUsed: number;
          appointmentsLimit: number;
          messagesUsed: number;
          messagesLimit: number;
          storageUsedMB: number;
          storageLimitMB: number;
        };
        nextBillingDate: string;
        estimatedCost: number;
      }>('/billing/usage');
      return response;
    },
  });
};

// Fetch billing history
export const useBillingHistory = () => {
  return useQuery({
    queryKey: ['billing-history'],
    queryFn: async () => {
      const response = await apiClient.get<Array<{
        id: string;
        date: string;
        description: string;
        amount: number;
        status: 'paid' | 'pending' | 'failed';
      }>>('/billing/history');
      return response;
    },
  });
};
