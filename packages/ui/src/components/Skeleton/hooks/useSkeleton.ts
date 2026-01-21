/**
 * useSkeleton Hook
 * Manages loading state with configurable delay and minimum display time
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSkeletonOptions {
  /** Delay before showing skeleton (prevents flash for fast loads) */
  delay?: number;
  /** Minimum time to show skeleton (prevents jarring quick transitions) */
  minDisplayTime?: number;
  /** Initial loading state */
  initialLoading?: boolean;
}

export interface UseSkeletonReturn {
  /** Whether to show skeleton */
  showSkeleton: boolean;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Current loading state (may differ from showSkeleton due to delays) */
  isLoading: boolean;
}

export function useSkeleton(options: UseSkeletonOptions = {}): UseSkeletonReturn {
  const {
    delay = 200,
    minDisplayTime = 500,
    initialLoading = true,
  } = options;

  const [isLoading, setIsLoading] = useState(initialLoading);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const loadingStartTime = useRef<number | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDisplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
      if (minDisplayTimerRef.current) {
        clearTimeout(minDisplayTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      // Clear any existing timers
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }

      // Delay showing skeleton to prevent flash
      if (delay > 0) {
        delayTimerRef.current = setTimeout(() => {
          loadingStartTime.current = Date.now();
          setShowSkeleton(true);
        }, delay);
      } else {
        loadingStartTime.current = Date.now();
        setShowSkeleton(true);
      }
    } else {
      // Clear delay timer if loading finished before delay
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }

      // Calculate remaining display time
      if (showSkeleton && loadingStartTime.current) {
        const elapsedTime = Date.now() - loadingStartTime.current;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        if (remainingTime > 0) {
          minDisplayTimerRef.current = setTimeout(() => {
            setShowSkeleton(false);
            loadingStartTime.current = null;
          }, remainingTime);
        } else {
          setShowSkeleton(false);
          loadingStartTime.current = null;
        }
      } else {
        setShowSkeleton(false);
        loadingStartTime.current = null;
      }
    }
  }, [isLoading, delay, minDisplayTime, showSkeleton]);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    showSkeleton,
    setLoading,
    isLoading,
  };
}

/**
 * useSkeletonGroup Hook
 * Manages skeleton state for multiple items with staggered animations
 */
export interface UseSkeletonGroupOptions extends UseSkeletonOptions {
  /** Number of items in the group */
  count: number;
  /** Stagger delay between items */
  staggerDelay?: number;
}

export interface UseSkeletonGroupReturn extends UseSkeletonReturn {
  /** Get stagger delay for item at index */
  getStaggerDelay: (index: number) => number;
}

export function useSkeletonGroup(
  options: UseSkeletonGroupOptions
): UseSkeletonGroupReturn {
  const { count, staggerDelay = 50, ...skeletonOptions } = options;
  const skeleton = useSkeleton(skeletonOptions);

  const getStaggerDelay = useCallback(
    (index: number) => {
      if (!skeleton.showSkeleton) return 0;
      return Math.min(index, count - 1) * staggerDelay;
    },
    [skeleton.showSkeleton, count, staggerDelay]
  );

  return {
    ...skeleton,
    getStaggerDelay,
  };
}
