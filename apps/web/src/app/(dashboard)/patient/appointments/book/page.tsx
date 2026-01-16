'use client';

import { BookingWizard } from '@/components/patient/BookingWizard';

export default function BookAppointmentPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-1">Schedule a visit with one of our healthcare providers</p>
      </div>

      {/* Booking Wizard */}
      <div className="bg-white rounded-lg shadow-sm">
        <BookingWizard />
      </div>
    </div>
  );
}
