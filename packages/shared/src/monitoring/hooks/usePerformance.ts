/**
 * usePerformance Hook
 * React hook for component-level performance monitoring
 */

import { useEffect, useRef, useCallback } from 'react';
import { getGlobalMetricCollector, type CustomMetric } from '../customMetrics';
import { getDefaultReporter } from '../reporter';

export interface UsePerformanceOptions {
  /** Name for the component/feature being measured */
  name: string;
  /** Whether to measure render time */
  measureRender?: boolean;
  /** Whether to measure mount time */
  measureMount?: boolean;
  /** Additional context to include with metrics */
  context?: Record<string, string | number | boolean>;
  /** Whether to auto-report metrics */
  autoReport?: boolean;
}

export interface UsePerformanceReturn {
  /** Start a timer for a named operation */
  startTimer: (operationName: string) => () => number;
  /** Record a custom metric */
  recordMetric: (value: number, unit?: string, additionalContext?: Record<string, string | number | boolean>) => void;
  /** Mark a significant event */
  markEvent: (eventName: string) => void;
}

/**
 * Hook for measuring component performance
 */
export function usePerformance(options: UsePerformanceOptions): UsePerformanceReturn {
  const {
    name,
    measureRender = false,
    measureMount = true,
    context = {},
    autoReport = true,
  } = options;

  const mountTime = useRef<number>(performance.now());
  const renderCount = useRef<number>(0);
  const collector = getGlobalMetricCollector();
  const reporter = autoReport ? getDefaultReporter() : null;

  // Track mount time
  useEffect(() => {
    if (!measureMount) return;

    const duration = performance.now() - mountTime.current;
    const metric: CustomMetric = {
      name: `${name}_mount_time`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      context,
    };

    collector.recordMetric(metric);
    reporter?.reportCustomMetric(metric);
  }, []);

  // Track render time
  useEffect(() => {
    if (!measureRender) return;

    renderCount.current += 1;

    // Only measure after first render
    if (renderCount.current > 1) {
      const metric: CustomMetric = {
        name: `${name}_render`,
        value: renderCount.current,
        unit: 'count',
        timestamp: Date.now(),
        context: { ...context, renderCount: renderCount.current },
      };

      collector.recordMetric(metric);
      reporter?.reportCustomMetric(metric);
    }
  });

  const startTimer = useCallback(
    (operationName: string): (() => number) => {
      const startTime = performance.now();

      return () => {
        const duration = performance.now() - startTime;
        const metric: CustomMetric = {
          name: `${name}_${operationName}`,
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
          context,
        };

        collector.recordMetric(metric);
        reporter?.reportCustomMetric(metric);

        return duration;
      };
    },
    [name, context, collector, reporter]
  );

  const recordMetric = useCallback(
    (
      value: number,
      unit = 'ms',
      additionalContext: Record<string, string | number | boolean> = {}
    ) => {
      const metric: CustomMetric = {
        name: `${name}_custom`,
        value,
        unit,
        timestamp: Date.now(),
        context: { ...context, ...additionalContext },
      };

      collector.recordMetric(metric);
      reporter?.reportCustomMetric(metric);
    },
    [name, context, collector, reporter]
  );

  const markEvent = useCallback(
    (eventName: string) => {
      const metric: CustomMetric = {
        name: `${name}_event_${eventName}`,
        value: performance.now(),
        unit: 'timestamp',
        timestamp: Date.now(),
        context,
      };

      collector.recordMetric(metric);
      reporter?.reportCustomMetric(metric);
    },
    [name, context, collector, reporter]
  );

  return {
    startTimer,
    recordMetric,
    markEvent,
  };
}

/**
 * Hook for measuring data fetching performance
 */
export function useQueryPerformance(queryName: string) {
  const { startTimer, recordMetric } = usePerformance({
    name: `query_${queryName}`,
    measureMount: false,
    measureRender: false,
  });

  const measureQuery = useCallback(
    async <T>(queryFn: () => Promise<T>): Promise<T> => {
      const endTimer = startTimer('execution');

      try {
        const result = await queryFn();
        endTimer();
        return result;
      } catch (error) {
        endTimer();
        recordMetric(1, 'error', { error: String(error) });
        throw error;
      }
    },
    [startTimer, recordMetric]
  );

  return { measureQuery };
}

/**
 * Hook for measuring user interactions
 */
export function useInteractionPerformance(interactionName: string) {
  const { startTimer, markEvent } = usePerformance({
    name: `interaction_${interactionName}`,
    measureMount: false,
    measureRender: false,
  });

  const measureInteraction = useCallback(
    async <T>(interactionFn: () => Promise<T> | T): Promise<T> => {
      markEvent('start');
      const endTimer = startTimer('duration');

      try {
        const result = await interactionFn();
        endTimer();
        markEvent('complete');
        return result;
      } catch (error) {
        endTimer();
        markEvent('error');
        throw error;
      }
    },
    [startTimer, markEvent]
  );

  return { measureInteraction };
}
