/**
 * Skeleton Loading Components
 * Comprehensive loading placeholder system for healthcare applications
 */

// Base components
export { Skeleton, type SkeletonProps } from './Skeleton';
export { SkeletonText, type SkeletonTextProps } from './SkeletonText';
export { SkeletonAvatar, type SkeletonAvatarProps } from './SkeletonAvatar';
export { SkeletonCard, type SkeletonCardProps } from './SkeletonCard';
export { SkeletonTable, type SkeletonTableProps } from './SkeletonTable';

// Healthcare-specific components
export {
  AppointmentSkeleton,
  PatientCardSkeleton,
  VitalsSkeleton,
  LabResultSkeleton,
  type AppointmentSkeletonProps,
  type PatientCardSkeletonProps,
  type VitalsSkeletonProps,
  type LabResultSkeletonProps,
} from './healthcare';

// Hooks
export {
  useSkeleton,
  useSkeletonGroup,
  type UseSkeletonOptions,
  type UseSkeletonReturn,
  type UseSkeletonGroupOptions,
  type UseSkeletonGroupReturn,
} from './hooks/useSkeleton';
