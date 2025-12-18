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
