'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Demo prescriptions
const demoPrescriptions = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    prescriber: 'Dr. Sarah Johnson',
    pharmacy: 'CVS Pharmacy - Main Street',
    status: 'active',
    refillsRemaining: 3,
    lastFilled: '2024-12-01',
    nextRefill: '2024-12-29',
    instructions: 'Take in the morning with or without food',
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    prescriber: 'Dr. Sarah Johnson',
    pharmacy: 'CVS Pharmacy - Main Street',
    status: 'active',
    refillsRemaining: 5,
    lastFilled: '2024-11-15',
    nextRefill: '2024-12-15',
    instructions: 'Take with meals',
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at bedtime',
    prescriber: 'Dr. Michael Chen',
    pharmacy: 'Walgreens - Oak Avenue',
    status: 'active',
    refillsRemaining: 2,
    lastFilled: '2024-11-20',
    nextRefill: '2024-12-20',
    instructions: 'Take at bedtime',
  },
  {
    id: '4',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    prescriber: 'Dr. Sarah Johnson',
    pharmacy: 'CVS Pharmacy - Main Street',
    status: 'completed',
    refillsRemaining: 0,
    lastFilled: '2024-10-01',
    nextRefill: null,
    instructions: 'Take until finished. Complete full course.',
  },
];

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredPrescriptions = demoPrescriptions.filter((rx) => {
    if (filter === 'all') return true;
    return rx.status === filter;
  });

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
            <p className="mt-1 text-gray-600">
              Manage your medications and request refills
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Request New Prescription
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    💊
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rx.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          rx.status
                        )}`}
                      >
                        {rx.status}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {rx.dosage} - {rx.frequency}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {rx.instructions}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Prescriber: {rx.prescriber}</span>
                      <span>Pharmacy: {rx.pharmacy}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {rx.status === 'active' && (
                    <>
                      <p className="text-sm text-gray-500">
                        Refills remaining: <strong>{rx.refillsRemaining}</strong>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Next refill: {rx.nextRefill}
                      </p>
                      <button className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                        Request Refill
                      </button>
                    </>
                  )}
                  {rx.status === 'completed' && (
                    <p className="text-sm text-gray-500">
                      Completed on {rx.lastFilled}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">💊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No prescriptions found
            </h3>
            <p className="text-gray-500">
              {filter !== 'all'
                ? `No ${filter} prescriptions`
                : 'Your prescriptions will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Pharmacy Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Preferred Pharmacy
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
            🏥
          </div>
          <div>
            <h3 className="font-medium text-gray-900">CVS Pharmacy - Main Street</h3>
            <p className="text-sm text-gray-500">123 Main Street, City, State 12345</p>
            <p className="text-sm text-gray-500">Phone: (555) 123-4567</p>
          </div>
          <button className="ml-auto text-blue-600 hover:text-blue-500 text-sm font-medium">
            Change Pharmacy
          </button>
        </div>
      </div>
    </div>
  );
}
