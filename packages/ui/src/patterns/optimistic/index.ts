/**
 * Optimistic UI Patterns Library
 *
 * A comprehensive library for implementing optimistic updates in healthcare applications.
 * Provides generic hooks for optimistic mutations with automatic rollback, undo functionality,
 * and specialized hooks for healthcare-specific workflows.
 *
 * @packageDocumentation
 * @module @healthcare/ui/patterns/optimistic
 *
 * @example
 * ```tsx
 * import {
 *   OptimisticProvider,
 *   useOptimisticMutation,
 *   useOptimisticAppointment,
 *   useOptimisticPrescription,
 *   useOptimisticMessage,
 * } from '@healthcare/ui/patterns/optimistic';
 *
 * // Wrap your app with the provider
 * function App() {
 *   return (
 *     <OptimisticProvider toastPosition="bottom-right">
 *       <YourApp />
 *     </OptimisticProvider>
 *   );
 * }
 * ```
 */

// ============================================================================
// Core Optimistic Mutation Hook
// ============================================================================

export {
  useOptimisticMutation,
  type OptimisticMutationOptions,
  type MutationStatus,
  type UseOptimisticMutationReturn,
} from './useOptimisticMutation';

// ============================================================================
// Provider and Context
// ============================================================================

export {
  OptimisticProvider,
  useOptimisticContext,
  useRequiredOptimisticContext,
  type OptimisticProviderProps,
  type OptimisticContextValue,
  type PendingMutation,
  type UndoToastOptions,
  type ToastPosition,
} from './OptimisticProvider';

// ============================================================================
// Rollback Toast Component
// ============================================================================

export {
  RollbackToast,
  type RollbackToastProps,
} from './RollbackToast';

// ============================================================================
// Healthcare-Specific Hooks
// ============================================================================

// Appointment Hook
export {
  useOptimisticAppointment,
  type Appointment,
  type AppointmentStatus,
  type AppointmentType,
  type BookAppointmentVariables,
  type RescheduleAppointmentVariables,
  type CancelAppointmentVariables,
  type SlotConflict,
  type AppointmentContext,
  type UseOptimisticAppointmentOptions,
  type UseOptimisticAppointmentReturn,
} from './healthcare/useOptimisticAppointment';

// Prescription Hook
export {
  useOptimisticPrescription,
  type PrescriptionRequest,
  type PrescriptionStatus,
  type DrugSchedule,
  type RequestPrescriptionVariables,
  type RequestRefillVariables,
  type CancelPrescriptionVariables,
  type UpdatePharmacyVariables,
  type Pharmacy,
  type PrescriptionContext,
  type UseOptimisticPrescriptionOptions,
  type UseOptimisticPrescriptionReturn,
} from './healthcare/useOptimisticPrescription';

// Message Hook
export {
  useOptimisticMessage,
  type SecureMessage,
  type MessageStatus,
  type MessagePriority,
  type MessageAttachment,
  type AttachmentType,
  type PendingAttachment,
  type SendMessageVariables,
  type EditMessageVariables,
  type DeleteMessageVariables,
  type MarkAsReadVariables,
  type MessageContext,
  type UploadProgress,
  type UseOptimisticMessageOptions,
  type UseOptimisticMessageReturn,
} from './healthcare/useOptimisticMessage';
