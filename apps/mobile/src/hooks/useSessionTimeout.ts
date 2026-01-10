/**
 * Session Timeout Hook
 * Implements HIPAA-compliant session timeout (15 minutes of inactivity)
 * Automatically logs out user after inactivity period
 */

import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus, Alert } from "react-native";
import { useAuth } from "./useAuth";

// HIPAA requires automatic logout after inactivity
// 15 minutes is the recommended maximum timeout
const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes warning before timeout

interface UseSessionTimeoutOptions {
  /**
   * Timeout duration in milliseconds
   * @default 900000 (15 minutes)
   */
  timeoutMs?: number;
  /**
   * Whether to show a warning before timeout
   * @default true
   */
  showWarning?: boolean;
  /**
   * Time before timeout to show warning in milliseconds
   * @default 120000 (2 minutes)
   */
  warningBeforeMs?: number;
  /**
   * Callback when session times out
   */
  onTimeout?: () => void;
  /**
   * Callback when warning is shown
   */
  onWarning?: () => void;
  /**
   * Whether session timeout is enabled
   * @default true
   */
  enabled?: boolean;
}

interface UseSessionTimeoutReturn {
  /**
   * Reset the inactivity timer (call on user interaction)
   */
  resetTimer: () => void;
  /**
   * Time remaining until timeout in milliseconds
   */
  timeRemaining: number;
  /**
   * Whether a timeout warning is active
   */
  isWarningActive: boolean;
}

export const useSessionTimeout = (
  options: UseSessionTimeoutOptions = {},
): UseSessionTimeoutReturn => {
  const {
    timeoutMs = SESSION_TIMEOUT_MS,
    showWarning = true,
    warningBeforeMs = WARNING_BEFORE_TIMEOUT_MS,
    onTimeout,
    onWarning,
    enabled = true,
  } = options;

  const { isAuthenticated, logout } = useAuth();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isWarningActiveRef = useRef<boolean>(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    isWarningActiveRef.current = false;
  }, []);

  // Handle session timeout
  const handleTimeout = useCallback(async () => {
    clearTimers();

    if (onTimeout) {
      onTimeout();
    }

    // Show timeout alert
    Alert.alert(
      "Session Expired",
      "Your session has expired due to inactivity. Please log in again to continue.",
      [
        {
          text: "OK",
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: false },
    );
  }, [clearTimers, logout, onTimeout]);

  // Show warning before timeout
  const handleWarning = useCallback(() => {
    isWarningActiveRef.current = true;

    if (onWarning) {
      onWarning();
    }

    if (showWarning) {
      Alert.alert(
        "Session Expiring Soon",
        "Your session will expire in 2 minutes due to inactivity. Tap anywhere to stay logged in.",
        [
          {
            text: "Stay Logged In",
            onPress: () => {
              resetTimer();
            },
          },
        ],
        { cancelable: true },
      );
    }
  }, [onWarning, showWarning]);

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    clearTimers();
    lastActivityRef.current = Date.now();

    // Set warning timeout
    if (showWarning && warningBeforeMs > 0 && warningBeforeMs < timeoutMs) {
      warningTimeoutRef.current = setTimeout(() => {
        handleWarning();
      }, timeoutMs - warningBeforeMs);
    }

    // Set session timeout
    timeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, timeoutMs);
  }, [
    enabled,
    isAuthenticated,
    clearTimers,
    showWarning,
    warningBeforeMs,
    timeoutMs,
    handleWarning,
    handleTimeout,
  ]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (!enabled || !isAuthenticated) {
        return;
      }

      // App came to foreground
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;

        // Check if session should have expired while in background
        if (timeSinceLastActivity >= timeoutMs) {
          handleTimeout();
        } else {
          // Reset timer with remaining time
          clearTimers();

          const remainingTime = timeoutMs - timeSinceLastActivity;
          const warningTime = remainingTime - warningBeforeMs;

          if (showWarning && warningTime > 0) {
            warningTimeoutRef.current = setTimeout(() => {
              handleWarning();
            }, warningTime);
          } else if (showWarning && warningTime <= 0 && remainingTime > 0) {
            // Already in warning period
            handleWarning();
          }

          timeoutRef.current = setTimeout(() => {
            handleTimeout();
          }, remainingTime);
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [
    enabled,
    isAuthenticated,
    timeoutMs,
    warningBeforeMs,
    showWarning,
    clearTimers,
    handleTimeout,
    handleWarning,
  ]);

  // Initialize timer when authenticated
  useEffect(() => {
    if (enabled && isAuthenticated) {
      resetTimer();
    } else {
      clearTimers();
    }

    return () => {
      clearTimers();
    };
  }, [enabled, isAuthenticated, resetTimer, clearTimers]);

  // Calculate time remaining
  const getTimeRemaining = useCallback((): number => {
    if (!enabled || !isAuthenticated) {
      return timeoutMs;
    }
    const elapsed = Date.now() - lastActivityRef.current;
    return Math.max(0, timeoutMs - elapsed);
  }, [enabled, isAuthenticated, timeoutMs]);

  return {
    resetTimer,
    timeRemaining: getTimeRemaining(),
    isWarningActive: isWarningActiveRef.current,
  };
};

export default useSessionTimeout;
