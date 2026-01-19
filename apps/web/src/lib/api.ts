import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens, RefreshTokenResponse } from '@/types/auth';

// API service runs on port 8080 by default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Create axios instance with credentials: 'include' for httpOnly cookie support
 * SECURITY: Tokens are stored as httpOnly cookies by the server, preventing XSS attacks
 * The browser automatically sends cookies with each request when withCredentials: true
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true, // SECURITY: Required for httpOnly cookies
});

/**
 * Token storage utilities
 * SECURITY: Tokens are now stored as httpOnly cookies by the server
 * These methods are kept for backward compatibility but localStorage storage is removed
 */
export const tokenStorage = {
  /**
   * @deprecated Access tokens are now managed via httpOnly cookies
   * This method is kept for backward compatibility during migration
   */
  getAccessToken: (): string | null => {
    // Tokens are now httpOnly cookies - not accessible from JavaScript (by design for security)
    // Return null as the token will be sent automatically via cookies
    return null;
  },

  /**
   * @deprecated Refresh tokens are now managed via httpOnly cookies
   */
  getRefreshToken: (): string | null => {
    // Tokens are now httpOnly cookies - not accessible from JavaScript (by design for security)
    return null;
  },

  /**
   * @deprecated Tokens are now set as httpOnly cookies by the server
   * This method is kept for backward compatibility but does nothing
   */
  setTokens: (_tokens: AuthTokens): void => {
    // SECURITY: Tokens are set as httpOnly cookies by the server
    // No client-side storage needed - this prevents XSS attacks from stealing tokens
  },

  /**
   * Clear tokens by calling the logout endpoint
   * The server will clear the httpOnly cookies
   */
  clearTokens: async (): Promise<void> => {
    try {
      // Call logout endpoint to clear httpOnly cookies on server
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch {
      // If logout fails, cookies will expire naturally
    }
  },

  /**
   * Check if user appears to be authenticated
   * Since we can't read httpOnly cookies, we make a request to check
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      await apiClient.get('/auth/me');
      return true;
    } catch {
      return false;
    }
  },
};

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

/**
 * Request interceptor
 * SECURITY: With httpOnly cookies, no Authorization header is needed
 * The browser automatically includes cookies with withCredentials: true
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No need to set Authorization header - cookies are sent automatically
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle token refresh
 * SECURITY: Uses httpOnly cookie-based refresh (server manages tokens)
 */
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
          .then(() => {
            // Retry with new cookie (automatically included)
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using httpOnly cookie
        // Server reads refresh token from cookie and sets new tokens as cookies
        await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);

        // Retry original request with new cookies (automatically included)
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);

        // Redirect to login on refresh failure
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
