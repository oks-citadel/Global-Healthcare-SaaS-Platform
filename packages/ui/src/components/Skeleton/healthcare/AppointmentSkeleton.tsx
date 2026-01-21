/**
 * Appointment Card Skeleton
 * Healthcare-specific loading placeholder for appointment cards
 */

import React from 'react';
import { Skeleton } from '../Skeleton';
import { SkeletonAvatar } from '../SkeletonAvatar';
import { cn } from '../../../utils/cn';

export interface AppointmentSkeletonProps {
  className?: string;
  variant?: 'compact' | 'detailed';
  animation?: 'pulse' | 'wave' | 'none';
}

export const AppointmentSkeleton: React.FC<AppointmentSkeletonProps> = ({
  className,
  variant = 'compact',
  animation = 'pulse',
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
          className
        )}
        role="status"
        aria-label="Loading appointment..."
      >
        {/* Time indicator */}
        <div className="flex flex-col items-center w-16">
          <Skeleton variant="text" width={48} height={20} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={32} height={14} animation={animation} aria-hidden="true" className="mt-1" />
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />

        {/* Provider info */}
        <div className="flex items-center gap-3 flex-1">
          <SkeletonAvatar size="md" animation={animation} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" height={16} animation={animation} aria-hidden="true" />
            <Skeleton variant="text" width="50%" height={12} animation={animation} aria-hidden="true" />
          </div>
        </div>

        {/* Status badge */}
        <Skeleton variant="rounded" width={80} height={24} animation={animation} aria-hidden="true" />

        <span className="sr-only">Loading appointment details...</span>
      </div>
    );
  }

  // Detailed variant
  return (
    <div
      className={cn(
        'p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4',
        className
      )}
      role="status"
      aria-label="Loading appointment details..."
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <SkeletonAvatar size="lg" animation={animation} />
          <div className="space-y-2">
            <Skeleton variant="text" width={180} height={20} animation={animation} aria-hidden="true" />
            <Skeleton variant="text" width={140} height={14} animation={animation} aria-hidden="true" />
            <Skeleton variant="text" width={100} height={12} animation={animation} aria-hidden="true" />
          </div>
        </div>
        <Skeleton variant="rounded" width={100} height={32} animation={animation} aria-hidden="true" />
      </div>

      {/* Appointment details */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="space-y-1">
          <Skeleton variant="text" width={60} height={12} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={120} height={16} animation={animation} aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <Skeleton variant="text" width={60} height={12} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={100} height={16} animation={animation} aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <Skeleton variant="text" width={80} height={12} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={160} height={16} animation={animation} aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <Skeleton variant="text" width={40} height={12} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={80} height={16} animation={animation} aria-hidden="true" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rounded" width={120} height={40} animation={animation} aria-hidden="true" />
        <Skeleton variant="rounded" width={100} height={40} animation={animation} aria-hidden="true" />
        <Skeleton variant="rounded" width={80} height={40} animation={animation} aria-hidden="true" />
      </div>

      <span className="sr-only">Loading detailed appointment information...</span>
    </div>
  );
};

AppointmentSkeleton.displayName = 'AppointmentSkeleton';
