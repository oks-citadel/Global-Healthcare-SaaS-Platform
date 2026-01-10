export { useAuth } from './useAuth';
export {
  useAppointments,
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
  useUpcomingAppointments,
  usePastAppointments,
} from './useAppointments';

// Socket.io and Real-time hooks
export {
  useSocket,
  useChatMessages,
  useNotifications,
  usePresence,
} from './useSocket';

// Offline sync hooks
export {
  useOfflineSync,
  useCachedData,
  useOptimisticUpdate,
  useOfflineIndicator,
} from './useOfflineSync';

// Provider/Doctor hooks
export {
  useProviderSearch,
  useProvider,
  useProviderAvailability,
  useTimeSlots,
  useSpecialties,
  useFeaturedProviders,
  useNearbyProviders,
  useFavoriteProvider,
  useFavoriteProviders,
  useProviderReviews,
  useSubmitReview,
} from './useProviders';

// Booking flow hooks
export {
  useBookingState,
  useBookAppointment,
  useRescheduleAppointment,
  useCheckIn,
  useJoinAppointment,
  useRequestCallback,
  usePreVisitQuestionnaire,
} from './useBooking';

// Medical records and prescriptions hooks
export {
  useMedicalRecords,
  useMedicalRecord,
  useRecordsByType,
  useLabResults,
  useImagingRecords,
  useImmunizations,
  useDownloadRecord,
  useShareRecord,
  usePrescriptions,
  usePrescription,
  useRequestRefill,
  useUpdatePharmacy,
  useNearbyPharmacies,
  usePatientProfile,
  useUpdateProfile,
  useAllergies,
  useAddAllergy,
  useRemoveAllergy,
  useVitalSigns,
  useLogVitals,
  useHealthSummary,
} from './useMedicalRecords';

// Messaging hooks
export {
  useConversations,
  useConversation,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useCreateConversation,
  useArchiveConversation,
  usePinConversation,
  useDeleteMessage,
  useEditMessage,
  useRealtimeMessages,
  useUnreadCount,
  useSearchMessages,
} from './useMessaging';

// Billing and payment hooks
export {
  useSubscription,
  useSubscriptionPlans,
  useSubscribe,
  useChangePlan,
  useCancelSubscription,
  useResumeSubscription,
  usePaymentMethods,
  useAddPaymentMethod,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
  useInvoices,
  useInvoice,
  useDownloadInvoice,
  usePayInvoice,
  useBillingPortal,
  useSetupIntent,
  useUsageSummary,
  useBillingHistory,
} from './useBilling';

// Push notification hooks
export {
  usePushNotificationRegistration,
  useNotificationListeners,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useNotificationHistory,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useUnregisterPushNotifications,
  useScheduleLocalNotification,
  useCancelScheduledNotification,
  useBadgeCount,
  useSetBadgeCount,
} from './usePushNotifications';
