import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Production seed data - Creates essential baseline data only
async function main() {
  console.log('Starting production database seed...');
  console.log('⚠️  This will create baseline data for production environment');

  try {
    // ===========================================
    // 1. Create Subscription Plans
    // ===========================================
    console.log('\n📦 Creating subscription plans...');

    const plans = [
      {
        id: 'basic-monthly',
        name: 'Basic Plan',
        description: 'Essential healthcare access for individuals',
        price: '29.99',
        currency: 'USD',
        interval: 'monthly' as const,
        features: [
          'Unlimited virtual consultations',
          '24/7 chat support',
          'Prescription management',
          'Health records access',
          'Basic lab results',
        ],
        active: true,
      },
      {
        id: 'basic-annual',
        name: 'Basic Plan (Annual)',
        description: 'Essential healthcare access for individuals - Annual billing',
        price: '299.99',
        currency: 'USD',
        interval: 'annual' as const,
        features: [
          'Unlimited virtual consultations',
          '24/7 chat support',
          'Prescription management',
          'Health records access',
          'Basic lab results',
          '2 months free',
        ],
        active: true,
      },
      {
        id: 'professional-monthly',
        name: 'Professional Plan',
        description: 'Advanced healthcare with priority support',
        price: '79.99',
        currency: 'USD',
        interval: 'monthly' as const,
        features: [
          'Everything in Basic',
          'Priority scheduling',
          'Specialist consultations',
          'Mental health support',
          'Nutrition counseling',
          'Advanced diagnostics',
          'Family sharing (up to 4 members)',
        ],
        active: true,
      },
      {
        id: 'professional-annual',
        name: 'Professional Plan (Annual)',
        description: 'Advanced healthcare with priority support - Annual billing',
        price: '799.99',
        currency: 'USD',
        interval: 'annual' as const,
        features: [
          'Everything in Basic',
          'Priority scheduling',
          'Specialist consultations',
          'Mental health support',
          'Nutrition counseling',
          'Advanced diagnostics',
          'Family sharing (up to 4 members)',
          '2 months free',
        ],
        active: true,
      },
      {
        id: 'enterprise-monthly',
        name: 'Enterprise Plan',
        description: 'Comprehensive healthcare solution for organizations',
        price: '199.99',
        currency: 'USD',
        interval: 'monthly' as const,
        features: [
          'Everything in Professional',
          'Dedicated account manager',
          'Custom integrations',
          'Advanced analytics',
          'Compliance reporting',
          'On-site health screenings',
          'Unlimited family members',
          'Corporate wellness program',
          'API access',
        ],
        active: true,
      },
      {
        id: 'enterprise-annual',
        name: 'Enterprise Plan (Annual)',
        description: 'Comprehensive healthcare solution for organizations - Annual billing',
        price: '1999.99',
        currency: 'USD',
        interval: 'annual' as const,
        features: [
          'Everything in Professional',
          'Dedicated account manager',
          'Custom integrations',
          'Advanced analytics',
          'Compliance reporting',
          'On-site health screenings',
          'Unlimited family members',
          'Corporate wellness program',
          'API access',
          '2 months free',
        ],
        active: true,
      },
    ];

    for (const planData of plans) {
      const plan = await prisma.plan.upsert({
        where: { id: planData.id },
        update: planData,
        create: planData,
      });
      console.log(`  ✓ Created/Updated plan: ${plan.name} - $${plan.price}/${plan.interval}`);
    }

    // ===========================================
    // 2. Create Health Packages
    // ===========================================
    console.log('\n🏥 Creating health packages...');

    const healthPackages = [
      {
        name: 'General Health Checkup',
        description: 'Comprehensive health screening for overall wellness assessment',
        category: 'general_checkup' as const,
        price: '99.99',
        currency: 'USD',
        duration: 60,
        active: true,
        popular: true,
        tests: ['Complete Blood Count', 'Lipid Profile', 'Blood Glucose', 'Thyroid Function'],
        consultations: 1,
        followUps: 1,
      },
      {
        name: 'Cardiac Health Package',
        description: 'Advanced heart health assessment with ECG and stress testing',
        category: 'cardiac' as const,
        price: '249.99',
        currency: 'USD',
        duration: 90,
        active: true,
        popular: true,
        tests: ['ECG', 'Echocardiogram', 'Lipid Profile', 'Cardiac Enzymes', 'Stress Test'],
        consultations: 1,
        followUps: 2,
      },
      {
        name: 'Diabetes Management Package',
        description: 'Comprehensive diabetes screening and management consultation',
        category: 'diabetes' as const,
        price: '149.99',
        currency: 'USD',
        duration: 75,
        active: true,
        popular: true,
        tests: ['HbA1c', 'Fasting Blood Sugar', 'Post-Prandial Sugar', 'Kidney Function', 'Lipid Profile'],
        consultations: 1,
        followUps: 2,
      },
      {
        name: 'Women\'s Health Package',
        description: 'Comprehensive women\'s health screening and consultation',
        category: 'womens_health' as const,
        price: '179.99',
        currency: 'USD',
        duration: 90,
        active: true,
        popular: false,
        tests: ['Mammography', 'Pap Smear', 'Bone Density', 'Thyroid Profile', 'Iron Studies'],
        consultations: 1,
        followUps: 1,
      },
      {
        name: 'Executive Health Checkup',
        description: 'Premium comprehensive health assessment for busy professionals',
        category: 'executive' as const,
        price: '499.99',
        currency: 'USD',
        duration: 180,
        active: true,
        popular: true,
        tests: [
          'Complete Blood Count',
          'Comprehensive Metabolic Panel',
          'Lipid Profile',
          'Thyroid Function',
          'Liver Function',
          'Kidney Function',
          'Cardiac Markers',
          'Cancer Markers',
          'Vitamin D',
          'ECG',
          'Chest X-Ray',
          'Ultrasound Abdomen',
        ],
        consultations: 2,
        followUps: 3,
      },
    ];

    for (const packageData of healthPackages) {
      const pkg = await prisma.healthPackage.create({
        data: packageData,
      });
      console.log(`  ✓ Created health package: ${pkg.name} - $${pkg.price}`);
    }

    // ===========================================
    // 3. Create Diagnostic Tests
    // ===========================================
    console.log('\n🔬 Creating diagnostic tests...');

    const diagnosticTests = [
      {
        name: 'Complete Blood Count (CBC)',
        code: 'LAB-CBC-001',
        category: 'hematology' as const,
        description: 'Comprehensive blood cell analysis',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '4-6 hours',
        price: '25.00',
        currency: 'USD',
        active: true,
        referenceRanges: {
          wbc: '4.5-11.0 x10^9/L',
          rbc: '4.5-5.5 x10^12/L',
          hemoglobin: '13.5-17.5 g/dL (M), 12.0-15.5 g/dL (F)',
          platelets: '150-400 x10^9/L',
        },
      },
      {
        name: 'Lipid Profile',
        code: 'LAB-LIPID-001',
        category: 'biochemistry' as const,
        description: 'Cholesterol and triglyceride levels assessment',
        preparation: '12-14 hours fasting required',
        sampleType: 'Blood',
        turnaroundTime: '6-8 hours',
        price: '35.00',
        currency: 'USD',
        active: true,
        referenceRanges: {
          totalCholesterol: '<200 mg/dL',
          ldl: '<100 mg/dL',
          hdl: '>40 mg/dL (M), >50 mg/dL (F)',
          triglycerides: '<150 mg/dL',
        },
      },
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        code: 'LAB-HBA1C-001',
        category: 'endocrinology' as const,
        description: 'Average blood sugar over 3 months',
        preparation: 'No fasting required',
        sampleType: 'Blood',
        turnaroundTime: '24 hours',
        price: '40.00',
        currency: 'USD',
        active: true,
        referenceRanges: {
          normal: '<5.7%',
          prediabetes: '5.7-6.4%',
          diabetes: '>=6.5%',
        },
      },
      {
        name: 'Thyroid Function Test (TFT)',
        code: 'LAB-THYROID-001',
        category: 'endocrinology' as const,
        description: 'Thyroid hormone levels assessment',
        preparation: 'No special preparation required',
        sampleType: 'Blood',
        turnaroundTime: '24-48 hours',
        price: '50.00',
        currency: 'USD',
        active: true,
        referenceRanges: {
          tsh: '0.4-4.0 mIU/L',
          t3: '80-200 ng/dL',
          t4: '5.0-12.0 μg/dL',
        },
      },
      {
        name: 'Liver Function Test (LFT)',
        code: 'LAB-LFT-001',
        category: 'biochemistry' as const,
        description: 'Liver enzyme and function assessment',
        preparation: '8-12 hours fasting recommended',
        sampleType: 'Blood',
        turnaroundTime: '12-24 hours',
        price: '45.00',
        currency: 'USD',
        active: true,
        referenceRanges: {
          alt: '7-56 U/L',
          ast: '10-40 U/L',
          alp: '44-147 U/L',
          bilirubin: '0.1-1.2 mg/dL',
        },
      },
    ];

    for (const testData of diagnosticTests) {
      const test = await prisma.diagnosticTest.upsert({
        where: { code: testData.code },
        update: testData,
        create: testData,
      });
      console.log(`  ✓ Created diagnostic test: ${test.name} (${test.code})`);
    }

    // ===========================================
    // 4. Create Default Admin User
    // ===========================================
    console.log('\n👤 Creating default admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@theunifiedhealth.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!CHANGE_ME', 10);

      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@theunifiedhealth.com',
          password: hashedPassword,
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+1-555-0100',
          role: 'admin',
          status: 'active',
          emailVerified: true,
        },
      });

      console.log(`  ✓ Created admin user: ${adminUser.email}`);
      console.log(`  ⚠️  IMPORTANT: Change the default admin password immediately!`);
    } else {
      console.log(`  ℹ️  Admin user already exists: ${existingAdmin.email}`);
    }

    // ===========================================
    // Summary
    // ===========================================
    console.log('\n✅ Production seed completed successfully!\n');
    console.log('Summary:');
    console.log(`  - Subscription Plans: ${plans.length}`);
    console.log(`  - Health Packages: ${healthPackages.length}`);
    console.log(`  - Diagnostic Tests: ${diagnosticTests.length}`);
    console.log(`  - Admin User: 1\n`);

    console.log('Default Credentials:');
    console.log('  Email: admin@theunifiedhealth.com');
    console.log('  Password: See ADMIN_DEFAULT_PASSWORD env variable');
    console.log('\n⚠️  SECURITY REMINDER:');
    console.log('  1. Change the admin password immediately after first login');
    console.log('  2. Enable MFA for admin accounts');
    console.log('  3. Review and update subscription plan pricing');
    console.log('  4. Configure backup and monitoring before going live\n');

  } catch (error) {
    console.error('❌ Error during production seed:', error);
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
