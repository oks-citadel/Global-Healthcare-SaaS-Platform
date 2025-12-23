'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  initialFocus?: boolean;
  returnFocus?: boolean;
  className?: string;
}

/**
 * FocusTrap Component
 *
 * Traps keyboard focus within a container, essential for modal dialogs
 * and other overlay components to meet WCAG 2.1 AA requirements.
 *
 * Features:
 * - Traps Tab and Shift+Tab navigation within the container
 * - Optionally focuses the first focusable element on mount
 * - Returns focus to the previously focused element on unmount
 * - Handles dynamic content changes
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.2 No Keyboard Trap (Level A)
 * - 2.4.3 Focus Order (Level A)
 *
 * @example
 * ```tsx
 * <FocusTrap active={isModalOpen}>
 *   <div role="dialog" aria-modal="true">
 *     <h2>Modal Title</h2>
 *     <button onClick={closeModal}>Close</button>
 *   </div>
 * </FocusTrap>
 * ```
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  initialFocus = true,
  returnFocus = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

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
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    // Filter out elements that are not visible
    return elements.filter((element) => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetParent !== null
      );
    });
  }, []);

  // Handle Tab key navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // Shift + Tab
      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab
      else {
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [active, getFocusableElements]
  );

  // Set initial focus
  useEffect(() => {
    if (!active || !initialFocus) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Small delay to ensure the element is rendered
      requestAnimationFrame(() => {
        focusableElements[0].focus();
      });
    }
  }, [active, initialFocus, getFocusableElements]);

  // Store previous focus and add event listeners
  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Add keydown listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previously focused element
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, handleKeyDown, returnFocus]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

/**
 * useFocusTrap Hook
 *
 * A hook version of FocusTrap for more flexibility.
 * Returns a ref to attach to the container element.
 *
 * @example
 * ```tsx
 * const MyModal = () => {
 *   const trapRef = useFocusTrap({ active: true });
 *
 *   return (
 *     <div ref={trapRef} role="dialog">
 *       <h2>Modal Content</h2>
 *       <button>Close</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useFocusTrap = ({
  active = true,
  initialFocus = true,
  returnFocus = true,
}: {
  active?: boolean;
  initialFocus?: boolean;
  returnFocus?: boolean;
} = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

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
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    return elements.filter((element) => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetParent !== null
      );
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [active, getFocusableElements]
  );

  useEffect(() => {
    if (!active || !initialFocus) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      requestAnimationFrame(() => {
        focusableElements[0].focus();
      });
    }
  }, [active, initialFocus, getFocusableElements]);

  useEffect(() => {
    if (!active) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, handleKeyDown, returnFocus]);

  return containerRef;
};

export default FocusTrap;
