import { LabOrder, LabTest, LabResult } from '@prisma/client';
import { HL7Message, HL7Segment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class HL7Generator {
  private static readonly FIELD_SEPARATOR = '|';
  private static readonly COMPONENT_SEPARATOR = '^';
  private static readonly REPETITION_SEPARATOR = '~';
  private static readonly ESCAPE_CHARACTER = '\\';
  private static readonly SUBCOMPONENT_SEPARATOR = '&';

  static generateORU_R01(
    order: LabOrder & { tests: (LabTest & { results: LabResult[] })[] },
    facilityInfo: {
      sendingApp: string;
      sendingFacility: string;
      receivingApp: string;
      receivingFacility: string;
    }
  ): string {
    const messageControlId = uuidv4().substring(0, 20);
    const timestamp = this.formatHL7DateTime(new Date());

    const segments: string[] = [];

    // MSH - Message Header
    segments.push(this.buildMSH(messageControlId, timestamp, facilityInfo));

    // PID - Patient Identification
    segments.push(this.buildPID(order.patientId));

    // OBR - Observation Request
    order.tests.forEach((test, testIndex) => {
      segments.push(this.buildOBR(order, test, testIndex + 1));

      // OBX - Observation/Result
      test.results.forEach((result, resultIndex) => {
        segments.push(this.buildOBX(result, resultIndex + 1));
      });
    });

    return segments.join('\r\n') + '\r\n';
  }

  private static buildMSH(
    messageControlId: string,
    timestamp: string,
    facilityInfo: any
  ): string {
    const fields = [
      'MSH',
      this.FIELD_SEPARATOR,
      this.COMPONENT_SEPARATOR +
        this.REPETITION_SEPARATOR +
        this.ESCAPE_CHARACTER +
        this.SUBCOMPONENT_SEPARATOR,
      facilityInfo.sendingApp,
      facilityInfo.sendingFacility,
      facilityInfo.receivingApp,
      facilityInfo.receivingFacility,
      timestamp,
      '',
      'ORU^R01',
      messageControlId,
      'P',
      '2.5',
    ];
    return fields.join(this.FIELD_SEPARATOR);
  }

  private static buildPID(patientId: string): string {
    const fields = [
      'PID',
      '1',
      '',
      patientId,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    return fields.join(this.FIELD_SEPARATOR);
  }

  private static buildOBR(order: LabOrder, test: LabTest, setId: number): string {
    const fields = [
      'OBR',
      setId.toString(),
      order.orderNumber,
      '',
      test.testCode + this.COMPONENT_SEPARATOR + test.testName,
      '',
      this.formatHL7DateTime(order.orderedAt),
      order.collectedAt ? this.formatHL7DateTime(order.collectedAt) : '',
      '',
      '',
      '',
      order.providerId,
      '',
      this.formatHL7DateTime(test.updatedAt),
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      this.formatHL7DateTime(test.updatedAt),
      '',
      '',
      this.mapTestStatus(test.status),
    ];
    return fields.join(this.FIELD_SEPARATOR);
  }

  private static buildOBX(result: LabResult, setId: number): string {
    const valueType = result.numericValue ? 'NM' : 'ST';

    const fields = [
      'OBX',
      setId.toString(),
      valueType,
      result.componentCode || result.componentName,
      '',
      result.value,
      result.unit || '',
      result.referenceRange || '',
      result.abnormalFlag || '',
      '',
      result.verifiedBy ? 'F' : 'P', // F=Final, P=Preliminary
      this.formatHL7DateTime(result.resultedAt),
      '',
      '',
      this.formatHL7DateTime(result.resultedAt),
      '',
      '',
      '',
      '',
      '',
      '',
      result.notes || '',
    ];
    return fields.join(this.FIELD_SEPARATOR);
  }

  private static formatHL7DateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  private static mapTestStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'I', // In Lab
      processing: 'S', // Specimen Received
      completed: 'F', // Final
      cancelled: 'X', // Cancelled
      rejected: 'X',
    };
    return statusMap[status] || 'I';
  }

  static parseHL7Message(message: string): HL7Message | null {
    try {
      const segments = message.split(/\r?\n/).filter((line) => line.trim());

      if (segments.length === 0 || !segments[0].startsWith('MSH')) {
        return null;
      }

      const mshFields = segments[0].split(this.FIELD_SEPARATOR);

      const hl7Message: HL7Message = {
        messageType: mshFields[8] || '',
        messageControlId: mshFields[9] || '',
        sendingApplication: mshFields[2] || '',
        sendingFacility: mshFields[3] || '',
        receivingApplication: mshFields[4] || '',
        receivingFacility: mshFields[5] || '',
        timestamp: this.parseHL7DateTime(mshFields[6]) || new Date(),
        segments: segments.map((seg) => {
          const fields = seg.split(this.FIELD_SEPARATOR);
          return {
            type: fields[0],
            fields: fields.slice(1),
          };
        }),
      };

      return hl7Message;
    } catch (error) {
      return null;
    }
  }

  private static parseHL7DateTime(hl7Date: string): Date | null {
    try {
      if (!hl7Date || hl7Date.length < 8) return null;

      const year = parseInt(hl7Date.substring(0, 4));
      const month = parseInt(hl7Date.substring(4, 6)) - 1;
      const day = parseInt(hl7Date.substring(6, 8));
      const hours = hl7Date.length >= 10 ? parseInt(hl7Date.substring(8, 10)) : 0;
      const minutes = hl7Date.length >= 12 ? parseInt(hl7Date.substring(10, 12)) : 0;
      const seconds = hl7Date.length >= 14 ? parseInt(hl7Date.substring(12, 14)) : 0;

      return new Date(year, month, day, hours, minutes, seconds);
    } catch (error) {
      return null;
    }
  }
}
