/**
 * FHIR R4 AllergyIntolerance Resource
 * http://hl7.org/fhir/R4/allergyintolerance.html
 */

import {
  DomainResource,
  Identifier,
  CodeableConcept,
  Reference,
  Period,
  Age,
  Range,
  Annotation,
} from './base';

export interface AllergyIntolerance extends DomainResource {
  resourceType: 'AllergyIntolerance';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: 'allergy' | 'intolerance';
  category?: ('food' | 'medication' | 'environment' | 'biologic')[];
  criticality?: 'low' | 'high' | 'unable-to-assess';
  code?: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  onsetAge?: Age;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  recordedDate?: string; // dateTime
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: string; // dateTime
  note?: Annotation[];
  reaction?: AllergyIntoleranceReaction[];
}

export interface AllergyIntoleranceReaction {
  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: string; // dateTime
  severity?: 'mild' | 'moderate' | 'severe';
  exposureRoute?: CodeableConcept;
  note?: Annotation[];
}
