'use client';

import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

type AriaPoliteness = 'polite' | 'assertive' | 'off';
type AriaRelevant = 'additions' | 'removals' | 'text' | 'all';

interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: AriaPoliteness;
  atomic?: boolean;
  relevant?: AriaRelevant;
  className?: string;
  visuallyHidden?: boolean;
}

/**
 * LiveRegion Component
 *
 * Provides a way to announce dynamic content changes to screen readers
 * using ARIA live regions. Essential for notifications, status updates,
 * and dynamic content changes.
 *
 * WCAG 2.1 Success Criteria:
 * - 4.1.3 Status Messages (Level AA)
 *
 * Politeness levels:
 * - 'polite': Announces after current speech (default, least disruptive)
 * - 'assertive': Interrupts current speech (use sparingly)
 * - 'off': Disables announcements
 *
 * @example
 * ```tsx
 * // Status message
 * <LiveRegion politeness="polite">
 *   Profile updated successfully
 * </LiveRegion>
 *
 * // Error message (more urgent)
 * <LiveRegion politeness="assertive">
 *   Error: Please correct the form errors
 * </LiveRegion>
 *
 * // Visually hidden announcement
 * <LiveRegion visuallyHidden>
 *   Loading complete, 10 items found
 * </LiveRegion>
 * ```
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'additions text',
  className,
  visuallyHidden = false,
}) => {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={clsx(
        visuallyHidden && [
          'absolute overflow-hidden whitespace-nowrap',
          'w-px h-px p-0 -m-px border-0',
          '[clip-path:inset(50%)] [clip:rect(0,0,0,0)]',
        ],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Announcer Component
 *
 * A specialized live region for programmatic announcements.
 * Maintains a queue of announcements and ensures they are properly
 * announced by screen readers.
 *
 * @example
 * ```tsx
 * const announcer = useAnnouncer();
 *
 * const handleSave = async () => {
 *   await saveData();
 *   announcer.announce('Data saved successfully');
 * };
 *
 * return <Announcer ref={announcer.ref} />;
 * ```
 */
interface AnnouncerProps {
  className?: string;
}

export const Announcer = React.forwardRef<HTMLDivElement, AnnouncerProps>(
  ({ className }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={clsx(
          'absolute overflow-hidden whitespace-nowrap',
          'w-px h-px p-0 -m-px border-0',
          '[clip-path:inset(50%)] [clip:rect(0,0,0,0)]',
          className
        )}
      />
    );
  }
);

Announcer.displayName = 'Announcer';

/**
 * useAnnouncer Hook
 *
 * Provides a simple API for making announcements to screen readers.
 * Creates a live region and manages announcement timing to ensure
 * screen readers pick up changes.
 *
 * @example
 * ```tsx
 * const { announce, clear } = useAnnouncer();
 *
 * const handleAction = () => {
 *   // Perform action
 *   announce('Action completed successfully');
 * };
 *
 * const handleError = () => {
 *   announce('Error occurred', 'assertive');
 * };
 * ```
 */
export const useAnnouncer = () => {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<AriaPoliteness>('polite');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const announce = (
    newMessage: string,
    newPoliteness: AriaPoliteness = 'polite'
  ) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear the message first to ensure the change is detected
    setMessage('');
    setPoliteness(newPoliteness);

    // Set the new message after a brief delay
    timeoutRef.current = setTimeout(() => {
      setMessage(newMessage);
    }, 100);
  };

  const clear = () => {
    setMessage('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    announce,
    clear,
    message,
    politeness,
    LiveRegion: () => (
      <LiveRegion politeness={politeness} visuallyHidden>
        {message}
      </LiveRegion>
    ),
  };
};

/**
 * StatusMessage Component
 *
 * A convenience component for common status messages with built-in styling.
 * Automatically uses appropriate ARIA roles and politeness levels.
 *
 * @example
 * ```tsx
 * <StatusMessage type="success">
 *   Profile updated successfully
 * </StatusMessage>
 *
 * <StatusMessage type="error">
 *   Please correct the errors in the form
 * </StatusMessage>
 *
 * <StatusMessage type="info" icon={<InfoIcon />}>
 *   5 new messages
 * </StatusMessage>
 * ```
 */
interface StatusMessageProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  icon?: React.ReactNode;
  className?: string;
  visuallyHidden?: boolean;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  children,
  type = 'info',
  icon,
  className,
  visuallyHidden = false,
}) => {
  const roleMap = {
    success: 'status' as const,
    error: 'alert' as const,
    warning: 'alert' as const,
    info: 'status' as const,
  };

  const politenessMap = {
    success: 'polite' as const,
    error: 'assertive' as const,
    warning: 'assertive' as const,
    info: 'polite' as const,
  };

  const colorMap = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div
      role={roleMap[type]}
      aria-live={politenessMap[type]}
      aria-atomic="true"
      className={clsx(
        !visuallyHidden && [
          'flex items-start gap-3 p-4 rounded-lg border',
          colorMap[type],
        ],
        visuallyHidden && [
          'absolute overflow-hidden whitespace-nowrap',
          'w-px h-px p-0 -m-px border-0',
          '[clip-path:inset(50%)] [clip:rect(0,0,0,0)]',
        ],
        className
      )}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default LiveRegion;
