'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { Calendar, Clock, User, Video, MapPin, Plus, List, CalendarDays, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { Appointment, AppointmentFilters } from '@/types';
import { appointmentsApi } from '@/lib/api';

type ViewMode = 'calendar' | 'list';

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));

  // API state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: AppointmentFilters = {
        startDate: format(currentWeek, 'yyyy-MM-dd'),
        endDate: format(addDays(currentWeek, 6), 'yyyy-MM-dd'),
      };

      const response = await appointmentsApi.getAppointments(1, 100, filters);
      setAppointments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentWeek]);

  const handleRetry = () => {
    fetchAppointments();
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const timeSlots = Array.from({ length: 18 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

  const getAppointmentsForSlot = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const slotHour = parseInt(time.split(':')[0]);

    return appointments.filter((apt) => {
      const aptDate = apt.startTime.split('T')[0];
      const aptTimeStr = apt.startTime.split('T')[1] || '';
      const aptHour = parseInt(aptTimeStr.split(':')[0]);

      return aptDate === dateStr && aptHour === slotHour;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'telehealth':
        return <Video className="h-4 w-4" />;
      case 'in_person':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatAppointmentTime = (startTime: string) => {
    try {
      return format(new Date(startTime), 'h:mm a');
    } catch {
      return 'N/A';
    }
  };

  const formatAppointmentDate = (startTime: string) => {
    try {
      return format(new Date(startTime), 'd');
    } catch {
      return 'N/A';
    }
  };

  const formatAppointmentMonth = (startTime: string) => {
    try {
      return format(new Date(startTime), 'MMM');
    } catch {
      return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your appointment schedule</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarDays className="h-4 w-4 inline mr-2" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4 inline mr-2" />
                List
              </button>
            </div>
            <Button variant="primary">
              <Plus className="h-5 w-5 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Loading appointments...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Appointments</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Calendar View */}
        {!loading && !error && viewMode === 'calendar' && (
          <Card padding="none">
            {/* Week Navigation */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Previous Week
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {format(currentWeek, 'MMMM d')} - {format(addDays(currentWeek, 6), 'MMMM d, yyyy')}
              </h2>
              <button
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Next Week
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* Day Headers */}
                <div className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-4 text-sm font-medium text-gray-500">Time</div>
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={`p-4 text-center ${
                        format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                          ? 'bg-primary-50'
                          : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">{format(day, 'EEE')}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{format(day, 'd')}</p>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="divide-y divide-gray-200">
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-8">
                      <div className="p-4 text-sm text-gray-500 border-r border-gray-200">
                        {time}
                      </div>
                      {weekDays.map((day) => {
                        const slotAppointments = getAppointmentsForSlot(day, time);
                        return (
                          <div
                            key={`${day.toISOString()}-${time}`}
                            className="p-2 border-r border-gray-200 min-h-[80px] hover:bg-gray-50 cursor-pointer"
                          >
                            {slotAppointments.map((apt) => (
                              <div
                                key={apt.id}
                                className={`p-2 rounded-lg text-xs mb-1 ${
                                  apt.type === 'telehealth'
                                    ? 'bg-purple-100 border-l-2 border-purple-500'
                                    : 'bg-blue-100 border-l-2 border-blue-500'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-gray-900">
                                    {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Patient'}
                                  </span>
                                  {getTypeIcon(apt.type)}
                                </div>
                                <p className="text-gray-600">{apt.reason}</p>
                                <Badge variant={getStatusColor(apt.status)} size="sm" className="mt-1">
                                  {apt.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* List View */}
        {!loading && !error && viewMode === 'list' && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No appointments for this week</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatAppointmentDate(appointment.startTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatAppointmentMonth(appointment.startTime)}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.patient
                            ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                            : 'Patient'}
                        </h3>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatAppointmentTime(appointment.startTime)} ({appointment.duration} min)
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            {getTypeIcon(appointment.type)}
                            <span className="ml-1 capitalize">{appointment.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
