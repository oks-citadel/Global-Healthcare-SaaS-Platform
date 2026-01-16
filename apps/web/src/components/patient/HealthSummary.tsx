import { PatientProfile } from '@/types';

interface HealthSummaryProps {
  profile?: PatientProfile;
}

export function HealthSummary({ profile }: HealthSummaryProps) {
  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const calculateBMI = (weight?: number, height?: number): number | null => {
    if (!weight || !height) return null;
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  };

  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  const activeConditions = profile.medicalHistory?.filter(h => h.status === 'active').length || 0;
  const totalAllergies = profile.allergies?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Health Summary
      </h3>

      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
          {age !== null && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Age</p>
              <p className="text-lg font-semibold text-gray-900">{age} years</p>
            </div>
          )}
          {profile.bloodType && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Blood Type</p>
              <p className="text-lg font-semibold text-gray-900">{profile.bloodType}</p>
            </div>
          )}
        </div>

        {/* Vitals */}
        {(profile.height || profile.weight) && (
          <div className="pb-4 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Vitals</p>
            <div className="grid grid-cols-2 gap-4">
              {profile.height && (
                <div>
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="font-medium text-gray-900">{profile.height} cm</p>
                </div>
              )}
              {profile.weight && (
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium text-gray-900">{profile.weight} kg</p>
                </div>
              )}
            </div>
            {bmi && bmiCategory && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">BMI</p>
                <p className="font-semibold text-gray-900">
                  {bmi} <span className={`text-sm ${bmiCategory.color}`}>({bmiCategory.label})</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Medical Conditions */}
        <div className="pb-4 border-b border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Medical Conditions</p>
          {activeConditions > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                {activeConditions} Active
              </span>
              {profile.medicalHistory && profile.medicalHistory.length > activeConditions && (
                <span className="text-sm text-gray-500">
                  + {profile.medicalHistory.length - activeConditions} resolved
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No active conditions</p>
          )}
        </div>

        {/* Allergies */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Allergies</p>
          {totalAllergies > 0 ? (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                  {totalAllergies} Allergie{totalAllergies > 1 ? 's' : ''}
                </span>
              </div>
              {profile.allergies && profile.allergies.length > 0 && (
                <div className="space-y-1">
                  {profile.allergies.slice(0, 3).map((allergy) => (
                    <div key={allergy.id} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {allergy.allergen}
                    </div>
                  ))}
                  {profile.allergies.length > 3 && (
                    <p className="text-xs text-gray-500 ml-5">
                      +{profile.allergies.length - 3} more
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No known allergies</p>
          )}
        </div>

        {/* Emergency Contact Badge */}
        {profile.emergencyContact && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Emergency contact on file</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
