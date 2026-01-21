/**
 * API Test Client - Provides a typed HTTP client for API testing
 */

import { testUsers } from '../data/test-fixtures';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3001/api/v1';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: Headers;
  ok: boolean;
}

// Token cache for authenticated requests
const tokenCache: Map<string, { token: string; expiresAt: number }> = new Map();

/**
 * Makes an HTTP request to the API
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, token } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  let data: T;
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    data = await response.json() as T;
  } else {
    data = await response.text() as unknown as T;
  }

  return {
    status: response.status,
    statusText: response.statusText,
    data,
    headers: response.headers,
    ok: response.ok,
  };
}

/**
 * Login and get a JWT token
 */
export async function login(email: string, password: string): Promise<string> {
  const cacheKey = email;
  const cached = tokenCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.token;
  }

  const response = await apiRequest<{ accessToken: string; expiresIn: number }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (!response.ok) {
    throw new Error(`Login failed for ${email}: ${response.status} ${JSON.stringify(response.data)}`);
  }

  const token = response.data.accessToken;
  const expiresIn = response.data.expiresIn || 3600;

  tokenCache.set(cacheKey, {
    token,
    expiresAt: Date.now() + (expiresIn - 60) * 1000, // Expire 1 minute early
  });

  return token;
}

/**
 * Get token for a test user role
 */
export async function getTokenForRole(role: 'patient' | 'provider' | 'admin' | 'superAdmin'): Promise<string> {
  const user = testUsers[role];
  return login(user.email, user.password);
}

/**
 * Make an authenticated request as a specific role
 */
export async function authenticatedRequest<T = any>(
  endpoint: string,
  role: 'patient' | 'provider' | 'admin' | 'superAdmin',
  options: Omit<RequestOptions, 'token'> = {}
): Promise<ApiResponse<T>> {
  const token = await getTokenForRole(role);
  return apiRequest<T>(endpoint, { ...options, token });
}

/**
 * Clear the token cache
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}

// Pre-built request methods for convenience
export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Authenticated request methods
export const authApi = {
  asPatient: {
    get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'patient', { ...options, method: 'GET' }),
    post: <T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'patient', { ...options, method: 'POST', body }),
    patch: <T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'patient', { ...options, method: 'PATCH', body }),
    delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'patient', { ...options, method: 'DELETE' }),
  },
  asProvider: {
    get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'provider', { ...options, method: 'GET' }),
    post: <T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'provider', { ...options, method: 'POST', body }),
    patch: <T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'provider', { ...options, method: 'PATCH', body }),
    delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'provider', { ...options, method: 'DELETE' }),
  },
  asAdmin: {
    get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'admin', { ...options, method: 'GET' }),
    post: <T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'admin', { ...options, method: 'POST', body }),
    patch: <T = any>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'admin', { ...options, method: 'PATCH', body }),
    delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'token'>) =>
      authenticatedRequest<T>(endpoint, 'admin', { ...options, method: 'DELETE' }),
  },
};
