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
      // Offline service initialized
    });

    // Initialize socket when authenticated
    if (isAuthenticated) {
      socketService
        .initialize()
        .then(() => {
          setInitialized(true);
        })
        .catch((_error) => {
          // Socket initialization failed
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
