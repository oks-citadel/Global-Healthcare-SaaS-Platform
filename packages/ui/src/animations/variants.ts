/**
 * Framer Motion Animation Variants
 * Reusable animation variants for healthcare applications
 */

import type { Variants, Transition } from 'framer-motion';
import { DURATION, EASING, STAGGER } from './constants';

/**
 * Container variants for staggered children animations
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: STAGGER.fast,
      staggerDirection: -1,
    },
  },
};

/**
 * Item variants for list animations
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: DURATION.fast,
    },
  },
};

/**
 * Modal/Dialog variants
 */
export const modalVariants: Variants = {
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
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: DURATION.fast,
    },
  },
};

/**
 * Backdrop/overlay variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast },
  },
};

/**
 * Slide panel variants (for sidebars, drawers)
 */
export const slidePanelVariants = {
  left: {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: { duration: DURATION.normal },
    },
  } as Variants,

  right: {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: DURATION.normal },
    },
  } as Variants,

  bottom: {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: DURATION.normal },
    },
  } as Variants,
};

/**
 * Card hover variants
 */
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
    transition: {
      duration: DURATION.fast,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * Button press variants
 */
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

/**
 * Accordion/expandable variants
 */
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: DURATION.normal },
      opacity: { duration: DURATION.fast },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: DURATION.normal },
      opacity: { duration: DURATION.normal, delay: 0.1 },
    },
  },
};

/**
 * Toast notification variants
 */
export const toastVariants = {
  top: {
    hidden: { opacity: 0, y: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: DURATION.fast },
    },
  } as Variants,

  bottom: {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.9,
      transition: { duration: DURATION.fast },
    },
  } as Variants,
};

/**
 * Page transition variants
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
      when: 'beforeChildren',
      staggerChildren: STAGGER.normal,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: DURATION.fast,
    },
  },
};

/**
 * Pulse animation for loading/active states
 */
export const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Success checkmark animation
 */
export const checkmarkVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: DURATION.slow, ease: 'easeOut' },
      opacity: { duration: DURATION.fast },
    },
  },
};

/**
 * Counter/number animation transition
 */
export const counterTransition: Transition = {
  duration: DURATION.slower,
  ease: [0.25, 0.1, 0.25, 1],
};
