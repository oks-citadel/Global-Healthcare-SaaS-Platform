'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal } from '@/components/ui';
import { Clock, Plus, Save, X, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ProviderSchedule, AvailabilityException } from '@/types';
import { scheduleApi } from '@/lib/api';

export default function SchedulePage() {
  const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);

  // API state
  const [weeklySchedule, setWeeklySchedule] = useState<ProviderSchedule[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<AvailabilityException[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Day names for display
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const [scheduleData, exceptionsData] = await Promise.all([
        scheduleApi.getSchedule(),
        scheduleApi.getExceptions(),
      ]);

      // If no schedule data exists, create default schedule
      if (scheduleData.length === 0) {
        const defaultSchedule: ProviderSchedule[] = dayNames.map((_, index) => ({
          id: `schedule-${index}`,
          providerId: '',
          dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          startTime: index >= 1 && index <= 5 ? '09:00' : '',
          endTime: index >= 1 && index <= 5 ? '17:00' : '',
          isAvailable: index >= 1 && index <= 5,
          slotDuration: 30,
        }));
        setWeeklySchedule(defaultSchedule);
      } else {
        setWeeklySchedule(scheduleData);
      }

      setBlockedTimes(exceptionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedule');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleRetry = () => {
    fetchSchedule();
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      await scheduleApi.updateSchedule(weeklySchedule);
      // Show success message or feedback
    } catch (err) {
      console.error('Error saving schedule:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleDayAvailability = (dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((schedule) =>
        schedule.dayOfWeek === dayIndex
          ? { ...schedule, isAvailable: !schedule.isAvailable }
          : schedule
      )
    );
  };

  const updateScheduleTime = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setWeeklySchedule((prev) =>
      prev.map((schedule) =>
        schedule.dayOfWeek === dayIndex ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const updateSlotDuration = (dayIndex: number, value: number) => {
    setWeeklySchedule((prev) =>
      prev.map((schedule) =>
        schedule.dayOfWeek === dayIndex ? { ...schedule, slotDuration: value } : schedule
      )
    );
  };

  const handleDeleteException = async (exceptionId: string) => {
    try {
      await scheduleApi.deleteException(exceptionId);
      setBlockedTimes((prev) => prev.filter((block) => block.id !== exceptionId));
    } catch (err) {
      console.error('Error deleting exception:', err);
    }
  };

  const BlockTimeModal = () => {
    const [formData, setFormData] = useState({
      type: 'unavailable' as 'unavailable' | 'custom_hours',
      date: '',
      startTime: '',
      endTime: '',
      reason: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (!formData.date || !formData.reason) return;

      setSubmitting(true);
      try {
        const newException = await scheduleApi.createException({
          date: formData.date,
          startTime: formData.type === 'custom_hours' ? formData.startTime : undefined,
          endTime: formData.type === 'custom_hours' ? formData.endTime : undefined,
          reason: formData.reason,
          type: formData.type,
        });
        setBlockedTimes((prev) => [...prev, newException]);
        setShowBlockTimeModal(false);
      } catch (err) {
        console.error('Error creating exception:', err);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Block Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="unavailable">Full Day Unavailable</option>
            <option value="custom_hours">Custom Hours</option>
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        {formData.type === 'custom_hours' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>
        )}

        <Input
          label="Reason"
          placeholder="e.g., Conference, Personal leave"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
        />

        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowBlockTimeModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Block
          </Button>
        </div>
      </div>
    );
  };

  // Calculate stats from the schedule
  const workingDays = weeklySchedule.filter((s) => s.isAvailable).length;
  const avgHoursPerDay = weeklySchedule
    .filter((s) => s.isAvailable && s.startTime && s.endTime)
    .reduce((sum, s) => {
      const start = parseInt(s.startTime.split(':')[0]) || 0;
      const end = parseInt(s.endTime.split(':')[0]) || 0;
      return sum + (end - start);
    }, 0) / (workingDays || 1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule & Availability</h1>
            <p className="text-gray-600 mt-1">Manage your working hours and availability</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowBlockTimeModal(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Block Time
            </Button>
            <Button variant="primary" onClick={handleSaveSchedule} disabled={saving}>
              {saving ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Loading schedule...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Schedule</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Working Days</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {workingDays}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Hours/Day</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{Math.round(avgHoursPerDay)}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Blocked Days</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {blockedTimes.filter((t) => t.type === 'unavailable').length}
                    </p>
                  </div>
                  <X className="h-8 w-8 text-red-600" />
                </div>
              </Card>
            </div>

            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklySchedule.map((schedule) => (
                    <div
                      key={schedule.dayOfWeek}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        schedule.isAvailable
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <label className="flex items-center min-w-[120px]">
                          <input
                            type="checkbox"
                            checked={schedule.isAvailable}
                            onChange={() => toggleDayAvailability(schedule.dayOfWeek)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                          />
                          <span className="font-medium text-gray-900">{dayNames[schedule.dayOfWeek]}</span>
                        </label>

                        {schedule.isAvailable ? (
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-600">From:</label>
                              <input
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => updateScheduleTime(schedule.dayOfWeek, 'startTime', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-600">To:</label>
                              <input
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => updateScheduleTime(schedule.dayOfWeek, 'endTime', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-600">Slot Duration:</label>
                              <select
                                value={schedule.slotDuration}
                                onChange={(e) => updateSlotDuration(schedule.dayOfWeek, parseInt(e.target.value))}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              >
                                <option value={15}>15 min</option>
                                <option value={30}>30 min</option>
                                <option value={45}>45 min</option>
                                <option value={60}>60 min</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Not available</span>
                        )}
                      </div>

                      {schedule.isAvailable && (
                        <Badge variant="success">Available</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blocked Times */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Blocked Times & Exceptions</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBlockTimeModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Block
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockedTimes.map((block) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <X className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{block.reason}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(block.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                            {block.startTime && block.endTime && (
                              <> - {block.startTime} - {block.endTime}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={block.type === 'unavailable' ? 'danger' : 'warning'}>
                          {block.type === 'unavailable' ? 'Full Day' : 'Partial'}
                        </Badge>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteException(block.id)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {blockedTimes.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No blocked times</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Accepting New Patients</h4>
                      <p className="text-sm text-gray-600">Allow new patients to book appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Auto-Confirm Appointments</h4>
                      <p className="text-sm text-gray-600">
                        Automatically confirm appointments without manual review
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Buffer Time Between Appointments</h4>
                      <p className="text-sm text-gray-600">Add buffer time between consecutive appointments</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value={0}>No buffer</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Block Time Modal */}
      <Modal
        isOpen={showBlockTimeModal}
        onClose={() => setShowBlockTimeModal(false)}
        title="Block Time"
        size="md"
      >
        <BlockTimeModal />
      </Modal>
    </DashboardLayout>
  );
}
