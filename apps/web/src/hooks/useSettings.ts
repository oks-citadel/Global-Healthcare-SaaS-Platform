import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { getErrorMessage } from '@/lib/api';
import toast from '@/lib/toast';

// Types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
}

export interface NotificationSettings {
  appointmentReminders: boolean;
  labResults: boolean;
  messages: boolean;
  prescriptionUpdates: boolean;
  healthTips: boolean;
  marketing: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface PrivacySettings {
  shareDataWithProviders: boolean;
  allowResearch: boolean;
  showProfilePublicly: boolean;
  allowThirdPartyApps: boolean;
}

export interface AccountSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Query keys
const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  notifications: () => [...settingsKeys.all, 'notifications'] as const,
  privacy: () => [...settingsKeys.all, 'privacy'] as const,
  account: () => [...settingsKeys.all, 'account'] as const,
};

// Fetch user profile
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: settingsKeys.profile(),
    queryFn: async () => {
      const response = await apiClient.get('/users/me');
      return response.data;
    },
  });
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await apiClient.put('/users/me', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: PasswordChangeData) => {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Reset password (forgot password flow)
export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/auth/reset-password', { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset email sent. Please check your inbox.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Confirm password reset with token
export function useConfirmPasswordReset() {
  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await apiClient.post('/auth/reset-password/confirm', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully. You can now log in.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Fetch notification settings
export function useNotificationSettings() {
  return useQuery<NotificationSettings>({
    queryKey: settingsKeys.notifications(),
    queryFn: async () => {
      const response = await apiClient.get('/settings/notifications');
      return response.data;
    },
  });
}

// Update notification settings
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<NotificationSettings>) => {
      const response = await apiClient.put('/settings/notifications', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.notifications() });
      toast.success('Notification settings updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Fetch privacy settings
export function usePrivacySettings() {
  return useQuery<PrivacySettings>({
    queryKey: settingsKeys.privacy(),
    queryFn: async () => {
      const response = await apiClient.get('/settings/privacy');
      return response.data;
    },
  });
}

// Update privacy settings
export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PrivacySettings>) => {
      const response = await apiClient.put('/settings/privacy', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.privacy() });
      toast.success('Privacy settings updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Fetch account settings
export function useAccountSettings() {
  return useQuery<AccountSettings>({
    queryKey: settingsKeys.account(),
    queryFn: async () => {
      const response = await apiClient.get('/settings/account');
      return response.data;
    },
  });
}

// Update account settings
export function useUpdateAccountSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<AccountSettings>) => {
      const response = await apiClient.put('/settings/account', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.account() });
      toast.success('Account settings updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Delete account
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await apiClient.delete('/users/me', {
        data: { password },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      // Redirect will be handled by the component
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Request data export
export function useRequestDataExport() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/users/me/export');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Data export requested. You will receive an email when it is ready.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Upload avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await apiClient.post('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success('Avatar uploaded successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
