import { apiClient } from '../api-client';
import { AuthResponse, LoginCredentials, Provider } from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/provider/login', credentials);
    apiClient.setToken(response.token);
    apiClient.setRefreshToken(response.refreshToken);
    return response;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    apiClient.clearTokens();
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  },

  getCurrentProvider: async (): Promise<Provider> => {
    return apiClient.get<Provider>('/auth/me');
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },

  forgotPassword: async (email: string): Promise<void> => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },
};
