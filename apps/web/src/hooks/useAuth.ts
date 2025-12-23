import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import apiClient, { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '@/types/auth';

// Auth API functions
const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};

// Login hook
export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.tokens);
      router.push('/');
    },
    onError: (error) => {
      console.error('Login error:', getErrorMessage(error));
    },
  });
};

// Register hook
export const useRegister = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.tokens);
      router.push('/');
    },
    onError: (error) => {
      console.error('Registration error:', getErrorMessage(error));
    },
  });
};

// Logout hook
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout error:', getErrorMessage(error));
      // Even if API call fails, clear local state
      logoutStore();
      queryClient.clear();
      router.push('/login');
    },
  });
};

// Current user hook
export const useCurrentUser = () => {
  const { user, setUser, isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  // Handle success/error with useEffect since onSuccess/onError are removed in React Query v5
  useEffect(() => {
    if (query.data && !user) {
      setUser(query.data);
    }
  }, [query.data, user, setUser]);

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch current user:', getErrorMessage(query.error));
      setUser(null);
    }
  }, [query.error, setUser]);

  return query;
};

// Hook to check if user is authenticated
export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
