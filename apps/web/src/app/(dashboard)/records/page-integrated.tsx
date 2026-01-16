'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMedicalRecords, useDownloadMedicalRecord, MedicalRecordFilters } from '@/hooks/useMedicalRecords';
import { DocumentUploader } from '@/components/patient/DocumentUploader';

const recordTypes = ['All', 'lab-result', 'imaging', 'visit-summary', 'immunization', 'prescription'];

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  // Build filters
  const filters: MedicalRecordFilters = {
    type: selectedType !== 'All' ? selectedType : undefined,
    search: searchQuery || undefined,
  };

  // Fetch records with filters
  const { data: records = [], isLoading } = useMedicalRecords(filters);
  const downloadRecord = useDownloadMedicalRecord();

  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      attention: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      abnormal: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'lab-result': '🔬',
      'imaging': '📷',
      'visit-summary': '📋',
      'immunization': '💉',
      'prescription': '💊',
      'other': '📄',
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleDownload = async (recordId: string) => {
    await downloadRecord.mutateAsync(recordId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
            <p className="mt-1 text-gray-600">
              View and manage your health records and documents
            </p>
          </div>
          <button
            onClick={() => setShowUploader(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Document
          </button>
        </div>
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
                {type === 'All' ? type : getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : records.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {records.map((record) => (
              <div
                key={record.id}
                className="p-6 hover:bg-gray-50 transition-colors"
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
                        {getTypeLabel(record.type)} • {record.provider}
                      </p>
                      {record.summary && (
                        <p className="text-sm text-gray-600 mt-2">
                          {record.summary}
                        </p>
                      )}
                      {record.tags && record.tags.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {record.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        View Details
                      </button>
                      {record.documentUrl && (
                        <button
                          onClick={() => handleDownload(record.id)}
                          disabled={downloadRecord.isPending}
                          className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
                        >
                          {downloadRecord.isPending ? 'Downloading...' : 'Download'}
                        </button>
                      )}
                    </div>
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
              {searchQuery || selectedType !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Your medical records will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Document Uploader Modal */}
      {showUploader && (
        <DocumentUploader onClose={() => setShowUploader(false)} />
      )}
    </div>
  );
}
