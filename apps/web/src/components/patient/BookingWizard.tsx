import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProviders, useProviderAvailability, useBookAppointment } from '@/hooks/usePatient';
import { Provider, TimeSlot, BookAppointmentData } from '@/types';

type Step = 1 | 2 | 3 | 4;

export function BookingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video' | 'phone'>('video');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const { data: providers, isLoading: providersLoading } = useProviders(selectedSpecialty || undefined);
  const { data: availability } = useProviderAvailability(
    selectedProvider?.id || '',
    selectedDate
  );
  const bookAppointment = useBookAppointment();

  const specialties = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Psychiatry',
    'Neurology',
    'Oncology',
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProvider || !selectedTime || !reason) return;

    try {
      const appointmentData: BookAppointmentData = {
        doctorId: selectedProvider.id,
        dateTime: selectedTime.dateTime,
        duration: 30, // Default 30 minutes
        type: appointmentType,
        reason,
        notes: notes || undefined,
      };

      await bookAppointment.mutateAsync(appointmentData);
      router.push('/patient/appointments');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const canProceedFromStep1 = selectedSpecialty && selectedProvider;
  const canProceedFromStep2 = selectedDate && selectedTime;
  const canProceedFromStep3 = appointmentType && reason;

  return (
    <div className="p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-gray-600">
                  {step === 1 && 'Provider'}
                  {step === 2 && 'Date & Time'}
                  {step === 3 && 'Details'}
                  {step === 4 && 'Confirm'}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={`h-1 flex-1 transition-colors ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Provider */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Provider</h2>
            <p className="text-gray-600">Choose a specialty and healthcare provider</p>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setSelectedProvider(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Providers List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Providers
            </label>
            {providersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : providers && providers.length > 0 ? (
              <div className="grid gap-4">
                {providers.map((provider: Provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider)}
                    className={`text-left border-2 rounded-lg p-4 transition-all ${
                      selectedProvider?.id === provider.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {provider.title} {provider.firstName} {provider.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{provider.specialty}</p>
                        {provider.yearsOfExperience && (
                          <p className="text-xs text-gray-500 mt-1">
                            {provider.yearsOfExperience} years of experience
                          </p>
                        )}
                        {provider.rating && (
                          <div className="flex items-center mt-2">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-600">{provider.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No providers found</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {currentStep === 2 && selectedProvider && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
            <p className="text-gray-600">
              Booking with {selectedProvider.title} {selectedProvider.firstName} {selectedProvider.lastName}
            </p>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(null);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Time Slots
              </label>
              {availability && availability.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {availability.map((slot: TimeSlot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTime(slot)}
                      disabled={!slot.available}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTime?.id === slot.id
                          ? 'bg-blue-600 text-white'
                          : slot.available
                          ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {new Date(slot.dateTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No available slots for this date</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Appointment Details */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Details</h2>
            <p className="text-gray-600">Provide information about your visit</p>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Appointment Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['video', 'phone', 'in-person'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAppointmentType(type)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    appointmentType === type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="mb-2">
                      {type === 'video' && (
                        <svg className="w-8 h-8 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {type === 'phone' && (
                        <svg className="w-8 h-8 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )}
                      {type === 'in-person' && (
                        <svg className="w-8 h-8 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Annual checkup, Follow-up visit, Cold symptoms"
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share any additional information or concerns..."
            />
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && selectedProvider && selectedTime && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Appointment</h2>
            <p className="text-gray-600">Please review your appointment details</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Provider</p>
              <p className="font-semibold text-gray-900">
                {selectedProvider.title} {selectedProvider.firstName} {selectedProvider.lastName}
              </p>
              <p className="text-sm text-gray-600">{selectedProvider.specialty}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(selectedTime.dateTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(selectedTime.dateTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-semibold text-gray-900 capitalize">{appointmentType}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Reason for Visit</p>
              <p className="font-semibold text-gray-900">{reason}</p>
            </div>

            {notes && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">Additional Notes</p>
                <p className="text-gray-900">{notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !canProceedFromStep1) ||
              (currentStep === 2 && !canProceedFromStep2) ||
              (currentStep === 3 && !canProceedFromStep3)
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={bookAppointment.isPending}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {bookAppointment.isPending ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
}
