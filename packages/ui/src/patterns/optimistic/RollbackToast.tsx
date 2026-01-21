/**
 * RollbackToast
 *
 * An accessible toast notification component for undo functionality.
 * Features a countdown timer visual, smooth animations, and proper ARIA attributes.
 *
 * @example
 * ```tsx
 * <RollbackToast
 *   actionText="Appointment booked"
 *   message="Your appointment has been scheduled"
 *   duration={5000}
 *   onUndo={() => cancelAppointment()}
 *   onDismiss={() => closeToast()}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Props for the RollbackToast component
 */
export interface RollbackToastProps {
  /**
   * The action text to display (e.g., "Appointment booked")
   */
  actionText: string;

  /**
   * Optional additional message
   */
  message?: string;

  /**
   * Duration in ms before auto-dismiss
   * @default 5000
   */
  duration?: number;

  /**
   * Callback when undo button is clicked
   */
  onUndo: () => void;

  /**
   * Callback when toast is dismissed (without undo)
   */
  onDismiss?: () => void;

  /**
   * Optional icon to display
   */
  icon?: ReactNode;

  /**
   * Whether the toast is visible (controls animation)
   * @default true
   */
  isVisible?: boolean;

  /**
   * Custom class name for the toast container
   */
  className?: string;

  /**
   * Timestamp when the toast was created (for timer accuracy)
   */
  createdAt?: number;

  /**
   * Variant style of the toast
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'info';
}

/**
 * Animation variants for the toast
 */
const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    } as const,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

/**
 * Variant styles for the toast
 */
const variantStyles = {
  default: {
    container: 'bg-gray-900 text-white border-gray-700',
    progress: 'bg-blue-500',
    undoButton: 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30',
    dismissButton: 'text-gray-400 hover:text-gray-200',
    icon: 'text-blue-400',
  },
  success: {
    container: 'bg-green-900 text-white border-green-700',
    progress: 'bg-green-500',
    undoButton: 'text-green-400 hover:text-green-300 hover:bg-green-800/30',
    dismissButton: 'text-green-200 hover:text-white',
    icon: 'text-green-400',
  },
  warning: {
    container: 'bg-amber-900 text-white border-amber-700',
    progress: 'bg-amber-500',
    undoButton: 'text-amber-400 hover:text-amber-300 hover:bg-amber-800/30',
    dismissButton: 'text-amber-200 hover:text-white',
    icon: 'text-amber-400',
  },
  info: {
    container: 'bg-blue-900 text-white border-blue-700',
    progress: 'bg-blue-500',
    undoButton: 'text-blue-400 hover:text-blue-300 hover:bg-blue-800/30',
    dismissButton: 'text-blue-200 hover:text-white',
    icon: 'text-blue-400',
  },
};

/**
 * Default success icon
 */
const DefaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('w-5 h-5', className)}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * An accessible toast notification component with undo functionality and countdown timer.
 */
export function RollbackToast({
  actionText,
  message,
  duration = 5000,
  onUndo,
  onDismiss,
  icon,
  isVisible = true,
  className,
  createdAt,
  variant = 'default',
}: RollbackToastProps): React.ReactElement {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(createdAt || Date.now());
  const pausedAtRef = useRef<number | null>(null);

  const styles = variantStyles[variant];

  /**
   * Calculate progress percentage (0-100)
   */
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / duration) * 100));

  /**
   * Format remaining time for display
   */
  const formatTime = useCallback((ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  }, []);

  /**
   * Handle undo click
   */
  const handleUndo = useCallback(() => {
    onUndo();
  }, [onUndo]);

  /**
   * Handle dismiss click
   */
  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  /**
   * Pause timer on hover/focus
   */
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    pausedAtRef.current = Date.now();
  }, []);

  /**
   * Resume timer on mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    if (pausedAtRef.current) {
      // Adjust start time to account for pause
      const pauseDuration = Date.now() - pausedAtRef.current;
      startTimeRef.current += pauseDuration;
      pausedAtRef.current = null;
    }
    setIsPaused(false);
  }, []);

  /**
   * Handle focus for keyboard users
   */
  const handleFocus = useCallback(() => {
    setIsPaused(true);
    pausedAtRef.current = Date.now();
  }, []);

  /**
   * Handle blur for keyboard users
   */
  const handleBlur = useCallback(() => {
    if (pausedAtRef.current) {
      const pauseDuration = Date.now() - pausedAtRef.current;
      startTimeRef.current += pauseDuration;
      pausedAtRef.current = null;
    }
    setIsPaused(false);
  }, []);

  /**
   * Update remaining time
   */
  useEffect(() => {
    if (!isVisible || isPaused) return;

    const updateTime = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, duration - elapsed);
      setTimeRemaining(remaining);
    };

    updateTime();

    const interval = setInterval(updateTime, 50);

    return () => clearInterval(interval);
  }, [duration, isVisible, isPaused]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'relative overflow-hidden rounded-lg border shadow-lg',
            'min-w-[320px] max-w-[420px]',
            styles.container,
            className
          )}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {/* Progress bar */}
          <div
            className="absolute top-0 left-0 h-1 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
            aria-hidden="true"
          >
            <div className={cn('h-full', styles.progress)} />
          </div>

          {/* Content */}
          <div className="p-4 pt-5">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
                {icon || <DefaultIcon />}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{actionText}</p>
                {message && (
                  <p className="mt-1 text-sm opacity-80">{message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Timer display */}
                <span
                  className="text-xs font-mono opacity-60 min-w-[24px] text-right"
                  aria-label={`${formatTime(timeRemaining)} remaining to undo`}
                >
                  {formatTime(timeRemaining)}
                </span>

                {/* Undo button */}
                <button
                  type="button"
                  onClick={handleUndo}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md',
                    'transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500',
                    styles.undoButton
                  )}
                  aria-label="Undo action"
                >
                  Undo
                </button>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={handleDismiss}
                  className={cn(
                    'p-1.5 rounded-md',
                    'transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500',
                    styles.dismissButton
                  )}
                  aria-label="Dismiss notification"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Paused indicator */}
            {isPaused && (
              <p className="mt-2 text-xs opacity-50" aria-live="polite">
                Timer paused
              </p>
            )}
          </div>

          {/* Screen reader announcement for time remaining */}
          <div className="sr-only" role="timer" aria-live="off">
            {formatTime(timeRemaining)} remaining to undo
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

RollbackToast.displayName = 'RollbackToast';

export default RollbackToast;
