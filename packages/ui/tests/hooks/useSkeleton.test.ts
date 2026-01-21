/**
 * useSkeleton Hook Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSkeleton, useSkeletonGroup } from '../../src/components/Skeleton/hooks/useSkeleton';

describe('useSkeleton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with loading state when initialLoading is true', () => {
    const { result } = renderHook(() => useSkeleton({ initialLoading: true }));
    expect(result.current.isLoading).toBe(true);
  });

  it('initializes without loading state when initialLoading is false', () => {
    const { result } = renderHook(() => useSkeleton({ initialLoading: false }));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.showSkeleton).toBe(false);
  });

  it('shows skeleton after delay when loading', () => {
    const { result } = renderHook(() =>
      useSkeleton({ delay: 200, initialLoading: true })
    );

    // Initially skeleton should not be shown (waiting for delay)
    expect(result.current.showSkeleton).toBe(false);

    // After delay, skeleton should be shown
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showSkeleton).toBe(true);
  });

  it('does not show skeleton if loading completes before delay', () => {
    const { result } = renderHook(() =>
      useSkeleton({ delay: 200, initialLoading: true })
    );

    // Complete loading before delay
    act(() => {
      vi.advanceTimersByTime(100);
      result.current.setLoading(false);
    });

    // Skeleton should never be shown
    expect(result.current.showSkeleton).toBe(false);

    // Even after the original delay time
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.showSkeleton).toBe(false);
  });

  it('maintains skeleton for minimum display time', () => {
    const { result } = renderHook(() =>
      useSkeleton({ delay: 0, minDisplayTime: 500, initialLoading: true })
    );

    // Skeleton should be shown immediately (no delay)
    expect(result.current.showSkeleton).toBe(true);

    // Stop loading after 100ms
    act(() => {
      vi.advanceTimersByTime(100);
      result.current.setLoading(false);
    });

    // Skeleton should still be visible (min display time not reached)
    expect(result.current.showSkeleton).toBe(true);

    // After remaining min display time
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.showSkeleton).toBe(false);
  });

  it('setLoading function updates loading state', () => {
    const { result } = renderHook(() =>
      useSkeleton({ initialLoading: false, delay: 0 })
    );

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });
});

describe('useSkeletonGroup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides stagger delay for items', () => {
    const { result } = renderHook(() =>
      useSkeletonGroup({
        count: 5,
        staggerDelay: 50,
        delay: 0,
        initialLoading: true,
      })
    );

    expect(result.current.getStaggerDelay(0)).toBe(0);
    expect(result.current.getStaggerDelay(1)).toBe(50);
    expect(result.current.getStaggerDelay(2)).toBe(100);
    expect(result.current.getStaggerDelay(4)).toBe(200);
  });

  it('returns 0 stagger delay when skeleton is not showing', () => {
    const { result } = renderHook(() =>
      useSkeletonGroup({
        count: 5,
        staggerDelay: 50,
        delay: 0,
        initialLoading: false,
      })
    );

    expect(result.current.getStaggerDelay(0)).toBe(0);
    expect(result.current.getStaggerDelay(3)).toBe(0);
  });

  it('caps stagger delay at count - 1', () => {
    const { result } = renderHook(() =>
      useSkeletonGroup({
        count: 3,
        staggerDelay: 50,
        delay: 0,
        initialLoading: true,
      })
    );

    // Index beyond count should be capped
    expect(result.current.getStaggerDelay(10)).toBe(100); // (3-1) * 50
  });
});
