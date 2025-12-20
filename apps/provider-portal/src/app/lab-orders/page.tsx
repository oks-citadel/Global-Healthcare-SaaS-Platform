'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, Modal } from '@/components/ui';
import { FlaskConical, Plus, Search, AlertCircle, User, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function LabOrdersPage() {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock lab orders data
  const labOrders = [
    {
      id: '1',
      patient: 'John Smith',
      patientId: '1',
      orderDate: '2024-12-18',
      tests: [
        { id: '1', code: 'CBC', name: 'Complete Blood Count' },
        { id: '2', code: 'CMP', name: 'Comprehensive Metabolic Panel' },
      ],
      priority: 'routine',
      status: 'processing',
      labName: 'Quest Diagnostics',
      diagnosis: 'Annual wellness exam',
      results: [],
    },
    {
      id: '2',
      patient: 'Sarah Johnson',
      patientId: '2',
      orderDate: '2024-12-15',
      tests: [
        { id: '3', code: 'HbA1c', name: 'Hemoglobin A1c' },
        { id: '4', code: 'LIPID', name: 'Lipid Panel' },
      ],
      priority: 'routine',
      status: 'completed',
      labName: 'LabCorp',
      diagnosis: 'Diabetes follow-up',
      results: [
        {
          id: '1',
          testId: '3',
          testName: 'Hemoglobin A1c',
          value: '6.2',
          unit: '%',
          referenceRange: '4.0-5.6',
          status: 'abnormal',
          performedDate: '2024-12-16',
        },
        {
          id: '2',
          testId: '4',
          testName: 'Total Cholesterol',
          value: '185',
          unit: 'mg/dL',
          referenceRange: '<200',
          status: 'normal',
          performedDate: '2024-12-16',
        },
      ],
    },
    {
      id: '3',
      patient: 'Michael Brown',
      patientId: '3',
      orderDate: '2024-12-19',
      tests: [
        { id: '5', code: 'TSH', name: 'Thyroid Stimulating Hormone' },
      ],
      priority: 'urgent',
      status: 'ordered',
      labName: 'Quest Diagnostics',
      diagnosis: 'Fatigue, suspected thyroid disorder',
      results: [],
    },
  ];

  const filteredOrders = labOrders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tests.some(test => test.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const NewLabOrderForm = () => {
    const [selectedTests, setSelectedTests] = useState<string[]>([]);

    const availableTests = [
      { code: 'CBC', name: 'Complete Blood Count' },
      { code: 'CMP', name: 'Comprehensive Metabolic Panel' },
      { code: 'HbA1c', name: 'Hemoglobin A1c' },
      { code: 'LIPID', name: 'Lipid Panel' },
      { code: 'TSH', name: 'Thyroid Stimulating Hormone' },
      { code: 'UA', name: 'Urinalysis' },
      { code: 'PSA', name: 'Prostate-Specific Antigen' },
    ];

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tests to Order <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableTests.map((test) => (
              <label
                key={test.code}
                className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedTests.includes(test.code)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTests([...selectedTests, test.code]);
                    } else {
                      setSelectedTests(selectedTests.filter((t) => t !== test.code));
                    }
                  }}
                />
                <span className="ml-2 text-sm">
                  <span className="font-medium">{test.code}</span> - {test.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Select
          label="Priority"
          options={[
            { value: 'routine', label: 'Routine' },
            { value: 'urgent', label: 'Urgent' },
            { value: 'stat', label: 'STAT' },
          ]}
          required
        />

        <Select
          label="Lab Facility"
          options={[
            { value: 'quest', label: 'Quest Diagnostics' },
            { value: 'labcorp', label: 'LabCorp' },
            { value: 'local', label: 'Local Hospital Lab' },
          ]}
          required
        />

        <Input
          label="Diagnosis / Reason for Test"
          placeholder="e.g., Annual wellness exam"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            placeholder="Any additional instructions or notes..."
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowNewOrderModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary">
            <FlaskConical className="h-4 w-4 mr-2" />
            Create Lab Order
          </Button>
        </div>
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'stat':
        return <Badge variant="danger">STAT</Badge>;
      case 'urgent':
        return <Badge variant="warning">Urgent</Badge>;
      default:
        return <Badge variant="info">Routine</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'processing':
        return <Badge variant="info">Processing</Badge>;
      case 'ordered':
        return <Badge variant="warning">Ordered</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Orders</h1>
            <p className="text-gray-600 mt-1">Order and view laboratory test results</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowNewOrderModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Lab Order
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Results</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {labOrders.filter((o) => o.status === 'processing' || o.status === 'ordered').length}
                </p>
              </div>
              <FlaskConical className="h-8 w-8 text-orange-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Results</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {labOrders.filter((o) => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abnormal Results</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">1</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">23</p>
              </div>
              <Badge variant="info" className="text-lg px-3 py-1">
                +5
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
                placeholder="Search by patient or test name..."
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
                { value: 'ordered', label: 'Ordered' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              className="md:w-48"
            />
          </div>
        </div>

        {/* Lab Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FlaskConical className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                        {getPriorityBadge(order.priority)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {order.patient}
                        </div>
                        <div>
                          Ordered: {format(new Date(order.orderDate), 'MMM d, yyyy')}
                        </div>
                        <div>
                          Lab: {order.labName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                {/* Tests */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Tests Ordered:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.tests.map((test) => (
                      <Badge key={test.id} variant="primary">
                        {test.code} - {test.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Results */}
                {order.results && order.results.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Results:</p>
                    <div className="space-y-2">
                      {order.results.map((result) => (
                        <div
                          key={result.id}
                          className={`p-3 rounded-lg border ${
                            result.status === 'abnormal'
                              ? 'bg-red-50 border-red-200'
                              : result.status === 'critical'
                              ? 'bg-red-100 border-red-300'
                              : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{result.testName}</p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">
                                  {result.value} {result.unit}
                                </span>
                                {' '}(Reference: {result.referenceRange})
                              </p>
                            </div>
                            <Badge
                              variant={
                                result.status === 'normal'
                                  ? 'success'
                                  : result.status === 'abnormal'
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {result.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Diagnosis:</span> {order.diagnosis}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No lab orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Lab Order Modal */}
      <Modal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        title="New Lab Order"
        size="lg"
      >
        <NewLabOrderForm />
      </Modal>
    </DashboardLayout>
  );
}
