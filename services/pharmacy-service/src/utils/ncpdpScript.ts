/**
 * NCPDP SCRIPT Utility Functions
 * NCPDP SCRIPT is the standard for electronic prescriptions in the United States
 * Version 2017071 is the current version
 */

export interface NCPDPMessage {
  version: string;
  messageType: string;
  messageId: string;
  timestamp: string;
  sender: any;
  receiver: any;
  patient: any;
  prescriber?: any;
  pharmacy?: any;
  medication?: any;
  prescription?: any;
}

export class NCPDPScriptUtil {
  /**
   * Generate NEWRX message (New Prescription)
   */
  static generateNEWRX(data: {
    messageId: string;
    patient: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
      address: any;
      phone?: string;
    };
    prescriber: {
      npi: string;
      deaNumber?: string;
      firstName: string;
      lastName: string;
      phone: string;
      address: any;
    };
    pharmacy: {
      ncpdpId: string;
      name: string;
      phone: string;
      address: any;
    };
    medication: {
      drugDescription: string;
      drugCoded?: string; // RxNorm or NDC
      quantity: number;
      daysSupply: number;
      refills: number;
      directions: string;
      note?: string;
      writtenDate: string;
    };
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'NEWRX',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.prescriber,
      receiver: data.pharmacy,
      patient: data.patient,
      prescriber: data.prescriber,
      pharmacy: data.pharmacy,
      medication: data.medication,
      prescription: {
        writtenDate: data.medication.writtenDate,
        effectiveDate: new Date().toISOString().split('T')[0],
      },
    };
  }

  /**
   * Generate RXFILL message (Prescription Fill Notification)
   */
  static generateRXFILL(data: {
    messageId: string;
    prescriptionNumber: string;
    fillNumber: number;
    fillDate: string;
    quantityDispensed: number;
    daysSupply: number;
    pharmacist: {
      firstName: string;
      lastName: string;
      npi?: string;
    };
    pharmacy: any;
    patient: any;
    medication: any;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'RXFILL',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.pharmacy,
      receiver: data.pharmacist,
      patient: data.patient,
      medication: {
        ...data.medication,
        quantityDispensed: data.quantityDispensed,
        daysSupply: data.daysSupply,
      },
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        fillNumber: data.fillNumber,
        fillDate: data.fillDate,
      },
    };
  }

  /**
   * Generate REFRES message (Refill Request)
   */
  static generateREFRES(data: {
    messageId: string;
    prescriptionNumber: string;
    patient: any;
    medication: any;
    pharmacy: any;
    requestedRefillDate?: string;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'REFRES',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.pharmacy,
      receiver: { type: 'prescriber' },
      patient: data.patient,
      medication: data.medication,
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        requestedRefillDate: data.requestedRefillDate || new Date().toISOString().split('T')[0],
      },
    };
  }

  /**
   * Generate REFRESP message (Refill Response)
   */
  static generateREFRESP(data: {
    messageId: string;
    originalMessageId: string;
    prescriptionNumber: string;
    approved: boolean;
    denialReason?: string;
    newRefillsAuthorized?: number;
    prescriber: any;
    patient: any;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'REFRESP',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.prescriber,
      receiver: { type: 'pharmacy' },
      patient: data.patient,
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        originalMessageId: data.originalMessageId,
        approved: data.approved,
        denialReason: data.denialReason,
        newRefillsAuthorized: data.newRefillsAuthorized,
      },
    };
  }

  /**
   * Generate RXCHG message (Prescription Change Request)
   */
  static generateRXCHG(data: {
    messageId: string;
    prescriptionNumber: string;
    changeRequest: {
      type: string; // 'quantity', 'medication', 'directions', etc.
      requestedChange: string;
      reason: string;
    };
    pharmacy: any;
    patient: any;
    medication: any;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'RXCHG',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.pharmacy,
      receiver: { type: 'prescriber' },
      patient: data.patient,
      medication: data.medication,
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        changeRequest: data.changeRequest,
      },
    };
  }

  /**
   * Generate CHGRES message (Change Response)
   */
  static generateCHGRES(data: {
    messageId: string;
    originalMessageId: string;
    prescriptionNumber: string;
    approved: boolean;
    denialReason?: string;
    approvedChange?: any;
    prescriber: any;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'CHGRES',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.prescriber,
      receiver: { type: 'pharmacy' },
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        originalMessageId: data.originalMessageId,
        approved: data.approved,
        denialReason: data.denialReason,
        approvedChange: data.approvedChange,
      },
    };
  }

  /**
   * Generate CANRX message (Cancel Prescription)
   */
  static generateCANRX(data: {
    messageId: string;
    prescriptionNumber: string;
    reason: string;
    prescriber: any;
    pharmacy: any;
    patient: any;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'CANRX',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.prescriber,
      receiver: data.pharmacy,
      patient: data.patient,
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        cancellationReason: data.reason,
      },
    };
  }

  /**
   * Generate CANRES message (Cancel Response)
   */
  static generateCANRES(data: {
    messageId: string;
    originalMessageId: string;
    prescriptionNumber: string;
    approved: boolean;
    denialReason?: string;
    pharmacy: any;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'CANRES',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.pharmacy,
      receiver: { type: 'prescriber' },
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        originalMessageId: data.originalMessageId,
        approved: data.approved,
        denialReason: data.denialReason,
      },
    };
  }

  /**
   * Generate STATUS message (Status notification)
   */
  static generateSTATUS(data: {
    messageId: string;
    prescriptionNumber: string;
    status: string;
    statusDate: string;
    pharmacy: any;
    prescriber: any;
  }): NCPDPMessage {
    return {
      version: '2017071',
      messageType: 'STATUS',
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sender: data.pharmacy,
      receiver: data.prescriber,
      prescription: {
        prescriptionNumber: data.prescriptionNumber,
        status: data.status,
        statusDate: data.statusDate,
      },
    };
  }

  /**
   * Validate NCPDP message structure
   */
  static validateMessage(message: NCPDPMessage): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!message.version) {
      errors.push('Missing version');
    }

    if (!message.messageType) {
      errors.push('Missing message type');
    }

    if (!message.messageId) {
      errors.push('Missing message ID');
    }

    if (!message.timestamp) {
      errors.push('Missing timestamp');
    }

    // Message-type specific validation
    if (message.messageType === 'NEWRX') {
      if (!message.patient) errors.push('Missing patient information');
      if (!message.prescriber) errors.push('Missing prescriber information');
      if (!message.medication) errors.push('Missing medication information');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Parse NCPDP message (simplified)
   */
  static parseMessage(messageString: string): NCPDPMessage | null {
    try {
      // In production, this would parse actual NCPDP XML or JSON format
      const message = JSON.parse(messageString);
      return message as NCPDPMessage;
    } catch (error) {
      return null;
    }
  }

  /**
   * Serialize NCPDP message to string
   */
  static serializeMessage(message: NCPDPMessage): string {
    // In production, this would serialize to NCPDP XML format
    // For now, return JSON
    return JSON.stringify(message, null, 2);
  }

  /**
   * Generate unique message ID
   */
  static generateMessageId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `MSG-${timestamp}-${random}`.toUpperCase();
  }
}
