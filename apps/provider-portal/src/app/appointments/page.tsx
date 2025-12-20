'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { Calendar, Clock, User, Video, MapPin, Plus, List, CalendarDays } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';

type ViewMode = 'calendar' | 'list';

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));

  // Mock appointments data
  const appointments = [
    {
      id: '1',
      time: '09:00 AM',
      duration: 30,
      patient: 'John Smith',
      type: 'in_person',
      status: 'confirmed',
      reason: 'Annual Check-up',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '2',
      time: '09:30 AM',
      duration: 30,
      patient: 'Sarah Johnson',
      type: 'telehealth',
      status: 'confirmed',
      reason: 'Follow-up Consultation',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '3',
      time: '10:00 AM',
      duration: 45,
      patient: 'Michael Brown',
      type: 'in_person',
      status: 'pending',
      reason: 'New Patient Visit',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '4',
      time: '11:00 AM',
      duration: 30,
      patient: 'Emily Davis',
      type: 'in_person',
      status: 'confirmed',
      reason: 'Lab Results Review',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    },
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const timeSlots = Array.from({ length: 18 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

  const getAppointmentsForSlot = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter((apt) => {
      const aptTime = apt.time.split(' ')[0];
      const aptHour = parseInt(aptTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      const aptAmPm = apt.time.includes('PM') ? 'PM' : 'AM';

      let adjustedAptHour = aptHour;
      if (aptAmPm === 'PM' && aptHour !== 12) {
        adjustedAptHour += 12;
      } else if (aptAmPm === 'AM' && aptHour === 12) {
        adjustedAptHour = 0;
      }

      return apt.date === dateStr && adjustedAptHour === slotHour;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
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

        {/* Calendar View */}
        {viewMode === 'calendar' && (
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
                                  <span className="font-medium text-gray-900">{apt.patient}</span>
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
        {viewMode === 'list' && (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {format(new Date(appointment.date), 'd')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(appointment.date), 'MMM')}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time} ({appointment.duration} min)
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
