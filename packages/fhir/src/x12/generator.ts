/**
 * X12 EDI Generator
 * Generates X12 EDI strings from structured transaction objects
 */

import {
  X12Transaction,
  X12TransactionType,
  X12Segment,
  X12GenerateOptions,
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
  X12Envelope,
  ISASegment,
  GSSegment,
  STSegment,
  isX12_837P,
  isX12_837I,
  isX12_835,
  isX12_270,
  isX12_271,
  isX12_276,
  isX12_277,
  isX12_278,
} from './types';

export class X12Generator {
  private segmentTerminator: string = '~';
  private elementSeparator: string = '*';
  private componentSeparator: string = ':';
  private repetitionSeparator: string = '^';
  private lineBreaks: boolean = false;

  constructor(options?: X12GenerateOptions) {
    if (options) {
      this.segmentTerminator = options.segmentTerminator ?? '~';
      this.elementSeparator = options.elementSeparator ?? '*';
      this.componentSeparator = options.componentSeparator ?? ':';
      this.repetitionSeparator = options.repetitionSeparator ?? '^';
      this.lineBreaks = options.lineBreaks ?? false;
    }
  }

  /**
   * Generate an X12 EDI string from a transaction object
   */
  generate(transaction: X12Transaction): string {
    const segments: string[] = [];

    // Generate based on transaction type
    if (isX12_837P(transaction)) {
      this.generate837P(transaction, segments);
    } else if (isX12_837I(transaction)) {
      this.generate837I(transaction, segments);
    } else if (isX12_835(transaction)) {
      this.generate835(transaction, segments);
    } else if (isX12_270(transaction)) {
      this.generate270(transaction, segments);
    } else if (isX12_271(transaction)) {
      this.generate271(transaction, segments);
    } else if (isX12_276(transaction)) {
      this.generate276(transaction, segments);
    } else if (isX12_277(transaction)) {
      this.generate277(transaction, segments);
    } else if (isX12_278(transaction)) {
      this.generate278(transaction, segments);
    } else {
      throw new Error(`Unsupported transaction type: ${transaction.transactionType}`);
    }

    const separator = this.lineBreaks ? this.segmentTerminator + '\n' : this.segmentTerminator;
    return segments.join(separator) + this.segmentTerminator;
  }

  /**
   * Generate default envelope for a transaction
   */
  generateDefaultEnvelope(
    transactionType: X12TransactionType,
    senderId: string,
    receiverId: string,
    controlNumber: string
  ): X12Envelope {
    const now = new Date();
    const date = this.formatDate(now, 'YYMMDD');
    const fullDate = this.formatDate(now, 'CCYYMMDD');
    const time = this.formatTime(now);

    const functionalIdCodes: Record<X12TransactionType, string> = {
      '837P': 'HC',
      '837I': 'HC',
      '835': 'HP',
      '270': 'HS',
      '271': 'HB',
      '276': 'HR',
      '277': 'HN',
      '278': 'HI',
    };

    const versionCodes: Record<X12TransactionType, string> = {
      '837P': '005010X222A1',
      '837I': '005010X223A2',
      '835': '005010X221A1',
      '270': '005010X279A1',
      '271': '005010X279A1',
      '276': '005010X212',
      '277': '005010X212',
      '278': '005010X217',
    };

    const stCodes: Record<X12TransactionType, string> = {
      '837P': '837',
      '837I': '837',
      '835': '835',
      '270': '270',
      '271': '271',
      '276': '276',
      '277': '277',
      '278': '278',
    };

    const isa: ISASegment = {
      authorizationQualifier: '00',
      authorizationInfo: '          ',
      securityQualifier: '00',
      securityInfo: '          ',
      senderIdQualifier: 'ZZ',
      senderId: this.padRight(senderId, 15),
      receiverIdQualifier: 'ZZ',
      receiverId: this.padRight(receiverId, 15),
      date,
      time,
      repetitionSeparator: this.repetitionSeparator,
      versionNumber: '00501',
      controlNumber: this.padLeft(controlNumber, 9, '0'),
      acknowledgmentRequested: '0',
      usageIndicator: 'P',
      componentSeparator: this.componentSeparator,
    };

    const gs: GSSegment = {
      functionalIdCode: functionalIdCodes[transactionType],
      applicationSenderCode: senderId,
      applicationReceiverCode: receiverId,
      date: fullDate,
      time,
      groupControlNumber: controlNumber,
      responsibleAgencyCode: 'X',
      versionCode: versionCodes[transactionType] as any,
    };

    const st: STSegment = {
      transactionSetIdCode: stCodes[transactionType],
      transactionSetControlNumber: this.padLeft(controlNumber, 4, '0'),
      implementationConventionReference: versionCodes[transactionType],
    };

    return { isa, gs, st };
  }

  // ============================================================================
  // Transaction-Specific Generation Methods
  // ============================================================================

  private generate837P(tx: X12_837P, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BHT - Beginning of Hierarchical Transaction
    segments.push(this.buildSegment('BHT', '0019', '00', tx.claimInformation.claimId, this.formatDate(new Date()), this.formatTime(new Date()), 'CH'));

    // 1000A - Submitter Name
    segments.push(this.buildSegment('NM1', '41', '2', tx.billingProvider.name, '', '', '', '', '46', tx.billingProvider.npi));
    if (tx.billingProvider.contactPhone) {
      segments.push(this.buildSegment('PER', 'IC', tx.billingProvider.contactName || '', 'TE', tx.billingProvider.contactPhone));
    }

    // 1000B - Receiver Name
    segments.push(this.buildSegment('NM1', '40', '2', tx.payer.name, '', '', '', '', '46', tx.payer.payerId));

    // 2000A - Billing Provider Hierarchical Level
    segments.push(this.buildSegment('HL', '1', '', '20', '1'));
    segments.push(this.buildSegment('PRV', 'BI', 'PXC', tx.billingProvider.taxonomyCode || ''));

    // 2010AA - Billing Provider Name
    segments.push(this.buildSegment('NM1', '85', '2', tx.billingProvider.name, '', '', '', '', 'XX', tx.billingProvider.npi));
    segments.push(this.buildSegment('N3', tx.billingProvider.address.addressLine1, tx.billingProvider.address.addressLine2 || ''));
    segments.push(this.buildSegment('N4', tx.billingProvider.address.city, tx.billingProvider.address.state, tx.billingProvider.address.postalCode));
    segments.push(this.buildSegment('REF', tx.billingProvider.taxIdQualifier, tx.billingProvider.taxId));

    // 2000B - Subscriber Hierarchical Level
    const hasPatient = tx.patient && tx.subscriber.relationshipCode !== '18';
    segments.push(this.buildSegment('HL', '2', '1', '22', hasPatient ? '1' : '0'));
    segments.push(this.buildSegment('SBR', 'P', tx.subscriber.relationshipCode, tx.subscriber.groupNumber || '', '', '', '', '', '', 'CI'));

    // 2010BA - Subscriber Name
    segments.push(this.buildNM1Segment('IL', tx.subscriber.name, 'MI', tx.subscriber.memberId));
    if (tx.subscriber.address) {
      segments.push(this.buildSegment('N3', tx.subscriber.address.addressLine1, tx.subscriber.address.addressLine2 || ''));
      segments.push(this.buildSegment('N4', tx.subscriber.address.city, tx.subscriber.address.state, tx.subscriber.address.postalCode));
    }
    if (tx.subscriber.dateOfBirth) {
      segments.push(this.buildSegment('DMG', 'D8', tx.subscriber.dateOfBirth, tx.subscriber.gender || 'U'));
    }

    // 2010BB - Payer Name
    segments.push(this.buildSegment('NM1', 'PR', '2', tx.payer.name, '', '', '', '', 'PI', tx.payer.payerId));

    // 2000C - Patient Hierarchical Level (if different from subscriber)
    if (hasPatient && tx.patient) {
      segments.push(this.buildSegment('HL', '3', '2', '23', '0'));
      segments.push(this.buildSegment('PAT', tx.patient.relationshipToSubscriber));

      // 2010CA - Patient Name
      segments.push(this.buildNM1Segment('QC', tx.patient.name, '', ''));
      if (tx.patient.address) {
        segments.push(this.buildSegment('N3', tx.patient.address.addressLine1, tx.patient.address.addressLine2 || ''));
        segments.push(this.buildSegment('N4', tx.patient.address.city, tx.patient.address.state, tx.patient.address.postalCode));
      }
      if (tx.patient.dateOfBirth) {
        segments.push(this.buildSegment('DMG', 'D8', tx.patient.dateOfBirth, tx.patient.gender || 'U'));
      }
    }

    // 2300 - Claim Information
    const facilityCode = [tx.claimInformation.facilityCode, 'B', tx.claimInformation.frequencyCode].join(this.componentSeparator);
    segments.push(this.buildSegment(
      'CLM',
      tx.claimInformation.claimId,
      tx.claimInformation.totalChargeAmount.toFixed(2),
      '',
      '',
      facilityCode,
      tx.claimInformation.providerSignatureOnFile ? 'Y' : 'N',
      tx.claimInformation.assignmentOfBenefits ? 'A' : 'B',
      tx.claimInformation.releaseOfInformation,
      'Y'
    ));

    // DTP - Dates
    const serviceDates = tx.serviceLines.length > 0 ? tx.serviceLines[0].serviceDate : this.formatDate(new Date());
    segments.push(this.buildSegment('DTP', '431', 'D8', serviceDates));

    // Prior Authorization Reference
    if (tx.claimInformation.priorAuthorizationNumber) {
      segments.push(this.buildSegment('REF', 'G1', tx.claimInformation.priorAuthorizationNumber));
    }

    // HI - Health Care Diagnosis Codes
    if (tx.diagnosisCodes.length > 0) {
      const diagElements = tx.diagnosisCodes.map((d, i) => {
        const qualifier = i === 0 ? 'ABK' : 'ABF';
        return `${qualifier}${this.componentSeparator}${d.code}`;
      });
      segments.push(this.buildSegment('HI', ...diagElements));
    }

    // 2310B - Rendering Provider (if different from billing)
    if (tx.renderingProvider) {
      segments.push(this.buildNM1Segment('82', tx.renderingProvider.name, 'XX', tx.renderingProvider.npi));
      if (tx.renderingProvider.taxonomyCode) {
        segments.push(this.buildSegment('PRV', 'PE', 'PXC', tx.renderingProvider.taxonomyCode));
      }
    }

    // 2400 - Service Lines
    for (let i = 0; i < tx.serviceLines.length; i++) {
      const line = tx.serviceLines[i];
      segments.push(this.buildSegment('LX', String(line.lineNumber)));

      // SV1 - Professional Service
      const procedureCode = ['HC', line.procedureCode, ...(line.procedureModifiers || [])].join(this.componentSeparator);
      const diagPointers = line.diagnosisPointers.join(this.componentSeparator);
      segments.push(this.buildSegment(
        'SV1',
        procedureCode,
        line.chargeAmount.toFixed(2),
        line.unitType,
        String(line.units),
        line.placeOfService || '',
        '',
        diagPointers
      ));

      // DTP - Service Date
      if (line.serviceDateEnd && line.serviceDateEnd !== line.serviceDate) {
        segments.push(this.buildSegment('DTP', '472', 'RD8', `${line.serviceDate}-${line.serviceDateEnd}`));
      } else {
        segments.push(this.buildSegment('DTP', '472', 'D8', line.serviceDate));
      }

      // REF - Line Reference IDs
      if (line.referenceIds) {
        for (const ref of line.referenceIds) {
          segments.push(this.buildSegment('REF', ref.qualifier, ref.value));
        }
      }
    }

    // Trailer segments
    this.generateTrailer(tx.envelope, segments);
  }

  private generate837I(tx: X12_837I, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BHT - Beginning of Hierarchical Transaction
    segments.push(this.buildSegment('BHT', '0019', '00', tx.claimInformation.claimId, this.formatDate(new Date()), this.formatTime(new Date()), 'CH'));

    // 1000A - Submitter Name
    segments.push(this.buildSegment('NM1', '41', '2', tx.billingProvider.name, '', '', '', '', '46', tx.billingProvider.npi));

    // 1000B - Receiver Name
    segments.push(this.buildSegment('NM1', '40', '2', tx.payer.name, '', '', '', '', '46', tx.payer.payerId));

    // 2000A - Billing Provider Hierarchical Level
    segments.push(this.buildSegment('HL', '1', '', '20', '1'));

    // 2010AA - Billing Provider Name
    segments.push(this.buildSegment('NM1', '85', '2', tx.billingProvider.name, '', '', '', '', 'XX', tx.billingProvider.npi));
    segments.push(this.buildSegment('N3', tx.billingProvider.address.addressLine1));
    segments.push(this.buildSegment('N4', tx.billingProvider.address.city, tx.billingProvider.address.state, tx.billingProvider.address.postalCode));
    segments.push(this.buildSegment('REF', tx.billingProvider.taxIdQualifier, tx.billingProvider.taxId));

    // 2000B - Subscriber Hierarchical Level
    segments.push(this.buildSegment('HL', '2', '1', '22', '0'));
    segments.push(this.buildSegment('SBR', 'P', tx.subscriber.relationshipCode, tx.subscriber.groupNumber || '', '', '', '', '', '', 'CI'));

    // 2010BA - Subscriber Name
    segments.push(this.buildNM1Segment('IL', tx.subscriber.name, 'MI', tx.subscriber.memberId));
    if (tx.subscriber.dateOfBirth) {
      segments.push(this.buildSegment('DMG', 'D8', tx.subscriber.dateOfBirth, tx.subscriber.gender || 'U'));
    }

    // 2010BB - Payer Name
    segments.push(this.buildSegment('NM1', 'PR', '2', tx.payer.name, '', '', '', '', 'PI', tx.payer.payerId));

    // 2300 - Claim Information
    const facilityCode = [tx.facilityInfo.typeOfBill, 'A', tx.claimInformation.frequencyCode].join(this.componentSeparator);
    segments.push(this.buildSegment(
      'CLM',
      tx.claimInformation.claimId,
      tx.claimInformation.totalChargeAmount.toFixed(2),
      '',
      '',
      facilityCode,
      tx.claimInformation.providerSignatureOnFile ? 'Y' : 'N',
      tx.claimInformation.assignmentOfBenefits ? 'A' : 'B',
      tx.claimInformation.releaseOfInformation,
      'Y'
    ));

    // DTP - Admission/Discharge dates
    if (tx.facilityInfo.admissionDate) {
      segments.push(this.buildSegment('DTP', '435', 'D8', tx.facilityInfo.admissionDate));
    }
    if (tx.facilityInfo.dischargeDate) {
      segments.push(this.buildSegment('DTP', '096', 'D8', tx.facilityInfo.dischargeDate));
    }

    // CL1 - Institutional Claim Code
    segments.push(this.buildSegment(
      'CL1',
      tx.facilityInfo.admissionTypeCode || '',
      tx.facilityInfo.admissionSourceCode || '',
      tx.facilityInfo.patientStatusCode || ''
    ));

    // HI - Diagnosis Codes
    if (tx.diagnosisCodes.length > 0) {
      const diagElements = tx.diagnosisCodes.map((d, i) => {
        const qualifier = i === 0 ? 'ABK' : 'ABF';
        return `${qualifier}${this.componentSeparator}${d.code}`;
      });
      segments.push(this.buildSegment('HI', ...diagElements));
    }

    // 2310A - Attending Provider
    if (tx.attendingProvider) {
      segments.push(this.buildNM1Segment('71', tx.attendingProvider.name, 'XX', tx.attendingProvider.npi));
    }

    // 2400 - Service Lines
    for (const line of tx.serviceLines) {
      segments.push(this.buildSegment('LX', String(line.lineNumber)));

      // SV2 - Institutional Service
      const procedureCode = line.procedureCode
        ? ['HC', line.procedureCode].join(this.componentSeparator)
        : '';
      segments.push(this.buildSegment(
        'SV2',
        line.revenueCode,
        procedureCode,
        line.chargeAmount.toFixed(2),
        line.unitType,
        String(line.serviceUnits)
      ));

      // DTP - Service Date
      segments.push(this.buildSegment('DTP', '472', 'D8', line.serviceDate));
    }

    // Trailer segments
    this.generateTrailer(tx.envelope, segments);
  }

  private generate835(tx: X12_835, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BPR - Financial Information
    segments.push(this.buildSegment(
      'BPR',
      'I',
      tx.paymentAmount.toFixed(2),
      'C',
      tx.paymentMethod,
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
      tx.paymentDate
    ));

    // TRN - Reassociation Trace Number
    segments.push(this.buildSegment('TRN', '1', tx.checkOrEFTNumber || '0', '1' + tx.payerInfo.payerId));

    // DTM - Production Date
    segments.push(this.buildSegment('DTM', '405', tx.paymentDate));

    // 1000A - Payer Identification
    segments.push(this.buildSegment('N1', 'PR', tx.payerInfo.name));
    if (tx.payerInfo.address) {
      segments.push(this.buildSegment('N3', tx.payerInfo.address.addressLine1));
      segments.push(this.buildSegment('N4', tx.payerInfo.address.city, tx.payerInfo.address.state, tx.payerInfo.address.postalCode));
    }
    segments.push(this.buildSegment('REF', '2U', tx.payerInfo.payerId));

    // 1000B - Payee Identification
    segments.push(this.buildSegment('N1', 'PE', tx.payeeInfo.name, 'XX', tx.payeeInfo.npi));
    if (tx.payeeInfo.address) {
      segments.push(this.buildSegment('N3', tx.payeeInfo.address.addressLine1));
      segments.push(this.buildSegment('N4', tx.payeeInfo.address.city, tx.payeeInfo.address.state, tx.payeeInfo.address.postalCode));
    }
    if (tx.payeeInfo.taxId) {
      segments.push(this.buildSegment('REF', 'TJ', tx.payeeInfo.taxId));
    }

    // 2100 - Claim Payment Information
    for (const claim of tx.claimPayments) {
      segments.push(this.buildSegment(
        'CLP',
        claim.claimId,
        claim.claimStatus,
        claim.totalClaimChargeAmount.toFixed(2),
        claim.totalClaimPaymentAmount.toFixed(2),
        (claim.patientResponsibilityAmount || 0).toFixed(2),
        claim.claimFilingIndicator || 'MC',
        claim.payerClaimControlNumber || ''
      ));

      // NM1 - Patient Name
      if (claim.patientName) {
        segments.push(this.buildNM1Segment('QC', claim.patientName, 'MI', ''));
      }

      // 2110 - Service Payment Information
      for (const service of claim.serviceLines) {
        const procedureCode = ['HC', service.procedureCode, ...(service.procedureModifiers || [])].join(this.componentSeparator);
        segments.push(this.buildSegment(
          'SVC',
          procedureCode,
          service.chargeAmount.toFixed(2),
          service.paidAmount.toFixed(2),
          service.revenueCode || '',
          String(service.units || 1)
        ));

        // DTM - Service Date
        if (service.serviceDate) {
          segments.push(this.buildSegment('DTM', '472', service.serviceDate));
        }

        // CAS - Claim Adjustment
        if (service.adjustments) {
          for (const adj of service.adjustments) {
            segments.push(this.buildSegment('CAS', adj.groupCode, adj.reasonCode, adj.amount.toFixed(2)));
          }
        }

        // AMT - Allowed Amount
        if (service.allowedAmount !== undefined) {
          segments.push(this.buildSegment('AMT', 'B6', service.allowedAmount.toFixed(2)));
        }
      }
    }

    // PLB - Provider Level Adjustment (if any)
    // Generate trailer
    this.generateTrailer(tx.envelope, segments);
  }

  private generate270(tx: X12_270, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BHT - Beginning of Hierarchical Transaction
    segments.push(this.buildSegment('BHT', '0022', '13', tx.envelope.st.transactionSetControlNumber, this.formatDate(new Date()), this.formatTime(new Date())));

    // 2000A - Information Source Level
    segments.push(this.buildSegment('HL', '1', '', '20', '1'));

    // 2100A - Information Source Name
    segments.push(this.buildSegment('NM1', 'PR', '2', tx.informationSource.name, '', '', '', '', 'PI', tx.informationSource.payerId));

    // 2000B - Information Receiver Level
    segments.push(this.buildSegment('HL', '2', '1', '21', '1'));

    // 2100B - Information Receiver Name
    segments.push(this.buildSegment('NM1', '1P', '2', tx.informationReceiver.name, '', '', '', '', 'XX', tx.informationReceiver.npi));

    // 2000C - Subscriber Level
    segments.push(this.buildSegment('HL', '3', '2', '22', tx.dependent ? '1' : '0'));
    segments.push(this.buildSegment('TRN', '1', tx.envelope.st.transactionSetControlNumber, '9' + tx.informationReceiver.npi));

    // 2100C - Subscriber Name
    segments.push(this.buildNM1Segment('IL', tx.subscriber.name, 'MI', tx.subscriber.memberId));
    if (tx.subscriber.dateOfBirth) {
      segments.push(this.buildSegment('DMG', 'D8', tx.subscriber.dateOfBirth, tx.subscriber.gender || 'U'));
    }

    // 2000D - Dependent Level (if applicable)
    if (tx.dependent) {
      segments.push(this.buildSegment('HL', '4', '3', '23', '0'));

      // 2100D - Dependent Name
      segments.push(this.buildNM1Segment('03', tx.dependent.name, '', ''));
      if (tx.dependent.dateOfBirth) {
        segments.push(this.buildSegment('DMG', 'D8', tx.dependent.dateOfBirth, tx.dependent.gender || 'U'));
      }
    }

    // 2110C/D - Eligibility/Benefit Inquiry
    for (const inquiry of tx.eligibilityInquiries) {
      segments.push(this.buildSegment('EQ', inquiry.serviceTypeCode, '', inquiry.procedureCode || ''));
      if (inquiry.serviceDate) {
        segments.push(this.buildSegment('DTP', '291', 'D8', inquiry.serviceDate));
      } else if (inquiry.serviceDateRange) {
        segments.push(this.buildSegment('DTP', '291', 'RD8', `${inquiry.serviceDateRange.fromDate}-${inquiry.serviceDateRange.toDate}`));
      }
    }

    // Trailer
    this.generateTrailer(tx.envelope, segments);
  }

  private generate271(tx: X12_271, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BHT - Beginning of Hierarchical Transaction
    segments.push(this.buildSegment('BHT', '0022', '11', tx.envelope.st.transactionSetControlNumber, this.formatDate(new Date()), this.formatTime(new Date())));

    // 2000A - Information Source Level
    segments.push(this.buildSegment('HL', '1', '', '20', '1'));

    // 2100A - Information Source Name
    segments.push(this.buildSegment('NM1', 'PR', '2', tx.informationSource.name, '', '', '', '', 'PI', tx.informationSource.payerId));

    // 2000B - Information Receiver Level
    segments.push(this.buildSegment('HL', '2', '1', '21', '1'));

    // 2100B - Information Receiver Name
    segments.push(this.buildSegment('NM1', '1P', '2', tx.informationReceiver.name, '', '', '', '', 'XX', tx.informationReceiver.npi));

    // 2000C - Subscriber Level
    segments.push(this.buildSegment('HL', '3', '2', '22', tx.dependent ? '1' : '0'));
    segments.push(this.buildSegment('TRN', '2', tx.envelope.st.transactionSetControlNumber, '9' + tx.informationReceiver.npi));

    // 2100C - Subscriber Name
    segments.push(this.buildNM1Segment('IL', tx.subscriber.name, 'MI', tx.subscriber.memberId));
    if (tx.subscriber.dateOfBirth) {
      segments.push(this.buildSegment('DMG', 'D8', tx.subscriber.dateOfBirth, tx.subscriber.gender || 'U'));
    }
    if (tx.subscriber.subscriberDates) {
      for (const date of tx.subscriber.subscriberDates) {
        segments.push(this.buildSegment('DTP', date.qualifier, 'D8', date.date));
      }
    }

    // 2110C - Subscriber Eligibility/Benefit Information
    for (const benefit of tx.subscriber.eligibilityBenefits) {
      segments.push(this.buildSegment(
        'EB',
        benefit.informationStatusCode,
        benefit.benefitCoverageLevel || '',
        benefit.serviceTypeCode,
        benefit.insuranceTypeCode || '',
        benefit.planCoverageDescription || '',
        benefit.timePeriodQualifier || '',
        benefit.monetaryAmount !== undefined ? benefit.monetaryAmount.toFixed(2) : '',
        benefit.percent !== undefined ? benefit.percent.toString() : ''
      ));

      if (benefit.dateRange) {
        segments.push(this.buildSegment('DTP', '307', 'RD8', `${benefit.dateRange.fromDate}-${benefit.dateRange.toDate}`));
      }

      if (benefit.additionalInfo) {
        for (const info of benefit.additionalInfo) {
          segments.push(this.buildSegment('MSG', info));
        }
      }
    }

    // Trailer
    this.generateTrailer(tx.envelope, segments);
  }

  private generate276(tx: X12_276, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BHT - Beginning of Hierarchical Transaction
    segments.push(this.buildSegment('BHT', '0010', '13', tx.envelope.st.transactionSetControlNumber, this.formatDate(new Date()), this.formatTime(new Date())));

    // 2000A - Information Source Level
    segments.push(this.buildSegment('HL', '1', '', '20', '1'));

    // 2100A - Payer Name
    segments.push(this.buildSegment('NM1', 'PR', '2', tx.informationSource.name, '', '', '', '', 'PI', tx.informationSource.payerId));

    // 2000B - Information Receiver Level
    segments.push(this.buildSegment('HL', '2', '1', '21', '1'));

    // 2100B - Information Receiver Name
    segments.push(this.buildSegment('NM1', '41', '2', tx.informationReceiver.name, '', '', '', '', 'XX', tx.informationReceiver.npi));

    // 2000C - Service Provider Level
    if (tx.serviceProvider) {
      segments.push(this.buildSegment('HL', '3', '2', '19', '1'));
      segments.push(this.buildSegment('NM1', '1P', '2', tx.serviceProvider.name, '', '', '', '', 'XX', tx.serviceProvider.npi));
    }

    // 2000D - Subscriber Level
    const subscriberLevel = tx.serviceProvider ? '4' : '3';
    const subscriberParent = tx.serviceProvider ? '3' : '2';
    segments.push(this.buildSegment('HL', subscriberLevel, subscriberParent, '22', tx.dependent ? '1' : '0'));

    // 2100D - Subscriber Name
    segments.push(this.buildNM1Segment('IL', tx.subscriber.name, 'MI', tx.subscriber.memberId));

    // 2000E - Dependent Level (if applicable)
    if (tx.dependent) {
      segments.push(this.buildSegment('HL', '5', subscriberLevel, '23', '0'));
      segments.push(this.buildNM1Segment('QC', tx.dependent.name, '', ''));
    }

    // 2200D/E - Claim Status Inquiries
    for (const inquiry of tx.claimStatusInquiries) {
      segments.push(this.buildSegment('TRN', '1', inquiry.claimId, '9' + tx.informationReceiver.npi));
      segments.push(this.buildSegment('REF', 'BLT', inquiry.claimId));

      if (inquiry.claimSubmissionDate) {
        segments.push(this.buildSegment('DTP', '472', 'D8', inquiry.claimSubmissionDate));
      }
    }

    // Trailer
    this.generateTrailer(tx.envelope, segments);
  }

  private generate277(tx: X12_277, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BHT - Beginning of Hierarchical Transaction
    segments.push(this.buildSegment('BHT', '0010', '08', tx.envelope.st.transactionSetControlNumber, this.formatDate(new Date()), this.formatTime(new Date())));

    // 2000A - Information Source Level
    segments.push(this.buildSegment('HL', '1', '', '20', '1'));

    // 2100A - Payer Name
    segments.push(this.buildSegment('NM1', 'PR', '2', tx.informationSource.name, '', '', '', '', 'PI', tx.informationSource.payerId));

    // 2000B - Information Receiver Level
    segments.push(this.buildSegment('HL', '2', '1', '21', '1'));

    // 2100B - Information Receiver Name
    segments.push(this.buildSegment('NM1', '41', '2', tx.informationReceiver.name, '', '', '', '', 'XX', tx.informationReceiver.npi));

    // 2000C - Billing Provider Level
    if (tx.serviceProvider) {
      segments.push(this.buildSegment('HL', '3', '2', '19', '1'));
      segments.push(this.buildSegment('NM1', '85', '2', tx.serviceProvider.name, '', '', '', '', 'XX', tx.serviceProvider.npi));
    }

    // 2000D - Subscriber Level
    const subscriberLevel = tx.serviceProvider ? '4' : '3';
    const subscriberParent = tx.serviceProvider ? '3' : '2';
    segments.push(this.buildSegment('HL', subscriberLevel, subscriberParent, '22', tx.dependent ? '1' : '0'));

    // 2100D - Subscriber Name
    segments.push(this.buildNM1Segment('IL', tx.subscriber.name, 'MI', tx.subscriber.memberId));

    // 2200D - Claim Status
    for (const status of tx.claimStatuses) {
      segments.push(this.buildSegment('TRN', '2', status.claimId, '9' + tx.informationReceiver.npi));

      const statusInfo = [status.claimStatusCategoryCode, status.claimStatusCode, '', ''].join(this.componentSeparator);
      segments.push(this.buildSegment('STC', statusInfo, status.effectiveDate || '', '', status.claimId));

      if (status.totalClaimChargeAmount !== undefined) {
        segments.push(this.buildSegment('QTY', 'QA', String(status.totalClaimChargeAmount)));
      }

      if (status.totalClaimPaymentAmount !== undefined) {
        segments.push(this.buildSegment('AMT', 'YU', status.totalClaimPaymentAmount.toFixed(2)));
      }
    }

    // Trailer
    this.generateTrailer(tx.envelope, segments);
  }

  private generate278(tx: X12_278, segments: string[]): void {
    // Envelope
    this.generateEnvelope(tx.envelope, segments);

    // BHT - Beginning of Hierarchical Transaction
    const bhtCode = tx.actionCode === 'AR' ? '11' : '13';
    segments.push(this.buildSegment('BHT', '0007', bhtCode, tx.envelope.st.transactionSetControlNumber, this.formatDate(new Date()), this.formatTime(new Date())));

    // 2000A - Utilization Management Organization (UMO) Level
    segments.push(this.buildSegment('HL', '1', '', '20', '1'));

    // 2010A - UMO Name
    segments.push(this.buildSegment('NM1', 'X3', '2', tx.umoInfo.name, '', '', '', '', 'PI', tx.umoInfo.payerId));

    // 2000B - Requester Level
    segments.push(this.buildSegment('HL', '2', '1', '21', '1'));

    // 2010B - Requester Name
    segments.push(this.buildSegment('NM1', '1P', '2', tx.requesterInfo.name, '', '', '', '', 'XX', tx.requesterInfo.npi));
    if (tx.requesterInfo.contactPhone) {
      segments.push(this.buildSegment('PER', 'IC', tx.requesterInfo.contactName || '', 'TE', tx.requesterInfo.contactPhone));
    }

    // 2000C - Subscriber Level
    segments.push(this.buildSegment('HL', '3', '2', '22', tx.dependent ? '1' : '0'));

    // 2010C - Subscriber Name
    segments.push(this.buildNM1Segment('IL', tx.subscriber.name, 'MI', tx.subscriber.memberId));
    if (tx.subscriber.dateOfBirth) {
      segments.push(this.buildSegment('DMG', 'D8', tx.subscriber.dateOfBirth, tx.subscriber.gender || 'U'));
    }

    // 2000D - Dependent Level (if applicable)
    if (tx.dependent) {
      segments.push(this.buildSegment('HL', '4', '3', '23', '0'));
      segments.push(this.buildNM1Segment('QC', tx.dependent.name, '', ''));
      if (tx.dependent.dateOfBirth) {
        segments.push(this.buildSegment('DMG', 'D8', tx.dependent.dateOfBirth, tx.dependent.gender || 'U'));
      }
    }

    // 2000E - Patient Event Level
    const eventLevel = tx.dependent ? '5' : '4';
    const eventParent = tx.dependent ? '4' : '3';
    segments.push(this.buildSegment('HL', eventLevel, eventParent, 'EV', '1'));

    // 2010E - Patient Event Provider Name
    if (tx.attendingProvider) {
      segments.push(this.buildNM1Segment('71', tx.attendingProvider.name, 'XX', tx.attendingProvider.npi));
    }

    // TRN - Trace Number
    segments.push(this.buildSegment('TRN', '1', tx.envelope.st.transactionSetControlNumber, '9' + tx.requesterInfo.npi));

    // UM - Health Care Services Review Information
    segments.push(this.buildSegment('UM', '01', tx.serviceInfo[0]?.serviceTypeCode || 'HS', ''));

    // DTP - Event Date
    segments.push(this.buildSegment('DTP', '472', 'D8', tx.patientEvent.eventDate));

    // Certification Info (for responses)
    if (tx.certificationInfo) {
      if (tx.certificationInfo.certificationNumber) {
        segments.push(this.buildSegment('REF', 'BB', tx.certificationInfo.certificationNumber));
      }
      if (tx.certificationInfo.certificationEffectiveDate) {
        segments.push(this.buildSegment('DTP', '007', 'D8', tx.certificationInfo.certificationEffectiveDate));
      }
      if (tx.certificationInfo.certificationExpirationDate) {
        segments.push(this.buildSegment('DTP', '036', 'D8', tx.certificationInfo.certificationExpirationDate));
      }
    }

    // 2000F - Service Level
    for (const service of tx.serviceInfo) {
      segments.push(this.buildSegment('HL', String(parseInt(eventLevel) + 1), eventLevel, 'SS', '0'));

      // SV1/SV2 - Service Information
      if (service.procedureCode) {
        const procedureCode = ['HC', service.procedureCode, ...(service.procedureModifiers || [])].join(this.componentSeparator);
        segments.push(this.buildSegment('SV1', procedureCode, '', '', String(service.serviceQuantity || 1)));
      }
    }

    // Trailer
    this.generateTrailer(tx.envelope, segments);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private generateEnvelope(envelope: X12Envelope, segments: string[]): void {
    // ISA Segment - always exactly 106 characters
    const isaElements = [
      envelope.isa.authorizationQualifier,
      this.padRight(envelope.isa.authorizationInfo, 10),
      envelope.isa.securityQualifier,
      this.padRight(envelope.isa.securityInfo, 10),
      envelope.isa.senderIdQualifier,
      this.padRight(envelope.isa.senderId, 15),
      envelope.isa.receiverIdQualifier,
      this.padRight(envelope.isa.receiverId, 15),
      envelope.isa.date,
      envelope.isa.time,
      envelope.isa.repetitionSeparator,
      envelope.isa.versionNumber,
      this.padLeft(envelope.isa.controlNumber, 9, '0'),
      envelope.isa.acknowledgmentRequested,
      envelope.isa.usageIndicator,
      envelope.isa.componentSeparator,
    ];
    segments.push('ISA' + this.elementSeparator + isaElements.join(this.elementSeparator));

    // GS Segment
    segments.push(this.buildSegment(
      'GS',
      envelope.gs.functionalIdCode,
      envelope.gs.applicationSenderCode,
      envelope.gs.applicationReceiverCode,
      envelope.gs.date,
      envelope.gs.time,
      envelope.gs.groupControlNumber,
      envelope.gs.responsibleAgencyCode,
      envelope.gs.versionCode
    ));

    // ST Segment
    const stElements = [
      envelope.st.transactionSetIdCode,
      envelope.st.transactionSetControlNumber,
    ];
    if (envelope.st.implementationConventionReference) {
      stElements.push(envelope.st.implementationConventionReference);
    }
    segments.push('ST' + this.elementSeparator + stElements.join(this.elementSeparator));
  }

  private generateTrailer(envelope: X12Envelope, segments: string[]): void {
    // Count segments (including SE but not including ISA, GS, GE, IEA)
    const segmentCount = segments.length - 1; // Subtract ISA and GS, add SE

    // SE Segment
    segments.push(this.buildSegment('SE', String(segmentCount), envelope.st.transactionSetControlNumber));

    // GE Segment
    segments.push(this.buildSegment('GE', '1', envelope.gs.groupControlNumber));

    // IEA Segment
    segments.push(this.buildSegment('IEA', '1', this.padLeft(envelope.isa.controlNumber, 9, '0')));
  }

  private buildSegment(segmentId: string, ...elements: string[]): string {
    const filteredElements = elements.map(e => e ?? '');
    return segmentId + this.elementSeparator + filteredElements.join(this.elementSeparator);
  }

  private buildNM1Segment(entityCode: string, name: X12Name, idQualifier: string, id: string): string {
    return this.buildSegment(
      'NM1',
      entityCode,
      name.entityType,
      name.lastName,
      name.firstName || '',
      name.middleName || '',
      name.prefix || '',
      name.suffix || '',
      idQualifier,
      id
    );
  }

  private formatDate(date: Date, format: 'CCYYMMDD' | 'YYMMDD' = 'CCYYMMDD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (format === 'YYMMDD') {
      return String(year).slice(-2) + month + day;
    }
    return String(year) + month + day;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return hours + minutes;
  }

  private padRight(str: string, length: number, char: string = ' '): string {
    return str.padEnd(length, char).slice(0, length);
  }

  private padLeft(str: string, length: number, char: string = '0'): string {
    return str.padStart(length, char).slice(-length);
  }
}

// Export a default generator instance
export const x12Generator = new X12Generator();
