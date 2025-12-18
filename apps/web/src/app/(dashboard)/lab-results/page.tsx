'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Demo lab results
const demoLabResults = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    orderDate: '2024-12-08',
    resultDate: '2024-12-10',
    status: 'completed',
    orderedBy: 'Dr. Sarah Johnson',
    results: [
      { name: 'White Blood Cells', value: '7.2', unit: 'K/uL', range: '4.5-11.0', status: 'normal' },
      { name: 'Red Blood Cells', value: '4.8', unit: 'M/uL', range: '4.5-5.5', status: 'normal' },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5-17.5', status: 'normal' },
      { name: 'Platelets', value: '250', unit: 'K/uL', range: '150-400', status: 'normal' },
    ],
  },
  {
    id: '2',
    testName: 'Lipid Panel',
    orderDate: '2024-10-15',
    resultDate: '2024-10-20',
    status: 'completed',
    orderedBy: 'Dr. Sarah Johnson',
    results: [
      { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', range: '<200', status: 'high' },
      { name: 'LDL Cholesterol', value: '140', unit: 'mg/dL', range: '<100', status: 'high' },
      { name: 'HDL Cholesterol', value: '55', unit: 'mg/dL', range: '>40', status: 'normal' },
      { name: 'Triglycerides', value: '120', unit: 'mg/dL', range: '<150', status: 'normal' },
    ],
  },
  {
    id: '3',
    testName: 'Basic Metabolic Panel',
    orderDate: '2024-12-12',
    resultDate: null,
    status: 'pending',
    orderedBy: 'Dr. Michael Chen',
    results: [],
  },
];

export default function LabResultsPage() {
  const { user } = useAuth();
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredResults = demoLabResults.filter((result) => {
    if (filter === 'all') return true;
    return result.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'high':
        return 'text-red-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const selectedLabResult = demoLabResults.find((r) => r.id === selectedResult);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
        <p className="mt-1 text-gray-600">
          View and track your laboratory test results
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2">
          {(['all', 'completed', 'pending'] as const).map((tab) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <button
                key={result.id}
                onClick={() => setSelectedResult(result.id)}
                className={`w-full bg-white rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-shadow ${
                  selectedResult === result.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{result.testName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ordered: {result.orderDate}
                    </p>
                    <p className="text-sm text-gray-500">
                      By: {result.orderedBy}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      result.status
                    )}`}
                  >
                    {result.status}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-4xl mb-2">🔬</div>
              <p className="text-gray-500">No lab results found</p>
            </div>
          )}
        </div>

        {/* Result Details */}
        <div className="lg:col-span-2">
          {selectedLabResult ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedLabResult.testName}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Ordered by {selectedLabResult.orderedBy} on {selectedLabResult.orderDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    selectedLabResult.status
                  )}`}
                >
                  {selectedLabResult.status}
                </span>
              </div>

              {selectedLabResult.status === 'completed' ? (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Results available: {selectedLabResult.resultDate}
                  </p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Test
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Result
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Reference Range
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedLabResult.results.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.value} {item.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.range} {item.unit}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-sm font-medium capitalize ${getResultStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Download PDF
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Share with Provider
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Results Pending
                  </h3>
                  <p className="text-gray-500">
                    Your lab results are being processed. You will be notified when
                    they are ready.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🔬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Lab Result
              </h3>
              <p className="text-gray-500">
                Choose a lab result from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
