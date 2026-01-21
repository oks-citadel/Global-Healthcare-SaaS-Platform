/**
 * Test Data Seeding Script
 * Seeds the test database with deterministic test data
 * Matches the actual Prisma schema in services/api/prisma/schema.prisma
 */

import { PrismaClient } from '../../services/api/src/generated/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to generate medical record number
function generateMRN(index: number): string {
  const timestamp = '999999'; // Fixed for deterministic tests
  const padded = index.toString().padStart(4, '0');
  return `MRN-TEST-${timestamp}-${padded}`;
}

// Helper function to add days to date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Test tenant/organization
const testTenant = {
  id: 'tenant-test-001',
  name: 'Test Healthcare Clinic',
  slug: 'test-clinic',
  domain: 'test.unified.health',
  status: 'active' as const,
  subscriptionTier: 'premium',
  subscriptionStatus: 'active',
};

// Test users - matching schema field names
const testUsers = [
  {
    id: 'user-test-patient-001',
    email: 'patient@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Patient',
    phone: '+1-555-0101',
    dateOfBirth: new Date('1990-05-15'),
    role: 'patient' as const,
    status: 'active' as const,
    emailVerified: true,
  },
  {
    id: 'user-test-patient-002',
    email: 'patient2@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Second',
    lastName: 'Patient',
    phone: '+1-555-0102',
    dateOfBirth: new Date('1985-08-22'),
    role: 'patient' as const,
    status: 'active' as const,
    emailVerified: true,
  },
  {
    id: 'user-test-provider-001',
    email: 'provider@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Provider',
    phone: '+1-555-0201',
    dateOfBirth: new Date('1975-03-10'),
    role: 'provider' as const,
    status: 'active' as const,
    emailVerified: true,
  },
  {
    id: 'user-test-admin-001',
    email: 'admin@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Admin',
    phone: '+1-555-0301',
    dateOfBirth: new Date('1980-01-01'),
    role: 'admin' as const,
    status: 'active' as const,
    emailVerified: true,
  },
];

// Test providers
const testProviders = [
  {
    id: 'provider-test-001',
    userId: 'user-test-provider-001',
    licenseNumber: 'LIC-TEST-001',
    specialty: ['General Practice', 'Internal Medicine'],
    bio: 'Test provider for automated testing',
    available: true,
  },
];

// Test patients
const testPatients = [
  {
    id: 'patient-test-001',
    userId: 'user-test-patient-001',
    medicalRecordNumber: generateMRN(1),
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male' as const,
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '+1-555-0100',
      relationship: 'Spouse',
    },
  },
  {
    id: 'patient-test-002',
    userId: 'user-test-patient-002',
    medicalRecordNumber: generateMRN(2),
    dateOfBirth: new Date('1985-08-22'),
    gender: 'female' as const,
    bloodType: 'A+',
    allergies: [],
    emergencyContact: {
      name: 'Family Member',
      phone: '+1-555-0103',
      relationship: 'Parent',
    },
  },
];

// Test plans
const testPlans = [
  {
    id: 'plan-free',
    name: 'Free',
    description: 'Basic free plan for testing',
    price: 0,
    currency: 'USD',
    interval: 'monthly' as const,
    features: ['Basic appointments', 'Medical records view'],
    active: true,
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    description: 'Premium plan with all features',
    price: 29.99,
    currency: 'USD',
    interval: 'monthly' as const,
    features: ['Unlimited appointments', 'Telehealth', 'Priority support', 'AI symptom checker'],
    active: true,
  },
];

// Test appointments - using correct enum values
const testAppointments = [
  {
    id: 'apt-test-001',
    patientId: 'patient-test-001',
    providerId: 'provider-test-001',
    scheduledAt: addDays(new Date(), 7), // 1 week from now
    duration: 30,
    type: 'video' as const,
    status: 'scheduled' as const,
    reasonForVisit: 'Annual checkup',
    notes: 'Test appointment - scheduled',
  },
  {
    id: 'apt-test-002',
    patientId: 'patient-test-001',
    providerId: 'provider-test-001',
    scheduledAt: addDays(new Date(), -7), // 1 week ago
    duration: 45,
    type: 'in_person' as const,
    status: 'completed' as const,
    reasonForVisit: 'Follow-up consultation',
    notes: 'Test appointment - completed',
  },
  {
    id: 'apt-test-003',
    patientId: 'patient-test-002',
    providerId: 'provider-test-001',
    scheduledAt: addDays(new Date(), 14), // 2 weeks from now
    duration: 30,
    type: 'video' as const,
    status: 'confirmed' as const,
    reasonForVisit: 'New patient consultation',
    notes: null,
  },
];

// Test subscriptions
const testSubscriptions = [
  {
    id: 'sub-test-001',
    userId: 'user-test-patient-001',
    planId: 'plan-premium',
    status: 'active' as const,
    currentPeriodStart: addDays(new Date(), -15),
    currentPeriodEnd: addDays(new Date(), 15),
    cancelAtPeriodEnd: false,
  },
];

async function seedTestData() {
  console.log('Starting test data seeding...');
  console.log('Database URL:', process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || 'Not set');

  try {
    // Clean existing test data
    console.log('Cleaning existing test data...');
    await cleanTestData();

    // 1. Create tenant
    console.log('Creating test tenant...');
    await prisma.tenant.upsert({
      where: { id: testTenant.id },
      update: {},
      create: testTenant,
    });
    console.log(`  Created tenant: ${testTenant.name}`);

    // 2. Create users
    console.log('Creating test users...');
    for (const user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10);

      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          passwordHash: passwordHash,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          tenantId: testTenant.id,
        },
      });
      console.log(`  Created user: ${user.email} (${user.role})`);
    }

    // 3. Create providers
    console.log('Creating test providers...');
    for (const provider of testProviders) {
      await prisma.provider.upsert({
        where: { id: provider.id },
        update: {},
        create: {
          id: provider.id,
          userId: provider.userId,
          licenseNumber: provider.licenseNumber,
          specialty: provider.specialty,
          bio: provider.bio,
          available: provider.available,
          tenantId: testTenant.id,
        },
      });
      console.log(`  Created provider: ${provider.licenseNumber}`);
    }

    // 4. Create patients
    console.log('Creating test patients...');
    for (const patient of testPatients) {
      await prisma.patient.upsert({
        where: { id: patient.id },
        update: {},
        create: {
          id: patient.id,
          userId: patient.userId,
          medicalRecordNumber: patient.medicalRecordNumber,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodType: patient.bloodType,
          allergies: patient.allergies,
          emergencyContact: patient.emergencyContact,
          tenantId: testTenant.id,
        },
      });
      console.log(`  Created patient: ${patient.medicalRecordNumber}`);
    }

    // 5. Create plans
    console.log('Creating test plans...');
    for (const plan of testPlans) {
      await prisma.plan.upsert({
        where: { id: plan.id },
        update: {},
        create: plan,
      });
      console.log(`  Created plan: ${plan.name}`);
    }

    // 6. Create subscriptions
    console.log('Creating test subscriptions...');
    for (const subscription of testSubscriptions) {
      await prisma.subscription.upsert({
        where: { id: subscription.id },
        update: {},
        create: subscription,
      });
      console.log(`  Created subscription: ${subscription.id}`);
    }

    // 7. Create appointments
    console.log('Creating test appointments...');
    for (const appointment of testAppointments) {
      await prisma.appointment.upsert({
        where: { id: appointment.id },
        update: {},
        create: {
          ...appointment,
          tenantId: testTenant.id,
        },
      });
      console.log(`  Created appointment: ${appointment.id} (${appointment.status})`);
    }

    // 8. Create encounters for completed appointments
    console.log('Creating test encounters...');
    const completedAppointments = testAppointments.filter(a => a.status === 'completed');
    for (const appointment of completedAppointments) {
      const encounterId = `enc-${appointment.id}`;
      await prisma.encounter.upsert({
        where: { id: encounterId },
        update: {},
        create: {
          id: encounterId,
          patientId: appointment.patientId,
          providerId: appointment.providerId,
          appointmentId: appointment.id,
          type: appointment.type === 'in_person' ? 'in_person' : 'virtual',
          status: 'finished',
          startedAt: appointment.scheduledAt,
          endedAt: new Date(appointment.scheduledAt.getTime() + appointment.duration * 60 * 1000),
          tenantId: testTenant.id,
        },
      });
      console.log(`  Created encounter: ${encounterId}`);
    }

    console.log('\n========================================');
    console.log('Test data seeding completed successfully!');
    console.log('========================================\n');

    console.log('Summary:');
    console.log(`  Tenant: ${testTenant.name}`);
    console.log(`  Users: ${testUsers.length}`);
    console.log(`  Providers: ${testProviders.length}`);
    console.log(`  Patients: ${testPatients.length}`);
    console.log(`  Plans: ${testPlans.length}`);
    console.log(`  Subscriptions: ${testSubscriptions.length}`);
    console.log(`  Appointments: ${testAppointments.length}`);

    console.log('\nTest Credentials:');
    console.log('  Patient: patient@test.unified.health / TestPassword123!');
    console.log('  Patient2: patient2@test.unified.health / TestPassword123!');
    console.log('  Provider: provider@test.unified.health / TestPassword123!');
    console.log('  Admin: admin@test.unified.health / TestPassword123!');

  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanTestData() {
  // Clean test data in reverse order of dependencies
  const testIds = {
    encounterIds: testAppointments.filter(a => a.status === 'completed').map(a => `enc-${a.id}`),
    appointmentIds: testAppointments.map(a => a.id),
    subscriptionIds: testSubscriptions.map(s => s.id),
    planIds: testPlans.map(p => p.id),
    patientIds: testPatients.map(p => p.id),
    providerIds: testProviders.map(p => p.id),
    userIds: testUsers.map(u => u.id),
    tenantIds: [testTenant.id],
  };

  try {
    // Delete in order respecting foreign keys
    await prisma.encounter.deleteMany({
      where: { id: { in: testIds.encounterIds } },
    });

    await prisma.appointment.deleteMany({
      where: { id: { in: testIds.appointmentIds } },
    });

    await prisma.subscription.deleteMany({
      where: { id: { in: testIds.subscriptionIds } },
    });

    await prisma.patient.deleteMany({
      where: { id: { in: testIds.patientIds } },
    });

    await prisma.provider.deleteMany({
      where: { id: { in: testIds.providerIds } },
    });

    await prisma.user.deleteMany({
      where: { id: { in: testIds.userIds } },
    });

    // Don't delete plans as they might be shared
    // Don't delete tenant as it might have other data

    console.log('  Cleaned existing test data');
  } catch (error) {
    console.log('  Note: Some test data may not have existed to clean');
  }
}

// Run if called directly
seedTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export { seedTestData, cleanTestData };
