// Base Repository
export { BaseRepository } from './base.repository.js';
export type {
  PaginationOptions,
  PaginationResult,
  FilterOptions,
  SortOptions,
} from './base.repository.js';

// User Repository
export { UserRepository, userRepository } from './user.repository.js';

// Patient Repository
export { PatientRepository, patientRepository } from './patient.repository.js';

// Provider Repository
export { ProviderRepository, providerRepository } from './provider.repository.js';

// Appointment Repository
export {
  AppointmentRepository,
  appointmentRepository,
} from './appointment.repository.js';
export type { AppointmentFilters } from './appointment.repository.js';

// Encounter Repository
export { EncounterRepository, encounterRepository } from './encounter.repository.js';

// Document Repository
export { DocumentRepository, documentRepository } from './document.repository.js';
export type { DocumentFilters } from './document.repository.js';

// Subscription Repository
export {
  SubscriptionRepository,
  subscriptionRepository,
} from './subscription.repository.js';

// Consent Repository
export { ConsentRepository, consentRepository } from './consent.repository.js';

// Audit Repository
export { AuditRepository, auditRepository } from './audit.repository.js';
export type { AuditFilters } from './audit.repository.js';

// Export all repository instances as a single object for convenience
export const repositories = {
  user: userRepository,
  patient: patientRepository,
  provider: providerRepository,
  appointment: appointmentRepository,
  encounter: encounterRepository,
  document: documentRepository,
  subscription: subscriptionRepository,
  consent: consentRepository,
  audit: auditRepository,
};
