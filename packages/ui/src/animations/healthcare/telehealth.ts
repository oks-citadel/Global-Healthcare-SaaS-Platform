/**
 * Telehealth-Specific Animation Variants
 * Animations for video calls, connection states, and virtual care
 */

import type { Variants } from 'framer-motion';
import { DURATION, EASING } from '../constants';

/**
 * Connection status indicator
 */
export const connectionStatusVariants: Variants = {
  connecting: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  connected: {
    scale: 1,
    opacity: 1,
    backgroundColor: 'var(--color-green-500)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
  reconnecting: {
    scale: [1, 0.9, 1],
    opacity: [1, 0.5, 1],
    backgroundColor: 'var(--color-yellow-500)',
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  disconnected: {
    scale: 1,
    opacity: 1,
    backgroundColor: 'var(--color-red-500)',
  },
  error: {
    x: [-2, 2, -2, 2, 0],
    backgroundColor: 'var(--color-red-500)',
    transition: {
      x: { duration: 0.4 },
    },
  },
};

/**
 * Video feed entrance animation
 */
export const videoFeedVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
    },
  },
};

/**
 * Picture-in-picture animation
 */
export const pipVariants: Variants = {
  corner: {
    scale: 0.3,
    x: 'calc(100% - 160px)',
    y: 'calc(100% - 120px)',
    borderRadius: '8px',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  fullscreen: {
    scale: 1,
    x: 0,
    y: 0,
    borderRadius: '0px',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * Audio level indicator bars
 */
export const audioLevelVariants: Variants = {
  silent: {
    scaleY: 0.1,
    transition: { duration: 0.1 },
  },
  low: {
    scaleY: 0.3,
    transition: { duration: 0.1 },
  },
  medium: {
    scaleY: 0.6,
    transition: { duration: 0.1 },
  },
  high: {
    scaleY: 1,
    transition: { duration: 0.1 },
  },
};

/**
 * Network quality indicator
 */
export const networkQualityVariants: Variants = {
  excellent: {
    opacity: 1,
  },
  good: {
    opacity: [1, 1, 1, 0.3],
  },
  fair: {
    opacity: [1, 1, 0.3, 0.3],
  },
  poor: {
    opacity: [1, 0.3, 0.3, 0.3],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

/**
 * Call controls animation
 */
export const callControlsVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      duration: DURATION.fast,
    },
  },
};

/**
 * Mute button toggle animation
 */
export const muteButtonVariants: Variants = {
  unmuted: {
    scale: 1,
    backgroundColor: 'var(--color-gray-700)',
  },
  muted: {
    scale: [1, 1.1, 1],
    backgroundColor: 'var(--color-red-500)',
    transition: {
      scale: { duration: 0.2 },
    },
  },
};

/**
 * End call button animation
 */
export const endCallVariants: Variants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 135,
    backgroundColor: 'var(--color-red-600)',
    transition: {
      duration: DURATION.fast,
    },
  },
  tap: {
    scale: 0.95,
  },
};

/**
 * Waiting room animation
 */
export const waitingRoomVariants: Variants = {
  initial: {
    opacity: 0,
  },
  waiting: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

/**
 * Waiting dots animation
 */
export const waitingDotsVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-5, 0, -5],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Screen share indicator
 */
export const screenShareVariants: Variants = {
  inactive: {
    opacity: 0.5,
    scale: 1,
  },
  active: {
    opacity: 1,
    scale: 1,
    boxShadow: '0 0 0 2px var(--color-blue-500)',
  },
  presenting: {
    opacity: 1,
    scale: [1, 1.02, 1],
    boxShadow: [
      '0 0 0 2px var(--color-blue-500)',
      '0 0 0 4px var(--color-blue-300)',
      '0 0 0 2px var(--color-blue-500)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Chat message animation
 */
export const chatMessageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

/**
 * Participant join/leave animation
 */
export const participantVariants: Variants = {
  join: {
    opacity: [0, 1],
    scale: [0.8, 1],
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  leave: {
    opacity: [1, 0],
    scale: [1, 0.8],
    transition: {
      duration: DURATION.normal,
    },
  },
};
