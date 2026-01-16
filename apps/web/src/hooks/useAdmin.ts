import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { getErrorMessage } from '@/lib/api';
import {
  AdminUser,
  SystemStats,
  SystemHealth,
  AuditEvent,
  AuditFilters,
  Subscription,
  SubscriptionStats,
  SystemSettings,
  PaginationParams,
  PaginatedResponse,
  UserFilters,
  UpdateUserRequest,
  UpdateSettingsRequest,
} from '@/types/admin';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  health: () => [...adminKeys.all, 'health'] as const,
  users: (filters?: UserFilters, pagination?: PaginationParams) =>
    [...adminKeys.all, 'users', filters, pagination] as const,
  user: (id: string) => [...adminKeys.all, 'user', id] as const,
  auditEvents: (filters?: AuditFilters, pagination?: PaginationParams) =>
    [...adminKeys.all, 'audit', filters, pagination] as const,
  subscriptions: (pagination?: PaginationParams) =>
    [...adminKeys.all, 'subscriptions', pagination] as const,
  subscriptionStats: () => [...adminKeys.all, 'subscription-stats'] as const,
  settings: () => [...adminKeys.all, 'settings'] as const,
};

// ============================================
// System Stats Hook
// ============================================
export function useSystemStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: async (): Promise<SystemStats> => {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// ============================================
// System Health Hook
// ============================================
export function useSystemHealth() {
  return useQuery({
    queryKey: adminKeys.health(),
    queryFn: async (): Promise<SystemHealth> => {
      const response = await apiClient.get('/admin/health');
      return response.data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

// ============================================
// Users Management Hooks
// ============================================
export function useUsers(
  filters?: UserFilters,
  pagination: PaginationParams = { page: 1, limit: 10 }
) {
  return useQuery({
    queryKey: adminKeys.users(filters, pagination),
    queryFn: async (): Promise<PaginatedResponse<AdminUser>> => {
      const params = {
        ...pagination,
        ...filters,
      };
      const response = await apiClient.get('/admin/users', { params });
      return response.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: async (): Promise<AdminUser> => {
      const response = await apiClient.get(`/admin/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserRequest;
    }): Promise<AdminUser> => {
      const response = await apiClient.patch(`/admin/users/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
    onError: (error) => {
      console.error('Update user error:', getErrorMessage(error));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
    onError: (error) => {
      console.error('Delete user error:', getErrorMessage(error));
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'active' | 'inactive' | 'suspended';
    }): Promise<AdminUser> => {
      const response = await apiClient.patch(`/admin/users/${id}/status`, {
        status,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
    onError: (error) => {
      console.error('Toggle user status error:', getErrorMessage(error));
    },
  });
}

// ============================================
// Audit Events Hooks
// ============================================
export function useAuditEvents(
  filters?: AuditFilters,
  pagination: PaginationParams = { page: 1, limit: 20 }
) {
  return useQuery({
    queryKey: adminKeys.auditEvents(filters, pagination),
    queryFn: async (): Promise<PaginatedResponse<AuditEvent>> => {
      const params = {
        ...pagination,
        ...filters,
      };
      const response = await apiClient.get('/admin/audit', { params });
      return response.data;
    },
  });
}

export function useExportAuditEvents() {
  return useMutation({
    mutationFn: async (filters?: AuditFilters): Promise<Blob> => {
      const response = await apiClient.get('/admin/audit/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },
    onError: (error) => {
      console.error('Export audit events error:', getErrorMessage(error));
    },
  });
}

// ============================================
// Subscriptions Hooks
// ============================================
export function useSubscriptions(
  pagination: PaginationParams = { page: 1, limit: 10 }
) {
  return useQuery({
    queryKey: adminKeys.subscriptions(pagination),
    queryFn: async (): Promise<PaginatedResponse<Subscription>> => {
      const response = await apiClient.get('/admin/subscriptions', {
        params: pagination,
      });
      return response.data;
    },
  });
}

export function useSubscriptionStats() {
  return useQuery({
    queryKey: adminKeys.subscriptionStats(),
    queryFn: async (): Promise<SubscriptionStats> => {
      const response = await apiClient.get('/admin/subscriptions/stats');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Subscription> => {
      const response = await apiClient.post(`/admin/subscriptions/${id}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptionStats() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
    onError: (error) => {
      console.error('Cancel subscription error:', getErrorMessage(error));
    },
  });
}

// ============================================
// Settings Hooks
// ============================================
export function useSettings() {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: async (): Promise<SystemSettings> => {
      const response = await apiClient.get('/admin/settings');
      return response.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateSettingsRequest
    ): Promise<SystemSettings> => {
      const response = await apiClient.patch('/admin/settings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
    onError: (error) => {
      console.error('Update settings error:', getErrorMessage(error));
    },
  });
}
