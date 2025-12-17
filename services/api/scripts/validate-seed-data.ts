/**
 * Script to validate seed data JSON files
 * Run with: tsx scripts/validate-seed-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function loadJsonFile(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load ${filePath}: ${error}`);
  }
}

function validateUsers(data: any[]): ValidationResult {
  const result: ValidationResult = {
    file: 'users.json',
    valid: true,
    errors: [],
    warnings: [],
  };

  const emailSet = new Set<string>();
  const requiredFields = ['email', 'password', 'firstName', 'lastName', 'role', 'emailVerified'];
  const validRoles = ['patient', 'provider', 'admin'];

  data.forEach((user, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!(field in user)) {
        result.errors.push(`User ${index}: Missing required field '${field}'`);
        result.valid = false;
      }
    });

    // Check unique email
    if (emailSet.has(user.email)) {
      result.errors.push(`User ${index}: Duplicate email '${user.email}'`);
      result.valid = false;
    }
    emailSet.add(user.email);

    // Validate email format
    if (user.email && !user.email.includes('@')) {
      result.errors.push(`User ${index}: Invalid email format '${user.email}'`);
      result.valid = false;
    }

    // Validate role
    if (user.role && !validRoles.includes(user.role)) {
      result.errors.push(`User ${index}: Invalid role '${user.role}'. Must be one of: ${validRoles.join(', ')}`);
      result.valid = false;
    }

    // Check password strength
    if (user.password && user.password.length < 8) {
      result.warnings.push(`User ${index} (${user.email}): Password is less than 8 characters`);
    }

    // Validate date of birth if present
    if (user.dateOfBirth && isNaN(Date.parse(user.dateOfBirth))) {
      result.errors.push(`User ${index}: Invalid dateOfBirth format '${user.dateOfBirth}'`);
      result.valid = false;
    }
  });

  return result;
}

function validateProviders(data: any[], users: any[]): ValidationResult {
  const result: ValidationResult = {
    file: 'providers.json',
    valid: true,
    errors: [],
    warnings: [],
  };

  const userEmails = new Set(users.map(u => u.email));
  const providerEmails = new Set<string>();
  const requiredFields = ['email', 'licenseNumber', 'specialty', 'available'];

  data.forEach((provider, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!(field in provider)) {
        result.errors.push(`Provider ${index}: Missing required field '${field}'`);
        result.valid = false;
      }
    });

    // Check if user exists
    if (!userEmails.has(provider.email)) {
      result.errors.push(`Provider ${index}: No matching user found for email '${provider.email}'`);
      result.valid = false;
    }

    // Check if user is a provider
    const user = users.find(u => u.email === provider.email);
    if (user && user.role !== 'provider') {
      result.errors.push(`Provider ${index}: User '${provider.email}' is not a provider role`);
      result.valid = false;
    }

    // Check unique provider
    if (providerEmails.has(provider.email)) {
      result.errors.push(`Provider ${index}: Duplicate provider '${provider.email}'`);
      result.valid = false;
    }
    providerEmails.add(provider.email);

    // Validate specialty array
    if (provider.specialty && !Array.isArray(provider.specialty)) {
      result.errors.push(`Provider ${index}: specialty must be an array`);
      result.valid = false;
    } else if (provider.specialty && provider.specialty.length === 0) {
      result.warnings.push(`Provider ${index} (${provider.email}): No specialties listed`);
    }

    // Check license number format
    if (provider.licenseNumber && !/^[A-Z]{2}-\d{4}-\d{3}$/.test(provider.licenseNumber)) {
      result.warnings.push(`Provider ${index} (${provider.email}): License number format unusual '${provider.licenseNumber}'`);
    }
  });

  return result;
}

function validatePatients(data: any[], users: any[]): ValidationResult {
  const result: ValidationResult = {
    file: 'patients.json',
    valid: true,
    errors: [],
    warnings: [],
  };

  const userEmails = new Set(users.map(u => u.email));
  const patientEmails = new Set<string>();
  const requiredFields = ['email', 'gender', 'allergies'];
  const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];

  data.forEach((patient, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!(field in patient)) {
        result.errors.push(`Patient ${index}: Missing required field '${field}'`);
        result.valid = false;
      }
    });

    // Check if user exists
    if (!userEmails.has(patient.email)) {
      result.errors.push(`Patient ${index}: No matching user found for email '${patient.email}'`);
      result.valid = false;
    }

    // Check if user is a patient
    const user = users.find(u => u.email === patient.email);
    if (user && user.role !== 'patient') {
      result.errors.push(`Patient ${index}: User '${patient.email}' is not a patient role`);
      result.valid = false;
    }

    // Check unique patient
    if (patientEmails.has(patient.email)) {
      result.errors.push(`Patient ${index}: Duplicate patient '${patient.email}'`);
      result.valid = false;
    }
    patientEmails.add(patient.email);

    // Validate gender
    if (patient.gender && !validGenders.includes(patient.gender)) {
      result.errors.push(`Patient ${index}: Invalid gender '${patient.gender}'. Must be one of: ${validGenders.join(', ')}`);
      result.valid = false;
    }

    // Validate allergies array
    if (patient.allergies && !Array.isArray(patient.allergies)) {
      result.errors.push(`Patient ${index}: allergies must be an array`);
      result.valid = false;
    }

    // Validate emergency contact
    if (patient.emergencyContact) {
      const ec = patient.emergencyContact;
      if (!ec.name || !ec.relationship || !ec.phone) {
        result.warnings.push(`Patient ${index} (${patient.email}): Incomplete emergency contact information`);
      }
    } else {
      result.warnings.push(`Patient ${index} (${patient.email}): No emergency contact provided`);
    }

    // Check if user has dateOfBirth
    if (user && !user.dateOfBirth) {
      result.errors.push(`Patient ${index}: User '${patient.email}' must have dateOfBirth`);
      result.valid = false;
    }
  });

  return result;
}

function validatePlans(data: any[]): ValidationResult {
  const result: ValidationResult = {
    file: 'plans.json',
    valid: true,
    errors: [],
    warnings: [],
  };

  const planIds = new Set<string>();
  const requiredFields = ['id', 'name', 'description', 'price', 'currency', 'interval', 'features', 'active'];
  const validIntervals = ['monthly', 'annual'];

  data.forEach((plan, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!(field in plan)) {
        result.errors.push(`Plan ${index}: Missing required field '${field}'`);
        result.valid = false;
      }
    });

    // Check unique plan ID
    if (planIds.has(plan.id)) {
      result.errors.push(`Plan ${index}: Duplicate plan ID '${plan.id}'`);
      result.valid = false;
    }
    planIds.add(plan.id);

    // Validate interval
    if (plan.interval && !validIntervals.includes(plan.interval)) {
      result.errors.push(`Plan ${index}: Invalid interval '${plan.interval}'. Must be one of: ${validIntervals.join(', ')}`);
      result.valid = false;
    }

    // Validate price
    if (plan.price && isNaN(parseFloat(plan.price))) {
      result.errors.push(`Plan ${index}: Invalid price '${plan.price}'`);
      result.valid = false;
    }

    // Validate features array
    if (plan.features && !Array.isArray(plan.features)) {
      result.errors.push(`Plan ${index}: features must be an array`);
      result.valid = false;
    } else if (plan.features && plan.features.length === 0) {
      result.warnings.push(`Plan ${index} (${plan.id}): No features listed`);
    }

    // Check currency
    if (plan.currency && plan.currency !== 'USD') {
      result.warnings.push(`Plan ${index} (${plan.id}): Using non-USD currency '${plan.currency}'`);
    }
  });

  return result;
}

function main() {
  console.log('========================================');
  console.log('Seed Data Validation');
  console.log('========================================\n');

  const seedDataDir = path.join(__dirname, '..', 'prisma', 'seed-data');
  const results: ValidationResult[] = [];

  try {
    // Load all data
    const users = loadJsonFile(path.join(seedDataDir, 'users.json'));
    const providers = loadJsonFile(path.join(seedDataDir, 'providers.json'));
    const patients = loadJsonFile(path.join(seedDataDir, 'patients.json'));
    const plans = loadJsonFile(path.join(seedDataDir, 'plans.json'));

    // Validate each file
    results.push(validateUsers(users));
    results.push(validateProviders(providers, users));
    results.push(validatePatients(patients, users));
    results.push(validatePlans(plans));

    // Print results
    let allValid = true;
    results.forEach(result => {
      console.log(`\n${result.file}:`);
      console.log('─'.repeat(40));

      if (result.errors.length === 0 && result.warnings.length === 0) {
        console.log('✓ Valid - No issues found');
      } else {
        if (result.errors.length > 0) {
          console.log('\nErrors:');
          result.errors.forEach(error => console.log(`  ✗ ${error}`));
          allValid = false;
        }

        if (result.warnings.length > 0) {
          console.log('\nWarnings:');
          result.warnings.forEach(warning => console.log(`  ⚠ ${warning}`));
        }
      }
    });

    console.log('\n========================================');
    if (allValid) {
      console.log('✓ All seed data is valid!');
      console.log('========================================\n');
      process.exit(0);
    } else {
      console.log('✗ Validation failed - please fix errors');
      console.log('========================================\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
  }
}

main();
