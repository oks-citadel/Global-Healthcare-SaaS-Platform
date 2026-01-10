/**
 * Session Timeout Provider
 * Wraps the app to track user activity and implement HIPAA-compliant session timeout
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  PanResponder,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import { useAuth } from "../hooks/useAuth";

interface SessionTimeoutContextValue {
  /**
   * Reset the inactivity timer
   */
  resetTimer: () => void;
  /**
   * Time remaining until session expires in milliseconds
   */
  timeRemaining: number;
  /**
   * Whether a timeout warning is currently active
   */
  isWarningActive: boolean;
}

const SessionTimeoutContext = createContext<
  SessionTimeoutContextValue | undefined
>(undefined);

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
  /**
   * Session timeout in minutes
   * @default 15 (HIPAA requirement)
   */
  timeoutMinutes?: number;
  /**
   * Whether to show warning before timeout
   * @default true
   */
  showWarning?: boolean;
  /**
   * Minutes before timeout to show warning
   * @default 2
   */
  warningBeforeMinutes?: number;
  /**
   * Whether session timeout is enabled
   * @default true
   */
  enabled?: boolean;
}

export const SessionTimeoutProvider: React.FC<SessionTimeoutProviderProps> = ({
  children,
  timeoutMinutes = 15,
  showWarning = true,
  warningBeforeMinutes = 2,
  enabled = true,
}) => {
  const { isAuthenticated } = useAuth();
  const lastResetRef = useRef<number>(Date.now());

  const { resetTimer, timeRemaining, isWarningActive } = useSessionTimeout({
    timeoutMs: timeoutMinutes * 60 * 1000,
    showWarning,
    warningBeforeMs: warningBeforeMinutes * 60 * 1000,
    enabled: enabled && isAuthenticated,
  });

  // Throttled reset to avoid excessive calls
  const handleActivity = useCallback(() => {
    const now = Date.now();
    // Throttle resets to once per second
    if (now - lastResetRef.current > 1000) {
      lastResetRef.current = now;
      resetTimer();
    }
  }, [resetTimer]);

  // Create a PanResponder to detect all touch events
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      // Track touches without capturing them
      onShouldBlockNativeResponder: () => false,
    }),
  ).current;

  // Handle touch start events for activity tracking
  const handleTouchStart = useCallback(
    (_event: GestureResponderEvent) => {
      if (isAuthenticated && enabled) {
        handleActivity();
      }
    },
    [isAuthenticated, enabled, handleActivity],
  );

  const contextValue: SessionTimeoutContextValue = {
    resetTimer,
    timeRemaining,
    isWarningActive,
  };

  // Only apply activity tracking when authenticated and enabled
  if (!isAuthenticated || !enabled) {
    return (
      <SessionTimeoutContext.Provider value={contextValue}>
        {children}
      </SessionTimeoutContext.Provider>
    );
  }

  return (
    <SessionTimeoutContext.Provider value={contextValue}>
      <View
        style={styles.container}
        onTouchStart={handleTouchStart}
        {...panResponder.panHandlers}
      >
        {children}
      </View>
    </SessionTimeoutContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/**
 * Hook to access session timeout context
 */
export const useSessionTimeoutContext = (): SessionTimeoutContextValue => {
  const context = useContext(SessionTimeoutContext);
  if (context === undefined) {
    throw new Error(
      "useSessionTimeoutContext must be used within a SessionTimeoutProvider",
    );
  }
  return context;
};

export default SessionTimeoutProvider;
