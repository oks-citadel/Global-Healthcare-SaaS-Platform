/**
 * Vitals-Specific Animation Variants
 * Animations for vital signs, health metrics, and data visualization
 */

import type { Variants, Transition } from 'framer-motion';
import { DURATION, EASING } from '../constants';

/**
 * Counter animation for numeric values
 */
export const counterVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

/**
 * Transition for animated numbers
 */
export const numberTransition: Transition = {
  duration: DURATION.slower,
  ease: [0.25, 0.1, 0.25, 1],
};

/**
 * Trend indicator animation (up/down arrows)
 */
export const trendIndicatorVariants: Variants = {
  up: {
    y: [0, -3, 0],
    color: 'var(--color-green-500)',
    transition: {
      y: {
        duration: 0.6,
        repeat: 2,
        ease: 'easeInOut',
      },
    },
  },
  down: {
    y: [0, 3, 0],
    color: 'var(--color-red-500)',
    transition: {
      y: {
        duration: 0.6,
        repeat: 2,
        ease: 'easeInOut',
      },
    },
  },
  stable: {
    scale: [1, 1.1, 1],
    color: 'var(--color-gray-500)',
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * Vital card entrance animation
 */
export const vitalCardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

/**
 * Alert pulse for out-of-range values
 */
export const alertPulseVariants: Variants = {
  normal: {
    boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
  },
  alert: {
    boxShadow: [
      '0 0 0 0 rgba(239, 68, 68, 0.4)',
      '0 0 0 10px rgba(239, 68, 68, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

/**
 * Chart line draw animation
 */
export const chartLineVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1,
        ease: 'easeInOut',
      },
      opacity: {
        duration: 0.3,
      },
    },
  },
};

/**
 * Chart dot animation
 */
export const chartDotVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: DURATION.fast,
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  }),
  hover: {
    scale: 1.5,
    transition: {
      duration: DURATION.fast,
    },
  },
};

/**
 * Gauge/meter animation
 */
export const gaugeVariants: Variants = {
  initial: {
    rotate: -90,
  },
  animate: (value: number) => ({
    rotate: -90 + value * 1.8, // 180 degrees for 0-100
    transition: {
      duration: DURATION.slower,
      ease: EASING.easeOut,
    },
  }),
};

/**
 * Progress ring animation
 */
export const progressRingVariants: Variants = {
  initial: {
    strokeDashoffset: 283, // 2 * PI * r (r = 45)
  },
  animate: (progress: number) => ({
    strokeDashoffset: 283 - (283 * progress) / 100,
    transition: {
      duration: DURATION.slower,
      ease: EASING.easeOut,
    },
  }),
};

/**
 * Health score badge animation
 */
export const healthScoreBadgeVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

/**
 * Live data update flash
 */
export const liveUpdateVariants: Variants = {
  initial: {
    backgroundColor: 'transparent',
  },
  update: {
    backgroundColor: ['transparent', 'var(--color-green-100)', 'transparent'],
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

/**
 * Heart rate pulse animation
 */
export const heartbeatVariants: Variants = {
  initial: {
    scale: 1,
  },
  beat: {
    scale: [1, 1.15, 1, 1.05, 1],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      times: [0, 0.15, 0.3, 0.45, 0.6],
      repeat: Infinity,
      repeatDelay: 0.4,
    },
  },
};

/**
 * Breathing animation (for respiratory rate)
 */
export const breathingVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 0.6,
  },
  breathe: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 4, // ~15 breaths per minute
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};
