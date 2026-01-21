/**
 * Patient Card Skeleton
 * Loading placeholder for patient information cards
 */

import React from 'react';
import { Skeleton } from '../Skeleton';
import { SkeletonAvatar } from '../SkeletonAvatar';
import { cn } from '../../../utils/cn';

export interface PatientCardSkeletonProps {
  className?: string;
  showVitals?: boolean;
  showActions?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
}

export const PatientCardSkeleton: React.FC<PatientCardSkeletonProps> = ({
  className,
  showVitals = true,
  showActions = true,
  animation = 'pulse',
}) => {
  return (
    <div
      className={cn(
        'p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        className
      )}
      role="status"
      aria-label="Loading patient information..."
    >
      {/* Patient header */}
      <div className="flex items-start gap-4 mb-4">
        <SkeletonAvatar size="xl" animation={animation} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height={24} animation={animation} aria-hidden="true" />
          <div className="flex gap-4">
            <Skeleton variant="text" width={80} height={14} animation={animation} aria-hidden="true" />
            <Skeleton variant="text" width={100} height={14} animation={animation} aria-hidden="true" />
          </div>
          <div className="flex gap-2 pt-1">
            <Skeleton variant="rounded" width={60} height={22} animation={animation} aria-hidden="true" />
            <Skeleton variant="rounded" width={80} height={22} animation={animation} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-2 gap-3 py-4 border-t border-gray-100 dark:border-gray-700">
        <div className="space-y-1">
          <Skeleton variant="text" width={50} height={10} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={130} height={14} animation={animation} aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <Skeleton variant="text" width={40} height={10} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={110} height={14} animation={animation} aria-hidden="true" />
        </div>
        <div className="col-span-2 space-y-1">
          <Skeleton variant="text" width={50} height={10} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width="80%" height={14} animation={animation} aria-hidden="true" />
        </div>
      </div>

      {/* Vitals summary */}
      {showVitals && (
        <div className="grid grid-cols-4 gap-3 py-4 border-t border-gray-100 dark:border-gray-700">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton variant="text" width={40} height={10} animation={animation} aria-hidden="true" className="mx-auto" />
              <Skeleton variant="text" width={50} height={20} animation={animation} aria-hidden="true" className="mx-auto" />
              <Skeleton variant="text" width={30} height={10} animation={animation} aria-hidden="true" className="mx-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Skeleton variant="rounded" width="100%" height={40} animation={animation} aria-hidden="true" />
          <Skeleton variant="rounded" width={40} height={40} animation={animation} aria-hidden="true" />
          <Skeleton variant="rounded" width={40} height={40} animation={animation} aria-hidden="true" />
        </div>
      )}

      <span className="sr-only">Loading patient information...</span>
    </div>
  );
};

PatientCardSkeleton.displayName = 'PatientCardSkeleton';
