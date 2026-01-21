/**
 * Animation System
 * Comprehensive animation library for healthcare applications
 * with full accessibility support
 */

// Constants and timing
export {
  DURATION,
  DURATION_MS,
  EASING,
  CSS_EASING,
  STAGGER,
  PRESETS,
  REDUCED_MOTION_PRESETS,
} from './constants';

// General animation variants
export {
  containerVariants,
  itemVariants,
  modalVariants,
  backdropVariants,
  slidePanelVariants,
  cardHoverVariants,
  buttonVariants,
  accordionVariants,
  toastVariants,
  pageTransitionVariants,
  pulseVariants,
  checkmarkVariants,
  counterTransition,
} from './variants';

// Healthcare-specific animations
export * from './healthcare';

// Accessibility utilities
export * from './a11y';
