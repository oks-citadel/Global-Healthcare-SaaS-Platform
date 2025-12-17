'use client';

import React from 'react';
import Link from 'next/link';
import { Patient } from '@/types/provider';

interface PatientCardProps {
  patient: Patient;
  showActions?: boolean;
  onClick?: (patient: Patient) => void;
}

export default function PatientCard({ patient, showActions = true, onClick }: PatientCardProps) {
  const age = patient.dateOfBirth
    ? Math.floor(
        (new Date().getTime() - new Date(patient.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  const lastVisit = patient.lastVisit
    ? new Date(patient.lastVisit).toLocaleDateString()
    : 'No visits';

  const handleClick = () => {
    if (onClick) {
      onClick(patient);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {patient.firstName.charAt(0)}
                {patient.lastName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-600">
                {age && `${age} years old`}
                {age && patient.gender && ' • '}
                {patient.gender && (
                  <span className="capitalize">{patient.gender}</span>
                )}
              </p>
              {patient.email && (
                <p className="text-sm text-gray-600">{patient.email}</p>
              )}
              {patient.phoneNumber && (
                <p className="text-sm text-gray-600">{patient.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>

        {patient.bloodType && (
          <div className="flex-shrink-0 ml-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {patient.bloodType}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Last Visit</p>
          <p className="text-sm font-medium text-gray-900">{lastVisit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Visits</p>
          <p className="text-sm font-medium text-gray-900">{patient.totalVisits}</p>
        </div>
      </div>

      {patient.allergies && patient.allergies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Allergies</p>
          <div className="flex flex-wrap gap-1">
            {patient.allergies.slice(0, 3).map((allergy, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                {allergy}
              </span>
            ))}
            {patient.allergies.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                +{patient.allergies.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {patient.chronicConditions && patient.chronicConditions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Chronic Conditions</p>
          <div className="flex flex-wrap gap-1">
            {patient.chronicConditions.slice(0, 2).map((condition, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
              >
                {condition}
              </span>
            ))}
            {patient.chronicConditions.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                +{patient.chronicConditions.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {showActions && (
        <div className="mt-4 flex space-x-2">
          <Link
            href={`/provider/patients/${patient.id}`}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
          <Link
            href={`/provider/encounters/new?patientId=${patient.id}`}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            New Encounter
          </Link>
        </div>
      )}
    </div>
  );
}
