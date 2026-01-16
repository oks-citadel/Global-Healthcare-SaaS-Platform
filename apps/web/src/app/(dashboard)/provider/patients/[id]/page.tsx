'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  useProviderPatient,
  usePatientMedicalHistory,
  usePatientEncounters,
} from '@/hooks/useProvider';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.id as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'encounters' | 'documents'>(
    'overview'
  );

  const { data: patient, isLoading: patientLoading } = useProviderPatient(patientId);
  const { data: medicalHistory, isLoading: historyLoading } =
    usePatientMedicalHistory(patientId);
  const { data: encountersData, isLoading: encountersLoading } = usePatientEncounters(patientId, {
    limit: 10,
  });

  const encounters = encountersData?.data || [];

  if (patientLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-800">Patient not found</h3>
      </div>
    );
  }

  const age = patient.dateOfBirth
    ? Math.floor(
        (new Date().getTime() - new Date(patient.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'history', name: 'Medical History' },
    { id: 'encounters', name: 'Encounters' },
    { id: 'documents', name: 'Documents' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/provider/patients"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-2xl">
                    {patient.firstName.charAt(0)}
                    {patient.lastName.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h1>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">
                    {age && `${age} years old`}
                    {age && patient.gender && ' • '}
                    {patient.gender && <span className="capitalize">{patient.gender}</span>}
                    {patient.bloodType && ` • Blood Type: ${patient.bloodType}`}
                  </p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  {patient.phoneNumber && (
                    <p className="text-sm text-gray-600">{patient.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/provider/encounters/new?patientId=${patient.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                New Encounter
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500">Total Visits</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{patient.totalVisits}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Visit</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {patient.lastVisit
                  ? new Date(patient.lastVisit).toLocaleDateString()
                  : 'No visits'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {new Date(patient.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.email}</dd>
              </div>
              {patient.phoneNumber && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.phoneNumber}</dd>
                </div>
              )}
              {patient.address && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {patient.address.street}
                    <br />
                    {patient.address.city}, {patient.address.state} {patient.address.zipCode}
                    <br />
                    {patient.address.country}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Emergency Contact */}
          {patient.emergencyContact && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.emergencyContact.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {patient.emergencyContact.relationship}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {patient.emergencyContact.phoneNumber}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Insurance Information */}
          {patient.insurance && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Provider</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.insurance.provider}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.insurance.policyNumber}</dd>
                </div>
                {patient.insurance.groupNumber && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Group Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {patient.insurance.groupNumber}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Alerts */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Important Alerts</h2>
            {patient.allergies && patient.allergies.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-red-600 mb-2">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {patient.chronicConditions && patient.chronicConditions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-2">Chronic Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(!patient.allergies || patient.allergies.length === 0) &&
              (!patient.chronicConditions || patient.chronicConditions.length === 0) && (
                <p className="text-sm text-gray-500">No alerts recorded</p>
              )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          {historyLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : medicalHistory ? (
            <>
              {/* Chronic Conditions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Chronic Conditions</h2>
                {medicalHistory.conditions && medicalHistory.conditions.length > 0 ? (
                  <div className="space-y-3">
                    {medicalHistory.conditions.map((condition) => (
                      <div
                        key={condition.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {condition.condition}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                            </p>
                            {condition.notes && (
                              <p className="text-sm text-gray-600 mt-1">{condition.notes}</p>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              condition.status === 'active'
                                ? 'bg-red-100 text-red-800'
                                : condition.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {condition.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No chronic conditions recorded</p>
                )}
              </div>

              {/* Current Medications */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Current Medications</h2>
                {medicalHistory.medications && medicalHistory.medications.length > 0 ? (
                  <div className="space-y-3">
                    {medicalHistory.medications
                      .filter((med) => med.status === 'active')
                      .map((medication) => (
                        <div
                          key={medication.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <h3 className="text-sm font-medium text-gray-900">
                            {medication.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {medication.dosage} - {medication.frequency}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Started: {new Date(medication.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No current medications</p>
                )}
              </div>

              {/* Allergies */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Allergies</h2>
                {medicalHistory.allergies && medicalHistory.allergies.length > 0 ? (
                  <div className="space-y-3">
                    {medicalHistory.allergies.map((allergy) => (
                      <div key={allergy.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {allergy.allergen}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Reaction: {allergy.reaction}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              allergy.severity === 'severe'
                                ? 'bg-red-100 text-red-800'
                                : allergy.severity === 'moderate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {allergy.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No allergies recorded</p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              No medical history available
            </div>
          )}
        </div>
      )}

      {activeTab === 'encounters' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Encounters</h2>
          </div>
          {encountersLoading ? (
            <div className="px-6 py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : encounters.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">No encounters found</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {encounters.map((encounter) => (
                <Link
                  key={encounter.id}
                  href={`/provider/encounters/${encounter.id}`}
                  className="block px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{encounter.type}</p>
                      <p className="text-sm text-gray-500 mt-1">{encounter.chiefComplaint}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(encounter.encounterDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        encounter.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : encounter.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {encounter.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          <p>Document management coming soon</p>
        </div>
      )}
    </div>
  );
}
