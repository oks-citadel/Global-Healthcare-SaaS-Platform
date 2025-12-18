import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { socketService } from '../services/socket';
import { offlineService } from '../services/offline';
import { useAuthStore } from '../store/authStore';

interface SocketContextValue {
  initialized: boolean;
}

const SocketContext = createContext<SocketContextValue>({ initialized: false });

export const useSocketContext = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

/**
 * Socket Provider
 * Initializes Socket.io and Offline services at app startup
 * Should be placed near the root of the app
 */
export function SocketProvider({ children }: SocketProviderProps) {
  const { isAuthenticated } = useAuthStore();
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    // Initialize offline service
    offlineService.initialize().then(() => {
      console.log('[SocketProvider] Offline service initialized');
    });

    // Initialize socket when authenticated
    if (isAuthenticated) {
      socketService
        .initialize()
        .then(() => {
          console.log('[SocketProvider] Socket service initialized');
          setInitialized(true);
        })
        .catch((error) => {
          console.error('[SocketProvider] Socket initialization error:', error);
        });
    } else {
      socketService.disconnect();
      setInitialized(false);
    }

    // Cleanup on unmount
    return () => {
      // Note: We don't destroy services here as they might be needed
      // Services are singletons and manage their own lifecycle
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ initialized }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
