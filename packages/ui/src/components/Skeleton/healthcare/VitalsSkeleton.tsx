/**
 * Vitals Skeleton
 * Loading placeholder for vital signs displays
 */

import React from 'react';
import { Skeleton } from '../Skeleton';
import { cn } from '../../../utils/cn';

export interface VitalsSkeletonProps {
  className?: string;
  layout?: 'grid' | 'row' | 'compact';
  showTrend?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
}

const VitalItemSkeleton: React.FC<{
  animation: 'pulse' | 'wave' | 'none';
  showTrend: boolean;
}> = ({ animation, showTrend }) => (
  <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
    <div className="flex items-start justify-between mb-2">
      <Skeleton variant="text" width={80} height={12} animation={animation} aria-hidden="true" />
      {showTrend && (
        <Skeleton variant="circular" width={20} height={20} animation={animation} aria-hidden="true" />
      )}
    </div>
    <div className="flex items-baseline gap-1">
      <Skeleton variant="text" width={60} height={32} animation={animation} aria-hidden="true" />
      <Skeleton variant="text" width={40} height={14} animation={animation} aria-hidden="true" />
    </div>
    {showTrend && (
      <div className="mt-2 flex items-center gap-2">
        <Skeleton variant="text" width={24} height={12} animation={animation} aria-hidden="true" />
        <Skeleton variant="text" width={60} height={10} animation={animation} aria-hidden="true" />
      </div>
    )}
  </div>
);

export const VitalsSkeleton: React.FC<VitalsSkeletonProps> = ({
  className,
  layout = 'grid',
  showTrend = true,
  animation = 'pulse',
}) => {
  const vitalCount = layout === 'compact' ? 4 : 6;

  const gridClass = {
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    row: 'flex flex-wrap gap-4',
    compact: 'grid grid-cols-4 gap-2',
  }[layout];

  return (
    <div
      className={cn(gridClass, className)}
      role="status"
      aria-label="Loading vital signs..."
    >
      {Array.from({ length: vitalCount }).map((_, i) => (
        <VitalItemSkeleton key={i} animation={animation} showTrend={showTrend && layout !== 'compact'} />
      ))}
      <span className="sr-only">Loading vital signs data...</span>
    </div>
  );
};

VitalsSkeleton.displayName = 'VitalsSkeleton';
