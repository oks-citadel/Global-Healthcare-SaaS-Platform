import { PrismaClient, NotificationChannel } from '../src/generated/client/index.js';

const prisma = new PrismaClient();

interface TemplateData {
  name: string;
  type: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  variables: string[];
  locale: string;
}

const templates: TemplateData[] = [
  // Welcome Email Templates
  {
    name: 'welcome_email',
    type: 'onboarding',
    channel: 'email',
    subject: 'Welcome to Unified Health - Your Healthcare Journey Begins!',
    body: `Dear {{patientName}},

Welcome to Unified Health! We're excited to have you join our healthcare community.

Your account has been successfully created. Here's what you can do next:

1. Complete your health profile
2. Find and book appointments with healthcare providers
3. Access your health records securely
4. Set up medication reminders

If you have any questions, our support team is here to help 24/7.

Best regards,
The Unified Health Team

---
This email was sent to {{email}}. If you did not create this account, please contact support immediately.`,
    variables: ['patientName', 'email'],
    locale: 'en',
  },
  {
    name: 'welcome_email_es',
    type: 'onboarding',
    channel: 'email',
    subject: 'Bienvenido a Unified Health - Su Viaje de Salud Comienza!',
    body: `Estimado/a {{patientName}},

Bienvenido/a a Unified Health! Estamos emocionados de tenerle en nuestra comunidad de salud.

Su cuenta ha sido creada exitosamente. Esto es lo que puede hacer:

1. Complete su perfil de salud
2. Encuentre y reserve citas con proveedores de salud
3. Acceda a sus registros de salud de forma segura
4. Configure recordatorios de medicamentos

Si tiene alguna pregunta, nuestro equipo de soporte esta disponible 24/7.

Saludos cordiales,
El Equipo de Unified Health`,
    variables: ['patientName', 'email'],
    locale: 'es',
  },

  // Password Reset Templates
  {
    name: 'password_reset_email',
    type: 'security',
    channel: 'email',
    subject: 'Password Reset Request - Unified Health',
    body: `Dear {{patientName}},

We received a request to reset your password for your Unified Health account.

Click the link below to reset your password:
{{resetLink}}

This link will expire in {{expirationHours}} hours.

If you did not request a password reset, please ignore this email or contact support if you have concerns about your account security.

Best regards,
The Unified Health Security Team

---
For security reasons, we never ask for your password via email.`,
    variables: ['patientName', 'resetLink', 'expirationHours'],
    locale: 'en',
  },
  {
    name: 'password_reset_sms',
    type: 'security',
    channel: 'sms',
    body: 'Unified Health: Your password reset code is {{resetCode}}. This code expires in {{expirationMinutes}} minutes. Do not share this code.',
    variables: ['resetCode', 'expirationMinutes'],
    locale: 'en',
  },

  // Appointment Reminder Templates
  {
    name: 'appointment_reminder_email',
    type: 'appointment',
    channel: 'email',
    subject: 'Appointment Reminder - {{providerName}} on {{appointmentDate}}',
    body: `Dear {{patientName}},

This is a reminder for your upcoming appointment:

Provider: {{providerName}}
Specialty: {{specialty}}
Date: {{appointmentDate}}
Time: {{appointmentTime}}
Location: {{location}}
Type: {{appointmentType}}

Please arrive 15 minutes early to complete any necessary paperwork.

Need to reschedule? Contact us at least 24 hours before your appointment.

Manage your appointment: {{appointmentLink}}

Best regards,
Unified Health Scheduling Team`,
    variables: ['patientName', 'providerName', 'specialty', 'appointmentDate', 'appointmentTime', 'location', 'appointmentType', 'appointmentLink'],
    locale: 'en',
  },
  {
    name: 'appointment_reminder_sms',
    type: 'appointment',
    channel: 'sms',
    body: 'Unified Health: Reminder - Your appointment with {{providerName}} is on {{appointmentDate}} at {{appointmentTime}}. Reply CONFIRM to confirm or call to reschedule.',
    variables: ['providerName', 'appointmentDate', 'appointmentTime'],
    locale: 'en',
  },
  {
    name: 'appointment_reminder_push',
    type: 'appointment',
    channel: 'push',
    body: 'Upcoming appointment with {{providerName}} on {{appointmentDate}} at {{appointmentTime}}',
    variables: ['providerName', 'appointmentDate', 'appointmentTime'],
    locale: 'en',
  },
  {
    name: 'appointment_confirmation_email',
    type: 'appointment',
    channel: 'email',
    subject: 'Appointment Confirmed - {{providerName}} on {{appointmentDate}}',
    body: `Dear {{patientName}},

Your appointment has been confirmed!

Provider: {{providerName}}
Date: {{appointmentDate}}
Time: {{appointmentTime}}
Location: {{location}}

Add to your calendar: {{calendarLink}}

We look forward to seeing you!

Best regards,
Unified Health Scheduling Team`,
    variables: ['patientName', 'providerName', 'appointmentDate', 'appointmentTime', 'location', 'calendarLink'],
    locale: 'en',
  },
  {
    name: 'appointment_cancelled_email',
    type: 'appointment',
    channel: 'email',
    subject: 'Appointment Cancelled - {{providerName}} on {{appointmentDate}}',
    body: `Dear {{patientName}},

Your appointment has been cancelled:

Provider: {{providerName}}
Date: {{appointmentDate}}
Time: {{appointmentTime}}

Cancellation Reason: {{cancellationReason}}

Would you like to reschedule? Book a new appointment: {{bookingLink}}

Best regards,
Unified Health Scheduling Team`,
    variables: ['patientName', 'providerName', 'appointmentDate', 'appointmentTime', 'cancellationReason', 'bookingLink'],
    locale: 'en',
  },

  // Lab Results Templates
  {
    name: 'lab_results_ready_email',
    type: 'lab_results',
    channel: 'email',
    subject: 'Your Lab Results Are Ready - Unified Health',
    body: `Dear {{patientName}},

Your lab results from {{labDate}} are now available.

Test Type: {{testType}}
Ordered By: {{providerName}}

You can view your results securely in your patient portal:
{{resultsLink}}

If you have questions about your results, please contact your healthcare provider.

Best regards,
Unified Health Lab Services`,
    variables: ['patientName', 'labDate', 'testType', 'providerName', 'resultsLink'],
    locale: 'en',
  },
  {
    name: 'lab_results_ready_push',
    type: 'lab_results',
    channel: 'push',
    body: 'Your lab results from {{labDate}} are ready. Tap to view.',
    variables: ['labDate'],
    locale: 'en',
  },
  {
    name: 'lab_results_ready_sms',
    type: 'lab_results',
    channel: 'sms',
    body: 'Unified Health: Your lab results from {{labDate}} are ready. Log in to your patient portal to view them.',
    variables: ['labDate'],
    locale: 'en',
  },

  // Prescription Templates
  {
    name: 'prescription_ready_email',
    type: 'prescription',
    channel: 'email',
    subject: 'Your Prescription is Ready for Pickup',
    body: `Dear {{patientName}},

Your prescription is ready for pickup!

Medication: {{medicationName}}
Dosage: {{dosage}}
Quantity: {{quantity}}
Pharmacy: {{pharmacyName}}
Address: {{pharmacyAddress}}
Pickup Code: {{pickupCode}}

Please bring a valid ID when picking up your prescription.

Questions about your medication? Contact your healthcare provider or pharmacist.

Best regards,
Unified Health Pharmacy Services`,
    variables: ['patientName', 'medicationName', 'dosage', 'quantity', 'pharmacyName', 'pharmacyAddress', 'pickupCode'],
    locale: 'en',
  },
  {
    name: 'prescription_ready_sms',
    type: 'prescription',
    channel: 'sms',
    body: 'Unified Health: Your prescription for {{medicationName}} is ready at {{pharmacyName}}. Pickup code: {{pickupCode}}',
    variables: ['medicationName', 'pharmacyName', 'pickupCode'],
    locale: 'en',
  },
  {
    name: 'prescription_refill_reminder_email',
    type: 'prescription',
    channel: 'email',
    subject: 'Time to Refill Your Prescription - {{medicationName}}',
    body: `Dear {{patientName}},

Your prescription for {{medicationName}} will run out in {{daysRemaining}} days.

Current Supply: {{daysRemaining}} days remaining
Last Refill: {{lastRefillDate}}
Prescribing Provider: {{providerName}}

Request a refill now: {{refillLink}}

Don't run out of your medication - order your refill today!

Best regards,
Unified Health Pharmacy Services`,
    variables: ['patientName', 'medicationName', 'daysRemaining', 'lastRefillDate', 'providerName', 'refillLink'],
    locale: 'en',
  },

  // Billing Templates
  {
    name: 'billing_statement_email',
    type: 'billing',
    channel: 'email',
    subject: 'Your Statement from Unified Health - Amount Due: ${{amountDue}}',
    body: `Dear {{patientName}},

Your latest statement from Unified Health is ready.

Statement Date: {{statementDate}}
Amount Due: ${{amountDue}}
Due Date: {{dueDate}}

Service Summary:
{{servicesSummary}}

View and pay your bill online: {{paymentLink}}

Payment Options:
- Pay online with credit/debit card
- Set up a payment plan
- Contact our billing department

Questions about your bill? Contact us at {{billingPhone}} or {{billingEmail}}.

Best regards,
Unified Health Billing Department`,
    variables: ['patientName', 'statementDate', 'amountDue', 'dueDate', 'servicesSummary', 'paymentLink', 'billingPhone', 'billingEmail'],
    locale: 'en',
  },
  {
    name: 'payment_received_email',
    type: 'billing',
    channel: 'email',
    subject: 'Payment Received - Thank You!',
    body: `Dear {{patientName}},

Thank you for your payment!

Payment Amount: ${{paymentAmount}}
Payment Date: {{paymentDate}}
Payment Method: {{paymentMethod}}
Confirmation Number: {{confirmationNumber}}

Your remaining balance: ${{remainingBalance}}

View your payment history: {{accountLink}}

Best regards,
Unified Health Billing Department`,
    variables: ['patientName', 'paymentAmount', 'paymentDate', 'paymentMethod', 'confirmationNumber', 'remainingBalance', 'accountLink'],
    locale: 'en',
  },
  {
    name: 'payment_reminder_sms',
    type: 'billing',
    channel: 'sms',
    body: 'Unified Health: Payment reminder - ${{amountDue}} is due on {{dueDate}}. Pay online at {{paymentLink}} or call {{billingPhone}}.',
    variables: ['amountDue', 'dueDate', 'paymentLink', 'billingPhone'],
    locale: 'en',
  },

  // System Alert Templates
  {
    name: 'system_maintenance_email',
    type: 'system',
    channel: 'email',
    subject: 'Scheduled Maintenance - {{maintenanceDate}}',
    body: `Dear {{patientName}},

We will be performing scheduled maintenance on our systems.

Maintenance Window:
Start: {{startTime}}
End: {{endTime}}
Affected Services: {{affectedServices}}

During this time, you may experience intermittent access to our online services.

We apologize for any inconvenience and appreciate your patience.

Best regards,
Unified Health Technical Team`,
    variables: ['patientName', 'maintenanceDate', 'startTime', 'endTime', 'affectedServices'],
    locale: 'en',
  },
  {
    name: 'security_alert_email',
    type: 'system',
    channel: 'email',
    subject: 'Security Alert - New Login Detected',
    body: `Dear {{patientName}},

We detected a new login to your Unified Health account.

Login Details:
Date/Time: {{loginTime}}
Device: {{deviceType}}
Location: {{loginLocation}}
IP Address: {{ipAddress}}

If this was you, no action is needed.

If you don't recognize this activity, please:
1. Change your password immediately: {{passwordResetLink}}
2. Contact our security team: {{securityEmail}}

Best regards,
Unified Health Security Team`,
    variables: ['patientName', 'loginTime', 'deviceType', 'loginLocation', 'ipAddress', 'passwordResetLink', 'securityEmail'],
    locale: 'en',
  },
  {
    name: 'account_verification_email',
    type: 'system',
    channel: 'email',
    subject: 'Verify Your Email Address - Unified Health',
    body: `Dear {{patientName}},

Please verify your email address to complete your Unified Health account setup.

Click the link below to verify:
{{verificationLink}}

This link will expire in {{expirationHours}} hours.

If you did not create an account, please ignore this email.

Best regards,
Unified Health`,
    variables: ['patientName', 'verificationLink', 'expirationHours'],
    locale: 'en',
  },
  {
    name: 'two_factor_code_sms',
    type: 'system',
    channel: 'sms',
    body: 'Unified Health: Your verification code is {{verificationCode}}. Expires in {{expirationMinutes}} minutes. Do not share this code.',
    variables: ['verificationCode', 'expirationMinutes'],
    locale: 'en',
  },

  // In-App Notification Templates
  {
    name: 'new_message_in_app',
    type: 'messaging',
    channel: 'in_app',
    body: 'New message from {{senderName}}: {{messagePreview}}',
    variables: ['senderName', 'messagePreview'],
    locale: 'en',
  },
  {
    name: 'health_reminder_in_app',
    type: 'health',
    channel: 'in_app',
    body: 'Health Reminder: {{reminderMessage}}',
    variables: ['reminderMessage'],
    locale: 'en',
  },
  {
    name: 'medication_reminder_push',
    type: 'health',
    channel: 'push',
    body: 'Time to take your medication: {{medicationName}} ({{dosage}})',
    variables: ['medicationName', 'dosage'],
    locale: 'en',
  },
];

async function main() {
  console.log('Seeding notification templates...');

  for (const template of templates) {
    const existing = await prisma.notificationTemplate.findUnique({
      where: { name: template.name },
    });

    if (existing) {
      console.log(`Template "${template.name}" already exists, updating...`);
      await prisma.notificationTemplate.update({
        where: { name: template.name },
        data: {
          type: template.type,
          channel: template.channel,
          subject: template.subject,
          body: template.body,
          variables: template.variables,
          locale: template.locale,
        },
      });
    } else {
      console.log(`Creating template "${template.name}"...`);
      await prisma.notificationTemplate.create({
        data: {
          name: template.name,
          type: template.type,
          channel: template.channel,
          subject: template.subject,
          body: template.body,
          variables: template.variables,
          locale: template.locale,
        },
      });
    }
  }

  console.log(`Seeded ${templates.length} notification templates.`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
