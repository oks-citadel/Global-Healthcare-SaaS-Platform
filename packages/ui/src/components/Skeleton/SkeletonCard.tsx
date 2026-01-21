/**
 * Skeleton Card Component
 * Card-shaped placeholder with configurable content areas
 */

import React from 'react';
import { Skeleton, SkeletonProps } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import { SkeletonAvatar } from './SkeletonAvatar';
import { cn } from '../../utils/cn';

export interface SkeletonCardProps extends Omit<SkeletonProps, 'variant'> {
  hasAvatar?: boolean;
  hasImage?: boolean;
  imageHeight?: number;
  lines?: number;
  hasActions?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasAvatar = false,
  hasImage = false,
  imageHeight = 200,
  lines = 3,
  hasActions = false,
  className,
  animation = 'pulse',
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden',
        className
      )}
      role="status"
      aria-label="Loading card..."
    >
      {hasImage && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={imageHeight}
          animation={animation}
          aria-hidden="true"
        />
      )}

      <div className="p-4 space-y-4">
        {hasAvatar && (
          <div className="flex items-center gap-3">
            <SkeletonAvatar size="md" animation={animation} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height={16} animation={animation} aria-hidden="true" />
              <Skeleton variant="text" width="40%" height={12} animation={animation} aria-hidden="true" />
            </div>
          </div>
        )}

        <SkeletonText lines={lines} animation={animation} />

        {hasActions && (
          <div className="flex gap-2 pt-2">
            <Skeleton variant="rounded" width={80} height={36} animation={animation} aria-hidden="true" />
            <Skeleton variant="rounded" width={80} height={36} animation={animation} aria-hidden="true" />
          </div>
        )}
      </div>

      <span className="sr-only">Loading card content...</span>
    </div>
  );
};

SkeletonCard.displayName = 'SkeletonCard';
