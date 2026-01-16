'use client';

import React, { useState } from 'react';
import { Encounter } from '@/types/provider';

interface EncounterFormProps {
  initialData?: Partial<Encounter>;
  patientId?: string;
  patientName?: string;
  onSubmit: (data: Partial<Encounter>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function EncounterForm({
  initialData,
  patientId,
  patientName,
  onSubmit,
  onCancel,
  isLoading = false,
}: EncounterFormProps) {
  const [formData, setFormData] = useState<Partial<Encounter>>({
    patientId: patientId || initialData?.patientId || '',
    type: initialData?.type || 'consultation',
    chiefComplaint: initialData?.chiefComplaint || '',
    diagnosis: initialData?.diagnosis || [],
    vitalSigns: initialData?.vitalSigns || {},
  });

  const [newDiagnosis, setNewDiagnosis] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVitalSignChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [field]: value,
      },
    }));
  };

  const handleAddDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setFormData((prev) => ({
        ...prev,
        diagnosis: [...(prev.diagnosis || []), newDiagnosis.trim()],
      }));
      setNewDiagnosis('');
    }
  };

  const handleRemoveDiagnosis = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      diagnosis: prev.diagnosis?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      {patientName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Patient</p>
          <p className="text-lg font-semibold text-gray-900">{patientName}</p>
        </div>
      )}

      {/* Encounter Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Encounter Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="consultation">Consultation</option>
          <option value="follow-up">Follow-up</option>
          <option value="emergency">Emergency</option>
          <option value="routine">Routine</option>
        </select>
      </div>

      {/* Chief Complaint */}
      <div>
        <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700">
          Chief Complaint
        </label>
        <textarea
          id="chiefComplaint"
          name="chiefComplaint"
          rows={3}
          value={formData.chiefComplaint}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Describe the main reason for the visit..."
        />
      </div>

      {/* Vital Signs */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">
              Blood Pressure (mmHg)
            </label>
            <input
              type="text"
              id="bloodPressure"
              placeholder="120/80"
              value={formData.vitalSigns?.bloodPressure || ''}
              onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              id="heartRate"
              placeholder="72"
              value={formData.vitalSigns?.heartRate || ''}
              onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              id="temperature"
              placeholder="98.6"
              value={formData.vitalSigns?.temperature || ''}
              onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">
              Respiratory Rate (breaths/min)
            </label>
            <input
              type="number"
              id="respiratoryRate"
              placeholder="16"
              value={formData.vitalSigns?.respiratoryRate || ''}
              onChange={(e) => handleVitalSignChange('respiratoryRate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">
              O2 Saturation (%)
            </label>
            <input
              type="number"
              id="oxygenSaturation"
              placeholder="98"
              value={formData.vitalSigns?.oxygenSaturation || ''}
              onChange={(e) => handleVitalSignChange('oxygenSaturation', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              id="weight"
              placeholder="150"
              value={formData.vitalSigns?.weight || ''}
              onChange={(e) => handleVitalSignChange('weight', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diagnosis
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newDiagnosis}
            onChange={(e) => setNewDiagnosis(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddDiagnosis();
              }
            }}
            placeholder="Add diagnosis..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleAddDiagnosis}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        {formData.diagnosis && formData.diagnosis.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.diagnosis.map((diagnosis, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                {diagnosis}
                <button
                  type="button"
                  onClick={() => handleRemoveDiagnosis(index)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData?.id ? 'Update Encounter' : 'Create Encounter'}
        </button>
      </div>
    </form>
  );
}
