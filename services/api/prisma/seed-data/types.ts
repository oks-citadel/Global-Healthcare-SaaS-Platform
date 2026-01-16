/**
 * Type definitions for seed data JSON files
 * This ensures type safety when modifying seed data
 */

export interface UserSeedData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  role: 'patient' | 'provider' | 'admin';
  emailVerified: boolean;
}

export interface ProviderSeedData {
  email: string;
  licenseNumber: string;
  specialty: string[];
  bio?: string;
  available: boolean;
}

export interface PatientSeedData {
  email: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bloodType?: string;
  allergies: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface PlanSeedData {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  interval: 'monthly' | 'annual';
  features: string[];
  active: boolean;
}

export type UsersSeedData = UserSeedData[];
export type ProvidersSeedData = ProviderSeedData[];
export type PatientsSeedData = PatientSeedData[];
export type PlansSeedData = PlanSeedData[];
