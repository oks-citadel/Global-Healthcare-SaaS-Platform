/**
 * Accessibility Animation Utilities
 */

export {
  useReducedMotion,
  useMotionSafeAnimation,
  useConditionalMotion,
  getAnimationPreset,
  createReducedMotionVariants,
  getMotionProps,
  REDUCED_MOTION_CLASS,
  motionSafeClasses,
} from './reducedMotion';

export {
  useHighContrast,
  useHighContrastAnimation,
  getHighContrastConfig,
  applyHighContrastStyles,
  getContrastSafeBoxShadow,
  getContrastSafeBorder,
  highContrastCSSVars,
  highContrastClasses,
  type HighContrastAnimationConfig,
} from './highContrast';
