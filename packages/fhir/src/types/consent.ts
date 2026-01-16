/**
 * FHIR R4 Consent Resource
 * http://hl7.org/fhir/R4/consent.html
 */

import {
  DomainResource,
  Identifier,
  CodeableConcept,
  Reference,
  Period,
  Attachment,
  Coding,
} from './base';

export interface Consent extends DomainResource {
  resourceType: 'Consent';
  identifier?: Identifier[];
  status: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive' | 'entered-in-error';
  scope: CodeableConcept;
  category: CodeableConcept[];
  patient?: Reference;
  dateTime?: string; // dateTime
  performer?: Reference[];
  organization?: Reference[];
  sourceAttachment?: Attachment;
  sourceReference?: Reference;
  policy?: ConsentPolicy[];
  policyRule?: CodeableConcept;
  verification?: ConsentVerification[];
  provision?: ConsentProvision;
}

export interface ConsentPolicy {
  authority?: string; // uri
  uri?: string;
}

export interface ConsentVerification {
  verified: boolean;
  verifiedWith?: Reference;
  verificationDate?: string; // dateTime
}

export interface ConsentProvision {
  type?: 'deny' | 'permit';
  period?: Period;
  actor?: ConsentProvisionActor[];
  action?: CodeableConcept[];
  securityLabel?: Coding[];
  purpose?: Coding[];
  class?: Coding[];
  code?: CodeableConcept[];
  dataPeriod?: Period;
  data?: ConsentProvisionData[];
  provision?: ConsentProvision[];
}

export interface ConsentProvisionActor {
  role: CodeableConcept;
  reference: Reference;
}

export interface ConsentProvisionData {
  meaning: 'instance' | 'related' | 'dependents' | 'authoredby';
  reference: Reference;
}
