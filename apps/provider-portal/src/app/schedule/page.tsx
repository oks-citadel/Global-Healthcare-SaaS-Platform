'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal } from '@/components/ui';
import { Clock, Plus, Save, X, Calendar } from 'lucide-react';

export default function SchedulePage() {
  const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);

  // Mock schedule data
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 0, dayName: 'Sunday', isAvailable: false, startTime: '', endTime: '', slotDuration: 30 },
    { day: 1, dayName: 'Monday', isAvailable: true, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
    { day: 2, dayName: 'Tuesday', isAvailable: true, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
    { day: 3, dayName: 'Wednesday', isAvailable: true, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
    { day: 4, dayName: 'Thursday', isAvailable: true, startTime: '09:00', endTime: '17:00', slotDuration: 30 },
    { day: 5, dayName: 'Friday', isAvailable: true, startTime: '09:00', endTime: '14:00', slotDuration: 30 },
    { day: 6, dayName: 'Saturday', isAvailable: false, startTime: '', endTime: '', slotDuration: 30 },
  ]);

  const [blockedTimes, setBlockedTimes] = useState([
    {
      id: '1',
      date: '2024-12-25',
      reason: 'Christmas Holiday',
      type: 'unavailable',
    },
    {
      id: '2',
      date: '2024-12-22',
      startTime: '12:00',
      endTime: '13:00',
      reason: 'Team Meeting',
      type: 'custom_hours',
    },
  ]);

  const toggleDayAvailability = (dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((schedule, index) =>
        index === dayIndex
          ? { ...schedule, isAvailable: !schedule.isAvailable }
          : schedule
      )
    );
  };

  const updateScheduleTime = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setWeeklySchedule((prev) =>
      prev.map((schedule, index) =>
        index === dayIndex ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const updateSlotDuration = (dayIndex: number, value: number) => {
    setWeeklySchedule((prev) =>
      prev.map((schedule, index) =>
        index === dayIndex ? { ...schedule, slotDuration: value } : schedule
      )
    );
  };

  const BlockTimeModal = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Block Type
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="unavailable">Full Day Unavailable</option>
            <option value="custom_hours">Custom Hours</option>
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="time"
          />
          <Input
            label="End Time"
            type="time"
          />
        </div>

        <Input
          label="Reason"
          placeholder="e.g., Conference, Personal leave"
          required
        />

        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowBlockTimeModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary">
            <Save className="h-4 w-4 mr-2" />
            Save Block
          </Button>
        </div>
      </div>
    );
  };

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
            <Button variant="primary">
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Working Days</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {weeklySchedule.filter((s) => s.isAvailable).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Hours/Day</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">8h</p>
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
              {weeklySchedule.map((schedule, index) => (
                <div
                  key={schedule.day}
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
                        onChange={() => toggleDayAvailability(index)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                      />
                      <span className="font-medium text-gray-900">{schedule.dayName}</span>
                    </label>

                    {schedule.isAvailable ? (
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">From:</label>
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => updateScheduleTime(index, 'startTime', e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">To:</label>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => updateScheduleTime(index, 'endTime', e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Slot Duration:</label>
                          <select
                            value={schedule.slotDuration}
                            onChange={(e) => updateSlotDuration(index, parseInt(e.target.value))}
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
                          <> • {block.startTime} - {block.endTime}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={block.type === 'unavailable' ? 'danger' : 'warning'}>
                      {block.type === 'unavailable' ? 'Full Day' : 'Partial'}
                    </Badge>
                    <button className="text-red-600 hover:text-red-800">
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
