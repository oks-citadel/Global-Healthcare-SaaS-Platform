/**
 * useOptimisticMutation
 *
 * A generic hook for implementing optimistic updates with React Query (TanStack Query).
 * Provides automatic rollback on error, undo functionality, and comprehensive state tracking.
 *
 * @example
 * ```tsx
 * const { mutate, isPending, undo, isRolledBack } = useOptimisticMutation({
 *   mutationFn: async (data) => await api.updateItem(data),
 *   onMutate: (variables) => {
 *     // Optimistically update UI before server response
 *     const previousData = queryClient.getQueryData(['items']);
 *     queryClient.setQueryData(['items'], (old) => [...old, variables]);
 *     return { previousData };
 *   },
 *   onError: (error, variables, context) => {
 *     // Automatically rolled back, but can handle error display
 *   },
 *   onRollback: (context) => {
 *     // Restore previous state
 *     queryClient.setQueryData(['items'], context.previousData);
 *   },
 *   undoTimeout: 5000,
 * });
 * ```
 */

import { useState, useCallback, useRef, useId } from 'react';
import { useOptimisticContext } from './OptimisticProvider';

/**
 * Configuration options for optimistic mutations
 * @template TData - The type of data returned from the mutation
 * @template TVariables - The type of variables passed to the mutation
 * @template TContext - The type of context returned from onMutate
 */
export interface OptimisticMutationOptions<TData, TVariables, TContext> {
  /**
   * The mutation function that performs the actual async operation
   */
  mutationFn: (variables: TVariables) => Promise<TData>;

  /**
   * Called before the mutation function.
   * Return a context object that will be passed to onSuccess, onError, and onRollback.
   * Use this to capture previous state for potential rollback.
   */
  onMutate?: (variables: TVariables) => TContext | Promise<TContext>;

  /**
   * Called when the mutation succeeds
   */
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;

  /**
   * Called when the mutation fails
   */
  onError?: (error: Error, variables: TVariables, context: TContext) => void;

  /**
   * Called when rolling back optimistic updates (on error or undo)
   */
  onRollback?: (context: TContext) => void;

  /**
   * Called after mutation completes (success or error)
   */
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables,
    context: TContext
  ) => void;

  /**
   * Time in milliseconds before the undo option expires
   * @default 5000
   */
  undoTimeout?: number;

  /**
   * Label for the action shown in the undo toast
   */
  actionLabel?: string;

  /**
   * Whether to show the undo toast on success
   * @default true
   */
  showUndoToast?: boolean;
}

/**
 * State of a mutation operation
 */
export type MutationStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * Return type for useOptimisticMutation hook
 */
export interface UseOptimisticMutationReturn<TData, TVariables> {
  /**
   * Trigger the mutation
   */
  mutate: (variables: TVariables) => Promise<TData | void>;

  /**
   * Async version that returns the result
   */
  mutateAsync: (variables: TVariables) => Promise<TData>;

  /**
   * Whether the mutation is currently in progress
   */
  isPending: boolean;

  /**
   * Whether the mutation completed successfully
   */
  isSuccess: boolean;

  /**
   * Whether the mutation failed
   */
  isError: boolean;

  /**
   * Whether the mutation has been rolled back (via undo or error)
   */
  isRolledBack: boolean;

  /**
   * Whether the undo option is currently available
   */
  canUndo: boolean;

  /**
   * Undo the optimistic update (only available during undo window)
   */
  undo: () => void;

  /**
   * Current status of the mutation
   */
  status: MutationStatus;

  /**
   * The data returned from the last successful mutation
   */
  data: TData | undefined;

  /**
   * The error from the last failed mutation
   */
  error: Error | null;

  /**
   * Reset the mutation state
   */
  reset: () => void;

  /**
   * Time remaining for undo in milliseconds
   */
  undoTimeRemaining: number;
}

/**
 * Internal state for tracking mutation lifecycle
 */
interface MutationState<TData> {
  status: MutationStatus;
  data: TData | undefined;
  error: Error | null;
  isRolledBack: boolean;
  canUndo: boolean;
  undoTimeRemaining: number;
}

/**
 * A generic hook for optimistic UI updates with automatic rollback and undo support.
 *
 * @template TData - The type of data returned from the mutation
 * @template TVariables - The type of variables passed to the mutation
 * @template TContext - The type of context for rollback operations
 *
 * @param options - Configuration options for the optimistic mutation
 * @returns An object containing mutation functions and state
 */
export function useOptimisticMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: OptimisticMutationOptions<TData, TVariables, TContext>
): UseOptimisticMutationReturn<TData, TVariables> {
  const {
    mutationFn,
    onMutate,
    onSuccess,
    onError,
    onRollback,
    onSettled,
    undoTimeout = 5000,
    actionLabel = 'Action',
    showUndoToast = true,
  } = options;

  const mutationId = useId();
  const optimisticContext = useOptimisticContext();

  const [state, setState] = useState<MutationState<TData>>({
    status: 'idle',
    data: undefined,
    error: null,
    isRolledBack: false,
    canUndo: false,
    undoTimeRemaining: 0,
  });

  // Refs for managing undo functionality
  const contextRef = useRef<TContext | undefined>(undefined);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUndoneRef = useRef(false);
  const variablesRef = useRef<TVariables | undefined>(undefined);

  /**
   * Clear undo timers
   */
  const clearUndoTimers = useCallback(() => {
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    if (undoIntervalRef.current) {
      clearInterval(undoIntervalRef.current);
      undoIntervalRef.current = null;
    }
  }, []);

  /**
   * Start undo countdown
   */
  const startUndoTimer = useCallback(() => {
    clearUndoTimers();

    const startTime = Date.now();
    const endTime = startTime + undoTimeout;

    setState((prev) => ({
      ...prev,
      canUndo: true,
      undoTimeRemaining: undoTimeout,
    }));

    // Update remaining time every 100ms
    undoIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setState((prev) => ({ ...prev, undoTimeRemaining: remaining }));

      if (remaining === 0) {
        clearUndoTimers();
        setState((prev) => ({ ...prev, canUndo: false }));
      }
    }, 100);

    // Clear undo availability after timeout
    undoTimerRef.current = setTimeout(() => {
      clearUndoTimers();
      setState((prev) => ({ ...prev, canUndo: false, undoTimeRemaining: 0 }));
      optimisticContext?.removePendingMutation(mutationId);
    }, undoTimeout);
  }, [undoTimeout, clearUndoTimers, mutationId, optimisticContext]);

  /**
   * Perform rollback
   */
  const performRollback = useCallback(() => {
    clearUndoTimers();

    if (contextRef.current && onRollback) {
      onRollback(contextRef.current);
    }

    setState((prev) => ({
      ...prev,
      isRolledBack: true,
      canUndo: false,
      undoTimeRemaining: 0,
    }));

    optimisticContext?.removePendingMutation(mutationId);
  }, [clearUndoTimers, onRollback, mutationId, optimisticContext]);

  /**
   * Undo the mutation
   */
  const undo = useCallback(() => {
    if (!state.canUndo) return;

    isUndoneRef.current = true;
    performRollback();
  }, [state.canUndo, performRollback]);

  /**
   * Execute the mutation
   */
  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      isUndoneRef.current = false;
      variablesRef.current = variables;

      setState((prev) => ({
        ...prev,
        status: 'pending',
        error: null,
        isRolledBack: false,
        canUndo: false,
      }));

      // Execute onMutate to get context for rollback
      let context: TContext | undefined;
      try {
        if (onMutate) {
          context = await onMutate(variables);
          contextRef.current = context;
        }
      } catch (mutateError) {
        const error =
          mutateError instanceof Error
            ? mutateError
            : new Error(String(mutateError));

        setState((prev) => ({
          ...prev,
          status: 'error',
          error,
        }));

        throw error;
      }

      // Register pending mutation with context
      if (optimisticContext && showUndoToast) {
        optimisticContext.addPendingMutation({
          id: mutationId,
          actionLabel,
          timestamp: Date.now(),
          undo,
          undoTimeout,
        });
      }

      try {
        const data = await mutationFn(variables);

        // Check if undo was triggered during mutation
        if (isUndoneRef.current) {
          throw new Error('Mutation was cancelled by user');
        }

        setState((prev) => ({
          ...prev,
          status: 'success',
          data,
        }));

        if (onSuccess && context !== undefined) {
          onSuccess(data, variables, context);
        }

        // Start undo timer for successful mutations
        if (showUndoToast) {
          startUndoTimer();

          // Show undo toast
          if (optimisticContext) {
            optimisticContext.showUndoToast({
              id: mutationId,
              actionLabel,
              onUndo: undo,
              duration: undoTimeout,
            });
          }
        }

        if (onSettled && context !== undefined) {
          onSettled(data, null, variables, context);
        }

        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        // Don't rollback if it was a user-initiated undo
        if (!isUndoneRef.current) {
          performRollback();
        }

        setState((prev) => ({
          ...prev,
          status: 'error',
          error,
          isRolledBack: true,
        }));

        if (onError && context !== undefined) {
          onError(error, variables, context);
        }

        if (onSettled && context !== undefined) {
          onSettled(undefined, error, variables, context);
        }

        throw error;
      }
    },
    [
      onMutate,
      mutationFn,
      onSuccess,
      onError,
      onSettled,
      onRollback,
      startUndoTimer,
      performRollback,
      undo,
      showUndoToast,
      mutationId,
      actionLabel,
      undoTimeout,
      optimisticContext,
    ]
  );

  /**
   * Non-throwing mutation function
   */
  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | void> => {
      try {
        return await mutateAsync(variables);
      } catch {
        // Error is already handled in mutateAsync
        return;
      }
    },
    [mutateAsync]
  );

  /**
   * Reset the mutation state
   */
  const reset = useCallback(() => {
    clearUndoTimers();
    contextRef.current = undefined;
    variablesRef.current = undefined;
    isUndoneRef.current = false;

    setState({
      status: 'idle',
      data: undefined,
      error: null,
      isRolledBack: false,
      canUndo: false,
      undoTimeRemaining: 0,
    });
  }, [clearUndoTimers]);

  return {
    mutate,
    mutateAsync,
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isRolledBack: state.isRolledBack,
    canUndo: state.canUndo,
    undo,
    status: state.status,
    data: state.data,
    error: state.error,
    reset,
    undoTimeRemaining: state.undoTimeRemaining,
  };
}

export default useOptimisticMutation;
