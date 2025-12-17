import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AuthTokens } from '../types';

const API_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.unifiedhealth.com/api';

const TOKEN_KEY = 'auth_tokens';

// Secure token storage utilities
export const tokenStorage = {
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokens = await SecureStore.getItemAsync(TOKEN_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  },

  async setTokens(tokens: AuthTokens): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Error setting tokens:', error);
    }
  },

  async removeTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing tokens:', error);
    }
  },
};

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const tokens = await tokenStorage.getTokens();

        if (tokens?.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet, attempt to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, wait for the new token
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const tokens = await tokenStorage.getTokens();

            if (!tokens?.refreshToken) {
              throw new Error('No refresh token available');
            }

            // Attempt to refresh the token
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken: tokens.refreshToken,
            });

            const newTokens: AuthTokens = response.data;
            await tokenStorage.setTokens(newTokens);

            // Update the authorization header
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            }

            // Notify all subscribers of the new token
            this.refreshSubscribers.forEach((callback) =>
              callback(newTokens.accessToken)
            );
            this.refreshSubscribers = [];

            return this.client(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear tokens and redirect to login
            await tokenStorage.removeTokens();
            // Note: Navigation to login will be handled by auth state change
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Expose axios methods
  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Get the raw axios instance if needed
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
