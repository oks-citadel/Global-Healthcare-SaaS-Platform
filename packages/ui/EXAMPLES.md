# Component Usage Examples

## Complete Form Example

```tsx
import {
  Button,
  Input,
  Select,
  DatePicker,
  Card,
  Alert
} from '@healthcare/ui';
import { useState } from 'react';

function PatientRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: undefined,
    bloodType: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and submit
    setShowSuccess(true);
  };

  return (
    <Card
      header={<h2 className="text-xl font-bold">Patient Registration</h2>}
      padding="lg"
      shadow="lg"
    >
      {showSuccess && (
        <Alert
          variant="success"
          title="Registration Successful"
          dismissible
          onDismiss={() => setShowSuccess(false)}
        >
          Patient has been registered successfully.
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            fullWidth
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            fullWidth
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          fullWidth
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          fullWidth
        />

        <DatePicker
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
          maxDate={new Date()}
          fullWidth
        />

        <Select
          label="Blood Type"
          options={bloodTypeOptions}
          value={formData.bloodType}
          onChange={(value) => setFormData({ ...formData, bloodType: value })}
          placeholder="Select blood type"
          fullWidth
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" size="lg">
            Register Patient
          </Button>
          <Button type="button" variant="ghost" size="lg">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

## Patient List with Table

```tsx
import { Table, Badge, Avatar, Button, Input } from '@healthcare/ui';
import { useState } from 'react';

function PatientList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatients, setSelectedPatients] = useState([]);

  const patients = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 555-0123',
      status: 'Active',
      lastVisit: '2024-01-15',
      avatar: '/avatars/john.jpg',
    },
    // ... more patients
  ];

  const columns = [
    {
      key: 'name',
      header: 'Patient',
      sortable: true,
      render: (patient) => (
        <div className="flex items-center gap-3">
          <Avatar src={patient.avatar} alt={patient.name} size="sm" />
          <span className="font-medium">{patient.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (patient) => (
        <Badge
          variant={patient.status === 'Active' ? 'success' : 'warning'}
          dot
        >
          {patient.status}
        </Badge>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (patient) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">View</Button>
          <Button size="sm" variant="ghost">Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button variant="primary">
          Add Patient
        </Button>
      </div>

      <Input
        placeholder="Search patients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        prefixIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      <Table
        data={patients}
        columns={columns}
        selectable
        onSelectionChange={setSelectedPatients}
        pagination={{
          currentPage,
          pageSize: 10,
          totalItems: patients.length,
          onPageChange: setCurrentPage,
        }}
        striped
        hover
      />
    </div>
  );
}
```

## Appointment Scheduler with Modal

```tsx
import {
  Button,
  Modal,
  DatePicker,
  Select,
  Input,
  Card,
  Badge,
} from '@healthcare/ui';
import { useState } from 'react';

function AppointmentScheduler() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: undefined,
    time: '',
    doctor: '',
    type: '',
    notes: '',
  });

  const doctors = [
    { value: 'dr-smith', label: 'Dr. Sarah Smith - Cardiology' },
    { value: 'dr-jones', label: 'Dr. Michael Jones - Neurology' },
    { value: 'dr-brown', label: 'Dr. Emily Brown - Pediatrics' },
  ];

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      date: '2024-01-20',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Smith',
      type: 'Consultation',
      status: 'Confirmed',
    },
    // ... more appointments
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsModalOpen(true)}
        >
          Schedule Appointment
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {upcomingAppointments.map((appointment) => (
          <Card key={appointment.id} hover shadow="md" padding="md">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{appointment.doctor}</p>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
                <Badge variant="success" size="sm">
                  {appointment.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {appointment.date} at {appointment.time}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Appointment"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Confirm Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <DatePicker
            label="Appointment Date"
            value={appointmentData.date}
            onChange={(date) => setAppointmentData({ ...appointmentData, date })}
            minDate={new Date()}
            fullWidth
          />

          <Select
            label="Select Doctor"
            options={doctors}
            value={appointmentData.doctor}
            onChange={(doctor) => setAppointmentData({ ...appointmentData, doctor })}
            searchable
            fullWidth
          />

          <Select
            label="Appointment Type"
            options={appointmentTypes}
            value={appointmentData.type}
            onChange={(type) => setAppointmentData({ ...appointmentData, type })}
            fullWidth
          />

          <Input
            label="Additional Notes"
            value={appointmentData.notes}
            onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
            placeholder="Any specific concerns or information..."
            fullWidth
          />
        </div>
      </Modal>
    </div>
  );
}
```

## Dashboard with Tabs

```tsx
import {
  Tabs,
  Card,
  Badge,
  Avatar,
  Button,
  Alert,
} from '@healthcare/ui';

function DoctorDashboard() {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      content: (
        <div className="grid grid-cols-3 gap-6">
          <Card padding="lg" shadow="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">24</p>
              <p className="text-gray-600 mt-2">Today's Appointments</p>
            </div>
          </Card>
          <Card padding="lg" shadow="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600">156</p>
              <p className="text-gray-600 mt-2">Total Patients</p>
            </div>
          </Card>
          <Card padding="lg" shadow="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600">8</p>
              <p className="text-gray-600 mt-2">Pending Reviews</p>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'patients',
      label: 'Patients',
      content: <div>Patient list content...</div>,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      content: <div>Appointments content...</div>,
    },
    {
      id: 'reports',
      label: 'Reports',
      content: <div>Reports content...</div>,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Dr. Smith</p>
      </div>

      <Alert variant="info" title="System Update" className="mb-6">
        The system will undergo maintenance tonight at 11 PM EST.
      </Alert>

      <Tabs tabs={tabs} variant="pills" />
    </div>
  );
}
```

## User Profile with Avatar

```tsx
import { Avatar, Badge, Card, Button } from '@healthcare/ui';

function UserProfile() {
  const user = {
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@hospital.com',
    role: 'Cardiologist',
    status: 'online',
    avatar: '/avatars/sarah.jpg',
    stats: {
      patients: 245,
      appointments: 1240,
      rating: 4.9,
    },
  };

  return (
    <Card padding="lg" shadow="lg" className="max-w-2xl mx-auto">
      <div className="flex items-start gap-6">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="2xl"
          status={user.status}
        />

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <Badge variant="medical">{user.role}</Badge>
          </div>

          <p className="text-gray-600 mb-4">{user.email}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-2xl font-bold text-primary-600">{user.stats.patients}</p>
              <p className="text-sm text-gray-600">Patients</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{user.stats.appointments}</p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{user.stats.rating}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary">Edit Profile</Button>
            <Button variant="outline">View Schedule</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

## Medical Records with Multi-Select

```tsx
import { Select, Table, Button, Badge } from '@healthcare/ui';
import { useState } from 'react';

function MedicalRecords() {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categoryOptions = [
    { value: 'lab-results', label: 'Lab Results' },
    { value: 'prescriptions', label: 'Prescriptions' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'visit-notes', label: 'Visit Notes' },
    { value: 'immunizations', label: 'Immunizations' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <Button variant="primary">Upload Document</Button>
      </div>

      <Select
        label="Filter by Category"
        options={categoryOptions}
        value={selectedCategories}
        onChange={setSelectedCategories}
        multiSelect
        searchable
        placeholder="Select categories to filter..."
        fullWidth
      />

      <div className="grid gap-4">
        {/* Record cards would go here */}
      </div>
    </div>
  );
}
```

These examples demonstrate real-world usage patterns for the healthcare platform, showing how components work together to create complete features.
