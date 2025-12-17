import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens, RefreshTokenResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Token storage utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },

  setTokens: (tokens: AuthTokens): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token available, redirect to login
        tokenStorage.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        tokenStorage.setTokens({
          accessToken,
          refreshToken: newRefreshToken,
        });

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenStorage.clearTokens();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function for handling API errors
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error;
    if (message) return message;

    if (error.response?.status === 404) return 'Resource not found';
    if (error.response?.status === 500) return 'Server error. Please try again later';
    if (error.response?.status === 403) return 'Access forbidden';
    if (error.message === 'Network Error') return 'Network error. Please check your connection';
  }

  return 'An unexpected error occurred';
};
