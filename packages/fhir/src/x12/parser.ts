/**
 * X12 EDI Parser
 * Parses X12 EDI strings into structured transaction objects
 */

import {
  X12Transaction,
  X12TransactionType,
  X12Segment,
  X12Loop,
  X12Envelope,
  ISASegment,
  GSSegment,
  STSegment,
  X12ParseOptions,
  X12ValidationResult,
  X12ValidationError,
  X12ValidationWarning,
  X12_837P,
  X12_837I,
  X12_835,
  X12_270,
  X12_271,
  X12_276,
  X12_277,
  X12_278,
  X12Name,
  X12Address,
  X12DiagnosisCode,
  X12ServiceLine,
  X12_837P_BillingProvider,
  X12_837P_Subscriber,
  X12_837P_Payer,
  X12_837P_ClaimInformation,
  X12VersionCode,
} from './types';

export class X12Parser {
  private segmentTerminator: string = '~';
  private elementSeparator: string = '*';
  private componentSeparator: string = ':';
  private repetitionSeparator: string = '^';
  private strict: boolean = false;

  constructor(options?: X12ParseOptions) {
    if (options) {
      this.segmentTerminator = options.segmentTerminator ?? '~';
      this.elementSeparator = options.elementSeparator ?? '*';
      this.componentSeparator = options.componentSeparator ?? ':';
      this.repetitionSeparator = options.repetitionSeparator ?? '^';
      this.strict = options.strict ?? false;
    }
  }

  /**
   * Parse an X12 EDI string into a structured transaction object
   */
  parse(ediString: string): X12Transaction {
    // Normalize line endings and remove extra whitespace
    const normalized = this.normalizeEdi(ediString);

    // Extract delimiters from ISA segment if present
    this.extractDelimiters(normalized);

    // Parse into segments
    const segments = this.parseSegments(normalized);

    if (segments.length === 0) {
      throw new Error('No valid segments found in EDI string');
    }

    // Parse envelope
    const envelope = this.parseEnvelope(segments);

    // Determine transaction type
    const transactionType = this.determineTransactionType(envelope.st.transactionSetIdCode);

    // Parse loops structure
    const loops = this.parseLoops(segments, transactionType);

    // Build the specific transaction object based on type
    const transaction = this.buildTransaction(transactionType, envelope, segments, loops);

    return transaction;
  }

  /**
   * Validate an X12 EDI string
   */
  validate(ediString: string): X12ValidationResult {
    const errors: X12ValidationError[] = [];
    const warnings: X12ValidationWarning[] = [];

    try {
      const normalized = this.normalizeEdi(ediString);
      this.extractDelimiters(normalized);
      const segments = this.parseSegments(normalized);

      // Check for required envelope segments
      const hasISA = segments.some(s => s.segmentId === 'ISA');
      const hasGS = segments.some(s => s.segmentId === 'GS');
      const hasST = segments.some(s => s.segmentId === 'ST');
      const hasSE = segments.some(s => s.segmentId === 'SE');
      const hasGE = segments.some(s => s.segmentId === 'GE');
      const hasIEA = segments.some(s => s.segmentId === 'IEA');

      if (!hasISA) {
        errors.push({ code: 'MISSING_ISA', message: 'Missing ISA segment' });
      }
      if (!hasGS) {
        errors.push({ code: 'MISSING_GS', message: 'Missing GS segment' });
      }
      if (!hasST) {
        errors.push({ code: 'MISSING_ST', message: 'Missing ST segment' });
      }
      if (!hasSE) {
        errors.push({ code: 'MISSING_SE', message: 'Missing SE segment' });
      }
      if (!hasGE) {
        errors.push({ code: 'MISSING_GE', message: 'Missing GE segment' });
      }
      if (!hasIEA) {
        errors.push({ code: 'MISSING_IEA', message: 'Missing IEA segment' });
      }

      // Validate ISA segment length (fixed at 106 characters including delimiters)
      const isaSegment = segments.find(s => s.segmentId === 'ISA');
      if (isaSegment && isaSegment.elements.length !== 16) {
        errors.push({
          code: 'INVALID_ISA',
          message: `ISA segment must have 16 elements, found ${isaSegment.elements.length}`,
          segment: 'ISA',
        });
      }

      // Validate segment count in SE matches actual count
      const seSegment = segments.find(s => s.segmentId === 'SE');
      if (seSegment && hasST) {
        const stIndex = segments.findIndex(s => s.segmentId === 'ST');
        const seIndex = segments.findIndex(s => s.segmentId === 'SE');
        const expectedCount = seIndex - stIndex + 1;
        const actualCount = parseInt(seSegment.elements[0], 10);
        if (actualCount !== expectedCount) {
          warnings.push({
            code: 'SEGMENT_COUNT_MISMATCH',
            message: `SE segment count (${actualCount}) does not match actual count (${expectedCount})`,
            segment: 'SE',
          });
        }
      }

      // Validate transaction type is supported
      const stSegment = segments.find(s => s.segmentId === 'ST');
      if (stSegment) {
        const txType = stSegment.elements[0];
        const supportedTypes = ['837', '835', '270', '271', '276', '277', '278'];
        if (!supportedTypes.includes(txType)) {
          warnings.push({
            code: 'UNSUPPORTED_TRANSACTION',
            message: `Transaction type ${txType} may not be fully supported`,
            segment: 'ST',
          });
        }
      }

    } catch (error) {
      errors.push({
        code: 'PARSE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown parse error',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Parse segments from normalized EDI string
   */
  private parseSegments(edi: string): X12Segment[] {
    const segments: X12Segment[] = [];
    const rawSegments = edi.split(this.segmentTerminator);

    for (const rawSegment of rawSegments) {
      const trimmed = rawSegment.trim();
      if (!trimmed) continue;

      const elements = trimmed.split(this.elementSeparator);
      const segmentId = elements[0];

      segments.push({
        segmentId,
        elements: elements.slice(1),
      });
    }

    return segments;
  }

  /**
   * Parse the envelope segments (ISA, GS, ST)
   */
  private parseEnvelope(segments: X12Segment[]): X12Envelope {
    const isaSegment = segments.find(s => s.segmentId === 'ISA');
    const gsSegment = segments.find(s => s.segmentId === 'GS');
    const stSegment = segments.find(s => s.segmentId === 'ST');

    if (!isaSegment || !gsSegment || !stSegment) {
      throw new Error('Missing required envelope segments (ISA, GS, or ST)');
    }

    const isa: ISASegment = {
      authorizationQualifier: isaSegment.elements[0] || '00',
      authorizationInfo: isaSegment.elements[1] || '',
      securityQualifier: isaSegment.elements[2] || '00',
      securityInfo: isaSegment.elements[3] || '',
      senderIdQualifier: isaSegment.elements[4] || '',
      senderId: isaSegment.elements[5]?.trim() || '',
      receiverIdQualifier: isaSegment.elements[6] || '',
      receiverId: isaSegment.elements[7]?.trim() || '',
      date: isaSegment.elements[8] || '',
      time: isaSegment.elements[9] || '',
      repetitionSeparator: isaSegment.elements[10] || '^',
      versionNumber: isaSegment.elements[11] || '00501',
      controlNumber: isaSegment.elements[12] || '',
      acknowledgmentRequested: (isaSegment.elements[13] as '0' | '1') || '0',
      usageIndicator: (isaSegment.elements[14] as 'T' | 'P') || 'P',
      componentSeparator: isaSegment.elements[15]?.charAt(0) || ':',
    };

    const gs: GSSegment = {
      functionalIdCode: gsSegment.elements[0] || '',
      applicationSenderCode: gsSegment.elements[1] || '',
      applicationReceiverCode: gsSegment.elements[2] || '',
      date: gsSegment.elements[3] || '',
      time: gsSegment.elements[4] || '',
      groupControlNumber: gsSegment.elements[5] || '',
      responsibleAgencyCode: gsSegment.elements[6] || 'X',
      versionCode: (gsSegment.elements[7] || '005010X222A1') as X12VersionCode,
    };

    const st: STSegment = {
      transactionSetIdCode: stSegment.elements[0] || '',
      transactionSetControlNumber: stSegment.elements[1] || '',
      implementationConventionReference: stSegment.elements[2],
    };

    return { isa, gs, st };
  }

  /**
   * Determine transaction type from ST01 code
   */
  private determineTransactionType(stCode: string): X12TransactionType {
    switch (stCode) {
      case '837':
        // Need to look at GS01 to determine if professional or institutional
        // For now, default to professional
        return '837P';
      case '835':
        return '835';
      case '270':
        return '270';
      case '271':
        return '271';
      case '276':
        return '276';
      case '277':
        return '277';
      case '278':
        return '278';
      default:
        throw new Error(`Unsupported transaction type: ${stCode}`);
    }
  }

  /**
   * Parse loop structures from segments
   */
  private parseLoops(segments: X12Segment[], transactionType: X12TransactionType): X12Loop[] {
    const loops: X12Loop[] = [];
    let currentLoop: X12Loop | null = null;
    let loopStack: X12Loop[] = [];

    // Loop detection based on segment patterns
    const loopStartSegments: Record<string, string> = {
      'NM1': 'NM1',
      'HL': 'HL',
      'CLM': '2300',
      'SV1': '2400',
      'SV2': '2400',
      'LX': '2400',
      'CLP': '2100',
      'SVC': '2110',
      'EB': '2110',
      'HI': '2000',
    };

    for (const segment of segments) {
      // Skip envelope segments
      if (['ISA', 'GS', 'ST', 'SE', 'GE', 'IEA'].includes(segment.segmentId)) {
        continue;
      }

      const loopId = this.detectLoop(segment, transactionType);

      if (loopId && loopId !== (currentLoop as X12Loop | null)?.loopId) {
        // Start new loop
        if (currentLoop) {
          // Close current loop
          if (loopStack.length > 0) {
            const parent = loopStack[loopStack.length - 1];
            if (!parent.childLoops) parent.childLoops = [];
            parent.childLoops.push(currentLoop);
          } else {
            loops.push(currentLoop);
          }
        }

        currentLoop = {
          loopId,
          segments: [segment],
        };
      } else if (currentLoop) {
        currentLoop.segments.push(segment);
      }
    }

    // Close final loop
    if (currentLoop) {
      loops.push(currentLoop);
    }

    return loops;
  }

  /**
   * Detect which loop a segment belongs to
   */
  private detectLoop(segment: X12Segment, transactionType: X12TransactionType): string | null {
    const segmentId = segment.segmentId;

    // HL segment hierarchy handling
    if (segmentId === 'HL') {
      const hierarchyCode = segment.elements[2];
      switch (hierarchyCode) {
        case '20': return '2000A'; // Information Source
        case '21': return '2000B'; // Information Receiver
        case '22': return '2000C'; // Subscriber
        case '23': return '2000D'; // Dependent
        default: return `2000${hierarchyCode}`;
      }
    }

    // NM1 segment entity code handling
    if (segmentId === 'NM1') {
      const entityCode = segment.elements[0];
      switch (entityCode) {
        case '85': return '2010AA'; // Billing Provider
        case '87': return '2010AB'; // Pay-to Provider
        case 'IL': return '2010BA'; // Subscriber
        case 'QC': return '2010CA'; // Patient
        case 'PR': return '2010BB'; // Payer
        case '82': return '2310B';  // Rendering Provider
        case 'DN': return '2310A';  // Referring Provider
        case '77': return '2310C';  // Service Facility
        default: return `2010${entityCode}`;
      }
    }

    // Claim-level segments
    if (segmentId === 'CLM') return '2300';
    if (segmentId === 'CLP') return '2100';

    // Service line segments
    if (segmentId === 'LX') return '2400';
    if (segmentId === 'SV1') return '2400';
    if (segmentId === 'SV2') return '2400';
    if (segmentId === 'SVC') return '2110';

    // Eligibility segments
    if (segmentId === 'EB') return '2110';
    if (segmentId === 'EQ') return '2110';

    return null;
  }

  /**
   * Build transaction object based on type
   */
  private buildTransaction(
    transactionType: X12TransactionType,
    envelope: X12Envelope,
    segments: X12Segment[],
    loops: X12Loop[]
  ): X12Transaction {
    const baseTransaction = {
      transactionType,
      envelope,
      rawSegments: segments,
      loops,
    };

    switch (transactionType) {
      case '837P':
        return this.build837P(baseTransaction as Partial<X12_837P>, segments);
      case '837I':
        return this.build837I(baseTransaction as Partial<X12_837I>, segments);
      case '835':
        return this.build835(baseTransaction as Partial<X12_835>, segments);
      case '270':
        return this.build270(baseTransaction as Partial<X12_270>, segments);
      case '271':
        return this.build271(baseTransaction as Partial<X12_271>, segments);
      case '276':
        return this.build276(baseTransaction as Partial<X12_276>, segments);
      case '277':
        return this.build277(baseTransaction as Partial<X12_277>, segments);
      case '278':
        return this.build278(baseTransaction as Partial<X12_278>, segments);
      default:
        return baseTransaction as X12Transaction;
    }
  }

  /**
   * Build 837P Professional Claim transaction
   */
  private build837P(base: Partial<X12_837P>, segments: X12Segment[]): X12_837P {
    const billingProvider = this.extractBillingProvider(segments);
    const subscriber = this.extractSubscriber(segments);
    const payer = this.extractPayer(segments);
    const claimInfo = this.extractClaimInfo(segments);
    const diagnosisCodes = this.extractDiagnosisCodes(segments);
    const serviceLines = this.extractServiceLines(segments);

    return {
      ...base,
      transactionType: '837P',
      billingProvider,
      subscriber,
      payer,
      claimInformation: claimInfo,
      diagnosisCodes,
      serviceLines,
    } as X12_837P;
  }

  /**
   * Build 837I Institutional Claim transaction
   */
  private build837I(base: Partial<X12_837I>, segments: X12Segment[]): X12_837I {
    const billingProvider = this.extractBillingProvider(segments);
    const subscriber = this.extractSubscriber(segments);
    const payer = this.extractPayer(segments);
    const claimInfo = this.extractClaimInfo(segments);
    const diagnosisCodes = this.extractDiagnosisCodes(segments);

    // Extract institutional-specific info
    const clmSegment = segments.find(s => s.segmentId === 'CLM');
    const facilityInfo = {
      typeOfBill: clmSegment?.elements[4]?.split(this.componentSeparator)[0] || '',
    };

    return {
      ...base,
      transactionType: '837I',
      billingProvider,
      subscriber,
      payer,
      claimInformation: claimInfo,
      facilityInfo,
      diagnosisCodes,
      serviceLines: this.extractInstitutionalServiceLines(segments),
    } as X12_837I;
  }

  /**
   * Build 835 Payment/Remittance transaction
   */
  private build835(base: Partial<X12_835>, segments: X12Segment[]): X12_835 {
    // Extract payer info from NM1*PR
    const payerNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'PR');
    const payerInfo = {
      name: payerNm1?.elements[2] || '',
      payerId: payerNm1?.elements[8] || '',
    };

    // Extract payee info from NM1*PE
    const payeeNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'PE');
    const payeeInfo = {
      name: payeeNm1?.elements[2] || '',
      npi: payeeNm1?.elements[8] || '',
    };

    // Extract payment info from BPR segment
    const bprSegment = segments.find(s => s.segmentId === 'BPR');
    const paymentMethod = (bprSegment?.elements[3] as 'ACH' | 'CHK' | 'NON') || 'CHK';
    const paymentAmount = parseFloat(bprSegment?.elements[1] || '0');
    const paymentDate = bprSegment?.elements[15] || '';

    // Extract claim payments from CLP segments
    const claimPayments = this.extractClaimPayments(segments);

    return {
      ...base,
      transactionType: '835',
      payerInfo,
      payeeInfo,
      paymentMethod,
      paymentDate,
      paymentAmount,
      claimPayments,
    } as X12_835;
  }

  /**
   * Build 270 Eligibility Inquiry transaction
   */
  private build270(base: Partial<X12_270>, segments: X12Segment[]): X12_270 {
    const sourceNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'PR');
    const receiverNm1 = this.findSegmentByElement(segments, 'NM1', 0, '1P');
    const subscriberNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'IL');

    return {
      ...base,
      transactionType: '270',
      informationSource: {
        name: sourceNm1?.elements[2] || '',
        payerId: sourceNm1?.elements[8] || '',
      },
      informationReceiver: {
        name: receiverNm1?.elements[2] || '',
        npi: receiverNm1?.elements[8] || '',
      },
      subscriber: {
        memberId: this.findRefValue(segments, 'IG') || '',
        name: this.parseNm1Name(subscriberNm1),
        relationshipCode: '18',
      },
      eligibilityInquiries: this.extractEligibilityInquiries(segments),
    } as X12_270;
  }

  /**
   * Build 271 Eligibility Response transaction
   */
  private build271(base: Partial<X12_271>, segments: X12Segment[]): X12_271 {
    const sourceNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'PR');
    const receiverNm1 = this.findSegmentByElement(segments, 'NM1', 0, '1P');
    const subscriberNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'IL');

    return {
      ...base,
      transactionType: '271',
      informationSource: {
        name: sourceNm1?.elements[2] || '',
        payerId: sourceNm1?.elements[8] || '',
      },
      informationReceiver: {
        name: receiverNm1?.elements[2] || '',
        npi: receiverNm1?.elements[8] || '',
      },
      subscriber: {
        memberId: this.findRefValue(segments, 'IG') || '',
        name: this.parseNm1Name(subscriberNm1),
        eligibilityBenefits: this.extractEligibilityBenefits(segments),
      },
    } as X12_271;
  }

  /**
   * Build 276 Claim Status Inquiry transaction
   */
  private build276(base: Partial<X12_276>, segments: X12Segment[]): X12_276 {
    const sourceNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'PR');
    const receiverNm1 = this.findSegmentByElement(segments, 'NM1', 0, '41');
    const subscriberNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'IL');

    return {
      ...base,
      transactionType: '276',
      informationSource: {
        name: sourceNm1?.elements[2] || '',
        payerId: sourceNm1?.elements[8] || '',
      },
      informationReceiver: {
        name: receiverNm1?.elements[2] || '',
        npi: receiverNm1?.elements[8] || '',
      },
      subscriber: {
        memberId: this.findRefValue(segments, 'IG') || '',
        name: this.parseNm1Name(subscriberNm1),
        relationshipCode: '18',
      },
      claimStatusInquiries: this.extractClaimStatusInquiries(segments),
    } as X12_276;
  }

  /**
   * Build 277 Claim Status Response transaction
   */
  private build277(base: Partial<X12_277>, segments: X12Segment[]): X12_277 {
    const sourceNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'PR');
    const receiverNm1 = this.findSegmentByElement(segments, 'NM1', 0, '41');
    const subscriberNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'IL');

    return {
      ...base,
      transactionType: '277',
      informationSource: {
        name: sourceNm1?.elements[2] || '',
        payerId: sourceNm1?.elements[8] || '',
      },
      informationReceiver: {
        name: receiverNm1?.elements[2] || '',
        npi: receiverNm1?.elements[8] || '',
      },
      subscriber: {
        memberId: this.findRefValue(segments, 'IG') || '',
        name: this.parseNm1Name(subscriberNm1),
      },
      claimStatuses: this.extractClaimStatuses(segments),
    } as X12_277;
  }

  /**
   * Build 278 Prior Authorization transaction
   */
  private build278(base: Partial<X12_278>, segments: X12Segment[]): X12_278 {
    const bhtSegment = segments.find(s => s.segmentId === 'BHT');
    const actionCode = (bhtSegment?.elements[1] === '11' ? 'AR' : 'CT') as 'AR' | 'CT';

    const umoNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'X3');
    const requesterNm1 = this.findSegmentByElement(segments, 'NM1', 0, '1P');
    const subscriberNm1 = this.findSegmentByElement(segments, 'NM1', 0, 'IL');

    // Extract patient event dates
    const dtp = segments.filter(s => s.segmentId === 'DTP');
    const eventDate = dtp.find(d => d.elements[0] === '472')?.elements[2] || '';

    return {
      ...base,
      transactionType: '278',
      actionCode,
      umoInfo: {
        name: umoNm1?.elements[2] || '',
        payerId: umoNm1?.elements[8] || '',
      },
      requesterInfo: {
        name: requesterNm1?.elements[2] || '',
        npi: requesterNm1?.elements[8] || '',
      },
      subscriber: {
        memberId: this.findRefValue(segments, 'IG') || '',
        name: this.parseNm1Name(subscriberNm1),
        relationshipCode: '18',
      },
      patientEvent: {
        eventDate,
      },
      serviceInfo: this.extractServiceInfo(segments),
    } as X12_278;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private normalizeEdi(edi: string): string {
    // Remove BOM if present
    let normalized = edi.replace(/^\uFEFF/, '');
    // Normalize line endings
    normalized = normalized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // Remove line breaks (X12 uses segment terminators, not line breaks)
    normalized = normalized.replace(/\n/g, '');
    return normalized.trim();
  }

  private extractDelimiters(edi: string): void {
    // ISA segment is always exactly 106 characters
    if (edi.startsWith('ISA') && edi.length >= 106) {
      this.elementSeparator = edi.charAt(3);
      this.componentSeparator = edi.charAt(104);
      this.segmentTerminator = edi.charAt(105);
      // Repetition separator is at position 82 in the ISA segment
      this.repetitionSeparator = edi.charAt(82);
    }
  }

  private findSegmentByElement(
    segments: X12Segment[],
    segmentId: string,
    elementIndex: number,
    elementValue: string
  ): X12Segment | undefined {
    return segments.find(
      s => s.segmentId === segmentId && s.elements[elementIndex] === elementValue
    );
  }

  private findRefValue(segments: X12Segment[], qualifier: string): string | undefined {
    const refSegment = this.findSegmentByElement(segments, 'REF', 0, qualifier);
    return refSegment?.elements[1];
  }

  private parseNm1Name(nm1: X12Segment | undefined): X12Name {
    if (!nm1) {
      return { lastName: '', entityType: '1' };
    }
    return {
      lastName: nm1.elements[2] || '',
      firstName: nm1.elements[3],
      middleName: nm1.elements[4],
      prefix: nm1.elements[5],
      suffix: nm1.elements[6],
      entityType: (nm1.elements[1] as '1' | '2') || '1',
    };
  }

  private extractBillingProvider(segments: X12Segment[]): X12_837P_BillingProvider {
    const nm1 = this.findSegmentByElement(segments, 'NM1', 0, '85');
    const n3 = segments.find(s => s.segmentId === 'N3');
    const n4 = segments.find(s => s.segmentId === 'N4');
    const ref = this.findSegmentByElement(segments, 'REF', 0, 'EI');

    return {
      name: nm1?.elements[2] || '',
      npi: nm1?.elements[8] || '',
      address: {
        addressLine1: n3?.elements[0] || '',
        addressLine2: n3?.elements[1],
        city: n4?.elements[0] || '',
        state: n4?.elements[1] || '',
        postalCode: n4?.elements[2] || '',
      },
      taxId: ref?.elements[1] || '',
      taxIdQualifier: 'EI',
    };
  }

  private extractSubscriber(segments: X12Segment[]): X12_837P_Subscriber {
    const nm1 = this.findSegmentByElement(segments, 'NM1', 0, 'IL');
    const ref = this.findSegmentByElement(segments, 'REF', 0, 'SY');
    const dmg = segments.find(s => s.segmentId === 'DMG');

    return {
      memberId: nm1?.elements[8] || ref?.elements[1] || '',
      name: this.parseNm1Name(nm1),
      dateOfBirth: dmg?.elements[1],
      gender: dmg?.elements[2] as 'M' | 'F' | 'U',
      relationshipCode: '18',
    };
  }

  private extractPayer(segments: X12Segment[]): X12_837P_Payer {
    const nm1 = this.findSegmentByElement(segments, 'NM1', 0, 'PR');

    return {
      name: nm1?.elements[2] || '',
      payerId: nm1?.elements[8] || '',
    };
  }

  private extractClaimInfo(segments: X12Segment[]): X12_837P_ClaimInformation {
    const clm = segments.find(s => s.segmentId === 'CLM');

    const clmElements = clm?.elements || [];
    const facilityInfo = clmElements[4]?.split(this.componentSeparator) || [];

    return {
      claimId: clmElements[0] || '',
      totalChargeAmount: parseFloat(clmElements[1] || '0'),
      facilityCode: facilityInfo[0] || '',
      frequencyCode: (clmElements[4]?.split(this.componentSeparator)[2] as '1' | '7' | '8') || '1',
      providerSignatureOnFile: clmElements[5] === 'Y',
      assignmentOfBenefits: clmElements[6] === 'Y',
      releaseOfInformation: (clmElements[7] as 'Y' | 'I' | 'N') || 'Y',
    };
  }

  private extractDiagnosisCodes(segments: X12Segment[]): X12DiagnosisCode[] {
    const diagnosisCodes: X12DiagnosisCode[] = [];
    const hiSegments = segments.filter(s => s.segmentId === 'HI');

    for (const hi of hiSegments) {
      for (let i = 0; i < hi.elements.length; i++) {
        const element = hi.elements[i];
        const components = element.split(this.componentSeparator);

        if (components.length >= 2) {
          const codeType = components[0] as 'ABK' | 'BK' | 'ABF' | 'BF';
          const code = components[1];

          diagnosisCodes.push({
            code,
            codeType,
            isPrincipal: diagnosisCodes.length === 0,
          });
        }
      }
    }

    return diagnosisCodes;
  }

  private extractServiceLines(segments: X12Segment[]): X12ServiceLine[] {
    const serviceLines: X12ServiceLine[] = [];
    const lxSegments = segments.filter(s => s.segmentId === 'LX');

    for (let i = 0; i < lxSegments.length; i++) {
      const lxIndex = segments.indexOf(lxSegments[i]);
      const nextLxIndex = i + 1 < lxSegments.length
        ? segments.indexOf(lxSegments[i + 1])
        : segments.length;

      const lineSegments = segments.slice(lxIndex, nextLxIndex);
      const sv1 = lineSegments.find(s => s.segmentId === 'SV1');
      const dtp = lineSegments.find(s => s.segmentId === 'DTP');

      if (sv1) {
        const procedureInfo = sv1.elements[0]?.split(this.componentSeparator) || [];
        const diagPointers = sv1.elements[6]?.split(this.componentSeparator).map(Number) || [];

        serviceLines.push({
          lineNumber: parseInt(lxSegments[i].elements[0] || String(i + 1), 10),
          procedureCode: procedureInfo[1] || '',
          procedureModifiers: procedureInfo.slice(2, 6).filter(Boolean),
          diagnosisPointers: diagPointers,
          chargeAmount: parseFloat(sv1.elements[1] || '0'),
          units: parseFloat(sv1.elements[3] || '1'),
          unitType: sv1.elements[2] || 'UN',
          serviceDate: dtp?.elements[2] || '',
        });
      }
    }

    return serviceLines;
  }

  private extractInstitutionalServiceLines(segments: X12Segment[]): any[] {
    const serviceLines: any[] = [];
    const lxSegments = segments.filter(s => s.segmentId === 'LX');

    for (let i = 0; i < lxSegments.length; i++) {
      const lxIndex = segments.indexOf(lxSegments[i]);
      const nextLxIndex = i + 1 < lxSegments.length
        ? segments.indexOf(lxSegments[i + 1])
        : segments.length;

      const lineSegments = segments.slice(lxIndex, nextLxIndex);
      const sv2 = lineSegments.find(s => s.segmentId === 'SV2');
      const dtp = lineSegments.find(s => s.segmentId === 'DTP');

      if (sv2) {
        serviceLines.push({
          lineNumber: parseInt(lxSegments[i].elements[0] || String(i + 1), 10),
          revenueCode: sv2.elements[0] || '',
          procedureCode: sv2.elements[1]?.split(this.componentSeparator)[1],
          chargeAmount: parseFloat(sv2.elements[2] || '0'),
          serviceUnits: parseFloat(sv2.elements[4] || '1'),
          unitType: sv2.elements[3] || 'UN',
          serviceDate: dtp?.elements[2] || '',
        });
      }
    }

    return serviceLines;
  }

  private extractClaimPayments(segments: X12Segment[]): any[] {
    const claimPayments: any[] = [];
    const clpSegments = segments.filter(s => s.segmentId === 'CLP');

    for (const clp of clpSegments) {
      const clpIndex = segments.indexOf(clp);
      const nextClpIndex = segments.findIndex((s, i) => i > clpIndex && s.segmentId === 'CLP');
      const endIndex = nextClpIndex === -1 ? segments.length : nextClpIndex;

      const claimSegments = segments.slice(clpIndex, endIndex);
      const svcSegments = claimSegments.filter(s => s.segmentId === 'SVC');

      const serviceLines = svcSegments.map(svc => {
        const procedureInfo = svc.elements[0]?.split(this.componentSeparator) || [];
        return {
          procedureCode: procedureInfo[1] || '',
          chargeAmount: parseFloat(svc.elements[1] || '0'),
          paidAmount: parseFloat(svc.elements[2] || '0'),
          units: parseFloat(svc.elements[4] || '1'),
        };
      });

      claimPayments.push({
        claimId: clp.elements[0] || '',
        claimStatus: clp.elements[1] || '',
        totalClaimChargeAmount: parseFloat(clp.elements[2] || '0'),
        totalClaimPaymentAmount: parseFloat(clp.elements[3] || '0'),
        patientResponsibilityAmount: parseFloat(clp.elements[4] || '0'),
        serviceLines,
      });
    }

    return claimPayments;
  }

  private extractEligibilityInquiries(segments: X12Segment[]): any[] {
    const inquiries: any[] = [];
    const eqSegments = segments.filter(s => s.segmentId === 'EQ');

    for (const eq of eqSegments) {
      inquiries.push({
        serviceTypeCode: eq.elements[0] || '30',
        procedureCode: eq.elements[2],
      });
    }

    return inquiries.length > 0 ? inquiries : [{ serviceTypeCode: '30' }];
  }

  private extractEligibilityBenefits(segments: X12Segment[]): any[] {
    const benefits: any[] = [];
    const ebSegments = segments.filter(s => s.segmentId === 'EB');

    for (const eb of ebSegments) {
      benefits.push({
        informationStatusCode: eb.elements[0] || '1',
        benefitCoverageLevel: eb.elements[1],
        serviceTypeCode: eb.elements[2] || '30',
        insuranceTypeCode: eb.elements[3],
        planCoverageDescription: eb.elements[4],
        timePeriodQualifier: eb.elements[5],
        monetaryAmount: eb.elements[6] ? parseFloat(eb.elements[6]) : undefined,
        percent: eb.elements[7] ? parseFloat(eb.elements[7]) : undefined,
      });
    }

    return benefits;
  }

  private extractClaimStatusInquiries(segments: X12Segment[]): any[] {
    const inquiries: any[] = [];
    const trnSegments = segments.filter(s => s.segmentId === 'TRN');

    for (const trn of trnSegments) {
      inquiries.push({
        claimId: trn.elements[1] || '',
      });
    }

    return inquiries;
  }

  private extractClaimStatuses(segments: X12Segment[]): any[] {
    const statuses: any[] = [];
    const stcSegments = segments.filter(s => s.segmentId === 'STC');

    for (const stc of stcSegments) {
      const statusInfo = stc.elements[0]?.split(this.componentSeparator) || [];
      statuses.push({
        claimId: stc.elements[3] || '',
        claimStatusCategoryCode: statusInfo[0] || '',
        claimStatusCode: statusInfo[1] || '',
        effectiveDate: stc.elements[1],
      });
    }

    return statuses;
  }

  private extractServiceInfo(segments: X12Segment[]): any[] {
    const services: any[] = [];
    const svSegments = segments.filter(s => s.segmentId === 'SV1' || s.segmentId === 'SV2');

    for (const sv of svSegments) {
      const procedureInfo = sv.elements[0]?.split(this.componentSeparator) || [];
      services.push({
        serviceTypeCode: '1',
        procedureCode: procedureInfo[1],
      });
    }

    // If no SV segments, look for UM segments
    if (services.length === 0) {
      const umSegments = segments.filter(s => s.segmentId === 'UM');
      for (const um of umSegments) {
        services.push({
          serviceTypeCode: um.elements[1] || '1',
        });
      }
    }

    return services.length > 0 ? services : [{ serviceTypeCode: '1' }];
  }
}

// Export a default parser instance
export const x12Parser = new X12Parser();
