/**
 * X12 to FHIR Mapping Utilities
 * Converts between X12 EDI transactions and FHIR R4 resources
 */

import {
  X12_837P,
  X12_837I,
  X12_835,
  X12_270,
  X12_271,
  X12_278,
  X12Name,
  X12Address,
  X12DiagnosisCode,
  X12ServiceLine,
  X12_835_ClaimPayment,
  X12_271_EligibilityBenefit,
} from './types';

import {
  Identifier,
  HumanName,
  Address,
  CodeableConcept,
  Coding,
  Reference,
  Period,
  Money,
  Quantity,
} from '../types/base';

import { Patient } from '../types/patient';

// ============================================================================
// FHIR Resource Types (Claim-specific, not in base types)
// ============================================================================

export interface FHIRClaim {
  resourceType: 'Claim';
  id?: string;
  identifier?: Identifier[];
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  type: CodeableConcept;
  use: 'claim' | 'preauthorization' | 'predetermination';
  patient: Reference;
  billablePeriod?: Period;
  created: string;
  enterer?: Reference;
  insurer?: Reference;
  provider: Reference;
  priority: CodeableConcept;
  fundsReserve?: CodeableConcept;
  prescription?: Reference;
  payee?: {
    type?: CodeableConcept;
    party?: Reference;
  };
  careTeam?: FHIRClaimCareTeam[];
  supportingInfo?: FHIRClaimSupportingInfo[];
  diagnosis?: FHIRClaimDiagnosis[];
  procedure?: FHIRClaimProcedure[];
  insurance: FHIRClaimInsurance[];
  item?: FHIRClaimItem[];
  total?: Money;
}

export interface FHIRClaimCareTeam {
  sequence: number;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}

export interface FHIRClaimSupportingInfo {
  sequence: number;
  category: CodeableConcept;
  code?: CodeableConcept;
  timingDate?: string;
  timingPeriod?: Period;
  valueString?: string;
  valueQuantity?: Quantity;
  valueAttachment?: any;
  valueReference?: Reference;
}

export interface FHIRClaimDiagnosis {
  sequence: number;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: CodeableConcept[];
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}

export interface FHIRClaimProcedure {
  sequence: number;
  type?: CodeableConcept[];
  date?: string;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Reference[];
}

export interface FHIRClaimInsurance {
  sequence: number;
  focal: boolean;
  identifier?: Identifier;
  coverage: Reference;
  businessArrangement?: string;
  preAuthRef?: string[];
  claimResponse?: Reference;
}

export interface FHIRClaimItem {
  sequence: number;
  careTeamSequence?: number[];
  diagnosisSequence?: number[];
  procedureSequence?: number[];
  informationSequence?: number[];
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  servicedDate?: string;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  bodySite?: CodeableConcept;
  subSite?: CodeableConcept[];
  encounter?: Reference[];
  detail?: FHIRClaimItemDetail[];
}

export interface FHIRClaimItemDetail {
  sequence: number;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  subDetail?: any[];
}

export interface FHIRExplanationOfBenefit {
  resourceType: 'ExplanationOfBenefit';
  id?: string;
  identifier?: Identifier[];
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  type: CodeableConcept;
  use: 'claim' | 'preauthorization' | 'predetermination';
  patient: Reference;
  billablePeriod?: Period;
  created: string;
  enterer?: Reference;
  insurer: Reference;
  provider: Reference;
  priority?: CodeableConcept;
  claim?: Reference;
  claimResponse?: Reference;
  outcome: 'queued' | 'complete' | 'error' | 'partial';
  disposition?: string;
  preAuthRef?: string[];
  careTeam?: FHIRClaimCareTeam[];
  supportingInfo?: FHIRClaimSupportingInfo[];
  diagnosis?: FHIRClaimDiagnosis[];
  procedure?: FHIRClaimProcedure[];
  insurance: FHIREOBInsurance[];
  item?: FHIREOBItem[];
  adjudication?: FHIREOBAdjudication[];
  total?: FHIREOBTotal[];
  payment?: FHIREOBPayment;
}

export interface FHIREOBInsurance {
  focal: boolean;
  coverage: Reference;
  preAuthRef?: string[];
}

export interface FHIREOBItem {
  itemSequence: number;
  noteNumber?: number[];
  adjudication?: FHIREOBAdjudication[];
}

export interface FHIREOBAdjudication {
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: number;
}

export interface FHIREOBTotal {
  category: CodeableConcept;
  amount: Money;
}

export interface FHIREOBPayment {
  type?: CodeableConcept;
  adjustment?: Money;
  adjustmentReason?: CodeableConcept;
  date?: string;
  amount?: Money;
  identifier?: Identifier;
}

export interface FHIRCoverage {
  resourceType: 'Coverage';
  id?: string;
  identifier?: Identifier[];
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
  type?: CodeableConcept;
  policyHolder?: Reference;
  subscriber?: Reference;
  subscriberId?: string;
  beneficiary: Reference;
  dependent?: string;
  relationship?: CodeableConcept;
  period?: Period;
  payor: Reference[];
  class?: FHIRCoverageClass[];
  order?: number;
  network?: string;
  costToBeneficiary?: FHIRCoverageCostToBeneficiary[];
  subrogation?: boolean;
  contract?: Reference[];
}

export interface FHIRCoverageClass {
  type: CodeableConcept;
  value: string;
  name?: string;
}

export interface FHIRCoverageCostToBeneficiary {
  type?: CodeableConcept;
  valueQuantity?: Quantity;
  valueMoney?: Money;
  exception?: Array<{
    type: CodeableConcept;
    period?: Period;
  }>;
}

export interface FHIRServiceRequest {
  resourceType: 'ServiceRequest';
  id?: string;
  identifier?: Identifier[];
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
  intent: 'proposal' | 'plan' | 'directive' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  category?: CodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  code?: CodeableConcept;
  orderDetail?: CodeableConcept[];
  quantityQuantity?: Quantity;
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  authoredOn?: string;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Reference[];
  locationCode?: CodeableConcept[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  insurance?: Reference[];
  supportingInfo?: Reference[];
  note?: Array<{ text: string }>;
}

// ============================================================================
// X12 to FHIR Mapping Functions
// ============================================================================

/**
 * Convert X12 837P (Professional Claim) to FHIR Claim
 */
export function x12_837P_to_FHIRClaim(x12: X12_837P): FHIRClaim {
  const claim: FHIRClaim = {
    resourceType: 'Claim',
    identifier: [
      {
        system: 'urn:x12:claim-id',
        value: x12.claimInformation.claimId,
      },
    ],
    status: 'active',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/claim-type',
          code: 'professional',
          display: 'Professional',
        },
      ],
    },
    use: 'claim',
    patient: {
      reference: `Patient/${x12.subscriber.memberId}`,
      display: formatX12Name(x12.patient?.name || x12.subscriber.name),
    },
    created: new Date().toISOString(),
    provider: {
      reference: `Organization/${x12.billingProvider.npi}`,
      display: x12.billingProvider.name,
    },
    priority: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/processpriority',
          code: 'normal',
        },
      ],
    },
    insurance: [
      {
        sequence: 1,
        focal: true,
        coverage: {
          reference: `Coverage/${x12.subscriber.memberId}`,
        },
        preAuthRef: x12.claimInformation.priorAuthorizationNumber
          ? [x12.claimInformation.priorAuthorizationNumber]
          : undefined,
      },
    ],
    total: {
      value: x12.claimInformation.totalChargeAmount,
      code: 'USD',
    },
  };

  // Add care team
  claim.careTeam = [];
  claim.careTeam.push({
    sequence: 1,
    provider: {
      reference: `Organization/${x12.billingProvider.npi}`,
      display: x12.billingProvider.name,
    },
    responsible: true,
    role: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/claimcareteamrole',
          code: 'primary',
        },
      ],
    },
  });

  if (x12.renderingProvider) {
    claim.careTeam.push({
      sequence: 2,
      provider: {
        reference: `Practitioner/${x12.renderingProvider.npi}`,
        display: formatX12Name(x12.renderingProvider.name),
      },
      role: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/claimcareteamrole',
            code: 'rendering',
          },
        ],
      },
    });
  }

  // Add diagnosis codes
  claim.diagnosis = x12.diagnosisCodes.map((diag, index) => ({
    sequence: index + 1,
    diagnosisCodeableConcept: {
      coding: [
        {
          system: diag.codeType === 'ABK' || diag.codeType === 'ABF'
            ? 'http://hl7.org/fhir/sid/icd-10-cm'
            : 'http://hl7.org/fhir/sid/icd-9-cm',
          code: diag.code,
        },
      ],
    },
    type: diag.isPrincipal
      ? [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/ex-diagnosistype',
                code: 'principal',
              },
            ],
          },
        ]
      : undefined,
  }));

  // Add service line items
  claim.item = x12.serviceLines.map(line => ({
    sequence: line.lineNumber,
    careTeamSequence: [1],
    diagnosisSequence: line.diagnosisPointers,
    productOrService: {
      coding: [
        {
          system: 'http://www.ama-assn.org/go/cpt',
          code: line.procedureCode,
        },
      ],
    },
    modifier: line.procedureModifiers?.map(mod => ({
      coding: [
        {
          system: 'http://www.ama-assn.org/go/cpt',
          code: mod,
        },
      ],
    })),
    servicedDate: formatX12DateToFHIR(line.serviceDate),
    quantity: {
      value: line.units,
      unit: mapUnitType(line.unitType),
    },
    unitPrice: {
      value: line.chargeAmount,
      code: 'USD',
    },
    net: {
      value: line.chargeAmount * line.units,
      code: 'USD',
    },
  }));

  return claim;
}

/**
 * Convert X12 837I (Institutional Claim) to FHIR Claim
 */
export function x12_837I_to_FHIRClaim(x12: X12_837I): FHIRClaim {
  const claim: FHIRClaim = {
    resourceType: 'Claim',
    identifier: [
      {
        system: 'urn:x12:claim-id',
        value: x12.claimInformation.claimId,
      },
    ],
    status: 'active',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/claim-type',
          code: 'institutional',
          display: 'Institutional',
        },
      ],
    },
    use: 'claim',
    patient: {
      reference: `Patient/${x12.subscriber.memberId}`,
      display: formatX12Name(x12.patient?.name || x12.subscriber.name),
    },
    created: new Date().toISOString(),
    provider: {
      reference: `Organization/${x12.billingProvider.npi}`,
      display: x12.billingProvider.name,
    },
    priority: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/processpriority',
          code: 'normal',
        },
      ],
    },
    insurance: [
      {
        sequence: 1,
        focal: true,
        coverage: {
          reference: `Coverage/${x12.subscriber.memberId}`,
        },
      },
    ],
    total: {
      value: x12.claimInformation.totalChargeAmount,
      code: 'USD',
    },
  };

  // Add supporting info for type of bill
  claim.supportingInfo = [
    {
      sequence: 1,
      category: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/claiminformationcategory',
            code: 'typeofbill',
          },
        ],
      },
      code: {
        coding: [
          {
            system: 'https://www.nubc.org/CodeSystem/TypeOfBill',
            code: x12.facilityInfo.typeOfBill,
          },
        ],
      },
    },
  ];

  // Add admission/discharge dates if available
  if (x12.facilityInfo.admissionDate) {
    claim.billablePeriod = {
      start: formatX12DateToFHIR(x12.facilityInfo.admissionDate),
      end: x12.facilityInfo.dischargeDate
        ? formatX12DateToFHIR(x12.facilityInfo.dischargeDate)
        : undefined,
    };
  }

  // Add diagnosis codes
  claim.diagnosis = x12.diagnosisCodes.map((diag, index) => ({
    sequence: index + 1,
    diagnosisCodeableConcept: {
      coding: [
        {
          system: diag.codeType === 'ABK' || diag.codeType === 'ABF'
            ? 'http://hl7.org/fhir/sid/icd-10-cm'
            : 'http://hl7.org/fhir/sid/icd-9-cm',
          code: diag.code,
        },
      ],
    },
    type: diag.isPrincipal
      ? [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/ex-diagnosistype',
                code: 'principal',
              },
            ],
          },
        ]
      : undefined,
  }));

  // Add service line items
  claim.item = x12.serviceLines.map(line => ({
    sequence: line.lineNumber,
    revenue: {
      coding: [
        {
          system: 'https://www.nubc.org/CodeSystem/RevenueCodes',
          code: line.revenueCode,
        },
      ],
    },
    productOrService: line.procedureCode
      ? {
          coding: [
            {
              system: 'http://www.ama-assn.org/go/cpt',
              code: line.procedureCode,
            },
          ],
        }
      : {
          coding: [
            {
              system: 'https://www.nubc.org/CodeSystem/RevenueCodes',
              code: line.revenueCode,
            },
          ],
        },
    servicedDate: formatX12DateToFHIR(line.serviceDate),
    quantity: {
      value: line.serviceUnits,
      unit: mapUnitType(line.unitType),
    },
    unitPrice: {
      value: line.chargeAmount,
      code: 'USD',
    },
  }));

  return claim;
}

/**
 * Convert X12 835 (Payment/Remittance) to FHIR ExplanationOfBenefit
 */
export function x12_835_to_FHIRExplanationOfBenefit(x12: X12_835): FHIRExplanationOfBenefit[] {
  // An 835 can contain multiple claims, so we return an array of EOBs
  return x12.claimPayments.map(claimPayment => {
    const eob: FHIRExplanationOfBenefit = {
      resourceType: 'ExplanationOfBenefit',
      identifier: [
        {
          system: 'urn:x12:claim-id',
          value: claimPayment.claimId,
        },
        {
          system: 'urn:x12:payer-claim-control-number',
          value: claimPayment.payerClaimControlNumber || '',
        },
      ],
      status: mapClaimStatus(claimPayment.claimStatus),
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/claim-type',
            code: 'professional',
          },
        ],
      },
      use: 'claim',
      patient: {
        reference: claimPayment.patientName
          ? `Patient/${formatX12Name(claimPayment.patientName)}`
          : 'Patient/unknown',
      },
      created: new Date().toISOString(),
      insurer: {
        reference: `Organization/${x12.payerInfo.payerId}`,
        display: x12.payerInfo.name,
      },
      provider: {
        reference: `Organization/${x12.payeeInfo.npi}`,
        display: x12.payeeInfo.name,
      },
      outcome: mapClaimOutcome(claimPayment.claimStatus),
      insurance: [
        {
          focal: true,
          coverage: {
            reference: 'Coverage/unknown',
          },
        },
      ],
      item: claimPayment.serviceLines.map((line, index) => ({
        itemSequence: index + 1,
        adjudication: [
          {
            category: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/adjudication',
                  code: 'submitted',
                },
              ],
            },
            amount: {
              value: line.chargeAmount,
              code: 'USD',
            },
          },
          {
            category: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/adjudication',
                  code: 'benefit',
                },
              ],
            },
            amount: {
              value: line.paidAmount,
              code: 'USD',
            },
          },
          ...(line.allowedAmount !== undefined
            ? [
                {
                  category: {
                    coding: [
                      {
                        system: 'http://terminology.hl7.org/CodeSystem/adjudication',
                        code: 'eligible',
                      },
                    ],
                  },
                  amount: {
                    value: line.allowedAmount,
                    code: 'USD',
                  },
                },
              ]
            : []),
        ],
      })),
      total: [
        {
          category: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/adjudication',
                code: 'submitted',
              },
            ],
          },
          amount: {
            value: claimPayment.totalClaimChargeAmount,
            code: 'USD',
          },
        },
        {
          category: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/adjudication',
                code: 'benefit',
              },
            ],
          },
          amount: {
            value: claimPayment.totalClaimPaymentAmount,
            code: 'USD',
          },
        },
      ],
      payment: {
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/ex-paymenttype',
              code: x12.paymentMethod === 'CHK' ? 'complete' : 'complete',
            },
          ],
        },
        date: formatX12DateToFHIR(x12.paymentDate),
        amount: {
          value: claimPayment.totalClaimPaymentAmount,
          code: 'USD',
        },
        identifier: x12.checkOrEFTNumber
          ? {
              system: x12.paymentMethod === 'ACH' ? 'urn:eft:trace-number' : 'urn:check:number',
              value: x12.checkOrEFTNumber,
            }
          : undefined,
      },
    };

    return eob;
  });
}

/**
 * Convert X12 270/271 (Eligibility) to FHIR Coverage
 */
export function x12_271_to_FHIRCoverage(x12: X12_271): FHIRCoverage {
  const subscriber = x12.subscriber;
  const benefits = subscriber.eligibilityBenefits;

  // Determine if coverage is active based on eligibility benefits
  const isActive = benefits.some(b => b.informationStatusCode === '1');

  const coverage: FHIRCoverage = {
    resourceType: 'Coverage',
    identifier: [
      {
        system: 'urn:x12:member-id',
        value: subscriber.memberId,
      },
    ],
    status: isActive ? 'active' : 'cancelled',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: mapInsuranceType(benefits[0]?.insuranceTypeCode),
        },
      ],
    },
    subscriber: {
      reference: `Patient/${subscriber.memberId}`,
      display: formatX12Name(subscriber.name),
    },
    subscriberId: subscriber.memberId,
    beneficiary: {
      reference: `Patient/${subscriber.memberId}`,
    },
    payor: [
      {
        reference: `Organization/${x12.informationSource.payerId}`,
        display: x12.informationSource.name,
      },
    ],
  };

  // Add group/plan information
  if (subscriber.groupNumber || subscriber.groupName) {
    coverage.class = [];
    if (subscriber.groupNumber) {
      coverage.class.push({
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
              code: 'group',
            },
          ],
        },
        value: subscriber.groupNumber,
        name: subscriber.groupName,
      });
    }
  }

  // Add coverage period from dates
  if (subscriber.subscriberDates && subscriber.subscriberDates.length > 0) {
    coverage.period = {};
    for (const dateInfo of subscriber.subscriberDates) {
      if (dateInfo.qualifier === '346') {
        // Plan begin
        coverage.period.start = formatX12DateToFHIR(dateInfo.date);
      } else if (dateInfo.qualifier === '347') {
        // Plan end
        coverage.period.end = formatX12DateToFHIR(dateInfo.date);
      }
    }
  }

  // Add cost to beneficiary for copays/deductibles
  const costInfo = benefits.filter(
    b => b.monetaryAmount !== undefined || b.percent !== undefined
  );
  if (costInfo.length > 0) {
    coverage.costToBeneficiary = costInfo.map(benefit => ({
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-copay-type',
            code: mapBenefitType(benefit.serviceTypeCode),
          },
        ],
      },
      valueMoney: benefit.monetaryAmount !== undefined
        ? {
            value: benefit.monetaryAmount,
            code: 'USD',
          }
        : undefined,
    }));
  }

  return coverage;
}

/**
 * Convert X12 278 (Prior Authorization) to FHIR ServiceRequest
 */
export function x12_278_to_FHIRServiceRequest(x12: X12_278): FHIRServiceRequest {
  const serviceRequest: FHIRServiceRequest = {
    resourceType: 'ServiceRequest',
    identifier: [
      {
        system: 'urn:x12:transaction-control-number',
        value: x12.envelope.st.transactionSetControlNumber,
      },
    ],
    status: x12.certificationInfo
      ? mapCertificationStatus(x12.certificationInfo.certificationActionCode)
      : 'active',
    intent: 'order',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/servicerequest-category',
            code: 'prior-auth',
            display: 'Prior Authorization',
          },
        ],
      },
    ],
    priority: 'routine',
    subject: {
      reference: `Patient/${x12.subscriber.memberId}`,
      display: formatX12Name(x12.dependent?.name || x12.subscriber.name),
    },
    authoredOn: new Date().toISOString(),
    requester: {
      reference: `Practitioner/${x12.requesterInfo.npi}`,
      display: x12.requesterInfo.name,
    },
  };

  // Add service codes
  if (x12.serviceInfo.length > 0) {
    const firstService = x12.serviceInfo[0];
    if (firstService.procedureCode) {
      serviceRequest.code = {
        coding: [
          {
            system: 'http://www.ama-assn.org/go/cpt',
            code: firstService.procedureCode,
          },
        ],
      };
    }

    // Add quantity
    if (firstService.serviceQuantity) {
      serviceRequest.quantityQuantity = {
        value: firstService.serviceQuantity,
        unit: firstService.serviceQuantityQualifier || 'UN',
      };
    }
  }

  // Add occurrence period
  serviceRequest.occurrencePeriod = {
    start: formatX12DateToFHIR(x12.patientEvent.eventDate),
    end: x12.patientEvent.eventDateEnd
      ? formatX12DateToFHIR(x12.patientEvent.eventDateEnd)
      : undefined,
  };

  // Add certification info as notes if present
  if (x12.certificationInfo) {
    const notes: string[] = [];
    if (x12.certificationInfo.certificationNumber) {
      notes.push(`Authorization Number: ${x12.certificationInfo.certificationNumber}`);
    }
    if (x12.certificationInfo.approvedQuantity) {
      notes.push(
        `Approved Quantity: ${x12.certificationInfo.approvedQuantity} ${x12.certificationInfo.approvedQuantityQualifier || 'units'}`
      );
    }
    if (notes.length > 0) {
      serviceRequest.note = notes.map(text => ({ text }));
    }
  }

  // Add insurance reference
  serviceRequest.insurance = [
    {
      reference: `Coverage/${x12.subscriber.memberId}`,
    },
  ];

  // Add performer
  if (x12.renderingProvider) {
    serviceRequest.performer = [
      {
        reference: `Practitioner/${x12.renderingProvider.npi}`,
        display: formatX12Name(x12.renderingProvider.name),
      },
    ];
  }

  // Add location
  if (x12.serviceFacility) {
    serviceRequest.locationCode = [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ServiceDeliveryLocationRoleType',
            code: 'HOSP',
          },
        ],
        text: x12.serviceFacility.name,
      },
    ];
  }

  return serviceRequest;
}

// ============================================================================
// FHIR to X12 Mapping Functions
// ============================================================================

/**
 * Convert FHIR Claim to X12 837P
 */
export function FHIRClaim_to_x12_837P(
  claim: FHIRClaim,
  billingProviderNpi: string,
  billingProviderTaxId: string,
  payerId: string
): Partial<X12_837P> {
  const x12: Partial<X12_837P> = {
    transactionType: '837P',
    billingProvider: {
      name: extractDisplayFromReference(claim.provider),
      npi: billingProviderNpi,
      address: {
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
      },
      taxId: billingProviderTaxId,
      taxIdQualifier: 'EI',
    },
    subscriber: {
      memberId: extractIdFromReference(claim.patient),
      name: {
        lastName: extractDisplayFromReference(claim.patient),
        entityType: '1',
      },
      relationshipCode: '18',
    },
    payer: {
      name: extractDisplayFromReference(claim.insurer),
      payerId: payerId,
    },
    claimInformation: {
      claimId: claim.identifier?.[0]?.value || '',
      totalChargeAmount: claim.total?.value || 0,
      facilityCode: '11',
      frequencyCode: '1',
      providerSignatureOnFile: true,
      assignmentOfBenefits: true,
      releaseOfInformation: 'Y',
      priorAuthorizationNumber: claim.insurance?.[0]?.preAuthRef?.[0],
    },
    diagnosisCodes: (claim.diagnosis || []).map((diag, index) => ({
      code: diag.diagnosisCodeableConcept?.coding?.[0]?.code || '',
      codeType: 'ABK' as const,
      isPrincipal: index === 0,
    })),
    serviceLines: (claim.item || []).map(item => ({
      lineNumber: item.sequence,
      procedureCode: item.productOrService?.coding?.[0]?.code || '',
      procedureModifiers: item.modifier?.map(m => m.coding?.[0]?.code || ''),
      diagnosisPointers: item.diagnosisSequence || [1],
      chargeAmount: item.unitPrice?.value || 0,
      units: item.quantity?.value || 1,
      unitType: 'UN',
      serviceDate: item.servicedDate
        ? formatFHIRDateToX12(item.servicedDate)
        : formatFHIRDateToX12(new Date().toISOString()),
    })),
  };

  return x12;
}

/**
 * Convert FHIR ExplanationOfBenefit to X12 835 claim payment
 */
export function FHIREob_to_x12_835_ClaimPayment(eob: FHIRExplanationOfBenefit): X12_835_ClaimPayment {
  const chargeAmount =
    eob.total?.find(t => t.category.coding?.[0]?.code === 'submitted')?.amount?.value || 0;
  const paymentAmount =
    eob.total?.find(t => t.category.coding?.[0]?.code === 'benefit')?.amount?.value || 0;

  return {
    claimId: eob.identifier?.[0]?.value || '',
    claimStatus: mapFHIRStatusToX12(eob.status, eob.outcome),
    totalClaimChargeAmount: chargeAmount,
    totalClaimPaymentAmount: paymentAmount,
    patientResponsibilityAmount:
      eob.total?.find(t => t.category.coding?.[0]?.code === 'copay')?.amount?.value,
    serviceLines: (eob.item || []).map(item => {
      const submitted = item.adjudication?.find(
        a => a.category.coding?.[0]?.code === 'submitted'
      );
      const benefit = item.adjudication?.find(
        a => a.category.coding?.[0]?.code === 'benefit'
      );
      const allowed = item.adjudication?.find(
        a => a.category.coding?.[0]?.code === 'eligible'
      );

      return {
        procedureCode: '',
        chargeAmount: submitted?.amount?.value || 0,
        paidAmount: benefit?.amount?.value || 0,
        allowedAmount: allowed?.amount?.value,
      };
    }),
  };
}

/**
 * Convert FHIR Coverage to X12 271 eligibility benefit
 */
export function FHIRCoverage_to_x12_271_EligibilityBenefit(
  coverage: FHIRCoverage
): X12_271_EligibilityBenefit {
  return {
    informationStatusCode: coverage.status === 'active' ? '1' : '6',
    serviceTypeCode: '30', // Health Benefit Plan Coverage
    insuranceTypeCode: coverage.type?.coding?.[0]?.code,
    planCoverageDescription: coverage.class?.[0]?.name,
    dateRange: coverage.period
      ? {
          fromDate: formatFHIRDateToX12(coverage.period.start || ''),
          toDate: coverage.period.end ? formatFHIRDateToX12(coverage.period.end) : undefined,
        }
      : undefined,
  };
}

/**
 * Convert FHIR ServiceRequest to X12 278
 */
export function FHIRServiceRequest_to_x12_278(
  serviceRequest: FHIRServiceRequest,
  payerId: string,
  providerNpi: string
): Partial<X12_278> {
  return {
    transactionType: '278',
    actionCode: 'AR',
    umoInfo: {
      name: '',
      payerId: payerId,
    },
    requesterInfo: {
      name: extractDisplayFromReference(serviceRequest.requester),
      npi: providerNpi,
    },
    subscriber: {
      memberId: extractIdFromReference(serviceRequest.subject),
      name: {
        lastName: extractDisplayFromReference(serviceRequest.subject),
        entityType: '1',
      },
      relationshipCode: '18',
    },
    patientEvent: {
      eventDate: serviceRequest.occurrencePeriod?.start
        ? formatFHIRDateToX12(serviceRequest.occurrencePeriod.start)
        : formatFHIRDateToX12(new Date().toISOString()),
      eventDateEnd: serviceRequest.occurrencePeriod?.end
        ? formatFHIRDateToX12(serviceRequest.occurrencePeriod.end)
        : undefined,
    },
    serviceInfo: [
      {
        serviceTypeCode: '1',
        procedureCode: serviceRequest.code?.coding?.[0]?.code,
        serviceQuantity: serviceRequest.quantityQuantity?.value,
      },
    ],
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatX12Name(name: X12Name): string {
  const parts = [name.firstName, name.middleName, name.lastName].filter(Boolean);
  return parts.join(' ');
}

function formatX12DateToFHIR(x12Date: string): string {
  if (!x12Date || x12Date.length < 8) return '';
  // X12 date format: CCYYMMDD
  const year = x12Date.substring(0, 4);
  const month = x12Date.substring(4, 6);
  const day = x12Date.substring(6, 8);
  return `${year}-${month}-${day}`;
}

function formatFHIRDateToX12(fhirDate: string): string {
  if (!fhirDate) return '';
  // FHIR date format: YYYY-MM-DD or ISO datetime
  const datePart = fhirDate.split('T')[0];
  return datePart.replace(/-/g, '');
}

function mapUnitType(x12UnitType: string): string {
  const unitMap: Record<string, string> = {
    UN: 'unit',
    MJ: 'minutes',
    DA: 'days',
    F2: 'international unit',
    GR: 'gram',
    ME: 'milligram',
    ML: 'milliliter',
    P1: 'procedure',
  };
  return unitMap[x12UnitType] || x12UnitType;
}

function mapClaimStatus(
  x12Status: string
): 'active' | 'cancelled' | 'draft' | 'entered-in-error' {
  switch (x12Status) {
    case '1': // Processed as Primary
    case '2': // Processed as Secondary
    case '3': // Processed as Tertiary
      return 'active';
    case '4': // Denied
      return 'cancelled';
    case '22': // Reversal of Previous Payment
      return 'entered-in-error';
    default:
      return 'active';
  }
}

function mapClaimOutcome(
  x12Status: string
): 'queued' | 'complete' | 'error' | 'partial' {
  switch (x12Status) {
    case '1':
    case '2':
    case '3':
      return 'complete';
    case '4':
      return 'error';
    case '19': // Processed Primary, Forwarded to Additional Payer
    case '20': // Processed Secondary, Forwarded to Additional Payer
    case '21': // Processed Tertiary, Forwarded to Additional Payer
      return 'partial';
    default:
      return 'complete';
  }
}

function mapInsuranceType(x12Type?: string): string {
  const typeMap: Record<string, string> = {
    12: 'PPO',
    13: 'POS',
    14: 'EPO',
    15: 'INDEMNITY',
    16: 'HMO',
    HM: 'HMO',
    PR: 'PPO',
    EP: 'EPO',
    MA: 'MEDICARE',
    MB: 'MEDICARE',
    MC: 'MCAID',
  };
  return typeMap[x12Type || ''] || 'PUBLICPOL';
}

function mapBenefitType(serviceTypeCode: string): string {
  const typeMap: Record<string, string> = {
    1: 'gpvisit',
    30: 'emergency',
    35: 'inpthosp',
    42: 'outpharm',
    50: 'vision',
    86: 'emergency',
  };
  return typeMap[serviceTypeCode] || 'gpvisit';
}

function mapCertificationStatus(
  actionCode?: string
): 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown' {
  switch (actionCode) {
    case 'A1': // Certified in Total
      return 'active';
    case 'A2': // Certified - Partial
      return 'active';
    case 'A3': // Not Certified
      return 'revoked';
    case 'A4': // Pended
      return 'on-hold';
    case 'A5': // Modified
      return 'active';
    case 'A6': // Cancelled
      return 'revoked';
    default:
      return 'unknown';
  }
}

function mapFHIRStatusToX12(
  status: string,
  outcome: string
): '1' | '2' | '3' | '4' | '19' | '20' | '21' | '22' | '23' {
  if (status === 'cancelled' || outcome === 'error') return '4';
  if (status === 'entered-in-error') return '22';
  if (outcome === 'partial') return '19';
  return '1';
}

function extractIdFromReference(ref?: Reference): string {
  if (!ref?.reference) return '';
  const parts = ref.reference.split('/');
  return parts[parts.length - 1];
}

function extractDisplayFromReference(ref?: Reference): string {
  return ref?.display || extractIdFromReference(ref);
}

function convertFHIRAddressToX12(address?: Address): X12Address {
  return {
    addressLine1: address?.line?.[0] || '',
    addressLine2: address?.line?.[1],
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    countryCode: address?.country,
  };
}

function convertX12AddressToFHIR(address?: X12Address): Address | undefined {
  if (!address) return undefined;
  return {
    line: [address.addressLine1, address.addressLine2].filter(Boolean) as string[],
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.countryCode,
  };
}

// ============================================================================
// Exports
// ============================================================================

export const X12FHIRMapper = {
  // X12 to FHIR
  x12_837P_to_FHIRClaim,
  x12_837I_to_FHIRClaim,
  x12_835_to_FHIRExplanationOfBenefit,
  x12_271_to_FHIRCoverage,
  x12_278_to_FHIRServiceRequest,

  // FHIR to X12
  FHIRClaim_to_x12_837P,
  FHIREob_to_x12_835_ClaimPayment,
  FHIRCoverage_to_x12_271_EligibilityBenefit,
  FHIRServiceRequest_to_x12_278,

  // Helpers
  formatX12DateToFHIR,
  formatFHIRDateToX12,
  convertFHIRAddressToX12,
  convertX12AddressToFHIR,
};
