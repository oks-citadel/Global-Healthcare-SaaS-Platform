import { useState } from 'react';
import { Appointment } from '@/types';
import { useCancelAppointment, useRescheduleAppointment } from '@/hooks/usePatient';

interface AppointmentCardProps {
  appointment: Appointment;
  showActions?: boolean;
}

export function AppointmentCard({ appointment, showActions = false }: AppointmentCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const cancelAppointment = useCancelAppointment();
  const rescheduleAppointment = useRescheduleAppointment();

  const appointmentDate = new Date(appointment.dateTime);
  const isPast = appointmentDate < new Date();
  const isUpcoming = !isPast && appointment.status === 'scheduled';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'no-show':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment.mutateAsync(appointment.id);
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Date Badge */}
          <div className="flex-shrink-0 text-center bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">
              {appointmentDate.getDate()}
            </div>
            <div className="text-xs text-blue-600 uppercase">
              {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dr. {appointment.doctorName}
                </h3>
                <p className="text-sm text-gray-600">{appointment.specialty}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {appointmentDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - {appointment.duration} min
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">{getAppointmentTypeIcon(appointment.type)}</span>
                <span className="capitalize">{appointment.type}</span>
              </div>

              <div className="flex items-start text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{appointment.reason}</span>
              </div>

              {appointment.notes && (
                <div className="text-sm text-gray-500 italic">
                  Note: {appointment.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && isUpcoming && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          {appointment.type === 'video' && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              Join Video Call
            </button>
          )}
          <button
            onClick={() => setShowCancelDialog(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Appointment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment with Dr. {appointment.doctorName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={cancelAppointment.isPending}
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={cancelAppointment.isPending}
              >
                {cancelAppointment.isPending ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
