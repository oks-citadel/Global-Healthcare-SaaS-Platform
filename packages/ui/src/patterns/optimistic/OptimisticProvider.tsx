/**
 * OptimisticProvider
 *
 * A React context provider for managing global optimistic UI state.
 * Handles rollback toast queue, tracks pending mutations, and provides
 * undo capability across components.
 *
 * @example
 * ```tsx
 * // Wrap your app with the provider
 * function App() {
 *   return (
 *     <OptimisticProvider
 *       toastPosition="bottom-right"
 *       defaultUndoTimeout={5000}
 *     >
 *       <YourApp />
 *     </OptimisticProvider>
 *   );
 * }
 *
 * // Access the context in child components
 * function ChildComponent() {
 *   const { pendingMutations, showUndoToast } = useOptimisticContext();
 *   // ...
 * }
 * ```
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import { RollbackToast, type RollbackToastProps } from './RollbackToast';

/**
 * Represents a pending optimistic mutation
 */
export interface PendingMutation {
  /** Unique identifier for the mutation */
  id: string;
  /** Human-readable label for the action */
  actionLabel: string;
  /** Timestamp when the mutation started */
  timestamp: number;
  /** Function to undo the mutation */
  undo: () => void;
  /** Time in ms before undo expires */
  undoTimeout: number;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Options for showing an undo toast
 */
export interface UndoToastOptions {
  /** Unique identifier for the toast */
  id: string;
  /** Human-readable label for the action */
  actionLabel: string;
  /** Function to call when undo is clicked */
  onUndo: () => void;
  /** Duration in ms before auto-dismiss */
  duration: number;
  /** Optional custom message */
  message?: string;
  /** Optional icon */
  icon?: ReactNode;
}

/**
 * Internal toast state
 */
interface ToastState extends UndoToastOptions {
  /** When the toast was created */
  createdAt: number;
  /** Whether the toast is being dismissed */
  isDismissing: boolean;
}

/**
 * The context value provided by OptimisticProvider
 */
export interface OptimisticContextValue {
  /** Map of all pending mutations by ID */
  pendingMutations: Map<string, PendingMutation>;
  /** Add a new pending mutation */
  addPendingMutation: (mutation: PendingMutation) => void;
  /** Remove a pending mutation by ID */
  removePendingMutation: (id: string) => void;
  /** Show an undo toast notification */
  showUndoToast: (options: UndoToastOptions) => void;
  /** Dismiss a specific toast */
  dismissToast: (id: string) => void;
  /** Dismiss all toasts */
  dismissAllToasts: () => void;
  /** Undo all pending mutations */
  undoAll: () => void;
  /** Check if there are any pending mutations */
  hasPendingMutations: boolean;
  /** Total count of pending mutations */
  pendingCount: number;
}

/**
 * Position options for toast display
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Props for the OptimisticProvider component
 */
export interface OptimisticProviderProps {
  /** Child components */
  children: ReactNode;
  /** Position of undo toasts */
  toastPosition?: ToastPosition;
  /** Default timeout for undo in milliseconds */
  defaultUndoTimeout?: number;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Gap between stacked toasts in pixels */
  toastGap?: number;
  /** Custom toast renderer */
  renderToast?: (props: RollbackToastProps & { onDismiss: () => void }) => ReactNode;
  /** Container element for toasts (defaults to body) */
  toastContainer?: HTMLElement | null;
}

const OptimisticContext = createContext<OptimisticContextValue | null>(null);

/**
 * Hook to access the optimistic context
 * @returns The optimistic context value, or null if not within a provider
 */
export function useOptimisticContext(): OptimisticContextValue | null {
  return useContext(OptimisticContext);
}

/**
 * Hook that requires optimistic context (throws if not within provider)
 * @returns The optimistic context value
 * @throws Error if used outside of OptimisticProvider
 */
export function useRequiredOptimisticContext(): OptimisticContextValue {
  const context = useContext(OptimisticContext);
  if (!context) {
    throw new Error(
      'useRequiredOptimisticContext must be used within an OptimisticProvider'
    );
  }
  return context;
}

/**
 * Get CSS classes for toast position
 */
function getPositionClasses(position: ToastPosition): string {
  const positionMap: Record<ToastPosition, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };
  return positionMap[position];
}

/**
 * Provider component for optimistic UI state management.
 *
 * Manages a global queue of undo toasts, tracks pending optimistic operations,
 * and provides undo capability across components.
 */
export function OptimisticProvider({
  children,
  toastPosition = 'bottom-right',
  defaultUndoTimeout = 5000,
  maxToasts = 5,
  toastGap = 8,
  renderToast,
}: OptimisticProviderProps): React.ReactElement {
  // State for pending mutations
  const [pendingMutations, setPendingMutations] = useState<
    Map<string, PendingMutation>
  >(new Map());

  // State for toast queue
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Refs for timer management
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  /**
   * Add a pending mutation to the tracking map
   */
  const addPendingMutation = useCallback((mutation: PendingMutation) => {
    setPendingMutations((prev) => {
      const next = new Map(prev);
      next.set(mutation.id, mutation);
      return next;
    });
  }, []);

  /**
   * Remove a pending mutation from tracking
   */
  const removePendingMutation = useCallback((id: string) => {
    setPendingMutations((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  /**
   * Dismiss a specific toast
   */
  const dismissToast = useCallback((id: string) => {
    // Clear the auto-dismiss timer
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }

    // Mark as dismissing for exit animation
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isDismissing: true } : toast
      )
    );

    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 200); // Match animation duration
  }, []);

  /**
   * Show an undo toast notification
   */
  const showUndoToast = useCallback(
    (options: UndoToastOptions) => {
      const toastState: ToastState = {
        ...options,
        createdAt: Date.now(),
        isDismissing: false,
      };

      setToasts((prev) => {
        // Remove existing toast with same ID
        const filtered = prev.filter((t) => t.id !== options.id);

        // Limit total toasts
        const limited =
          filtered.length >= maxToasts ? filtered.slice(1) : filtered;

        return [...limited, toastState];
      });

      // Set auto-dismiss timer
      const timer = setTimeout(() => {
        dismissToast(options.id);
      }, options.duration || defaultUndoTimeout);

      toastTimers.current.set(options.id, timer);
    },
    [maxToasts, defaultUndoTimeout, dismissToast]
  );

  /**
   * Dismiss all toasts
   */
  const dismissAllToasts = useCallback(() => {
    // Clear all timers
    toastTimers.current.forEach((timer) => clearTimeout(timer));
    toastTimers.current.clear();

    // Mark all as dismissing
    setToasts((prev) =>
      prev.map((toast) => ({ ...toast, isDismissing: true }))
    );

    // Clear after animation
    setTimeout(() => {
      setToasts([]);
    }, 200);
  }, []);

  /**
   * Undo all pending mutations
   */
  const undoAll = useCallback(() => {
    pendingMutations.forEach((mutation) => {
      mutation.undo();
    });
    setPendingMutations(new Map());
    dismissAllToasts();
  }, [pendingMutations, dismissAllToasts]);

  /**
   * Handle toast undo action
   */
  const handleToastUndo = useCallback(
    (toast: ToastState) => {
      toast.onUndo();
      dismissToast(toast.id);
      removePendingMutation(toast.id);
    },
    [dismissToast, removePendingMutation]
  );

  // Memoized context value
  const contextValue = useMemo<OptimisticContextValue>(
    () => ({
      pendingMutations,
      addPendingMutation,
      removePendingMutation,
      showUndoToast,
      dismissToast,
      dismissAllToasts,
      undoAll,
      hasPendingMutations: pendingMutations.size > 0,
      pendingCount: pendingMutations.size,
    }),
    [
      pendingMutations,
      addPendingMutation,
      removePendingMutation,
      showUndoToast,
      dismissToast,
      dismissAllToasts,
      undoAll,
    ]
  );

  // Determine if position is top or bottom for stacking direction
  const isTopPosition = toastPosition.startsWith('top');

  return (
    <OptimisticContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <div
        className={`fixed z-50 pointer-events-none ${getPositionClasses(toastPosition)}`}
        style={{
          display: 'flex',
          flexDirection: isTopPosition ? 'column' : 'column-reverse',
          gap: `${toastGap}px`,
        }}
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => {
          const toastProps: RollbackToastProps = {
            actionText: toast.actionLabel,
            message: toast.message,
            duration: toast.duration,
            onUndo: () => handleToastUndo(toast),
            onDismiss: () => dismissToast(toast.id),
            icon: toast.icon,
            isVisible: !toast.isDismissing,
            createdAt: toast.createdAt,
          };

          if (renderToast) {
            return (
              <div key={toast.id} className="pointer-events-auto">
                {renderToast({ ...toastProps, onDismiss: () => dismissToast(toast.id) })}
              </div>
            );
          }

          return (
            <div key={toast.id} className="pointer-events-auto">
              <RollbackToast {...toastProps} />
            </div>
          );
        })}
      </div>
    </OptimisticContext.Provider>
  );
}

OptimisticProvider.displayName = 'OptimisticProvider';

export default OptimisticProvider;
