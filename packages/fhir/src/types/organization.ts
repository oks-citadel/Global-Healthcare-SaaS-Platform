/**
 * FHIR R4 Organization Resource
 * http://hl7.org/fhir/R4/organization.html
 */

import {
  DomainResource,
  Identifier,
  CodeableConcept,
  ContactPoint,
  Address,
  Reference,
} from './base';

export interface Organization extends DomainResource {
  resourceType: 'Organization';
  identifier?: Identifier[];
  active?: boolean;
  type?: CodeableConcept[];
  name?: string;
  alias?: string[];
  telecom?: ContactPoint[];
  address?: Address[];
  partOf?: Reference;
  contact?: OrganizationContact[];
  endpoint?: Reference[];
}

export interface OrganizationContact {
  purpose?: CodeableConcept;
  name?: {
    use?: string;
    text?: string;
    family?: string;
    given?: string[];
  };
  telecom?: ContactPoint[];
  address?: Address;
}
