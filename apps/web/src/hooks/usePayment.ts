import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Subscription } from '@/components/billing/SubscriptionStatus';
import type { Invoice } from '@/components/billing/InvoiceList';
import type { Plan } from '@/components/billing/PlanSelector';

// API service runs on port 8080 by default (consistent with src/lib/api.ts)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Create axios instance with httpOnly cookie support
 * SECURITY: Tokens are managed via httpOnly cookies (XSS-safe)
 */
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // SECURITY: Required for httpOnly cookies
});

interface CreateSubscriptionData {
  priceId: string;
  paymentMethodId?: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

interface CancelSubscriptionData {
  subscriptionId: string;
  cancelAtPeriodEnd?: boolean;
  reason?: string;
}

interface UpdatePaymentMethodData {
  paymentMethodId: string;
  setAsDefault?: boolean;
}

interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
}

interface SubscriptionResponse {
  subscription: Subscription;
  clientSecret?: string | null;
}

interface PaymentMethodsResponse {
  paymentMethods: Array<{
    id: string;
    type: string;
    card: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    } | null;
    created: number;
  }>;
}

interface InvoicesResponse {
  invoices: Invoice[];
}

interface ConfigResponse {
  publishableKey: string;
}

/**
 * Hook to get Stripe configuration
 */
export const useStripeConfig = () => {
  return useQuery<ConfigResponse>({
    queryKey: ['stripe-config'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/config');
      return response.data;
    },
    staleTime: Infinity, // Config doesn't change often
  });
};

/**
 * Hook to create a setup intent for saving payment method
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const useCreateSetupIntent = () => {
  return useMutation<SetupIntentResponse, Error, Record<string, string> | undefined>({
    mutationFn: async (metadata) => {
      const response = await apiClient.post('/payments/setup-intent', { metadata });
      return response.data;
    },
  });
};

/**
 * Hook to create a subscription
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionResponse, Error, CreateSubscriptionData>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/payments/subscription', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};

/**
 * Hook to get current subscription
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const useSubscription = () => {
  return useQuery<SubscriptionResponse>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/subscription');
      return response.data;
    },
    retry: false, // Don't retry if no subscription found (404)
  });
};

/**
 * Hook to cancel a subscription
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionResponse, Error, CancelSubscriptionData>({
    mutationFn: async (data) => {
      const response = await apiClient.delete('/payments/subscription', { data });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};

/**
 * Hook to update payment method
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdatePaymentMethodData>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/payments/payment-method', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate payment methods query to refetch
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

/**
 * Hook to get payment methods
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const usePaymentMethods = () => {
  return useQuery<PaymentMethodsResponse>({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/payment-methods');
      return response.data;
    },
  });
};

/**
 * Hook to remove a payment method
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const useRemovePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (paymentMethodId) => {
      await apiClient.delete(`/payments/payment-method/${paymentMethodId}`);
    },
    onSuccess: () => {
      // Invalidate payment methods query to refetch
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

/**
 * Hook to get invoices
 * SECURITY: Auth via httpOnly cookies (no localStorage)
 */
export const useInvoices = (limit: number = 10) => {
  return useQuery<InvoicesResponse>({
    queryKey: ['invoices', limit],
    queryFn: async () => {
      const response = await apiClient.get('/payments/invoices', {
        params: { limit },
      });
      return response.data;
    },
  });
};

/**
 * Hook to get available plans
 */
export const usePlans = () => {
  return useQuery<{ plans: Plan[] }>({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await apiClient.get('/plans');
      return { plans: response.data };
    },
  });
};
