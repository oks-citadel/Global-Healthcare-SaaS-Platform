import { Visit } from '@/types';

interface VisitCardProps {
  visit: Visit;
}

export function VisitCard({ visit }: VisitCardProps) {
  const visitDate = new Date(visit.visitDate);
  const isPast = visitDate < new Date();
  const isActive = visit.status === 'in-progress';
  const isScheduled = visit.status === 'scheduled';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleJoinVisit = () => {
    if (visit.roomUrl) {
      window.open(visit.roomUrl, '_blank');
    }
  };

  return (
    <div className={`border rounded-lg p-6 transition-all ${
      isActive ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${isActive ? 'bg-green-500' : 'bg-blue-50'}`}>
            <svg className={`w-6 h-6 ${isActive ? 'text-white animate-pulse' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Visit Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dr. {visit.doctorName}
                </h3>
                <p className="text-sm text-gray-600">{visit.specialty}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                {visit.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {visitDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {visitDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - {visit.duration} min
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <span className="capitalize">{visit.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Notes/Details */}
      {visit.notes && visit.status === 'completed' && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Visit Notes</h4>
          <p className="text-sm text-gray-700">{visit.notes}</p>
        </div>
      )}

      {/* Diagnosis */}
      {visit.diagnosis && visit.status === 'completed' && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Diagnosis</h4>
          <p className="text-sm text-gray-700">{visit.diagnosis}</p>
        </div>
      )}

      {/* Prescriptions */}
      {visit.prescriptions && visit.prescriptions.length > 0 && visit.status === 'completed' && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Prescriptions</h4>
          <div className="space-y-3">
            {visit.prescriptions.map((prescription) => (
              <div key={prescription.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{prescription.medication}</h5>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>Dosage: {prescription.dosage}</p>
                      <p>Frequency: {prescription.frequency}</p>
                      <p>Duration: {prescription.duration}</p>
                      {prescription.instructions && (
                        <p className="text-gray-500 italic">Instructions: {prescription.instructions}</p>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(isActive || isScheduled) && (
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {isActive && visit.roomUrl && (
            <button
              onClick={handleJoinVisit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join Visit Now
              </span>
            </button>
          )}
          {isScheduled && (
            <>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel Visit
              </button>
              {visit.roomUrl && (
                <button
                  onClick={handleJoinVisit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Connection
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Completed Visit Summary */}
      {visit.status === 'completed' && !visit.diagnosis && !visit.notes && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Visit completed on {visitDate.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
