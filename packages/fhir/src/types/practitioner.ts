/**
 * FHIR R4 Practitioner Resource
 * http://hl7.org/fhir/R4/practitioner.html
 */

import {
  DomainResource,
  Identifier,
  HumanName,
  ContactPoint,
  Address,
  CodeableConcept,
  Reference,
  Attachment,
  Period,
} from './base';

export interface Practitioner extends DomainResource {
  resourceType: 'Practitioner';
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  address?: Address[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string; // date
  photo?: Attachment[];
  qualification?: PractitionerQualification[];
  communication?: CodeableConcept[];
}

export interface PractitionerQualification {
  identifier?: Identifier[];
  code: CodeableConcept;
  period?: Period;
  issuer?: Reference;
}
