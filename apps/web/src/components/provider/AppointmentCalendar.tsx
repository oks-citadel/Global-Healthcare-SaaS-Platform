'use client';

import React, { useState, useMemo } from 'react';
import { ProviderAppointment, TimeSlot } from '@/types/provider';

interface AppointmentCalendarProps {
  weekStart: Date;
  appointments: ProviderAppointment[];
  timeSlots?: Record<string, TimeSlot[]>;
  onAppointmentClick?: (appointment: ProviderAppointment) => void;
  onTimeSlotClick?: (date: string, timeSlot: TimeSlot) => void;
  workingHours?: { start: number; end: number };
}

export default function AppointmentCalendar({
  weekStart,
  appointments,
  timeSlots,
  onAppointmentClick,
  onTimeSlotClick,
  workingHours = { start: 8, end: 18 },
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate week days
  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekStart]);

  // Generate time slots
  const hours = useMemo(() => {
    const slots = [];
    for (let i = workingHours.start; i < workingHours.end; i++) {
      slots.push(i);
    }
    return slots;
  }, [workingHours]);

  // Get appointments for a specific date and hour
  const getAppointmentsForSlot = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      const aptDateStr = aptDate.toISOString().split('T')[0];
      const aptHour = aptDate.getHours();
      return aptDateStr === dateStr && aptHour === hour;
    });
  };

  // Format time
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  // Get status color
  const getStatusColor = (status: ProviderAppointment['status']) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
      'checked-in': 'bg-green-100 text-green-800 border-green-300',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      'no-show': 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return colors[status] || colors.scheduled;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="bg-gray-50 p-4 border-r border-gray-200">
          <span className="text-sm font-medium text-gray-500">Time</span>
        </div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`p-4 text-center border-r border-gray-200 ${
              isWeekend(day) ? 'bg-gray-50' : 'bg-white'
            } ${isToday(day) ? 'bg-blue-50' : ''}`}
          >
            <div className="text-xs font-medium text-gray-500">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div
              className={`text-lg font-semibold mt-1 ${
                isToday(day) ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {day.getDate()}
            </div>
            <div className="text-xs text-gray-500">
              {day.toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="overflow-auto max-h-[600px]">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200">
            {/* Time Column */}
            <div className="bg-gray-50 p-2 border-r border-gray-200 text-center">
              <span className="text-xs font-medium text-gray-600">
                {formatTime(hour)}
              </span>
            </div>

            {/* Day Columns */}
            {weekDays.map((day, dayIndex) => {
              const dayAppointments = getAppointmentsForSlot(day, hour);
              const dateStr = day.toISOString().split('T')[0];
              const dayTimeSlots = timeSlots?.[dateStr] || [];
              const hourSlot = dayTimeSlots.find((slot) => {
                const slotHour = parseInt(slot.startTime.split(':')[0]);
                return slotHour === hour;
              });

              return (
                <div
                  key={dayIndex}
                  className={`min-h-[80px] p-1 border-r border-gray-200 ${
                    isWeekend(day) ? 'bg-gray-50' : 'bg-white'
                  } ${
                    hourSlot && !hourSlot.isAvailable
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  } cursor-pointer transition-colors`}
                  onClick={() => {
                    if (hourSlot && onTimeSlotClick) {
                      onTimeSlotClick(dateStr, hourSlot);
                    }
                  }}
                >
                  {dayAppointments.length > 0 ? (
                    <div className="space-y-1">
                      {dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onAppointmentClick) {
                              onAppointmentClick(apt);
                            }
                          }}
                          className={`rounded p-1.5 border cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor(
                            apt.status
                          )}`}
                        >
                          <div className="text-xs font-medium truncate">
                            {apt.patientName}
                          </div>
                          <div className="text-xs truncate opacity-75">
                            {apt.reason}
                          </div>
                          <div className="text-xs opacity-75 mt-0.5">
                            {new Date(apt.dateTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      {hourSlot && !hourSlot.isAvailable && (
                        <span className="text-xs text-gray-400">Unavailable</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
            <span className="text-gray-600">Checked In</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
            <span className="text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WeekNavigatorProps {
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekNavigator({ currentWeek, onWeekChange }: WeekNavigatorProps) {
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    onWeekChange(startOfWeek);
  };

  const weekEnd = new Date(currentWeek);
  weekEnd.setDate(currentWeek.getDate() + 6);

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {currentWeek.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}{' '}
        -{' '}
        {weekEnd.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </h2>
      <div className="flex space-x-2">
        <button
          onClick={goToPreviousWeek}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Previous
        </button>
        <button
          onClick={goToToday}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Today
        </button>
        <button
          onClick={goToNextWeek}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
