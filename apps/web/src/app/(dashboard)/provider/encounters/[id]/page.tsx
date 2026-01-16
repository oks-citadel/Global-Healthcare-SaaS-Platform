'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  useProviderEncounter,
  useEncounterNotes,
  useStartEncounter,
  useEndEncounter,
  useAddClinicalNote,
  useUpdateEncounter,
} from '@/hooks/useProvider';
import ClinicalNoteEditor, { ClinicalNoteDisplay } from '@/components/provider/ClinicalNoteEditor';
import { ClinicalNote } from '@/types/provider';

export default function EncounterDetailPage() {
  const params = useParams();
  const encounterId = params?.id as string;
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<ClinicalNote | null>(null);

  const { data: encounter, isLoading: encounterLoading } = useProviderEncounter(encounterId);
  const { data: notes, isLoading: notesLoading } = useEncounterNotes(encounterId);
  const startEncounter = useStartEncounter();
  const endEncounter = useEndEncounter();
  const addNote = useAddClinicalNote();
  const updateEncounter = useUpdateEncounter();

  const handleStartEncounter = async () => {
    try {
      await startEncounter.mutateAsync(encounterId);
    } catch (error) {
      console.error('Error starting encounter:', error);
    }
  };

  const handleEndEncounter = async () => {
    if (confirm('Are you sure you want to end this encounter?')) {
      try {
        await endEncounter.mutateAsync(encounterId);
      } catch (error) {
        console.error('Error ending encounter:', error);
      }
    }
  };

  const handleSaveNote = async (noteData: Partial<ClinicalNote>) => {
    try {
      await addNote.mutateAsync({
        encounterId,
        note: noteData,
      });
      setShowNoteEditor(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  if (encounterLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-800">Encounter not found</h3>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/provider/encounters"
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
        Back to Encounters
      </Link>

      {/* Encounter Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {encounter.type.charAt(0).toUpperCase() + encounter.type.slice(1)} Encounter
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    encounter.status
                  )}`}
                >
                  {encounter.status}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Patient:{' '}
                  <Link
                    href={`/provider/patients/${encounter.patientId}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {encounter.patientName}
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(encounter.encounterDate).toLocaleDateString()}
                  {encounter.startTime && (
                    <span>
                      {' '}
                      at{' '}
                      {new Date(encounter.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">Provider: {encounter.providerName}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {encounter.status === 'scheduled' && (
                <button
                  onClick={handleStartEncounter}
                  disabled={startEncounter.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {startEncounter.isPending ? 'Starting...' : 'Start Encounter'}
                </button>
              )}
              {encounter.status === 'in-progress' && (
                <button
                  onClick={handleEndEncounter}
                  disabled={endEncounter.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {endEncounter.isPending ? 'Ending...' : 'End Encounter'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Encounter Details */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500">Chief Complaint</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {encounter.chiefComplaint}
              </p>
            </div>
            {encounter.diagnosis && encounter.diagnosis.length > 0 && (
              <div>
                <p className="text-xs text-gray-500">Diagnosis</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {encounter.diagnosis.map((diag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      {diag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {encounter.duration && (
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {encounter.duration} minutes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vital Signs */}
          {encounter.vitalSigns && Object.keys(encounter.vitalSigns).length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {encounter.vitalSigns.bloodPressure && (
                  <div>
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {encounter.vitalSigns.bloodPressure} mmHg
                    </p>
                  </div>
                )}
                {encounter.vitalSigns.heartRate && (
                  <div>
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {encounter.vitalSigns.heartRate} bpm
                    </p>
                  </div>
                )}
                {encounter.vitalSigns.temperature && (
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {encounter.vitalSigns.temperature}°F
                    </p>
                  </div>
                )}
                {encounter.vitalSigns.respiratoryRate && (
                  <div>
                    <p className="text-xs text-gray-500">Respiratory Rate</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {encounter.vitalSigns.respiratoryRate} breaths/min
                    </p>
                  </div>
                )}
                {encounter.vitalSigns.oxygenSaturation && (
                  <div>
                    <p className="text-xs text-gray-500">O2 Saturation</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {encounter.vitalSigns.oxygenSaturation}%
                    </p>
                  </div>
                )}
                {encounter.vitalSigns.weight && (
                  <div>
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {encounter.vitalSigns.weight} lbs
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clinical Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Clinical Notes</h2>
              {!showNoteEditor && encounter.status === 'in-progress' && (
                <button
                  onClick={() => setShowNoteEditor(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Note
                </button>
              )}
            </div>

            {showNoteEditor && (
              <ClinicalNoteEditor
                encounterId={encounterId}
                initialNote={editingNote || undefined}
                onSave={handleSaveNote}
                onCancel={() => {
                  setShowNoteEditor(false);
                  setEditingNote(null);
                }}
                isLoading={addNote.isPending}
              />
            )}

            {notesLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notes && notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <ClinicalNoteDisplay
                    key={note.id}
                    note={note}
                    canEdit={encounter.status === 'in-progress'}
                    onEdit={(note) => {
                      setEditingNote(note);
                      setShowNoteEditor(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
                <p>No clinical notes recorded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prescriptions */}
          {encounter.prescriptions && encounter.prescriptions.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Prescriptions</h3>
              <div className="space-y-2">
                {encounter.prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-gray-200 rounded p-3">
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.medicationName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {prescription.dosage} - {prescription.frequency}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Refills: {prescription.refills}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Orders */}
          {encounter.labOrders && encounter.labOrders.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Lab Orders</h3>
              <div className="space-y-2">
                {encounter.labOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded p-3">
                    <p className="text-sm font-medium text-gray-900">{order.testName}</p>
                    <p className="text-xs text-gray-600 mt-1">Code: {order.testCode}</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${
                        order.priority === 'stat'
                          ? 'bg-red-100 text-red-800'
                          : order.priority === 'urgent'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {encounter.attachments && encounter.attachments.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments</h3>
              <div className="space-y-2">
                {encounter.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <span className="text-sm text-gray-900 truncate">
                      {attachment.fileName}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Encounter Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(encounter.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {encounter.startTime && (
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Started</p>
                    <p className="text-sm text-gray-900">
                      {new Date(encounter.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {encounter.endTime && (
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Ended</p>
                    <p className="text-sm text-gray-900">
                      {new Date(encounter.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
