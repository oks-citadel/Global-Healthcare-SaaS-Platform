/**
 * High Contrast Mode Utilities
 * Support for users who prefer high contrast displays
 */

import { useEffect, useState } from 'react';

/**
 * Hook to detect high contrast mode preference
 */
export function useHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for Windows High Contrast Mode
    const highContrastQuery = window.matchMedia('(forced-colors: active)');
    // Also check for older -ms-high-contrast
    const msHighContrastQuery = window.matchMedia('(-ms-high-contrast: active)');

    setPrefersHighContrast(highContrastQuery.matches || msHighContrastQuery.matches);

    const handleChange = () => {
      setPrefersHighContrast(highContrastQuery.matches || msHighContrastQuery.matches);
    };

    highContrastQuery.addEventListener('change', handleChange);
    msHighContrastQuery.addEventListener('change', handleChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleChange);
      msHighContrastQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersHighContrast;
}

/**
 * Animation adjustments for high contrast mode
 */
export interface HighContrastAnimationConfig {
  /** Use solid borders instead of shadows */
  useSolidBorders: boolean;
  /** Increase animation duration for clarity */
  durationMultiplier: number;
  /** Disable gradient animations */
  disableGradients: boolean;
  /** Use system colors */
  useSystemColors: boolean;
}

export function getHighContrastConfig(isHighContrast: boolean): HighContrastAnimationConfig {
  if (!isHighContrast) {
    return {
      useSolidBorders: false,
      durationMultiplier: 1,
      disableGradients: false,
      useSystemColors: false,
    };
  }

  return {
    useSolidBorders: true,
    durationMultiplier: 1.5,
    disableGradients: true,
    useSystemColors: true,
  };
}

/**
 * Hook to get high contrast animation configuration
 */
export function useHighContrastAnimation(): HighContrastAnimationConfig {
  const prefersHighContrast = useHighContrast();
  return getHighContrastConfig(prefersHighContrast);
}

/**
 * CSS variables for high contrast mode
 */
export const highContrastCSSVars = {
  '--hc-text': 'CanvasText',
  '--hc-background': 'Canvas',
  '--hc-link': 'LinkText',
  '--hc-active': 'ActiveText',
  '--hc-visited': 'VisitedText',
  '--hc-highlight': 'Highlight',
  '--hc-highlight-text': 'HighlightText',
  '--hc-button-face': 'ButtonFace',
  '--hc-button-text': 'ButtonText',
  '--hc-border': 'CanvasText',
} as const;

/**
 * Apply high contrast CSS variables
 */
export function applyHighContrastStyles(element: HTMLElement): void {
  Object.entries(highContrastCSSVars).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
}

/**
 * Tailwind CSS classes for high contrast support
 */
export const highContrastClasses = {
  text: 'forced-colors:text-[CanvasText]',
  background: 'forced-colors:bg-[Canvas]',
  border: 'forced-colors:border-[CanvasText]',
  link: 'forced-colors:text-[LinkText]',
  button: 'forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]',
  highlight: 'forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
};

/**
 * Get appropriate shadow style for high contrast
 */
export function getContrastSafeBoxShadow(
  normalShadow: string,
  isHighContrast: boolean
): string {
  if (isHighContrast) {
    // Replace shadow with solid border
    return 'none';
  }
  return normalShadow;
}

/**
 * Get appropriate border for high contrast
 */
export function getContrastSafeBorder(
  hasShadow: boolean,
  isHighContrast: boolean
): string {
  if (isHighContrast && hasShadow) {
    return '2px solid currentColor';
  }
  return '';
}
