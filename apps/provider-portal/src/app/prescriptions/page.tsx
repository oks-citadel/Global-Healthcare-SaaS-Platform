'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, Modal } from '@/components/ui';
import { Pill, Plus, Search, Send, X, User, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Prescription, Patient } from '@/types';
import { prescriptionsApi, patientsApi } from '@/lib/api';

export default function PrescriptionsPage() {
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // API state
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalActive: 0,
    pending: 0,
    sentToday: 0,
    thisMonth: 0,
  });

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.getPrescriptions(1, 50);
      setPrescriptions(response.data);

      // Calculate stats
      const today = format(new Date(), 'yyyy-MM-dd');
      const active = response.data.filter((rx) => rx.status === 'active').length;
      const pending = response.data.filter((rx) => rx.status === 'pending').length;
      const sentToday = response.data.filter(
        (rx) => rx.sentAt && rx.sentAt.startsWith(today)
      ).length;

      setStats({
        totalActive: active,
        pending: pending,
        sentToday: sentToday,
        thisMonth: response.data.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prescriptions');
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsApi.getPatients(1, 100);
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const handleRetry = () => {
    fetchPrescriptions();
  };

  const handleSendPrescription = async (prescriptionId: string) => {
    setSendingId(prescriptionId);
    try {
      await prescriptionsApi.sendPrescription(prescriptionId, 'default-pharmacy');
      fetchPrescriptions();
    } catch (err) {
      console.error('Error sending prescription:', err);
    } finally {
      setSendingId(null);
    }
  };

  const handleCancelPrescription = async (prescriptionId: string) => {
    try {
      await prescriptionsApi.cancelPrescription(prescriptionId, 'Cancelled by provider');
      fetchPrescriptions();
    } catch (err) {
      console.error('Error cancelling prescription:', err);
    }
  };

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const patientName = rx.patient
      ? `${rx.patient.firstName} ${rx.patient.lastName}`
      : '';

    const matchesSearch =
      searchQuery === '' ||
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      route: 'oral' as const,
      quantity: '',
      refills: '0',
      instructions: '',
    });

    const handleSubmit = async () => {
      if (!formData.patientId || !formData.medication || !formData.dosage || !formData.frequency) {
        return;
      }

      setSubmitting(true);
      try {
        await prescriptionsApi.createPrescription({
          patientId: formData.patientId,
          providerId: '', // Will be set by the API based on auth
          medication: formData.medication,
          dosage: formData.dosage,
          frequency: formData.frequency,
          route: formData.route,
          quantity: parseInt(formData.quantity) || 0,
          refills: parseInt(formData.refills) || 0,
          startDate: new Date().toISOString(),
          instructions: formData.instructions,
          status: 'pending',
        });

        setShowNewPrescriptionModal(false);
        fetchPrescriptions();
      } catch (err) {
        console.error('Error creating prescription:', err);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="space-y-4">
        <Select
          label="Patient"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          options={[
            { value: '', label: 'Select a patient' },
            ...patients.map((p) => ({
              value: p.id,
              label: `${p.firstName} ${p.lastName}`,
            })),
          ]}
          required
        />

        <Input
          label="Medication Name"
          placeholder="e.g., Lisinopril"
          value={formData.medication}
          onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Dosage"
            placeholder="e.g., 10mg"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            required
          />
          <Select
            label="Route"
            value={formData.route}
            onChange={(e) => setFormData({ ...formData, route: e.target.value as typeof formData.route })}
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
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            placeholder="e.g., 30"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <Input
            label="Refills"
            type="number"
            placeholder="e.g., 3"
            value={formData.refills}
            onChange={(e) => setFormData({ ...formData, refills: e.target.value })}
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
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowNewPrescriptionModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Create Prescription
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Loading prescriptions...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Prescriptions</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Active</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.totalActive}
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
                      {stats.pending}
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
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.sentToday}</p>
                  </div>
                  <Send className="h-8 w-8 text-blue-600" />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.thisMonth}</p>
                  </div>
                  <Badge variant="info" className="text-lg px-3 py-1">
                    +{stats.totalActive}
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
                            <span className="ml-1">
                              {rx.patient
                                ? `${rx.patient.firstName} ${rx.patient.lastName}`
                                : 'Patient'}
                            </span>
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
                      {!rx.isSent && rx.status !== 'cancelled' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSendPrescription(rx.id)}
                          disabled={sendingId === rx.id}
                        >
                          {sendingId === rx.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-1" />
                          )}
                          Send
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {rx.status === 'active' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelPrescription(rx.id)}
                        >
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
          </>
        )}
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
