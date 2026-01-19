'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

interface CreateEncounterData {
  patientId: string;
  type: 'video' | 'phone' | 'in-person';
  chiefComplaint: string;
  scheduledDate: string;
  notes?: string;
}

// API functions
const encounterApi = {
  getPatients: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/patients');
    return response.data;
  },
  getPatient: async (id: string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/patients/${id}`);
    return response.data;
  },
  createEncounter: async (data: CreateEncounterData) => {
    const response = await apiClient.post('/encounters', data);
    return response.data;
  },
};

export default function NewEncounterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const preselectedPatientId = searchParams?.get('patientId') || '';

  const [formData, setFormData] = useState<CreateEncounterData>({
    patientId: preselectedPatientId,
    type: 'in-person',
    chiefComplaint: '',
    scheduledDate: '',
    notes: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch patients list
  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: encounterApi.getPatients,
  });

  // Fetch preselected patient if ID provided
  const { data: preselectedPatient } = useQuery({
    queryKey: ['patient', preselectedPatientId],
    queryFn: () => encounterApi.getPatient(preselectedPatientId),
    enabled: !!preselectedPatientId,
  });

  // Create encounter mutation
  const createMutation = useMutation({
    mutationFn: encounterApi.createEncounter,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      router.push(`/provider/encounters/${data.id}`);
    },
  });

  const filteredPatients = patients?.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.patientId && formData.chiefComplaint && formData.scheduledDate) {
      createMutation.mutate(formData);
    }
  };

  const selectedPatient = preselectedPatient || patients?.find((p) => p.id === formData.patientId);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/provider/encounters"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Encounters
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Encounter</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new patient encounter record
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Selection */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Patient Information
              </h2>

              {selectedPatient ? (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-medium">
                        {selectedPatient.firstName[0]}
                        {selectedPatient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                    </div>
                  </div>
                  {!preselectedPatientId && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, patientId: '' })}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Change
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="patientSearch"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Search Patients
                    </label>
                    <input
                      type="text"
                      id="patientSearch"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {patientsLoading ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md divide-y">
                      {filteredPatients && filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, patientId: patient.id })
                            }
                            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left"
                          >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {patient.firstName[0]}
                                {patient.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No patients found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Encounter Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Encounter Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Encounter Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'video' | 'phone' | 'in-person',
                      })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="scheduledDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledDate: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="chiefComplaint"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Chief Complaint
                  </label>
                  <textarea
                    id="chiefComplaint"
                    value={formData.chiefComplaint}
                    onChange={(e) =>
                      setFormData({ ...formData, chiefComplaint: e.target.value })
                    }
                    rows={3}
                    placeholder="Enter the patient's chief complaint..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    placeholder="Any additional notes..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Patient</span>
                  <span className="font-medium text-gray-900">
                    {selectedPatient
                      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                      : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formData.type.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">
                    {formData.scheduledDate
                      ? new Date(formData.scheduledDate).toLocaleDateString()
                      : 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <button
                type="submit"
                disabled={
                  !formData.patientId ||
                  !formData.chiefComplaint ||
                  !formData.scheduledDate ||
                  createMutation.isPending
                }
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Encounter'}
              </button>

              {createMutation.isError && (
                <p className="mt-2 text-sm text-red-600">
                  Failed to create encounter. Please try again.
                </p>
              )}
            </div>

            {/* Help */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600">
                For assistance with creating encounters, please refer to our
                provider documentation or contact support.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
