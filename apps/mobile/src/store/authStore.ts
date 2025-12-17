import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import apiClient, { tokenStorage } from '../api/client';
import {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types';

// Custom storage implementation using expo-secure-store
const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error) {
      console.error('Error getting item from secure store:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error setting item in secure store:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing item from secure store:', error);
    }
  },
};

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post<AuthResponse>(
            '/auth/login',
            credentials
          );

          // Store tokens in secure storage
          await tokenStorage.setTokens(response.tokens);

          set({
            user: response.user,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Login failed. Please try again.';

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });

          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post<AuthResponse>(
            '/auth/register',
            data
          );

          // Store tokens in secure storage
          await tokenStorage.setTokens(response.tokens);

          set({
            user: response.user,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Registration failed. Please try again.';

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });

          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          // Call logout endpoint (optional - for server-side token invalidation)
          try {
            await apiClient.post('/auth/logout');
          } catch (error) {
            // Ignore logout endpoint errors
            console.warn('Logout endpoint error:', error);
          }

          // Clear tokens from secure storage
          await tokenStorage.removeTokens();

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear local state even if API call fails
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshUser: async () => {
        try {
          const { isAuthenticated } = get();

          if (!isAuthenticated) {
            return;
          }

          const user = await apiClient.get<User>('/auth/me');
          set({ user });
        } catch (error) {
          console.error('Error refreshing user:', error);
          // If we can't refresh user, they might be logged out
          await get().logout();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Check if we have stored tokens
          const tokens = await tokenStorage.getTokens();

          if (tokens) {
            // Try to get user data
            try {
              const user = await apiClient.get<User>('/auth/me');

              set({
                user,
                tokens,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (error) {
              // If getting user fails, tokens are invalid
              await tokenStorage.removeTokens();
              set({
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Initialization error:', error);
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
