'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api';
import Link from 'next/link';

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  provider: string;
  status: string;
  summary: string;
}

const recordTypes = ['All', 'Lab Results', 'Imaging', 'Visit Summary', 'Immunization'];

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/medical-records');
        setRecords(response.data.data || response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load medical records');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesType = selectedType === 'All' || record.type === selectedType;
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      attention: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'Lab Results': '🔬',
      Imaging: '📷',
      'Visit Summary': '📋',
      Immunization: '💉',
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="mt-1 text-gray-600">Loading your records...</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading medical records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="mt-1 text-gray-600">View and manage your health records</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Records</h3>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="mt-1 text-gray-600">
          View and manage your health records and documents
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {recordTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredRecords.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {getTypeIcon(record.type)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {record.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {record.type} • {record.provider}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {record.summary}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{record.date}</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Your medical records will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
