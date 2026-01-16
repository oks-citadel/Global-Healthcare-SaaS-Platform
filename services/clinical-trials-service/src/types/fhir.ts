// FHIR R4 ResearchStudy Resource Types

export interface FHIRReference {
  reference?: string;
  type?: string;
  identifier?: FHIRIdentifier;
  display?: string;
}

export interface FHIRIdentifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: FHIRCodeableConcept;
  system?: string;
  value?: string;
  period?: FHIRPeriod;
  assigner?: FHIRReference;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRCoding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface FHIRPeriod {
  start?: string;
  end?: string;
}

export interface FHIRContactDetail {
  name?: string;
  telecom?: FHIRContactPoint[];
}

export interface FHIRContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: number;
  period?: FHIRPeriod;
}

export interface FHIRAnnotation {
  authorReference?: FHIRReference;
  authorString?: string;
  time?: string;
  text: string;
}

export interface FHIRRelatedArtifact {
  type: 'documentation' | 'justification' | 'citation' | 'predecessor' | 'successor' | 'derived-from' | 'depends-on' | 'composed-of';
  label?: string;
  display?: string;
  citation?: string;
  url?: string;
  document?: FHIRAttachment;
  resource?: string;
}

export interface FHIRAttachment {
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

export interface FHIRResearchStudyArm {
  name: string;
  type?: FHIRCodeableConcept;
  description?: string;
}

export interface FHIRResearchStudyObjective {
  name?: string;
  type?: FHIRCodeableConcept;
}

export type ResearchStudyStatus =
  | 'active'
  | 'administratively-completed'
  | 'approved'
  | 'closed-to-accrual'
  | 'closed-to-accrual-and-intervention'
  | 'completed'
  | 'disapproved'
  | 'in-review'
  | 'temporarily-closed-to-accrual'
  | 'temporarily-closed-to-accrual-and-intervention'
  | 'withdrawn';

export interface FHIRResearchStudy {
  resourceType: 'ResearchStudy';
  id?: string;
  identifier?: FHIRIdentifier[];
  title?: string;
  protocol?: FHIRReference[];
  partOf?: FHIRReference[];
  status: ResearchStudyStatus;
  primaryPurposeType?: FHIRCodeableConcept;
  phase?: FHIRCodeableConcept;
  category?: FHIRCodeableConcept[];
  focus?: FHIRCodeableConcept[];
  condition?: FHIRCodeableConcept[];
  contact?: FHIRContactDetail[];
  relatedArtifact?: FHIRRelatedArtifact[];
  keyword?: FHIRCodeableConcept[];
  location?: FHIRCodeableConcept[];
  description?: string;
  enrollment?: FHIRReference[];
  period?: FHIRPeriod;
  sponsor?: FHIRReference;
  principalInvestigator?: FHIRReference;
  site?: FHIRReference[];
  reasonStopped?: FHIRCodeableConcept;
  note?: FHIRAnnotation[];
  arm?: FHIRResearchStudyArm[];
  objective?: FHIRResearchStudyObjective[];
}

// Extended types for Clinical Trial Matching
export interface EligibilityCriteria {
  inclusion: CriterionItem[];
  exclusion: CriterionItem[];
}

export interface CriterionItem {
  id: string;
  text: string;
  category?: string;
  operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'not_in';
  field?: string;
  value?: string | number | boolean | string[];
  unit?: string;
}

export interface PatientProfile {
  id: string;
  demographics: {
    age: number;
    gender: string;
    ethnicity?: string;
    race?: string;
  };
  conditions: string[];
  conditionCodes?: FHIRCodeableConcept[];
  medications: string[];
  medicationCodes?: FHIRCodeableConcept[];
  labResults?: LabResult[];
  procedures?: string[];
  allergies?: string[];
  vitalSigns?: VitalSign[];
  location?: {
    latitude: number;
    longitude: number;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface LabResult {
  code: string;
  display: string;
  value: number;
  unit: string;
  date: string;
  referenceRange?: {
    low?: number;
    high?: number;
  };
}

export interface VitalSign {
  type: string;
  value: number;
  unit: string;
  date: string;
}

export interface MatchResult {
  trialId: string;
  matchScore: number;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  eligibilityStatus: 'eligible' | 'potentially_eligible' | 'ineligible' | 'unknown';
  distance?: number;
  sites?: SiteDistance[];
}

export interface SiteDistance {
  siteId: string;
  name: string;
  distance: number;
  unit: 'miles' | 'km';
}
