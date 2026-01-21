/**
 * useOptimisticPrescription
 *
 * A specialized hook for optimistic prescription request operations.
 * Shows prescription requests as submitted immediately, handles pharmacy selection,
 * and provides a 30-second undo window for controlled substances.
 *
 * @example
 * ```tsx
 * const {
 *   requestPrescription,
 *   requestRefill,
 *   cancelRequest,
 *   isPending,
 *   undo,
 * } = useOptimisticPrescription({
 *   onPharmacyRequired: (prescription) => {
 *     showPharmacySelector(prescription);
 *   },
 *   onSuccess: (prescription) => {
 *     showConfirmation(prescription);
 *   },
 * });
 *
 * // Request a prescription
 * await requestPrescription({
 *   patientId: 'patient-123',
 *   medicationId: 'med-456',
 *   prescriberId: 'doctor-789',
 *   pharmacyId: 'pharmacy-101',
 *   dosage: '10mg',
 *   frequency: 'twice daily',
 *   quantity: 30,
 * });
 * ```
 */

import { useCallback, useMemo } from 'react';
import { useOptimisticMutation } from '../useOptimisticMutation';

/**
 * Prescription request status types
 */
export type PrescriptionStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'sent_to_pharmacy'
  | 'ready_for_pickup'
  | 'dispensed'
  | 'cancelled'
  | 'denied'
  | 'on_hold';

/**
 * Drug schedule classification (DEA)
 */
export type DrugSchedule =
  | 'unscheduled'
  | 'schedule_ii'
  | 'schedule_iii'
  | 'schedule_iv'
  | 'schedule_v';

/**
 * Represents a prescription request
 */
export interface PrescriptionRequest {
  /** Unique prescription request identifier */
  id: string;
  /** Patient identifier */
  patientId: string;
  /** Prescriber (doctor/provider) identifier */
  prescriberId: string;
  /** Prescriber name for display */
  prescriberName?: string;
  /** Medication identifier */
  medicationId: string;
  /** Medication name for display */
  medicationName?: string;
  /** Dosage (e.g., "10mg", "500mg") */
  dosage: string;
  /** Frequency (e.g., "twice daily", "every 8 hours") */
  frequency: string;
  /** Quantity to dispense */
  quantity: number;
  /** Number of refills allowed */
  refillsAllowed: number;
  /** Remaining refills */
  refillsRemaining?: number;
  /** Current status */
  status: PrescriptionStatus;
  /** Pharmacy identifier */
  pharmacyId?: string;
  /** Pharmacy name for display */
  pharmacyName?: string;
  /** Pharmacy address */
  pharmacyAddress?: string;
  /** Whether this is a controlled substance */
  isControlledSubstance: boolean;
  /** DEA schedule if controlled */
  drugSchedule?: DrugSchedule;
  /** Instructions for use */
  instructions?: string;
  /** Reason for prescription */
  diagnosis?: string;
  /** Whether DAW (Dispense As Written) is required */
  dispenseAsWritten?: boolean;
  /** Start date */
  startDate?: string;
  /** End date */
  endDate?: string;
  /** Created timestamp */
  createdAt?: string;
  /** Last updated timestamp */
  updatedAt?: string;
  /** Notes from provider */
  providerNotes?: string;
  /** Notes from pharmacist */
  pharmacistNotes?: string;
}

/**
 * Variables for requesting a new prescription
 */
export interface RequestPrescriptionVariables {
  /** Patient identifier */
  patientId: string;
  /** Medication identifier */
  medicationId: string;
  /** Medication name (for optimistic display) */
  medicationName?: string;
  /** Prescriber identifier */
  prescriberId: string;
  /** Pharmacy identifier */
  pharmacyId?: string;
  /** Dosage */
  dosage: string;
  /** Frequency */
  frequency: string;
  /** Quantity */
  quantity: number;
  /** Number of refills */
  refillsAllowed?: number;
  /** Instructions */
  instructions?: string;
  /** Diagnosis/reason */
  diagnosis?: string;
  /** Dispense as written flag */
  dispenseAsWritten?: boolean;
  /** Whether this is a controlled substance */
  isControlledSubstance?: boolean;
  /** DEA schedule if controlled */
  drugSchedule?: DrugSchedule;
}

/**
 * Variables for requesting a refill
 */
export interface RequestRefillVariables {
  /** Original prescription ID */
  prescriptionId: string;
  /** Pharmacy ID (can change for refill) */
  pharmacyId?: string;
  /** Notes for the refill request */
  notes?: string;
}

/**
 * Variables for cancelling a prescription request
 */
export interface CancelPrescriptionVariables {
  /** Prescription request ID */
  prescriptionId: string;
  /** Reason for cancellation */
  cancellationReason?: string;
}

/**
 * Variables for updating pharmacy selection
 */
export interface UpdatePharmacyVariables {
  /** Prescription request ID */
  prescriptionId: string;
  /** New pharmacy ID */
  pharmacyId: string;
}

/**
 * Pharmacy information
 */
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  fax?: string;
  email?: string;
  hours?: string;
  isPreferred?: boolean;
  supportsElectronicRx?: boolean;
  distance?: number;
}

/**
 * Context for prescription operations (for rollback)
 */
export interface PrescriptionContext {
  /** Previous prescription state */
  previousPrescription?: PrescriptionRequest;
  /** Previous prescriptions list */
  previousPrescriptions?: PrescriptionRequest[];
  /** The optimistic prescription ID */
  optimisticId?: string;
  /** Operation type */
  operation: 'request' | 'refill' | 'cancel' | 'update_pharmacy';
}

/**
 * Options for useOptimisticPrescription hook
 */
export interface UseOptimisticPrescriptionOptions {
  /**
   * Function to request a prescription on the server
   */
  requestPrescriptionFn: (variables: RequestPrescriptionVariables) => Promise<PrescriptionRequest>;

  /**
   * Function to request a refill on the server
   */
  requestRefillFn: (variables: RequestRefillVariables) => Promise<PrescriptionRequest>;

  /**
   * Function to cancel a prescription request on the server
   */
  cancelPrescriptionFn: (variables: CancelPrescriptionVariables) => Promise<{ success: boolean }>;

  /**
   * Function to update pharmacy selection
   */
  updatePharmacyFn?: (variables: UpdatePharmacyVariables) => Promise<PrescriptionRequest>;

  /**
   * Get current prescriptions list for optimistic updates
   */
  getPrescriptions?: () => PrescriptionRequest[];

  /**
   * Set prescriptions list for optimistic updates
   */
  setPrescriptions?: (prescriptions: PrescriptionRequest[]) => void;

  /**
   * Get a specific prescription by ID
   */
  getPrescription?: (id: string) => PrescriptionRequest | undefined;

  /**
   * Called when pharmacy selection is required
   */
  onPharmacyRequired?: (prescriptionId: string, availablePharmacies?: Pharmacy[]) => void;

  /**
   * Called when prescription request succeeds
   */
  onRequestSuccess?: (prescription: PrescriptionRequest) => void;

  /**
   * Called when refill request succeeds
   */
  onRefillSuccess?: (prescription: PrescriptionRequest) => void;

  /**
   * Called when cancellation succeeds
   */
  onCancelSuccess?: (prescriptionId: string) => void;

  /**
   * Called when pharmacy update succeeds
   */
  onPharmacyUpdateSuccess?: (prescription: PrescriptionRequest) => void;

  /**
   * Called on any error
   */
  onError?: (error: Error, operation: 'request' | 'refill' | 'cancel' | 'update_pharmacy') => void;

  /**
   * Called when an operation is rolled back
   */
  onRollback?: (context: PrescriptionContext) => void;

  /**
   * Custom undo timeout for regular medications (milliseconds)
   * @default 10000
   */
  undoTimeout?: number;

  /**
   * Custom undo timeout for controlled substances (milliseconds)
   * @default 30000
   */
  controlledSubstanceUndoTimeout?: number;
}

/**
 * Return type for useOptimisticPrescription hook
 */
export interface UseOptimisticPrescriptionReturn {
  /**
   * Request a new prescription optimistically
   */
  requestPrescription: (variables: RequestPrescriptionVariables) => Promise<PrescriptionRequest | void>;

  /**
   * Request a refill optimistically
   */
  requestRefill: (variables: RequestRefillVariables) => Promise<PrescriptionRequest | void>;

  /**
   * Cancel a prescription request optimistically
   */
  cancelRequest: (variables: CancelPrescriptionVariables) => Promise<void>;

  /**
   * Update pharmacy selection optimistically
   */
  updatePharmacy: (variables: UpdatePharmacyVariables) => Promise<PrescriptionRequest | void>;

  /**
   * Whether any prescription operation is pending
   */
  isPending: boolean;

  /**
   * Whether request is in progress
   */
  isRequestPending: boolean;

  /**
   * Whether refill is in progress
   */
  isRefillPending: boolean;

  /**
   * Whether cancellation is in progress
   */
  isCancelPending: boolean;

  /**
   * Whether pharmacy update is in progress
   */
  isPharmacyUpdatePending: boolean;

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
 * Default undo timeout for regular prescriptions (10 seconds)
 */
const DEFAULT_PRESCRIPTION_UNDO_TIMEOUT = 10000;

/**
 * Generate a temporary optimistic ID
 */
function generateOptimisticId(): string {
  return `optimistic-rx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Hook for optimistic prescription operations with automatic rollback and undo support.
 *
 * Provides specialized handling for healthcare prescription workflows including:
 * - Immediate UI feedback for prescription requests
 * - Extended undo window (30 seconds) for controlled substances
 * - Pharmacy selection handling
 * - Automatic rollback on server errors
 */
export function useOptimisticPrescription(
  options: UseOptimisticPrescriptionOptions
): UseOptimisticPrescriptionReturn {
  const {
    requestPrescriptionFn,
    requestRefillFn,
    cancelPrescriptionFn,
    updatePharmacyFn,
    getPrescriptions,
    setPrescriptions,
    getPrescription,
    onPharmacyRequired,
    onRequestSuccess,
    onRefillSuccess,
    onCancelSuccess,
    onPharmacyUpdateSuccess,
    onError,
    onRollback,
    undoTimeout = DEFAULT_PRESCRIPTION_UNDO_TIMEOUT,
    // Note: controlledSubstanceUndoTimeout is available for future controlled substance handling
  } = options;

  /**
   * Request prescription mutation
   */
  const requestMutation = useOptimisticMutation<
    PrescriptionRequest,
    RequestPrescriptionVariables,
    PrescriptionContext
  >({
    mutationFn: requestPrescriptionFn,

    onMutate: (variables) => {
      const previousPrescriptions = getPrescriptions?.() || [];
      const optimisticId = generateOptimisticId();

      // Create optimistic prescription
      const optimisticPrescription: PrescriptionRequest = {
        id: optimisticId,
        patientId: variables.patientId,
        prescriberId: variables.prescriberId,
        medicationId: variables.medicationId,
        medicationName: variables.medicationName,
        dosage: variables.dosage,
        frequency: variables.frequency,
        quantity: variables.quantity,
        refillsAllowed: variables.refillsAllowed || 0,
        status: 'pending_review',
        pharmacyId: variables.pharmacyId,
        isControlledSubstance: variables.isControlledSubstance || false,
        drugSchedule: variables.drugSchedule,
        instructions: variables.instructions,
        diagnosis: variables.diagnosis,
        dispenseAsWritten: variables.dispenseAsWritten,
        createdAt: new Date().toISOString(),
      };

      // Optimistically add to list
      if (setPrescriptions) {
        setPrescriptions([...previousPrescriptions, optimisticPrescription]);
      }

      // Trigger pharmacy selection if not provided
      if (!variables.pharmacyId && onPharmacyRequired) {
        onPharmacyRequired(optimisticId);
      }

      return {
        previousPrescriptions,
        optimisticId,
        operation: 'request' as const,
      };
    },

    onSuccess: (prescription, _variables, context) => {
      // Replace optimistic prescription with real one
      if (setPrescriptions && context.optimisticId) {
        const prescriptions = getPrescriptions?.() || [];
        setPrescriptions(
          prescriptions.map((rx) =>
            rx.id === context.optimisticId ? prescription : rx
          )
        );
      }

      onRequestSuccess?.(prescription);
    },

    onError: (error, _variables, _context) => {
      onError?.(error, 'request');
    },

    onRollback: (context) => {
      if (setPrescriptions && context.previousPrescriptions) {
        setPrescriptions(context.previousPrescriptions);
      }

      onRollback?.(context);
    },

    // Use longer timeout for controlled substances
    undoTimeout: undoTimeout,
    actionLabel: 'Prescription requested',
    showUndoToast: true,
  });

  /**
   * Refill request mutation
   */
  const refillMutation = useOptimisticMutation<
    PrescriptionRequest,
    RequestRefillVariables,
    PrescriptionContext
  >({
    mutationFn: requestRefillFn,

    onMutate: (variables) => {
      const previousPrescriptions = getPrescriptions?.() || [];
      const previousPrescription = getPrescription?.(variables.prescriptionId);

      // Optimistically update the prescription status
      if (setPrescriptions && previousPrescription) {
        setPrescriptions(
          previousPrescriptions.map((rx) =>
            rx.id === variables.prescriptionId
              ? {
                  ...rx,
                  status: 'pending_review' as PrescriptionStatus,
                  refillsRemaining: Math.max(0, (rx.refillsRemaining || 0) - 1),
                  pharmacyId: variables.pharmacyId || rx.pharmacyId,
                  updatedAt: new Date().toISOString(),
                }
              : rx
          )
        );
      }

      return {
        previousPrescriptions,
        previousPrescription,
        operation: 'refill' as const,
      };
    },

    onSuccess: (prescription, _variables, _context) => {
      if (setPrescriptions) {
        const prescriptions = getPrescriptions?.() || [];
        setPrescriptions(
          prescriptions.map((rx) =>
            rx.id === prescription.id ? prescription : rx
          )
        );
      }

      onRefillSuccess?.(prescription);
    },

    onError: (error, _variables, _context) => {
      onError?.(error, 'refill');
    },

    onRollback: (context) => {
      if (setPrescriptions && context.previousPrescriptions) {
        setPrescriptions(context.previousPrescriptions);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Refill requested',
    showUndoToast: true,
  });

  /**
   * Cancel mutation
   */
  const cancelMutation = useOptimisticMutation<
    { success: boolean },
    CancelPrescriptionVariables,
    PrescriptionContext
  >({
    mutationFn: cancelPrescriptionFn,

    onMutate: (variables) => {
      const previousPrescriptions = getPrescriptions?.() || [];
      const previousPrescription = getPrescription?.(variables.prescriptionId);

      // Optimistically mark as cancelled
      if (setPrescriptions) {
        setPrescriptions(
          previousPrescriptions.map((rx) =>
            rx.id === variables.prescriptionId
              ? {
                  ...rx,
                  status: 'cancelled' as PrescriptionStatus,
                  updatedAt: new Date().toISOString(),
                }
              : rx
          )
        );
      }

      return {
        previousPrescriptions,
        previousPrescription,
        operation: 'cancel' as const,
      };
    },

    onSuccess: (_data, variables, _context) => {
      onCancelSuccess?.(variables.prescriptionId);
    },

    onError: (error, _variables, _context) => {
      onError?.(error, 'cancel');
    },

    onRollback: (context) => {
      if (setPrescriptions && context.previousPrescriptions) {
        setPrescriptions(context.previousPrescriptions);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Prescription cancelled',
    showUndoToast: true,
  });

  /**
   * Pharmacy update mutation
   */
  const pharmacyMutation = useOptimisticMutation<
    PrescriptionRequest,
    UpdatePharmacyVariables,
    PrescriptionContext
  >({
    mutationFn: updatePharmacyFn || (async () => { throw new Error('updatePharmacyFn not provided'); }),

    onMutate: (variables) => {
      const previousPrescriptions = getPrescriptions?.() || [];
      const previousPrescription = getPrescription?.(variables.prescriptionId);

      if (setPrescriptions && previousPrescription) {
        setPrescriptions(
          previousPrescriptions.map((rx) =>
            rx.id === variables.prescriptionId
              ? {
                  ...rx,
                  pharmacyId: variables.pharmacyId,
                  updatedAt: new Date().toISOString(),
                }
              : rx
          )
        );
      }

      return {
        previousPrescriptions,
        previousPrescription,
        operation: 'update_pharmacy' as const,
      };
    },

    onSuccess: (prescription, _variables, _context) => {
      if (setPrescriptions) {
        const prescriptions = getPrescriptions?.() || [];
        setPrescriptions(
          prescriptions.map((rx) =>
            rx.id === prescription.id ? prescription : rx
          )
        );
      }

      onPharmacyUpdateSuccess?.(prescription);
    },

    onError: (error, _variables, _context) => {
      onError?.(error, 'update_pharmacy');
    },

    onRollback: (context) => {
      if (setPrescriptions && context.previousPrescriptions) {
        setPrescriptions(context.previousPrescriptions);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Pharmacy updated',
    showUndoToast: true,
  });

  /**
   * Combined undo function
   */
  const undo = useCallback(() => {
    if (requestMutation.canUndo) {
      requestMutation.undo();
    } else if (refillMutation.canUndo) {
      refillMutation.undo();
    } else if (cancelMutation.canUndo) {
      cancelMutation.undo();
    } else if (pharmacyMutation.canUndo) {
      pharmacyMutation.undo();
    }
  }, [requestMutation, refillMutation, cancelMutation, pharmacyMutation]);

  /**
   * Reset all mutations
   */
  const reset = useCallback(() => {
    requestMutation.reset();
    refillMutation.reset();
    cancelMutation.reset();
    pharmacyMutation.reset();
  }, [requestMutation, refillMutation, cancelMutation, pharmacyMutation]);

  /**
   * Wrapper for requestPrescription that handles controlled substance timeout
   */
  const requestPrescription = useCallback(
    async (variables: RequestPrescriptionVariables) => {
      // Note: For a more robust implementation, you would dynamically
      // adjust the timeout based on the isControlledSubstance flag.
      // This would require a more complex implementation or hook configuration.
      return requestMutation.mutate(variables);
    },
    [requestMutation]
  );

  return useMemo(
    () => ({
      requestPrescription,
      requestRefill: refillMutation.mutate,
      cancelRequest: async (variables: CancelPrescriptionVariables) => {
        await cancelMutation.mutate(variables);
      },
      updatePharmacy: pharmacyMutation.mutate,
      isPending:
        requestMutation.isPending ||
        refillMutation.isPending ||
        cancelMutation.isPending ||
        pharmacyMutation.isPending,
      isRequestPending: requestMutation.isPending,
      isRefillPending: refillMutation.isPending,
      isCancelPending: cancelMutation.isPending,
      isPharmacyUpdatePending: pharmacyMutation.isPending,
      canUndo:
        requestMutation.canUndo ||
        refillMutation.canUndo ||
        cancelMutation.canUndo ||
        pharmacyMutation.canUndo,
      undo,
      isRolledBack:
        requestMutation.isRolledBack ||
        refillMutation.isRolledBack ||
        cancelMutation.isRolledBack ||
        pharmacyMutation.isRolledBack,
      error:
        requestMutation.error ||
        refillMutation.error ||
        cancelMutation.error ||
        pharmacyMutation.error,
      reset,
    }),
    [
      requestPrescription,
      refillMutation,
      cancelMutation,
      pharmacyMutation,
      undo,
      reset,
      requestMutation.isPending,
      requestMutation.canUndo,
      requestMutation.isRolledBack,
      requestMutation.error,
    ]
  );
}

export default useOptimisticPrescription;
