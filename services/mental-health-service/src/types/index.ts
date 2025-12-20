import { Request } from 'express';

// User information from API Gateway headers
export interface User {
  id: string;
  email: string;
  role: 'patient' | 'provider' | 'admin';
}

// Extended Request with user information
export interface UserRequest extends Request {
  user?: User;
}

// Assessment scoring results
export interface AssessmentResult {
  totalScore: number;
  severity: 'none' | 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  interpretation: string;
  recommendations: string[];
  subscores?: Record<string, number>;
}

// Treatment plan goal
export interface TreatmentGoal {
  description: string;
  targetDate?: Date;
  strategies: string[];
  measurements?: Record<string, any>;
}

// Progress note formats
export type NoteFormat = 'SOAP' | 'DAP' | 'BIRP' | 'GIRP';

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface DAPNote {
  data: string;
  assessment: string;
  plan: string;
}

export interface BIRPNote {
  behavior: string;
  intervention: string;
  response: string;
  plan: string;
}

export interface GIRPNote {
  goals: string;
  intervention: string;
  response: string;
  plan: string;
}

// Crisis severity levels
export type CrisisSeverity = 'low' | 'medium' | 'high' | 'critical';

// Medication classes
export type MedicationClass =
  | 'antidepressant'
  | 'antipsychotic'
  | 'mood_stabilizer'
  | 'anxiolytic'
  | 'stimulant'
  | 'sedative_hypnotic'
  | 'other';

// Consent types
export type ConsentType =
  | 'treatment'
  | 'information_release'
  | 'research'
  | 'emergency_contact'
  | 'cfr_part2';

// 42 CFR Part 2 Consent
export interface CFRPart2Consent {
  patientId: string;
  providerId: string;
  purpose: string;
  disclosureScope: string;
  substanceUseDisclosure: boolean;
  redisclosure: boolean;
  expiresAt: Date;
}

// API Response formats
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page?: number;
  totalPages?: number;
}
