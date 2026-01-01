'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * useFocusManagement Hook
 *
 * Manages focus state and provides utilities for focus management.
 * Useful for tracking focus within components, managing focus order,
 * and implementing custom focus behaviors.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.4.3 Focus Order (Level A)
 * - 2.4.7 Focus Visible (Level AA)
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { focusFirst, focusLast, hasFocus, focusableElements } =
 *     useFocusManagement(containerRef);
 *
 *   return (
 *     <div ref={containerRef}>
 *       <button>First</button>
 *       <button>Second</button>
 *       <button onClick={focusFirst}>Focus First Element</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useFocusManagement = <T extends HTMLElement = HTMLDivElement>(
  containerRef?: React.RefObject<T>
) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );

  // Get all focusable elements
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const container = containerRef?.current || document.body;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    // Filter visible elements
    return elements.filter((element) => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetParent !== null
      );
    });
  }, [containerRef]);

  // Focus the first focusable element
  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  // Focus the last focusable element
  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // Focus the next focusable element
  const focusNext = useCallback(() => {
    const elements = getFocusableElements();
    const currentIndex = elements.findIndex(
      (el) => el === document.activeElement
    );

    if (currentIndex < elements.length - 1) {
      elements[currentIndex + 1].focus();
    } else {
      elements[0].focus(); // Wrap to first
    }
  }, [getFocusableElements]);

  // Focus the previous focusable element
  const focusPrevious = useCallback(() => {
    const elements = getFocusableElements();
    const currentIndex = elements.findIndex(
      (el) => el === document.activeElement
    );

    if (currentIndex > 0) {
      elements[currentIndex - 1].focus();
    } else {
      elements[elements.length - 1].focus(); // Wrap to last
    }
  }, [getFocusableElements]);

  // Track focus state
  useEffect(() => {
    const container = containerRef?.current || document.body;

    const handleFocusIn = (e: FocusEvent) => {
      setHasFocus(true);
      setFocusedElement(e.target as HTMLElement);
    };

    const handleFocusOut = (e: FocusEvent) => {
      // Check if focus is moving outside the container
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (!relatedTarget || !container.contains(relatedTarget)) {
        setHasFocus(false);
        setFocusedElement(null);
      }
    };

    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);

    return () => {
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
    };
  }, [containerRef]);

  return {
    hasFocus,
    focusedElement,
    focusableElements: getFocusableElements(),
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    getFocusableElements,
  };
};

/**
 * useAriaLive Hook
 *
 * Provides a simple interface for making live announcements to screen readers.
 * Manages the announcement queue and timing to ensure announcements are
 * properly read by assistive technologies.
 *
 * WCAG 2.1 Success Criteria:
 * - 4.1.3 Status Messages (Level AA)
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { announce, LiveRegion } = useAriaLive();
 *
 *   const handleSave = async () => {
 *     await saveData();
 *     announce('Data saved successfully', 'polite');
 *   };
 *
 *   const handleError = () => {
 *     announce('Error: Please try again', 'assertive');
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSave}>Save</button>
 *       <LiveRegion />
 *     </div>
 *   );
 * };
 * ```
 */
export const useAriaLive = () => {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>(
    'polite'
  );
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const announce = useCallback(
    (newMessage: string, newPoliteness: 'polite' | 'assertive' = 'polite') => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Clear message first to ensure change detection
      setMessage('');
      setPoliteness(newPoliteness);

      // Set new message after brief delay
      timeoutRef.current = setTimeout(() => {
        setMessage(newMessage);
      }, 100);
    },
    []
  );

  const clear = useCallback(() => {
    setMessage('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const LiveRegion = useCallback(
    () => (
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="absolute overflow-hidden whitespace-nowrap w-px h-px p-0 -m-px border-0 [clip-path:inset(50%)] [clip:rect(0,0,0,0)]"
      >
        {message}
      </div>
    ),
    [message, politeness]
  );

  return {
    announce,
    clear,
    message,
    politeness,
    LiveRegion,
  };
};

/**
 * useReducedMotion Hook
 *
 * Detects user's motion preferences and provides utilities for
 * respecting the prefers-reduced-motion setting.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.3.3 Animation from Interactions (Level AAA)
 * - 2.2.2 Pause, Stop, Hide (Level A)
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { prefersReducedMotion, shouldAnimate } = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={shouldAnimate ? { x: 100 } : {}}
 *       transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * };
 * ```
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else {
      // @ts-ignore - deprecated but needed for older browsers
      mediaQuery.addListener(handleChange);
      // @ts-ignore
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return {
    prefersReducedMotion,
    shouldAnimate: !prefersReducedMotion,
    getTransitionDuration: (duration: number) =>
      prefersReducedMotion ? 0 : duration,
    getAnimationClass: (animatedClass: string, staticClass: string = '') =>
      prefersReducedMotion ? staticClass : animatedClass,
  };
};

/**
 * useKeyboardNavigation Hook
 *
 * Provides keyboard navigation support for custom interactive components.
 * Handles common keyboard patterns like arrow key navigation, Enter/Space
 * activation, and Escape for dismissal.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A)
 * - 2.1.2 No Keyboard Trap (Level A)
 *
 * @example
 * ```tsx
 * const MyMenu = () => {
 *   const { handleKeyDown } = useKeyboardNavigation({
 *     onEnter: () => selectItem(),
 *     onEscape: () => closeMenu(),
 *     onArrowDown: () => focusNext(),
 *     onArrowUp: () => focusPrevious(),
 *   });
 *
 *   return <div onKeyDown={handleKeyDown}>Menu items</div>;
 * };
 * ```
 */
interface KeyboardNavigationOptions {
  onEnter?: (e: React.KeyboardEvent) => void;
  onSpace?: (e: React.KeyboardEvent) => void;
  onEscape?: (e: React.KeyboardEvent) => void;
  onArrowUp?: (e: React.KeyboardEvent) => void;
  onArrowDown?: (e: React.KeyboardEvent) => void;
  onArrowLeft?: (e: React.KeyboardEvent) => void;
  onArrowRight?: (e: React.KeyboardEvent) => void;
  onHome?: (e: React.KeyboardEvent) => void;
  onEnd?: (e: React.KeyboardEvent) => void;
  onTab?: (e: React.KeyboardEvent) => void;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const {
        onEnter,
        onSpace,
        onEscape,
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onHome,
        onEnd,
        onTab,
      } = options;

      switch (e.key) {
        case 'Enter':
          if (onEnter) {
            e.preventDefault();
            onEnter(e);
          }
          break;
        case ' ':
        case 'Space':
          if (onSpace) {
            e.preventDefault();
            onSpace(e);
          }
          break;
        case 'Escape':
        case 'Esc':
          if (onEscape) {
            e.preventDefault();
            onEscape(e);
          }
          break;
        case 'ArrowUp':
        case 'Up':
          if (onArrowUp) {
            e.preventDefault();
            onArrowUp(e);
          }
          break;
        case 'ArrowDown':
        case 'Down':
          if (onArrowDown) {
            e.preventDefault();
            onArrowDown(e);
          }
          break;
        case 'ArrowLeft':
        case 'Left':
          if (onArrowLeft) {
            e.preventDefault();
            onArrowLeft(e);
          }
          break;
        case 'ArrowRight':
        case 'Right':
          if (onArrowRight) {
            e.preventDefault();
            onArrowRight(e);
          }
          break;
        case 'Home':
          if (onHome) {
            e.preventDefault();
            onHome(e);
          }
          break;
        case 'End':
          if (onEnd) {
            e.preventDefault();
            onEnd(e);
          }
          break;
        case 'Tab':
          if (onTab) {
            onTab(e);
          }
          break;
      }
    },
    [options]
  );

  return { handleKeyDown };
};

/**
 * useId Hook
 *
 * Generates stable unique IDs for accessibility attributes.
 * Ensures IDs are consistent across server and client rendering.
 *
 * Note: In React 18+, you should use React's built-in useId hook instead.
 * This is provided for compatibility with older React versions.
 *
 * @example
 * ```tsx
 * const MyInput = () => {
 *   const id = useId('input');
 *   const descId = useId('description');
 *
 *   return (
 *     <div>
 *       <label htmlFor={id}>Username</label>
 *       <input id={id} aria-describedby={descId} />
 *       <div id={descId}>Must be at least 3 characters</div>
 *     </div>
 *   );
 * };
 * ```
 */
let idCounter = 0;

export const useId = (prefix: string = 'id'): string => {
  const [id] = useState(() => {
    // Check if React's useId is available (React 18+)
    if (typeof React !== 'undefined' && 'useId' in React) {
      return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return `${prefix}-${++idCounter}`;
  });

  return id;
};

/**
 * useFocusVisible Hook
 *
 * Tracks whether focus indicators should be visible based on
 * input modality (keyboard vs mouse). Implements the :focus-visible
 * polyfill behavior.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.4.7 Focus Visible (Level AA)
 *
 * @example
 * ```tsx
 * const MyButton = () => {
 *   const { focusVisible, onFocus, onBlur, onMouseDown } = useFocusVisible();
 *
 *   return (
 *     <button
 *       className={focusVisible ? 'ring-2 ring-blue-500' : ''}
 *       onFocus={onFocus}
 *       onBlur={onBlur}
 *       onMouseDown={onMouseDown}
 *     >
 *       Click me
 *     </button>
 *   );
 * };
 * ```
 */
export const useFocusVisible = () => {
  const [focusVisible, setFocusVisible] = useState(false);
  const hadKeyboardEvent = useRef(false);

  useEffect(() => {
    const handleKeyDown = () => {
      hadKeyboardEvent.current = true;
    };

    const handleMouseDown = () => {
      hadKeyboardEvent.current = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const onFocus = () => {
    if (hadKeyboardEvent.current) {
      setFocusVisible(true);
    }
  };

  const onBlur = () => {
    setFocusVisible(false);
  };

  const onMouseDown = () => {
    hadKeyboardEvent.current = false;
  };

  return {
    focusVisible,
    onFocus,
    onBlur,
    onMouseDown,
  };
};

export default {
  useFocusManagement,
  useAriaLive,
  useReducedMotion,
  useKeyboardNavigation,
  useId,
  useFocusVisible,
};
