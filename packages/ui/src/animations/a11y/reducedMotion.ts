/**
 * Reduced Motion Utilities
 * Accessibility-compliant animation handling
 */

import { useEffect, useState } from 'react';
import type { Variants, MotionProps } from 'framer-motion';
import { PRESETS, REDUCED_MOTION_PRESETS } from '../constants';

/**
 * Hook to detect user's reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Get appropriate animation preset based on reduced motion preference
 */
export function getAnimationPreset(
  presetName: keyof typeof PRESETS,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return REDUCED_MOTION_PRESETS[presetName];
  }
  return PRESETS[presetName];
}

/**
 * Hook to get motion-safe animation props
 */
export function useMotionSafeAnimation(presetName: keyof typeof PRESETS) {
  const prefersReducedMotion = useReducedMotion();
  return getAnimationPreset(presetName, prefersReducedMotion);
}

/**
 * Convert variants to reduced motion safe versions
 */
export function createReducedMotionVariants(variants: Variants): Variants {
  const reducedVariants: Variants = {};

  for (const key of Object.keys(variants)) {
    const variant = variants[key];

    if (typeof variant === 'object' && variant !== null) {
      // Remove motion-related properties, keep opacity
      const { x, y, scale, rotate, ...rest } = variant as any;
      reducedVariants[key] = {
        ...rest,
        transition: { duration: 0 },
      };
    } else {
      reducedVariants[key] = variant;
    }
  }

  return reducedVariants;
}

/**
 * Get motion props that respect reduced motion preference
 */
export function getMotionProps(
  props: MotionProps,
  prefersReducedMotion: boolean
): MotionProps {
  if (!prefersReducedMotion) {
    return props;
  }

  return {
    ...props,
    initial: props.initial ? { opacity: 0 } : undefined,
    animate: props.animate ? { opacity: 1 } : undefined,
    exit: props.exit ? { opacity: 0 } : undefined,
    transition: { duration: 0 },
    whileHover: undefined,
    whileTap: undefined,
    whileFocus: undefined,
    whileDrag: undefined,
    whileInView: undefined,
  };
}

/**
 * Hook to conditionally apply motion
 */
export function useConditionalMotion() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,

    /**
     * Apply animation only if motion is allowed
     */
    motionProps: (props: MotionProps): MotionProps => {
      return getMotionProps(props, prefersReducedMotion);
    },

    /**
     * Get duration based on preference
     */
    duration: (normalDuration: number): number => {
      return prefersReducedMotion ? 0 : normalDuration;
    },

    /**
     * Get variants based on preference
     */
    variants: (normalVariants: Variants, reducedVariants?: Variants): Variants => {
      if (prefersReducedMotion) {
        return reducedVariants || createReducedMotionVariants(normalVariants);
      }
      return normalVariants;
    },
  };
}

/**
 * CSS class helper for reduced motion
 */
export const REDUCED_MOTION_CLASS = 'motion-safe:animate-none motion-reduce:animate-none';

/**
 * Tailwind CSS safe motion utilities
 */
export const motionSafeClasses = {
  animate: (className: string) => `motion-safe:${className}`,
  noAnimate: 'motion-reduce:animate-none motion-reduce:transition-none',
  reduceMotion: 'motion-reduce:transform-none motion-reduce:transition-none',
};
