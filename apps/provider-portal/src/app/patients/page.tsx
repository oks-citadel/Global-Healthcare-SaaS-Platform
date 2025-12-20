'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientCard } from '@/components/patients/PatientCard';
import { Input, Button, Select } from '@/components/ui';
import { Search, Plus, Filter } from 'lucide-react';
import { Patient } from '@/types';

export default function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  const patients: Patient[] = [
    {
      id: '1',
      mrn: 'MRN-001234',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-05-15',
      gender: 'male',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Spouse',
        phone: '(555) 987-6543',
      },
      insuranceInfo: [],
      allergies: [
        {
          id: '1',
          allergen: 'Penicillin',
          reaction: 'Rash',
          severity: 'moderate',
          diagnosedDate: '2020-01-15',
        },
      ],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      medications: [],
      status: 'active',
      preferredLanguage: 'English',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
    {
      id: '2',
      mrn: 'MRN-001235',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1992-08-22',
      gender: 'female',
      email: 'sarah.johnson@email.com',
      phone: '(555) 234-5678',
      address: {
        street: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Mike Johnson',
        relationship: 'Father',
        phone: '(555) 876-5432',
      },
      insuranceInfo: [],
      allergies: [],
      chronicConditions: [],
      medications: [],
      status: 'active',
      preferredLanguage: 'English',
      createdAt: '2023-03-20T00:00:00Z',
      updatedAt: '2024-12-19T00:00:00Z',
    },
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchQuery === '' ||
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">Manage and view patient records</p>
          </div>
          <Button variant="primary">
            <Plus className="h-5 w-5 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="md:w-48"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Gender"
                  options={[
                    { value: 'all', label: 'All Genders' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                <Input label="Age Min" type="number" placeholder="Min age" />
                <Input label="Age Max" type="number" placeholder="Max age" />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredPatients.length} patient(s)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => router.push(`/patients/${patient.id}`)}
              />
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No patients found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
