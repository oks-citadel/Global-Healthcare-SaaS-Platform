/**
 * Test Data Generators
 * Utilities for generating random test data
 */

/**
 * Generate a random string of specified length
 */
export function randomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email address
 */
export function randomEmail(domain: string = 'test.unified.health'): string {
  return `test-${randomString(8)}@${domain}`;
}

/**
 * Generate a random phone number
 */
export function randomPhone(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const subscriber = Math.floor(Math.random() * 9000) + 1000;
  return `+1${areaCode}${exchange}${subscriber}`;
}

/**
 * Generate a random UUID v4
 */
export function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a random date within a range
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random future date
 */
export function randomFutureDate(daysAhead: number = 30): Date {
  const now = new Date();
  const future = new Date(now.getTime() + Math.random() * daysAhead * 24 * 60 * 60 * 1000);
  return future;
}

/**
 * Generate a random past date
 */
export function randomPastDate(daysBack: number = 30): Date {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return past;
}

/**
 * Generate a random time slot (HH:MM format)
 */
export function randomTimeSlot(): string {
  const hour = Math.floor(Math.random() * 10) + 8; // 8 AM to 5 PM
  const minute = Math.random() > 0.5 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

/**
 * Pick a random item from an array
 */
export function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Pick multiple random items from an array
 */
export function randomPickMultiple<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Generate a random integer within a range
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random boolean
 */
export function randomBool(): boolean {
  return Math.random() > 0.5;
}

/**
 * Generate a random password meeting common requirements
 */
export function randomPassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  let password = '';

  // Ensure at least one of each type
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));

  // Fill the rest randomly
  const allChars = lowercase + uppercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

// Healthcare-specific generators

/**
 * Generate a random MRN (Medical Record Number)
 */
export function randomMRN(): string {
  return `MRN${randomInt(100000, 999999)}`;
}

/**
 * Generate a random NPI (National Provider Identifier)
 */
export function randomNPI(): string {
  return randomInt(1000000000, 9999999999).toString();
}

/**
 * Generate a random appointment type
 */
export function randomAppointmentType(): string {
  return randomPick(['video', 'audio', 'chat', 'in_person']);
}

/**
 * Generate a random appointment status
 */
export function randomAppointmentStatus(): string {
  return randomPick(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']);
}

/**
 * Generate random vitals data
 */
export function randomVitals(): {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
} {
  return {
    bloodPressureSystolic: randomInt(90, 140),
    bloodPressureDiastolic: randomInt(60, 90),
    heartRate: randomInt(60, 100),
    temperature: 97 + Math.random() * 2.5,
    weight: randomInt(100, 300),
    height: randomInt(60, 78),
  };
}

/**
 * Generate a random allergy
 */
export function randomAllergy(): { allergen: string; severity: string; reaction: string } {
  const allergens = ['Penicillin', 'Aspirin', 'Ibuprofen', 'Latex', 'Peanuts', 'Shellfish', 'Sulfa drugs'];
  const severities = ['mild', 'moderate', 'severe'];
  const reactions = ['Hives', 'Swelling', 'Difficulty breathing', 'Nausea', 'Rash'];

  return {
    allergen: randomPick(allergens),
    severity: randomPick(severities),
    reaction: randomPick(reactions),
  };
}

/**
 * Generate a random medication
 */
export function randomMedication(): { name: string; dosage: string; frequency: string } {
  const medications = [
    'Lisinopril', 'Metformin', 'Atorvastatin', 'Omeprazole', 'Amlodipine',
    'Gabapentin', 'Losartan', 'Hydrochlorothiazide', 'Levothyroxine', 'Metoprolol'
  ];
  const dosages = ['5mg', '10mg', '20mg', '25mg', '50mg', '100mg', '500mg'];
  const frequencies = ['once daily', 'twice daily', 'three times daily', 'as needed', 'every 8 hours'];

  return {
    name: randomPick(medications),
    dosage: randomPick(dosages),
    frequency: randomPick(frequencies),
  };
}
