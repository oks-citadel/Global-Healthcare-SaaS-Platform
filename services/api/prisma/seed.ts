import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to load JSON data
function loadJsonData<T>(filename: string): T {
  const filePath = path.join(__dirname, 'seed-data', filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to generate medical record number
function generateMRN(index: number): string {
  const timestamp = Date.now().toString().slice(-6);
  const padded = index.toString().padStart(4, '0');
  return `MRN-${timestamp}-${padded}`;
}

// Helper function to generate random date in range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to add days to date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function main() {
  console.log('Starting database seed...');

  try {
    // Load seed data
    console.log('Loading seed data files...');
    const usersData = loadJsonData<any[]>('users.json');
    const providersData = loadJsonData<any[]>('providers.json');
    const patientsData = loadJsonData<any[]>('patients.json');
    const plansData = loadJsonData<any[]>('plans.json');

    // Clear existing data (in correct order due to foreign keys)
    console.log('Cleaning existing data...');
    await prisma.$transaction([
      prisma.auditEvent.deleteMany(),
      prisma.consent.deleteMany(),
      prisma.subscription.deleteMany(),
      prisma.plan.deleteMany(),
      prisma.document.deleteMany(),
      prisma.clinicalNote.deleteMany(),
      prisma.encounter.deleteMany(),
      prisma.chatMessage.deleteMany(),
      prisma.visit.deleteMany(),
      prisma.appointment.deleteMany(),
      prisma.provider.deleteMany(),
      prisma.patient.deleteMany(),
      prisma.refreshToken.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    console.log('Existing data cleaned.');

    // 1. Create Users
    console.log('Creating users...');
    const users = new Map<string, any>();

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          role: userData.role,
          status: 'active',
          emailVerified: userData.emailVerified,
        },
      });
      users.set(userData.email, user);
      console.log(`  Created user: ${user.email} (${user.role})`);
    }

    // 2. Create Providers
    console.log('Creating providers...');
    const providers = new Map<string, any>();

    for (const providerData of providersData) {
      const user = users.get(providerData.email);
      if (!user) {
        console.warn(`  User not found for provider: ${providerData.email}`);
        continue;
      }

      const provider = await prisma.provider.create({
        data: {
          userId: user.id,
          licenseNumber: providerData.licenseNumber,
          specialty: providerData.specialty,
          bio: providerData.bio,
          available: providerData.available,
        },
      });
      providers.set(providerData.email, provider);
      console.log(`  Created provider: ${user.firstName} ${user.lastName} - ${providerData.specialty.join(', ')}`);
    }

    // 3. Create Patients
    console.log('Creating patients...');
    const patients = new Map<string, any>();
    let mrnIndex = 1;

    for (const patientData of patientsData) {
      const user = users.get(patientData.email);
      if (!user) {
        console.warn(`  User not found for patient: ${patientData.email}`);
        continue;
      }

      const patient = await prisma.patient.create({
        data: {
          userId: user.id,
          medicalRecordNumber: generateMRN(mrnIndex++),
          dateOfBirth: user.dateOfBirth!,
          gender: patientData.gender,
          bloodType: patientData.bloodType,
          allergies: patientData.allergies,
          emergencyContact: patientData.emergencyContact,
        },
      });
      patients.set(patientData.email, patient);
      console.log(`  Created patient: ${user.firstName} ${user.lastName} - MRN: ${patient.medicalRecordNumber}`);
    }

    // 4. Create Subscription Plans
    console.log('Creating subscription plans...');
    const plans = new Map<string, any>();

    for (const planData of plansData) {
      const plan = await prisma.plan.create({
        data: {
          id: planData.id,
          name: planData.name,
          description: planData.description,
          price: planData.price,
          currency: planData.currency,
          interval: planData.interval,
          features: planData.features,
          active: planData.active,
        },
      });
      plans.set(planData.id, plan);
      console.log(`  Created plan: ${plan.name} - $${plan.price}/${plan.interval}`);
    }

    // 5. Create Subscriptions (for some patients)
    console.log('Creating subscriptions...');
    const patientArray = Array.from(patients.values());
    const planIds = ['basic-monthly', 'professional-monthly', 'enterprise-monthly'];

    for (let i = 0; i < Math.min(6, patientArray.length); i++) {
      const patient = patientArray[i];
      const user = users.get(Array.from(patients.keys())[i]);
      const planId = planIds[i % planIds.length];

      const now = new Date();
      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: planId,
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: addDays(now, 30),
          cancelAtPeriodEnd: false,
        },
      });
      console.log(`  Created subscription for ${user.firstName} ${user.lastName}: ${planId}`);
    }

    // 6. Create Appointments
    console.log('Creating appointments...');
    const appointments = [];
    const providerArray = Array.from(providers.values());
    const appointmentTypes = ['video', 'audio', 'chat', 'in_person'];
    const appointmentStatuses = ['completed', 'confirmed', 'scheduled'];

    if (providerArray.length > 0 && patientArray.length > 0) {
      const now = new Date();

      // Past appointments (last 30 days)
      for (let i = 0; i < 5; i++) {
        const patient = patientArray[i % patientArray.length];
        const provider = providerArray[i % providerArray.length];
        const scheduledAt = randomDate(addDays(now, -30), addDays(now, -1));

        const appointment = await prisma.appointment.create({
          data: {
            patientId: patient.id,
            providerId: provider.id,
            scheduledAt: scheduledAt,
            duration: 30,
            type: appointmentTypes[i % appointmentTypes.length] as any,
            status: 'completed',
            reasonForVisit: 'Routine checkup and consultation',
            notes: 'Patient presented in good health',
          },
        });
        appointments.push(appointment);
        console.log(`  Created past appointment: ${scheduledAt.toLocaleDateString()}`);
      }

      // Today's appointments
      for (let i = 0; i < 3; i++) {
        const patient = patientArray[(i + 5) % patientArray.length];
        const provider = providerArray[i % providerArray.length];
        const todayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const scheduledAt = new Date(todayBase.getTime() + (9 + i * 2) * 60 * 60 * 1000); // 9 AM, 11 AM, 1 PM

        const appointment = await prisma.appointment.create({
          data: {
            patientId: patient.id,
            providerId: provider.id,
            scheduledAt: scheduledAt,
            duration: 30,
            type: appointmentTypes[i % appointmentTypes.length] as any,
            status: 'confirmed',
            reasonForVisit: 'Follow-up consultation',
            notes: null,
          },
        });
        appointments.push(appointment);
        console.log(`  Created today's appointment: ${scheduledAt.toLocaleTimeString()}`);
      }

      // Future appointments (next 14 days)
      for (let i = 0; i < 7; i++) {
        const patient = patientArray[(i + 8) % patientArray.length];
        const provider = providerArray[i % providerArray.length];
        const scheduledAt = randomDate(addDays(now, 1), addDays(now, 14));

        const appointment = await prisma.appointment.create({
          data: {
            patientId: patient.id,
            providerId: provider.id,
            scheduledAt: scheduledAt,
            duration: 30,
            type: appointmentTypes[i % appointmentTypes.length] as any,
            status: appointmentStatuses[i % appointmentStatuses.length] as any,
            reasonForVisit: 'New patient consultation',
            notes: null,
          },
        });
        appointments.push(appointment);
        console.log(`  Created future appointment: ${scheduledAt.toLocaleDateString()}`);
      }
    }

    // 7. Create Encounters and Clinical Notes
    console.log('Creating encounters and clinical notes...');
    const completedAppointments = appointments.filter(a => a.status === 'completed');

    for (const appointment of completedAppointments) {
      const encounter = await prisma.encounter.create({
        data: {
          patientId: appointment.patientId,
          providerId: appointment.providerId,
          appointmentId: appointment.id,
          type: appointment.type === 'in_person' ? 'in_person' : 'virtual',
          status: 'finished',
          startedAt: appointment.scheduledAt,
          endedAt: addDays(appointment.scheduledAt, 0.0208), // 30 minutes later
        },
      });

      // Create clinical notes
      const provider = providerArray.find(p => p.id === appointment.providerId);
      const providerUser = Array.from(users.values()).find(u => u.id === provider?.userId);

      await prisma.clinicalNote.create({
        data: {
          encounterId: encounter.id,
          authorId: providerUser?.id || provider?.userId || '',
          noteType: 'SOAP',
          content: `Chief Complaint: ${appointment.reasonForVisit}\n\nSubjective: Patient reports feeling well overall.\n\nObjective: Vital signs within normal limits. Physical examination unremarkable.\n\nAssessment: Patient in good health, no acute concerns.\n\nPlan: Continue current medications, follow-up as needed.`,
          timestamp: encounter.endedAt!,
        },
      });

      console.log(`  Created encounter and clinical note for appointment ${appointment.id}`);
    }

    // 8. Create Documents
    console.log('Creating sample documents...');
    const documentTypes = ['lab_result', 'imaging', 'prescription', 'other'];

    for (let i = 0; i < Math.min(8, patientArray.length); i++) {
      const patient = patientArray[i];
      const user = Array.from(users.values()).find(u => u.id === patient.userId);
      const docType = documentTypes[i % documentTypes.length];

      await prisma.document.create({
        data: {
          patientId: patient.id,
          type: docType as any,
          fileName: `${docType}_${patient.medicalRecordNumber}_${Date.now()}.pdf`,
          fileUrl: `/documents/${patient.id}/${docType}_sample.pdf`,
          mimeType: 'application/pdf',
          size: 1024000 + Math.floor(Math.random() * 5000000),
          description: `Sample ${docType.replace('_', ' ')} document`,
          uploadedBy: user?.id || '',
        },
      });

      console.log(`  Created document (${docType}) for patient ${patient.medicalRecordNumber}`);
    }

    // 9. Create Consent Records
    console.log('Creating consent records...');
    const consentTypes = ['data_sharing', 'treatment', 'marketing', 'research'];

    for (let i = 0; i < patientArray.length; i++) {
      const patient = patientArray[i];

      // Each patient gets data_sharing and treatment consent
      await prisma.consent.create({
        data: {
          patientId: patient.id,
          type: 'data_sharing',
          granted: true,
          scope: 'Healthcare providers within the network',
          expiresAt: addDays(new Date(), 365),
        },
      });

      await prisma.consent.create({
        data: {
          patientId: patient.id,
          type: 'treatment',
          granted: true,
          scope: 'All medical treatments and procedures',
          expiresAt: null,
        },
      });

      // Random marketing consent
      if (i % 2 === 0) {
        await prisma.consent.create({
          data: {
            patientId: patient.id,
            type: 'marketing',
            granted: true,
            scope: 'Email and SMS communications',
            expiresAt: addDays(new Date(), 180),
          },
        });
      }

      console.log(`  Created consent records for patient ${patient.medicalRecordNumber}`);
    }

    // 10. Create Audit Events
    console.log('Creating audit events...');
    const actions = ['login', 'view_record', 'update_profile', 'create_appointment', 'view_document'];
    const resources = ['User', 'Patient', 'Appointment', 'Document', 'Encounter'];
    const allUsers = Array.from(users.values());

    for (let i = 0; i < 50; i++) {
      const user = allUsers[i % allUsers.length];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const resource = resources[Math.floor(Math.random() * resources.length)];
      const timestamp = randomDate(addDays(new Date(), -30), new Date());

      await prisma.auditEvent.create({
        data: {
          userId: user.id,
          action: action,
          resource: resource,
          resourceId: i % 2 === 0 ? `res_${i}` : null,
          details: {
            action: action,
            timestamp: timestamp.toISOString(),
            success: true,
          },
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: timestamp,
        },
      });
    }

    console.log(`  Created 50 audit events`);

    console.log('\nSeed completed successfully!');
    console.log('\nSummary:');
    console.log(`  Users: ${users.size}`);
    console.log(`  Providers: ${providers.size}`);
    console.log(`  Patients: ${patients.size}`);
    console.log(`  Plans: ${plans.size}`);
    console.log(`  Appointments: ${appointments.length}`);
    console.log('\nTest Credentials:');
    console.log('  Admin: admin@unifiedhealth.com / Admin123!');
    console.log('  Provider: dr.smith@unifiedhealth.com / Provider123!');
    console.log('  Patient: john.doe@example.com / Patient123!');

  } catch (error) {
    console.error('Error during seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
