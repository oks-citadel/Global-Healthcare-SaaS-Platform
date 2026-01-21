/**
 * useOptimisticAppointment
 *
 * A specialized hook for optimistic appointment booking and management.
 * Immediately shows appointments as confirmed while the server processes,
 * handles slot conflicts gracefully, and provides a 10-second undo window.
 *
 * @example
 * ```tsx
 * const {
 *   bookAppointment,
 *   rescheduleAppointment,
 *   cancelAppointment,
 *   isPending,
 *   undo,
 * } = useOptimisticAppointment({
 *   onSlotConflict: (conflict) => {
 *     showAlternativeSlots(conflict.suggestedSlots);
 *   },
 *   onSuccess: (appointment) => {
 *     showConfirmation(appointment);
 *   },
 * });
 *
 * // Book an appointment
 * await bookAppointment({
 *   patientId: 'patient-123',
 *   providerId: 'doctor-456',
 *   slotId: 'slot-789',
 *   appointmentType: 'checkup',
 *   notes: 'Annual physical',
 * });
 * ```
 */

import { useCallback, useMemo } from 'react';
import { useOptimisticMutation } from '../useOptimisticMutation';

/**
 * Appointment status types
 */
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

/**
 * Appointment type categories
 */
export type AppointmentType =
  | 'checkup'
  | 'follow_up'
  | 'consultation'
  | 'procedure'
  | 'telehealth'
  | 'urgent_care'
  | 'specialist'
  | 'lab_work'
  | 'imaging'
  | 'therapy'
  | 'other';

/**
 * Represents an appointment
 */
export interface Appointment {
  /** Unique appointment identifier */
  id: string;
  /** Patient identifier */
  patientId: string;
  /** Healthcare provider identifier */
  providerId: string;
  /** Provider name for display */
  providerName?: string;
  /** Appointment start time (ISO 8601) */
  startTime: string;
  /** Appointment end time (ISO 8601) */
  endTime: string;
  /** Current status */
  status: AppointmentStatus;
  /** Type of appointment */
  appointmentType: AppointmentType;
  /** Location or room */
  location?: string;
  /** Additional notes */
  notes?: string;
  /** Whether this is a telehealth appointment */
  isTelehealth?: boolean;
  /** Telehealth meeting URL */
  telehealthUrl?: string;
  /** Reason for visit */
  reasonForVisit?: string;
  /** Insurance information */
  insuranceId?: string;
  /** Created timestamp */
  createdAt?: string;
  /** Last updated timestamp */
  updatedAt?: string;
}

/**
 * Variables for booking a new appointment
 */
export interface BookAppointmentVariables {
  /** Patient identifier */
  patientId: string;
  /** Healthcare provider identifier */
  providerId: string;
  /** Slot identifier to book */
  slotId: string;
  /** Type of appointment */
  appointmentType: AppointmentType;
  /** Additional notes */
  notes?: string;
  /** Reason for visit */
  reasonForVisit?: string;
  /** Insurance identifier */
  insuranceId?: string;
  /** Whether this is a telehealth appointment */
  isTelehealth?: boolean;
}

/**
 * Variables for rescheduling an appointment
 */
export interface RescheduleAppointmentVariables {
  /** Existing appointment identifier */
  appointmentId: string;
  /** New slot identifier */
  newSlotId: string;
  /** Reason for reschedule */
  rescheduleReason?: string;
}

/**
 * Variables for cancelling an appointment
 */
export interface CancelAppointmentVariables {
  /** Appointment identifier */
  appointmentId: string;
  /** Reason for cancellation */
  cancellationReason?: string;
  /** Whether to notify the provider */
  notifyProvider?: boolean;
}

/**
 * Slot conflict information
 */
export interface SlotConflict {
  /** The conflicting slot ID */
  conflictingSlotId: string;
  /** Reason for conflict */
  reason: 'already_booked' | 'provider_unavailable' | 'outside_hours' | 'too_short_notice';
  /** Suggested alternative slots */
  suggestedSlots?: {
    slotId: string;
    startTime: string;
    endTime: string;
    providerId: string;
    providerName?: string;
  }[];
  /** Human-readable message */
  message: string;
}

/**
 * Context for appointment operations (for rollback)
 */
export interface AppointmentContext {
  /** Previous appointment state (for updates/cancellations) */
  previousAppointment?: Appointment;
  /** Previous appointments list */
  previousAppointments?: Appointment[];
  /** The optimistic appointment ID */
  optimisticId?: string;
  /** Operation type */
  operation: 'book' | 'reschedule' | 'cancel';
}

/**
 * Options for useOptimisticAppointment hook
 */
export interface UseOptimisticAppointmentOptions {
  /**
   * Function to book an appointment on the server
   */
  bookAppointmentFn: (variables: BookAppointmentVariables) => Promise<Appointment>;

  /**
   * Function to reschedule an appointment on the server
   */
  rescheduleAppointmentFn: (variables: RescheduleAppointmentVariables) => Promise<Appointment>;

  /**
   * Function to cancel an appointment on the server
   */
  cancelAppointmentFn: (variables: CancelAppointmentVariables) => Promise<{ success: boolean }>;

  /**
   * Get current appointments list for optimistic updates
   */
  getAppointments?: () => Appointment[];

  /**
   * Set appointments list for optimistic updates
   */
  setAppointments?: (appointments: Appointment[]) => void;

  /**
   * Get a specific appointment by ID
   */
  getAppointment?: (id: string) => Appointment | undefined;

  /**
   * Called when a slot conflict is detected
   */
  onSlotConflict?: (conflict: SlotConflict) => void;

  /**
   * Called when booking succeeds
   */
  onBookSuccess?: (appointment: Appointment) => void;

  /**
   * Called when reschedule succeeds
   */
  onRescheduleSuccess?: (appointment: Appointment) => void;

  /**
   * Called when cancellation succeeds
   */
  onCancelSuccess?: (appointmentId: string) => void;

  /**
   * Called on any error
   */
  onError?: (error: Error, operation: 'book' | 'reschedule' | 'cancel') => void;

  /**
   * Called when an operation is rolled back
   */
  onRollback?: (context: AppointmentContext) => void;

  /**
   * Custom undo timeout in milliseconds
   * @default 10000
   */
  undoTimeout?: number;
}

/**
 * Return type for useOptimisticAppointment hook
 */
export interface UseOptimisticAppointmentReturn {
  /**
   * Book a new appointment optimistically
   */
  bookAppointment: (variables: BookAppointmentVariables) => Promise<Appointment | void>;

  /**
   * Reschedule an existing appointment optimistically
   */
  rescheduleAppointment: (variables: RescheduleAppointmentVariables) => Promise<Appointment | void>;

  /**
   * Cancel an appointment optimistically
   */
  cancelAppointment: (variables: CancelAppointmentVariables) => Promise<void>;

  /**
   * Whether any appointment operation is pending
   */
  isPending: boolean;

  /**
   * Whether booking is in progress
   */
  isBookingPending: boolean;

  /**
   * Whether rescheduling is in progress
   */
  isReschedulingPending: boolean;

  /**
   * Whether cancellation is in progress
   */
  isCancellingPending: boolean;

  /**
   * Whether an undo is available
   */
  canUndo: boolean;

  /**
   * Undo the last operation
   */
  undo: () => void;

  /**
   * Whether the last operation was rolled back
   */
  isRolledBack: boolean;

  /**
   * The last error that occurred
   */
  error: Error | null;

  /**
   * Reset all mutation states
   */
  reset: () => void;
}

/**
 * Default undo timeout for appointments (10 seconds)
 */
const DEFAULT_APPOINTMENT_UNDO_TIMEOUT = 10000;

/**
 * Generate a temporary optimistic ID
 */
function generateOptimisticId(): string {
  return `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Hook for optimistic appointment operations with automatic rollback and undo support.
 *
 * Provides specialized handling for healthcare appointment workflows including:
 * - Immediate UI feedback for booking/rescheduling/cancellation
 * - Graceful slot conflict handling with alternatives
 * - 10-second undo window for all operations
 * - Automatic rollback on server errors
 */
export function useOptimisticAppointment(
  options: UseOptimisticAppointmentOptions
): UseOptimisticAppointmentReturn {
  const {
    bookAppointmentFn,
    rescheduleAppointmentFn,
    cancelAppointmentFn,
    getAppointments,
    setAppointments,
    getAppointment,
    onSlotConflict,
    onBookSuccess,
    onRescheduleSuccess,
    onCancelSuccess,
    onError,
    onRollback,
    undoTimeout = DEFAULT_APPOINTMENT_UNDO_TIMEOUT,
  } = options;

  /**
   * Check if error is a slot conflict
   */
  const handleSlotConflictError = useCallback(
    (error: Error): boolean => {
      // Check if this is a slot conflict error (customize based on your API)
      if (
        error.message.includes('slot') ||
        error.message.includes('conflict') ||
        error.message.includes('unavailable')
      ) {
        // Parse conflict details if available
        const conflict: SlotConflict = {
          conflictingSlotId: '',
          reason: 'already_booked',
          message: error.message,
        };

        onSlotConflict?.(conflict);
        return true;
      }
      return false;
    },
    [onSlotConflict]
  );

  /**
   * Booking mutation
   */
  const bookMutation = useOptimisticMutation<
    Appointment,
    BookAppointmentVariables,
    AppointmentContext
  >({
    mutationFn: bookAppointmentFn,

    onMutate: (variables) => {
      // Capture previous state
      const previousAppointments = getAppointments?.() || [];
      const optimisticId = generateOptimisticId();

      // Create optimistic appointment
      const optimisticAppointment: Appointment = {
        id: optimisticId,
        patientId: variables.patientId,
        providerId: variables.providerId,
        startTime: new Date().toISOString(), // Will be replaced by actual time
        endTime: new Date().toISOString(),
        status: 'confirmed',
        appointmentType: variables.appointmentType,
        notes: variables.notes,
        reasonForVisit: variables.reasonForVisit,
        isTelehealth: variables.isTelehealth,
        createdAt: new Date().toISOString(),
      };

      // Optimistically add to list
      if (setAppointments) {
        setAppointments([...previousAppointments, optimisticAppointment]);
      }

      return {
        previousAppointments,
        optimisticId,
        operation: 'book' as const,
      };
    },

    onSuccess: (appointment, _variables, context) => {
      // Replace optimistic appointment with real one
      if (setAppointments && context.optimisticId) {
        const appointments = getAppointments?.() || [];
        setAppointments(
          appointments.map((apt) =>
            apt.id === context.optimisticId ? appointment : apt
          )
        );
      }

      onBookSuccess?.(appointment);
    },

    onError: (error, _variables, _context) => {
      handleSlotConflictError(error);
      onError?.(error, 'book');
    },

    onRollback: (context) => {
      // Restore previous appointments list
      if (setAppointments && context.previousAppointments) {
        setAppointments(context.previousAppointments);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Appointment booked',
    showUndoToast: true,
  });

  /**
   * Reschedule mutation
   */
  const rescheduleMutation = useOptimisticMutation<
    Appointment,
    RescheduleAppointmentVariables,
    AppointmentContext
  >({
    mutationFn: rescheduleAppointmentFn,

    onMutate: (variables) => {
      const previousAppointments = getAppointments?.() || [];
      const previousAppointment = getAppointment?.(variables.appointmentId);

      // Optimistically update the appointment
      if (setAppointments && previousAppointment) {
        setAppointments(
          previousAppointments.map((apt) =>
            apt.id === variables.appointmentId
              ? {
                  ...apt,
                  status: 'confirmed' as AppointmentStatus,
                  updatedAt: new Date().toISOString(),
                }
              : apt
          )
        );
      }

      return {
        previousAppointments,
        previousAppointment,
        operation: 'reschedule' as const,
      };
    },

    onSuccess: (appointment, _variables, _context) => {
      // Update with actual rescheduled appointment
      if (setAppointments) {
        const appointments = getAppointments?.() || [];
        setAppointments(
          appointments.map((apt) =>
            apt.id === appointment.id ? appointment : apt
          )
        );
      }

      onRescheduleSuccess?.(appointment);
    },

    onError: (error, _variables, _context) => {
      handleSlotConflictError(error);
      onError?.(error, 'reschedule');
    },

    onRollback: (context) => {
      if (setAppointments && context.previousAppointments) {
        setAppointments(context.previousAppointments);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Appointment rescheduled',
    showUndoToast: true,
  });

  /**
   * Cancel mutation
   */
  const cancelMutation = useOptimisticMutation<
    { success: boolean },
    CancelAppointmentVariables,
    AppointmentContext
  >({
    mutationFn: cancelAppointmentFn,

    onMutate: (variables) => {
      const previousAppointments = getAppointments?.() || [];
      const previousAppointment = getAppointment?.(variables.appointmentId);

      // Optimistically mark as cancelled
      if (setAppointments) {
        setAppointments(
          previousAppointments.map((apt) =>
            apt.id === variables.appointmentId
              ? {
                  ...apt,
                  status: 'cancelled' as AppointmentStatus,
                  updatedAt: new Date().toISOString(),
                }
              : apt
          )
        );
      }

      return {
        previousAppointments,
        previousAppointment,
        operation: 'cancel' as const,
      };
    },

    onSuccess: (_data, variables, _context) => {
      onCancelSuccess?.(variables.appointmentId);
    },

    onError: (error, _variables, _context) => {
      onError?.(error, 'cancel');
    },

    onRollback: (context) => {
      if (setAppointments && context.previousAppointments) {
        setAppointments(context.previousAppointments);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Appointment cancelled',
    showUndoToast: true,
  });

  /**
   * Combined undo function
   */
  const undo = useCallback(() => {
    if (bookMutation.canUndo) {
      bookMutation.undo();
    } else if (rescheduleMutation.canUndo) {
      rescheduleMutation.undo();
    } else if (cancelMutation.canUndo) {
      cancelMutation.undo();
    }
  }, [bookMutation, rescheduleMutation, cancelMutation]);

  /**
   * Reset all mutations
   */
  const reset = useCallback(() => {
    bookMutation.reset();
    rescheduleMutation.reset();
    cancelMutation.reset();
  }, [bookMutation, rescheduleMutation, cancelMutation]);

  return useMemo(
    () => ({
      bookAppointment: bookMutation.mutate,
      rescheduleAppointment: rescheduleMutation.mutate,
      cancelAppointment: async (variables: CancelAppointmentVariables) => {
        await cancelMutation.mutate(variables);
      },
      isPending:
        bookMutation.isPending ||
        rescheduleMutation.isPending ||
        cancelMutation.isPending,
      isBookingPending: bookMutation.isPending,
      isReschedulingPending: rescheduleMutation.isPending,
      isCancellingPending: cancelMutation.isPending,
      canUndo:
        bookMutation.canUndo ||
        rescheduleMutation.canUndo ||
        cancelMutation.canUndo,
      undo,
      isRolledBack:
        bookMutation.isRolledBack ||
        rescheduleMutation.isRolledBack ||
        cancelMutation.isRolledBack,
      error: bookMutation.error || rescheduleMutation.error || cancelMutation.error,
      reset,
    }),
    [bookMutation, rescheduleMutation, cancelMutation, undo, reset]
  );
}

export default useOptimisticAppointment;
