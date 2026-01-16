'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Pill,
  Activity,
  Edit,
} from 'lucide-react';
import { format } from 'date-fns';

export default function PatientDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'documents'>('overview');

  // Mock patient data - replace with actual API call
  const patient = {
    id: params.id,
    mrn: 'MRN-001234',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1980-05-15',
    gender: 'Male',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    bloodType: 'A+',
    allergies: [
      { id: '1', name: 'Penicillin', severity: 'moderate', reaction: 'Rash' },
      { id: '2', name: 'Peanuts', severity: 'severe', reaction: 'Anaphylaxis' },
    ],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    currentMedications: [
      { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ],
  };

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'Medical History' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-gray-600 mt-1">
                  {patient.gender} • {age} years old • MRN: {patient.mrn}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    {patient.email}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Patient
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{patient.bloodType}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Medications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {patient.currentMedications.length}
                </p>
              </div>
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Known Allergies</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{patient.allergies.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="text-gray-900">{format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="text-gray-900">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900">
                      {patient.address.street}, {patient.address.city}, {patient.address.state}{' '}
                      {patient.address.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.allergies.map((allergy) => (
                    <div
                      key={allergy.id}
                      className="flex items-start justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{allergy.name}</p>
                        <p className="text-sm text-gray-600">Reaction: {allergy.reaction}</p>
                      </div>
                      <Badge variant="danger">{allergy.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chronic Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Chronic Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.chronicConditions.map((condition, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-600 mr-3" />
                      <p className="text-gray-900">{condition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.currentMedications.map((medication) => (
                    <div key={medication.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-medium text-gray-900">{medication.name}</p>
                      <p className="text-sm text-gray-600">
                        {medication.dosage} - {medication.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Medical history will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Patient documents will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
