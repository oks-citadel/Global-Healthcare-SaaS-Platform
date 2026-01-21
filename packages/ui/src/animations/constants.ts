/**
 * Animation Constants
 * Centralized animation timing and easing values
 */

/**
 * Duration tokens (in seconds for Framer Motion, ms for CSS)
 */
export const DURATION = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
  slowest: 0.8,
} as const;

/**
 * Duration in milliseconds (for CSS)
 */
export const DURATION_MS = {
  instant: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
  slowest: 800,
} as const;

/**
 * Easing functions
 */
export const EASING = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom healthcare-friendly easings
  gentle: [0.25, 0.1, 0.25, 1], // Soft, calming transitions
  bounce: [0.68, -0.55, 0.265, 1.55], // Subtle bounce for confirmations
  anticipate: [0.68, -0.6, 0.32, 1.6], // Build anticipation

  // Spring physics for natural feel
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 25 },
  springStiff: { type: 'spring', stiffness: 500, damping: 35 },
} as const;

/**
 * CSS easing strings
 */
export const CSS_EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

/**
 * Stagger delays for list animations
 */
export const STAGGER = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.08,
} as const;

/**
 * Animation presets for common patterns
 */
export const PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.normal },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: DURATION.normal, ease: EASING.easeOut },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: DURATION.normal, ease: EASING.easeOut },
  },

  slideInRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { duration: DURATION.normal, ease: EASING.easeOut },
  },

  slideInLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: { duration: DURATION.normal, ease: EASING.easeOut },
  },

  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: DURATION.fast, ease: EASING.easeOut },
  },

  pop: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: EASING.spring,
  },
} as const;

/**
 * Reduced motion variants (minimal or no animation)
 */
export const REDUCED_MOTION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },

  fadeInUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },

  fadeInDown: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },

  slideInRight: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },

  slideInLeft: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },

  scale: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },

  pop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },
} as const;
