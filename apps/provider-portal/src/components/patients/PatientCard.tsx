import React from 'react';
import { Patient } from '@/types';
import { Badge } from '@/components/ui';
import { User, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
            {patient.avatar ? (
              <img src={patient.avatar} alt={patient.firstName} className="h-12 w-12 rounded-full" />
            ) : (
              <User className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              MRN: {patient.mrn} • {age} years old
            </p>
          </div>
        </div>
        <Badge variant={patient.status === 'active' ? 'success' : 'gray'}>
          {patient.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {patient.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          {patient.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}
        </div>
      </div>

      {patient.allergies && patient.allergies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Allergies:</p>
          <div className="flex flex-wrap gap-1">
            {patient.allergies.slice(0, 3).map((allergy) => (
              <Badge key={allergy.id} variant="danger" size="sm">
                {allergy.allergen}
              </Badge>
            ))}
            {patient.allergies.length > 3 && (
              <Badge variant="gray" size="sm">
                +{patient.allergies.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
