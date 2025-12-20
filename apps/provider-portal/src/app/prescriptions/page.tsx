'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, Modal } from '@/components/ui';
import { Pill, Plus, Search, Send, X, User } from 'lucide-react';
import { format } from 'date-fns';

export default function PrescriptionsPage() {
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock prescriptions data
  const prescriptions = [
    {
      id: '1',
      patient: 'John Smith',
      patientId: '1',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      quantity: 30,
      refills: 3,
      startDate: '2024-12-01',
      status: 'active',
      isSent: true,
      sentAt: '2024-12-01T10:30:00Z',
    },
    {
      id: '2',
      patient: 'Sarah Johnson',
      patientId: '2',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      quantity: 60,
      refills: 5,
      startDate: '2024-11-15',
      status: 'active',
      isSent: true,
      sentAt: '2024-11-15T14:20:00Z',
    },
    {
      id: '3',
      patient: 'Michael Brown',
      patientId: '3',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      quantity: 21,
      refills: 0,
      startDate: '2024-12-15',
      endDate: '2024-12-22',
      status: 'pending',
      isSent: false,
    },
  ];

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      searchQuery === '' ||
      rx.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medication.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const NewPrescriptionForm = () => {
    const [formData, setFormData] = useState({
      patientId: '',
      medication: '',
      dosage: '',
      frequency: '',
      route: 'oral',
      quantity: '',
      refills: '0',
      instructions: '',
    });

    return (
      <div className="space-y-4">
        <Select
          label="Patient"
          options={[
            { value: '', label: 'Select a patient' },
            { value: '1', label: 'John Smith' },
            { value: '2', label: 'Sarah Johnson' },
            { value: '3', label: 'Michael Brown' },
          ]}
          required
        />

        <Input
          label="Medication Name"
          placeholder="e.g., Lisinopril"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Dosage"
            placeholder="e.g., 10mg"
            required
          />
          <Select
            label="Route"
            options={[
              { value: 'oral', label: 'Oral' },
              { value: 'topical', label: 'Topical' },
              { value: 'injection', label: 'Injection' },
              { value: 'inhalation', label: 'Inhalation' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />
        </div>

        <Input
          label="Frequency"
          placeholder="e.g., Once daily"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            placeholder="e.g., 30"
            required
          />
          <Input
            label="Refills"
            type="number"
            placeholder="e.g., 3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            placeholder="Special instructions for the patient..."
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowNewPrescriptionModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary">
            <Send className="h-4 w-4 mr-2" />
            Send Prescription
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-1">Manage and create e-prescriptions</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowNewPrescriptionModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Prescription
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {prescriptions.filter((rx) => rx.status === 'active').length}
                </p>
              </div>
              <Pill className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {prescriptions.filter((rx) => rx.status === 'pending').length}
                </p>
              </div>
              <Badge variant="warning" className="text-lg px-3 py-1">
                Review
              </Badge>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">5</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">47</p>
              </div>
              <Badge variant="info" className="text-lg px-3 py-1">
                +12
              </Badge>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient or medication..."
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
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              className="md:w-48"
            />
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((rx) => (
            <Card key={rx.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Pill className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rx.medication}
                      </h3>
                      <Badge variant={rx.status === 'active' ? 'success' : 'warning'}>
                        {rx.status}
                      </Badge>
                      {rx.isSent && (
                        <Badge variant="info" size="sm">
                          Sent
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">Patient:</span>
                        <span className="ml-1">{rx.patient}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Dosage:</span>
                        <span className="ml-1">{rx.dosage} - {rx.frequency}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Quantity:</span>
                        <span className="ml-1">{rx.quantity} pills</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Refills:</span>
                        <span className="ml-1">{rx.refills}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Start Date:</span>
                        <span className="ml-1">
                          {format(new Date(rx.startDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                      {rx.isSent && rx.sentAt && (
                        <div className="text-gray-600">
                          <span className="font-medium">Sent:</span>
                          <span className="ml-1">
                            {format(new Date(rx.sentAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!rx.isSent && (
                    <Button variant="primary" size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {rx.status === 'active' && (
                    <Button variant="danger" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No prescriptions found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Prescription Modal */}
      <Modal
        isOpen={showNewPrescriptionModal}
        onClose={() => setShowNewPrescriptionModal(false)}
        title="New Prescription"
        size="lg"
      >
        <NewPrescriptionForm />
      </Modal>
    </DashboardLayout>
  );
}
