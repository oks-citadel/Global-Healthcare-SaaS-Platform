import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface X12Envelope {
  isaControlNumber: string;
  gsControlNumber: string;
  stControlNumber: string;
  senderId: string;
  senderQualifier: string;
  receiverId: string;
  receiverQualifier: string;
  interchangeDate: Date;
}

export interface X12ParsedTransaction {
  envelope: X12Envelope;
  transactionType: string;
  segments: X12Segment[];
  raw: string;
}

export interface X12Segment {
  id: string;
  elements: string[];
}

export interface X12ProcessingResult {
  success: boolean;
  transactionId: string;
  acknowledgment?: string;
  errors?: string[];
  data?: any;
}

export class X12TransactionService {
  private segmentDelimiter = '~';
  private elementDelimiter = '*';
  private subelementDelimiter = ':';

  /**
   * Parse raw X12 EDI content
   */
  parse(rawContent: string): X12ParsedTransaction {
    const lines = rawContent.trim().split(this.segmentDelimiter).filter(Boolean);
    const segments: X12Segment[] = [];

    const envelope: Partial<X12Envelope> = {};
    let transactionType = '';

    for (const line of lines) {
      const elements = line.trim().split(this.elementDelimiter);
      const segmentId = elements[0];

      segments.push({
        id: segmentId,
        elements: elements.slice(1),
      });

      // Parse envelope segments
      if (segmentId === 'ISA') {
        envelope.senderQualifier = elements[5];
        envelope.senderId = elements[6].trim();
        envelope.receiverQualifier = elements[7];
        envelope.receiverId = elements[8].trim();
        envelope.interchangeDate = this.parseIsaDate(elements[9], elements[10]);
        envelope.isaControlNumber = elements[13];
      } else if (segmentId === 'GS') {
        envelope.gsControlNumber = elements[6];
        transactionType = this.mapFunctionalGroup(elements[1]);
      } else if (segmentId === 'ST') {
        envelope.stControlNumber = elements[2];
        transactionType = this.mapTransactionSet(elements[1]);
      }
    }

    return {
      envelope: envelope as X12Envelope,
      transactionType,
      segments,
      raw: rawContent,
    };
  }

  /**
   * Process an incoming X12 transaction
   */
  async processInbound(rawContent: string, partnerId?: string): Promise<X12ProcessingResult> {
    const transactionId = uuidv4();

    try {
      // Parse the transaction
      const parsed = this.parse(rawContent);

      // Validate the transaction
      const validationErrors = this.validate(parsed);
      if (validationErrors.length > 0) {
        // Store failed transaction
        await this.storeTransaction(parsed, transactionId, 'rejected', validationErrors, partnerId);

        return {
          success: false,
          transactionId,
          errors: validationErrors,
          acknowledgment: this.generate999Acknowledgment(parsed, validationErrors),
        };
      }

      // Store the transaction
      await this.storeTransaction(parsed, transactionId, 'validated', undefined, partnerId);

      // Process based on transaction type
      const processedData = await this.processTransaction(parsed);

      // Update status to completed
      await prisma.x12Transaction.updateMany({
        where: { transactionSetId: transactionId },
        data: { status: 'completed', processedAt: new Date() },
      });

      // Generate acknowledgment
      const acknowledgment = this.generate999Acknowledgment(parsed, []);

      return {
        success: true,
        transactionId,
        acknowledgment,
        data: processedData,
      };
    } catch (error: any) {
      logger.error('X12 transaction processing failed', {
        transactionId,
        error: error.message,
      });

      return {
        success: false,
        transactionId,
        errors: [error.message],
      };
    }
  }

  /**
   * Generate an outbound X12 transaction
   */
  async generateOutbound(
    transactionType: string,
    data: any,
    partnerId: string
  ): Promise<X12ProcessingResult> {
    const transactionId = uuidv4();

    try {
      // Get partner configuration
      const partner = await prisma.tradingPartner.findUnique({
        where: { id: partnerId },
      });

      if (!partner) {
        return {
          success: false,
          transactionId,
          errors: ['Trading partner not found'],
        };
      }

      // Generate the X12 content based on transaction type
      let rawContent: string;

      switch (transactionType) {
        case 'x270_eligibility_inquiry':
          rawContent = this.generate270(data, partner);
          break;
        case 'x276_claim_status_inquiry':
          rawContent = this.generate276(data, partner);
          break;
        case 'x278_prior_auth_request':
          rawContent = this.generate278(data, partner);
          break;
        case 'x837_professional_claim':
          rawContent = this.generate837P(data, partner);
          break;
        default:
          return {
            success: false,
            transactionId,
            errors: [`Unsupported transaction type: ${transactionType}`],
          };
      }

      // Parse to get envelope details
      const parsed = this.parse(rawContent);

      // Store outbound transaction
      await this.storeTransaction(parsed, transactionId, 'processing', undefined, partnerId);

      return {
        success: true,
        transactionId,
        data: rawContent,
      };
    } catch (error: any) {
      logger.error('X12 outbound generation failed', {
        transactionId,
        error: error.message,
      });

      return {
        success: false,
        transactionId,
        errors: [error.message],
      };
    }
  }

  /**
   * Validate X12 transaction
   */
  private validate(parsed: X12ParsedTransaction): string[] {
    const errors: string[] = [];

    // Check for required segments
    const segmentIds = parsed.segments.map((s) => s.id);

    if (!segmentIds.includes('ISA')) {
      errors.push('Missing ISA segment');
    }
    if (!segmentIds.includes('GS')) {
      errors.push('Missing GS segment');
    }
    if (!segmentIds.includes('ST')) {
      errors.push('Missing ST segment');
    }
    if (!segmentIds.includes('SE')) {
      errors.push('Missing SE segment');
    }
    if (!segmentIds.includes('GE')) {
      errors.push('Missing GE segment');
    }
    if (!segmentIds.includes('IEA')) {
      errors.push('Missing IEA segment');
    }

    // Validate segment counts
    const stIndex = segmentIds.indexOf('ST');
    const seIndex = segmentIds.indexOf('SE');
    if (stIndex >= 0 && seIndex >= 0) {
      const seElement = parsed.segments[seIndex].elements[0];
      const expectedCount = seIndex - stIndex + 1;
      if (parseInt(seElement) !== expectedCount) {
        errors.push(`SE segment count mismatch: expected ${expectedCount}, got ${seElement}`);
      }
    }

    return errors;
  }

  /**
   * Store X12 transaction in database
   */
  private async storeTransaction(
    parsed: X12ParsedTransaction,
    transactionId: string,
    status: string,
    errors?: string[],
    partnerId?: string
  ): Promise<void> {
    await prisma.x12Transaction.create({
      data: {
        transactionSetId: transactionId,
        transactionType: this.mapTransactionTypeToEnum(parsed.transactionType),
        isaControlNumber: parsed.envelope.isaControlNumber,
        gsControlNumber: parsed.envelope.gsControlNumber,
        stControlNumber: parsed.envelope.stControlNumber,
        senderId: parsed.envelope.senderId,
        senderQualifier: parsed.envelope.senderQualifier,
        receiverId: parsed.envelope.receiverId,
        receiverQualifier: parsed.envelope.receiverQualifier,
        rawContent: parsed.raw,
        parsedContent: parsed.segments as any,
        status: status as any,
        errors: errors ? { errors } : undefined,
        interchangeDate: parsed.envelope.interchangeDate,
      },
    });

    // Also log in transaction log
    await prisma.transactionLog.create({
      data: {
        transactionId,
        type: this.mapTransactionTypeToLogEnum(parsed.transactionType),
        direction: 'inbound',
        status: status === 'completed' ? 'completed' : status === 'rejected' ? 'failed' : 'processing',
        payload: { isaControlNumber: parsed.envelope.isaControlNumber },
        partnerId,
        errorMessage: errors?.join('; '),
      },
    });
  }

  /**
   * Process transaction based on type
   */
  private async processTransaction(parsed: X12ParsedTransaction): Promise<any> {
    switch (parsed.transactionType) {
      case 'x270_eligibility_inquiry':
        return this.process270(parsed);
      case 'x271_eligibility_response':
        return this.process271(parsed);
      case 'x276_claim_status_inquiry':
        return this.process276(parsed);
      case 'x277_claim_status_response':
        return this.process277(parsed);
      case 'x835_payment_remittance':
        return this.process835(parsed);
      case 'x837_professional_claim':
      case 'x837_institutional_claim':
        return this.process837(parsed);
      default:
        return { raw: parsed.segments };
    }
  }

  /**
   * Process 270 Eligibility Inquiry
   */
  private process270(parsed: X12ParsedTransaction): any {
    const result: any = {
      subscriberId: '',
      dependentId: '',
      serviceTypes: [],
    };

    for (const segment of parsed.segments) {
      if (segment.id === 'NM1' && segment.elements[0] === 'IL') {
        result.subscriberId = segment.elements[8]; // Member ID
      } else if (segment.id === 'EQ') {
        result.serviceTypes.push(segment.elements[0]);
      }
    }

    return result;
  }

  /**
   * Process 271 Eligibility Response
   */
  private process271(parsed: X12ParsedTransaction): any {
    const result: any = {
      eligible: false,
      benefits: [],
    };

    for (const segment of parsed.segments) {
      if (segment.id === 'EB') {
        const benefitInfo = segment.elements[0];
        result.benefits.push({
          informationCode: benefitInfo,
          coverageLevel: segment.elements[1],
          serviceType: segment.elements[2],
          amount: segment.elements[6],
        });
        if (benefitInfo === '1') {
          result.eligible = true;
        }
      }
    }

    return result;
  }

  /**
   * Process 276 Claim Status Inquiry
   */
  private process276(parsed: X12ParsedTransaction): any {
    const result: any = {
      claimId: '',
      patientId: '',
    };

    for (const segment of parsed.segments) {
      if (segment.id === 'TRN') {
        result.claimId = segment.elements[1];
      } else if (segment.id === 'NM1' && segment.elements[0] === 'QC') {
        result.patientId = segment.elements[8];
      }
    }

    return result;
  }

  /**
   * Process 277 Claim Status Response
   */
  private process277(parsed: X12ParsedTransaction): any {
    const result: any = {
      claimStatus: '',
      statusCode: '',
    };

    for (const segment of parsed.segments) {
      if (segment.id === 'STC') {
        result.statusCode = segment.elements[0];
        result.claimStatus = this.mapClaimStatusCode(segment.elements[0]);
      }
    }

    return result;
  }

  /**
   * Process 835 Payment/Remittance
   */
  private process835(parsed: X12ParsedTransaction): any {
    const result: any = {
      payments: [],
      totalPayment: 0,
    };

    let currentClaim: any = null;

    for (const segment of parsed.segments) {
      if (segment.id === 'CLP') {
        if (currentClaim) {
          result.payments.push(currentClaim);
        }
        currentClaim = {
          claimId: segment.elements[0],
          status: segment.elements[1],
          chargedAmount: parseFloat(segment.elements[2]) || 0,
          paidAmount: parseFloat(segment.elements[3]) || 0,
        };
        result.totalPayment += currentClaim.paidAmount;
      } else if (segment.id === 'SVC' && currentClaim) {
        if (!currentClaim.services) currentClaim.services = [];
        currentClaim.services.push({
          procedureCode: segment.elements[0],
          chargedAmount: parseFloat(segment.elements[1]) || 0,
          paidAmount: parseFloat(segment.elements[2]) || 0,
        });
      }
    }

    if (currentClaim) {
      result.payments.push(currentClaim);
    }

    return result;
  }

  /**
   * Process 837 Claim Submission
   */
  private process837(parsed: X12ParsedTransaction): any {
    const result: any = {
      claims: [],
    };

    let currentClaim: any = null;

    for (const segment of parsed.segments) {
      if (segment.id === 'CLM') {
        if (currentClaim) {
          result.claims.push(currentClaim);
        }
        currentClaim = {
          claimId: segment.elements[0],
          totalCharge: parseFloat(segment.elements[1]) || 0,
          facilityCode: segment.elements[4],
          services: [],
        };
      } else if (segment.id === 'SV1' && currentClaim) {
        currentClaim.services.push({
          procedureCode: segment.elements[0],
          charge: parseFloat(segment.elements[1]) || 0,
          units: parseInt(segment.elements[3]) || 1,
        });
      }
    }

    if (currentClaim) {
      result.claims.push(currentClaim);
    }

    return result;
  }

  /**
   * Generate 270 Eligibility Inquiry
   */
  private generate270(data: any, partner: any): string {
    const now = new Date();
    const isaControlNumber = this.generateControlNumber(9);
    const gsControlNumber = this.generateControlNumber(9);
    const stControlNumber = this.generateControlNumber(4);

    const segments = [
      `ISA*00*          *00*          *ZZ*${this.padRight(data.senderId || 'SENDER', 15)}*ZZ*${this.padRight(partner.isaId || 'RECEIVER', 15)}*${this.formatDate(now, 'yyMMdd')}*${this.formatTime(now)}*^*00501*${isaControlNumber}*0*P*:`,
      `GS*HS*${data.senderId || 'SENDER'}*${partner.gsId || partner.isaId || 'RECEIVER'}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}*${gsControlNumber}*X*005010X279A1`,
      `ST*270*${stControlNumber}*005010X279A1`,
      `BHT*0022*13*${uuidv4().substring(0, 20)}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}`,
      `HL*1**20*1`,
      `NM1*PR*2*${data.payerName || 'PAYER'}*****PI*${data.payerId || ''}`,
      `HL*2*1*21*1`,
      `NM1*1P*2*${data.providerName || 'PROVIDER'}*****XX*${data.providerNpi || ''}`,
      `HL*3*2*22*0`,
      `NM1*IL*1*${data.lastName || ''}*${data.firstName || ''}****MI*${data.memberId || ''}`,
      `DMG*D8*${data.dob || ''}`,
      `DTP*291*D8*${this.formatDate(now, 'yyyyMMdd')}`,
      `EQ*30`,
      `SE*13*${stControlNumber}`,
      `GE*1*${gsControlNumber}`,
      `IEA*1*${isaControlNumber}`,
    ];

    return segments.join(this.segmentDelimiter) + this.segmentDelimiter;
  }

  /**
   * Generate 276 Claim Status Inquiry
   */
  private generate276(data: any, partner: any): string {
    const now = new Date();
    const isaControlNumber = this.generateControlNumber(9);
    const gsControlNumber = this.generateControlNumber(9);
    const stControlNumber = this.generateControlNumber(4);

    const segments = [
      `ISA*00*          *00*          *ZZ*${this.padRight(data.senderId || 'SENDER', 15)}*ZZ*${this.padRight(partner.isaId || 'RECEIVER', 15)}*${this.formatDate(now, 'yyMMdd')}*${this.formatTime(now)}*^*00501*${isaControlNumber}*0*P*:`,
      `GS*HR*${data.senderId || 'SENDER'}*${partner.gsId || 'RECEIVER'}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}*${gsControlNumber}*X*005010X212`,
      `ST*276*${stControlNumber}*005010X212`,
      `BHT*0010*13*${uuidv4().substring(0, 20)}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}`,
      `HL*1**20*1`,
      `NM1*PR*2*${data.payerName || 'PAYER'}*****PI*${data.payerId || ''}`,
      `HL*2*1*21*1`,
      `NM1*41*2*${data.providerName || 'PROVIDER'}*****46*${data.providerNpi || ''}`,
      `HL*3*2*19*1`,
      `NM1*1P*2*${data.providerName || 'PROVIDER'}*****XX*${data.providerNpi || ''}`,
      `HL*4*3*22*0`,
      `NM1*QC*1*${data.lastName || ''}*${data.firstName || ''}****MI*${data.memberId || ''}`,
      `TRN*1*${data.claimId || ''}`,
      `REF*1K*${data.claimId || ''}`,
      `SE*14*${stControlNumber}`,
      `GE*1*${gsControlNumber}`,
      `IEA*1*${isaControlNumber}`,
    ];

    return segments.join(this.segmentDelimiter) + this.segmentDelimiter;
  }

  /**
   * Generate 278 Prior Authorization Request
   */
  private generate278(data: any, partner: any): string {
    const now = new Date();
    const isaControlNumber = this.generateControlNumber(9);
    const gsControlNumber = this.generateControlNumber(9);
    const stControlNumber = this.generateControlNumber(4);

    const segments = [
      `ISA*00*          *00*          *ZZ*${this.padRight(data.senderId || 'SENDER', 15)}*ZZ*${this.padRight(partner.isaId || 'RECEIVER', 15)}*${this.formatDate(now, 'yyMMdd')}*${this.formatTime(now)}*^*00501*${isaControlNumber}*0*P*:`,
      `GS*HI*${data.senderId || 'SENDER'}*${partner.gsId || 'RECEIVER'}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}*${gsControlNumber}*X*005010X217`,
      `ST*278*${stControlNumber}*005010X217`,
      `BHT*0007*11*${uuidv4().substring(0, 20)}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}`,
      `HL*1**20*1`,
      `NM1*X3*2*${data.payerName || 'PAYER'}*****PI*${data.payerId || ''}`,
      `HL*2*1*21*1`,
      `NM1*1P*2*${data.providerName || 'PROVIDER'}*****XX*${data.providerNpi || ''}`,
      `HL*3*2*22*1`,
      `NM1*IL*1*${data.lastName || ''}*${data.firstName || ''}****MI*${data.memberId || ''}`,
      `HL*4*3*EV*0`,
      `UM*HS*I*${data.serviceType || ''}`,
      `HI*BK:${data.diagnosisCode || ''}`,
      `SE*13*${stControlNumber}`,
      `GE*1*${gsControlNumber}`,
      `IEA*1*${isaControlNumber}`,
    ];

    return segments.join(this.segmentDelimiter) + this.segmentDelimiter;
  }

  /**
   * Generate 837P Professional Claim
   */
  private generate837P(data: any, partner: any): string {
    const now = new Date();
    const isaControlNumber = this.generateControlNumber(9);
    const gsControlNumber = this.generateControlNumber(9);
    const stControlNumber = this.generateControlNumber(4);

    const segments = [
      `ISA*00*          *00*          *ZZ*${this.padRight(data.senderId || 'SENDER', 15)}*ZZ*${this.padRight(partner.isaId || 'RECEIVER', 15)}*${this.formatDate(now, 'yyMMdd')}*${this.formatTime(now)}*^*00501*${isaControlNumber}*0*P*:`,
      `GS*HC*${data.senderId || 'SENDER'}*${partner.gsId || 'RECEIVER'}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}*${gsControlNumber}*X*005010X222A1`,
      `ST*837*${stControlNumber}*005010X222A1`,
      `BHT*0019*00*${uuidv4().substring(0, 20)}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}*CH`,
      `NM1*41*2*${data.submitterName || 'SUBMITTER'}*****46*${data.submitterId || ''}`,
      `PER*IC*${data.contactName || 'CONTACT'}*TE*${data.contactPhone || ''}`,
      `NM1*40*2*${data.receiverName || 'RECEIVER'}*****46*${data.receiverId || ''}`,
      `HL*1**20*1`,
      `NM1*85*2*${data.billingProviderName || 'PROVIDER'}*****XX*${data.billingProviderNpi || ''}`,
      `N3*${data.billingProviderAddress || ''}`,
      `N4*${data.billingProviderCity || ''}*${data.billingProviderState || ''}*${data.billingProviderZip || ''}`,
      `REF*EI*${data.billingProviderTaxId || ''}`,
      `HL*2*1*22*0`,
      `SBR*P*18*${data.groupNumber || ''}******CI`,
      `NM1*IL*1*${data.subscriberLastName || ''}*${data.subscriberFirstName || ''}****MI*${data.memberId || ''}`,
      `N3*${data.subscriberAddress || ''}`,
      `N4*${data.subscriberCity || ''}*${data.subscriberState || ''}*${data.subscriberZip || ''}`,
      `DMG*D8*${data.subscriberDob || ''}*${data.subscriberGender || ''}`,
      `NM1*PR*2*${data.payerName || 'PAYER'}*****PI*${data.payerId || ''}`,
      `CLM*${data.claimId || ''}*${data.totalCharge || 0}***11:B:1*Y*A*Y*Y`,
      `HI*ABK:${data.diagnosisCode || ''}`,
      `LX*1`,
      `SV1*HC:${data.procedureCode || ''}*${data.chargeAmount || 0}*UN*1***1`,
      `DTP*472*D8*${data.serviceDate || this.formatDate(now, 'yyyyMMdd')}`,
      `SE*24*${stControlNumber}`,
      `GE*1*${gsControlNumber}`,
      `IEA*1*${isaControlNumber}`,
    ];

    return segments.join(this.segmentDelimiter) + this.segmentDelimiter;
  }

  /**
   * Generate 999 Acknowledgment
   */
  private generate999Acknowledgment(parsed: X12ParsedTransaction, errors: string[]): string {
    const now = new Date();
    const isaControlNumber = this.generateControlNumber(9);
    const gsControlNumber = this.generateControlNumber(9);
    const stControlNumber = this.generateControlNumber(4);

    const ackCode = errors.length === 0 ? 'A' : 'R';
    const ackMessage = errors.length === 0 ? 'Accepted' : 'Rejected';

    const segments = [
      `ISA*00*          *00*          *ZZ*${this.padRight(parsed.envelope.receiverId, 15)}*ZZ*${this.padRight(parsed.envelope.senderId, 15)}*${this.formatDate(now, 'yyMMdd')}*${this.formatTime(now)}*^*00501*${isaControlNumber}*0*P*:`,
      `GS*FA*${parsed.envelope.receiverId}*${parsed.envelope.senderId}*${this.formatDate(now, 'yyyyMMdd')}*${this.formatTime(now)}*${gsControlNumber}*X*005010X231A1`,
      `ST*999*${stControlNumber}*005010X231A1`,
      `AK1*${parsed.transactionType.substring(1, 3)}*${parsed.envelope.gsControlNumber}`,
      `AK2*${parsed.transactionType.substring(1, 4)}*${parsed.envelope.stControlNumber}`,
      `IK5*${ackCode}`,
      `AK9*${ackCode}*1*1*${errors.length === 0 ? 1 : 0}`,
      `SE*7*${stControlNumber}`,
      `GE*1*${gsControlNumber}`,
      `IEA*1*${isaControlNumber}`,
    ];

    return segments.join(this.segmentDelimiter) + this.segmentDelimiter;
  }

  // Helper methods
  private parseIsaDate(date: string, time: string): Date {
    const year = 2000 + parseInt(date.substring(0, 2));
    const month = parseInt(date.substring(2, 4)) - 1;
    const day = parseInt(date.substring(4, 6));
    const hour = parseInt(time.substring(0, 2));
    const minute = parseInt(time.substring(2, 4));
    return new Date(year, month, day, hour, minute);
  }

  private mapFunctionalGroup(code: string): string {
    const map: Record<string, string> = {
      'HS': 'x270_eligibility_inquiry',
      'HB': 'x271_eligibility_response',
      'HR': 'x276_claim_status_inquiry',
      'HN': 'x277_claim_status_response',
      'HI': 'x278_prior_auth_request',
      'HP': 'x835_payment_remittance',
      'HC': 'x837_professional_claim',
    };
    return map[code] || code;
  }

  private mapTransactionSet(code: string): string {
    const map: Record<string, string> = {
      '270': 'x270_eligibility_inquiry',
      '271': 'x271_eligibility_response',
      '276': 'x276_claim_status_inquiry',
      '277': 'x277_claim_status_response',
      '278': 'x278_prior_auth_request',
      '835': 'x835_payment_remittance',
      '837': 'x837_professional_claim',
      '999': 'x999_acknowledgment',
      '997': 'x997_acknowledgment',
    };
    return map[code] || code;
  }

  private mapTransactionTypeToEnum(type: string): any {
    return type as any;
  }

  private mapTransactionTypeToLogEnum(type: string): any {
    const map: Record<string, string> = {
      'x270_eligibility_inquiry': 'x12_270_eligibility',
      'x271_eligibility_response': 'x12_271_eligibility_response',
      'x276_claim_status_inquiry': 'x12_276_claim_status',
      'x277_claim_status_response': 'x12_277_claim_status_response',
      'x278_prior_auth_request': 'x12_278_prior_auth',
      'x835_payment_remittance': 'x12_835_payment',
      'x837_professional_claim': 'x12_837_claim',
    };
    return map[type] || 'x12_270_eligibility';
  }

  private mapClaimStatusCode(code: string): string {
    const map: Record<string, string> = {
      'A0': 'Forwarded',
      'A1': 'Pending',
      'A2': 'Accepted',
      'A3': 'Rejected',
      'A4': 'Not Found',
      'A5': 'Split',
    };
    return map[code.substring(0, 2)] || 'Unknown';
  }

  private generateControlNumber(length: number): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  private padRight(str: string, length: number): string {
    return str.substring(0, length).padEnd(length, ' ');
  }

  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    if (format === 'yyMMdd') {
      return year.substring(2) + month + day;
    }
    return year + month + day;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + minutes;
  }
}

export default new X12TransactionService();
