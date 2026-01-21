/**
 * Appointment-Specific Animation Variants
 * Animations for appointment booking and management flows
 */

import type { Variants, Transition } from 'framer-motion';
import { DURATION, EASING } from '../constants';

/**
 * Step indicator progress animation
 */
export const stepIndicatorVariants: Variants = {
  inactive: {
    scale: 1,
    backgroundColor: 'var(--color-gray-200)',
  },
  active: {
    scale: 1.1,
    backgroundColor: 'var(--color-primary-500)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  completed: {
    scale: 1,
    backgroundColor: 'var(--color-primary-500)',
  },
};

/**
 * Step content transition
 */
export const stepContentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: {
      duration: DURATION.fast,
    },
  }),
};

/**
 * Time slot selection animation
 */
export const timeSlotVariants: Variants = {
  initial: {
    scale: 1,
    borderColor: 'var(--color-gray-200)',
    backgroundColor: 'transparent',
  },
  hover: {
    scale: 1.02,
    borderColor: 'var(--color-primary-300)',
    transition: { duration: DURATION.fast },
  },
  selected: {
    scale: 1,
    borderColor: 'var(--color-primary-500)',
    backgroundColor: 'var(--color-primary-50)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  disabled: {
    opacity: 0.5,
    scale: 1,
  },
};

/**
 * Provider card selection animation
 */
export const providerCardVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: { duration: DURATION.fast },
  },
  selected: {
    scale: 1,
    boxShadow: '0 0 0 2px var(--color-primary-500)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

/**
 * Booking confirmation animation
 */
export const confirmationVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Checkmark circle animation for success states
 */
export const successCircleVariants: Variants = {
  hidden: {
    scale: 0,
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
};

/**
 * Confetti-like celebration particles (optional, respects reduced motion)
 */
export const celebrationParticleVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
    y: 0,
  },
  visible: (i: number) => ({
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    y: [0, -50 - i * 10, -100],
    x: [(i % 2 === 0 ? 1 : -1) * (10 + i * 5), 0, (i % 2 === 0 ? -1 : 1) * (20 + i * 5)],
    transition: {
      duration: 1,
      ease: 'easeOut',
      times: [0, 0.5, 1],
    },
  }),
};

/**
 * Calendar date cell animation
 */
export const calendarDateVariants: Variants = {
  initial: {
    backgroundColor: 'transparent',
  },
  hover: {
    backgroundColor: 'var(--color-gray-100)',
    transition: { duration: DURATION.fast },
  },
  selected: {
    backgroundColor: 'var(--color-primary-500)',
    color: 'white',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  today: {
    boxShadow: 'inset 0 0 0 1px var(--color-primary-300)',
  },
  hasAppointment: {
    backgroundColor: 'var(--color-primary-50)',
  },
};

/**
 * Appointment card status change animation
 */
export const appointmentStatusVariants: Variants = {
  scheduled: {
    borderLeftColor: 'var(--color-blue-500)',
    backgroundColor: 'var(--color-blue-50)',
  },
  confirmed: {
    borderLeftColor: 'var(--color-green-500)',
    backgroundColor: 'var(--color-green-50)',
  },
  inProgress: {
    borderLeftColor: 'var(--color-yellow-500)',
    backgroundColor: 'var(--color-yellow-50)',
  },
  completed: {
    borderLeftColor: 'var(--color-gray-400)',
    backgroundColor: 'var(--color-gray-50)',
    opacity: 0.8,
  },
  cancelled: {
    borderLeftColor: 'var(--color-red-500)',
    backgroundColor: 'var(--color-red-50)',
    opacity: 0.6,
  },
};

/**
 * Progress bar animation for booking steps
 */
export const progressBarTransition: Transition = {
  duration: DURATION.normal,
  ease: EASING.easeOut,
};
