'use client';

import React, { useState, useMemo } from 'react';
import {
  useProviderAppointments,
  useWeeklySchedule,
  useProviderAvailability,
  useUpdateAvailability,
} from '@/hooks/useProvider';
import AppointmentCalendar, { WeekNavigator } from '@/components/provider/AppointmentCalendar';
import { ProviderAppointment } from '@/types/provider';

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });

  const [showAvailabilitySettings, setShowAvailabilitySettings] = useState(false);

  const weekStart = currentWeek.toISOString().split('T')[0];
  const weekEnd = useMemo(() => {
    const end = new Date(currentWeek);
    end.setDate(currentWeek.getDate() + 6);
    return end.toISOString().split('T')[0];
  }, [currentWeek]);

  const { data: appointmentsData, isLoading: appointmentsLoading } = useProviderAppointments({
    fromDate: weekStart,
    toDate: weekEnd,
    sortBy: 'dateTime',
    sortOrder: 'asc',
  });

  const { data: weeklySchedule, isLoading: scheduleLoading } = useWeeklySchedule(weekStart);
  const { data: availability, isLoading: availabilityLoading } = useProviderAvailability();
  const updateAvailability = useUpdateAvailability();

  const appointments = appointmentsData?.data || [];

  const handleAppointmentClick = (appointment: ProviderAppointment) => {
    window.location.href = `/provider/encounters/${appointment.encounterId || `new?appointmentId=${appointment.id}`}`;
  };

  const handleTimeSlotClick = (date: string, timeSlot: any) => {
    if (timeSlot.isAvailable) {
      // Navigate to create appointment
      window.location.href = `/provider/appointments/new?date=${date}&time=${timeSlot.startTime}`;
    }
  };

  const getWeekStats = () => {
    const scheduled = appointments.filter((apt) => apt.status === 'scheduled').length;
    const completed = appointments.filter((apt) => apt.status === 'completed').length;
    const cancelled = appointments.filter(
      (apt) => apt.status === 'cancelled' || apt.status === 'no-show'
    ).length;

    return { scheduled, completed, cancelled, total: appointments.length };
  };

  const stats = getWeekStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your appointments and availability
          </p>
        </div>
        <button
          onClick={() => setShowAvailabilitySettings(!showAvailabilitySettings)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Availability Settings
        </button>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total This Week
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Scheduled</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.scheduled}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Cancelled</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.cancelled}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Settings Modal */}
      {showAvailabilitySettings && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Availability Settings</h2>
            <button
              onClick={() => setShowAvailabilitySettings(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {availabilityLoading ? (
            <div className="flex justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Configure your weekly availability. These settings determine when patients can book
                appointments with you.
              </p>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 text-center">
                  Availability management interface coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Week Navigator */}
      <WeekNavigator currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

      {/* Calendar */}
      {appointmentsLoading || scheduleLoading ? (
        <div className="flex justify-center items-center py-12 bg-white shadow rounded-lg">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <AppointmentCalendar
          weekStart={currentWeek}
          appointments={appointments}
          timeSlots={weeklySchedule}
          onAppointmentClick={handleAppointmentClick}
          onTimeSlotClick={handleTimeSlotClick}
          workingHours={{ start: 8, end: 18 }}
        />
      )}

      {/* Upcoming Appointments List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
        </div>
        {appointments.filter((apt) => apt.status === 'scheduled').length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No upcoming appointments this week
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments
              .filter((apt) => apt.status === 'scheduled')
              .slice(0, 5)
              .map((appointment) => (
                <div key={appointment.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.patientName}
                      </p>
                      <div className="mt-1 flex items-center space-x-3">
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.dateTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-500">{appointment.duration} min</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                    </div>
                    <button
                      onClick={() => handleAppointmentClick(appointment)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
