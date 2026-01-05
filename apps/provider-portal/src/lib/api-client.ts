import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Provider Portal API Client
 * SECURITY: Uses httpOnly cookies for token storage (XSS-safe)
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      withCredentials: true, // SECURITY: Required for httpOnly cookies
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    /**
     * Request interceptor
     * SECURITY: With httpOnly cookies, no Authorization header is needed
     * The browser automatically includes cookies with withCredentials: true
     */
    this.client.interceptors.request.use(
      (config) => {
        // No need to set Authorization header - cookies are sent automatically
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    /**
     * Response interceptor
     * SECURITY: Uses httpOnly cookie-based refresh (server manages tokens)
     */
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh using httpOnly cookie
          try {
            await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });

            // Retry the original request with new cookie (automatically included)
            if (error.config) {
              return this.client.request(error.config);
            }
          } catch {
            // Refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * @deprecated Tokens are now managed via httpOnly cookies
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setToken(token: string): void {
    // SECURITY: Tokens are set as httpOnly cookies by the server
  }

  /**
   * @deprecated Tokens are now managed via httpOnly cookies
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRefreshToken(refreshToken: string): void {
    // SECURITY: Tokens are set as httpOnly cookies by the server
  }

  /**
   * Clear tokens by calling the logout endpoint
   */
  async clearTokens(): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch {
      // If logout fails, cookies will expire naturally
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
