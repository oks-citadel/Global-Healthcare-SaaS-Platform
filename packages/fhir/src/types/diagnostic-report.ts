/**
 * FHIR R4 DiagnosticReport Resource
 * http://hl7.org/fhir/R4/diagnosticreport.html
 */

import {
  DomainResource,
  Identifier,
  CodeableConcept,
  Reference,
  Period,
  Attachment,
} from './base';

export interface DiagnosticReport extends DomainResource {
  resourceType: 'DiagnosticReport';
  identifier?: Identifier[];
  basedOn?: Reference[];
  status: 'registered' | 'partial' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'appended' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  issued?: string; // instant
  performer?: Reference[];
  resultsInterpreter?: Reference[];
  specimen?: Reference[];
  result?: Reference[];
  imagingStudy?: Reference[];
  media?: DiagnosticReportMedia[];
  conclusion?: string;
  conclusionCode?: CodeableConcept[];
  presentedForm?: Attachment[];
}

export interface DiagnosticReportMedia {
  comment?: string;
  link: Reference;
}
