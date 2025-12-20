import { create } from 'zustand';
import { Provider } from '@/types';

interface AuthState {
  provider: Provider | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setProvider: (provider: Provider | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  provider: null,
  isAuthenticated: false,
  isLoading: true,
  setProvider: (provider) => set({ provider }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ provider: null, isAuthenticated: false }),
}));
