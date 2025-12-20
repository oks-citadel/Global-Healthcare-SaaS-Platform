/**
 * Zod validation schemas for FHIR R4 resources
 */

import { z } from 'zod';

// Base schemas
export const IdentifierSchema = z.object({
  use: z.enum(['usual', 'official', 'temp', 'secondary', 'old']).optional(),
  type: z.any().optional(),
  system: z.string().optional(),
  value: z.string().optional(),
  period: z.any().optional(),
  assigner: z.any().optional(),
});

export const HumanNameSchema = z.object({
  use: z.enum(['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden']).optional(),
  text: z.string().optional(),
  family: z.string().optional(),
  given: z.array(z.string()).optional(),
  prefix: z.array(z.string()).optional(),
  suffix: z.array(z.string()).optional(),
  period: z.any().optional(),
});

export const ContactPointSchema = z.object({
  system: z.enum(['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other']).optional(),
  value: z.string().optional(),
  use: z.enum(['home', 'work', 'temp', 'old', 'mobile']).optional(),
  rank: z.number().optional(),
  period: z.any().optional(),
});

export const AddressSchema = z.object({
  use: z.enum(['home', 'work', 'temp', 'old', 'billing']).optional(),
  type: z.enum(['postal', 'physical', 'both']).optional(),
  text: z.string().optional(),
  line: z.array(z.string()).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  period: z.any().optional(),
});

export const CodeableConceptSchema = z.object({
  coding: z.array(z.object({
    system: z.string().optional(),
    version: z.string().optional(),
    code: z.string().optional(),
    display: z.string().optional(),
    userSelected: z.boolean().optional(),
  })).optional(),
  text: z.string().optional(),
});

export const ReferenceSchema = z.object({
  reference: z.string().optional(),
  type: z.string().optional(),
  identifier: IdentifierSchema.optional(),
  display: z.string().optional(),
});

export const MetaSchema = z.object({
  versionId: z.string().optional(),
  lastUpdated: z.string().optional(),
  source: z.string().optional(),
  profile: z.array(z.string()).optional(),
  security: z.array(z.any()).optional(),
  tag: z.array(z.any()).optional(),
});

// Patient schema
export const PatientSchema = z.object({
  resourceType: z.literal('Patient'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  active: z.boolean().optional(),
  name: z.array(HumanNameSchema).optional(),
  telecom: z.array(ContactPointSchema).optional(),
  gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
  birthDate: z.string().optional(),
  deceasedBoolean: z.boolean().optional(),
  deceasedDateTime: z.string().optional(),
  address: z.array(AddressSchema).optional(),
  maritalStatus: CodeableConceptSchema.optional(),
  multipleBirthBoolean: z.boolean().optional(),
  multipleBirthInteger: z.number().optional(),
  contact: z.array(z.any()).optional(),
  communication: z.array(z.any()).optional(),
  generalPractitioner: z.array(ReferenceSchema).optional(),
  managingOrganization: ReferenceSchema.optional(),
  link: z.array(z.any()).optional(),
});

// Practitioner schema
export const PractitionerSchema = z.object({
  resourceType: z.literal('Practitioner'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  active: z.boolean().optional(),
  name: z.array(HumanNameSchema).optional(),
  telecom: z.array(ContactPointSchema).optional(),
  address: z.array(AddressSchema).optional(),
  gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
  birthDate: z.string().optional(),
  qualification: z.array(z.object({
    identifier: z.array(IdentifierSchema).optional(),
    code: CodeableConceptSchema,
    period: z.any().optional(),
    issuer: ReferenceSchema.optional(),
  })).optional(),
  communication: z.array(CodeableConceptSchema).optional(),
});

// Organization schema
export const OrganizationSchema = z.object({
  resourceType: z.literal('Organization'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  active: z.boolean().optional(),
  type: z.array(CodeableConceptSchema).optional(),
  name: z.string().optional(),
  alias: z.array(z.string()).optional(),
  telecom: z.array(ContactPointSchema).optional(),
  address: z.array(AddressSchema).optional(),
  partOf: ReferenceSchema.optional(),
  contact: z.array(z.any()).optional(),
  endpoint: z.array(ReferenceSchema).optional(),
});

// Encounter schema
export const EncounterSchema = z.object({
  resourceType: z.literal('Encounter'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'entered-in-error', 'unknown']),
  class: z.any(),
  type: z.array(CodeableConceptSchema).optional(),
  subject: ReferenceSchema.optional(),
  participant: z.array(z.any()).optional(),
  period: z.any().optional(),
  reasonCode: z.array(CodeableConceptSchema).optional(),
  diagnosis: z.array(z.any()).optional(),
  location: z.array(z.any()).optional(),
  serviceProvider: ReferenceSchema.optional(),
});

// Appointment schema
export const AppointmentSchema = z.object({
  resourceType: z.literal('Appointment'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow', 'entered-in-error', 'checked-in', 'waitlist']),
  serviceCategory: z.array(CodeableConceptSchema).optional(),
  serviceType: z.array(CodeableConceptSchema).optional(),
  specialty: z.array(CodeableConceptSchema).optional(),
  appointmentType: CodeableConceptSchema.optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  minutesDuration: z.number().optional(),
  participant: z.array(z.object({
    type: z.array(CodeableConceptSchema).optional(),
    actor: ReferenceSchema.optional(),
    required: z.enum(['required', 'optional', 'information-only']).optional(),
    status: z.enum(['accepted', 'declined', 'tentative', 'needs-action']),
  })),
});

// Observation schema
export const ObservationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown']),
  category: z.array(CodeableConceptSchema).optional(),
  code: CodeableConceptSchema,
  subject: ReferenceSchema.optional(),
  encounter: ReferenceSchema.optional(),
  effectiveDateTime: z.string().optional(),
  issued: z.string().optional(),
  performer: z.array(ReferenceSchema).optional(),
  valueQuantity: z.any().optional(),
  valueCodeableConcept: CodeableConceptSchema.optional(),
  valueString: z.string().optional(),
  interpretation: z.array(CodeableConceptSchema).optional(),
  note: z.array(z.any()).optional(),
});

// Condition schema
export const ConditionSchema = z.object({
  resourceType: z.literal('Condition'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  clinicalStatus: CodeableConceptSchema.optional(),
  verificationStatus: CodeableConceptSchema.optional(),
  category: z.array(CodeableConceptSchema).optional(),
  severity: CodeableConceptSchema.optional(),
  code: CodeableConceptSchema.optional(),
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  onsetDateTime: z.string().optional(),
  recordedDate: z.string().optional(),
});

// MedicationRequest schema
export const MedicationRequestSchema = z.object({
  resourceType: z.literal('MedicationRequest'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['active', 'on-hold', 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown']),
  intent: z.enum(['proposal', 'plan', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option']),
  medicationCodeableConcept: CodeableConceptSchema.optional(),
  medicationReference: ReferenceSchema.optional(),
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  authoredOn: z.string().optional(),
  requester: ReferenceSchema.optional(),
  dosageInstruction: z.array(z.any()).optional(),
});

// DiagnosticReport schema
export const DiagnosticReportSchema = z.object({
  resourceType: z.literal('DiagnosticReport'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['registered', 'partial', 'preliminary', 'final', 'amended', 'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown']),
  code: CodeableConceptSchema,
  subject: ReferenceSchema.optional(),
  encounter: ReferenceSchema.optional(),
  effectiveDateTime: z.string().optional(),
  issued: z.string().optional(),
  performer: z.array(ReferenceSchema).optional(),
  result: z.array(ReferenceSchema).optional(),
  conclusion: z.string().optional(),
});

// AllergyIntolerance schema
export const AllergyIntoleranceSchema = z.object({
  resourceType: z.literal('AllergyIntolerance'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  clinicalStatus: CodeableConceptSchema.optional(),
  verificationStatus: CodeableConceptSchema.optional(),
  type: z.enum(['allergy', 'intolerance']).optional(),
  category: z.array(z.enum(['food', 'medication', 'environment', 'biologic'])).optional(),
  criticality: z.enum(['low', 'high', 'unable-to-assess']).optional(),
  code: CodeableConceptSchema.optional(),
  patient: ReferenceSchema,
  reaction: z.array(z.any()).optional(),
});

// Consent schema
export const ConsentSchema = z.object({
  resourceType: z.literal('Consent'),
  id: z.string().optional(),
  meta: MetaSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['draft', 'proposed', 'active', 'rejected', 'inactive', 'entered-in-error']),
  scope: CodeableConceptSchema,
  category: z.array(CodeableConceptSchema),
  patient: ReferenceSchema.optional(),
  dateTime: z.string().optional(),
  performer: z.array(ReferenceSchema).optional(),
  organization: z.array(ReferenceSchema).optional(),
  policy: z.array(z.any()).optional(),
  provision: z.any().optional(),
});
