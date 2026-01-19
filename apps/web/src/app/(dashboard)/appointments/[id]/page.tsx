'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Appointment } from '@/types';
import { formatDateTime, cn } from '@/lib/utils';

// API functions
const appointmentsApi = {
  getAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },
  cancelAppointment: async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
  },
  rescheduleAppointment: async ({
    id,
    dateTime,
  }: {
    id: string;
    dateTime: string;
  }): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, {
      dateTime,
      status: 'scheduled',
    });
    return response.data;
  },
};

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const appointmentId = params?.id as string;
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDateTime, setNewDateTime] = useState('');

  const {
    data: appointment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentsApi.getAppointment(appointmentId),
    enabled: !!appointmentId,
  });

  const cancelMutation = useMutation({
    mutationFn: () => appointmentsApi.cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      router.push('/appointments');
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: (dateTime: string) =>
      appointmentsApi.rescheduleAppointment({ id: appointmentId, dateTime }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      setShowReschedule(false);
      setNewDateTime('');
    },
  });

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelMutation.mutate();
    }
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDateTime) {
      rescheduleMutation.mutate(newDateTime);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case 'phone':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        );
      case 'in-person':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-6">
        <Link
          href="/appointments"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Appointments
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800">
            Appointment not found
          </h3>
          <p className="mt-2 text-sm text-red-600">
            The appointment you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/appointments"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            View All Appointments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/appointments"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Appointments
      </Link>

      {/* Appointment Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getTypeIcon(appointment.type)}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dr. {appointment.doctorName}
                  </h1>
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      getStatusColor(appointment.status)
                    )}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-gray-600">{appointment.specialty}</p>
              </div>
            </div>

            {appointment.status === 'scheduled' && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowReschedule(!showReschedule)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reschedule Form */}
        {showReschedule && (
          <div className="border-t border-gray-200 px-6 py-4 bg-blue-50">
            <form onSubmit={handleReschedule} className="flex items-end gap-4">
              <div className="flex-1">
                <label
                  htmlFor="newDateTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="newDateTime"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={rescheduleMutation.isPending || !newDateTime}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
              >
                {rescheduleMutation.isPending ? 'Saving...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReschedule(false);
                  setNewDateTime('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Appointment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date & Time */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Appointment Details
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatDateTime(appointment.dateTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {appointment.duration} minutes
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="mt-1 text-lg font-medium text-gray-900 capitalize">
                  {appointment.type.replace('-', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialty</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {appointment.specialty}
                </p>
              </div>
            </div>
          </div>

          {/* Reason & Notes */}
          {(appointment.reason || appointment.notes) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Additional Information
              </h2>
              {appointment.reason && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Reason for Visit</p>
                  <p className="mt-1 text-gray-900">{appointment.reason}</p>
                </div>
              )}
              {appointment.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="mt-1 text-gray-900">{appointment.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Video Call Join (if video appointment and scheduled) */}
          {appointment.type === 'video' && appointment.status === 'scheduled' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Video Call
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Join your video consultation when it&apos;s time for your appointment.
              </p>
              <Link
                href={`/visit/${appointment.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Join Video Call
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/appointments/book"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
              >
                Book Another Appointment
              </Link>
              <Link
                href="/messages"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Message Doctor
              </Link>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              If you have questions about your appointment, contact our support team.
            </p>
            <Link
              href="/contact"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
