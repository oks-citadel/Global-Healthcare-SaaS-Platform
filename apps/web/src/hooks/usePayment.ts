import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Subscription } from '@/components/billing/SubscriptionStatus';
import type { Invoice } from '@/components/billing/InvoiceList';
import type { Plan } from '@/components/billing/PlanSelector';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
      const response = await axios.get(`${API_URL}/payments/config`);
      return response.data;
    },
    staleTime: Infinity, // Config doesn't change often
  });
};

/**
 * Hook to create a setup intent for saving payment method
 */
export const useCreateSetupIntent = () => {
  return useMutation<SetupIntentResponse, Error, Record<string, string> | undefined>({
    mutationFn: async (metadata) => {
      const response = await axios.post(
        `${API_URL}/payments/setup-intent`,
        { metadata },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      return response.data;
    },
  });
};

/**
 * Hook to create a subscription
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionResponse, Error, CreateSubscriptionData>({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${API_URL}/payments/subscription`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
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
 */
export const useSubscription = () => {
  return useQuery<SubscriptionResponse>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/payments/subscription`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    },
    retry: false, // Don't retry if no subscription found (404)
  });
};

/**
 * Hook to cancel a subscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionResponse, Error, CancelSubscriptionData>({
    mutationFn: async (data) => {
      const response = await axios.delete(`${API_URL}/payments/subscription`, {
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
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
 */
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdatePaymentMethodData>({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${API_URL}/payments/payment-method`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
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
 */
export const usePaymentMethods = () => {
  return useQuery<PaymentMethodsResponse>({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/payments/payment-methods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    },
  });
};

/**
 * Hook to remove a payment method
 */
export const useRemovePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (paymentMethodId) => {
      await axios.delete(`${API_URL}/payments/payment-method/${paymentMethodId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate payment methods query to refetch
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

/**
 * Hook to get invoices
 */
export const useInvoices = (limit: number = 10) => {
  return useQuery<InvoicesResponse>({
    queryKey: ['invoices', limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/payments/invoices`, {
        params: { limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
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
      const response = await axios.get(`${API_URL}/plans`);
      return { plans: response.data };
    },
  });
};
