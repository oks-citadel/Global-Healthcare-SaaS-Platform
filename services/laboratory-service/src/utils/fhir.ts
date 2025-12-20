import { LabOrder, LabTest, LabResult } from '@prisma/client';
import { FHIRDiagnosticReport, FHIRObservation } from '../types';

export class FHIRConverter {
  static labOrderToDiagnosticReport(
    order: LabOrder & { tests: (LabTest & { results: LabResult[] })[] }
  ): FHIRDiagnosticReport {
    const status = this.mapOrderStatusToFHIR(order.status);

    return {
      resourceType: 'DiagnosticReport',
      id: order.id,
      status,
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
              code: 'LAB',
              display: 'Laboratory',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: order.tests[0]?.testCode || 'PANEL',
            display: order.tests[0]?.testName || 'Laboratory Panel',
          },
        ],
        text: order.clinicalInfo || 'Laboratory Tests',
      },
      subject: {
        reference: `Patient/${order.patientId}`,
      },
      encounter: order.encounterId
        ? {
            reference: `Encounter/${order.encounterId}`,
          }
        : undefined,
      effectiveDateTime: order.collectedAt?.toISOString() || order.orderedAt.toISOString(),
      issued: order.completedAt?.toISOString(),
      performer: [
        {
          reference: `Practitioner/${order.providerId}`,
        },
      ],
      result: order.tests.map((test) => ({
        reference: `Observation/${test.id}`,
      })),
      conclusion: order.clinicalInfo,
    };
  }

  static labResultToObservation(
    result: LabResult,
    test: LabTest,
    patientId: string
  ): FHIRObservation {
    const observation: FHIRObservation = {
      resourceType: 'Observation',
      id: result.id,
      status: result.verifiedBy ? 'final' : 'preliminary',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'laboratory',
              display: 'Laboratory',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: result.componentCode || test.testCode,
            display: result.componentName,
          },
        ],
        text: result.componentName,
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime: result.resultedAt.toISOString(),
      issued: result.resultedAt.toISOString(),
    };

    // Add value
    if (result.numericValue && result.unit) {
      observation.valueQuantity = {
        value: Number(result.numericValue),
        unit: result.unit,
        system: 'http://unitsofmeasure.org',
        code: result.unit,
      };
    } else {
      observation.valueString = result.value;
    }

    // Add interpretation
    if (result.abnormalFlag) {
      observation.interpretation = [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
              code: this.mapAbnormalFlagToFHIR(result.abnormalFlag),
              display: result.abnormalFlag,
            },
          ],
        },
      ];
    }

    // Add reference range
    if (result.referenceRange) {
      const range = this.parseReferenceRange(result.referenceRange);
      if (range) {
        observation.referenceRange = [
          {
            low: range.low
              ? {
                  value: range.low,
                  unit: result.unit || '',
                }
              : undefined,
            high: range.high
              ? {
                  value: range.high,
                  unit: result.unit || '',
                }
              : undefined,
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/referencerange-meaning',
                  code: 'normal',
                  display: 'Normal Range',
                },
              ],
            },
          },
        ];
      }
    }

    // Add notes
    if (result.notes) {
      observation.note = [
        {
          text: result.notes,
        },
      ];
    }

    return observation;
  }

  private static mapOrderStatusToFHIR(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'registered',
      collected: 'registered',
      processing: 'partial',
      completed: 'final',
      cancelled: 'cancelled',
      partial: 'partial',
    };
    return statusMap[status] || 'unknown';
  }

  private static mapAbnormalFlagToFHIR(flag: string): string {
    const flagMap: { [key: string]: string } = {
      H: 'H',
      L: 'L',
      HH: 'HH',
      LL: 'LL',
      A: 'A',
      AA: 'AA',
      N: 'N',
    };
    return flagMap[flag] || flag;
  }

  private static parseReferenceRange(range: string): { low?: number; high?: number } | null {
    // Parse formats like "10-20", "< 10", "> 5", "10.5-20.8"
    const rangePattern = /^([\d.]+)\s*-\s*([\d.]+)$/;
    const match = range.match(rangePattern);

    if (match) {
      return {
        low: parseFloat(match[1]),
        high: parseFloat(match[2]),
      };
    }

    const lessThanPattern = /^<\s*([\d.]+)$/;
    const lessThanMatch = range.match(lessThanPattern);
    if (lessThanMatch) {
      return {
        high: parseFloat(lessThanMatch[1]),
      };
    }

    const greaterThanPattern = /^>\s*([\d.]+)$/;
    const greaterThanMatch = range.match(greaterThanPattern);
    if (greaterThanMatch) {
      return {
        low: parseFloat(greaterThanMatch[1]),
      };
    }

    return null;
  }

  static createBundle(resources: any[]): any {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      total: resources.length,
      entry: resources.map((resource) => ({
        fullUrl: `${resource.resourceType}/${resource.id}`,
        resource,
      })),
    };
  }
}
